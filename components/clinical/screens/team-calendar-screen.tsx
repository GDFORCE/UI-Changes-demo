"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, RotateCw, Settings, Building2, Phone, Calendar, Stethoscope, Tag } from "lucide-react"
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

function getStatusColor(status: TeamVisitStatus) {
  switch (status) {
    case "completed": return "teal"
    case "overdue": return "red"
    default: return "orange"
  }
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
    case "completed": return "bg-accent/10"
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

function getStatusLabel(status: TeamVisitStatus) {
  switch (status) {
    case "completed": return "Completed"
    case "overdue": return "Overdue ⚠"
    default: return "Scheduled"
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

  const settingsScreen = "calendar-settings"

  const renderVisitCard = (v: TeamVisit, i: number) => {
    const color = getStatusColor(v.status)
    return (
      <div
        key={i}
        className={cn(
          "bg-card rounded-xl p-4 border-l-4 shadow-sm",
          color === "teal" && "border-accent",
          color === "red" && "border-red-500",
          color === "orange" && "border-orange-500"
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-sm text-foreground">{v.time}</span>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold",
            color === "teal" && "bg-accent/10 text-accent",
            color === "red" && "bg-destructive/10 text-destructive",
            color === "orange" && "bg-warning/15 text-warning"
          )}>
            {getStatusLabel(v.status)}
          </span>
        </div>
        <p className="font-semibold text-foreground text-sm">{initials(v.name)} · {v.subj}</p>
        <p className="text-xs text-muted-foreground">{v.protocolId} · {v.indication}</p>
        <p className="text-xs text-muted-foreground">{v.visit} · {v.visitName}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Tag className="w-3.5 h-3.5 text-muted-foreground/70" /> Visit type: <span className="font-medium text-muted-foreground">{v.visitType}</span></p>
        {/* On the CRC view, surface which PI is attending the patient for this visit. */}
        {role === "crc" && <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Stethoscope className="w-3.5 h-3.5 text-muted-foreground/70" /> PI: <span className="font-medium text-muted-foreground">{v.pi}</span></p>}
        {v.location && <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Building2 className="w-3.5 h-3.5 text-muted-foreground/70" /> {v.location}</p>}
        {v.visitType === "Telephonic" && <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Phone className="w-3.5 h-3.5 text-muted-foreground/70" /> Telephonic visit</p>}
      </div>
    )
  }

  const emptyState = (
    <div className="flex flex-col items-center py-8 text-muted-foreground/70">
      <Calendar className="w-8 h-8 mb-2" />
      <p className="text-sm">No visits on this day</p>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* App Bar */}
      <div className="bg-primary-deep text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          {viewMode === "day" ? (
            <div className="flex items-center gap-2">
              <button onClick={prevDay}><ChevronLeft className="w-5 h-5" /></button>
              <span className="font-semibold text-sm">{formatHeaderDate(selectedDate)}</span>
              <button onClick={nextDay}><ChevronRight className="w-5 h-5" /></button>
            </div>
          ) : viewMode === "week" ? (
            <div className="flex items-center gap-2">
              <button onClick={prevWeek}><ChevronLeft className="w-5 h-5" /></button>
              <span className="font-semibold text-sm">{weekLabel}</span>
              <button onClick={nextWeek}><ChevronRight className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => {
                const d = new Date(currentMonth)
                d.setMonth(d.getMonth() - 1)
                setCurrentMonth(d)
              }}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold text-base">{formatMonthYear(currentMonth)}</span>
              <button onClick={() => {
                const d = new Date(currentMonth)
                d.setMonth(d.getMonth() + 1)
                setCurrentMonth(d)
              }}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={handleSync} className="p-2">
              <RotateCw className={cn("w-5 h-5 transition-transform", syncing && "animate-spin")} />
            </button>
            <button onClick={() => onNavigate(settingsScreen)} className="p-2">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-center text-[11px] text-primary-foreground/75 mt-1">
          {role === "pi" ? "PI · Site 02 · All patients" : "CRC · Site 02 · All patients"}
        </p>
        {syncStatus === "syncing" && (
          <p className="text-center text-xs text-blue-300 mt-1">Syncing...</p>
        )}
        {syncStatus === "done" && (
          <p className="text-center text-xs text-accent mt-1">Updated just now</p>
        )}
      </div>

      <div className="flex-1 overflow-auto pb-4">
        {/* View Mode Tabs */}
        <div className="px-4 py-3 bg-card border-b border-border">
          <div className="flex rounded-xl border border-primary-deep overflow-hidden">
            {(["day", "week", "month"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode)
                  if (mode === "day") setSelectedDate(today)
                }}
                className={cn(
                  "flex-1 py-2 text-sm font-medium capitalize transition-colors",
                  viewMode === mode ? "bg-primary-deep text-white" : "text-primary-deep bg-card"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Status legend */}
        <div className="flex justify-center gap-4 py-2 bg-card border-b border-border">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent" /><span className="text-[11px] text-muted-foreground">Completed</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning" /><span className="text-[11px] text-muted-foreground">Upcoming</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-destructive" /><span className="text-[11px] text-muted-foreground">Overdue</span></div>
        </div>

        {/* MONTH VIEW */}
        {viewMode === "month" && (
          <>
            <div className="px-4 py-4 bg-card">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((d, i) => (
                  <div key={i} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
                ))}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1">
                  {week.map((day, di) => {
                    const cellDate = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) : null
                    const visits = cellDate ? getVisitsForDate(cellDate) : []
                    const dayStatus = getDayStatus(visits)
                    const isToday = cellDate && cellDate.toDateString() === today.toDateString()
                    const isSelected = cellDate && cellDate.toDateString() === selectedDate.toDateString()
                    return (
                      <button
                        key={di}
                        onClick={() => cellDate && setSelectedDate(cellDate)}
                        disabled={!day}
                        className={cn(
                          "aspect-square flex items-center justify-center rounded-full",
                          isSelected && "bg-primary-deep",
                          !isSelected && isToday && "ring-1 ring-inset ring-info",
                          !isSelected && !isToday && dayStatus && getDayBgClass(dayStatus),
                          !day && "invisible"
                        )}
                      >
                        <span className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-white" : dayStatus ? getDayTextClass(dayStatus) : "text-foreground"
                        )}>{day}</span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Selected day visits */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground text-base">{formatDay(selectedDate)}</h3>
                {visitsForSelected.length > 0 && (
                  <span className="text-xs text-muted-foreground/70">{visitsForSelected.length} visit{visitsForSelected.length > 1 ? "s" : ""}</span>
                )}
              </div>
              {visitsForSelected.length === 0 ? emptyState : (
                <div className="space-y-3">{visitsForSelected.map(renderVisitCard)}</div>
              )}
            </div>
          </>
        )}

        {/* WEEK VIEW */}
        {viewMode === "week" && (
          <>
            {/* 7-day header row */}
            <div className="bg-card border-b border-border px-4 py-3">
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((d, i) => {
                  const dayVisits = getVisitsForDate(d)
                  const dayStatus = getDayStatus(dayVisits)
                  const isToday = d.toDateString() === today.toDateString()
                  const isSelected = d.toDateString() === selectedWeekDay.toDateString()
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedWeekDay(d)}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="text-[11px] text-muted-foreground/70">{weekDayNames[d.getDay()]}</span>
                      <div className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full",
                        isSelected && "bg-primary-deep text-white",
                        !isSelected && isToday && "ring-1 ring-inset ring-info",
                        !isSelected && dayStatus && cn(getDayBgClass(dayStatus), getDayTextClass(dayStatus)),
                        !isSelected && !dayStatus && "text-foreground"
                      )}>
                        <span className="text-sm font-semibold">{d.getDate()}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Week overview strip */}
            <div className="px-4 py-2 bg-surface">
              <p className="text-xs text-muted-foreground text-center">
                This week: {weekVisitCount} visit{weekVisitCount !== 1 ? "s" : ""}
                {overdueThisWeek > 0 && ` · ${overdueThisWeek} overdue`}
              </p>
            </div>

            {/* Visits for selected week day */}
            <div className="px-4 py-3">
              <h3 className="font-semibold text-foreground mb-3 text-base">{formatDay(selectedWeekDay)}</h3>
              {visitsForWeekDay.length === 0 ? emptyState : (
                <div className="space-y-3">{visitsForWeekDay.map(renderVisitCard)}</div>
              )}
            </div>
          </>
        )}

        {/* DAY VIEW */}
        {viewMode === "day" && (
          <div className="px-4 py-4">
            <h3 className="font-semibold text-foreground mb-3">{formatDay(selectedDate)}</h3>
            {visitsForSelected.length === 0 ? emptyState : (
              <div className="space-y-3">{visitsForSelected.map(renderVisitCard)}</div>
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
