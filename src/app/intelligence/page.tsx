"use client"

import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

const domains = [
  {
    name: "Build",
    href: "/intelligence/build",
    tagline: "Understand before you build.",
    description: "Work with plans, documents, materials, costs and project decisions in context.",
    image: "https://images.unsplash.com/photo-1617788587804-10346bac2ac3?w=900&h=560&fit=crop&auto=format",
    alt: "Modern architecture",
  },
  {
    name: "Property",
    href: "/intelligence/property",
    tagline: "See more in every property.",
    description: "Understand location, site context, planning constraints and development potential.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&h=560&fit=crop&auto=format",
    alt: "Modern residential property",
  },
  {
    name: "Finance",
    href: "/intelligence/finance",
    tagline: "Understand more than the numbers.",
    description: "Research, compare and reason through complex financial information and scenarios.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&h=560&fit=crop&auto=format",
    alt: "Financial data",
  },
  {
    name: "Health",
    href: "/intelligence/health",
    tagline: "Intelligence for understanding health information.",
    description: "Navigate medical literature, research and health data with clarity and context.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&h=560&fit=crop&auto=format",
    alt: "Health visualization",
  },
  {
    name: "Fashion",
    href: "/intelligence/fashion",
    tagline: "From idea to form.",
    description: "Develop concepts, explore materials, refine silhouettes and bring ideas forward.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=560&fit=crop&auto=format",
    alt: "Fashion atelier",
  },
  {
    name: "Engineering",
    href: "/intelligence/engineering",
    tagline: "Work through complexity.",
    description: "Reason about technical objects, drawings, materials and engineering decisions.",
    image: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?w=900&h=560&fit=crop&auto=format",
    alt: "Engineering precision work",
  },
  {
    name: "Industrial",
    href: "/intelligence/industrial",
    tagline: "Intelligence for physical operations.",
    description: "Connect equipment, processes and operational data to better decisions.",
    image: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?w=900&h=560&fit=crop&auto=format",
    alt: "Industrial manufacturing",
  },
  {
    name: "Home",
    href: "/intelligence/home",
    tagline: "A home that understands more.",
    description: "Intelligent support for the systems, environment and comfort of your home.",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=900&h=560&fit=crop&auto=format",
    alt: "Modern interior",
  },
]

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-background font-sans page-enter">
      <Nav />

      {/* Hero */}
      <section className="pt-[68px]">
        <div className="max-w-[1320px] mx-auto px-6 pt-20 pb-16">
          <p className="text-[14px] font-semibold text-accent uppercase tracking-widest mb-5">Intelligence</p>
          <h1 className="text-[clamp(48px,6vw,88px)] font-800 text-foreground tracking-tight leading-[1.05] mb-5 max-w-3xl">
            Specialized intelligence.{" "}
            <span className="text-muted">One Moldulus.</span>
          </h1>
          <p className="text-[20px] font-medium text-muted max-w-xl">
            Explore AI designed for different kinds of work.
          </p>
        </div>
      </section>

      {/* Domain grid */}
      <section className="px-6 pb-24">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid md:grid-cols-2 gap-5">
            {domains.map((d, i) => (
              <Link
                key={d.name}
                href={d.href}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-surface hover:border-accent/30 transition-all duration-300 shadow-sm hover:shadow-md ${
                  i === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className={`${i === 0 ? "md:grid md:grid-cols-[1fr_1fr]" : "flex flex-col"}`}>
                  {/* Image */}
                  <div className={`overflow-hidden ${i === 0 ? "aspect-[2/1] md:aspect-auto md:min-h-[340px]" : "aspect-[16/9]"}`}>
                    <img
                      src={d.image}
                      alt={d.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className={`p-7 flex flex-col justify-between ${i === 0 ? "" : ""}`}>
                    <div>
                      <p className="text-[12px] font-semibold text-accent uppercase tracking-wider mb-3">
                        Moldulus {d.name}
                      </p>
                      <h2 className={`font-800 text-foreground leading-tight tracking-tight mb-3 ${i === 0 ? "text-[32px]" : "text-[24px]"}`}>
                        {d.tagline}
                      </h2>
                      <p className="text-[15px] font-medium text-muted leading-relaxed">{d.description}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-[14px] font-semibold text-accent">
                      Start with {d.name}
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
