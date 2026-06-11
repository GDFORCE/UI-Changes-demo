"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown, Camera, User, Lock, Globe, Bell, FileText, Shield, ShieldCheck, HelpCircle, LogOut, AlertTriangle, Eye, EyeOff, Check, X, MessageCircle, Mail, Phone, Clock, Ticket } from "lucide-react"
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
  const languages = ["English", "Hindi — हिंदी", "Tamil — தமிழ்", "Telugu — తెలుగు", "Kannada — ಕನ್ನಡ", "Malayalam — മലയാളം", "Bengali — বাংলা", "Marathi — मराठी"]
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

  // ── HELPERS ──────────────────────────────────────────────
  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={cn("relative w-11 h-6 rounded-full transition-colors flex-shrink-0", on ? "bg-accent" : "bg-border")}>
      <div className={cn("absolute top-1 w-4 h-4 bg-card rounded-full shadow transition-transform", on ? "translate-x-6" : "translate-x-1")} />
    </button>
  )

  const SubBar = ({ title, onPress, rightLabel, rightAction }: { title: string; onPress: () => void; rightLabel?: string; rightAction?: () => void }) => (
    <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3">
      <button onClick={onPress} className="p-1"><ChevronLeft className="w-6 h-6 text-primary-deep" /></button>
      <span className="flex-1 text-center font-bold text-primary-deep text-[17px]">{title}</span>
      {rightLabel ? (
        <button onClick={rightAction} className="text-info text-sm font-bold">{rightLabel}</button>
      ) : (
        <div className="w-8" />
      )}
    </div>
  )

  // ── SUB-SCREENS ──────────────────────────────────────────

  if (section === "edit-profile") {
    return (
      <div className="h-full flex flex-col bg-surface">
        <SubBar title="Edit Profile" onPress={() => setSection("main")} rightLabel="Save" rightAction={saveProfile} />
        <div className="flex-1 overflow-auto px-4 py-5 space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-violet flex items-center justify-center">
                <span className="text-white font-bold text-2xl font-[family-name:var(--font-heading)]">PK</span>
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-card rounded-full border border-border flex items-center justify-center shadow">
                <Camera className="w-4 h-4 text-info" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Full Name *</label>
            <input value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Date of Birth *</label>
            <input type="date" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Gender *</label>
            <select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary bg-card">
              <option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Phone Number</label>
            <div className="flex gap-2">
              <div className="px-4 py-3 rounded-xl border border-border bg-surface text-muted-foreground text-sm font-medium">+91</div>
              <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary" />
            </div>
            <div className="mt-1.5 bg-warning/10 border border-warning/20 rounded-xl p-2.5 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-warning">Changing this will notify your research team and require OTP verification</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Email ID</label>
            <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary" />
            <div className="mt-1.5 bg-warning/10 border border-warning/20 rounded-xl p-2.5 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-warning">Changing this will notify your research team and require OTP verification</p>
            </div>
          </div>
          <button onClick={saveProfile} className="w-full bg-primary-deep text-white py-3.5 rounded-xl font-semibold text-sm">Save Changes</button>
        </div>
      </div>
    )
  }

  if (section === "change-password") {
    return (
      <div className="h-full flex flex-col bg-surface">
        <SubBar title="Change Password" onPress={() => setSection("main")} />
        <div className="flex-1 overflow-auto px-4 py-5 space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Current Password *</label>
            <div className="relative">
              <input type={showPass.current ? "text" : "password"} value={passwords.current}
                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-border text-sm outline-none focus:border-primary" />
              <button onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPass.current ? <EyeOff className="w-5 h-5 text-muted-foreground/70" /> : <Eye className="w-5 h-5 text-muted-foreground/70" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">New Password *</label>
            <div className="relative">
              <input type={showPass.new ? "text" : "password"} value={passwords.new}
                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Enter new password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-border text-sm outline-none focus:border-primary" />
              <button onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPass.new ? <EyeOff className="w-5 h-5 text-muted-foreground/70" /> : <Eye className="w-5 h-5 text-muted-foreground/70" />}
              </button>
            </div>
            {passwords.new.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={cn("h-1.5 flex-1 rounded-full", passStrength >= i ? passStrengthColor : "bg-border")} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Password Strength: {passStrengthLabel}</p>
              </div>
            )}
          </div>

          {/* Rules checklist */}
          <div className="space-y-1.5">
            {passwordRules.map((rule, i) => {
              const met = rule.test(passwords.new)
              return (
                <div key={i} className="flex items-center gap-2">
                  {met
                    ? <Check className="w-4 h-4 text-success flex-shrink-0" />
                    : <X className="w-4 h-4 text-destructive flex-shrink-0" />}
                  <span className={cn("text-sm", met ? "text-success" : "text-destructive")}>{rule.label}</span>
                </div>
              )
            })}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Confirm New Password *</label>
            <div className="relative">
              <input type={showPass.confirm ? "text" : "password"} value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-border text-sm outline-none focus:border-primary" />
              <button onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPass.confirm ? <EyeOff className="w-5 h-5 text-muted-foreground/70" /> : <Eye className="w-5 h-5 text-muted-foreground/70" />}
              </button>
            </div>
            {passwords.confirm.length > 0 && (
              <p className={cn("text-xs mt-1 flex items-center gap-1", passMatch ? "text-success" : "text-destructive")}>
                {passMatch ? <><Check className="w-3.5 h-3.5" /> Passwords match</> : <><X className="w-3.5 h-3.5" /> Passwords do not match</>}
              </p>
            )}
          </div>

          <button disabled={!canUpdatePass}
            className={cn("w-full py-3.5 rounded-xl font-semibold text-sm", canUpdatePass ? "bg-primary-deep text-white" : "bg-border text-muted-foreground/70")}>
            Update Password
          </button>
        </div>
      </div>
    )
  }

  if (section === "notification-prefs") {
    return (
      <div className="h-full flex flex-col bg-surface">
        <SubBar title="Notification Preferences" onPress={() => setSection("main")} />
        <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
          {/* Visit Reminders */}
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4 space-y-3">
            <p className="font-semibold text-foreground text-sm border-b border-border pb-2">Visit Reminders</p>
            {[
              { label: "Push Notifications", key: "visitPush" as const },
              { label: "SMS Reminders",      key: "visitSMS"  as const },
              { label: "Email Reminders",    key: "visitEmail" as const },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">{item.label}</span>
                <Toggle on={notifPrefs[item.key]} onToggle={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })} />
              </div>
            ))}
            <div className="pt-1">
              <p className="text-sm text-foreground/80 mb-2">Remind me before visit:</p>
              {[1, 2, 3].map(days => (
                <label key={days} className="flex items-center gap-3 py-1.5 cursor-pointer">
                  <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", notifPrefs.visitRemindDays === days ? "border-info" : "border-border")}>
                    {notifPrefs.visitRemindDays === days && <div className="w-2.5 h-2.5 rounded-full bg-info" />}
                  </div>
                  <span className="text-sm text-foreground/80">{days} day{days > 1 ? "s" : ""} before</span>
                </label>
              ))}
            </div>
          </div>

          {/* Medication Reminders */}
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4 space-y-3">
            <p className="font-semibold text-foreground text-sm border-b border-border pb-2">Medication Reminders</p>
            {[
              { label: "Push Notifications", key: "medPush" as const },
              { label: "SMS Reminders",      key: "medSMS"  as const },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">{item.label}</span>
                <Toggle on={notifPrefs[item.key]} onToggle={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })} />
              </div>
            ))}
          </div>

          {/* General */}
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4 space-y-3">
            <p className="font-semibold text-foreground text-sm border-b border-border pb-2">General Notifications</p>
            {[
              { label: "Trial Updates",       key: "trialUpdates"  as const },
              { label: "Messages from PI",    key: "piMessages"    as const },
              { label: "System Notifications",key: "systemNotifs"  as const },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">{item.label}</span>
                <Toggle on={notifPrefs[item.key]} onToggle={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })} />
              </div>
            ))}
          </div>

          <button className="w-full bg-primary-deep text-white py-3.5 rounded-xl font-semibold text-sm">Save Preferences</button>
        </div>
      </div>
    )
  }

  if (section === "terms") {
    return (
      <div className="h-full flex flex-col bg-surface">
        <SubBar title="Terms & Conditions" onPress={() => setSection("main")} />
        <div className="flex-1 overflow-auto px-4 py-4">
          <p className="text-[13px] text-muted-foreground mb-4">Version 2.1 · Effective 1 Jan 2025</p>
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4 space-y-3 text-sm text-foreground/80">
            <h3 className="font-semibold text-foreground">1. Use of Application</h3>
            <p>This application is designed to help patients manage their clinical trial visit schedules, medication reminders, and communication with research teams.</p>
            <h3 className="font-semibold text-foreground">2. Privacy</h3>
            <p>Your personal health information is protected and handled in accordance with applicable privacy laws including HIPAA and GDPR.</p>
            <h3 className="font-semibold text-foreground">3. Data Security</h3>
            <p>We implement industry-standard security measures to protect your data. All communications are encrypted using TLS 1.3.</p>
            <h3 className="font-semibold text-foreground">4. Medical Disclaimer</h3>
            <p>This application is for informational purposes only and does not replace professional medical advice. Always consult your healthcare provider.</p>
            <h3 className="font-semibold text-foreground">5. User Responsibilities</h3>
            <p>You are responsible for keeping your login credentials confidential and for all activities under your account.</p>
            <div className="flex items-center gap-2 mt-4 text-success">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">You accepted this on 15 March 2025</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (section === "privacy") {
    return (
      <div className="h-full flex flex-col bg-surface">
        <SubBar title="Privacy Policy" onPress={() => setSection("main")} />
        <div className="flex-1 overflow-auto px-4 py-4">
          <p className="text-[13px] text-muted-foreground mb-4">Version 2.1 · Effective 1 Jan 2025</p>
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4 space-y-3 text-sm text-foreground/80">
            <h3 className="font-semibold text-foreground">Information We Collect</h3>
            <p>We collect information you provide directly, including contact details, health information relevant to your trial participation, and usage data.</p>
            <h3 className="font-semibold text-foreground">How We Use Information</h3>
            <p>Your information is used to manage your trial participation, send reminders, and facilitate communication with your research team.</p>
            <h3 className="font-semibold text-foreground">Data Sharing</h3>
            <p>Your data is shared only with your designated research team and the clinical trial sponsor as required by your trial protocol.</p>
            <h3 className="font-semibold text-foreground">Your Rights</h3>
            <p>You have the right to access, correct, or request deletion of your personal data at any time by contacting your research team.</p>
            <div className="flex items-center gap-2 mt-4 text-success">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">You accepted this on 15 March 2025</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (section === "faq") {
    return (
      <div className="h-full flex flex-col bg-surface">
        <SubBar title="FAQ" onPress={() => setSection("help")} />
        <div className="flex-1 overflow-auto px-4 py-4 space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-4 py-4 flex items-center justify-between gap-3 text-left">
                <span className="text-sm font-medium text-foreground">{faq.q}</span>
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform", openFaq === i && "rotate-180")} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (section === "contact-support") {
    if (ticketSubmitted) {
      return (
        <div className="h-full flex flex-col bg-surface">
          <SubBar title="Contact Support" onPress={() => { setSection("help"); setTicketSubmitted(false) }} />
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
            <button onClick={() => setSection("tickets")} className="text-sm text-info font-medium">View my tickets</button>
          </div>
        </div>
      )
    }
    return (
      <div className="h-full flex flex-col bg-surface">
        <SubBar title="Contact Support" onPress={() => setSection("help")} />
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
              className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Description</label>
            <textarea rows={5} value={contactForm.description} onChange={e => setContactForm({ ...contactForm, description: e.target.value })}
              placeholder="Describe your issue in detail..."
              className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary resize-none" />
          </div>
          <button onClick={handleSubmitTicket}
            className="w-full bg-primary-deep text-white py-3.5 rounded-xl font-semibold text-sm">
            Submit Ticket
          </button>
        </div>
      </div>
    )
  }

  if (section === "tickets") {
    return (
      <div className="h-full flex flex-col bg-surface">
        <SubBar title="My Tickets" onPress={() => setSection("help")} />
        <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
          {tickets.length === 0 && (
            <p className="text-sm text-muted-foreground/70 bg-card rounded-2xl border border-border p-6 text-center">You haven't raised any tickets yet.</p>
          )}
          {tickets.map(t => (
            <div key={t.id} className="bg-card rounded-2xl border border-border shadow-sm p-4">
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
          <button onClick={() => { setTicketSubmitted(false); setSection("contact-support") }}
            className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary-deep text-white flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" /> Raise New Ticket
          </button>
        </div>
      </div>
    )
  }

  if (section === "help") {
    return (
      <div className="h-full flex flex-col bg-surface">
        <SubBar title="Help & Support" onPress={() => setSection("main")} />
        <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
          {[
            { icon: HelpCircle,    bg: "bg-info/10",    ic: "text-info",     label: "Frequently Asked Questions", sub: "Browse common questions",    action: () => setSection("faq") },
            { icon: MessageCircle, bg: "bg-success/15", ic: "text-success",   label: "Contact Support",            sub: "Get help from our team",     action: () => setSection("contact-support") },
            { icon: Ticket,        bg: "bg-violet/10",  ic: "text-violet",   label: "My Tickets",                 sub: "Track your raised tickets",  action: () => setSection("tickets") },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <button key={i} onClick={item.action} className="w-full bg-card rounded-2xl p-4 flex items-center justify-between shadow-sm">
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
  }

  // ── MAIN SCREEN ──────────────────────────────────────────
  const menuItems = [
    { icon: User,        label: t("editProfile"),              action: () => setSection("edit-profile") },
    { icon: Lock,        label: t("changePassword"),           action: () => setSection("change-password") },
    { icon: Globe,       label: t("preferredLanguage"),        action: () => setShowLanguagePicker(true) },
    { icon: Bell,        label: t("notificationPreferences"),  action: () => setSection("notification-prefs") },
    { icon: FileText,    label: t("termsConditions"),          action: () => setSection("terms") },
    { icon: Shield,      label: t("privacyPolicy"),            action: () => setSection("privacy") },
    { icon: HelpCircle,  label: t("helpSupport"),              action: () => setSection("help") },
  ]

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* App Bar */}
      <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3">
        {onBack && <button onClick={onBack} className="p-1"><ChevronLeft className="w-6 h-6 text-primary-deep" /></button>}
        <span className="flex-1 text-center font-bold text-primary-deep text-[17px]">{t("profileSettings")}</span>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-auto">
        {/* Profile Header */}
        <div className="bg-card px-4 py-6 flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-violet flex items-center justify-center">
              <span className="text-white font-bold text-2xl font-[family-name:var(--font-heading)]">PK</span>
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-card rounded-full border border-border flex items-center justify-center shadow">
              <Camera className="w-4 h-4 text-info" />
            </button>
          </div>
          <h2 className="font-bold text-foreground text-[18px] font-[family-name:var(--font-heading)]">{profile.fullName}</h2>
          <span className="px-3 py-1 bg-info/10 text-info text-xs rounded-full font-semibold mt-1">Patient</span>
        </div>

        {/* Profile Info Card */}
        <div className="mx-4 mt-3 bg-card rounded-2xl border border-border p-4 shadow-xs">
          {[
            { label: "Name", val: profile.fullName },
            { label: "DOB / Age", val: computeAge(profile.dob) != null ? `${formatDob(profile.dob)} · ${computeAge(profile.dob)} yrs` : formatDob(profile.dob) },
            { label: "Gender", val: profile.gender },
            { label: "Phone No.", val: `+91 ${profile.phone}`, verify: true },
            { label: "Email ID", val: profile.email, verify: true },
            { label: "Preferred Language", val: selectedLanguage },
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

        {/* Menu Items */}
        <div className="mx-4 mt-3 bg-card rounded-2xl border border-border divide-y divide-border shadow-xs overflow-hidden">
          {menuItems.map((item, i) => {
            const Icon = item.icon
            return (
              <button key={i} onClick={item.action}
                className="w-full px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-[15px] text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </button>
            )
          })}
        </div>

        {/* Logout */}
        <div className="mx-4 mt-3 bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <button onClick={() => setShowLogoutDialog(true)}
            className="w-full px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-[15px] text-destructive font-medium">{t("logout")}</span>
          </button>
        </div>

        {/* Version Footer */}
        <div className="text-center pt-6 pb-8">
          <p className="text-[12px] text-muted-foreground">Patient Visit Schedule  v2.1.0</p>
          <p className="text-[12px] text-muted-foreground">© 2025 MTB Health Technologies</p>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-xs shadow-xl">
            <h3 className="font-bold text-foreground text-lg mb-2">Log Out?</h3>
            <p className="text-sm text-muted-foreground mb-5">Are you sure you want to log out of Patient Visit Schedule?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutDialog(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground/80">
                Cancel
              </button>
              <button onClick={() => { setShowLogoutDialog(false); onLogout?.() }}
                className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold">
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Picker Bottom Sheet */}
      {showLanguagePicker && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-card rounded-t-3xl w-full p-5">
            <h3 className="font-bold text-primary-deep text-base mb-4">{t("preferredLanguage")}</h3>
            <div className="space-y-1 max-h-64 overflow-auto">
              {languages.map((lang, i) => {
                const key = lang.split(" ")[0]
                return (
                  <label key={i} onClick={() => { setSelectedLanguage(key); setLang(key) }}
                    className="flex items-center gap-3 py-2.5 cursor-pointer">
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0", selectedLanguage === key ? "border-info" : "border-border")}>
                      {selectedLanguage === key && <div className="w-2.5 h-2.5 rounded-full bg-info" />}
                    </div>
                    <span className="text-sm text-foreground">{lang}</span>
                  </label>
                )
              })}
            </div>
            <button onClick={() => setShowLanguagePicker(false)}
              className="w-full mt-4 bg-primary-deep text-white py-3.5 rounded-xl font-semibold text-sm">
              {t("apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
