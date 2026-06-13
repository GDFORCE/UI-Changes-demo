"use client"

import { Lock, RefreshCw } from "lucide-react"

interface SessionTimeoutScreenProps {
  onSignIn?: () => void
}

/**
 * Session expired — a gentle dusk moment. The lock rests in a soft dawn glow
 * over cream-blush paper, with the same eyebrow + Bricolage display voice as the
 * rest of the auth flow. One clear way back in.
 */
export function SessionTimeoutScreen({ onSignIn }: SessionTimeoutScreenProps) {
  return (
    <div className="h-full flex flex-col bg-background paper-grain dawn-ambient overflow-hidden px-7">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* lock resting in a soft dawn glow */}
        <div className="relative mb-8 animate-sun-rise" style={{ animationDelay: "80ms" }}>
          <span aria-hidden className="absolute -inset-5 rounded-full dawn-gradient opacity-20 blur-md" />
          <span aria-hidden className="absolute inset-0 rounded-full bg-accent/10 scale-[1.55]" />
          <div className="hero-glow relative w-[72px] h-[72px] rounded-full bg-card border border-border flex items-center justify-center shadow-md">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>

        <p className="eyebrow text-accent mb-2 animate-rise" style={{ animationDelay: "260ms" }}>
          Signed out
        </p>
        <h2 className="display-serif text-[32px] leading-tight text-foreground mb-3 animate-rise" style={{ animationDelay: "340ms" }}>
          Session expired<span className="dawn-text">.</span>
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[250px] animate-rise" style={{ animationDelay: "420ms" }}>
          You were signed out after a period of inactivity. Sign in again to pick up where you left off.
        </p>
      </div>

      <div className="pb-9 animate-rise" style={{ animationDelay: "520ms" }}>
        <button
          onClick={onSignIn}
          className="springy w-full flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-primary-foreground text-[15px] font-semibold tracking-tight shadow-md transition-colors duration-200 hover:bg-primary-deep active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <RefreshCw className="w-4 h-4" />
          Sign in again
        </button>
      </div>
    </div>
  )
}
