"use client"

import { AppBar } from "../app-bar"
import { Calendar, ChevronRight, Sparkles, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AddPatientScreenProps {
  onAdd: () => void
  onBack: () => void
}

const existingSubjects = ["SUBJ-001", "SUBJ-002", "SUBJ-003", "SUBJ-004", "SUBJ-005"]

// Visit schedule offsets (days from the baseline date) auto-calculated for the patient.
const VISIT_OFFSETS = [0, 14, 21, 28, 35, 49, 63, 77, 91]
const BASELINE_DATE = new Date(2025, 4, 5) // 5 May 2025
const VISITS_PREVIEW_COUNT = 5

function formatVisitDate(baseline: Date, offsetDays: number) {
  const d = new Date(baseline)
  d.setDate(d.getDate() + offsetDays)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function AddPatientScreen({ onAdd, onBack }: AddPatientScreenProps) {
  const [subjectId, setSubjectId] = useState("")
  const [showAllVisits, setShowAllVisits] = useState(false)
  const isDuplicate = existingSubjects.includes(`SUBJ-${subjectId}`)

  const visits = VISIT_OFFSETS.map((offset, i) => ({
    num: i + 1,
    date: formatVisitDate(BASELINE_DATE, offset),
  }))
  const visibleVisits = showAllVisits ? visits : visits.slice(0, VISITS_PREVIEW_COUNT)

  return (
    <div className="h-full flex flex-col bg-surface">
      <AppBar title="Add Patient" showBack onBack={onBack} />

      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">

        {/* Subject ID with duplicate detection */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Subject Number/ID *</label>
          <div className="flex gap-2">
            <div className="px-4 py-3 rounded-xl border border-border bg-surface text-muted-foreground text-sm font-mono">SUBJ-</div>
            <input
              type="text"
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              placeholder="001"
              className={cn(
                "flex-1 px-4 py-3 rounded-xl border text-sm font-mono outline-none focus:ring-2 focus:ring-info/15",
                isDuplicate ? "border-red-400 focus:border-red-400 bg-destructive/5" : "border-border focus:border-primary bg-card"
              )}
            />
          </div>
          {isDuplicate && (
            <div className="mt-2 flex items-center gap-2 bg-destructive/5 border border-destructive/20 rounded-xl px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-xs text-destructive font-medium">Duplicate entry detected — SUBJ-{subjectId} already exists. Please verify before proceeding.</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Subject Initials</label>
          <input type="text" placeholder="e.g., PK"
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Full Name *</label>
          <input type="text" placeholder="Patient full name"
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Date of Birth *</label>
            <input type="date"
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Gender</label>
            <select className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card text-sm appearance-none">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Phone *</label>
          <div className="flex gap-2">
            <div className="px-4 py-3 rounded-xl border border-border bg-surface text-muted-foreground">+91</div>
            <input type="tel" placeholder="Enter phone number"
              className="flex-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Email</label>
          <input type="email" placeholder="Enter email"
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Preferred Language</label>
          <select className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card appearance-none">
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Assign to Trial *</label>
          <select className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card appearance-none">
            <option>Protocol-A — Diabetes Phase II</option>
            <option>Protocol-B — Hypertension Study</option>
            <option>Protocol-C — Oncology Phase I</option>
          </select>
        </div>

        {/* Patient Access Note */}
        <div className="bg-info/5 border border-info/20 rounded-xl p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
          <p className="text-xs text-info">The patient will receive an invitation to access the app using the profile created here. Their login is linked to this subject record.</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-muted-foreground text-sm font-medium">Visit Dates</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Baseline Date *</label>
          <div className="relative">
            <input type="text" defaultValue="5 May 2025"
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card" />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Auto-calculated Dates */}
        <div className="bg-info/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Auto-calculated Dates</span>
          </div>
          <div className="space-y-2 text-sm">
            {visibleVisits.map((v) => (
              <div key={v.num} className="flex justify-between">
                <span className="text-muted-foreground">Visit {v.num}</span>
                <span className="text-foreground font-medium">{v.date}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAllVisits((s) => !s)}
            className="mt-3 text-accent font-medium text-sm flex items-center gap-1"
          >
            {showAllVisits ? (
              <>Show Less <ChevronRight className="w-4 h-4 -rotate-90" /></>
            ) : (
              <>View All {visits.length} Visits <ChevronRight className="w-4 h-4 rotate-90" /></>
            )}
          </button>
        </div>

        {/* Submit — part of the form, scrolls with the content */}
        <button
          onClick={onAdd}
          disabled={isDuplicate}
          className={cn("w-full py-4 rounded-full font-semibold", isDuplicate ? "bg-border text-muted-foreground/70" : "bg-primary text-white")}
        >
          Add Patient
        </button>
      </div>
    </div>
  )
}
