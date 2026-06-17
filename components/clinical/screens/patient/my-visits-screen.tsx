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

/** Solid status rail colour for a visit card edge. */
const statusRail = (status: string) =>
  status === "completed" ? "bg-success"
    : status === "upcoming" ? "bg-warning"
    : status === "missed" ? "bg-destructive"
    : "bg-info"

/** Dawn sub-screen header, consistent with the rest of the patient flow. */
function Header({ eyebrow, onBack }: { eyebrow: string; onBack?: () => void }) {
  return (
    <div className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
      <div className="relative flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} aria-label="Back" className="springy p-1.5 -ml-1.5 rounded-full active:scale-90 hover:bg-white/10">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <p className="eyebrow text-primary-foreground/55">{eyebrow}</p>
          <h1 className="display-serif text-lg leading-tight">My Visits</h1>
        </div>
      </div>
    </div>
  )
}

export function MyVisitsScreen({ onBack, onVisitClick }: MyVisitsScreenProps) {
  const [selectedTrial, setSelectedTrial] = useState<string | null>(null)
  const trial = trials.find((t) => t.id === selectedTrial)
  const trialVisits = visits.filter((v) => v.trialId === selectedTrial)
  const completedVisits = trialVisits.filter((v) => v.status === "completed").length
  const totalVisits = trialVisits.length
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

  // ── Selected trial — visit-focused ─────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background">
      <Header eyebrow={trial?.protocolId ?? "Your trial"} onBack={() => setSelectedTrial(null)} />

      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-4 space-y-4">
        {/* Slim trial hero — context + completion in one dawn gesture */}
        <div className="dawn-gradient hero-glow paper-grain rounded-3xl p-5 text-primary-foreground shadow-md animate-rise" style={{ animationDelay: "40ms" }}>
          <div className="relative flex items-center justify-between gap-2">
            <span className="font-mono text-xs tabular-nums rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-sm">{trial?.protocolId}</span>
            {trial?.status && (
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold capitalize backdrop-blur-sm">{trial.status}</span>
            )}
          </div>
          <h2 className="relative mt-3 font-heading text-lg leading-snug">{trial?.studyTitle}</h2>
          <div className="relative mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" /> {trial?.hospitalName}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
              <User className="h-3.5 w-3.5" /> {trial?.piName}
            </span>
          </div>
          {totalVisits > 0 && (
            <div className="relative mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-white/85">
                <span>{completedVisits} of {totalVisits} visits complete</span>
                <span className="font-mono tabular-nums">{completionPercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white animate-fill-bar" style={{ width: `${completionPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Visits — the heart of this screen */}
        <div className="animate-rise" style={{ animationDelay: "110ms" }}>
          <p className="eyebrow text-muted-foreground mb-2.5 px-1">All visits</p>
          {trialVisits.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
              <Calendar className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground/70">No visits recorded for this trial yet.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {trialVisits.map((visit) => (
                <button
                  key={visit.id}
                  onClick={() => onVisitClick?.(visit.id)}
                  className={cn(
                    "springy relative w-full overflow-hidden rounded-2xl border bg-card p-3.5 text-left shadow-xs active:scale-[0.99]",
                    visit.status === "upcoming" ? "border-warning/40 bg-warning/5" : "border-border"
                  )}
                >
                  <span className={cn("absolute left-0 top-0 bottom-0 w-1.5", statusRail(visit.status))} />
                  <div className="flex items-center gap-3 pl-1">
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
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
