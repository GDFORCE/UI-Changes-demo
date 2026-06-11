"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
  Bell,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Mail,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

interface SystemAlertsScreenProps {
  onBack?: () => void;
}

type Severity = "Critical" | "High" | "Medium";

interface Alert {
  id: string;
  type: string;
  description: string;
  affected: string;
  timestamp: string;
  severity: Severity;
}

const initialAlerts: Alert[] = [
  {
    id: "ALT-041",
    type: "AI extraction",
    description:
      "Protocol upload AI extraction failed — complex multi-column table layout not recognized by parser",
    affected: "CTRI/2024/003 · Oncology Phase II",
    timestamp: "05-Jun-2026 10:02 IST",
    severity: "High",
  },
  {
    id: "ALT-040",
    type: "OTP failure",
    description: "OTP delivery failed repeatedly — carrier DND block on recipient number",
    affected: "USR-0192 registration",
    timestamp: "05-Jun-2026 09:41 IST",
    severity: "Critical",
  },
  {
    id: "ALT-038",
    type: "Invite failure",
    description: "Trial sharing invitation bounced — recipient mailbox full",
    affected: "CTRI/2024/017 · site invite",
    timestamp: "05-Jun-2026 08:15 IST",
    severity: "Medium",
  },
  {
    id: "ALT-037",
    type: "Session anomaly",
    description: "Unusual session activity — same account active from 2 distant IPs within 5 min",
    affected: "USR-0044 · Sponsor",
    timestamp: "04-Jun-2026 23:50 IST",
    severity: "High",
  },
];

const resolvedHistory = [
  { id: "ALT-035", type: "AI extraction", resolvedAt: "04-Jun-2026 18:20 IST", note: "Re-triggered, extraction succeeded", outcome: "Admin-resolved" },
  { id: "ALT-033", type: "OTP failure", resolvedAt: "04-Jun-2026 12:05 IST", note: "Resent OTP via fallback gateway", outcome: "Auto-resolved" },
];

const tiles = [
  { label: "AI extraction failures", count: 1, icon: Cpu, color: "text-destructive", bg: "bg-destructive/5" },
  { label: "Invitation failures", count: 1, icon: Mail, color: "text-warning", bg: "bg-warning/10" },
  { label: "OTP delivery failures", count: 1, icon: KeyRound, color: "text-destructive", bg: "bg-destructive/5" },
  { label: "Session anomalies", count: 1, icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10" },
];

const severityColor: Record<Severity, string> = {
  Critical: "bg-destructive/10 text-destructive",
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/15 text-warning",
};

const dotColor: Record<Severity, string> = {
  Critical: "bg-destructive",
  High: "bg-destructive",
  Medium: "bg-warning",
};

export function SystemAlertsScreen({ onBack }: SystemAlertsScreenProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [historyOpen, setHistoryOpen] = useState(false);

  const hasHigh = alerts.some((a) => a.severity === "High" || a.severity === "Critical");

  const retryLabel = (type: string) =>
    type === "AI extraction"
      ? "Re-trigger extraction"
      : type === "OTP failure"
      ? "Resend OTP"
      : type === "Invite failure"
      ? "Resend invite"
      : "Retry";

  const handleRetry = (a: Alert) => toast.success(`${retryLabel(a.type)} — ${a.id}`);
  const handleNotify = (a: Alert) => toast.success(`User notified for ${a.id}`);
  const handleEscalate = (a: Alert) => toast.info(`${a.id} escalated to tech team`);
  const handleResolve = (a: Alert) => {
    setAlerts((prev) => prev.filter((x) => x.id !== a.id));
    toast.success(`${a.id} marked resolved`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div>
        <h1 className="text-xl font-bold text-primary">Active system alerts</h1>
        <p className="text-sm text-muted-foreground">Auto-generated when background processes fail · {alerts.length} active.</p>
      </div>

      <div className="space-y-6">
        {/* Summary tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiles.map(({ label, count, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-xl p-4 border border-border ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
              <div className="text-2xl font-bold text-primary mt-2 leading-none">{count}</div>
              <div className="text-xs text-muted-foreground mt-1.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Warning banner */}
        {hasHigh && (
          <div className="bg-destructive text-white px-3 py-2 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="text-xs font-medium">
              Active system alerts require admin attention. These do not auto-resolve.
            </span>
          </div>
        )}

        {/* Active alerts */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-primary">Active alerts</h2>
          {alerts.length === 0 && (
            <Card className="border border-success/20 shadow-sm">
              <CardContent className="p-4 flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">All clear — no active alerts</span>
              </CardContent>
            </Card>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {alerts.map((a) => (
            <Card key={a.id} className="border border-border shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${dotColor[a.severity]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">{a.id}</span>
                      <Badge className={`${severityColor[a.severity]} text-[10px]`}>{a.severity}</Badge>
                    </div>
                    <Badge variant="secondary" className="text-[10px] mt-1">{a.type}</Badge>
                    <p className="text-xs text-foreground/80 mt-1.5">{a.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {a.affected} · {a.timestamp}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Button size="sm" className="h-8 text-xs bg-primary" onClick={() => handleRetry(a)}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {retryLabel(a.type)}
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleNotify(a)}>
                    <Bell className="h-3 w-3 mr-1" />
                    Notify user
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs text-warning border-warning/20"
                    onClick={() => handleEscalate(a)}
                  >
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Escalate
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-success hover:bg-green-700"
                    onClick={() => handleResolve(a)}
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Resolve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>

        {/* Alert history (collapsed) */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-0">
            <button
              className="w-full flex items-center justify-between px-3 py-2"
              onClick={() => setHistoryOpen((v) => !v)}
            >
              <span className="text-sm font-semibold text-primary">Alert history</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground/70 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
            </button>
            {historyOpen &&
              resolvedHistory.map((h) => (
                <div key={h.id} className="px-3 py-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground/80">{h.id}</span>
                    <Badge variant="outline" className="text-[10px]">{h.outcome}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {h.type} · {h.resolvedAt}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{h.note}</p>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
