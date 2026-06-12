"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"

interface MtbLogoMarkProps {
  className?: string
  /**
   * "tile"  — full-color mark on its own navy gradient tile (use on any surface)
   * "plain" — journey line + dot only, line in currentColor (use inside a card/tile you control)
   */
  variant?: "tile" | "plain"
}

/**
 * MTB — My Trial Board logo mark.
 * The "M" is one continuous journey line: a patient's path across scheduled
 * visits (reads as a pulse). The teal dot is the patient at the center of the
 * trial — the next visit milestone.
 */
export function MtbLogoMark({ className, variant = "tile" }: MtbLogoMarkProps) {
  const id = useId()
  const tileId = `${id}-tile`
  const glowId = `${id}-glow`
  const dotId = `${id}-dot`

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="My Trial Board"
    >
      <defs>
        <linearGradient id={tileId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "color-mix(in oklch, var(--primary), white 18%)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--primary)" }} />
          <stop offset="1" style={{ stopColor: "var(--primary-deep)" }} />
        </linearGradient>
        <radialGradient id={glowId} cx="32" cy="4" r="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--primary-foreground)" }} stopOpacity="0.18" />
          <stop offset="1" style={{ stopColor: "var(--primary-foreground)" }} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={dotId} x1="28.4" y1="16.4" x2="35.6" y2="23.6" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "color-mix(in oklch, var(--accent), white 30%)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent)" }} />
        </linearGradient>
      </defs>

      {variant === "tile" && (
        <>
          <rect width="64" height="64" rx="14.5" fill={`url(#${tileId})`} />
          <rect width="64" height="64" rx="14.5" fill={`url(#${glowId})`} />
        </>
      )}

      <path
        d="M15 45.5 L22.5 21.5 L32 39 L41.5 21.5 L49 45.5"
        stroke={variant === "tile" ? "var(--primary-foreground)" : "currentColor"}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="20" r="3.6" fill={`url(#${dotId})`} />
    </svg>
  )
}
