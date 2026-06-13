"use client"

import { StatusBar } from "./status-bar"
import { cn } from "@/lib/utils"

interface MobileFrameProps {
  children: React.ReactNode
  className?: string
  /** Merged into the StatusBar itself — e.g. "bg-transparent text-foreground absolute …". */
  statusBarClassName?: string
}

export function MobileFrame({ children, className, statusBarClassName }: MobileFrameProps) {
  const floatingStatusBar = statusBarClassName?.includes("absolute")
  return (
    <div className={cn("mobile-frame w-[375px] h-[812px] bg-background rounded-[40px] overflow-hidden shadow-xl border-8 border-[oklch(0.24_0.02_160)] relative", className)}>
      <StatusBar className={statusBarClassName} />
      <div className={cn("overflow-auto", floatingStatusBar ? "h-full" : "h-[calc(100%-40px)]")}>
        {children}
      </div>
    </div>
  )
}
