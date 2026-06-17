"use client"

import { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react"
import ThemeScope from "./ThemeScope"
import type { Theme } from "./themes"

const ROLES = ["Sponsor", "Investigator", "Coordinator"]

export default function SignupScreen({ theme }: { theme: Theme }) {
  const [showPw, setShowPw] = useState(false)
  const [role, setRole] = useState("Investigator")
  const gid = `su-grad-${theme.key}`

  const fieldStyle = { background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--ink)" }

  return (
    <ThemeScope theme={theme} className="mx-auto w-full max-w-[360px]">
      <div className="overflow-hidden rounded-[34px] border p-6 pb-7" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold"
            style={{ background: "var(--primary)", color: "var(--on-primary)", fontFamily: "var(--font-display)" }}>
            M
          </div>
          <p className="text-[12px] font-semibold tracking-wide">MY TRIAL BOARD</p>
          <svg viewBox="0 0 70 26" className="ml-auto h-[24px] w-[64px]" aria-hidden="true">
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--accent-from)" />
                <stop offset="1" stopColor="var(--accent-to)" />
              </linearGradient>
            </defs>
            <path className="vs-draw" d="M4 22 Q35 2 66 22" fill="none" stroke={`url(#${gid})`} strokeWidth="2.5" strokeLinecap="round" />
            <circle className="vs-rise" cx="35" cy="8" r="4.5" fill={`url(#${gid})`} />
          </svg>
        </div>

        {/* Title */}
        <div className="vs-rise mt-6">
          <h1 className="text-[27px] font-semibold leading-tight tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Create your account
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
            Start following your trial — visit by visit, morning by morning.
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Field label="Full name">
            <div className="flex h-12 items-center gap-2 rounded-xl border px-3" style={fieldStyle}>
              <User size={16} strokeWidth={2} style={{ color: "var(--muted)" }} />
              <input type="text" autoComplete="name" placeholder="Dr. Lina Park"
                className="w-full bg-transparent text-[14px] outline-none placeholder:opacity-50" style={{ color: "var(--ink)" }} />
            </div>
          </Field>

          <Field label="Email">
            <div className="flex h-12 items-center gap-2 rounded-xl border px-3" style={fieldStyle}>
              <Mail size={16} strokeWidth={2} style={{ color: "var(--muted)" }} />
              <input type="email" autoComplete="email" inputMode="email" placeholder="you@clinic.org"
                className="w-full bg-transparent text-[14px] outline-none placeholder:opacity-50" style={{ color: "var(--ink)" }} />
            </div>
          </Field>

          <Field label="Password">
            <div className="flex h-12 items-center gap-2 rounded-xl border px-3" style={fieldStyle}>
              <Lock size={16} strokeWidth={2} style={{ color: "var(--muted)" }} />
              <input type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters"
                className="w-full bg-transparent text-[14px] outline-none placeholder:opacity-50" style={{ color: "var(--ink)" }} />
              <button type="button" onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"} style={{ color: "var(--muted)" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          {/* Role chips */}
          <div>
            <p className="mb-1.5 text-[12px] font-medium" style={{ color: "var(--ink)" }}>Your role</p>
            <div className="flex gap-2">
              {ROLES.map((r) => {
                const on = r === role
                return (
                  <button key={r} type="button" onClick={() => setRole(r)} aria-pressed={on}
                    className="flex h-9 flex-1 items-center justify-center gap-1 rounded-full border text-[12px] font-medium transition-colors"
                    style={on
                      ? { background: "var(--primary)", color: "var(--on-primary)", borderColor: "var(--primary)" }
                      : { background: "var(--surface)", color: "var(--muted)", borderColor: "var(--line)" }}>
                    {on && <Check size={13} strokeWidth={2.6} />} {r}
                  </button>
                )
              })}
            </div>
          </div>

          <button type="submit"
            className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
            Create account <ArrowRight size={16} strokeWidth={2.2} />
          </button>
        </form>

        <p className="mt-5 text-center text-[12px]" style={{ color: "var(--muted)" }}>
          Already have an account?{" "}
          <span className="font-semibold" style={{ color: "var(--primary)" }}>Sign in</span>
        </p>
      </div>
    </ThemeScope>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium" style={{ color: "var(--ink)" }}>{label}</span>
      {children}
    </label>
  )
}
