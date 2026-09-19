#!/usr/bin/env bash
# One-shot installer for Ubuntu 22.04 / 24.04.
# Run from the project folder on the server:
#   sudo MODEL=qwen3.5:9b DOMAIN=ai.example.com bash deploy/setup-ubuntu.sh
# DOMAIN is optional (defaults to answering on the server's IP).
set -euo pipefail

MODEL="${MODEL:-qwen3.5:9b}"
DOMAIN="${DOMAIN:-_}"
APP_DIR="/opt/moldulus"
APP_USER="moldulus"
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

[ "$(id -u)" -eq 0 ] || { echo "Run with sudo."; exit 1; }
log() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }

log "1/8 System packages"
apt-get update -y
apt-get install -y curl ca-certificates git nginx rsync

log "2/8 Ollama"
if ! command -v ollama >/dev/null; then
  curl -fsSL https://ollama.com/install.sh | sh
fi
mkdir -p /etc/systemd/system/ollama.service.d
cat > /etc/systemd/system/ollama.service.d/override.conf <<OVR
[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"
Environment="OLLAMA_KEEP_ALIVE=30m"
Environment="OLLAMA_FLASH_ATTENTION=1"
OVR
systemctl daemon-reload
systemctl enable --now ollama
systemctl restart ollama

log "3/8 Waiting for Ollama API"
for i in $(seq 1 60); do curl -sf http://127.0.0.1:11434/api/tags >/dev/null && break; sleep 1; done
curl -sf http://127.0.0.1:11434/api/tags >/dev/null || { echo "Ollama did not start: journalctl -u ollama -n 50"; exit 1; }

log "4/8 Downloading model: $MODEL (several GB, be patient)"
ollama pull "$MODEL"

log "5/8 Node.js 22"
NODE_MAJOR=0
command -v node >/dev/null && NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

log "6/8 App files -> $APP_DIR"
id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /usr/sbin/nologin "$APP_USER"
mkdir -p "$APP_DIR"
rsync -a --delete --exclude node_modules --exclude .next --exclude .git --exclude .env.production "$SRC_DIR"/ "$APP_DIR"/
if [ ! -f "$APP_DIR/.env.production" ]; then
  cp "$APP_DIR/.env.example" "$APP_DIR/.env.production"
  sed -i "s|^OLLAMA_MODEL=.*|OLLAMA_MODEL=$MODEL|" "$APP_DIR/.env.production"
  # qwen3.5 is multimodal; for other models disable image attachments
  case "$MODEL" in
    qwen3.5*|qwen3-vl*|qwen2.5vl*|gemma3*|gemma4*) sed -i "s|^OLLAMA_VISION_MODEL=.*|OLLAMA_VISION_MODEL=$MODEL|" "$APP_DIR/.env.production" ;;
    *) sed -i "s|^OLLAMA_VISION_MODEL=.*|OLLAMA_VISION_MODEL=|" "$APP_DIR/.env.production" ;;
  esac
fi
chown -R "$APP_USER":"$APP_USER" "$APP_DIR"
chmod 640 "$APP_DIR/.env.production"

log "7/8 Build"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && npm ci && npm run build"

cp "$APP_DIR/deploy/moldulus.service" /etc/systemd/system/moldulus.service
systemctl daemon-reload
systemctl enable --now moldulus
systemctl restart moldulus

log "8/8 nginx"
sed "s|YOUR_DOMAIN|$DOMAIN|" "$APP_DIR/deploy/nginx-moldulus.conf" > /etc/nginx/sites-available/moldulus
ln -sf /etc/nginx/sites-available/moldulus /etc/nginx/sites-enabled/moldulus
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

sleep 3
log "Health check"
curl -s http://127.0.0.1:3000/api/health || true
echo
echo
echo "Done. Open http://${DOMAIN/_/<server-ip>}/app"
echo "Add HTTPS:  sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx -d $DOMAIN"
echo "Logs:       journalctl -u moldulus -f      journalctl -u ollama -f"
