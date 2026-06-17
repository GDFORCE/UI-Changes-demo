"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown, Camera, User, Lock, Globe, Bell, FileText, Shield, ShieldCheck, HelpCircle, LogOut, AlertTriangle, Eye, EyeOff, Check, X, MessageCircle, Mail, Phone, Clock, Ticket, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"
import { toast } from "sonner"
import { ticketStatusStyle, type SupportTicket } from "@/components/clinical/screens/site-user-profile"

interface ProfileSettingsScreenProps {
  onBack?: () => void
  onLogout?: () => void
}

type Section = "main" | "edit-profile" | "change-password" | "notification-prefs" | "terms" | "privacy" | "help" | "faq" | "contact-support" | "tickets"

export function ProfileSettingsScreen({ onBack, onLogout }: ProfileSettingsScreenProps) {
  const { t, setLang } = useLanguage()
  const [section, setSection] = useState<Section>("main")
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showLanguagePicker, setShowLanguagePicker] = useState(false)

  // Edit Profile
  const [profile, setProfile] = useState({
    fullName: "Priya Kapoor",
    dob: "1992-08-15",
    gender: "Female",
    phone: "98765 43210",
    email: "priya.k@gmail.com",
    language: "English",
  })

  // Change Password
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false })

  const passwordRules = [
    { label: "Minimum 8 characters",        test: (p: string) => p.length >= 8 },
    { label: "Uppercase letter (A-Z)",       test: (p: string) => /[A-Z]/.test(p) },
    { label: "Lowercase letter (a-z)",       test: (p: string) => /[a-z]/.test(p) },
    { label: "Numeric character (0-9)",      test: (p: string) => /[0-9]/.test(p) },
    { label: "Special character (!@#$%...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ]
  const passStrength = passwordRules.filter(r => r.test(passwords.new)).length
  const passStrengthLabel = passStrength <= 2 ? "Weak" : passStrength <= 3 ? "Medium" : "Strong"
  const passStrengthColor = passStrength <= 2 ? "bg-destructive" : passStrength <= 3 ? "bg-warning" : "bg-success"
  const passMatch = passwords.confirm.length > 0 && passwords.new === passwords.confirm
  const canUpdatePass = passwords.current.length > 0 && passStrength === 5 && passMatch

  // Notification Preferences
  const [notifPrefs, setNotifPrefs] = useState({
    visitPush: true, visitSMS: true, visitEmail: false,
    visitRemindDays: 2,
    medPush: true, medSMS: true,
    trialUpdates: true, piMessages: true, systemNotifs: false,
  })

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const faqs = [
    { q: "How do I view my upcoming visit?", a: "Open the app and go to My Visits from the bottom navigation. Your next visit will be highlighted at the top." },
    { q: "What if I miss a visit?", a: "Contact your research team immediately. You can reach them via the Chat section in the app." },
    { q: "How do I contact my research team?", a: "Use the Chat icon in the bottom navigation to send a message directly to your PI or CRC." },
    { q: "Can I change my phone number?", a: "Yes, go to Profile & Settings > Edit Profile. Changing your phone number requires OTP verification." },
    { q: "How are medication reminders set?", a: "Medication reminders are set by your research team based on your trial protocol. You can manage reminder channels in Notification Preferences." },
  ]

  // Language
  const languages = ["English", "Hindi — हिंदी", "Tamil — தமிழ்", "Telugu — తెలుగు", "Kannada — ಕನ್ನಡ", "Malayalam — മലയാളം", "Bengali — বাংলা", "Marathi — मराठী"]
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  // Contact Support form
  const [contactForm, setContactForm] = useState({ category: "Login Issue", subject: "", description: "" })
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [lastTicketId, setLastTicketId] = useState("")
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: "#TKT-20260604-0031", subject: "Reminder not received for my next visit", category: "Notification Problem", status: "In Progress", date: "04 Jun 2026" },
    { id: "#TKT-20260528-0019", subject: "Could not open my visit schedule", category: "App Bug", status: "Resolved", date: "28 May 2026" },
  ])
  const handleSubmitTicket = () => {
    const newId = `#TKT-20260611-${String(43 + tickets.length).padStart(4, "0")}`
    setTickets(prev => [{ id: newId, subject: contactForm.subject.trim() || "Support request", category: contactForm.category, status: "Open", date: "11 Jun 2026" }, ...prev])
    setLastTicketId(newId)
    setTicketSubmitted(true)
    setContactForm({ category: "Login Issue", subject: "", description: "" })
  }

  const saveProfile = () => {
    toast.success("Profile updated")
    setSection("main")
  }

  // ── DOB / Age helpers ────────────────────────────────────
  const formatDob = (dob: string) => {
    const d = new Date(dob)
    return isNaN(d.getTime()) ? dob : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  }
  const computeAge = (dob: string) => {
    const d = new Date(dob)
    if (isNaN(d.getTime())) return null
    const now = new Date()
    let age = now.getFullYear() - d.getFullYear()
    const m = now.getMonth() - d.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
    return age
  }

  const initials = profile.fullName.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("") || "PK"

  // ── HELPERS ──────────────────────────────────────────────
  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={cn("springy relative w-11 h-6 rounded-full transition-colors flex-shrink-0 active:scale-95", on ? "dawn-gradient" : "bg-border")}>
      <div className={cn("absolute top-1 w-4 h-4 bg-card rounded-full shadow transition-transform", on ? "translate-x-6" : "translate-x-1")} />
    </button>
  )

  // Dawn app bar reused by every sub-screen. Optional right action (e.g. Save).
  const SubBar = ({ title, eyebrow = "Profile & settings", onPress, rightLabel, rightAction }: { title: string; eyebrow?: string; onPress: () => void; rightLabel?: string; rightAction?: () => void }) => (
    <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
      <div className="relative flex items-center gap-3">
        <button onClick={onPress} aria-label="Back" className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="eyebrow text-primary-foreground/55">{eyebrow}</p>
          <h1 className="display-serif text-lg leading-tight truncate">{title}</h1>
        </div>
        {rightLabel && (
          <button onClick={rightAction} className="springy rounded-full bg-white/15 backdrop-blur-sm px-3.5 py-1.5 text-sm font-semibold active:scale-95">
            {rightLabel}
          </button>
        )}
      </div>
    </div>
  )

  const fieldClass = "w-full px-4 py-3 rounded-xl border border-border bg-card text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"

  // ── SUB-SCREENS ──────────────────────────────────────────

  if (section === "edit-profile") {
    return (
      <div className="h-full flex flex-col bg-background">
        <SubBar title="Edit Profile" onPress={() => setSection("main")} rightLabel="Save" rightAction={saveProfile} />
        <div className="flex-1 overflow-auto px-4 py-5 space-y-4 scrollbar-hide">
          <div className="flex justify-center mb-1 animate-rise" style={{ animationDelay: "40ms" }}>
            <div className="relative">
              <div className="w-20 h-20 rounded-full dawn-gradient hero-glow flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold text-2xl font-heading">{initials}</span>
              </div>
              <button className="springy absolute bottom-0 right-0 w-7 h-7 bg-card rounded-full border border-border flex items-center justify-center shadow active:scale-90">
                <Camera className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4 animate-rise" style={{ animationDelay: "110ms" }}>
            <div>
              <label className="eyebrow text-muted-foreground mb-1.5 block">Full Name *</label>
              <input value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} className={fieldClass} />
            </div>
            <div>
              <label className="eyebrow text-muted-foreground mb-1.5 block">Date of Birth *</label>
              <input type="date" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })} className={fieldClass} />
            </div>
            <div>
              <label className="eyebrow text-muted-foreground mb-1.5 block">Gender *</label>
              <select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })} className={fieldClass}>
                <option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4 animate-rise" style={{ animationDelay: "200ms" }}>
            <p className="eyebrow text-muted-foreground">Contact — verified channels</p>
            <div>
              <label className="text-sm font-medium text-foreground/80 mb-1.5 block">Phone Number</label>
              <div className="flex gap-2">
                <div className="px-4 py-3 rounded-xl border border-border bg-surface text-muted-foreground text-sm font-medium font-mono">+91</div>
                <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className={cn(fieldClass, "flex-1")} />
              </div>
              <div className="mt-2 bg-warning/10 border border-warning/20 rounded-xl p-2.5 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-warning">Changing this will notify your research team and require OTP verification</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/80 mb-1.5 block">Email ID</label>
              <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className={fieldClass} />
              <div className="mt-2 bg-warning/10 border border-warning/20 rounded-xl p-2.5 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-warning">Changing this will notify your research team and require OTP verification</p>
              </div>
            </div>
          </div>

          <button onClick={saveProfile} className="springy w-full bg-primary-deep text-primary-foreground py-3.5 rounded-xl font-semibold text-sm active:scale-[0.98]">Save Changes</button>
        </div>
      </div>
    )
  }

  if (section === "change-password") {
    return (
      <div className="h-full flex flex-col bg-background">
        <SubBar title="Change Password" onPress={() => setSection("main")} />
        <div className="flex-1 overflow-auto px-4 py-5 space-y-4 scrollbar-hide">
          {/* Current Password */}
          <div className="animate-rise" style={{ animationDelay: "40ms" }}>
            <label className="eyebrow text-muted-foreground mb-1.5 block">Current Password *</label>
            <div className="relative">
              <input type={showPass.current ? "text" : "password"} value={passwords.current}
                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="Enter current password"
                className={cn(fieldClass, "pr-12")} />
              <button onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPass.current ? <EyeOff className="w-5 h-5 text-muted-foreground/70" /> : <Eye className="w-5 h-5 text-muted-foreground/70" />}
              </button>
            </div>
          </div>

          {/* New Password + strength */}
          <div className="animate-rise" style={{ animationDelay: "110ms" }}>
            <label className="eyebrow text-muted-foreground mb-1.5 block">New Password *</label>
            <div className="relative">
              <input type={showPass.new ? "text" : "password"} value={passwords.new}
                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Enter new password"
                className={cn(fieldClass, "pr-12")} />
              <button onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPass.new ? <EyeOff className="w-5 h-5 text-muted-foreground/70" /> : <Eye className="w-5 h-5 text-muted-foreground/70" />}
              </button>
            </div>
            {passwords.new.length > 0 && (
              <div className="mt-2.5">
                <div className="flex gap-1 mb-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", passStrength >= i ? passStrengthColor : "bg-border")} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Password strength: <span className="font-semibold text-foreground">{passStrengthLabel}</span></p>
              </div>
            )}
          </div>

          {/* Rules checklist */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-2 animate-rise" style={{ animationDelay: "200ms" }}>
            <p className="eyebrow text-muted-foreground mb-1">Requirements</p>
            {passwordRules.map((rule, i) => {
              const met = rule.test(passwords.new)
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <span className={cn("grid h-5 w-5 place-items-center rounded-full flex-shrink-0", met ? "bg-success/15" : "bg-muted")}>
                    {met ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3 text-muted-foreground/60" />}
                  </span>
                  <span className={cn("text-sm", met ? "text-foreground" : "text-muted-foreground")}>{rule.label}</span>
                </div>
              )
            })}
          </div>

          {/* Confirm Password */}
          <div className="animate-rise" style={{ animationDelay: "280ms" }}>
            <label className="eyebrow text-muted-foreground mb-1.5 block">Confirm New Password *</label>
            <div className="relative">
              <input type={showPass.confirm ? "text" : "password"} value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Confirm new password"
                className={cn(fieldClass, "pr-12")} />
              <button onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPass.confirm ? <EyeOff className="w-5 h-5 text-muted-foreground/70" /> : <Eye className="w-5 h-5 text-muted-foreground/70" />}
              </button>
            </div>
            {passwords.confirm.length > 0 && (
              <p className={cn("text-xs mt-1.5 flex items-center gap-1", passMatch ? "text-success" : "text-destructive")}>
                {passMatch ? <><Check className="w-3.5 h-3.5" /> Passwords match</> : <><X className="w-3.5 h-3.5" /> Passwords do not match</>}
              </p>
            )}
          </div>

          <button disabled={!canUpdatePass}
            className={cn("springy w-full py-3.5 rounded-xl font-semibold text-sm active:scale-[0.98]", canUpdatePass ? "bg-primary-deep text-primary-foreground" : "bg-muted text-muted-foreground/70")}>
            Update Password
          </button>
        </div>
      </div>
    )
  }

  if (section === "notification-prefs") {
    const groups = [
      {
        title: "Visit Reminders", delay: "40ms",
        items: [
          { label: "Push Notifications", key: "visitPush" as const },
          { label: "SMS Reminders",      key: "visitSMS"  as const },
          { label: "Email Reminders",    key: "visitEmail" as const },
        ],
        remind: true,
      },
      {
        title: "Medication Reminders", delay: "110ms",
        items: [
          { label: "Push Notifications", key: "medPush" as const },
          { label: "SMS Reminders",      key: "medSMS"  as const },
        ],
      },
      {
        title: "General Notifications", delay: "200ms",
        items: [
          { label: "Trial Updates",        key: "trialUpdates" as const },
          { label: "Messages from PI",     key: "piMessages"   as const },
          { label: "System Notifications", key: "systemNotifs" as const },
        ],
      },
    ]
    return (
      <div className="h-full flex flex-col bg-background">
        <SubBar title="Notifications" onPress={() => setSection("main")} />
        <div className="flex-1 overflow-auto px-4 py-4 space-y-4 scrollbar-hide">
          {groups.map(group => (
            <div key={group.title} className="bg-card rounded-2xl border border-border shadow-xs p-4 animate-rise" style={{ animationDelay: group.delay }}>
              <p className="eyebrow text-muted-foreground border-b border-border pb-2.5 mb-1">{group.title}</p>
              <div className="divide-y divide-border/60">
                {group.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <span className="text-sm text-foreground/80">{item.label}</span>
                    <Toggle on={notifPrefs[item.key]} onToggle={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })} />
                  </div>
                ))}
              </div>
              {group.remind && (
                <div className="pt-3">
                  <p className="text-sm text-foreground/80 mb-2">Remind me before visit</p>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(days => {
                      const active = notifPrefs.visitRemindDays === days
                      return (
                        <button key={days} onClick={() => setNotifPrefs({ ...notifPrefs, visitRemindDays: days })}
                          className={cn("springy flex-1 rounded-xl border py-2.5 text-sm font-medium active:scale-95", active ? "border-primary bg-primary/8 text-primary" : "border-border text-muted-foreground")}>
                          {days} day{days > 1 ? "s" : ""}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          <button onClick={() => { toast.success("Preferences saved"); setSection("main") }} className="springy w-full bg-primary-deep text-primary-foreground py-3.5 rounded-xl font-semibold text-sm active:scale-[0.98]">Save Preferences</button>
        </div>
      </div>
    )
  }

  if (section === "terms" || section === "privacy") {
    const isTerms = section === "terms"
    const blocks = isTerms
      ? [
          { h: "1. Use of Application", p: "This application is designed to help patients manage their clinical trial visit schedules, medication reminders, and communication with research teams." },
          { h: "2. Privacy", p: "Your personal health information is protected and handled in accordance with applicable privacy laws including HIPAA and GDPR." },
          { h: "3. Data Security", p: "We implement industry-standard security measures to protect your data. All communications are encrypted using TLS 1.3." },
          { h: "4. Medical Disclaimer", p: "This application is for informational purposes only and does not replace professional medical advice. Always consult your healthcare provider." },
          { h: "5. User Responsibilities", p: "You are responsible for keeping your login credentials confidential and for all activities under your account." },
        ]
      : [
          { h: "Information We Collect", p: "We collect information you provide directly, including contact details, health information relevant to your trial participation, and usage data." },
          { h: "How We Use Information", p: "Your information is used to manage your trial participation, send reminders, and facilitate communication with your research team." },
          { h: "Data Sharing", p: "Your data is shared only with your designated research team and the clinical trial sponsor as required by your trial protocol." },
          { h: "Your Rights", p: "You have the right to access, correct, or request deletion of your personal data at any time by contacting your research team." },
        ]
    return (
      <div className="h-full flex flex-col bg-background">
        <SubBar title={isTerms ? "Terms & Conditions" : "Privacy Policy"} eyebrow="Legal" onPress={() => setSection("main")} />
        <div className="flex-1 overflow-auto px-4 py-4 scrollbar-hide">
          <div className="flex items-center justify-between mb-4 animate-rise" style={{ animationDelay: "40ms" }}>
            <span className="eyebrow text-muted-foreground">Version 2.1</span>
            <span className="text-xs text-muted-foreground font-mono">Effective 01 Jan 2025</span>
          </div>
          <div className="space-y-3">
            {blocks.map((b, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4 shadow-xs animate-rise" style={{ animationDelay: `${110 + i * 60}ms` }}>
                <h3 className="font-heading text-base text-foreground mb-1.5">{b.h}</h3>
                <p className="text-sm leading-relaxed text-foreground/80">{b.p}</p>
              </div>
            ))}
            <div className="flex items-center gap-2.5 rounded-2xl border border-success/25 bg-success/8 p-4 text-success animate-rise" style={{ animationDelay: `${110 + blocks.length * 60}ms` }}>
              <Check className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">You accepted this on 15 March 2025</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (section === "faq") {
    return (
      <div className="h-full flex flex-col bg-background">
        <SubBar title="FAQ" eyebrow="Help & support" onPress={() => setSection("help")} />
        <div className="flex-1 overflow-auto px-4 py-4 space-y-2.5 scrollbar-hide">
          {faqs.map((faq, i) => {
            const open = openFaq === i
            return (
              <div key={i} className={cn("rounded-2xl border bg-card shadow-xs overflow-hidden transition-colors animate-rise", open ? "border-primary/40" : "border-border")} style={{ animationDelay: `${40 + i * 60}ms` }}>
                <button onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full px-4 py-4 flex items-center justify-between gap-3 text-left">
                  <span className={cn("text-sm font-medium", open ? "text-primary" : "text-foreground")}>{faq.q}</span>
                  <ChevronDown className={cn("w-5 h-5 flex-shrink-0 transition-transform", open ? "rotate-180 text-primary" : "text-muted-foreground")} />
                </button>
                {open && (
                  <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (section === "contact-support") {
    if (ticketSubmitted) {
      return (
        <div className="h-full flex flex-col bg-background">
          <SubBar title="Contact Support" eyebrow="Help & support" onPress={() => { setSection("help"); setTicketSubmitted(false) }} />
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
            <button onClick={() => setSection("tickets")} className="text-sm text-info font-semibold">View my tickets →</button>
          </div>
        </div>
      )
    }
    return (
      <div className="h-full flex flex-col bg-background">
        <SubBar title="Contact Support" eyebrow="Help & support" onPress={() => setSection("help")} />
        <div className="flex-1 overflow-auto px-4 py-4 space-y-4 scrollbar-hide">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4 animate-rise" style={{ animationDelay: "40ms" }}>
            <div>
              <label className="eyebrow text-muted-foreground mb-1.5 block">Issue Category</label>
              <select value={contactForm.category} onChange={e => setContactForm({ ...contactForm, category: e.target.value })} className={fieldClass}>
                <option>Login Issue</option><option>Notification Problem</option><option>App Bug</option><option>Visit Query</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="eyebrow text-muted-foreground mb-1.5 block">Subject</label>
              <input value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Brief subject" className={fieldClass} />
            </div>
            <div>
              <label className="eyebrow text-muted-foreground mb-1.5 block">Description</label>
              <textarea rows={5} value={contactForm.description} onChange={e => setContactForm({ ...contactForm, description: e.target.value })}
                placeholder="Describe your issue in detail..." className={cn(fieldClass, "resize-none")} />
            </div>
          </div>
          <button onClick={handleSubmitTicket}
            className="springy w-full bg-primary-deep text-primary-foreground py-3.5 rounded-xl font-semibold text-sm active:scale-[0.98]">
            Submit Ticket
          </button>
        </div>
      </div>
    )
  }

  if (section === "tickets") {
    return (
      <div className="h-full flex flex-col bg-background">
        <SubBar title="My Tickets" eyebrow="Help & support" onPress={() => setSection("help")} />
        <div className="flex-1 overflow-auto px-4 py-4 space-y-3 scrollbar-hide">
          {tickets.length === 0 && (
            <div className="flex flex-col items-center gap-2 bg-card rounded-2xl border border-border p-8 text-center shadow-xs">
              <Ticket className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground/70">You haven't raised any tickets yet.</p>
            </div>
          )}
          {tickets.map((tk, i) => (
            <div key={tk.id} className="bg-card rounded-2xl border border-border shadow-xs p-4 animate-rise" style={{ animationDelay: `${40 + i * 60}ms` }}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-semibold text-primary-deep">{tk.id}</span>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", ticketStatusStyle(tk.status))}>{tk.status}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{tk.subject}</p>
              <p className="text-xs text-muted-foreground mt-1">{tk.category} · {tk.date}</p>
            </div>
          ))}
        </div>
        <div className="px-4 py-4 border-t border-border bg-card">
          <button onClick={() => { setTicketSubmitted(false); setSection("contact-support") }}
            className="springy w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-primary-foreground flex items-center justify-center gap-2 active:scale-[0.98]">
            <MessageCircle className="w-4 h-4" /> Raise New Ticket
          </button>
        </div>
      </div>
    )
  }

  if (section === "help") {
    const helpItems = [
      { icon: HelpCircle,    bg: "bg-info/10",    ic: "text-info",    label: "Frequently Asked Questions", sub: "Browse common questions",   action: () => setSection("faq") },
      { icon: MessageCircle, bg: "bg-success/15", ic: "text-success", label: "Contact Support",            sub: "Get help from our team",    action: () => setSection("contact-support") },
      { icon: Ticket,        bg: "bg-violet/10",  ic: "text-violet",  label: "My Tickets",                 sub: "Track your raised tickets", action: () => setSection("tickets") },
    ]
    return (
      <div className="h-full flex flex-col bg-background">
        <SubBar title="Help & Support" onPress={() => setSection("main")} />
        <div className="flex-1 overflow-auto px-4 py-4 space-y-3 scrollbar-hide">
          {helpItems.map((item, i) => {
            const Icon = item.icon
            return (
              <button key={i} onClick={item.action} className="springy w-full bg-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-xs active:scale-[0.99] animate-rise" style={{ animationDelay: `${40 + i * 60}ms` }}>
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
      </div>
    )
  }

  // ── MAIN SCREEN ──────────────────────────────────────────
  const infoRows: { label: string; val: string; verify?: boolean }[] = [
    { label: "Date of birth", val: computeAge(profile.dob) != null ? `${formatDob(profile.dob)} · ${computeAge(profile.dob)} yrs` : formatDob(profile.dob) },
    { label: "Gender", val: profile.gender },
    { label: "Phone number", val: `+91 ${profile.phone}`, verify: true },
    { label: "Email ID", val: profile.email, verify: true },
    { label: "Preferred language", val: selectedLanguage },
  ]

  const menuGroups: { eyebrow: string; delay: string; items: { icon: typeof User; label: string; meta?: string; action: () => void }[] }[] = [
    {
      eyebrow: "Account", delay: "200ms",
      items: [
        { icon: User, label: t("editProfile"),    action: () => setSection("edit-profile") },
        { icon: Lock, label: t("changePassword"), action: () => setSection("change-password") },
      ],
    },
    {
      eyebrow: "Preferences", delay: "280ms",
      items: [
        { icon: Globe, label: t("preferredLanguage"),       meta: selectedLanguage, action: () => setShowLanguagePicker(true) },
        { icon: Bell,  label: t("notificationPreferences"),                          action: () => setSection("notification-prefs") },
      ],
    },
    {
      eyebrow: "Legal & support", delay: "360ms",
      items: [
        { icon: FileText,   label: t("termsConditions"), action: () => setSection("terms") },
        { icon: Shield,     label: t("privacyPolicy"),   action: () => setSection("privacy") },
        { icon: HelpCircle, label: t("helpSupport"),     action: () => setSection("help") },
      ],
    },
  ]

  return (
    <div className="h-full flex flex-col bg-background">
      {/* App Bar */}
      <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
        <div className="relative flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} aria-label="Back" className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <p className="eyebrow text-primary-foreground/55">Account</p>
            <h1 className="display-serif text-lg leading-tight">{t("profileSettings")}</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-4">
        {/* Identity hero — the dawn gesture */}
        <div className="dawn-gradient hero-glow paper-grain rounded-3xl p-5 text-primary-foreground shadow-md animate-rise" style={{ animationDelay: "40ms" }}>
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                <span className="font-heading font-bold text-2xl">{initials}</span>
              </div>
              <button onClick={() => setSection("edit-profile")} aria-label="Change photo" className="springy absolute -bottom-1 -right-1 w-7 h-7 bg-card rounded-full border border-border flex items-center justify-center shadow active:scale-90">
                <Camera className="w-3.5 h-3.5 text-primary" />
              </button>
            </div>
            <div className="min-w-0">
              <h2 className="font-heading text-xl leading-tight truncate">{profile.fullName}</h2>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold">
                <Sparkles className="w-3 h-3" /> Patient
              </span>
            </div>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-xs animate-rise" style={{ animationDelay: "110ms" }}>
          <p className="eyebrow text-muted-foreground mb-1">Personal details</p>
          <div className="divide-y divide-border/60">
            {infoRows.map(r => (
              <div key={r.label} className="flex items-center justify-between gap-3 py-2.5">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {r.label}
                  {r.verify && <ShieldCheck className="w-3 h-3 text-success" />}
                </p>
                <p className="text-sm text-foreground font-medium text-right truncate">{r.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grouped settings */}
        {menuGroups.map(group => (
          <div key={group.eyebrow} className="animate-rise" style={{ animationDelay: group.delay }}>
            <p className="eyebrow text-muted-foreground mb-2 px-1">{group.eyebrow}</p>
            <div className="bg-card rounded-2xl border border-border divide-y divide-border shadow-xs overflow-hidden">
              {group.items.map((item, i) => {
                const Icon = item.icon
                return (
                  <button key={i} onClick={item.action}
                    className="springy w-full px-4 py-3.5 flex items-center justify-between active:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary/60 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-[15px] text-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.meta && <span className="text-xs text-muted-foreground">{item.meta}</span>}
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="animate-rise" style={{ animationDelay: "440ms" }}>
          <button onClick={() => setShowLogoutDialog(true)}
            className="springy w-full bg-card rounded-2xl border border-destructive/20 shadow-xs px-4 py-3.5 flex items-center gap-3 active:scale-[0.99]">
            <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-[15px] text-destructive font-semibold">{t("logout")}</span>
          </button>
        </div>

        {/* Version Footer */}
        <div className="text-center pt-2 pb-4">
          <p className="text-xs text-muted-foreground">Patient Visit Schedule · v2.1.0</p>
          <p className="text-xs text-muted-foreground">© 2025 MTB Health Technologies</p>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-6 animate-fade-in" onClick={() => setShowLogoutDialog(false)}>
          <div className="bg-card rounded-3xl p-6 w-full max-w-xs shadow-xl animate-rise" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
              <LogOut className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="font-heading text-foreground text-lg mb-1.5">Log Out?</h3>
            <p className="text-sm text-muted-foreground mb-5">Are you sure you want to log out of Patient Visit Schedule?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutDialog(false)}
                className="springy flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground/80 active:scale-95">
                Cancel
              </button>
              <button onClick={() => { setShowLogoutDialog(false); onLogout?.() }}
                className="springy flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold active:scale-95">
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Picker Bottom Sheet */}
      {showLanguagePicker && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end animate-fade-in" onClick={() => setShowLanguagePicker(false)}>
          <div className="bg-card rounded-t-3xl w-full p-5 animate-rise" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <h3 className="font-heading text-primary-deep text-lg mb-4">{t("preferredLanguage")}</h3>
            <div className="space-y-1 max-h-64 overflow-auto scrollbar-hide">
              {languages.map((lang, i) => {
                const key = lang.split(" ")[0]
                const active = selectedLanguage === key
                return (
                  <button key={i} onClick={() => { setSelectedLanguage(key); setLang(key) }}
                    className={cn("springy flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left active:scale-[0.99]", active && "bg-primary/8")}>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0", active ? "border-primary" : "border-border")}>
                      {active && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <span className={cn("text-sm", active ? "text-foreground font-medium" : "text-foreground/80")}>{lang}</span>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setShowLanguagePicker(false)}
              className="springy w-full mt-4 bg-primary-deep text-primary-foreground py-3.5 rounded-xl font-semibold text-sm active:scale-[0.98]">
              {t("apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
