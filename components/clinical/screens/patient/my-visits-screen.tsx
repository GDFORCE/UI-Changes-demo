"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, User, Calendar, Clock, Phone, Home, Building2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { trials, visits } from "@/components/clinical/data/visits";

interface MyVisitsScreenProps {
  onBack?: () => void;
  onVisitClick?: (visitId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success/15 text-success";
    case "upcoming":
      return "bg-warning/15 text-warning";
    case "scheduled":
      return "bg-info/10 text-info";
    case "missed":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-foreground/80";
  }
};

const getVisitTypeIcon = (type: string) => {
  switch (type) {
    case "Hospital":
      return <Building2 className="h-4 w-4" />;
    case "Telephonic":
      return <Phone className="h-4 w-4" />;
    case "Home":
      return <Home className="h-4 w-4" />;
    default:
      return <Building2 className="h-4 w-4" />;
  }
};

export function MyVisitsScreen({ onBack, onVisitClick }: MyVisitsScreenProps) {
  // Open on the trial list first; the patient picks a trial to view its visits.
  const [selectedTrial, setSelectedTrial] = useState<string | null>(null);
  const trial = trials.find((t) => t.id === selectedTrial);
  const upcomingVisit = visits.find((v) => v.status === "upcoming");
  const completedVisits = visits.filter((v) => v.status === "completed").length;
  const totalVisits = visits.length;
  const completionPercent = totalVisits ? Math.round((completedVisits / totalVisits) * 100) : 0;

  if (!selectedTrial) {
    return (
      <div className="flex flex-col h-full bg-surface">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1">
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-lg font-semibold">My Visits</h1>
          </div>
        </div>

        {/* Trial List */}
        <div className="flex-1 overflow-auto p-4">
          <p className="text-sm text-muted-foreground mb-4">Select a trial to view your visits</p>
          <div className="space-y-3">
            {trials.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTrial(t.id)}
                className="w-full bg-card rounded-xl border border-border p-4 shadow-xs border border-border text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Protocol ID + Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <p className="text-[11px] text-muted-foreground/70">Protocol ID</p>
                        <span className="text-xs font-semibold text-info">{t.protocolId}</span>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full capitalize shrink-0",
                          t.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {t.status}
                      </span>
                    </div>

                    {/* Study Title (public title) */}
                    <div className="mb-2">
                      <p className="text-[11px] text-muted-foreground/70">Study Title</p>
                      <h3 className="font-semibold text-foreground text-sm leading-snug">{t.studyTitle}</h3>
                    </div>

                    {/* Indication + Phase */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-[11px] text-muted-foreground/70">Indication</p>
                        <p className="text-xs font-medium text-foreground">{t.diseaseIndication}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground/70">Phase</p>
                        <p className="text-xs font-medium text-foreground">{t.phase}</p>
                      </div>
                    </div>

                    {/* Site Name + PI Name */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                      <div>
                        <p className="text-[11px] text-muted-foreground/70">Site Name</p>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                          <span className="truncate">{t.hospitalName}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground/70">PI Name</p>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <User className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                          <span className="truncate">{t.piName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/70 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedTrial(null)} className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">My Visits</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Panel 1: Trial Details */}
        <div className="bg-card m-4 rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-secondary px-4 py-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-primary">Trial Details</h2>
            {trial?.status && (
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full capitalize",
                  trial.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                )}
              >
                {trial.status}
              </span>
            )}
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Protocol ID</p>
                <p className="font-medium text-foreground">{trial?.protocolId}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Phase</p>
                <p className="font-medium text-foreground">{trial?.phase}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Disease/Indication</p>
                <p className="font-medium text-foreground">{trial?.diseaseIndication}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Drug Name</p>
                <p className="font-medium text-foreground">{trial?.drugName}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Study Title</p>
              <p className="font-medium text-foreground text-sm">{trial?.studyTitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Site Name</p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                  <span className="font-medium text-foreground">{trial?.hospitalName}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">PI Name</p>
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                  <span className="font-medium text-foreground">{trial?.piName}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Department</p>
              <p className="font-medium text-foreground text-sm">{trial?.department}</p>
            </div>
          </div>
        </div>

        {/* Visit Status Bar */}
        <div className="bg-card mx-4 mb-4 rounded-xl shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground">Visit Completion</p>
            <span className="text-sm font-medium text-accent">{completionPercent}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-info transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {completedVisits} of {totalVisits} visits complete ({completionPercent}%)
          </p>
        </div>

        {/* Panel 2: Upcoming Visit */}
        {upcomingVisit && (
          <div className="bg-card mx-4 mb-4 rounded-xl shadow-sm border border-warning/20 overflow-hidden">
            <div className="bg-warning/10 px-4 py-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              <h2 className="text-sm font-semibold text-warning">Upcoming Visit</h2>
            </div>
            <button
              onClick={() => onVisitClick?.(upcomingVisit.id)}
              className="w-full p-4 text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{upcomingVisit.visitNumber}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", getStatusColor(upcomingVisit.status))}>
                      {upcomingVisit.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80">{upcomingVisit.visitName}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {getVisitTypeIcon(upcomingVisit.visitType)}
                  <span>{upcomingVisit.visitType}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-foreground/80">{upcomingVisit.scheduledDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-foreground/80">{upcomingVisit.scheduledTime}</span>
                </div>
              </div>
              <div className="bg-info/5 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Visit Window</p>
                <p className="text-sm font-medium text-primary">{upcomingVisit.visitWindow}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Protocol ID</p>
                  <p className="font-medium text-foreground">{trial?.protocolId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phase</p>
                  <p className="font-medium text-foreground">{trial?.phase}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Indication</p>
                  <p className="font-medium text-foreground">{trial?.diseaseIndication}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Site Name</p>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                    <span className="font-medium text-foreground">{trial?.hospitalName}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">PI Name</p>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                    <span className="font-medium text-foreground">{trial?.piName}</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Panel 3: All Visits */}
        <div className="bg-card mx-4 mb-4 rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-secondary px-4 py-2">
            <h2 className="text-sm font-semibold text-primary">All Visits</h2>
          </div>
          <div className="divide-y divide-border">
            {visits.map((visit) => (
              <button
                key={visit.id}
                onClick={() => onVisitClick?.(visit.id)}
                className="w-full p-4 text-left hover:bg-surface transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground text-sm">{visit.visitNumber}</span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", getStatusColor(visit.status))}>
                        {visit.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{visit.visitName}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-1.5">
                      <div className="flex items-center gap-1">
                        {getVisitTypeIcon(visit.visitType)}
                        <span>{visit.visitType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{visit.scheduledDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{visit.scheduledTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-muted-foreground/70">Window Period:</span>
                      <span className="font-medium text-foreground/80">{visit.visitWindow}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/70" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
