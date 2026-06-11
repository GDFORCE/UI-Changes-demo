"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, RotateCw, Settings, Building2, Phone, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { BottomNav } from "../bottom-nav"

interface PatientCalendarScreenProps {
  onNavigate: (screen: string) => void
  onBack: () => void
}

// Priya's visit data (patient-only view)
const priyaVisits = [
  { visit: "Visit 1", name: "Screening", date: new Date(2025, 2, 3), status: "completed", type: "Hospital", doctor: "Dr. Sharma", location: "AIIMS Delhi" },
  { visit: "Visit 2", name: "Baseline", date: new Date(2025, 2, 10), status: "completed", type: "Hospital", doctor: "Dr. Sharma", location: "AIIMS Delhi" },
  { visit: "Visit 3", name: "Week 2", date: new Date(2025, 2, 24), status: "completed", type: "Hospital", doctor: "Dr. Sharma", location: "AIIMS Delhi" },
  { visit: "Visit 4", name: "Week 4", date: new Date(2025, 3, 7), status: "completed", type: "Hospital", doctor: "Dr. Sharma", location: "AIIMS Delhi" },
  { visit: "Visit 5", name: "Week 8", date: new Date(2025, 4, 5), status: "completed", type: "Hospital", doctor: "Dr. Sharma", location: "AIIMS Delhi" },
  { visit: "Visit 6", name: "Week 12", date: new Date(2025, 4, 19), status: "completed", type: "Hospital", doctor: "Dr. Sharma", location: "AIIMS Delhi" },
  { visit: "Visit 7", name: "Week 14", date: new Date(2025, 4, 23), status: "upcoming", type: "Hospital", doctor: "Dr. Sharma", location: "AIIMS Delhi, OPD Block 3" },
  { visit: "Visit 8", name: "Week 16", date: new Date(2025, 5, 9), status: "scheduled", type: "Hospital", doctor: "Dr. Sharma", location: "AIIMS Delhi" },
  { visit: "Visit 9", name: "Week 20", date: new Date(2025, 6, 7), status: "scheduled", type: "Telephonic", doctor: "Dr. Sharma", location: "" },
  { visit: "Visit 10", name: "EOT", date: new Date(2025, 7, 18), status: "scheduled", type: "Hospital", doctor: "Dr. Sharma", location: "AIIMS Delhi" },
]

function getStatusColor(status: string) {
  switch (status) {
    case "completed": return "teal"
    case "upcoming": return "orange"
    case "missed": return "red"
    default: return "blue"
  }
}

// Dominant status for a day → drives the colour of the date cell.
function getDayStatus(visits: { status: string }[]): string | null {
  if (visits.length === 0) return null
  if (visits.some(v => v.status === "missed")) return "missed"
  if (visits.some(v => v.status === "upcoming")) return "upcoming"
  if (visits.some(v => v.status === "scheduled")) return "scheduled"
  return "completed"
}

function getDayBgClass(status: string) {
  switch (status) {
    case "completed": return "bg-accent/10"
    case "upcoming": return "bg-warning/15"
    case "missed": return "bg-destructive/10"
    default: return "bg-info/10"
  }
}

function getDayTextClass(status: string) {
  switch (status) {
    case "completed": return "text-accent"
    case "upcoming": return "text-warning"
    case "missed": return "text-destructive"
    default: return "text-info"
  }
}

function getVisitsForDate(date: Date) {
  return priyaVisits.filter(v =>
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

export function PatientCalendarScreen({ onNavigate, onBack }: PatientCalendarScreenProps) {
  const [activeTab, setActiveTab] = useState("calendar")
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("month")
  // Month view state
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4, 1)) // May 2025
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 4, 19))
  // Week view state
  const [weekStart, setWeekStart] = useState(new Date(2025, 4, 18)) // Week of 18-24 May
  const [selectedWeekDay, setSelectedWeekDay] = useState(new Date(2025, 4, 19))
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

  const today = new Date(2025, 4, 19) // mock today

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
  const completedThisWeek = weekDays.filter(d => getVisitsForDate(d).some(v => v.status === "completed")).length
  const upcomingThisWeek = weekDays.filter(d => getVisitsForDate(d).some(v => v.status === "upcoming" || v.status === "scheduled")).length
  const freeDays = 7 - completedThisWeek - upcomingThisWeek

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

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* App Bar */}
      <div className="bg-primary-deep text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          {viewMode === "month" ? (
            <div className="flex items-center gap-2">
              <button onClick={() => {
                const d = new Date(currentMonth)
                d.setMonth(d.getMonth() - 1)
                setCurrentMonth(d)
              }}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold text-base">📅 {formatMonthYear(currentMonth)}</span>
              <button onClick={() => {
                const d = new Date(currentMonth)
                d.setMonth(d.getMonth() + 1)
                setCurrentMonth(d)
              }}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : viewMode === "week" ? (
            <div className="flex items-center gap-2">
              <button onClick={prevWeek}><ChevronLeft className="w-5 h-5" /></button>
              <span className="font-semibold text-sm">📅 {weekLabel}</span>
              <button onClick={nextWeek}><ChevronRight className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={prevDay}><ChevronLeft className="w-5 h-5" /></button>
              <span className="font-semibold text-sm">📅 {formatHeaderDate(selectedDate)}</span>
              <button onClick={nextDay}><ChevronRight className="w-5 h-5" /></button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={handleSync} className="p-2">
              <RotateCw
                className={cn("w-5 h-5 transition-transform", syncing && "animate-spin")}
              />
            </button>
            <button onClick={() => onNavigate("calendar-settings")} className="p-2">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        {syncStatus === "syncing" && (
          <p className="text-center text-xs text-blue-300 mt-1">Syncing...</p>
        )}
        {syncStatus === "done" && (
          <p className="text-center text-xs text-accent mt-1">✓ Updated just now</p>
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
                  viewMode === mode
                    ? "bg-primary-deep text-white"
                    : "text-primary-deep bg-card"
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
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-info" /><span className="text-[11px] text-muted-foreground">Scheduled</span></div>
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
              <h3 className="font-semibold text-foreground mb-3 text-base">{formatDay(selectedDate)}</h3>
              {visitsForSelected.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-muted-foreground/70">
                  <span className="text-3xl mb-2">📅</span>
                  <p className="text-sm">No visits on this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visitsForSelected.map((v, i) => {
                    const color = getStatusColor(v.status)
                    return (
                      <div
                        key={i}
                        className={cn(
                          "bg-card rounded-xl p-4 border-l-4 shadow-sm",
                          color === "teal" && "border-accent",
                          color === "orange" && "border-orange-500",
                          color === "red" && "border-red-500",
                          color === "blue" && "border-info"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-foreground">10:00 AM</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-semibold",
                            color === "teal" && "bg-accent/10 text-accent",
                            color === "orange" && "bg-warning/15 text-warning",
                            color === "red" && "bg-destructive/10 text-destructive",
                            color === "blue" && "bg-info/10 text-info"
                          )}>
                            {v.status === "completed" ? "Completed ✓" : v.status === "upcoming" ? "Upcoming" : v.status === "missed" ? "Missed ⚠" : "Scheduled"}
                          </span>
                        </div>
                        <p className="font-medium text-foreground text-sm">{v.name} · {v.visit}</p>
                        {v.location && (
                          <p className="text-xs text-muted-foreground mt-1">🏥 {v.location}</p>
                        )}
                        {v.type === "Telephonic" && (
                          <p className="text-xs text-muted-foreground mt-1">📞 Telephonic visit</p>
                        )}
                        <p className="text-xs text-muted-foreground">{v.doctor}</p>
                        {v.status === "completed" && (
                          <p className="text-xs text-accent mt-1">✓ Completed on {v.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                        )}
                        {v.status === "missed" && (
                          <div className="mt-2">
                            <p className="text-xs text-destructive">⚠ Was due · Contact team</p>
                            <button className="text-xs text-info mt-1 font-medium">Contact PI →</button>
                          </div>
                        )}
                        {(v.status === "upcoming" || v.status === "scheduled") && (
                          <button
                            onClick={() => onNavigate("my-visits")}
                            className="text-xs text-info font-medium mt-2"
                          >
                            View Details →
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
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
                This week: {completedThisWeek > 0 && `${completedThisWeek} completed · `}{upcomingThisWeek > 0 && `${upcomingThisWeek} upcoming · `}{freeDays} free days
              </p>
            </div>

            {/* Visits for selected week day */}
            <div className="px-4 py-3">
              <h3 className="font-semibold text-foreground mb-3 text-base">{formatDay(selectedWeekDay)}</h3>
              {visitsForWeekDay.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-muted-foreground/70">
                  <span className="text-3xl mb-2">📅</span>
                  <p className="text-sm">No visits on this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visitsForWeekDay.map((v, i) => {
                    const color = getStatusColor(v.status)
                    return (
                      <div
                        key={i}
                        className={cn(
                          "bg-card rounded-xl p-4 border-l-4 shadow-sm",
                          color === "teal" && "border-accent",
                          color === "orange" && "border-orange-500",
                          color === "blue" && "border-info"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-foreground">10:00 AM</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-semibold",
                            color === "teal" && "bg-accent/10 text-accent",
                            color === "orange" && "bg-warning/15 text-warning",
                            color === "blue" && "bg-info/10 text-info"
                          )}>
                            {v.status === "completed" ? "Completed ✓" : v.status === "upcoming" ? "Upcoming" : "Scheduled"}
                          </span>
                        </div>
                        <p className="font-medium text-foreground text-sm">{v.name} · {v.visit}</p>
                        {v.location && <p className="text-xs text-muted-foreground mt-1">🏥 {v.location}</p>}
                        {v.status === "completed" && (
                          <p className="text-xs text-accent mt-1">✓ Completed {v.date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* DAY VIEW */}
        {viewMode === "day" && (
          <div className="px-4 py-4">
            <h3 className="font-semibold text-foreground mb-3">{formatDay(selectedDate)}</h3>
            {visitsForSelected.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-muted-foreground/70">
                <span className="text-3xl mb-2">📅</span>
                <p className="text-sm">No visits scheduled today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visitsForSelected.map((v, i) => {
                  const color = getStatusColor(v.status)
                  return (
                    <div
                      key={i}
                      className={cn(
                        "bg-card rounded-xl p-4 border-l-4 shadow-sm",
                        color === "teal" && "border-accent",
                        color === "orange" && "border-amber-400",
                        color === "blue" && "border-info"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">10:00 AM</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold",
                          color === "teal" && "bg-accent/10 text-accent",
                          color === "orange" && "bg-warning/15 text-warning",
                          color === "blue" && "bg-info/10 text-info"
                        )}>
                          {v.status === "completed" ? "Completed ✓" : v.status === "upcoming" ? "Upcoming" : "Scheduled"}
                        </span>
                      </div>
                      <p className="font-medium text-foreground text-sm">{v.name} · {v.visit}</p>
                      {v.location && <p className="text-xs text-muted-foreground mt-1">🏥 {v.location}</p>}
                    </div>
                  )
                })}
              </div>
            )}
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
          if (tab === "my-trial") onNavigate("my-visits")
          if (tab === "chat") onNavigate("chat")
          if (tab === "me") onNavigate("profile-settings")
        }}
      />
    </div>
  )
}
