"use client"

import { useState } from "react"
import {
  ChevronLeft, ChevronRight, Check, Clock, Pill, CheckCircle,
  Phone, Home, Building2, Calendar, Sparkles, Stethoscope, Layers,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "../../bottom-nav"

interface MyTrialScreenProps {
  onNavigate: (screen: string) => void
}

interface TrialVisit {
  num: number
  name: string
  /** Scheduled (planned) date for the visit. */
  date: string
  status: "completed" | "upcoming" | "scheduled"
  type: string
  /** Allowed visit window around the scheduled date. */
  window: string
  /** Date the visit actually took place (completed visits only). */
  actualDate?: string
}

const visits: TrialVisit[] = [
  { num: 1, name: "Screening", date: "3 Mar 2025", status: "completed", type: "Hospital", window: "1–5 Mar 2025", actualDate: "3 Mar 2025" },
  { num: 2, name: "Baseline", date: "10 Mar 2025", status: "completed", type: "Hospital", window: "8–12 Mar 2025", actualDate: "11 Mar 2025" },
  { num: 3, name: "Week 2", date: "24 Mar 2025", status: "completed", type: "Hospital", window: "22–26 Mar 2025", actualDate: "24 Mar 2025" },
  { num: 4, name: "Week 4", date: "7 Apr 2025", status: "completed", type: "Hospital", window: "5–9 Apr 2025", actualDate: "7 Apr 2025" },
  { num: 5, name: "Week 8", date: "5 May 2025", status: "completed", type: "Hospital", window: "3–7 May 2025", actualDate: "6 May 2025" },
  { num: 6, name: "Week 12", date: "19 May 2025", status: "completed", type: "Hospital", window: "17–21 May 2025", actualDate: "19 May 2025" },
  { num: 7, name: "Week 14 Follow-Up", date: "23 May 2025", status: "upcoming", type: "Hospital", window: "20–26 May 2025" },
  { num: 8, name: "Week 16 Check-In", date: "9 Jun 2025", status: "scheduled", type: "Hospital", window: "7–11 Jun 2025" },
  { num: 9, name: "Week 20 Check-In", date: "7 Jul 2025", status: "scheduled", type: "Telephonic", window: "5–9 Jul 2025" },
  { num: 10, name: "End of Trial", date: "18 Aug 2025", status: "scheduled", type: "Hospital", window: "16–20 Aug 2025" },
]

type MedStatus = "taken" | "pending" | "notTaken" | "skipped"

interface Medication {
  id: string
  name: string
  dosage: string
  time: string
  status: MedStatus
  takenAt?: string
}

const initialMeds: Medication[] = [
  { id: "m1", name: "Metformin", dosage: "500mg", time: "8:00 AM", status: "taken", takenAt: "8:03 AM" },
  { id: "m2", name: "Aspirin", dosage: "75mg", time: "2:00 PM", status: "pending" },
  { id: "m3", name: "Metformin", dosage: "500mg", time: "8:00 PM", status: "pending" },
]

const medHistory = [
  {
    date: "25 May 2025", meds: [
      { name: "Metformin 500mg", time: "8:00 AM", status: "taken" },
      { name: "Aspirin 75mg", time: "2:00 PM", status: "taken" },
      { name: "Metformin 500mg", time: "8:00 PM", status: "taken" },
    ]
  },
  {
    date: "24 May 2025", meds: [
      { name: "Metformin 500mg", time: "8:00 AM", status: "taken" },
      { name: "Aspirin 75mg", time: "2:00 PM", status: "skipped" },
      { name: "Metformin 500mg", time: "8:00 PM", status: "taken" },
    ]
  },
]

const heatmapData = [
  { week: "Wk 1", days: ["taken", "taken", "taken", "taken", "missed", "taken", "taken"] },
  { week: "Wk 2", days: ["taken", "taken", "taken", "taken", "taken", "taken", "taken"] },
  { week: "Wk 3", days: ["taken", "taken", "taken", "taken", "taken", "taken", "taken"] },
  { week: "Wk 4", days: ["taken", "taken", "taken", "taken", "taken", "taken", "future"] },
]

const TYPE_ICON: Record<string, LucideIcon> = {
  Hospital: Building2,
  Telephonic: Phone,
  Home: Home,
}

function getMedBadge(status: string) {
  switch (status) {
    case "taken": return "bg-success/15 text-success"
    case "notTaken": return "bg-destructive/10 text-destructive"
    case "skipped": return "bg-warning/15 text-warning"
    default: return "bg-muted text-muted-foreground"
  }
}

export function MyTrialScreen({ onNavigate }: MyTrialScreenProps) {
  const [activeTab, setActiveTab] = useState("my-trial")
  const [innerTab, setInnerTab] = useState<"visits" | "medications" | "progress">("visits")
  const [medTab, setMedTab] = useState<"today" | "schedule" | "history">("today")
  const [medications, setMedications] = useState<Medication[]>(initialMeds)
  const [expandedMed, setExpandedMed] = useState<string | null>(null)
  const [selectedVisit, setSelectedVisit] = useState<typeof visits[0] | null>(null)

  const takenCount = medications.filter(m => m.status === "taken").length
  const allMedsDone = takenCount === medications.length
  const completedVisits = visits.filter(v => v.status === "completed").length
  const nextVisit = visits.find(v => v.status === "upcoming")
  const journeyPct = Math.round((completedVisits / visits.length) * 100)

  const handleMedAction = (id: string, action: MedStatus) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    setMedications(prev => prev.map(m =>
      m.id === id ? { ...m, status: action, takenAt: action === "taken" ? timeStr : undefined } : m
    ))
  }

  // ── Visit Detail sub-screen ──────────────────────────────────────────────
  if (selectedVisit) {
    const TypeIcon = TYPE_ICON[selectedVisit.type] ?? Building2
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-primary-foreground px-4 py-3.5 flex items-center gap-3 dawn-ambient">
          <button
            onClick={() => setSelectedVisit(null)}
            aria-label="Back to My Trial"
            className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <p className="eyebrow text-primary-foreground/55">My Trial · Protocol-001</p>
            <h1 className="font-heading text-lg leading-tight">Visit {selectedVisit.num} Details</h1>
          </div>
        </div>

        <div className="flex-1 overflow-auto pb-6 space-y-4 p-4">
          {/* Hero — the dawn gesture */}
          <div className="hero-glow paper-grain dawn-gradient text-primary-foreground rounded-3xl p-5 shadow-md animate-rise" style={{ animationDelay: "60ms" }}>
            <div className="relative flex items-center justify-between mb-2">
              <p className="eyebrow text-white/80">Protocol-001</p>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/22 backdrop-blur-sm">
                {selectedVisit.status === "upcoming" ? "Upcoming" : selectedVisit.status === "completed" ? "Completed ✓" : "Scheduled"}
              </span>
            </div>
            <h2 className="relative display-serif text-xl mb-3">Visit {selectedVisit.num} · {selectedVisit.name}</h2>
            <div className="relative grid grid-cols-2 gap-x-3 gap-y-3">
              {[
                { icon: Calendar, label: "Scheduled", value: selectedVisit.date },
                { icon: Clock, label: "Window", value: selectedVisit.window },
                { icon: CheckCircle, label: "Actual date", value: selectedVisit.actualDate ?? "Awaiting visit" },
                { icon: TypeIcon, label: "Visit type", value: selectedVisit.type },
              ].map((r) => {
                const RowIcon = r.icon
                return (
                  <div key={r.label} className="flex items-center gap-2 min-w-0">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/18 backdrop-blur-sm">
                      <RowIcon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-white/65 leading-none">{r.label}</p>
                      <p className="text-sm font-medium leading-tight truncate">{r.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="relative mt-3 pt-3 border-t border-white/20 text-sm text-white/85 inline-flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4" /> AIIMS Delhi · Dr. Sharma
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
            <p className="eyebrow text-muted-foreground mb-3">Before you come in</p>
            <ul className="space-y-2.5">
              {["Fast for 8 hours before visit", "Bring your patient ID card", "Wear comfortable clothing"].map((inst, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/12 text-accent text-[11px] font-bold">{i + 1}</span>
                  {inst}
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical tasks */}
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
            <p className="eyebrow text-muted-foreground mb-3">Clinical tasks</p>
            <div className="space-y-2.5">
              {["Vital signs", "Blood draw", "ECG"].map((task, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md border-2 border-border" />
                  <span className="text-sm text-muted-foreground">{task}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/70 mt-3">Tasks are managed by the research team</p>
          </div>

          {selectedVisit.status === "completed" && (
            <div className="flex items-center gap-2 rounded-2xl border border-success/25 bg-success/8 p-4 text-sm text-success">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Completed on {selectedVisit.date} · Confirmed by Dr. Sharma
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={() => onNavigate("chat")}
              className="springy w-full bg-primary text-primary-foreground rounded-full py-3.5 font-semibold text-sm shadow-md transition-colors hover:bg-primary-deep active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Contact PI
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main hub ─────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
        <div className="relative flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-primary-foreground/55 mb-0.5">Protocol-001 · Dr. Sharma</p>
            <h1 className="display-serif text-xl leading-tight">My Trial</h1>
          </div>
          <button
            onClick={() => onNavigate("my-visits")}
            className="springy shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-white/25 active:scale-95"
          >
            <Layers className="h-3.5 w-3.5" /> All trials
          </button>
        </div>
      </div>

      {/* Persistent journey snapshot */}
      <div className="px-4 pt-4">
        <div className="dawn-gradient hero-glow paper-grain rounded-2xl p-4 text-primary-foreground shadow-sm animate-rise" style={{ animationDelay: "40ms" }}>
          <div className="relative flex items-center justify-between">
            <p className="eyebrow text-white/80">Your journey</p>
            <span className="font-mono text-sm tabular-nums">{journeyPct}%</span>
          </div>
          <div className="relative mt-2 h-2 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full rounded-full bg-white animate-fill-bar" style={{ width: `${journeyPct}%` }} />
          </div>
          <div className="relative mt-2 flex items-center justify-between text-xs text-white/85">
            <span>{completedVisits} of {visits.length} visits done</span>
            {nextVisit && <span>Next · {nextVisit.name}</span>}
          </div>
        </div>
      </div>

      {/* Inner tabs */}
      <div className="px-4 pt-3">
        <div className="flex rounded-full bg-muted p-1">
          {(["visits", "medications", "progress"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setInnerTab(tab)}
              className={cn(
                "flex-1 rounded-full py-2 text-sm font-medium capitalize transition-all",
                innerTab === tab ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-4">
        {/* ===== VISITS TAB — the trial as a path ===== */}
        {innerTab === "visits" && (
          <div className="px-4 py-4">
            <p className="eyebrow text-muted-foreground mb-3">The road ahead</p>
            <div className="relative">
              {visits.map((v, i) => {
                const TypeIcon = TYPE_ICON[v.type] ?? Building2
                const isLast = i === visits.length - 1
                const done = v.status === "completed"
                const isNext = v.status === "upcoming"
                return (
                  <button
                    key={v.num}
                    onClick={() => setSelectedVisit(v)}
                    className="group relative flex w-full items-stretch gap-3 text-left pb-3 last:pb-0"
                  >
                    {/* spine + node */}
                    <div className="relative flex w-7 shrink-0 flex-col items-center">
                      {!isLast && (
                        <span
                          className={cn(
                            "absolute top-7 bottom-[-12px] w-[2px] rounded-full",
                            done ? "bg-accent" : "bg-border"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 grid h-7 w-7 place-items-center rounded-full ring-4 ring-surface transition-transform group-active:scale-90",
                          done ? "bg-accent text-accent-foreground"
                            : isNext ? "bg-warning text-warning-foreground animate-pulse-soft"
                            : "border-2 border-border bg-card text-muted-foreground"
                        )}
                      >
                        {done ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold tabular-nums">{v.num}</span>}
                      </span>
                    </div>

                    {/* card */}
                    <div
                      className={cn(
                        "flex-1 min-w-0 rounded-2xl border bg-card p-3.5 shadow-xs transition-all group-hover:shadow-sm",
                        isNext ? "border-warning/40 bg-warning/5" : "border-border"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-foreground text-sm truncate">
                          Visit {v.num} · {v.name}
                        </p>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            done ? "bg-accent/12 text-accent"
                              : isNext ? "bg-warning/15 text-warning"
                              : "bg-info/10 text-info"
                          )}
                        >
                          {done ? "Done" : isNext ? "Next →" : "Scheduled"}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {v.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <TypeIcon className="h-3 w-3" /> {v.type}
                        </span>
                      </div>
                      <p className={cn("mt-1 text-xs", isNext ? "text-warning" : "text-muted-foreground")}>Window: {v.window}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ===== MEDICATIONS TAB ===== */}
        {innerTab === "medications" && (
          <div className="px-4 py-4 space-y-4">
            {/* Today summary */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <p className="eyebrow text-muted-foreground mb-2.5">Today&apos;s medications</p>
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-1.5">
                  {medications.map(m => (
                    <span key={m.id} className={cn("h-2.5 flex-1 rounded-full", m.status === "taken" ? "bg-success" : m.status === "pending" ? "bg-border" : getMedBadge(m.status).split(" ")[0])} />
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {allMedsDone ? "All done ✓" : `${takenCount}/${medications.length}`}
                </span>
              </div>
            </div>

            {/* Med sub-tabs */}
            <div className="flex rounded-full bg-muted p-1">
              {(["today", "schedule", "history"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setMedTab(t)}
                  className={cn(
                    "flex-1 rounded-full py-1.5 text-xs font-medium capitalize transition-all",
                    medTab === t ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* TODAY */}
            {medTab === "today" && (
              <div className="space-y-3">
                <p className="eyebrow text-muted-foreground">
                  Today · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                {allMedsDone ? (
                  <div className="rounded-2xl border border-success/25 bg-success/8 p-5 text-center">
                    <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-success/15">
                      <Sparkles className="h-6 w-6 text-success" />
                    </div>
                    <p className="font-heading text-foreground">All medications done for today!</p>
                    <p className="text-sm text-muted-foreground">No more doses required · great job keeping up 💪</p>
                  </div>
                ) : (
                  medications.map((med) => {
                    const settled = med.status !== "pending"
                    return (
                      <div
                        key={med.id}
                        className={cn(
                          "rounded-2xl border p-4 shadow-xs",
                          med.status === "taken" ? "border-success/20 bg-success/8"
                            : med.status === "notTaken" ? "border-destructive/20 bg-destructive/5"
                            : med.status === "skipped" ? "border-warning/20 bg-warning/8"
                            : "border-border bg-card"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/60">
                            <Pill className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={cn("font-medium text-foreground", settled && "text-muted-foreground")}>
                                {med.name} {med.dosage}
                              </p>
                              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", getMedBadge(med.status))}>
                                {med.status === "taken" ? "Taken ✓" : med.status === "notTaken" ? "Not taken" : med.status === "skipped" ? "Skipped" : "Pending"}
                              </span>
                            </div>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" /> {med.time}
                              {med.status === "taken" && med.takenAt && (
                                <span className="text-success">· logged {med.takenAt}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        {med.status === "pending" && (
                          <div className="mt-3 flex gap-2 border-t border-border pt-3">
                            <button
                              onClick={() => handleMedAction(med.id, "taken")}
                              className="springy flex-1 rounded-xl bg-success py-2 text-xs font-semibold text-success-foreground active:scale-[0.97]"
                            >
                              ✓ Taken
                            </button>
                            <button
                              onClick={() => handleMedAction(med.id, "notTaken")}
                              className="springy flex-1 rounded-xl border border-destructive/40 py-2 text-xs font-semibold text-destructive active:scale-[0.97]"
                            >
                              ✗ Not taken
                            </button>
                            <button
                              onClick={() => handleMedAction(med.id, "skipped")}
                              className="springy flex-1 rounded-xl border border-warning/40 py-2 text-xs font-semibold text-warning active:scale-[0.97]"
                            >
                              Skip
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {/* SCHEDULE */}
            {medTab === "schedule" && (
              <div className="space-y-3">
                {[
                  { name: "Metformin", dosage: "500mg", form: "Oral tablet", freq: "Twice daily: 8:00 AM & 8:00 PM", instruction: "Take with food", period: "1 Mar 2025 – 18 Aug 2025" },
                  { name: "Aspirin", dosage: "75mg", form: "Oral tablet", freq: "Once daily: 2:00 PM", instruction: "Take after meals", period: "1 Mar 2025 – 18 Aug 2025" },
                ].map((m, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card shadow-xs">
                    <button
                      className="flex w-full items-center justify-between p-4"
                      onClick={() => setExpandedMed(expandedMed === m.name ? null : m.name)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary/60">
                          <Pill className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-semibold text-foreground">{m.name} {m.dosage}</p>
                      </div>
                      <ChevronRight className={cn("h-5 w-5 text-muted-foreground/60 transition-transform", expandedMed === m.name && "rotate-90")} />
                    </button>
                    {expandedMed === m.name && (
                      <div className="space-y-1.5 border-t border-border px-4 py-3 text-sm text-muted-foreground">
                        <p>{m.dosage} · {m.form}</p>
                        <p>{m.freq}</p>
                        <p>Instructions: {m.instruction}</p>
                        <p className="text-xs text-muted-foreground/70">Period: {m.period}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* HISTORY */}
            {medTab === "history" && (
              <div className="space-y-4">
                {medHistory.map((day, i) => (
                  <div key={i}>
                    <p className="eyebrow text-muted-foreground mb-2">{day.date}</p>
                    <div className="divide-y divide-border/60 rounded-2xl border border-border bg-card shadow-xs">
                      {day.meds.map((m, j) => (
                        <div key={j} className="flex items-center justify-between px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.time}</p>
                          </div>
                          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", getMedBadge(m.status))}>
                            {m.status === "taken" ? "Taken ✓" : m.status === "skipped" ? "Skipped" : "Not taken"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PROGRESS TAB ===== */}
        {innerTab === "progress" && (
          <div className="px-4 py-4 space-y-4">
            {/* stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "6", label: "Completed", color: "text-accent", bg: "bg-accent/6 border-accent/20" },
                { value: "1", label: "Upcoming", color: "text-warning", bg: "bg-warning/8 border-warning/20" },
                { value: "3", label: "Remaining", color: "text-foreground/70", bg: "bg-card border-border" },
                { value: "93%", label: "Med. rate", color: "text-info", bg: "bg-info/6 border-info/20" },
              ].map((s, i) => (
                <div key={i} className={cn("rounded-2xl border p-4 text-center shadow-xs", s.bg)}>
                  <p className={cn("font-heading text-3xl tabular-nums", s.color)}>{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* visit completion */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <p className="text-sm font-semibold text-foreground mb-2">Visit completion</p>
              <div className="mb-1 h-2.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-accent animate-fill-bar" style={{ width: "60%" }} />
              </div>
              <p className="text-xs text-muted-foreground">6 of 10 visits complete (60%)</p>
            </div>

            {/* adherence */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Medication adherence · this week</p>
                <span className="text-xs font-semibold text-success">Excellent!</span>
              </div>
              <div className="mb-1 h-2.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-info animate-fill-bar" style={{ width: "93%" }} />
              </div>
              <p className="text-xs text-muted-foreground">13 of 14 doses (93%)</p>
            </div>

            {/* timeline */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <p className="text-sm font-semibold text-foreground mb-3">Study timeline</p>
              <div className="mb-4 space-y-1 text-sm">
                {[
                  ["Started", "3 Mar 2025"],
                  ["Current", "Week 12 of 24"],
                  ["Estimated end", "18 Aug 2025"],
                ].map(([k, val]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-foreground">{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className={cn("h-2.5 w-2.5 rounded-full", i < 12 ? "bg-accent" : "bg-border")} />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">50% through the study</p>
            </div>

            {/* heatmap */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <p className="text-sm font-semibold text-foreground mb-3">Medication heatmap · last 4 weeks</p>
              <div className="overflow-x-auto">
                <div className="min-w-[240px]">
                  <div className="mb-1 ml-10 flex gap-1">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} className="w-7 text-center text-[10px] font-semibold text-muted-foreground/70">{d}</div>
                    ))}
                  </div>
                  {heatmapData.map((week, wi) => (
                    <div key={wi} className="mb-1 flex items-center gap-1">
                      <span className="w-9 shrink-0 text-[10px] text-muted-foreground/70">{week.week}</span>
                      {week.days.map((d, di) => (
                        <div
                          key={di}
                          className={cn(
                            "grid h-7 w-7 place-items-center rounded text-[10px] font-bold",
                            d === "taken" && "bg-accent/12 text-accent",
                            d === "missed" && "bg-destructive/10 text-destructive",
                            d === "future" && "bg-muted text-muted-foreground/40"
                          )}
                        >
                          {d === "taken" ? "✓" : d === "missed" ? "✗" : "–"}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav
        activeTab={activeTab}
        role="patient"
        notificationCount={2}
        onTabChange={(tab) => {
          setActiveTab(tab)
          if (tab === "dashboard") onNavigate("patient-dashboard")
          if (tab === "chat") onNavigate("chat")
          if (tab === "calendar") onNavigate("patient-calendar")
          if (tab === "me") onNavigate("profile-settings")
        }}
      />
    </div>
  )
}
