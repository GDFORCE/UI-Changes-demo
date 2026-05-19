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
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar title="Who are you?" showBack onBack={onBack} />
      
      {/* Progress Bar */}
      <div className="px-4 py-3 bg-white">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#1A3872] rounded-full" style={{ width: "20%" }} />
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
                  "relative h-28 rounded-2xl border-2 bg-white flex flex-col items-center justify-center gap-2 transition-all",
                  isSelected ? "border-[#1A3872] bg-blue-50" : "border-gray-200"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#1A3872] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <Icon className={cn("w-8 h-8", isSelected ? "text-[#1A3872]" : "text-gray-500")} />
                <span className={cn("text-sm font-medium", isSelected ? "text-[#1A3872]" : "text-gray-700")}>
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
            "relative w-40 mx-auto h-28 rounded-2xl border-2 bg-white flex flex-col items-center justify-center gap-2 transition-all",
            selectedEntity === "patient" ? "border-[#1A3872] bg-blue-50" : "border-gray-200"
          )}
        >
          {selectedEntity === "patient" && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-[#1A3872] rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          <User className={cn("w-8 h-8", selectedEntity === "patient" ? "text-[#1A3872]" : "text-gray-500")} />
          <span className={cn("text-sm font-medium", selectedEntity === "patient" ? "text-[#1A3872]" : "text-gray-700")}>
            Patient
          </span>
        </button>
      </div>
      
      {/* Continue Button */}
      <div className="px-4 py-4 bg-white border-t">
        <button
          onClick={onContinue}
          disabled={!selectedEntity}
          className={cn(
            "w-full py-4 rounded-full font-semibold transition-all",
            selectedEntity
              ? "bg-[#1A3872] text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
