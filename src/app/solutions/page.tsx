"use client"

import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

const solutions = [
  {
    title: "Construction",
    copy: "From plans to project decisions. Build intelligence reads drawings, identifies constraints and helps teams work through complexity before and during construction.",
    href: "/intelligence/build",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=600&fit=crop&auto=format",
    alt: "Construction drawings and plans",
    domains: ["Build", "Engineering", "Finance"],
  },
  {
    title: "Real estate",
    copy: "Understand properties, sites and development opportunities. From individual properties to portfolios, Property brings context to every decision.",
    href: "/intelligence/property",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&h=600&fit=crop&auto=format",
    alt: "Real estate property",
    domains: ["Property", "Build", "Finance"],
  },
  {
    title: "Financial services",
    copy: "Research, compare and reason through complex financial information. Finance provides context for decisions that require more than the numbers alone.",
    href: "/intelligence/finance",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&h=600&fit=crop&auto=format",
    alt: "Financial data and analysis",
    domains: ["Finance", "Research"],
  },
  {
    title: "Fashion and creative work",
    copy: "From early concept to developed direction. Fashion connects creative ideas to material, construction and form.",
    href: "/intelligence/fashion",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=600&fit=crop&auto=format",
    alt: "Fashion atelier",
    domains: ["Fashion"],
  },
  {
    title: "Engineering",
    copy: "Work through complex technical problems with intelligence that understands materials, drawings and engineering decisions.",
    href: "/intelligence/engineering",
    image: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?w=900&h=600&fit=crop&auto=format",
    alt: "Engineering precision work",
    domains: ["Engineering", "Industrial"],
  },
  {
    title: "Manufacturing",
    copy: "Bring intelligence into physical operations. Industrial connects equipment, processes and operational data to better decisions.",
    href: "/intelligence/industrial",
    image: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?w=900&h=600&fit=crop&auto=format",
    alt: "Manufacturing machinery",
    domains: ["Industrial", "Engineering"],
  },
  {
    title: "Intelligent environments",
    copy: "Intelligence for the spaces people live and work in. From residential to complex managed environments.",
    href: "/intelligence/home",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=900&h=600&fit=crop&auto=format",
    alt: "Modern interior space",
    domains: ["Home", "Systems"],
  },
  {
    title: "Enterprise teams",
    copy: "Deploy Moldulus intelligence across your organization with the controls and context your teams need.",
    href: "/enterprise",
    image: "https://images.unsplash.com/photo-1617788587804-10346bac2ac3?w=900&h=600&fit=crop&auto=format",
    alt: "Enterprise environment",
    domains: ["Build", "Finance", "Engineering", "Industrial"],
  },
]

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-background font-sans page-enter">
      <Nav />

      <section className="pt-[68px]">
        <div className="max-w-[1320px] mx-auto px-6 pt-20 pb-16">
          <p className="text-[14px] font-semibold text-accent uppercase tracking-widest mb-5">Solutions</p>
          <h1 className="text-[clamp(48px,6vw,88px)] font-800 text-foreground tracking-tight leading-[1.05] mb-5 max-w-3xl">
            Intelligence applied to real work.
          </h1>
          <p className="text-[20px] font-medium text-muted max-w-xl">
            Specialized AI for the industries and workflows that matter.
          </p>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {solutions.map((s, i) => (
              <Link
                key={s.title}
                href={s.href}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-surface hover:shadow-lg transition-all duration-300 ${
                  i === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className={`${i === 0 ? "grid md:grid-cols-2" : "flex flex-col"}`}>
                  <div className={`overflow-hidden ${i === 0 ? "aspect-video md:aspect-auto md:min-h-[320px]" : "aspect-[16/9]"}`}>
                    <img
                      src={s.image}
                      alt={s.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <h2 className={`font-800 text-foreground tracking-tight leading-tight mb-3 ${i === 0 ? "text-[32px]" : "text-[22px]"}`}>
                        {s.title}
                      </h2>
                      <p className="text-[15px] font-medium text-muted leading-relaxed mb-6">{s.copy}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.domains.map((d) => (
                          <span key={d} className="px-3 py-1 rounded-full bg-secondary border border-border text-[13px] font-medium text-foreground">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-[14px] font-semibold text-accent">
                      Explore {s.title}
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
