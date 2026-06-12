"use client"

import { Check } from "lucide-react"

interface SuccessScreenProps {
  onGoToSignIn: () => void
}

/**
 * Registration success — a quiet editorial moment: serif statement, a coral
 * milestone dot joining the journey line, one clear action.
 */
export function SuccessScreen({ onGoToSignIn }: SuccessScreenProps) {
  return (
    <div className="h-full flex flex-col bg-background paper-grain px-7">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Milestone mark */}
        <div className="relative mb-8 animate-rise" style={{ animationDelay: "80ms" }}>
          <span aria-hidden className="absolute inset-0 rounded-full bg-success/10 scale-[1.7]" />
          <span aria-hidden className="absolute inset-0 rounded-full bg-success/15 scale-[1.32]" />
          <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Check className="w-9 h-9 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span
            aria-hidden
            className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-accent ring-4 ring-background"
          />
        </div>

        <p className="eyebrow text-accent mb-2 animate-rise" style={{ animationDelay: "180ms" }}>
          Registration complete
        </p>
        <h2 className="display-serif text-[32px] leading-tight text-foreground mb-3 animate-rise" style={{ animationDelay: "260ms" }}>
          Welcome aboard.
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[250px] animate-rise" style={{ animationDelay: "340ms" }}>
          Your account has been created successfully. Sign in to open your trial board.
        </p>
      </div>

      <div className="pb-9 animate-rise" style={{ animationDelay: "440ms" }}>
        <button
          onClick={onGoToSignIn}
          className="w-full py-4 rounded-full bg-primary text-primary-foreground text-[15px] font-semibold tracking-tight shadow-md transition-all duration-200 hover:bg-primary-deep active:scale-[0.99]"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  )
}
