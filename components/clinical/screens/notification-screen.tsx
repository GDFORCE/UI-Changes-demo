"use client"

import { Bell, AlertTriangle, CheckCircle, Pill, MessageCircle, Settings, Trash2, BellOff, Check, ChevronLeft, Calendar, MapPin, Clock, FileText, Activity, CheckCheck } from "lucide-react"
import { useEffect, useState } from "react"
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
  "visit-reminder":       { icon: Bell,          circleColor: "bg-info/10",        iconColor: "text-info",             filterGroup: "visits" },
  "visit-overdue":        { icon: AlertTriangle, circleColor: "bg-destructive/10",  iconColor: "text-destructive",      filterGroup: "visits" },
  "visit-completed":      { icon: CheckCircle,   circleColor: "bg-success/15",      iconColor: "text-success",          filterGroup: "visits" },
  "medication-reminder":  { icon: Pill,          circleColor: "bg-violet/10",       iconColor: "text-violet",           filterGroup: "medication" },
  "medication-taken":     { icon: CheckCircle,   circleColor: "bg-success/15",      iconColor: "text-success",          filterGroup: "medication" },
  "missed-medication":    { icon: AlertTriangle, circleColor: "bg-destructive/10",  iconColor: "text-destructive",      filterGroup: "medication" },
  "trial-update":         { icon: Bell,          circleColor: "bg-warning/15",      iconColor: "text-warning",          filterGroup: "trials" },
  "message":              { icon: MessageCircle, circleColor: "bg-info/10",         iconColor: "text-info",             filterGroup: "visits" },
  "system":               { icon: Settings,      circleColor: "bg-muted",           iconColor: "text-muted-foreground", filterGroup: "system" },
  "deviation-window":     { icon: AlertTriangle, circleColor: "bg-warning/15",      iconColor: "text-warning",          filterGroup: "deviations" },
  "deviation-medication": { icon: AlertTriangle, circleColor: "bg-warning/15",      iconColor: "text-warning",          filterGroup: "deviations" },
  "status-screen-fail":   { icon: AlertTriangle, circleColor: "bg-destructive/10",  iconColor: "text-destructive",      filterGroup: "deviations" },
  "status-dropout":       { icon: AlertTriangle, circleColor: "bg-muted",           iconColor: "text-muted-foreground", filterGroup: "deviations" },
  "status-withdrawn":     { icon: AlertTriangle, circleColor: "bg-warning/15",      iconColor: "text-warning",          filterGroup: "deviations" },
  "status-complete":      { icon: CheckCircle,   circleColor: "bg-success/15",      iconColor: "text-success",          filterGroup: "deviations" },
}

// Types that deserve a live, pulsing "needs you now" marker when still unread.
const urgentTypes: NotifType[] = ["visit-overdue", "missed-medication", "deviation-window", "deviation-medication", "status-screen-fail"]

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
  "visit-reminder":       { label: "View Visit Details", screen: "my-visits" },
  "visit-overdue":        { label: "Update Visit Status", screen: "my-visits" },
  "visit-completed":      { label: "View Visit Details", screen: "my-visits" },
  "medication-reminder":  { label: "Log Medication", screen: "medication-reminder" },
  "medication-taken":     null,
  "missed-medication":    { label: "Log Medication", screen: "medication-reminder" },
  "trial-update":         { label: "View Trial", screen: "about-trial" },
  "message":              { label: "Open Chat", screen: "chat" },
  "system":               null,
  "deviation-window":     { label: "View Deviation Report", screen: "visit-detail" },
  "deviation-medication": { label: "View Deviation Report", screen: "visit-detail" },
  "status-screen-fail":   { label: "View Subject Record", screen: "patient-list" },
  "status-dropout":       { label: "View Subject Record", screen: "patient-list" },
  "status-withdrawn":     { label: "View Subject Record", screen: "patient-list" },
  "status-complete":      { label: "View Subject Record", screen: "patient-list" },
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

// Eased count-up for the hero unread number.
function useCountUp(target: number, duration = 750) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
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
    { id: "all", label: "All", count: counts.all },
    { id: "visits", label: "Visits", count: counts.visits },
    { id: "medication", label: "Medication", count: counts.medication },
    { id: "deviations", label: "Deviations", count: counts.deviations },
    { id: "trials", label: "Trials", count: counts.trials },
    { id: "system", label: "System", count: counts.system },
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

  // Unread breakdown for the hero card.
  const unread = notifications.filter(n => !n.read)
  const unreadCount = unread.length
  const unreadVisits = unread.filter(n => ["visit-reminder","visit-overdue","visit-completed","message"].includes(n.type)).length
  const unreadMeds = unread.filter(n => ["medication-reminder","medication-taken","missed-medication"].includes(n.type)).length
  const unreadAlerts = unread.filter(n => typeConfig[n.type].filterGroup === "deviations").length
  const animatedUnread = useCountUp(unreadCount)

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
    const showDecision = ["status-screen-fail","status-dropout","status-withdrawn","deviation-window","deviation-medication"].includes(selectedNotif.type)

    return (
      <div className="h-full flex flex-col bg-background">
        {/* App bar */}
        <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
          <div className="relative flex items-center gap-2">
            <button onClick={() => setSelectedNotif(null)} className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="eyebrow text-primary-foreground/65">Notification</p>
              <h1 className="display-serif text-lg leading-tight truncate">{notifTypeLabel[selectedNotif.type]}</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 py-6 space-y-5 scrollbar-hide">
          {/* Hero medallion */}
          <div className="flex flex-col items-center gap-2.5 animate-rise" style={{ animationDelay: "40ms" }}>
            <div className={cn("relative w-20 h-20 rounded-full flex items-center justify-center", cfg.circleColor)}>
              <span className={cn("absolute inset-0 rounded-full blur-xl opacity-40", cfg.circleColor)} />
              <Icon className={cn("relative w-9 h-9", cfg.iconColor)} />
            </div>
            <h2 className="display-serif text-xl text-foreground text-center mt-1 px-2">{selectedNotif.title}</h2>
            <p className="text-sm text-muted-foreground font-mono">{selectedNotif.time}</p>
          </div>

          {/* Body */}
          <p className="text-[15px] text-foreground/80 leading-[1.7] animate-rise" style={{ animationDelay: "110ms" }}>
            {selectedNotif.body}
          </p>

          {/* Related details */}
          <div className="animate-rise" style={{ animationDelay: "180ms" }}>
            <p className="eyebrow text-muted-foreground mb-2">Related Details</p>
            <div className="bg-card rounded-2xl border border-border shadow-xs divide-y divide-border overflow-hidden">
              {[
                { icon: FileText, tint: "bg-info/10 text-info",       label: "Protocol",  value: "Protocol-001" },
                { icon: Activity, tint: "bg-violet/10 text-violet",   label: "Visit",     value: "Visit 7 · Follow-Up Visit" },
                { icon: MapPin,   tint: "bg-accent/15 text-accent",   label: "Location",  value: "AIIMS Delhi, OPD Block 3" },
                { icon: Calendar, tint: "bg-success/15 text-success", label: "Scheduled", value: "24 May 2025, 10:00 AM" },
                { icon: Clock,    tint: "bg-warning/15 text-warning", label: "Window",    value: "22–26 May 2025" },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3 px-3.5 py-2.5">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", row.tint)}>
                    <row.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">{row.label}</p>
                    <p className="text-sm text-foreground/90 font-medium truncate">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {action && (
            <button onClick={() => onNavigate(action.screen)}
              className="springy active:scale-[0.97] w-full dawn-gradient hero-glow text-primary-foreground py-3.5 rounded-2xl font-semibold text-sm animate-rise"
              style={{ animationDelay: "240ms" }}>
              {action.label}
            </button>
          )}

          {/* Visit continuation / stopping for status-type notifications */}
          {showDecision && (
            <div className="bg-warning/10 border border-warning/25 rounded-2xl p-4 space-y-3 animate-rise" style={{ animationDelay: "300ms" }}>
              <p className="text-sm font-semibold text-warning flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Visit Continuation Decision
              </p>
              <p className="text-xs text-warning/90 leading-relaxed">Based on this alert, the PI or Research Team can choose to stop or continue the patient&apos;s visit schedule.</p>
              <div className="flex gap-3">
                <button className="springy active:scale-[0.97] flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-semibold">
                  Stop Visits
                </button>
                <button className="springy active:scale-[0.97] flex-1 py-2.5 rounded-xl bg-success text-success-foreground text-xs font-semibold">
                  Continue Schedule
                </button>
              </div>
            </div>
          )}

          <button className="springy active:scale-[0.97] w-full flex items-center justify-center gap-1.5 text-destructive text-sm font-medium py-2">
            <Trash2 className="w-4 h-4" /> Delete Notification
          </button>
        </div>
      </div>
    )
  }

  // ── NOTIFICATION LIST ────────────────────────────────────
  const renderRow = (notif: Notification, index: number) => {
    const cfg = typeConfig[notif.type]
    const Icon = cfg.icon
    const isSelected = selected.includes(notif.id)
    const isUrgent = !notif.read && urgentTypes.includes(notif.type)
    return (
      <button
        key={notif.id}
        onClick={() => {
          if (bulkMode) { toggleSelect(notif.id); return }
          markRead(notif.id)
          setSelectedNotif(notif)
        }}
        onContextMenu={e => { e.preventDefault(); setBulkMode(true); setSelected([notif.id]) }}
        style={{ animationDelay: `${40 + index * 55}ms` }}
        className={cn(
          "springy active:scale-[0.97] animate-rise relative w-full flex gap-3 text-left rounded-2xl border bg-card p-3.5 pl-4 shadow-xs overflow-hidden",
          isSelected ? "border-primary ring-1 ring-primary/30 bg-accent/[0.06]" : "border-border",
          !notif.read && !isSelected && "bg-accent/[0.04]"
        )}
      >
        {/* Unread accent rail */}
        {!notif.read && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full dawn-gradient" />}

        <div className="flex items-start gap-2 flex-shrink-0">
          {bulkMode && (
            <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5", isSelected ? "border-transparent dawn-gradient animate-pop" : "border-border bg-card")}>
              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
          )}
          <div className={cn("relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0", cfg.circleColor)}>
            <Icon className={cn("w-5 h-5", cfg.iconColor)} />
            {isUrgent && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-destructive ring-2 ring-card animate-pulse-soft" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <p className={cn("flex-1 text-sm text-foreground leading-snug", !notif.read ? "font-bold" : "font-medium")}>{notif.title}</p>
            <span className="text-[11px] text-muted-foreground font-mono flex-shrink-0 pt-0.5">{notif.time}</span>
          </div>
          <p className="text-[13px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">{notif.body}</p>
        </div>
      </button>
    )
  }

  const groupOrder: [string, Notification[]][] = [
    ["Today", groups.today],
    ["Yesterday", groups.yesterday],
    ["Earlier This Week", groups.earlier],
    ["Older", groups.older],
  ]
  let rowIndex = 0

  return (
    <div className="h-full flex flex-col bg-background">
      {/* App Bar */}
      <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
        <div className="relative flex items-center gap-2">
          {bulkMode ? (
            <>
              <span className="flex-1 display-serif text-lg">{selected.length} selected</span>
              <button onClick={() => { setBulkMode(false); setSelected([]) }}
                className="springy active:scale-95 text-sm font-medium px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={onBack} className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="eyebrow text-primary-foreground/65">Your morning rounds</p>
                <h1 className="display-serif text-lg leading-tight">Notifications</h1>
              </div>
              <button onClick={markAllRead}
                className="springy active:scale-95 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm">
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            </>
          )}
        </div>
      </div>

      {/* Scroll region */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        {/* Hero summary */}
        {!bulkMode && (
          <div className="px-4 pt-4">
            <div className="dawn-gradient hero-glow paper-grain rounded-3xl p-5 text-primary-foreground animate-rise" style={{ animationDelay: "40ms" }}>
              <div className="relative flex items-center gap-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="display-serif text-5xl font-mono tabular-nums leading-none">{animatedUnread}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold leading-tight">
                    {unreadCount === 0 ? "You're all caught up" : `${unreadCount} need${unreadCount === 1 ? "s" : ""} your attention`}
                  </p>
                  <p className="text-xs text-primary-foreground/75 mt-0.5">{counts.all} total · this week</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <div className="relative flex flex-wrap gap-2 mt-4">
                  {unreadVisits > 0 && <Chip label="Visits" value={unreadVisits} />}
                  {unreadMeds > 0 && <Chip label="Medication" value={unreadMeds} />}
                  {unreadAlerts > 0 && <Chip label="Alerts" value={unreadAlerts} />}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter Chips */}
        <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
          {filters.map(f => {
            const active = activeFilter === f.id
            return (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                className={cn("springy active:scale-95 flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors",
                  active
                    ? "dawn-gradient text-primary-foreground border-transparent shadow-xs"
                    : "bg-card border-border text-muted-foreground"
                )}>
                {f.label}
                <span className={cn("font-mono text-[11px] px-1.5 py-px rounded-full", active ? "bg-white/25" : "bg-muted text-muted-foreground")}>
                  {f.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 text-center px-6 py-20">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <BellOff className="w-9 h-9 text-accent" />
            </div>
            <p className="display-serif text-lg text-foreground mt-1">No notifications here</p>
            <p className="text-sm text-muted-foreground/80">You&apos;re all caught up — enjoy your morning.</p>
            <button onClick={() => onNavigate("patient-dashboard")}
              className="springy active:scale-95 mt-2 px-5 py-2.5 rounded-full border border-primary/40 text-primary text-sm font-semibold">
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="px-4 pt-1 pb-6 space-y-1">
            {groupOrder.map(([label, items]) => {
              if (items.length === 0) return null
              return (
                <div key={label} className="pt-3">
                  <p className="eyebrow text-muted-foreground px-1 pb-2">{label}</p>
                  <div className="space-y-2.5">
                    {items.map(notif => renderRow(notif, rowIndex++))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {bulkMode && (
        <div className="px-4 py-3 bg-card border-t border-border shadow-lg flex items-center justify-between animate-rise">
          <button onClick={() => setSelected(filtered.map(n => n.id))}
            className="springy active:scale-95 px-4 py-2 border border-border rounded-full text-sm font-medium text-foreground">
            Select All
          </button>
          <div className="flex gap-2">
            <button onClick={() => setShowDeleteConfirm(true)} disabled={selected.length === 0}
              className="springy active:scale-95 px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-medium flex items-center gap-1.5 disabled:opacity-40">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button className="springy active:scale-95 px-4 py-2 bg-warning/15 text-warning rounded-full text-sm font-medium flex items-center gap-1.5">
              <BellOff className="w-4 h-4" /> Mute
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-card rounded-3xl p-6 w-full max-w-xs shadow-xl animate-pop">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="display-serif text-foreground text-lg mb-1">Delete {selected.length} notification{selected.length !== 1 ? "s" : ""}?</h3>
            <p className="text-sm text-muted-foreground mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="springy active:scale-95 flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground/80">Cancel</button>
              <button onClick={deleteSelected} className="springy active:scale-95 flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full pl-2.5 pr-2 py-1 text-xs font-medium">
      {label}
      <span className="font-mono bg-white/25 rounded-full px-1.5 leading-tight">{value}</span>
    </span>
  )
}
