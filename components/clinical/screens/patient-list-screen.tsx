"use client"

import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import { Search, Plus } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PatientListScreenProps {
  onNavigate: (screen: string) => void
  onBack: () => void
}

export function PatientListScreen({ onNavigate, onBack }: PatientListScreenProps) {
  const [activeTab, setActiveTab] = useState("patients")
  const [activeFilter, setActiveFilter] = useState("all")

  const filters = [
    { id: "all", label: "All", count: 12 },
    { id: "active", label: "Active", count: 8 },
    { id: "screen-fail", label: "Screen Fail", count: 2 },
    { id: "withdrawn", label: "Withdrawn", count: 2 },
  ]

  const patients = [
    { id: "SUBJ-001", initials: "PK", name: "Priya K.", visit: "Visit 3 · 23 May", status: "Scheduled", statusColor: "bg-blue-100 text-[#1A3872]" },
    { id: "SUBJ-002", initials: "RS", name: "Rahul S.", visit: "Visit 1 · Today", status: "⚠ Overdue", statusColor: "bg-red-100 text-[#DC2626]" },
    { id: "SUBJ-003", initials: "AM", name: "Anjali M.", visit: "Visit 5 · 2 Jun", status: "Active", statusColor: "bg-teal-100 text-[#0D9488]" },
    { id: "SUBJ-004", initials: "VG", name: "Vikram G.", visit: "—", status: "Screen Fail", statusColor: "bg-red-100 text-[#DC2626]" },
    { id: "SUBJ-005", initials: "NK", name: "Neha K.", visit: "—", status: "Withdrawn", statusColor: "bg-gray-100 text-gray-600" },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar title="Patients" showBack onBack={onBack} />
      
      <div className="flex-1 overflow-auto pb-20">
        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 rounded-full">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by Subject ID..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-500"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium",
                activeFilter === filter.id
                  ? "bg-[#1A3872] text-white"
                  : "bg-white text-gray-600 border border-gray-300"
              )}
            >
              {filter.label} {filter.count}
            </button>
          ))}
        </div>
        
        {/* Patient List */}
        <div className="px-4">
          <div className="bg-white rounded-2xl divide-y divide-gray-100 overflow-hidden">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => onNavigate("visit-detail")}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 bg-[#1A3872] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {patient.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{patient.id}</p>
                  <p className="text-sm text-gray-500 truncate">{patient.name} • {patient.visit}</p>
                </div>
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium flex-shrink-0", patient.statusColor)}>
                  {patient.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAB */}
      <button
        onClick={() => onNavigate("add-patient")}
        className="absolute bottom-20 right-4 w-14 h-14 bg-[#1A3872] rounded-full shadow-xl flex items-center justify-center"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
      
      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab)
        if (tab === "dashboard") onNavigate("sponsor-dashboard")
        if (tab === "calendar") onNavigate("calendar")
        if (tab === "notifs") onNavigate("notifications")
      }} />
    </div>
  )
}
