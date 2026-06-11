"use client"

import { useState } from "react"
import {
  Building2, Phone, ChevronRight, Check, Clock, Pill, CheckCircle,
  X, SkipForward, AlarmClock, TrendingUp, FlaskConical
} from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "../../bottom-nav"

interface MyTrialScreenProps {
  onNavigate: (screen: string) => void
}

const visits = [
  { num: 1, name: "Screening", date: "3 Mar 2025", status: "completed", type: "Hospital" },
  { num: 2, name: "Baseline", date: "10 Mar 2025", status: "completed", type: "Hospital" },
  { num: 3, name: "Week 2", date: "24 Mar 2025", status: "completed", type: "Hospital" },
  { num: 4, name: "Week 4", date: "7 Apr 2025", status: "completed", type: "Hospital" },
  { num: 5, name: "Week 8", date: "5 May 2025", status: "completed", type: "Hospital" },
  { num: 6, name: "Week 12", date: "19 May 2025", status: "completed", type: "Hospital" },
  { num: 7, name: "Week 14 Follow-Up", date: "23 May 2025", status: "upcoming", type: "Hospital", window: "20–26 May" },
  { num: 8, name: "Week 16 Check-In", date: "9 Jun 2025", status: "scheduled", type: "Hospital" },
  { num: 9, name: "Week 20 Check-In", date: "7 Jul 2025", status: "scheduled", type: "Telephonic" },
  { num: 10, name: "End of Trial", date: "18 Aug 2025", status: "scheduled", type: "Hospital" },
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

function getDotClass(status: string) {
  switch (status) {
    case "completed": return "w-3 h-3 rounded-full bg-accent"
    case "upcoming": return "w-3 h-3 rounded-full bg-warning"
    case "missed": return "w-3 h-3 rounded-full bg-destructive"
    default: return "w-3 h-3 rounded-full border-2 border-border bg-card"
  }
}

function getBadgeClass(status: string) {
  switch (status) {
    case "completed": return "bg-accent/10 text-accent"
    case "upcoming": return "bg-warning/15 text-warning"
    case "missed": return "bg-destructive/10 text-destructive"
    default: return "bg-info/10 text-info"
  }
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

  const handleMedAction = (id: string, action: MedStatus) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    setMedications(prev => prev.map(m =>
      m.id === id ? { ...m, status: action, takenAt: action === "taken" ? timeStr : undefined } : m
    ))
  }

  // Visit Detail screen
  if (selectedVisit) {
    const color = selectedVisit.status === "completed" ? "teal" : selectedVisit.status === "upcoming" ? "amber" : "blue"
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedVisit(null)} className="text-white p-1">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <p className="text-xs text-blue-300">← My Trial</p>
            <h1 className="font-semibold text-lg">Visit {selectedVisit.num} Details</h1>
          </div>
        </div>
        <div className="flex-1 overflow-auto pb-6 space-y-4 p-4">
          {/* Hero card */}
          <div className="hero-glow bg-gradient-to-br from-primary-deep via-primary to-info/80 text-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-300 text-sm">Protocol-001</p>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                color === "teal" && "bg-teal-200 text-teal-800",
                color === "amber" && "bg-amber-200 text-warning",
                color === "blue" && "bg-blue-200 text-blue-800"
              )}>
                {selectedVisit.status === "upcoming" ? "Upcoming" : selectedVisit.status === "completed" ? "Completed ✓" : "Scheduled"}
              </span>
            </div>
            <h2 className="font-bold text-lg mb-1">Visit {selectedVisit.num} · {selectedVisit.name}</h2>
            <p className="text-primary-foreground/75 text-sm mb-1">📅 {selectedVisit.date}</p>
            {selectedVisit.window && <p className="text-primary-foreground/75 text-sm">🪟 Window: {selectedVisit.window}</p>}
            <p className="text-primary-foreground/75 text-sm">🏥 AIIMS Delhi · Dr. Sharma</p>
          </div>

          {/* Instructions */}
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
            <h3 className="font-semibold text-foreground mb-3">Instructions</h3>
            <ul className="space-y-2">
              {["Fast for 8 hours before visit", "Bring your patient ID card", "Wear comfortable clothing"].map((inst, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-accent mt-0.5">•</span>
                  {inst}
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical tasks */}
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
            <h3 className="font-semibold text-foreground mb-3">Clinical Tasks</h3>
            <div className="space-y-2 opacity-60">
              {["Vital signs", "Blood draw", "ECG"].map((task, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border-2 border-border" />
                  <span className="text-sm text-muted-foreground">{task}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/70 mt-2">Tasks are managed by the research team</p>
          </div>

          {selectedVisit.status === "completed" && (
            <div className="bg-accent/5 rounded-2xl border border-accent/20 p-4 text-sm text-accent">
              ✓ Completed on {selectedVisit.date} · Confirmed by Dr. Sharma
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate("chat")}
              className="w-full bg-info text-white rounded-xl py-3 font-semibold text-sm"
            >
              Contact PI
            </button>
            {selectedVisit.type === "Hospital" && (
              <button className="w-full border-2 border-info text-info rounded-xl py-3 font-semibold text-sm">
                Get Directions
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="bg-primary-deep text-white px-4 py-3">
        <h1 className="font-bold text-xl font-[family-name:var(--font-heading)]">My Trial</h1>
        <p className="text-blue-300 text-xs mt-0.5">Protocol-001 · Dr. Sharma</p>
      </div>

      {/* Inner tabs */}
      <div className="px-4 py-3 bg-card border-b border-border">
        <div className="flex gap-2">
          {(["visits", "medications", "progress"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setInnerTab(tab)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                innerTab === tab ? "bg-primary-deep text-white" : "bg-card border border-border text-muted-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-4">
        {/* ===== VISITS TAB ===== */}
        {innerTab === "visits" && (
          <div className="px-4 py-4 space-y-4">
            {/* Progress card */}
            <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-foreground text-sm">Your progress · Visit 6 of 10</p>
                <span className="text-sm font-bold text-accent">60%</span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full bg-accent rounded-full" style={{ width: "60%" }} />
              </div>
              <p className="text-xs text-muted-foreground text-right">6 done · 4 left</p>
            </div>

            {/* All visits list */}
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">All Visits</p>
            <div className="space-y-2">
              {visits.map((v) => (
                <button
                  key={v.num}
                  onClick={() => setSelectedVisit(v)}
                  className={cn(
                    "w-full bg-card rounded-xl p-4 border text-left shadow-sm flex items-center gap-3",
                    v.status === "upcoming" && "bg-warning/10 border-l-4 border-amber-400",
                    v.status === "missed" && "bg-destructive/5 border-l-4 border-red-400",
                    v.status !== "upcoming" && v.status !== "missed" && "border-border"
                  )}
                >
                  <div className={getDotClass(v.status)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground text-sm truncate">
                        Visit {v.num} · {v.name}
                      </p>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold ml-2 shrink-0", getBadgeClass(v.status))}>
                        {v.status === "completed" ? "Done ✓" : v.status === "upcoming" ? "Next →" : v.status === "missed" ? "Missed" : "Scheduled"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {v.date} · {v.type === "Hospital" ? "🏥" : v.type === "Telephonic" ? "📞" : "🏠"} {v.type}
                    </p>
                    {v.window && (
                      <p className="text-xs text-warning mt-0.5">Window: {v.window}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/70 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== MEDICATIONS TAB ===== */}
        {innerTab === "medications" && (
          <div className="px-4 py-4 space-y-4">
            {/* Today summary card */}
            <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
              <p className="font-semibold text-foreground mb-3">Today's Medications</p>
              <div className="flex items-center gap-2">
                {medications.map(m => (
                  <div
                    key={m.id}
                    className={cn("w-3 h-3 rounded-full", m.status === "taken" ? "bg-accent" : "bg-border")}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  {allMedsDone ? "All done ✓" : `${takenCount} of ${medications.length} taken`}
                </span>
              </div>
            </div>

            {/* Med inner tabs */}
            <div className="flex gap-2">
              {(["today", "schedule", "history"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setMedTab(t)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                    medTab === t ? "bg-primary-deep text-white" : "bg-card border border-border text-muted-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* TODAY tab */}
            {medTab === "today" && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                  Today · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                {allMedsDone ? (
                  <div className="bg-success/10 rounded-2xl border-l-4 border-accent p-5 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-success/15 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle className="w-6 h-6 text-accent" />
                    </div>
                    <p className="font-semibold text-foreground mb-1">All medications done for today!</p>
                    <p className="text-sm text-muted-foreground">No more doses required</p>
                    <p className="text-sm text-muted-foreground">Great job keeping up 💪</p>
                  </div>
                ) : (
                  medications.map((med) => (
                    <div
                      key={med.id}
                      className={cn(
                        "rounded-2xl p-4 border shadow-sm",
                        med.status === "taken" ? "bg-success/10 border-success/20" :
                        med.status === "notTaken" ? "bg-destructive/5 border-destructive/20" :
                        med.status === "skipped" ? "bg-warning/10 border-warning/20" :
                        "bg-warning/10 border-warning/20"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <Pill className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={cn("font-medium text-foreground", (med.status === "taken" || med.status === "notTaken" || med.status === "skipped") && "text-muted-foreground")}>
                              {med.name} {med.dosage}
                            </p>
                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", getMedBadge(med.status))}>
                              {med.status === "taken" ? "Taken ✓" : med.status === "notTaken" ? "Not Taken" : med.status === "skipped" ? "Skipped" : "Pending"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {med.time}
                          </p>
                          {med.status === "taken" && med.takenAt && (
                            <p className="text-xs text-success mt-0.5">✓ Taken at {med.takenAt}</p>
                          )}
                        </div>
                      </div>
                      {med.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMedAction(med.id, "taken")}
                            className="flex-1 bg-accent text-white rounded-lg py-1.5 text-xs font-semibold"
                          >
                            ✓ Taken
                          </button>
                          <button
                            onClick={() => handleMedAction(med.id, "notTaken")}
                            className="flex-1 border border-red-400 text-destructive rounded-lg py-1.5 text-xs font-semibold"
                          >
                            ✗ Not Taken
                          </button>
                          <button
                            onClick={() => handleMedAction(med.id, "skipped")}
                            className="flex-1 border border-amber-400 text-warning rounded-lg py-1.5 text-xs font-semibold"
                          >
                            Skip
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SCHEDULE tab */}
            {medTab === "schedule" && (
              <div className="space-y-3">
                {[
                  { name: "Metformin", dosage: "500mg", form: "Oral tablet", freq: "Twice daily: 8:00 AM & 8:00 PM", instruction: "Take with food", period: "1 Mar 2025 – 18 Aug 2025" },
                  { name: "Aspirin", dosage: "75mg", form: "Oral tablet", freq: "Once daily: 2:00 PM", instruction: "Take after meals", period: "1 Mar 2025 – 18 Aug 2025" },
                ].map((m, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border shadow-xs p-4">
                    <button
                      className="w-full flex items-center justify-between"
                      onClick={() => setExpandedMed(expandedMed === m.name ? null : m.name)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-accent/10 rounded-full flex items-center justify-center">
                          <Pill className="w-5 h-5 text-accent" />
                        </div>
                        <p className="font-semibold text-foreground">{m.name} {m.dosage}</p>
                      </div>
                      <ChevronRight className={cn("w-5 h-5 text-muted-foreground/70 transition-transform", expandedMed === m.name && "rotate-90")} />
                    </button>
                    {expandedMed === m.name && (
                      <div className="mt-3 pt-3 border-t border-border space-y-1 text-sm text-muted-foreground">
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

            {/* HISTORY tab */}
            {medTab === "history" && (
              <div className="space-y-4">
                {medHistory.map((day, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">{day.date}</p>
                    <div className="bg-card rounded-2xl border border-border shadow-xs divide-y divide-border/60">
                      {day.meds.map((m, j) => (
                        <div key={j} className="px-4 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.time}</p>
                          </div>
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", getMedBadge(m.status))}>
                            {m.status === "taken" ? "Taken ✓" : m.status === "skipped" ? "Skipped" : "Not Taken"}
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
            {/* 2x2 stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "6", label: "Completed", color: "text-accent", bg: "bg-accent/5" },
                { value: "1", label: "Upcoming", color: "text-warning", bg: "bg-warning/10" },
                { value: "3", label: "Remaining", color: "text-muted-foreground", bg: "bg-surface" },
                { value: "93%", label: "Med. Rate", color: "text-info", bg: "bg-info/5" },
              ].map((s, i) => (
                <div key={i} className={cn("rounded-2xl p-4 text-center border border-border shadow-sm", s.bg)}>
                  <p className={cn("text-3xl font-bold", s.color)}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Visit Progress bar */}
            <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
              <p className="font-semibold text-foreground text-sm mb-2">Visit Completion</p>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-1">
                <div className="h-full bg-accent rounded-full" style={{ width: "60%" }} />
              </div>
              <p className="text-xs text-muted-foreground">6 of 10 visits complete (60%)</p>
            </div>

            {/* Medication Adherence bar */}
            <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-foreground text-sm">Medication Adherence · This Week</p>
                <span className="text-xs font-semibold text-success">Excellent!</span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-1">
                <div className="h-full bg-info rounded-full" style={{ width: "93%" }} />
              </div>
              <p className="text-xs text-muted-foreground">13 of 14 doses (93%)</p>
            </div>

            {/* Study Timeline */}
            <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
              <p className="font-semibold text-foreground text-sm mb-3">Study Timeline</p>
              <div className="space-y-1 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started</span>
                  <span className="font-medium text-foreground">3 Mar 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current</span>
                  <span className="font-medium text-foreground">Week 12 of 24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated end</span>
                  <span className="font-medium text-foreground">18 Aug 2025</span>
                </div>
              </div>
              <div className="flex gap-1 items-center flex-wrap">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      i < 12 ? "bg-accent" : "bg-border"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">50% through the study</p>
            </div>

            {/* Medication Heatmap */}
            <div className="bg-card rounded-2xl border border-border shadow-xs p-4">
              <p className="font-semibold text-foreground text-sm mb-3">Medication Heatmap (Last 4 Weeks)</p>
              <div className="overflow-x-auto">
                <div className="min-w-[240px]">
                  <div className="flex gap-1 mb-1 ml-10">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} className="w-7 text-center text-[10px] text-muted-foreground/70 font-semibold">{d}</div>
                    ))}
                  </div>
                  {heatmapData.map((week, wi) => (
                    <div key={wi} className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] text-muted-foreground/70 w-9 shrink-0">{week.week}</span>
                      {week.days.map((d, di) => (
                        <div
                          key={di}
                          className={cn(
                            "w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold",
                            d === "taken" && "bg-accent/10 text-accent",
                            d === "missed" && "bg-destructive/10 text-destructive",
                            d === "future" && "bg-muted text-slate-300"
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
