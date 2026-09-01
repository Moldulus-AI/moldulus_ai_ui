"use client"

import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

const features = [
  {
    title: "Specialized intelligence across your organization",
    body: "Deploy the full Moldulus intelligence ecosystem across your teams. Build, Property, Finance, Engineering and more — with organizational context built in.",
    icon: "◈",
  },
  {
    title: "Organizational knowledge and context",
    body: "Moldulus can work with your own documents, standards, specifications and institutional knowledge — not just general information.",
    icon: "◇",
  },
  {
    title: "Security and administration",
    body: "Enterprise-grade access controls, audit logging, data residency options and administration tools to deploy intelligence at scale.",
    icon: "◉",
  },
  {
    title: "Integrations",
    body: "Connect Moldulus to the systems your organization already uses. API access for custom integrations and workflows.",
    icon: "⊕",
  },
]

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-background font-sans page-enter">
      <Nav />

      {/* Hero */}
      <section className="pt-[68px]">
        <div className="max-w-[1320px] mx-auto px-6 pt-20 pb-16">
          <p className="text-[14px] font-semibold text-accent uppercase tracking-widest mb-5">Enterprise</p>
          <h1 className="text-[clamp(48px,6vw,88px)] font-800 text-foreground tracking-tight leading-[1.05] mb-5 max-w-3xl">
            Moldulus for organizations.
          </h1>
          <p className="text-[20px] font-medium text-muted max-w-xl leading-relaxed mb-10">
            Deploy specialized AI intelligence across your teams with the controls, context and integration your organization needs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="px-7 py-3.5 rounded-full bg-accent text-white text-[16px] font-semibold hover:bg-accent-hover transition-colors"
            >
              Talk to Moldulus
            </Link>
            <Link
              href="/intelligence"
              className="px-7 py-3.5 rounded-full border border-border text-[16px] font-semibold hover:bg-secondary transition-colors"
            >
              Explore Intelligence
            </Link>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <section className="px-6 mb-24">
        <div className="max-w-[1320px] mx-auto">
          <div className="rounded-2xl overflow-hidden aspect-[21/8]">
            <img
              src="https://images.unsplash.com/photo-1617788587804-10346bac2ac3?w=1600&h=600&fit=crop&auto=format"
              alt="Enterprise environment"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 px-6 pb-24">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-8 rounded-2xl border border-border bg-surface">
                <div className="text-2xl mb-4 text-accent">{f.icon}</div>
                <h2 className="text-[22px] font-700 text-foreground tracking-tight leading-tight mb-3">{f.title}</h2>
                <p className="text-[15px] font-medium text-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-[680px] mx-auto">
          <h2 className="text-[clamp(32px,4vw,52px)] font-800 text-foreground tracking-tight leading-tight mb-4">
            Ready to deploy Moldulus for your organization?
          </h2>
          <p className="text-[17px] font-medium text-muted mb-8">
            Our enterprise team will help you understand which Moldulus intelligence products fit your needs and how to deploy them effectively.
          </p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name"
                className="px-5 py-4 rounded-xl border border-border bg-surface text-[16px] font-medium placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/12 transition-all"
              />
              <input
                type="text"
                placeholder="Last name"
                className="px-5 py-4 rounded-xl border border-border bg-surface text-[16px] font-medium placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/12 transition-all"
              />
            </div>
            <input
              type="email"
              placeholder="Work email"
              className="w-full px-5 py-4 rounded-xl border border-border bg-surface text-[16px] font-medium placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/12 transition-all"
            />
            <input
              type="text"
              placeholder="Organization"
              className="w-full px-5 py-4 rounded-xl border border-border bg-surface text-[16px] font-medium placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/12 transition-all"
            />
            <textarea
              rows={4}
              placeholder="Tell us about your use case…"
              className="w-full px-5 py-4 rounded-xl border border-border bg-surface text-[16px] font-medium placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/12 transition-all resize-none"
            />
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-accent text-white text-[16px] font-semibold hover:bg-accent-hover transition-colors"
            >
              Send message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
