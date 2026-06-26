"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Building2, MapPin, User, Stethoscope, FileText, Clock, CalendarDays, History, Share2, X, Check, Lock, Users, Mail, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { TrialActionsMenu } from "@/components/clinical/trial-actions-menu"

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

// ── Trial team ─────────────────────────────────────────────
// Everyone related to a trial: the PI, the site CRCs and the sponsor-side
// contact. The trial objects only carry the PI and sponsor names, so the CRCs
// and sponsor contact are derived deterministically from the protocol id — the
// same trial always shows the same team in this prototype.
type TeamRole = "Principal Investigator" | "Clinical Research Coordinator" | "Sponsor Contact"

interface TeamMember {
  name: string
  role: TeamRole
  org: string
  email: string
  phone: string
}

const teamRoleStyle: Record<TeamRole, string> = {
  "Principal Investigator": "bg-accent/12 text-accent",
  "Clinical Research Coordinator": "bg-success/15 text-success",
  "Sponsor Contact": "bg-info/10 text-info",
}

const CRC_POOL = ["Ms. Meera Iyer", "Mr. Arjun Reddy", "Ms. Kavitha Nair", "Mr. Amit Singh", "Ms. Divya Menon", "Mr. Rohit Verma"]
const SPONSOR_CONTACT_POOL = ["Rajesh Kumar", "Anita Verma", "Sanjay Mehta", "Pooja Nair"]

function hashNum(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function emailFor(name: string, domain: string): string {
  const clean = name.replace(/^(dr|mr|mrs|ms)\.?\s+/i, "").trim()
  const parts = clean.split(/\s+/).filter(Boolean)
  const handle = parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0]
  return `${handle.toLowerCase()}@${domain}`
}

function phoneFor(seed: string): string {
  const n = hashNum(seed)
  const part1 = 90000 + (n % 10000)
  const part2 = 10000 + (Math.floor(n / 13) % 90000)
  return `+91 ${part1} ${part2}`
}

function buildTeam(trial: TrialSummary): TeamMember[] {
  const h = hashNum(trial.id)
  const siteDomain = `${slug(trial.site).slice(0, 12) || "site"}.org`
  const sponsorDomain = `${slug(trial.sponsor).slice(0, 14) || "sponsor"}.com`
  const crc1 = CRC_POOL[h % CRC_POOL.length]
  const crc2 = CRC_POOL[(h + 3) % CRC_POOL.length]
  const sponsorContact = SPONSOR_CONTACT_POOL[h % SPONSOR_CONTACT_POOL.length]

  return [
    { name: trial.pi, role: "Principal Investigator", org: `${trial.site} · ${trial.department}`, email: emailFor(trial.pi, siteDomain), phone: phoneFor(trial.pi + trial.id) },
    { name: crc1, role: "Clinical Research Coordinator", org: trial.site, email: emailFor(crc1, siteDomain), phone: phoneFor(crc1 + trial.id) },
    { name: crc2, role: "Clinical Research Coordinator", org: trial.site, email: emailFor(crc2, siteDomain), phone: phoneFor(crc2 + trial.id) },
    { name: sponsorContact, role: "Sponsor Contact", org: trial.sponsor, email: emailFor(sponsorContact, sponsorDomain), phone: phoneFor(sponsorContact + trial.id) },
  ]
}

const patientStatusStyle: Record<string, { label: string; cls: string }> = {
  "on-track": { label: "On Track", cls: "bg-success/15 text-success" },
  overdue: { label: "Overdue", cls: "bg-destructive/10 text-destructive" },
  completed: { label: "Completed", cls: "bg-info/10 text-info" },
  withdrawn: { label: "Withdrawn", cls: "bg-muted text-muted-foreground" },
}

// Reusable label/value row for the detail panels.
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow text-muted-foreground/60">{label}</p>
      <p className="text-sm text-foreground mt-0.5">{value}</p>
    </div>
  )
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow text-muted-foreground mb-3">{children}</p>
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
  const [data, setData] = useState<TrialSummary>(trial)
  useEffect(() => setData(trial), [trial])
  const [showShare, setShowShare] = useState(false)
  const [shareForm, setShareForm] = useState({ ...emptyShareForm, orgName: data.sponsor })
  const [toast, setToast] = useState<string | null>(null)
  const [showEdit, setShowEdit] = useState(false)
  const [editDraft, setEditDraft] = useState({ title: data.title, phase: data.phase, disease: data.disease, drug: data.drug, status: data.status, recruitment: data.recruitment })

  const openShare = () => {
    setShareForm({ ...emptyShareForm, orgName: data.sponsor })
    setShowShare(true)
  }

  const submitShare = () => {
    const name = shareForm.fullName.trim() || "member"
    setShowShare(false)
    setToast(`${data.id} shared with ${name} (${shareForm.accessType})`)
    setTimeout(() => setToast(null), 2600)
  }

  const shareValid = shareForm.fullName.trim() !== "" && shareForm.email.trim() !== ""

  const openEdit = () => {
    setEditDraft({ title: data.title, phase: data.phase, disease: data.disease, drug: data.drug, status: data.status, recruitment: data.recruitment })
    setShowEdit(true)
  }

  const saveEdit = () => {
    setData(d => ({ ...d, ...editDraft }))
    setShowEdit(false)
    setToast(`${data.id} updated`)
    setTimeout(() => setToast(null), 2600)
  }

  const downloadTrial = () => {
    setToast(`${data.id} protocol downloaded`)
    setTimeout(() => setToast(null), 2600)
  }

  const counters: { label: string; value: number; cls: string }[] = [
    { label: "Total Screened", value: data.screened, cls: "bg-info/10 text-info" },
    { label: "Screen Failures", value: data.screenFail, cls: "bg-warning/15 text-warning" },
    { label: "Randomized", value: data.randomized, cls: "bg-violet/10 text-violet" },
    { label: "Follow Up", value: data.followUp, cls: "bg-accent/12 text-accent" },
    { label: "Completed", value: data.completed, cls: "bg-success/15 text-success" },
    { label: "Withdrawn", value: data.withdrawn, cls: "bg-muted text-muted-foreground" },
    { label: "Dropout", value: data.dropout, cls: "bg-destructive/10 text-destructive" },
  ]

  const documents = [
    { label: "Uploaded Protocol", value: `${data.id}_Protocol_v2.1.pdf` },
    { label: "Uploaded by", value: data.pi },
    { label: "Date & Time of Upload", value: "12 May 2026, 10:30 AM" },
    { label: "Schedule Template", value: `${data.id}_VisitSchedule_v1.0.xlsx` },
  ]

  const versionHistory = [
    { version: "v2.1", note: "Updated inclusion criteria", date: "12 May 2026" },
    { version: "v2.0", note: "Amended visit schedule", date: "02 Mar 2026" },
    { version: "v1.0", note: "Initial protocol", date: "15 Jan 2026" },
  ]

  const team = buildTeam(data)

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
        <div className="relative flex items-center gap-3">
          <button onClick={onBack} aria-label="Back" className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-primary-foreground/55">Trial summary</p>
            <h1 className="display-serif text-lg leading-tight truncate">{data.id}</h1>
          </div>
          <TrialActionsMenu
            triggerClassName="text-primary-foreground"
            onEdit={openEdit}
            onDownload={downloadTrial}
            onShare={openShare}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
        {/* Identity hero — the dawn gesture */}
        <div className="dawn-gradient hero-glow paper-grain rounded-3xl p-5 text-primary-foreground shadow-md animate-rise" style={{ animationDelay: "40ms" }}>
          <div className="relative flex items-center justify-between gap-2">
            <span className="font-mono text-xs tabular-nums rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-sm">{data.id}</span>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">{data.status}</span>
          </div>
          <h2 className="relative mt-3 font-heading text-lg leading-snug">{data.title}</h2>
          <div className="relative mt-3 flex flex-wrap gap-2 text-xs">
            {[data.phase, data.disease, data.drug].map((c, i) => (
              <span key={i} className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">{c}</span>
            ))}
          </div>
          <p className="relative mt-3 text-sm text-white/85 inline-flex items-center gap-1.5">
            <Building2 className="h-4 w-4" /> {data.sponsor} · {data.recruitment}
          </p>
        </div>

        {/* Panel — Registry & people */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-xs animate-rise" style={{ animationDelay: "110ms" }}>
          <PanelTitle>Trial Details</PanelTitle>
          <div className="grid grid-cols-2 gap-y-3 gap-x-3">
            <div className="col-span-2 flex items-start gap-2">
              <FileText className="w-4 h-4 text-muted-foreground/70 mt-0.5 flex-shrink-0" />
              <DetailRow label="CTRI No." value={ctriNo(data.id)} />
            </div>
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground/70 mt-0.5 flex-shrink-0" />
              <DetailRow label="Sponsor Name" value={data.sponsor} />
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground/70 mt-0.5 flex-shrink-0" />
              <DetailRow label="Site Name" value={data.site} />
            </div>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-muted-foreground/70 mt-0.5 flex-shrink-0" />
              <DetailRow label="PI Name" value={data.pi} />
            </div>
            <div className="flex items-start gap-2">
              <Stethoscope className="w-4 h-4 text-muted-foreground/70 mt-0.5 flex-shrink-0" />
              <DetailRow label="Department" value={data.department} />
            </div>
          </div>
        </div>

        {/* Panel — Status (funnel + counters) */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-xs animate-rise" style={{ animationDelay: "180ms" }}>
          <PanelTitle>Enrolment</PanelTitle>
          <div className="grid grid-cols-3 gap-2">
            {counters.map(c => (
              <div key={c.label} className={cn("rounded-xl p-2.5 text-center", c.cls)}>
                <p className="font-heading text-lg leading-none tabular-nums">{c.value}</p>
                <p className="text-[10px] font-medium mt-1 leading-tight">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel — Trial Team */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-xs animate-rise" style={{ animationDelay: "250ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-muted-foreground/70" />
            <PanelTitle>Trial Team</PanelTitle>
          </div>
          <div className="space-y-2.5">
            {team.map(m => (
              <div key={`${m.role}-${m.name}`} className="rounded-2xl border border-border bg-surface p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-secondary/60 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {initials(m.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{m.org}</p>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0", teamRoleStyle[m.role])}>
                    {m.role === "Principal Investigator" ? "PI" : m.role === "Clinical Research Coordinator" ? "CRC" : "Sponsor"}
                  </span>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-border space-y-1.5">
                  <a href={`mailto:${m.email}`} className="springy flex items-center gap-2 text-xs text-muted-foreground hover:text-info active:scale-[0.99]">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{m.email}</span>
                  </a>
                  <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="springy flex items-center gap-2 text-xs text-muted-foreground hover:text-info active:scale-[0.99]">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{m.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel — Patients */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-xs animate-rise" style={{ animationDelay: "320ms" }}>
          <div className="flex items-center justify-between mb-3">
            <PanelTitle>Patients</PanelTitle>
            <button
              onClick={onAddPatient}
              className="springy flex-shrink-0 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold whitespace-nowrap active:scale-95"
            >
              Add Patient
            </button>
          </div>
          <div className="space-y-2.5">
            {patients.length === 0 && (
              <p className="text-sm text-muted-foreground/70 text-center py-4">No patients enrolled yet.</p>
            )}
            {patients.map(p => {
              const st = patientStatusStyle[p.status] ?? { label: p.status, cls: "bg-muted text-muted-foreground" }
              return (
                <div key={p.id} className="rounded-2xl border border-border bg-surface p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-secondary/60 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {initials(p.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{p.id}</p>
                        <p className="text-[11px] text-muted-foreground">{initials(p.name)}</p>
                      </div>
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0", st.cls)}>{st.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2 border-t border-border">
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

        {/* Panel — Documents + version */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-xs animate-rise" style={{ animationDelay: "390ms" }}>
          <PanelTitle>Documents</PanelTitle>
          <div className="space-y-2.5">
            {documents.map(d => (
              <div key={d.label} className="flex items-start gap-2">
                {d.label === "Date & Time of Upload"
                  ? <Clock className="w-4 h-4 text-muted-foreground/70 mt-0.5 flex-shrink-0" />
                  : d.label === "Uploaded by"
                    ? <User className="w-4 h-4 text-muted-foreground/70 mt-0.5 flex-shrink-0" />
                    : <FileText className="w-4 h-4 text-muted-foreground/70 mt-0.5 flex-shrink-0" />}
                <DetailRow label={d.label} value={d.value} />
              </div>
            ))}
          </div>

          {/* Version History */}
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-muted-foreground/70" />
              <p className="eyebrow text-muted-foreground/70">Version History</p>
            </div>
            <div className="space-y-2">
              {versionHistory.map(v => (
                <div key={v.version} className="flex items-center justify-between rounded-xl bg-surface px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground font-mono">{v.version}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{v.note}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70 flex-shrink-0">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {v.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Trial modal */}
      {showEdit && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/40 animate-fade-in" onClick={() => setShowEdit(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-card rounded-t-3xl max-h-[88%] flex flex-col animate-rise">
            <div className="px-4 pt-3">
              <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-border" />
            </div>
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
              <div className="min-w-0">
                <p className="font-heading text-base text-foreground">Edit Trial</p>
                <p className="text-xs text-muted-foreground truncate font-mono">{data.id}</p>
              </div>
              <button onClick={() => setShowEdit(false)} className="springy p-1.5 rounded-full hover:bg-muted active:scale-90">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
              <div>
                <label className="eyebrow text-muted-foreground">Study Title</label>
                <textarea
                  value={editDraft.title}
                  onChange={e => setEditDraft(f => ({ ...f, title: e.target.value }))}
                  rows={2}
                  className="mt-1.5 w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none resize-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow text-muted-foreground">Phase</label>
                  <input
                    value={editDraft.phase}
                    onChange={e => setEditDraft(f => ({ ...f, phase: e.target.value }))}
                    className="mt-1.5 w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div>
                  <label className="eyebrow text-muted-foreground">Indication</label>
                  <input
                    value={editDraft.disease}
                    onChange={e => setEditDraft(f => ({ ...f, disease: e.target.value }))}
                    className="mt-1.5 w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Drug Name</label>
                <input
                  value={editDraft.drug}
                  onChange={e => setEditDraft(f => ({ ...f, drug: e.target.value }))}
                  className="mt-1.5 w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Status</label>
                <div className="mt-1.5 flex rounded-full bg-muted p-1">
                  {(["Active", "Completed", "Terminated"] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setEditDraft(f => ({ ...f, status: s }))}
                      className={cn("flex-1 rounded-full px-2 py-2 text-xs font-semibold transition-all",
                        editDraft.status === s ? "bg-card text-foreground shadow-xs" : "text-muted-foreground")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Recruitment Status</label>
                <input
                  value={editDraft.recruitment}
                  onChange={e => setEditDraft(f => ({ ...f, recruitment: e.target.value }))}
                  className="mt-1.5 w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>

            <div className="px-4 py-3 border-t border-border">
              <button onClick={saveEdit} className="springy w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground bg-primary-deep active:scale-[0.98]">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Trial modal */}
      {showShare && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/40 animate-fade-in" onClick={() => setShowShare(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-card rounded-t-3xl max-h-[88%] flex flex-col animate-rise">
            <div className="px-4 pt-3">
              <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-border" />
            </div>
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
              <div className="min-w-0">
                <p className="font-heading text-base text-foreground inline-flex items-center gap-1.5"><Share2 className="w-4 h-4 text-primary" /> Share Trial</p>
                <p className="text-xs text-muted-foreground truncate">Share {data.id} with an organization member</p>
              </div>
              <button onClick={() => setShowShare(false)} className="springy p-1.5 rounded-full hover:bg-muted active:scale-90">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
              <div>
                <label className="eyebrow text-muted-foreground">Full Name</label>
                <input
                  value={shareForm.fullName}
                  onChange={e => setShareForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="e.g. Dr. Anita Rao"
                  className="mt-1.5 w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Designation</label>
                <input
                  value={shareForm.designation}
                  onChange={e => setShareForm(f => ({ ...f, designation: e.target.value }))}
                  placeholder="e.g. Co-Investigator"
                  className="mt-1.5 w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Email ID</label>
                <input
                  type="email"
                  value={shareForm.email}
                  onChange={e => setShareForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="name@example.com"
                  className="mt-1.5 w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Role</label>
                <div className="mt-1.5 flex rounded-full bg-muted p-1">
                  {(["PI", "Research Team"] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => setShareForm(f => ({ ...f, role: r }))}
                      className={cn("flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-all",
                        shareForm.role === r ? "bg-card text-foreground shadow-xs" : "text-muted-foreground")}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Phone No.</label>
                <input
                  type="tel"
                  value={shareForm.phone}
                  onChange={e => setShareForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="mt-1.5 w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Org. Name</label>
                <input
                  value={shareForm.orgName}
                  onChange={e => setShareForm(f => ({ ...f, orgName: e.target.value }))}
                  placeholder="Organization name"
                  className="mt-1.5 w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground">Access Type</label>
                <div className="mt-1.5 flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5">
                  <span className="text-sm font-medium text-foreground">{shareForm.accessType}</span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/70"><Lock className="w-3 h-3" /> Default</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-border">
              <button
                onClick={submitShare}
                disabled={!shareValid}
                className={cn("springy w-full rounded-xl py-3 text-sm font-semibold active:scale-[0.98]",
                  shareValid ? "bg-primary-deep text-primary-foreground" : "bg-muted text-muted-foreground/70 cursor-not-allowed")}
              >
                Share Trial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation toast */}
      {toast && (
        <div className="absolute bottom-4 left-4 right-4 z-50 flex items-start gap-3 bg-primary-deep rounded-2xl px-4 py-3 shadow-2xl ring-1 ring-white/10 animate-rise">
          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-success-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-primary-foreground leading-snug">{toast}</p>
          </div>
        </div>
      )}
    </div>
  )
}
