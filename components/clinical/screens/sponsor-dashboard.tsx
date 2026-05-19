"use client"

import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import { FlaskConical, MapPin, Users, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"

interface SponsorDashboardProps {
  onNavigate: (screen: string) => void
}

export function SponsorDashboard({ onNavigate }: SponsorDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const kpiCards = [
    { value: "12", icon: FlaskConical, label: "Trials", color: "bg-blue-50" },
    { value: "8", icon: MapPin, label: "Sites", color: "bg-teal-50" },
    { value: "247", icon: Users, label: "Patients", color: "bg-amber-50" },
  ]

  const sitePerformance = [
    { name: "Apollo Mumbai", progress: 85 },
    { name: "Max Delhi", progress: 72 },
    { name: "Fortis Bangalore", progress: 65 },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar
        title="Good morning, Rajesh ☀️"
        notificationCount={2}
        avatar="RK"
      />
      
      <div className="flex-1 overflow-auto pb-4">
        {/* KPI Cards */}
        <div className="px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {kpiCards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.label} className={`flex-shrink-0 w-28 p-4 rounded-2xl ${card.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                    <Icon className="w-5 h-5 text-[#1A3872]" />
                  </div>
                  <span className="text-sm text-gray-600">{card.label}</span>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Recruitment Overview */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Recruitment Overview</h3>
            <button className="text-[#1A3872] text-sm font-medium flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Trial Card */}
          <div className="bg-white rounded-2xl shadow-sm border-l-4 border-[#2563EB] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-100 text-[#1A3872] text-xs rounded-full font-medium">
                Protocol-001
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-3">Diabetes Phase II</h4>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Screened</span>
                <span className="font-semibold">48</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Randomized</span>
                <span className="font-semibold">32</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Screen Fail</span>
                <span className="font-semibold text-[#DC2626]">8</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Completed</span>
                <span className="font-semibold text-[#0D9488]">12</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "65%" }} />
            </div>
            <span className="text-xs text-gray-500 mt-1 block">65% Complete</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="px-4 mb-4">
          <div className="flex gap-3">
            <button className="flex-1 py-3 border-2 border-[#1A3872] text-[#1A3872] rounded-xl font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Trial
            </button>
            <button className="flex-1 py-3 border-2 border-[#1A3872] text-[#1A3872] rounded-xl font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Site
            </button>
          </div>
        </div>
        
        {/* Site Performance */}
        <div className="px-4">
          <h3 className="font-semibold text-gray-900 mb-3">Site Performance</h3>
          <div className="bg-white rounded-2xl p-4 space-y-4">
            {sitePerformance.map((site) => (
              <div key={site.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{site.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{site.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] rounded-full"
                    style={{ width: `${site.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab)
        if (tab === "patients") onNavigate("patient-list")
        if (tab === "calendar") onNavigate("calendar")
        if (tab === "notifs") onNavigate("notifications")
      }} />
    </div>
  )
}
