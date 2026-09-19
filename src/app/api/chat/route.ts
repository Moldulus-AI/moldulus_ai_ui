import {
  OLLAMA_URL,
  OLLAMA_MODEL,
  OLLAMA_VISION_MODEL,
  OLLAMA_KEEP_ALIVE,
  NUM_CTX,
  TEMPERATURE,
  THINK,
} from "@/lib/ollama"
import { isValidDomain, systemPromptFor } from "@/lib/prompts"
import { rateLimit } from "@/lib/rateLimit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_MESSAGES = 24 // history sent to the model
const MAX_CHARS_PER_MESSAGE = 30_000
const MAX_IMAGES_PER_MESSAGE = 4
const MAX_IMAGE_B64_CHARS = 8_000_000 // ~6 MB image

type ChatMessage = { role: "user" | "assistant"; content: string; images?: string[] }

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  })
}

function clientIp(req: Request) {
  // nginx sets X-Forwarded-For / X-Real-IP (see deploy/nginx-moldulus.conf)
  const xff = req.headers.get("x-forwarded-for")
  return (xff?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "local").trim()
}

function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const out: ChatMessage[] = []
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null
    const msg: ChatMessage = { role: m.role, content: m.content.slice(0, MAX_CHARS_PER_MESSAGE) }
    if (Array.isArray(m.images) && m.images.length) {
      msg.images = m.images
        .filter((i: unknown): i is string => typeof i === "string" && i.length < MAX_IMAGE_B64_CHARS)
        .slice(0, MAX_IMAGES_PER_MESSAGE)
    }
    out.push(msg)
  }
  // Must end with a user turn
  return out[out.length - 1].role === "user" ? out : null
}

export async function POST(req: Request) {
  const limit = rateLimit(clientIp(req), Number(process.env.RATE_LIMIT_PER_MIN ?? 20))
  if (!limit.ok) {
    return json(
      { error: `Too many requests. Try again in ${limit.retryAfter}s.` },
      429,
      { "Retry-After": String(limit.retryAfter) },
    )
  }

  let body: { domain?: unknown; messages?: unknown }
  try {
    body = await req.json()
  } catch {
    return json({ error: "Invalid JSON body." }, 400)
  }

  const domain = isValidDomain(body.domain) ? body.domain : "build"
  const messages = parseMessages(body.messages)
  if (!messages) return json({ error: "A conversation ending with a user message is required." }, 400)

  const hasImages = messages.some((m) => m.images?.length)
  if (hasImages && !OLLAMA_VISION_MODEL) {
    return json(
      { error: "Image attachments are not enabled on this server. Attach a text file or describe the image instead." },
      400,
    )
  }
  const model = hasImages ? OLLAMA_VISION_MODEL : OLLAMA_MODEL

  const payload: Record<string, unknown> = {
    model,
    stream: true,
    keep_alive: OLLAMA_KEEP_ALIVE,
    options: { num_ctx: NUM_CTX, temperature: TEMPERATURE },
    messages: [{ role: "system", content: systemPromptFor(domain) }, ...messages],
  }
  if (THINK !== undefined) payload.think = THINK

  let upstream: Response
  try {
    upstream = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: req.signal, // user pressed Stop / closed the tab -> cancel generation on the GPU
    })
  } catch (err) {
    if (req.signal.aborted) return new Response(null, { status: 499 })
    console.error("[chat] cannot reach Ollama:", err)
    return json({ error: "The AI engine is not reachable. Check that Ollama is running on the server." }, 503)
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "")
    console.error("[chat] Ollama error", upstream.status, detail)
    if (upstream.status === 404) {
      return json({ error: `Model "${model}" is not installed. Run: ollama pull ${model}` }, 502)
    }
    let msg = "The AI engine returned an error."
    try {
      msg = JSON.parse(detail).error ?? msg
    } catch {}
    return json({ error: msg }, 502)
  }

  // Ollama streams newline-delimited JSON. Convert to a plain text stream of tokens.
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  const reader = upstream.body.getReader()
  let buffer = ""

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          return
        }
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""
        for (const line of lines) {
          if (!line.trim()) continue
          const chunk = JSON.parse(line)
          if (chunk.error) {
            controller.enqueue(encoder.encode(`\n\n[Error: ${chunk.error}]`))
            controller.close()
            return
          }
          // chunk.message.thinking (reasoning) is intentionally not forwarded
          const text: string | undefined = chunk.message?.content
          if (text) controller.enqueue(encoder.encode(text))
        }
      } catch (err) {
        controller.error(err)
      }
    },
    cancel() {
      reader.cancel().catch(() => {})
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no", // tell nginx not to buffer the stream
    },
  })
}
