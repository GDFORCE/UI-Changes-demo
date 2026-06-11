"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  ChevronDown,
  Download,
  Search,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Server,
  Check,
} from "lucide-react"

import { StatusBadge, type StatusTone } from "@/components/clinical/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface AuditLogScreenProps {
  onBack?: () => void
}

const mockAuditData = {
  summary: { totalActions: 147, success: 143, failed: 4, usersActive: 12 },
  securityAlerts: [
    { id: "AUD-016", desc: "Failed login · Max Delhi · 45.33.22.11 · attempt 1", time: "10:10" },
    { id: "AUD-017", desc: "Failed login · Max Delhi · 45.33.22.11 · attempt 2 of 5", time: "10:14" },
  ],
  sites: [
    {
      id: "SITE-001", name: "Apollo Mumbai", type: "Site", org: "Apollo Hospitals",
      totalActions: 12, successCount: 11, failedCount: 1,
      users: [
        {
          id: "USR-003", name: "Dr. Rajesh Sharma", initials: "RS", role: "PI",
          totalActions: 8, failedCount: 0,
          entries: [
            { id: "AUD-001", category: "Login", desc: "Logged in · iOS · iPhone 14", time: "09:12", status: "success", ip: "192.168.1.45", device: "iOS 17", trial: "", patient: "" },
            { id: "AUD-005", category: "Visit", desc: "SUBJ-001 Visit 3 marked Completed", time: "09:45", status: "success", ip: "192.168.1.45", device: "iOS 17", trial: "Protocol-A", patient: "SUBJ-001" },
            { id: "AUD-009", category: "Patient", desc: "SUBJ-015 enrolled in Protocol-A", time: "10:30", status: "success", ip: "192.168.1.45", device: "iOS 17", trial: "Protocol-A", patient: "SUBJ-015" },
            { id: "AUD-012", category: "Visit", desc: "SUBJ-007 Visit 1 status updated to Screening", time: "11:15", status: "success", ip: "192.168.1.45", device: "iOS 17", trial: "Protocol-B", patient: "SUBJ-007" },
            { id: "AUD-018", category: "Trial", desc: "Protocol-A visit schedule edited (v3)", time: "14:02", status: "success", ip: "192.168.1.45", device: "iOS 17", trial: "Protocol-A", patient: "" },
            { id: "AUD-022", category: "Visit", desc: "SUBJ-003 Visit 5 flagged as protocol deviation", time: "14:45", status: "success", ip: "192.168.1.45", device: "iOS 17", trial: "Protocol-C", patient: "SUBJ-003" },
            { id: "AUD-031", category: "Login", desc: "Session timeout · auto logout", time: "17:00", status: "success", ip: "192.168.1.45", device: "iOS 17", trial: "", patient: "" },
            { id: "AUD-035", category: "Login", desc: "Logged in · iOS", time: "17:15", status: "success", ip: "192.168.1.45", device: "iOS 17", trial: "", patient: "" },
          ],
        },
        {
          id: "USR-007", name: "Ms. Priya Desai", initials: "PD", role: "CRC",
          totalActions: 4, failedCount: 1,
          entries: [
            { id: "AUD-002", category: "Failed", desc: "Failed login attempt (attempt 2 of 5)", time: "08:52", status: "failed", ip: "10.0.0.14", device: "Android 14", trial: "", patient: "" },
            { id: "AUD-003", category: "Login", desc: "Logged in · Android · Samsung S23", time: "08:55", status: "success", ip: "10.0.0.14", device: "Android 14", trial: "", patient: "" },
            { id: "AUD-006", category: "Patient", desc: "SUBJ-011 medication schedule updated", time: "10:05", status: "success", ip: "10.0.0.14", device: "Android 14", trial: "", patient: "SUBJ-011" },
            { id: "AUD-011", category: "Login", desc: "Logged out · manual", time: "16:30", status: "success", ip: "10.0.0.14", device: "Android 14", trial: "", patient: "" },
          ],
        },
        {
          id: "SYSTEM", name: "System", initials: "SYS", role: "System",
          totalActions: 2, failedCount: 0,
          entries: [
            { id: "AUD-041", category: "System", desc: "Batch visit reminders sent · 8 patients", time: "08:00", status: "success", ip: "", device: "", trial: "", patient: "" },
            { id: "AUD-042", category: "System", desc: "Nightly audit log backup completed", time: "02:00", status: "success", ip: "", device: "", trial: "", patient: "" },
          ],
        },
      ],
    },
    {
      id: "SITE-002", name: "Max Delhi", type: "Site", org: "Max Healthcare",
      totalActions: 7, successCount: 5, failedCount: 2,
      users: [
        {
          id: "USR-009", name: "Dr. Sunita Rao", initials: "SR", role: "PI",
          totalActions: 5, failedCount: 0,
          entries: [
            { id: "AUD-015", category: "Login", desc: "Logged in · Web · Chrome", time: "09:30", status: "success", ip: "10.0.1.25", device: "Chrome/Web", trial: "", patient: "" },
            { id: "AUD-019", category: "Visit", desc: "SUBJ-008 Visit 2 completed", time: "10:15", status: "success", ip: "10.0.1.25", device: "Chrome/Web", trial: "Protocol-A", patient: "SUBJ-008" },
            { id: "AUD-024", category: "Patient", desc: "SUBJ-016 added to Protocol-B", time: "11:00", status: "success", ip: "10.0.1.25", device: "Chrome/Web", trial: "Protocol-B", patient: "SUBJ-016" },
            { id: "AUD-028", category: "Visit", desc: "SUBJ-012 Visit 4 marked Screen Fail", time: "13:30", status: "success", ip: "10.0.1.25", device: "Chrome/Web", trial: "Protocol-A", patient: "SUBJ-012" },
            { id: "AUD-033", category: "Login", desc: "Logged out · manual", time: "17:45", status: "success", ip: "10.0.1.25", device: "Chrome/Web", trial: "", patient: "" },
          ],
        },
        {
          id: "USR-014", name: "Unknown", initials: "??", role: "Unknown",
          totalActions: 2, failedCount: 2,
          entries: [
            { id: "AUD-016", category: "Failed", desc: "Failed login attempt (attempt 1 of 5)", time: "10:10", status: "failed", ip: "45.33.22.11", device: "Unknown", trial: "", patient: "" },
            { id: "AUD-017", category: "Failed", desc: "Failed login attempt (attempt 2 of 5)", time: "10:14", status: "failed", ip: "45.33.22.11", device: "Unknown", trial: "", patient: "" },
          ],
        },
      ],
    },
    {
      id: "ORG-001", name: "PharmaCo Ltd", type: "Sponsor", org: "PharmaCo Ltd",
      totalActions: 8, successCount: 8, failedCount: 0,
      users: [
        {
          id: "ADMIN-001", name: "Rajesh Kumar", initials: "RK", role: "Sponsor Admin",
          totalActions: 5, failedCount: 0,
          entries: [
            { id: "AUD-020", category: "Login", desc: "Logged in · Web", time: "10:00", status: "success", ip: "203.0.113.5", device: "Chrome/Web", trial: "", patient: "" },
            { id: "AUD-021", category: "Trial", desc: "Protocol-D created (Oncology Phase II)", time: "10:45", status: "success", ip: "203.0.113.5", device: "Chrome/Web", trial: "Protocol-D", patient: "" },
            { id: "AUD-025", category: "Trial", desc: "Protocol-D shared with Apollo Mumbai", time: "11:20", status: "success", ip: "203.0.113.5", device: "Chrome/Web", trial: "Protocol-D", patient: "" },
            { id: "AUD-029", category: "Trial", desc: "Protocol-A visit schedule approved (v3)", time: "14:10", status: "success", ip: "203.0.113.5", device: "Chrome/Web", trial: "Protocol-A", patient: "" },
            { id: "AUD-034", category: "Login", desc: "Logged out · manual", time: "18:00", status: "success", ip: "203.0.113.5", device: "Chrome/Web", trial: "", patient: "" },
          ],
        },
        {
          id: "ADMIN-002", name: "Platform Admin", initials: "PA", role: "Platform Admin",
          totalActions: 3, failedCount: 0,
          entries: [
            { id: "AUD-036", category: "Account", desc: "USR-007 password reset initiated", time: "09:00", status: "success", ip: "10.10.10.1", device: "Chrome/Web", trial: "", patient: "" },
            { id: "AUD-037", category: "Account", desc: "USR-019 account activated", time: "09:15", status: "success", ip: "10.10.10.1", device: "Chrome/Web", trial: "", patient: "" },
            { id: "AUD-038", category: "System", desc: "Audit log export generated (May report)", time: "09:30", status: "success", ip: "10.10.10.1", device: "Chrome/Web", trial: "", patient: "" },
          ],
        },
      ],
    },
  ],
}

const categoryToneMap: Record<string, StatusTone> = {
  Login: "info",
  Failed: "destructive",
  Visit: "info",
  Patient: "info",
  Trial: "info",
  Account: "warning",
  System: "muted",
}

export function AuditLogScreen({ onBack }: AuditLogScreenProps) {
  const [groupBy, setGroupBy] = useState("site")
  const [dateFilter, setDateFilter] = useState("today")
  const [actionFilter, setActionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSites, setExpandedSites] = useState<string[]>(["SITE-001"])
  const [expandedUsers, setExpandedUsers] = useState<string[]>([])
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [showDetailSheet, setShowDetailSheet] = useState(false)
  const [showExportSheet, setShowExportSheet] = useState(false)
  const [exportFormat, setExportFormat] = useState("CSV")
  const [alertsDismissed, setAlertsDismissed] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const toggleSite = (siteId: string) => {
    setExpandedSites(prev => prev.includes(siteId) ? prev.filter(id => id !== siteId) : [...prev, siteId])
  }

  const toggleUser = (key: string) => {
    setExpandedUsers(prev => prev.includes(key) ? prev.filter(id => id !== key) : [...prev, key])
  }

  const handleEntryTap = (entry: any, userName: string, siteName: string, userRole: string) => {
    setSelectedEntry({ ...entry, userName, siteName, userRole })
    setShowDetailSheet(true)
  }

  const handleCopy = (id: string) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const hasFailures = mockAuditData.sites.some(s => s.failedCount > 0)

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-primary">Platform activity log</h1>
          <p className="text-sm text-muted-foreground">Immutable record of who did what, to which record, and when.</p>
        </div>
        <Button type="button" className="bg-primary hover:bg-primary/90" onClick={() => setShowExportSheet(true)}>
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger size="sm" className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger size="sm" className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="site">Group by Site</SelectItem>
              <SelectItem value="org">Group by Organization</SelectItem>
              <SelectItem value="user">Group by User</SelectItem>
              <SelectItem value="date">Group by Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger size="sm" className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="login">Login / Logout</SelectItem>
              <SelectItem value="visit">Visit updates</SelectItem>
              <SelectItem value="patient">Patient actions</SelectItem>
              <SelectItem value="trial">Trial actions</SelectItem>
              <SelectItem value="failed">Failed only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger size="sm" className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="success">Success only</SelectItem>
              <SelectItem value="failed">Failed only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search user, action, subject ID, trial..."
            className="h-9 pl-9 pr-9 text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {/* Summary Stats */}
        <div className="pb-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total actions", val: mockAuditData.summary.totalActions, tone: "default" as const },
              { label: "Success", val: mockAuditData.summary.success, tone: "success" as const },
              { label: "Failed", val: mockAuditData.summary.failed, tone: "destructive" as const },
              { label: "Active users", val: mockAuditData.summary.usersActive, tone: "default" as const },
            ].map(s => (
              <Card
                key={s.label}
                className={cn(
                  "shadow-none gap-1 rounded-xl p-4",
                  s.tone === "success" && "bg-success/5 border-success/20",
                  s.tone === "destructive" && "bg-destructive/5 border-destructive/20",
                )}
              >
                <p
                  className={cn(
                    "font-heading text-2xl font-semibold leading-none",
                    s.tone === "destructive" ? "text-destructive" : "text-foreground",
                  )}
                >
                  {s.val}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Alerts */}
        {!alertsDismissed && hasFailures && (
          <div className="py-2">
            <Card className="bg-warning/5 border-warning/30 shadow-none gap-2 rounded-xl p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                  <span className="text-sm font-semibold text-foreground truncate">
                    Security alerts — {mockAuditData.securityAlerts.length} today
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatusFilter("failed")}
                    className="h-7 text-xs text-warning hover:bg-warning/10 hover:text-warning"
                  >
                    View all
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setAlertsDismissed(true)}
                    aria-label="Dismiss security alerts"
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                {mockAuditData.securityAlerts.map(a => (
                  <p key={a.id} className="text-xs text-muted-foreground leading-relaxed">
                    {a.desc} · {a.time}
                  </p>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Grouped List */}
        <div className="pt-2 space-y-3">
          {mockAuditData.sites.length === 0 ? (
            <Card className="shadow-none rounded-xl py-10 items-center text-center text-sm text-muted-foreground">
              No audit entries match the current filters.
            </Card>
          ) : (
            mockAuditData.sites.map(site => {
              const expanded = expandedSites.includes(site.id)
              return (
                <Card
                  key={site.id}
                  className={cn(
                    "shadow-none gap-0 rounded-xl py-0 overflow-hidden border-l-4",
                    site.failedCount > 0 ? "border-l-destructive" : "border-l-success",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleSite(site.id)}
                    className="w-full flex items-center gap-3 p-4"
                  >
                    <Building2 className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{site.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {site.users.length} users · {site.totalActions} actions today
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={`${site.successCount} ok`} tone="success" />
                      {site.failedCount > 0 && (
                        <StatusBadge status={`${site.failedCount} failed`} tone="destructive" />
                      )}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          expanded && "rotate-180",
                        )}
                      />
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-border">
                      {site.users.map(user => {
                        const userKey = `${site.id}-${user.id}`
                        const userExpanded = expandedUsers.includes(userKey)
                        const isSystem = user.role === "System"
                        return (
                          <div key={user.id} className="border-b border-border last:border-0">
                            <button
                              type="button"
                              onClick={() => toggleUser(userKey)}
                              className="w-full flex items-center gap-3 px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                                {isSystem ? <Server className="h-4 w-4" /> : user.initials}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-foreground truncate">
                                    {user.name}
                                  </span>
                                  <Badge variant="outline" className="h-5 text-[10px] font-medium">
                                    {user.role}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {user.totalActions} actions
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {user.failedCount > 0 && (
                                  <span
                                    aria-label={`${user.failedCount} failed`}
                                    className="h-2 w-2 rounded-full bg-destructive"
                                  />
                                )}
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 text-muted-foreground transition-transform",
                                    userExpanded && "rotate-180",
                                  )}
                                />
                              </div>
                            </button>

                            {userExpanded && (
                              <div className="divide-y divide-border">
                                {user.entries.map(entry => {
                                  const isFailed = entry.status === "failed"
                                  return (
                                    <button
                                      type="button"
                                      key={entry.id}
                                      onClick={() =>
                                        handleEntryTap(entry, user.name, site.name, user.role)
                                      }
                                      className={cn(
                                        "w-full flex items-center gap-2 px-5 py-2.5 text-left hover:bg-muted/40 transition-colors",
                                        isFailed && "bg-destructive/5",
                                      )}
                                    >
                                      <StatusBadge
                                        status={entry.category}
                                        tone={categoryToneMap[entry.category] ?? "muted"}
                                        className="h-5 shrink-0 text-[10px]"
                                      />
                                      <span className="flex-1 text-xs text-foreground truncate">
                                        {entry.desc}
                                      </span>
                                      <span className="text-xs text-muted-foreground font-mono shrink-0">
                                        {entry.time}
                                      </span>
                                      {isFailed ? (
                                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                                      ) : (
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Action Detail Sheet */}
      {showDetailSheet && selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-lg max-h-[85vh] overflow-auto rounded-2xl bg-card">
            <div className="sticky top-0 bg-card pt-3 pb-2 px-5">
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-border" />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge
                      status={selectedEntry.category}
                      tone={categoryToneMap[selectedEntry.category] ?? "muted"}
                    />
                    {selectedEntry.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <p className="font-heading text-base font-semibold text-foreground">
                    {selectedEntry.desc}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowDetailSheet(false)}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="px-5 pb-5 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Details
                </p>
                {[
                  { label: "Audit ID", val: selectedEntry.id },
                  { label: "Timestamp", val: `19 May 2025 · ${selectedEntry.time}` },
                  { label: "User", val: selectedEntry.userName },
                  { label: "Role", val: selectedEntry.userRole },
                  { label: "Site", val: selectedEntry.siteName },
                ].map(r => (
                  <div key={r.label} className="flex justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{r.label}</span>
                    <span className="text-xs font-medium text-foreground text-right">{r.val}</span>
                  </div>
                ))}
              </div>

              {(selectedEntry.trial || selectedEntry.patient || selectedEntry.ip || selectedEntry.device) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Action
                    </p>
                    {selectedEntry.trial && (
                      <div className="flex justify-between gap-3">
                        <span className="text-xs text-muted-foreground">Trial</span>
                        <span className="text-xs font-medium text-foreground">{selectedEntry.trial}</span>
                      </div>
                    )}
                    {selectedEntry.patient && (
                      <div className="flex justify-between gap-3">
                        <span className="text-xs text-muted-foreground">Patient</span>
                        <span className="text-xs font-medium text-foreground">{selectedEntry.patient}</span>
                      </div>
                    )}
                    {selectedEntry.ip && (
                      <div className="flex justify-between gap-3">
                        <span className="text-xs text-muted-foreground">IP address</span>
                        <span className="text-xs font-medium text-foreground font-mono">{selectedEntry.ip}</span>
                      </div>
                    )}
                    {selectedEntry.device && (
                      <div className="flex justify-between gap-3">
                        <span className="text-xs text-muted-foreground">Device</span>
                        <span className="text-xs font-medium text-foreground">{selectedEntry.device}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedEntry.status === "failed" && (
                <Card className="bg-destructive/5 border-destructive/20 shadow-none gap-2 rounded-xl p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-destructive">
                    Failure details
                  </p>
                  <div className="flex justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Reason</span>
                    <span className="text-xs font-medium text-destructive">Invalid credentials</span>
                  </div>
                  <div className="flex justify-between gap-3 items-center">
                    <span className="text-xs text-muted-foreground">Risk level</span>
                    <StatusBadge status="Medium" tone="warning" />
                  </div>
                </Card>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10"
                  onClick={() => handleCopy(selectedEntry.id)}
                >
                  {copiedId === selectedEntry.id ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    "Copy audit ID"
                  )}
                </Button>
                <Button
                  type="button"
                  className="flex-1 h-10"
                  onClick={() =>
                    toast.success(`Audit entry ${selectedEntry?.id ?? ""} exported`)
                  }
                >
                  Export entry
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Sheet */}
      {showExportSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-5 space-y-4">
            <div className="mx-auto h-1 w-12 rounded-full bg-border" />
            <p className="font-heading text-base font-semibold text-foreground">
              Export audit log
            </p>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Format
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["CSV", "PDF"].map(f => (
                  <Button
                    key={f}
                    type="button"
                    variant={exportFormat === f ? "default" : "outline"}
                    className="h-10"
                    onClick={() => setExportFormat(f)}
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date range
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Input type="date" defaultValue="2025-05-01" className="h-10" />
                <Input type="date" defaultValue="2025-05-19" className="h-10" />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10"
                onClick={() => setShowExportSheet(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 h-10"
                onClick={() => {
                  setShowExportSheet(false)
                  toast.success(`Audit log exported as ${exportFormat}`)
                }}
              >
                Export now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
