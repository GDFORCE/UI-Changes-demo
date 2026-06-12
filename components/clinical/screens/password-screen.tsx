"use client"

import { AuthHeader } from "../auth-header"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PasswordScreenProps {
  onCreateAccount: () => void
  onBack: () => void
}

const inputClass =
  "w-full px-4 py-3 pr-12 rounded-lg border border-border bg-card text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/15"

export function PasswordScreen({ onCreateAccount, onBack }: PasswordScreenProps) {
  const [password, setPassword] = useState("MyP@ssw0rd")
  const [confirmPassword, setConfirmPassword] = useState("MyP@ssw0rd")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordRules = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  const metRules = passwordRules.filter((r) => r.met).length
  const strengthPercentage = (metRules / passwordRules.length) * 100
  const strength = strengthPercentage >= 80 ? "Strong" : strengthPercentage >= 60 ? "Medium" : "Weak"
  const passwordsMatch = password === confirmPassword && password.length > 0

  return (
    <div className="h-full flex flex-col bg-background paper-grain">
      <AuthHeader
        eyebrow="Step 5 of 5"
        title="Set your password"
        subtitle="This is the last step — your account is created right after."
        onBack={onBack}
        step={5}
      />

      <div className="flex-1 px-6 pt-3 pb-4 overflow-auto space-y-5">
        {/* Password Input */}
        <div className="animate-rise" style={{ animationDelay: "200ms" }}>
          <label className="block text-[13px] font-medium text-foreground/85 mb-1.5">
            Create Password <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
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
        </div>

        {/* Confirm Password */}
        <div className="animate-rise" style={{ animationDelay: "260ms" }}>
          <label className="block text-[13px] font-medium text-foreground/85 mb-1.5">
            Confirm Password <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
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
          {passwordsMatch && (
            <p className="text-success text-sm mt-1.5 flex items-center gap-1">
              <Check className="w-4 h-4" /> Passwords match
            </p>
          )}
        </div>

        {/* Strength + rules */}
        <div className="rounded-xl border border-border bg-card shadow-xs p-4 animate-rise" style={{ animationDelay: "320ms" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="eyebrow text-muted-foreground">Password strength</span>
            <span
              className={cn(
                "text-sm font-semibold",
                strength === "Strong" ? "text-success" : strength === "Medium" ? "text-warning" : "text-destructive",
              )}
            >
              {strength}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                strength === "Strong" ? "bg-success" : strength === "Medium" ? "bg-warning" : "bg-destructive",
              )}
              style={{ width: `${strengthPercentage}%` }}
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

      {/* Create Account Button */}
      <div className="px-6 py-4 bg-background/90 backdrop-blur-sm border-t border-border">
        <button
          onClick={onCreateAccount}
          disabled={metRules < 5 || !passwordsMatch}
          className={cn(
            "w-full py-4 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-200",
            metRules === 5 && passwordsMatch
              ? "bg-primary text-primary-foreground shadow-md hover:bg-primary-deep active:scale-[0.99]"
              : "bg-muted text-muted-foreground/60 cursor-not-allowed",
          )}
        >
          Create Account
        </button>
      </div>
    </div>
  )
}
