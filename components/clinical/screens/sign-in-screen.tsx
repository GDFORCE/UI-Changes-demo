"use client"

import { Eye, EyeOff, Lock, ShieldQuestion, AlertCircle } from "lucide-react"
import { MtbLogoMark } from "@/components/clinical/mtb-logo"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SignInScreenProps {
  onSignIn: () => void
  onSignUp: () => void
  onForgotPassword: () => void
}

// Mock account credentials. In production these checks happen server-side.
const CORRECT_PASSWORD = "password123"
const MAX_ATTEMPTS = 5
const SECURITY_QUESTION = "What is the name of your first pet?"
const CORRECT_SECURITY_ANSWER = "bruno"

const inputClass =
  "w-full px-4 py-3 rounded-lg border bg-card text-sm text-foreground outline-none transition-colors focus:ring-2"

export function SignInScreen({ onSignIn, onSignUp, onForgotPassword }: SignInScreenProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [password, setPassword] = useState("password123")
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState("")
  const [locked, setLocked] = useState(false)

  // Unlock flow
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [unlockError, setUnlockError] = useState("")

  const handleSignIn = () => {
    if (locked) return
    if (password === CORRECT_PASSWORD) {
      setError("")
      setAttempts(0)
      onSignIn()
      return
    }
    const next = attempts + 1
    setAttempts(next)
    if (next >= MAX_ATTEMPTS) {
      setLocked(true)
      setError("")
    } else {
      const left = MAX_ATTEMPTS - next
      setError(`Incorrect password. ${left} attempt${left === 1 ? "" : "s"} remaining before your account is locked.`)
    }
  }

  const handleUnlock = () => {
    if (securityAnswer.trim().toLowerCase() === CORRECT_SECURITY_ANSWER) {
      // Correct answer — unlock and reset everything.
      setLocked(false)
      setAttempts(0)
      setError("")
      setUnlockError("")
      setSecurityAnswer("")
      setPassword("")
    } else {
      setUnlockError("Incorrect answer. Please try again.")
    }
  }

  /* ---------------------------------------------------------------- */
  /* Locked state — must answer the security question to regain access */
  /* ---------------------------------------------------------------- */
  if (locked) {
    return (
      <div className="h-full flex flex-col bg-background paper-grain">
        <div className="flex-1 px-7 pt-14 overflow-auto">
          <div className="flex justify-center mb-7 animate-rise" style={{ animationDelay: "60ms" }}>
            <div className="w-18 h-18 p-5 bg-destructive/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
          </div>

          <p className="eyebrow text-destructive text-center mb-2 animate-rise" style={{ animationDelay: "120ms" }}>
            Too many attempts
          </p>
          <h2 className="display-serif text-[28px] leading-tight text-foreground text-center mb-2.5 animate-rise" style={{ animationDelay: "180ms" }}>
            Account locked
          </h2>
          <p className="text-sm text-muted-foreground text-center leading-relaxed mb-8 animate-rise" style={{ animationDelay: "240ms" }}>
            Answer your security question to unlock your account.
          </p>

          <div className="rounded-xl border border-border bg-card shadow-xs p-5 space-y-4 animate-rise" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-2.5">
              <ShieldQuestion className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-foreground leading-relaxed">{SECURITY_QUESTION}</p>
            </div>
            <div>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => {
                  setSecurityAnswer(e.target.value)
                  if (unlockError) setUnlockError("")
                }}
                placeholder="Your answer"
                className={cn(
                  inputClass,
                  "placeholder:text-muted-foreground/55",
                  unlockError ? "border-destructive focus:ring-destructive/15" : "border-border focus:border-accent focus:ring-accent/15",
                )}
              />
              {unlockError && <p className="text-xs text-destructive mt-1.5">{unlockError}</p>}
            </div>
          </div>
        </div>

        <div className="px-7 pb-9 pt-4 space-y-4">
          <button
            onClick={handleUnlock}
            disabled={!securityAnswer.trim()}
            className={cn(
              "w-full py-4 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-200",
              securityAnswer.trim()
                ? "bg-primary text-primary-foreground shadow-md hover:bg-primary-deep active:scale-[0.99]"
                : "bg-muted text-muted-foreground/60 cursor-not-allowed",
            )}
          >
            Unlock Account
          </button>
          <button onClick={onForgotPassword} className="w-full text-center text-sm text-primary font-medium hover:text-accent transition-colors">
            Forgot your security answer? Reset password
          </button>
        </div>
      </div>
    )
  }

  /* ---------------------------------------------------------------- */
  /* Normal sign-in                                                    */
  /* ---------------------------------------------------------------- */
  return (
    <div className="h-full flex flex-col bg-background paper-grain dawn-ambient overflow-hidden">
      <div className="flex-1 px-7 pt-12 overflow-auto">
        {/* Masthead */}
        <div className="relative flex justify-center mb-6 animate-rise" style={{ animationDelay: "60ms" }}>
          <span aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full dawn-gradient opacity-20 blur-lg" />
          <MtbLogoMark className="relative w-16 h-16 rounded-2xl shadow-md" />
        </div>

        <p className="eyebrow text-accent text-center mb-1.5 animate-rise" style={{ animationDelay: "120ms" }}>
          My Trial Board
        </p>
        <h2 className="display-serif text-[30px] leading-tight text-foreground text-center mb-2 animate-rise" style={{ animationDelay: "180ms" }}>
          Welcome{" "}
          <span className="relative inline-block">
            back
            <span
              aria-hidden
              className="animate-draw-line absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full dawn-gradient"
            />
          </span>
          <span className="dawn-text">.</span>
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-9 animate-rise" style={{ animationDelay: "240ms" }}>
          Sign in to open your trial board
        </p>

        {/* Form */}
        <div className="space-y-4">
          <div className="animate-rise" style={{ animationDelay: "300ms" }}>
            <label className="block text-[13px] font-medium text-foreground/85 mb-1.5">Email or Phone</label>
            <input
              type="text"
              defaultValue="john.doe@example.com"
              className={cn(inputClass, "border-border focus:border-accent focus:ring-accent/15")}
            />
          </div>

          <div className="animate-rise" style={{ animationDelay: "360ms" }}>
            <label className="block text-[13px] font-medium text-foreground/85 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError("")
                }}
                className={cn(
                  inputClass,
                  "pr-12",
                  error ? "border-destructive focus:ring-destructive/15" : "border-border focus:border-accent focus:ring-accent/15",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <div className="flex items-start gap-1.5 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                <p className="text-xs text-destructive leading-relaxed">{error}</p>
              </div>
            )}
          </div>

          {/* Remember Me & Forgot */}
          <div className="flex items-center justify-between animate-rise" style={{ animationDelay: "420ms" }}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-[var(--primary)]"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <button onClick={onForgotPassword} className="text-sm text-accent font-medium hover:underline underline-offset-2">
              Forgot?
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-7 pb-9 pt-4 space-y-4">
        <button
          onClick={handleSignIn}
          className="springy w-full py-4 rounded-full bg-primary text-primary-foreground text-[15px] font-semibold tracking-tight shadow-md transition-colors duration-200 hover:bg-primary-deep active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background animate-rise"
          style={{ animationDelay: "480ms" }}
        >
          Sign In
        </button>

        <div className="flex items-center gap-4 animate-rise" style={{ animationDelay: "520ms" }}>
          <div className="flex-1 h-px bg-border" />
          <span className="eyebrow text-muted-foreground/60">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-muted-foreground text-sm animate-rise" style={{ animationDelay: "560ms" }}>
          {"Don't have an account? "}
          <button onClick={onSignUp} className="text-primary font-semibold hover:text-accent transition-colors">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
