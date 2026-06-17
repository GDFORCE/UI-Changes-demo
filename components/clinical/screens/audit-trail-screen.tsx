"use client"

import { useState } from "react"
import {
  ChevronLeft, ChevronRight, ChevronDown, Search, ShieldCheck, FileClock,
  Activity, FileEdit, Bell, LogIn, UserPlus, CalendarClock, ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Roles whose audit scope differs. Patients see only their own trail; PI &
// Research Team in the same hospital see each other's actions across patients;
// Sponsor/CRO see an aggregated, de-identified trail (no Subject IDs).
export type AuditRole = "patient" | "pi" | "crc" | "sponsor"

type AuditCategory = "data-change" | "visit-status" | "notification" | "access" | "schedule" | "create"

interface AuditEntry {
  id: string
  actor: string
  actorRole: string
  action: string
  category: AuditCategory
  /** Related activity / record the action touched. */
  record: string
  field?: string
  oldValue?: string
  newValue?: string
  reason?: string
  /** Full date & timestamp. */
  timestamp: string
  /** Source — device / IP, part of a compliant audit trail. */
  source?: string
  group: "today" | "yesterday" | "earlier"
}

const categoryConfig: Record<AuditCategory, { icon: typeof Activity; circle: string; ic: string; label: string }> = {
  "data-change":  { icon: FileEdit,     circle: "bg-warning/15",     ic: "text-warning",     label: "Data Change" },
  "visit-status": { icon: Activity,     circle: "bg-info/10",        ic: "text-info",        label: "Visit Status" },
  "notification": { icon: Bell,         circle: "bg-violet/10",      ic: "text-violet",      label: "Notification" },
  "access":       { icon: LogIn,        circle: "bg-muted",          ic: "text-muted-foreground", label: "Access & Login" },
  "schedule":     { icon: CalendarClock,circle: "bg-success/15",     ic: "text-success",     label: "Schedule" },
  "create":       { icon: UserPlus,     circle: "bg-info/10",        ic: "text-info",        label: "Record Created" },
}

// ── Role-scoped sample audit trails ───────────────────────────

const patientAudit: AuditEntry[] = [
  { id: "pa1", actor: "You", actorRole: "Patient", action: "Viewed notification", category: "notification", record: "Visit Reminder · PAT-06", timestamp: "15 Jun 2026, 08:02:14", source: "Android · 49.36.x.x", group: "today" },
  { id: "pa2", actor: "You", actorRole: "Patient", action: "Marked notification as read", category: "notification", record: "Chat Message · PAT-12", timestamp: "15 Jun 2026, 08:01:55", source: "Android · 49.36.x.x", group: "today" },
  { id: "pa3", actor: "You", actorRole: "Patient", action: "Updated contact detail (OTP verified)", category: "data-change", record: "My Profile", field: "Phone Number", oldValue: "+91 98765 43210", newValue: "+91 98765 11122", timestamp: "14 Jun 2026, 19:40:08", source: "Android · 49.36.x.x", group: "yesterday" },
  { id: "pa4", actor: "You", actorRole: "Patient", action: "Deleted notification", category: "notification", record: "Visit Reminder · PAT-05", timestamp: "14 Jun 2026, 09:12:31", source: "Android · 49.36.x.x", group: "yesterday" },
  { id: "pa5", actor: "You", actorRole: "Patient", action: "Accepted Terms & Conditions", category: "access", record: "T&C v2.1", timestamp: "12 Jun 2026, 10:05:00", source: "Android · 49.36.x.x", group: "earlier" },
  { id: "pa6", actor: "You", actorRole: "Patient", action: "Signed in", category: "access", record: "Session started", timestamp: "12 Jun 2026, 10:04:22", source: "Android · 49.36.x.x", group: "earlier" },
]

const siteAudit: AuditEntry[] = [
  { id: "sa1", actor: "Dr. Rajesh Sharma", actorRole: "PI", action: "Updated visit status", category: "visit-status", record: "SUBJ-007 · Visit 4 · Follow-Up", field: "Status", oldValue: "Scheduled", newValue: "Completed", timestamp: "15 Jun 2026, 11:24:09", source: "Web · AIIMS Delhi", group: "today" },
  { id: "sa2", actor: "Ms. Priya Desai", actorRole: "Research Team", action: "Entered screening date", category: "create", record: "SUBJ-009", field: "Screening Date", newValue: "23 May 2025", timestamp: "15 Jun 2026, 11:20:41", source: "Web · AIIMS Delhi", group: "today" },
  { id: "sa3", actor: "Dr. Rajesh Sharma", actorRole: "PI", action: "Updated screening result", category: "visit-status", record: "SUBJ-011 · Screening", field: "Result", oldValue: "Pending", newValue: "Screen Failure", reason: "HbA1c outside inclusion range", timestamp: "15 Jun 2026, 10:02:18", source: "Web · AIIMS Delhi", group: "today" },
  { id: "sa4", actor: "Ms. Priya Desai", actorRole: "Research Team", action: "Marked notification as read", category: "notification", record: "Overdue Visit · SIT-07", timestamp: "15 Jun 2026, 09:15:33", source: "Web · AIIMS Delhi", group: "today" },
  { id: "sa5", actor: "Dr. Rajesh Sharma", actorRole: "PI", action: "Modified visit schedule", category: "schedule", record: "DIAB-2024-001 · Template", field: "Version", oldValue: "v2", newValue: "v3", reason: "Visit 7 window extended by 2 days", timestamp: "14 Jun 2026, 16:10:54", source: "Web · AIIMS Delhi", group: "yesterday" },
  { id: "sa6", actor: "Mr. Amit Singh", actorRole: "Research Team", action: "Updated visit status", category: "visit-status", record: "SUBJ-005 · Visit 3", field: "Status", oldValue: "Scheduled", newValue: "Completed", timestamp: "14 Jun 2026, 14:32:07", source: "Web · AIIMS Delhi", group: "yesterday" },
  { id: "sa7", actor: "Dr. Rajesh Sharma", actorRole: "PI", action: "Updated patient status", category: "visit-status", record: "SUBJ-004", field: "Status", oldValue: "Active", newValue: "Withdrawn", reason: "Adverse event — persistent hypoglycaemia", timestamp: "13 Jun 2026, 12:48:19", source: "Web · AIIMS Delhi", group: "earlier" },
  { id: "sa8", actor: "Ms. Priya Desai", actorRole: "Research Team", action: "Created patient record", category: "create", record: "SUBJ-012", timestamp: "13 Jun 2026, 10:21:40", source: "Web · AIIMS Delhi", group: "earlier" },
  { id: "sa9", actor: "Dr. Rajesh Sharma", actorRole: "PI", action: "Deleted notification", category: "notification", record: "Chat Message · SIT-17", timestamp: "12 Jun 2026, 18:03:12", source: "Web · AIIMS Delhi", group: "earlier" },
  { id: "sa10", actor: "Mr. Amit Singh", actorRole: "Research Team", action: "Signed in", category: "access", record: "Session started", timestamp: "12 Jun 2026, 09:00:05", source: "Web · AIIMS Delhi", group: "earlier" },
]

const sponsorAudit: AuditEntry[] = [
  { id: "na1", actor: "Dr. Rajesh Sharma", actorRole: "PI", action: "Modified visit schedule", category: "schedule", record: "DIAB-2024-001 · Template", field: "Version", oldValue: "v2", newValue: "v3", reason: "Visit 7 window extended by 2 days", timestamp: "15 Jun 2026, 16:10:54", source: "Web", group: "today" },
  { id: "na2", actor: "Michael Chen", actorRole: "CRO", action: "Shared trial (internal)", category: "access", record: "DIAB-2024-001", field: "Access", newValue: "Edit", timestamp: "15 Jun 2026, 11:48:30", source: "Web", group: "today" },
  { id: "na3", actor: "System", actorRole: "System", action: "Generated daily recruitment digest", category: "notification", record: "DIAB-2024-001 · SPN-01", timestamp: "15 Jun 2026, 08:00:00", source: "Scheduler", group: "today" },
  { id: "na4", actor: "Dr. Rajesh Sharma", actorRole: "PI", action: "Completed registration", category: "create", record: "DIAB-2024-001", timestamp: "14 Jun 2026, 13:22:11", source: "Web", group: "yesterday" },
  { id: "na5", actor: "Michael Chen", actorRole: "CRO", action: "Updated contact detail (OTP verified)", category: "data-change", record: "Team Member Profile", field: "Email ID", oldValue: "m.chen@cro.com", newValue: "michael.chen@cro.com", timestamp: "13 Jun 2026, 10:15:02", source: "Web", group: "earlier" },
  { id: "na6", actor: "Michael Chen", actorRole: "CRO", action: "Viewed notification", category: "notification", record: "Schedule Modified · SPN-05", timestamp: "12 Jun 2026, 17:40:55", source: "Web", group: "earlier" },
]

function dataForRole(role: AuditRole): AuditEntry[] {
  if (role === "patient") return patientAudit
  if (role === "sponsor") return sponsorAudit
  return siteAudit
}

type AuditFilter = "all" | AuditCategory

interface AuditTrailScreenProps {
  role: AuditRole
  onBack: () => void
  /** "dark" matches the site-user primary-deep header; "light" matches the patient SubBar. */
  headerVariant?: "light" | "dark"
}

export function AuditTrailScreen({ role, onBack, headerVariant = "dark" }: AuditTrailScreenProps) {
  const [entries] = useState<AuditEntry[]>(() => dataForRole(role))
  const [filter, setFilter] = useState<AuditFilter>("all")
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const scopeNote =
    role === "patient" ? "Your account activity — actions you performed on this app."
    : role === "sponsor" ? "Trial-level activity across your organisation. De-identified — no Subject IDs."
    : "All actions by you and your hospital team across your patients."

  const filters: { id: AuditFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "data-change", label: "Data Changes" },
    { id: "visit-status", label: "Visit Status" },
    { id: "notification", label: "Notifications" },
    { id: "schedule", label: "Schedule" },
    { id: "access", label: "Access" },
  ]

  const visible = entries.filter(e => {
    if (filter !== "all" && e.category !== filter) return false
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return e.actor.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || e.record.toLowerCase().includes(q)
  })

  const groups = {
    today: visible.filter(e => e.group === "today"),
    yesterday: visible.filter(e => e.group === "yesterday"),
    earlier: visible.filter(e => e.group === "earlier"),
  }

  const renderRow = (e: AuditEntry) => {
    const cfg = categoryConfig[e.category]
    const Icon = cfg.icon
    const isOpen = expanded === e.id
    const hasDiff = e.oldValue != null || e.newValue != null
    return (
      <div key={e.id} className="bg-card border-b border-border">
        <button onClick={() => setExpanded(isOpen ? null : e.id)} className="w-full px-4 py-3.5 flex gap-3 text-left">
          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0", cfg.circle)}>
            <Icon className={cn("w-[18px] h-[18px]", cfg.ic)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground font-medium">
              <span className="font-semibold">{e.actor}</span> · {e.action}
            </p>
            <p className="text-[13px] text-muted-foreground truncate mt-0.5">{e.record}</p>
            {hasDiff && (
              <div className="flex items-center gap-1.5 mt-1 text-[12px]">
                {e.oldValue && <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive line-through">{e.oldValue}</span>}
                {e.oldValue && <ArrowRight className="w-3 h-3 text-muted-foreground/60" />}
                {e.newValue && <span className="px-1.5 py-0.5 rounded bg-success/15 text-success font-medium">{e.newValue}</span>}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground/80 mt-1">{e.timestamp}</p>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground/50 flex-shrink-0 mt-1 transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
          <div className="px-4 pb-4 pt-1 ml-12 space-y-1.5 text-[12px]">
            {[
              { k: "Performed by", v: `${e.actor} (${e.actorRole})` },
              { k: "Action", v: `${cfg.label} — ${e.action}` },
              { k: "Related activity", v: e.record },
              ...(e.field ? [{ k: "Field", v: e.field }] : []),
              ...(e.reason ? [{ k: "Reason", v: e.reason }] : []),
              { k: "Date & time", v: e.timestamp },
              ...(e.source ? [{ k: "Source", v: e.source }] : []),
              { k: "Audit ID", v: e.id.toUpperCase() },
            ].map(row => (
              <div key={row.k} className="flex gap-2">
                <span className="text-muted-foreground/70 w-28 flex-shrink-0">{row.k}</span>
                <span className="text-foreground/80 font-medium">{row.v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderGroup = (label: string, items: AuditEntry[]) => {
    if (items.length === 0) return null
    return (
      <div>
        <div className="px-4 py-2 bg-surface">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-[0.8px]">{label}</span>
        </div>
        {items.map(renderRow)}
      </div>
    )
  }

  return (
    <div className={cn("bg-surface flex flex-col", headerVariant === "dark" ? "absolute inset-0 z-50" : "h-full")}>
      {/* Header */}
      {headerVariant === "dark" ? (
        <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">Audit Trail</span>
          <FileClock className="w-5 h-5 text-primary-foreground/75" />
        </div>
      ) : (
        <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-1"><ChevronLeft className="w-6 h-6 text-primary-deep" /></button>
          <span className="flex-1 text-center font-bold text-primary-deep text-[17px]">Audit Trail</span>
          <FileClock className="w-5 h-5 text-primary" />
        </div>
      )}

      {/* Scope banner */}
      <div className="px-4 py-2.5 bg-info/5 border-b border-border flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">{scopeNote}</p>
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-card border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by user, action or record..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary bg-surface" />
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-card border-b border-border scrollbar-hide">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-sm border",
              filter === f.id ? "bg-warning/10 border-primary text-primary font-bold" : "bg-card border-border text-muted-foreground font-medium")}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <FileClock className="w-12 h-12 text-slate-300" />
            <p className="font-semibold text-muted-foreground">No audit records</p>
            <p className="text-sm text-muted-foreground/70">Nothing matches the current filters.</p>
          </div>
        ) : (
          <>
            {renderGroup("Today", groups.today)}
            {renderGroup("Yesterday", groups.yesterday)}
            {renderGroup("Earlier", groups.earlier)}
          </>
        )}
      </div>
    </div>
  )
}
