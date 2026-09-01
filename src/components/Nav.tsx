"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const domains = [
  { name: "Build", tagline: "Understand before you build.", href: "/intelligence/build", img: "https://images.unsplash.com/photo-1617788587804-10346bac2ac3?w=400&h=260&fit=crop&auto=format" },
  { name: "Property", tagline: "See more in every property.", href: "/intelligence/property", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=260&fit=crop&auto=format" },
  { name: "Finance", tagline: "Understand the numbers in context.", href: "/intelligence/finance", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=260&fit=crop&auto=format" },
  { name: "Health", tagline: "Clarity for complex health information.", href: "/intelligence/health", img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=260&fit=crop&auto=format" },
  { name: "Fashion", tagline: "From idea to form.", href: "/intelligence/fashion", img: "https://images.unsplash.com/photo-1753164597585-6d42636ea099?w=400&h=260&fit=crop&auto=format" },
  { name: "Engineering", tagline: "Work through complexity.", href: "/intelligence/engineering", img: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?w=400&h=260&fit=crop&auto=format" },
  { name: "Industrial", tagline: "Intelligence for physical operations.", href: "/intelligence/industrial", img: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?w=400&h=260&fit=crop&auto=format" },
  { name: "Home", tagline: "Intelligence for the spaces you live in.", href: "/intelligence/home", img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=260&fit=crop&auto=format" },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const isApp = pathname?.startsWith("/app") ?? false

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: close menus on route change
  useEffect(() => { setMobileOpen(false); setMegaOpen(false) }, [pathname])

  const openMega = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMegaOpen(true) }
  const closeMega = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 150) }

  if (isApp) return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 flex items-center px-6 border-b border-border bg-surface">
      <Link href="/app" className="flex items-center gap-2">
        <Logo size={22} /><span className="text-sm font-semibold text-foreground">Moldulus</span>
        <span className="text-border mx-1">/</span>
        <span className="text-sm font-medium text-muted">Build</span>
      </Link>
      <div className="ml-auto flex items-center gap-3">
        <button className="text-sm font-medium text-muted hover:text-foreground transition-colors">History</button>
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">JD</div>
      </div>
    </header>
  )

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-background/90 backdrop-blur-sm"}`}>
        <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Logo size={26} />
            <span className="text-[16px] font-bold text-foreground tracking-tight">Moldulus</span>
          </Link>

          {/* Desktop nav — visible from md breakpoint */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {/* Intelligence with megamenu */}
            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button
                className={`px-3 py-2 text-[14px] font-semibold rounded-lg transition-colors flex items-center gap-1 ${megaOpen ? "text-accent bg-accent/6" : "text-foreground hover:bg-secondary"}`}
                onClick={() => setMegaOpen(v => !v)}
              >
                Intelligence
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${megaOpen ? "rotate-180" : ""}`}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {["Solutions","Systems","Research","Enterprise","Developers","Company"].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`}
                className={`px-3 py-2 text-[14px] font-semibold rounded-lg transition-colors ${pathname === `/${item.toLowerCase()}` ? "text-accent" : "text-foreground hover:bg-secondary"}`}>
                {item}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2 ml-auto shrink-0">
            <Link href="/signin" className="px-3 py-2 text-[14px] font-semibold text-foreground hover:text-accent transition-colors">Sign in</Link>
            <Link href="/signup" className="px-5 py-2 rounded-full bg-accent text-white text-[14px] font-semibold hover:bg-accent-hover transition-colors">Try Moldulus</Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden ml-auto p-2 rounded-lg hover:bg-secondary transition-colors" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <XIcon /> : <BurgerIcon />}
          </button>
        </div>

        {/* Mega menu */}
        {megaOpen && (
          <div className="absolute inset-x-0 top-full bg-white border-b border-border shadow-xl menu-slide-down" onMouseEnter={openMega} onMouseLeave={closeMega}>
            <div className="max-w-[1400px] mx-auto px-5 py-6">
              <div className="grid grid-cols-4 gap-3 mb-5">
                {domains.map(d => (
                  <Link key={d.name} href={d.href} className="group relative overflow-hidden rounded-xl bg-secondary border border-border hover:border-accent/30 transition-all duration-200" onClick={() => setMegaOpen(false)}>
                    <div className="aspect-[3/2] overflow-hidden bg-secondary">
                      <img src={d.img} alt={d.name} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="px-3.5 py-3">
                      <div className="text-[13px] font-bold text-foreground mb-0.5">{d.name}</div>
                      <div className="text-[12px] text-muted font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 leading-snug">{d.tagline}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Link href="/intelligence" className="text-[13px] font-semibold text-accent hover:underline" onClick={() => setMegaOpen(false)}>Explore all Intelligence →</Link>
                <Link href="/signup" className="px-5 py-2 rounded-full bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-colors" onClick={() => setMegaOpen(false)}>Try Moldulus free</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden flex flex-col">
          <div className="flex items-center justify-between px-5 h-16 border-b border-border">
            <Link href="/" className="flex items-center gap-2"><Logo size={24} /><span className="text-[16px] font-bold">Moldulus</span></Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-secondary"><XIcon /></button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
            <MobItem href="/intelligence" label="Intelligence" />
            <div className="pl-4 space-y-0.5 pb-2">
              {domains.map(d => <Link key={d.name} href={d.href} className="block py-2 px-3 text-[15px] text-muted font-medium hover:text-foreground">{d.name}</Link>)}
            </div>
            {["Solutions","Systems","Research","Enterprise","Developers","Company"].map(item => (
              <MobItem key={item} href={`/${item.toLowerCase()}`} label={item} />
            ))}
          </nav>
          <div className="px-5 pb-8 pt-4 border-t border-border space-y-3">
            <Link href="/signin" className="block w-full py-3.5 rounded-full border border-border text-center text-[15px] font-semibold hover:bg-secondary transition-colors">Sign in</Link>
            <Link href="/signup" className="block w-full py-3.5 rounded-full bg-accent text-white text-center text-[15px] font-semibold hover:bg-accent-hover transition-colors">Try Moldulus</Link>
          </div>
        </div>
      )}
    </>
  )
}

function MobItem({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="block py-3 px-3 text-[17px] font-semibold text-foreground hover:text-accent hover:bg-secondary rounded-xl transition-colors">{label}</Link>
}

function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#111111"/>
      <rect x="8" y="8" width="7" height="7" rx="1.5" fill="white"/>
      <rect x="17" y="8" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
      <rect x="8" y="17" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
      <rect x="17" y="17" width="7" height="7" rx="1.5" fill="#4D5BFF"/>
    </svg>
  )
}

function BurgerIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}

function XIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
