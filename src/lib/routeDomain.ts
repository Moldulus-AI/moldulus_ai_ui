// Lightweight keyword router: picks the best workspace for a free-text prompt.
// (Client-safe - no server imports.)

export const DOMAIN_SLUGS = ["build", "property", "finance", "health", "fashion", "engineering", "industrial", "home"] as const
export type DomainSlug = (typeof DOMAIN_SLUGS)[number]

const KEYWORDS: Record<DomainSlug, string[]> = {
  build: ["construct", "build a", "building", "house", "floor plan", "foundation", "concrete", "roof", "tender", "contractor", "cladding", "storey", "bedroom"],
  property: ["property", "zoning", "planning permit", "development", "site ", "land", "heritage", "rezone", "real estate", "tenant", "lease", "mixed-use"],
  finance: ["finance", "debt", "irr", "npv", "cash flow", "loan", "interest rate", "invest", "valuation", "budget model", "dscr", "equity", "portfolio"],
  health: ["health", "patient", "drug", "medication", "symptom", "clinical", "diagnos", "dose", "interaction", "treatment", "disease"],
  fashion: ["fashion", "garment", "fabric", "jacket", "collection", "tech pack", "sketch", "outerwear", "textile", "apparel"],
  engineering: ["engineer", "tolerance", "fatigue", "weld", "torque", "circuit", "component", "failure mode", "stress", "load", "cad"],
  industrial: ["factory", "production line", "manufactur", "throughput", "bottleneck", "oee", "capacity", "assembly", "plant", "cycle time", "warehouse"],
  home: ["renovat", "kitchen", "bathroom", "living room", "paint", "furniture", "interior", "garden", "flooring", "my home"],
}

export function routeDomain(prompt: string): DomainSlug {
  const p = prompt.toLowerCase()
  let best: DomainSlug = "build"
  let bestScore = 0
  for (const slug of DOMAIN_SLUGS) {
    const score = KEYWORDS[slug].reduce((n, k) => n + (p.includes(k) ? 1 : 0), 0)
    if (score > bestScore) {
      best = slug
      bestScore = score
    }
  }
  return best
}
