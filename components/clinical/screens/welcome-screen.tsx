"use client"

import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

interface WelcomeScreenProps {
  onSignUp: () => void
  onSignIn: () => void
  onForgotPassword: () => void
}

export function WelcomeScreen({ onSignUp, onSignIn, onForgotPassword }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Gradient Background */}
      <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-primary-deep via-primary to-accent/70 flex flex-col items-center justify-center px-6">
        {/* Soft radial glow for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_38%,rgba(255,255,255,0.14),transparent_70%)]"
        />
        {/* Logo */}
        <div className="relative w-24 h-24 bg-card rounded-2xl flex items-center justify-center mb-6 shadow-lg ring-1 ring-white/20">
          <Building2 className="w-12 h-12 text-primary" />
        </div>

        {/* Title */}
        <h1 className="relative font-heading text-3xl font-bold tracking-tight text-white text-center mb-2">
          My Trial Board
        </h1>
        <p className="relative text-base text-white/75 text-center">
          Visit Schedule Management
        </p>
      </div>

      {/* Bottom Card */}
      <div className="bg-card rounded-t-3xl -mt-8 relative px-6 py-8 space-y-4 shadow-lg">
        <Button
          onClick={onSignUp}
          className="w-full bg-primary hover:bg-primary-deep text-white rounded-full py-6 text-base font-semibold transition-all duration-200 active:scale-[0.99]"
        >
          Sign Up
        </Button>
        <Button
          onClick={onSignIn}
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/5 hover:text-primary rounded-full py-6 text-base font-semibold transition-all duration-200 active:scale-[0.99]"
        >
          Sign In
        </Button>
        <button
          onClick={onForgotPassword}
          className="w-full rounded-md text-primary text-sm font-medium py-2 transition-colors hover:text-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  )
}
