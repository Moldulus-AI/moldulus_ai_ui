"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Message {
  role: "user" | "ai"
  text: string
  domain?: string
}

const domainConfig: Record<string, {
  label: string
  greeting: string
  placeholder: string
  tools: string[]
  responses: Record<string, string>
}> = {
  build: {
    label: "Build",
    greeting: "Start with a plan, document or question. Upload a drawing or describe what you are working on.",
    placeholder: "Ask Build…",
    tools: ["Analyse plan", "Review layout", "Explore materials", "Estimate costs", "Identify considerations"],
    responses: {
      default: "I can work with that. Upload the plan or drawing and I can start reading through the structural elements, identify anything that needs attention, and help you think through the key decisions.",
      cost: "Based on the plan area and typical construction costs in this context, preliminary estimates range from $380,000–$460,000 for the structural frame and cladding alone. This does not include fit-out, services or landscaping.",
      structural: "Three load-bearing elements near the south wall will affect where openings can be placed. There are also two areas where the structural grid appears to shift — worth confirming the engineering intent before finalising.",
    },
  },
  property: {
    label: "Property",
    greeting: "Share an address, planning document or question about a property. I can work through planning history, zoning, comparable sales and development potential.",
    placeholder: "Ask Property…",
    tools: ["Check zoning", "Review planning history", "Find comparables", "Assess development potential", "Flag constraints"],
    responses: {
      default: "Share the address or upload the planning document and I will start reading through the relevant history, zoning constraints and any risk factors worth knowing before you proceed.",
      heritage: "Three previous applications on this site — two approved, one refused in 2019 for excessive height. The refusal cited impact on the adjoining heritage item. Any proposal over three storeys will need a heritage impact statement.",
      zoning: "The site is zoned R2 Low Density Residential. The maximum height is 8.5m and the floor space ratio is 0.5:1. There is no heritage overlay, but the adjacent parcel to the north is listed.",
    },
  },
  finance: {
    label: "Finance",
    greeting: "Share a financial model, deal structure or question. I can work through the numbers, stress-test assumptions and explain what the structure means in practice.",
    placeholder: "Ask Finance…",
    tools: ["Review debt structure", "Stress test assumptions", "Model cash flows", "Assess coverage ratios", "Scenario analysis"],
    responses: {
      default: "Upload the model or describe the structure and I will work through it with you — checking the assumptions, flagging anything that does not hold under stress, and helping you understand what drives the outcome.",
      rates: "The model breaks at around 7.2% on the senior debt. Above that, the debt service coverage ratio drops below 1.0 in year two. That is a 140bps cushion from current market rates — workable, but thin.",
      returns: "The IRR sits at 14.2% on the base case. Sensitivity to vacancy is the biggest risk — a sustained 10% vacancy rate in years two and three drops the IRR to 9.8%, which is below the hurdle.",
    },
  },
  health: {
    label: "Health",
    greeting: "Describe the clinical question, patient scenario or research area. I work with medical literature, drug interactions, diagnostic reasoning and clinical guidelines.",
    placeholder: "Ask Health…",
    tools: ["Review literature", "Check interactions", "Assess differential", "Summarise guidelines", "Evaluate evidence"],
    responses: {
      default: "Describe the clinical question in detail and I will work through the relevant literature, guidelines and considerations. Be as specific as you can about the presentation and context.",
      interaction: "There is a clinically significant interaction between those two agents. The combination increases the risk of QT prolongation. Current guidelines recommend ECG monitoring and dose adjustment for the secondary agent.",
    },
  },
  fashion: {
    label: "Fashion",
    greeting: "Share a brief, reference image or concept. I can help develop the direction, research references, and work through to technical specification.",
    placeholder: "Ask Fashion…",
    tools: ["Develop concept", "Research references", "Specify materials", "Write tech pack", "Review construction"],
    responses: {
      default: "Share the brief or upload a reference and I will start working through the design direction with you — exploring the concept space, identifying relevant references and thinking through how it comes together technically.",
      materials: "For a lightweight summer collection, consider Tencel or bamboo-viscose blends for softness and breathability. If sustainability is a priority, recycled nylon is now competitive on cost and performs well for outerwear.",
    },
  },
  engineering: {
    label: "Engineering",
    greeting: "Describe the system, component or problem. I work through technical specifications, failure modes, tolerances and design trade-offs.",
    placeholder: "Ask Engineering…",
    tools: ["Analyse system", "Review tolerances", "Assess failure modes", "Check specifications", "Evaluate trade-offs"],
    responses: {
      default: "Describe the system or upload the specification and I will work through the technical considerations with you — checking tolerances, identifying potential failure modes and helping you think through the design trade-offs.",
      failure: "The most likely failure mode under those loading conditions is fatigue cracking at the weld toe. The stress concentration factor at that joint is approximately 2.4. You would want to review the weld geometry and consider post-weld treatment if fatigue life is critical.",
    },
  },
  industrial: {
    label: "Industrial",
    greeting: "Describe the process, equipment or operational challenge. I work through process design, capacity constraints, failure analysis and operational risk.",
    placeholder: "Ask Industrial…",
    tools: ["Analyse process", "Review capacity", "Assess equipment", "Identify bottlenecks", "Evaluate risk"],
    responses: {
      default: "Describe the process or upload the relevant documentation and I will work through it with you — identifying constraints, flagging risk factors and helping you think through the operational implications.",
      capacity: "Based on the cycle time and current shift pattern, your effective capacity is approximately 840 units per day. The bottleneck is at the second assembly station — it is running at 94% utilisation. Any unplanned downtime there will immediately affect throughput.",
    },
  },
  home: {
    label: "Home",
    greeting: "Describe your project, upload photos or share a floor plan. I can help with renovation scope, design decisions, specification and contractor briefing.",
    placeholder: "Ask Home…",
    tools: ["Scope renovation", "Review layout", "Specify finishes", "Brief contractor", "Estimate budget"],
    responses: {
      default: "Describe what you are working on or upload photos of the space. I will help you think through the scope, flag anything worth considering before you commit, and help you brief contractors clearly.",
      budget: "For a full kitchen renovation at that scale — new joinery, appliances, benchtops and splashback — you should budget between $35,000 and $65,000 depending on specification. The biggest variables are benchtop material and appliance brand.",
    },
  },
}

const planAnnotations = [
  { x: "28%", y: "35%", label: "Load bearing", active: false },
  { x: "55%", y: "48%", label: "Grid shift", active: false },
  { x: "70%", y: "62%", label: "Opening — review", active: true },
  { x: "42%", y: "72%", label: "Structural tie", active: false },
]

export default function BuildWorkspace() {
  const { domain = "build" } = useParams<{ domain: string }>()
  const config = domainConfig[domain] ?? domainConfig.build

  const getInitialMessages = (): Message[] => [
    { role: "ai", domain: config.label, text: config.greeting },
  ]

  const [messages, setMessages] = useState<Message[]>(getInitialMessages)
  const [input, setInput] = useState("")
  const [showPlan, setShowPlan] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [showTools, setShowTools] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: "user", text }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setIsThinking(true)

    await new Promise((r) => setTimeout(r, 1400))

    const lower = text.toLowerCase()
    let response: string
    const r = config.responses
    if (lower.includes("heritage") || lower.includes("zoning") || lower.includes("plan")) {
      response = r.zoning ?? r.heritage ?? r.structural ?? r.default
      setShowPlan(true)
      setShowTools(true)
    } else if (lower.includes("cost") || lower.includes("budget") || lower.includes("price") || lower.includes("estimate")) {
      response = r.cost ?? r.budget ?? r.returns ?? r.default
      setShowTools(true)
    } else if (lower.includes("rate") || lower.includes("debt") || lower.includes("model") || lower.includes("return")) {
      response = r.rates ?? r.returns ?? r.default
      setShowTools(true)
    } else if (lower.includes("material") || lower.includes("fabric") || lower.includes("interaction")) {
      response = r.materials ?? r.interaction ?? r.default
    } else if (lower.includes("fail") || lower.includes("capacity") || lower.includes("structural") || lower.includes("load")) {
      response = r.failure ?? r.capacity ?? r.structural ?? r.default
      setShowPlan(true)
      setShowTools(true)
    } else {
      response = r.default
    }

    setIsThinking(false)
    setMessages((m) => [...m, { role: "ai", domain: config.label, text: response }])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    setShowPlan(true)
    setShowTools(true)
    setMessages((m) => [
      ...m,
      { role: "user", text: "I have uploaded the floor plan." },
      {
        role: "ai",
        domain: config.label,
        text: "File received. I can see the uploaded document. What would you like to understand or work through?",
      },
    ])
  }

  return (
    <div className="h-screen bg-background font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center px-6 border-b border-border bg-surface shrink-0 z-30">
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <Link href="/app" className="text-muted hover:text-foreground transition-colors flex items-center gap-1.5">
            <MoldulusLogoMark />
            Moldulus
          </Link>
          <span className="text-border mx-0.5">/</span>
          <span className="font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            {config.label}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {showTools && (
            <div className="hidden md:flex items-center gap-2">
              {config.tools.map((t) => (
                <button
                  key={t}
                  onClick={() => sendMessage(t)}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-secondary hover:bg-border transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted">
            <MoreIcon />
          </button>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-[12px] font-700 ml-1">
            JD
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: conversation */}
        <div className="w-[380px] md:w-[420px] shrink-0 flex flex-col border-r border-border bg-surface">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-accent shrink-0 flex items-center justify-center mt-0.5">
                    <span className="text-white text-[10px] font-800">M</span>
                  </div>
                )}
                <div
                  className={`max-w-[88%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-foreground text-surface rounded-br-sm font-medium"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.role === "ai" && (
                    <span className="text-[11px] font-semibold text-accent block mb-1.5">{msg.domain}</span>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-accent shrink-0 flex items-center justify-center">
                  <span className="text-white text-[10px] font-800">M</span>
                </div>
                <div className="px-4 py-3.5 bg-secondary rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-accent think-dot"></div>
                  <div className="w-2 h-2 rounded-full bg-accent think-dot"></div>
                  <div className="w-2 h-2 rounded-full bg-accent think-dot"></div>
                </div>
              </div>
            )}
          </div>

          {/* Upload drop zone hint */}
          {!showPlan && (
            <div
              className={`mx-4 mb-3 p-4 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                dragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={() => {
                  setShowPlan(true)
                  setShowTools(true)
                  setMessages((m) => [
                    ...m,
                    { role: "user", text: "I have uploaded the floor plan." },
                    { role: "ai", domain: config.label, text: "File received. What would you like to understand or work through?" },
                  ])
                }}
              />
              <div className="flex items-center gap-3 text-muted">
                <UploadIcon />
                <span className="text-[13px] font-medium">Upload a plan, drawing or document</span>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-5 pt-2 border-t border-border">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input) }}
                placeholder={config.placeholder}
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-[15px] font-medium placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/12 transition-all"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() ? "bg-accent text-white hover:bg-accent-hover" : "bg-secondary text-muted"
                }`}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Right: work area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {showPlan ? (
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=900&fit=crop&auto=format"
                  alt="Architectural floor plan"
                  className="w-full h-full object-cover object-center"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-background/10" />
              </div>

              {/* Annotation overlays */}
              {planAnnotations.map((a) => (
                <div
                  key={a.label}
                  className="absolute flex items-center gap-1.5"
                  style={{ left: a.x, top: a.y, transform: "translate(-50%, -50%)" }}
                >
                  <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${a.active ? "bg-error" : "bg-accent"}`}></div>
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-md shadow-sm whitespace-nowrap ${
                    a.active ? "bg-error/90 text-white" : "bg-white/95 text-foreground"
                  }`}>
                    {a.label}
                  </span>
                </div>
              ))}

              {/* Plan info bar */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-surface/95 backdrop-blur-sm border border-border rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
                  <span className="text-[12px] font-semibold text-muted">Floor plan</span>
                  <span className="text-border">·</span>
                  <span className="text-[12px] font-medium text-foreground">Level 1 — Residential</span>
                </div>
                <div className="bg-surface/95 backdrop-blur-sm border border-border rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-error"></div>
                  <span className="text-[12px] font-semibold text-foreground">1 item needs review</span>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div
              className="flex-1 flex flex-col items-center justify-center p-12 text-center"
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <div
                className={`w-full max-w-md p-10 rounded-2xl border-2 border-dashed transition-all duration-200 ${
                  dragging ? "border-accent bg-accent/5" : "border-border"
                }`}
              >
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                    <UploadIcon size={24} />
                  </div>
                </div>
                <h2 className="text-[22px] font-800 text-foreground tracking-tight mb-2">
                  Start with a plan, document or question.
                </h2>
                <p className="text-[15px] font-medium text-muted mb-6">
                  Drag a file here or use the panel on the left to get started.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-3 rounded-xl bg-accent text-white text-[14px] font-semibold hover:bg-accent-hover transition-colors"
                  >
                    Upload a plan
                  </button>
                  <button
                    onClick={() => sendMessage("What should I start with for a new residential project?")}
                    className="px-5 py-3 rounded-xl border border-border text-[14px] font-semibold hover:bg-secondary transition-colors"
                  >
                    Ask Build
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MoldulusLogoMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#111111" />
      <rect x="8" y="8" width="7" height="7" rx="1.5" fill="white" />
      <rect x="17" y="8" width="7" height="7" rx="1.5" fill="white" opacity="0.5" />
      <rect x="8" y="17" width="7" height="7" rx="1.5" fill="white" opacity="0.5" />
      <rect x="17" y="17" width="7" height="7" rx="1.5" fill="#4D5BFF" />
    </svg>
  )
}

function UploadIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 13V3m0 0L6 7m4-4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="3" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="13" cy="8" r="1.5" fill="currentColor" />
    </svg>
  )
}
