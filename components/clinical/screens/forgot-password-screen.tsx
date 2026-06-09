"use client"

import { useState } from "react"
import { ArrowLeft, Mail, Phone, CheckCircle, Eye, EyeOff, Check, X, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    { label: "Minimum 8 characters", met: newPassword.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "Lowercase letter", met: /[a-z]/.test(newPassword) },
    { label: "Numeric character", met: /[0-9]/.test(newPassword) },
    { label: "Special character (!@#$%...)", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
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

  const handleVerifyOtp = () => {
    setStep(3)
  }

  const handleResetPassword = () => {
    setStep(4)
  }

  const handleBackToSignIn = () => {
    onSuccess?.()
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      {step < 4 && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => (step === 1 ? onBack?.() : setStep((step - 1) as 1 | 2 | 3))}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-[#0D1B3E] font-[family-name:var(--font-heading)]">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h1>
        </div>
      )}

      {/* Step 1: Enter Email/Phone */}
      {step === 1 && (
        <div className="flex-1 p-6">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-10 h-10 text-[#2563EB]" />
            </div>
          </div>
          <p className="text-center text-gray-600 mb-8">
            Enter the email or phone number <span className="font-medium text-gray-800">registered with your account</span> and we&apos;ll send you a verification code to reset your password.
          </p>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">Email or Phone Number</Label>
              <Input
                type="text"
                placeholder="Enter email or phone"
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value)
                  if (accountError) setAccountError("")
                }}
                className={`mt-1.5 h-12 rounded-lg ${
                  accountError ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200"
                }`}
              />
              {accountError && (
                <p className="text-xs text-red-500 mt-1.5">{accountError}</p>
              )}
            </div>
          </div>
          <Button
            onClick={handleSendResetLink}
            disabled={!emailOrPhone}
            className="w-full mt-8 h-12 bg-[#2563EB] hover:bg-[#1A3872] text-white rounded-xl font-medium"
          >
            Send Reset Link
          </Button>

          <button
            type="button"
            className="w-full mt-6 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-[#2563EB]"
          >
            <HelpCircle className="w-4 h-4" />
            Need help? Contact Support
          </button>
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <div className="flex-1 p-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <Phone className="w-10 h-10 text-[#2563EB]" />
            </div>
          </div>
          <p className="text-center text-gray-600 mb-6">
            We&apos;ve sent a 6-digit OTP to{" "}
            <span className="font-medium text-gray-800">{emailOrPhone || "+91 98XXXXXXXX"}</span>
          </p>
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`forgot-otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className={`w-11 h-14 text-center text-xl font-semibold rounded-lg border-2 focus:outline-none transition-colors ${
                  digit
                    ? "border-[#2563EB] bg-blue-50 text-[#0D1B3E]"
                    : "border-gray-200 bg-white text-gray-400"
                } focus:border-[#0D1B3E]`}
              />
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mb-6">
            Code expires in <span className="font-medium text-[#2563EB]">{formatTime(timer)}</span>
          </p>
          <button
            onClick={() => setTimer(120)}
            className="w-full text-center text-[#2563EB] font-medium text-sm mb-6"
          >
            Resend OTP
          </button>
          <Button
            onClick={handleVerifyOtp}
            disabled={otp.some((d) => !d)}
            className="w-full h-12 bg-[#2563EB] hover:bg-[#1A3872] text-white rounded-xl font-medium"
          >
            Verify OTP
          </Button>
        </div>
      )}

      {/* Step 3: Set New Password */}
      {step === 3 && (
        <div className="flex-1 p-6">
          <div className="space-y-5">
            {/* New Password */}
            <div>
              <Label className="text-sm text-gray-600">New Password</Label>
              <div className="relative mt-1.5">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 pr-10 rounded-lg border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Strength Bar */}
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= metRulesCount
                        ? metRulesCount <= 2
                          ? "bg-red-500"
                          : metRulesCount <= 4
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs font-medium ${
                  metRulesCount <= 2
                    ? "text-red-500"
                    : metRulesCount <= 4
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              >
                {passwordStrength}
              </p>
            </div>

            {/* Rules Checklist */}
            <div className="space-y-2">
              {passwordRules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {rule.met ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                  <span className={rule.met ? "text-emerald-600" : "text-gray-500"}>{rule.label}</span>
                </div>
              ))}
            </div>

            {/* Confirm Password */}
            <div>
              <Label className="text-sm text-gray-600">Confirm Password</Label>
              <div className="relative mt-1.5">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 pr-10 rounded-lg border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`text-xs mt-1 ${passwordsMatch ? "text-emerald-500" : "text-red-500"}`}>
                  {passwordsMatch ? "Passwords match" : "Passwords don't match"}
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={handleResetPassword}
            disabled={metRulesCount < 5 || !passwordsMatch}
            className="w-full mt-8 h-12 bg-[#2563EB] hover:bg-[#1A3872] text-white rounded-xl font-medium disabled:bg-gray-300"
          >
            Reset Password
          </Button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#0D1B3E] mb-2 font-[family-name:var(--font-heading)]">
            Password Reset Successful!
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <Button
            onClick={handleBackToSignIn}
            className="w-full h-12 bg-[#2563EB] hover:bg-[#1A3872] text-white rounded-xl font-medium"
          >
            Back to Sign In
          </Button>
        </div>
      )}
    </div>
  )
}
