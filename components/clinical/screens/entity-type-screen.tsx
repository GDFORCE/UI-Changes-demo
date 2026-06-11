"use client"

import { AppBar } from "../app-bar"
import { Building2, FlaskConical, Building, Hotel, User, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface EntityTypeScreenProps {
  selectedEntity: string | null
  onSelect: (entity: string) => void
  onContinue: () => void
  onBack: () => void
}

const entities = [
  { id: "sponsor", label: "Sponsor", icon: Building2 },
  { id: "cro", label: "CRO", icon: FlaskConical },
  { id: "smo", label: "SMO", icon: Building },
  { id: "site", label: "Site/Hospital", icon: Hotel },
]

export function EntityTypeScreen({ selectedEntity, onSelect, onContinue, onBack }: EntityTypeScreenProps) {
  return (
    <div className="h-full flex flex-col bg-surface">
      <AppBar title="Who are you?" showBack onBack={onBack} />
      
      {/* Progress Bar */}
      <div className="px-4 py-3 bg-card">
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: "20%" }} />
        </div>
      </div>
      
      <div className="flex-1 px-4 py-6 overflow-auto">
        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {entities.map((entity) => {
            const Icon = entity.icon
            const isSelected = selectedEntity === entity.id
            return (
              <button
                key={entity.id}
                onClick={() => onSelect(entity.id)}
                className={cn(
                  "relative h-28 rounded-2xl border-2 bg-card flex flex-col items-center justify-center gap-2 transition-all",
                  isSelected ? "border-primary bg-info/5" : "border-border"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <Icon className={cn("w-8 h-8", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium", isSelected ? "text-primary" : "text-foreground/80")}>
                  {entity.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Patient Card */}
        <button
          onClick={() => onSelect("patient")}
          className={cn(
            "relative w-40 mx-auto h-28 rounded-2xl border-2 bg-card flex flex-col items-center justify-center gap-2 transition-all",
            selectedEntity === "patient" ? "border-primary bg-info/5" : "border-border"
          )}
        >
          {selectedEntity === "patient" && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          <User className={cn("w-8 h-8", selectedEntity === "patient" ? "text-primary" : "text-muted-foreground")} />
          <span className={cn("text-sm font-medium", selectedEntity === "patient" ? "text-primary" : "text-foreground/80")}>
            Patient
          </span>
        </button>
      </div>
      
      {/* Continue Button */}
      <div className="px-4 py-4 bg-card border-t">
        <button
          onClick={onContinue}
          disabled={!selectedEntity}
          className={cn(
            "w-full py-4 rounded-full font-semibold transition-all",
            selectedEntity
              ? "bg-primary text-white"
              : "bg-border text-muted-foreground/70 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
