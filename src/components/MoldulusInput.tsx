"use client"

import { useState, forwardRef } from "react"
import { useRouter } from "next/navigation"

interface MoldulusInputProps {
  placeholder?: string
  size?: "default" | "large"
  onFocus?: () => void
  onBlur?: () => void
  className?: string
  redirectToApp?: boolean
}

const MoldulusInput = forwardRef<HTMLInputElement, MoldulusInputProps>(
  ({ placeholder = "Ask Moldulus anything…", size = "default", onFocus, onBlur, className = "", redirectToApp = true }, ref) => {
    const [value, setValue] = useState("")
    const router = useRouter()

    const isLarge = size === "large"

    const handleSubmit = () => {
      if (!value.trim()) return
      if (redirectToApp) router.push("/app")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit()
    }

    return (
      <div
        className={`group relative flex items-center bg-surface rounded-2xl border border-border
          hover:border-accent/40 focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/12
          transition-all duration-200 shadow-sm hover:shadow-md ${
          isLarge ? "px-5 py-4 gap-4" : "px-4 py-3 gap-3"
        } ${className}`}
      >
        {/* Attach button */}
        <button
          type="button"
          aria-label="Attach file"
          className="shrink-0 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-secondary transition-colors"
        >
          <AttachIcon size={isLarge ? 20 : 18} />
        </button>

        {/* Text input */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted/60 font-medium ${
            isLarge ? "text-[18px]" : "text-[16px]"
          }`}
        />

        {/* Voice button */}
        <button
          type="button"
          aria-label="Voice input"
          className="shrink-0 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-secondary transition-colors"
        >
          <MicIcon size={isLarge ? 20 : 18} />
        </button>

        {/* Send button */}
        <button
          type="button"
          aria-label="Send"
          onClick={handleSubmit}
          className={`shrink-0 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center
            ${value.trim()
              ? "bg-accent text-white hover:bg-accent-hover shadow-sm"
              : "bg-secondary text-muted cursor-default"
            } ${isLarge ? "w-11 h-11 text-[17px]" : "w-9 h-9 text-[15px]"}`}
        >
          <SendIcon size={isLarge ? 18 : 16} />
        </button>
      </div>
    )
  }
)

MoldulusInput.displayName = "MoldulusInput"
export default MoldulusInput

function AttachIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M17 10.5l-7.5 7.5a5 5 0 01-7.07-7.07L10 3.36a3.33 3.33 0 014.71 4.71L7.13 15.7a1.67 1.67 0 01-2.36-2.36l7-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MicIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="7" y="2" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10a6 6 0 0012 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="16" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="18" x2="13" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SendIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
