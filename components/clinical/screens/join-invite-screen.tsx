"use client"

import { AuthHeader } from "../auth-header"
import { useState } from "react"
import { Ticket, Building2, BadgeCheck, ArrowRight, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface JoinInviteScreenProps {
  /** Invite accepted — continue to set a password and finish joining. */
  onJoin: () => void
  onBack: () => void
}

/**
 * Join with an invite — the "I was invited" path off the welcome screen.
 *
 * Unlike "Register your organization", the joiner never picks an entity type:
 * the admin who sent the invite already chose the **site** and the **role**.
 * So we resolve the code to a pre-filled invitation card the user simply
 * accepts, then move straight to setting a password.
 *
 * Mock: any code resolves; "MTB-2026" shows the sample invitation below.
 */

// In production this comes from the backend after validating the code.
const RESOLVED_INVITE = {
  org: "Apollo Site 04",
  orgKind: "Site / Hospital",
  role: "Research Coordinator (CRC)",
  invitedBy: "Dr. Meera Nair",
  email: "you@apollosite04.org",
}

const SAMPLE_CODE = "MTB-2026"

export function JoinInviteScreen({ onJoin, onBack }: JoinInviteScreenProps) {
  const [code, setCode] = useState("")
  const [resolved, setResolved] = useState(false)

  const canVerify = code.trim().length >= 4

  const handleVerify = () => {
    if (!canVerify) return
    setResolved(true)
  }

  return (
    <div className="h-full flex flex-col bg-background paper-grain">
      <AuthHeader
        eyebrow="Join your team"
        title="Enter your invite"
        subtitle="Paste the code from the invitation your site admin sent you. No new site is created — you join theirs."
        onBack={onBack}
      />

      <div className="flex-1 px-6 pt-4 pb-2 overflow-auto">
        {/* ── Code entry ── */}
        <div
          className="rounded-2xl border border-border bg-card shadow-xs p-5 animate-rise"
          style={{ animationDelay: "160ms" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary">
              <Ticket className="w-3.5 h-3.5" />
            </span>
            <span className="eyebrow text-muted-foreground">Invitation code</span>
          </div>
          <input
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            placeholder={SAMPLE_CODE}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setResolved(false)
            }}
            className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-center font-mono text-lg tracking-[0.3em] text-foreground outline-none transition-all duration-200 placeholder:tracking-[0.3em] placeholder:text-muted-foreground/40 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {!resolved && (
            <button
              onClick={handleVerify}
              disabled={!canVerify}
              className={cn(
                "springy mt-3 w-full py-3 rounded-full text-sm font-semibold tracking-tight transition-all duration-200",
                canVerify
                  ? "bg-secondary text-primary hover:bg-secondary/70 active:scale-[0.98]"
                  : "bg-muted text-muted-foreground/60 cursor-not-allowed",
              )}
            >
              Find my invitation
            </button>
          )}
        </div>

        {/* ── Resolved invitation card ── */}
        {resolved && (
          <div
            className="mt-5 rounded-2xl border border-primary/25 bg-gradient-to-b from-secondary/40 to-card shadow-xs overflow-hidden animate-rise"
            style={{ animationDelay: "40ms" }}
          >
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <BadgeCheck className="w-4 h-4 text-accent" />
                <span className="eyebrow text-accent">You've been invited</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[19px] leading-snug text-primary">{RESOLVED_INVITE.org}</p>
                  <p className="text-[13px] text-muted-foreground">{RESOLVED_INVITE.orgKind}</p>
                </div>
              </div>

              <dl className="mt-4 space-y-2.5 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[13px] text-muted-foreground">Your role</dt>
                  <dd className="text-[13px] font-semibold text-foreground text-right">{RESOLVED_INVITE.role}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[13px] text-muted-foreground">Invited by</dt>
                  <dd className="text-[13px] font-semibold text-foreground text-right">{RESOLVED_INVITE.invitedBy}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" /> Account email
                  </dt>
                  <dd className="text-[13px] font-medium text-foreground text-right tabular-nums">{RESOLVED_INVITE.email}</dd>
                </div>
              </dl>
            </div>
            <p className="px-5 py-2.5 text-[12px] text-muted-foreground bg-surface/60 border-t border-border">
              Your role is set by your admin and can't be changed here.
            </p>
          </div>
        )}
      </div>

      {/* ── Action ── */}
      <div className="px-6 py-4 bg-background/90 backdrop-blur-sm border-t border-border">
        <button
          onClick={onJoin}
          disabled={!resolved}
          className={cn(
            "springy w-full py-4 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-200 flex items-center justify-center gap-2",
            resolved
              ? "bg-primary text-primary-foreground shadow-md hover:bg-primary-deep active:scale-[0.99]"
              : "bg-muted text-muted-foreground/60 cursor-not-allowed",
          )}
        >
          Accept &amp; continue
          {resolved && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
