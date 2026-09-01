"use client"

import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

const endpoints = [
  { method: "POST", path: "/v1/intelligence/query", desc: "Send a query to any Moldulus intelligence" },
  { method: "POST", path: "/v1/intelligence/build/analyze", desc: "Analyze an uploaded plan or drawing" },
  { method: "GET", path: "/v1/conversations/{id}", desc: "Retrieve a conversation and its context" },
  { method: "POST", path: "/v1/files/upload", desc: "Upload a file for use in intelligence queries" },
]

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-background font-sans page-enter">
      <Nav />

      <section className="pt-[68px]">
        <div className="max-w-[1320px] mx-auto px-6 pt-20 pb-16">
          <p className="text-[14px] font-semibold text-accent uppercase tracking-widest mb-5">Developers</p>
          <h1 className="text-[clamp(48px,6vw,88px)] font-800 text-foreground tracking-tight leading-[1.05] mb-5 max-w-3xl">
            Build with Moldulus.
          </h1>
          <p className="text-[20px] font-medium text-muted max-w-xl leading-relaxed">
            The Moldulus API gives you access to specialized intelligence across every domain.
          </p>
        </div>
      </section>

      {/* Quick start */}
      <section className="px-6 pb-20">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
            {/* Left: overview */}
            <div className="space-y-8">
              <div className="p-8 rounded-2xl border border-border bg-surface">
                <h2 className="text-[22px] font-800 text-foreground tracking-tight mb-3">Get started</h2>
                <p className="text-[15px] font-medium text-muted mb-6">
                  Install the Moldulus SDK, get an API key and start making requests in minutes.
                </p>
                <div className="space-y-3">
                  {["npm install @moldulus/sdk", "MOLDULUS_API_KEY=your_key_here"].map((cmd, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg bg-graphite font-mono text-[13px] text-white/80">
                      <span>{cmd}</span>
                      <button className="text-white/40 hover:text-white transition-colors text-[11px]">Copy</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-2xl border border-border bg-surface">
                <h2 className="text-[22px] font-800 text-foreground tracking-tight mb-4">Available intelligence</h2>
                <div className="space-y-2">
                  {["Build", "Property", "Finance", "Health", "Fashion", "Engineering", "Industrial", "Home"].map((d) => (
                    <div key={d} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
                      <span className="text-[15px] font-medium text-foreground">{d}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success text-[12px] font-semibold border border-success/20">Available</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: code example */}
            <div className="rounded-2xl overflow-hidden border border-border bg-graphite">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                </div>
                <span className="text-[12px] font-semibold text-white/40">example.ts</span>
              </div>
              <pre className="p-6 text-[13px] font-mono text-white/75 leading-relaxed overflow-x-auto">
{`import { Moldulus } from '@moldulus/sdk'

const client = new Moldulus({
  apiKey: process.env.MOLDULUS_API_KEY
})

// Query any intelligence
const response = await client.intelligence.query({
  domain: 'build',
  message: 'What should I pay attention to in this plan?',
  files: [planFile]
})

console.log(response.message)
// Build has identified three key elements...

// Multi-domain flow
const session = await client.sessions.create()

await session.query({
  message: 'Evaluate this site for residential development',
  files: [sitePhoto]
})
// Moldulus routes to Property intelligence

await session.query({
  message: 'What could I build here?'
})
// Transitions to Build intelligence seamlessly`}
              </pre>
            </div>
          </div>

          {/* API reference */}
          <div className="mt-12">
            <h2 className="text-[28px] font-800 text-foreground tracking-tight mb-6">Key endpoints</h2>
            <div className="space-y-3">
              {endpoints.map((e) => (
                <div key={e.path} className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors">
                  <span className={`shrink-0 px-2.5 py-1 rounded-md text-[12px] font-800 font-mono ${
                    e.method === "POST" ? "bg-accent/10 text-accent" : "bg-success/10 text-success"
                  }`}>
                    {e.method}
                  </span>
                  <code className="font-mono text-[14px] text-foreground">{e.path}</code>
                  <span className="text-[14px] font-medium text-muted sm:ml-auto">{e.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
