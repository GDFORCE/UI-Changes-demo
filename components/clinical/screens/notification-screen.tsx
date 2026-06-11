"use client"

import { Bell, AlertTriangle, CheckCircle, Pill, MessageCircle, Settings, Trash2, BellOff, Check, ChevronLeft, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface NotificationScreenProps {
  onNavigate: (screen: string) => void
  onBack: () => void
}

type NotifType = "visit-reminder" | "visit-overdue" | "visit-completed" | "medication-reminder" | "medication-taken" | "missed-medication" | "trial-update" | "message" | "system" | "deviation-window" | "deviation-medication" | "status-screen-fail" | "status-dropout" | "status-withdrawn" | "status-complete"

interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
  group: "today" | "yesterday" | "earlier" | "older"
}

const typeConfig: Record<NotifType, { icon: typeof Bell; circleColor: string; iconColor: string; filterGroup: string }> = {
  "visit-reminder":       { icon: Bell,          circleColor: "bg-info/10",   iconColor: "text-info",   filterGroup: "visits" },
  "visit-overdue":        { icon: AlertTriangle, circleColor: "bg-destructive/10",    iconColor: "text-destructive",    filterGroup: "visits" },
  "visit-completed":      { icon: CheckCircle,   circleColor: "bg-success/15",  iconColor: "text-success",  filterGroup: "visits" },
  "medication-reminder":  { icon: Pill,          circleColor: "bg-violet/10", iconColor: "text-violet", filterGroup: "medication" },
  "medication-taken":     { icon: CheckCircle,   circleColor: "bg-success/15",  iconColor: "text-success",  filterGroup: "medication" },
  "missed-medication":    { icon: AlertTriangle, circleColor: "bg-destructive/10",    iconColor: "text-destructive",    filterGroup: "medication" },
  "trial-update":         { icon: Bell,          circleColor: "bg-warning/15",  iconColor: "text-warning",  filterGroup: "trials" },
  "message":              { icon: MessageCircle, circleColor: "bg-sky-100",    iconColor: "text-sky-600",    filterGroup: "visits" },
  "system":               { icon: Settings,      circleColor: "bg-muted",  iconColor: "text-muted-foreground",  filterGroup: "system" },
  "deviation-window":     { icon: AlertTriangle, circleColor: "bg-warning/15", iconColor: "text-warning", filterGroup: "deviations" },
  "deviation-medication": { icon: AlertTriangle, circleColor: "bg-warning/15", iconColor: "text-warning", filterGroup: "deviations" },
  "status-screen-fail":   { icon: AlertTriangle, circleColor: "bg-destructive/10",    iconColor: "text-destructive",    filterGroup: "deviations" },
  "status-dropout":       { icon: AlertTriangle, circleColor: "bg-muted",  iconColor: "text-muted-foreground",  filterGroup: "deviations" },
  "status-withdrawn":     { icon: AlertTriangle, circleColor: "bg-warning/15",  iconColor: "text-warning",  filterGroup: "deviations" },
  "status-complete":      { icon: CheckCircle,   circleColor: "bg-success/15",  iconColor: "text-success",  filterGroup: "deviations" },
}

const initialNotifications: Notification[] = [
  { id: "1", type: "visit-reminder",     title: "Visit 7 Tomorrow",       body: "Your next is Visit No. 7 Follow-Up Visit at AIIMS Delhi Ansari Nagar, New Delhi as scheduled on 24 May 2025, 22-26 May 2025",           time: "2h ago",          read: false, group: "today" },
  { id: "2", type: "medication-reminder",title: "Take Metformin 500mg",   body: "It's 8:00 AM — time to take your morning dose of Metformin 500mg.",                                                        time: "8:00 AM",         read: false, group: "today" },
  { id: "3", type: "medication-taken",   title: "Medication Logged",      body: "Metformin 500mg marked as taken at 8:03 AM. Good job keeping up with your schedule!",                                       time: "8:03 AM",         read: true,  group: "today" },
  { id: "4", type: "visit-completed",   title: "Visit 6 Confirmed",      body: "Your Visit 6 has been marked complete by Dr. Sharma. Next visit: Visit 7 on 24 May.",                                       time: "Yesterday, 3:30 PM", read: true, group: "yesterday" },
  { id: "5", type: "message",           title: "Message from Dr. Sharma", body: "Please remember to fast for 8 hours before your Visit 7 blood draw. Water is allowed.",                                    time: "Yesterday, 11:00 AM", read: false, group: "yesterday" },
  { id: "6", type: "medication-reminder",title: "Take Aspirin 75mg",     body: "It's 2:00 PM — time to take your afternoon dose of Aspirin 75mg.",                                                         time: "Yesterday, 2:00 PM", read: true, group: "yesterday" },
  { id: "7",  type: "trial-update",          title: "Trial Update",                body: "Protocol-001 visit schedule has been updated. Visit 7 window has been extended by 2 days.",                    time: "22 May", read: true,  group: "earlier" },
  { id: "8",  type: "missed-medication",    title: "Missed Medication",           body: "You did not log your evening dose of Metformin 500mg (8:00 PM). Please contact your team if you need help.",        time: "21 May", read: false, group: "earlier" },
  { id: "9",  type: "deviation-window",     title: "Window Period Violation",     body: "SUBJ-007: Visit 5 was conducted on 20 May 2025, which falls outside the allowed window (18–19 May). A deviation report has been flagged.", time: "20 May", read: false, group: "earlier" },
  { id: "10", type: "deviation-medication", title: "Medication Deviation Alert",  body: "SUBJ-003 reported taking double dose of Metformin on 19 May. Protocol deviation logged. PI review required.",   time: "19 May", read: false, group: "older" },
  { id: "11", type: "status-screen-fail",   title: "Screen Failure — SUBJ-009",  body: "SUBJ-009 did not meet inclusion criteria at screening visit. Status updated to Screen Failure. No further visits scheduled.", time: "18 May", read: true,  group: "older" },
  { id: "12", type: "status-dropout",       title: "Patient Dropout — SUBJ-004", body: "SUBJ-004 has voluntarily withdrawn from participation. All pending visits have been cancelled. PI has been notified.", time: "17 May", read: true,  group: "older" },
  { id: "13", type: "status-withdrawn",     title: "Visit Withdrawn — SUBJ-006", body: "Visit 4 for SUBJ-006 has been withdrawn by the PI due to AE concerns. Continuation decision pending medical review.", time: "16 May", read: false, group: "older" },
  { id: "14", type: "status-complete",      title: "Trial Completed — SUBJ-002", body: "SUBJ-002 has completed all 18 protocol visits. Final assessment confirmed. Patient status updated to Completed.",  time: "15 May", read: true,  group: "older" },
]

const actionButton: Record<NotifType, { label: string; screen: string } | null> = {
  "visit-reminder":       { label: "View Visit Details →", screen: "my-visits" },
  "visit-overdue":        { label: "Update Visit Status →", screen: "my-visits" },
  "visit-completed":      { label: "View Visit Details →", screen: "my-visits" },
  "medication-reminder":  { label: "Log Medication →", screen: "medication-reminder" },
  "medication-taken":     null,
  "missed-medication":    { label: "Log Medication →", screen: "medication-reminder" },
  "trial-update":         { label: "View Trial →", screen: "about-trial" },
  "message":              { label: "Open Chat →", screen: "chat" },
  "system":               null,
  "deviation-window":     { label: "View Deviation Report →", screen: "visit-detail" },
  "deviation-medication": { label: "View Deviation Report →", screen: "visit-detail" },
  "status-screen-fail":   { label: "View Subject Record →", screen: "patient-list" },
  "status-dropout":       { label: "View Subject Record →", screen: "patient-list" },
  "status-withdrawn":     { label: "View Subject Record →", screen: "patient-list" },
  "status-complete":      { label: "View Subject Record →", screen: "patient-list" },
}

const notifTypeLabel: Record<NotifType, string> = {
  "visit-reminder": "Visit Reminder", "visit-overdue": "Visit Overdue",
  "visit-completed": "Visit Completed", "medication-reminder": "Medication Reminder",
  "medication-taken": "Medication Taken", "missed-medication": "Missed Medication",
  "trial-update": "Trial Update", "message": "Message from PI", "system": "System",
  "deviation-window": "Window Period Deviation", "deviation-medication": "Medication Deviation",
  "status-screen-fail": "Screen Failure", "status-dropout": "Patient Dropout",
  "status-withdrawn": "Visit Withdrawn", "status-complete": "Trial Completed",
}

export function NotificationScreen({ onNavigate, onBack }: NotificationScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null)
  const [bulkMode, setBulkMode] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const counts = {
    all: notifications.length,
    visits: notifications.filter(n => ["visit-reminder", "visit-overdue", "visit-completed", "message"].includes(n.type)).length,
    medication: notifications.filter(n => ["medication-reminder", "medication-taken", "missed-medication"].includes(n.type)).length,
    trials: notifications.filter(n => n.type === "trial-update").length,
    deviations: notifications.filter(n => ["deviation-window","deviation-medication","status-screen-fail","status-dropout","status-withdrawn","status-complete"].includes(n.type)).length,
    system: notifications.filter(n => n.type === "system").length,
  }

  const filters = [
    { id: "all", label: `All ${counts.all}` },
    { id: "visits", label: `Visits ${counts.visits}` },
    { id: "medication", label: `Medication ${counts.medication}` },
    { id: "deviations", label: `Deviations ${counts.deviations}` },
    { id: "trials", label: `Trials ${counts.trials}` },
    { id: "system", label: `System ${counts.system}` },
  ]

  const filtered = notifications.filter(n => {
    if (activeFilter === "all") return true
    return typeConfig[n.type].filterGroup === activeFilter
  })

  const groups = {
    today: filtered.filter(n => n.group === "today"),
    yesterday: filtered.filter(n => n.group === "yesterday"),
    earlier: filtered.filter(n => n.group === "earlier"),
    older: filtered.filter(n => n.group === "older"),
  }

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selected.includes(n.id)))
    setSelected([])
    setBulkMode(false)
    setShowDeleteConfirm(false)
  }

  // ── NOTIFICATION DETAIL ────────────────────────────────
  if (selectedNotif) {
    const cfg = typeConfig[selectedNotif.type]
    const Icon = cfg.icon
    const action = actionButton[selectedNotif.type]

    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3">
          <button onClick={() => setSelectedNotif(null)} className="p-1">
            <ChevronLeft className="w-6 h-6 text-primary-deep" />
          </button>
          <span className="flex-1 text-center font-bold text-primary-deep text-[17px]">{notifTypeLabel[selectedNotif.type]}</span>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-auto px-4 py-6 space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", cfg.circleColor)}>
              <Icon className={cn("w-8 h-8", cfg.iconColor)} />
            </div>
            <h2 className="text-xl font-bold text-foreground text-center mt-1">{selectedNotif.title}</h2>
            <p className="text-sm text-muted-foreground">{selectedNotif.time}</p>
          </div>

          <div className="h-px bg-muted" />
          <p className="text-[15px] text-foreground/80 leading-[1.7]">{selectedNotif.body}</p>
          <div className="h-px bg-muted" />

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Related Details</p>
            <div className="bg-card rounded-xl border border-border p-4 space-y-2">
              <p className="text-sm text-foreground/80">📋 Protocol-001</p>
              <p className="text-sm text-foreground/80">🏥 Visit 7 · Follow-Up Visit</p>
              <p className="text-sm text-foreground/80">📍 AIIMS Delhi, OPD Block 3</p>
              <p className="text-sm text-foreground/80">📅 24 May 2025, 10:00 AM</p>
              <p className="text-sm text-foreground/80">⏰ Window: 22–26 May 2025</p>
            </div>
          </div>

          {action && (
            <button onClick={() => onNavigate(action.screen)}
              className="w-full bg-primary-deep text-white py-3.5 rounded-xl font-semibold text-sm">
              {action.label}
            </button>
          )}

          {/* Visit continuation / stopping for status-type notifications */}
          {["status-screen-fail","status-dropout","status-withdrawn","deviation-window","deviation-medication"].includes(selectedNotif.type) && (
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-warning">Visit Continuation Decision</p>
              <p className="text-xs text-warning">Based on this alert, the PI or Research Team can choose to stop or continue the patient's visit schedule.</p>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-xs font-semibold">
                  Stop Visits
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-success text-white text-xs font-semibold">
                  Continue Schedule
                </button>
              </div>
            </div>
          )}

          <button className="w-full text-center text-destructive text-sm font-medium py-2">
            🗑 Delete Notification
          </button>
        </div>
      </div>
    )
  }

  // ── NOTIFICATION LIST ────────────────────────────────────
  const renderGroup = (label: string, items: Notification[]) => {
    if (items.length === 0) return null
    return (
      <div key={label}>
        <div className="px-4 py-2 bg-surface">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-[0.8px]">{label}</span>
        </div>
        {items.map(notif => {
          const cfg = typeConfig[notif.type]
          const Icon = cfg.icon
          const isSelected = selected.includes(notif.id)
          return (
            <button
              key={notif.id}
              onClick={() => {
                if (bulkMode) { toggleSelect(notif.id); return }
                markRead(notif.id)
                setSelectedNotif(notif)
              }}
              onContextMenu={e => { e.preventDefault(); setBulkMode(true); setSelected([notif.id]) }}
              className={cn(
                "w-full px-4 py-3.5 flex gap-3 text-left border-b border-border",
                isSelected ? "bg-info/5" : "bg-card"
              )}
            >
              <div className="flex items-start pt-0.5">
                {bulkMode ? (
                  <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center mr-2 flex-shrink-0", isSelected ? "border-primary bg-primary" : "border-border bg-card")}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                ) : (
                  !notif.read && <div className="w-1.5 h-1.5 bg-info rounded-full mr-2 mt-1.5 flex-shrink-0" />
                )}
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", cfg.circleColor)}>
                  <Icon className={cn("w-5 h-5", cfg.iconColor)} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm text-foreground", !notif.read ? "font-bold" : "font-normal")}>{notif.title}</p>
                <p className="text-[13px] text-muted-foreground line-clamp-2 mt-0.5">{notif.body}</p>
              </div>
              <span className="text-[12px] text-muted-foreground flex-shrink-0 pt-0.5">{notif.time}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* App Bar */}
      <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3">
        {bulkMode ? (
          <>
            <span className="flex-1 font-bold text-primary-deep text-[17px]">{selected.length} selected</span>
            <button onClick={() => { setBulkMode(false); setSelected([]) }} className="text-info text-sm font-medium">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={onBack} className="p-1"><ChevronLeft className="w-6 h-6 text-primary-deep" /></button>
            <span className="flex-1 text-center font-bold text-primary-deep text-[17px]">Notifications</span>
            <button onClick={markAllRead} className="text-info text-sm font-medium">Mark All Read</button>
          </>
        )}
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-card border-b border-border scrollbar-hide">
        {filters.map(f => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)}
            className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-sm border",
              activeFilter === f.id
                ? "bg-warning/10 border-primary text-primary font-bold"
                : "bg-card border-border text-muted-foreground font-medium"
            )}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <Bell className="w-12 h-12 text-slate-300" />
            <p className="font-semibold text-muted-foreground">No notifications here</p>
            <p className="text-sm text-muted-foreground/70">You're all caught up!</p>
            <button onClick={() => onNavigate("patient-dashboard")}
              className="mt-2 px-5 py-2.5 rounded-xl border border-info text-info text-sm font-medium">
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            {renderGroup("Today", groups.today)}
            {renderGroup("Yesterday", groups.yesterday)}
            {renderGroup("Earlier This Week", groups.earlier)}
            {renderGroup("Older", groups.older)}
          </>
        )}
      </div>

      {/* Bulk Action Bar */}
      {bulkMode && (
        <div className="px-4 py-3 bg-card border-t border-border shadow-lg flex items-center justify-between">
          <button onClick={() => setSelected(filtered.map(n => n.id))}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground">
            Select All
          </button>
          <div className="flex gap-2">
            <button onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button className="px-4 py-2 bg-warning/15 text-warning rounded-lg text-sm font-medium flex items-center gap-1">
              <BellOff className="w-4 h-4" /> Stop
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-xs shadow-xl">
            <h3 className="font-bold text-foreground text-lg mb-1">Delete {selected.length} notification{selected.length !== 1 ? "s" : ""}?</h3>
            <p className="text-sm text-muted-foreground mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground/80">Cancel</button>
              <button onClick={deleteSelected} className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
