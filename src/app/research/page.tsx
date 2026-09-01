"use client"

import { useState } from "react"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

const papers = [
  {
    title: "Domain-specific intelligence: adapting large language models for specialized professional contexts",
    area: "Intelligence",
    date: "August 2026",
    excerpt: "We examine how specialized professional knowledge can be incorporated into large language models to produce more accurate, contextually appropriate responses in high-stakes domains including construction, medicine and engineering.",
    status: "Published",
  },
  {
    title: "Multimodal understanding of technical drawings in the built environment",
    area: "Build",
    date: "June 2026",
    excerpt: "This paper presents our approach to interpreting architectural and engineering drawings using vision-language models, with findings on accuracy across different document types and drawing conventions.",
    status: "Published",
  },
  {
    title: "Context preservation across intelligence transitions in multi-domain AI systems",
    area: "Systems",
    date: "May 2026",
    excerpt: "We explore the problem of maintaining user context as AI systems transition between specialized domains, presenting a framework for coherent multi-domain interactions.",
    status: "Published",
  },
  {
    title: "Responsible AI in health information: a framework for accurate, appropriately-bounded responses",
    area: "Health",
    date: "April 2026",
    excerpt: "Health information represents a particularly sensitive application of AI. This paper outlines our approach to accuracy, epistemic humility and appropriate boundary-setting in the Moldulus Health intelligence.",
    status: "Published",
  },
  {
    title: "Intelligent environments: embedding AI perception into physical spaces",
    area: "Systems",
    date: "March 2026",
    excerpt: "An early-stage exploration of how AI systems can begin to perceive and respond to physical environments, with initial findings from our lab research program.",
    status: "Preprint",
  },
  {
    title: "Fashion as structured design space: applying AI to creative development workflows",
    area: "Fashion",
    date: "February 2026",
    excerpt: "We present Moldulus Fashion as a case study in applying AI reasoning to creative and material design problems, with an analysis of how structured knowledge about material, construction and form supports the creative process.",
    status: "Published",
  },
]

const areas = ["All", "Intelligence", "Build", "Health", "Fashion", "Systems"]

export default function ResearchPage() {
  const [activeArea, setActiveArea] = useState("All")

  const filtered = activeArea === "All" ? papers : papers.filter((p) => p.area === activeArea)

  return (
    <div className="min-h-screen bg-background font-sans page-enter">
      <Nav />

      <section className="pt-[68px]">
        <div className="max-w-[1320px] mx-auto px-6 pt-20 pb-16">
          <p className="text-[14px] font-semibold text-accent uppercase tracking-widest mb-5">Research</p>
          <h1 className="text-[clamp(48px,6vw,80px)] font-800 text-foreground tracking-tight leading-[1.05] mb-5 max-w-3xl">
            Researching what intelligence can become.
          </h1>
          <p className="text-[20px] font-medium text-muted max-w-xl">
            Our published research and ongoing work across AI, domain specialization and physical intelligence.
          </p>
        </div>
      </section>

      {/* Filter */}
      <div className="px-6 border-b border-border">
        <div className="max-w-[1320px] mx-auto flex gap-1 overflow-x-auto">
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => setActiveArea(a)}
              className={`px-4 py-3 text-[14px] font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeArea === a
                  ? "text-accent border-accent"
                  : "text-muted border-transparent hover:text-foreground"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Papers */}
      <section className="py-12 px-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="space-y-4">
            {filtered.map((p) => (
              <div
                key={p.title}
                className="group p-8 rounded-2xl border border-border bg-surface hover:border-accent/30 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-secondary border border-border text-[12px] font-semibold text-muted">
                    {p.area}
                  </span>
                  <span className="text-[13px] text-muted">{p.date}</span>
                  <span className={`ml-auto px-3 py-1 rounded-full text-[12px] font-semibold ${
                    p.status === "Preprint"
                      ? "bg-warning/10 text-warning border border-warning/20"
                      : "bg-success/10 text-success border border-success/20"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <h2 className="text-[20px] font-700 text-foreground leading-snug tracking-tight mb-3 group-hover:text-accent transition-colors">
                  {p.title}
                </h2>
                <p className="text-[15px] font-medium text-muted leading-relaxed">{p.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
