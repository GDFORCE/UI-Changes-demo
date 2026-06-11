"use client";

import { useState } from "react";
import { ChevronLeft, Clock, Check, X, Bell, AlertCircle, ChevronRight, Pill, Calendar } from "lucide-react";
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

export function MedicationReminderScreen({ onBack }: MedicationReminderScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [logs, setLogs] = useState<MedicationLog[]>(todayLogs);
  const [showActionSheet, setShowActionSheet] = useState<string | null>(null);

  const updateMedicationStatus = (logId: string, status: MedicationLog["status"]) => {
    setLogs(logs.map((log) =>
      log.id === logId
        ? { ...log, status, actualTime: status === "taken" ? new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : undefined }
        : log
    ));
    setShowActionSheet(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "taken":
        return "bg-success/15 text-success";
      case "not_taken":
        return "bg-destructive/10 text-destructive";
      case "skipped":
        return "bg-warning/15 text-warning";
      case "pending":
        return "bg-info/10 text-info";
      case "remind_later":
        return "bg-muted text-foreground/80";
      default:
        return "bg-muted text-foreground/80";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return <Check className="h-4 w-4" />;
      case "not_taken":
        return <X className="h-4 w-4" />;
      case "skipped":
        return <X className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "remind_later":
        return <Bell className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const pendingCount = logs.filter((l) => l.status === "pending").length;
  const takenCount = logs.filter((l) => l.status === "taken").length;

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
          <h1 className="text-lg font-semibold">Medication Reminder</h1>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-card mx-4 mt-4 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Today&apos;s Progress</p>
            <p className="text-2xl font-bold text-primary">{takenCount}/{logs.length}</p>
            <p className="text-xs text-muted-foreground">medications taken</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="var(--border)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="var(--accent)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${(takenCount / logs.length) * 175.9} 175.9`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-accent">
                {Math.round((takenCount / logs.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
        {pendingCount > 0 && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <p className="text-sm text-warning">{pendingCount} medication{pendingCount > 1 ? "s" : ""} pending</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-card mx-4 mt-4 rounded-xl p-1 shadow-sm">
        {(["today", "schedule", "history"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors capitalize",
              activeTab === tab
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-surface"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "today" && (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-card rounded-xl border border-border shadow-xs overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        log.status === "pending" ? "bg-info/10" : log.status === "taken" ? "bg-success/15" : "bg-muted"
                      )}>
                        <Pill className={cn(
                          "h-5 w-5",
                          log.status === "pending" ? "text-info" : log.status === "taken" ? "text-success" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{log.medicationName}</h3>
                        <p className="text-sm text-muted-foreground">{log.dosage}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground/70" />
                          <span className="text-xs text-muted-foreground">{log.scheduledTime}</span>
                          {log.actualTime && (
                            <>
                              <span className="text-xs text-muted-foreground/70">|</span>
                              <span className="text-xs text-success">Taken at {log.actualTime}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full flex items-center gap-1 capitalize",
                      getStatusColor(log.status)
                    )}>
                      {getStatusIcon(log.status)}
                      {log.status.replace("_", " ")}
                    </span>
                  </div>

                  {log.status === "pending" && (
                    <div className="mt-4 pt-3 border-t border-border flex gap-2">
                      <button
                        onClick={() => updateMedicationStatus(log.id, "taken")}
                        className="flex-1 py-2 bg-success text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Taken
                      </button>
                      <button
                        onClick={() => setShowActionSheet(log.id)}
                        className="flex-1 py-2 bg-muted text-foreground/80 rounded-lg text-sm font-medium"
                      >
                        Other
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Sheet */}
                {showActionSheet === log.id && (
                  <div className="border-t border-border bg-surface p-3">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => updateMedicationStatus(log.id, "not_taken")}
                        className="py-2 px-3 bg-card border border-border rounded-lg text-xs text-destructive"
                      >
                        Not Taken
                      </button>
                      <button
                        onClick={() => updateMedicationStatus(log.id, "skipped")}
                        className="py-2 px-3 bg-card border border-border rounded-lg text-xs text-warning"
                      >
                        Skipped
                      </button>
                      <button
                        onClick={() => updateMedicationStatus(log.id, "remind_later")}
                        className="py-2 px-3 bg-card border border-border rounded-lg text-xs text-muted-foreground"
                      >
                        Remind Later
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="bg-card rounded-xl border border-border shadow-xs p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{med.name}</h3>
                    <p className="text-sm text-muted-foreground">{med.dosage} - {med.route}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/70" />
                </div>
                
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Frequency</p>
                    <p className="text-foreground">{med.frequency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Scheduled Times</p>
                    <p className="text-foreground">{med.scheduledTimes.join(", ")}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-muted-foreground text-xs mb-1">Instructions</p>
                  <p className="text-sm text-foreground/80">{med.instructions}</p>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{med.startDate} - {med.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {/* Group by date */}
            {["2024-02-19", "2024-02-18"].map((date) => (
              <div key={date}>
                <p className="text-sm font-medium text-muted-foreground mb-2">{date}</p>
                <div className="space-y-2">
                  {historyLogs
                    .filter((log) => log.date === date)
                    .map((log) => (
                      <div key={log.id} className="bg-card rounded-xl border border-border shadow-xs p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              getStatusColor(log.status)
                            )}>
                              {getStatusIcon(log.status)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{log.medicationName}</p>
                              <p className="text-xs text-muted-foreground">{log.dosage} - {log.scheduledTime}</p>
                            </div>
                          </div>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full capitalize",
                            getStatusColor(log.status)
                          )}>
                            {log.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
