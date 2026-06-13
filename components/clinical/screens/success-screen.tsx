"use client"

import { Check } from "lucide-react"

interface SuccessScreenProps {
  onGoToSignIn: () => void
}

/**
 * Registration success — the first sunrise. The check rises as the dawn sun at
 * the crest of the journey arc, the completed steps glowing beneath it, with a
 * few petals drifting through the morning light. One clear action.
 */
export function SuccessScreen({ onGoToSignIn }: SuccessScreenProps) {
  return (
    <div className="h-full flex flex-col bg-background paper-grain dawn-ambient overflow-hidden px-7">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* ── Sunrise milestone ── */}
        <div className="relative mb-9 w-full max-w-[260px]">
          {/* drifting petals */}
          <span aria-hidden className="animate-drift absolute -top-2 right-8 h-2.5 w-2.5 rounded-full bg-accent/30" />
          <span aria-hidden className="animate-drift-slow absolute top-10 left-6 h-2 w-2 rounded-full bg-primary/20" />
          <span aria-hidden className="animate-drift absolute top-3 left-16 h-1.5 w-1.5 rounded-full bg-dawn-to/25" />

          {/* journey arc the sun crests on */}
          <svg viewBox="0 0 260 96" fill="none" aria-hidden className="w-full">
            <defs>
              <linearGradient id="success-dawn" x1="0" y1="86" x2="260" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="var(--dawn-from)" />
                <stop offset="0.55" stopColor="var(--dawn-mid)" />
                <stop offset="1" stopColor="var(--dawn-to)" />
              </linearGradient>
            </defs>
            <line x1="0" y1="86" x2="260" y2="86" stroke="var(--border)" strokeWidth="1" />
            <path
              d="M14 86 C 60 26, 200 26, 246 86"
              stroke="url(#success-dawn)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength="100"
              className="animate-arc"
            />
            {/* the completed registration steps */}
            <circle cx="46" cy="60" r="4.5" fill="var(--dawn-from)" />
            <circle cx="96" cy="38" r="4.5" fill="var(--dawn-mid)" />
            <circle cx="164" cy="38" r="4.5" fill="var(--dawn-mid)" />
            <circle cx="214" cy="60" r="4.5" fill="var(--dawn-to)" />
          </svg>

          {/* the sun — the check — rises into the crest */}
          <div className="animate-sun-rise absolute left-1/2 top-[2px] -translate-x-1/2">
            <span aria-hidden className="absolute -inset-5 rounded-full dawn-gradient opacity-25 blur-md" />
            <div className="hero-glow relative w-[68px] h-[68px] rounded-full dawn-gradient flex items-center justify-center shadow-lg">
              <Check className="w-8 h-8 text-primary-foreground" strokeWidth={2.75} />
            </div>
          </div>
        </div>

        <p className="eyebrow text-accent mb-2 animate-rise" style={{ animationDelay: "260ms" }}>
          Registration complete
        </p>
        <h2 className="display-serif text-[32px] leading-tight text-foreground mb-3 animate-rise" style={{ animationDelay: "340ms" }}>
          Welcome aboard<span className="dawn-text">.</span>
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[250px] animate-rise" style={{ animationDelay: "420ms" }}>
          Your account has been created successfully. Sign in to open your trial board.
        </p>
      </div>

      <div className="pb-9 animate-rise" style={{ animationDelay: "520ms" }}>
        <button
          onClick={onGoToSignIn}
          className="springy w-full py-4 rounded-full bg-primary text-primary-foreground text-[15px] font-semibold tracking-tight shadow-md transition-colors duration-200 hover:bg-primary-deep active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  )
}
