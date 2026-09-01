"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const domainOptions = [
  {
    id: "build",
    name: "Build",
    desc: "Construction, architecture, structural",
    img: "https://images.unsplash.com/photo-1617788587804-10346bac2ac3?w=400&h=280&fit=crop&auto=format",
  },
  {
    id: "property",
    name: "Property",
    desc: "Real estate, development, investment",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=280&fit=crop&auto=format",
  },
  {
    id: "finance",
    name: "Finance",
    desc: "Modelling, investment, financial analysis",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=280&fit=crop&auto=format",
  },
  {
    id: "health",
    name: "Health",
    desc: "Clinical, medical, health professional",
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=280&fit=crop&auto=format",
  },
  {
    id: "fashion",
    name: "Fashion",
    desc: "Design, garment, collection development",
    img: "https://images.unsplash.com/photo-1761746395622-5f7e0e7b4ec7?w=400&h=280&fit=crop&auto=format",
  },
  {
    id: "engineering",
    name: "Engineering",
    desc: "Systems, technical, mechanical",
    img: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?w=400&h=280&fit=crop&auto=format",
  },
  {
    id: "industrial",
    name: "Industrial",
    desc: "Operations, manufacturing, process",
    img: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?w=400&h=280&fit=crop&auto=format",
  },
  {
    id: "home",
    name: "Home",
    desc: "Renovation, interiors, specification",
    img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=280&fit=crop&auto=format",
  },
]

export default function SignUpPage() {
  const [step, setStep] = useState<"account" | "interests" | "name">("account")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const router = useRouter()

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setStep("interests")
  }

  const handleInterestsContinue = () => {
    if (selected.size > 0) setStep("name")
  }

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/app")
  }

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <header className="flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-2">
          <MoldulusLogo />
          <span className="text-[17px] font-bold text-foreground">Moldulus</span>
        </Link>
        {step === "account" && (
          <Link href="/signin" className="text-[15px] font-medium text-muted hover:text-foreground transition-colors">
            Sign in
          </Link>
        )}
      </header>

      {/* Step: Account */}
      {step === "account" && (
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px]">
            <h1 className="text-[clamp(34px,5vw,50px)] font-800 text-foreground tracking-tight leading-tight mb-2">
              Create your account.
            </h1>
            <p className="text-[16px] font-medium text-muted mb-10">
              Access every Moldulus intelligence from one place.
            </p>

            <div className="space-y-3 mb-6">
              <SocialButton label="Continue with Google" icon={<GoogleIcon />} onClick={() => setStep("interests")} />
              <SocialButton label="Continue with Apple" icon={<AppleIcon />} onClick={() => setStep("interests")} />
              <SocialButton label="Continue with Microsoft" icon={<MicrosoftIcon />} onClick={() => setStep("interests")} />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[13px] font-medium text-muted">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleAccountSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full px-5 py-4 rounded-xl border border-border bg-surface text-[16px] font-medium placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/12 transition-all"
              />
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-accent text-white text-[16px] font-semibold hover:bg-accent-hover transition-colors"
              >
                Continue
              </button>
            </form>

            <p className="mt-6 text-[12px] font-medium text-muted text-center leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="/company" className="text-foreground hover:text-accent transition-colors">Terms</Link>
              {" "}and{" "}
              <Link href="/company" className="text-foreground hover:text-accent transition-colors">Privacy Policy</Link>.
            </p>
            <p className="mt-4 text-[13px] font-medium text-muted text-center">
              Already have an account?{" "}
              <Link href="/signin" className="text-accent hover:text-accent-hover transition-colors">Sign in</Link>
            </p>
          </div>
        </main>
      )}

      {/* Step: Interests */}
      {step === "interests" && (
        <main className="flex-1 flex flex-col items-center px-6 py-10">
          <div className="w-full max-w-[780px]">
            <div className="text-center mb-8">
              <h1 className="text-[clamp(28px,4vw,44px)] font-800 text-foreground tracking-tight leading-tight mb-2">
                What do you work on?
              </h1>
              <p className="text-[16px] font-medium text-muted">
                Select every area that applies. Moldulus will prioritise these intelligences for you.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {domainOptions.map(d => {
                const on = selected.has(d.id)
                return (
                  <button
                    key={d.id}
                    onClick={() => toggle(d.id)}
                    className={`relative overflow-hidden rounded-2xl text-left transition-all duration-200 group ${
                      on ? "ring-2 ring-accent ring-offset-2" : "ring-1 ring-border hover:ring-accent/40"
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-secondary">
                      <img
                        src={d.img}
                        alt={d.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${on ? "scale-105" : "group-hover:scale-103"}`}
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 transition-opacity duration-200 ${on ? "bg-accent/20" : "bg-transparent"}`} />
                    </div>
                    <div className={`px-3 py-3 transition-colors ${on ? "bg-accent text-white" : "bg-surface"}`}>
                      <div className={`text-[13px] font-800 ${on ? "text-white" : "text-foreground"}`}>{d.name}</div>
                      <div className={`text-[11px] font-medium mt-0.5 ${on ? "text-white/75" : "text-muted"}`}>{d.desc}</div>
                    </div>
                    {on && (
                      <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-accent border-2 border-white flex items-center justify-center shadow">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-muted">
                {selected.size === 0 ? "Select at least one" : `${selected.size} selected`}
              </span>
              <button
                onClick={handleInterestsContinue}
                disabled={selected.size === 0}
                className={`px-8 py-3.5 rounded-full text-[15px] font-semibold transition-all ${
                  selected.size > 0
                    ? "bg-accent text-white hover:bg-accent-hover shadow-sm"
                    : "bg-secondary text-muted cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Step: Name */}
      {step === "name" && (
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px]">
            <h1 className="text-[clamp(34px,5vw,50px)] font-800 text-foreground tracking-tight leading-tight mb-2">
              What should we call you?
            </h1>
            <p className="text-[16px] font-medium text-muted mb-10">
              Just your first name is fine.
            </p>
            <form onSubmit={handleFinish} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="First name"
                required
                autoFocus
                className="w-full px-5 py-4 rounded-xl border border-border bg-surface text-[16px] font-medium placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/12 transition-all"
              />
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-accent text-white text-[16px] font-semibold hover:bg-accent-hover transition-colors"
              >
                Go to Moldulus
              </button>
            </form>
          </div>
        </main>
      )}

      {/* Step indicator */}
      {step !== "account" && (
        <div className="pb-8 flex justify-center gap-2">
          {["account","interests","name"].map((s, i) => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? "w-6 bg-accent" : i < ["account","interests","name"].indexOf(step) ? "w-4 bg-accent/40" : "w-4 bg-border"}`} />
          ))}
        </div>
      )}
    </div>
  )
}

function SocialButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center justify-center gap-3 py-4 px-5 rounded-xl border border-border bg-surface text-[15px] font-semibold hover:bg-secondary transition-colors">
      {icon}
      {label}
    </button>
  )
}

function MoldulusLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#111111"/>
      <rect x="8" y="8" width="7" height="7" rx="1.5" fill="white"/>
      <rect x="17" y="8" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
      <rect x="8" y="17" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
      <rect x="17" y="17" width="7" height="7" rx="1.5" fill="#4D5BFF"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2a10.3 10.3 0 0 0-.164-1.84H9v3.48h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.614Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A9.005 9.005 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M14.88 9.555c-.014-2.027 1.655-3.008 1.729-3.053C15.565 4.565 13.462 4.3 12.71 4.293c-1.611-.163-3.15 1.05-3.97 1.05-.826 0-2.11-1.03-3.467-1.001-1.775.028-3.4 1.075-4.313 2.728-1.846 3.2-.475 7.937 1.323 10.533.885 1.272 1.927 2.703 3.294 2.65 1.33-.054 1.83-.857 3.435-.857 1.608 0 2.068.857 3.471.828 1.43-.026 2.332-1.29 3.21-2.57.998-1.484 1.41-2.92 1.43-2.993-.031-.011-2.756-1.056-2.773-4.126Z" fill="currentColor"/>
      <path d="M11.762 2.93C12.486 2.044 12.972.849 12.83 0c-.994.044-2.182.674-2.935 1.553-.638.742-1.21 1.938-1.054 3.082 1.106.085 2.23-.563 2.92-1.706Z" fill="currentColor"/>
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="7.5" height="7.5" fill="#F25022"/>
      <rect x="9.5" y="1" width="7.5" height="7.5" fill="#7FBA00"/>
      <rect x="1" y="9.5" width="7.5" height="7.5" fill="#00A4EF"/>
      <rect x="9.5" y="9.5" width="7.5" height="7.5" fill="#FFB900"/>
    </svg>
  )
}
