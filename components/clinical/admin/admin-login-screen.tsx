"use client";

import { useState } from "react";
import { Building2, Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";

interface AdminLoginScreenProps {
  onLogin: () => void;
  onBack?: () => void;
}

export function AdminLoginScreen({ onLogin, onBack }: AdminLoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface">
      {/* ── Brand panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between bg-primary text-white p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-semibold">TrialSync</div>
              <div className="text-xs text-primary-foreground/75">Platform Admin Portal</div>
            </div>
          </div>
        </div>
        <div className="relative space-y-4 max-w-md">
          <h1 className="text-3xl font-bold leading-tight">
            Operational control for the entire platform.
          </h1>
          <p className="text-primary-foreground/75 text-sm leading-relaxed">
            Manage users, organizations, trials, approvals and compliance from a single secure
            console. Every action is permanently logged to the immutable audit trail.
          </p>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/75 pt-2">
            <ShieldCheck className="h-4 w-4" />
            HIPAA · GDPR · DPDPA 2023 compliant · MFA enforced
          </div>
        </div>
        <div className="relative text-[11px] text-blue-300">
          © 2026 TrialSync · Patient Visit Schedule
        </div>
      </div>

      {/* ── Form panel ──────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-base font-semibold text-primary">TrialSync</div>
              <div className="text-xs text-muted-foreground">Platform Admin Portal</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Admin sign in</h2>
          <p className="text-muted-foreground text-sm mb-8">Authorized platform administrators only.</p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
          >
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Email address</label>
              <input
                type="email"
                defaultValue="drdineshyellamelli@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="password123"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">Remember this device</span>
              </label>
              <button type="button" className="text-sm text-primary font-medium">
                Forgot?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Sign in to portal
            </button>
          </form>

          <div className="mt-6 flex items-start gap-2 rounded-xl bg-info/5 border border-info/20 px-3 py-2.5">
            <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Multi-factor authentication (TOTP) is enforced for all admin accounts. Sessions
              auto-expire after inactivity.
            </p>
          </div>

          {onBack && (
            <p className="text-center text-muted-foreground text-sm mt-6">
              Not an admin?{" "}
              <button onClick={onBack} className="text-primary font-semibold">
                Back to app
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
