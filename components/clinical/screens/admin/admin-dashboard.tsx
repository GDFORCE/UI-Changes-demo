"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FlaskConical,
  CheckCircle,
  AlertTriangle,
  Bell,
  RefreshCw,
  Download,
  ChevronRight,
  Clock,
  ArrowRight,
  Lock,
  Building2,
  ShieldAlert,
  ScrollText,
} from "lucide-react";

interface AdminDashboardProps {
  onNavigate?: (screen: string) => void;
}

type Urgency = "red" | "amber" | "green" | "blue";

// ── ADM-01 §2 Summary tiles (5) ──────────────────────────────────────
const summaryTiles: {
  key: string;
  label: string;
  icon: typeof Users;
  count: string;
  sub: string;
  trend: string;
  urgency: Urgency;
  dest: string;
}[] = [
  { key: "users", label: "Total users", icon: Users, count: "2,847", sub: "Active 2,481 · Inactive 363 · Locked 3", trend: "+128 this month", urgency: "blue", dest: "admin-users" },
  { key: "trials", label: "Total trials", icon: FlaskConical, count: "89", sub: "45 sponsors · 38 CROs · 54 sites", trend: "+4 this month", urgency: "green", dest: "admin-trials" },
  { key: "approvals", label: "Pending approvals", icon: CheckCircle, count: "5", sub: "3 others specify · 2 org merges", trend: "Oldest: 4 days ago", urgency: "amber", dest: "admin-master-data" },
  { key: "issues", label: "Open issues", icon: AlertTriangle, count: "7", sub: "2 high · 3 medium · 2 low", trend: "1 SLA at risk", urgency: "red", dest: "admin-support" },
  { key: "notif", label: "Notification failures (24h)", icon: Bell, count: "12", sub: "Total sent 3,204 · Success 99.6%", trend: "Retry available", urgency: "red", dest: "admin-notifications" },
];

// ── ADM-01 §3 Pending admin actions ──────────────────────────────────
const pendingActions: { label: string; sub: string; count: number; urgency: Urgency; dest: string }[] = [
  { label: "Others Specify approvals", sub: "Custom dropdown values awaiting review", count: 3, urgency: "red", dest: "admin-master-data" },
  { label: "Org merge reviews", sub: "Possible duplicate organizations", count: 2, urgency: "amber", dest: "admin-organizations" },
  { label: "Locked accounts", sub: "Users locked after failed logins", count: 3, urgency: "red", dest: "admin-users" },
  { label: "System alerts", sub: "Background process failures", count: 4, urgency: "amber", dest: "admin-system-alerts" },
  { label: "Open issues", sub: "User-reported support tickets", count: 7, urgency: "red", dest: "admin-support" },
  { label: "T&C acceptance pending", sub: "Users yet to accept current version", count: 19, urgency: "blue", dest: "admin-terms" },
  { label: "Org name correction requests", sub: "Submitted from user profiles", count: 2, urgency: "blue", dest: "admin-organizations" },
];

// ── ADM-01 §4 User distribution ──────────────────────────────────────
const distribution: { label: string; count: number; color: string }[] = [
  { label: "Sponsor", count: 642, color: "var(--primary)" },
  { label: "CRO", count: 488, color: "var(--info)" },
  { label: "SMO", count: 213, color: "var(--accent)" },
  { label: "Site", count: 904, color: "var(--violet)" },
  { label: "Patient", count: 600, color: "var(--warning)" },
];

const activityFeed: { dot: Urgency; title: string; sub: string; time: string; dest: string }[] = [
  { dot: "red", title: "Account locked — Mark Johnson", sub: "Sponsor · TrialPharma · 5 failed login attempts", time: "10 min ago", dest: "admin-users" },
  { dot: "red", title: "AI extraction failed — CTRI/2024/003", sub: "Oncology Phase II · Protocol parse error", time: "12 min ago", dest: "admin-system-alerts" },
  { dot: "green", title: "New registration — Apollo Hospital", sub: "Site · 4 new users this week", time: "35 min ago", dest: "admin-organizations" },
  { dot: "amber", title: "Others Specify pending — 'Senior CRA'", sub: "Submitted by P. Nair", time: "1h ago", dest: "admin-master-data" },
  { dot: "blue", title: "Trial activated — CTRI/2024/021", sub: "Diabetes Phase II · Apollo Hospital", time: "3h ago", dest: "admin-trials" },
  { dot: "red", title: "Notification failed — PT-1042", sub: "Device token expired · 3 attempts", time: "5h ago", dest: "admin-notifications" },
];

const quickAccess: { dest: string; label: string; icon: typeof Users }[] = [
  { dest: "admin-organizations", label: "Organizations", icon: Building2 },
  { dest: "admin-audit", label: "Audit Trail", icon: ScrollText },
  { dest: "admin-system-alerts", label: "System Alerts", icon: ShieldAlert },
  { dest: "admin-emergency", label: "Break-the-Glass", icon: Lock },
];

const dotClass: Record<Urgency, string> = {
  red: "bg-destructive",
  amber: "bg-warning",
  green: "bg-success",
  blue: "bg-info",
};

const tileAccent: Record<Urgency, string> = {
  red: "text-destructive",
  amber: "text-warning",
  green: "text-success",
  blue: "text-info",
};

const countBadge: Record<Urgency, string> = {
  red: "bg-destructive/10 text-destructive",
  amber: "bg-warning/15 text-warning",
  green: "bg-success/15 text-success",
  blue: "bg-info/10 text-info",
};

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [navMessage, setNavMessage] = useState<string | null>(null);

  const totalUsers = useMemo(() => distribution.reduce((s, d) => s + d.count, 0), []);

  useEffect(() => {
    if (!navMessage) return;
    const t = setTimeout(() => setNavMessage(null), 2500);
    return () => clearTimeout(t);
  }, [navMessage]);

  const logAudit = useCallback((source: string, dest: string) => {
    console.info(`[AUDIT] source=${source} → dest=${dest}`);
  }, []);

  const go = useCallback(
    (dest: string, source: string) => {
      logAudit(source, dest);
      onNavigate?.(dest);
    },
    [logAudit, onNavigate]
  );

  const doRefresh = useCallback((manual: boolean) => {
    setRefreshing(true);
    setLastRefresh(new Date());
    if (manual) setNavMessage("Dashboard refreshed ✓");
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => doRefresh(false), 60000);
    return () => clearInterval(interval);
  }, [doRefresh]);

  const handleExport = () => {
    const lines: string[] = ["TrialSync — Platform Admin Dashboard Snapshot", new Date().toString(), ""];
    summaryTiles.forEach((t) => lines.push(`${t.label}: ${t.count} | ${t.sub} | ${t.trend}`));
    const blob = new Blob([lines.join("\n")], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-snapshot-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logAudit("export-button", "pdf-snapshot");
    setNavMessage("Dashboard snapshot downloaded ✓");
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* ── Header row: subtitle + actions (ADM-01 §1 / §7) ─────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-primary">Platform overview</h1>
          <p className="text-sm text-muted-foreground">Real-time snapshot of users, trials, approvals and system health.</p>
        </div>
        <div className="flex items-center gap-2">
          {navMessage && (
            <span className="text-xs font-medium text-primary bg-info/5 border border-info/20 rounded-lg px-3 py-1.5 flex items-center gap-1">
              <ArrowRight className="h-3 w-3" /> {navMessage}
            </span>
          )}
          <button
            onClick={() => doRefresh(true)}
            className="flex items-center gap-2 text-sm font-medium text-foreground/80 bg-card border border-border rounded-lg px-3 py-2 hover:bg-surface"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-sm font-medium text-white bg-primary rounded-lg px-3 py-2 hover:bg-primary/90"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* ── §2 Summary tiles (5) ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {summaryTiles.map((t) => (
          <button
            key={t.key}
            onClick={() => go(t.dest, `tile-${t.key}`)}
            className="text-left bg-card border border-border rounded-xl p-4 hover:border-info hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <t.icon className={`h-5 w-5 ${tileAccent[t.urgency]}`} />
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </div>
            <div className="text-2xl font-bold text-primary mt-2">{t.count}</div>
            <div className="text-xs font-medium text-foreground/80 mt-1">{t.label}</div>
            <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{t.sub}</div>
            <div className={`text-[11px] font-semibold mt-1.5 ${tileAccent[t.urgency]}`}>{t.trend}</div>
          </button>
        ))}
      </div>

      {/* ── Quick access (moved to top) ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickAccess.map(({ dest, label, icon: Icon }) => (
          <button
            key={dest}
            onClick={() => go(dest, "quick-access")}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-info/5 hover:border-info transition-colors py-4"
          >
            <Icon className="h-5 w-5 text-info" />
            <span className="text-xs font-medium text-foreground/80">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Two-column body ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: distribution + activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* §4 User distribution */}
          <Card className="border border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-primary">User distribution by entity</h3>
                <span className="text-xs text-muted-foreground/70">{totalUsers.toLocaleString()} total</span>
              </div>
              <div className="flex h-3 w-full rounded-full overflow-hidden">
                {distribution.map((d) => (
                  <div
                    key={d.label}
                    style={{ width: `${(d.count / totalUsers) * 100}%`, backgroundColor: d.color }}
                    title={`${d.label}: ${d.count}`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                {distribution.map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-muted-foreground">{d.label}</span>
                    </div>
                    <div className="text-sm font-semibold text-primary mt-0.5">
                      {d.count}
                      <span className="text-[10px] font-normal text-muted-foreground/70 ml-1">
                        {Math.round((d.count / totalUsers) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent platform activity */}
          <Card className="border border-border shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
                <Clock className="h-4 w-4 text-info" />
                <span className="text-sm font-semibold text-primary flex-1">Recent platform activity</span>
                <span className="text-[11px] text-muted-foreground/70">Last 6 events</span>
              </div>
              {activityFeed.map((ev, i) => (
                <button
                  key={i}
                  onClick={() => go(ev.dest, "activity-feed")}
                  className="w-full text-left flex items-center gap-3 px-5 py-3 border-b border-border last:border-b-0 hover:bg-surface"
                >
                  <span className={`h-2 w-2 rounded-full shrink-0 ${dotClass[ev.dot]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">{ev.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{ev.sub}</div>
                  </div>
                  <span className="text-xs text-muted-foreground/70 shrink-0">{ev.time}</span>
                </button>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Right: §3 Pending admin actions */}
        <div className="lg:col-span-1">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm font-semibold text-primary flex-1">Pending admin actions</span>
              </div>
              {pendingActions.map((a) => (
                <div
                  key={a.label}
                  className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{a.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.sub}</div>
                  </div>
                  <Badge className={`${countBadge[a.urgency]} hover:opacity-100 text-[11px] shrink-0`}>{a.count}</Badge>
                  <button
                    onClick={() => go(a.dest, `pending-${a.label}`)}
                    className="text-xs font-semibold text-info hover:underline shrink-0"
                  >
                    Action
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-center text-[11px] text-muted-foreground/70">
        Auto-refreshes every 60s · last updated {lastRefresh.toLocaleTimeString()}
      </p>
    </div>
  );
}
