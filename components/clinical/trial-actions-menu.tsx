"use client"

import { useState } from "react"
import { MoreVertical, Pencil, Download, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrialActionsMenuProps {
  onEdit?: () => void
  onDownload?: () => void
  onShare?: () => void
  /** Extra classes for the trigger button (e.g. text colour on a dark header). */
  triggerClassName?: string
}

// Standardized "⋮" action menu shown in the top-right of every Trial Summary
// page (sponsor / PI / CRC). Offers Edit, Download and Share in one place.
export function TrialActionsMenu({ onEdit, onDownload, onShare, triggerClassName }: TrialActionsMenuProps) {
  const [open, setOpen] = useState(false)

  const items = [
    onEdit && { label: "Edit", icon: Pencil, onClick: onEdit },
    onDownload && { label: "Download", icon: Download, onClick: onDownload },
    onShare && { label: "Share", icon: Share2, onClick: onShare },
  ].filter(Boolean) as { label: string; icon: typeof Pencil; onClick: () => void }[]

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn("p-1.5 rounded-lg transition-colors hover:bg-white/10", triggerClassName)}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="menu"
            className="absolute right-0 top-full mt-1 z-50 w-40 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg"
          >
            {items.map(it => {
              const Icon = it.icon
              return (
                <button
                  key={it.label}
                  type="button"
                  role="menuitem"
                  onClick={() => { setOpen(false); it.onClick() }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground hover:bg-surface"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  {it.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
