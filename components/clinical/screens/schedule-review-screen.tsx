"use client"

import { useState } from "react"
import { ChevronLeft, FileText, Eye, Download, Check, X, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScheduleReviewScreenProps {
  onBack: () => void
  onApprove: () => void
  onReject: () => void
}

const scheduleData = {
  docName:     "Protocol-001 v2.1.pdf",
  docSize:     "2.4 MB",
  fromSponsor: "PharmaCo Ltd",
  fromUser:    "Rajesh Kumar",
  sharedDate:  "19 May 2025",
  sharedTime:  "11:32 AM",
  message:     "Please review the updated visit schedule and confirm receipt.",
  versionNote: "v2.1 — Updated visit window for Visit 7",
  prevVersion: "v2.0",
}

const visitSchedule = [
  { visit: "Visit 1",  name: "Screening",   day: "Day -7",  window: "±2 days", updated: false },
  { visit: "Visit 2",  name: "Baseline",    day: "Day 0",   window: "±1 day",  updated: false },
  { visit: "Visit 3",  name: "Follow-Up 1", day: "Day 14",  window: "±3 days", updated: false },
  { visit: "Visit 4",  name: "Follow-Up 2", day: "Day 28",  window: "±3 days", updated: false },
  { visit: "Visit 5",  name: "Safety Check",day: "Day 42",  window: "±3 days", updated: false },
  { visit: "Visit 6",  name: "Mid-Study",   day: "Day 56",  window: "±3 days", updated: false },
  { visit: "Visit 7",  name: "Follow-Up 5", day: "Day 84",  window: "±5 days", updated: true  },
  { visit: "Visit 8",  name: "Follow-Up 6", day: "Day 112", window: "±5 days", updated: false },
  { visit: "Visit 9",  name: "Lab & Vitals",day: "Day 140", window: "±3 days", updated: false },
  { visit: "Visit 10", name: "End of Study",day: "Day 168", window: "±5 days", updated: false },
]

export function ScheduleReviewScreen({ onBack, onApprove, onReject }: ScheduleReviewScreenProps) {
  const [piNotes, setPiNotes] = useState("")
  const [showRejectSheet, setShowRejectSheet] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [approved, setApproved] = useState(false)
  const [rejected, setRejected] = useState(false)
  const [showAllVisits, setShowAllVisits] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const displayedVisits = showAllVisits ? visitSchedule : visitSchedule.slice(0, 4)

  const fireToast = (msg: string, cb: () => void) => {
    setToastMsg(msg)
    setShowToast(true)
    setTimeout(() => { setShowToast(false); cb() }, 2200)
  }

  const handleApprove = () => {
    setApproved(true)
    fireToast("Schedule v2.1 approved and now active for your site", onApprove)
  }

  const handleSendRejection = () => {
    if (!rejectReason.trim()) return
    setRejected(true)
    setShowRejectSheet(false)
    fireToast("Rejection sent to PharmaCo Ltd", onReject)
  }

  return (
    <div className="h-full flex flex-col bg-surface relative">
      {/* App Bar */}
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1"><ChevronLeft className="w-6 h-6" /></button>
        <span className="font-semibold flex-1">Review Schedule</span>
        <span className="text-blue-300 text-xs">← Dashboard</span>
      </div>

      <div className="flex-1 overflow-auto pb-24 px-4 pt-4 space-y-4">
        {/* Sender info card */}
        <div className="bg-primary-deep rounded-2xl p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-info/30 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary-foreground/75" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base leading-tight">{scheduleData.docName}</p>
              <p className="text-primary-foreground/75 text-xs mt-0.5">From: {scheduleData.fromSponsor} · {scheduleData.fromUser}</p>
              <p className="text-blue-300 text-xs">Shared: {scheduleData.sharedDate} at {scheduleData.sharedTime}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-blue-300 mb-0.5">Version note</p>
            <p className="text-sm text-white font-medium">{scheduleData.versionNote}</p>
          </div>
          <div className="mt-2">
            <p className="text-xs text-blue-300 mb-0.5">Message from sponsor</p>
            <p className="text-sm text-blue-100 italic">"{scheduleData.message}"</p>
          </div>
        </div>

        {/* Document preview */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-info" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">{scheduleData.docName}</p>
              <p className="text-xs text-muted-foreground/70">{scheduleData.docSize}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-info/5 text-info py-2.5 rounded-xl text-sm font-semibold">
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-surface text-foreground/80 py-2.5 rounded-xl text-sm font-semibold border border-border">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>

        {/* Version Notes */}
        <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <PenLine className="w-4 h-4 text-warning" />
            <p className="font-semibold text-warning text-sm">Version Notes</p>
          </div>
          <p className="text-sm text-warning">{scheduleData.versionNote}</p>
          <p className="text-xs text-warning mt-0.5">Previous version: {scheduleData.prevVersion}</p>
        </div>

        {/* Visit Schedule Summary */}
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="font-semibold text-foreground text-sm">Schedule Summary</p>
            <span className="text-xs text-muted-foreground/70">18 visits total</span>
          </div>
          {displayedVisits.map((v, i) => (
            <div
              key={v.visit}
              className={cn(
                "px-4 py-2.5 flex items-center gap-2",
                v.updated ? "bg-warning/10" : i % 2 === 0 ? "bg-card" : "bg-surface/40",
                i > 0 && "border-t border-border"
              )}
            >
              <span className="text-[10px] font-medium text-muted-foreground/70 w-12 shrink-0">{v.visit}</span>
              <span className="text-sm text-foreground flex-1">{v.name}</span>
              <span className="text-xs text-muted-foreground/70 w-12 text-right">{v.day}</span>
              <div className="flex items-center gap-1.5 w-20 justify-end">
                <span className="text-xs text-muted-foreground">{v.window}</span>
                {v.updated && <span className="px-1.5 py-0.5 bg-warning text-white text-[9px] font-bold rounded-full shrink-0">UPDATED</span>}
              </div>
            </div>
          ))}
          {!showAllVisits && (
            <button onClick={() => setShowAllVisits(true)} className="w-full py-2.5 text-info text-xs font-medium border-t border-border">
              View All 18 Visits ›
            </button>
          )}
        </div>

        {/* PI Notes */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">PI Notes (optional — visible in audit log)</p>
          <textarea
            value={piNotes}
            onChange={e => setPiNotes(e.target.value)}
            placeholder="Reviewed and approved on 19 May 2025."
            rows={3}
            className="w-full bg-card rounded-xl border border-border p-3 text-sm outline-none resize-none"
          />
        </div>
      </div>

      {/* Sticky bottom bar */}
      {!approved && !rejected && (
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-3 bg-card border-t border-border flex gap-3">
          <button onClick={() => setShowRejectSheet(true)} className="flex-1 border-2 border-red-400 text-destructive py-3 rounded-xl text-sm font-semibold">
            Reject with Comments
          </button>
          <button onClick={handleApprove} className="flex-1 bg-primary-deep text-white py-3 rounded-xl text-sm font-semibold">
            Approve & Activate →
          </button>
        </div>
      )}

      {(approved || rejected) && (
        <div className={cn(
          "absolute bottom-0 left-0 right-0 px-4 pb-4 pt-3 flex items-center justify-center gap-2",
          approved ? "bg-accent/5 border-t border-accent/20" : "bg-destructive/5 border-t border-destructive/20"
        )}>
          {approved ? <Check className="w-5 h-5 text-accent" /> : <X className="w-5 h-5 text-destructive" />}
          <span className={cn("text-sm font-semibold", approved ? "text-accent" : "text-destructive")}>
            {approved ? "Schedule approved and activated" : "Rejection sent to sponsor"}
          </span>
        </div>
      )}

      {/* Rejection bottom sheet */}
      {showRejectSheet && (
        <div className="absolute inset-0 bg-black/40 flex items-end z-10">
          <div className="bg-card w-full rounded-t-2xl p-5">
            <h3 className="font-bold text-foreground text-lg mb-1">Reject Schedule</h3>
            <p className="text-xs text-muted-foreground/70 mb-4">This will notify the sponsor with your reason.</p>
            <p className="text-sm text-foreground/80 mb-2 font-medium">Reason for rejection*</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Visit 7 window change conflicts with our site's holiday schedule."
              rows={4}
              autoFocus
              className="w-full bg-surface rounded-xl border border-border p-3 text-sm outline-none resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowRejectSheet(false)} className="flex-1 border border-border text-foreground/80 py-3 rounded-xl text-sm font-semibold">
                Cancel
              </button>
              <button
                onClick={handleSendRejection}
                disabled={!rejectReason.trim()}
                className={cn("flex-1 py-3 rounded-xl text-sm font-semibold",
                  rejectReason.trim() ? "bg-destructive text-white" : "bg-border text-muted-foreground/70 cursor-not-allowed"
                )}
              >
                Send Rejection →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className={cn(
          "absolute bottom-24 left-4 right-4 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg z-20",
          approved ? "bg-accent" : "bg-destructive"
        )}>
          <Check className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">{toastMsg}</span>
        </div>
      )}
    </div>
  )
}
