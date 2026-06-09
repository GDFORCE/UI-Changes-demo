"use client"

import { useState } from "react"
import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import {
  CheckCircle, Clock, AlertTriangle, ChevronRight, CheckSquare,
  Square, Users, FileText, Circle, ClipboardList, Calendar, Pill, Building2, X,
  UserPlus, Send, FilePlus2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TrialSummaryScreen } from "@/components/clinical/screens/trial-summary-screen"
import { SiteUserProfile } from "@/components/clinical/screens/site-user-profile"

interface ResearchTeamDashboardProps {
  onNavigate: (screen: string) => void
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

const todayVisits = [
  { id: "V1", patient: "SUBJ-001", name: "Priya Krishnan", visit: "Visit 6", time: "9:00 AM", type: "Efficacy Assessment", done: false },
  { id: "V2", patient: "SUBJ-003", name: "Anita Patel", visit: "Visit 2", time: "11:30 AM", type: "Safety Follow-up", done: false },
  { id: "V3", patient: "SUBJ-004", name: "Vijay Sharma", visit: "Visit 5", time: "2:00 PM", type: "Lab & Vitals", done: true },
]

const overduePatients = [
  { id: "SUBJ-002", name: "Rahul Mehta", visit: "Visit 4", daysOverdue: 3, lastContact: "19 May" },
]

const pendingSubmissions = [
  { id: "eCRF-014", form: "Vital Signs", patient: "SUBJ-001", visit: "Visit 6", status: "Awaiting PI Review" },
  { id: "DEV-001", form: "Deviation Report", patient: "SUBJ-002", visit: "Visit 3", status: "Awaiting PI Sign-off" },
]

type PatientStatus = "on-track" | "overdue" | "completed" | "withdrawn"
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

const statusStyle: Record<string, { label: string; bg: string; text: string }> = {
  "on-track": { label: "On Track", bg: "bg-emerald-100", text: "text-emerald-700" },
  overdue:    { label: "Overdue",  bg: "bg-red-100",     text: "text-red-700" },
  completed:  { label: "Completed",bg: "bg-blue-100",    text: "text-blue-700" },
  withdrawn:  { label: "Withdrawn",bg: "bg-slate-100",   text: "text-slate-500" },
}

const priorityStyle: Record<string, { dot: string; badge: string; badgeText: string }> = {
  high:   { dot: "bg-red-500",   badge: "bg-red-100",   badgeText: "text-red-700" },
  medium: { dot: "bg-amber-400", badge: "bg-amber-100", badgeText: "text-amber-700" },
  low:    { dot: "bg-teal-400",  badge: "bg-teal-100",  badgeText: "text-teal-700" },
}

const categoryIcon: Record<string, React.FC<{ className?: string }>> = {
  visit: Calendar,
  ecrf: FileText,
  medication: Pill,
  screening: Users,
}

export function ResearchTeamDashboard({ onNavigate }: ResearchTeamDashboardProps) {
  const [activeTab, setActiveTab] = useState<CrcTab>("dashboard")
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("today")
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedTrial, setSelectedTrial] = useState<typeof crcTrials[0] | null>(null)
  const [showAllTrials, setShowAllTrials] = useState(false)
  const [showSponsors, setShowSponsors] = useState(false)
  // Patient visit updates
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [editPatient, setEditPatient] = useState<Patient | null>(null)
  const [viewPatient, setViewPatient] = useState<Patient | null>(null)
  const [form, setForm] = useState<{ visit: string; dateISO: string; status: PatientStatus; visitCompleted: boolean; note: string }>({
    visit: "", dateISO: "", status: "on-track", visitCompleted: false, note: "",
  })
  const [savedToast, setSavedToast] = useState<string | null>(null)

  const openVisitUpdate = (p: Patient) => {
    setForm({
      visit: p.visit,
      dateISO: p.dateISO,
      status: p.status,
      visitCompleted: p.visitCompleted ?? false,
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
        // When a visit is marked completed, log it into the history timeline.
        let history = p.history ?? []
        if (form.visitCompleted && form.visit) {
          const existing = history.find((v) => v.visit === form.visit)
          const entry: VisitRecord = {
            visit: form.visit,
            dateISO: form.dateISO,
            type: existing?.type ?? "Visit",
            outcome: "completed",
            note: form.note.trim() || existing?.note,
          }
          history = existing
            ? history.map((v) => (v.visit === form.visit ? entry : v))
            : [...history, entry]
        }
        return {
          ...p,
          visit: form.visit,
          dateISO: form.dateISO,
          status: form.status,
          visitCompleted: form.visitCompleted,
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
    Active: "bg-emerald-100 text-emerald-700",
    Completed: "bg-blue-100 text-blue-700",
    Terminated: "bg-red-100 text-red-700",
  }

  // One trial = one clickable panel → Trial Summary
  const TrialPanel = ({ tr }: { tr: typeof crcTrials[0] }) => (
    <button onClick={() => setSelectedTrial(tr)} className="w-full text-left bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{tr.id}</span>
        <div className="flex items-center gap-1.5">
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", trialStatusColor[tr.status] || "bg-slate-100 text-slate-600")}>{tr.status}</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
      <h4 className="font-semibold text-[#0F172A] text-sm mb-2">{tr.title}</h4>
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
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{f.label}</p>
            <p className="text-xs font-medium text-[#0F172A]">{f.val}</p>
          </div>
        ))}
      </div>
    </button>
  )

  const SponsorPanel = ({ sponsor }: { sponsor: typeof crcSponsors[0] }) => (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-[#2563EB]" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Sponsor Name</p>
          <h4 className="font-semibold text-[#0F172A] text-sm">{sponsor.name}</h4>
        </div>
      </div>
      <div className="space-y-2">
        {sponsor.trials.map(tr => (
          <button key={tr.id} onClick={() => setSelectedTrial(tr)} className="w-full text-left rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#2563EB]">{tr.id}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
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
                  <p className="text-[9px] text-slate-400 uppercase tracking-wide">{f.label}</p>
                  <p className="text-xs font-semibold text-[#0F172A]">{f.val}</p>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
  const [completedVisits, setCompletedVisits] = useState<Set<string>>(new Set(
    todayVisits.filter(v => v.done).map(v => v.id)
  ))

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const markVisitDone = (id: string) => {
    setCompletedVisits(prev => new Set([...prev, id]))
  }

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "today") return t.due === "Today" && !t.done
    if (taskFilter === "week") return (t.due !== "Overdue" && t.due !== "Today") && !t.done
    if (taskFilter === "overdue") return t.due === "Overdue" && !t.done
    if (taskFilter === "completed") return t.done
    return true
  })

  const todayTasksDone = tasks.filter(t => t.due === "Today" && t.done).length
  const todayTasksTotal = tasks.filter(t => t.due === "Today").length

  // ── Dashboard tab ────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="flex-1 overflow-auto pb-4 space-y-4 pt-4">
      {/* Hero */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-[#0D1B3E] via-[#1A3872] to-[#2563EB] rounded-2xl p-5 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-0.5 font-[family-name:var(--font-heading)]">Good morning, Meera</h2>
          <p className="text-blue-200 text-sm mb-4">CRC · Protocol-001 · Site 02</p>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-300 transition-all duration-500"
              style={{ width: `${todayTasksTotal > 0 ? (todayTasksDone / todayTasksTotal) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-blue-200">{todayTasksDone}/{todayTasksTotal} tasks done today</p>
        </div>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3">
        <button onClick={() => setShowAllTrials(true)} className="bg-white rounded-2xl border border-slate-100 p-4 text-left shadow-sm">
          <FileText className="w-5 h-5 text-[#2563EB] mb-2" />
          <p className="text-2xl font-bold text-[#0F172A]">{crcTrials.length}</p>
          <p className="text-xs text-slate-500">Total Trials</p>
        </button>
        <button onClick={() => setShowSponsors(true)} className="bg-white rounded-2xl border border-slate-100 p-4 text-left shadow-sm">
          <Building2 className="w-5 h-5 text-[#0D9488] mb-2" />
          <p className="text-2xl font-bold text-[#0F172A]">{crcSponsors.length}</p>
          <p className="text-xs text-slate-500">Sponsors</p>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-4">
        <h3 className="font-semibold text-[#0F172A] mb-2 font-[family-name:var(--font-heading)]">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onNavigate("add-trial")} className="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FilePlus2 className="w-5 h-5 text-[#2563EB]" />
            </div>
            <span className="text-xs font-medium text-[#0F172A] text-center leading-tight">New Trial</span>
          </button>
          <button onClick={() => onNavigate("add-patient")} className="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#0D9488]" />
            </div>
            <span className="text-xs font-medium text-[#0F172A] text-center leading-tight">Add Patient</span>
          </button>
          <button onClick={() => onNavigate("invite-patient")} className="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Send className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-[#0F172A] text-center leading-tight">Invite Patient</span>
          </button>
        </div>
      </div>

      {/* Trials Panel */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-[#0F172A] font-[family-name:var(--font-heading)]">My Trials</h3>
          <button onClick={() => setShowAllTrials(true)} className="text-[#2563EB] text-sm font-medium flex items-center gap-1">See All <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          {crcTrials.slice(0, 2).map(tr => <TrialPanel key={tr.id} tr={tr} />)}
        </div>
      </div>

      {/* My Tasks Today */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-[#0F172A] font-[family-name:var(--font-heading)]">My Tasks Today</h3>
          <button
            onClick={() => setActiveTab("tasks")}
            className="text-xs text-[#2563EB] font-medium flex items-center gap-0.5"
          >
            All Tasks <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2">
          {tasks.filter(t => t.due === "Today").map((task) => {
            const style = priorityStyle[task.priority]
            const Icon = categoryIcon[task.category]
            return (
              <div
                key={task.id}
                className={cn("bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3 transition-opacity", task.done && "opacity-50")}
              >
                <button onClick={() => toggleTask(task.id)} className="shrink-0">
                  {task.done
                    ? <CheckSquare className="w-5 h-5 text-teal-500" />
                    : <Square className="w-5 h-5 text-slate-300" />
                  }
                </button>
                <div className={cn("w-1 h-8 rounded-full shrink-0", style.dot)} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium text-[#0F172A]", task.done && "line-through text-slate-400")}>
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-400">{task.patient}</p>
                </div>
                <Icon className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Visits */}
      <div className="px-4">
        <h3 className="font-semibold text-[#0F172A] mb-2 font-[family-name:var(--font-heading)]">Today's Visits</h3>
        <div className="space-y-2">
          {todayVisits.map((visit) => {
            const done = completedVisits.has(visit.id)
            return (
              <div key={visit.id} className={cn("bg-white rounded-2xl p-4 shadow-sm border-l-4 transition-all", done ? "border-teal-400" : "border-[#2563EB]")}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0F172A] text-sm">{visit.name}</p>
                    <p className="text-xs text-slate-400">{visit.patient} · {visit.visit}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {visit.time}
                      </span>
                      <span className="text-xs text-slate-500">{visit.type}</span>
                    </div>
                  </div>
                  {done ? (
                    <div className="flex items-center gap-1 text-teal-600 text-xs font-medium">
                      <CheckCircle className="w-4 h-4" /> Done
                    </div>
                  ) : (
                    <button
                      onClick={() => markVisitDone(visit.id)}
                      className="bg-[#0D1B3E] text-white px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Overdue */}
      {overduePatients.length > 0 && (
        <div className="px-4">
          <h3 className="font-semibold text-[#0F172A] mb-2 font-[family-name:var(--font-heading)]">Overdue</h3>
          {overduePatients.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-red-400">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.id} · {p.visit}</p>
                  <p className="text-xs text-red-500 mt-1">{p.daysOverdue} days overdue · Last: {p.lastContact}</p>
                </div>
                <button className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Submissions */}
      <div className="px-4">
        <h3 className="font-semibold text-[#0F172A] mb-2 font-[family-name:var(--font-heading)]">Pending Submissions</h3>
        <div className="space-y-2">
          {pendingSubmissions.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A]">{item.id}: {item.form}</p>
                <p className="text-xs text-slate-400">{item.patient} · {item.visit}</p>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── Patients tab (operational) ───────────────────────────────────────────
  const renderPatients = () => (
    <div className="flex-1 overflow-auto pb-4 pt-4 px-4 space-y-2">
      <div className="flex gap-2 mb-1">
        <button
          onClick={() => onNavigate("add-patient")}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#0D1B3E] text-white py-2.5 rounded-xl text-xs font-semibold"
        >
          <UserPlus className="w-4 h-4" /> Add Patient
        </button>
        <button
          onClick={() => onNavigate("invite-patient")}
          className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold"
        >
          <Send className="w-4 h-4" /> Send Invite
        </button>
      </div>
      {patients.map((p) => {
        const style = statusStyle[p.status]
        return (
          <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-[#0F172A]">{p.name}</p>
                <p className="text-xs text-slate-400">{p.id} · Age {p.age}</p>
              </div>
              <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", style.bg, style.text)}>
                {style.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {visitLine(p)}
              </p>
              {p.visitCompleted && (
                <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Visit completed
                </span>
              )}
            </div>
            {p.note && (
              <p className="text-[11px] text-slate-400 mb-3 -mt-1">Remarks: {p.note}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => openVisitUpdate(p)}
                className="flex-1 bg-[#0D1B3E] text-white py-2 rounded-xl text-xs font-semibold"
              >
                Update Visit
              </button>
              <button
                onClick={() => setViewPatient(p)}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold"
              >
                View Record
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )

  // ── Tasks tab ────────────────────────────────────────────────────────────
  const renderTasks = () => (
    <div className="flex-1 overflow-auto pb-4 pt-4">
      {/* Filter pills */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto no-scrollbar">
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
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                taskFilter === f
                  ? "bg-[#0D1B3E] text-white"
                  : "bg-white text-slate-500 border border-slate-200"
              )}
            >
              {labels[f]} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          )
        })}
      </div>

      <div className="px-4 space-y-2">
        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center text-slate-400 text-sm shadow-sm">
            No tasks in this category
          </div>
        )}
        {filteredTasks.map((task) => {
          const style = priorityStyle[task.priority]
          const Icon = categoryIcon[task.category]
          return (
            <div
              key={task.id}
              className={cn("bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3", task.done && "opacity-60")}
            >
              <button onClick={() => toggleTask(task.id)} className="shrink-0">
                {task.done
                  ? <CheckSquare className="w-5 h-5 text-teal-500" />
                  : <Square className="w-5 h-5 text-slate-300" />
                }
              </button>
              <div className={cn("w-1 h-10 rounded-full shrink-0", style.dot)} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium text-[#0F172A]", task.done && "line-through text-slate-400")}>
                  {task.title}
                </p>
                <p className="text-xs text-slate-400">{task.patient}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", style.badge, style.badgeText)}>
                  {task.priority}
                </span>
                <span className={cn("text-[10px]", task.due === "Overdue" ? "text-red-500 font-medium" : "text-slate-400")}>
                  {task.due}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ── Profile / Me tab ─────────────────────────────────────────────────────
  const renderMe = () => (
    <SiteUserProfile
      user={{
        initials: "MC",
        avatarColor: "bg-[#0D9488]",
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

  // ── Trial Detail → Trial Summary page (CRC view) ─────────
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
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowAllTrials(false)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">Total Trials</span>
          <button onClick={() => onNavigate("add-trial")} className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 text-xs font-semibold">
            Add Trial
          </button>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
          {crcTrials.map(tr => <TrialPanel key={tr.id} tr={tr} />)}
        </div>
      </div>
    )
  }

  if (showSponsors) {
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowSponsors(false)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">Sponsors</span>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
          {crcSponsors.map(sponsor => <SponsorPanel key={sponsor.name} sponsor={sponsor} />)}
        </div>
      </div>
    )
  }

  // ── Patient Record (read-only) ───────────────────────────
  if (viewPatient) {
    const p = viewPatient
    const style = statusStyle[p.status]
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="bg-[#0D1B3E] text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setViewPatient(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">Patient Record</span>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
          {/* Identity card */}
          <div className="bg-[#0D1B3E] rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold">{p.name}</h2>
                <p className="text-blue-200 text-sm">{p.id} · Age {p.age}</p>
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
                  <p className="text-[10px] text-blue-200/80 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm font-medium">{f.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Remarks</p>
            <p className="text-sm text-[#0F172A]">{p.note?.trim() ? p.note : "No remarks recorded yet."}</p>
          </div>

          {/* Visit history */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#0F172A] text-sm font-[family-name:var(--font-heading)]">Visit History</h3>
              <span className="text-xs text-slate-400">
                {(p.history ?? []).filter(v => v.outcome === "completed").length} completed
              </span>
            </div>
            {(p.history && p.history.length > 0) ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="relative pl-6">
                  {/* vertical line */}
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
                  <div className="space-y-4">
                    {[...p.history].sort((a, b) => b.dateISO.localeCompare(a.dateISO)).map((v, i) => {
                      const oc = {
                        completed: { Icon: CheckCircle, color: "text-teal-500", label: "Completed", badge: "bg-teal-100 text-teal-700" },
                        missed:    { Icon: AlertTriangle, color: "text-red-500", label: "Missed", badge: "bg-red-100 text-red-700" },
                        scheduled: { Icon: Clock, color: "text-blue-500", label: "Scheduled", badge: "bg-blue-100 text-blue-700" },
                      }[v.outcome]
                      const Icon = oc.Icon
                      return (
                        <div key={`${v.visit}-${i}`} className="relative">
                          <div className="absolute -left-6 top-0.5 bg-white">
                            <Icon className={cn("w-3.5 h-3.5", oc.color)} />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-[#0F172A]">{v.visit}</p>
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0", oc.badge)}>{oc.label}</span>
                          </div>
                          <p className="text-xs text-slate-500">{v.type}</p>
                          <p className="text-[11px] text-slate-400">
                            {v.dateISO ? new Date(v.dateISO + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </p>
                          {v.note && <p className="text-[11px] text-slate-500 mt-0.5 italic">“{v.note}”</p>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center text-sm text-slate-400">
                No visits recorded yet.
              </div>
            )}
          </div>

          <button
            onClick={() => { setViewPatient(null); openVisitUpdate(p) }}
            className="w-full bg-[#0D1B3E] text-white py-3 rounded-xl text-sm font-semibold"
          >
            Update Visit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] relative">
      <AppBar
        title="Research Team"
        subtitle="Meera · CRC · Protocol-001"
        notificationCount={2}
        onNotificationClick={() => onNavigate("notifications")}
        avatar="MC"
        onAvatarClick={() => setActiveTab("me")}
      />

      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "patients" && renderPatients()}
      {activeTab === "notifs" && (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Notifications coming soon
        </div>
      )}
      {activeTab === "me" && renderMe()}

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
        <div className="absolute inset-0 z-30 flex items-end" onClick={() => setEditPatient(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full bg-white rounded-t-3xl p-5 max-h-[85%] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#0F172A] text-base font-[family-name:var(--font-heading)]">Update Visit</h3>
                <p className="text-xs text-slate-400">{editPatient.name} · {editPatient.id}</p>
              </div>
              <button onClick={() => setEditPatient(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Visit + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Visit</label>
                  <input
                    type="text"
                    value={form.visit}
                    onChange={(e) => setForm({ ...form, visit: e.target.value })}
                    placeholder="e.g. Visit 7"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Visit Date</label>
                  <input
                    type="date"
                    value={form.dateISO}
                    onChange={(e) => setForm({ ...form, dateISO: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Visit completed toggle */}
              <button
                type="button"
                onClick={() => setForm({ ...form, visitCompleted: !form.visitCompleted })}
                className="w-full flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5"
              >
                {form.visitCompleted
                  ? <CheckSquare className="w-5 h-5 text-teal-500 shrink-0" />
                  : <Square className="w-5 h-5 text-slate-300 shrink-0" />}
                <span className="text-sm font-medium text-[#0F172A]">Visit completed</span>
              </button>

              {/* Status */}
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Patient status in trial</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["on-track", "overdue", "completed", "withdrawn"] as PatientStatus[]).map((s) => {
                    const st = statusStyle[s]
                    const active = form.status === s
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, status: s })}
                        className={cn(
                          "py-2 rounded-xl text-xs font-semibold border transition-colors",
                          active ? cn(st.bg, st.text, "border-transparent") : "bg-white text-slate-500 border-slate-200",
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
                <label className="text-xs font-medium text-slate-500 mb-1 block">Remarks</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  placeholder="Add any notes about the patient or this visit…"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-[#0F172A] resize-none focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditPatient(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={saveVisitUpdate}
                  className="flex-1 py-3 rounded-xl bg-[#0D1B3E] text-white text-sm font-semibold"
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
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 bg-[#0F172A] text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-400" />
          {savedToast}
        </div>
      )}
    </div>
  )
}
