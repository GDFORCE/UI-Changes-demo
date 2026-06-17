"use client";

import { useState } from "react";
import { Building2, Eye, EyeOff, ShieldCheck, Lock, ArrowRight } from "lucide-react";

interface AdminLoginScreenProps {
  onLogin: () => void;
  onBack?: () => void;
}

export function AdminLoginScreen({ onLogin, onBack }: AdminLoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-background">
      {/* ── Brand panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between dawn-gradient hero-glow paper-grain text-primary-foreground p-12 relative overflow-hidden">
        {/* Drifting ambient orbs */}
        <div className="absolute -top-28 -right-24 h-80 w-80 rounded-full bg-white/10 blur-2xl animate-drift" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10 blur-2xl animate-drift-slow" />
        <div className="absolute top-1/3 right-16 h-2 w-2 rounded-full bg-white/40 animate-drift" />
        <div className="absolute top-1/2 left-24 h-1.5 w-1.5 rounded-full bg-white/30 animate-drift-slow" />

        {/* Logo */}
        <div className="relative animate-rise" style={{ animationDelay: "40ms" }}>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-semibold">TrialSync</div>
              <div className="text-xs text-primary-foreground/75">Platform Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="relative space-y-5 max-w-md">
          <p className="eyebrow text-primary-foreground/70 animate-rise" style={{ animationDelay: "120ms" }}>
            Secure operational console
          </p>
          <h1 className="display-serif text-[2.6rem] leading-[1.08] animate-rise" style={{ animationDelay: "200ms" }}>
            Operational control for the entire platform.
          </h1>
          <p className="text-primary-foreground/80 text-sm leading-relaxed animate-rise" style={{ animationDelay: "280ms" }}>
            Manage users, organizations, trials, approvals and compliance from a single secure
            console. Every action is permanently logged to the immutable audit trail.
          </p>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/80 pt-2 animate-rise" style={{ animationDelay: "360ms" }}>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              HIPAA · GDPR · DPDPA 2023 · MFA enforced
            </span>
          </div>
        </div>

        <div className="relative text-[11px] text-primary-foreground/60 animate-rise" style={{ animationDelay: "440ms" }}>
          © 2026 TrialSync · Patient Visit Schedule
        </div>
      </div>

      {/* ── Form panel ──────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-6 lg:p-12 dawn-ambient">
        <div className="relative w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8 animate-rise">
            <div className="h-11 w-11 rounded-2xl dawn-gradient flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-base font-semibold text-primary">TrialSync</div>
              <div className="text-xs text-muted-foreground">Platform Admin Portal</div>
            </div>
          </div>

          <p className="eyebrow text-accent mb-2 animate-rise" style={{ animationDelay: "60ms" }}>Welcome back</p>
          <h2 className="display-serif text-3xl text-foreground mb-1.5 animate-rise" style={{ animationDelay: "120ms" }}>Admin sign in</h2>
          <p className="text-muted-foreground text-sm mb-8 animate-rise" style={{ animationDelay: "180ms" }}>Authorized platform administrators only.</p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
          >
            <div className="animate-rise" style={{ animationDelay: "240ms" }}>
              <label className="eyebrow block text-muted-foreground mb-1.5">Email address</label>
              <input
                type="email"
                defaultValue="drdineshyellamelli@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none transition-shadow"
              />
            </div>

            <div className="animate-rise" style={{ animationDelay: "300ms" }}>
              <label className="eyebrow block text-muted-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="password123"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="springy active:scale-90 absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between animate-rise" style={{ animationDelay: "360ms" }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-ring accent-[var(--primary)]"
                />
                <span className="text-sm text-muted-foreground">Remember this device</span>
              </label>
              <button type="button" className="text-sm text-primary font-semibold hover:underline">
                Forgot?
              </button>
            </div>

            <button
              type="submit"
              className="springy active:scale-[0.98] group w-full py-3.5 rounded-xl font-semibold dawn-gradient hero-glow text-primary-foreground flex items-center justify-center gap-2 animate-rise shadow-md"
              style={{ animationDelay: "420ms" }}
            >
              <Lock className="h-4 w-4" />
              Sign in to portal
              <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </button>
          </form>

          <div className="mt-6 flex items-start gap-2 rounded-xl bg-accent/8 border border-accent/20 px-3 py-2.5 animate-rise" style={{ animationDelay: "480ms" }}>
            <ShieldCheck className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Multi-factor authentication (TOTP) is enforced for all admin accounts. Sessions
              auto-expire after inactivity.
            </p>
          </div>

          {onBack && (
            <p className="text-center text-muted-foreground text-sm mt-6 animate-rise" style={{ animationDelay: "540ms" }}>
              Not an admin?{" "}
              <button onClick={onBack} className="text-primary font-semibold hover:underline">
                Back to app
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
