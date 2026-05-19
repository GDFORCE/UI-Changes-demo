"use client"

import { AppBar } from "../app-bar"
import { BottomNav } from "../bottom-nav"
import { ChevronRight, Check, Pill, Clock } from "lucide-react"
import { useState } from "react"

interface PatientDashboardProps {
  onNavigate: (screen: string) => void
}

export function PatientDashboard({ onNavigate }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [medicationTaken, setMedicationTaken] = useState(false)

  const recentActivity = [
    { visit: "Visit 6", date: "10 May", status: "Done" },
    { visit: "Visit 5", date: "22 Apr", status: "Done" },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar
        title="My Trial Journey"
        notificationCount={1}
        avatar="PK"
      />
      
      <div className="flex-1 overflow-auto pb-4">
        {/* Hero Card */}
        <div className="px-4 py-4">
          <div className="bg-[#1A3872] rounded-2xl p-5 text-white">
            <h2 className="text-xl font-bold mb-1">Hello, Priya 👋</h2>
            <p className="text-blue-200 text-sm mb-4">Protocol-001 • Dr. Sharma</p>
            
            <div className="mb-2">
              <span className="text-sm text-blue-200">Your Progress</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#0D9488]"
                style={{ width: "60%" }}
              />
            </div>
            <span className="text-sm text-blue-200">Visit 6 of 10 completed</span>
          </div>
        </div>
        
        {/* Next Visit Card */}
        <div className="px-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Next Visit</h3>
          <div className="bg-white rounded-2xl border-l-4 border-[#2563EB] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Visit 7</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-[#1A3872]">
                Upcoming
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Follow-Up Visit</p>
            <p className="text-sm text-[#1A3872] font-medium mb-1">23 May 2025</p>
            <p className="text-xs text-gray-500 mb-3">Window: 20 May – 26 May</p>
            <button className="text-[#1A3872] font-medium text-sm flex items-center gap-1">
              View Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Medication Card */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-5 h-5 text-[#1A3872]" />
            <h3 className="font-semibold text-gray-900">Medication</h3>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Metformin 500mg</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 8:00 AM
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={medicationTaken}
                  onChange={(e) => setMedicationTaken(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#0D9488] focus:ring-[#0D9488]"
                />
                <span className="text-sm text-gray-600">Confirm taken</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="px-4">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="bg-white rounded-2xl divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <div key={activity.visit} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#0D9488]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.visit}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-[#0D9488]">
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab)
        if (tab === "calendar") onNavigate("calendar")
        if (tab === "notifs") onNavigate("notifications")
      }} />
    </div>
  )
}
