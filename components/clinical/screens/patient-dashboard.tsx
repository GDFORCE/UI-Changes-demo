"use client"

import { BottomNav } from "../bottom-nav"
import { ChevronRight, Check, Calendar, Bell, MessageCircle, Activity, Clock } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"

interface PatientDashboardProps {
  onNavigate: (screen: string) => void
}

const TOTAL_VISITS = 10
const VISITS_DONE = 6

/**
 * Dawn ring — a circular progress dial. On the gradient hero it renders in
 * cream/white (the hero itself is the dawn gesture); the fill sweeps in on load.
 */
function DawnRing({ pct, size = 84, tone = "dawn" }: { pct: number; size?: number; tone?: "dawn" | "light" }) {
  const light = tone === "light"
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 84 84" className="w-full h-full -rotate-90" fill="none" aria-hidden>
        <defs>
          <linearGradient id="dawn-ring" x1="0" y1="0" x2="84" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--dawn-from)" />
            <stop offset="0.55" stopColor="var(--dawn-mid)" />
            <stop offset="1" stopColor="var(--dawn-to)" />
          </linearGradient>
        </defs>
        <circle cx="42" cy="42" r="34" stroke={light ? "rgb(255 255 255 / 0.22)" : "var(--border)"} strokeWidth="7" />
        <circle
          cx="42" cy="42" r="34"
          stroke={light ? "rgb(255 255 255 / 0.95)" : "url(#dawn-ring)"}
          strokeWidth="7" strokeLinecap="round" pathLength="100"
          className="animate-arc"
          style={{ ["--arc-rest" as string]: String(100 - pct) }}
        />
      </svg>
      <div className={cn("absolute inset-0 flex flex-col items-center justify-center", light ? "text-primary-foreground" : "text-foreground")}>
        <span className="font-heading text-xl leading-none tabular-nums">{pct}%</span>
      </div>
    </div>
  )
}

/** Editorial section header: index numeral · small-caps label · hairline rule. */
function SectionHeader({ index, label, action }: { index: string; label: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="font-heading text-sm text-accent tabular-nums">{index}</span>
      <p className="eyebrow text-primary shrink-0">{label}</p>
      <span className="h-px flex-1 bg-border" />
      {action}
    </div>
  )
}

export function PatientDashboard({ onNavigate }: PatientDashboardProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("dashboard")

  const progressPct = Math.round((VISITS_DONE / TOTAL_VISITS) * 100)

  const recentActivity = [
    { visit: "Visit 6", date: "10 May", status: "Done" },
    { visit: "Visit 5", date: "22 Apr", status: "Done" },
  ]

  // Calendar mini (May 2025)
  const calendarMonth = new Date(2025, 4, 1)
  const monthVisits: Record<number, "completed" | "upcoming" | "scheduled"> = { 5: "completed", 19: "completed", 23: "upcoming" }
  const today = new Date(2025, 4, 19).getDate()
  const startDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay()
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()
  const calendarCells: (number | null)[] = Array(startDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d)
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  const notifications = [
    { id: "1", icon: Bell, bg: "bg-accent/15", color: "text-accent", title: "Visit 7 Tomorrow", body: "Follow-Up Visit at AIIMS Delhi · 23 May 2025", time: "2h ago", unread: true, screen: "my-trial" },
    { id: "2", icon: MessageCircle, bg: "bg-violet/10", color: "text-violet", title: "Message from Dr. Sharma", body: "Please fast for 8 hours before your Visit 7 blood draw.", time: "Yesterday", unread: true, screen: "chat" },
  ]

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-auto pb-6">
        {/* ── Dawn hero — even deep plum, layered sunrise atmosphere ── */}
        <div
          className="hero-glow paper-grain relative overflow-hidden rounded-b-[28px] px-6 pt-6 pb-7 text-primary-foreground shadow-md"
          style={{ backgroundImage: "radial-gradient(125% 92% at 50% -8%, var(--primary) 0%, var(--primary-deep) 56%)" }}
        >
          {/* atmosphere: corner sun glow + a wide warm dawn rising along the bottom */}
          <span aria-hidden className="absolute -top-14 -right-12 h-44 w-44 rounded-full bg-[var(--dawn-from)] opacity-30 blur-2xl" />
          <span aria-hidden className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-44 w-[135%] rounded-[100%] bg-[var(--dawn-mid)] opacity-25 blur-3xl" />
          <span aria-hidden className="animate-drift absolute top-10 right-24 h-2.5 w-2.5 rounded-full bg-white/30" />
          <span aria-hidden className="animate-drift-slow absolute top-24 left-12 h-2 w-2 rounded-full bg-white/20" />

          {/* greeting + actions */}
          <div className="relative flex items-start justify-between gap-3 animate-rise" style={{ animationDelay: "40ms" }}>
            <div className="min-w-0">
              <p className="eyebrow text-primary-foreground/80">{t("welcomeBack")}</p>
              <h1 className="display-serif text-[30px] leading-tight">{t("hello")} Priya</h1>
              <p className="text-primary-foreground/75 text-[13px] mt-1">Protocol-001 · Dr. Sharma</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate("notifications")}
                aria-label="Notifications"
                className="springy relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-white/25 active:scale-95"
              >
                <Bell className="h-5 w-5" />
                <span aria-hidden className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-[var(--dawn-from)] ring-2 ring-[var(--primary)]" />
              </button>
              <button
                onClick={() => onNavigate("profile-settings")}
                aria-label="Account"
                className="springy flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-primary-foreground ring-1 ring-white/25 backdrop-blur-sm active:scale-95"
              >
                PK
              </button>
            </div>
          </div>

          {/* progress — frosted glass panel */}
          <div className="relative mt-5 flex items-center gap-4 rounded-3xl bg-white/10 px-4 py-4 ring-1 ring-white/15 backdrop-blur-sm animate-rise" style={{ animationDelay: "130ms" }}>
            <DawnRing pct={progressPct} tone="light" size={72} />
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-primary-foreground/75">{t("yourProgress")}</p>
              <p className="font-heading text-[17px] leading-snug mt-0.5">
                {t("visitOfCompleted", { a: VISITS_DONE, b: TOTAL_VISITS })}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">
                  <Activity className="h-3 w-3" /> 93% adherence
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">
                  Next in 4 days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 01 · Next Visit — date-block feature card ── */}
        <div className="px-4 mt-5 animate-rise" style={{ animationDelay: "200ms" }}>
          <SectionHeader index="01" label={t("nextVisit")} />
          <button onClick={() => onNavigate("my-trial")} className="group block w-full text-left">
            <div className="dawn-ambient relative overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm transition-all group-hover:shadow-md group-active:scale-[0.99]">
              <div className="relative flex gap-4">
                {/* date tear-block */}
                <div className="hero-glow flex flex-col items-center justify-center rounded-2xl dawn-gradient px-4 py-3 text-primary-foreground shadow-sm shrink-0">
                  <span className="font-heading text-[26px] leading-none">23</span>
                  <span className="eyebrow text-primary-foreground/85 mt-1">May</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="eyebrow text-accent">In 4 days</p>
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-warning/15 text-warning">{t("upcoming")}</span>
                  </div>
                  <p className="font-heading text-[17px] text-foreground leading-tight mt-1">Visit 7 · {t("followUpVisit")}</p>
                  <p className="text-xs text-muted-foreground mt-1">AIIMS Delhi · Dr. Sharma</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {t("window")} 20 – 26 May
                  </p>
                </div>
              </div>
              <div className="relative mt-3.5 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Protocol-001 · Phase II · Diabetes</span>
                <span className="flex items-center gap-1 text-sm font-medium text-accent">
                  {t("viewDetails")} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* ── 02 · This Month — calendar mini ── */}
        <div className="px-4 mt-6 animate-rise" style={{ animationDelay: "280ms" }}>
          <SectionHeader
            index="02"
            label={t("calendar")}
            action={
              <button onClick={() => onNavigate("patient-calendar")} className="flex items-center gap-1 text-sm font-medium text-accent hover:underline underline-offset-2">
                {t("openCalendar")} <ChevronRight className="w-4 h-4" />
              </button>
            }
          />
          <button onClick={() => onNavigate("patient-calendar")} className="w-full text-left rounded-3xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-center font-heading text-foreground mb-3">
              {calendarMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </p>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center text-[11px] font-semibold text-muted-foreground/70 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((day, i) => {
                const status = day ? monthVisits[day] : undefined
                const isToday = day === today
                return (
                  <div
                    key={i}
                    className={cn(
                      "relative aspect-square flex flex-col items-center justify-center rounded-2xl text-xs font-medium",
                      !day && "invisible",
                      status === "completed" && "bg-accent/12 text-accent",
                      status === "upcoming" && "bg-warning/15 text-warning",
                      status === "scheduled" && "bg-info/10 text-info",
                      !status && isToday && "ring-1 ring-inset ring-info text-info",
                      !status && !isToday && "text-foreground/80",
                    )}
                  >
                    {day}
                    {status && (
                      <span className={cn(
                        "absolute bottom-1 h-1 w-1 rounded-full",
                        status === "completed" && "bg-accent",
                        status === "upcoming" && "bg-warning",
                        status === "scheduled" && "bg-info",
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-border">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-accent" />{t("completed")}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-warning" />{t("upcoming")}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-info" />{t("scheduled")}</span>
            </div>
          </button>
        </div>

        {/* ── 03 · Updates — notifications ── */}
        <div className="px-4 mt-6 animate-rise" style={{ animationDelay: "360ms" }}>
          <SectionHeader
            index="03"
            label={t("notifications")}
            action={
              <button onClick={() => onNavigate("notifications")} className="text-sm font-medium text-accent hover:underline underline-offset-2">
                {t("seeAll")}
              </button>
            }
          />
          <div className="space-y-3">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => onNavigate(n.screen)}
                className="group w-full text-left rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99] flex items-start gap-3"
              >
                <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0", n.bg)}>
                  <n.icon className={cn("w-5 h-5", n.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground text-[15px] truncate">{n.title}</p>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{n.body}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{n.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* ── 04 · Recent activity ── */}
        <div className="px-4 mt-6 animate-rise" style={{ animationDelay: "440ms" }}>
          <SectionHeader index="04" label={t("recentActivity")} />
          <div className="rounded-3xl border border-border bg-card divide-y divide-border shadow-sm overflow-hidden">
            {recentActivity.map((activity) => (
              <div key={activity.visit} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-success/15 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.visit}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/15 text-success">
                  {activity.status === "Done" ? t("done") : activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav
        activeTab={activeTab}
        role="patient"
        notificationCount={2}
        onTabChange={(tab) => {
          setActiveTab(tab)
          if (tab === "my-trial") onNavigate("my-trial")
          if (tab === "chat") onNavigate("chat")
          if (tab === "calendar") onNavigate("patient-calendar")
          if (tab === "me") onNavigate("profile-settings")
        }}
      />
    </div>
  )
}
