"use client"

import { Building2, Eye, EyeOff, Lock, ShieldQuestion, AlertCircle } from "lucide-react"
import { useState } from "react"

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

  const remaining = MAX_ATTEMPTS - attempts

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
      <div className="h-full flex flex-col bg-surface">
        <div className="flex-1 px-6 py-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center">
              <Lock className="w-10 h-10 text-destructive" />
            </div>
          </div>

          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground text-center mb-1">Account Locked</h2>
          <p className="text-muted-foreground text-center mb-8">
            Too many incorrect password attempts. Answer your security question to unlock your account.
          </p>

          <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
            <div className="flex items-start gap-2">
              <ShieldQuestion className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-foreground">{SECURITY_QUESTION}</p>
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
                className={`w-full px-4 py-3 rounded-xl border outline-none bg-card focus:ring-2 ${
                  unlockError
                    ? "border-red-500 focus:ring-destructive/15"
                    : "border-border focus:border-primary focus:ring-info/15"
                }`}
              />
              {unlockError && <p className="text-xs text-destructive mt-1.5">{unlockError}</p>}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          <button
            onClick={handleUnlock}
            disabled={!securityAnswer.trim()}
            className="w-full py-4 rounded-full font-semibold bg-primary text-white transition-all duration-200 hover:bg-primary-deep active:scale-[0.99] disabled:bg-muted-foreground/30 disabled:text-white"
          >
            Unlock Account
          </button>
          <button onClick={onForgotPassword} className="w-full text-center text-sm text-primary font-medium">
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
    <div className="h-full flex flex-col bg-surface">
      <div className="flex-1 px-6 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
            <Building2 className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground text-center mb-1">
          Welcome Back 👋
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Sign in to continue
        </p>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Email or Phone</label>
            <input
              type="text"
              defaultValue="john.doe@example.com"
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError("")
                }}
                className={`w-full px-4 py-3 pr-12 rounded-xl border outline-none bg-card focus:ring-2 ${
                  error ? "border-red-500 focus:ring-destructive/15" : "border-border focus:border-primary focus:ring-info/15"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <div className="flex items-start gap-1.5 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}
          </div>

          {/* Remember Me & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <button onClick={onForgotPassword} className="text-sm text-primary font-medium">
              Forgot?
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 py-4 space-y-4">
        <button
          onClick={handleSignIn}
          className="w-full py-4 rounded-full font-semibold bg-primary text-white transition-all duration-200 hover:bg-primary-deep active:scale-[0.99]"
        >
          Sign In
        </button>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-muted-foreground text-sm">
          {"Don't have an account? "}
          <button onClick={onSignUp} className="text-primary font-semibold">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
