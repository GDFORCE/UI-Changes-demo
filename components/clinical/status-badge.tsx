import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import { Badge, badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusTone = "success" | "warning" | "destructive" | "info" | "muted"

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  muted: "bg-muted text-muted-foreground border-border",
}

const dotClasses: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
  muted: "bg-muted-foreground",
}

const statusToneMap: Record<string, StatusTone> = {
  Active: "success",
  Completed: "success",
  "Screen Pass": "success",
  Overdue: "destructive",
  "Screen Fail": "destructive",
  Terminated: "destructive",
  Failed: "destructive",
  Screening: "warning",
  Pending: "warning",
  Scheduled: "info",
  Upcoming: "info",
  Withdrawn: "muted",
  Inactive: "muted",
  "Drop Out": "muted",
  Dropout: "muted",
}

type ShadcnVariant = VariantProps<typeof badgeVariants>["variant"]

interface StatusBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "variant" | "children"> {
  status: string
  tone?: StatusTone
  variant?: ShadcnVariant
  /** Show a small status dot before the label. */
  dot?: boolean
  children?: React.ReactNode
}

export function StatusBadge({
  status,
  tone,
  variant = "outline",
  dot,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const resolvedTone: StatusTone = tone ?? statusToneMap[status] ?? "muted"
  return (
    <Badge
      variant={variant}
      className={cn(toneClasses[resolvedTone], "rounded-full font-medium", className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          className={cn("size-1.5 shrink-0 rounded-full", dotClasses[resolvedTone])}
        />
      )}
      {children ?? status}
    </Badge>
  )
}
