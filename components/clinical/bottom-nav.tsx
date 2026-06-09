"use client"

import { Home, Users, Calendar, Bell, User, FlaskConical, MapPin, LayoutDashboard, MessageCircle, ClipboardList, ShieldCheck, BarChart3, ScrollText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"

export type UserRole = "patient" | "sponsor" | "investigator" | "pi" | "crc" | "admin"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  role?: UserRole
  notificationCount?: number
}

const patientTabs = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "my-trial", label: "My Visits", icon: FlaskConical },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "notifs", label: "Notifs", icon: Bell },
  { id: "me", label: "Me", icon: User },
]

const sponsorTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "trials", label: "Trials", icon: FlaskConical },
  { id: "chat", label: "Messages", icon: MessageCircle },
  { id: "notifs", label: "Notifs", icon: Bell },
  { id: "me", label: "Me", icon: User },
]

const investigatorTabs = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "patients", label: "Patients", icon: Users },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "notifs", label: "Notifs", icon: Bell },
  { id: "me", label: "Me", icon: User },
]

const piTabs = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "my-trials", label: "My Trials", icon: FlaskConical },
  { id: "chat", label: "Messages", icon: MessageCircle },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "me", label: "Me", icon: User },
]

const crcTabs = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "patients", label: "Patients", icon: Users },
  { id: "chat", label: "Messages", icon: MessageCircle },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "me", label: "Me", icon: User },
]

const adminTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "audit", label: "Audit", icon: ScrollText },
  { id: "notifs", label: "Notifs", icon: Bell },
  { id: "me", label: "Me", icon: User },
]

const patientTabs2 = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "my-trial", label: "My Visits", icon: FlaskConical },
  { id: "chat", label: "Messages", icon: MessageCircle },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "me", label: "Me", icon: User },
]

// Maps the English nav labels to translation keys. Labels not listed here
// (e.g. sponsor/admin-only tabs) are shown verbatim.
const navLabelKeys: Record<string, string> = {
  "Home": "nav.home",
  "My Visits": "nav.myVisits",
  "Calendar": "nav.calendar",
  "Notifs": "nav.notifs",
  "Me": "nav.me",
  "Messages": "nav.messages",
}

export function BottomNav({ activeTab, onTabChange, role = "investigator", notificationCount = 0 }: BottomNavProps) {
  const { t } = useLanguage()
  const tabs =
    role === "patient" ? patientTabs2 :
    role === "sponsor" ? sponsorTabs :
    role === "pi" ? piTabs :
    role === "crc" ? crcTabs :
    role === "admin" ? adminTabs :
    investigatorTabs
  
  return (
    <div className="flex items-center justify-around h-16 bg-white border-t border-slate-100">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex flex-col items-center gap-1 px-3 py-2 transition-colors",
              isActive ? "text-[#0D1B3E]" : "text-slate-400"
            )}
          >
            {/* Active indicator line */}
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#0D1B3E] rounded-full" />
            )}
            <div className="relative">
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
              {/* Notification badge */}
              {tab.id === "notifs" && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{navLabelKeys[tab.label] ? t(navLabelKeys[tab.label]) : tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
