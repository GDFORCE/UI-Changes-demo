"use client"

import { useState } from "react"
import { Camera, ShieldCheck, UserPen, Lock, Bell, ChevronRight, ChevronLeft, ChevronDown, Eye, EyeOff, Check, X, LogOut, Mail, Phone, Plus, Trash2, Building2, FlaskConical, FileText, HelpCircle, BarChart2, Users, UserCheck, AlertTriangle, MessageCircle, Clock, Ticket } from "lucide-react"
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

  // ── Shared dawn sheet scaffolding (every sub-view) ──
  const SheetHeader = ({ eyebrow = "Profile", title, onBack, right }: { eyebrow?: string; title: string; onBack: () => void; right?: React.ReactNode }) => (
    <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
      <div className="relative flex items-center gap-3">
        <button onClick={onBack} aria-label="Back" className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="eyebrow text-primary-foreground/55">{eyebrow}</p>
          <h1 className="display-serif text-lg leading-tight truncate">{title}</h1>
        </div>
        {right}
      </div>
    </div>
  )

  const Sheet = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute inset-0 z-50 bg-background flex flex-col animate-fade-in">{children}</div>
  )

  // ── A single menu row with a tinted icon tile ──
  const MenuRow = ({ icon: Icon, label, onClick, bg, ic }: { icon: React.FC<{ className?: string }>; label: string; onClick: () => void; bg: string; ic: string }) => (
    <button onClick={onClick} className="springy w-full flex items-center gap-3 px-4 py-3.5 active:bg-muted/40 transition-colors">
      <span className={cn("grid h-9 w-9 place-items-center rounded-full shrink-0", bg)}>
        <Icon className={cn("w-5 h-5", ic)} />
      </span>
      <span className="flex-1 text-[15px] text-foreground text-left">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
    </button>
  )

  /* ─────────────── Profile body ─────────────── */
  const profileBody = (
    <div className="flex-1 overflow-auto scrollbar-hide pb-8">
      {/* Identity hero — the dawn gesture */}
      <div className="px-4 pt-4">
        <div className="dawn-gradient hero-glow paper-grain rounded-3xl p-5 text-primary-foreground shadow-md animate-rise" style={{ animationDelay: "40ms" }}>
          <div className="relative flex items-center gap-4">
            <div className="relative animate-pop" style={{ animationDelay: "120ms" }}>
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/30 flex items-center justify-center">
                <span className="font-heading text-2xl font-bold">{user.initials}</span>
              </div>
              <button className="springy absolute -bottom-1 -right-1 w-7 h-7 bg-card rounded-full border border-border flex items-center justify-center shadow active:scale-90">
                <Camera className="w-3.5 h-3.5 text-primary" />
              </button>
            </div>
            <div className="min-w-0">
              <h2 className="font-heading text-xl leading-tight truncate">{user.name}</h2>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold">
                <ShieldCheck className="w-3 h-3" /> {user.designation}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="px-4 mt-4 animate-rise" style={{ animationDelay: "110ms" }}>
        <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
          <p className="eyebrow text-muted-foreground mb-1">Account details</p>
          <div className="divide-y divide-border/60">
            {[
              { label: "Phone Number", val: user.phone, verify: true },
              { label: "Email ID", val: user.email, verify: true },
              { label: "Entity Type", val: user.entityType },
              { label: "Org. Name", val: user.orgName },
              { label: "Org. Address", val: user.orgAddress },
              ...(isSMO ? [] : [
                { label: "Role", val: user.role },
                ...(user.role === "PI" ? [{ label: "Department", val: user.department || "—" }] : []),
              ]),
            ].map(r => (
              <div key={r.label} className="py-2.5">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {r.label}
                  {r.verify && <ShieldCheck className="w-3 h-3 text-success" />}
                </p>
                <p className="text-sm text-foreground font-medium mt-0.5">{r.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SMO: hospitals managed by this user */}
      {isSMO && (
        <div className="px-4 mt-4 animate-rise" style={{ animationDelay: "170ms" }}>
          <p className="eyebrow text-muted-foreground mb-2 px-1">Hospitals</p>
          <div className="space-y-2">
            {hospitals.length === 0 && (
              <p className="text-sm text-muted-foreground/70 bg-card rounded-2xl border border-border p-4 text-center shadow-xs">No hospitals added yet.</p>
            )}
            {hospitals.map((h, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-sm font-semibold text-foreground">{h.name || "Unnamed Hospital"}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{h.address || "No address"}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold bg-secondary/60 text-primary px-2 py-0.5 rounded-full">{h.role}</span>
                  {h.role === "PI" && h.department && (
                    <span className="text-[10px] font-medium text-muted-foreground">{h.department}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grouped menus */}
      {[
        {
          eyebrow: "Account", delay: "230ms",
          rows: [
            { icon: UserPen, label: "Edit Profile", onClick: () => setSection("edit-profile"), bg: "bg-info/10", ic: "text-info" },
            { icon: Building2, label: "Entity Change", onClick: () => setSection("entity-change"), bg: "bg-accent/12", ic: "text-accent" },
            { icon: Lock, label: "Change Password", onClick: () => setSection("change-password"), bg: "bg-violet/10", ic: "text-violet" },
            { icon: Bell, label: "Notification Preferences", onClick: () => setSection("notifications"), bg: "bg-warning/15", ic: "text-warning" },
          ],
        },
        {
          eyebrow: "Trial Management", delay: "300ms",
          rows: [
            { icon: FlaskConical, label: "My Trials", onClick: onOpenTrials ?? (() => setSection("my-trials")), bg: "bg-info/10", ic: "text-info" },
            { icon: Users, label: "Team Members", onClick: () => setSection("team-members"), bg: "bg-success/15", ic: "text-success" },
          ],
        },
        {
          eyebrow: "Reports & Support", delay: "370ms",
          rows: [
            { icon: BarChart2, label: "Reports", onClick: () => setSection("reports"), bg: "bg-violet/10", ic: "text-violet" },
            { icon: FileText, label: "T&C", onClick: () => setSection("tnc"), bg: "bg-info/10", ic: "text-info" },
            { icon: HelpCircle, label: "Help & Support", onClick: () => setSection("help"), bg: "bg-accent/12", ic: "text-accent" },
          ],
        },
      ].map(group => (
        <div key={group.eyebrow} className="px-4 mt-4 animate-rise" style={{ animationDelay: group.delay }}>
          <p className="eyebrow text-muted-foreground mb-2 px-1">{group.eyebrow}</p>
          <div className="bg-card rounded-2xl border border-border divide-y divide-border shadow-xs overflow-hidden">
            {group.rows.map(r => <MenuRow key={r.label} {...r} />)}
          </div>
        </div>
      ))}

      <div className="px-4 mt-5 animate-rise" style={{ animationDelay: "440ms" }}>
        <button onClick={onSignOut} className="springy w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-destructive/25 bg-card text-destructive text-sm font-semibold active:scale-[0.98]">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  )

  /* ─────────────── My Trials ─────────────── */
  const myTrials = (
    <Sheet>
      <SheetHeader eyebrow="Trial management" title="My Trials" onBack={() => setSection(null)} right={<span className="text-xs text-primary-foreground/70">{trials.length} total</span>} />
      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
        {trials.map((t, i) => (
          <div key={t.id} className="bg-card rounded-2xl border border-border shadow-xs p-4 flex items-center gap-3 animate-rise" style={{ animationDelay: `${40 + i * 60}ms` }}>
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center flex-shrink-0">
              <FlaskConical className="w-5 h-5 text-info" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{t.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{t.id}</p>
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  )

  /* ─────────────── Team Members ─────────────── */
  const teamMembersScreen = (
    <Sheet>
      <SheetHeader eyebrow="Trial management" title="Team Members" onBack={() => setSection(null)} right={<span className="text-xs text-primary-foreground/70">{teamMembers.length} total</span>} />
      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
        {teamMembers.map((m, idx) => {
          const expanded = expandedMemberId === m.id
          return (
            <div key={m.id} className="bg-card rounded-2xl border border-border shadow-xs p-4 animate-rise" style={{ animationDelay: `${40 + idx * 60}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary/60 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  {m.name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-foreground truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.designation}</p>
                </div>
                <span className="text-[10px] font-semibold bg-secondary/60 text-primary px-2 py-0.5 rounded-full flex-shrink-0">{m.role}</span>
              </div>
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
              <button onClick={() => setExpandedMemberId(expanded ? null : m.id)}
                className="springy mt-3 w-full flex items-center justify-between bg-secondary/40 rounded-xl px-3 py-2 text-left active:scale-[0.99]">
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
      <div className="px-4 py-4 border-t border-border bg-card">
        <button onClick={() => setSection("invite-member")}
          className="springy w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-primary-foreground flex items-center justify-center gap-2 active:scale-[0.98]">
          <UserCheck className="w-4 h-4" /> Invite Members
        </button>
      </div>
    </Sheet>
  )

  /* ─────────────── Invite Member ─────────────── */
  const inviteMember = (
    <Sheet>
      <SheetHeader eyebrow="Team members" title="Invite Member" onBack={() => setSection("team-members")} />
      <div className="flex-1 overflow-auto scrollbar-hide px-5 py-5 space-y-4">
        <Field label="Full Name *" value={inviteForm.name} onChange={v => setInviteForm(p => ({ ...p, name: v }))} placeholder="Enter member's name" />
        <Field label="Designation" value={inviteForm.designation} onChange={v => setInviteForm(p => ({ ...p, designation: v }))} placeholder="e.g. Research Associate" />
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Phone Number</label>
          <div className="flex gap-2">
            <div className="px-4 py-3 rounded-xl border border-border bg-surface text-muted-foreground text-sm font-mono">+91</div>
            <input value={inviteForm.phone} onChange={e => setInviteForm(p => ({ ...p, phone: e.target.value }))} placeholder="Enter phone number" type="tel"
              className="flex-1 px-4 py-3 rounded-xl border border-border outline-none text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30 bg-card" />
          </div>
        </div>
        <Field label="Email ID *" value={inviteForm.email} onChange={v => setInviteForm(p => ({ ...p, email: v }))} placeholder="member@example.com" />
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Role</label>
          <div className="flex rounded-full bg-muted p-1">
            {(["PI", "Research Team"] as SiteRole[]).map(r => (
              <button key={r} onClick={() => setInviteForm(p => ({ ...p, role: r }))}
                className={cn("flex-1 py-2 rounded-full text-sm font-semibold transition-all", inviteForm.role === r ? "bg-card text-foreground shadow-xs" : "text-muted-foreground")}>
                {r}
              </button>
            ))}
          </div>
        </div>
        {inviteForm.role === "PI" && (
          <Field label="Department" value={inviteForm.department} onChange={v => setInviteForm(p => ({ ...p, department: v }))} placeholder="e.g. Oncology" />
        )}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Trials Involved</label>
          <div className="space-y-2">
            {trials.map(t => {
              const checked = inviteForm.trials.includes(t.id)
              return (
                <button key={t.id} onClick={() => toggleInviteTrial(t.id)}
                  className={cn("springy w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors active:scale-[0.99]",
                    checked ? "border-primary bg-primary/8" : "border-border bg-card")}>
                  <span className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    checked ? "border-primary bg-primary" : "border-border")}>
                    {checked && <Check className="w-3 h-3 text-primary-foreground" />}
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
        <div className="flex items-start gap-2 bg-info/8 border border-info/20 rounded-xl p-3">
          <Mail className="w-4 h-4 text-info mt-0.5 shrink-0" />
          <p className="text-xs text-info">An invitation email will be sent. The member joins once they accept and verify their identity.</p>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-border bg-card">
        <button onClick={handleSendInvite} disabled={!inviteForm.name || !inviteForm.email}
          className={cn("springy w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
            inviteForm.name && inviteForm.email ? "bg-primary-deep text-primary-foreground" : "bg-muted text-muted-foreground/70 cursor-not-allowed")}>
          <Mail className="w-4 h-4" /> Send Invite
        </button>
      </div>
    </Sheet>
  )

  /* ─────────────── Reports ─────────────── */
  const reports = (
    <Sheet>
      <SheetHeader eyebrow="Insights" title="Reports" onBack={() => setSection(null)} />
      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
        {[
          { label: "Enrolment Summary", desc: "Screened, randomized & withdrawn", bg: "bg-info/10", ic: "text-info" },
          { label: "Visit Compliance", desc: "On-time vs overdue visits", bg: "bg-success/15", ic: "text-success" },
          { label: "Protocol Deviations", desc: "Logged deviations by trial", bg: "bg-warning/15", ic: "text-warning" },
          { label: "Patient Status", desc: "Active, completed & dropouts", bg: "bg-violet/10", ic: "text-violet" },
        ].map((r, i) => (
          <button key={r.label} className="springy w-full bg-card rounded-2xl border border-border shadow-xs p-4 flex items-center gap-3 text-left active:scale-[0.99] animate-rise" style={{ animationDelay: `${40 + i * 60}ms` }}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", r.bg)}>
              <BarChart2 className={cn("w-5 h-5", r.ic)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{r.label}</p>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          </button>
        ))}
      </div>
    </Sheet>
  )

  /* ─────────────── T&C ─────────────── */
  const tnc = (
    <Sheet>
      <SheetHeader eyebrow="Legal" title="Terms & Conditions" onBack={() => setSection(null)} />
      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
        {[
          { t: "1. Acceptance of Terms", d: "By using this platform you agree to be bound by these Terms and our Privacy Policy." },
          { t: "2. Data Privacy & Compliance", d: "All personal and clinical data is handled per applicable data protection laws and used solely for clinical trial management." },
          { t: "3. Data Security", d: "We use encryption at rest and in transit. You are responsible for keeping your credentials confidential." },
          { t: "4. Use of Platform", d: "Access is granted strictly for clinical trial management. Misuse may result in account termination." },
          { t: "5. Audit & Compliance", d: "All actions are logged for audit and may be shared with authorized regulators upon request." },
          { t: "6. Contact", d: "For questions about these terms, contact support@mtb-pvs.com." },
        ].map((s, i) => (
          <div key={s.t} className="bg-card rounded-2xl border border-border p-4 shadow-xs animate-rise" style={{ animationDelay: `${40 + i * 50}ms` }}>
            <p className="font-heading text-base text-foreground mb-1">{s.t}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
    </Sheet>
  )

  /* ─────────────── Help & Support ─────────────── */
  const helpFaqs = [
    { q: "How do I reset my password?", a: "Go to Account → Change Password, enter your current password, then set a new one that meets all the strength requirements. If you're locked out, use 'Forgot Password' on the sign-in screen and verify via OTP." },
    { q: "How do I invite a team member?", a: "Open Trial Management → Team Members → Invite Members. Fill in the name, email, role and the trials they should be involved in, then tap Send Invite. They'll receive an email to join." },
    { q: "How are patient visits scheduled?", a: "Visits are auto-calculated from the patient's baseline date using the trial's visit template. You can review and adjust each visit's date and window from the patient's schedule." },
    { q: "How do I report a protocol deviation?", a: "Open the relevant patient or visit record and use 'Report Deviation'. Add the details and submit — it's logged for audit and routed to the PI and sponsor for review." },
  ]

  const help = (
    <Sheet>
      <SheetHeader eyebrow="Help & support" title="Help & Support" onBack={() => setSection(null)} />
      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
        {[
          { icon: HelpCircle,    bg: "bg-info/10",    ic: "text-info",     label: "Frequently Asked Questions", sub: "Browse common questions",      action: () => setSection("help-faq") },
          { icon: MessageCircle, bg: "bg-success/15", ic: "text-success",  label: "Contact Support",            sub: "Get help from our team",       action: () => { setTicketSubmitted(false); setSection("help-contact") } },
          { icon: Ticket,        bg: "bg-violet/10",  ic: "text-violet",   label: "My Tickets",                 sub: "Track your raised tickets",    action: () => setSection("help-tickets") },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <button key={i} onClick={item.action} className="springy w-full bg-card rounded-2xl p-4 flex items-center justify-between shadow-xs border border-border active:scale-[0.99] animate-rise" style={{ animationDelay: `${40 + i * 60}ms` }}>
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

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs animate-rise" style={{ animationDelay: "220ms" }}>
          <p className="eyebrow text-primary mb-3">Contact Us</p>
          <div className="space-y-2.5">
            <a href="mailto:support@patientvisitschedule.com" className="springy flex items-center gap-2.5 active:scale-[0.99]">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-info/10"><Mail className="w-4 h-4 text-info" /></span>
              <span className="text-sm text-foreground/80">support@patientvisitschedule.com</span>
            </a>
            <a href="tel:1800XXXXXXX" className="springy flex items-center gap-2.5 active:scale-[0.99]">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-success/15"><Phone className="w-4 h-4 text-success" /></span>
              <span className="text-sm text-foreground/80">1800-XXX-XXXX (Toll Free)</span>
            </a>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-warning/15"><Clock className="w-4 h-4 text-warning" /></span>
              <span className="text-sm text-foreground/80">Mon – Fri, 9:00 AM – 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  )

  const helpFaq = (
    <Sheet>
      <SheetHeader eyebrow="Help & support" title="FAQ" onBack={() => setSection("help")} />
      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-2.5">
        {helpFaqs.map((item, i) => {
          const open = expandedFaq === item.q
          return (
            <div key={item.q} className={cn("rounded-2xl border bg-card shadow-xs overflow-hidden transition-colors animate-rise", open ? "border-primary/40" : "border-border")} style={{ animationDelay: `${40 + i * 60}ms` }}>
              <button onClick={() => setExpandedFaq(open ? null : item.q)} className="w-full px-4 py-4 flex items-center justify-between gap-3 text-left">
                <span className={cn("text-sm font-medium", open ? "text-primary" : "text-foreground")}>{item.q}</span>
                <ChevronDown className={cn("w-5 h-5 flex-shrink-0 transition-transform", open ? "rotate-180 text-primary" : "text-muted-foreground")} />
              </button>
              {open && <div className="px-4 pb-4"><p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p></div>}
            </div>
          )
        })}
      </div>
    </Sheet>
  )

  const helpContact = (
    <Sheet>
      <SheetHeader eyebrow="Help & support" title="Contact Support" onBack={() => { setSection("help"); setTicketSubmitted(false) }} />
      {ticketSubmitted ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
          <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center animate-pop">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h3 className="font-heading text-foreground text-xl">Ticket Submitted!</h3>
          <p className="text-sm text-muted-foreground">We'll respond within 24 hours.</p>
          <div className="bg-card rounded-2xl px-5 py-3 border border-border shadow-xs">
            <p className="eyebrow text-muted-foreground">Ticket ID</p>
            <p className="font-mono text-primary-deep font-semibold mt-0.5">{lastTicketId}</p>
          </div>
          <button onClick={() => setSection("help-tickets")} className="text-sm text-info font-semibold">View my tickets →</button>
        </div>
      ) : (
        <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4 animate-rise" style={{ animationDelay: "40ms" }}>
            <div>
              <label className="eyebrow text-muted-foreground mb-1.5 block">Issue Category</label>
              <select value={contactForm.category} onChange={e => setContactForm({ ...contactForm, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30 bg-card">
                <option>Login Issue</option><option>Notification Problem</option><option>App Bug</option><option>Visit Query</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="eyebrow text-muted-foreground mb-1.5 block">Subject</label>
              <input value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Brief subject"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30 bg-card" />
            </div>
            <div>
              <label className="eyebrow text-muted-foreground mb-1.5 block">Description</label>
              <textarea rows={5} value={contactForm.description} onChange={e => setContactForm({ ...contactForm, description: e.target.value })}
                placeholder="Describe your issue in detail..."
                className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30 resize-none bg-card" />
            </div>
          </div>
          <button onClick={handleSubmitTicket}
            className="springy w-full bg-primary-deep text-primary-foreground py-3.5 rounded-xl font-semibold text-sm active:scale-[0.98]">
            Submit Ticket
          </button>
        </div>
      )}
    </Sheet>
  )

  const helpTickets = (
    <Sheet>
      <SheetHeader eyebrow="Help & support" title="My Tickets" onBack={() => setSection("help")} />
      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-3">
        {tickets.length === 0 && (
          <div className="flex flex-col items-center gap-2 bg-card rounded-2xl border border-border p-8 text-center shadow-xs">
            <Ticket className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground/70">You haven't raised any tickets yet.</p>
          </div>
        )}
        {tickets.map((t, i) => (
          <div key={t.id} className="bg-card rounded-2xl border border-border shadow-xs p-4 animate-rise" style={{ animationDelay: `${40 + i * 60}ms` }}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-primary-deep">{t.id}</span>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", ticketStatusStyle(t.status))}>{t.status}</span>
            </div>
            <p className="text-sm font-medium text-foreground">{t.subject}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.category} · {t.date}</p>
          </div>
        ))}
      </div>
      <div className="px-4 py-4 border-t border-border bg-card">
        <button onClick={() => { setTicketSubmitted(false); setSection("help-contact") }}
          className="springy w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-primary-foreground flex items-center justify-center gap-2 active:scale-[0.98]">
          <MessageCircle className="w-4 h-4" /> Raise New Ticket
        </button>
      </div>
    </Sheet>
  )

  /* ─────────────── Edit Profile ─────────────── */
  const editProfile = (
    <Sheet>
      <SheetHeader eyebrow="Account" title="Edit Profile" onBack={() => setSection(null)} />
      <div className="flex-1 overflow-auto scrollbar-hide px-5 py-5 space-y-4">
        {[
          { key: "name", label: "Full Name" },
          { key: "designation", label: "Designation" },
        ].map(f => (
          <Field key={f.key} label={f.label} value={form[f.key as keyof typeof form] as string} onChange={v => setForm(p => ({ ...p, [f.key]: v }))} />
        ))}

        <Field label="Phone Number" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
        <Field label="Email ID" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Entity Type</label>
          <div className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm flex items-center justify-between">
            <span className="font-medium text-foreground">{user.entityType}</span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/70"><Lock className="w-3 h-3" /> Auto</span>
          </div>
        </div>

        <Field label="Organization Name" value={form.orgName} onChange={v => setForm(p => ({ ...p, orgName: v }))} />
        <Field label="Organization Address" value={form.orgAddress} onChange={v => setForm(p => ({ ...p, orgAddress: v }))} />

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Role</label>
          <div className="flex rounded-full bg-muted p-1">
            {(["PI", "Research Team"] as SiteRole[]).map(r => (
              <button key={r} onClick={() => setForm(p => ({ ...p, role: r }))}
                className={cn("flex-1 py-2 rounded-full text-sm font-semibold transition-all", form.role === r ? "bg-card text-foreground shadow-xs" : "text-muted-foreground")}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {form.role === "PI" && (
          <Field label="Department" placeholder="e.g. Oncology, Cardiology" value={form.department} onChange={v => setForm(p => ({ ...p, department: v }))} />
        )}

        {isSMO && (
          <div>
            <p className="eyebrow text-muted-foreground mb-2 pt-2 border-t border-border">Hospitals</p>
            <div className="space-y-3">
              {hospitals.map((h, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Hospital {i + 1}</span>
                    <button onClick={() => removeHospital(i)} className="springy text-destructive/70 hover:text-destructive active:scale-90"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <input value={h.name} onChange={e => updateHospital(i, { name: e.target.value })} placeholder="Hospital Name *"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary bg-card" />
                  <input value={h.address} onChange={e => updateHospital(i, { address: e.target.value })} placeholder="Hospital Address"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary bg-card" />
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Role</label>
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      {(["PI", "Research Team"] as SiteRole[]).map(r => (
                        <button key={r} onClick={() => updateHospital(i, { role: r })}
                          className={cn("flex-1 py-2 text-sm font-medium", h.role === r ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  {h.role === "PI" && (
                    <input value={h.department ?? ""} onChange={e => updateHospital(i, { department: e.target.value })} placeholder="Department"
                      className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary bg-card" />
                  )}
                </div>
              ))}
              <button onClick={addHospital}
                className="springy w-full py-2.5 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground font-medium flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors active:scale-[0.99]">
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
          className="springy w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-primary-foreground active:scale-[0.98]">
          Save Changes
        </button>
      </div>
    </Sheet>
  )

  /* ─────────────── Entity Change ─────────────── */
  const entityChange = (
    <Sheet>
      <SheetHeader eyebrow="Account" title="Entity Change" onBack={() => { setSection(null); setEntityForm({ field: "Entity Type", newValue: "" }); setEntityWarning(false) }} />
      <div className="flex-1 overflow-auto scrollbar-hide px-5 py-5 space-y-4">
        <p className="text-sm text-muted-foreground">Request a change to your registered entity details.</p>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">What are you changing?</label>
          <select
            value={entityForm.field}
            onChange={e => setEntityForm({ field: e.target.value, newValue: "" })}
            className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30 bg-card"
          >
            {["Entity Type", "Organization Name"].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Current Value</label>
          <div className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-muted-foreground">
            {entityForm.field === "Entity Type" ? user.entityType : entityForm.field === "Organization Name" ? user.orgName : user.orgAddress}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Change To</label>
          {entityForm.field === "Entity Type" ? (
            <select
              value={entityForm.newValue}
              onChange={e => setEntityForm(c => ({ ...c, newValue: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30 bg-card"
            >
              <option value="">Select entity type</option>
              {ENTITY_TYPES.filter(o => o !== user.entityType).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input
              value={entityForm.newValue}
              onChange={e => setEntityForm(c => ({ ...c, newValue: e.target.value }))}
              placeholder={`Enter new ${entityForm.field.toLowerCase()}`}
              className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30 bg-card"
            />
          )}
        </div>

        {entityChangingToSMO && (
          <div className="pt-1">
            <p className="eyebrow text-muted-foreground mb-2">Hospitals</p>
            <div className="space-y-3">
              {hospitals.map((h, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Hospital {i + 1}</span>
                    <button onClick={() => removeHospital(i)} className="springy text-destructive/70 hover:text-destructive active:scale-90"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <input value={h.name} onChange={e => updateHospital(i, { name: e.target.value })} placeholder="Hospital Name *"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary bg-card" />
                  <input value={h.address} onChange={e => updateHospital(i, { address: e.target.value })} placeholder="Hospital Address"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary bg-card" />
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Role</label>
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      {(["PI", "Research Team"] as SiteRole[]).map(r => (
                        <button key={r} onClick={() => updateHospital(i, { role: r })}
                          className={cn("flex-1 py-2 text-sm font-medium", h.role === r ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  {h.role === "PI" && (
                    <input value={h.department ?? ""} onChange={e => updateHospital(i, { department: e.target.value })} placeholder="Department"
                      className="w-full px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary bg-card" />
                  )}
                </div>
              ))}
              <button onClick={addHospital}
                className="springy w-full py-2.5 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground font-medium flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors active:scale-[0.99]">
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
          className={cn("springy w-full py-3.5 rounded-xl font-semibold text-sm active:scale-[0.98]", entityCanSubmit ? "bg-primary-deep text-primary-foreground" : "bg-muted text-muted-foreground/70 cursor-not-allowed")}
        >
          Submit Request
        </button>
      </div>

      {entityWarning && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 px-8 animate-fade-in">
          <div className="bg-card rounded-3xl p-6 w-full max-w-xs shadow-2xl animate-rise">
            <div className="w-12 h-12 rounded-full bg-warning/15 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <p className="font-heading text-foreground text-center text-lg mb-1">
              {entityForm.field === "Entity Type" ? "Change entity type?" : "Submit change request?"}
            </p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {entityForm.field === "Entity Type"
                ? `Changing your entity type to ${entityForm.newValue || "the selected type"} will permanently erase all data linked to your current originator, and your access type will be changed accordingly. This cannot be undone.`
                : `Submit a request to change your ${entityForm.field.toLowerCase()} to "${entityForm.newValue}"?`}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setEntityWarning(false)} className="springy flex-1 py-3 rounded-xl border border-border text-foreground/80 text-sm font-semibold active:scale-95">Cancel</button>
              <button onClick={() => { setEntityWarning(false); setEntitySubmitted(true) }} className="springy flex-1 py-3 rounded-xl bg-primary-deep text-primary-foreground text-sm font-semibold active:scale-95">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {entitySubmitted && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 px-8 animate-fade-in">
          <div className="bg-card rounded-3xl p-6 text-center w-full max-w-xs shadow-2xl animate-rise">
            <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-3 animate-pop">
              <Check className="w-6 h-6 text-success" />
            </div>
            <p className="font-heading text-foreground text-lg mb-1">Request submitted</p>
            <p className="text-sm text-muted-foreground mb-4">We'll verify your request and update your entity details within 24 hours.</p>
            <button
              onClick={() => { setEntitySubmitted(false); setEntityForm({ field: "Entity Type", newValue: "" }); setSection(null) }}
              className="springy w-full py-3 rounded-xl bg-primary-deep text-primary-foreground text-sm font-semibold active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Sheet>
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
    <Sheet>
      <SheetHeader eyebrow="Account" title="Change Password" onBack={() => setSection(null)} />
      <div className="flex-1 overflow-auto scrollbar-hide px-5 py-5 space-y-4">
        {pwdFields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">{f.label}</label>
            <div className="relative">
              <input
                type={showPwd[f.key] ? "text" : "password"}
                value={passwordForm[f.key]}
                onChange={e => setPasswordForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-border outline-none text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30 bg-card"
              />
              <button type="button" onClick={() => setShowPwd(s => ({ ...s, [f.key]: !s[f.key] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-muted-foreground">
                {showPwd[f.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}

        {passwordsMatch && <p className="text-success text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Passwords match</p>}
        {mismatch && <p className="text-destructive text-sm flex items-center gap-1"><X className="w-4 h-4" /> Passwords do not match</p>}

        {next.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full rounded-full dawn-gradient transition-all" style={{ width: `${strengthPercentage}%` }} />
            </div>
            <span className={cn("text-sm font-semibold", strengthPercentage >= 80 ? "text-success" : strengthPercentage >= 60 ? "text-warning" : "text-destructive")}>
              {strengthPercentage >= 80 ? "Strong" : strengthPercentage >= 60 ? "Medium" : "Weak"}
            </span>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-2">
          <p className="eyebrow text-muted-foreground mb-1">Requirements</p>
          {passwordRules.map(rule => (
            <div key={rule.label} className="flex items-center gap-2.5">
              <span className={cn("grid h-5 w-5 place-items-center rounded-full flex-shrink-0", rule.met ? "bg-success/15" : "bg-muted")}>
                {rule.met ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3 text-muted-foreground/60" />}
              </span>
              <span className={cn("text-sm", rule.met ? "text-foreground" : "text-muted-foreground")}>{rule.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 border-t border-border bg-card">
        <button
          onClick={() => { toast.success("Password changed"); setPasswordForm({ current: "", next: "", confirm: "" }); setSection(null) }}
          disabled={!canSavePwd}
          className={cn("springy w-full py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]", canSavePwd ? "bg-primary-deep text-primary-foreground" : "bg-muted text-muted-foreground/70 cursor-not-allowed")}
        >
          Update Password
        </button>
      </div>
    </Sheet>
  )

  /* ─────────────── Notification Preferences ─────────────── */
  const notifications = (
    <Sheet>
      <SheetHeader eyebrow="Account" title="Notifications" onBack={() => setSection(null)} />
      <div className="flex-1 overflow-auto scrollbar-hide px-5 py-5 space-y-5">
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
        ].map((group, gi) => (
          <div key={group.title} className="animate-rise" style={{ animationDelay: `${40 + gi * 80}ms` }}>
            <p className="eyebrow text-muted-foreground mb-2">{group.title}</p>
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs divide-y divide-border">
              {group.items.map(item => {
                const on = notifPrefs[item.key as keyof typeof notifPrefs]
                return (
                  <button key={item.key} onClick={() => setNotifPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof notifPrefs] }))}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground/70">{item.desc}</p>
                    </div>
                    <span className={cn("w-11 h-6 rounded-full p-0.5 flex-shrink-0 transition-colors", on ? "dawn-gradient" : "bg-border")}>
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
          className="springy w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-primary-foreground active:scale-[0.98]">
          Save Preferences
        </button>
      </div>
    </Sheet>
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
        className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30 bg-card"
      />
    </div>
  )
}
