"use client"

import { MtbLogoMark } from "@/components/clinical/mtb-logo"

interface WelcomeScreenProps {
  /** "Register your organization" — set up a new org/site and become its owner/admin. */
  onSignUp: () => void
  /** "Join with an invite" — attach to an existing site as a member via an invite code. */
  onJoinInvite: () => void
  onSignIn: () => void
}

/**
 * Welcome — the dawn cover page of the app.
 * Cream-blush paper, Bricolage display, and the sunrise motif: the patient's
 * journey drawn as an arc of visits with the sun (the next visit) rising
 * along it in the dawn gradient.
 *
 * Two entry intents, by action rather than self-declared role:
 *  • Register your organization → you're the first in → you become admin/owner.
 *  • Join with an invite        → you attach to an existing site → role comes from the invite.
 */
export function WelcomeScreen({ onSignUp, onJoinInvite, onSignIn }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col bg-background paper-grain dawn-ambient overflow-hidden">
      {/* ── Masthead ── */}
      <div className="relative pt-16 px-7 flex items-center gap-3 animate-rise" style={{ animationDelay: "60ms" }}>
        <MtbLogoMark className="w-10 h-10 rounded-xl shadow-sm" />
        <div className="flex-1">
          <p className="eyebrow text-primary">My Trial Board</p>
          <p className="text-[11px] text-muted-foreground">Patient Visit Schedule</p>
        </div>
        <span className="eyebrow text-muted-foreground/70 border border-border rounded-full px-2.5 py-1 bg-card/60">
          Est. 2026
        </span>
      </div>

      {/* hairline rule under the masthead */}
      <div className="mx-7 mt-5 h-px bg-border animate-rise" style={{ animationDelay: "140ms" }} />

      {/* ── Cover statement ── */}
      <div className="relative flex-1 px-7 pt-9 flex flex-col">
        <h1 className="display text-[40px] leading-[1.06] text-foreground animate-rise" style={{ animationDelay: "220ms" }}>
          Your trial,
          <br />
          one{" "}
          <span className="relative inline-block dawn-text">
            sunrise
            <span
              aria-hidden
              className="animate-draw-line absolute -bottom-1 left-0 right-0 h-[3px] rounded-full dawn-gradient"
            />
          </span>
          <br />
          at a time<span className="dawn-text">.</span>
        </h1>

        <p className="mt-5 max-w-[265px] text-[15px] leading-relaxed text-muted-foreground animate-rise" style={{ animationDelay: "320ms" }}>
          One warm place for sponsors, sites and patients to follow a clinical
          trial — visit by visit, morning by morning.
        </p>

        {/* ── Sunrise motif: the journey drawn as an arc of visits ── */}
        <div className="relative mt-auto animate-rise" style={{ animationDelay: "440ms" }}>
          {/* drifting petals */}
          <span aria-hidden className="animate-drift absolute -top-7 right-10 h-3 w-3 rounded-full bg-accent/30" />
          <span aria-hidden className="animate-drift-slow absolute -top-1 left-8 h-2 w-2 rounded-full bg-primary/20" />
          <span aria-hidden className="animate-drift absolute top-6 right-24 h-1.5 w-1.5 rounded-full bg-dawn-to/25" />

          <svg viewBox="0 0 340 130" fill="none" aria-hidden className="w-full">
            <defs>
              <linearGradient id="welcome-dawn" x1="0" y1="120" x2="340" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="var(--dawn-from)" />
                <stop offset="0.55" stopColor="var(--dawn-mid)" />
                <stop offset="1" stopColor="var(--dawn-to)" />
              </linearGradient>
            </defs>
            {/* horizon */}
            <line x1="0" y1="112" x2="340" y2="112" stroke="var(--border)" strokeWidth="1" />
            {/* the journey arc — sweeps in on load */}
            <path
              d="M10 112 C 70 30, 270 30, 330 112"
              stroke="url(#welcome-dawn)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength="100"
              className="animate-arc"
            />
            {/* completed visits */}
            <circle cx="58" cy="74" r="4.5" fill="var(--dawn-from)" />
            <circle cx="118" cy="44" r="4.5" fill="var(--dawn-mid)" />
            {/* future visits */}
            <circle cx="240" cy="49" r="4" fill="none" stroke="var(--dawn-to)" strokeOpacity="0.5" strokeWidth="1.5" />
            <circle cx="295" cy="84" r="4" fill="none" stroke="var(--dawn-to)" strokeOpacity="0.35" strokeWidth="1.5" />
          </svg>

          {/* the sun — the next visit — rises into place at the arc's crest */}
          <span aria-hidden className="animate-sun-rise absolute left-1/2 top-[8%] -translate-x-1/2">
            <span className="relative block">
              <span className="absolute -inset-3.5 rounded-full dawn-gradient opacity-25 blur-[6px]" />
              <span className="relative block h-7 w-7 rounded-full dawn-gradient shadow-md" />
            </span>
          </span>
        </div>
        <p className="eyebrow text-muted-foreground/60 pb-5 pt-1 animate-rise" style={{ animationDelay: "520ms" }}>
          Screening · Baseline · Follow-up · Completion
        </p>
      </div>

      {/* ── Actions ── */}
      {/* Two intents, by action: register a new org (→ owner/admin) or join an existing one (→ member). */}
      <div className="px-7 pb-9 space-y-3">
        <button
          onClick={onSignUp}
          className="springy w-full py-4 rounded-full bg-primary text-primary-foreground text-[15px] font-semibold tracking-tight shadow-md transition-colors duration-200 hover:bg-primary-deep active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background animate-rise"
          style={{ animationDelay: "560ms" }}
        >
          Register your organization
        </button>
        <button
          onClick={onJoinInvite}
          className="springy w-full py-4 rounded-full border border-primary/30 bg-card text-primary text-[15px] font-semibold tracking-tight transition-colors duration-200 hover:border-primary hover:bg-secondary/50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background animate-rise"
          style={{ animationDelay: "620ms" }}
        >
          Join with an invite
        </button>
        <p
          className="text-center text-sm text-muted-foreground pt-1 animate-rise"
          style={{ animationDelay: "680ms" }}
        >
          Already a member?{" "}
          <button
            onClick={onSignIn}
            className="font-semibold text-primary transition-colors hover:text-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
