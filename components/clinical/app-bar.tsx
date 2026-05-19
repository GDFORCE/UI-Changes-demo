"use client"

import { ChevronLeft, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppBarProps {
  title: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  rightContent?: React.ReactNode
  notificationCount?: number
  avatar?: string
  className?: string
}

export function AppBar({
  title,
  subtitle,
  showBack,
  onBack,
  rightContent,
  notificationCount,
  avatar,
  className,
}: AppBarProps) {
  return (
    <div className={cn("flex items-center justify-between px-4 py-3 bg-[#0D1B3E] text-white", className)}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <div>
          <h1 className="font-semibold text-lg">{title}</h1>
          {subtitle && <p className="text-sm text-blue-300">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {rightContent}
        {notificationCount !== undefined && (
          <div className="relative">
            <Bell className="w-6 h-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>
        )}
        {avatar && (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold">
            {avatar}
          </div>
        )}
      </div>
    </div>
  )
}
