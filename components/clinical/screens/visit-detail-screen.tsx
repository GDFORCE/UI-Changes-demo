"use client"

import { AppBar } from "../app-bar"
import { Calendar, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface VisitDetailScreenProps {
  onUpdate: () => void
  onBack: () => void
}

export function VisitDetailScreen({ onUpdate, onBack }: VisitDetailScreenProps) {
  const [selectedStatus, setSelectedStatus] = useState("completed")
  const [clinicalTasks, setClinicalTasks] = useState({
    vitals: true,
    blood: true,
    ecg: false,
    physical: false,
  })
  const [adminTasks, setAdminTasks] = useState({
    ecrf: true,
    consent: false,
  })

  const statuses = [
    { id: "completed", label: "Completed", color: "border-[#2563EB] bg-blue-50" },
    { id: "scheduled", label: "Scheduled", color: "border-gray-300" },
    { id: "screen-pass", label: "Screen Pass", color: "border-gray-300" },
    { id: "screen-fail", label: "Screen Fail", color: "border-[#DC2626]" },
    { id: "withdrawn", label: "Withdrawn", color: "border-gray-300" },
    { id: "drop-out", label: "Drop Out", color: "border-gray-300" },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar title="Visit Detail" showBack onBack={onBack} />
      
      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {/* Info Card */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Follow-Up Visit</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-[#1A3872]" />
              <span>23 May 2025</span>
            </div>
            <p className="text-gray-600">Window: 20 May – 26 May</p>
            <p className="text-gray-600">Protocol-001</p>
            <p className="text-gray-600">Apollo Hospital • Dr. Sharma</p>
          </div>
        </div>
        
        {/* Status Selector */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Status</h4>
          <div className="grid grid-cols-3 gap-2">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={cn(
                  "py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all relative",
                  selectedStatus === status.id
                    ? status.color + " text-gray-900"
                    : "border-gray-200 text-gray-600 bg-white"
                )}
              >
                {selectedStatus === status.id && (
                  <Check className="absolute top-1 right-1 w-4 h-4 text-[#2563EB]" />
                )}
                {status.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Clinical Tasks */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Clinical Tasks</h4>
          <div className="bg-white rounded-2xl p-4 space-y-3">
            {Object.entries(clinicalTasks).map(([key, checked]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setClinicalTasks({ ...clinicalTasks, [key]: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#0D9488] focus:ring-[#0D9488]"
                />
                <span className={cn("text-gray-700", checked && "text-[#0D9488]")}>
                  {key === "vitals" && "Vital signs"}
                  {key === "blood" && "Blood draw"}
                  {key === "ecg" && "ECG"}
                  {key === "physical" && "Physical exam"}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Admin Tasks */}
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Admin Tasks</h4>
          <p className="text-xs text-gray-500 mb-3">PI/CRC only</p>
          <div className="bg-white rounded-2xl p-4 space-y-3">
            {Object.entries(adminTasks).map(([key, checked]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setAdminTasks({ ...adminTasks, [key]: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#0D9488] focus:ring-[#0D9488]"
                />
                <span className={cn("text-gray-700", checked && "text-[#0D9488]")}>
                  {key === "ecrf" && "eCRF entry"}
                  {key === "consent" && "Informed consent"}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Comments</label>
          <textarea
            rows={3}
            placeholder="Add notes about this visit..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none resize-none bg-white"
          />
        </div>
      </div>
      
      {/* Update Button */}
      <div className="px-4 py-4 bg-white border-t">
        <button
          onClick={onUpdate}
          className="w-full py-4 rounded-full font-semibold bg-[#1A3872] text-white"
        >
          Update Visit Status
        </button>
      </div>
    </div>
  )
}
