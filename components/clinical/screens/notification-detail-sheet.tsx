"use client"

import { Bell, Calendar, ChevronRight, X } from "lucide-react"

interface NotificationDetailSheetProps {
  onClose: () => void
  onViewDetails: () => void
}

export function NotificationDetailSheet({ onClose, onViewDetails }: NotificationDetailSheetProps) {
  return (
    <div className="absolute inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      
      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl animate-in slide-in-from-bottom">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>
        
        {/* Content */}
        <div className="px-6 pb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Patient Visit Reminder</h3>
              <p className="text-sm text-gray-500">2:30 PM · 19 May 2025</p>
            </div>
            <button onClick={onClose} className="p-1">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="h-px bg-gray-200 mb-4" />
          
          <div className="space-y-3 mb-6">
            <p className="font-semibold text-gray-900">SUBJ-001 · Visit 4</p>
            <p className="text-gray-600">Follow-Up Visit</p>
            <p className="text-[#1A3872] font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Scheduled: 20 May 2025
            </p>
            <p className="text-gray-500">Window: 17 May – 23 May</p>
            <p className="text-gray-600">Apollo Hospital · Dr. Sharma</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onViewDetails}
              className="w-full py-4 rounded-full font-semibold bg-[#1A3872] text-white flex items-center justify-center gap-2"
            >
              View Visit Details <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-full font-semibold border-2 border-gray-300 text-gray-600"
            >
              Mark as Read
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
