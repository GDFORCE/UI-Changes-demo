"use client"

import { useState, useEffect, Fragment } from "react"
import { BottomNav } from "../bottom-nav"
import {
  CheckCircle, Clock, AlertTriangle, FileText, ChevronRight, ChevronLeft,
  PenLine, Users, Calendar, Building2, UserPlus, Send, FilePlus2, X, ChevronDown,
  Check, Search, Sun, ArrowUpRight, ClipboardList, SlidersHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TrialSummaryScreen } from "@/components/clinical/screens/trial-summary-screen"
import { SiteUserProfile } from "@/components/clinical/screens/site-user-profile"

interface PIDashboardProps {
  onNavigate: (screen: string) => void
  initialTab?: PiTab
  /** When set, the dashboard opens directly on this trial's summary (e.g. after saving a new trial). */
  initialTrialId?: string
  /** Which entity the logged-in user belongs to. "smo" shows the SMO profile (hospitals + Add Hospital). */
  profileEntity?: "site" | "smo"
}

type PiTab = "dashboard" | "my-trials" | "patients" | "approvals" | "chat" | "notifs" | "me"
type ApprovalSubTab = "deviations" | "ecrf" | "enrolments"
type WeekVisit = { time: string; subj: string; name: string; visit: string; status: string }

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
  protocol?: string
  phase?: string
  indication?: string
}

const initialPatients: Patient[] = [
  {
    id: "SUBJ-001", name: "Priya Krishnan", age: 45, visit: "Visit 7", visitName: "Efficacy Assessment", visitType: "Hospital", dateISO: "2026-05-23", status: "on-track", protocol: "Protocol-001", phase: "Phase II", indication: "Type 2 Diabetes",
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
    id: "SUBJ-002", name: "Rahul Mehta", age: 52, visit: "Visit 4", visitName: "Safety Follow-up", visitType: "Hospital", dateISO: "2026-05-19", status: "overdue", protocol: "Protocol-001", phase: "Phase II", indication: "Type 2 Diabetes",
    history: [
      { visit: "Visit 1", dateISO: "2026-02-10", type: "Screening", outcome: "completed", note: "ICF signed" },
      { visit: "Visit 2", dateISO: "2026-03-03", type: "Baseline", outcome: "completed", note: "Randomized" },
      { visit: "Visit 3", dateISO: "2026-04-21", type: "Safety Follow-up", outcome: "completed" },
    ],
  },
  {
    id: "SUBJ-003", name: "Anita Patel", age: 38, visit: "Visit 2", visitName: "Baseline", visitType: "Hospital", dateISO: "2026-06-08", status: "on-track", protocol: "Protocol-001", phase: "Phase II", indication: "Type 2 Diabetes",
    history: [
      { visit: "Visit 1", dateISO: "2026-05-18", type: "Screening", outcome: "completed", note: "Eligibility confirmed" },
    ],
  },
  {
    id: "SUBJ-004", name: "Vijay Sharma", age: 61, visit: "Visit 5", visitName: "Lab & Vitals", visitType: "Hospital", dateISO: "2026-06-08", status: "on-track", protocol: "Protocol-005", phase: "Phase III", indication: "Asthma",
    history: [
      { visit: "Visit 1", dateISO: "2026-02-20", type: "Screening", outcome: "completed" },
      { visit: "Visit 2", dateISO: "2026-03-13", type: "Baseline", outcome: "completed", note: "Randomized" },
      { visit: "Visit 3", dateISO: "2026-04-03", type: "Safety Follow-up", outcome: "completed" },
      { visit: "Visit 4", dateISO: "2026-05-15", type: "Lab & Vitals", outcome: "completed" },
    ],
  },
  {
    id: "SUBJ-005", name: "Deepa Nair", age: 44, visit: "—", visitName: "—", visitType: "—", dateISO: "", status: "withdrawn", protocol: "Protocol-001", phase: "Phase II", indication: "Type 2 Diabetes",
    history: [
      { visit: "Visit 1", dateISO: "2026-03-01", type: "Screening", outcome: "completed" },
      { visit: "Visit 2", dateISO: "2026-03-22", type: "Baseline", outcome: "completed", note: "Randomized" },
      { visit: "Visit 3", dateISO: "2026-04-12", type: "Safety Follow-up", outcome: "missed", note: "Withdrew consent" },
    ],
  },
]

const TODAY_ISO = "2026-06-08"

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

// Activities performed at each visit, keyed by visit type — shown when a visit
// row is expanded in the patient record's visit schedule.
const VISIT_ACTIVITIES: Record<string, string[]> = {
  "Screening": ["Informed consent", "Eligibility check", "Medical history", "Vital signs", "Blood draw"],
  "Baseline": ["Randomisation", "Vital signs", "ECG", "Blood draw", "Drug dispensing"],
  "Safety Follow-up": ["Vital signs", "Adverse event review", "Concomitant meds review"],
  "Efficacy Assessment": ["Vital signs", "Efficacy questionnaire", "Blood draw", "Lab panel"],
  "Lab & Vitals": ["Vital signs", "Blood draw", "Lab panel"],
  "End of Study": ["Final assessment", "Vital signs", "Blood draw", "Drug accountability", "Study completion form"],
}

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

// Total visits in the protocol — drives the "visits completed" progress bar.
const PROTOCOL_TOTAL_VISITS = 8

function patientInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("")
}

function visitNumber(visit: string): string {
  const m = visit.match(/\d+/)
  return m ? m[0] : "—"
}

function visitDateLabel(p: Patient): string {
  if (p.status === "overdue") return "Overdue"
  if (!p.dateISO) return "Not scheduled"
  if (p.dateISO === TODAY_ISO) return "Today"
  return new Date(p.dateISO + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

const deviations = [
  { id: "DEV-001", patient: "SUBJ-002", desc: "Visit window exceeded by 3 days", submitted: "22 May", severity: "Minor" },
  { id: "DEV-002", patient: "SUBJ-005", desc: "Concomitant medication undocumented", submitted: "20 May", severity: "Major" },
]

const ecrfItems = [
  { id: "eCRF-014", patient: "SUBJ-001", form: "Vital Signs", visit: "Visit 6", by: "CRC Meera", date: "21 May" },
  { id: "eCRF-015", patient: "SUBJ-003", form: "Adverse Event Log", visit: "Visit 1", by: "RA Suresh", date: "20 May" },
  { id: "eCRF-016", patient: "SUBJ-004", form: "Concomitant Meds", visit: "Visit 4", by: "CRC Meera", date: "19 May" },
]

const enrolments = [
  { id: "ENR-001", name: "Arjun Verma", age: 48, screenId: "SCR-019", screened: "23 May", eligible: true },
  { id: "ENR-002", name: "Kavya Reddy", age: 35, screenId: "SCR-020", screened: "22 May", eligible: false },
]

const piTrials = [
  { id: "Protocol-001", title: "Multicentre, randomised, double-blind, Phase III trial to investigate the efficacy and safety of oral BIBF 1120 plus standard docetaxel therapy compared to placebo plus standard docetaxel therapy in patients with stage IIIB/IV or recurrent non small cell lung cancer after failure of first line chemotherapy.", phase: "Phase II", disease: "Type 2 Diabetes", drug: "Metformin XR", sponsor: "PharmaCo Ltd", site: "Apollo Hospital Chennai", pi: "Dr. Sharma", department: "Endocrinology", status: "Active", recruitment: "Recruiting", screened: 48, screenFail: 7, randomized: 34, withdrawn: 2, dropout: 1, followUp: 18, completed: 9 },
  { id: "Protocol-005", title: "Asthma Maintenance Study", phase: "Phase III", disease: "Asthma", drug: "Budesonide", sponsor: "Respira Labs", site: "Apollo Hospital Chennai", pi: "Dr. Sharma", department: "Pulmonology", status: "Active", recruitment: "Recruiting", screened: 31, screenFail: 4, randomized: 22, withdrawn: 1, dropout: 0, followUp: 12, completed: 6 },
  { id: "Protocol-008", title: "Rheumatoid Arthritis Trial", phase: "Phase II", disease: "Rheumatoid Arthritis", drug: "Methotrexate", sponsor: "NovaCure Bio", site: "Apollo Hospital Chennai", pi: "Dr. Sharma", department: "Rheumatology", status: "Completed", recruitment: "Closed", screened: 62, screenFail: 8, randomized: 46, withdrawn: 3, dropout: 2, followUp: 0, completed: 41 },
]

const piSponsors = [
  { name: "PharmaCo Ltd", trials: [piTrials[0]] },
  { name: "Respira Labs", trials: [piTrials[1]] },
  { name: "NovaCure Bio", trials: [piTrials[2]] },
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
  { id: "SUBJ-002", name: "Rahul Mehta", visit: "Visit 4", visitName: "Safety Follow-up", protocol: "Protocol-001", indication: "Type 2 Diabetes", visitDate: "19 May 2026", daysOverdue: 3, lastContact: "19 May" },
]

// Lightweight filler visits for days beyond the current week — the load chart
// only needs the count + status, so detailed records aren't required here.
const fillVisits = (n: number, status = "on-track"): WeekVisit[] =>
  Array.from({ length: n }, (_, i) => ({ time: "09:00", subj: `SUBJ-${i + 1}`, name: "—", visit: "—", status }))

const weekDays = [
  { day: "Mon", date: "26", weekday: "Monday", visits: [] as WeekVisit[] },
  { day: "Tue", date: "27", weekday: "Tuesday", visits: [
    { time: "09:30", subj: "SUBJ-001", name: "Priya Krishnan", visit: "Visit 7", status: "on-track" },
    { time: "14:00", subj: "SUBJ-004", name: "Vijay Sharma", visit: "Visit 5", status: "on-track" },
  ] as WeekVisit[] },
  { day: "Wed", date: "28", weekday: "Wednesday", visits: [
    { time: "11:00", subj: "SUBJ-003", name: "Anita Patel", visit: "Visit 2", status: "on-track" },
  ] as WeekVisit[] },
  { day: "Thu", date: "29", weekday: "Thursday", visits: [
    { time: "09:00", subj: "SUBJ-002", name: "Rahul Mehta", visit: "Visit 4", status: "overdue" },
    { time: "11:30", subj: "SUBJ-001", name: "Priya Krishnan", visit: "Visit 8", status: "on-track" },
    { time: "15:00", subj: "SUBJ-005", name: "Deepa Nair", visit: "Screening", status: "on-track" },
  ] as WeekVisit[] },
  { day: "Fri", date: "30", weekday: "Friday", visits: [
    { time: "10:00", subj: "SUBJ-004", name: "Vijay Sharma", visit: "Visit 6", status: "on-track" },
  ] as WeekVisit[] },
  { day: "Sat", date: "31", weekday: "Saturday", visits: [
    { time: "09:30", subj: "SUBJ-003", name: "Anita Patel", visit: "Visit 3", status: "on-track" },
  ] as WeekVisit[] },
  { day: "Sun", date: "1", weekday: "Sunday", visits: [
    { time: "11:00", subj: "SUBJ-002", name: "Rahul Mehta", visit: "Visit 5", status: "on-track" },
  ] as WeekVisit[] },
  // Next week — lets the schedule scroll across dates.
  { day: "Mon", date: "2", weekday: "Monday", visits: fillVisits(3) },
  { day: "Tue", date: "3", weekday: "Tuesday", visits: fillVisits(6) },
  { day: "Wed", date: "4", weekday: "Wednesday", visits: fillVisits(2) },
  { day: "Thu", date: "5", weekday: "Thursday", visits: [...fillVisits(3), ...fillVisits(1, "overdue")] },
  { day: "Fri", date: "6", weekday: "Friday", visits: fillVisits(1) },
  { day: "Sat", date: "7", weekday: "Saturday", visits: [] as WeekVisit[] },
  { day: "Sun", date: "8", weekday: "Sunday", visits: fillVisits(2) },
]

const statusStyle: Record<string, { label: string; bg: string; text: string; rail: string }> = {
  "on-track": { label: "On Track", bg: "bg-success/15", text: "text-success", rail: "bg-success" },
  overdue:    { label: "Overdue",  bg: "bg-destructive/10", text: "text-destructive", rail: "bg-destructive" },
  completed:  { label: "Completed",bg: "bg-info/10", text: "text-info", rail: "bg-info" },
  withdrawn:  { label: "Withdrawn",bg: "bg-muted", text: "text-muted-foreground", rail: "bg-muted-foreground/40" },
  "screen-failure": { label: "Screen Failure", bg: "bg-destructive/10", text: "text-destructive", rail: "bg-destructive" },
  dropout:    { label: "Dropout",  bg: "bg-warning/15", text: "text-warning", rail: "bg-warning" },
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

// ── Week "visit-load" chart — brick towers that grow on mount ────────────────
function WeekLoadChart({ days, total, onView }: { days: typeof weekDays; total: number; onView: () => void }) {
  const [grown, setGrown] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setGrown(true))
    return () => cancelAnimationFrame(raf)
  }, [])
  const busiest = days.reduce((a, b) => (b.visits.length > a.visits.length ? b : a), days[0])

  return (
    <button onClick={onView} className="springy w-full text-left rounded-3xl border border-border bg-card p-4 shadow-sm active:scale-[0.99] hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Site-wide schedule</p>
          {busiest.visits.length > 0 && (
            <p className="text-[11px] text-muted-foreground/70 mt-0.5">
              Busiest · <span className="font-semibold text-foreground">{busiest.weekday} ({busiest.visits.length})</span>
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary whitespace-nowrap">{total} visits</span>
      </div>

      {/* Per-day load — fixed-size intensity tiles + count, scrollable across dates */}
      <div className="flex items-stretch gap-2 overflow-x-auto scrollbar-hide border-t border-dashed border-border pt-3 -mx-1 px-1">
        {days.map((d, di) => {
          const n = d.visits.length
          const hasOverdue = d.visits.some((v) => v.status === "overdue")
          const isBusy = n > 0 && n === busiest.visits.length
          // Load tier → warm-to-deep fill in the app's dawn / accent palette.
          const tier =
            n === 0 ? "bg-muted text-muted-foreground/40"
              : hasOverdue ? "bg-destructive/12 text-destructive ring-1 ring-destructive/30"
              : n >= 5 ? "dawn-gradient text-primary-foreground shadow-sm"
              : n >= 3 ? "bg-accent/25 text-accent"
              : "bg-accent/12 text-accent"
          return (
            <div key={`${d.day}-${d.date}`} className="flex w-11 shrink-0 flex-col items-center gap-1.5">
              <div
                className={cn("relative grid h-10 w-10 place-items-center rounded-2xl transition-all", tier)}
                style={{
                  transform: grown ? "scale(1)" : "scale(0.6)",
                  opacity: grown ? 1 : 0,
                  transition: "transform 480ms cubic-bezier(0.34,1.56,0.64,1), opacity 320ms ease",
                  transitionDelay: `${di * 70}ms`,
                }}
              >
                <Calendar className="h-4 w-4" />
                {hasOverdue && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />}
              </div>
              <span className={cn("font-mono text-xs font-bold tabular-nums leading-none", n ? "text-foreground" : "text-muted-foreground/40")}>{n}</span>
              <span className="mt-0.5 text-[10px] font-medium leading-none text-muted-foreground/70">{d.day}</span>
              <span className={cn("grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold transition-colors", isBusy ? "dawn-gradient text-primary-foreground shadow-sm" : "text-foreground/70")}>{d.date}</span>
            </div>
          )
        })}
      </div>
    </button>
  )
}

export function PIDashboard({ onNavigate, initialTab = "dashboard", initialTrialId, profileEntity = "site" }: PIDashboardProps) {
  const [activeTab, setActiveTab] = useState<PiTab>(initialTab)
  const [approvalTab, setApprovalTab] = useState<ApprovalSubTab>("deviations")
  const [signedDeviations, setSignedDeviations] = useState<Set<string>>(new Set())
  const [signedEcrf, setSignedEcrf] = useState<Set<string>>(new Set())
  const [approvedEnrolments, setApprovedEnrolments] = useState<Set<string>>(new Set())
  const [rejectedEnrolments, setRejectedEnrolments] = useState<Set<string>>(new Set())
  const [selectedTrial, setSelectedTrial] = useState<typeof piTrials[0] | null>(null)
  const [showAllTrials, setShowAllTrials] = useState(false)
  const [showSponsors, setShowSponsors] = useState(false)
  // Patient visit updates
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [editPatient, setEditPatient] = useState<Patient | null>(null)
  const [viewPatient, setViewPatient] = useState<Patient | null>(null)
  const [recordScheduleOpen, setRecordScheduleOpen] = useState(false)
  const [expandedScheduleVisit, setExpandedScheduleVisit] = useState<string | null>(null)
  const [form, setForm] = useState<{ visit: string; visitName: string; visitType: string; dateISO: string; status: PatientStatus; note: string }>({
    visit: "", visitName: "", visitType: "Hospital", dateISO: "", status: "on-track", note: "",
  })
  const [savedToast, setSavedToast] = useState<string | null>(null)
  const [completedVisits] = useState<Set<string>>(new Set(
    todayVisits.filter(v => v.done).map(v => v.id)
  ))
  // Patients roster — search + status filter
  const [patientQuery, setPatientQuery] = useState("")
  const [patientFilter, setPatientFilter] = useState<string>("all")
  // My Trials — search + status / phase filters (mirrors the sponsor dashboard)
  const [trialSearch, setTrialSearch] = useState("")
  const [trialFilter, setTrialFilter] = useState("All")
  const [phaseFilter, setPhaseFilter] = useState("All")
  const [showTrialFilters, setShowTrialFilters] = useState(false)

  // Open straight to a trial's summary when requested (e.g. after a new trial is saved).
  useEffect(() => {
    if (initialTrialId) {
      const t = piTrials.find(tr => tr.id === initialTrialId)
      if (t) { setSelectedTrial(t); setActiveTab("dashboard") }
    }
  }, [initialTrialId])

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

  // Day-at-a-glance figures
  const doneToday = todayVisits.filter(v => completedVisits.has(v.id)).length
  const firstPendingVisitId = todayVisits.find(v => !completedVisits.has(v.id))?.id
  const todayLabel = new Date(TODAY_ISO + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
  const pendingApprovals =
    (deviations.length - signedDeviations.size) +
    (ecrfItems.length - signedEcrf.size) +
    (enrolments.length - approvedEnrolments.size - rejectedEnrolments.size)

  // Identity shown in the header / profile
  const id = profileEntity === "smo"
    ? { eyebrow: "SMO · Site management", greet: "Dr. Verma", avatar: "RV" }
    : { eyebrow: "Principal Investigator", greet: "Dr. Sharma", avatar: "DS" }

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
  const TrialPanel = ({ tr }: { tr: typeof piTrials[0] }) => (
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
      <h4 className="font-heading text-foreground text-base leading-snug mb-2.5 line-clamp-2">{tr.title}</h4>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {[tr.phase, tr.disease, tr.drug].map(val => (
          <span key={val} className="rounded-full bg-muted text-muted-foreground px-2.5 py-0.5 text-[11px] font-medium">{val}</span>
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

  const SponsorPanel = ({ sponsor }: { sponsor: typeof piSponsors[0] }) => (
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

  // ── Immersive dashboard header — fused app bar + day deck ──────────────────
  const dayProgress = todayVisits.length ? doneToday / todayVisits.length : 0
  const immersiveHeader = (
    <header className="relative overflow-hidden text-primary-foreground">
      <div className="absolute inset-0 dawn-gradient" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-deep via-primary-deep/55 to-transparent" />
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 paper-grain" />
      <svg viewBox="0 0 200 200" className="pointer-events-none absolute -right-12 -top-12 h-60 w-60 text-white/25" fill="none">
        <path d="M30 110 a70 70 0 0 1 140 0" stroke="currentColor" strokeWidth="1.5" pathLength={100} className="animate-arc" />
        <path d="M52 110 a48 48 0 0 1 96 0" stroke="currentColor" strokeWidth="1" pathLength={100} className="animate-arc" style={{ animationDelay: "220ms" }} />
        <circle cx="100" cy="110" r="22" stroke="currentColor" strokeWidth="1" className="text-white/15" />
      </svg>
      <span className="pointer-events-none absolute right-10 top-24 h-2 w-2 rounded-full bg-white/40 animate-drift" />
      <span className="pointer-events-none absolute right-28 top-36 h-1.5 w-1.5 rounded-full bg-white/30 animate-drift-slow" />
      <span className="pointer-events-none absolute left-10 top-44 h-1 w-1 rounded-full bg-white/30 animate-drift" />

      <div className="relative px-4 pt-3.5 pb-16">
        {/* Top row */}
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-white/65">{id.eyebrow}</p>
            <h1 className="display-serif text-2xl leading-tight inline-flex items-center gap-2">
              Hi, {id.greet} <Sun className="h-5 w-5 text-white/80 animate-pulse-soft" />
            </h1>
          </div>
          <button onClick={() => onNavigate("notifications")} aria-label="Notifications" className="springy relative grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur-sm active:scale-95 hover:bg-white/25 ring-1 ring-white/20">
            <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-primary-deep">3</span>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </button>
          <button onClick={() => setActiveTab("me")} aria-label="Account" className="springy grid h-11 w-11 place-items-center rounded-full bg-white/20 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-sm active:scale-95">
            {id.avatar}
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
              <button onClick={() => setActiveTab("approvals")} className="springy inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-semibold ring-1 ring-white/15 active:scale-95">
                <ClipboardList className="h-3.5 w-3.5" /> {pendingApprovals} approvals
              </button>
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
  const compactBar = (title: string) => (
    <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
      <div className="relative flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="eyebrow text-primary-foreground/55">{id.eyebrow}</p>
          <h1 className="display-serif text-lg leading-tight">{title}</h1>
        </div>
        <button onClick={() => onNavigate("notifications")} aria-label="Notifications" className="springy relative grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-sm active:scale-95 hover:bg-white/25">
          <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-primary-deep">3</span>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </button>
        <button onClick={() => setActiveTab("me")} aria-label="Account" className="springy grid h-10 w-10 place-items-center rounded-full bg-white/20 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-sm active:scale-95">
          {id.avatar}
        </button>
      </div>
    </div>
  )

  // ── Dashboard body (floats up into the hero) ──────────────────────────────
  const renderDashboard = () => {
    const weekTotal = weekDays.reduce((n, d) => n + d.visits.length, 0)
    return (
      <div className="relative -mt-10 px-4 pb-6 space-y-6">
        {/* Portfolio bento — floating stat tiles */}
        <div className="grid grid-cols-3 gap-3 animate-rise" style={{ animationDelay: "120ms" }}>
          {[
            { onClick: () => setShowAllTrials(true), icon: FileText, ic: "text-info", bg: "bg-info/12", glow: "bg-info/20", value: piTrials.length, label: "Total Trials" },
            { onClick: () => setShowSponsors(true), icon: Building2, ic: "text-accent", bg: "bg-accent/15", glow: "bg-accent/20", value: piSponsors.length, label: "Sponsors" },
            { onClick: () => setActiveTab("patients"), icon: Users, ic: "text-violet", bg: "bg-violet/12", glow: "bg-violet/20", value: patients.length, label: "Patients" },
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
          <div className="grid grid-cols-2 gap-3">
            {[
              { onClick: () => onNavigate("add-trial"), icon: FilePlus2, orb: "bg-info text-info-foreground", label: "New Trial" },
              { onClick: () => onNavigate("add-patient"), icon: UserPlus, orb: "dawn-gradient text-primary-foreground", label: "Add Patient" },
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

        {/* This Week */}
        <section className="animate-rise" style={{ animationDelay: "260ms" }}>
          <SectionLabel
            label="This week"
            action={
              <button onClick={() => onNavigate("pi-calendar-week")} className="springy text-info text-sm font-semibold inline-flex items-center gap-0.5 active:scale-95">
                View week <ChevronRight className="w-4 h-4" />
              </button>
            }
          />
          <WeekLoadChart days={weekDays} total={weekTotal} onView={() => onNavigate("pi-calendar-week")} />
        </section>

        {/* My Trials */}
        <section className="animate-rise" style={{ animationDelay: "330ms" }}>
          <SectionLabel
            label="My trials"
            action={
              <button onClick={() => setShowAllTrials(true)} className="springy text-info text-sm font-semibold inline-flex items-center gap-0.5 active:scale-95">
                See all <ChevronRight className="w-4 h-4" />
              </button>
            }
          />
          <div className="space-y-3">
            {piTrials.slice(0, 2).map(tr => <TrialPanel key={tr.id} tr={tr} />)}
          </div>
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
                  <div className="relative flex flex-col items-center pt-1.5">
                    <span className={cn(
                      "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full ring-2 transition-all",
                      done ? "dawn-gradient ring-transparent text-primary-foreground shadow-sm"
                        : isNext ? "bg-card ring-info"
                        : "bg-card ring-border"
                    )}>
                      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : <span className={cn("h-2 w-2 rounded-full", isNext ? "bg-info animate-pulse-soft" : "bg-muted-foreground/30")} />}
                    </span>
                    {!last && <span className={cn("w-0.5 flex-1 my-1 rounded-full", done ? "dawn-gradient" : "bg-border")} />}
                  </div>

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
                <div key={p.id} className="springy relative overflow-hidden bg-card rounded-2xl border border-destructive/30 p-3 pl-4 shadow-xs">
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-destructive" />
                  <span className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-destructive/10 blur-2xl animate-pulse-soft" />
                  <div className="relative flex items-center gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-destructive/12 text-destructive">
                      <AlertTriangle className="h-4 w-4 animate-pulse-soft" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-sm truncate">{p.name}</p>
                        <span className="shrink-0 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">{p.daysOverdue}d overdue</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/70 truncate">{p.id} · {p.visit} · Last contact {p.lastContact}</p>
                    </div>
                    <button
                      onClick={() => { const full = patients.find(pt => pt.id === p.id); if (full) setViewPatient(full) }}
                      className="springy shrink-0 bg-destructive text-destructive-foreground px-3.5 py-1.5 rounded-full text-xs font-semibold active:scale-95 shadow-sm"
                    >
                      Review
                    </button>
                  </div>
                  <span className="relative ml-[2.875rem] mt-2 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/80 max-w-[calc(100%-2.875rem)] truncate">
                    <FileText className="h-3 w-3 shrink-0" /> {p.protocol} · {p.indication}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  // ── Patients tab (operational roster) ─────────────────────────────────────
  const renderPatients = () => {
    return (
      <div className="flex-1 overflow-auto scrollbar-hide pb-4">
        <div className="px-4 pt-4">
          <div className="flex gap-2.5 animate-rise" style={{ animationDelay: "20ms" }}>
            <button onClick={() => onNavigate("add-patient")} className="springy flex-1 flex items-center justify-center gap-1.5 dawn-gradient text-primary-foreground py-3 rounded-2xl text-sm font-semibold active:scale-[0.98] shadow-sm">
              <UserPlus className="w-4 h-4" /> Add Patient
            </button>
            <button onClick={() => onNavigate("invite-patient")} className="springy flex-1 flex items-center justify-center gap-1.5 bg-card border border-border text-foreground/80 py-3 rounded-2xl text-sm font-semibold active:scale-[0.98] shadow-xs">
              <Send className="w-4 h-4" /> Send Invite
            </button>
          </div>
        </div>

        <div className="px-4 pt-3 space-y-3">
          {patients.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-xs animate-rise">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground/50">
                <Users className="h-6 w-6" />
              </div>
              <p className="font-heading text-foreground text-base mt-3">No subjects found</p>
              <p className="text-xs text-muted-foreground mt-0.5">Try a different search or filter.</p>
            </div>
          ) : (
            patients.map((p, idx) => {
              const style = statusStyle[p.status]
              const total = PROTOCOL_TOTAL_VISITS
              const completed = p.history?.filter(v => v.outcome === "completed").length ?? 0
              return (
                <div key={p.id} className="animate-rise" style={{ animationDelay: `${idx * 70}ms` }}>
                  <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                    <button onClick={() => setViewPatient(p)} className="block w-full text-left p-4 transition-colors active:bg-muted/30">
                      {/* Header — avatar · subject id · status */}
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full dawn-gradient text-primary-foreground text-sm font-bold shadow-sm">
                          {patientInitials(p.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-heading text-base font-bold text-foreground leading-tight">{p.id}</p>
                          <p className="text-xs text-muted-foreground">{patientInitials(p.name)} · Age {p.age}</p>
                        </div>
                        <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", style.bg, style.text)}>{style.label}</span>
                      </div>

                      {/* Trial meta */}
                      <div className="mt-3.5 grid grid-cols-3 gap-2">
                        {[
                          { label: "Protocol ID", val: p.protocol ?? "—" },
                          { label: "Phase", val: p.phase ?? "—" },
                          { label: "Indication", val: p.indication ?? "—" },
                        ].map(f => (
                          <div key={f.label} className="min-w-0">
                            <p className="eyebrow text-muted-foreground/60 text-[9px]">{f.label}</p>
                            <p className="text-xs font-medium text-foreground mt-0.5 truncate">{f.val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Next visit */}
                      <div className="mt-3 rounded-2xl border border-border bg-surface p-3.5">
                        <p className="eyebrow text-muted-foreground/60 text-[9px] mb-2.5">Next Visit</p>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                          {[
                            { label: "Visit No.", val: visitNumber(p.visit) },
                            { label: "Visit Name", val: p.visitName ?? "—" },
                            { label: "Visit Type", val: p.visitType ?? "—" },
                            { label: "Visit Date", val: p.dateISO ? new Date(p.dateISO + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—" },
                          ].map(f => (
                            <div key={f.label} className="min-w-0">
                              <p className="eyebrow text-muted-foreground/60 text-[9px]">{f.label}</p>
                              <p className="text-sm font-medium text-foreground mt-0.5">{f.val}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Visits completed */}
                      <div className="mt-3 flex items-center justify-between">
                        <p className="eyebrow text-muted-foreground/60 text-[9px]">Visits Completed</p>
                        <p className="font-mono text-xs font-semibold text-foreground tabular-nums">{completed} of {total}</p>
                      </div>

                      {p.note && <p className="mt-2 text-[11px] text-muted-foreground/70">Remarks: {p.note}</p>}
                    </button>

                    <div className="flex gap-2 px-4 pb-4">
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

  // ── Approvals tab ─────────────────────────────────────────────────────────
  const renderApprovals = () => {
    const counts = {
      deviations: deviations.length - signedDeviations.size,
      ecrf: ecrfItems.length - signedEcrf.size,
      enrolments: enrolments.length - approvedEnrolments.size - rejectedEnrolments.size,
    }
    return (
      <div className="flex-1 overflow-auto scrollbar-hide pb-4 pt-4">
        {/* Sub-tabs — dawn segmented control */}
        <div className="px-4 mb-4">
          <div className="flex rounded-full bg-muted p-1">
            {(["deviations", "ecrf", "enrolments"] as const).map((t) => {
              const labels: Record<ApprovalSubTab, string> = { deviations: "Deviations", ecrf: "eCRF", enrolments: "Enrolments" }
              return (
                <button
                  key={t}
                  onClick={() => setApprovalTab(t)}
                  className={cn(
                    "springy flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-semibold transition-all",
                    approvalTab === t ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  )}
                >
                  {labels[t]}
                  {counts[t] > 0 && <span className={cn("grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold", approvalTab === t ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground")}>{counts[t]}</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-4 space-y-3">
          {approvalTab === "deviations" && deviations.map((d, i) => {
            const signed = signedDeviations.has(d.id)
            return (
              <div key={d.id} className="relative overflow-hidden bg-card rounded-2xl border border-border p-4 pl-5 shadow-xs animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
                <span className={cn("absolute left-0 top-0 bottom-0 w-1.5", signed ? "bg-success" : "bg-warning")} />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-semibold text-foreground">{d.id} · {d.patient}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.desc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", d.severity === "Major" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning")}>{d.severity}</span>
                      <span className="text-[10px] text-muted-foreground/70">Submitted {d.submitted}</span>
                    </div>
                  </div>
                  {signed ? (
                    <span className="flex items-center gap-1 text-success text-xs font-semibold shrink-0">
                      <CheckCircle className="w-4 h-4" /> Signed
                    </span>
                  ) : (
                    <button onClick={() => setSignedDeviations(prev => new Set([...prev, d.id]))} className="springy flex items-center gap-1 dawn-gradient text-primary-foreground px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 active:scale-95 shadow-sm">
                      <PenLine className="w-3 h-3" /> Sign Off
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {approvalTab === "ecrf" && ecrfItems.map((e, i) => {
            const signed = signedEcrf.has(e.id)
            return (
              <div key={e.id} className="relative overflow-hidden bg-card rounded-2xl border border-border p-4 pl-5 shadow-xs animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
                <span className={cn("absolute left-0 top-0 bottom-0 w-1.5", signed ? "bg-success" : "bg-violet")} />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{e.id}: {e.form}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{e.patient} · {e.visit}</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">Submitted by {e.by} on {e.date}</p>
                  </div>
                  {signed ? (
                    <span className="flex items-center gap-1 text-success text-xs font-semibold shrink-0">
                      <CheckCircle className="w-4 h-4" /> Signed
                    </span>
                  ) : (
                    <button onClick={() => setSignedEcrf(prev => new Set([...prev, e.id]))} className="springy flex items-center gap-1 bg-violet text-primary-foreground px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 active:scale-95 shadow-sm">
                      <PenLine className="w-3 h-3" /> Sign
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {approvalTab === "enrolments" && enrolments.map((e, i) => {
            const approved = approvedEnrolments.has(e.id)
            const rejected = rejectedEnrolments.has(e.id)
            return (
              <div key={e.id} className="relative overflow-hidden bg-card rounded-2xl border border-border p-4 pl-5 shadow-xs animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
                <span className={cn("absolute left-0 top-0 bottom-0 w-1.5", approved ? "bg-success" : rejected ? "bg-destructive" : "bg-info")} />
                <div className="mb-3">
                  <p className="text-sm font-semibold text-foreground">{e.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.screenId} · Age {e.age} · Screened {e.screened}</p>
                  <span className={cn("inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold", e.eligible ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive")}>
                    {e.eligible ? "Eligible" : "Failed Eligibility"}
                  </span>
                </div>
                {(approved || rejected) ? (
                  <div className={cn("flex items-center gap-1 text-sm font-semibold", approved ? "text-success" : "text-destructive")}>
                    <CheckCircle className="w-4 h-4" /> {approved ? "Approved for Enrolment" : "Rejected"}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setApprovedEnrolments(prev => new Set([...prev, e.id]))} className="springy flex-1 dawn-gradient text-primary-foreground py-2.5 rounded-xl text-xs font-semibold active:scale-[0.98] shadow-sm">
                      Approve
                    </button>
                    <button onClick={() => setRejectedEnrolments(prev => new Set([...prev, e.id]))} className="springy flex-1 bg-card border border-destructive/30 text-destructive py-2.5 rounded-xl text-xs font-semibold active:scale-[0.98]">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── My Trials tab ─────────────────────────────────────────────────────────
  const renderMyTrials = () => {
    const q = trialSearch.trim().toLowerCase()
    const filteredTrials = piTrials.filter(tr => {
      const matchesStatus = trialFilter === "All" || tr.status === trialFilter
      const matchesPhase = phaseFilter === "All" || tr.phase === phaseFilter
      const matchesSearch = !q ||
        tr.id.toLowerCase().includes(q) || tr.title.toLowerCase().includes(q) ||
        tr.disease.toLowerCase().includes(q) || tr.drug.toLowerCase().includes(q)
      return matchesStatus && matchesPhase && matchesSearch
    })
    const statusChips = [
      { label: "All", val: "All", count: piTrials.length },
      { label: "Active", val: "Active", count: piTrials.filter(t => t.status === "Active").length },
      { label: "Completed", val: "Completed", count: piTrials.filter(t => t.status === "Completed").length },
      { label: "Terminated", val: "Terminated", count: piTrials.filter(t => t.status === "Terminated").length },
    ]
    return (
      <div className="flex-1 overflow-auto scrollbar-hide pb-4 pt-4 px-4">
        {/* Search + filter toggle + add */}
        <div className="flex items-center gap-2 mb-3 animate-rise" style={{ animationDelay: "20ms" }}>
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <input value={trialSearch} onChange={e => setTrialSearch(e.target.value)} placeholder="Search trials…" className="w-full rounded-2xl border border-border bg-card pl-10 pr-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30" />
          </div>
          <button
            onClick={() => setShowTrialFilters(v => !v)}
            className={cn("springy grid h-10 w-10 shrink-0 place-items-center rounded-2xl border active:scale-95", showTrialFilters || phaseFilter !== "All" ? "dawn-gradient border-transparent text-primary-foreground shadow-sm" : "bg-card border-border text-muted-foreground")}>
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button onClick={() => onNavigate("add-trial")} className="springy shrink-0 inline-flex items-center gap-1 rounded-2xl dawn-gradient text-primary-foreground px-3.5 py-2.5 text-xs font-semibold active:scale-95 shadow-sm">
            <FilePlus2 className="w-4 h-4" /> Add Trial
          </button>
        </div>
        {/* Phase filter panel (toggled by the sliders button) */}
        {showTrialFilters && (
          <div className="bg-card border border-border rounded-2xl p-3 mb-3 shadow-xs animate-rise">
            <div className="flex items-center justify-between mb-2">
              <p className="eyebrow text-muted-foreground/70">Filter by Phase</p>
              {phaseFilter !== "All" && (
                <button onClick={() => setPhaseFilter("All")} className="text-[11px] text-info font-semibold">Clear</button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Phase I", "Phase II", "Phase III", "Phase IV"].map(p => (
                <button key={p} onClick={() => setPhaseFilter(p)} className={cn("springy px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95", phaseFilter === p ? "dawn-gradient text-primary-foreground shadow-sm" : "bg-surface text-muted-foreground border border-border")}>{p}</button>
              ))}
            </div>
          </div>
        )}
        {/* Status filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 mb-4 animate-rise" style={{ animationDelay: "70ms" }}>
          {statusChips.map(f => {
            const active = trialFilter === f.val
            return (
              <button key={f.val} onClick={() => setTrialFilter(f.val)} className={cn("springy shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95", active ? "dawn-gradient text-primary-foreground shadow-sm" : "bg-card border border-border text-muted-foreground")}>
                {f.label} <span className={cn("tabular-nums", active ? "text-primary-foreground/80" : "text-muted-foreground/60")}>{f.count}</span>
              </button>
            )
          })}
        </div>
        {/* Trial list */}
        <div key={`${trialFilter}-${phaseFilter}-${trialSearch}`} className="space-y-3">
          {filteredTrials.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-xs animate-rise">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground/50">
                <FileText className="h-6 w-6" />
              </div>
              <p className="font-heading text-foreground text-base mt-3">No trials found</p>
              <p className="text-xs text-muted-foreground mt-0.5">Try a different search or filter.</p>
            </div>
          ) : filteredTrials.map((tr, i) => (
            <div key={tr.id} className="animate-rise" style={{ animationDelay: `${100 + i * 70}ms` }}>
              <TrialPanel tr={tr} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Profile / Me tab ──────────────────────────────────────────────────────
  const renderMe = () => (
    <SiteUserProfile
      user={profileEntity === "smo" ? {
        initials: "RV",
        avatarColor: "bg-accent",
        name: "Dr. Ramesh Verma",
        designation: "SMO Coordinator",
        phone: "+91 98200 67890",
        email: "ramesh.verma@medsite.com",
        entityType: "SMO",
        orgName: "MedSite Clinical Services",
        orgAddress: "MG Road, Bengaluru 560001",
        role: "PI",
        department: "Operations",
        hospitals: [
          { name: "Apollo Hospital", address: "Greams Road, Chennai 600006", role: "PI", department: "Oncology" },
          { name: "Fortis Hospital", address: "Bannerghatta Road, Bengaluru 560076", role: "PI", department: "Cardiology" },
          { name: "Manipal Hospital", address: "HAL Airport Road, Bengaluru 560017", role: "Research Team" },
        ],
      } : {
        initials: "DS",
        avatarColor: "bg-primary",
        name: "Dr. Sharma",
        designation: "Principal Investigator",
        phone: "+91 98100 12345",
        email: "dr.sharma@apollo.com",
        entityType: "Site / Hospital",
        orgName: "Apollo Hospital",
        orgAddress: "Greams Road, Chennai 600006",
        role: "PI",
        department: "Oncology",
      }}
      onSignOut={() => onNavigate("welcome")}
      onOpenTrials={() => setActiveTab("my-trials")}
    />
  )

  // ── Trial Detail → Trial Summary page (PI view) ───────────────────────────
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
          {piTrials.map((tr, i) => (
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
          {piSponsors.map((sponsor, i) => (
            <div key={sponsor.name} className="animate-rise" style={{ animationDelay: `${40 + i * 60}ms` }}><SponsorPanel sponsor={sponsor} /></div>
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
        <SubHeader eyebrow="Patient" title="Patient Record" onBack={() => { setViewPatient(null); setRecordScheduleOpen(false); setExpandedScheduleVisit(null) }} />
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
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 bg-white/20 backdrop-blur-sm">{style.label}</span>
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
                      const activities = VISIT_ACTIVITIES[v.type] ?? []
                      const open = expandedScheduleVisit === v.visit
                      const isDone = v.state === "completed"
                      const showBorder = i < arr.length - 1 && !open
                      return (
                        <Fragment key={v.visit}>
                          <tr
                            onClick={() => setExpandedScheduleVisit(open ? null : v.visit)}
                            className={cn("cursor-pointer transition-colors hover:bg-surface/60", showBorder && "border-b border-border", open && "bg-surface/60")}
                          >
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <Icon className={cn("w-3.5 h-3.5 shrink-0", sc.color)} />
                                <span className="text-sm font-semibold text-foreground whitespace-nowrap">{v.visit}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-xs text-muted-foreground">{v.type}</td>
                            <td className="py-2.5 px-3 text-xs text-muted-foreground text-right whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5">
                                {windowLabel}
                                <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground/60 transition-transform", open && "rotate-180")} />
                              </span>
                            </td>
                          </tr>
                          {open && (
                            <tr className={cn(i < arr.length - 1 && "border-b border-border")}>
                              <td colSpan={3} className="px-3 pb-3 pt-0 bg-surface/60">
                                <p className="eyebrow text-muted-foreground/60 text-[9px] mb-1.5">
                                  {isDone ? "Activities completed" : "Planned activities"}
                                </p>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                                  {activities.map((a) => (
                                    <div key={a} className="flex items-center gap-1.5">
                                      {isDone
                                        ? <CheckCircle className="w-3.5 h-3.5 shrink-0 text-success" />
                                        : <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />}
                                      <span className={cn("text-xs", isDone ? "text-foreground" : "text-muted-foreground")}>{a}</span>
                                    </div>
                                  ))}
                                  {activities.length === 0 && (
                                    <p className="text-xs text-muted-foreground/60 italic col-span-2">No activities listed.</p>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
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

  const tabTitle =
    activeTab === "my-trials" ? "My Trials" :
    activeTab === "patients" ? "Patients" :
    activeTab === "approvals" ? "Approvals" :
    activeTab === "notifs" ? "Notifications" :
    id.greet

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
          {activeTab === "my-trials" && renderMyTrials()}
          {activeTab === "patients" && renderPatients()}
          {activeTab === "approvals" && renderApprovals()}
          {activeTab === "notifs" && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground/70 text-sm">
              Notifications coming soon
            </div>
          )}
          {activeTab === "me" && renderMe()}
        </>
      )}

      <BottomNav
        activeTab={activeTab}
        role="pi"
        notificationCount={3}
        onTabChange={(tab) => {
          if (tab === "chat") { onNavigate("chat"); return }
          if (tab === "calendar") { onNavigate("pi-calendar"); return }
          setActiveTab(tab as PiTab)
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
                  { label: "Protocol ID", val: piTrials[0].id },
                  { label: "Phase", val: piTrials[0].phase },
                  { label: "Indication", val: piTrials[0].disease },
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
