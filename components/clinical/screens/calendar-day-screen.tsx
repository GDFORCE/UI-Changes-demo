"use client"

import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CalendarDayScreenProps {
  onNavigate: (screen: string) => void
  onBack: () => void
}

export function CalendarDayScreen({ onNavigate, onBack }: CalendarDayScreenProps) {
  const [activeTab, setActiveTab] = useState("calendar")
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")

  const hours = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"]

  const visits = [
    {
      time: "09:00",
      protocol: "Protocol-001",
      id: "SUBJ-001",
      visit: "Visit 3",
      type: "Follow-Up · Apollo Hospital",
      status: "Scheduled",
      color: "blue",
    },
    {
      time: "11:30",
      protocol: "Protocol-C",
      id: "SUBJ-003",
      visit: "Visit 5",
      type: "Screen Visit",
      status: "Overdue",
      color: "red",
    },
    {
      time: "14:00",
      protocol: "Protocol-002",
      id: "SUBJ-007",
      visit: "Visit 1",
      type: "Randomization",
      status: "Completed",
      color: "teal",
    },
  ]

  const getVisitForHour = (hour: string) => {
    return visits.find((v) => v.time.startsWith(hour.split(":")[0]))
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar
        title="Mon, 19 May 2025"
        showBack
        onBack={onBack}
        rightContent={
          <div className="flex items-center gap-1">
            <button className="p-2">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button className="p-2">
              <ChevronRight className="w-5 h-5 text-white" />
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
                  if (mode === "month") onNavigate("calendar")
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
        
        {/* Time Grid */}
        <div className="px-4 py-4">
          {hours.map((hour, index) => {
            const visit = getVisitForHour(hour)
            return (
              <div key={hour} className="flex">
                {/* Time Label */}
                <div className="w-14 flex-shrink-0 text-right pr-3">
                  <span className="text-xs text-gray-500">{hour}</span>
                </div>
                
                {/* Content Area */}
                <div className="flex-1 border-t border-gray-200 min-h-[60px] relative">
                  {visit && (
                    <button
                      onClick={() => onNavigate("visit-detail")}
                      className={cn(
                        "absolute top-0 left-0 right-2 p-3 rounded-xl text-left border-l-4 mt-1",
                        visit.color === "blue" && "bg-blue-50 border-[#2563EB]",
                        visit.color === "red" && "bg-red-50 border-[#DC2626]",
                        visit.color === "teal" && "bg-teal-50 border-[#0D9488]"
                      )}
                    >
                      <p className="text-xs text-gray-500 mb-0.5">{visit.protocol}</p>
                      <p className="font-semibold text-gray-900 text-sm">{visit.id} · {visit.visit}</p>
                      <p className="text-xs text-gray-600">{visit.type}</p>
                      <span className={cn(
                        "inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                        visit.color === "blue" && "bg-blue-100 text-[#1A3872]",
                        visit.color === "red" && "bg-red-100 text-[#DC2626]",
                        visit.color === "teal" && "bg-teal-100 text-[#0D9488]"
                      )}>
                        {visit.status}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
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
