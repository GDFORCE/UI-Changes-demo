import * as React from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type KpiTone = "default" | "primary" | "success" | "warning" | "destructive"

const toneClasses: Record<KpiTone, { card: string; icon: string; value: string; label: string }> = {
  default: {
    card: "bg-card border-border",
    icon: "bg-muted text-muted-foreground",
    value: "text-foreground",
    label: "text-muted-foreground",
  },
  primary: {
    card: "bg-primary border-primary text-primary-foreground",
    icon: "bg-primary-foreground/15 text-primary-foreground",
    value: "text-primary-foreground",
    label: "text-primary-foreground/70",
  },
  success: {
    card: "bg-success/5 border-success/20",
    icon: "bg-success/10 text-success",
    value: "text-foreground",
    label: "text-muted-foreground",
  },
  warning: {
    card: "bg-warning/5 border-warning/20",
    icon: "bg-warning/10 text-warning",
    value: "text-foreground",
    label: "text-muted-foreground",
  },
  destructive: {
    card: "bg-destructive/5 border-destructive/20",
    icon: "bg-destructive/10 text-destructive",
    value: "text-destructive",
    label: "text-muted-foreground",
  },
}

interface KpiCardProps extends React.ComponentProps<"div"> {
  icon?: LucideIcon
  value: React.ReactNode
  label: string
  hint?: string
  tone?: KpiTone
  /** Optional trend delta, e.g. "+12%" (direction inferred from leading "-"). */
  delta?: string
}

export function KpiCard({
  icon: Icon,
  value,
  label,
  hint,
  tone = "default",
  delta,
  className,
  ...props
}: KpiCardProps) {
  const t = toneClasses[tone]
  const deltaDown = delta?.trimStart().startsWith("-")
  const DeltaIcon = deltaDown ? TrendingDown : TrendingUp
  return (
    <Card
      className={cn(
        "gap-3 rounded-xl p-4 py-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm motion-reduce:transform-none",
        t.card,
        className,
      )}
      {...props}
    >
      {(Icon || delta) && (
        <div className="flex items-start justify-between">
          {Icon && (
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", t.icon)}>
              <Icon className="h-4 w-4" />
            </div>
          )}
          {delta && (
            <span
              className={cn(
                "ml-auto inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                tone === "primary"
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : deltaDown
                    ? "bg-destructive/10 text-destructive"
                    : "bg-success/10 text-success",
              )}
            >
              <DeltaIcon className="h-3 w-3" />
              {delta}
            </span>
          )}
        </div>
      )}
      <div className="space-y-0.5">
        <p className={cn("font-heading text-2xl font-semibold leading-none tracking-tight", t.value)}>{value}</p>
        <p className={cn("text-xs", t.label)}>{label}</p>
        {hint && <p className={cn("text-xs", t.label, "opacity-80")}>{hint}</p>}
      </div>
    </Card>
  )
}
