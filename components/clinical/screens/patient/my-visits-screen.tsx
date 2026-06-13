"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, MapPin, User, Calendar, Clock, Phone, Home, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { trials, visits, formatVisitDate } from "@/components/clinical/data/visits"

interface MyVisitsScreenProps {
  onBack?: () => void
  onVisitClick?: (visitId: string) => void
}

const statusBadge = (status: string) => {
  switch (status) {
    case "completed": return "bg-success/15 text-success"
    case "upcoming": return "bg-warning/15 text-warning"
    case "scheduled": return "bg-info/10 text-info"
    case "missed": return "bg-destructive/10 text-destructive"
    default: return "bg-muted text-muted-foreground"
  }
}

function VisitTypeIcon({ type, className }: { type: string; className?: string }) {
  const Icon = type === "Telephonic" ? Phone : type === "Home" ? Home : Building2
  return <Icon className={className} />
}

/** Plum sub-screen header, consistent with the rest of the patient flow. */
function Header({ eyebrow, onBack }: { eyebrow: string; onBack?: () => void }) {
  return (
    <div className="bg-primary-deep text-primary-foreground px-4 py-3.5">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} aria-label="Back" className="p-1 -ml-1 transition-colors hover:text-primary-foreground/70">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          <p className="eyebrow text-primary-foreground/60">{eyebrow}</p>
          <h1 className="display-serif text-lg leading-tight">My Visits</h1>
        </div>
      </div>
    </div>
  )
}

export function MyVisitsScreen({ onBack, onVisitClick }: MyVisitsScreenProps) {
  const [selectedTrial, setSelectedTrial] = useState<string | null>(null)
  const trial = trials.find((t) => t.id === selectedTrial)
  const upcomingVisit = visits.find((v) => v.status === "upcoming")
  const completedVisits = visits.filter((v) => v.status === "completed").length
  const totalVisits = visits.length
  const completionPercent = totalVisits ? Math.round((completedVisits / totalVisits) * 100) : 0

  // ── Trial picker ───────────────────────────────────────────────────────
  if (!selectedTrial) {
    return (
      <div className="flex flex-col h-full bg-background">
        <Header eyebrow="Your trials" onBack={onBack} />
        <div className="flex-1 overflow-auto px-4 py-4 paper-grain">
          <p className="eyebrow text-muted-foreground/60 mb-3 animate-rise">Select a trial to view your visits</p>
          <div className="space-y-3">
            {trials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setSelectedTrial(t.id)}
                className="group w-full text-left animate-rise"
                style={{ animationDelay: `${80 + i * 80}ms` }}
              >
                <div className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/30 group-active:scale-[0.99]">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-semibold text-primary bg-secondary/50 px-2.5 py-1 rounded-full">{t.protocolId}</span>
                    <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize", t.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                      {t.status}
                    </span>
                  </div>
                  <p className="eyebrow text-muted-foreground/60 mb-1">Study Title</p>
                  <h3 className="font-heading text-[16px] text-foreground leading-snug mb-4">{t.studyTitle}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="eyebrow text-muted-foreground/60">Indication</p>
                      <p className="text-sm text-foreground font-medium mt-0.5">{t.diseaseIndication}</p>
                    </div>
                    <div>
                      <p className="eyebrow text-muted-foreground/60">Phase</p>
                      <p className="text-sm text-foreground font-medium mt-0.5">{t.phase}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                      <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="truncate">{t.hospitalName}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-accent shrink-0">
                      View <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Selected trial ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background">
      <Header eyebrow={trial?.protocolId ?? "Your trial"} onBack={() => setSelectedTrial(null)} />

      <div className="flex-1 overflow-auto px-4 py-4 space-y-4 paper-grain">
        {/* Trial details */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-rise" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="eyebrow text-primary">Trial Details</p>
            {trial?.status && (
              <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize", trial.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                {trial.status}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
            {[
              { k: "Protocol ID", v: trial?.protocolId },
              { k: "Phase", v: trial?.phase },
              { k: "Disease / Indication", v: trial?.diseaseIndication },
              { k: "Drug Name", v: trial?.drugName },
            ].map((f) => (
              <div key={f.k}>
                <p className="eyebrow text-muted-foreground/60">{f.k}</p>
                <p className="text-sm text-foreground font-medium mt-0.5">{f.v}</p>
              </div>
            ))}
            <div className="col-span-2">
              <p className="eyebrow text-muted-foreground/60">Study Title</p>
              <p className="text-sm text-foreground font-medium mt-0.5">{trial?.studyTitle}</p>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-x-3 pt-3.5 border-t border-border">
              <div>
                <p className="eyebrow text-muted-foreground/60">Site Name</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-accent shrink-0" />
                  <span className="text-sm text-foreground font-medium">{trial?.hospitalName}</span>
                </div>
              </div>
              <div>
                <p className="eyebrow text-muted-foreground/60">PI Name</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-accent shrink-0" />
                  <span className="text-sm text-foreground font-medium">{trial?.piName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit completion — dawn bar */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-rise" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between mb-2.5">
            <p className="eyebrow text-primary">Visit Completion</p>
            <span className="font-heading text-lg text-foreground tabular-nums leading-none">{completionPercent}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full dawn-gradient animate-fill-bar" style={{ width: `${completionPercent}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{completedVisits} of {totalVisits} visits complete</p>
        </div>

        {/* Upcoming visit — feature card */}
        {upcomingVisit && (
          <button onClick={() => onVisitClick?.(upcomingVisit.id)} className="group block w-full text-left animate-rise" style={{ animationDelay: "180ms" }}>
            <div className="dawn-ambient relative overflow-hidden rounded-3xl border border-warning/25 bg-card p-5 shadow-sm transition-all group-hover:shadow-md group-active:scale-[0.99]">
              <div className="relative flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl dawn-gradient text-primary-foreground shadow-sm">
                    <VisitTypeIcon type={upcomingVisit.visitType} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="eyebrow text-accent">Upcoming Visit</p>
                    <p className="font-heading text-[17px] text-foreground leading-tight">{upcomingVisit.visitNumber}</p>
                  </div>
                </div>
                <span className={cn("shrink-0 px-3 py-1 rounded-full text-xs font-semibold capitalize", statusBadge(upcomingVisit.status))}>
                  {upcomingVisit.status}
                </span>
              </div>

              <p className="relative text-sm text-foreground font-medium mb-3">{upcomingVisit.visitName}</p>

              <div className="relative grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <Calendar className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                  {formatVisitDate(upcomingVisit.scheduledDate)}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <Clock className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                  {upcomingVisit.scheduledTime}
                </div>
              </div>

              <div className="relative rounded-2xl bg-secondary/40 px-3.5 py-2.5">
                <p className="eyebrow text-muted-foreground/60">Visit Window</p>
                <p className="text-sm font-semibold text-primary mt-0.5">{upcomingVisit.visitWindow}</p>
              </div>

              <div className="relative flex items-center justify-end pt-3.5">
                <span className="flex items-center gap-1 text-sm font-medium text-accent">
                  View Details <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </button>
        )}

        {/* All visits */}
        <div className="animate-rise" style={{ animationDelay: "240ms" }}>
          <p className="eyebrow text-primary mb-2.5 px-1">All Visits</p>
          <div className="rounded-3xl border border-border bg-card divide-y divide-border shadow-sm overflow-hidden">
            {visits.map((visit) => (
              <button
                key={visit.id}
                onClick={() => onVisitClick?.(visit.id)}
                className="group w-full p-4 text-left transition-colors hover:bg-surface flex items-center gap-3"
              >
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", statusBadge(visit.status))}>
                  <VisitTypeIcon type={visit.visitType} className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{visit.visitNumber}</p>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize", statusBadge(visit.status))}>
                      {visit.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{visit.visitName}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground/80">
                    <span className="flex items-center gap-1"><VisitTypeIcon type={visit.visitType} className="h-3 w-3" />{visit.visitType}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatVisitDate(visit.scheduledDate)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{visit.scheduledTime}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
