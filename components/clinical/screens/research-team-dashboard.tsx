"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "../bottom-nav"
import {
  CheckCircle, Clock, AlertTriangle, ChevronRight, ChevronLeft, ChevronDown, Check,
  Users, FileText, Calendar, Pill, Building2, X, Bell,
  UserPlus, Send, FilePlus2, Stethoscope, ListTodo,
  ArrowUpRight, Sun, Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TrialSummaryScreen } from "@/components/clinical/screens/trial-summary-screen"
import { SiteUserProfile } from "@/components/clinical/screens/site-user-profile"

interface ResearchTeamDashboardProps {
  onNavigate: (screen: string) => void
  initialTab?: CrcTab
}

type CrcTab = "dashboard" | "patients" | "tasks" | "chat" | "notifs" | "me"
type TaskFilter = "today" | "week" | "overdue" | "completed"

interface Task {
  id: string
  title: string
  patient: string
  priority: "high" | "medium" | "low"
  due: string
  done: boolean
  category: "visit" | "ecrf" | "medication" | "screening"
}

const initialTasks: Task[] = [
  { id: "T1", title: "Log Visit 6 vitals", patient: "SUBJ-001", priority: "high", due: "Today", done: false, category: "visit" },
  { id: "T2", title: "Submit eCRF AE form", patient: "SUBJ-003", priority: "high", due: "Today", done: false, category: "ecrf" },
  { id: "T3", title: "Confirm medication adherence", patient: "SUBJ-002", priority: "medium", due: "Today", done: false, category: "medication" },
  { id: "T4", title: "Screen candidate SCR-021", patient: "New Patient", priority: "medium", due: "Today", done: false, category: "screening" },
  { id: "T5", title: "Prepare Visit 7 checklist", patient: "SUBJ-001", priority: "low", due: "Thu 29", done: false, category: "visit" },
  { id: "T6", title: "Update concomitant meds", patient: "SUBJ-004", priority: "medium", due: "Thu 29", done: false, category: "ecrf" },
  { id: "T7", title: "Follow up deviation DEV-001", patient: "SUBJ-002", priority: "high", due: "Overdue", done: false, category: "visit" },
  { id: "T8", title: "Lab sample collection", patient: "SUBJ-005", priority: "high", due: "Overdue", done: false, category: "visit" },
  { id: "T9", title: "Reviewed ICF for SCR-018", patient: "SCR-018", priority: "low", due: "22 May", done: true, category: "screening" },
]

type TodayVisit = {
  id: string; patient: string; name: string; visit: string; time: string; type: string
  protocol: string; indication: string; phase: string; pi: string; done: boolean
  completedBy?: string; completedByRole?: string; completedAt?: string
}
const todayVisits: TodayVisit[] = [
  { id: "V1", patient: "SUBJ-001", name: "Priya Krishnan", visit: "Visit 6", time: "9:00 AM", type: "Efficacy Assessment", protocol: "Protocol-001", indication: "Type 2 Diabetes", phase: "Phase II", pi: "Dr. Sharma", done: false },
  { id: "V2", patient: "SUBJ-003", name: "Anita Patel", visit: "Visit 2", time: "11:30 AM", type: "Safety Follow-up", protocol: "Protocol-001", indication: "Type 2 Diabetes", phase: "Phase II", pi: "Dr. Sharma", done: false },
  { id: "V3", patient: "SUBJ-004", name: "Vijay Sharma", visit: "Visit 5", time: "2:00 PM", type: "Lab & Vitals", protocol: "Protocol-005", indication: "Asthma", phase: "Phase III", pi: "Dr. Sharma", done: true, completedBy: "Priya Desai", completedByRole: "CRC", completedAt: "2:35 PM" },
]

// Subjects are identified by initials only (privacy). "Priya Krishnan" → "P.K."
const subjectInitials = (full: string) =>
  full.split(/\s+/).filter(Boolean).map(w => w[0]?.toUpperCase() ?? "").join(".")

const overduePatients = [
  { id: "SUBJ-002", name: "Rahul Mehta", visit: "Visit 4", daysOverdue: 3, lastContact: "19 May" },
]

type PatientStatus = "on-track" | "overdue" | "completed" | "withdrawn" | "screen-failure" | "dropout"
type VisitOutcome = "completed" | "missed" | "scheduled"
type VisitRecord = {
  visit: string
  dateISO: string
  type: string
  outcome: VisitOutcome
  note?: string
}
type Patient = {
  id: string
  name: string
  age: number
  visit: string
  visitName?: string
  visitType?: string
  dateISO: string
  status: PatientStatus
  note?: string
  visitCompleted?: boolean
  lastUpdated?: string
  history?: VisitRecord[]
}

const initialPatients: Patient[] = [
  {
    id: "SUBJ-001", name: "Priya Krishnan", age: 45, visit: "Visit 7", dateISO: "2026-05-23", status: "on-track",
    history: [
      { visit: "Visit 1", dateISO: "2026-01-15", type: "Screening", outcome: "completed", note: "Eligibility confirmed, ICF signed" },
      { visit: "Visit 2", dateISO: "2026-02-05", type: "Baseline", outcome: "completed", note: "Randomized to treatment arm" },
      { visit: "Visit 3", dateISO: "2026-02-26", type: "Safety Follow-up", outcome: "completed" },
      { visit: "Visit 4", dateISO: "2026-03-19", type: "Efficacy Assessment", outcome: "completed", note: "HbA1c improving" },
      { visit: "Visit 5", dateISO: "2026-04-09", type: "Lab & Vitals", outcome: "completed" },
      { visit: "Visit 6", dateISO: "2026-04-30", type: "Efficacy Assessment", outcome: "missed", note: "Patient travelling, rescheduled" },
    ],
  },
  {
    id: "SUBJ-002", name: "Rahul Mehta", age: 52, visit: "Visit 4", dateISO: "2026-05-19", status: "overdue",
    history: [
      { visit: "Visit 1", dateISO: "2026-02-10", type: "Screening", outcome: "completed", note: "ICF signed" },
      { visit: "Visit 2", dateISO: "2026-03-03", type: "Baseline", outcome: "completed", note: "Randomized" },
      { visit: "Visit 3", dateISO: "2026-04-21", type: "Safety Follow-up", outcome: "completed" },
    ],
  },
  {
    id: "SUBJ-003", name: "Anita Patel", age: 38, visit: "Visit 2", dateISO: "2026-06-08", status: "on-track",
    history: [
      { visit: "Visit 1", dateISO: "2026-05-18", type: "Screening", outcome: "completed", note: "Eligibility confirmed" },
    ],
  },
  {
    id: "SUBJ-004", name: "Vijay Sharma", age: 61, visit: "Visit 5", dateISO: "2026-06-08", status: "on-track",
    history: [
      { visit: "Visit 1", dateISO: "2026-02-20", type: "Screening", outcome: "completed" },
      { visit: "Visit 2", dateISO: "2026-03-13", type: "Baseline", outcome: "completed", note: "Randomized" },
      { visit: "Visit 3", dateISO: "2026-04-03", type: "Safety Follow-up", outcome: "completed" },
      { visit: "Visit 4", dateISO: "2026-05-15", type: "Lab & Vitals", outcome: "completed" },
    ],
  },
  {
    id: "SUBJ-005", name: "Deepa Nair", age: 44, visit: "—", dateISO: "", status: "withdrawn",
    history: [
      { visit: "Visit 1", dateISO: "2026-03-01", type: "Screening", outcome: "completed" },
      { visit: "Visit 2", dateISO: "2026-03-22", type: "Baseline", outcome: "completed", note: "Randomized" },
      { visit: "Visit 3", dateISO: "2026-04-12", type: "Safety Follow-up", outcome: "missed", note: "Withdrew consent" },
    ],
  },
]

const TODAY_ISO = "2026-06-08"

function patientInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("")
}

// System-generated visit plan — created when the trial schedule is uploaded and the
// patient is enrolled. Planned dates are projected from the patient's Visit 1 anchor.
const PROTOCOL_SCHEDULE: { visit: string; type: string }[] = [
  { visit: "Visit 1", type: "Screening" },
  { visit: "Visit 2", type: "Baseline" },
  { visit: "Visit 3", type: "Safety Follow-up" },
  { visit: "Visit 4", type: "Efficacy Assessment" },
  { visit: "Visit 5", type: "Lab & Vitals" },
  { visit: "Visit 6", type: "Efficacy Assessment" },
  { visit: "Visit 7", type: "Efficacy Assessment" },
  { visit: "Visit 8", type: "End of Study" },
]
const VISIT_INTERVAL_DAYS = 21
const VISIT_WINDOW_DAYS = 3

type ScheduledVisit = { visit: string; type: string; dateISO: string; state: "completed" | "missed" | "upcoming" | "planned" }

function buildVisitSchedule(p: Patient): ScheduledVisit[] {
  const anchorISO = p.history?.find(v => v.visit === "Visit 1")?.dateISO || p.history?.[0]?.dateISO || p.dateISO || ""
  const anchor = anchorISO ? new Date(anchorISO + "T00:00:00") : null
  return PROTOCOL_SCHEDULE.map((s, i) => {
    const rec = p.history?.find(h => h.visit === s.visit)
    if (rec) return { visit: s.visit, type: s.type, dateISO: rec.dateISO, state: rec.outcome === "missed" ? "missed" : "completed" }
    if (p.visit === s.visit && p.dateISO) return { visit: s.visit, type: s.type, dateISO: p.dateISO, state: "upcoming" }
    let dateISO = ""
    if (anchor) {
      const d = new Date(anchor)
      d.setDate(d.getDate() + i * VISIT_INTERVAL_DAYS)
      dateISO = d.toISOString().slice(0, 10)
    }
    return { visit: s.visit, type: s.type, dateISO, state: "planned" }
  })
}

// Build the "Visit 7 · 23 May" line shown on each patient card.
function visitLine(p: Patient): string {
  if (!p.dateISO) return p.visit === "—" ? "No upcoming visit" : p.visit
  let dateLabel: string
  if (p.status === "overdue") dateLabel = "OVERDUE"
  else if (p.dateISO === TODAY_ISO) dateLabel = "Today"
  else dateLabel = new Date(p.dateISO + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
  return `${p.visit} · ${dateLabel}`
}

const crcTrials = [
  { id: "Protocol-001", title: "Diabetes Phase II", phase: "Phase II", disease: "Type 2 Diabetes", drug: "Metformin XR", sponsor: "PharmaCo Ltd", site: "Apollo Hospital Chennai", pi: "Dr. Sharma", department: "Endocrinology", status: "Active", recruitment: "Recruiting", screened: 48, screenFail: 7, randomized: 34, withdrawn: 2, dropout: 1, followUp: 18, completed: 9 },
  { id: "Protocol-005", title: "Asthma Maintenance Study", phase: "Phase III", disease: "Asthma", drug: "Budesonide", sponsor: "Respira Labs", site: "Apollo Hospital Chennai", pi: "Dr. Sharma", department: "Pulmonology", status: "Active", recruitment: "Recruiting", screened: 31, screenFail: 4, randomized: 22, withdrawn: 1, dropout: 0, followUp: 12, completed: 6 },
  { id: "Protocol-008", title: "Rheumatoid Arthritis Trial", phase: "Phase II", disease: "Rheumatoid Arthritis", drug: "Methotrexate", sponsor: "NovaCure Bio", site: "Apollo Hospital Chennai", pi: "Dr. Rao", department: "Rheumatology", status: "Completed", recruitment: "Closed", screened: 62, screenFail: 8, randomized: 46, withdrawn: 3, dropout: 2, followUp: 0, completed: 41 },
]

const crcSponsors = [
  { name: "PharmaCo Ltd", trials: [crcTrials[0]] },
  { name: "Respira Labs", trials: [crcTrials[1]] },
  { name: "NovaCure Bio", trials: [crcTrials[2]] },
]

// PIs the CRC works with, grouped from the trial roster. A PI conducting
// trials in several departments lists each department once.
const crcPIs = Object.values(
  crcTrials.reduce<Record<string, { name: string; departments: string[]; trials: typeof crcTrials }>>(
    (acc, tr) => {
      const entry = (acc[tr.pi] ??= { name: tr.pi, departments: [], trials: [] })
      if (!entry.departments.includes(tr.department)) entry.departments.push(tr.department)
      entry.trials.push(tr)
      return acc
    },
    {},
  ),
)

const statusStyle: Record<string, { label: string; bg: string; text: string; rail: string }> = {
  "on-track": { label: "On Track", bg: "bg-success/15", text: "text-success", rail: "bg-success" },
  overdue:    { label: "Overdue",  bg: "bg-destructive/10", text: "text-destructive", rail: "bg-destructive" },
  completed:  { label: "Completed",bg: "bg-info/10", text: "text-info", rail: "bg-info" },
  withdrawn:  { label: "Withdrawn",bg: "bg-muted", text: "text-muted-foreground", rail: "bg-muted-foreground/40" },
  "screen-failure": { label: "Screen Failure", bg: "bg-destructive/10", text: "text-destructive", rail: "bg-destructive" },
  dropout:    { label: "Dropout",  bg: "bg-warning/15", text: "text-warning", rail: "bg-warning" },
}

const priorityStyle: Record<string, { dot: string; badge: string; badgeText: string }> = {
  high:   { dot: "bg-destructive",   badge: "bg-destructive/10",   badgeText: "text-destructive" },
  medium: { dot: "bg-warning", badge: "bg-warning/15", badgeText: "text-warning" },
  low:    { dot: "bg-success",  badge: "bg-accent/12",  badgeText: "text-accent" },
}

const categoryIcon: Record<string, React.FC<{ className?: string }>> = {
  visit: Calendar,
  ecrf: FileText,
  medication: Pill,
  screening: Users,
}

const trialStatusColor: Record<string, string> = {
  Active: "bg-success/15 text-success",
  Completed: "bg-info/10 text-info",
  Terminated: "bg-destructive/10 text-destructive",
}

// ── Animated count-up numeral — eases 0 → value on mount ─────────────────────
function CountUp({ value, className, duration = 900 }: { value: number; className?: string; duration?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <span className={className}>{n}</span>
}

// ── Self-drawing progress ring (fraction 0..1) — the day's signature gauge ───
function ProgressRing({ value, size = 84, stroke = 7, children }: { value: number; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const [p, setP] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setP(value))
    return () => cancelAnimationFrame(id)
  }, [value])
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-white/20" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
          className="text-white" strokeDasharray={c} strokeDashoffset={c * (1 - p)}
          style={{ transition: "stroke-dashoffset 1200ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

// ── Editorial section marker — gradient tick + small-caps label ──────────────
function SectionLabel({ label, tone = "text-muted-foreground", action }: { label: string; tone?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className={cn("h-3.5 w-1 rounded-full", tone === "text-destructive" ? "bg-destructive" : "dawn-gradient")} />
        <p className={cn("eyebrow", tone)}>{label}</p>
      </div>
      {action}
    </div>
  )
}

export function ResearchTeamDashboard({ onNavigate, initialTab = "dashboard" }: ResearchTeamDashboardProps) {
  const [activeTab, setActiveTab] = useState<CrcTab>(initialTab)
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("today")
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedTrial, setSelectedTrial] = useState<typeof crcTrials[0] | null>(null)
  const [showAllTrials, setShowAllTrials] = useState(false)
  const [showSponsors, setShowSponsors] = useState(false)
  const [showPIs, setShowPIs] = useState(false)
  // Patient visit updates
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [editPatient, setEditPatient] = useState<Patient | null>(null)
  const [viewPatient, setViewPatient] = useState<Patient | null>(null)
  const [recordScheduleOpen, setRecordScheduleOpen] = useState(false)
  const [form, setForm] = useState<{ visit: string; visitName: string; visitType: string; dateISO: string; status: PatientStatus; note: string }>({
    visit: "", visitName: "", visitType: "Hospital", dateISO: "", status: "on-track", note: "",
  })
  const [savedToast, setSavedToast] = useState<string | null>(null)
  // Patients roster — search + status filter
  const [patientQuery, setPatientQuery] = useState("")
  const [patientFilter, setPatientFilter] = useState<string>("all")

  const openVisitUpdate = (p: Patient) => {
    setForm({
      visit: p.visit,
      visitName: p.visitName ?? p.history?.find(v => v.visit === p.visit)?.type ?? "",
      visitType: p.visitType ?? "Hospital",
      dateISO: p.dateISO,
      status: p.status,
      note: p.note ?? "",
    })
    setEditPatient(p)
  }

  const saveVisitUpdate = () => {
    if (!editPatient) return
    const now = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== editPatient.id) return p
        const completed = form.status !== "withdrawn"
        // Log the visit into the history timeline.
        let history = p.history ?? []
        if (form.visit) {
          const existing = history.find((v) => v.visit === form.visit)
          const entry: VisitRecord = {
            visit: form.visit,
            dateISO: form.dateISO,
            type: form.visitName.trim() || form.visitType || existing?.type || "Visit",
            outcome: completed ? "completed" : "missed",
            note: form.note.trim() || existing?.note,
          }
          history = existing
            ? history.map((v) => (v.visit === form.visit ? entry : v))
            : [...history, entry]
        }
        return {
          ...p,
          visit: form.visit,
          visitName: form.visitName.trim() || undefined,
          visitType: form.visitType || undefined,
          dateISO: form.dateISO,
          status: form.status,
          visitCompleted: completed,
          note: form.note.trim(),
          lastUpdated: now,
          history,
        }
      }),
    )
    setSavedToast(`${editPatient.id} updated`)
    setEditPatient(null)
    setTimeout(() => setSavedToast(null), 2200)
  }

  const [completedVisits] = useState<Set<string>>(new Set(
    todayVisits.filter(v => v.done).map(v => v.id)
  ))

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  // Dashboard focus list: completing a task plays a fill→collapse exit, then it
  // drops off the dashboard (still visible under the "All tasks" Completed filter).
  const [exitingTasks, setExitingTasks] = useState<Set<string>>(new Set())
  const completeFromDashboard = (id: string) => {
    if (exitingTasks.has(id)) return
    setExitingTasks(prev => new Set(prev).add(id))
    setTimeout(() => {
      toggleTask(id)
      setExitingTasks(prev => { const n = new Set(prev); n.delete(id); return n })
    }, 380)
  }

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "today") return t.due === "Today" && !t.done
    if (taskFilter === "week") return (t.due !== "Overdue" && t.due !== "Today") && !t.done
    if (taskFilter === "overdue") return t.due === "Overdue" && !t.done
    if (taskFilter === "completed") return t.done
    return true
  })

  // Day-at-a-glance figures, shared by the hero and the body.
  const doneToday = todayVisits.filter(v => completedVisits.has(v.id)).length
  const tasksDueToday = tasks.filter(t => t.due === "Today" && !t.done).length
  const todayLabel = new Date(TODAY_ISO + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
  const firstPendingVisitId = todayVisits.find(v => !completedVisits.has(v.id))?.id

  // ── Shared dawn sub-screen header ─────────────────────────────────────────
  const SubHeader = ({ eyebrow, title, onBack, right }: { eyebrow: string; title: string; onBack: () => void; right?: React.ReactNode }) => (
    <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
      <div className="relative flex items-center gap-3">
        <button onClick={onBack} aria-label="Back" className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="eyebrow text-primary-foreground/55">{eyebrow}</p>
          <h1 className="display-serif text-lg leading-tight truncate">{title}</h1>
        </div>
        {right}
      </div>
    </div>
  )

  // ── One trial = one clickable panel → Trial Summary ───────────────────────
  const TrialPanel = ({ tr }: { tr: typeof crcTrials[0] }) => (
    <button onClick={() => setSelectedTrial(tr)} className="springy group relative w-full overflow-hidden text-left bg-card rounded-3xl border border-border p-4 pl-5 shadow-sm active:scale-[0.99] hover:shadow-md">
      <span className="absolute left-0 top-0 bottom-0 w-1.5 dawn-gradient" />
      <div className="flex items-center justify-between mb-2.5">
        <span className="font-mono text-xs font-semibold text-primary bg-secondary/50 px-2.5 py-1 rounded-full">{tr.id}</span>
        <div className="flex items-center gap-1.5">
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", trialStatusColor[tr.status] || "bg-muted text-muted-foreground")}>{tr.status}</span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground/70 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
      <h4 className="font-heading text-foreground text-base leading-snug mb-2.5">{tr.title}</h4>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {[
          { val: tr.phase, cls: "bg-info/10 text-info" },
          { val: tr.disease, cls: "bg-accent/12 text-accent" },
          { val: tr.drug, cls: "bg-violet/10 text-violet" },
        ].map(c => (
          <span key={c.val} className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", c.cls)}>{c.val}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-3 pt-3 border-t border-border">
        {[
          { label: "Sponsor", val: tr.sponsor },
          { label: "PI", val: tr.pi },
          { label: "Site", val: tr.site },
          { label: "Department", val: tr.department },
        ].map(f => (
          <div key={f.label}>
            <p className="eyebrow text-muted-foreground/60 text-[9px]">{f.label}</p>
            <p className="text-xs font-medium text-foreground mt-0.5 truncate">{f.val}</p>
          </div>
        ))}
      </div>
    </button>
  )

  const SponsorPanel = ({ sponsor }: { sponsor: typeof crcSponsors[0] }) => (
    <div className="bg-card rounded-3xl border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-11 h-11 rounded-2xl bg-info/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-info" />
        </div>
        <div>
          <p className="eyebrow text-muted-foreground/60">Sponsor Name</p>
          <h4 className="font-heading text-foreground text-[15px]">{sponsor.name}</h4>
        </div>
      </div>
      <div className="space-y-2">
        {sponsor.trials.map(tr => (
          <button key={tr.id} onClick={() => setSelectedTrial(tr)} className="springy w-full text-left rounded-2xl border border-border bg-surface p-3 active:scale-[0.99]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-primary">{tr.id}</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground/60" />
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {[
                { label: "Phase", val: tr.phase },
                { label: "Disease", val: tr.disease },
                { label: "Drug", val: tr.drug },
                { label: "Status of Trial", val: tr.status },
                { label: "Recruitment Status", val: tr.recruitment },
                { label: "Total Screened", val: tr.screened },
                { label: "Screen Failure", val: tr.screenFail },
                { label: "Randomized", val: tr.randomized },
                { label: "Withdrawn", val: tr.withdrawn },
                { label: "Dropout", val: tr.dropout },
                { label: "Follow up", val: tr.followUp },
                { label: "Completed", val: tr.completed },
              ].map(f => (
                <div key={f.label}>
                  <p className="eyebrow text-muted-foreground/60 text-[9px]">{f.label}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{f.val}</p>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // One PI per panel: name + department, then each trial under that PI as a
  // clickable sub-panel opening the CRC/PI Trial Summary page.
  const PIPanel = ({ pi }: { pi: typeof crcPIs[0] }) => (
    <div className="bg-card rounded-3xl border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-11 h-11 rounded-2xl bg-violet/10 flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-violet" />
        </div>
        <div>
          <p className="eyebrow text-muted-foreground/60">PI Name</p>
          <h4 className="font-heading text-foreground text-[15px]">{pi.name}</h4>
          <p className="text-xs text-muted-foreground">{pi.departments.join(" · ")}</p>
        </div>
      </div>
      <div className="space-y-2">
        {pi.trials.map(tr => (
          <button key={tr.id} onClick={() => setSelectedTrial(tr)} className="springy w-full text-left rounded-2xl border border-border bg-surface p-3 active:scale-[0.99]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-primary">{tr.id}</span>
              <div className="flex items-center gap-1.5">
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", trialStatusColor[tr.status] || "bg-muted text-muted-foreground")}>{tr.status}</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground/60" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {[
                { label: "Phase", val: tr.phase },
                { label: "Disease", val: tr.disease },
                { label: "Drug", val: tr.drug },
                { label: "Sponsor", val: tr.sponsor },
              ].map(f => (
                <div key={f.label}>
                  <p className="eyebrow text-muted-foreground/60 text-[9px]">{f.label}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{f.val}</p>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // ── Reusable task row (dashboard preview + tasks tab) ─────────────────────
  // Custom dawn checkbox that fills + pops on complete, a self-drawing
  // strikethrough on the title, and a breathing spine for high priority.
  const TaskRow = ({ task }: { task: Task }) => {
    const style = priorityStyle[task.priority]
    const Icon = categoryIcon[task.category]
    return (
      <div className={cn("springy flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-xs transition-all duration-300", task.done ? "opacity-60 border-border" : "border-border")}>
        <button
          onClick={() => toggleTask(task.id)}
          aria-pressed={task.done}
          aria-label={task.done ? "Mark task incomplete" : "Mark task complete"}
          className={cn(
            "springy relative grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-all active:scale-90",
            task.done ? "dawn-gradient border-transparent shadow-sm" : "border-muted-foreground/30 bg-card hover:border-primary/50"
          )}
        >
          {task.done && <Check className="h-4 w-4 text-primary-foreground animate-pop" strokeWidth={3} />}
        </button>
        <span className={cn("h-9 w-1 rounded-full shrink-0", style.dot, task.priority === "high" && !task.done && "animate-pulse-soft")} />
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl shrink-0", style.badge)}>
          <Icon className={cn("h-4 w-4", style.badgeText)} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            <span className={cn(task.done && "animate-strikethrough text-muted-foreground/70")}>{task.title}</span>
          </p>
          <p className="text-xs text-muted-foreground/70">{task.patient}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize", style.badge, style.badgeText)}>{task.priority}</span>
          <span className={cn("text-[10px]", task.due === "Overdue" ? "text-destructive font-medium" : "text-muted-foreground/70")}>{task.due}</span>
        </div>
      </div>
    )
  }

  // ── Immersive dashboard header — fused app bar + day deck ──────────────────
  const dayProgress = todayVisits.length ? doneToday / todayVisits.length : 0
  const immersiveHeader = (
    <header className="relative overflow-hidden text-primary-foreground">
      {/* Layered dawn atmosphere */}
      <div className="absolute inset-0 dawn-gradient" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-deep via-primary-deep/55 to-transparent" />
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 paper-grain" />
      {/* Self-drawing sunrise arcs */}
      <svg viewBox="0 0 200 200" className="pointer-events-none absolute -right-12 -top-12 h-60 w-60 text-white/25" fill="none">
        <path d="M30 110 a70 70 0 0 1 140 0" stroke="currentColor" strokeWidth="1.5" pathLength={100} className="animate-arc" />
        <path d="M52 110 a48 48 0 0 1 96 0" stroke="currentColor" strokeWidth="1" pathLength={100} className="animate-arc" style={{ animationDelay: "220ms" }} />
        <circle cx="100" cy="110" r="22" stroke="currentColor" strokeWidth="1" className="text-white/15" />
      </svg>
      {/* Drifting motes */}
      <span className="pointer-events-none absolute right-10 top-24 h-2 w-2 rounded-full bg-white/40 animate-drift" />
      <span className="pointer-events-none absolute right-28 top-36 h-1.5 w-1.5 rounded-full bg-white/30 animate-drift-slow" />
      <span className="pointer-events-none absolute left-10 top-44 h-1 w-1 rounded-full bg-white/30 animate-drift" />

      <div className="relative px-4 pt-3.5 pb-16">
        {/* Top row */}
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-white/65">Research Team · CRC</p>
            <h1 className="display-serif text-2xl leading-tight inline-flex items-center gap-2">
              Hi, Meera <Sun className="h-5 w-5 text-white/80 animate-pulse-soft" />
            </h1>
          </div>
          <button onClick={() => onNavigate("notifications")} aria-label="Notifications" className="springy relative grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur-sm active:scale-95 hover:bg-white/25 ring-1 ring-white/20">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-primary-deep">2</span>
          </button>
          <button onClick={() => setActiveTab("me")} aria-label="Account" className="springy grid h-11 w-11 place-items-center rounded-full bg-white/20 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-sm active:scale-95">
            MC
          </button>
        </div>

        {/* Day deck */}
        <div className="relative mt-5 flex items-center gap-4 animate-rise" style={{ animationDelay: "60ms" }}>
          <ProgressRing value={dayProgress}>
            <div>
              <p className="font-heading text-2xl leading-none tabular-nums">{doneToday}/{todayVisits.length}</p>
              <p className="eyebrow text-[8px] text-white/70 mt-0.5">visits</p>
            </div>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-white/70">{todayLabel}</p>
            <h2 className="display-serif text-xl leading-tight">Your day at the site</h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
                <ListTodo className="h-3.5 w-3.5" /> {tasksDueToday} tasks due
              </span>
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1", overduePatients.length ? "bg-destructive/30 ring-white/20" : "bg-white/15 ring-white/15")}>
                <AlertTriangle className="h-3.5 w-3.5" /> {overduePatients.length} overdue
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )

  // ── Compact dawn app bar for non-dashboard tabs ───────────────────────────
  const compactBar = (title: string, eyebrow = "Research Team · CRC") => (
    <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
      <div className="relative flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="eyebrow text-primary-foreground/55">{eyebrow}</p>
          <h1 className="display-serif text-lg leading-tight">{title}</h1>
        </div>
        <button onClick={() => onNavigate("notifications")} aria-label="Notifications" className="springy relative grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-sm active:scale-95 hover:bg-white/25">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-primary-deep">2</span>
        </button>
        <button onClick={() => setActiveTab("me")} aria-label="Account" className="springy grid h-10 w-10 place-items-center rounded-full bg-white/20 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-sm active:scale-95">
          MC
        </button>
      </div>
    </div>
  )

  // ── Dashboard body (floats up into the hero) ──────────────────────────────
  const renderDashboard = () => (
    <div className="relative -mt-10 px-4 pb-6 space-y-6">
      {/* Portfolio bento — floating stat tiles */}
      <div className="grid grid-cols-3 gap-3 animate-rise" style={{ animationDelay: "120ms" }}>
        {[
          { onClick: () => setShowAllTrials(true), icon: FileText, ic: "text-info", bg: "bg-info/12", glow: "bg-info/20", value: crcTrials.length, label: "Total Trials" },
          { onClick: () => setShowSponsors(true), icon: Building2, ic: "text-accent", bg: "bg-accent/15", glow: "bg-accent/20", value: crcSponsors.length, label: "Sponsors" },
          { onClick: () => setShowPIs(true), icon: Stethoscope, ic: "text-violet", bg: "bg-violet/12", glow: "bg-violet/20", value: crcPIs.length, label: "PI's" },
        ].map((s, i) => (
          <button key={i} onClick={s.onClick} className="springy group relative overflow-hidden bg-card rounded-3xl border border-border p-3.5 text-left shadow-md active:scale-[0.96]">
            <span className={cn("absolute -top-6 -right-6 h-16 w-16 rounded-full blur-xl", s.glow)} />
            <div className="relative flex items-center justify-between mb-2">
              <span className={cn("grid h-9 w-9 place-items-center rounded-2xl", s.bg)}>
                <s.icon className={cn("w-5 h-5", s.ic)} />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-primary" />
            </div>
            <p className="relative font-heading text-3xl tabular-nums text-foreground leading-none"><CountUp value={s.value} /></p>
            <p className="relative text-[11px] text-muted-foreground mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="animate-rise" style={{ animationDelay: "190ms" }}>
        <SectionLabel label="Quick actions" />
        <div className="grid grid-cols-3 gap-3">
          {[
            { onClick: () => onNavigate("add-trial"), icon: FilePlus2, orb: "bg-info text-info-foreground", label: "New Trial" },
            { onClick: () => onNavigate("add-patient"), icon: UserPlus, orb: "dawn-gradient text-primary-foreground", label: "Add Patient" },
            { onClick: () => onNavigate("invite-patient"), icon: Send, orb: "bg-accent text-accent-foreground", label: "Invite Patient" },
          ].map((a, i) => (
            <button key={i} onClick={a.onClick} className="springy bg-card rounded-3xl border border-border p-3 shadow-xs flex flex-col items-center gap-2 active:scale-[0.96] hover:shadow-sm">
              <div className={cn("grid h-12 w-12 place-items-center rounded-2xl shadow-sm", a.orb)}>
                <a.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* My Trials */}
      <section className="animate-rise" style={{ animationDelay: "260ms" }}>
        <SectionLabel
          label="My trials"
          action={
            <button onClick={() => setShowAllTrials(true)} className="springy text-info text-sm font-semibold inline-flex items-center gap-0.5 active:scale-95">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          }
        />
        <div className="space-y-3">
          {crcTrials.slice(0, 2).map(tr => <TrialPanel key={tr.id} tr={tr} />)}
        </div>
      </section>

      {/* My Tasks Today — momentum list */}
      <section className="animate-rise" style={{ animationDelay: "330ms" }}>
        <SectionLabel
          label="My tasks today"
          action={
            <button onClick={() => setActiveTab("tasks")} className="springy text-info text-sm font-semibold inline-flex items-center gap-0.5 active:scale-95">
              All tasks <ChevronRight className="w-4 h-4" />
            </button>
          }
        />
        {(() => {
          const rank = { high: 0, medium: 1, low: 2 } as const
          const todayTasks = tasks.filter(t => t.due === "Today")
          const doneCount = todayTasks.filter(t => t.done).length
          // Only what's left to do — sorted high → low priority.
          const pending = todayTasks.filter(t => !t.done).sort((a, b) => rank[a.priority] - rank[b.priority])
          return (
            <>
              {/* Story-style segmented progress — one segment per task, fills as done */}
              {todayTasks.length > 0 && (
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex flex-1 gap-1">
                    {todayTasks.map((t) => (
                      <span key={t.id} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-500", t.done ? "dawn-gradient" : "bg-muted")} />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground tabular-nums whitespace-nowrap">{doneCount}/{todayTasks.length}</span>
                </div>
              )}

              {pending.length === 0 ? (
                <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-xs animate-pop">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full dawn-gradient text-primary-foreground shadow-sm">
                    <Check className="h-6 w-6" strokeWidth={3} />
                  </div>
                  <p className="font-heading text-foreground text-base mt-3">All caught up</p>
                  <p className="text-xs text-muted-foreground mt-0.5">You&apos;ve cleared today&apos;s tasks — nice work.</p>
                </div>
              ) : (
                <div>
                  {pending.map((task, i) => {
                    const style = priorityStyle[task.priority]
                    const Icon = categoryIcon[task.category]
                    const exiting = exitingTasks.has(task.id)
                    return (
                      <div key={task.id} className={cn("overflow-hidden transition-all duration-300 ease-out", exiting ? "max-h-0 opacity-0 -translate-x-4" : "max-h-28 opacity-100")}>
                        <div className="mb-2 animate-rise" style={{ animationDelay: `${360 + i * 60}ms` }}>
                          <div className="group relative flex items-center gap-3 rounded-2xl border border-border bg-card p-3 pl-4 shadow-xs">
                            <span className={cn("absolute left-0 top-2 bottom-2 w-1 rounded-full", style.dot, task.priority === "high" && "animate-pulse-soft")} />
                            {/* Tap-to-complete: category orb morphs into a check */}
                            <button
                              onClick={() => completeFromDashboard(task.id)}
                              aria-label="Mark task complete"
                              className={cn("relative grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all active:scale-90", exiting ? "dawn-gradient text-primary-foreground" : style.badge)}
                            >
                              {exiting ? (
                                <Check className="h-5 w-5 animate-pop" strokeWidth={3} />
                              ) : (
                                <>
                                  <Icon className={cn("h-4 w-4 transition-opacity group-hover:opacity-0", style.badgeText)} />
                                  <Check className="absolute h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={3} />
                                </>
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                              <p className="text-xs text-muted-foreground/70">{task.patient}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize", style.badge, style.badgeText)}>{task.priority}</span>
                              <span className="text-[10px] text-muted-foreground/70">{task.due}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )
        })()}
      </section>

      {/* Today's Visits — day timeline rail */}
      <section className="animate-rise" style={{ animationDelay: "400ms" }}>
        <SectionLabel
          label="Today's visits"
          action={<span className="text-[11px] font-semibold text-muted-foreground tabular-nums">{doneToday}/{todayVisits.length} done</span>}
        />
        <div className="relative">
          {todayVisits.map((visit, i) => {
            const done = completedVisits.has(visit.id)
            const isNext = !done && firstPendingVisitId === visit.id
            const last = i === todayVisits.length - 1
            return (
              <div key={visit.id} className="relative flex gap-3 animate-rise" style={{ animationDelay: `${430 + i * 70}ms` }}>
                {/* Node + connector */}
                <div className="relative flex flex-col items-center pt-1.5">
                  <span className={cn(
                    "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full ring-2 transition-all",
                    done ? "dawn-gradient ring-transparent text-primary-foreground shadow-sm"
                      : isNext ? "bg-card ring-info"
                      : "bg-card ring-border"
                  )}>
                    {done
                      ? <Check className="h-4 w-4" strokeWidth={3} />
                      : <span className={cn("h-2 w-2 rounded-full", isNext ? "bg-info animate-pulse-soft" : "bg-muted-foreground/30")} />}
                  </span>
                  {!last && <span className={cn("w-0.5 flex-1 my-1 rounded-full", done ? "dawn-gradient" : "bg-border")} />}
                </div>

                {/* Card */}
                <div className={cn("relative mb-3 flex-1 overflow-hidden rounded-2xl border bg-card p-4 shadow-xs transition-shadow", isNext ? "border-info/40 shadow-sm" : "border-border")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-foreground">{visit.patient}</span>
                        <span className="text-xs text-muted-foreground">· {subjectInitials(visit.name)}</span>
                        {isNext && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-semibold text-info">
                            <span className="h-1.5 w-1.5 rounded-full bg-info animate-pulse-soft" /> Up next
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{visit.protocol} · {visit.pi}</p>
                      <p className="text-xs text-foreground/80 mt-1.5 inline-flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-mono font-medium">
                          <Clock className="h-3 w-3 text-muted-foreground" /> {visit.time}
                        </span>
                        <span className="text-muted-foreground">{visit.visit} · {visit.type}</span>
                      </p>
                    </div>
                    {done ? (
                      <span className="flex items-center gap-1 text-success text-xs font-semibold shrink-0">
                        <CheckCircle className="w-4 h-4" /> Done
                      </span>
                    ) : (
                      <button
                        onClick={() => { const p = patients.find(pt => pt.id === visit.patient); if (p) openVisitUpdate(p) }}
                        className="springy dawn-gradient text-primary-foreground px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 active:scale-95 shadow-sm"
                      >
                        Update
                      </button>
                    )}
                  </div>
                  {done && visit.completedBy && (
                    <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-border text-[11px] text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-success shrink-0" />
                      <span>Completed by <span className="font-medium text-foreground">{visit.completedBy}</span> ({visit.completedByRole}) · {visit.completedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Overdue — alert beacon */}
      {overduePatients.length > 0 && (
        <section className="animate-rise" style={{ animationDelay: "470ms" }}>
          <SectionLabel
            label="Overdue"
            tone="text-destructive"
            action={<span className="grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">{overduePatients.length}</span>}
          />
          <div className="space-y-2.5">
            {overduePatients.map((p) => (
              <div key={p.id} className="relative overflow-hidden bg-card rounded-2xl border border-destructive/30 p-4 pl-5 shadow-xs">
                <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-destructive" />
                {/* breathing glow */}
                <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-destructive/10 blur-2xl animate-pulse-soft" />
                <div className="relative flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-destructive/12 text-destructive">
                    <AlertTriangle className="h-5 w-5 animate-pulse-soft" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground/70">{p.id} · {p.visit}</p>
                    <p className="text-xs text-destructive mt-1 inline-flex items-center gap-1 font-medium">
                      {p.daysOverdue} days overdue · Last contact {p.lastContact}
                    </p>
                  </div>
                  <button className="springy shrink-0 self-center bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full text-xs font-semibold active:scale-95 shadow-sm">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )

  // ── Patients tab (operational roster) ─────────────────────────────────────
  const renderPatients = () => {
    const rank = ["all", "on-track", "overdue", "completed", "withdrawn", "screen-failure", "dropout"]
    const statusCounts = patients.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1
      return acc
    }, {})
    const chips = rank
      .filter(k => k === "all" || statusCounts[k])
      .map(k => ({ key: k, label: k === "all" ? "All" : statusStyle[k].label, count: k === "all" ? patients.length : statusCounts[k] }))

    const q = patientQuery.trim().toLowerCase()
    const filtered = patients.filter(p => {
      const matchFilter = patientFilter === "all" || p.status === patientFilter
      const matchQuery = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      return matchFilter && matchQuery
    })
    const overdueCount = statusCounts["overdue"] ?? 0

    return (
      <div className="flex-1 overflow-auto scrollbar-hide pb-4">
        {/* Toolbar */}
        <div className="px-4 pt-4 space-y-3">
          {/* Roster summary */}
          <div className="flex items-end justify-between animate-rise" style={{ animationDelay: "20ms" }}>
            <p className="text-sm text-muted-foreground">
              <span className="font-heading text-2xl text-foreground tabular-nums"><CountUp value={patients.length} /></span> subjects enrolled
            </p>
            {overdueCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" /> {overdueCount} overdue
              </span>
            )}
          </div>

          {/* Add / Invite */}
          <div className="flex gap-2.5 animate-rise" style={{ animationDelay: "70ms" }}>
            <button
              onClick={() => onNavigate("add-patient")}
              className="springy flex-1 flex items-center justify-center gap-1.5 dawn-gradient text-primary-foreground py-3 rounded-2xl text-sm font-semibold active:scale-[0.98] shadow-sm"
            >
              <UserPlus className="w-4 h-4" /> Add Patient
            </button>
            <button
              onClick={() => onNavigate("invite-patient")}
              className="springy flex-1 flex items-center justify-center gap-1.5 bg-card border border-border text-foreground/80 py-3 rounded-2xl text-sm font-semibold active:scale-[0.98] shadow-xs"
            >
              <Send className="w-4 h-4" /> Send Invite
            </button>
          </div>

          {/* Search */}
          <div className="relative animate-rise" style={{ animationDelay: "120ms" }}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <input
              value={patientQuery}
              onChange={(e) => setPatientQuery(e.target.value)}
              placeholder="Search by name or subject ID…"
              className="w-full rounded-2xl border border-border bg-card pl-10 pr-10 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
            {patientQuery && (
              <button onClick={() => setPatientQuery("")} aria-label="Clear search" className="springy absolute right-3 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full text-muted-foreground/60 hover:bg-muted active:scale-90">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status filter chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 animate-rise" style={{ animationDelay: "170ms" }}>
            {chips.map(f => {
              const active = patientFilter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setPatientFilter(f.key)}
                  className={cn(
                    "springy shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95",
                    active ? "dawn-gradient text-primary-foreground shadow-sm" : "bg-card border border-border text-muted-foreground"
                  )}
                >
                  {f.label}
                  <span className={cn("tabular-nums", active ? "text-primary-foreground/80" : "text-muted-foreground/60")}>{f.count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Roster — re-animates on filter / query change */}
        <div key={`${patientFilter}-${q}`} className="px-4 pt-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-xs animate-rise">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground/50">
                <Users className="h-6 w-6" />
              </div>
              <p className="font-heading text-foreground text-base mt-3">No subjects found</p>
              <p className="text-xs text-muted-foreground mt-0.5">Try a different search or filter.</p>
            </div>
          ) : (
            filtered.map((p, idx) => {
              const style = statusStyle[p.status]
              const total = PROTOCOL_SCHEDULE.length
              const completed = p.history?.filter(v => v.outcome === "completed").length ?? 0
              const pct = Math.round((completed / total) * 100)
              return (
                <div key={p.id} className="animate-rise" style={{ animationDelay: `${idx * 70}ms` }}>
                  <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                    <span className={cn("absolute left-0 top-0 bottom-0 w-1.5", style.rail)} />
                    {/* Tappable info → patient record */}
                    <button onClick={() => setViewPatient(p)} className="block w-full text-left p-4 pl-5 transition-colors active:bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className={cn("h-12 w-12 shrink-0 rounded-full p-[2px]", style.rail)}>
                          <div className="grid h-full w-full place-items-center rounded-full bg-card">
                            <span className="font-heading text-sm font-bold text-foreground">{patientInitials(p.name)}</span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-foreground truncate">{p.name}</p>
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                          </div>
                          <p className="font-mono text-xs text-muted-foreground/70">{p.id} · Age {p.age}</p>
                        </div>
                        <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", style.bg, style.text)}>{style.label}</span>
                      </div>

                      {/* Trial progress */}
                      <div className="mt-3.5">
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Trial progress</span>
                          <span className="font-mono font-semibold text-foreground">{completed}/{total} visits</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full dawn-gradient animate-fill-bar" style={{ width: `${pct}%` }} />
                        </div>
                      </div>

                      {/* Visit + completion chips */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", p.status === "overdue" ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground/80")}>
                          <Clock className="h-3 w-3" /> {visitLine(p)}
                        </span>
                        {p.visitCompleted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
                            <CheckCircle className="h-3 w-3" /> Visit completed
                          </span>
                        )}
                      </div>

                      {p.note && (
                        <p className="mt-2 text-[11px] text-muted-foreground/70">Remarks: {p.note}</p>
                      )}
                    </button>

                    {/* Actions */}
                    <div className="flex gap-2 px-4 pb-4 pl-5">
                      <button onClick={() => openVisitUpdate(p)} className="springy flex-1 dawn-gradient text-primary-foreground py-2.5 rounded-xl text-xs font-semibold active:scale-[0.98] shadow-sm">
                        Update Visit
                      </button>
                      <button onClick={() => setViewPatient(p)} className="springy flex-1 bg-surface border border-border text-foreground/80 py-2.5 rounded-xl text-xs font-semibold active:scale-[0.98]">
                        View Record
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  // ── Tasks tab ─────────────────────────────────────────────────────────────
  const renderTasks = () => (
    <div className="flex-1 overflow-auto scrollbar-hide pb-4 pt-4">
      {/* Filter pills */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {(["today", "week", "overdue", "completed"] as const).map((f) => {
          const labels: Record<TaskFilter, string> = { today: "Today", week: "This Week", overdue: "Overdue", completed: "Completed" }
          const count = tasks.filter(t => {
            if (f === "today") return t.due === "Today" && !t.done
            if (f === "week") return (t.due !== "Overdue" && t.due !== "Today") && !t.done
            if (f === "overdue") return t.due === "Overdue" && !t.done
            if (f === "completed") return t.done
          }).length
          return (
            <button
              key={f}
              onClick={() => setTaskFilter(f)}
              className={cn(
                "springy px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95",
                taskFilter === f ? "dawn-gradient text-primary-foreground shadow-sm" : "bg-card text-muted-foreground border border-border"
              )}
            >
              {labels[f]} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          )
        })}
      </div>

      <div className="px-4 space-y-2.5">
        {filteredTasks.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground/70 text-sm shadow-xs">
            No tasks in this category
          </div>
        )}
        {filteredTasks.map((task) => <TaskRow key={task.id} task={task} />)}
      </div>
    </div>
  )

  // ── Profile / Me tab ──────────────────────────────────────────────────────
  const renderMe = () => (
    <SiteUserProfile
      user={{
        initials: "MC",
        avatarColor: "bg-accent",
        name: "Meera CRC",
        designation: "Clinical Research Coordinator",
        phone: "+91 98401 22334",
        email: "meera.crc@apollo.com",
        entityType: "Site / Hospital",
        orgName: "Apollo Hospital",
        orgAddress: "Greams Road, Chennai 600006",
        role: "Research Team",
      }}
      onSignOut={() => onNavigate("welcome")}
    />
  )

  // ── Trial Detail → Trial Summary page (CRC view) ──────────────────────────
  if (selectedTrial) {
    return (
      <TrialSummaryScreen
        trial={selectedTrial}
        patients={patients}
        onBack={() => setSelectedTrial(null)}
        onAddPatient={() => onNavigate("add-patient")}
      />
    )
  }

  // ── All Trials list ───────────────────────────────────────────────────────
  if (showAllTrials) {
    return (
      <div className="h-full flex flex-col bg-background">
        <SubHeader
          eyebrow="Portfolio" title="Total Trials" onBack={() => setShowAllTrials(false)}
          right={
            <button onClick={() => onNavigate("add-trial")} className="springy flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold active:scale-95">
              <FilePlus2 className="h-3.5 w-3.5" /> Add Trial
            </button>
          }
        />
        <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
          {crcTrials.map((tr, i) => (
            <div key={tr.id} className="animate-rise" style={{ animationDelay: `${40 + i * 60}ms` }}><TrialPanel tr={tr} /></div>
          ))}
        </div>
      </div>
    )
  }

  if (showSponsors) {
    return (
      <div className="h-full flex flex-col bg-background">
        <SubHeader eyebrow="Portfolio" title="Sponsors" onBack={() => setShowSponsors(false)} />
        <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
          {crcSponsors.map((sponsor, i) => (
            <div key={sponsor.name} className="animate-rise" style={{ animationDelay: `${40 + i * 60}ms` }}><SponsorPanel sponsor={sponsor} /></div>
          ))}
        </div>
      </div>
    )
  }

  // ── PI list (from the PI's summary tile) ──────────────────────────────────
  if (showPIs) {
    return (
      <div className="h-full flex flex-col bg-background">
        <SubHeader eyebrow="Portfolio" title="PI's" onBack={() => setShowPIs(false)} />
        <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
          {crcPIs.map((pi, i) => (
            <div key={pi.name} className="animate-rise" style={{ animationDelay: `${40 + i * 60}ms` }}><PIPanel pi={pi} /></div>
          ))}
        </div>
      </div>
    )
  }

  // ── Patient Record (read-only) ────────────────────────────────────────────
  if (viewPatient) {
    const p = viewPatient
    const style = statusStyle[p.status]
    return (
      <div className="h-full flex flex-col bg-background">
        <SubHeader eyebrow="Patient" title="Patient Record" onBack={() => { setViewPatient(null); setRecordScheduleOpen(false) }} />
        <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-4">
          {/* Identity hero — dawn gesture */}
          <div className="dawn-gradient hero-glow paper-grain rounded-3xl p-5 text-primary-foreground shadow-md animate-rise" style={{ animationDelay: "40ms" }}>
            <div className="relative flex items-start justify-between mb-3 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/25 shrink-0">
                  <span className="font-heading text-lg font-bold">{patientInitials(p.name)}</span>
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading text-lg leading-tight">{patientInitials(p.name)}</h2>
                  <p className="text-white/80 text-sm">{p.id} · Age {p.age}</p>
                </div>
              </div>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 bg-white/20 backdrop-blur-sm")}>{style.label}</span>
            </div>
            <div className="relative grid grid-cols-2 gap-y-2.5 gap-x-3">
              {[
                { label: "Protocol", val: "Protocol-001" },
                { label: "Site", val: "Site 02" },
                { label: "Current Visit", val: p.visit },
                { label: "Visit Date", val: p.dateISO ? new Date(p.dateISO + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—" },
                { label: "Visit Completed", val: p.visitCompleted ? "Yes" : "No" },
                { label: "Last Updated", val: p.lastUpdated ?? "—" },
              ].map(f => (
                <div key={f.label}>
                  <p className="eyebrow text-white/60">{f.label}</p>
                  <p className="text-sm font-medium mt-0.5">{f.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-xs animate-rise" style={{ animationDelay: "110ms" }}>
            <p className="eyebrow text-muted-foreground mb-1.5">Remarks</p>
            <p className="text-sm text-foreground">{p.note?.trim() ? p.note : "No remarks recorded yet."}</p>
          </div>

          {/* System-generated visit schedule */}
          <div className="animate-rise" style={{ animationDelay: "180ms" }}>
            <button onClick={() => setRecordScheduleOpen(open => !open)} className="w-full flex items-center justify-between mb-2">
              <p className="eyebrow text-muted-foreground">Visit Schedule</p>
              <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                {PROTOCOL_SCHEDULE.length} visits
                <ChevronDown className={cn("w-4 h-4 text-primary transition-transform", recordScheduleOpen && "rotate-180")} />
              </span>
            </button>
            {recordScheduleOpen && (
              <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-border">
                      <th className="py-2 px-3 eyebrow text-muted-foreground/70">Visit</th>
                      <th className="py-2 px-3 eyebrow text-muted-foreground/70">Visit Name</th>
                      <th className="py-2 px-3 eyebrow text-muted-foreground/70 text-right">Window Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildVisitSchedule(p).map((v, i, arr) => {
                      const sc = {
                        completed: { Icon: CheckCircle, color: "text-success" },
                        missed:    { Icon: AlertTriangle, color: "text-destructive" },
                        upcoming:  { Icon: Clock, color: "text-info" },
                        planned:   { Icon: Calendar, color: "text-muted-foreground/70" },
                      }[v.state]
                      const Icon = sc.Icon
                      const windowLabel = (() => {
                        if (!v.dateISO) return "—"
                        const d = new Date(v.dateISO + "T00:00:00")
                        const start = new Date(d); start.setDate(start.getDate() - VISIT_WINDOW_DAYS)
                        const end = new Date(d); end.setDate(end.getDate() + VISIT_WINDOW_DAYS)
                        const fmt = (x: Date) => x.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                        return `${fmt(start)} – ${fmt(end)}`
                      })()
                      return (
                        <tr key={v.visit} className={cn(i < arr.length - 1 && "border-b border-border")}>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <Icon className={cn("w-3.5 h-3.5 shrink-0", sc.color)} />
                              <span className="text-sm font-semibold text-foreground whitespace-nowrap">{v.visit}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-xs text-muted-foreground">{v.type}</td>
                          <td className="py-2.5 px-3 text-xs text-muted-foreground text-right whitespace-nowrap">{windowLabel}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Visit history */}
          <div className="animate-rise" style={{ animationDelay: "250ms" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="eyebrow text-muted-foreground">Visit History</p>
              <span className="text-xs text-muted-foreground/70">
                {(p.history ?? []).filter(v => v.outcome === "completed").length} completed
              </span>
            </div>
            {(p.history && p.history.length > 0) ? (
              <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
                <div className="relative pl-6">
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                  <div className="space-y-4">
                    {[...p.history].sort((a, b) => b.dateISO.localeCompare(a.dateISO)).map((v, i) => {
                      const oc = {
                        completed: { Icon: CheckCircle, color: "text-success", label: "Completed", badge: "bg-success/15 text-success" },
                        missed:    { Icon: AlertTriangle, color: "text-destructive", label: "Missed", badge: "bg-destructive/10 text-destructive" },
                        scheduled: { Icon: Clock, color: "text-info", label: "Scheduled", badge: "bg-info/10 text-info" },
                      }[v.outcome]
                      const Icon = oc.Icon
                      return (
                        <div key={`${v.visit}-${i}`} className="relative">
                          <div className="absolute -left-6 top-0.5 bg-card">
                            <Icon className={cn("w-3.5 h-3.5", oc.color)} />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground">{v.visit}</p>
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0", oc.badge)}>{oc.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{v.type}</p>
                          <p className="text-[11px] text-muted-foreground/70">
                            {v.dateISO ? new Date(v.dateISO + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </p>
                          {v.note && <p className="text-[11px] text-muted-foreground mt-0.5 italic">“{v.note}”</p>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border shadow-xs p-4 text-center text-sm text-muted-foreground/70">
                No visits recorded yet.
              </div>
            )}
          </div>

          <button
            onClick={() => { setViewPatient(null); openVisitUpdate(p) }}
            className="springy w-full dawn-gradient text-primary-foreground py-3.5 rounded-xl text-sm font-semibold active:scale-[0.98] shadow-sm"
          >
            Update Visit
          </button>
        </div>
      </div>
    )
  }

  const tabTitle = activeTab === "patients" ? "Patients" : activeTab === "tasks" ? "Tasks" : activeTab === "notifs" ? "Notifications" : "Meera"

  return (
    <div className="h-full flex flex-col bg-background relative">
      {activeTab === "dashboard" ? (
        <div className="flex-1 overflow-auto scrollbar-hide">
          {immersiveHeader}
          {renderDashboard()}
        </div>
      ) : (
        <>
          {compactBar(tabTitle)}
          {activeTab === "patients" && renderPatients()}
          {activeTab === "tasks" && renderTasks()}
          {activeTab === "notifs" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground/70 text-sm">
              <Bell className="h-8 w-8 text-muted-foreground/40" />
              Notifications coming soon
            </div>
          )}
          {activeTab === "me" && renderMe()}
        </>
      )}

      <BottomNav
        activeTab={activeTab}
        role="crc"
        notificationCount={2}
        onTabChange={(tab) => {
          if (tab === "chat") { onNavigate("chat"); return }
          if (tab === "calendar") { onNavigate("crc-calendar"); return }
          setActiveTab(tab as CrcTab)
        }}
      />

      {/* ── Update Visit bottom sheet ─────────────────────────── */}
      {editPatient && (
        <div className="absolute inset-0 z-30 flex items-end animate-fade-in" onClick={() => setEditPatient(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full bg-card rounded-t-3xl p-5 max-h-[88%] overflow-auto scrollbar-hide shadow-2xl animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-foreground text-lg">Update Visit</h3>
                <p className="text-xs text-muted-foreground/70">{patientInitials(editPatient.name)} · {editPatient.id}</p>
              </div>
              <button onClick={() => setEditPatient(null)} className="springy p-1.5 -mr-1 rounded-full text-muted-foreground/70 active:scale-90 hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Trial context (read-only) */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface border border-border p-3">
                {[
                  { label: "Protocol ID", val: crcTrials[0].id },
                  { label: "Phase", val: crcTrials[0].phase },
                  { label: "Indication", val: crcTrials[0].disease },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="eyebrow text-muted-foreground/70">{f.label}</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">{f.val}</p>
                  </div>
                ))}
              </div>

              {/* Visit + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Visit</label>
                  <input
                    type="text"
                    value={form.visit}
                    onChange={(e) => setForm({ ...form, visit: e.target.value })}
                    placeholder="e.g. Visit 7"
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Visit Date</label>
                  <input
                    type="date"
                    value={form.dateISO}
                    onChange={(e) => setForm({ ...form, dateISO: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>

              {/* Visit Name + Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Visit Name</label>
                  <input
                    type="text"
                    value={form.visitName}
                    onChange={(e) => setForm({ ...form, visitName: e.target.value })}
                    placeholder="e.g. Efficacy Assessment"
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Visit Type</label>
                  <select
                    value={form.visitType}
                    onChange={(e) => setForm({ ...form, visitType: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                  >
                    {["Hospital", "Phone", "Remote", "Home"].map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["screen-failure", "dropout", "withdrawn", "completed"] as PatientStatus[]).map((s) => {
                    const st = statusStyle[s]
                    const active = form.status === s
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, status: s })}
                        className={cn(
                          "springy py-2.5 rounded-xl text-xs font-semibold border transition-colors active:scale-[0.97]",
                          active ? cn(st.bg, st.text, "border-transparent") : "bg-card text-muted-foreground border-border",
                        )}
                      >
                        {st.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Remarks</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  placeholder="Add any notes about the patient or this visit…"
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground resize-none outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditPatient(null)}
                  className="springy flex-1 py-3 rounded-xl border border-border text-muted-foreground text-sm font-semibold active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={saveVisitUpdate}
                  className="springy flex-1 py-3 rounded-xl dawn-gradient text-primary-foreground text-sm font-semibold active:scale-[0.98] shadow-sm"
                >
                  Save Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Saved toast ───────────────────────────────────────── */}
      {savedToast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 bg-foreground text-primary-foreground text-xs font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-pop">
          <CheckCircle className="w-4 h-4 text-success" />
          {savedToast}
        </div>
      )}
    </div>
  )
}
