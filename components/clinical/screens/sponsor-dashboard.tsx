"use client"

import { useState, useEffect, useRef } from "react"
import {
  LayoutDashboard, FlaskConical, MapPin, Bell, User, MessageCircle,
  ChevronRight, ChevronDown, Search, TrendingUp,
  BarChart2, ShieldCheck, Users, Download, Phone, Mail,
  X, Check, AlertTriangle, Info, SlidersHorizontal, ArrowUpRight, Sun,
  FileText, UserPen, Lock, LogOut, Camera,
  UserCheck, Eye, EyeOff, HelpCircle, Building2, Clock, Ticket
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { TrialActionsMenu } from "@/components/clinical/trial-actions-menu"
import { StatusBadge as SharedStatusBadge } from "@/components/clinical/status-badge"
import { ENTITY_TYPES, ticketStatusStyle, type SupportTicket } from "@/components/clinical/screens/site-user-profile"

interface SponsorDashboardProps {
  onNavigate: (screen: string) => void
  /** When set, the dashboard opens directly on this trial's summary (e.g. after saving a schedule). */
  initialTrialId?: string
  /** Which bottom-nav tab to open on (dashboard | trials | sites | notifs | me). */
  initialTab?: string
}

const mockData = {
  user: { name: "Rajesh Kumar", initials: "RK", role: "Sponsor Admin", designation: "Clinical Operations Lead", org: "PharmaCo Ltd", orgAddress: "4th Floor, Cyber Towers, HITEC City, Hyderabad 500081", email: "rajesh.kumar@pharmaco.com", phone: "+91 98765 43210" },
  trials: [
    { id: "Protocol-001", name: "Phase III, Randomized, Double-blinded, Parallel Group, Multi-centre, Study to Assess the Efficacy and Safety of ZD6474 (ZACTIMA™) in Combination with Pemetrexed (Alimta®) versus Pemetrexed alone in Patients with Locally Advanced or Metastatic (stage IIIB or IV) Non-Small Cell Lung Cancer (NSCLC) after Failure of 1st Line Anti-cancer Therapy. Acronym: ZEAL", phase: "Phase II", indication: "Type 2 Diabetes", drug: "Metformin XR", duration: "18 months", ctri: "CTRI/2024/001", totalVisits: 18, sponsor: "PharmaCo Ltd", status: "Active", sites: 3, screened: 48, enrolled: 45, target: 100, completed: 12, screenFail: 8, randomized: 40, withdrawn: 3, dropouts: 2, followUp: 23, scheduleVersion: "v3", lastModified: "12 May 2025", modifiedBy: "Dr. Sharma" },
    { id: "Protocol-002", name: "Phase III, Randomized, Double-blinded, Parallel Group, Multi-centre, Study to Assess the Efficacy and Safety of ZD6474 (ZACTIMA™) in Combination with Pemetrexed (Alimta®) versus Pemetrexed alone in Patients with Locally Advanced or Metastatic (stage IIIB or IV) Non-Small Cell Lung Cancer (NSCLC) after Failure of 1st Line Anti-cancer Therapy. Acronym: ZEAL", phase: "Phase III", indication: "Hypertension", drug: "Amlodipine", duration: "24 months", ctri: "CTRI/2024/002", totalVisits: 12, sponsor: "PharmaCo Ltd", status: "Active", sites: 2, screened: 32, enrolled: 28, target: 60, completed: 5, screenFail: 4, randomized: 28, withdrawn: 1, dropouts: 0, followUp: 22, scheduleVersion: "v1", lastModified: "8 May 2025", modifiedBy: "Dr. Rao" },
    { id: "Protocol-003", name: "Phase III, Randomized, Double-blinded, Parallel Group, Multi-centre, Study to Assess the Efficacy and Safety of ZD6474 (ZACTIMA™) in Combination with Pemetrexed (Alimta®) versus Pemetrexed alone in Patients with Locally Advanced or Metastatic (stage IIIB or IV) Non-Small Cell Lung Cancer (NSCLC) after Failure of 1st Line Anti-cancer Therapy. Acronym: ZEAL", phase: "Phase I", indication: "NSCLC", drug: "Osimertinib", duration: "12 months", ctri: "CTRI/2023/045", totalVisits: 8, sponsor: "PharmaCo Ltd", status: "Completed", sites: 1, screened: 20, enrolled: 18, target: 20, completed: 18, screenFail: 2, randomized: 18, withdrawn: 0, dropouts: 0, followUp: 0, scheduleVersion: "v2", lastModified: "1 May 2025", modifiedBy: "Admin" },
    { id: "Protocol-004", name: "Phase III, Randomized, Double-blinded, Parallel Group, Multi-centre, Study to Assess the Efficacy and Safety of ZD6474 (ZACTIMA™) in Combination with Pemetrexed (Alimta®) versus Pemetrexed alone in Patients with Locally Advanced or Metastatic (stage IIIB or IV) Non-Small Cell Lung Cancer (NSCLC) after Failure of 1st Line Anti-cancer Therapy. Acronym: ZEAL", phase: "Phase II", indication: "Heart Failure", drug: "Sacubitril/Valsartan", duration: "18 months", ctri: "CTRI/2024/078", totalVisits: 14, sponsor: "PharmaCo Ltd", status: "Terminated", sites: 2, screened: 15, enrolled: 12, target: 40, completed: 0, screenFail: 3, randomized: 10, withdrawn: 4, dropouts: 2, followUp: 4, scheduleVersion: "v1", lastModified: "10 Apr 2025", modifiedBy: "Admin" },
  ],
  sites: [
    { id: "SITE-001", name: "Apollo Mumbai", hospital: "Apollo Hospitals Mumbai", city: "Mumbai", state: "Maharashtra", status: "Active", pi: "Dr. Rajesh Sharma", piEmail: "r.sharma@apollo.com", piPhone: "+91 98100 12345", crc: "Ms. Priya Desai", enrolled: 72, target: 85, enrollmentPct: 85, trials: ["Protocol-001", "Protocol-002"], patients: 72, visitCompliance: 89, overdueVisits: 3, department: "Endocrinology", screened: 80, screenFail: 8, randomized: 70, withdrawn: 3, dropouts: 2, followUp: 55, completed: 12 },
    { id: "SITE-002", name: "Max Delhi", hospital: "Max Super Speciality Hospital", city: "New Delhi", state: "Delhi", status: "Active", pi: "Dr. Sunita Rao", piEmail: "s.rao@maxhealthcare.com", piPhone: "+91 98200 23456", crc: "Mr. Amit Singh", enrolled: 43, target: 60, enrollmentPct: 72, trials: ["Protocol-001"], patients: 43, visitCompliance: 94, overdueVisits: 1, department: "Cardiology", screened: 50, screenFail: 5, randomized: 42, withdrawn: 1, dropouts: 0, followUp: 37, completed: 5 },
    { id: "SITE-003", name: "Fortis Bangalore", hospital: "Fortis Hospital Bangalore", city: "Bengaluru", state: "Karnataka", status: "Completed", pi: "Dr. Anand Krishnan", piEmail: "a.krishnan@fortishealthcare.com", piPhone: "+91 98300 34567", crc: "Ms. Kavitha Nair", enrolled: 32, target: 50, enrollmentPct: 65, trials: ["Protocol-003"], patients: 32, visitCompliance: 87, overdueVisits: 0, department: "Oncology", screened: 36, screenFail: 4, randomized: 32, withdrawn: 0, dropouts: 0, followUp: 14, completed: 18 },
    { id: "SITE-004", name: "AIIMS Delhi", hospital: "All India Institute of Medical Sciences", city: "New Delhi", state: "Delhi", status: "Terminated", pi: "Dr. Meera Pillai", piEmail: "m.pillai@aiims.ac.in", piPhone: "+91 98400 45678", crc: "Dr. Rajan Verma", enrolled: 12, target: 40, enrollmentPct: 30, trials: ["Protocol-004"], patients: 12, visitCompliance: 60, overdueVisits: 0, department: "Cardiology", screened: 15, screenFail: 3, randomized: 10, withdrawn: 4, dropouts: 2, followUp: 4, completed: 0 },
  ],
  // De-identified subject roster — sponsors see aggregate / coded data only (no patient PII).
  patients: [
    { id: "SUBJ-001", trial: "Protocol-001", site: "Apollo Mumbai", status: "Active", enrolled: "12 Mar 2025", age: 54, sex: "F" },
    { id: "SUBJ-002", trial: "Protocol-001", site: "Apollo Mumbai", status: "Active", enrolled: "15 Mar 2025", age: 61, sex: "M" },
    { id: "SUBJ-003", trial: "Protocol-001", site: "Max Delhi", status: "Screening", enrolled: "2 Apr 2025", age: 47, sex: "F" },
    { id: "SUBJ-004", trial: "Protocol-001", site: "Max Delhi", status: "Withdrawn", enrolled: "18 Feb 2025", age: 58, sex: "M" },
    { id: "SUBJ-005", trial: "Protocol-002", site: "Apollo Mumbai", status: "Active", enrolled: "5 Apr 2025", age: 50, sex: "F" },
    { id: "SUBJ-006", trial: "Protocol-002", site: "Max Delhi", status: "Active", enrolled: "9 Apr 2025", age: 65, sex: "M" },
    { id: "SUBJ-007", trial: "Protocol-002", site: "Max Delhi", status: "Screening", enrolled: "20 Apr 2025", age: 43, sex: "F" },
    { id: "SUBJ-008", trial: "Protocol-003", site: "Fortis Bangalore", status: "Completed", enrolled: "10 Jan 2025", age: 60, sex: "M" },
    { id: "SUBJ-009", trial: "Protocol-003", site: "Fortis Bangalore", status: "Completed", enrolled: "14 Jan 2025", age: 57, sex: "F" },
    { id: "SUBJ-010", trial: "Protocol-003", site: "Fortis Bangalore", status: "Active", enrolled: "22 Jan 2025", age: 49, sex: "M" },
    { id: "SUBJ-011", trial: "Protocol-004", site: "AIIMS Delhi", status: "Withdrawn", enrolled: "8 Mar 2025", age: 62, sex: "F" },
    { id: "SUBJ-012", trial: "Protocol-004", site: "AIIMS Delhi", status: "Active", enrolled: "11 Mar 2025", age: 55, sex: "M" },
  ],
  notifications: [
    { id: 1, type: "trial", title: "Protocol-002 shared with Apollo Mumbai", message: "Hypertension Study has been assigned to the site. PI Dr. Sharma has been notified.", time: "2h ago", unread: true },
    { id: 2, type: "milestone", title: "Recruitment milestone reached", message: "Protocol-001: 50% enrollment target achieved. 45 of 100 patients enrolled.", time: "5h ago", unread: true },
    { id: 3, type: "overdue", title: "Site visit overdue — Apollo Mumbai", message: "3 visits are currently outside the scheduled visit window. Review required.", time: "1d ago", unread: false },
    { id: 4, type: "site", title: "Site activation confirmed", message: "Max Delhi site is now active for Protocol-001. Enrollment can begin.", time: "2d ago", unread: false },
    { id: 5, type: "system", title: "Schedule updated — Protocol-001", message: "Visit schedule v3 uploaded by Dr. Sharma. 18 visits confirmed.", time: "3d ago", unread: false },
  ],
}

function StatusBadge({ status }: { status: string }) {
  return <SharedStatusBadge status={status} dot />
}

function ProgressBar({ value, color = "bg-info" }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-[width] duration-500 ease-out", color)}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

// Composite site performance (core model from docs/SITE_SCORING.md, using available data):
// 35% enrollment achievement + 35% visit compliance + 30% protocol adherence (overdue-based).
function sitePerformance(s: { enrolled: number; target: number; visitCompliance: number; overdueVisits: number; patients: number }) {
  const enrollment = Math.min((s.enrolled / s.target) * 100, 100)
  const compliance = s.visitCompliance
  const adherence = s.patients > 0 ? Math.max(0, (1 - s.overdueVisits / s.patients) * 100) : 100
  return Math.round(0.35 * enrollment + 0.35 * compliance + 0.30 * adherence)
}

// Derive a recruitment status label from the trial's lifecycle status.
function recruitmentStatus(status: string) {
  return status === "Active" ? "Recruiting" : status === "Completed" ? "Closed" : "Terminated"
}

// Two-letter avatar initials, ignoring honorifics (Dr./Mr./Ms.).
function memberInitials(name: string): string {
  return name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, "").split(/\s+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase()
}

// Deterministic contact details for site CRCs (the mock site roster only carries
// the CRC's name), so the same CRC always shows the same email/phone.
function hashNum(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}
function crcEmail(name: string, siteName: string): string {
  const clean = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, "").trim()
  const parts = clean.split(/\s+/).filter(Boolean)
  const handle = parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0]
  const domain = siteName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12) || "site"
  return `${handle.toLowerCase()}@${domain}.org`
}
function crcPhone(seed: string): string {
  const n = hashNum(seed)
  return `+91 ${90000 + (n % 10000)} ${10000 + (Math.floor(n / 13) % 90000)}`
}

// ── Animated count-up numeral — eases 0 → value on mount ─────────────────────
function CountUp({ value, className, duration = 900 }: { value: number; className?: string; duration?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <span className={className}>{n}</span>
}

// ── Self-drawing progress ring (fraction 0..1) — the day's signature gauge ───
function ProgressRing({ value, size = 84, stroke = 7, children }: { value: number; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const [p, setP] = useState(0)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setP(value))
    return () => cancelAnimationFrame(raf)
  }, [value])
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-white/20" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
          className="text-white" strokeDasharray={c} strokeDashoffset={c * (1 - p)}
          style={{ transition: "stroke-dashoffset 1200ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

// ── Editorial section marker — gradient tick + small-caps label ──────────────
function SectionLabel({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="h-3.5 w-1 rounded-full dawn-gradient" />
        <p className="eyebrow text-muted-foreground">{label}</p>
      </div>
      {action}
    </div>
  )
}

export function SponsorDashboard({ onNavigate, initialTrialId, initialTab }: SponsorDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab ?? "dashboard")
  const [trials, setTrials] = useState(mockData.trials)
  const [trialFilter, setTrialFilter] = useState("All")
  const [phaseFilter, setPhaseFilter] = useState("All")
  const [showTrialFilters, setShowTrialFilters] = useState(false)
  const [siteFilter, setSiteFilter] = useState("All")
  const [notifFilter, setNotifFilter] = useState("All")
  const [selectedTrial, setSelectedTrial] = useState<typeof trials[0] | null>(null)
  const [selectedSite, setSelectedSite] = useState<typeof mockData.sites[0] | null>(null)
  const [editingTrial, setEditingTrial] = useState<typeof trials[0] | null>(null)
  const [editDraft, setEditDraft] = useState({ name: "", phase: "", indication: "", drug: "", duration: "", target: "", status: "Active" })
  const [trialSearch, setTrialSearch] = useState("")
  const [siteSearch, setSiteSearch] = useState("")
  const [notifications, setNotifications] = useState(mockData.notifications)
  const [meSection, setMeSection] = useState<string | null>(null)
  // Entity Change request (full-screen flow off the profile menu).
  const [entityChange, setEntityChange] = useState<{ field: string; newValue: string }>({ field: "Entity Type", newValue: "" })
  const [entitySubmitted, setEntitySubmitted] = useState(false)
  const [entityWarning, setEntityWarning] = useState(false)
  const [sites, setSites] = useState(mockData.sites)
  const [showAddSite, setShowAddSite] = useState(false)
  const [siteEntryMode, setSiteEntryMode] = useState<"single" | "upload">("single")
  const [newSite, setNewSite] = useState({
    protocolId: "", siteName: "", siteAddress: "", hospitalType: "Private", piName: "", department: "",
    piEmail: "", accessType: "Patient Management",
  })
  const [addSiteSuccess, setAddSiteSuccess] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
  const docInputRef = useRef<HTMLInputElement>(null)
  const [showShareTrial, setShowShareTrial] = useState(false)
  const [shareForm, setShareForm] = useState({ fullName: "", designation: "", email: "", phone: "", accessType: "View Access" })
  const [shareSuccess, setShareSuccess] = useState(false)
  // Account sub-screens (Edit Profile / Change Password / Notification Preferences)
  const [profileForm, setProfileForm] = useState({
    name: mockData.user.name,
    designation: mockData.user.designation,
    email: mockData.user.email,
    phone: mockData.user.phone,
    org: mockData.user.org,
    orgAddress: mockData.user.orgAddress,
  })
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" })
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false })
  const [notifPrefs, setNotifPrefs] = useState({
    visitReminders: true,
    enrolmentUpdates: true,
    protocolDeviations: true,
    weeklyDigest: false,
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
  })
  // Team members + invite
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "Dr. Rajesh Sharma", designation: "Principal Investigator", phone: "+91 98100 12345", email: "r.sharma@apollo.com", trials: ["Protocol-001", "Protocol-002"] },
    { id: "2", name: "Ms. Priya Desai", designation: "Clinical Research Coordinator", phone: "+91 98201 54321", email: "p.desai@apollo.com", trials: ["Protocol-001"] },
    { id: "3", name: "Dr. Sunita Rao", designation: "Principal Investigator", phone: "+91 98200 23456", email: "s.rao@maxhealthcare.com", trials: ["Protocol-001", "Protocol-003"] },
    { id: "4", name: "Mr. Amit Singh", designation: "Research Team", phone: "+91 99300 67890", email: "a.singh@maxhealthcare.com", trials: ["Protocol-002"] },
  ])
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({ category: "Login Issue", subject: "", description: "" })
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [lastTicketId, setLastTicketId] = useState("")
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: "#TKT-20260604-0031", subject: "Site not visible under my trial", category: "App Bug", status: "In Progress", date: "04 Jun 2026" },
    { id: "#TKT-20260528-0019", subject: "Unable to download enrolment report", category: "App Bug", status: "Resolved", date: "28 May 2026" },
  ])
  const handleSubmitTicket = () => {
    const newId = `#TKT-20260611-${String(43 + tickets.length).padStart(4, "0")}`
    setTickets(prev => [{ id: newId, subject: contactForm.subject.trim() || "Support request", category: contactForm.category, status: "Open", date: "11 Jun 2026" }, ...prev])
    setLastTicketId(newId)
    setTicketSubmitted(true)
    setContactForm({ category: "Login Issue", subject: "", description: "" })
  }
  const [inviteForm, setInviteForm] = useState({ name: "", designation: "", phone: "", email: "", trials: [] as string[] })

  // Mask the middle digits of a phone number: "+91 98100 12345" → "+91 •••••  12345".
  const maskPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length <= 4) return phone
    const last4 = digits.slice(-4)
    return `+91 ••••• ${last4}`
  }
  const trialName = (id: string) => trials.find(t => t.id === id)?.name ?? id
  const toggleInviteTrial = (id: string) =>
    setInviteForm(p => ({ ...p, trials: p.trials.includes(id) ? p.trials.filter(t => t !== id) : [...p.trials, id] }))
  const handleSendInvite = () => {
    if (!inviteForm.name || !inviteForm.email) return
    setTeamMembers(prev => [...prev, { id: Date.now().toString(), ...inviteForm }])
    toast.success(`Invite sent to ${inviteForm.name}`)
    setInviteForm({ name: "", designation: "", phone: "", email: "", trials: [] })
    setMeSection("team-members")
  }

  const handleShareTrial = () => {
    if (!shareForm.email) return
    setShareSuccess(true)
    setTimeout(() => {
      setShareSuccess(false)
      setShowShareTrial(false)
      setShareForm({ fullName: "", designation: "", email: "", phone: "", accessType: "View Access" })
    }, 1400)
  }

  // Auto-populate Panel 1 when a valid Protocol ID is entered.
  const addSiteTrial = trials.find(
    t => t.id.toLowerCase() === newSite.protocolId.trim().toLowerCase()
  )

  // Open straight to a trial's summary when requested (e.g. after a schedule is saved).
  useEffect(() => {
    if (initialTrialId) {
      const t = trials.find(tr => tr.id === initialTrialId)
      if (t) { setSelectedTrial(t); setActiveTab("dashboard") }
    }
  }, [initialTrialId])

  const openEditTrial = (t: typeof trials[0]) => {
    setEditDraft({ name: t.name, phase: t.phase, indication: t.indication, drug: t.drug, duration: t.duration, target: String(t.target), status: t.status })
    setEditingTrial(t)
  }

  const saveEditTrial = () => {
    if (!editingTrial) return
    const updated = {
      ...editingTrial,
      name: editDraft.name,
      phase: editDraft.phase,
      indication: editDraft.indication,
      drug: editDraft.drug,
      duration: editDraft.duration,
      target: parseInt(editDraft.target) || editingTrial.target,
      status: editDraft.status,
    }
    setTrials(prev => prev.map(x => x.id === updated.id ? updated : x))
    setSelectedTrial(updated)
    setEditingTrial(null)
  }

  const handleAddSite = () => {
    if (!newSite.siteName || !newSite.piName || !newSite.piEmail) return
    const id = `SITE-00${sites.length + 1}`
    setSites(prev => [...prev, {
      id,
      name: newSite.siteName,
      hospital: newSite.siteAddress,
      city: "",
      state: "",
      status: "Active",
      pi: newSite.piName,
      piEmail: newSite.piEmail,
      piPhone: "",
      crc: "",
      enrolled: 0,
      target: 0,
      enrollmentPct: 0,
      trials: addSiteTrial ? [addSiteTrial.id] : [],
      patients: 0,
      visitCompliance: 0,
      overdueVisits: 0,
      department: newSite.department,
      screened: 0,
      screenFail: 0,
      randomized: 0,
      withdrawn: 0,
      dropouts: 0,
      followUp: 0,
      completed: 0,
    }])
    setAddSiteSuccess(true)
    setTimeout(() => {
      setAddSiteSuccess(false)
      setShowAddSite(false)
      setNewSite({ protocolId: "", siteName: "", siteAddress: "", hospitalType: "Private", piName: "", department: "", piEmail: "", accessType: "Patient Management" })
    }, 1400)
  }

  const unreadCount = notifications.filter(n => n.unread).length

  const filteredTrials = trials.filter(t => {
    const matchesFilter = trialFilter === "All" || t.status === trialFilter
    const matchesPhase = phaseFilter === "All" || t.phase === phaseFilter
    const matchesSearch = t.name.toLowerCase().includes(trialSearch.toLowerCase()) || t.id.toLowerCase().includes(trialSearch.toLowerCase())
    return matchesFilter && matchesPhase && matchesSearch
  })

  const filteredSites = sites.filter(s => {
    const matchesFilter = siteFilter === "All" || s.status === siteFilter
    const matchesSearch = s.name.toLowerCase().includes(siteSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // ── Computed KPI totals (derived from data, not hardcoded) ──
  const totalTrials = trials.length
  const totalSites = sites.length
  const totalPatients = sites.reduce((sum, s) => sum + s.patients, 0)

  const notifIconMap: Record<string, { icon: typeof Bell; bg: string; color: string; border: string }> = {
    trial: { icon: FlaskConical, bg: "bg-info/10", color: "text-info", border: "border-blue-400" },
    milestone: { icon: TrendingUp, bg: "bg-success/15", color: "text-success", border: "border-green-400" },
    overdue: { icon: AlertTriangle, bg: "bg-destructive/10", color: "text-destructive", border: "border-red-400" },
    site: { icon: MapPin, bg: "bg-accent/10", color: "text-accent", border: "border-teal-400" },
    system: { icon: Info, bg: "bg-muted", color: "text-muted-foreground", border: "border-border" },
  }

  // ── Portfolio figures for the hero ──
  const firstName = mockData.user.name.split(/\s+/)[0]
  const activeTrials = trials.filter(t => t.status === "Active").length
  const totalEnrolled = trials.reduce((n, t) => n + t.enrolled, 0)
  const totalTarget = trials.reduce((n, t) => n + t.target, 0)
  const enrolPct = totalTarget ? Math.round((totalEnrolled / totalTarget) * 100) : 0
  // Portfolio health = average composite site performance (enrolment + compliance + adherence).
  const avgHealth = sites.length ? Math.round(sites.reduce((n, s) => n + sitePerformance(s), 0) / sites.length) : 0
  const healthLabel = avgHealth >= 80 ? "On track" : avgHealth >= 60 ? "Steady" : "Needs attention"

  // ── Immersive dashboard header — fused app bar + portfolio deck ──
  const immersiveHeader = (
    <header className="relative overflow-hidden text-primary-foreground">
      <div className="absolute inset-0 dawn-gradient" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-deep via-primary-deep/55 to-transparent" />
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 paper-grain" />
      <svg viewBox="0 0 200 200" className="pointer-events-none absolute -right-12 -top-12 h-60 w-60 text-white/25" fill="none">
        <path d="M30 110 a70 70 0 0 1 140 0" stroke="currentColor" strokeWidth="1.5" pathLength={100} className="animate-arc" />
        <path d="M52 110 a48 48 0 0 1 96 0" stroke="currentColor" strokeWidth="1" pathLength={100} className="animate-arc" style={{ animationDelay: "220ms" }} />
        <circle cx="100" cy="110" r="22" stroke="currentColor" strokeWidth="1" className="text-white/15" />
      </svg>
      <span className="pointer-events-none absolute right-10 top-24 h-2 w-2 rounded-full bg-white/40 animate-drift" />
      <span className="pointer-events-none absolute right-28 top-36 h-1.5 w-1.5 rounded-full bg-white/30 animate-drift-slow" />
      <span className="pointer-events-none absolute left-10 top-44 h-1 w-1 rounded-full bg-white/30 animate-drift" />

      <div className="relative px-4 pt-3.5 pb-16">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-white/65">Sponsor · {mockData.user.org}</p>
            <h1 className="display-serif text-2xl leading-tight inline-flex items-center gap-2">
              Hi, {firstName} <Sun className="h-5 w-5 text-white/80 animate-pulse-soft" />
            </h1>
          </div>
          <button onClick={() => setActiveTab("notifs")} aria-label="Notifications" className="springy relative grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur-sm active:scale-95 hover:bg-white/25 ring-1 ring-white/20">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-primary-deep">{unreadCount}</span>}
          </button>
          <button onClick={() => setActiveTab("me")} aria-label="Account" className="springy grid h-11 w-11 place-items-center rounded-full bg-white/20 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-sm active:scale-95">
            {mockData.user.initials}
          </button>
        </div>

        {/* Portfolio deck */}
        <div className="relative mt-5 flex items-center gap-4 animate-rise" style={{ animationDelay: "60ms" }}>
          <ProgressRing value={avgHealth / 100}>
            <div>
              <p className="font-heading text-xl leading-none tabular-nums">{avgHealth}%</p>
              <p className="eyebrow text-[8px] text-white/70 mt-0.5">health</p>
            </div>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-white/70">Portfolio health</p>
            <h2 className="display-serif text-xl leading-tight">{healthLabel}</h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
                <FlaskConical className="h-3.5 w-3.5" /> {activeTrials} active
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
                <Users className="h-3.5 w-3.5" /> {totalEnrolled}/{totalTarget} enrolled
              </span>
              <button onClick={() => setActiveTab("notifs")} className={cn("springy inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 active:scale-95", unreadCount ? "bg-destructive/30 ring-white/20" : "bg-white/15 ring-white/15")}>
                <Bell className="h-3.5 w-3.5" /> {unreadCount} alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )

  // ── Compact dawn app bar for non-dashboard tabs ──
  const compactBar = (title: string) => (
    <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
      <div className="relative flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="eyebrow text-primary-foreground/55">Sponsor · {mockData.user.org}</p>
          <h1 className="display-serif text-lg leading-tight">{title}</h1>
        </div>
        <button onClick={() => setActiveTab("notifs")} aria-label="Notifications" className="springy relative grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-sm active:scale-95 hover:bg-white/25">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-primary-deep">{unreadCount}</span>}
        </button>
        <button onClick={() => setActiveTab("me")} aria-label="Account" className="springy grid h-10 w-10 place-items-center rounded-full bg-white/20 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-sm active:scale-95">
          {mockData.user.initials}
        </button>
      </div>
    </div>
  )

  // ── Edit Trial ──────────────────────────────────────────
  if (editingTrial) {
    const setField = (k: keyof typeof editDraft, v: string) => setEditDraft(p => ({ ...p, [k]: v }))
    const inputCls = "w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary bg-card"
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setEditingTrial(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">Edit Trial</span>
        </div>
        <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
          {/* Protocol ID — read-only */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Protocol ID</label>
            <div className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-muted-foreground">{editingTrial.id}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Study Title</label>
            <input value={editDraft.name} onChange={e => setField("name", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Phase</label>
            <select value={editDraft.phase} onChange={e => setField("phase", e.target.value)} className={inputCls}>
              <option>Phase I</option><option>Phase II</option><option>Phase III</option><option>Phase IV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Disease</label>
            <input value={editDraft.indication} onChange={e => setField("indication", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Drug</label>
            <input value={editDraft.drug} onChange={e => setField("drug", e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Duration</label>
              <input value={editDraft.duration} onChange={e => setField("duration", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Sample Size</label>
              <input type="number" value={editDraft.target} onChange={e => setField("target", e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Status of Trial</label>
            <select value={editDraft.status} onChange={e => setField("status", e.target.value)} className={inputCls}>
              <option>Active</option><option>Completed</option><option>Terminated</option>
            </select>
          </div>
        </div>
        <div className="px-4 py-4 bg-card border-t border-border flex gap-3">
          <button onClick={() => setEditingTrial(null)} className="flex-1 border border-border text-foreground/80 rounded-xl py-3 text-sm font-semibold">Cancel</button>
          <button onClick={saveEditTrial} className="flex-1 bg-primary-deep text-white rounded-xl py-3 text-sm font-semibold">Save Changes</button>
        </div>
      </div>
    )
  }

  // Shared bottom navigation — kept consistent across every sponsor screen.
  const renderBottomNav = () => (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center">
      {[
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "trials", icon: FlaskConical, label: "Trials" },
        { id: "chat", icon: MessageCircle, label: "Messages" },
        { id: "notifs", icon: Bell, label: "Notifs", badge: unreadCount },
        { id: "me", icon: User, label: "Me" },
      ].map(tab => {
        const Icon = tab.icon
        const active = activeTab === tab.id && !selectedTrial
        return (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedTrial(null)
              if (tab.id === "chat") { onNavigate("chat"); return }
              setActiveTab(tab.id)
            }}
            className="flex-1 flex flex-col items-center gap-0.5 relative"
          >
            {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-info rounded-full" />}
            <div className="relative">
              <Icon className={cn("w-5 h-5", active ? "text-info" : "text-muted-foreground/70")} />
              {tab.badge && tab.badge > 0 && <span className="absolute -top-1.5 -right-1.5 bg-destructive text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{tab.badge}</span>}
            </div>
            <span className={cn("text-[10px] font-medium", active ? "text-info" : "text-muted-foreground/70")}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )

  // ── Trial Detail ────────────────────────────────────────
  if (selectedTrial) {
    const t = selectedTrial
    const enrolled = t.enrolled; const target = t.target
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedTrial(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1">{t.id}</span>
          <TrialActionsMenu
            triggerClassName="text-white"
            onEdit={() => openEditTrial(t)}
            onDownload={() => toast.success(`${t.id} protocol downloaded`)}
            onShare={() => setShowShareTrial(true)}
          />
        </div>
        <div className="flex-1 overflow-auto pb-24 px-4 py-4 space-y-4">

          {/* PANEL 1 — Trial Details */}
          <div className="bg-primary-deep rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-0.5 bg-info/30 text-primary-foreground/75 text-xs rounded-full font-medium">{t.id}</span>
              <StatusBadge status={t.status} />
            </div>
            <h2 className="text-lg font-bold mb-3">{t.name}</h2>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
              {[
                { label: "CTRI Number", val: t.ctri },
                { label: "Phase", val: t.phase },
                { label: "Disease", val: t.indication },
                { label: "Drug", val: t.drug },
                { label: "Duration", val: t.duration },
                { label: "Total Visits", val: t.totalVisits },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[10px] text-primary-foreground/75/80 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm font-medium">{f.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL 2 — Recruitment Details Across All Sites */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="font-semibold text-sm text-foreground mb-3">Recruitment · Across All Sites</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-surface rounded-lg p-2.5 text-center"><p className="text-lg font-bold text-primary-deep">{t.sites}</p><p className="text-[10px] text-muted-foreground">Total Sites</p></div>
              <div className="bg-surface rounded-lg p-2.5 text-center"><p className="text-lg font-bold text-primary-deep">{t.target}</p><p className="text-[10px] text-muted-foreground">Sample Size</p></div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {[
                { label: "Screened", val: t.screened, color: "text-foreground" },
                { label: "Screen Fail", val: t.screenFail, color: "text-destructive" },
                { label: "Randomized", val: t.randomized, color: "text-foreground" },
                { label: "Withdrawn", val: t.withdrawn, color: "text-warning" },
                { label: "Dropout", val: t.dropouts, color: "text-warning" },
                { label: "Follow-up", val: t.followUp, color: "text-accent" },
                { label: "Completed", val: t.completed, color: "text-accent" },
              ].map(m => (
                <div key={m.label} className="bg-surface rounded-lg p-1.5 text-center border border-border">
                  <p className={cn("text-sm font-bold leading-none", m.color)}>{m.val}</p>
                  <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">Enrolment</p>
            <ProgressBar value={Math.round((enrolled / target) * 100)} />
            <p className="text-xs text-muted-foreground mt-1">{enrolled} / {target} enrolled ({Math.round((enrolled / target) * 100)}%)</p>
          </div>

          {/* PANEL 3 — Sites (per-site recruitment status) */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-foreground">Sites · Recruitment Status</p>
              <button
                onClick={() => { setNewSite(p => ({ ...p, protocolId: t.id })); setSelectedTrial(null); setActiveTab("sites"); setShowAddSite(true) }}
                className="text-info text-xs font-semibold">Add Site</button>
            </div>
            <div className="space-y-3">
              {sites.filter(s => s.trials.includes(t.id)).map(site => (
                <div key={site.id} className="bg-surface rounded-xl border border-border p-3">
                  <p className="font-semibold text-sm text-foreground">{site.name}</p>
                  <p className="text-xs text-muted-foreground flex items-start gap-1"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />{site.hospital}, {site.city}, {site.state}</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-2 mb-2">
                    <p className="text-xs text-muted-foreground">PI: <span className="text-foreground">{site.pi}</span></p>
                    <p className="text-xs text-muted-foreground">Dept: <span className="text-foreground">{site.department}</span></p>
                    <p className="text-xs text-muted-foreground col-span-2 truncate">{site.piEmail}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: "Screened", val: site.screened, color: "text-foreground" },
                      { label: "Screen Fail", val: site.screenFail, color: "text-destructive" },
                      { label: "Randomized", val: site.randomized, color: "text-foreground" },
                      { label: "Withdrawn", val: site.withdrawn, color: "text-warning" },
                      { label: "Dropout", val: site.dropouts, color: "text-warning" },
                      { label: "Follow-up", val: site.followUp, color: "text-accent" },
                      { label: "Completed", val: site.completed, color: "text-accent" },
                    ].map(m => (
                      <div key={m.label} className="bg-card rounded-lg p-1.5 text-center border border-border">
                        <p className={cn("text-sm font-bold leading-none", m.color)}>{m.val}</p>
                        <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {sites.filter(s => s.trials.includes(t.id)).length === 0 && (
                <p className="text-xs text-muted-foreground/70 italic">No sites added to this trial yet.</p>
              )}
            </div>
          </div>

          {/* PANEL — Trial Team (everyone related to this trial) */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-muted-foreground/70" />
              <p className="font-semibold text-sm text-foreground">Trial Team</p>
            </div>
            <div className="space-y-2.5">
              {/* Sponsor-side contact (the logged-in organization) */}
              <div className="rounded-xl border border-border bg-surface p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary-deep text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">{mockData.user.initials}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{mockData.user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{mockData.user.designation} · {mockData.user.org}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 bg-info/10 text-info">Sponsor</span>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-border space-y-1.5">
                  <a href={`mailto:${mockData.user.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-info"><Mail className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{mockData.user.email}</span></a>
                  <a href={`tel:${mockData.user.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-info"><Phone className="w-3.5 h-3.5 flex-shrink-0" /><span>{mockData.user.phone}</span></a>
                </div>
              </div>

              {/* PI + CRC for each site running this trial */}
              {sites.filter(s => s.trials.includes(t.id)).flatMap(site => [
                { key: `${site.id}-pi`, name: site.pi, roleLabel: "PI", roleCls: "bg-accent/10 text-accent", org: `${site.name} · ${site.department}`, email: site.piEmail, phone: site.piPhone },
                { key: `${site.id}-crc`, name: site.crc, roleLabel: "CRC", roleCls: "bg-success/15 text-success", org: site.name, email: crcEmail(site.crc, site.name), phone: crcPhone(site.crc + site.id) },
              ]).map(m => (
                <div key={m.key} className="rounded-xl border border-border bg-surface p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">{memberInitials(m.name)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{m.org}</p>
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0", m.roleCls)}>{m.roleLabel}</span>
                  </div>
                  <div className="mt-2.5 pt-2.5 border-t border-border space-y-1.5">
                    <a href={`mailto:${m.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-info"><Mail className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{m.email}</span></a>
                    <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-info"><Phone className="w-3.5 h-3.5 flex-shrink-0" /><span>{m.phone}</span></a>
                  </div>
                </div>
              ))}
              {sites.filter(s => s.trials.includes(t.id)).length === 0 && (
                <p className="text-xs text-muted-foreground/70 italic">No sites assigned yet — team will appear once sites are added.</p>
              )}
            </div>
          </div>

          {/* PANEL 4 — Documents */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="font-semibold text-sm text-foreground mb-3">Documents</p>
            <div className="flex items-start gap-3 py-2 border-b border-border">
              <FileText className="w-4 h-4 text-muted-foreground/70 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">Uploaded Protocol</p>
                <p className="text-[11px] text-muted-foreground/70">Uploaded by {t.modifiedBy} · {t.lastModified}, 10:32 AM</p>
              </div>
              <Download className="w-4 h-4 text-info flex-shrink-0" />
            </div>
            <div className="flex items-start gap-3 py-2 border-b border-border">
              <FileText className="w-4 h-4 text-muted-foreground/70 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">Schedule Template</p>
                <p className="text-[11px] text-muted-foreground/70">{t.scheduleVersion} · updated {t.lastModified} by {t.modifiedBy}</p>
              </div>
              <Download className="w-4 h-4 text-info flex-shrink-0" />
            </div>
            <div className="py-2">
              <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1.5">Version History</p>
              <div className="space-y-1">
                {[
                  { v: t.scheduleVersion, note: `Current · ${t.lastModified} · ${t.modifiedBy}` },
                  { v: "v2", note: "1 May 2025 · Admin" },
                  { v: "v1", note: "10 Apr 2025 · Admin" },
                ].map(h => (
                  <div key={h.v} className="flex items-center gap-2 text-xs">
                    <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded font-medium">{h.v}</span>
                    <span className="text-muted-foreground">{h.note}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Newly uploaded documents */}
            {uploadedDocs.map((name, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-t border-border">
                <FileText className="w-4 h-4 text-muted-foreground/70 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{name}</p>
                  <p className="text-[11px] text-success">Uploaded by {mockData.user.name} · just now</p>
                </div>
                <Download className="w-4 h-4 text-info flex-shrink-0" />
              </div>
            ))}
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setUploadedDocs(prev => [...prev, file.name])
                e.target.value = ""
              }}
            />
            <button onClick={() => docInputRef.current?.click()} className="w-full mt-2 border border-info text-info rounded-xl py-2 text-sm font-semibold">+ Upload Document</button>
          </div>
        </div>

        {/* Consistent bottom navigation */}
        {renderBottomNav()}

        {/* Share Trial overlay */}
        {showShareTrial && (
          <div className="absolute inset-0 z-50 bg-surface flex flex-col">
            <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
              <button onClick={() => setShowShareTrial(false)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
              <span className="font-semibold flex-1">Share Trial</span>
            </div>
            {shareSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center"><Check className="w-8 h-8 text-success" /></div>
                <p className="font-bold text-foreground text-lg">Trial Shared!</p>
                <p className="text-sm text-muted-foreground">{t.id} shared with {shareForm.email} ({shareForm.accessType}).</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
                  <p className="text-xs text-muted-foreground">Share this trial with members of your organization.</p>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1.5">Full Name</label>
                    <input value={shareForm.fullName} onChange={e => setShareForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Full name" className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1.5">Designation</label>
                    <input value={shareForm.designation} onChange={e => setShareForm(p => ({ ...p, designation: e.target.value }))} placeholder="e.g. Clinical Project Manager" className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1.5">Email ID <span className="text-destructive">*</span></label>
                    <input type="email" value={shareForm.email} onChange={e => setShareForm(p => ({ ...p, email: e.target.value }))} placeholder="name@pharmaco.com" className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1.5">Phone Number</label>
                    <input type="tel" value={shareForm.phone} onChange={e => setShareForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98XXXXXXXX" className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1.5">Organization Name</label>
                    <div className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-muted-foreground">{mockData.user.org}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1.5">Access Type</label>
                    <div className="flex rounded-xl border border-border overflow-hidden">
                      {(["View Access", "Edit Access"] as const).map(a => (
                        <button key={a} onClick={() => setShareForm(p => ({ ...p, accessType: a }))}
                          className={cn("flex-1 py-2.5 text-sm font-medium", shareForm.accessType === a ? "bg-primary text-white" : "bg-card text-muted-foreground")}>{a}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4 border-t border-border">
                  <button onClick={handleShareTrial} disabled={!shareForm.email}
                    className={cn("w-full py-3.5 rounded-xl font-semibold text-sm transition-all", shareForm.email ? "bg-primary-deep text-white" : "bg-border text-muted-foreground/70 cursor-not-allowed")}>
                    Share Trial
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  // ── Site Detail ─────────────────────────────────────────
  if (selectedSite) {
    const s = selectedSite
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedSite(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
          <span className="font-semibold flex-1 truncate">{s.name}</span>
        </div>
        <div className="flex-1 overflow-auto pb-4 px-4 py-4 space-y-4">
          {/* Header */}
          <div className="bg-accent rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-lg font-bold">{s.name}</h2>
              <StatusBadge status={s.status} />
            </div>
            <p className="text-teal-100 text-xs">📍 {s.city}, {s.state}</p>
            <p className="text-teal-100 text-xs">{s.hospital}</p>
          </div>
          {/* Contacts */}
          <div className="grid grid-cols-2 gap-3">
            {[{ title: "Principal Investigator", name: s.pi, email: s.piEmail, phone: s.piPhone },
              { title: "Coordinator", name: s.crc, email: "", phone: "" }].map(c => (
              <div key={c.title} className="bg-card rounded-xl p-3 border border-border">
                <p className="text-xs text-muted-foreground/70 mb-1">{c.title}</p>
                <p className="font-semibold text-sm text-foreground leading-tight">{c.name}</p>
                <div className="flex gap-2 mt-2">
                  <button className="p-1.5 bg-accent/5 rounded-lg"><Phone className="w-3.5 h-3.5 text-accent" /></button>
                  <button className="p-1.5 bg-info/5 rounded-lg"><Mail className="w-3.5 h-3.5 text-info" /></button>
                </div>
              </div>
            ))}
          </div>
          {/* Enrollment */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm">Patient Enrollment</p>
              <span className="text-xs font-bold text-primary-deep">{s.enrolled}/{s.target}</span>
            </div>
            <ProgressBar value={s.enrollmentPct} color="bg-accent" />
            <div className="mt-3 p-3 bg-surface rounded-xl flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground/70 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">Patient-level data is managed by the site investigator</p>
            </div>
          </div>
          {/* Performance */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="font-semibold text-sm mb-3">Performance Metrics</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[{ label: "Enrollment Rate", val: `${s.enrollmentPct}%` },
                { label: "Visit Compliance", val: `${s.visitCompliance}%` },
                { label: "Screen Fail", val: "8%" }].map(m => (
                <div key={m.label} className="bg-surface rounded-xl p-2">
                  <p className="text-lg font-bold text-primary-deep">{m.val}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{m.label}</p>
                </div>
              ))}
            </div>
            {s.overdueVisits > 0 && (
              <div className="mt-3 flex items-center gap-2 text-destructive text-xs">
                <AlertTriangle className="w-4 h-4" /><span>Overdue: {s.overdueVisits} visits</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN TABS ───────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-background">
      {activeTab !== "dashboard" && compactBar(
        activeTab === "trials" ? "Trials"
          : activeTab === "sites" ? "Sites"
          : activeTab === "patients" ? "Patient Stats"
          : activeTab === "notifs" ? "Notifications"
          : activeTab === "me" ? "Profile"
          : "Dashboard"
      )}

      <div className="flex-1 overflow-auto pb-20 scrollbar-hide">

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <>
            {immersiveHeader}
            <div className="relative -mt-10 px-4 pb-6 space-y-6">
              {/* Portfolio bento — floating stat tiles */}
              <div className="grid grid-cols-3 gap-3 animate-rise" style={{ animationDelay: "120ms" }}>
                {[
                  { onClick: () => setActiveTab("trials"), icon: FlaskConical, ic: "text-info", bg: "bg-info/12", glow: "bg-info/20", value: totalTrials, label: "Total Trials" },
                  { onClick: () => setActiveTab("sites"), icon: MapPin, ic: "text-accent", bg: "bg-accent/15", glow: "bg-accent/20", value: totalSites, label: "Total Sites" },
                  { onClick: () => setActiveTab("patients"), icon: Users, ic: "text-violet", bg: "bg-violet/12", glow: "bg-violet/20", value: totalPatients, label: "Patients" },
                ].map((s, i) => (
                  <button key={i} onClick={s.onClick} className="springy group relative overflow-hidden bg-card rounded-3xl border border-border p-3.5 text-left shadow-md active:scale-[0.96]">
                    <span className={cn("absolute -top-6 -right-6 h-16 w-16 rounded-full blur-xl", s.glow)} />
                    <div className="relative flex items-center justify-between mb-2">
                      <span className={cn("grid h-9 w-9 place-items-center rounded-2xl", s.bg)}>
                        <s.icon className={cn("w-5 h-5", s.ic)} />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                    </div>
                    <p className="relative font-heading text-3xl tabular-nums text-foreground leading-none"><CountUp value={s.value} /></p>
                    <p className="relative text-[11px] text-muted-foreground mt-1">{s.label}</p>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <section className="animate-rise" style={{ animationDelay: "190ms" }}>
                <SectionLabel label="Quick actions" />
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { onClick: () => onNavigate("add-trial"), icon: FlaskConical, orb: "bg-info text-info-foreground", label: "Add Trial" },
                    { onClick: () => setShowAddSite(true), icon: MapPin, orb: "dawn-gradient text-primary-foreground", label: "Add Site" },
                    { onClick: () => onNavigate("share-schedule"), icon: FileText, orb: "bg-accent text-accent-foreground", label: "Share Schedule" },
                  ].map((a, i) => (
                    <button key={i} onClick={a.onClick} className="springy bg-card rounded-3xl border border-border p-3 shadow-xs flex flex-col items-center gap-2 active:scale-[0.96] hover:shadow-sm">
                      <div className={cn("grid h-12 w-12 place-items-center rounded-2xl shadow-sm", a.orb)}>
                        <a.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-foreground text-center leading-tight">{a.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* My Trials */}
              <section className="animate-rise" style={{ animationDelay: "260ms" }}>
                <SectionLabel
                  label="My trials"
                  action={<button onClick={() => setActiveTab("trials")} className="springy text-info text-sm font-semibold inline-flex items-center gap-0.5 active:scale-95">See all <ChevronRight className="w-4 h-4" /></button>}
                />
                <div className="space-y-3">
                  {trials.filter(t => t.status === "Active").map(t => {
                    const pct = Math.round((t.randomized / t.target) * 100)
                    return (
                      <button key={t.id} onClick={() => setSelectedTrial(t)} className="springy group relative w-full overflow-hidden text-left bg-card rounded-3xl border border-border p-4 pl-5 shadow-sm active:scale-[0.99] hover:shadow-md">
                        <span className="absolute left-0 top-0 bottom-0 w-1.5 dawn-gradient" />
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="font-mono text-xs font-semibold text-primary bg-secondary/50 px-2.5 py-1 rounded-full">{t.id}</span>
                          <div className="flex items-center gap-1.5">
                            <StatusBadge status={t.status} />
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground/70 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                              <ArrowUpRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                        <h4 className="font-heading text-foreground text-base leading-snug mb-2.5 line-clamp-2">{t.name}</h4>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {[
                            { val: t.phase, cls: "bg-info/10 text-info" },
                            { val: t.indication, cls: "bg-accent/12 text-accent" },
                            { val: t.drug, cls: "bg-violet/10 text-violet" },
                            { val: `${t.sites} sites`, cls: "bg-muted text-muted-foreground" },
                          ].map(c => <span key={c.val} className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", c.cls)}>{c.val}</span>)}
                        </div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-muted-foreground">Randomized</span>
                          <span className="font-mono font-semibold text-foreground">{t.randomized}/{t.target} · {pct}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full dawn-gradient animate-fill-bar" style={{ width: `${pct}%` }} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Site Performance */}
              <section className="animate-rise" style={{ animationDelay: "330ms" }}>
                <SectionLabel
                  label="Site performance"
                  action={<button onClick={() => setActiveTab("sites")} className="springy text-info text-sm font-semibold inline-flex items-center gap-0.5 active:scale-95">View all <ChevronRight className="w-4 h-4" /></button>}
                />
                <div className="bg-card rounded-3xl border border-border p-4 shadow-sm space-y-3.5">
                  {sites.map((s, i) => (
                    <button key={s.id} onClick={() => setSelectedSite(s)} className="springy block w-full text-left active:scale-[0.99]">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground truncate">{s.name}</span>
                        <span className="font-mono text-xs font-semibold text-foreground tabular-nums shrink-0">{s.enrollmentPct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full dawn-gradient animate-fill-bar" style={{ width: `${s.enrollmentPct}%`, animationDelay: `${i * 80}ms` }} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Notifications */}
              <section className="animate-rise" style={{ animationDelay: "400ms" }}>
                <SectionLabel
                  label="Notifications"
                  action={<button onClick={() => setActiveTab("notifs")} className="springy text-info text-sm font-semibold inline-flex items-center gap-0.5 active:scale-95">See all <ChevronRight className="w-4 h-4" /></button>}
                />
                <div className="space-y-2">
                  {notifications.slice(0, 2).map(n => {
                    const iconInfo = notifIconMap[n.type] || notifIconMap.system
                    const Icon = iconInfo.icon
                    return (
                      <button key={n.id} onClick={() => setActiveTab("notifs")} className="springy w-full text-left bg-card rounded-2xl border border-border p-3 shadow-xs flex items-start gap-3 active:scale-[0.99]">
                        <div className={cn("grid h-9 w-9 place-items-center rounded-xl shrink-0", iconInfo.bg)}>
                          <Icon className={cn("w-4 h-4", iconInfo.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-tight">{n.title}</p>
                          <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">{n.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground/70 shrink-0">{n.time}</span>
                        {n.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-destructive" />}
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>
          </>
        )}

        {/* ── TRIALS TAB ── */}
        {activeTab === "trials" && (
          <div className="px-4 pt-4">
            {/* Search + phase toggle + add */}
            <div className="flex items-center gap-2 mb-3 animate-rise" style={{ animationDelay: "20ms" }}>
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input value={trialSearch} onChange={e => setTrialSearch(e.target.value)} placeholder="Search trials…" className="w-full rounded-2xl border border-border bg-card pl-10 pr-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30" />
              </div>
              <button
                onClick={() => setShowTrialFilters(v => !v)}
                className={cn("springy grid h-10 w-10 shrink-0 place-items-center rounded-2xl border active:scale-95", showTrialFilters || phaseFilter !== "All" ? "dawn-gradient border-transparent text-primary-foreground shadow-sm" : "bg-card border-border text-muted-foreground")}>
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button onClick={() => onNavigate("add-trial")} className="springy shrink-0 inline-flex items-center gap-1 rounded-2xl dawn-gradient text-primary-foreground px-3.5 py-2.5 text-xs font-semibold active:scale-95 shadow-sm">
                <FlaskConical className="w-4 h-4" /> Add
              </button>
            </div>
            {/* Phase filter panel (toggled by the sliders button) */}
            {showTrialFilters && (
              <div className="bg-card border border-border rounded-2xl p-3 mb-3 shadow-xs animate-rise">
                <div className="flex items-center justify-between mb-2">
                  <p className="eyebrow text-muted-foreground/70">Filter by Phase</p>
                  {phaseFilter !== "All" && (
                    <button onClick={() => setPhaseFilter("All")} className="text-[11px] text-info font-semibold">Clear</button>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["All", "Phase I", "Phase II", "Phase III", "Phase IV"].map(p => (
                    <button key={p} onClick={() => setPhaseFilter(p)} className={cn("springy px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95", phaseFilter === p ? "dawn-gradient text-primary-foreground shadow-sm" : "bg-surface text-muted-foreground border border-border")}>{p}</button>
                  ))}
                </div>
              </div>
            )}
            {/* Status filter chips */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 mb-4 animate-rise" style={{ animationDelay: "70ms" }}>
              {[
                { label: "All", val: "All", count: trials.length },
                { label: "Active", val: "Active", count: trials.filter(t => t.status === "Active").length },
                { label: "Completed", val: "Completed", count: trials.filter(t => t.status === "Completed").length },
                { label: "Terminated", val: "Terminated", count: trials.filter(t => t.status === "Terminated").length },
              ].map(f => {
                const active = trialFilter === f.val
                return (
                  <button key={f.val} onClick={() => setTrialFilter(f.val)} className={cn("springy shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95", active ? "dawn-gradient text-primary-foreground shadow-sm" : "bg-card border border-border text-muted-foreground")}>
                    {f.label} <span className={cn("tabular-nums", active ? "text-primary-foreground/80" : "text-muted-foreground/60")}>{f.count}</span>
                  </button>
                )
              })}
            </div>
            {/* Trial list */}
            <div key={`${trialFilter}-${phaseFilter}-${trialSearch}`} className="space-y-3">
              {filteredTrials.length === 0 ? (
                <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-xs animate-rise">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground/50">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <p className="font-heading text-foreground text-base mt-3">No trials found</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Try a different search or filter.</p>
                </div>
              ) : filteredTrials.map((t, i) => {
                const pct = Math.round((t.enrolled / t.target) * 100)
                return (
                  <button key={t.id} onClick={() => setSelectedTrial(t)} className="springy group relative w-full overflow-hidden text-left bg-card rounded-3xl border border-border p-4 pl-5 shadow-sm active:scale-[0.99] hover:shadow-md animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
                    <span className="absolute left-0 top-0 bottom-0 w-1.5 dawn-gradient" />
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-mono text-xs font-semibold text-primary bg-secondary/50 px-2.5 py-1 rounded-full">{t.id}</span>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={t.status} />
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground/70 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                    <h4 className="font-heading text-foreground text-base leading-snug mb-2.5 line-clamp-2">{t.name}</h4>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {[
                        { val: t.phase, cls: "bg-info/10 text-info" },
                        { val: t.indication, cls: "bg-accent/12 text-accent" },
                        { val: t.drug, cls: "bg-violet/10 text-violet" },
                        { val: `${t.sites} sites`, cls: "bg-muted text-muted-foreground" },
                      ].map(c => <span key={c.val} className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", c.cls)}>{c.val}</span>)}
                    </div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">Enrolled</span>
                      <span className="font-mono font-semibold text-foreground">{t.enrolled}/{t.target} · {pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full dawn-gradient animate-fill-bar" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── SITES TAB ── */}
        {activeTab === "sites" && (
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 min-w-0 flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                <input value={siteSearch} onChange={e => setSiteSearch(e.target.value)} placeholder="Search sites..." className="flex-1 min-w-0 text-sm outline-none" />
              </div>
              <button onClick={() => setShowAddSite(true)} className="flex-shrink-0 px-3 py-2 bg-info rounded-xl text-white text-xs font-semibold whitespace-nowrap">Add Site</button>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
              {[
                { label: `All (${sites.length})`, val: "All" },
                { label: `Active (${sites.filter(s => s.status === "Active").length})`, val: "Active" },
                { label: `Completed (${sites.filter(s => s.status === "Completed").length})`, val: "Completed" },
                { label: `Terminated (${sites.filter(s => s.status === "Terminated").length})`, val: "Terminated" },
              ].map(f => (
                <button key={f.val} onClick={() => setSiteFilter(f.val)} className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border", siteFilter === f.val ? "bg-info text-white border-info" : "bg-card text-muted-foreground border-border")}>{f.label}</button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredSites.map(s => (
                <div key={s.id} className="bg-card rounded-2xl border border-border p-4 shadow-xs">
                  {/* Site name + status */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <StatusBadge status={s.status} />
                  </div>
                  {/* Site address */}
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 mt-0.5 flex-shrink-0" />
                    <span>{s.hospital}, {s.city}, {s.state}</span>
                  </div>

                  {/* Trial details — one sub-panel per assigned trial */}
                  <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Trial Details</p>
                  {s.trials.length === 0 ? (
                    <p className="text-xs text-muted-foreground/70 italic">No trials assigned yet</p>
                  ) : (
                    <div className="space-y-2.5">
                      {s.trials.map(trialId => {
                        const t = trials.find(tr => tr.id === trialId)
                        if (!t) return null
                        return (
                          <button key={trialId} onClick={() => setSelectedTrial(t)} className="w-full text-left rounded-xl border border-border bg-surface p-3">
                            {/* Protocol ID + status */}
                            <div className="flex items-center justify-between gap-2 mb-2.5">
                              <span className="text-xs font-bold text-info">{t.id}</span>
                              <div className="flex items-center gap-1.5">
                                <StatusBadge status={t.status} />
                                <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
                              </div>
                            </div>
                            {/* Trial meta */}
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                              {[
                                { label: "Phase", val: t.phase },
                                { label: "Disease", val: t.indication },
                                { label: "Drug", val: t.drug },
                                { label: "PI Name", val: s.pi },
                                { label: "Recruitment Status", val: recruitmentStatus(t.status) },
                              ].map(f => (
                                <div key={f.label}>
                                  <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">{f.label}</p>
                                  <p className="text-xs font-medium text-foreground">{f.val}</p>
                                </div>
                              ))}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PATIENTS TAB · Patient Recruitment Status ── */}
        {activeTab === "patients" && (
          <div className="px-4 pt-4">
            <h2 className="font-bold text-lg text-foreground mb-1">Patient Recruitment Status</h2>
            <p className="text-xs text-muted-foreground mb-4">{totalPatients} patients enrolled across {trials.length} trials</p>

            {/* All trials with recruitment funnel — each opens the Trial Summary */}
            <div className="space-y-3">
              {trials.map(t => (
                <button key={t.id} onClick={() => setSelectedTrial(t)} className="w-full text-left bg-card rounded-2xl border border-border p-4 shadow-xs">
                  {/* Protocol ID + Status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-info/10 text-info text-xs rounded-full font-medium">{t.id}</span>
                    <div className="flex items-center gap-1.5"><StatusBadge status={t.status} /><ChevronRight className="w-4 h-4 text-muted-foreground/70" /></div>
                  </div>
                  {/* Phase · Disease · Drug */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Phase</p><p className="text-xs font-medium text-foreground">{t.phase}</p></div>
                    <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Disease</p><p className="text-xs font-medium text-foreground">{t.indication}</p></div>
                    <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Drug</p><p className="text-xs font-medium text-foreground">{t.drug}</p></div>
                  </div>
                  {/* Recruitment Status funnel */}
                  <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1.5">Recruitment Status</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: "Screened", val: t.screened, color: "text-foreground" },
                      { label: "Screen Fail", val: t.screenFail, color: "text-destructive" },
                      { label: "Randomized", val: t.randomized, color: "text-foreground" },
                      { label: "Withdrawn", val: t.withdrawn, color: "text-warning" },
                      { label: "Dropout", val: t.dropouts, color: "text-warning" },
                      { label: "Follow-up", val: t.followUp, color: "text-accent" },
                      { label: "Completed", val: t.completed, color: "text-accent" },
                    ].map(m => (
                      <div key={m.label} className="bg-surface rounded-lg p-1.5 text-center border border-border">
                        <p className={cn("text-sm font-bold leading-none", m.color)}>{m.val}</p>
                        <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── NOTIFS TAB ── */}
        {activeTab === "notifs" && (() => {
          const typeFor: Record<string, string[]> = {
            Trials: ["trial"], Sites: ["site"], Recruitment: ["milestone", "overdue"], System: ["system"],
          }
          const filteredNotifs = notifFilter === "All" ? notifications : notifications.filter(n => (typeFor[notifFilter] ?? []).includes(n.type))
          return (
            <div className="px-4 pt-4">
              {/* Header — unread count + mark all */}
              <div className="flex items-center justify-between mb-3 animate-rise" style={{ animationDelay: "20ms" }}>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full dawn-gradient" />
                  <p className="eyebrow text-muted-foreground">{unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}</p>
                </div>
                {unreadCount > 0 && (
                  <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))} className="springy text-info text-sm font-semibold active:scale-95">Mark all read</button>
                )}
              </div>
              {/* Filter chips (now functional) */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 mb-4 animate-rise" style={{ animationDelay: "70ms" }}>
                {["All", "Trials", "Sites", "Recruitment", "System"].map(f => {
                  const active = notifFilter === f
                  return (
                    <button key={f} onClick={() => setNotifFilter(f)} className={cn("springy shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95", active ? "dawn-gradient text-primary-foreground shadow-sm" : "bg-card border border-border text-muted-foreground")}>{f}</button>
                  )
                })}
              </div>
              {/* List — re-animates on filter change */}
              <div key={notifFilter} className="space-y-2.5">
                {filteredNotifs.length === 0 && (
                  <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-xs animate-rise">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground/50">
                      <Bell className="h-6 w-6" />
                    </div>
                    <p className="font-heading text-foreground text-base mt-3">Nothing here</p>
                    <p className="text-xs text-muted-foreground mt-0.5">No notifications in this category.</p>
                  </div>
                )}
                {filteredNotifs.map((n, i) => {
                  const iconInfo = notifIconMap[n.type] || notifIconMap.system
                  const Icon = iconInfo.icon
                  return (
                    <button
                      key={n.id}
                      onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                      className={cn("springy relative w-full overflow-hidden text-left rounded-2xl border bg-card p-3 pl-4 shadow-xs flex gap-3 active:scale-[0.99] animate-rise", n.unread ? "border-border" : "border-border opacity-70")}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {n.unread && <span className="absolute left-0 top-0 bottom-0 w-1.5 dawn-gradient" />}
                      <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", iconInfo.bg)}>
                        <Icon className={cn("w-4 h-4", iconInfo.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm text-foreground leading-tight">{n.title}</p>
                          <span className="flex items-center gap-1.5 shrink-0">
                            {n.unread && <span className="h-2 w-2 rounded-full bg-destructive" />}
                            <span className="text-[11px] text-muted-foreground/70">{n.time}</span>
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* ── ME TAB ── */}
        {activeTab === "me" && (
          <div className="px-4 pt-4">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-primary-deep flex items-center justify-center text-white text-xl font-bold mb-3">{mockData.user.initials}</div>
                <div className="absolute bottom-3 right-0 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center"><Camera className="w-3 h-3 text-muted-foreground" /></div>
              </div>
              <p className="font-bold text-lg text-foreground">{mockData.user.name}</p>
              <span className="px-3 py-1 bg-info/10 text-info text-xs rounded-full font-semibold mt-1">{mockData.user.designation}</span>
            </div>
            {/* Info card — fields in required order */}
            <div className="bg-card rounded-2xl border border-border p-4 mb-2">
              {[
                { label: "Phone Number", val: mockData.user.phone, verify: true },
                { label: "Email ID", val: mockData.user.email, verify: true },
                { label: "Entity Type", val: "Sponsor" },
                { label: "Org. Name", val: mockData.user.org },
                { label: "Org. Address", val: mockData.user.orgAddress },
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
            {/* OTP / notification note for sensitive fields */}
            <div className="flex items-start gap-2 bg-warning/10 border border-warning/20 rounded-xl p-3 mb-4">
              <ShieldCheck className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              <p className="text-xs text-warning leading-relaxed">
                Changing your <span className="font-medium">Phone Number</span> or <span className="font-medium">Email ID</span> requires OTP verification. All active trials will be notified of the change.
              </p>
            </div>
            {/* Menu */}
            {[
              { section: "ACCOUNT", items: [{ icon: UserPen, label: "Edit Profile", onClick: () => setMeSection("edit-profile") }, { icon: Building2, label: "Entity Change", onClick: () => setMeSection("entity-change") }, { icon: Lock, label: "Change Password", onClick: () => setMeSection("change-password") }, { icon: Bell, label: "Notification Preferences", onClick: () => setMeSection("notifications") }] },
              { section: "TRIAL MANAGEMENT", items: [{ icon: FlaskConical, label: "My Trials", onClick: () => setActiveTab("trials") }, { icon: MapPin, label: "My Sites", onClick: () => setActiveTab("sites") }, { icon: Users, label: "Team Members", onClick: () => setMeSection("team-members") }] },
              { section: "REPORTS", items: [{ icon: BarChart2, label: "Reports", onClick: () => setMeSection("reports") }, { icon: FileText, label: "T&C", onClick: () => setMeSection("tnc") }, { icon: HelpCircle, label: "Help & Support", onClick: () => setMeSection("help") }] },
            ].map(group => (
              <div key={group.section} className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">{group.section}</p>
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  {group.items.map((item, i) => {
                    const Icon = item.icon
                    return (
                      <button key={item.label} onClick={(item as any).onClick} className="w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-surface">
                        <Icon className="w-4 h-4 text-muted-foreground/70" />
                        <span className="flex-1 text-sm text-foreground text-left">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
              <button onClick={() => onNavigate("welcome")} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/5">
                <LogOut className="w-4 h-4 text-destructive" />
                <span className="flex-1 text-sm text-destructive text-left font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      {renderBottomNav()}

      {/* ── Add Site Screen (full-screen) ── */}
      {showAddSite && (
        <div className="absolute inset-0 z-50 bg-surface">
          <div className="h-full w-full flex flex-col">
            {/* App bar */}
            <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
              <button onClick={() => setShowAddSite(false)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
              <span className="font-semibold flex-1">Add New Site</span>
            </div>

            {addSiteSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <p className="font-bold text-foreground text-lg">Site Added & Shared!</p>
                <p className="text-sm text-muted-foreground">
                  {newSite.siteName} added{addSiteTrial ? ` · ${addSiteTrial.id} shared with ${newSite.piName || "the PI"}` : ""}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto px-5 py-4 space-y-4">

                  {/* Entry mode: single vs bulk upload */}
                  <div className="flex rounded-xl border border-border overflow-hidden">
                    {(["single", "upload"] as const).map(m => (
                      <button key={m} onClick={() => setSiteEntryMode(m)}
                        className={cn("flex-1 py-2.5 text-sm font-medium", siteEntryMode === m ? "bg-primary text-white" : "bg-card text-muted-foreground")}>
                        {m === "single" ? "Single Entry" : "Upload File"}
                      </button>
                    ))}
                  </div>

                  {siteEntryMode === "upload" ? (
                    <>
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 bg-surface text-center">
                        <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Upload multiple sites at once</p>
                        <button className="px-4 py-2 border-2 border-primary text-primary rounded-lg font-medium text-sm">Browse Files</button>
                        <p className="text-xs text-muted-foreground/70 mt-2">PDF, Word, Excel, CSV</p>
                      </div>
                      <p className="text-xs text-muted-foreground/70">Each row should include Protocol ID, Site Name, Address, PI Name, PI Email and Department.</p>
                    </>
                  ) : (
                    <>
                      {/* PANEL 1 — Trial Details (auto-populated from Protocol ID) */}
                      <div className="bg-surface rounded-xl border border-border p-3 space-y-3">
                        <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">Trial Details</p>
                        <div>
                          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Protocol ID <span className="text-destructive">*</span></label>
                          <input value={newSite.protocolId} onChange={e => setNewSite(p => ({ ...p, protocolId: e.target.value }))}
                            placeholder="e.g. Protocol-001" list="add-site-protocols"
                            className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm bg-card focus:border-primary" />
                          <datalist id="add-site-protocols">
                            {trials.map(t => <option key={t.id} value={t.id} />)}
                          </datalist>
                          {newSite.protocolId.trim() && !addSiteTrial && (
                            <p className="text-xs text-warning mt-1">No trial found for this Protocol ID.</p>
                          )}
                        </div>
                        {addSiteTrial ? (
                          <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
                            <div className="col-span-2"><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Study Title</p><p className="text-sm font-medium text-foreground">{addSiteTrial.name}</p></div>
                            <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Phase</p><p className="text-sm font-medium text-foreground">{addSiteTrial.phase}</p></div>
                            <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Disease</p><p className="text-sm font-medium text-foreground">{addSiteTrial.indication}</p></div>
                            <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Drug</p><p className="text-sm font-medium text-foreground">{addSiteTrial.drug}</p></div>
                            <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Duration</p><p className="text-sm font-medium text-foreground">{addSiteTrial.duration}</p></div>
                            <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Sample Size</p><p className="text-sm font-medium text-foreground">{addSiteTrial.target}</p></div>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground/70">Enter a Protocol ID to auto-populate trial details.</p>
                        )}
                      </div>

                      {/* PANEL 2 — Site Details */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">Site Details</p>
                        <div>
                          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Site Name <span className="text-destructive">*</span></label>
                          <input value={newSite.siteName} onChange={e => setNewSite(p => ({ ...p, siteName: e.target.value }))}
                            placeholder="e.g. Apollo Mumbai"
                            className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Site Address</label>
                          <input value={newSite.siteAddress} onChange={e => setNewSite(p => ({ ...p, siteAddress: e.target.value }))}
                            placeholder="Building, Street, City, State"
                            className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Hospital Type</label>
                          <div className="flex rounded-xl border border-border overflow-hidden">
                            {(["Private", "Government"] as const).map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setNewSite(p => ({ ...p, hospitalType: t }))}
                                className={cn("flex-1 py-2.5 text-sm font-medium", newSite.hospitalType === t ? "bg-primary text-white" : "bg-card text-muted-foreground")}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground/80 mb-1.5">PI Name</label>
                          <input value={newSite.piName} onChange={e => setNewSite(p => ({ ...p, piName: e.target.value }))}
                            placeholder="Dr. First Last"
                            className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Department</label>
                          <input value={newSite.department} onChange={e => setNewSite(p => ({ ...p, department: e.target.value }))}
                            placeholder="e.g. Endocrinology"
                            className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground/80 mb-1.5">PI Email ID <span className="text-destructive">*</span></label>
                          <input type="email" value={newSite.piEmail} onChange={e => setNewSite(p => ({ ...p, piEmail: e.target.value }))}
                            placeholder="pi@hospital.com"
                            className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Access Type</label>
                          <div className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm flex items-center justify-between">
                            <span className="font-medium text-foreground">{newSite.accessType}</span>
                            <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/70"><Lock className="w-3 h-3" /> Default</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Submit */}
                {siteEntryMode === "single" && (
                  <div className="px-5 py-4 border-t border-border">
                    <button
                      onClick={handleAddSite}
                      disabled={!newSite.siteName || !newSite.piName || !newSite.piEmail}
                      className={cn(
                        "w-full py-3.5 rounded-xl font-semibold text-sm transition-all",
                        newSite.siteName && newSite.piName && newSite.piEmail
                          ? "bg-primary-deep text-white"
                          : "bg-border text-muted-foreground/70 cursor-not-allowed"
                      )}
                    >
                      Save & Share with PI
                    </button>
                  </div>
                )}
                {siteEntryMode === "upload" && (
                  <div className="px-5 py-4 border-t border-border">
                    <button className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-white">
                      Upload & Share with PIs
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Edit Profile (full-screen) ── */}
      {meSection === "edit-profile" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => setMeSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
            <span className="font-semibold flex-1">Edit Profile</span>
          </div>
          <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
            {[
              { key: "name", label: "Full Name" },
              { key: "designation", label: "Designation" },
              { key: "org", label: "Organization Name" },
              { key: "orgAddress", label: "Organization Address" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">{f.label}</label>
                <input
                  value={profileForm[f.key as keyof typeof profileForm]}
                  onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
                />
              </div>
            ))}
            {/* Sensitive fields — require OTP */}
            {[
              { key: "phone", label: "Phone Number" },
              { key: "email", label: "Email ID" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">{f.label}</label>
                <input
                  value={profileForm[f.key as keyof typeof profileForm]}
                  onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
                />
              </div>
            ))}
            <div className="flex items-start gap-2 bg-warning/10 border border-warning/20 rounded-xl p-3">
              <ShieldCheck className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              <p className="text-xs text-warning leading-relaxed">Changing your phone or email requires OTP verification.</p>
            </div>
          </div>
          <div className="px-5 py-4 border-t border-border bg-card">
            <button
              onClick={() => { toast.success("Profile updated"); setMeSection(null) }}
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ── Entity Change (full-screen) ── */}
      {meSection === "entity-change" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => { setMeSection(null); setEntityChange({ field: "Entity Type", newValue: "" }); setEntityWarning(false) }} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
            <span className="font-semibold flex-1">Entity Change</span>
          </div>
          <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
            <p className="text-sm text-muted-foreground">Request a change to your registered entity details. Changes to entity type can affect your current data and access type.</p>

            {/* What are you changing */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">What are you changing?</label>
              <select
                value={entityChange.field}
                onChange={e => setEntityChange(c => ({ ...c, field: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
              >
                {["Entity Type", "Organization Name"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Current value (read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Current Value</label>
              <div className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-muted-foreground">
                {entityChange.field === "Entity Type" ? "Sponsor" : mockData.user.org}
              </div>
            </div>

            {/* New value */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Change To</label>
              {entityChange.field === "Entity Type" ? (
                <select
                  value={entityChange.newValue}
                  onChange={e => setEntityChange(c => ({ ...c, newValue: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
                >
                  <option value="">Select entity type</option>
                  {ENTITY_TYPES.filter(o => o !== "Sponsor").map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  value={entityChange.newValue}
                  onChange={e => setEntityChange(c => ({ ...c, newValue: e.target.value }))}
                  placeholder={`Enter new ${entityChange.field.toLowerCase()}`}
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
                />
              )}
            </div>

          </div>

          <div className="px-5 py-4 border-t border-border bg-card">
            <button
              disabled={!entityChange.newValue.trim()}
              onClick={() => entityChange.field === "Entity Type" ? setEntityWarning(true) : setEntitySubmitted(true)}
              className={cn("w-full py-3.5 rounded-xl font-semibold text-sm", entityChange.newValue.trim() ? "bg-primary-deep text-white" : "bg-border text-muted-foreground/70")}
            >
              Submit Request
            </button>
          </div>

          {/* Warning popup - shown on entity type submit before the request is sent */}
          {entityWarning && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 px-8">
              <div className="bg-card rounded-2xl p-6 w-full max-w-xs shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
                <p className="font-semibold text-foreground text-center mb-1">Change entity type?</p>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Changing your entity type to {entityChange.newValue || "the selected type"} will permanently erase all data linked to your current originator, and your access type will be changed accordingly. This cannot be undone.
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
                  onClick={() => { setEntitySubmitted(false); setEntityChange({ field: "Entity Type", newValue: "" }); setMeSection(null) }}
                  className="w-full py-3 rounded-xl bg-primary-deep text-white text-sm font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Change Password (full-screen) ── */}
      {meSection === "change-password" && (() => {
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
        const canSave = current.length > 0 && allRulesMet && passwordsMatch
        const fields = [
          { key: "current", label: "Current Password" },
          { key: "next", label: "New Password" },
          { key: "confirm", label: "Confirm New Password" },
        ] as const
        return (
          <div className="absolute inset-0 z-50 bg-surface flex flex-col">
            <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
              <button onClick={() => setMeSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
              <span className="font-semibold flex-1">Change Password</span>
            </div>
            <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
              {fields.map(f => (
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
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => ({ ...s, [f.key]: !s[f.key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-muted-foreground"
                    >
                      {showPwd[f.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}

              {/* Match indicator */}
              {passwordsMatch && (
                <p className="text-accent text-sm flex items-center gap-1">
                  <Check className="w-4 h-4" /> Passwords match
                </p>
              )}
              {mismatch && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <X className="w-4 h-4" /> Passwords do not match
                </p>
              )}

              {/* Strength bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-info to-accent transition-all"
                    style={{ width: `${strengthPercentage}%` }}
                  />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  strengthPercentage >= 80 ? "text-accent" : strengthPercentage >= 60 ? "text-warning" : "text-destructive"
                )}>
                  {strengthPercentage >= 80 ? "Strong" : strengthPercentage >= 60 ? "Medium" : "Weak"}
                </span>
              </div>

              {/* Rules checklist */}
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
                onClick={() => { toast.success("Password changed"); setPasswordForm({ current: "", next: "", confirm: "" }); setMeSection(null) }}
                disabled={!canSave}
                className={cn("w-full py-3.5 rounded-xl font-semibold text-sm transition-all", canSave ? "bg-primary-deep text-white" : "bg-border text-muted-foreground/70 cursor-not-allowed")}
              >
                Update Password
              </button>
            </div>
          </div>
        )
      })()}

      {/* ── Notification Preferences (full-screen) ── */}
      {meSection === "notifications" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => setMeSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
            <span className="font-semibold flex-1">Notification Preferences</span>
          </div>
          <div className="flex-1 overflow-auto px-5 py-5 space-y-5">
            {[
              {
                title: "Activity", items: [
                  { key: "visitReminders", label: "Visit reminders", desc: "Upcoming and overdue patient visits" },
                  { key: "enrolmentUpdates", label: "Enrolment updates", desc: "New screenings and randomizations" },
                  { key: "protocolDeviations", label: "Protocol deviations", desc: "Alerts when a deviation is logged" },
                  { key: "weeklyDigest", label: "Weekly digest", desc: "A summary email every Monday" },
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
                      <button
                        key={item.key}
                        onClick={() => setNotifPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof notifPrefs] }))}
                        className="w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 text-left"
                      >
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
            <button
              onClick={() => { toast.success("Preferences saved"); setMeSection(null) }}
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-white"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* ── Team Members (full-screen) ── */}
      {meSection === "team-members" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => setMeSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
            <span className="font-semibold flex-1">Team Members</span>
            <span className="text-xs text-primary-foreground/75">{teamMembers.length} total</span>
          </div>
          <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
            {teamMembers.map(m => {
              const expanded = expandedMemberId === m.id
              return (
                <div key={m.id} className="bg-card rounded-2xl border border-border shadow-xs p-4">
                  {/* Name + designation */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                      {m.name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.designation}</p>
                    </div>
                  </div>
                  {/* Contact */}
                  <div className="space-y-1.5 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" />
                      <span className="font-mono">{maskPhone(m.phone)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" />
                      <span className="truncate">{m.email}</span>
                    </div>
                  </div>
                  {/* Trials involved — clickable total */}
                  <button
                    onClick={() => setExpandedMemberId(expanded ? null : m.id)}
                    className="mt-3 w-full flex items-center justify-between bg-info/5 rounded-xl px-3 py-2 text-left"
                  >
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
            <button
              onClick={() => setMeSection("invite-member")}
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-white flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" /> Invite Members
            </button>
          </div>
        </div>
      )}

      {/* ── Invite Members (full-screen) ── */}
      {meSection === "invite-member" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => setMeSection("team-members")} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
            <span className="font-semibold flex-1">Invite Member</span>
          </div>
          <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Full Name *</label>
              <input value={inviteForm.name} onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Enter member's name"
                className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Designation</label>
              <input value={inviteForm.designation} onChange={e => setInviteForm(p => ({ ...p, designation: e.target.value }))}
                placeholder="e.g. Principal Investigator"
                className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Phone Number</label>
              <div className="flex gap-2">
                <div className="px-4 py-3 rounded-xl border border-border bg-surface text-muted-foreground text-sm">+91</div>
                <input value={inviteForm.phone} onChange={e => setInviteForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="Enter phone number" type="tel"
                  className="flex-1 px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Email ID *</label>
              <input value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
                placeholder="member@example.com" type="email"
                className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card" />
            </div>
            {/* Trials to involve */}
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
            <button
              onClick={handleSendInvite}
              disabled={!inviteForm.name || !inviteForm.email}
              className={cn("w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
                inviteForm.name && inviteForm.email ? "bg-primary-deep text-white" : "bg-border text-muted-foreground/70 cursor-not-allowed")}
            >
              <Mail className="w-4 h-4" /> Send Invite
            </button>
          </div>
        </div>
      )}

      {/* ── Reports (full-screen) ── */}
      {meSection === "reports" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => setMeSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
            <span className="font-semibold flex-1">Reports</span>
          </div>
          <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
            {[
              { label: "Recruitment Report", desc: "Screened, randomized & withdrawn across trials" },
              { label: "Enrolment Summary", desc: "Enrolment vs target by site" },
              { label: "Visit Compliance", desc: "On-time vs overdue visits" },
              { label: "Protocol Deviations", desc: "Logged deviations by trial" },
              { label: "Export Data", desc: "Download data as CSV / Excel" },
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
      )}

      {/* ── Terms & Conditions (full-screen) ── */}
      {meSection === "tnc" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => setMeSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
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
      )}

      {/* ── Help & Support (full-screen) ── */}
      {meSection === "help" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => setMeSection(null)} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
            <span className="font-semibold flex-1">Help &amp; Support</span>
          </div>
          <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
            {[
              { icon: HelpCircle,    bg: "bg-info/10",    ic: "text-info",     label: "Frequently Asked Questions", sub: "Browse common questions",   action: () => setMeSection("help-faq") },
              { icon: MessageCircle, bg: "bg-success/15", ic: "text-success",  label: "Contact Support",            sub: "Get help from our team",    action: () => { setTicketSubmitted(false); setMeSection("help-contact") } },
              { icon: Ticket,        bg: "bg-violet/10",  ic: "text-violet",   label: "My Tickets",                 sub: "Track your raised tickets", action: () => setMeSection("help-tickets") },
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
      )}

      {/* ── Help → FAQ (full-screen) ── */}
      {meSection === "help-faq" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => setMeSection("help")} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
            <span className="font-semibold flex-1">FAQ</span>
          </div>
          <div className="flex-1 overflow-auto px-4 py-4 space-y-2">
            {[
              { q: "How do I reset my password?", a: "Go to Account → Change Password, enter your current password, then set a new one that meets all the strength requirements. If you're locked out, use 'Forgot Password' on the sign-in screen and verify via OTP." },
              { q: "How do I invite a team member?", a: "Open Trial Management → Team Members → Invite Members. Fill in the name, email, role and the trials they should be involved in, then tap Send Invite." },
              { q: "How do I add a new site?", a: "Go to the Sites tab and tap Add Site. Enter the site and PI details, then share access with the PI to onboard them." },
              { q: "How are visit schedules created?", a: "Upload the protocol and the AI extracts the visit template. You can review, edit, and save it, after which patient visits are auto-calculated from each baseline date." },
            ].map(item => {
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
      )}

      {/* ── Help → Contact Support (full-screen) ── */}
      {meSection === "help-contact" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => { setMeSection("help"); setTicketSubmitted(false) }} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
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
              <button onClick={() => setMeSection("help-tickets")} className="text-sm text-info font-medium">View my tickets</button>
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
      )}

      {/* ── Help → My Tickets (full-screen) ── */}
      {meSection === "help-tickets" && (
        <div className="absolute inset-0 z-50 bg-surface flex flex-col">
          <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
            <button onClick={() => setMeSection("help")} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
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
            <button onClick={() => { setTicketSubmitted(false); setMeSection("help-contact") }}
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-white flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" /> Raise New Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
