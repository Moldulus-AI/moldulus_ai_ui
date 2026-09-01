import Link from "next/link"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Moldulus", href: "/" },
      { label: "Intelligence", href: "/intelligence" },
      { label: "Systems", href: "/systems" },
      { label: "Enterprise", href: "/enterprise" },
    ],
  },
  {
    title: "Intelligence",
    links: [
      { label: "Build", href: "/intelligence/build" },
      { label: "Property", href: "/intelligence/property" },
      { label: "Finance", href: "/intelligence/finance" },
      { label: "Health", href: "/intelligence/health" },
      { label: "Fashion", href: "/intelligence/fashion" },
      { label: "Engineering", href: "/intelligence/engineering" },
      { label: "Industrial", href: "/intelligence/industrial" },
      { label: "Home", href: "/intelligence/home" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Research", href: "/research" },
      { label: "Developers", href: "/developers" },
      { label: "Documentation", href: "/developers" },
      { label: "Security", href: "/company" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Careers", href: "/company" },
      { label: "News", href: "/company" },
      { label: "Contact", href: "/company" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/company" },
      { label: "Terms", href: "/company" },
      { label: "Accessibility", href: "/company" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-graphite text-white/70">
      <div className="max-w-[1320px] mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-[12px] font-700 text-white/40 uppercase tracking-widest mb-4">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] font-medium text-white/65 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.12" />
              <rect x="8" y="8" width="7" height="7" rx="1.5" fill="white" />
              <rect x="17" y="8" width="7" height="7" rx="1.5" fill="white" opacity="0.45" />
              <rect x="8" y="17" width="7" height="7" rx="1.5" fill="white" opacity="0.45" />
              <rect x="17" y="17" width="7" height="7" rx="1.5" fill="#4D5BFF" />
            </svg>
            <span className="text-[15px] font-bold text-white">Moldulus</span>
          </div>
          <p className="text-[13px] text-white/40">
            © {new Date().getFullYear()} Moldulus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
