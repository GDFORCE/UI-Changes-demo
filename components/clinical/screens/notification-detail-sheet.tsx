"use client"

import { Calendar, ChevronRight, X, MapPin, Stethoscope, User } from "lucide-react"

interface NotificationDetailSheetProps {
  onClose: () => void
  onViewDetails: () => void
}

export function NotificationDetailSheet({ onClose, onViewDetails }: NotificationDetailSheetProps) {
  return (
    <div className="absolute inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-xl animate-rise">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1.5 bg-border rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="eyebrow text-muted-foreground mb-0.5">Visit Reminder</p>
              <h3 className="display-serif text-foreground text-xl">Patient Visit Reminder</h3>
              <p className="text-sm text-muted-foreground font-mono mt-0.5">2:30 PM · 19 May 2025</p>
            </div>
            <button onClick={onClose} className="springy active:scale-90 p-1.5 -mr-1.5 rounded-full hover:bg-muted">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="h-px bg-border mb-4" />

          <div className="bg-surface rounded-2xl border border-border divide-y divide-border overflow-hidden mb-6">
            {[
              { icon: User,        tint: "bg-violet/10 text-violet",   label: "Subject", value: "SUBJ-001 · Visit 4" },
              { icon: Stethoscope, tint: "bg-info/10 text-info",       label: "Visit type", value: "Follow-Up Visit" },
              { icon: Calendar,    tint: "bg-success/15 text-success", label: "Scheduled", value: "20 May 2025 · Window 17–23 May" },
              { icon: MapPin,      tint: "bg-accent/15 text-accent",   label: "Site", value: "Apollo Hospital · Dr. Sharma" },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3 px-3.5 py-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${row.tint}`}>
                  <row.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">{row.label}</p>
                  <p className="text-sm text-foreground/90 font-medium truncate">{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={onViewDetails}
              className="springy active:scale-[0.97] w-full py-3.5 rounded-2xl font-semibold dawn-gradient hero-glow text-primary-foreground flex items-center justify-center gap-2"
            >
              View Visit Details <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="springy active:scale-[0.97] w-full py-3.5 rounded-2xl font-semibold border border-border text-foreground/80"
            >
              Mark as Read
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
