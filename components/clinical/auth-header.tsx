"use client"

import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuthHeaderProps {
  /** Small-caps line above the title, e.g. "Step 2 of 5". */
  eyebrow?: string
  /** Large Fraunces serif title. Omit for screens that compose their own. */
  title?: string
  /** Supporting line under the title. */
  subtitle?: string
  onBack?: () => void
  /** 1-based current step for the segmented progress rule. */
  step?: number
  totalSteps?: number
  className?: string
}

/**
 * Light editorial header used across the pre-login flow: a hairline back
 * button, a small-caps eyebrow, a serif title, and a segmented progress rule
 * with a coral active segment.
 */
export function AuthHeader({ eyebrow, title, subtitle, onBack, step, totalSteps = 5, className }: AuthHeaderProps) {
  return (
    <div className={cn("px-6 pt-4 pb-2 bg-background", className)}>
      <div className="flex items-center justify-between mb-5">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/70 shadow-xs transition-colors hover:text-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <span className="h-10 w-10" />
        )}
        {step !== undefined && (
          <div className="flex items-center gap-1.5" aria-label={`Step ${step} of ${totalSteps}`}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i < step - 1 ? "w-4 bg-primary/35" : i === step - 1 ? "w-7 bg-accent" : "w-4 bg-border",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {eyebrow && <p className="eyebrow text-accent mb-1.5 animate-rise" style={{ animationDelay: "40ms" }}>{eyebrow}</p>}
      {title && (
        <h1 className="display-serif text-[28px] leading-tight text-foreground animate-rise" style={{ animationDelay: "100ms" }}>
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground animate-rise" style={{ animationDelay: "160ms" }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
