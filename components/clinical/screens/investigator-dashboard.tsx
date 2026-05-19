"use client"

import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import { Users, Calendar, AlertTriangle, Plus, Clock } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface InvestigatorDashboardProps {
  onNavigate: (screen: string) => void
}

export function InvestigatorDashboard({ onNavigate }: InvestigatorDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const kpiCards = [
    { value: "12", icon: Users, label: "Patients", color: "bg-blue-50", textColor: "text-gray-900" },
    { value: "3", icon: Calendar, label: "Today", color: "bg-[#1A3872]", textColor: "text-white", iconColor: "text-white" },
    { value: "2", icon: AlertTriangle, label: "Overdue", color: "bg-red-50", textColor: "text-[#DC2626]" },
  ]

  const todayVisits = [
    { id: "SUBJ-001", protocol: "Protocol-A", visit: "Visit 3", time: "09:00", status: "Scheduled", statusColor: "bg-blue-100 text-[#1A3872]" },
    { id: "SUBJ-007", protocol: "Protocol-B", visit: "Visit 1", time: "11:30", status: "Screening", statusColor: "bg-teal-100 text-[#0D9488]" },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar
        title="Investigator Dashboard"
        subtitle="Mon, 19 May 2025"
        notificationCount={2}
        avatar="DR"
      />
      
      <div className="flex-1 overflow-auto pb-20">
        {/* KPI Cards */}
        <div className="px-4 py-4">
          <div className="flex gap-3">
            {kpiCards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.label} className={`flex-1 p-4 rounded-2xl ${card.color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-2xl font-bold ${card.textColor}`}>{card.value}</span>
                    <Icon className={cn("w-5 h-5", card.iconColor || "text-[#1A3872]")} />
                  </div>
                  <span className={cn("text-sm", card.textColor === "text-white" ? "text-blue-200" : "text-gray-600")}>{card.label}</span>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Today's Visits */}
        <div className="px-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">{"Today's Visits"}</h3>
          <div className="bg-white rounded-2xl divide-y divide-gray-100">
            {todayVisits.map((visit) => (
              <div key={visit.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{visit.id}</span>
                    <span className="text-xs text-gray-500">{visit.protocol}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{visit.visit}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{visit.time}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${visit.statusColor}`}>
                  {visit.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Attention Needed */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[#D97706]" />
            <h3 className="font-semibold text-gray-900">Attention Needed</h3>
          </div>
          <div className="bg-white rounded-2xl border-l-4 border-[#DC2626] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">SUBJ-003</span>
              <span className="text-[#DC2626] text-sm font-medium">4 days overdue</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Protocol-C • Visit 5</p>
            <button className="w-full py-2 bg-[#DC2626] text-white rounded-lg font-medium text-sm">
              Update Status
            </button>
          </div>
        </div>
      </div>
      
      {/* FAB */}
      <button className="absolute bottom-20 right-4 w-14 h-14 bg-[#1A3872] rounded-full shadow-xl flex items-center justify-center">
        <Plus className="w-6 h-6 text-white" />
      </button>
      
      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab)
        if (tab === "patients") onNavigate("patient-list")
        if (tab === "calendar") onNavigate("calendar")
        if (tab === "notifs") onNavigate("notifications")
      }} />
    </div>
  )
}
