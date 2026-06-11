"use client"

import { Signal, Wifi, Battery } from "lucide-react"

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 py-2 bg-primary-deep text-primary-foreground text-sm">
      <span className="font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5 opacity-90">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-5 h-5" />
      </div>
    </div>
  )
}
