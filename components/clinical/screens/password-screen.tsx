"use client"

import { AppBar } from "../app-bar"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PasswordScreenProps {
  onCreateAccount: () => void
  onBack: () => void
}

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
  const passwordsMatch = password === confirmPassword && password.length > 0

  return (
    <div className="h-full flex flex-col bg-card">
      <AppBar title="Create Password" showBack onBack={onBack} />
      
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Create Password *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Confirm Password *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {passwordsMatch && (
            <p className="text-accent text-sm mt-1 flex items-center gap-1">
              <Check className="w-4 h-4" /> Passwords match
            </p>
          )}
        </div>

        {/* Strength Bar + Rules — shown below both password fields */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-info to-accent transition-all"
                style={{ width: `${strengthPercentage}%` }}
              />
            </div>
            <span className={cn(
              "text-sm font-medium",
              strengthPercentage >= 80 ? "text-accent" : strengthPercentage >= 60 ? "text-warning" : "text-destructive"
            )}>
              {strengthPercentage >= 80 ? "Strong" : strengthPercentage >= 60 ? "Medium" : "Weak"}
            </span>
          </div>

          {/* Rules Checklist */}
          <div className="space-y-1.5">
            {passwordRules.map((rule) => (
              <div key={rule.label} className="flex items-center gap-2">
                {rule.met ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground/70" />
                )}
                <span className={cn("text-sm", rule.met ? "text-accent" : "text-muted-foreground")}>
                  {rule.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Create Account Button */}
      <div className="px-6 py-4">
        <button
          onClick={onCreateAccount}
          className="w-full py-4 rounded-full font-semibold bg-primary text-white transition-all duration-200 hover:bg-primary-deep active:scale-[0.99]"
        >
          Create Account
        </button>
      </div>
    </div>
  )
}
