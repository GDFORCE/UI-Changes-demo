"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, RotateCw, Settings, Building2, Phone, CalendarDays, Clock, Stethoscope, Tag, Check, AlertTriangle, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "../bottom-nav"

interface TeamCalendarScreenProps {
  onNavigate: (screen: string) => void
  onBack: () => void
  role?: "pi" | "crc"
  initialView?: "day" | "week" | "month"
}

type TeamVisitStatus = "completed" | "scheduled" | "overdue"

interface TeamVisit {
  subj: string
  name: string
  visit: string
  visitName: string
  visitType: string
  pi: string
  date: Date
  status: TeamVisitStatus
  time: string
  location: string
  protocolId: string
  indication: string
}

// Site-wide visit schedule across all patients (PI / CRC view).
// visitName = clinical purpose of the visit; visitType = how it's conducted (modality).
const teamVisits: TeamVisit[] = [
  { subj: "SUBJ-001", name: "Priya Krishnan", visit: "Visit 7", visitName: "Efficacy Assessment", visitType: "On-site", pi: "Dr. Sharma", date: new Date(2026, 5, 2), status: "completed", time: "9:30 AM", location: "Apollo Hospital", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
  { subj: "SUBJ-004", name: "Vijay Sharma", visit: "Visit 5", visitName: "Lab & Vitals", visitType: "Lab Visit", pi: "Dr. Anita Rao", date: new Date(2026, 5, 4), status: "completed", time: "2:00 PM", location: "Apollo Hospital", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
  { subj: "SUBJ-002", name: "Rahul Mehta", visit: "Visit 4", visitName: "Safety Follow-up", visitType: "On-site", pi: "Dr. Sharma", date: new Date(2026, 5, 5), status: "overdue", time: "11:00 AM", location: "Apollo Hospital", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
  { subj: "SUBJ-001", name: "Priya Krishnan", visit: "Visit 8", visitName: "Efficacy Assessment", visitType: "On-site", pi: "Dr. Sharma", date: new Date(2026, 5, 8), status: "scheduled", time: "9:00 AM", location: "Apollo Hospital", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
  { subj: "SUBJ-003", name: "Anita Patel", visit: "Visit 2", visitName: "Baseline", visitType: "On-site", pi: "Dr. Sharma", date: new Date(2026, 5, 8), status: "scheduled", time: "11:00 AM", location: "Apollo Hospital", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
  { subj: "SUBJ-004", name: "Vijay Sharma", visit: "Visit 6", visitName: "Lab & Vitals", visitType: "Lab Visit", pi: "Dr. Anita Rao", date: new Date(2026, 5, 10), status: "scheduled", time: "10:00 AM", location: "Apollo Hospital", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
  { subj: "SUBJ-005", name: "Deepa Nair", visit: "Screening", visitName: "Screening", visitType: "On-site", pi: "Dr. Anita Rao", date: new Date(2026, 5, 11), status: "scheduled", time: "3:00 PM", location: "Apollo Hospital", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
  { subj: "SUBJ-002", name: "Rahul Mehta", visit: "Visit 5", visitName: "Safety Follow-up", visitType: "On-site", pi: "Dr. Sharma", date: new Date(2026, 5, 12), status: "scheduled", time: "11:00 AM", location: "Apollo Hospital", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
  { subj: "SUBJ-003", name: "Anita Patel", visit: "Visit 3", visitName: "Safety Follow-up", visitType: "On-site", pi: "Dr. Sharma", date: new Date(2026, 5, 15), status: "scheduled", time: "9:30 AM", location: "Apollo Hospital", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
  { subj: "SUBJ-001", name: "Priya Krishnan", visit: "Visit 9", visitName: "Telephonic Check-in", visitType: "Telephonic", pi: "Dr. Sharma", date: new Date(2026, 5, 22), status: "scheduled", time: "10:00 AM", location: "", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
  { subj: "SUBJ-004", name: "Vijay Sharma", visit: "Visit 7", visitName: "Efficacy Assessment", visitType: "On-site", pi: "Dr. Anita Rao", date: new Date(2026, 5, 25), status: "scheduled", time: "2:00 PM", location: "Apollo Hospital", protocolId: "Protocol-001", indication: "Type 2 Diabetes" },
]

// Patient privacy: show initials on the shared site calendar, not full names.
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? "")
    .join("")
}

// Dominant status for a day → drives the colour of the date cell.
function getDayStatus(visits: TeamVisit[]): TeamVisitStatus | null {
  if (visits.length === 0) return null
  if (visits.some(v => v.status === "overdue")) return "overdue"
  if (visits.some(v => v.status === "scheduled")) return "scheduled"
  return "completed"
}

function getDayBgClass(status: TeamVisitStatus) {
  switch (status) {
    case "completed": return "bg-accent/12"
    case "overdue": return "bg-destructive/10"
    default: return "bg-warning/15"
  }
}

function getDayTextClass(status: TeamVisitStatus) {
  switch (status) {
    case "completed": return "text-accent"
    case "overdue": return "text-destructive"
    default: return "text-warning"
  }
}

function getDayDotClass(status: TeamVisitStatus) {
  switch (status) {
    case "completed": return "bg-accent"
    case "overdue": return "bg-destructive"
    default: return "bg-warning"
  }
}

// Full tonal kit for a visit card, keyed off status — all semantic tokens.
function visitTone(status: TeamVisitStatus) {
  switch (status) {
    case "completed": return { rail: "bg-accent", chip: "bg-accent/15 text-accent", label: "Completed", Icon: Check }
    case "overdue": return { rail: "bg-destructive", chip: "bg-destructive/10 text-destructive", label: "Overdue", Icon: AlertTriangle }
    default: return { rail: "bg-warning", chip: "bg-warning/15 text-warning", label: "Scheduled", Icon: Clock }
  }
}

function getVisitsForDate(date: Date) {
  return teamVisits.filter(v =>
    v.date.getFullYear() === date.getFullYear() &&
    v.date.getMonth() === date.getMonth() &&
    v.date.getDate() === date.getDate()
  )
}

function formatMonthYear(date: Date) {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" })
}

function formatDay(date: Date) {
  return date.toLocaleString("en-US", { weekday: "long", day: "numeric", month: "long" })
}

function formatHeaderDate(date: Date) {
  return date.toLocaleString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
}

export function TeamCalendarScreen({ onNavigate, onBack, role = "pi", initialView = "month" }: TeamCalendarScreenProps) {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">(initialView)
  const today = new Date(2026, 5, 8) // mock today
  // Month view state
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)) // June 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 8))
  // Week view state — week containing "today" (Sunday start)
  const weekStartInit = new Date(today)
  weekStartInit.setDate(today.getDate() - today.getDay())
  const [weekStart, setWeekStart] = useState(weekStartInit)
  const [selectedWeekDay, setSelectedWeekDay] = useState(new Date(2026, 5, 8))
  // Sync state
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "done" | "error">("idle")
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSync = () => {
    if (syncing) return
    setSyncing(true)
    setSyncStatus("syncing")
    syncTimerRef.current = setTimeout(() => {
      setSyncing(false)
      setSyncStatus("done")
      setTimeout(() => setSyncStatus("idle"), 2000)
    }, 2000)
  }

  // Calendar grid generation
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const startDay = firstDayOfMonth.getDay() // 0=Sun
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]
  const calendarCells: (number | null)[] = Array(startDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d)
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  const weeks: (number | null)[][] = []
  for (let i = 0; i < calendarCells.length; i += 7) weeks.push(calendarCells.slice(i, i + 7))

  const visitsForSelected = getVisitsForDate(selectedDate)

  // Week view helpers
  const weekDays: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    weekDays.push(d)
  }
  const weekDayNames = ["S", "M", "T", "W", "T", "F", "S"]
  const visitsForWeekDay = getVisitsForDate(selectedWeekDay)
  const weekVisitCount = weekDays.reduce((sum, d) => sum + getVisitsForDate(d).length, 0)
  const overdueThisWeek = weekDays.reduce((sum, d) => sum + getVisitsForDate(d).filter(v => v.status === "overdue").length, 0)

  function prevWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
    setSelectedWeekDay(d)
  }
  function nextWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
    setSelectedWeekDay(d)
  }
  function prevDay() {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d)
  }
  function nextDay() {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    setSelectedDate(d)
  }
  const weekLabel = `${weekDays[0].getDate()}–${weekDays[6].getDate()} ${weekDays[6].toLocaleString("en-US", { month: "long", year: "numeric" })}`

  // Period navigation, contextual to the active view.
  const periodNav =
    viewMode === "month"
      ? {
          label: formatMonthYear(currentMonth),
          prev: () => { const d = new Date(currentMonth); d.setMonth(d.getMonth() - 1); setCurrentMonth(d) },
          next: () => { const d = new Date(currentMonth); d.setMonth(d.getMonth() + 1); setCurrentMonth(d) },
        }
      : viewMode === "week"
      ? { label: weekLabel, prev: prevWeek, next: nextWeek }
      : { label: formatHeaderDate(selectedDate), prev: prevDay, next: nextDay }

  // Visits within the period currently in view (drives the contextual subtitle).
  const periodVisitCount =
    viewMode === "month"
      ? teamVisits.filter(v => v.date.getFullYear() === currentMonth.getFullYear() && v.date.getMonth() === currentMonth.getMonth()).length
      : viewMode === "week"
      ? weekVisitCount
      : visitsForSelected.length

  // Jump back to "today" for whichever view is active.
  function goToday() {
    if (viewMode === "month") {
      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
      setSelectedDate(today)
    } else if (viewMode === "week") {
      const s = new Date(today)
      s.setDate(today.getDate() - today.getDay())
      setWeekStart(s)
      setSelectedWeekDay(today)
    } else {
      setSelectedDate(today)
    }
  }

  const settingsScreen = "calendar-settings"

  // ── Shared visit card — site-wide, privacy-safe ────────────
  const VisitCard = ({ v }: { v: TeamVisit }) => {
    const tone = visitTone(v.status)
    const ToneIcon = tone.Icon
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 pl-5 shadow-xs">
        <span className={cn("absolute left-0 top-0 bottom-0 w-1.5", tone.rail)} />
        <div className="flex items-center justify-between mb-1.5">
          <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-foreground">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {v.time}
          </span>
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tone.chip)}>
            <ToneIcon className="h-3 w-3" /> {tone.label}
          </span>
        </div>
        <p className="font-heading text-base text-foreground">{initials(v.name)} · {v.subj}</p>
        <p className="text-xs text-muted-foreground">{v.protocolId} · {v.indication}</p>
        <p className="text-xs text-muted-foreground">{v.visit} · {v.visitName}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Tag className="h-3.5 w-3.5 text-muted-foreground/70" /> {v.visitType}
          </span>
          {/* On the CRC view, surface which PI is attending the patient for this visit. */}
          {role === "crc" && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Stethoscope className="h-3.5 w-3.5 text-muted-foreground/70" /> {v.pi}
            </span>
          )}
          {v.visitType === "Telephonic" ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-muted-foreground/70" /> Telephonic visit
            </span>
          ) : v.location && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground/70" /> {v.location}
            </span>
          )}
        </div>
      </div>
    )
  }

  const EmptyDay = ({ text }: { text: string }) => (
    <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground/60">
      <CalendarDays className="h-8 w-8" />
      <p className="text-sm">{text}</p>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-background">
      {/* App Bar */}
      <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
        <div className="relative flex items-center gap-3">
          <button onClick={onBack} aria-label="Back" className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-primary-foreground/55">Site schedule</p>
            <h1 className="display-serif text-lg leading-tight">Team Calendar</h1>
          </div>
          <button onClick={handleSync} aria-label="Sync" className="springy p-2 rounded-full active:scale-90 hover:bg-white/10">
            <RotateCw className={cn("w-5 h-5 transition-transform", syncing && "animate-spin")} />
          </button>
          <button onClick={() => onNavigate(settingsScreen)} aria-label="Calendar settings" className="springy p-2 rounded-full active:scale-90 hover:bg-white/10">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <p className="relative mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-primary-foreground/70">
          <Users className="h-3.5 w-3.5" /> {role === "pi" ? "PI" : "CRC"} · Site 02 · All patients
        </p>
        {syncStatus === "syncing" && <p className="relative text-center text-xs text-primary-foreground/70 mt-1.5">Syncing…</p>}
        {syncStatus === "done" && (
          <p className="relative text-center text-xs text-primary-foreground/90 mt-1.5 inline-flex items-center justify-center gap-1 w-full">
            <Check className="h-3.5 w-3.5" /> Updated just now
          </p>
        )}
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide pb-4">
        {/* View mode + editorial period navigator */}
        <div className="bg-card border-b border-border px-4 pt-4 pb-4 space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <button onClick={periodNav.prev} aria-label="Previous" className="springy grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface active:scale-90 hover:border-primary/40">
              <ChevronLeft className="w-5 h-5 text-foreground/70" />
            </button>
            <div className="min-w-0 text-center">
              <p className="eyebrow text-accent">{viewMode} view</p>
              <h2 className="dawn-text font-heading text-xl leading-tight truncate">{periodNav.label}</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {periodVisitCount} {periodVisitCount === 1 ? "visit" : "visits"} in view
              </p>
            </div>
            <button onClick={periodNav.next} aria-label="Next" className="springy grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface active:scale-90 hover:border-primary/40">
              <ChevronRight className="w-5 h-5 text-foreground/70" />
            </button>
          </div>

          {/* Segmented control + Today jump */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 rounded-full bg-muted p-1">
              {(["day", "week", "month"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setViewMode(mode)
                    if (mode === "day") setSelectedDate(today)
                  }}
                  className={cn(
                    "flex-1 py-2 text-sm font-semibold capitalize rounded-full transition-all",
                    viewMode === mode ? "dawn-gradient text-primary-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              onClick={goToday}
              className="springy shrink-0 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-card px-3.5 py-2 text-xs font-semibold text-primary active:scale-95 hover:bg-secondary/40"
            >
              <CalendarDays className="h-3.5 w-3.5" /> Today
            </button>
          </div>
        </div>

        {/* Status legend — tinted chips */}
        <div className="flex justify-center gap-2 py-2.5 bg-card border-b border-border">
          {[
            { cls: "bg-accent/12 text-accent", dot: "bg-accent", label: "Completed" },
            { cls: "bg-warning/15 text-warning", dot: "bg-warning", label: "Scheduled" },
            { cls: "bg-destructive/10 text-destructive", dot: "bg-destructive", label: "Overdue" },
          ].map(l => (
            <span key={l.label} className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold", l.cls)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", l.dot)} /> {l.label}
            </span>
          ))}
        </div>

        {/* MONTH VIEW */}
        {viewMode === "month" && (
          <>
            <div className="px-4 py-4 bg-card">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((d, i) => (
                  <div key={i} className={cn("text-center text-[11px] font-semibold py-1", i === 0 || i === 6 ? "text-accent/70" : "text-muted-foreground/70")}>{d}</div>
                ))}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1 animate-rise" style={{ animationDelay: `${60 + wi * 55}ms` }}>
                  {week.map((day, di) => {
                    const cellDate = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) : null
                    const visits = cellDate ? getVisitsForDate(cellDate) : []
                    const dayStatus = getDayStatus(visits)
                    const isToday = cellDate && cellDate.toDateString() === today.toDateString()
                    const isSelected = cellDate && cellDate.toDateString() === selectedDate.toDateString()
                    const isWeekend = di === 0 || di === 6
                    return (
                      <button
                        key={di}
                        onClick={() => cellDate && setSelectedDate(cellDate)}
                        disabled={!day}
                        className={cn(
                          "springy relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all active:scale-90",
                          isSelected && "dawn-gradient hero-glow shadow-md ring-2 ring-white/40",
                          !isSelected && isToday && "ring-1 ring-inset ring-info",
                          !isSelected && !isToday && dayStatus && getDayBgClass(dayStatus),
                          !isSelected && !isToday && !dayStatus && isWeekend && "bg-surface/50",
                          !day && "invisible"
                        )}
                      >
                        <span className={cn(
                          "text-sm leading-none",
                          isSelected ? "font-bold text-primary-foreground"
                            : isToday ? "font-bold text-info"
                            : dayStatus ? cn("font-semibold", getDayTextClass(dayStatus))
                            : "font-medium text-foreground"
                        )}>{day}</span>
                        {!isSelected && visits.length > 0 && (
                          <span className="absolute bottom-1.5 flex items-center gap-0.5">
                            {visits.slice(0, 3).map((v, vi) => (
                              <span key={vi} className={cn("h-1 w-1 rounded-full", getDayDotClass(v.status))} />
                            ))}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Selected day visits */}
            <div className="px-4 py-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="eyebrow text-muted-foreground">Selected day</p>
                  <h3 className="font-heading text-foreground text-lg leading-tight">{formatDay(selectedDate)}</h3>
                </div>
                {visitsForSelected.length > 0 && (
                  <span className="shrink-0 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary">
                    {visitsForSelected.length} visit{visitsForSelected.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {visitsForSelected.length === 0 ? (
                <EmptyDay text="No visits on this day" />
              ) : (
                <div className="space-y-3">
                  {visitsForSelected.map((v, i) => <VisitCard key={i} v={v} />)}
                </div>
              )}
            </div>
          </>
        )}

        {/* WEEK VIEW */}
        {viewMode === "week" && (
          <>
            {/* 7-day header row */}
            <div className="bg-card border-b border-border px-4 py-3 animate-rise" style={{ animationDelay: "40ms" }}>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((d, i) => {
                  const dayVisits = getVisitsForDate(d)
                  const dayStatus = getDayStatus(dayVisits)
                  const isToday = d.toDateString() === today.toDateString()
                  const isSelected = d.toDateString() === selectedWeekDay.toDateString()
                  return (
                    <button key={i} onClick={() => setSelectedWeekDay(d)} className="flex flex-col items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground/70">{weekDayNames[d.getDay()]}</span>
                      <div className={cn(
                        "relative w-9 h-9 flex items-center justify-center rounded-2xl transition-colors",
                        isSelected && "dawn-gradient text-primary-foreground shadow-sm",
                        !isSelected && isToday && "ring-1 ring-inset ring-info",
                        !isSelected && dayStatus && cn(getDayBgClass(dayStatus), getDayTextClass(dayStatus)),
                        !isSelected && !dayStatus && "text-foreground"
                      )}>
                        <span className="text-sm font-semibold">{d.getDate()}</span>
                        {!isSelected && dayVisits.length > 0 && (
                          <span className="absolute bottom-1 flex items-center gap-0.5">
                            {dayVisits.slice(0, 3).map((v, vi) => (
                              <span key={vi} className={cn("h-1 w-1 rounded-full", getDayDotClass(v.status))} />
                            ))}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Week overview strip */}
            <div className="px-4 py-2.5 bg-surface">
              <p className="text-xs text-muted-foreground text-center">
                This week: {weekVisitCount} visit{weekVisitCount !== 1 ? "s" : ""}
                {overdueThisWeek > 0 && ` · ${overdueThisWeek} overdue`}
              </p>
            </div>

            {/* Visits for selected week day */}
            <div className="px-4 py-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="eyebrow text-muted-foreground">Selected day</p>
                  <h3 className="font-heading text-foreground text-lg leading-tight">{formatDay(selectedWeekDay)}</h3>
                </div>
                {visitsForWeekDay.length > 0 && (
                  <span className="shrink-0 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary">
                    {visitsForWeekDay.length} visit{visitsForWeekDay.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {visitsForWeekDay.length === 0 ? (
                <EmptyDay text="No visits on this day" />
              ) : (
                <div className="space-y-3">
                  {visitsForWeekDay.map((v, i) => <VisitCard key={i} v={v} />)}
                </div>
              )}
            </div>
          </>
        )}

        {/* DAY VIEW */}
        {viewMode === "day" && (
          <div className="px-4 py-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="eyebrow text-muted-foreground">Selected day</p>
                <h3 className="font-heading text-foreground text-lg leading-tight">{formatDay(selectedDate)}</h3>
              </div>
              {visitsForSelected.length > 0 && (
                <span className="shrink-0 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary">
                  {visitsForSelected.length} visit{visitsForSelected.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {visitsForSelected.length === 0 ? (
              <EmptyDay text="No visits scheduled today" />
            ) : (
              <div className="space-y-3">
                {visitsForSelected.map((v, i) => <VisitCard key={i} v={v} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav
        activeTab=""
        role={role}
        notificationCount={role === "pi" ? 3 : 2}
        onTabChange={(tab) => {
          if (tab === "chat") onNavigate("chat")
          else if (tab === "notifs") onNavigate("notifications")
          else onNavigate(role === "pi" ? "pi-dashboard" : "research-team-dashboard")
        }}
      />
    </div>
  )
}
