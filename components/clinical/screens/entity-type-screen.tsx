"use client"

import { AuthHeader } from "../auth-header"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface EntityTypeScreenProps {
  selectedEntity: string | null
  onSelect: (entity: string) => void
  onContinue: () => void
  onBack: () => void
}

const entities = [
  { id: "sponsor", label: "Sponsor" },
  { id: "cro", label: "CRO" },
  { id: "smo", label: "SMO" },
  { id: "site", label: "Site / Hospital" },
]

/**
 * Entity selection as a Dawn Rounds index — numbered rows, Bricolage display
 * names, and an apricot spine + index marker on the selected entry.
 */
export function EntityTypeScreen({ selectedEntity, onSelect, onContinue, onBack }: EntityTypeScreenProps) {
  return (
    <div className="h-full flex flex-col bg-background paper-grain">
      <AuthHeader
        eyebrow="Step 1 of 5"
        title="I am joining as…"
        subtitle="Choose the role that best describes you. Your registration form adapts to it."
        onBack={onBack}
        step={1}
      />

      <div className="flex-1 px-6 pt-4 pb-2 overflow-auto" role="radiogroup" aria-label="Entity type">
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          {entities.map((entity, i) => {
            const isSelected = selectedEntity === entity.id
            return (
              <button
                key={entity.id}
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelect(entity.id)}
                className={cn(
                  "group relative w-full flex items-center gap-4 px-5 py-7 text-left transition-colors duration-200 animate-rise",
                  i > 0 && "border-t border-border",
                  isSelected ? "bg-secondary/45" : "hover:bg-surface",
                )}
                style={{ animationDelay: `${180 + i * 70}ms` }}
              >
                {/* apricot spine on the selected row */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-[3px] bg-accent transition-transform duration-300 origin-top",
                    isSelected ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <span
                  className={cn(
                    "font-heading text-lg tabular-nums w-7 shrink-0 transition-colors",
                    isSelected ? "text-accent" : "text-muted-foreground/45",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={cn("block font-heading text-[17px] leading-snug transition-colors", isSelected ? "text-primary" : "text-foreground")}>
                    {entity.label}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-transparent group-hover:border-primary/40",
                  )}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              </button>
            )
          })}
        </div>

        <p className="eyebrow text-muted-foreground/55 text-center mt-5 mb-3">
          Platform access is role-based
        </p>
      </div>

      <div className="px-6 pb-7 pt-2">
        <button
          onClick={onContinue}
          disabled={!selectedEntity}
          className={cn(
            "springy w-full py-4 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            selectedEntity
              ? "bg-primary text-primary-foreground shadow-md hover:bg-primary-deep active:scale-[0.97]"
              : "bg-muted text-muted-foreground/60 cursor-not-allowed",
          )}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
