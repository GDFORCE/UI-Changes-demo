import * as React from "react"
import { ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.ComponentProps<"div"> {
  icon?: LucideIcon
  iconClassName?: string
  title: string
  count?: number
  countTone?: "default" | "destructive" | "muted"
  action?: {
    label: string
    onClick: () => void
  }
}

const countToneClasses: Record<NonNullable<SectionHeaderProps["countTone"]>, string> = {
  default: "bg-primary/10 text-primary border-transparent",
  destructive: "bg-destructive text-white border-transparent",
  muted: "bg-muted text-muted-foreground border-transparent",
}

export function SectionHeader({
  icon: Icon,
  iconClassName,
  title,
  count,
  countTone = "default",
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3", className)}
      {...props}
    >
      <div className="flex items-center gap-2 min-w-0">
        {Icon && (
          <Icon
            className={cn("h-4 w-4 shrink-0 text-muted-foreground", iconClassName)}
          />
        )}
        <h2 className="font-heading text-base font-semibold tracking-tight text-foreground truncate">
          {title}
        </h2>
        {count !== undefined && count > 0 && (
          <Badge
            variant="outline"
            className={cn("h-5 px-1.5 text-[10px]", countToneClasses[countTone])}
          >
            {count}
          </Badge>
        )}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="flex items-center gap-1 rounded-md text-sm font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {action.label}
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
