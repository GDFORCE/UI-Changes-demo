"use client"

import { StatusBar } from "./status-bar"
import { cn } from "@/lib/utils"

interface MobileFrameProps {
  children: React.ReactNode
  className?: string
  statusBarClassName?: string
}

export function MobileFrame({ children, className, statusBarClassName }: MobileFrameProps) {
  return (
    <div className={cn("w-[375px] h-[812px] bg-background rounded-[40px] overflow-hidden shadow-xl border-8 border-slate-900 relative", className)}>
      <div className={statusBarClassName}>
        <StatusBar />
      </div>
      <div className="h-[calc(100%-40px)] overflow-auto">
        {children}
      </div>
    </div>
  )
}
