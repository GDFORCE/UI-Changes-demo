"use client"

import { AppBar } from "../app-bar"
import { Search } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PatientListScreenProps {
  onNavigate: (screen: string) => void
  onBack: () => void
}

export function PatientListScreen({ onNavigate, onBack }: PatientListScreenProps) {
  const [activeFilter, setActiveFilter] = useState("all")

  const filters = [
    { id: "all", label: "All", count: 12 },
    { id: "active", label: "Active", count: 8 },
    { id: "screen-fail", label: "Screen Fail", count: 2 },
    { id: "withdrawn", label: "Withdrawn", count: 2 },
  ]

  const patients = [
    { id: "SUBJ-001", initials: "PK", name: "Priya K.", visit: "Visit 3 · 23 May", status: "Scheduled", statusColor: "bg-info/10 text-primary" },
    { id: "SUBJ-002", initials: "RS", name: "Rahul S.", visit: "Visit 1 · Today", status: "⚠ Overdue", statusColor: "bg-destructive/10 text-destructive" },
    { id: "SUBJ-003", initials: "AM", name: "Anjali M.", visit: "Visit 5 · 2 Jun", status: "Active", statusColor: "bg-accent/10 text-accent" },
    { id: "SUBJ-004", initials: "VG", name: "Vikram G.", visit: "—", status: "Screen Fail", statusColor: "bg-destructive/10 text-destructive" },
    { id: "SUBJ-005", initials: "NK", name: "Neha K.", visit: "—", status: "Withdrawn", statusColor: "bg-muted text-muted-foreground" },
  ]

  return (
    <div className="h-full flex flex-col bg-surface">
      <AppBar title="Patients" showBack onBack={onBack} />
      
      <div className="flex-1 overflow-auto pb-20">
        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 px-4 py-3 bg-border rounded-full">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Subject ID..."
              className="flex-1 bg-transparent outline-none text-foreground/80 placeholder:text-muted-foreground"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium",
                activeFilter === filter.id
                  ? "bg-primary text-white"
                  : "bg-card text-muted-foreground border border-border"
              )}
            >
              {filter.label} {filter.count}
            </button>
          ))}
        </div>
        
        {/* Patient List */}
        <div className="px-4">
          <div className="bg-card rounded-2xl divide-y divide-border overflow-hidden">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => onNavigate("visit-detail")}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {patient.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{patient.id}</p>
                  <p className="text-sm text-muted-foreground truncate">{patient.name} • {patient.visit}</p>
                </div>
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium flex-shrink-0", patient.statusColor)}>
                  {patient.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAB — sits above the global bottom nav so it doesn't overlap it */}
      <button
        onClick={() => onNavigate("add-patient")}
        className="absolute bottom-20 right-4 h-12 px-5 bg-primary rounded-full shadow-xl flex items-center justify-center"
      >
        <span className="text-white text-sm font-semibold whitespace-nowrap">Add Patient</span>
      </button>
    </div>
  )
}
