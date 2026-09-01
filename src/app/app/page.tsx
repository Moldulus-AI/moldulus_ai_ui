"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MoldulusInput from "@/components/MoldulusInput"

const domains = [
  { name: "Build", href: "/app/workspace/build", color: "bg-stone-100 hover:bg-stone-200", dot: "bg-amber-500" },
  { name: "Property", href: "/app/workspace/property", color: "bg-sky-50 hover:bg-sky-100", dot: "bg-sky-500" },
  { name: "Finance", href: "/app/workspace/finance", color: "bg-green-50 hover:bg-green-100", dot: "bg-green-500" },
  { name: "Health", href: "/app/workspace/health", color: "bg-red-50 hover:bg-red-100", dot: "bg-red-400" },
  { name: "Fashion", href: "/app/workspace/fashion", color: "bg-purple-50 hover:bg-purple-100", dot: "bg-purple-400" },
  { name: "Engineering", href: "/app/workspace/engineering", color: "bg-orange-50 hover:bg-orange-100", dot: "bg-orange-500" },
  { name: "Industrial", href: "/app/workspace/industrial", color: "bg-zinc-100 hover:bg-zinc-200", dot: "bg-zinc-500" },
  { name: "Home", href: "/app/workspace/home", color: "bg-teal-50 hover:bg-teal-100", dot: "bg-teal-500" },
]

const recentWork = [
  { title: "4-bedroom house cost estimate", domain: "Build", time: "2 hours ago", icon: "◈" },
  { title: "Site analysis — Fitzroy residential", domain: "Property", time: "Yesterday", icon: "◇" },
  { title: "Tech jacket concept development", domain: "Fashion", time: "3 days ago", icon: "◉" },
  { title: "Structural component review", domain: "Engineering", time: "Last week", icon: "⊕" },
]

const suggestions = [
  "Help me estimate the cost of building a four-bedroom house.",
  "Evaluate this property for a residential development.",
  "Develop a technical outerwear concept from this sketch.",
  "Analyse the feasibility of a mixed-use development.",
]

export default function AppHomePage() {
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const router = useRouter()

  const handlePromptSubmit = (prompt: string) => {
    const lower = prompt.toLowerCase()
    if (lower.includes("build") || lower.includes("house") || lower.includes("plan") || lower.includes("construct")) {
      setAiResponse("Build can help with that.")
    } else if (lower.includes("property") || lower.includes("site") || lower.includes("development")) {
      setAiResponse("Property can help with that.")
    } else if (lower.includes("fashion") || lower.includes("sketch") || lower.includes("garment")) {
      setAiResponse("Fashion can help with that.")
    } else if (lower.includes("engineer") || lower.includes("component") || lower.includes("technical")) {
      setAiResponse("Engineering can help with that.")
    } else {
      setAiResponse("Build can help with that.")
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      {/* App header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-surface sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <MoldulusLogoMark />
          <span className="text-[16px] font-bold text-foreground">Moldulus</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[14px] font-medium text-muted hover:text-foreground transition-colors">
            History
          </button>
          <Link href="/enterprise" className="text-[14px] font-medium text-muted hover:text-foreground transition-colors">
            Settings
          </Link>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-[12px] font-700">
            JD
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[860px] w-full mx-auto px-6 py-16">
        {/* Intelligence domains */}
        <div className="mb-10">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {domains.map((d) => (
              <Link
                key={d.name}
                href={d.href}
                className={`group flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-colors cursor-pointer ${d.color}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${d.dot}`} />
                <span className="text-[12px] font-semibold text-foreground">{d.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-[clamp(32px,4.5vw,56px)] font-800 text-foreground tracking-tight leading-[1.05] mb-3">
            What are you working on?
          </h1>
          <p className="text-[16px] font-medium text-muted">
            Describe the problem. Moldulus finds the right intelligence.
          </p>
        </div>

        {/* Input */}
        <div className="mb-4">
          <MoldulusInput
            size="large"
            placeholder="Ask Moldulus…"
            redirectToApp={false}
          />
        </div>

        {/* AI routing response */}
        {aiResponse && (
          <div className="mb-8 p-4 rounded-xl bg-accent/6 border border-accent/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <span className="text-white text-[11px] font-800">M</span>
              </div>
              <span className="text-[15px] font-semibold text-foreground">{aiResponse}</span>
            </div>
            <button
              onClick={() => router.push("/app/workspace/build")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-[14px] font-semibold hover:bg-accent-hover transition-colors"
            >
              Continue with Build
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Suggested prompts */}
        {!aiResponse && (
          <div className="flex flex-col gap-2 mb-12">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handlePromptSubmit(s)}
                className="text-left px-5 py-3.5 rounded-xl border border-border bg-surface text-[15px] font-medium text-muted hover:text-foreground hover:border-accent/30 hover:bg-secondary transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Recent work */}
        <div>
          <p className="text-[13px] font-semibold text-muted uppercase tracking-widest mb-4">Recent work</p>
          <div className="space-y-2">
            {recentWork.map((item) => (
              <button
                key={item.title}
                onClick={() => router.push("/app/workspace/build")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:border-accent/30 hover:shadow-sm transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-[18px] shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-foreground truncate">{item.title}</div>
                  <div className="text-[13px] font-medium text-muted">{item.domain}</div>
                </div>
                <div className="text-[13px] font-medium text-muted shrink-0">{item.time}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function MoldulusLogoMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#111111" />
      <rect x="8" y="8" width="7" height="7" rx="1.5" fill="white" />
      <rect x="17" y="8" width="7" height="7" rx="1.5" fill="white" opacity="0.5" />
      <rect x="8" y="17" width="7" height="7" rx="1.5" fill="white" opacity="0.5" />
      <rect x="17" y="17" width="7" height="7" rx="1.5" fill="#4D5BFF" />
    </svg>
  )
}
