"use client"

import { useState } from "react"
import { ChevronLeft, Building2, MapPin, User, Stethoscope, FileText, Clock, CalendarDays, History, Share2, X, Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

// Shape of a trial passed into the summary page. Matches the trial objects
// used by the PI and CRC dashboards.
export interface TrialSummary {
  id: string
  title: string
  phase: string
  disease: string
  drug: string
  sponsor: string
  site: string
  pi: string
  department: string
  status: string
  recruitment: string
  screened: number
  screenFail: number
  randomized: number
  withdrawn: number
  dropout: number
  followUp: number
  completed: number
}

// Minimal patient shape needed for the Patients panel.
export interface SummaryPatient {
  id: string
  name: string
  visit: string
  dateISO: string
  status: string
}

interface TrialSummaryScreenProps {
  trial: TrialSummary
  patients: SummaryPatient[]
  onBack: () => void
  onAddPatient: () => void
}

// ── Helpers ────────────────────────────────────────────────
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? "")
    .join("")
}

function visitNo(visit: string): string {
  const m = visit.match(/\d+/)
  return m ? m[0] : "—"
}

function formatDate(iso: string): string {
  if (!iso) return "Not scheduled"
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

// Deterministic CTRI registration number derived from the protocol id, so the
// same trial always shows the same number in this prototype.
function ctriNo(id: string): string {
  const digits = (id.match(/\d+/)?.[0] ?? "0").padStart(2, "0")
  return `CTRI/2026/${digits}/${(parseInt(digits, 10) * 7919).toString().padStart(6, "0")}`
}

const patientStatusStyle: Record<string, { label: string; cls: string }> = {
  "on-track": { label: "On Track", cls: "bg-emerald-100 text-emerald-700" },
  overdue: { label: "Overdue", cls: "bg-red-100 text-red-700" },
  completed: { label: "Completed", cls: "bg-blue-100 text-blue-700" },
  withdrawn: { label: "Withdrawn", cls: "bg-slate-200 text-slate-600" },
}

// Reusable label/value row for the detail panels.
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-[#0F172A] mt-0.5">{value}</p>
    </div>
  )
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <p className="font-semibold text-sm text-[#0F172A] mb-3">{children}</p>
}

const emptyShareForm = {
  fullName: "",
  designation: "",
  email: "",
  role: "PI" as "PI" | "Research Team",
  phone: "",
  orgName: "",
  // Access type is fixed for shared trials and cannot be changed.
  accessType: "Patient Management",
}

export function TrialSummaryScreen({ trial, patients, onBack, onAddPatient }: TrialSummaryScreenProps) {
  const [showShare, setShowShare] = useState(false)
  const [shareForm, setShareForm] = useState({ ...emptyShareForm, orgName: trial.sponsor })
  const [toast, setToast] = useState<string | null>(null)

  const openShare = () => {
    setShareForm({ ...emptyShareForm, orgName: trial.sponsor })
    setShowShare(true)
  }

  const submitShare = () => {
    const name = shareForm.fullName.trim() || "member"
    setShowShare(false)
    setToast(`${trial.id} shared with ${name} (${shareForm.accessType})`)
    setTimeout(() => setToast(null), 2600)
  }

  const shareValid = shareForm.fullName.trim() !== "" && shareForm.email.trim() !== ""

  const counters: { label: string; value: number; cls: string }[] = [
    { label: "Total Screened", value: trial.screened, cls: "bg-blue-50 text-blue-700" },
    { label: "Screen Failures", value: trial.screenFail, cls: "bg-amber-50 text-amber-700" },
    { label: "Randomized", value: trial.randomized, cls: "bg-indigo-50 text-indigo-700" },
    { label: "Follow Up", value: trial.followUp, cls: "bg-teal-50 text-teal-700" },
    { label: "Completed", value: trial.completed, cls: "bg-emerald-50 text-emerald-700" },
    { label: "Withdrawn", value: trial.withdrawn, cls: "bg-slate-100 text-slate-600" },
    { label: "Dropout", value: trial.dropout, cls: "bg-rose-50 text-rose-700" },
  ]

  const documents = [
    { label: "Uploaded Protocol", value: `${trial.id}_Protocol_v2.1.pdf` },
    { label: "Uploaded by", value: trial.pi },
    { label: "Date & Time of Upload", value: "12 May 2026, 10:30 AM" },
    { label: "Schedule Template", value: `${trial.id}_VisitSchedule_v1.0.xlsx` },
  ]

  const versionHistory = [
    { version: "v2.1", note: "Updated inclusion criteria", date: "12 May 2026" },
    { version: "v2.0", note: "Amended visit schedule", date: "02 Mar 2026" },
    { version: "v1.0", note: "Initial protocol", date: "15 Jan 2026" },
  ]

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1"><ChevronLeft className="w-5 h-5" /></button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold leading-tight truncate">Trial Summary</p>
          <p className="text-xs text-blue-200 truncate">{trial.id} · {trial.title}</p>
        </div>
        <button
          onClick={openShare}
          className="flex-shrink-0 flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
        >
          <Share2 className="w-3.5 h-3.5" /> Share Trial
        </button>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {/* Panel 1 — Trial Details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <PanelTitle>Trial Details</PanelTitle>
          <div className="grid grid-cols-2 gap-y-3 gap-x-3">
            <DetailRow label="Protocol ID" value={trial.id} />
            <DetailRow label="CTRI No." value={ctriNo(trial.id)} />
            <div className="col-span-2"><DetailRow label="Study Title" value={trial.title} /></div>
            <DetailRow label="Phase" value={trial.phase} />
            <DetailRow label="Indication" value={trial.disease} />
            <DetailRow label="Drug Name" value={trial.drug} />
          </div>
        </div>

        {/* Panel 2 — Sponsor / Site / PI */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-y-3 gap-x-3">
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <DetailRow label="Sponsor Name" value={trial.sponsor} />
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <DetailRow label="Site Name" value={trial.site} />
            </div>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <DetailRow label="PI Name" value={trial.pi} />
            </div>
            <div className="flex items-start gap-2">
              <Stethoscope className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <DetailRow label="Department" value={trial.department} />
            </div>
          </div>
        </div>

        {/* Panel 3 — Status counters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <PanelTitle>Status</PanelTitle>
          <div className="grid grid-cols-3 gap-2">
            {counters.map(c => (
              <div key={c.label} className={cn("rounded-xl p-2.5 text-center", c.cls)}>
                <p className="text-lg font-bold leading-none">{c.value}</p>
                <p className="text-[10px] font-medium mt-1 leading-tight">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4 — Patients */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <PanelTitle>Patients</PanelTitle>
            <button
              onClick={onAddPatient}
              className="flex-shrink-0 px-3 py-1.5 bg-[#2563EB] rounded-lg text-white text-xs font-semibold whitespace-nowrap"
            >
              Add Patient
            </button>
          </div>
          <div className="space-y-2.5">
            {patients.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No patients enrolled yet.</p>
            )}
            {patients.map(p => {
              const st = patientStatusStyle[p.status] ?? { label: p.status, cls: "bg-slate-100 text-slate-600" }
              return (
                <div key={p.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#1A3872] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {initials(p.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">{p.id}</p>
                        <p className="text-[11px] text-slate-500">{initials(p.name)}</p>
                      </div>
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0", st.cls)}>{st.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2 border-t border-slate-200">
                    <DetailRow label="Visit No." value={visitNo(p.visit)} />
                    <DetailRow label="Visit Name" value={p.visit} />
                    <DetailRow label="Visit Type" value={p.status === "overdue" ? "Overdue" : "Scheduled"} />
                    <DetailRow label="Visit Date" value={formatDate(p.dateISO)} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel 5 — Documents */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <PanelTitle>Documents</PanelTitle>
          <div className="space-y-2.5">
            {documents.map(d => (
              <div key={d.label} className="flex items-start gap-2">
                {d.label === "Date & Time of Upload"
                  ? <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  : d.label === "Uploaded by"
                    ? <User className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    : <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />}
                <DetailRow label={d.label} value={d.value} />
              </div>
            ))}
          </div>

          {/* Version History */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-slate-400" />
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Version History</p>
            </div>
            <div className="space-y-2">
              {versionHistory.map(v => (
                <div key={v.version} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A]">{v.version}</p>
                    <p className="text-[11px] text-slate-500 truncate">{v.note}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 flex-shrink-0">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {v.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Trial modal */}
      {showShare && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/40" onClick={() => setShowShare(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-t-3xl max-h-[88%] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="min-w-0">
                <p className="font-semibold text-[#0F172A]">Share Trial</p>
                <p className="text-xs text-slate-500 truncate">Share {trial.id} with an organization member</p>
              </div>
              <button onClick={() => setShowShare(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  value={shareForm.fullName}
                  onChange={e => setShareForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="e.g. Dr. Anita Rao"
                  className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Designation</label>
                <input
                  value={shareForm.designation}
                  onChange={e => setShareForm(f => ({ ...f, designation: e.target.value }))}
                  placeholder="e.g. Co-Investigator"
                  className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Email ID</label>
                <input
                  type="email"
                  value={shareForm.email}
                  onChange={e => setShareForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="name@example.com"
                  className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Role</label>
                <div className="mt-1 flex gap-2">
                  {(["PI", "Research Team"] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => setShareForm(f => ({ ...f, role: r }))}
                      className={cn("flex-1 rounded-xl border px-3 py-2 text-sm font-medium",
                        shareForm.role === r ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white text-slate-600 border-slate-200")}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Phone No.</label>
                <input
                  type="tel"
                  value={shareForm.phone}
                  onChange={e => setShareForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Org. Name</label>
                <input
                  value={shareForm.orgName}
                  onChange={e => setShareForm(f => ({ ...f, orgName: e.target.value }))}
                  placeholder="Organization name"
                  className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Access Type</label>
                <div className="mt-1 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <span className="text-sm font-medium text-[#0F172A]">{shareForm.accessType}</span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400"><Lock className="w-3 h-3" /> Default</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100">
              <button
                onClick={submitShare}
                disabled={!shareValid}
                className={cn("w-full rounded-xl py-3 text-sm font-semibold text-white",
                  shareValid ? "bg-[#2563EB]" : "bg-slate-300")}
              >
                Share Trial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation toast */}
      {toast && (
        <div className="absolute bottom-4 left-4 right-4 z-50 flex items-start gap-3 bg-[#0D1B3E] rounded-2xl px-4 py-3 shadow-2xl ring-1 ring-white/10">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">Trial shared</p>
            <p className="text-xs text-blue-200 leading-snug">{toast}</p>
          </div>
        </div>
      )}
    </div>
  )
}
