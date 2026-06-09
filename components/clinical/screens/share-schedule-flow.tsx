"use client"

import { useState } from "react"
import { ChevronLeft, Check, FileText, Upload, Search, X, AlertCircle, Users } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-2">
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
                isDone    ? "bg-[#0D9488] text-white" :
                isCurrent ? "bg-[#0D1B3E] text-white" :
                            "bg-white border-2 border-slate-300 text-slate-400"
              )}>
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isCurrent ? "text-[#0D1B3E]" : isDone ? "text-[#0D9488]" : "text-slate-400"
              )}>{s.label}</span>
            </div>
            {i < 1 && <div className={cn("flex-1 h-0.5 mx-2 rounded-full", isDone ? "bg-[#0D9488]" : "bg-slate-200")} />}
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

  // ── Discard dialog ───────────────────────────────────────
  if (showDiscard) {
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3">
          <span className="font-semibold">Share Schedule</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full shadow-lg text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg mb-2">Discard sharing?</h3>
            <p className="text-sm text-slate-500 mb-6">Your selections will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDiscard(false)} className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl text-sm font-semibold">Keep Editing</button>
              <button onClick={onBack} className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-semibold">Discard</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Success ──────────────────────────────────────────────
  if (done) {
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3">
          <span className="font-semibold">Share Schedule</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-5">
            <Check className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Shared Successfully!</h2>
          <p className="text-slate-500 text-sm mb-1 font-medium">{docName}</p>
          <p className="text-slate-400 text-xs mb-4">sent to {selectedSites.size} site{selectedSites.size !== 1 ? "s" : ""}:</p>
          <div className="mb-6 space-y-1">
            {selectedSitesList.map(s => (
              <p key={s.id} className="text-sm font-medium text-[#0F172A]">• {s.name}</p>
            ))}
          </div>
          <p className="text-xs text-slate-400 mb-8">Each PI has been notified and must review and approve.</p>
          <div className="w-full space-y-3">
            <button
              onClick={() => { setDone(false); setStep(1); setSelectedSites(new Set()); setSelectedDoc(null); setUploadedFileName(null); setMessage("") }}
              className="w-full border border-[#0D1B3E] text-[#0D1B3E] py-3 rounded-xl text-sm font-semibold"
            >
              Share Another Document
            </button>
            <button onClick={onSuccess} className="w-full bg-[#0D1B3E] text-white py-3 rounded-xl text-sm font-semibold">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* App Bar */}
      <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
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
              <p className="font-semibold text-[#0F172A] text-base mb-0.5">Select Sites / Hospitals</p>
              <p className="text-slate-500 text-xs">Choose where you want to share the schedule</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                value={siteSearch}
                onChange={e => setSiteSearch(e.target.value)}
                placeholder="Search hospitals or cities…"
                className="flex-1 text-sm outline-none"
              />
              {siteSearch && (
                <button onClick={() => setSiteSearch("")}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            {/* Select all row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">
                  {selectedSites.size} of {mockSites.length} selected
                </span>
              </div>
              <button onClick={toggleAll} className="text-xs text-[#2563EB] font-semibold">
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
                      selected ? "border-[#0D1B3E] bg-slate-50" : "border-transparent bg-white"
                    )}
                  >
                    {/* Checkbox */}
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      selected ? "bg-[#0D1B3E] border-[#0D1B3E]" : "border-slate-300 bg-white"
                    )}>
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="font-semibold text-[#0F172A] text-sm">{site.name}</p>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0",
                          site.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        )}>
                          {site.status === "active" ? "● Active" : "⏳ Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{site.city}, {site.state}</p>
                      <p className="text-xs text-slate-400 mt-0.5">PI: {site.pi}</p>
                      {site.status === "pending" && selected && (
                        <p className="text-[10px] text-amber-600 mt-1.5 font-medium">
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
            <div className="bg-[#0D1B3E] rounded-2xl p-4">
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
              <p className="font-semibold text-[#0F172A] text-sm mb-2">Upload Document</p>
              {uploadedFileName ? (
                <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#0D9488]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#0F172A] truncate">{uploadedFileName}</p>
                    <p className="text-xs text-teal-600">Ready to share</p>
                  </div>
                  <button
                    onClick={() => setUploadedFileName(null)}
                    className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div
                    className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center gap-2 text-center bg-white hover:border-[#0D1B3E] hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      // Simulate file upload
                      setUploadedFileName("VisitSchedule_Protocol001_v3.pdf")
                      setSelectedDoc(null)
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                      <Upload className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="font-semibold text-[#0F172A] text-sm">Tap to upload a document</p>
                    <p className="text-xs text-slate-400">PDF, DOC, XLS, PNG, JPG</p>
                  </div>
                </label>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">or choose existing</span>
              <div className="flex-1 h-px bg-slate-200" />
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
                      ? "border-[#2563EB] bg-blue-50"
                      : "border-transparent bg-white shadow-sm"
                  )}
                >
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5 text-[#2563EB]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#0F172A] text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.trial} · {doc.size}</p>
                  </div>
                  {selectedDoc?.id === doc.id && !uploadedFileName && (
                    <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Optional message */}
            <div>
              <p className="text-sm font-medium text-[#0F172A] mb-2">Message to sites <span className="text-slate-400 font-normal">(optional)</span></p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value.slice(0, 300))}
                placeholder="Please review the updated visit schedule and confirm receipt…"
                rows={3}
                className="w-full bg-white rounded-xl border border-slate-200 p-3 text-sm outline-none resize-none focus:border-[#0D1B3E]"
              />
              <p className="text-xs text-slate-400 text-right mt-0.5">{message.length} / 300</p>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Each site's PI will receive a notification with the document attached. They must review and approve before the schedule becomes active.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-4 pb-4 pt-3 bg-white border-t border-slate-100">
        {step === 1 && (
          <button
            onClick={() => setStep(2)}
            disabled={selectedSites.size === 0}
            className={cn(
              "w-full py-3.5 rounded-xl text-sm font-semibold transition-all",
              selectedSites.size > 0
                ? "bg-[#0D1B3E] text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
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
                ? "bg-[#7C3AED] text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
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
