"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  X,
  Bell,
  Pill,
  Calendar,
  Sunrise,
  Moon,
  Flame,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicationReminderScreenProps {
  onBack?: () => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  scheduledTimes: string[];
  instructions: string;
  startDate: string;
  endDate: string;
}

interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  status: "taken" | "not_taken" | "skipped" | "pending" | "remind_later";
  actualTime?: string;
  date: string;
}

const medications: Medication[] = [
  {
    id: "med-1",
    name: "Pembrolizumab",
    dosage: "200mg",
    route: "Oral",
    frequency: "Once daily",
    scheduledTimes: ["08:00 AM"],
    instructions: "Take with food. Do not crush or chew.",
    startDate: "2024-01-15",
    endDate: "2024-06-15",
  },
  {
    id: "med-2",
    name: "Novel Agent XY-123",
    dosage: "50mg",
    route: "Oral",
    frequency: "Twice daily",
    scheduledTimes: ["08:00 AM", "08:00 PM"],
    instructions: "Take 30 minutes before meals.",
    startDate: "2024-01-15",
    endDate: "2024-06-15",
  },
  {
    id: "med-3",
    name: "Ondansetron",
    dosage: "8mg",
    route: "Oral",
    frequency: "As needed",
    scheduledTimes: ["As needed"],
    instructions: "Take for nausea as needed. Maximum 3 times per day.",
    startDate: "2024-01-15",
    endDate: "2024-06-15",
  },
];

const todayLogs: MedicationLog[] = [
  {
    id: "log-1",
    medicationId: "med-1",
    medicationName: "Pembrolizumab",
    dosage: "200mg",
    scheduledTime: "08:00 AM",
    status: "taken",
    actualTime: "08:05 AM",
    date: "2024-02-20",
  },
  {
    id: "log-2",
    medicationId: "med-2",
    medicationName: "Novel Agent XY-123",
    dosage: "50mg",
    scheduledTime: "08:00 AM",
    status: "taken",
    actualTime: "08:10 AM",
    date: "2024-02-20",
  },
  {
    id: "log-3",
    medicationId: "med-2",
    medicationName: "Novel Agent XY-123",
    dosage: "50mg",
    scheduledTime: "08:00 PM",
    status: "pending",
    date: "2024-02-20",
  },
];

const historyLogs: MedicationLog[] = [
  {
    id: "log-h1",
    medicationId: "med-1",
    medicationName: "Pembrolizumab",
    dosage: "200mg",
    scheduledTime: "08:00 AM",
    status: "taken",
    actualTime: "08:15 AM",
    date: "2024-02-19",
  },
  {
    id: "log-h2",
    medicationId: "med-2",
    medicationName: "Novel Agent XY-123",
    dosage: "50mg",
    scheduledTime: "08:00 AM",
    status: "taken",
    actualTime: "07:55 AM",
    date: "2024-02-19",
  },
  {
    id: "log-h3",
    medicationId: "med-2",
    medicationName: "Novel Agent XY-123",
    dosage: "50mg",
    scheduledTime: "08:00 PM",
    status: "skipped",
    date: "2024-02-19",
  },
  {
    id: "log-h4",
    medicationId: "med-1",
    medicationName: "Pembrolizumab",
    dosage: "200mg",
    scheduledTime: "08:00 AM",
    status: "taken",
    actualTime: "08:00 AM",
    date: "2024-02-18",
  },
];

type Tab = "today" | "schedule" | "history";

const STATUS_META: Record<
  MedicationLog["status"],
  { label: string; chip: string; dot: string; icon: typeof Check }
> = {
  taken: { label: "Taken", chip: "bg-success/15 text-success", dot: "bg-success", icon: Check },
  not_taken: { label: "Not taken", chip: "bg-destructive/12 text-destructive", dot: "bg-destructive", icon: X },
  skipped: { label: "Skipped", chip: "bg-warning/15 text-warning", dot: "bg-warning", icon: X },
  pending: { label: "Pending", chip: "bg-info/12 text-info", dot: "bg-info", icon: Clock },
  remind_later: { label: "Remind later", chip: "bg-muted text-foreground/70", dot: "bg-foreground/40", icon: Bell },
};

// A day's rounds split into the sunrise → night arc the patient actually lives.
const DAYPARTS = [
  { key: "morning", label: "Morning round", icon: Sunrise, match: (t: string) => t.includes("AM") },
  { key: "evening", label: "Evening round", icon: Moon, match: (t: string) => t.includes("PM") || t === "As needed" },
];

export function MedicationReminderScreen({ onBack }: MedicationReminderScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [logs, setLogs] = useState<MedicationLog[]>(todayLogs);
  const [showActionSheet, setShowActionSheet] = useState<string | null>(null);

  const updateMedicationStatus = (logId: string, status: MedicationLog["status"]) => {
    setLogs(
      logs.map((log) =>
        log.id === logId
          ? {
              ...log,
              status,
              actualTime:
                status === "taken"
                  ? new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                  : undefined,
            }
          : log
      )
    );
    setShowActionSheet(null);
  };

  const pendingCount = logs.filter((l) => l.status === "pending").length;
  const takenCount = logs.filter((l) => l.status === "taken").length;
  const pct = logs.length ? Math.round((takenCount / logs.length) * 100) : 0;
  const nextDose = logs.find((l) => l.status === "pending");
  const sheetLog = logs.find((l) => l.id === showActionSheet);
  const streak = 12; // consecutive days fully adhered

  return (
    <div className="relative flex flex-col h-full bg-surface">
      {/* ── App bar ── */}
      <header className="bg-primary-deep text-primary-foreground px-4 pt-3.5 pb-4 dawn-ambient">
        <div className="relative flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back"
              className="p-1.5 -ml-1.5 rounded-full springy active:scale-90 hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex-1">
            <p className="eyebrow text-primary-foreground/55">Today&apos;s rounds</p>
            <h1 className="display-serif text-lg leading-tight">Medication Reminder</h1>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 backdrop-blur-sm">
            <Flame className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono text-xs tabular-nums">{streak}d</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {/* ── Hero: the next dose, framed as the brand gesture ── */}
        <div className="px-4 pt-4">
          {nextDose ? (
            <div
              className="dawn-gradient hero-glow paper-grain animate-rise rounded-3xl p-5 text-primary-foreground shadow-md"
              style={{ animationDelay: "40ms" }}
            >
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
                    <p className="eyebrow text-white/80">Next dose · due now</p>
                  </div>
                  <h2 className="font-heading text-2xl leading-tight mt-1">{nextDose.medicationName}</h2>
                  <div className="mt-1 flex items-center gap-2 text-sm text-white/85">
                    <span className="font-medium">{nextDose.dosage}</span>
                    <span className="h-1 w-1 rounded-full bg-white/50" />
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {nextDose.scheduledTime}
                    </span>
                  </div>
                </div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <Pill className="h-6 w-6" />
                </div>
              </div>

              <div className="relative mt-4 flex gap-2.5">
                <button
                  onClick={() => updateMedicationStatus(nextDose.id, "taken")}
                  className="springy flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-primary shadow-sm active:scale-[0.97]"
                >
                  <Check className="h-4 w-4" />
                  I took it
                </button>
                <button
                  onClick={() => setShowActionSheet(nextDose.id)}
                  className="springy rounded-xl bg-white/15 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm active:scale-[0.97]"
                >
                  Not now
                </button>
              </div>
            </div>
          ) : (
            <div
              className="animate-rise rounded-3xl border border-success/25 bg-success/8 p-5 text-center shadow-xs"
              style={{ animationDelay: "40ms" }}
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/15">
                <Sparkles className="h-6 w-6 text-success" />
              </div>
              <h2 className="font-heading text-lg text-foreground mt-2">All doses logged</h2>
              <p className="text-sm text-muted-foreground">You&apos;re fully caught up for today. Nicely done.</p>
            </div>
          )}
        </div>

        {/* ── Adherence band: the day as a row of dose pills ── */}
        <div className="px-4 pt-4">
          <div
            className="animate-rise rounded-2xl border border-border bg-card p-4 shadow-xs"
            style={{ animationDelay: "110ms" }}
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow text-muted-foreground">Today&apos;s adherence</p>
                <p className="font-heading text-3xl text-foreground leading-none mt-1 tabular-nums">
                  {takenCount}
                  <span className="text-lg text-muted-foreground">/{logs.length}</span>
                </p>
              </div>
              <span className="font-mono text-sm tabular-nums text-accent">{pct}%</span>
            </div>
            {/* dose pills */}
            <div className="mt-3 flex items-center gap-1.5">
              {logs.map((log) => (
                <span
                  key={log.id}
                  title={`${log.medicationName} · ${STATUS_META[log.status].label}`}
                  className={cn(
                    "h-2.5 flex-1 rounded-full transition-colors",
                    log.status === "taken"
                      ? "bg-success"
                      : log.status === "pending"
                        ? "bg-border"
                        : STATUS_META[log.status].dot
                  )}
                />
              ))}
            </div>
            {pendingCount > 0 && (
              <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Bell className="h-3.5 w-3.5 text-warning" />
                {pendingCount} dose{pendingCount > 1 ? "s" : ""} still waiting on you
              </p>
            )}
          </div>
        </div>

        {/* ── Segmented tabs ── */}
        <div className="px-4 pt-4">
          <div className="flex rounded-full bg-muted p-1">
            {(["today", "schedule", "history"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 rounded-full py-2 text-sm font-medium capitalize transition-all",
                  activeTab === tab
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-4">
          {activeTab === "today" && (
            <div className="space-y-5">
              {DAYPARTS.map((part) => {
                const partLogs = logs.filter((l) => part.match(l.scheduledTime));
                if (partLogs.length === 0) return null;
                const PartIcon = part.icon;
                return (
                  <div key={part.key}>
                    <div className="mb-2 flex items-center gap-2">
                      <PartIcon className="h-4 w-4 text-accent" />
                      <h3 className="font-heading text-sm text-foreground">{part.label}</h3>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    {/* vertical dosing rail */}
                    <div className="relative space-y-2.5 pl-5">
                      <span className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />
                      {partLogs.map((log) => {
                        const meta = STATUS_META[log.status];
                        const StatusIcon = meta.icon;
                        return (
                          <div key={log.id} className="relative">
                            <span
                              className={cn(
                                "absolute -left-5 top-4 h-[11px] w-[11px] rounded-full ring-4 ring-surface",
                                log.status === "pending" ? "bg-info animate-pulse-soft" : meta.dot
                              )}
                            />
                            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div
                                    className={cn(
                                      "grid h-10 w-10 shrink-0 place-items-center rounded-full",
                                      log.status === "pending"
                                        ? "bg-info/12"
                                        : log.status === "taken"
                                          ? "bg-success/15"
                                          : "bg-muted"
                                    )}
                                  >
                                    <Pill
                                      className={cn(
                                        "h-5 w-5",
                                        log.status === "pending"
                                          ? "text-info"
                                          : log.status === "taken"
                                            ? "text-success"
                                            : "text-muted-foreground"
                                      )}
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-foreground">{log.medicationName}</h4>
                                    <p className="text-sm text-muted-foreground">{log.dosage}</p>
                                    <div className="mt-1 flex items-center gap-2 text-xs">
                                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {log.scheduledTime}
                                      </span>
                                      {log.actualTime && (
                                        <span className="text-success">· logged {log.actualTime}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium",
                                    meta.chip
                                  )}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {meta.label}
                                </span>
                              </div>

                              {log.status === "pending" && (
                                <div className="mt-3 flex gap-2 border-t border-border pt-3">
                                  <button
                                    onClick={() => updateMedicationStatus(log.id, "taken")}
                                    className="springy flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-success py-2.5 text-sm font-semibold text-success-foreground active:scale-[0.97]"
                                  >
                                    <Check className="h-4 w-4" />
                                    Taken
                                  </button>
                                  <button
                                    onClick={() => setShowActionSheet(log.id)}
                                    className="springy rounded-xl bg-muted px-4 py-2.5 text-sm font-medium text-foreground/80 active:scale-[0.97]"
                                  >
                                    Other
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-3">
              {medications.map((med) => {
                const asNeeded = med.frequency === "As needed";
                return (
                  <div key={med.id} className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary/60">
                          <Pill className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{med.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {med.dosage} · {med.route}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/60" />
                    </div>

                    {/* schedule chips */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-medium",
                          asNeeded ? "bg-warning/12 text-warning" : "bg-info/10 text-info"
                        )}
                      >
                        {med.frequency}
                      </span>
                      {med.scheduledTimes.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] text-foreground/70"
                        >
                          <Clock className="h-3 w-3" />
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="mt-3 rounded-xl bg-surface px-3 py-2 text-sm text-foreground/75">
                      {med.instructions}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span className="tabular-nums">
                        {med.startDate} → {med.endDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-5">
              {["2024-02-19", "2024-02-18"].map((date) => {
                const dayLogs = historyLogs.filter((l) => l.date === date);
                const dayTaken = dayLogs.filter((l) => l.status === "taken").length;
                return (
                  <div key={date}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{date}</p>
                      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                        {dayTaken}/{dayLogs.length} taken
                      </span>
                    </div>
                    <div className="space-y-2">
                      {dayLogs.map((log) => {
                        const meta = STATUS_META[log.status];
                        const StatusIcon = meta.icon;
                        return (
                          <div
                            key={log.id}
                            className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-xs"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "grid h-8 w-8 place-items-center rounded-full",
                                  meta.chip
                                )}
                              >
                                <StatusIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{log.medicationName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {log.dosage} · {log.scheduledTime}
                                  {log.actualTime ? ` · ${log.actualTime}` : ""}
                                </p>
                              </div>
                            </div>
                            <span className={cn("rounded-full px-2 py-1 text-[11px] font-medium", meta.chip)}>
                              {meta.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Slide-up action sheet ── */}
      {sheetLog && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end">
          <button
            aria-label="Dismiss"
            onClick={() => setShowActionSheet(null)}
            className="animate-fade-in absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
          />
          <div className="animate-rise relative rounded-t-3xl border-t border-border bg-card p-5 pb-6 shadow-xl">
            <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-border" />
            <p className="eyebrow text-muted-foreground">Log this dose</p>
            <h3 className="font-heading text-lg text-foreground">{sheetLog.medicationName}</h3>
            <p className="text-sm text-muted-foreground">
              {sheetLog.dosage} · {sheetLog.scheduledTime}
            </p>

            <div className="mt-4 space-y-2">
              {(
                [
                  { status: "not_taken", label: "Not taken", desc: "Missed this dose", tone: "text-destructive", bg: "bg-destructive/10", icon: X },
                  { status: "skipped", label: "Skipped", desc: "Chose to skip per guidance", tone: "text-warning", bg: "bg-warning/12", icon: X },
                  { status: "remind_later", label: "Remind me later", desc: "Nudge again in 30 minutes", tone: "text-info", bg: "bg-info/10", icon: Bell },
                ] as const
              ).map((opt) => {
                const OptIcon = opt.icon;
                return (
                  <button
                    key={opt.status}
                    onClick={() => updateMedicationStatus(sheetLog.id, opt.status)}
                    className="springy flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left active:scale-[0.98]"
                  >
                    <span className={cn("grid h-9 w-9 place-items-center rounded-full", opt.bg, opt.tone)}>
                      <OptIcon className="h-4 w-4" />
                    </span>
                    <span className="flex-1">
                      <span className={cn("block text-sm font-semibold", opt.tone)}>{opt.label}</span>
                      <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowActionSheet(null)}
              className="mt-3 w-full rounded-2xl py-3 text-sm font-medium text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
