"use client"

import { useState, useEffect, useRef } from "react"
import {
  LayoutDashboard, FlaskConical, MapPin, Bell, User, MessageCircle,
  ChevronRight, ChevronDown, Search, TrendingUp,
  BarChart2, ShieldCheck, Users, Download, Phone, Mail,
  X, Check, AlertTriangle, Info, SlidersHorizontal,
  FileText, UserPen, Lock, LogOut, Camera,
  UserCheck, Eye, EyeOff, HelpCircle, Building2, Upload
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { StatusBadge as SharedStatusBadge } from "@/components/clinical/status-badge"

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
    { id: "Protocol-001", name: "Diabetes Phase II", phase: "Phase II", indication: "Type 2 Diabetes", drug: "Metformin XR", duration: "18 months", ctri: "CTRI/2024/001", totalVisits: 18, sponsor: "PharmaCo Ltd", status: "Active", sites: 3, screened: 48, enrolled: 45, target: 100, completed: 12, screenFail: 8, randomized: 40, withdrawn: 3, dropouts: 2, followUp: 23, scheduleVersion: "v3", lastModified: "12 May 2025", modifiedBy: "Dr. Sharma" },
    { id: "Protocol-002", name: "Hypertension Study", phase: "Phase III", indication: "Hypertension", drug: "Amlodipine", duration: "24 months", ctri: "CTRI/2024/002", totalVisits: 12, sponsor: "PharmaCo Ltd", status: "Active", sites: 2, screened: 32, enrolled: 28, target: 60, completed: 5, screenFail: 4, randomized: 28, withdrawn: 1, dropouts: 0, followUp: 22, scheduleVersion: "v1", lastModified: "8 May 2025", modifiedBy: "Dr. Rao" },
    { id: "Protocol-003", name: "Oncology Phase I", phase: "Phase I", indication: "NSCLC", drug: "Osimertinib", duration: "12 months", ctri: "CTRI/2023/045", totalVisits: 8, sponsor: "PharmaCo Ltd", status: "Completed", sites: 1, screened: 20, enrolled: 18, target: 20, completed: 18, screenFail: 2, randomized: 18, withdrawn: 0, dropouts: 0, followUp: 0, scheduleVersion: "v2", lastModified: "1 May 2025", modifiedBy: "Admin" },
    { id: "Protocol-004", name: "Cardiology Trial", phase: "Phase II", indication: "Heart Failure", drug: "Sacubitril/Valsartan", duration: "18 months", ctri: "CTRI/2024/078", totalVisits: 14, sponsor: "PharmaCo Ltd", status: "Terminated", sites: 2, screened: 15, enrolled: 12, target: 40, completed: 0, screenFail: 3, randomized: 10, withdrawn: 4, dropouts: 2, followUp: 4, scheduleVersion: "v1", lastModified: "10 Apr 2025", modifiedBy: "Admin" },
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
  const [entityDoc, setEntityDoc] = useState<string | null>(null)
  const [entitySubmitted, setEntitySubmitted] = useState(false)
  const [sites, setSites] = useState(mockData.sites)
  const [showAddSite, setShowAddSite] = useState(false)
  const [siteEntryMode, setSiteEntryMode] = useState<"single" | "upload">("single")
  const [newSite, setNewSite] = useState({
    protocolId: "", siteName: "", siteAddress: "", piName: "", department: "",
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
      setNewSite({ protocolId: "", siteName: "", siteAddress: "", piName: "", department: "", piEmail: "", accessType: "Patient Management" })
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
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1 overflow-auto pb-40 px-4 py-4 space-y-4">

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

        {/* Action bar — Edit + Share Trial (sits just above the consistent bottom nav) */}
        <div className="absolute bottom-16 left-0 right-0 px-4 pb-3 pt-3 bg-card border-t border-border flex gap-3">
          <button onClick={() => openEditTrial(t)} className="flex-1 border border-border text-foreground/80 rounded-xl py-3 text-sm font-semibold">Edit</button>
          <button onClick={() => setShowShareTrial(true)} className="flex-1 bg-info text-white rounded-xl py-3 text-sm font-semibold">Share Trial ›</button>
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
    <div className="h-full flex flex-col bg-surface">
      {/* App Bar */}
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-bold text-base">Good morning, Rajesh ☀️</p>
          <p className="text-primary-foreground/75 text-xs">{mockData.user.org}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative" onClick={() => setActiveTab("notifs")}>
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-destructive text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}
          </button>
          <button onClick={() => setActiveTab("me")} className="w-8 h-8 rounded-full bg-info flex items-center justify-center text-xs font-bold">{mockData.user.initials}</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-20">

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <div>
            {/* KPI Strip — counts computed from data, each tile opens its list */}
            <div className="px-4 pt-4 pb-2">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: FlaskConical, val: totalTrials, label: "Total Trials", iconColor: "text-info", bg: "bg-info/5", tab: "trials" },
                  { icon: MapPin, val: totalSites, label: "Total Sites", iconColor: "text-accent", bg: "bg-accent/5", tab: "sites" },
                  { icon: Users, val: totalPatients, label: "Total Patients", iconColor: "text-violet", bg: "bg-violet/5", tab: "patients" },
                ].map(c => {
                  const Icon = c.icon
                  return (
                    <button key={c.label} onClick={() => setActiveTab(c.tab)} className={cn("rounded-2xl border border-border p-4 text-left shadow-sm", c.bg)}>
                      <Icon className={cn("w-5 h-5 mb-2", c.iconColor)} />
                      <p className="text-2xl font-bold text-foreground">{c.val}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{c.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* My Trials */}
            <div className="px-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">My Trials</h3>
                <button onClick={() => setActiveTab("trials")} className="text-info text-sm font-medium flex items-center gap-1">See All <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {trials.filter(t => t.status === "Active").map(t => (
                  <button key={t.id} onClick={() => setSelectedTrial(t)} className="w-full text-left bg-card rounded-2xl border border-border p-4 shadow-xs">
                    {/* Protocol ID + Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-info/10 text-info text-xs rounded-full font-medium">{t.id}</span>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={t.status} />
                        <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
                      </div>
                    </div>
                    {/* Study Title */}
                    <h4 className="font-semibold text-foreground text-sm mb-2">{t.name}</h4>
                    {/* Phase · Disease · Drug · Sites */}
                    <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 mb-3">
                      <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Phase</p><p className="text-xs font-medium text-foreground">{t.phase}</p></div>
                      <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Disease</p><p className="text-xs font-medium text-foreground">{t.indication}</p></div>
                      <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Drug</p><p className="text-xs font-medium text-foreground">{t.drug}</p></div>
                      <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Sites</p><p className="text-xs font-medium text-foreground">{t.sites}</p></div>
                    </div>
                    {/* Enrollment Bar */}
                    <ProgressBar value={Math.round((t.enrolled / t.target) * 100)} />
                    <p className="text-xs text-muted-foreground mt-1">{t.enrolled}/{t.target} enrolled</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications — latest */}
            <div className="px-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <button onClick={() => setActiveTab("notifs")} className="text-info text-sm font-medium flex items-center gap-1">See All <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {notifications.slice(0, 2).map(n => {
                  const iconInfo = notifIconMap[n.type] || notifIconMap.system
                  const Icon = iconInfo.icon
                  return (
                    <button key={n.id} onClick={() => setActiveTab("notifs")} className={cn("w-full text-left bg-card rounded-2xl p-3 shadow-sm border-l-4 flex items-start gap-3", iconInfo.border)}>
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", iconInfo.bg)}>
                        <Icon className={cn("w-4 h-4", iconInfo.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">{n.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground/70 shrink-0">{n.time}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Share Schedule — prominent action card */}
            <div className="px-4 mb-3">
              <button
                onClick={() => onNavigate("share-schedule")}
                className="w-full bg-violet/5 border border-purple-200 rounded-2xl p-4 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-violet flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-violet text-sm">Share Schedule</p>
                  <p className="text-xs text-purple-400">Send protocol documents to sites</p>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="px-4 mb-4">
              <div className="flex gap-2">
                {[
                  { label: "Add Trial", onClick: () => onNavigate("add-trial"), color: "border-info text-info" },
                  { label: "Add Site", onClick: () => setShowAddSite(true), color: "border-info text-info" },
                ].map(a => {
                  return (
                    <button key={a.label} onClick={a.onClick} className={cn("flex-1 flex items-center justify-center gap-1 border rounded-xl py-2.5 text-xs font-semibold", a.color)}>
                      {a.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Site Performance */}
            <div className="px-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Site Performance</h3>
                <button onClick={() => setActiveTab("sites")} className="text-info text-sm font-medium flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
                {mockData.sites.map(s => (
                  <div key={s.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{s.name}</span>
                      <span className="text-xs font-bold text-primary-deep">{s.enrollmentPct}%</span>
                    </div>
                    <ProgressBar value={s.enrollmentPct} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TRIALS TAB ── */}
        {activeTab === "trials" && (
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 min-w-0 flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                <input value={trialSearch} onChange={e => setTrialSearch(e.target.value)} placeholder="Search trials..." className="flex-1 min-w-0 text-sm outline-none" />
              </div>
              <button
                onClick={() => setShowTrialFilters(v => !v)}
                className={cn("flex-shrink-0 p-2 rounded-xl border", showTrialFilters || phaseFilter !== "All" ? "bg-info border-info" : "bg-card border-border")}>
                <SlidersHorizontal className={cn("w-4 h-4", showTrialFilters || phaseFilter !== "All" ? "text-white" : "text-muted-foreground")} />
              </button>
              <button onClick={() => onNavigate("add-trial")} className="flex-shrink-0 px-3 py-2 bg-info rounded-xl text-white text-xs font-semibold whitespace-nowrap">Add Trial</button>
            </div>
            {/* Phase filter panel (toggled by the sliders button) */}
            {showTrialFilters && (
              <div className="bg-card border border-border rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider">Filter by Phase</p>
                  {phaseFilter !== "All" && (
                    <button onClick={() => setPhaseFilter("All")} className="text-[11px] text-info font-medium">Clear</button>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["All", "Phase I", "Phase II", "Phase III", "Phase IV"].map(p => (
                    <button key={p} onClick={() => setPhaseFilter(p)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border", phaseFilter === p ? "bg-info text-white border-info" : "bg-card text-muted-foreground border-border")}>{p}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
              {[
                { label: `All (${trials.length})`, val: "All" },
                { label: `Active (${trials.filter(t => t.status === "Active").length})`, val: "Active" },
                { label: `Completed (${trials.filter(t => t.status === "Completed").length})`, val: "Completed" },
                { label: `Terminated (${trials.filter(t => t.status === "Terminated").length})`, val: "Terminated" },
              ].map(f => (
                <button key={f.val} onClick={() => setTrialFilter(f.val)} className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border", trialFilter === f.val ? "bg-info text-white border-info" : "bg-card text-muted-foreground border-border")}>{f.label}</button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredTrials.map(t => (
                <div key={t.id} onClick={() => setSelectedTrial(t)} className="bg-card rounded-2xl border border-border p-4 shadow-xs cursor-pointer">
                  {/* Protocol ID + Status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-info/10 text-info text-xs rounded-full font-medium">{t.id}</span>
                    <div className="flex items-center gap-2"><StatusBadge status={t.status} /><ChevronRight className="w-4 h-4 text-muted-foreground/70" /></div>
                  </div>
                  {/* Study Title */}
                  <h4 className="font-semibold text-foreground text-sm mb-2">{t.name}</h4>
                  {/* Phase · Disease · Drug · Sites */}
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 mb-3">
                    <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Phase</p><p className="text-xs font-medium text-foreground">{t.phase}</p></div>
                    <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Disease</p><p className="text-xs font-medium text-foreground">{t.indication}</p></div>
                    <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Drug</p><p className="text-xs font-medium text-foreground">{t.drug}</p></div>
                    <div><p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">Sites</p><p className="text-xs font-medium text-foreground">{t.sites}</p></div>
                  </div>
                  {/* Enrollment Bar */}
                  <ProgressBar value={Math.round((t.enrolled / t.target) * 100)} />
                  <p className="text-xs text-muted-foreground mt-1">{t.enrolled}/{t.target} enrolled</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SITES TAB ── */}
        {activeTab === "sites" && (
          <div className="px-4 pt-4">
            {/* Summary */}
            <div className="flex gap-3 mb-4">
              <div className="bg-surface rounded-xl p-3 flex items-center gap-3 flex-1">
                <MapPin className="w-5 h-5 text-accent" />
                <div><p className="text-lg font-bold text-primary-deep">{sites.length}</p><p className="text-xs text-muted-foreground">Total Sites</p></div>
              </div>
              <div className="bg-success/10 rounded-xl p-3 flex items-center gap-3 flex-1">
                <div className="w-2 h-2 rounded-full bg-success mt-0.5" />
                <div><p className="text-lg font-bold text-success">{sites.filter(s => s.status === "Active").length}</p><p className="text-xs text-muted-foreground">Active</p></div>
              </div>
            </div>
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
        {activeTab === "notifs" && (
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg text-foreground">Notifications</h2>
              <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))} className="text-info text-sm font-medium">Mark All Read</button>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
              {["All", "Trials", "Sites", "Recruitment", "System"].map(f => (
                <button key={f} onClick={() => setNotifFilter(f)} className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border", notifFilter === f ? "bg-info text-white border-info" : "bg-card text-muted-foreground border-border")}>{f}</button>
              ))}
            </div>
            <div className="space-y-2">
              {notifications.map(n => {
                const iconInfo = notifIconMap[n.type] || notifIconMap.system
                const Icon = iconInfo.icon
                return (
                  <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))} className={cn("bg-card rounded-xl border p-3 flex gap-3 cursor-pointer", n.unread ? "border-info/20 bg-surface" : "border-border")}>
                    {n.unread && <div className="w-2 h-2 rounded-full bg-info mt-1.5 flex-shrink-0" />}
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0", iconInfo.bg, !n.unread && "opacity-70")}>
                      <Icon className={cn("w-4 h-4", iconInfo.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-foreground leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground/70 flex-shrink-0">{n.time}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

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
            <button onClick={() => { setMeSection(null); setEntityChange({ field: "Entity Type", newValue: "" }); setEntityDoc(null) }} className="p-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
            <span className="font-semibold flex-1">Entity Change</span>
          </div>
          <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
            <p className="text-sm text-muted-foreground">Request a change to your registered entity details. Our team reviews each request along with the supporting document before applying it.</p>

            {/* What are you changing */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">What are you changing?</label>
              <select
                value={entityChange.field}
                onChange={e => setEntityChange(c => ({ ...c, field: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
              >
                {["Entity Type", "Organization Name", "Organization Address"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Current value (read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Current Value</label>
              <div className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-muted-foreground">
                {entityChange.field === "Entity Type" ? "Sponsor" : entityChange.field === "Organization Name" ? mockData.user.org : mockData.user.orgAddress}
              </div>
            </div>

            {/* New value */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Change To</label>
              <input
                value={entityChange.newValue}
                onChange={e => setEntityChange(c => ({ ...c, newValue: e.target.value }))}
                placeholder={`Enter new ${entityChange.field.toLowerCase()}`}
                className="w-full px-4 py-3 rounded-xl border border-border outline-none text-sm focus:border-primary focus:ring-2 focus:ring-info/15 bg-card"
              />
            </div>

            {/* Supporting document */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Supporting Document</label>
              {entityDoc ? (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <FileText className="w-4 h-4 text-info shrink-0" />
                  <span className="flex-1 text-sm text-foreground truncate">{entityDoc}</span>
                  <button onClick={() => setEntityDoc(null)} className="text-muted-foreground/70"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border px-4 py-6 text-center cursor-pointer hover:border-primary">
                  <Upload className="w-5 h-5 text-muted-foreground/70" />
                  <span className="text-sm font-medium text-muted-foreground">Upload document</span>
                  <span className="text-xs text-muted-foreground/70">PDF, JPG or PNG supporting your change</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setEntityDoc(f.name) }} />
                </label>
              )}
            </div>
          </div>

          <div className="px-5 py-4 border-t border-border bg-card">
            <button
              disabled={!entityChange.newValue.trim() || !entityDoc}
              onClick={() => setEntitySubmitted(true)}
              className={cn("w-full py-3.5 rounded-xl font-semibold text-sm", entityChange.newValue.trim() && entityDoc ? "bg-primary-deep text-white" : "bg-border text-muted-foreground/70")}
            >
              Submit Request
            </button>
          </div>

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
                  onClick={() => { setEntitySubmitted(false); setEntityChange({ field: "Entity Type", newValue: "" }); setEntityDoc(null); setMeSection(null) }}
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
          <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
            <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
              <a href="mailto:support@mtb-pvs.com" className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Mail className="w-4 h-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Email Support</p>
                  <p className="text-xs text-muted-foreground">support@mtb-pvs.com</p>
                </div>
              </a>
              <a href="tel:+918000000000" className="flex items-center gap-3 px-4 py-3">
                <Phone className="w-4 h-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Call Helpline</p>
                  <p className="text-xs text-muted-foreground">+91 80000 00000 · Mon–Fri, 9am–6pm</p>
                </div>
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">FAQ</p>
              <div className="bg-card rounded-2xl border border-border shadow-xs divide-y divide-border/60">
                {[
                  { q: "How do I reset my password?", a: "Go to Account → Change Password, enter your current password, then set a new one that meets all the strength requirements. If you're locked out, use 'Forgot Password' on the sign-in screen and verify via OTP." },
                  { q: "How do I invite a team member?", a: "Open Trial Management → Team Members → Invite Members. Fill in the name, email, role and the trials they should be involved in, then tap Send Invite." },
                  { q: "How do I add a new site?", a: "Go to the Sites tab and tap Add Site. Enter the site and PI details, then share access with the PI to onboard them." },
                  { q: "How are visit schedules created?", a: "Upload the protocol and the AI extracts the visit template. You can review, edit, and save it, after which patient visits are auto-calculated from each baseline date." },
                ].map(item => {
                  const open = expandedFaq === item.q
                  return (
                    <div key={item.q}>
                      <button onClick={() => setExpandedFaq(open ? null : item.q)} className="w-full flex items-center gap-2 px-4 py-3 text-left">
                        <HelpCircle className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                        <span className="text-sm text-foreground flex-1">{item.q}</span>
                        <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform", open && "rotate-180")} />
                      </button>
                      {open && <p className="px-4 pb-3 pl-10 text-xs text-muted-foreground leading-relaxed">{item.a}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
