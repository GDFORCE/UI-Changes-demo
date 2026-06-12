"use client"

import { MtbLogoMark } from "@/components/clinical/mtb-logo"

interface WelcomeScreenProps {
  onSignUp: () => void
  onSignIn: () => void
  onForgotPassword: () => void
}

/**
 * Welcome — the editorial cover page of the app.
 * Ivory paper, Fraunces display serif, a single coral accent, and the
 * journey-line motif (the patient's path across visits) drawn across the page.
 */
export function WelcomeScreen({ onSignUp, onSignIn, onForgotPassword }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col bg-background paper-grain overflow-hidden">
      {/* ── Masthead ── */}
      <div className="relative pt-16 px-7 flex items-center gap-3 animate-rise" style={{ animationDelay: "60ms" }}>
        <MtbLogoMark className="w-10 h-10 rounded-xl shadow-sm" />
        <div className="flex-1">
          <p className="eyebrow text-primary">My Trial Board</p>
          <p className="text-[11px] text-muted-foreground">Patient Visit Schedule</p>
        </div>
        <span className="eyebrow text-muted-foreground/70 border border-border rounded-full px-2.5 py-1">
          Est. 2026
        </span>
      </div>

      {/* hairline rule under the masthead */}
      <div className="mx-7 mt-5 h-px bg-border animate-rise" style={{ animationDelay: "140ms" }} />

      {/* ── Cover statement ── */}
      <div className="relative flex-1 px-7 pt-10 flex flex-col">
        <h1 className="display-serif text-[40px] leading-[1.08] text-foreground animate-rise" style={{ animationDelay: "220ms" }}>
          Every visit,
          <br />
          beautifully
          <br />
          <span className="relative inline-block text-primary">
            on schedule
            <span
              aria-hidden
              className="animate-draw-line absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-accent"
            />
          </span>
          <span className="text-accent">.</span>
        </h1>

        <p className="mt-5 max-w-[260px] text-[15px] leading-relaxed text-muted-foreground animate-rise" style={{ animationDelay: "320ms" }}>
          One calm place for sponsors, sites and patients to follow a clinical
          trial — visit by visit.
        </p>

        {/* ── Journey-line motif: the patient's path across visits ── */}
        <svg
          viewBox="0 0 340 120"
          fill="none"
          aria-hidden
          className="mt-auto w-full text-primary/30 animate-rise"
          style={{ animationDelay: "440ms" }}
        >
          <path
            d="M-10 95 C 60 95, 75 38, 130 38 S 215 86, 268 70, 330 24, 360 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
          {/* completed visits */}
          <circle cx="46" cy="83" r="4" className="fill-primary/40" />
          <circle cx="130" cy="38" r="4" className="fill-primary/40" />
          {/* the next visit — the patient, in coral */}
          <g>
            <circle cx="225" cy="78" r="11" className="fill-accent/15" />
            <circle cx="225" cy="78" r="5.5" className="fill-accent" />
          </g>
          {/* future visits */}
          <circle cx="300" cy="42" r="4" className="fill-none stroke-primary/40" strokeWidth="1.5" />
        </svg>
        <p className="eyebrow text-muted-foreground/60 pb-5 animate-rise" style={{ animationDelay: "500ms" }}>
          Screening · Baseline · Follow-up · Completion
        </p>
      </div>

      {/* ── Actions ── */}
      <div className="px-7 pb-9 space-y-3">
        <button
          onClick={onSignUp}
          className="w-full py-4 rounded-full bg-primary text-primary-foreground text-[15px] font-semibold tracking-tight shadow-md transition-all duration-200 hover:bg-primary-deep active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background animate-rise"
          style={{ animationDelay: "560ms" }}
        >
          Create an account
        </button>
        <button
          onClick={onSignIn}
          className="w-full py-4 rounded-full border border-primary/30 bg-card text-primary text-[15px] font-semibold tracking-tight transition-all duration-200 hover:border-primary hover:bg-secondary/50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background animate-rise"
          style={{ animationDelay: "620ms" }}
        >
          Sign in
        </button>
        <button
          onClick={onForgotPassword}
          className="w-full py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md animate-rise"
          style={{ animationDelay: "680ms" }}
        >
          Forgot password?
        </button>
      </div>
    </div>
  )
}
