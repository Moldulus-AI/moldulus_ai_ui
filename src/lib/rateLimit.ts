// Tiny in-memory sliding-window limiter. Fine for a single Node process (one server).
// If you later run several instances, move this to Redis.

const hits = new Map<string, number[]>()
const WINDOW_MS = 60_000

export function rateLimit(key: string, max: number): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= max) {
    hits.set(key, recent)
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000) }
  }
  recent.push(now)
  hits.set(key, recent)

  // Opportunistic cleanup so the map can't grow forever
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
  }
  return { ok: true, retryAfter: 0 }
}
