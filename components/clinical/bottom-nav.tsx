"use client"

import { Home, Users, Calendar, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "patients", label: "Patients", icon: Users },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "notifs", label: "Notifs", icon: Bell },
  { id: "me", label: "Me", icon: User },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="flex items-center justify-around py-2 bg-white border-t border-gray-200">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1",
              isActive ? "text-[#1A3872]" : "text-gray-500"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "fill-current" : "")} />
            <span className="text-xs">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
