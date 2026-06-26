"use client"

import { useState } from "react"
import { ChevronLeft, Check, FileText, Upload, Search, X, AlertCircle, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { AddTrialScreen, type TrialDetails } from "./add-trial-screen"
import { VisitScheduleScreen } from "./visit-schedule-screen"

interface ShareScheduleFlowProps {
  onBack: () => void
  onSuccess: () => void
}

const mockSites = [
  { id: "SITE-001", name: "Apollo Mumbai",    city: "Mumbai",    state: "Maharashtra", status: "active",  pi: "Dr. Rajesh Sharma"  },
  { id: "SITE-002", name: "Max Delhi",        city: "New Delhi", state: "Delhi",       status: "active",  pi: "Dr. Sunita Rao"     },
  { id: "SITE-003", name: "Fortis Bangalore", city: "Bengaluru", state: "Karnataka",   status: "active",  pi: "Dr. Anand Krishnan" },
  { id: "SITE-004", name: "KIMS Hyderabad",   city: "Hyderabad", state: "Telangana",   status: "pending", pi: "Dr. P. Reddy"       },
]

const existingDocs = [
  { id: "DOC-001", name: "Protocol-001 v2.1.pdf",          trial: "Diabetes Phase II",   size: "2.4 MB", updated: "20 May 2025" },
  { id: "DOC-002", name: "Protocol-002 v1.0.pdf",          trial: "Hypertension Study",  size: "1.8 MB", updated: "15 May 2025" },
  { id: "DOC-003", name: "Protocol-003 v1.2.pdf",          trial: "Oncology Phase I",    size: "3.1 MB", updated: "10 May 2025" },
  { id: "DOC-004", name: "Visit Schedule Template v3.xlsx", trial: "General",            size: "0.9 MB", updated: "5 May 2025"  },
]

type Step = 1 | 2

function StepBar({ step }: { step: Step }) {
  return (
    <div className="px-4 py-3 bg-card border-b border-border flex items-center gap-2">
      {[
        { num: 1, label: "Select Sites" },
        { num: 2, label: "Upload & Share" },
      ].map((s, i) => {
        const isDone    = step > s.num
        const isCurrent = step === s.num
        return (
          <div key={s.num} className={cn("flex items-center", i < 1 && "flex-1")}>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                isDone    ? "bg-accent text-white" :
                isCurrent ? "bg-primary-deep text-white" :
                            "bg-card border-2 border-border text-muted-foreground/70"
              )}>
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isCurrent ? "text-primary-deep" : isDone ? "text-accent" : "text-muted-foreground/70"
              )}>{s.label}</span>
            </div>
            {i < 1 && <div className={cn("flex-1 h-0.5 mx-2 rounded-full", isDone ? "bg-accent" : "bg-border")} />}
          </div>
        )
      })}
    </div>
  )
}

export function ShareScheduleFlow({ onBack, onSuccess }: ShareScheduleFlowProps) {
  const [step, setStep]                 = useState<Step>(1)
  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set())
  const [siteSearch, setSiteSearch]     = useState("")
  const [selectedDoc, setSelectedDoc]   = useState<typeof existingDocs[0] | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [message, setMessage]           = useState("")
  const [loading, setLoading]           = useState(false)
  const [done, setDone]                 = useState(false)
  const [showDiscard, setShowDiscard]   = useState(false)
  // Sub-flow for adding a brand-new protocol — mirrors the "Add Trial" process
  // (protocol details → visit schedule) but ends by sharing instead of saving.
  const [addProtocolStep, setAddProtocolStep] = useState<null | "details" | "schedule">(null)
  const [newProtocol, setNewProtocol]   = useState<TrialDetails | null>(null)

  const filteredSites = mockSites.filter(s =>
    s.name.toLowerCase().includes(siteSearch.toLowerCase()) ||
    s.city.toLowerCase().includes(siteSearch.toLowerCase())
  )
  const allSelected = filteredSites.length > 0 && filteredSites.every(s => selectedSites.has(s.id))

  const toggleSite = (id: string) =>
    setSelectedSites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const toggleAll = () =>
    setSelectedSites(prev => {
      const n = new Set(prev)
      if (allSelected) filteredSites.forEach(s => n.delete(s.id))
      else filteredSites.forEach(s => n.add(s.id))
      return n
    })

  const selectedSitesList = mockSites.filter(s => selectedSites.has(s.id))
  const hasDoc = selectedDoc !== null || uploadedFileName !== null
  const docName = uploadedFileName ?? selectedDoc?.name ?? ""

  const handleShare = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1400)
  }

  const shareCtaLabel = `Share with ${selectedSites.size} Site${selectedSites.size !== 1 ? "s" : ""} →`

  // After the visit schedule is confirmed, share the newly-added protocol to the sites.
  const handleProtocolShared = () => {
    const name = newProtocol?.title?.trim()
      ? `${newProtocol.title.trim().slice(0, 40)}.pdf`
      : "New Protocol.pdf"
    setSelectedDoc(null)
    setUploadedFileName(name)
    setAddProtocolStep(null)
    handleShare()
  }

  // ── Add new protocol — step 1: protocol details (same as "Add Trial") ──
  if (addProtocolStep === "details") {
    return (
      <AddTrialScreen
        title="Add Protocol"
        saveLabel="Next: Visit Schedule →"
        onBack={() => setAddProtocolStep(null)}
        onSave={(proto) => { setNewProtocol(proto ?? null); setAddProtocolStep("schedule") }}
      />
    )
  }

  // ── Add new protocol — step 2: visit schedule, ends by sharing ──
  if (addProtocolStep === "schedule") {
    return (
      <VisitScheduleScreen
        saveLabel={shareCtaLabel}
        saveToast="Protocol shared"
        onBack={() => setAddProtocolStep("details")}
        onSave={handleProtocolShared}
      />
    )
  }

  // ── Discard dialog ───────────────────────────────────────
  if (showDiscard) {
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-white px-4 py-3">
          <span className="font-semibold">Share Schedule</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-card rounded-2xl p-6 w-full shadow-lg text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/5 flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">Discard sharing?</h3>
            <p className="text-sm text-muted-foreground mb-6">Your selections will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDiscard(false)} className="flex-1 border border-border text-foreground/80 py-3 rounded-xl text-sm font-semibold">Keep Editing</button>
              <button onClick={onBack} className="flex-1 bg-destructive text-white py-3 rounded-xl text-sm font-semibold">Discard</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Success ──────────────────────────────────────────────
  if (done) {
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-white px-4 py-3">
          <span className="font-semibold">Share Schedule</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-5">
            <Check className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Shared Successfully!</h2>
          <p className="text-muted-foreground text-sm mb-1 font-medium">{docName}</p>
          <p className="text-muted-foreground/70 text-xs mb-4">sent to {selectedSites.size} site{selectedSites.size !== 1 ? "s" : ""}:</p>
          <div className="mb-6 space-y-1">
            {selectedSitesList.map(s => (
              <p key={s.id} className="text-sm font-medium text-foreground">• {s.name}</p>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/70 mb-8">Each PI has been notified and must review and approve.</p>
          <div className="w-full space-y-3">
            <button
              onClick={() => { setDone(false); setStep(1); setSelectedSites(new Set()); setSelectedDoc(null); setUploadedFileName(null); setMessage("") }}
              className="w-full border border-primary-deep text-primary-deep py-3 rounded-xl text-sm font-semibold"
            >
              Share Another Document
            </button>
            <button onClick={onSuccess} className="w-full bg-primary-deep text-white py-3 rounded-xl text-sm font-semibold">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* App Bar */}
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => {
            if (step === 1) setShowDiscard(true)
            else setStep(1)
          }}
          className="p-1"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-semibold flex-1">Share Schedule</span>
      </div>

      <StepBar step={step} />

      <div className="flex-1 overflow-auto pb-2">

        {/* ── STEP 1: Select Sites ─────────────────────────── */}
        {step === 1 && (
          <div className="px-4 pt-4 space-y-3">
            <div>
              <p className="font-semibold text-foreground text-base mb-0.5">Select Sites / Hospitals</p>
              <p className="text-muted-foreground text-xs">Choose where you want to share the schedule</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5">
              <Search className="w-4 h-4 text-muted-foreground/70 shrink-0" />
              <input
                value={siteSearch}
                onChange={e => setSiteSearch(e.target.value)}
                placeholder="Search hospitals or cities…"
                className="flex-1 text-sm outline-none"
              />
              {siteSearch && (
                <button onClick={() => setSiteSearch("")}>
                  <X className="w-4 h-4 text-muted-foreground/70" />
                </button>
              )}
            </div>

            {/* Select all row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground/70" />
                <span className="text-xs text-muted-foreground font-medium">
                  {selectedSites.size} of {mockSites.length} selected
                </span>
              </div>
              <button onClick={toggleAll} className="text-xs text-info font-semibold">
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>

            {/* Site cards */}
            <div className="space-y-2">
              {filteredSites.map(site => {
                const selected = selectedSites.has(site.id)
                return (
                  <button
                    key={site.id}
                    onClick={() => toggleSite(site.id)}
                    className={cn(
                      "w-full text-left rounded-2xl p-4 flex items-start gap-3 border-2 transition-all shadow-sm",
                      selected ? "border-primary-deep bg-surface" : "border-transparent bg-card"
                    )}
                  >
                    {/* Checkbox */}
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      selected ? "bg-primary-deep border-primary-deep" : "border-border bg-card"
                    )}>
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="font-semibold text-foreground text-sm">{site.name}</p>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0",
                          site.status === "active"
                            ? "bg-success/15 text-success"
                            : "bg-warning/15 text-warning"
                        )}>
                          {site.status === "active" ? "● Active" : "⏳ Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{site.city}, {site.state}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">PI: {site.pi}</p>
                      {site.status === "pending" && selected && (
                        <p className="text-[10px] text-warning mt-1.5 font-medium">
                          Site not yet active — PI will be notified but cannot act until activated
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: Upload Document & Share ─────────────── */}
        {step === 2 && (
          <div className="px-4 pt-4 space-y-4">

            {/* Selected sites summary */}
            <div className="bg-primary-deep rounded-2xl p-4">
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-2">
                Sharing with {selectedSites.size} site{selectedSites.size !== 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSitesList.map(s => (
                  <span key={s.id} className="bg-white/15 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="mt-2 text-blue-300 text-xs font-medium">
                ← Change sites
              </button>
            </div>

            {/* Upload new */}
            <div>
              <p className="font-semibold text-foreground text-sm mb-2">Upload a New Protocol</p>
              {uploadedFileName ? (
                <div className="bg-accent/5 border-2 border-teal-300 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{uploadedFileName}</p>
                    <p className="text-xs text-accent">Ready to share</p>
                  </div>
                  <button
                    onClick={() => setUploadedFileName(null)}
                    className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center shrink-0"
                  >
                    <X className="w-3 h-3 text-muted-foreground/70" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddProtocolStep("details")}
                  className="w-full border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center gap-2 text-center bg-card hover:border-primary-deep hover:bg-surface transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-1">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground text-sm">Add a new protocol</p>
                  <p className="text-xs text-muted-foreground/70">Enter the protocol details, then share</p>
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground/70 font-medium">or choose existing</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Existing docs list */}
            <div className="space-y-2">
              {existingDocs.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => { setSelectedDoc(doc); setUploadedFileName(null) }}
                  className={cn(
                    "w-full text-left rounded-2xl p-3.5 flex items-center gap-3 border-2 transition-all",
                    selectedDoc?.id === doc.id && !uploadedFileName
                      ? "border-info bg-info/5"
                      : "border-transparent bg-card shadow-sm"
                  )}
                >
                  <div className="w-9 h-9 bg-info/5 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5 text-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground/70">{doc.trial} · {doc.size}</p>
                  </div>
                  {selectedDoc?.id === doc.id && !uploadedFileName && (
                    <div className="w-5 h-5 rounded-full bg-info flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Optional message */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Message to sites <span className="text-muted-foreground/70 font-normal">(optional)</span></p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value.slice(0, 300))}
                placeholder="Please review the updated visit schedule and confirm receipt…"
                rows={3}
                className="w-full bg-card rounded-xl border border-border p-3 text-sm outline-none resize-none focus:border-primary-deep"
              />
              <p className="text-xs text-muted-foreground/70 text-right mt-0.5">{message.length} / 300</p>
            </div>

            {/* Notice */}
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-warning">
                Each site's PI will receive a notification with the document attached. They must review and approve before the schedule becomes active.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-4 pb-4 pt-3 bg-card border-t border-border">
        {step === 1 && (
          <button
            onClick={() => setStep(2)}
            disabled={selectedSites.size === 0}
            className={cn(
              "w-full py-3.5 rounded-xl text-sm font-semibold transition-all",
              selectedSites.size > 0
                ? "bg-primary-deep text-white"
                : "bg-border text-muted-foreground/70 cursor-not-allowed"
            )}
          >
            {selectedSites.size > 0
              ? `Next: Upload Document → (${selectedSites.size} site${selectedSites.size !== 1 ? "s" : ""} selected)`
              : "Select at least one site to continue"}
          </button>
        )}

        {step === 2 && (
          <button
            onClick={handleShare}
            disabled={!hasDoc || loading}
            className={cn(
              "w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              hasDoc && !loading
                ? "bg-violet text-white"
                : "bg-border text-muted-foreground/70 cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Sharing…
              </>
            ) : hasDoc ? (
              `Share with ${selectedSites.size} Site${selectedSites.size !== 1 ? "s" : ""} →`
            ) : (
              "Upload or select a document first"
            )}
          </button>
        )}
      </div>
    </div>
  )
}
