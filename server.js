const { spawn } = require("child_process");

const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";

const nextProcess = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "start", "--hostname", hostname, "--port", String(port)],
  {
    cwd: __dirname,
    env: {
      ...process.env,
      PORT: String(port),
      HOSTNAME: hostname,
    },
    stdio: "inherit",
  }
);

nextProcess.on("close", (code) => {
  process.exit(code ?? 0);
});

process.on("SIGTERM", () => {
  nextProcess.kill("SIGTERM");
});

process.on("SIGINT", () => {
  nextProcess.kill("SIGINT");
});