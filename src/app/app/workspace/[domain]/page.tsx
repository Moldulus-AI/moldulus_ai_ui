"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

interface Attachment {
  id: string
  name: string
  kind: "text" | "image"
  text?: string // kind === "text": file contents (truncated)
  dataUrl?: string // kind === "image": preview + payload
}

interface UiMessage {
  id: string
  role: "user" | "ai"
  text: string
  domain?: string
  attachments?: Attachment[]
  error?: boolean
  greeting?: boolean // UI-only welcome message, never sent to the model
}

type Health = { ok: boolean; ollama?: string; model?: string; modelInstalled?: boolean; vision?: { installed: boolean } | null }

/* ----------------------------------------------------------------------------
 * Per-domain UI copy (the AI behaviour itself lives in src/lib/prompts.ts)
 * ------------------------------------------------------------------------- */

const domainConfig: Record<string, { label: string; greeting: string; placeholder: string; tools: string[] }> = {
  build: {
    label: "Build",
    greeting: "Start with a plan, document or question. Attach a drawing or describe what you are working on.",
    placeholder: "Ask Build…",
    tools: ["Analyse plan", "Review layout", "Explore materials", "Estimate costs", "Identify considerations"],
  },
  property: {
    label: "Property",
    greeting: "Share an address, planning document or question about a property. I can work through planning history, zoning, comparable sales and development potential.",
    placeholder: "Ask Property…",
    tools: ["Check zoning", "Review planning history", "Find comparables", "Assess development potential", "Flag constraints"],
  },
  finance: {
    label: "Finance",
    greeting: "Share a financial model, deal structure or question. I can work through the numbers, stress-test assumptions and explain what the structure means in practice.",
    placeholder: "Ask Finance…",
    tools: ["Review debt structure", "Stress test assumptions", "Model cash flows", "Assess coverage ratios", "Scenario analysis"],
  },
  health: {
    label: "Health",
    greeting: "Describe the clinical question, patient scenario or research area. I work with medical literature, drug interactions, diagnostic reasoning and clinical guidelines.",
    placeholder: "Ask Health…",
    tools: ["Review literature", "Check interactions", "Assess differential", "Summarise guidelines", "Evaluate evidence"],
  },
  fashion: {
    label: "Fashion",
    greeting: "Share a brief, reference image or concept. I can help develop the direction, research references, and work through to technical specification.",
    placeholder: "Ask Fashion…",
    tools: ["Develop concept", "Research references", "Specify materials", "Write tech pack", "Review construction"],
  },
  engineering: {
    label: "Engineering",
    greeting: "Describe the system, component or problem. I work through technical specifications, failure modes, tolerances and design trade-offs.",
    placeholder: "Ask Engineering…",
    tools: ["Analyse system", "Review tolerances", "Assess failure modes", "Check specifications", "Evaluate trade-offs"],
  },
  industrial: {
    label: "Industrial",
    greeting: "Describe the process, equipment or operational challenge. I work through process design, capacity constraints, failure analysis and operational risk.",
    placeholder: "Ask Industrial…",
    tools: ["Analyse process", "Review capacity", "Assess equipment", "Identify bottlenecks", "Evaluate risk"],
  },
  home: {
    label: "Home",
    greeting: "Describe your project, attach photos or share a floor plan. I can help with renovation scope, design decisions, specification and contractor briefing.",
    placeholder: "Ask Home…",
    tools: ["Scope renovation", "Review layout", "Specify finishes", "Brief contractor", "Estimate budget"],
  },
}

const TEXT_EXTENSIONS = /\.(txt|md|markdown|csv|tsv|json|xml|html?|log|ya?ml|ini|toml|js|ts|tsx|jsx|py|sql)$/i
const MAX_TEXT_CHARS = 20_000
const MAX_ATTACHMENTS = 4

const uid = () => Math.random().toString(36).slice(2, 10)
const stripThinking = (t: string) => t.replace(/<think>[\s\S]*?(<\/think>|$)/g, "").replace(/^\s+/, "")

/* ----------------------------------------------------------------------------
 * File helpers
 * ------------------------------------------------------------------------- */

async function fileToAttachment(file: File): Promise<Attachment> {
  if (file.type.startsWith("image/")) {
    const dataUrl = await downscaleImage(file, 1568)
    return { id: uid(), name: file.name, kind: "image", dataUrl }
  }
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("PDF files can't be read yet. Export the pages as images, or copy the text into a .txt file.")
  }
  if (file.type.startsWith("text/") || TEXT_EXTENSIONS.test(file.name)) {
    let text = await file.text()
    if (text.length > MAX_TEXT_CHARS) text = text.slice(0, MAX_TEXT_CHARS) + "\n…[file truncated]"
    return { id: uid(), name: file.name, kind: "text", text }
  }
  throw new Error(`"${file.name}" isn't a supported file type. Use text, CSV, JSON or an image.`)
}

function downscaleImage(file: File, maxSide: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL("image/jpeg", 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Couldn't read image "${file.name}".`))
    }
    img.src = url
  })
}

/** Convert UI messages into the payload the API expects. */
function toApiMessages(messages: UiMessage[]) {
  return messages
    .filter((m) => !m.greeting && !m.error && (m.role === "user" || m.text.trim()))
    .map((m) => {
      if (m.role === "ai") return { role: "assistant" as const, content: stripThinking(m.text) }
      const files = (m.attachments ?? []).filter((a) => a.kind === "text")
      const fileContext = files.map((a) => `[Attached file: ${a.name}]\n\`\`\`\n${a.text}\n\`\`\`\n\n`).join("")
      const images = (m.attachments ?? [])
        .filter((a) => a.kind === "image" && a.dataUrl)
        .map((a) => a.dataUrl!.split(",")[1])
      return { role: "user" as const, content: fileContext + m.text, ...(images.length ? { images } : {}) }
    })
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export default function WorkspacePage() {
  const { domain = "build" } = useParams<{ domain: string }>()
  // key => switching domain starts a fresh conversation
  return <Workspace key={domain} domain={domain in domainConfig ? domain : "build"} />
}

function Workspace({ domain }: { domain: string }) {
  const config = domainConfig[domain]

  const [messages, setMessages] = useState<UiMessage[]>([
    { id: "greeting", role: "ai", domain: config.label, text: config.greeting, greeting: true },
  ])
  const [input, setInput] = useState("")
  const [pending, setPending] = useState<Attachment[]>([])
  const [streaming, setStreaming] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [health, setHealth] = useState<Health | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autoSent = useRef(false)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  /* ---- AI engine health --------------------------------------------- */
  useEffect(() => {
    let cancelled = false
    fetch("/api/health")
      .then((r) => r.json())
      .then((h: Health) => !cancelled && setHealth(h))
      .catch(() => !cancelled && setHealth({ ok: false, ollama: "unreachable" }))
    return () => {
      cancelled = true
    }
  }, [])

  /* ---- autoscroll ---------------------------------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  /* ---- textarea auto-grow ------------------------------------------- */
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 160) + "px"
  }, [input])

  /* ---- send / stream -------------------------------------------------- */
  const sendMessage = useCallback(
    async (text: string, attachments: Attachment[] = []) => {
      const trimmed = text.trim()
      if ((!trimmed && attachments.length === 0) || streaming) return

      setNotice(null)
      const userMsg: UiMessage = {
        id: uid(),
        role: "user",
        text: trimmed || "Please review the attached file.",
        attachments: attachments.length ? attachments : undefined,
      }
      const aiId = uid()
      const history = [...messagesRef.current, userMsg]

      setMessages([...history, { id: aiId, role: "ai", domain: config.label, text: "" }])
      setInput("")
      setPending([])
      setStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      const patchAi = (patch: Partial<UiMessage>) =>
        setMessages((ms) => ms.map((m) => (m.id === aiId ? { ...m, ...patch } : m)))

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain, messages: toApiMessages(history) }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => null)
          throw new Error(err?.error ?? `Request failed (${res.status}).`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let acc = ""
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          acc += decoder.decode(value, { stream: true })
          patchAi({ text: acc })
        }
        if (!acc.trim()) patchAi({ text: "The model returned an empty response. Try rephrasing your question.", error: true })
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // User pressed Stop: keep whatever was generated so far
          setMessages((ms) => ms.filter((m) => !(m.id === aiId && !m.text.trim())))
        } else {
          patchAi({ text: (err as Error).message || "Something went wrong.", error: true })
        }
      } finally {
        setStreaming(false)
        abortRef.current = null
      }
    },
    [config.label, domain, streaming],
  )

  // Prompt handed over from /app or a domain landing page (?q=...)
  useEffect(() => {
    if (autoSent.current) return
    const q = new URLSearchParams(window.location.search).get("q")
    if (!q) return
    autoSent.current = true
    window.history.replaceState(null, "", window.location.pathname)
    // Deferred on purpose: no cleanup/cancel, so React StrictMode's double-run can't drop the prompt.
    setTimeout(() => sendMessage(q), 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stop = () => abortRef.current?.abort()

  const newChat = () => {
    abortRef.current?.abort()
    setMessages([{ id: "greeting", role: "ai", domain: config.label, text: config.greeting, greeting: true }])
    setPending([])
    setInput("")
    setNotice(null)
  }

  /* ---- attachments ----------------------------------------------------- */
  const addFiles = async (files: FileList | File[]) => {
    setNotice(null)
    const list = Array.from(files)
    const added: Attachment[] = []
    for (const f of list) {
      if (pending.length + added.length >= MAX_ATTACHMENTS) {
        setNotice(`You can attach up to ${MAX_ATTACHMENTS} files per message.`)
        break
      }
      try {
        const a = await fileToAttachment(f)
        if (a.kind === "image" && health && !health.vision) {
          setNotice("Image understanding isn't enabled on this server yet (set OLLAMA_VISION_MODEL). Attach a text file instead.")
          continue
        }
        added.push(a)
      } catch (e) {
        setNotice((e as Error).message)
      }
    }
    if (added.length) setPending((p) => [...p, ...added])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }
  const dragProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(true)
    },
    onDragLeave: () => setDragging(false),
    onDrop: handleDrop,
  }

  /* ---- derived --------------------------------------------------------- */
  const conversationStarted = messages.some((m) => !m.greeting)
  const allAttachments = [...messages.flatMap((m) => m.attachments ?? []), ...pending]
  const aiOffline = health !== null && !health.ok
  const canSend = (input.trim().length > 0 || pending.length > 0) && !streaming

  const offlineText =
    health?.ollama === "unreachable"
      ? "The AI engine is offline. Start Ollama on the server."
      : health && !health.modelInstalled
        ? `Model "${health.model}" isn't installed. Run: ollama pull ${health.model}`
        : ""

  /* ---- render ---------------------------------------------------------- */
  return (
    <div className="h-screen bg-background font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center px-4 md:px-6 border-b border-border bg-surface shrink-0 z-30">
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <Link href="/app" className="text-muted hover:text-foreground transition-colors flex items-center gap-1.5">
            <MoldulusLogoMark />
            <span className="hidden sm:inline">Moldulus</span>
          </Link>
          <span className="text-border mx-0.5">/</span>
          <span className="font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            {config.label}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {conversationStarted && !streaming && (
            <div className="hidden xl:flex items-center gap-2">
              {config.tools.slice(0, 3).map((t) => (
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
          {health && (
            <span
              className="hidden sm:flex items-center gap-1.5 text-[12px] font-medium text-muted px-2"
              title={aiOffline ? offlineText : `Running ${health.model}`}
            >
              <span className={`w-2 h-2 rounded-full ${aiOffline ? "bg-error" : "bg-success"}`}></span>
              {aiOffline ? "AI offline" : "AI ready"}
            </span>
          )}
          <button
            onClick={newChat}
            className="px-3 py-1.5 rounded-lg text-[13px] font-semibold border border-border hover:bg-secondary transition-colors"
          >
            New chat
          </button>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-[12px] font-700 ml-1">
            JD
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: conversation */}
        <div
          className={`w-full lg:w-[440px] shrink-0 flex flex-col lg:border-r border-border bg-surface relative ${dragging ? "ring-2 ring-inset ring-accent/40" : ""}`}
          {...dragProps}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-5 py-6 space-y-5">
            {aiOffline && (
              <div className="px-4 py-3 rounded-xl bg-error/8 border border-error/20 text-[13px] font-medium text-error">
                {offlineText}
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} streaming={streaming && msg.id === messages[messages.length - 1].id} />
            ))}

            {!conversationStarted && (
              <div className="flex flex-wrap gap-2 pl-10">
                {config.tools.map((t) => (
                  <button
                    key={t}
                    onClick={() => sendMessage(t)}
                    className="px-3 py-1.5 rounded-full text-[13px] font-medium border border-border text-muted hover:text-foreground hover:border-accent/40 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <div className="px-4 pb-5 pt-3 border-t border-border">
            {notice && <p className="text-[12px] font-medium text-error mb-2">{notice}</p>}

            {pending.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {pending.map((a) => (
                  <span key={a.id} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg bg-secondary text-[12px] font-medium max-w-[220px]">
                    {a.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.dataUrl} alt="" className="w-5 h-5 rounded object-cover" />
                    ) : (
                      <DocIcon />
                    )}
                    <span className="truncate">{a.name}</span>
                    <button
                      aria-label={`Remove ${a.name}`}
                      onClick={() => setPending((p) => p.filter((x) => x.id !== a.id))}
                      className="w-5 h-5 rounded hover:bg-border flex items-center justify-center text-muted"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-end">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.txt,.md,.csv,.tsv,.json,.xml,.html,.log,.yaml,.yml"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files)
                  e.target.value = ""
                }}
              />
              <button
                type="button"
                aria-label="Attach file"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-secondary transition-colors"
              >
                <AttachIcon />
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    if (canSend) sendMessage(input, pending)
                  }
                }}
                placeholder={config.placeholder}
                className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-border bg-background text-[15px] font-medium leading-relaxed placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/12 transition-all"
              />

              {streaming ? (
                <button
                  onClick={stop}
                  aria-label="Stop generating"
                  className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-foreground text-surface hover:opacity-85 transition-opacity"
                >
                  <StopIcon />
                </button>
              ) : (
                <button
                  onClick={() => sendMessage(input, pending)}
                  disabled={!canSend}
                  aria-label="Send"
                  className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all ${
                    canSend ? "bg-accent text-white hover:bg-accent-hover" : "bg-secondary text-muted"
                  }`}
                >
                  <SendIcon />
                </button>
              )}
            </div>
            <p className="text-[11px] font-medium text-subtle mt-2 text-center">
              Moldulus can make mistakes. Check important information with a qualified professional.
            </p>
          </div>
        </div>

        {/* Right: documents */}
        <div className="hidden lg:flex flex-1 flex-col overflow-hidden bg-background" {...dragProps}>
          {allAttachments.length > 0 ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <p className="text-[13px] font-semibold text-muted">Documents in this conversation</p>
              {allAttachments.map((a) => (
                <div key={a.id} className="rounded-2xl border border-border bg-surface overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 text-[13px] font-semibold">
                    {a.kind === "image" ? <ImageIcon /> : <DocIcon />}
                    <span className="truncate">{a.name}</span>
                  </div>
                  {a.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.dataUrl} alt={a.name} className="w-full max-h-[520px] object-contain bg-secondary" />
                  ) : (
                    <pre className="p-4 text-[12px] leading-relaxed font-mono text-muted whitespace-pre-wrap max-h-[360px] overflow-auto">
                      {(a.text ?? "").slice(0, 3000)}
                      {(a.text ?? "").length > 3000 ? "\n…" : ""}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div
                className={`w-full max-w-md p-10 rounded-2xl border-2 border-dashed transition-all duration-200 ${
                  dragging ? "border-accent bg-accent/5" : "border-border"
                }`}
              >
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-muted">
                    <UploadIcon size={24} />
                  </div>
                </div>
                <h2 className="text-[22px] font-800 text-foreground tracking-tight mb-2">
                  Start with a document or a question.
                </h2>
                <p className="text-[15px] font-medium text-muted mb-6">
                  Drop a text file{health?.vision ? " or image" : ""} here, or ask in the panel on the left.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-3 rounded-xl bg-accent text-white text-[14px] font-semibold hover:bg-accent-hover transition-colors"
                >
                  Attach a file
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Message bubble
 * ------------------------------------------------------------------------- */

function MessageBubble({ msg, streaming }: { msg: UiMessage; streaming: boolean }) {
  const [copied, setCopied] = useState(false)

  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[88%] px-4 py-3 rounded-2xl rounded-br-sm bg-foreground text-surface text-[14px] leading-relaxed font-medium whitespace-pre-wrap break-words">
          {msg.attachments && msg.attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {msg.attachments.map((a) => (
                <span key={a.id} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/15">
                  {a.name}
                </span>
              ))}
            </div>
          )}
          {msg.text}
        </div>
      </div>
    )
  }

  const text = stripThinking(msg.text)
  const waiting = streaming && !text

  return (
    <div className="group flex gap-3">
      <div className="w-7 h-7 rounded-full bg-accent shrink-0 flex items-center justify-center mt-0.5">
        <span className="text-white text-[10px] font-800">M</span>
      </div>
      <div className="min-w-0 max-w-[88%]">
        <div
          className={`px-4 py-3 rounded-2xl rounded-bl-sm text-[14px] leading-relaxed ${
            msg.error ? "bg-error/8 text-error border border-error/20" : "bg-secondary text-foreground"
          }`}
        >
          {!msg.error && <span className="text-[11px] font-semibold text-accent block mb-1.5">{msg.domain}</span>}
          {waiting ? (
            <div className="flex gap-1.5 items-center py-1">
              <div className="w-2 h-2 rounded-full bg-accent think-dot"></div>
              <div className="w-2 h-2 rounded-full bg-accent think-dot"></div>
              <div className="w-2 h-2 rounded-full bg-accent think-dot"></div>
            </div>
          ) : msg.error ? (
            text
          ) : (
            <div className={`md ${streaming ? "md-streaming" : ""}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node: _n, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />, // eslint-disable-line @typescript-eslint/no-unused-vars
                  table: ({ node: _n, ...props }) => ( // eslint-disable-line @typescript-eslint/no-unused-vars
                    <div className="overflow-x-auto">
                      <table {...props} />
                    </div>
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {!msg.greeting && !msg.error && !streaming && text && (
          <button
            onClick={() => {
              navigator.clipboard?.writeText(text).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              })
            }}
            className="mt-1 ml-1 text-[12px] font-medium text-muted hover:text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Icons
 * ------------------------------------------------------------------------- */

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

function AttachIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
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

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="2" y="2" width="10" height="10" rx="2" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-muted">
      <path d="M4 1.5h5l3 3V14a.5.5 0 01-.5.5h-7.5A.5.5 0 013.5 14V2a.5.5 0 01.5-.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 1.5v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-muted">
      <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="5.5" cy="6.5" r="1.1" fill="currentColor" />
      <path d="M2 12l3.5-3.5 2.5 2.5 2-2 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}
