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

const tileTint: Record<Urgency, string> = {
  red: "bg-destructive/10 text-destructive",
  amber: "bg-warning/15 text-warning",
  green: "bg-success/15 text-success",
  blue: "bg-info/10 text-info",
};

// Eased count-up for headline numbers.
function useCountUp(target: number, duration = 850) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function AnimatedCount({ value, className }: { value: string; className?: string }) {
  const numeric = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const hasComma = value.includes(",");
  const n = useCountUp(isNaN(numeric) ? 0 : numeric);
  if (isNaN(numeric)) return <span className={className}>{value}</span>;
  return <span className={className}>{hasComma ? n.toLocaleString() : n}</span>;
}

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
      <div className="flex items-center justify-between gap-4 flex-wrap animate-rise" style={{ animationDelay: "20ms" }}>
        <div>
          <p className="eyebrow text-accent">Platform admin</p>
          <h1 className="display-serif text-2xl text-foreground">Platform overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time snapshot of users, trials, approvals and system health.</p>
        </div>
        <div className="flex items-center gap-2">
          {navMessage && (
            <span className="text-xs font-medium text-success bg-success/10 border border-success/20 rounded-lg px-3 py-1.5 flex items-center gap-1 animate-pop">
              <ArrowRight className="h-3 w-3" /> {navMessage}
            </span>
          )}
          <button
            onClick={() => doRefresh(true)}
            className="springy active:scale-95 flex items-center gap-2 text-sm font-medium text-foreground/80 bg-card border border-border rounded-xl px-3.5 py-2 hover:bg-surface hover:border-primary/30"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={handleExport}
            className="springy active:scale-95 flex items-center gap-2 text-sm font-semibold text-primary-foreground dawn-gradient hero-glow rounded-xl px-3.5 py-2 shadow-sm"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* ── §2 Summary tiles (5) ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {summaryTiles.map((t, i) => (
          <button
            key={t.key}
            onClick={() => go(t.dest, `tile-${t.key}`)}
            style={{ animationDelay: `${80 + i * 70}ms` }}
            className="springy active:scale-[0.98] animate-rise group text-left bg-card border border-border rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${tileTint[t.urgency]}`}>
                <t.icon className="h-5 w-5" />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <AnimatedCount value={t.count} className="block text-3xl font-mono font-semibold text-foreground mt-3 tabular-nums" />
            <div className="text-xs font-semibold text-foreground/80 mt-1">{t.label}</div>
            <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{t.sub}</div>
            <div className={`text-[11px] font-semibold mt-1.5 ${tileAccent[t.urgency]}`}>{t.trend}</div>
          </button>
        ))}
      </div>

      {/* ── Quick access (moved to top) ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickAccess.map(({ dest, label, icon: Icon }, i) => (
          <button
            key={dest}
            onClick={() => go(dest, "quick-access")}
            style={{ animationDelay: `${440 + i * 60}ms` }}
            className="springy active:scale-[0.98] animate-rise group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card shadow-xs hover:border-accent/40 hover:bg-accent/5 hover:-translate-y-0.5 py-4"
          >
            <div className="h-9 w-9 rounded-xl bg-accent/12 text-accent flex items-center justify-center transition-transform group-hover:scale-110">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-foreground/80">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Two-column body ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: distribution + activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* §4 User distribution */}
          <Card className="border border-border shadow-xs rounded-2xl animate-rise" style={{ animationDelay: "560ms" }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="eyebrow text-muted-foreground">User distribution by entity</h3>
                <span className="text-xs text-muted-foreground/70 font-mono">{totalUsers.toLocaleString()} total</span>
              </div>
              <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-muted">
                {distribution.map((d, i) => (
                  <div
                    key={d.label}
                    className="animate-fill-bar h-full"
                    style={{ width: `${(d.count / totalUsers) * 100}%`, backgroundColor: d.color, animationDelay: `${640 + i * 90}ms` }}
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
                    <div className="text-sm font-semibold text-foreground mt-0.5 font-mono">
                      <AnimatedCount value={String(d.count)} />
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
          <Card className="border border-border shadow-xs rounded-2xl overflow-hidden animate-rise" style={{ animationDelay: "640ms" }}>
            <CardContent className="p-0">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
                <Clock className="h-4 w-4 text-info" />
                <span className="eyebrow text-muted-foreground flex-1">Recent platform activity</span>
                <span className="text-[11px] text-muted-foreground/70">Last 6 events</span>
              </div>
              {activityFeed.map((ev, i) => (
                <button
                  key={i}
                  onClick={() => go(ev.dest, "activity-feed")}
                  className="group w-full text-left flex items-center gap-3 px-5 py-3 border-b border-border last:border-b-0 hover:bg-surface transition-colors"
                >
                  <span className={`h-2 w-2 rounded-full shrink-0 ${dotClass[ev.dot]} ${ev.dot === "red" ? "animate-pulse-soft" : ""}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">{ev.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{ev.sub}</div>
                  </div>
                  <span className="text-xs text-muted-foreground/70 shrink-0">{ev.time}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 shrink-0 -ml-1 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                </button>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Right: §3 Pending admin actions */}
        <div className="lg:col-span-1">
          <Card className="border border-border shadow-xs rounded-2xl overflow-hidden animate-rise" style={{ animationDelay: "700ms" }}>
            <CardContent className="p-0">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="eyebrow text-muted-foreground flex-1">Pending admin actions</span>
              </div>
              {pendingActions.map((a) => (
                <div
                  key={a.label}
                  className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-b-0 hover:bg-surface/60 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{a.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.sub}</div>
                  </div>
                  <Badge className={`${countBadge[a.urgency]} hover:opacity-100 text-[11px] shrink-0 font-mono`}>{a.count}</Badge>
                  <button
                    onClick={() => go(a.dest, `pending-${a.label}`)}
                    className="springy active:scale-95 text-xs font-semibold text-primary hover:underline shrink-0"
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
