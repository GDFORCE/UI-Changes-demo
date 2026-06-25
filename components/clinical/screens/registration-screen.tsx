"use client"

import { AuthHeader } from "../auth-header"
import { Check, X, ClipboardCheck } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"

interface RegistrationScreenProps {
  onSubmit: () => void
  onBack: () => void
  entityType?: string | null
}

const entityLabels: Record<string, string> = {
  sponsor: "Sponsor",
  cro: "CRO",
  smo: "SMO",
  site: "Site / Hospital",
  patient: "Patient",
}

// Responsibilities shown in the floating box before an organization fills the form.
const registrationInstructions = [
  "The Authorized Signatory / Responsible person of the organization should fill this form.",
  "All fields marked with an asterisk (*) are mandatory.",
  "After submitting, check your registered email for verification before signing in.",
  "Uploaded documents must be self-attested with the company stamp and seal.",
  "You are responsible for the accuracy and authenticity of all information provided.",
]

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/55 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/15"

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-foreground/85 mb-1.5">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ placeholder, defaultValue, type = "text" }: { placeholder?: string; defaultValue?: string; type?: string }) {
  return <input type={type} defaultValue={defaultValue} placeholder={placeholder} className={inputClass} />
}

function PhoneInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="flex gap-2">
      <div className="px-4 py-3 rounded-lg border border-border bg-surface text-muted-foreground text-sm font-medium">+91</div>
      <input type="tel" defaultValue={defaultValue} placeholder="98XXXXXXXX" className={cn(inputClass, "flex-1")} />
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-3">
      <p className="eyebrow text-primary shrink-0">{title}</p>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

function SegmentToggle<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-lg border border-border bg-card p-1 gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200",
            value === opt ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ── Sponsor / CRO form ──────────────────────────────────
function SponsorForm() {
  return (
    <div className="space-y-4">
      <Field label="Full Name" required><Input defaultValue="John Doe" /></Field>
      <Field label="Designation" required><Input defaultValue="Clinical Research Manager" /></Field>
      <Field label="Email ID" required>
        <Input type="email" defaultValue="john.doe@pharmaco.com" />
      </Field>
      <Field label="Phone Number" required><PhoneInput defaultValue="98765 43210" /></Field>

      <SectionHeader title="Organization" />
      <Field label="Organization Name" required><Input defaultValue="PharmaCo Ltd" /></Field>
      <Field label="Organization Address" required>
        <textarea rows={2} defaultValue="21 Business Park, Mumbai 400001" className={cn(inputClass, "resize-none")} />
      </Field>
    </div>
  )
}

// ── Site / Hospital form ──────────────────────────────────
function SiteForm() {
  const [role, setRole] = useState<"PI" | "Research Team">("PI")
  const [hospitalType, setHospitalType] = useState<"Private" | "Government">("Private")

  return (
    <div className="space-y-4">
      <Field label="Full Name" required><Input defaultValue="Dr. Rajesh Kumar" /></Field>
      <Field label="Designation" required><Input defaultValue="Principal Investigator" /></Field>
      <Field label="Email ID" required><Input type="email" defaultValue="r.kumar@apollo.com" /></Field>
      <Field label="Phone Number" required><PhoneInput defaultValue="98100 12345" /></Field>

      <SectionHeader title="Organization" />
      <Field label="Organization Name" required><Input defaultValue="Apollo Hospitals Mumbai" /></Field>
      <Field label="Organization Address" required>
        <textarea rows={2} placeholder="Building / Street, City, State, PIN" className={cn(inputClass, "resize-none")} />
      </Field>

      <Field label="Hospital Type" required>
        <SegmentToggle options={["Private", "Government"] as const} value={hospitalType} onChange={setHospitalType} />
      </Field>

      <Field label="Role" required>
        <SegmentToggle options={["PI", "Research Team"] as const} value={role} onChange={setRole} />
      </Field>

      {role === "PI" && (
        <Field label="Department">
          <Input placeholder="e.g. Oncology, Cardiology" />
        </Field>
      )}
    </div>
  )
}

// ── SMO form ──────────────────────────────────────────────
function SMOForm() {
  const [hospitals, setHospitals] = useState([{ name: "", address: "", role: "PI" as "PI" | "Research Team" }])

  const addHospital = () =>
    setHospitals(prev => [...prev, { name: "", address: "", role: "PI" }])
  const removeHospital = (i: number) =>
    setHospitals(prev => prev.filter((_, idx) => idx !== i))
  const setHospitalRole = (i: number, role: "PI" | "Research Team") =>
    setHospitals(prev => prev.map((h, idx) => (idx === i ? { ...h, role } : h)))

  return (
    <div className="space-y-4">
      <Field label="Full Name" required><Input defaultValue="Dr. Rajesh Kumar" /></Field>
      <Field label="Designation" required><Input defaultValue="SMO Manager" /></Field>
      <Field label="Email ID" required><Input type="email" defaultValue="r.kumar@smo.com" /></Field>
      <Field label="Phone Number" required><PhoneInput defaultValue="98100 12345" /></Field>

      <SectionHeader title="Organization" />
      <Field label="SMO Name" required><Input defaultValue="MedSites SMO Pvt Ltd" /></Field>
      <Field label="SMO Address" required>
        <textarea rows={2} placeholder="Building / Street, City, State, PIN" className={cn(inputClass, "resize-none")} />
      </Field>

      <SectionHeader title="Hospitals" />
      <p className="text-xs text-muted-foreground -mt-1">Add the hospital / site locations managed by this SMO.</p>
      {hospitals.map((h, i) => (
        <div key={i} className="rounded-xl border border-border bg-card shadow-xs p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-muted-foreground">Hospital {String(i + 1).padStart(2, "0")}</span>
            {hospitals.length > 1 && (
              <button
                onClick={() => removeHospital(i)}
                className="flex items-center gap-1 text-destructive text-xs font-medium hover:underline"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            )}
          </div>
          <input
            placeholder="Hospital Name *"
            className={cn(inputClass, "px-3 py-2.5")}
            defaultValue={i === 0 ? "Apollo Hospitals Mumbai" : ""}
          />
          <input
            placeholder="Hospital Address"
            className={cn(inputClass, "px-3 py-2.5")}
            defaultValue={i === 0 ? "Bandra West, Mumbai" : ""}
          />
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Role</label>
            <SegmentToggle
              options={["PI", "Research Team"] as const}
              value={h.role}
              onChange={(r) => setHospitalRole(i, r)}
            />
          </div>
        </div>
      ))}
      <button
        onClick={addHospital}
        className="w-full py-3 border border-dashed border-primary/35 rounded-xl text-sm text-primary font-medium transition-colors hover:bg-secondary/40 hover:border-primary"
      >
        + Add another hospital
      </button>
    </div>
  )
}

// ── Patient self-registration form ───────────────────────
function PatientForm() {
  const { setLang } = useLanguage()
  return (
    <div className="space-y-4">
      <Field label="Full Name" required><Input defaultValue="Priya Kapoor" /></Field>
      <Field label="Phone Number" required><PhoneInput defaultValue="98765 43210" /></Field>
      <Field label="Email ID" required><Input type="email" placeholder="patient@example.com" /></Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date of Birth" required>
          <Input type="date" defaultValue="1985-06-15" />
        </Field>
        <Field label="Age">
          <div className="px-4 py-3 rounded-lg border border-border bg-surface text-sm text-muted-foreground font-medium">
            39 yrs
          </div>
        </Field>
      </div>

      <Field label="Gender" required>
        <select className={inputClass}>
          <option value="">Select gender</option>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
          <option>Prefer not to say</option>
        </select>
      </Field>

      <Field label="Preferred Language">
        <select onChange={(e) => setLang(e.target.value)} className={inputClass}>
          <option>English</option>
          <option>Hindi</option>
          <option>Tamil</option>
          <option>Telugu</option>
          <option>Kannada</option>
          <option>Marathi</option>
        </select>
      </Field>
    </div>
  )
}

export function RegistrationScreen({ onSubmit, onBack, entityType }: RegistrationScreenProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [termsScrolled, setTermsScrolled] = useState(false)
  // Floating responsibilities box — shown on entry for organization registrations.
  const [showInstructions, setShowInstructions] = useState(() => entityType !== "patient")
  const entityLabel = (entityType && entityLabels[entityType]) || entityLabels.sponsor

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setTermsScrolled(true)
  }

  const handleAccept = () => {
    setAgreedToTerms(true)
    setShowTermsModal(false)
  }

  const handleCheckboxClick = () => {
    if (agreedToTerms) {
      // Allow unchecking
      setAgreedToTerms(false)
      setTermsScrolled(false)
    } else {
      // Open modal to read T&C
      setShowTermsModal(true)
    }
  }

  const renderForm = () => {
    switch (entityType) {
      case "smo":
        return <SMOForm />
      case "site":
        return <SiteForm />
      case "patient":
        return <PatientForm />
      case "sponsor":
      case "cro":
      default:
        return <SponsorForm />
    }
  }

  return (
    <div className="h-full flex flex-col bg-background paper-grain">
      <AuthHeader
        eyebrow={`Step 2 of 5 · ${entityLabel}`}
        title="Tell us about you"
        onBack={onBack}
        step={2}
      />

      <div className="flex-1 px-6 pt-3 pb-4 overflow-auto space-y-4">
        <div className="animate-rise" style={{ animationDelay: "200ms" }}>
          {renderForm()}
        </div>

        {/* Terms checkbox — clicking opens the modal */}
        <div className="pt-1">
          <button onClick={handleCheckboxClick} className="flex items-start gap-3 w-full text-left cursor-pointer group">
            <span
              className={cn(
                "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                agreedToTerms ? "border-primary bg-primary" : "border-border bg-card group-hover:border-primary/50",
              )}
            >
              {agreedToTerms && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
            </span>
            <span className="text-sm text-muted-foreground leading-relaxed">
              I have read and agree to the{" "}
              <span className="text-primary font-medium underline decoration-accent/50 underline-offset-2">Terms &amp; Conditions</span>
              {" "}and{" "}
              <span className="text-primary font-medium underline decoration-accent/50 underline-offset-2">Privacy Policy</span>
            </span>
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="px-6 py-4 bg-background/90 backdrop-blur-sm border-t border-border">
        <button
          onClick={onSubmit}
          disabled={!agreedToTerms}
          className={cn(
            "w-full py-4 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-200",
            agreedToTerms
              ? "bg-primary text-primary-foreground shadow-md hover:bg-primary-deep active:scale-[0.99]"
              : "bg-muted text-muted-foreground/60 cursor-not-allowed",
          )}
        >
          Continue
        </button>
      </div>

      {/* Registration instructions — floating box, centered */}
      {showInstructions && (
        <div className="absolute inset-0 bg-primary-deep/50 backdrop-blur-[2px] flex items-center justify-center px-5 z-50">
          <div
            className="bg-background w-full max-w-sm rounded-3xl shadow-xl flex flex-col overflow-hidden animate-rise"
            style={{ maxHeight: "85%", animationDuration: "320ms" }}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 text-center">
              <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <ClipboardCheck className="w-6 h-6" />
              </span>
              <p className="eyebrow text-accent mb-1">Before you register</p>
              <h2 className="font-heading text-xl text-foreground leading-snug">
                Your responsibilities
              </h2>
              <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                Please read the points below. You are registering on behalf of your organization.
              </p>
            </div>

            {/* Instructions list */}
            <div className="flex-1 overflow-auto px-6 pb-2">
              <ol className="space-y-3">
                {registrationInstructions.map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-[13px] tabular-nums text-primary">
                      {i + 1}
                    </span>
                    <span className="text-[13px] text-muted-foreground leading-relaxed pt-0.5">{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Accept */}
            <div className="px-6 py-4">
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full py-3.5 rounded-full font-semibold text-sm bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary-deep active:scale-[0.99]"
              >
                Accept &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="absolute inset-0 bg-primary-deep/50 backdrop-blur-[2px] flex items-end z-50">
          <div className="bg-background w-full rounded-t-3xl flex flex-col shadow-xl animate-rise" style={{ maxHeight: "85%", animationDuration: "350ms" }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
              <div>
                <p className="eyebrow text-accent mb-0.5">Before you continue</p>
                <h2 className="font-heading text-lg text-foreground">Terms &amp; Conditions</h2>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll state banner */}
            {!termsScrolled ? (
              <div className="bg-accent/10 border-b border-accent/20 px-6 py-2">
                <span className="text-xs text-accent font-medium">↓ Scroll through all the terms to enable Accept</span>
              </div>
            ) : (
              <div className="bg-success/10 border-b border-success/20 px-6 py-2 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-success" />
                <span className="text-xs text-success font-medium">You have read all terms — you may now accept</span>
              </div>
            )}

            {/* Scrollable Content */}
            <div
              onScroll={handleTermsScroll}
              className="flex-1 overflow-auto px-6 py-5 text-sm text-muted-foreground leading-relaxed space-y-5"
            >
              {[
                ["1. Acceptance of Terms", "By registering, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, do not proceed with registration."],
                ["2. Data Privacy & PDPA Compliance", "All personal and clinical data collected is handled in accordance with applicable data protection laws. Your data will be used solely for the purposes of clinical trial management and communications related to your participation."],
                ["3. Data Security", "We employ industry-standard security measures including encryption at rest and in transit. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."],
                ["4. Use of Platform", "Access is granted strictly for clinical trial management purposes. Any misuse, sharing of credentials, or unauthorized access is prohibited and may result in immediate account termination and legal action."],
                ["5. Audit & Compliance", "All actions performed on the platform are logged for audit and regulatory compliance purposes. These logs may be shared with authorized regulators upon request and are retained as per applicable regulations."],
                ["6. Consent for Communications", "By registering, you consent to receive communications related to your trial participation including visit reminders, medication alerts, and important protocol updates via SMS, email, or in-app notifications."],
                ["7. Contact & Support", "For any questions regarding these terms, contact support@mtb-pvs.com. By scrolling through and tapping Accept, you confirm you have read and understood all terms above in full."],
              ].map(([heading, body]) => (
                <div key={heading} className="space-y-1">
                  <p className="font-heading text-[15px] text-foreground">{heading}</p>
                  <p>{body}</p>
                </div>
              ))}
            </div>

            {/* Accept Button */}
            <div className="px-6 py-4 border-t border-border">
              <button
                onClick={handleAccept}
                disabled={!termsScrolled}
                className={cn(
                  "w-full py-3.5 rounded-full font-semibold text-sm transition-all",
                  termsScrolled
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary-deep active:scale-[0.99]"
                    : "bg-muted text-muted-foreground/60 cursor-not-allowed",
                )}
              >
                {termsScrolled ? "Accept & Continue" : "Scroll to read all terms"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
