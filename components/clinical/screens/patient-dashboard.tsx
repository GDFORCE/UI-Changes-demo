"use client"

import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import { ChevronRight, Check, Calendar, Bell, MessageCircle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"

interface PatientDashboardProps {
  onNavigate: (screen: string) => void
}

export function PatientDashboard({ onNavigate }: PatientDashboardProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("dashboard")

  const recentActivity = [
    { visit: "Visit 6", date: "10 May", status: "Done" },
    { visit: "Visit 5", date: "22 Apr", status: "Done" },
  ]

  // Section 3 — Calendar (monthly view): visit days for the current month
  const calendarMonth = new Date(2025, 4, 1) // May 2025
  const monthVisits: Record<number, "completed" | "upcoming" | "scheduled"> = {
    5: "completed",
    19: "completed",
    23: "upcoming",
  }
  const today = new Date(2025, 4, 19).getDate()
  const startDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay()
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()
  const calendarCells: (number | null)[] = Array(startDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d)
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  // Section 4 — Notifications: each redirects to its specific page
  const notifications = [
    {
      id: "1",
      icon: Bell,
      bg: "bg-blue-100",
      color: "text-blue-700",
      title: "Visit 7 Tomorrow",
      body: "Follow-Up Visit at AIIMS Delhi · 23 May 2025",
      time: "2h ago",
      unread: true,
      screen: "my-visits",
    },
    {
      id: "2",
      icon: MessageCircle,
      bg: "bg-sky-100",
      color: "text-sky-600",
      title: "Message from Dr. Sharma",
      body: "Please fast for 8 hours before your Visit 7 blood draw.",
      time: "Yesterday",
      unread: true,
      screen: "chat",
    },
  ]

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      <AppBar
        title={t("myTrialJourney")}
        notificationCount={2}
        avatar="PK"
        onNotificationClick={() => onNavigate("notifications")}
        onAvatarClick={() => onNavigate("profile-settings")}
      />
      
      <div className="flex-1 overflow-auto pb-4">
        {/* Hero Card */}
        <div className="px-4 py-4">
          <div className="bg-gradient-to-br from-[#0D1B3E] via-[#1A3872] to-[#2563EB] rounded-2xl p-5 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-1 font-[family-name:var(--font-heading)]">{t("hello")} Priya</h2>
            <p className="text-blue-200 text-sm mb-4">Protocol-001 · Dr. Sharma</p>

            <div className="mb-2">
              <span className="text-sm text-blue-200">{t("yourProgress")}</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#0D9488] transition-all duration-500"
                style={{ width: "60%" }}
              />
            </div>
            <span className="text-sm text-blue-200">{t("visitOfCompleted", { a: 6, b: 10 })}</span>
          </div>
        </div>
        
        {/* Next Visit Card */}
        <div className="px-4 mb-4">
          <h3 className="font-semibold text-[#0F172A] mb-3 font-[family-name:var(--font-heading)]">{t("nextVisit")}</h3>
          <div className="bg-white rounded-2xl border-l-4 border-[#2563EB] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#0F172A]">Visit 7</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                {t("upcoming")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3">
              <div>
                <p className="text-[11px] text-[#94A3B8]">{t("protocolId")}</p>
                <p className="text-sm text-[#0F172A] font-medium">Protocol-001</p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">{t("phase")}</p>
                <p className="text-sm text-[#0F172A] font-medium">Phase II</p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">{t("indication")}</p>
                <p className="text-sm text-[#0F172A] font-medium">Diabetes</p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">{t("visitType")}</p>
                <p className="text-sm text-[#0F172A] font-medium">{t("followUpVisit")}</p>
              </div>
            </div>
            <p className="text-sm text-[#0D1B3E] font-medium mb-1">23 May 2025</p>
            <p className="text-xs text-[#94A3B8] mb-3">{t("window")} 20 May – 26 May</p>
            <button
              onClick={() => onNavigate("my-visits")}
              className="text-[#2563EB] font-medium text-sm flex items-center gap-1 hover:underline"
            >
              {t("viewDetails")} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 3 — Calendar (monthly view, opens full Calendar) */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0D1B3E]" />
              <h3 className="font-semibold text-[#0F172A] font-[family-name:var(--font-heading)]">{t("calendar")}</h3>
            </div>
            <button
              onClick={() => onNavigate("patient-calendar")}
              className="text-[#2563EB] font-medium text-sm flex items-center gap-1 hover:underline"
            >
              {t("openCalendar")} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onNavigate("patient-calendar")}
            className="w-full text-left bg-white rounded-2xl p-4 shadow-sm"
          >
            <p className="text-center font-semibold text-[#0F172A] mb-3">
              {calendarMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </p>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center text-[11px] font-semibold text-slate-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((day, i) => {
                const status = day ? monthVisits[day] : undefined
                const isToday = day === today
                return (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-full text-xs font-medium",
                      !day && "invisible",
                      status === "completed" && "bg-teal-100 text-[#0D9488]",
                      status === "upcoming" && "bg-orange-100 text-orange-600",
                      status === "scheduled" && "bg-blue-100 text-[#2563EB]",
                      !status && isToday && "ring-1 ring-inset ring-[#2563EB] text-[#2563EB]",
                      !status && !isToday && "text-slate-700"
                    )}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />{t("completed")}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" />{t("upcoming")}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />{t("scheduled")}</span>
            </div>
          </button>
        </div>

        {/* Section 4 — Notifications (each opens its page; See All opens Notifications) */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0D1B3E]" />
              <h3 className="font-semibold text-[#0F172A] font-[family-name:var(--font-heading)]">{t("notifications")}</h3>
            </div>
            <button
              onClick={() => onNavigate("notifications")}
              className="text-[#2563EB] font-medium text-sm hover:underline"
            >
              {t("seeAll")}
            </button>
          </div>
          <div className="space-y-3">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => onNavigate(n.screen)}
                className={cn(
                  "w-full text-left bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3",
                  n.unread && "border-l-4 border-[#2563EB]"
                )}
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", n.bg)}>
                  <n.icon className={cn("w-5 h-5", n.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-[#0F172A] text-[15px] truncate">{n.title}</p>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />}
                  </div>
                  <p className="text-sm text-[#64748B] line-clamp-2">{n.body}</p>
                  <p className="text-xs text-[#94A3B8] mt-1">{n.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#CBD5E1] shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4">
          <h3 className="font-semibold text-[#0F172A] mb-3 font-[family-name:var(--font-heading)]">{t("recentActivity")}</h3>
          <div className="bg-white rounded-2xl divide-y divide-slate-100 shadow-sm">
            {recentActivity.map((activity) => (
              <div key={activity.visit} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#0D9488]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0F172A]">{activity.visit}</p>
                    <p className="text-sm text-[#64748B]">{activity.date}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  {activity.status === "Done" ? t("done") : activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav 
        activeTab={activeTab} 
        role="patient"
        notificationCount={2}
        onTabChange={(tab) => {
          setActiveTab(tab)
          if (tab === "my-trial") onNavigate("my-visits")
          if (tab === "chat")     onNavigate("chat")
          if (tab === "calendar") onNavigate("patient-calendar")
          if (tab === "me")       onNavigate("profile-settings")
        }} 
      />
    </div>
  )
}
