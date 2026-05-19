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
    <div className="h-full flex flex-col bg-white">
      <AppBar title="Create Password" showBack onBack={onBack} />
      
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Create Password *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Strength Bar */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#0D9488] transition-all"
                style={{ width: `${strengthPercentage}%` }}
              />
            </div>
            <span className={cn(
              "text-sm font-medium",
              strengthPercentage >= 80 ? "text-[#0D9488]" : strengthPercentage >= 60 ? "text-[#D97706]" : "text-[#DC2626]"
            )}>
              {strengthPercentage >= 80 ? "Strong" : strengthPercentage >= 60 ? "Medium" : "Weak"}
            </span>
          </div>
          
          {/* Rules Checklist */}
          <div className="space-y-1.5">
            {passwordRules.map((rule) => (
              <div key={rule.label} className="flex items-center gap-2">
                {rule.met ? (
                  <Check className="w-4 h-4 text-[#0D9488]" />
                ) : (
                  <X className="w-4 h-4 text-gray-400" />
                )}
                <span className={cn("text-sm", rule.met ? "text-[#0D9488]" : "text-gray-500")}>
                  {rule.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {passwordsMatch && (
            <p className="text-[#0D9488] text-sm mt-1 flex items-center gap-1">
              <Check className="w-4 h-4" /> Passwords match
            </p>
          )}
        </div>
      </div>
      
      {/* Create Account Button */}
      <div className="px-6 py-4">
        <button
          onClick={onCreateAccount}
          className="w-full py-4 rounded-full font-semibold bg-[#1A3872] text-white"
        >
          Create Account
        </button>
      </div>
    </div>
  )
}
