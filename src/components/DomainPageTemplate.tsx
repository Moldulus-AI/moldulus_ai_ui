"use client"

import { useState } from "react"
import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import MoldulusInput from "@/components/MoldulusInput"

interface Faq {
  q: string
  a: string
}

interface DomainConfig {
  name: string
  slug: string
  tagline: string
  description: string
  heroImage: string
  heroImageAlt: string
  ctaLabel: string
  capabilities: Array<{ title: string; body: string; image: string; imageAlt: string }>
  related: string[]
  faqs: Faq[]
  finalCta: string
}

const domains: Record<string, DomainConfig> = {
  build: {
    name: "Build",
    slug: "build",
    tagline: "Understand before you build.",
    description: "Work with plans, documents, materials, costs and project decisions in context.",
    heroImage: "https://images.unsplash.com/photo-1617788587804-10346bac2ac3?w=1400&h=800&fit=crop&auto=format",
    heroImageAlt: "Modern architecture and construction",
    ctaLabel: "Start with Build",
    capabilities: [
      {
        title: "Understand plans",
        body: "Upload drawings, plans and technical documents. Build reads them in context, identifies key elements and helps you ask the right questions before decisions are made.",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Architectural drawings",
      },
      {
        title: "Explore materials and costs",
        body: "Compare materials, understand cost relationships and explore alternatives. Build provides context without replacing the expertise of your team.",
        image: "https://images.unsplash.com/photo-1632783242863-35e5ea3079d5?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Building construction details",
      },
      {
        title: "Work through decisions",
        body: "From site selection to structural choices, Build helps you reason through complexity with relevant information visible at every stage.",
        image: "https://images.unsplash.com/photo-1786869237232-cc40dcc3965b?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Architectural composition",
      },
    ],
    related: ["Property", "Engineering", "Finance"],
    faqs: [
      { q: "What file types can Build work with?", a: "Build works with PDFs, images, CAD exports and common document formats. It understands technical drawings including floor plans, elevations and section drawings." },
      { q: "Can Build replace my architect or engineer?", a: "No. Build is designed to support and enhance the work of professionals, not replace them. It helps you ask better questions and understand information more fully." },
      { q: "How does Build connect to other Moldulus intelligence?", a: "Build is part of one Moldulus account. You can naturally move between Build, Property and Finance as a project evolves, with Moldulus managing the transition." },
    ],
    finalCta: "Bring your project to Build.",
  },
  property: {
    name: "Property",
    slug: "property",
    tagline: "See more in every property.",
    description: "Understand location, site context, planning constraints and development potential.",
    heroImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&h=800&fit=crop&auto=format",
    heroImageAlt: "Modern residential property exterior",
    ctaLabel: "Start with Property",
    capabilities: [
      {
        title: "Understand location and site",
        body: "Property brings together location context, planning information, site constraints and comparable activity to give you a complete picture before you proceed.",
        image: "https://images.unsplash.com/photo-1764222233275-87dc016c11dc?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Aerial view of property site",
      },
      {
        title: "Planning and development context",
        body: "Understand zoning, constraints, recent approvals and the planning framework relevant to any property or site.",
        image: "https://images.unsplash.com/photo-1726592058743-384b550930a6?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Property planning context",
      },
      {
        title: "Market and comparable context",
        body: "Research recent activity, comparable properties and market context relevant to your property or investment decision.",
        image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Property interior detail",
      },
    ],
    related: ["Build", "Finance", "Home"],
    faqs: [
      { q: "What kinds of property questions can I ask?", a: "You can ask about planning constraints, comparable sales, development potential, site analysis, neighbourhood context and much more." },
      { q: "Does Property provide valuations?", a: "Property provides context and comparable information to support your understanding. It does not provide formal valuations, which require a licensed valuer." },
    ],
    finalCta: "Start exploring with Property.",
  },
  fashion: {
    name: "Fashion",
    slug: "fashion",
    tagline: "From idea to form.",
    description: "Develop concepts, explore materials, refine silhouettes and bring ideas forward.",
    heroImage: "https://images.unsplash.com/photo-1753164597585-6d42636ea099?w=1400&h=800&fit=crop&auto=format",
    heroImageAlt: "Fashion sketches pinned on a board",
    ctaLabel: "Start with Fashion",
    capabilities: [
      {
        title: "Develop concepts",
        body: "Upload sketches, reference images or describe an idea. Fashion explores silhouette, material and structure to help ideas take shape.",
        image: "https://images.unsplash.com/photo-1761746395593-5662bc22ca6b?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Clothing sketches with pens",
      },
      {
        title: "From sketch to garment",
        body: "Understand construction requirements and how design choices translate from drawing to finished piece. Fashion connects creative decisions to their practical implications.",
        image: "https://images.unsplash.com/photo-1753162656029-781d67c7f6e6?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Designers reviewing sketches and fabrics",
      },
      {
        title: "Refine and develop",
        body: "Work through iterations, compare alternatives and develop a concept from sketch to finished direction.",
        image: "https://images.unsplash.com/photo-1747171551392-9d47576e6186?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Model on runway in finished collection",
      },
    ],
    related: ["Home", "Build"],
    faqs: [
      { q: "Can Fashion work with rough sketches?", a: "Yes. Fashion can interpret rough sketches, reference images, mood boards or written descriptions as starting points for concept development." },
      { q: "Does Fashion produce final technical specifications?", a: "Fashion can help develop concepts and explore directions. Final technical specifications should be developed with experienced pattern makers and manufacturers." },
    ],
    finalCta: "Bring your concept to Fashion.",
  },
  finance: {
    name: "Finance",
    slug: "finance",
    tagline: "Understand more than the numbers.",
    description: "Research, compare and reason through complex financial information and scenarios.",
    heroImage: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=1400&h=800&fit=crop&auto=format",
    heroImageAlt: "Finance planning documents and analysis",
    ctaLabel: "Start with Finance",
    capabilities: [
      {
        title: "Financial research",
        body: "Research companies, markets, instruments and financial information with context that goes beyond the raw numbers.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Financial documents and calculator",
      },
      {
        title: "Scenario analysis",
        body: "Explore different financial scenarios, compare outcomes and understand the assumptions underlying projections.",
        image: "https://images.unsplash.com/photo-1709880945165-d2208c6ad2ec?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Financial analysis on desk",
      },
      {
        title: "Development feasibility",
        body: "Work through the financial context of development projects, connecting Build and Property intelligence with Finance.",
        image: "https://images.unsplash.com/photo-1707157284454-553ef0a4ed0d?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Financial charts and data",
      },
    ],
    related: ["Build", "Property", "Industrial"],
    faqs: [
      { q: "Does Finance provide investment advice?", a: "Finance provides information, research and analytical context. It does not provide regulated financial advice. Consult a licensed financial adviser for personal financial decisions." },
      { q: "What financial data sources does Finance use?", a: "Finance draws on public financial information, research and data to provide context for your questions." },
    ],
    finalCta: "Start with Finance.",
  },
  health: {
    name: "Health",
    slug: "health",
    tagline: "Intelligence for understanding health information.",
    description: "Navigate medical literature, research and health data with clarity and context.",
    heroImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1400&h=800&fit=crop&auto=format",
    heroImageAlt: "Health and medical visualization",
    ctaLabel: "Explore Health",
    capabilities: [
      {
        title: "Health research",
        body: "Navigate medical literature, research papers and health information with clarity. Health helps you understand complex information in context.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Medical research",
      },
      {
        title: "Understanding health data",
        body: "Interpret health data and reports with context. Health provides explanation and background without replacing clinical interpretation.",
        image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Clinical doctor reviewing data",
      },
      {
        title: "Scientific context",
        body: "Understand the scientific context behind health questions, treatments and research findings.",
        image: "https://images.unsplash.com/photo-1639772823849-6efbd173043c?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Medical laboratory research",
      },
    ],
    related: ["Research"],
    faqs: [
      { q: "Can Health diagnose conditions?", a: "No. Health is designed to help you understand health information and research, not to provide diagnoses. Always consult a qualified healthcare professional for medical advice." },
      { q: "Is Health suitable for clinical use?", a: "Health is designed for information and research purposes. Clinical use should be evaluated carefully and is subject to applicable regulations." },
    ],
    finalCta: "Explore Health.",
  },
  engineering: {
    name: "Engineering",
    slug: "engineering",
    tagline: "Work through complexity.",
    description: "Reason about technical objects, drawings, materials and engineering decisions.",
    heroImage: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?w=1400&h=800&fit=crop&auto=format",
    heroImageAlt: "Precision engineering component",
    ctaLabel: "Start with Engineering",
    capabilities: [
      {
        title: "Understand technical objects",
        body: "Upload CAD files, technical drawings or images of components. Engineering identifies relevant properties and helps you reason through the design.",
        image: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Technical machinery",
      },
      {
        title: "Materials and properties",
        body: "Understand material properties, specifications and the implications of material choices for your engineering application.",
        image: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Engineering materials",
      },
      {
        title: "Work through decisions",
        body: "Reason through design choices, tolerances, manufacturing considerations and technical trade-offs.",
        image: "https://images.unsplash.com/photo-1786869237232-cc40dcc3965b?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Engineering design",
      },
    ],
    related: ["Build", "Industrial"],
    faqs: [
      { q: "What engineering disciplines does Engineering cover?", a: "Engineering works across mechanical, structural, civil and related technical disciplines. Specific capabilities vary by context." },
      { q: "Can Engineering replace a licensed engineer?", a: "No. Engineering supports and augments professional engineering work but does not replace licensed professionals for regulated applications." },
    ],
    finalCta: "Start with Engineering.",
  },
  industrial: {
    name: "Industrial",
    slug: "industrial",
    tagline: "Intelligence for physical operations.",
    description: "Connect equipment, processes and operational data to better decisions.",
    heroImage: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?w=1400&h=800&fit=crop&auto=format",
    heroImageAlt: "Industrial manufacturing operation",
    ctaLabel: "Explore Industrial",
    capabilities: [
      {
        title: "Equipment and process context",
        body: "Bring intelligence to equipment documentation, process parameters and operational data. Industrial helps your teams understand and act on what matters.",
        image: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Industrial equipment",
      },
      {
        title: "Operational intelligence",
        body: "Connect data from systems, sensors and operations to build a clearer picture of what is happening and why.",
        image: "https://images.unsplash.com/photo-1565108252-90cce3d2bda4?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Manufacturing operations",
      },
      {
        title: "Physical systems",
        body: "Understand the relationships between physical systems, components and operational variables.",
        image: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Physical systems",
      },
    ],
    related: ["Engineering", "Systems"],
    faqs: [
      { q: "Can Industrial connect to live systems?", a: "Industrial is designed to work with data you provide. Live system integration depends on your environment and configuration." },
      { q: "Is Industrial suitable for safety-critical applications?", a: "Industrial provides information and analytical support. Safety-critical applications require appropriate certification and human oversight." },
    ],
    finalCta: "Explore Industrial.",
  },
  home: {
    name: "Home",
    slug: "home",
    tagline: "A home that understands more.",
    description: "Intelligent support for the systems, environment and comfort of your home.",
    heroImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1400&h=800&fit=crop&auto=format",
    heroImageAlt: "Modern interior living space",
    ctaLabel: "Explore Home",
    capabilities: [
      {
        title: "Understand your home environment",
        body: "Home intelligence helps you understand temperature, air quality, energy use and the systems that keep your living environment comfortable.",
        image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Living space",
      },
      {
        title: "Connected systems",
        body: "Bring together information from the systems in your home and understand how they work together.",
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Modern home interior",
      },
      {
        title: "Energy and environment",
        body: "Understand energy consumption, comfort factors and how your environment changes over time.",
        image: "https://images.unsplash.com/photo-1786869237232-cc40dcc3965b?w=900&h=560&fit=crop&auto=format",
        imageAlt: "Home environment",
      },
    ],
    related: ["Build", "Property", "Systems"],
    faqs: [
      { q: "Does Home require smart home hardware?", a: "Home works with the information you provide. Smart home integration depends on your configuration and compatible systems." },
      { q: "What kind of home questions can I ask?", a: "Ask about energy efficiency, air quality, comfort, home systems, maintenance, renovation decisions and more." },
    ],
    finalCta: "Explore Home.",
  },
}

function DomainPageTemplate({ domainKey }: { domainKey: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const d = domains[domainKey]
  if (!d) return null

  return (
    <div className="min-h-screen bg-background font-sans page-enter">
      <Nav />

      {/* Hero */}
      <section className="pt-[68px] relative overflow-hidden">
        <div className="relative h-[70vh] min-h-[480px]">
          <img src={d.heroImage} alt={d.heroImageAlt} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-14">
            <div className="max-w-[1320px] mx-auto">
              <p className="text-[14px] font-semibold text-accent uppercase tracking-widest mb-3">
                Moldulus {d.name}
              </p>
              <h1 className="text-[clamp(44px,6vw,80px)] font-800 text-foreground tracking-tight leading-[1.05] mb-5 max-w-3xl">
                {d.tagline}
              </h1>
              <p className="text-[18px] font-medium text-muted max-w-lg mb-8">{d.description}</p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="px-7 py-3.5 rounded-full bg-accent text-white text-[16px] font-semibold hover:bg-accent-hover transition-colors"
                >
                  {d.ctaLabel}
                </Link>
                <Link
                  href="/app"
                  className="px-7 py-3.5 rounded-full border border-border text-[16px] font-semibold hover:bg-secondary transition-colors"
                >
                  See {d.name} in action
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 px-6">
        <div className="max-w-[1320px] mx-auto space-y-20">
          {d.capabilities.map((cap, i) => (
            <div
              key={cap.title}
              className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
            >
              <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                <h2 className="text-[clamp(28px,3vw,40px)] font-800 text-foreground tracking-tight leading-[1.1] mb-4">
                  {cap.title}
                </h2>
                <p className="text-[17px] font-medium text-muted leading-relaxed">{cap.body}</p>
              </div>
              <div className={`rounded-2xl overflow-hidden aspect-[16/10] bg-secondary ${i % 2 === 1 ? "lg:col-start-1" : ""}`}>
                <img src={cap.image} alt={cap.imageAlt} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related intelligence */}
      {d.related.length > 0 && (
        <section className="py-16 px-6 bg-secondary">
          <div className="max-w-[1320px] mx-auto">
            <p className="text-[14px] font-semibold text-muted uppercase tracking-widest mb-6">Works with</p>
            <div className="flex flex-wrap gap-3">
              {d.related.map((r) => (
                <Link
                  key={r}
                  href={`/intelligence/${r.toLowerCase()}`}
                  className="px-5 py-2.5 rounded-full border border-border bg-surface text-[15px] font-semibold hover:border-accent/40 hover:bg-background transition-all"
                >
                  {r}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-[32px] font-800 text-foreground tracking-tight mb-10">Common questions</h2>
          <div className="space-y-2">
            {d.faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left bg-surface hover:bg-secondary transition-colors"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-[16px] font-600 text-foreground pr-4">{faq.q}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className={`shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                  >
                    <path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 bg-surface">
                    <p className="text-[15px] font-medium text-muted leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-secondary">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-[clamp(36px,4vw,56px)] font-800 text-foreground tracking-tight leading-[1.1] mb-8">
            {d.finalCta}
          </h2>
          <MoldulusInput size="large" placeholder={`Ask ${d.name}…`} />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export function BuildPage() { return <DomainPageTemplate domainKey="build" /> }
export function PropertyPage() { return <DomainPageTemplate domainKey="property" /> }
export function FashionPage() { return <DomainPageTemplate domainKey="fashion" /> }
export function FinancePage() { return <DomainPageTemplate domainKey="finance" /> }
export function HealthPage() { return <DomainPageTemplate domainKey="health" /> }
export function EngineeringPage() { return <DomainPageTemplate domainKey="engineering" /> }
export function IndustrialPage() { return <DomainPageTemplate domainKey="industrial" /> }
export function HomeDomainPage() { return <DomainPageTemplate domainKey="home" /> }
