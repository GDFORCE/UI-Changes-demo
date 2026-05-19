"use client"

import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import { ChevronDown, RotateCw, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CalendarMonthScreenProps {
  onNavigate: (screen: string) => void
  onBack: () => void
}

export function CalendarMonthScreen({ onNavigate, onBack }: CalendarMonthScreenProps) {
  const [activeTab, setActiveTab] = useState("calendar")
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("month")
  const [selectedDay, setSelectedDay] = useState(19)

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]
  
  // May 2025 calendar (starts on Thursday)
  const calendarDays = [
    [null, null, null, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, null],
  ]

  const dayEvents: Record<number, { type: "scheduled" | "completed" | "overdue" }[]> = {
    5: [{ type: "completed" }],
    10: [{ type: "completed" }],
    15: [{ type: "scheduled" }],
    19: [{ type: "scheduled" }, { type: "completed" }, { type: "overdue" }],
    22: [{ type: "scheduled" }],
    23: [{ type: "scheduled" }],
    28: [{ type: "scheduled" }],
  }

  const selectedDayVisits = [
    { time: "09:00", id: "SUBJ-001", visit: "Visit 3", type: "Follow-Up", status: "Scheduled", color: "blue" },
    { time: "11:30", id: "SUBJ-007", visit: "Visit 1", type: "Randomization", status: "Completed", color: "teal" },
    { time: "14:00", id: "SUBJ-003", visit: "Visit 5", type: "Screen Visit", status: "⚠ Overdue", color: "red" },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar
        title="📅 May 2025"
        showBack
        onBack={onBack}
        rightContent={
          <div className="flex items-center gap-2">
            <button className="p-2">
              <RotateCw className="w-5 h-5 text-white" />
            </button>
            <button className="p-2">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-auto pb-4">
        {/* View Mode Selector */}
        <div className="px-4 py-3 bg-white border-b">
          <div className="flex rounded-xl bg-gray-100 p-1">
            {(["day", "week", "month"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode)
                  if (mode === "day") onNavigate("calendar-day")
                }}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium capitalize",
                  viewMode === mode ? "bg-white shadow text-[#1A3872]" : "text-gray-600"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="px-4 py-4 bg-white">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day, i) => (
              <div key={i} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          {calendarDays.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <button
                  key={dayIndex}
                  onClick={() => day && setSelectedDay(day)}
                  disabled={!day}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-full relative",
                    day === selectedDay && "bg-[#2563EB] text-white",
                    day === 19 && day !== selectedDay && "bg-blue-100",
                    !day && "invisible"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    day === selectedDay ? "text-white" : "text-gray-700"
                  )}>
                    {day}
                  </span>
                  {day && dayEvents[day] && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents[day].map((event, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1 h-1 rounded-full",
                            event.type === "scheduled" && "bg-[#2563EB]",
                            event.type === "completed" && "bg-[#0D9488]",
                            event.type === "overdue" && "bg-[#DC2626]"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
        
        {/* Selected Day Info */}
        <div className="px-4 py-3">
          <h3 className="font-semibold text-gray-900 mb-3">Monday, {selectedDay} May</h3>
          <div className="space-y-3">
            {selectedDayVisits.map((visit, index) => (
              <button
                key={index}
                onClick={() => onNavigate("visit-detail")}
                className={cn(
                  "w-full p-4 rounded-2xl text-left border-l-4",
                  visit.color === "blue" && "bg-blue-50 border-[#2563EB]",
                  visit.color === "teal" && "bg-teal-50 border-[#0D9488]",
                  visit.color === "red" && "bg-red-50 border-[#DC2626]"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-500">{visit.time}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    visit.color === "blue" && "bg-blue-100 text-[#1A3872]",
                    visit.color === "teal" && "bg-teal-100 text-[#0D9488]",
                    visit.color === "red" && "bg-red-100 text-[#DC2626]"
                  )}>
                    {visit.status}
                  </span>
                </div>
                <p className="font-semibold text-gray-900">{visit.id} · {visit.visit}</p>
                <p className="text-sm text-gray-600">{visit.type}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab)
        if (tab === "dashboard") onNavigate("sponsor-dashboard")
        if (tab === "patients") onNavigate("patient-list")
        if (tab === "notifs") onNavigate("notifications")
      }} />
    </div>
  )
}
