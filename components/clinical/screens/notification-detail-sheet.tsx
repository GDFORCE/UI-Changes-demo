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
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl animate-in slide-in-from-bottom">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>
        
        {/* Content */}
        <div className="px-6 pb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-lg">Patient Visit Reminder</h3>
              <p className="text-sm text-muted-foreground">2:30 PM · 19 May 2025</p>
            </div>
            <button onClick={onClose} className="p-1">
              <X className="w-5 h-5 text-muted-foreground/70" />
            </button>
          </div>
          
          <div className="h-px bg-border mb-4" />
          
          <div className="space-y-3 mb-6">
            <p className="font-semibold text-foreground">SUBJ-001 · Visit 4</p>
            <p className="text-muted-foreground">Follow-Up Visit</p>
            <p className="text-primary font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Scheduled: 20 May 2025
            </p>
            <p className="text-muted-foreground">Window: 17 May – 23 May</p>
            <p className="text-muted-foreground">Apollo Hospital · Dr. Sharma</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onViewDetails}
              className="w-full py-4 rounded-full font-semibold bg-primary text-white flex items-center justify-center gap-2"
            >
              View Visit Details <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-full font-semibold border-2 border-border text-muted-foreground"
            >
              Mark as Read
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
