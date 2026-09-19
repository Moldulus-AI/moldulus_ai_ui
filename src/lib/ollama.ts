// Server-only helpers for talking to Ollama. Never import this from a client component.

export const OLLAMA_URL = (process.env.OLLAMA_URL ?? "http://127.0.0.1:11434").replace(/\/$/, "")
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen3.5:9b"
export const OLLAMA_VISION_MODEL = process.env.OLLAMA_VISION_MODEL?.trim() || ""
export const OLLAMA_KEEP_ALIVE = process.env.OLLAMA_KEEP_ALIVE ?? "30m"

export const NUM_CTX = Number(process.env.OLLAMA_NUM_CTX ?? 8192)
export const TEMPERATURE = Number(process.env.OLLAMA_TEMPERATURE ?? 0.6)

/** undefined => don't send the `think` field at all (needed for models without thinking support). */
export const THINK: boolean | undefined =
  process.env.OLLAMA_THINK === undefined || process.env.OLLAMA_THINK === ""
    ? undefined
    : process.env.OLLAMA_THINK.toLowerCase() === "true"
