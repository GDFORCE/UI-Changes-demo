"use client"

import { AppBar } from "../app-bar"
import {
  Calendar,
  Check,
  Clock,
  MapPin,
  User,
  FileText,
  Activity,
  Droplet,
  HeartPulse,
  Stethoscope,
  Info,
  Phone,
  BadgeCheck,
  ClipboardList,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { visits, trials, formatVisitDate, type Visit } from "@/components/clinical/data/visits"

interface VisitDetailScreenProps {
  onUpdate: () => void
  onBack: () => void
  /** "patient" shows a read-only informational view; "clinical" shows the status-update form. */
  role?: "patient" | "clinical"
  /** Which visit to show. Falls back to the upcoming visit if not provided. */
  visitId?: string
  /** Opens a message thread with the study/research team. */
  onContact?: () => void
}

// Status → colour theme for the hero card and status badges.
const statusTheme = (status: string) => {
  switch (status) {
    case "completed":
      return {
        card: "bg-success/10 border-green-300",
        title: "text-green-900",
        meta: "text-success",
        icon: "text-success",
        badge: "bg-success/15 text-success",
        label: "Completed",
      }
    case "scheduled":
      return {
        card: "bg-info/5 border-blue-300",
        title: "text-blue-900",
        meta: "text-blue-800",
        icon: "text-info",
        badge: "bg-info/10 text-info",
        label: "Scheduled",
      }
    case "missed":
      return {
        card: "bg-destructive/5 border-red-300",
        title: "text-red-900",
        meta: "text-red-800",
        icon: "text-destructive",
        badge: "bg-destructive/10 text-destructive",
        label: "Missed",
      }
    default:
      return {
        card: "bg-warning/10 border-amber-300",
        title: "text-amber-900",
        meta: "text-warning",
        icon: "text-warning",
        badge: "bg-warning/15 text-warning",
        label: "Upcoming",
      }
  }
}

export function VisitDetailScreen({ onUpdate, onBack, role = "clinical", visitId, onContact }: VisitDetailScreenProps) {
  if (role === "patient") {
    const visit = visits.find((v) => v.id === visitId) ?? visits.find((v) => v.status === "upcoming") ?? visits[0]
    return <PatientVisitDetail onBack={onBack} visit={visit} onContact={onContact} />
  }
  return <ClinicalVisitDetail onUpdate={onUpdate} onBack={onBack} />
}

/* -------------------------------------------------------------------------- */
/* Patient view — everything the patient needs to know about this visit       */
/* -------------------------------------------------------------------------- */

function PatientVisitDetail({ onBack, visit, onContact }: { onBack: () => void; visit: Visit; onContact?: () => void }) {
  const procedures = [
    { icon: HeartPulse, label: "Vital signs", desc: "Blood pressure, pulse, temperature & weight" },
    { icon: Droplet, label: "Blood draw", desc: "A small fasting blood sample for lab tests" },
    { icon: Activity, label: "ECG", desc: "A quick heart rhythm recording" },
    { icon: Stethoscope, label: "Physical exam", desc: "General check-up by the study doctor" },
  ]

  const trial = trials.find((t) => t.id === visit.trialId) ?? trials[0]
  const theme = statusTheme(visit.status)
  const visitedDate = visit.status === "completed" ? formatVisitDate(visit.scheduledDate) : "—"

  return (
    <div className="h-full flex flex-col bg-surface">
      <AppBar title="Visit Detail" showBack onBack={onBack} />

      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {/* Hero card — colour-coded by visit status */}
        <div className={cn("rounded-2xl p-5 shadow-sm border-l-4", theme.card)}>
          <div className="flex items-center justify-between mb-3">
            <span className={cn("text-xs font-medium", theme.meta)}>{visit.visitNumber}</span>
            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold capitalize", theme.badge)}>
              {theme.label}
            </span>
          </div>
          <h2 className={cn("text-xl font-semibold mb-3", theme.title)}>{visit.visitName}</h2>
          <div className={cn("space-y-1.5 text-sm", theme.meta)}>
            <div className="flex items-center gap-2">
              <Calendar className={cn("w-4 h-4", theme.icon)} />
              <span>{formatVisitDate(visit.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className={cn("w-4 h-4", theme.icon)} />
              <span>{visit.scheduledTime} · {visit.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className={cn("w-4 h-4", theme.icon)} />
              <span>Visit window: {visit.visitWindow}</span>
            </div>
          </div>
        </div>

        {/* Study details + location & care team */}
        <Section title="Study Details" icon={FileText}>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            <DetailItem label="Protocol ID" value={trial.protocolId} />
            <DetailItem label="Phase" value={trial.phase} />
            <DetailItem label="Indication" value={trial.diseaseIndication} />
            <DetailItem label="Visit Type" value={visit.visitType} />
          </div>
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{visit.hospitalName}</p>
                <p className="text-xs text-muted-foreground">Site</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{visit.piName}</p>
                <p className="text-xs text-muted-foreground">Principal Investigator</p>
              </div>
            </div>
          </div>
        </Section>

        {/* What to expect */}
        <Section title="Activities" icon={ClipboardList}>
          <div className="space-y-3">
            {procedures.map((p) => (
              <div key={p.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center shrink-0">
                  <p.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Visit status — read-only for patient, updated by PI/CRC */}
        <Section title="Visit Status" icon={BadgeCheck}>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            <DetailItem label="Visited Date" value={visitedDate} />
            <div>
              <p className="text-[11px] text-muted-foreground/70">Status</p>
              <span className={cn("inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize", theme.badge)}>
                {theme.label}
              </span>
            </div>
          </div>
          <p className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            Visit status is updated by your study team (PI/CRC) and shown here for your reference.
          </p>
        </Section>

        {/* Help */}
        <div className="bg-info/5 rounded-2xl border border-info/20 p-4">
          <p className="text-sm font-medium text-foreground mb-1">Need to reschedule or have a question?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Contact your study coordinator before the visit window closes.
          </p>
          <button
            onClick={onContact}
            className="w-full py-3 rounded-xl font-medium bg-card border border-primary text-primary flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Contact
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-primary" />
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      </div>
      {children}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground/70">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Clinical view — original status-update form (PI/CRC)                        */
/* -------------------------------------------------------------------------- */

function ClinicalVisitDetail({ onUpdate, onBack }: { onUpdate: () => void; onBack: () => void }) {
  const [selectedStatus, setSelectedStatus] = useState("completed")
  const [visitedDate, setVisitedDate] = useState("2025-05-23")
  const [clinicalTasks, setClinicalTasks] = useState({
    vitals: true,
    blood: true,
    ecg: false,
    physical: false,
  })
  const [adminTasks, setAdminTasks] = useState({
    ecrf: true,
    consent: false,
  })

  const statuses = [
    { id: "completed", label: "Completed", color: "border-info bg-info/5" },
    { id: "scheduled", label: "Scheduled", color: "border-border" },
    { id: "screen-pass", label: "Screen Pass", color: "border-border" },
    { id: "screen-fail", label: "Screen Fail", color: "border-destructive" },
    { id: "withdrawn", label: "Withdrawn", color: "border-border" },
    { id: "drop-out", label: "Drop Out", color: "border-border" },
  ]

  return (
    <div className="h-full flex flex-col bg-surface">
      <AppBar title="Visit Detail" showBack onBack={onBack} />

      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {/* Info Card */}
        <div className="bg-info/5 rounded-2xl border border-info/20 p-4">
          <h3 className="font-semibold text-foreground mb-2">Follow-Up Visit</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar className="w-4 h-4 text-primary" />
              <span>23 May 2025</span>
            </div>
            <p className="text-muted-foreground">Window: 20 May – 26 May</p>
            <p className="text-muted-foreground">Protocol-001</p>
            <p className="text-muted-foreground">Apollo Hospital • Dr. Sharma</p>
          </div>
        </div>

        {/* Visited Date — auto-calculated, editable by PI/CRC */}
        <div>
          <label className="block font-medium text-foreground mb-1.5">Visited Date</label>
          <input
            type="date"
            value={visitedDate}
            onChange={(e) => setVisitedDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card text-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">Auto-filled from the scheduled date. Edit if the actual visit date differs.</p>
        </div>

        {/* Status Selector */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Status</h4>
          <div className="grid grid-cols-3 gap-2">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={cn(
                  "py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all relative",
                  selectedStatus === status.id
                    ? status.color + " text-foreground"
                    : "border-border text-muted-foreground bg-card"
                )}
              >
                {selectedStatus === status.id && (
                  <Check className="absolute top-1 right-1 w-4 h-4 text-info" />
                )}
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Tasks */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Clinical Tasks</h4>
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4 space-y-3">
            {Object.entries(clinicalTasks).map(([key, checked]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setClinicalTasks({ ...clinicalTasks, [key]: e.target.checked })}
                  className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
                />
                <span className={cn("text-foreground/80", checked && "text-accent")}>
                  {key === "vitals" && "Vital signs"}
                  {key === "blood" && "Blood draw"}
                  {key === "ecg" && "ECG"}
                  {key === "physical" && "Physical exam"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Admin Tasks */}
        <div>
          <h4 className="font-medium text-foreground mb-1">Admin Tasks</h4>
          <p className="text-xs text-muted-foreground mb-3">PI/CRC only</p>
          <div className="bg-card rounded-2xl border border-border shadow-xs p-4 space-y-3">
            {Object.entries(adminTasks).map(([key, checked]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setAdminTasks({ ...adminTasks, [key]: e.target.checked })}
                  className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
                />
                <span className={cn("text-foreground/80", checked && "text-accent")}>
                  {key === "ecrf" && "eCRF entry"}
                  {key === "consent" && "Informed consent"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Comments</label>
          <textarea
            rows={3}
            placeholder="Add notes about this visit..."
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none resize-none bg-card"
          />
        </div>

        {/* Update Button — part of the form, scrolls with the content */}
        <button
          onClick={onUpdate}
          className="w-full py-4 rounded-full font-semibold bg-primary text-white"
        >
          Update Visit Status
        </button>
      </div>
    </div>
  )
}
