"use client"

import { AppBar } from "../app-bar"
import { Download, Edit, AlertTriangle, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface VisitScheduleScreenProps {
  onSave: () => void
  onBack: () => void
}

export function VisitScheduleScreen({ onSave, onBack }: VisitScheduleScreenProps) {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedVisit, setSelectedVisit] = useState(2)

  const filters = [
    { id: "all", label: "All", count: 18 },
    { id: "pending", label: "Pending", count: 2 },
    { id: "ok", label: "OK", count: 16 },
  ]

  const visits = [
    { num: 1, name: "Screening", day: -14, window: "±3", warning: false },
    { num: 2, name: "Baseline", day: 1, window: "-2/+2", warning: false },
    { num: 3, name: "Follow-up", day: 7, window: "±2", warning: true },
    { num: 4, name: "Follow-up", day: 14, window: "±2", warning: false },
    { num: 5, name: "Follow-up", day: 28, window: "±3", warning: false },
    { num: 6, name: "End of Study", day: 56, window: "±5", warning: false },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar
        title="Visit Schedule"
        showBack
        onBack={onBack}
        rightContent={
          <div className="flex items-center gap-2">
            <button className="p-2">
              <Download className="w-5 h-5 text-white" />
            </button>
            <button className="p-2">
              <Edit className="w-5 h-5 text-white" />
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-auto">
        {/* Header Info */}
        <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
          <span className="text-sm text-gray-600">AI Extracted • 18 visits</span>
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="text-xs text-[#D97706] font-medium">2 need review</span>
          </div>
        </div>
        
        {/* Filters */}
        <div className="px-4 py-3 flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1",
                activeFilter === filter.id
                  ? "bg-[#1A3872] text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {activeFilter === filter.id && <Check className="w-3.5 h-3.5" />}
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Table */}
        <div className="px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-gray-50 border-b text-xs font-semibold text-gray-500">
              <span>#</span>
              <span>Visit Name</span>
              <span>Day</span>
              <span>Window</span>
            </div>
            
            {/* Table Body */}
            {visits.map((visit) => (
              <button
                key={visit.num}
                onClick={() => setSelectedVisit(visit.num)}
                className={cn(
                  "w-full grid grid-cols-4 gap-2 px-4 py-3 text-sm border-b last:border-b-0 text-left",
                  selectedVisit === visit.num ? "bg-blue-50" : "bg-white"
                )}
              >
                <span className={cn("font-medium", visit.warning ? "text-[#D97706]" : "text-gray-900")}>
                  {visit.warning && "⚠️ "}{visit.num}
                </span>
                <span className="text-gray-700">{visit.name}</span>
                <span className="text-gray-700">{visit.day}</span>
                <span className="text-gray-500">{visit.window}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Selected Visit Details */}
        <div className="px-4 py-4">
          <div className="bg-white rounded-2xl border-l-4 border-[#2563EB] p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Visit 2 - Baseline</h4>
              <span className="text-sm text-gray-500">Day 1</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Window: -2/+2 days</p>
            
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Clinical Tasks</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Vital signs</li>
                <li>• Blood draw</li>
                <li>• ECG</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Admin Tasks</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Informed Consent</li>
                <li>• eCRF</li>
              </ul>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Comments</label>
              <textarea
                rows={2}
                placeholder="Add comments..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Buttons */}
      <div className="px-4 py-4 bg-white border-t flex gap-3">
        <button className="flex-1 py-3 border-2 border-[#1A3872] text-[#1A3872] rounded-full font-medium">
          + Add Visit
        </button>
        <button
          onClick={onSave}
          className="flex-1 py-3 bg-[#1A3872] text-white rounded-full font-medium"
        >
          Save Template
        </button>
      </div>
    </div>
  )
}
