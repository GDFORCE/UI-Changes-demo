"use client"

import { useState } from "react"
import { Camera, ShieldCheck, UserPen, Lock, Bell, ChevronRight, ChevronDown, Eye, EyeOff, Check, X, LogOut, Mail, Phone, Plus, Trash2, Building2, FlaskConical, FileText, HelpCircle, BarChart2, Users, UserCheck, AlertTriangle, MessageCircle, Clock, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export type SiteRole = "PI" | "Research Team"

export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed"
export interface SupportTicket {
  id: string
  subject: string
  category: string
  status: TicketStatus
  date: string
}
export const ticketStatusStyle = (s: TicketStatus) =>
  s === "Resolved" ? "bg-success/15 text-success"
  : s === "In Progress" ? "bg-info/10 text-info"
  : s === "Open" ? "bg-warning/15 text-warning"
  : "bg-muted text-muted-foreground"

// All registrable entity types. The Entity Change dropdown offers every type
// except the user's current one (e.g. a Site user can switch to Sponsor/CRO/SMO).
export const ENTITY_TYPES = ["Sponsor", "CRO", "SMO", "Site / Hospital"] as const

export interface SiteHospital {
  name: string
  address: string
  role: SiteRole
  department?: string
}

export interface SiteUser {
  initials: string
  avatarColor?: string // tailwind bg-* class
  name: string
  designation: string
  phone: string
  email: string
  entityType: string // "Site / Hospital" | "SMO"
  orgName: string
  orgAddress: string
  role: SiteRole
  department?: string
  hospitals?: SiteHospital[] // only for SMO
}

interface SiteTrial {
  id: string
  name: string
}

interface SiteTeamMember {
  id: string
  name: string
  designation: string
  phone: string
  email: string
  role: SiteRole
  department?: string
  trials: string[]
}

interface SiteUserProfileProps {
  user: SiteUser
  onSignOut: () => void
  trials?: SiteTrial[]
  /** When provided, the "My Trials" menu item opens this instead of the built-in list (e.g. the PI dashboard's My Trials tab). */
  onOpenTrials?: () => void
}

type Section =
  | null
  | "edit-profile"
  | "entity-change"
  | "change-password"
  | "notifications"
  | "my-trials"
  | "team-members"
  | "invite-member"
  | "tnc"
  | "help"
  | "help-faq"
  | "help-contact"
  | "help-tickets"
  | "reports"

const DEFAULT_TRIALS: SiteTrial[] = [
  { id: "Protocol-001", name: "Diabetes Phase II" },
  { id: "Protocol-005", name: "Asthma Maintenance Study" },
  { id: "Protocol-008", name: "Rheumatoid Arthritis Trial" },
]

export function SiteUserProfile({ user, onSignOut, trials = DEFAULT_TRIALS, onOpenTrials }: SiteUserProfileProps) {
  const isSMO = user.entityType.toUpperCase() === "SMO"
  const [section, setSection] = useState<Section>(null)

  // Team members (site staff)
  const [teamMembers, setTeamMembers] = useState<SiteTeamMember[]>([
    { id: "1", name: "Dr. Rajesh Sharma", designation: "Principal Investigator", phone: "+91 98100 12345", email: "r.sharma@apollo.com", role: "PI", department: "Oncology", trials: ["Protocol-001", "Protocol-005"] },
    { id: "2", name: "Ms. Priya Desai", designation: "Clinical Research Coordinator", phone: "+91 98201 54321", email: "p.desai@apollo.com", role: "Research Team", trials: ["Protocol-001"] },
    { id: "3", name: "Mr. Amit Singh", designation: "Research Associate", phone: "+91 99300 67890", email: "a.singh@apollo.com", role: "Research Team", trials: ["Protocol-008"] },
  ])
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({ category: "Login Issue", subject: "", description: "" })
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [lastTicketId, setLastTicketId] = useState("")
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: "#TKT-20260604-0031", subject: "Notification not received for a scheduled visit", category: "Notification Problem", status: "In Progress", date: "04 Jun 2026" },
    { id: "#TKT-20260528-0019", subject: "App shows an error opening the patient list", category: "App Bug", status: "Resolved", date: "28 May 2026" },
  ])
  const handleSubmitTicket = () => {
    const newId = `#TKT-20260611-${String(43 + tickets.length).padStart(4, "0")}`
    setTickets(prev => [{ id: newId, subject: contactForm.subject.trim() || "Support request", category: contactForm.category, status: "Open", date: "11 Jun 2026" }, ...prev])
    setLastTicketId(newId)
    setTicketSubmitted(true)
    setContactForm({ category: "Login Issue", subject: "", description: "" })
  }
  const [inviteForm, setInviteForm] = useState({ name: "", designation: "", phone: "", email: "", role: "PI" as SiteRole, department: "", trials: [] as string[] })

  const maskPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length <= 4) return phone
    return `+91 ••••• ${digits.slice(-4)}`
  }
  const trialName = (id: string) => trials.find(t => t.id === id)?.name ?? id
  const toggleInviteTrial = (id: string) =>
    setInviteForm(p => ({ ...p, trials: p.trials.includes(id) ? p.trials.filter(t => t !== id) : [...p.trials, id] }))
  const handleSendInvite = () => {
    if (!inviteForm.name || !inviteForm.email) return
    setTeamMembers(prev => [...prev, { id: Date.now().toString(), ...inviteForm }])
    toast.success(`Invite sent to ${inviteForm.name}`)
    setInviteForm({ name: "", designation: "", phone: "", email: "", role: "PI", department: "", trials: [] })
    setSection("team-members")
  }

  // Editable copies
  const [form, setForm] = useState({
    name: user.name,
    designation: user.designation,
    phone: user.phone,
    email: user.email,
    orgName: user.orgName,
    orgAddress: user.orgAddress,
    role: user.role,
    department: user.department ?? "",
  })
  const [hospitals, setHospitals] = useState<SiteHospital[]>(user.hospitals ?? [])

  // Entity Change request flow
  const [entityForm, setEntityForm] = useState<{ field: string; newValue: string }>({ field: "Entity Type", newValue: "" })
  const [entitySubmitted, setEntitySubmitted] = useState(false)
  const [entityWarning, setEntityWarning] = useState(false)
  const entityChangingToSMO = entityForm.field === "Entity Type" && entityForm.newValue.toUpperCase() === "SMO"
  const entityCanSubmit =
    !!entityForm.newValue.trim() && (!entityChangingToSMO || hospitals.some(h => h.name.trim()))

  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" })
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false })

  const [notifPrefs, setNotifPrefs] = useState({
    visitReminders: true,
    patientUpdates: true,
    protocolDeviations: true,
    weeklyDigest: false,
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
  })

  // ── Hospital editing (SMO) ──
  const addHospital = () => setHospitals(p => [...p, { name: "", address: "", role: "PI", department: "" }])
  const removeHospital = (i: number) => setHospitals(p => p.filter((_, idx) => idx !== i))
  const updateHospital = (i: number, patch: Partial<SiteHospital>) =>
    setHospitals(p => p.map((h, idx) => (idx === i ? { ...h, ...patch } : h)))

  const avatarColor = user.avatarColor ?? "bg-primary"

  /* ─────────────── Profile body ─────────────── */
  const profileBody = (
    <div className="flex-1 overflow-auto pb-6 pt-6 px-4">
      {/* 1. Photo + 2. Name + 3. Designation */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-3">
          <div className={cn("w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold", avatarColor)}>
            {user.initials}
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center">
            <Camera className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
        <span className="px-3 py-1 bg-info/10 text-info text-xs rounded-full font-semibold mt-1">{user.designation}</span>
      </div>

      {/* 4–8. Info card in required order */}
      <div className="bg-card rounded-2xl border border-border p-4 mb-3">
        {[
          { label: "Phone Number", val: user.phone, verify: true },
          { label: "Email ID", val: user.email, verify: true },
          { label: "Entity Type", val: user.entityType },
          { label: "Org. Name", val: user.orgName },
          { label: "Org. Address", val: user.orgAddress },
          // 9. Role + 10. Department — only for single-site users.
          // For SMO, role/department are defined per hospital (see Hospitals section below).
          ...(isSMO ? [] : [
            { label: "Role", val: user.role },
            ...(user.role === "PI" ? [{ label: "Department", val: user.department || "—" }] : []),
          ]),
        ].map(r => (
          <div key={r.label} className="py-2 border-b border-border last:border-0">
            <p className="text-xs text-muted-foreground/70 flex items-center gap-1">
              {r.label}
              {r.verify && <ShieldCheck className="w-3 h-3 text-warning" />}
            </p>
            <p className="text-sm text-foreground font-medium mt-0.5">{r.val}</p>
          </div>
        ))}
      </div>

      {/* SMO: hospitals managed by this user */}
      {isSMO && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Hospitals</p>
          <div className="space-y-2">
            {hospitals.length === 0 && (
              <p className="text-sm text-muted-foreground/70 bg-card rounded-2xl border border-border p-4 text-center">No hospitals added yet.</p>
            )}
            {hospitals.map((h, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-sm font-semibold text-foreground">{h.name || "Unnamed Hospital"}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{h.address || "No address"}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold bg-info/5 text-primary px-2 py-0.5 rounded-full">{h.role}</span>
                  {h.role === "PI" && h.department && (
                    <span className="text-[10px] font-medium text-muted-foreground">{h.department}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACCOUNT menu */}
      <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Account</p>
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
        {[
          { icon: UserPen, label: "Edit Profile", onClick: () => setSection("edit-profile") },
          { icon: Building2, label: "Entity Change", onClick: () => setSection("entity-change") },
          { icon: Lock, label: "Change Password", onClick: () => setSection("change-password") },
          { icon: Bell, label: "Notification Preferences", onClick: () => setSection("notifications") },
        ].map(item => {
          const Icon = item.icon
          return (
            <button key={item.label} onClick={item.onClick} className="w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-surface">
              <Icon className="w-4 h-4 text-muted-foreground/70" />
              <span className="flex-1 text-sm text-foreground text-left">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          )
        })}
      </div>

      {/* TRIAL MANAGEMENT */}
      <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Trial Management</p>
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
        {[
          { icon: FlaskConical, label: "My Trials", onClick: onOpenTrials ?? (() => setSection("my-trials")) },
          { icon: Users, label: "Team Members", onClick: () => setSection("team-members") },
        ].map(item => {
          const Icon = item.icon
          return (
            <button key={item.label} onClick={item.onClick} className="w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-surface">
              <Icon className="w-4 h-4 text-muted-foreground/70" />
              <span className="flex-1 text-sm text-foreground text-left">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          )
        })}
      </div>

      {/* REPORTS */}
      <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Reports</p>
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
        {[
          { icon: BarChart2, label: "Reports", onClick: () => setSection("reports") },
          { icon: FileText, label: "T&C", onClick: () => setSection("tnc") },
          { icon: HelpCircle, label: "Help & Support", onClick: () => setSection("help") },
        ].map(item => {
          const Icon = item.icon
          return (
            <button key={item.label} onClick={item.onClick} className="w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-surface">
              <Icon className="w-4 h-4 text-muted-foreground/70" />
              <span className="flex-1 text-sm text-foreground text-left">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          )
        })}
      </div>

      <button onClick={onSignOut} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/20 text-destructive text-sm font-semibold">
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  )

  /* ─────────────── My Trials ─────────────── */
  const myTrials = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">My Trials</span>
        <span className="text-xs text-primary-foreground/75">{trials.length} total</span>
      </div>
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {trials.map(t => (
          <div key={t.id} className="bg-card rounded-2xl border border-border shadow-xs p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/5 flex items-center justify-center flex-shrink-0">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  /* ─────────────── Team Members ─────────────── */
  const teamMembersScreen = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">Team Members</span>
        <span className="text-xs text-primary-foreground/75">{teamMembers.length} total</span>
      </div>
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {teamMembers.map(m => {
          const expanded = expandedMemberId === m.id
          return (
            <div key={m.id} className="bg-card rounded-2xl border border-border shadow-xs p-4">
              {/* Name + designation + role */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  {m.name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-foreground truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.designation}</p>
                </div>
                <span className="text-[10px] font-semibold bg-info/5 text-primary px-2 py-0.5 rounded-full flex-shrink-0">{m.role}</span>
              </div>
              {/* Contact + role/dept */}
              <div className="space-y-1.5 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" />
                  <span className="font-mono">{maskPhone(m.phone)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" />
                  <span className="truncate">{m.email}</span>
                </div>
                {m.role === "PI" && m.department && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" />
                    <span>{m.department}</span>
                  </div>
                )}
              </div>
              {/* Trials involved — clickable */}
              <button onClick={() => setExpandedMemberId(expanded ? null : m.id)}
                className="mt-3 w-full flex items-center justify-between bg-info/5 rounded-xl px-3 py-2 text-left">
                <span className="flex items-center gap-2 text-xs font-medium text-primary">
                  <FlaskConical className="w-3.5 h-3.5" />
                  {m.trials.length} {m.trials.length === 1 ? "trial" : "trials"} involved
                </span>
                <ChevronDown className={cn("w-4 h-4 text-primary transition-transform", expanded && "rotate-180")} />
              </button>
              {expanded && (
                <div className="mt-2 space-y-1.5">
                  {m.trials.map(tid => (
                    <div key={tid} className="flex items-center gap-2 text-xs text-muted-foreground px-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-info flex-shrink-0" />
                      <span className="font-medium text-foreground">{tid}</span> — {trialName(tid)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="px-5 py-4 border-t border-border bg-card">
        <button onClick={() => setSection("invite-member")}
          className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-white flex items-center justify-center gap-2">
          <UserCheck className="w-4 h-4" /> Invite Members
        </button>
      </div>
    </div>
  )

  /* ─────────────── Invite Member ─────────────── */
  const inviteMember = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection("team-members")} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">Invite Member</span>
      </div>
      <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
        <Field label="Full Name *" value={inviteForm.name} onChange={v => setInviteForm(p => ({ ...p, name: v }))} placeholder="Enter member's name" />
        <Field label="Designation" value={inviteForm.designation} onChange={v => setInviteForm(p => ({ ...p, designation: v }))} placeholder="e.g. Research Associate" />
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Phone Number</label>
          <div className="flex gap-2">
            <div className="px-4 py-3 rounded-xl border border-border bg-surface text-muted-foreground text-sm">+91</div>
            <input value={inviteForm.phone} onChange={e => setInviteForm(p => ({ ...p, phone: e.target.value }))} placeholder="Enter phone number" type="tel"
              className="flex-1 px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card" />
          </div>
        </div>
        <Field label="Email ID *" value={inviteForm.email} onChange={v => setInviteForm(p => ({ ...p, email: v }))} placeholder="member@example.com" />
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Role</label>
          <div className="flex rounded-xl border border-border overflow-hidden">
            {(["PI", "Research Team"] as SiteRole[]).map(r => (
              <button key={r} onClick={() => setInviteForm(p => ({ ...p, role: r }))}
                className={cn("flex-1 py-2.5 text-sm font-medium", inviteForm.role === r ? "bg-primary text-white" : "bg-card text-muted-foreground")}>
                {r}
              </button>
            ))}
          </div>
        </div>
        {inviteForm.role === "PI" && (
          <Field label="Department" value={inviteForm.department} onChange={v => setInviteForm(p => ({ ...p, department: v }))} placeholder="e.g. Oncology" />
        )}
        {/* Trials involved */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Trials Involved</label>
          <div className="space-y-2">
            {trials.map(t => {
              const checked = inviteForm.trials.includes(t.id)
              return (
                <button key={t.id} onClick={() => toggleInviteTrial(t.id)}
                  className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors",
                    checked ? "border-primary bg-info/5" : "border-border bg-card")}>
                  <span className={cn("w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                    checked ? "border-primary bg-primary" : "border-border")}>
                    {checked && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground truncate">{t.id}</span>
                    <span className="block text-xs text-muted-foreground truncate">{t.name}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex items-start gap-2 bg-info/5 border border-info/20 rounded-xl p-3">
          <Mail className="w-4 h-4 text-info mt-0.5 shrink-0" />
          <p className="text-xs text-info">An invitation email will be sent. The member joins once they accept and verify their identity.</p>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-border bg-card">
        <button onClick={handleSendInvite} disabled={!inviteForm.name || !inviteForm.email}
          className={cn("w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
            inviteForm.name && inviteForm.email ? "bg-primary-deep text-white" : "bg-border text-muted-foreground/70 cursor-not-allowed")}>
          <Mail className="w-4 h-4" /> Send Invite
        </button>
      </div>
    </div>
  )

  /* ─────────────── Reports ─────────────── */
  const reports = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">Reports</span>
      </div>
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {[
          { label: "Enrolment Summary", desc: "Screened, randomized & withdrawn" },
          { label: "Visit Compliance", desc: "On-time vs overdue visits" },
          { label: "Protocol Deviations", desc: "Logged deviations by trial" },
          { label: "Patient Status", desc: "Active, completed & dropouts" },
        ].map(r => (
          <button key={r.label} className="w-full bg-card rounded-2xl border border-border shadow-xs p-4 flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-info/5 flex items-center justify-center flex-shrink-0">
              <BarChart2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{r.label}</p>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  )

  /* ─────────────── T&C ─────────────── */
  const tnc = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">Terms &amp; Conditions</span>
      </div>
      <div className="flex-1 overflow-auto px-5 py-4 text-sm text-muted-foreground leading-relaxed space-y-4">
        {[
          { t: "1. Acceptance of Terms", d: "By using this platform you agree to be bound by these Terms and our Privacy Policy." },
          { t: "2. Data Privacy & Compliance", d: "All personal and clinical data is handled per applicable data protection laws and used solely for clinical trial management." },
          { t: "3. Data Security", d: "We use encryption at rest and in transit. You are responsible for keeping your credentials confidential." },
          { t: "4. Use of Platform", d: "Access is granted strictly for clinical trial management. Misuse may result in account termination." },
          { t: "5. Audit & Compliance", d: "All actions are logged for audit and may be shared with authorized regulators upon request." },
          { t: "6. Contact", d: "For questions about these terms, contact support@mtb-pvs.com." },
        ].map(s => (
          <div key={s.t} className="space-y-1">
            <p className="font-bold text-foreground">{s.t}</p>
            <p>{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  )

  /* ─────────────── Help & Support ─────────────── */
  const helpFaqs = [
    { q: "How do I reset my password?", a: "Go to Account → Change Password, enter your current password, then set a new one that meets all the strength requirements. If you're locked out, use 'Forgot Password' on the sign-in screen and verify via OTP." },
    { q: "How do I invite a team member?", a: "Open Trial Management → Team Members → Invite Members. Fill in the name, email, role and the trials they should be involved in, then tap Send Invite. They'll receive an email to join." },
    { q: "How are patient visits scheduled?", a: "Visits are auto-calculated from the patient's baseline date using the trial's visit template. You can review and adjust each visit's date and window from the patient's schedule." },
    { q: "How do I report a protocol deviation?", a: "Open the relevant patient or visit record and use 'Report Deviation'. Add the details and submit — it's logged for audit and routed to the PI and sponsor for review." },
  ]

  const help = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">Help &amp; Support</span>
      </div>
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {[
          { icon: HelpCircle,    bg: "bg-info/10",    ic: "text-info",     label: "Frequently Asked Questions", sub: "Browse common questions",      action: () => setSection("help-faq") },
          { icon: MessageCircle, bg: "bg-success/15", ic: "text-success",  label: "Contact Support",            sub: "Get help from our team",       action: () => { setTicketSubmitted(false); setSection("help-contact") } },
          { icon: Ticket,        bg: "bg-violet/10",  ic: "text-violet",   label: "My Tickets",                 sub: "Track your raised tickets",    action: () => setSection("help-tickets") },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <button key={i} onClick={item.action} className="w-full bg-card rounded-2xl p-4 flex items-center justify-between shadow-xs border border-border">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", item.bg)}>
                  <Icon className={cn("w-5 h-5", item.ic)} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
            </button>
          )
        })}

        <div className="bg-info/5 rounded-2xl p-4">
          <p className="text-sm font-semibold text-primary mb-3">Contact Us</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-foreground/80">support@patientvisitschedule.com</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-foreground/80">1800-XXX-XXXX (Toll Free)</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-foreground/80">Mon – Fri, 9:00 AM – 6:00 PM</span></div>
          </div>
        </div>
      </div>
    </div>
  )

  const helpFaq = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection("help")} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">FAQ</span>
      </div>
      <div className="flex-1 overflow-auto px-4 py-4 space-y-2">
        {helpFaqs.map(item => {
          const open = expandedFaq === item.q
          return (
            <div key={item.q} className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
              <button onClick={() => setExpandedFaq(open ? null : item.q)} className="w-full px-4 py-4 flex items-center justify-between gap-3 text-left">
                <span className="text-sm font-medium text-foreground">{item.q}</span>
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform", open && "rotate-180")} />
              </button>
              {open && <div className="px-4 pb-4"><p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p></div>}
            </div>
          )
        })}
      </div>
    </div>
  )

  const helpContact = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => { setSection("help"); setTicketSubmitted(false) }} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">Contact Support</span>
      </div>
      {ticketSubmitted ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
          <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h3 className="font-bold text-foreground text-lg">Ticket Submitted!</h3>
          <p className="text-sm text-muted-foreground">We'll respond within 24 hours.</p>
          <div className="bg-card rounded-xl px-4 py-3 border border-border">
            <p className="text-xs text-muted-foreground">Ticket ID</p>
            <p className="font-mono text-primary-deep font-semibold">{lastTicketId}</p>
          </div>
          <button onClick={() => setSection("help-tickets")} className="text-sm text-info font-medium">View my tickets</button>
        </div>
      ) : (
        <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Issue Category</label>
            <select value={contactForm.category} onChange={e => setContactForm({ ...contactForm, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary bg-card">
              <option>Login Issue</option><option>Notification Problem</option><option>App Bug</option><option>Visit Query</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Subject</label>
            <input value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
              placeholder="Brief subject"
              className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary bg-card" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Description</label>
            <textarea rows={5} value={contactForm.description} onChange={e => setContactForm({ ...contactForm, description: e.target.value })}
              placeholder="Describe your issue in detail..."
              className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary resize-none bg-card" />
          </div>
          <button onClick={handleSubmitTicket}
            className="w-full bg-primary-deep text-white py-3.5 rounded-xl font-semibold text-sm">
            Submit Ticket
          </button>
        </div>
      )}
    </div>
  )

  const helpTickets = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection("help")} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">My Tickets</span>
      </div>
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {tickets.length === 0 && (
          <p className="text-sm text-muted-foreground/70 bg-card rounded-2xl border border-border p-6 text-center">You haven't raised any tickets yet.</p>
        )}
        {tickets.map(t => (
          <div key={t.id} className="bg-card rounded-2xl border border-border shadow-xs p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-primary-deep">{t.id}</span>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", ticketStatusStyle(t.status))}>{t.status}</span>
            </div>
            <p className="text-sm font-medium text-foreground">{t.subject}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.category} · {t.date}</p>
          </div>
        ))}
      </div>
      <div className="px-4 py-4 border-t border-border bg-card">
        <button onClick={() => { setTicketSubmitted(false); setSection("help-contact") }}
          className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-white flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4" /> Raise New Ticket
        </button>
      </div>
    </div>
  )

  /* ─────────────── Edit Profile ─────────────── */
  const editProfile = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">Edit Profile</span>
      </div>
      <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
        {[
          { key: "name", label: "Full Name" },
          { key: "designation", label: "Designation" },
        ].map(f => (
          <Field key={f.key} label={f.label} value={form[f.key as keyof typeof form] as string} onChange={v => setForm(p => ({ ...p, [f.key]: v }))} />
        ))}

        {/* Sensitive */}
        <Field label="Phone Number" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
        <Field label="Email ID" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />

        {/* Entity type — fixed */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Entity Type</label>
          <div className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm flex items-center justify-between">
            <span className="font-medium text-foreground">{user.entityType}</span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/70"><Lock className="w-3 h-3" /> Auto</span>
          </div>
        </div>

        <Field label="Organization Name" value={form.orgName} onChange={v => setForm(p => ({ ...p, orgName: v }))} />
        <Field label="Organization Address" value={form.orgAddress} onChange={v => setForm(p => ({ ...p, orgAddress: v }))} />

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Role</label>
          <div className="flex rounded-xl border border-border overflow-hidden">
            {(["PI", "Research Team"] as SiteRole[]).map(r => (
              <button key={r} onClick={() => setForm(p => ({ ...p, role: r }))}
                className={cn("flex-1 py-2.5 text-sm font-medium", form.role === r ? "bg-primary text-white" : "bg-card text-muted-foreground")}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Department only when PI */}
        {form.role === "PI" && (
          <Field label="Department" placeholder="e.g. Oncology, Cardiology" value={form.department} onChange={v => setForm(p => ({ ...p, department: v }))} />
        )}

        {/* SMO: hospitals editor */}
        {isSMO && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2 pt-2 border-t border-border">Hospitals</p>
            <div className="space-y-3">
              {hospitals.map((h, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Hospital {i + 1}</span>
                    <button onClick={() => removeHospital(i)} className="text-rose-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <input value={h.name} onChange={e => updateHospital(i, { name: e.target.value })} placeholder="Hospital Name *"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary" />
                  <input value={h.address} onChange={e => updateHospital(i, { address: e.target.value })} placeholder="Hospital Address"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary" />
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Role</label>
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      {(["PI", "Research Team"] as SiteRole[]).map(r => (
                        <button key={r} onClick={() => updateHospital(i, { role: r })}
                          className={cn("flex-1 py-2 text-sm font-medium", h.role === r ? "bg-primary text-white" : "bg-card text-muted-foreground")}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  {h.role === "PI" && (
                    <input value={h.department ?? ""} onChange={e => updateHospital(i, { department: e.target.value })} placeholder="Department"
                      className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary" />
                  )}
                </div>
              ))}
              <button onClick={addHospital}
                className="w-full py-2.5 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground font-medium flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors">
                <Plus className="w-4 h-4" /> Add Hospital
              </button>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 bg-warning/10 border border-warning/20 rounded-xl p-3">
          <ShieldCheck className="w-4 h-4 text-warning mt-0.5 shrink-0" />
          <p className="text-xs text-warning leading-relaxed">Changing your phone or email requires OTP verification.</p>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-border bg-card">
        <button onClick={() => { toast.success("Profile updated"); setSection(null) }}
          className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-white">
          Save Changes
        </button>
      </div>
    </div>
  )

  /* ─────────────── Entity Change ─────────────── */
  const entityChange = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => { setSection(null); setEntityForm({ field: "Entity Type", newValue: "" }); setEntityWarning(false) }} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">Entity Change</span>
      </div>
      <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
        <p className="text-sm text-muted-foreground">Request a change to your registered entity details.</p>

        {/* What are you changing */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">What are you changing?</label>
          <select
            value={entityForm.field}
            onChange={e => setEntityForm({ field: e.target.value, newValue: "" })}
            className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
          >
            {["Entity Type", "Organization Name"].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Current value */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Current Value</label>
          <div className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-muted-foreground">
            {entityForm.field === "Entity Type" ? user.entityType : entityForm.field === "Organization Name" ? user.orgName : user.orgAddress}
          </div>
        </div>

        {/* Change to */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Change To</label>
          {entityForm.field === "Entity Type" ? (
            <select
              value={entityForm.newValue}
              onChange={e => setEntityForm(c => ({ ...c, newValue: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
            >
              <option value="">Select entity type</option>
              {ENTITY_TYPES.filter(o => o !== user.entityType).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input
              value={entityForm.newValue}
              onChange={e => setEntityForm(c => ({ ...c, newValue: e.target.value }))}
              placeholder={`Enter new ${entityForm.field.toLowerCase()}`}
              className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
            />
          )}
        </div>

        {/* SMO → add hospitals */}
        {entityChangingToSMO && (
          <div className="pt-1">
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Hospitals</p>
            <div className="space-y-3">
              {hospitals.map((h, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Hospital {i + 1}</span>
                    <button onClick={() => removeHospital(i)} className="text-rose-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <input value={h.name} onChange={e => updateHospital(i, { name: e.target.value })} placeholder="Hospital Name *"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary" />
                  <input value={h.address} onChange={e => updateHospital(i, { address: e.target.value })} placeholder="Hospital Address"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary" />
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Role</label>
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      {(["PI", "Research Team"] as SiteRole[]).map(r => (
                        <button key={r} onClick={() => updateHospital(i, { role: r })}
                          className={cn("flex-1 py-2 text-sm font-medium", h.role === r ? "bg-primary text-white" : "bg-card text-muted-foreground")}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  {h.role === "PI" && (
                    <input value={h.department ?? ""} onChange={e => updateHospital(i, { department: e.target.value })} placeholder="Department"
                      className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary" />
                  )}
                </div>
              ))}
              <button onClick={addHospital}
                className="w-full py-2.5 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground font-medium flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors">
                <Plus className="w-4 h-4" /> Add Hospital
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="px-5 py-4 border-t border-border bg-card">
        <button
          disabled={!entityCanSubmit}
          onClick={() => setEntityWarning(true)}
          className={cn("w-full py-3.5 rounded-xl font-semibold text-sm", entityCanSubmit ? "bg-primary-deep text-white" : "bg-border text-muted-foreground/70 cursor-not-allowed")}
        >
          Submit Request
        </button>
      </div>

      {/* Warning popup — shown on submit, before the request is sent */}
      {entityWarning && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 px-8">
          <div className="bg-card rounded-2xl p-6 w-full max-w-xs shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <p className="font-semibold text-foreground text-center mb-1">
              {entityForm.field === "Entity Type" ? "Change entity type?" : "Submit change request?"}
            </p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {entityForm.field === "Entity Type"
                ? `Changing your entity type to ${entityForm.newValue || "the selected type"} will permanently erase all data linked to your current originator, and your access type will be changed accordingly. This cannot be undone.`
                : `Submit a request to change your ${entityForm.field.toLowerCase()} to "${entityForm.newValue}"?`}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setEntityWarning(false)} className="flex-1 py-3 rounded-xl border border-border text-foreground/80 text-sm font-semibold">Cancel</button>
              <button onClick={() => { setEntityWarning(false); setEntitySubmitted(true) }} className="flex-1 py-3 rounded-xl bg-primary-deep text-white text-sm font-semibold">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation popup */}
      {entitySubmitted && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 px-8">
          <div className="bg-card rounded-2xl p-6 text-center w-full max-w-xs shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-accent" />
            </div>
            <p className="font-semibold text-foreground mb-1">Request submitted</p>
            <p className="text-sm text-muted-foreground mb-4">We'll verify your request and update your entity details within 24 hours.</p>
            <button
              onClick={() => { setEntitySubmitted(false); setEntityForm({ field: "Entity Type", newValue: "" }); setSection(null) }}
              className="w-full py-3 rounded-xl bg-primary-deep text-white text-sm font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )

  /* ─────────────── Change Password ─────────────── */
  const { current, next, confirm } = passwordForm
  const passwordRules = [
    { label: "8+ characters", met: next.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(next) },
    { label: "Lowercase letter", met: /[a-z]/.test(next) },
    { label: "Number", met: /[0-9]/.test(next) },
    { label: "Special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(next) },
  ]
  const metRules = passwordRules.filter(r => r.met).length
  const strengthPercentage = (metRules / passwordRules.length) * 100
  const allRulesMet = metRules === passwordRules.length
  const passwordsMatch = next.length > 0 && next === confirm
  const mismatch = confirm.length > 0 && next !== confirm
  const canSavePwd = current.length > 0 && allRulesMet && passwordsMatch
  const pwdFields = [
    { key: "current", label: "Current Password" },
    { key: "next", label: "New Password" },
    { key: "confirm", label: "Confirm New Password" },
  ] as const

  const changePassword = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">Change Password</span>
      </div>
      <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
        {pwdFields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">{f.label}</label>
            <div className="relative">
              <input
                type={showPwd[f.key] ? "text" : "password"}
                value={passwordForm[f.key]}
                onChange={e => setPasswordForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
              />
              <button type="button" onClick={() => setShowPwd(s => ({ ...s, [f.key]: !s[f.key] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-muted-foreground">
                {showPwd[f.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}

        {passwordsMatch && <p className="text-accent text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Passwords match</p>}
        {mismatch && <p className="text-destructive text-sm flex items-center gap-1"><X className="w-4 h-4" /> Passwords do not match</p>}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-info to-accent transition-all" style={{ width: `${strengthPercentage}%` }} />
          </div>
          <span className={cn("text-sm font-medium", strengthPercentage >= 80 ? "text-accent" : strengthPercentage >= 60 ? "text-warning" : "text-destructive")}>
            {strengthPercentage >= 80 ? "Strong" : strengthPercentage >= 60 ? "Medium" : "Weak"}
          </span>
        </div>

        <div className="space-y-1.5">
          {passwordRules.map(rule => (
            <div key={rule.label} className="flex items-center gap-2">
              {rule.met ? <Check className="w-4 h-4 text-accent" /> : <X className="w-4 h-4 text-muted-foreground/70" />}
              <span className={cn("text-sm", rule.met ? "text-accent" : "text-muted-foreground")}>{rule.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 border-t border-border bg-card">
        <button
          onClick={() => { toast.success("Password changed"); setPasswordForm({ current: "", next: "", confirm: "" }); setSection(null) }}
          disabled={!canSavePwd}
          className={cn("w-full py-3.5 rounded-xl font-semibold text-sm transition-all", canSavePwd ? "bg-primary-deep text-white" : "bg-border text-muted-foreground/70 cursor-not-allowed")}
        >
          Update Password
        </button>
      </div>
    </div>
  )

  /* ─────────────── Notification Preferences ─────────────── */
  const notifications = (
    <div className="absolute inset-0 z-50 bg-surface flex flex-col">
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
        <span className="font-semibold flex-1">Notification Preferences</span>
      </div>
      <div className="flex-1 overflow-auto px-5 py-5 space-y-5">
        {[
          {
            title: "Activity", items: [
              { key: "visitReminders", label: "Visit reminders", desc: "Upcoming and overdue patient visits" },
              { key: "patientUpdates", label: "Patient updates", desc: "New messages and status changes" },
              { key: "protocolDeviations", label: "Protocol deviations", desc: "Alerts when a deviation is logged" },
              { key: "weeklyDigest", label: "Weekly digest", desc: "A summary every Monday" },
            ],
          },
          {
            title: "Channels", items: [
              { key: "emailAlerts", label: "Email", desc: "Send notifications to your email" },
              { key: "smsAlerts", label: "SMS", desc: "Send text messages to your phone" },
              { key: "pushAlerts", label: "Push", desc: "In-app push notifications" },
            ],
          },
        ].map(group => (
          <div key={group.title}>
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">{group.title}</p>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {group.items.map(item => {
                const on = notifPrefs[item.key as keyof typeof notifPrefs]
                return (
                  <button key={item.key} onClick={() => setNotifPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof notifPrefs] }))}
                    className="w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 text-left">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground/70">{item.desc}</p>
                    </div>
                    <span className={cn("w-11 h-6 rounded-full p-0.5 flex-shrink-0 transition-colors", on ? "bg-primary" : "bg-slate-300")}>
                      <span className={cn("block w-5 h-5 bg-card rounded-full shadow-sm transition-transform", on ? "translate-x-5" : "translate-x-0")} />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-border bg-card">
        <button onClick={() => { toast.success("Preferences saved"); setSection(null) }}
          className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-white">
          Save Preferences
        </button>
      </div>
    </div>
  )

  return (
    <>
      {profileBody}
      {section === "edit-profile" && editProfile}
      {section === "entity-change" && entityChange}
      {section === "change-password" && changePassword}
      {section === "notifications" && notifications}
      {section === "my-trials" && myTrials}
      {section === "team-members" && teamMembersScreen}
      {section === "invite-member" && inviteMember}
      {section === "reports" && reports}
      {section === "tnc" && tnc}
      {section === "help" && help}
      {section === "help-faq" && helpFaq}
      {section === "help-contact" && helpContact}
      {section === "help-tickets" && helpTickets}
    </>
  )
}

// Small labelled text input
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground/80 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
      />
    </div>
  )
}
