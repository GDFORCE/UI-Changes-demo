"use client"

import { AppBar } from "../app-bar"
import { Calendar, ChevronRight, Sparkles } from "lucide-react"

interface AddPatientScreenProps {
  onAdd: () => void
  onBack: () => void
}

export function AddPatientScreen({ onAdd, onBack }: AddPatientScreenProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar title="Add Patient" showBack onBack={onBack} />
      
      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject Number/ID *</label>
          <input
            type="text"
            defaultValue="SUBJ-"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject Initials</label>
          <input
            type="text"
            placeholder="e.g., PK"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
          <div className="flex gap-2">
            <div className="px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-600">
              +91
            </div>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Language</label>
          <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white appearance-none">
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
          </select>
        </div>
        
        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm font-medium">Visit Dates</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Baseline Date *</label>
          <div className="relative">
            <input
              type="text"
              defaultValue="5 May 2025"
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3872]" />
          </div>
        </div>
        
        {/* Auto-calculated Dates */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#1A3872]" />
            <span className="font-medium text-gray-900">Auto-calculated Dates</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Visit 1</span>
              <span className="text-gray-900 font-medium">5 May 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Visit 2</span>
              <span className="text-gray-900 font-medium">19 May 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Visit 3</span>
              <span className="text-gray-900 font-medium">26 May 2025</span>
            </div>
          </div>
          <button className="mt-3 text-[#0D9488] font-medium text-sm flex items-center gap-1">
            View All 18 Visits <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Add Button */}
      <div className="px-4 py-4 bg-white border-t">
        <button
          onClick={onAdd}
          className="w-full py-4 rounded-full font-semibold bg-[#1A3872] text-white"
        >
          Add Patient
        </button>
      </div>
    </div>
  )
}
