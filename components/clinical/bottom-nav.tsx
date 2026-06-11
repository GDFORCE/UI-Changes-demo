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
    <div className="flex items-center justify-around h-16 bg-card/95 backdrop-blur-sm border-t border-border pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex h-full min-w-14 flex-col items-center justify-center gap-1 px-3 transition-colors duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:rounded-lg",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Active indicator line */}
            <div
              className={cn(
                "absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all duration-200",
                isActive ? "w-8 opacity-100" : "w-0 opacity-0"
              )}
            />
            <div className="relative">
              <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive && "stroke-[2.5px] -translate-y-px")} />
              {/* Notification badge */}
              {tab.id === "notifs" && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-destructive text-white text-[10px] font-bold rounded-full ring-2 ring-card">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </div>
            <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>{navLabelKeys[tab.label] ? t(navLabelKeys[tab.label]) : tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
