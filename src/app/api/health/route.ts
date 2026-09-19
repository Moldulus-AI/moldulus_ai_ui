import { OLLAMA_URL, OLLAMA_MODEL, OLLAMA_VISION_MODEL } from "@/lib/ollama"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/health -> tells the UI (and you, via curl) whether the AI engine is usable.
export async function GET() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(4000) })
    if (!res.ok) throw new Error(`Ollama responded ${res.status}`)
    const data: { models?: { name: string }[] } = await res.json()
    const installed = (data.models ?? []).map((m) => m.name)
    const has = (name: string) => installed.some((n) => n === name || n === `${name}:latest`)

    return Response.json({
      ok: has(OLLAMA_MODEL),
      ollama: "running",
      model: OLLAMA_MODEL,
      modelInstalled: has(OLLAMA_MODEL),
      vision: OLLAMA_VISION_MODEL ? { model: OLLAMA_VISION_MODEL, installed: has(OLLAMA_VISION_MODEL) } : null,
    })
  } catch {
    return Response.json(
      { ok: false, ollama: "unreachable", model: OLLAMA_MODEL, modelInstalled: false, vision: null },
      { status: 503 },
    )
  }
}
