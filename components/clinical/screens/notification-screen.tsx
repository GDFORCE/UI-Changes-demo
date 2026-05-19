"use client"

import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import { Check, Pill, Bell, AlertTriangle, Trash2, BellOff } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface NotificationScreenProps {
  onNavigate: (screen: string) => void
  onBack: () => void
}

export function NotificationScreen({ onNavigate, onBack }: NotificationScreenProps) {
  const [activeTab, setActiveTab] = useState("notifs")
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null)
  const [selectedCount, setSelectedCount] = useState(1)

  const filters = [
    { id: "all", label: "All" },
    { id: "visits", label: "Visits" },
    { id: "medication", label: "Medication" },
    { id: "trials", label: "Trials" },
  ]

  const todayNotifications = [
    { id: "1", title: "Patient Visit Reminder", message: "SUBJ-001 visit tomorrow · Visit 4 · Apollo Mumbai", time: "2:30 PM", unread: true, icon: Bell },
    { id: "2", title: "Trial Assignment", message: "Protocol-002 shared by Sponsor Pharma Co.", time: "10:15 AM", unread: false, icon: Bell },
    { id: "3", title: "⚠️ Overdue Visit Alert", message: "SUBJ-003 · Protocol-C · Visit 5 was due 4 days ago", time: "9:00 AM", unread: true, icon: AlertTriangle },
  ]

  const yesterdayNotifications = [
    { id: "4", title: "💊 Medication Reminder", message: "Metformin 500mg — Please take at 8:00 AM", time: "Yesterday", unread: false, icon: Pill },
    { id: "5", title: "Visit Completed", message: "SUBJ-001 · Visit 3. Next: Visit 4 on 20 May", time: "Yesterday", unread: false, icon: Check },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar
        title="Notifications"
        showBack
        onBack={onBack}
        rightContent={
          <button className="text-blue-400 text-sm font-medium flex items-center gap-1">
            <Check className="w-4 h-4" /> Mark All
          </button>
        }
      />
      
      <div className="flex-1 overflow-auto pb-28">
        {/* Filters */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium",
                activeFilter === filter.id
                  ? "bg-[#1A3872] text-white"
                  : "bg-white text-gray-600 border border-gray-300"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Today Section */}
        <div className="px-4 mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Today</span>
          <div className="bg-white rounded-2xl mt-2 divide-y divide-gray-100">
            {todayNotifications.map((notif) => {
              const Icon = notif.icon
              return (
                <button
                  key={notif.id}
                  onClick={() => setSelectedNotification(notif.id)}
                  className={cn(
                    "w-full p-4 flex gap-3 text-left",
                    !notif.unread && "bg-gray-50"
                  )}
                >
                  <div className="relative">
                    {notif.unread && (
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#2563EB] rounded-full" />
                    )}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      notif.icon === AlertTriangle ? "bg-amber-100" : "bg-blue-100"
                    )}>
                      <Icon className={cn("w-5 h-5", notif.icon === AlertTriangle ? "text-[#D97706]" : "text-[#1A3872]")} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-medium text-gray-900", notif.unread && "font-semibold")}>{notif.title}</p>
                    <p className="text-sm text-gray-600 truncate">{notif.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{notif.time}</span>
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Yesterday Section */}
        <div className="px-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Yesterday</span>
          <div className="bg-white rounded-2xl mt-2 divide-y divide-gray-100">
            {yesterdayNotifications.map((notif) => {
              const Icon = notif.icon
              return (
                <div
                  key={notif.id}
                  className="p-4 flex gap-3 bg-gray-50"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    notif.icon === Pill ? "bg-purple-100" : "bg-teal-100"
                  )}>
                    <Icon className={cn("w-5 h-5", notif.icon === Pill ? "text-purple-600" : "text-[#0D9488]")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{notif.title}</p>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{notif.time}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Bulk Action Footer */}
      <div className="absolute bottom-16 left-0 right-0 px-4 py-3 bg-white border-t shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{selectedCount} selected</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">
              Select All
            </button>
            <button className="px-4 py-2 bg-red-100 text-[#DC2626] rounded-lg text-sm font-medium flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button className="px-4 py-2 bg-amber-100 text-[#D97706] rounded-lg text-sm font-medium flex items-center gap-1">
              <BellOff className="w-4 h-4" /> Stop
            </button>
          </div>
        </div>
      </div>
      
      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab)
        if (tab === "dashboard") onNavigate("sponsor-dashboard")
        if (tab === "patients") onNavigate("patient-list")
        if (tab === "calendar") onNavigate("calendar")
      }} />
    </div>
  )
}
