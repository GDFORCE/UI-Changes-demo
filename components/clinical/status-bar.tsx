"use client"

import { Signal, Wifi, Battery } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusBarProps {
  className?: string
}

export function StatusBar({ className }: StatusBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-2 bg-primary-deep text-primary-foreground text-sm",
        className,
      )}
    >
      <span className="font-semibold tracking-tight tabular-nums">9:41</span>
      <div className="flex items-center gap-1.5 opacity-90">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-5 h-5" />
      </div>
    </div>
  )
}
