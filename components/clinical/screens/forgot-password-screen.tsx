"use client"

import { useState } from "react"
import { Mail, Phone, Check, X, Eye, EyeOff, HelpCircle } from "lucide-react"
import { AuthHeader } from "../auth-header"
import { cn } from "@/lib/utils"

interface ForgotPasswordScreenProps {
  onBack?: () => void
  onSuccess?: () => void
}

// Mock list of accounts known to the system. In production this check is done server-side.
const registeredAccounts = [
  "rajesh.kumar@pharmaco.com",
  "+919876543210",
  "priya.kumar@gmail.com",
  "+919812345678",
  "dr.sharma@apollo.com",
]

const normalize = (value: string) => value.trim().toLowerCase().replace(/[\s\-()]/g, "")

const isRegistered = (value: string) => {
  const v = normalize(value)
  return registeredAccounts.some((acc) => normalize(acc) === v)
}

const inputClass =
  "w-full px-4 py-3 rounded-lg border bg-card text-sm text-foreground placeholder:text-muted-foreground/55 outline-none transition-colors focus:ring-2"

const okInput = "border-border focus:border-accent focus:ring-accent/15"
const errInput = "border-destructive focus:ring-destructive/15"

const primaryButton =
  "w-full py-4 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-200 bg-primary text-primary-foreground shadow-md hover:bg-primary-deep active:scale-[0.99] disabled:bg-muted disabled:text-muted-foreground/60 disabled:shadow-none disabled:cursor-not-allowed"

export function ForgotPasswordScreen({ onBack, onSuccess }: ForgotPasswordScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [accountError, setAccountError] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [timer, setTimer] = useState(120)

  const passwordRules = [
    { label: "8+ characters", met: newPassword.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "Lowercase letter", met: /[a-z]/.test(newPassword) },
    { label: "Number", met: /[0-9]/.test(newPassword) },
    { label: "Special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ]

  const metRulesCount = passwordRules.filter((r) => r.met).length
  const passwordStrength = metRulesCount <= 2 ? "Weak" : metRulesCount <= 4 ? "Medium" : "Strong"
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      const nextInput = document.getElementById(`forgot-otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendResetLink = () => {
    if (!isRegistered(emailOrPhone)) {
      setAccountError("This email or phone number is not registered with any account.")
      return
    }
    setAccountError("")
    setStep(2)
    // Start timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stepMeta = {
    1: {
      eyebrow: "Account recovery",
      title: "Forgot your password?",
      subtitle: "Enter the email or phone number registered with your account and we'll send you a verification code.",
    },
    2: {
      eyebrow: "Account recovery",
      title: "Check your messages",
      subtitle: undefined,
    },
    3: {
      eyebrow: "Account recovery",
      title: "Set a new password",
      subtitle: "Choose a strong password you haven't used before.",
    },
  } as const

  return (
    <div className="flex flex-col h-full bg-background paper-grain">
      {step < 4 && (
        <AuthHeader
          eyebrow={stepMeta[step].eyebrow}
          title={stepMeta[step].title}
          subtitle={stepMeta[step].subtitle}
          onBack={() => (step === 1 ? onBack?.() : setStep((step - 1) as 1 | 2 | 3))}
          step={step}
          totalSteps={3}
        />
      )}

      {/* Step 1: Enter Email/Phone */}
      {step === 1 && (
        <div className="flex-1 flex flex-col px-6 pt-4 pb-9">
          <div className="rounded-xl border border-border bg-card shadow-xs p-5 animate-rise" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <span className="eyebrow text-muted-foreground">Registered contact</span>
            </div>
            <input
              type="text"
              placeholder="Email or phone number"
              value={emailOrPhone}
              onChange={(e) => {
                setEmailOrPhone(e.target.value)
                if (accountError) setAccountError("")
              }}
              className={cn(inputClass, accountError ? errInput : okInput)}
            />
            {accountError && <p className="text-xs text-destructive mt-1.5 leading-relaxed">{accountError}</p>}
          </div>

          <div className="mt-auto space-y-5">
            <button onClick={handleSendResetLink} disabled={!emailOrPhone} className={primaryButton}>
              Send verification code
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Need help? Contact Support
            </button>
          </div>
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <div className="flex-1 flex flex-col px-6 pt-4 pb-9">
          <div className="rounded-xl border border-border bg-card shadow-xs p-5 animate-rise" style={{ animationDelay: "160ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary">
                <Phone className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm text-muted-foreground">
                Code sent to <span className="font-medium text-foreground">{emailOrPhone || "+91 98XXXXXXXX"}</span>
              </span>
            </div>
            <div className="flex justify-between gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`forgot-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className={cn(
                    "w-11 h-14 text-center font-heading text-xl rounded-lg border outline-none transition-all bg-background",
                    digit ? "border-primary/50 bg-secondary/40 text-primary" : "border-border focus:border-accent focus:ring-2 focus:ring-accent/15",
                  )}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Expires in <span className="font-semibold text-primary tabular-nums">{formatTime(timer)}</span>
              </p>
              <button onClick={() => setTimer(120)} className="text-sm text-accent font-semibold hover:underline underline-offset-2">
                Resend OTP
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <button onClick={() => setStep(3)} disabled={otp.some((d) => !d)} className={primaryButton}>
              Verify OTP
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Set New Password */}
      {step === 3 && (
        <div className="flex-1 flex flex-col px-6 pt-4 pb-9 overflow-auto">
          <div className="space-y-4">
            <div className="animate-rise" style={{ animationDelay: "160ms" }}>
              <label className="block text-[13px] font-medium text-foreground/85 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={cn(inputClass, okInput, "pr-12")}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="animate-rise" style={{ animationDelay: "220ms" }}>
              <label className="block text-[13px] font-medium text-foreground/85 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(inputClass, okInput, "pr-12")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && (
                <p className={cn("text-xs mt-1.5", passwordsMatch ? "text-success" : "text-destructive")}>
                  {passwordsMatch ? "Passwords match" : "Passwords don't match"}
                </p>
              )}
            </div>

            {/* Strength + rules */}
            <div className="rounded-xl border border-border bg-card shadow-xs p-4 animate-rise" style={{ animationDelay: "280ms" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="eyebrow text-muted-foreground">Password strength</span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    metRulesCount === 5 ? "text-success" : metRulesCount >= 3 ? "text-warning" : "text-destructive",
                  )}
                >
                  {passwordStrength}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    metRulesCount === 5 ? "bg-success" : metRulesCount >= 3 ? "bg-warning" : "bg-destructive",
                  )}
                  style={{ width: `${(metRulesCount / 5) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {passwordRules.map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full",
                        rule.met ? "bg-success/15 text-success" : "bg-muted text-muted-foreground/50",
                      )}
                    >
                      {rule.met ? <Check className="w-3 h-3" strokeWidth={3} /> : <X className="w-3 h-3" />}
                    </span>
                    <span className={cn("text-[13px]", rule.met ? "text-foreground/80" : "text-muted-foreground")}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button onClick={() => setStep(4)} disabled={metRulesCount < 5 || !passwordsMatch} className={primaryButton}>
              Reset Password
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="flex-1 flex flex-col px-7">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8 animate-rise" style={{ animationDelay: "80ms" }}>
              <span aria-hidden className="absolute inset-0 rounded-full bg-success/10 scale-[1.7]" />
              <span aria-hidden className="absolute inset-0 rounded-full bg-success/15 scale-[1.32]" />
              <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Check className="w-9 h-9 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span aria-hidden className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-accent ring-4 ring-background" />
            </div>
            <p className="eyebrow text-accent mb-2 animate-rise" style={{ animationDelay: "180ms" }}>
              Password reset
            </p>
            <h2 className="display-serif text-[30px] leading-tight text-foreground mb-3 animate-rise" style={{ animationDelay: "260ms" }}>
              All set.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[250px] animate-rise" style={{ animationDelay: "340ms" }}>
              Your password has been reset successfully. Sign in with your new password.
            </p>
          </div>
          <div className="pb-9 animate-rise" style={{ animationDelay: "440ms" }}>
            <button onClick={() => onSuccess?.()} className={primaryButton}>
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
