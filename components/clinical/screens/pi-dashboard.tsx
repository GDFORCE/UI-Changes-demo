"use client"

import { useState, useEffect } from "react"
import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import {
  CheckCircle, Clock, AlertTriangle, FileText, ChevronRight,
  PenLine, Users, Activity, Shield, Calendar, TrendingUp, Info,
  Building2, UserPlus, Send, FilePlus2, X, ChevronDown
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
}

const initialPatients: Patient[] = [
  {
    id: "SUBJ-001", name: "Priya Krishnan", age: 45, visit: "Visit 7", visitName: "Efficacy Assessment", visitType: "Hospital", dateISO: "2026-05-23", status: "on-track",
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
    id: "SUBJ-002", name: "Rahul Mehta", age: 52, visit: "Visit 4", visitName: "Safety Follow-up", visitType: "Hospital", dateISO: "2026-05-19", status: "overdue",
    history: [
      { visit: "Visit 1", dateISO: "2026-02-10", type: "Screening", outcome: "completed", note: "ICF signed" },
      { visit: "Visit 2", dateISO: "2026-03-03", type: "Baseline", outcome: "completed", note: "Randomized" },
      { visit: "Visit 3", dateISO: "2026-04-21", type: "Safety Follow-up", outcome: "completed" },
    ],
  },
  {
    id: "SUBJ-003", name: "Anita Patel", age: 38, visit: "Visit 2", visitName: "Baseline", visitType: "Hospital", dateISO: "2026-06-08", status: "on-track",
    history: [
      { visit: "Visit 1", dateISO: "2026-05-18", type: "Screening", outcome: "completed", note: "Eligibility confirmed" },
    ],
  },
  {
    id: "SUBJ-004", name: "Vijay Sharma", age: 61, visit: "Visit 5", visitName: "Lab & Vitals", visitType: "Hospital", dateISO: "2026-06-08", status: "on-track",
    history: [
      { visit: "Visit 1", dateISO: "2026-02-20", type: "Screening", outcome: "completed" },
      { visit: "Visit 2", dateISO: "2026-03-13", type: "Baseline", outcome: "completed", note: "Randomized" },
      { visit: "Visit 3", dateISO: "2026-04-03", type: "Safety Follow-up", outcome: "completed" },
      { visit: "Visit 4", dateISO: "2026-05-15", type: "Lab & Vitals", outcome: "completed" },
    ],
  },
  {
    id: "SUBJ-005", name: "Deepa Nair", age: 44, visit: "—", visitName: "—", visitType: "—", dateISO: "", status: "withdrawn",
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
  { id: "SUBJ-002", name: "Rahul Mehta", visit: "Visit 4", daysOverdue: 3, lastContact: "19 May" },
]

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
]

const statusStyle: Record<string, { label: string; bg: string; text: string }> = {
  "on-track": { label: "On Track", bg: "bg-success/15", text: "text-success" },
  overdue:    { label: "Overdue",  bg: "bg-destructive/10",     text: "text-destructive" },
  completed:  { label: "Completed",bg: "bg-info/10",    text: "text-info" },
  withdrawn:  { label: "Withdrawn",bg: "bg-muted",   text: "text-muted-foreground" },
  "screen-failure": { label: "Screen Failure", bg: "bg-destructive/10", text: "text-destructive" },
  dropout:    { label: "Dropout",  bg: "bg-warning/15", text: "text-warning" },
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
  const [form, setForm] = useState<{ visit: string; visitName: string; visitType: string; dateISO: string; status: PatientStatus; note: string }>({
    visit: "", visitName: "", visitType: "Hospital", dateISO: "", status: "on-track", note: "",
  })
  
  const [savedToast, setSavedToast] = useState<string | null>(null)
  const [completedVisits] = useState<Set<string>>(new Set(
    todayVisits.filter(v => v.done).map(v => v.id)
  ))

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

  const trialStatusColor: Record<string, string> = {
    Active: "bg-success/15 text-success",
    Completed: "bg-info/10 text-info",
    Terminated: "bg-destructive/10 text-destructive",
  }

  // One trial = one clickable panel → Trial Summary
  const TrialPanel = ({ tr }: { tr: typeof piTrials[0] }) => (
    <button onClick={() => setSelectedTrial(tr)} className="w-full text-left bg-card rounded-2xl border border-border p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="px-2 py-0.5 bg-info/10 text-info text-xs rounded-full font-medium">{tr.id}</span>
        <div className="flex items-center gap-1.5">
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", trialStatusColor[tr.status] || "bg-muted text-muted-foreground")}>{tr.status}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
        {[
          { label: "Phase", val: tr.phase },
          { label: "Disease", val: tr.disease },
          { label: "Drug", val: tr.drug },
          { label: "Sponsor Name", val: tr.sponsor },
          { label: "Site Name", val: tr.site },
          { label: "PI Name", val: tr.pi },
          { label: "Department", val: tr.department },
        ].map(f => (
          <div key={f.label} className={f.label === "Department" ? "col-span-2 text-center" : undefined}>
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">{f.label}</p>
            <p className="text-xs font-medium text-foreground">{f.val}</p>
          </div>
        ))}
      </div>
    </button>
  )

  const SponsorPanel = ({ sponsor }: { sponsor: typeof piSponsors[0] }) => (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-info/5 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-info" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Sponsor Name</p>
          <h4 className="font-semibold text-foreground text-sm">{sponsor.name}</h4>
        </div>
      </div>
      <div className="space-y-2">
        {sponsor.trials.map(tr => (
          <button key={tr.id} onClick={() => setSelectedTrial(tr)} className="w-full text-left rounded-xl border border-border bg-surface p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-info">{tr.id}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
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
                  <p className="text-[9px] text-muted-foreground/70 uppercase tracking-wide">{f.label}</p>
                  <p className="text-xs font-semibold text-foreground">{f.val}</p>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // ── Dashboard tab ────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="flex-1 overflow-auto pb-4 space-y-4 pt-4">
      {/* Summary stats */}
      <div className="px-4 grid grid-cols-3 gap-3">
        <button onClick={() => setShowAllTrials(true)} className="bg-info/5 rounded-2xl border border-border p-4 text-left shadow-sm">
          <FileText className="w-5 h-5 text-info mb-2" />
          <p className="text-2xl font-bold text-foreground">{piTrials.length}</p>
          <p className="text-xs text-muted-foreground">Total Trials</p>
        </button>
        <button onClick={() => setShowSponsors(true)} className="bg-accent/5 rounded-2xl border border-border p-4 text-left shadow-sm">
          <Building2 className="w-5 h-5 text-accent mb-2" />
          <p className="text-2xl font-bold text-foreground">{piSponsors.length}</p>
          <p className="text-xs text-muted-foreground">Sponsors</p>
        </button>
        <button onClick={() => setActiveTab("patients")} className="bg-violet/5 rounded-2xl border border-border p-4 text-left shadow-sm">
          <Users className="w-5 h-5 text-violet mb-2" />
          <p className="text-2xl font-bold text-foreground">{patients.length}</p>
          <p className="text-xs text-muted-foreground">Total Patients</p>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-4">
        <h3 className="font-semibold text-foreground mb-2 font-[family-name:var(--font-heading)]">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onNavigate("add-trial")} className="bg-card rounded-2xl border border-border p-3 shadow-xs flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-info/5 flex items-center justify-center">
              <FilePlus2 className="w-5 h-5 text-info" />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">New Trial</span>
          </button>
          <button onClick={() => onNavigate("add-patient")} className="bg-card rounded-2xl border border-border p-3 shadow-xs flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">Add Patient</span>
          </button>
          <button onClick={() => onNavigate("invite-patient")} className="bg-card rounded-2xl border border-border p-3 shadow-xs flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-warning" />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">Invite Patient</span>
          </button>
        </div>
      </div>

      {/* This Week */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground font-[family-name:var(--font-heading)]">This Week's Schedule</h3>
          <button onClick={() => onNavigate("pi-calendar-week")} className="text-info text-sm font-medium flex items-center gap-1">View Week <ChevronRight className="w-4 h-4" /></button>
        </div>
        <button
          onClick={() => onNavigate("pi-calendar-week")}
          className="w-full bg-card rounded-2xl border border-border p-4 shadow-xs flex justify-between text-left hover:bg-surface transition-colors"
        >
          {weekDays.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground/70 font-medium">{d.day}</span>
              <span className="text-sm font-semibold text-foreground">{d.date}</span>
              <div className="flex flex-col gap-0.5">
                {d.visits.length > 0 ? (
                  d.visits.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-info" />
                  ))
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground/70">{d.visits.length > 0 ? `${d.visits.length}v` : "—"}</span>
            </div>
          ))}
        </button>
      </div>

      {/* Trials Panel */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground font-[family-name:var(--font-heading)]">My Trials</h3>
          <button onClick={() => setShowAllTrials(true)} className="text-info text-sm font-medium flex items-center gap-1">See All <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          {piTrials.slice(0, 2).map(tr => <TrialPanel key={tr.id} tr={tr} />)}
        </div>
      </div>

      {/* Today's Visits */}
      <div className="px-4">
        <h3 className="font-semibold text-foreground mb-2 font-[family-name:var(--font-heading)]">Today's Visits</h3>
        <div className="space-y-2">
          {todayVisits.map((visit) => {
            const done = completedVisits.has(visit.id)
            return (
              <div key={visit.id} className={cn("bg-card rounded-2xl border border-border p-4 shadow-xs border-l-4 transition-all", done ? "border-teal-400" : "border-info")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{visit.patient} · {subjectInitials(visit.name)}</p>
                    <p className="text-xs text-muted-foreground/70">{visit.protocol} · {visit.pi}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{visit.visit} · {visit.type}</p>
                  </div>
                  {done ? (
                    <div className="flex items-center gap-1 text-accent text-xs font-medium shrink-0">
                      <CheckCircle className="w-4 h-4" /> Done
                    </div>
                  ) : (
                    <button
                      onClick={() => { const p = patients.find(pt => pt.id === visit.patient); if (p) openVisitUpdate(p) }}
                      className="bg-primary-deep text-white px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0"
                    >
                      Update
                    </button>
                  )}
                </div>

                {/* Who completed it */}
                {done && visit.completedBy && (
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border text-[11px] text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-accent shrink-0" />
                    <span>Completed by <span className="font-medium text-foreground">{visit.completedBy}</span> ({visit.completedByRole}) · {visit.completedAt}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Overdue */}
      {overduePatients.length > 0 && (
        <div className="px-4">
          <h3 className="font-semibold text-foreground mb-2 font-[family-name:var(--font-heading)]">Overdue</h3>
          {overduePatients.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl border border-border p-4 shadow-xs border-l-4 border-red-400">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground/70">{p.id} · {p.visit}</p>
                  <p className="text-xs text-destructive mt-1">{p.daysOverdue} days overdue · Last: {p.lastContact}</p>
                </div>
                <button className="bg-destructive/5 border border-destructive/20 text-destructive px-3 py-1.5 rounded-xl text-xs font-semibold">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ── Patients tab (operational) ───────────────────────────────────────────
  const renderPatients = () => (
    <div className="flex-1 overflow-auto pb-4 pt-4 px-4 space-y-2">
      <div className="flex gap-2.5 pb-3 mb-1 border-b border-border">
        <button
          onClick={() => onNavigate("add-patient")}
          className="flex-1 flex items-center justify-center gap-1.5 bg-primary-deep text-white py-2.5 rounded-xl text-xs font-semibold shadow-sm active:scale-[0.98] transition-transform"
        >
          <UserPlus className="w-4 h-4" /> Add Patient
        </button>
        <button
          onClick={() => onNavigate("invite-patient")}
          className="flex-1 flex items-center justify-center gap-1.5 bg-info/5 border-2 border-primary-deep text-primary-deep py-2.5 rounded-xl text-xs font-semibold active:scale-[0.98] transition-transform"
        >
          <Send className="w-4 h-4" /> Send Invite
        </button>
      </div>
      {patients.map((p) => {
        const style = statusStyle[p.status]
        const trialInfo = piTrials[0]
        const completedVisits = p.history?.filter(h => h.outcome === "completed").length ?? 0
        return (
          <div key={p.id} className="bg-card rounded-2xl border border-border p-4 shadow-xs">
            {/* Subject ID + initials + visit status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">{patientInitials(p.name)}</div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground leading-tight">{p.id}</p>
                  <p className="text-[11px] text-muted-foreground/70">{patientInitials(p.name)}</p>
                </div>
              </div>
              <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0", style.bg, style.text)}>
                {style.label}
              </span>
            </div>

            {/* Trial meta */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Protocol ID</p><p className="text-xs font-medium text-foreground">{trialInfo.id}</p></div>
              <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Phase</p><p className="text-xs font-medium text-foreground">{trialInfo.phase}</p></div>
              <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Indication</p><p className="text-xs font-medium text-foreground">{trialInfo.disease}</p></div>
            </div>

            {/* Next visit */}
            <div className="rounded-xl border border-border bg-surface p-2.5 mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1.5">Next Visit</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div><p className="text-[10px] text-muted-foreground/70">Visit No.</p><p className="text-xs font-medium text-foreground">{visitNumber(p.visit)}</p></div>
                <div><p className="text-[10px] text-muted-foreground/70">Visit Name</p><p className="text-xs font-medium text-foreground">{p.visitName ?? "—"}</p></div>
                <div><p className="text-[10px] text-muted-foreground/70">Visit Type</p><p className="text-xs font-medium text-foreground">{p.visitType ?? "—"}</p></div>
                <div><p className="text-[10px] text-muted-foreground/70">Visit Date</p><p className="text-xs font-medium text-foreground">{visitDateLabel(p)}</p></div>
              </div>
            </div>

            {/* Visits completed */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Visits Completed</span>
              <span className="text-xs font-semibold text-foreground">{completedVisits} of {PROTOCOL_TOTAL_VISITS}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openVisitUpdate(p)}
                className="flex-1 bg-primary-deep text-white py-2 rounded-xl text-xs font-semibold"
              >
                Update Visit
              </button>
              <button
                onClick={() => setViewPatient(p)}
                className="flex-1 bg-surface border border-border text-foreground/80 py-2 rounded-xl text-xs font-semibold"
              >
                View Record
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )

  // ── Approvals tab ────────────────────────────────────────────────────────
  const renderApprovals = () => (
    <div className="flex-1 overflow-auto pb-4 pt-4">
      {/* Sub-tabs */}
      <div className="px-4 mb-4">
        <div className="bg-muted rounded-xl p-1 flex gap-1">
          {(["deviations", "ecrf", "enrolments"] as const).map((t) => {
            const labels: Record<ApprovalSubTab, string> = { deviations: "Deviations", ecrf: "eCRF", enrolments: "Enrolments" }
            return (
              <button
                key={t}
                onClick={() => setApprovalTab(t)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  approvalTab === t ? "bg-card text-primary-deep shadow-sm" : "text-muted-foreground"
                )}
              >
                {labels[t]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 space-y-3">
        {approvalTab === "deviations" && deviations.map((d) => {
          const signed = signedDeviations.has(d.id)
          return (
            <div key={d.id} className={cn("bg-card rounded-2xl border border-border p-4 shadow-xs border-l-4", signed ? "border-teal-400" : "border-amber-400")}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium text-foreground text-sm">{d.patient}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium",
                      d.severity === "Major" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"
                    )}>{d.severity}</span>
                    <span className="text-[10px] text-muted-foreground/70">Submitted {d.submitted}</span>
                  </div>
                </div>
                {signed ? (
                  <div className="flex items-center gap-1 text-accent">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Signed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSignedDeviations(prev => new Set([...prev, d.id]))}
                    className="flex items-center gap-1 bg-primary-deep text-white px-3 py-1.5 rounded-lg text-xs font-medium shrink-0"
                  >
                    <PenLine className="w-3 h-3" /> Sign Off
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {approvalTab === "ecrf" && ecrfItems.map((e) => {
          const signed = signedEcrf.has(e.id)
          return (
            <div key={e.id} className={cn("bg-card rounded-2xl border border-border p-4 shadow-xs border-l-4", signed ? "border-teal-400" : "border-purple-400")}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium text-foreground text-sm">{e.id}: {e.form}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.patient} · {e.visit}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">Submitted by {e.by} on {e.date}</p>
                </div>
                {signed ? (
                  <div className="flex items-center gap-1 text-accent">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Signed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSignedEcrf(prev => new Set([...prev, e.id]))}
                    className="flex items-center gap-1 bg-violet text-white px-3 py-1.5 rounded-lg text-xs font-medium shrink-0"
                  >
                    <PenLine className="w-3 h-3" /> Sign
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {approvalTab === "enrolments" && enrolments.map((e) => {
          const approved = approvedEnrolments.has(e.id)
          const rejected = rejectedEnrolments.has(e.id)
          return (
            <div key={e.id} className={cn("bg-card rounded-2xl border border-border p-4 shadow-xs border-l-4",
              approved ? "border-teal-400" : rejected ? "border-red-400" : "border-blue-400"
            )}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground text-sm">{e.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.screenId} · Age {e.age} · Screened {e.screened}</p>
                  <span className={cn("inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium",
                    e.eligible ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"
                  )}>{e.eligible ? "Eligible" : "Failed Eligibility"}</span>
                </div>
              </div>
              {(approved || rejected) ? (
                <div className={cn("flex items-center gap-1 text-sm font-medium", approved ? "text-accent" : "text-destructive")}>
                  <CheckCircle className="w-4 h-4" />
                  {approved ? "Approved for Enrolment" : "Rejected"}
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setApprovedEnrolments(prev => new Set([...prev, e.id]))}
                    className="flex-1 bg-accent text-white py-2 rounded-xl text-xs font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectedEnrolments(prev => new Set([...prev, e.id]))}
                    className="flex-1 bg-card border border-red-300 text-destructive py-2 rounded-xl text-xs font-semibold"
                  >
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

  // ── My Trials tab ────────────────────────────────────────────────────────
  const renderMyTrials = () => (
    <div className="flex-1 overflow-auto bg-surface">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="font-semibold text-foreground text-lg font-[family-name:var(--font-heading)]">My Trials</h3>
        <button onClick={() => onNavigate("add-trial")} className="flex items-center gap-1 bg-info text-white rounded-full px-3 py-1.5 text-xs font-semibold">
          Add Trial
        </button>
      </div>
      <div className="px-4 pb-4 space-y-3">
        {piTrials.map(tr => <TrialPanel key={tr.id} tr={tr} />)}
      </div>
    </div>
  )

  // ── Profile / Me tab ─────────────────────────────────────────────────────
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

  // ── Trial Detail → Trial Summary page (PI view) ──────────
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

  // ── All Trials list ──────────────────────────────────────
  if (showAllTrials) {
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowAllTrials(false)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">Total Trials</span>
          <button onClick={() => onNavigate("add-trial")} className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 text-xs font-semibold">
            Add Trial
          </button>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
          {piTrials.map(tr => <TrialPanel key={tr.id} tr={tr} />)}
        </div>
      </div>
    )
  }

  if (showSponsors) {
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowSponsors(false)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">Sponsors</span>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
          {piSponsors.map(sponsor => <SponsorPanel key={sponsor.name} sponsor={sponsor} />)}
        </div>
      </div>
    )
  }

  // ── Patient Record (read-only) ───────────────────────────
  if (viewPatient) {
    const p = viewPatient
    const style = statusStyle[p.status]
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => { setViewPatient(null); setRecordScheduleOpen(false) }} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">Patient Record</span>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
          {/* Identity card */}
          <div className="bg-primary-deep rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold">{patientInitials(p.name)}</h2>
                <p className="text-primary-foreground/75 text-sm">{p.id} · Age {p.age}</p>
              </div>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", style.bg, style.text)}>{style.label}</span>
            </div>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
              {[
                { label: "Protocol", val: "Protocol-001" },
                { label: "Site", val: "Site 02" },
                { label: "Current Visit", val: p.visit },
                { label: "Visit Date", val: p.dateISO ? new Date(p.dateISO + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—" },
                { label: "Visit Completed", val: p.visitCompleted ? "Yes" : "No" },
                { label: "Last Updated", val: p.lastUpdated ?? "—" },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[10px] text-primary-foreground/75/80 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm font-medium">{f.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide mb-1">Remarks</p>
            <p className="text-sm text-foreground">{p.note?.trim() ? p.note : "No remarks recorded yet."}</p>
          </div>

          {/* System-generated visit schedule */}
          <div>
            <button onClick={() => setRecordScheduleOpen(open => !open)} className="w-full flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground text-sm font-[family-name:var(--font-heading)]">Visit Schedule</h3>
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
                    <th className="py-2 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Visit</th>
                    <th className="py-2 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Visit Name</th>
                    <th className="py-2 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70 text-right">Window Period</th>
                  </tr>
                </thead>
                <tbody>
                  {buildVisitSchedule(p).map((v, i, arr) => {
                    const sc = {
                      completed: { Icon: CheckCircle, color: "text-teal-500" },
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
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground text-sm font-[family-name:var(--font-heading)]">Visit History</h3>
              <span className="text-xs text-muted-foreground/70">
                {(p.history ?? []).filter(v => v.outcome === "completed").length} completed
              </span>
            </div>
            {(p.history && p.history.length > 0) ? (
              <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
                <div className="relative pl-6">
                  {/* vertical line */}
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                  <div className="space-y-4">
                    {[...p.history].sort((a, b) => b.dateISO.localeCompare(a.dateISO)).map((v, i) => {
                      const oc = {
                        completed: { Icon: CheckCircle, color: "text-teal-500", label: "Completed", badge: "bg-accent/10 text-accent" },
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
            className="w-full bg-primary-deep text-white py-3 rounded-xl text-sm font-semibold"
          >
            Update Visit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-surface relative">
      <AppBar
        title={profileEntity === "smo" ? "SMO Dashboard" : "PI Dashboard"}
        subtitle={profileEntity === "smo" ? "Dr. Ramesh Verma" : "Dr. Sharma"}
        notificationCount={3}
        onNotificationClick={() => onNavigate("notifications")}
        avatar={profileEntity === "smo" ? "RV" : "DS"}
        onAvatarClick={() => setActiveTab("me")}
      />

      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "my-trials" && renderMyTrials()}
      {activeTab === "patients" && renderPatients()}
      {activeTab === "chat" && (
        <div className="flex-1 overflow-hidden">
          {/* Navigate to full chat screen */}
          {(() => { onNavigate("chat"); return null })()}
        </div>
      )}
      {activeTab === "notifs" && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground/70 text-sm">
          Notifications coming soon
        </div>
      )}
      {activeTab === "me" && renderMe()}

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
        <div className="absolute inset-0 z-30 flex items-end" onClick={() => setEditPatient(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full bg-card rounded-t-3xl p-5 max-h-[85%] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-foreground text-base font-[family-name:var(--font-heading)]">Update Visit</h3>
                <p className="text-xs text-muted-foreground/70">{patientInitials(editPatient.name)} · {editPatient.id}</p>
              </div>
              <button onClick={() => setEditPatient(null)} className="p-1 text-muted-foreground/70">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Trial context (read-only) */}
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-surface border border-border p-3">
                {[
                  { label: "Protocol ID", val: piTrials[0].id },
                  { label: "Phase", val: piTrials[0].phase },
                  { label: "Indication", val: piTrials[0].disease },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">{f.label}</p>
                    <p className="text-xs font-semibold text-foreground">{f.val}</p>
                  </div>
                ))}
              </div>

              {/* Visit + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Visit</label>
                  <input
                    type="text"
                    value={form.visit}
                    onChange={(e) => setForm({ ...form, visit: e.target.value })}
                    placeholder="e.g. Visit 7"
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-info"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Visit Date</label>
                  <input
                    type="date"
                    value={form.dateISO}
                    onChange={(e) => setForm({ ...form, dateISO: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-info"
                  />
                </div>
              </div>

              {/* Visit Name + Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Visit Name</label>
                  <input
                    type="text"
                    value={form.visitName}
                    onChange={(e) => setForm({ ...form, visitName: e.target.value })}
                    placeholder="e.g. Efficacy Assessment"
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-info"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Visit Type</label>
                  <select
                    value={form.visitType}
                    onChange={(e) => setForm({ ...form, visitType: e.target.value })}
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground bg-card focus:outline-none focus:border-info"
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
                          "py-2 rounded-xl text-xs font-semibold border transition-colors",
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
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Remarks</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  placeholder="Add any notes about the patient or this visit…"
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:border-info"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditPatient(null)}
                  className="flex-1 py-3 rounded-xl border border-border text-muted-foreground text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={saveVisitUpdate}
                  className="flex-1 py-3 rounded-xl bg-primary-deep text-white text-sm font-semibold"
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
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 bg-foreground text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-400" />
          {savedToast}
        </div>
      )}
    </div>
  )
}