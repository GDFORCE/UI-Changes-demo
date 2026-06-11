"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  Bell,
  Inbox,
  UserCog,
  Share2,
  MessageSquare,
  Mail,
  BarChart3,
  Search,
  Settings,
  ChevronRight,
  X,
  LogOut,
} from "lucide-react";

interface AdminPortalShellProps {
  currentScreen: string;
  title: string;
  onNavigate: (screen: string) => void;
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  code: string;
  // Other screen ids that should keep this nav item highlighted (deep links / tabs).
  match?: string[];
}

// Consolidated left-sidebar menu. Users+Orgs and the action items are merged
// into hub screens that host the original screens as tabs.
const primaryNav: NavItem[] = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, code: "ADM-01" },
  {
    id: "admin-users",
    label: "Users & Organizations",
    icon: Users,
    code: "ADM-02/03",
    match: ["admin-organizations"],
  },
  {
    id: "admin-action-center",
    label: "Action Center",
    icon: Inbox,
    code: "ADM-05/07/10/11",
    match: ["admin-master-data", "admin-support", "admin-system-alerts", "admin-notifications"],
  },
  { id: "admin-trials", label: "Trial Management", icon: FlaskConical, code: "ADM-06" },
  { id: "admin-delegation", label: "Delegation", icon: Share2, code: "ADM-13" },
  { id: "admin-messages", label: "Messages", icon: MessageSquare, code: "ADM-14" },
  { id: "admin-profile", label: "My Profile", icon: UserCog, code: "ADM-12" },
];

// Secondary screens kept reachable under "More".
const moreNav: NavItem[] = [
  { id: "admin-invitations", label: "Invitations", icon: Mail, code: "—" },
  { id: "admin-reports", label: "Reports", icon: BarChart3, code: "—" },
];

// Global search index — searches users, trials, organizations, tickets (top bar #2).
const searchIndex: { category: string; dest: string; items: { label: string; sub: string }[] }[] = [
  {
    category: "Users",
    dest: "admin-users",
    items: [
      { label: "Mark Johnson", sub: "Sponsor · TrialPharma · Locked" },
      { label: "Priya Nair", sub: "CRO · MediResearch · Active" },
      { label: "David Chen", sub: "Site · Apollo Hospital · Locked" },
    ],
  },
  {
    category: "Trials",
    dest: "admin-trials",
    items: [
      { label: "CTRI/2024/003 · Oncology Phase II", sub: "TrialPharma · AI Failed" },
      { label: "CTRI/2024/017 · Cardio Phase III", sub: "MediResearch · On hold" },
      { label: "CTRI/2024/021 · Diabetes Phase II", sub: "Apollo Hospital · Active" },
    ],
  },
  {
    category: "Organizations",
    dest: "admin-organizations",
    items: [
      { label: "TrialPharma Ltd", sub: "Sponsor · duplicate alert" },
      { label: "Apollo Hospital", sub: "Site · name correction" },
      { label: "MediResearch", sub: "CRO" },
    ],
  },
  {
    category: "Tickets",
    dest: "admin-support",
    items: [
      { label: "#TKT-2041 · Login loop on iOS", sub: "High · Apollo Hospital" },
      { label: "#TKT-2038 · Visit export failing", sub: "High · TrialPharma" },
    ],
  },
];

// Admin notification panel (bell) — system alerts + action items.
const notifications = [
  { id: "ADN-002", title: "Critical: AI extraction failed", sub: "CTRI/2024/003 · requires review", critical: true, dest: "admin-trials" },
  { id: "ADN-028", title: "Critical: Storage threshold breached", sub: "Document store at 87%", critical: true, dest: "admin-system-alerts" },
  { id: "ADN-110", title: "Account locked — Mark Johnson", sub: "Sponsor · TrialPharma", critical: false, dest: "admin-users" },
  { id: "ADN-114", title: "New duplicate org detected", sub: "TrialPharma Ltd · 92% similar", critical: false, dest: "admin-organizations" },
];

export function AdminPortalShell({ currentScreen, title, onNavigate, children }: AdminPortalShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const today = useMemo(
    () =>
      new Date(2026, 5, 6).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    []
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (it) => it.label.toLowerCase().includes(q) || it.sub.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const closeMenus = () => {
    setBellOpen(false);
    setSettingsOpen(false);
  };

  const renderNavItem = ({ id, label, icon: Icon, code, match }: NavItem) => {
    const active = currentScreen === id || (match?.includes(currentScreen) ?? false);
    return (
      <button
        key={id}
        onClick={() => onNavigate(id)}
        className={`group flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-sm transition-colors ${
          active ? "bg-white/15 text-white font-semibold" : "text-blue-100 hover:bg-white/10"
        }`}
        title={`${code} · ${label}`}
      >
        <span className={`w-1 h-5 rounded-full -ml-2 ${active ? "bg-card" : "bg-transparent"}`} />
        <Icon className="h-[18px] w-[18px] shrink-0" />
        <span className="truncate">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex bg-surface text-foreground">
      {/* ── Left sidebar (14 spec items + More) ───────────────────── */}
      <aside className="w-60 shrink-0 bg-primary text-white flex flex-col h-screen sticky top-0">
        <div className="px-4 py-4 border-b border-white/10">
          <h1 className="text-base font-semibold leading-tight">TrialSync</h1>
          <p className="text-[11px] text-primary-foreground/75">Platform Admin Portal</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {primaryNav.map(renderNavItem)}
          <div className="pt-3 mt-2 border-t border-white/10">
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-blue-300">More</p>
            {moreNav.map(renderNavItem)}
          </div>
        </nav>
        <button
          onClick={() => onNavigate("welcome")}
          className="flex items-center gap-3 px-4 py-3 border-t border-white/10 text-sm text-blue-100 hover:bg-white/10"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </aside>

      {/* ── Main column ───────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-primary leading-tight truncate">{title}</h2>
              <p className="text-xs text-muted-foreground">{today}</p>
            </div>
            <div className="flex items-center gap-1 relative">
              <button
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted"
                onClick={() => { closeMenus(); setSearchOpen(true); }}
                aria-label="Global search"
              >
                <Search className="h-5 w-5" />
              </button>
              <div className="relative">
                <button
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted relative"
                  onClick={() => { setSettingsOpen(false); setBellOpen((v) => !v); }}
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 bg-destructive text-white text-[9px] font-semibold rounded-full min-w-[15px] h-[15px] px-1 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button>
                {bellOpen && (
                  <div className="absolute right-0 top-12 z-30 w-[320px] bg-card rounded-xl shadow-xl border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                      <span className="text-sm font-semibold text-primary">Notifications</span>
                      <button onClick={() => setBellOpen(false)} aria-label="Close">
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => { setBellOpen(false); onNavigate(n.dest); }}
                          className="w-full text-left flex items-start gap-2 px-3 py-2 border-b border-border last:border-b-0 hover:bg-surface"
                        >
                          <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.critical ? "bg-destructive" : "bg-info"}`} />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-foreground truncate">{n.title}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{n.id} · {n.sub}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted"
                  onClick={() => { setBellOpen(false); setSettingsOpen((v) => !v); }}
                  aria-label="Platform settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
                {settingsOpen && (
                  <div className="absolute right-0 top-12 z-30 w-[240px] bg-card rounded-xl shadow-xl border border-border overflow-hidden">
                    <div className="px-3 py-2 border-b border-border text-sm font-semibold text-primary">
                      Platform settings
                    </div>
                    {[
                      { label: "My Profile", dest: "admin-profile" },
                      { label: "Session & security", dest: "admin-profile" },
                      { label: "Terms & Conditions", dest: "admin-terms" },
                      { label: "Delegation", dest: "admin-delegation" },
                    ].map((s) => (
                      <button
                        key={s.label}
                        onClick={() => { setSettingsOpen(false); onNavigate(s.dest); }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground/80 hover:bg-surface"
                      >
                        {s.label}
                      </button>
                    ))}
                    <button
                      onClick={() => { setSettingsOpen(false); onNavigate("welcome"); }}
                      className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/5 border-t border-border"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
              <div className="ml-2 flex items-center gap-2 pl-2 border-l border-border">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                  PA
                </div>
                <div className="hidden lg:block leading-tight">
                  <div className="text-xs font-semibold text-foreground">Platform Admin</div>
                  <div className="text-[10px] text-muted-foreground">drdineshyellamelli@…</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* ── Global search overlay ─────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-24 px-4" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
          <div className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground/70 shrink-0" />
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, trials, organizations, tickets…"
                className="border-0 shadow-none focus-visible:ring-0 text-sm"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} aria-label="Close search">
                <X className="h-5 w-5 text-muted-foreground/70" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-3">
              {!searchQuery.trim() && (
                <p className="text-xs text-muted-foreground/70 text-center py-6">
                  Search across users, trials, organizations and tickets.
                </p>
              )}
              {searchQuery.trim() && searchResults.length === 0 && (
                <p className="text-xs text-muted-foreground/70 text-center py-6">No results for “{searchQuery}”.</p>
              )}
              {searchResults.map((group) => (
                <div key={group.category}>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70 mb-1 px-1">
                    {group.category}
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    {group.items.map((it, i) => (
                      <button
                        key={i}
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); onNavigate(group.dest); }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 border-b border-border last:border-b-0 hover:bg-surface"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-foreground truncate">{it.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{it.sub}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
