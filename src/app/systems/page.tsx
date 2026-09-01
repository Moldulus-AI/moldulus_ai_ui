"use client"

import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

const areas = [
  {
    title: "Intelligent environments",
    copy: "Spaces that understand and respond to the people within them. From residential to commercial and industrial environments.",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=700&h=460&fit=crop&auto=format",
    alt: "Intelligent interior environment",
    status: "Exploring",
  },
  {
    title: "Connected devices",
    copy: "Intelligence embedded in the devices and tools used in everyday work and life.",
    image: "https://images.unsplash.com/photo-1632783242863-35e5ea3079d5?w=700&h=460&fit=crop&auto=format",
    alt: "Connected building exterior",
    status: "Exploring",
  },
  {
    title: "Industrial systems",
    copy: "Intelligence that connects to physical production systems, machinery and operational infrastructure.",
    image: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?w=700&h=460&fit=crop&auto=format",
    alt: "Industrial system machinery",
    status: "Early development",
  },
  {
    title: "Robotics",
    copy: "Extending Moldulus intelligence into physical robotic systems that operate in the real world.",
    image: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?w=700&h=460&fit=crop&auto=format",
    alt: "Robotics and physical systems",
    status: "Research",
  },
]

export default function SystemsPage() {
  return (
    <div className="min-h-screen bg-background font-sans page-enter">
      <Nav />

      {/* Hero — uses dark graphite */}
      <section className="pt-[68px] relative overflow-hidden bg-graphite">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1786869237232-cc40dcc3965b?w=1600&h=900&fit=crop&auto=format')" }}
          aria-hidden="true"
        />
        <div className="relative max-w-[1320px] mx-auto px-6 pt-24 pb-28">
          <p className="text-[14px] font-semibold text-accent uppercase tracking-widest mb-5">Systems</p>
          <h1 className="text-[clamp(48px,6vw,88px)] font-800 text-white tracking-tight leading-[1.05] mb-5 max-w-3xl">
            Intelligence becomes physical.
          </h1>
          <p className="text-[20px] font-medium text-white/60 max-w-xl leading-relaxed">
            Moldulus is exploring how intelligence can become part of the systems, tools and environments around us.
          </p>
        </div>
      </section>

      {/* Areas */}
      <section className="py-24 px-6">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-[16px] font-medium text-muted mb-12 max-w-2xl">
            These areas represent our active exploration of intelligence beyond software. Some are in early development, others are research-stage. We distinguish clearly between what exists today and what we are working toward.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {areas.map((a) => (
              <div key={a.title} className="group relative overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[22px] font-800 text-foreground tracking-tight">{a.title}</h2>
                    <span className="px-3 py-1 rounded-full bg-secondary border border-border text-[12px] font-semibold text-muted">
                      {a.status}
                    </span>
                  </div>
                  <p className="text-[15px] font-medium text-muted leading-relaxed">{a.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-[clamp(28px,3vw,44px)] font-800 text-foreground tracking-tight leading-tight mb-4">
            Interested in Moldulus Systems?
          </h2>
          <p className="text-[17px] font-medium text-muted mb-8">
            We work with selected partners on early Systems development. If your organization is working in this space, we would like to hear from you.
          </p>
          <Link
            href="/enterprise"
            className="inline-flex px-7 py-3.5 rounded-full bg-accent text-white text-[16px] font-semibold hover:bg-accent-hover transition-colors"
          >
            Talk to Moldulus
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
