import { Bell, Users, CalendarCheck, TrendingUp, Home, Calendar, UserRound, ChevronRight } from "lucide-react"
import ThemeScope from "./ThemeScope"
import type { Theme } from "./themes"

const STATS = [
  { icon: Users, value: "128", label: "Patients" },
  { icon: CalendarCheck, value: "12", label: "Today" },
  { icon: TrendingUp, value: "94%", label: "Adherence" },
]

const VISITS = [
  { time: "08:30", name: "Maria Gomez", type: "Baseline", status: "Confirmed", done: true },
  { time: "10:15", name: "John Reyes", type: "Follow-up", status: "Due", done: false },
  { time: "13:00", name: "Amara Oka", type: "Screening", status: "Confirmed", done: true },
]

export default function DashboardScreen({ theme }: { theme: Theme }) {
  const gid = `ds-grad-${theme.key}`
  return (
    <ThemeScope theme={theme} className="mx-auto w-full max-w-[360px]">
      <div className="overflow-hidden rounded-[34px] border p-6 pb-5" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: "var(--primary)", color: "var(--on-primary)", fontFamily: "var(--font-display)" }}>
              LP
            </div>
            <div className="leading-tight">
              <p className="text-[11px]" style={{ color: "var(--muted)" }}>Good morning</p>
              <p className="text-[14px] font-semibold">Dr. Lina Park</p>
            </div>
          </div>
          <button aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "var(--surface-2)", color: "var(--ink)" }}>
            <Bell size={17} strokeWidth={2} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full" style={{ background: "var(--primary)" }} />
          </button>
        </div>

        {/* Today's rounds — sunrise progress */}
        <div className="mt-6 flex items-center justify-between rounded-3xl p-5" style={{ background: "var(--surface-2)" }}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Today's rounds</p>
            <p className="mt-1 text-[26px] font-semibold leading-none" style={{ fontFamily: "var(--font-display)" }}>3<span className="text-[15px]" style={{ color: "var(--muted)" }}> / 5 visits</span></p>
            <p className="mt-2 text-[11px]" style={{ color: "var(--secondary)" }}>2 left before noon</p>
          </div>
          <svg viewBox="0 0 120 70" className="h-[64px] w-[112px]" role="img" aria-label="3 of 5 visits complete">
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--accent-from)" />
                <stop offset="1" stopColor="var(--accent-to)" />
              </linearGradient>
            </defs>
            <line x1="8" y1="58" x2="112" y2="58" stroke="var(--line)" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />
            <path className="vs-draw" d="M12 58 Q60 6 108 58" fill="none" stroke={`url(#${gid})`} strokeWidth="3" strokeLinecap="round" />
            <circle className="vs-rise" cx="60" cy="16" r="7" fill={`url(#${gid})`} />
          </svg>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-2xl border p-3" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
              <Icon size={16} strokeWidth={2} style={{ color: "var(--primary)" }} />
              <p className="mt-2 text-[17px] font-bold leading-none">{value}</p>
              <p className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Today's visits */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[13px] font-semibold">Today's visits</p>
          <button className="flex items-center gap-0.5 text-[11px] font-medium" style={{ color: "var(--primary)" }}>
            See all <ChevronRight size={13} />
          </button>
        </div>
        <div className="mt-3 space-y-2.5">
          {VISITS.map((v) => (
            <div key={v.time} className="flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: "var(--line)" }}>
              <div className="flex h-11 w-11 flex-col items-center justify-center rounded-xl text-[11px] font-semibold"
                style={{ background: "var(--surface-2)", color: "var(--ink)" }}>
                {v.time}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{v.name}</p>
                <p className="text-[11px]" style={{ color: "var(--muted)" }}>{v.type}</p>
              </div>
              <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                style={v.done
                  ? { background: "var(--surface-2)", color: "var(--secondary)" }
                  : { background: "var(--primary)", color: "var(--on-primary)" }}>
                {v.status}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="mt-6 flex items-center justify-around border-t pt-4" style={{ borderColor: "var(--line)" }}>
          {[
            { icon: Home, label: "Home", active: true },
            { icon: Calendar, label: "Schedule", active: false },
            { icon: Users, label: "Patients", active: false },
            { icon: UserRound, label: "Profile", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label} className="flex flex-col items-center gap-1" style={{ color: active ? "var(--primary)" : "var(--muted)" }}>
              <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[9px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </ThemeScope>
  )
}
