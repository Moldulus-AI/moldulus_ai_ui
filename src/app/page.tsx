"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

const heroScenes = [
  {
    domain: "Build",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&h=1000&fit=crop&auto=format",
    headline: "AI that knows the work.",
    subtext: "General AI is trained on everything. Moldulus is trained on your discipline.",
    card: { title: "Load review", value: "3 elements flagged", note: "South wall — confirm before proceeding" },
    badge: "Build",
  },
  {
    domain: "Property",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&h=1000&fit=crop&auto=format",
    headline: "What the listing does not tell you.",
    subtext: "Planning history, council records, comparable sales, risk signals — without the research.",
    card: { title: "Site analysis", value: "Zoning R2 confirmed", note: "No heritage overlay. Development potential: medium." },
    badge: "Property",
  },
  {
    domain: "Finance",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1800&h=1000&fit=crop&auto=format",
    headline: "The number is the easy part.",
    subtext: "The assumptions behind it are where deals break. Moldulus Finance works through both.",
    card: { title: "Cash flow model", value: "Year 3: positive", note: "Sensitivity to rate +2% — review debt schedule" },
    badge: "Finance",
  },
  {
    domain: "Fashion",
    image: "https://images.unsplash.com/photo-1753164597585-6d42636ea099?w=1800&h=1000&fit=crop&auto=format",
    headline: "The distance from idea to garment.",
    subtext: "Reference research, concept development, and technical specification — worked through together.",
    card: { title: "Collection brief", value: "8 directions explored", note: "3 selected for development. Sampling next." },
    badge: "Fashion",
  },
]

const intelligenceDomains = [
  {
    name: "Build",
    desc: "Reads plans, understands structural logic, knows the regulatory layer. Ask it what a general AI cannot tell you.",
    img: "https://images.unsplash.com/photo-1617788587804-10346bac2ac3?w=700&h=500&fit=crop&auto=format",
    href: "/intelligence/build",
    span: "col-span-2 row-span-2",
  },
  {
    name: "Property",
    desc: "Planning history, zoning constraints, recent sales. Before you make an offer.",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop&auto=format",
    href: "/intelligence/property",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Finance",
    desc: "Models, stress tests, and explains the assumptions. Thinks through the structure with you.",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&auto=format",
    href: "/intelligence/finance",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Health",
    desc: "Clinical literature, drug interactions, diagnostic reasoning. For practitioners who need precision.",
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&auto=format",
    href: "/intelligence/health",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Fashion",
    desc: "Works through the design process — from reference and concept to technical spec.",
    img: "https://images.unsplash.com/photo-1753164597585-6d42636ea099?w=600&h=400&fit=crop&auto=format",
    href: "/intelligence/fashion",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Engineering",
    desc: "Systems, tolerances, failure modes. The kind of reasoning that takes time to do right.",
    img: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?w=700&h=400&fit=crop&auto=format",
    href: "/intelligence/engineering",
    span: "col-span-2 row-span-1",
  },
  {
    name: "Industrial",
    desc: "Process design, equipment constraints, operational risk. Built for industrial context.",
    img: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?w=600&h=400&fit=crop&auto=format",
    href: "/intelligence/industrial",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Home",
    desc: "Renovation scope, interior decisions, contractor briefing. For the home you are actually working on.",
    img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&h=400&fit=crop&auto=format",
    href: "/intelligence/home",
    span: "col-span-1 row-span-1",
  },
]

const demoExchanges = [
  {
    domain: "Build",
    color: "#4D5BFF",
    q: "The south-west corner feels wrong — the columns don't align with the loading above.",
    a: "You are right. There is a 400mm offset between the upper-level beam and the column below it. That transfers load eccentrically. You will need to either reposition the column or introduce a transfer beam at level 2. Flag this with your engineer before you go further.",
  },
  {
    domain: "Property",
    color: "#22C55E",
    q: "Is there anything in the planning history that would make this hard to develop?",
    a: "Three previous applications on this site — two approved, one refused in 2019 for excessive height. The refusal cited impact on the adjoining heritage item. That constraint is still active. Any proposal over three storeys will need a heritage impact statement.",
  },
  {
    domain: "Finance",
    color: "#F59E0B",
    q: "At what point does this deal stop working if rates go higher?",
    a: "The model breaks at around 7.2% on the senior debt. Above that, the debt service coverage ratio drops below 1.0 in year two and the deal is cash-flow negative before stabilisation. That is a 140bps cushion from current market rates — workable, but thin. I would look at extending the IO period.",
  },
]

export default function HomePage() {
  const [sceneIdx, setSceneIdx] = useState(0)
  const [fade, setFade] = useState(true)
  const [demoIdx, setDemoIdx] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setSceneIdx(i => (i + 1) % heroScenes.length)
        setFade(true)
      }, 500)
    }, 6000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const goToScene = (i: number) => {
    if (i === sceneIdx) return
    setFade(false)
    setTimeout(() => { setSceneIdx(i); setFade(true) }, 300)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setSceneIdx(prev => (prev + 1) % heroScenes.length)
        setFade(true)
      }, 500)
    }, 6000)
  }

  const scene = heroScenes[sceneIdx]

  return (
    <div className="min-h-screen bg-background font-sans page-enter">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            key={scene.image}
            src={scene.image}
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ opacity: fade ? 1 : 0, transition: "opacity 0.6s ease" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-graphite/65 via-graphite/45 to-graphite/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-graphite/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1 max-w-[1400px] mx-auto px-6 w-full pt-40 pb-16">
          <div className="mb-6" style={{ opacity: fade ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-[12px] font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              {scene.badge} Intelligence
            </span>
          </div>

          <h1
            className="text-[clamp(42px,6.5vw,90px)] font-800 text-white tracking-tight leading-[1.04] mb-6 max-w-3xl"
            style={{ opacity: fade ? 1 : 0, transition: "opacity 0.5s ease 0.15s" }}
          >
            {scene.headline}
          </h1>

          <p
            className="text-[18px] font-medium text-white/70 max-w-xl leading-relaxed mb-10"
            style={{ opacity: fade ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}
          >
            {scene.subtext}
          </p>

          <div className="w-full max-w-2xl mb-12">
            <HeroInput />
          </div>

          {/* Floating intelligence card */}
          <div
            className="absolute bottom-24 right-10 hidden lg:block"
            style={{ opacity: fade ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}
          >
            <div className="w-72 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-800">M</span>
                <span className="text-[11px] font-bold text-accent uppercase tracking-widest">{scene.badge}</span>
              </div>
              <div className="text-[15px] font-bold text-white mb-1">{scene.card.title}</div>
              <div className="text-[13px] font-semibold text-white/90 mb-2">{scene.card.value}</div>
              <div className="text-[12px] text-white/55 leading-snug">{scene.card.note}</div>
            </div>
          </div>

          {/* Scene dots */}
          <div className="flex items-center gap-4 mt-auto">
            {heroScenes.map((s, i) => (
              <button
                key={s.domain}
                onClick={() => goToScene(i)}
                className="flex items-center gap-2 group"
              >
                <span
                  className="block h-[3px] rounded-full transition-all duration-300"
                  style={{
                    width: i === sceneIdx ? 28 : 14,
                    background: i === sceneIdx ? "white" : "rgba(255,255,255,0.35)",
                  }}
                />
                <span className={`text-[12px] font-semibold transition-colors duration-200 ${i === sceneIdx ? "text-white" : "text-white/40 group-hover:text-white/70"}`}>
                  {s.domain}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* INTELLIGENCE GRID */}
      <section className="px-6 py-24 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[13px] font-semibold text-accent uppercase tracking-widest mb-3">Intelligence</p>
            <h2 className="text-[clamp(32px,4vw,52px)] font-800 text-foreground tracking-tight leading-[1.1]">
              Depth requires<br />specialisation.
            </h2>
          </div>
          <Link href="/intelligence" className="hidden md:flex items-center gap-2 text-[14px] font-semibold text-muted hover:text-accent transition-colors">
            Explore all
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[220px]">
          {intelligenceDomains.map((d) => (
            <Link
              key={d.name}
              href={d.href}
              className={`relative overflow-hidden rounded-2xl bg-secondary group ${d.span}`}
            >
              <img
                src={d.img}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-[16px] font-800 text-white mb-1">{d.name}</div>
                <div className="text-[13px] text-white/65 font-medium leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-200">{d.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DEMO CONVERSATIONS */}
      <section className="bg-graphite py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
            <div>
              <p className="text-[13px] font-semibold text-accent uppercase tracking-widest mb-5">In practice</p>
              <h2 className="text-[clamp(30px,3.5vw,48px)] font-800 text-white tracking-tight leading-[1.12] mb-6">
                It knows the difference between a question and a problem.
              </h2>
              <p className="text-[17px] font-medium text-white/55 leading-relaxed mb-10">
                A general AI answers what you asked. Moldulus understands what you are dealing with. The distinction matters when the stakes are real.
              </p>
              <div className="flex gap-3 flex-wrap">
                {demoExchanges.map((ex, i) => (
                  <button
                    key={ex.domain}
                    onClick={() => setDemoIdx(i)}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                      demoIdx === i ? "bg-white text-graphite" : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {ex.domain}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-graphite-mid rounded-2xl p-7 border border-white/10">
              <div className="mb-5 flex items-center gap-2">
                <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: demoExchanges[demoIdx].color }}>
                  {demoExchanges[demoIdx].domain}
                </span>
              </div>
              <div className="flex justify-end mb-4">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-sm bg-white/10 border border-white/10">
                  <p className="text-[15px] font-medium text-white/90 leading-relaxed">{demoExchanges[demoIdx].q}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent shrink-0 flex items-center justify-center mt-0.5">
                  <span className="text-white text-[11px] font-800">M</span>
                </div>
                <div className="flex-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-white/6 border border-white/8">
                  <p className="text-[15px] font-medium text-white/80 leading-relaxed">{demoExchanges[demoIdx].a}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { stat: "8", label: "Domain intelligences", sub: "Built separately, not adapted" },
              { stat: "40+", label: "Professional disciplines", sub: "Covered across the eight domains" },
              { stat: "SOC 2", label: "Type II certified", sub: "Your data is not used for training" },
              { stat: "API", label: "Full API access", sub: "Integrate into any workflow" },
            ].map(item => (
              <div key={item.stat}>
                <div className="text-[40px] font-800 text-foreground tracking-tight leading-none mb-1">{item.stat}</div>
                <div className="text-[14px] font-semibold text-foreground mb-1">{item.label}</div>
                <div className="text-[13px] font-medium text-muted">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-[clamp(38px,5vw,72px)] font-800 text-foreground tracking-tight leading-[1.06] mb-6 max-w-3xl mx-auto">
            Bring the actual problem.
          </h2>
          <p className="text-[18px] font-medium text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            You do not need to configure anything or choose an intelligence. Describe what you are working on. Moldulus handles the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="px-8 py-4 rounded-full bg-accent text-white text-[16px] font-semibold hover:bg-accent-hover transition-colors shadow-lg">
              Get started
            </Link>
            <Link href="/intelligence" className="px-8 py-4 rounded-full border border-border text-[16px] font-semibold text-foreground hover:bg-secondary transition-colors">
              See all intelligence
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function HeroInput() {
  const [val, setVal] = useState("")
  const [phIdx, setPhIdx] = useState(0)
  const placeholders = [
    "What load-bearing constraints should I know about before I modify this wall?",
    "What does the planning history on this site tell me?",
    "Walk me through the debt service assumptions in this model.",
    "I need fabric options for a summer collection — sustainable, mid-range cost.",
  ]
  useEffect(() => {
    const t = setInterval(() => setPhIdx(i => (i + 1) % placeholders.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 shadow-2xl focus-within:border-white/40 transition-all">
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholders[phIdx]}
        className="flex-1 bg-transparent text-white text-[16px] font-medium placeholder:text-white/40 focus:outline-none"
      />
      <button className="shrink-0 w-10 h-10 rounded-xl bg-accent hover:bg-accent-hover flex items-center justify-center transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8l6-6 6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
