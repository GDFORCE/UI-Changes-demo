import { UserPlus, ArrowRight } from "lucide-react"
import ThemeScope from "./ThemeScope"
import type { Theme } from "./themes"

/**
 * Theme-driven onboarding/login screen — renders any colorway from themes.ts.
 * Same structure as the original self-contained Variant* files, unified.
 */
export default function LoginScreen({ theme }: { theme: Theme }) {
  const gid = `lg-grad-${theme.key}`
  return (
    <ThemeScope theme={theme} className="mx-auto w-full max-w-[360px]">
      <div className="overflow-hidden rounded-[34px] border p-6 pb-7" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: "var(--primary)", color: "var(--on-primary)", fontFamily: "var(--font-display)" }}>
              M
            </div>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold tracking-wide">MY TRIAL BOARD</p>
              <p className="text-[11px]" style={{ color: "var(--muted)" }}>Clinical visit scheduling</p>
            </div>
          </div>
          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest"
            style={{ background: "var(--surface-2)", color: "var(--secondary)" }}>
            EST. 2024
          </span>
        </div>

        {/* Hero */}
        <div className="vs-rise mt-9">
          <h1 className="text-[31px] font-semibold leading-[1.08] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Your trial,<br />one <span style={{ color: "var(--primary)" }}>sunrise</span><br />at a time.
          </h1>
          <p className="mt-3 max-w-[30ch] text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
            One calm place for sponsors, sites and patients to follow a clinical trial — visit by visit, morning by morning.
          </p>
        </div>

        {/* Sunrise timeline */}
        <div className="mt-7">
          <svg viewBox="0 0 300 92" className="w-full" role="img" aria-label="Trial progress sunrise from schedule to completion">
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--accent-from)" />
                <stop offset="1" stopColor="var(--accent-to)" />
              </linearGradient>
            </defs>
            <line x1="20" y1="74" x2="280" y2="74" stroke="var(--line)" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
            <path className="vs-draw" d="M28 74 Q150 2 272 74" fill="none" stroke={`url(#${gid})`} strokeWidth="3" strokeLinecap="round" />
            <circle className="vs-rise" cx="150" cy="20" r="9" fill={`url(#${gid})`} />
            {[28, 109, 191, 272].map((x) => (
              <circle key={x} cx={x} cy="74" r="3.5" fill="var(--surface)" stroke="var(--secondary)" strokeWidth="2" />
            ))}
          </svg>
          <div className="mt-2 flex justify-between text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            <span>Schedule</span><span>Baseline</span><span>Follow-up</span><span>Done</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 space-y-3">
          <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
            <UserPlus size={17} strokeWidth={2} /> Create an account
          </button>
          <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full border text-[14px] font-semibold"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
            Sign in <ArrowRight size={16} strokeWidth={2} />
          </button>
          <button className="block w-full py-1 text-center text-[12px] font-medium" style={{ color: "var(--muted)" }}>
            Forgot password?
          </button>
        </div>
      </div>
    </ThemeScope>
  )
}
