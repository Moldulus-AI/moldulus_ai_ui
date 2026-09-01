"use client"

import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

const principles = [
  {
    title: "Complex intelligence underneath. Simple experience on top.",
    body: "The user should never have to configure agents, understand orchestration or manage AI complexity. They should arrive, ask and work.",
  },
  {
    title: "Specialized is better than general.",
    body: "General AI answers general questions. Moldulus believes that intelligence designed for specific domains — building, medicine, fashion, engineering — produces genuinely better outcomes for the people who work in those fields.",
  },
  {
    title: "AI that shows its work is more useful.",
    body: "We believe AI should help people understand more, not just produce outputs. Intelligence should be visible in what it reveals, not hidden behind confident-sounding answers.",
  },
  {
    title: "Responsibility is part of the design.",
    body: "We apply particular care to intelligence that touches consequential decisions — in health, finance, construction and other areas where errors have real consequences.",
  },
]

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-background font-sans page-enter">
      <Nav />

      {/* Hero */}
      <section className="pt-[68px] relative overflow-hidden">
        <div className="absolute inset-0 h-[560px]">
          <img
            src="https://images.unsplash.com/photo-1617788587804-10346bac2ac3?w=1600&h=900&fit=crop&auto=format"
            alt="Moldulus company"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
        <div className="relative max-w-[1320px] mx-auto px-6 pt-24 pb-20">
          <p className="text-[14px] font-semibold text-accent uppercase tracking-widest mb-5">Company</p>
          <h1 className="text-[clamp(48px,6vw,80px)] font-800 text-foreground tracking-tight leading-[1.05] mb-5 max-w-3xl">
            Building intelligence for the world we live in.
          </h1>
          <p className="text-[20px] font-medium text-muted max-w-xl leading-relaxed">
            Moldulus is a global AI company developing specialized intelligence for different areas of work and life.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="prose-content space-y-5">
            <p className="text-[20px] font-medium text-foreground leading-relaxed">
              We believe the most valuable AI is AI that understands your specific domain — the language, constraints, context and decisions that matter in your field.
            </p>
            <p className="text-[17px] font-medium text-muted leading-relaxed">
              Moldulus is building an ecosystem of specialized intelligence products — Build, Property, Finance, Health, Fashion, Engineering, Industrial and Home — that share one unified platform. Users have one account, one experience, and access to the intelligence most relevant to their work.
            </p>
            <p className="text-[17px] font-medium text-muted leading-relaxed">
              Our longer-term research is exploring how intelligence can move beyond software into physical environments, systems and devices. We work carefully in this space, distinguishing clearly between what exists today and what we are working toward.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-[1320px] mx-auto">
          <h2 className="text-[clamp(32px,4vw,52px)] font-800 text-foreground tracking-tight leading-tight mb-12">
            How we think about this work.
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="p-8 rounded-2xl bg-surface border border-border">
                <h3 className="text-[20px] font-700 text-foreground leading-snug tracking-tight mb-3">{p.title}</h3>
                <p className="text-[15px] font-medium text-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers */}
      <section className="py-20 px-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-[clamp(36px,4vw,56px)] font-800 text-foreground tracking-tight leading-tight mb-5">
                Join us.
              </h2>
              <p className="text-[17px] font-medium text-muted leading-relaxed mb-8">
                We are building a team of people who care deeply about making AI genuinely useful in specialized domains. If you are working on problems that matter — in AI, in engineering, in the industries we serve — we would like to hear from you.
              </p>
              <Link
                href="/company"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white text-[16px] font-semibold hover:bg-accent-hover transition-colors"
              >
                See open roles
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1632783242863-35e5ea3079d5?w=800&h=600&fit=crop&auto=format"
                alt="Moldulus workplace"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
