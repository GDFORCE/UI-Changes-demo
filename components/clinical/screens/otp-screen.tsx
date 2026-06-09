"use client"

import { AppBar } from "../app-bar"
import { Smartphone, Mail, Clock, ShieldOff } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface OTPScreenProps {
  onVerify: () => void
  onBack: () => void
  entityType?: string | null
}

const OTP_DURATION = 300 // 5 minutes
const MAX_RESEND = 3

// Where the OTP was actually sent (would come from the account in production).
const PHONE_COUNTRY_CODE = "+91"
const PHONE_NUMBER = "9876543210"
const EMAIL = "john.doe@gmail.com"

// Show only the last 4 digits, country code stays visible: "+91 ••••••3210".
function maskPhone(countryCode: string, number: string): string {
  const digits = number.replace(/\D/g, "")
  if (digits.length <= 4) return `${countryCode} ${digits}`
  const last4 = digits.slice(-4)
  return `${countryCode} ${"•".repeat(digits.length - 4)}${last4}`
}

// Mask the local part (keep first + last char), keep the domain visible: "j•••e@example.com".
function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (!domain) return email
  if (local.length <= 2) return `${local[0]}•@${domain}`
  const middle = "•".repeat(Math.min(local.length - 2, 4))
  return `${local[0]}${middle}${local[local.length - 1]}@${domain}`
}

type Channel = "phone" | "email"

function OtpRow({
  channel,
  destination,
  value,
  onChange,
}: {
  channel: Channel
  destination: string
  value: string[]
  onChange: (index: number, v: string) => void
}) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const Icon = channel === "phone" ? Smartphone : Mail

  const focusInput = (index: number) => {
    const el = inputRefs.current[index]
    if (el) {
      el.focus()
      el.select()
    }
  }

  const handleChange = (index: number, raw: string) => {
    // Keep digits only.
    const digits = raw.replace(/\D/g, "")
    if (!digits) {
      onChange(index, "")
      return
    }
    // Support pasting / fast typing of multiple digits: spread across boxes.
    if (digits.length > 1) {
      const chars = digits.split("")
      let lastIndex = index
      chars.forEach((c, offset) => {
        const target = index + offset
        if (target <= 5) {
          onChange(target, c)
          lastIndex = target
        }
      })
      focusInput(Math.min(lastIndex + 1, 5))
      return
    }
    onChange(index, digits)
    if (index < 5) focusInput(index + 1)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        // Clear current box first.
        onChange(index, "")
      } else if (index > 0) {
        // Move to the previous box and clear it.
        e.preventDefault()
        onChange(index - 1, "")
        focusInput(index - 1)
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      focusInput(index - 1)
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault()
      focusInput(index + 1)
    }
  }

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#1A3872]" />
        <span className="text-sm text-gray-600">
          {channel === "phone" ? "Phone" : "Email"} —{" "}
          <span className="font-semibold text-gray-900">{destination}</span>
        </span>
      </div>
      <div className="flex gap-2">
        {value.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => setFocusedIndex(index)}
            className={cn(
              "w-11 h-14 text-center text-xl font-semibold rounded-lg border-2 outline-none transition-all",
              digit ? "border-[#2563EB] bg-blue-50"
                : focusedIndex === index ? "border-[#1A3872] bg-white" : "border-gray-300 bg-white"
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function OTPScreen({ onVerify, onBack, entityType }: OTPScreenProps) {
  const isPatient = entityType === "patient"
  // Patient verifies via phone only; everyone else via phone AND email.
  const channels: Channel[] = isPatient ? ["phone"] : ["phone", "email"]

  const [phoneOtp, setPhoneOtp] = useState(["4", "7", "", "", "", ""])
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION)
  const [resendCount, setResendCount] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0 || isLocked) return
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, isLocked])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  const setOtpDigit = (channel: Channel, index: number, value: string) => {
    if (value.length > 1) return
    if (channel === "phone") setPhoneOtp(prev => prev.map((d, i) => (i === index ? value : d)))
    else setEmailOtp(prev => prev.map((d, i) => (i === index ? value : d)))
  }

  const handleResend = () => {
    const next = resendCount + 1
    if (next >= MAX_RESEND) {
      setIsLocked(true)
    } else {
      setResendCount(next)
      setTimeLeft(OTP_DURATION)
      setPhoneOtp(["", "", "", "", "", ""])
      setEmailOtp(["", "", "", "", "", ""])
    }
  }

  const phoneComplete = phoneOtp.every(d => d)
  const emailComplete = emailOtp.every(d => d)
  const allComplete = isPatient ? phoneComplete : phoneComplete && emailComplete

  return (
    <div className="h-full flex flex-col bg-white">
      <AppBar title="Verify OTP" showBack onBack={onBack} />

      <div className="flex-1 px-6 py-8 flex flex-col items-center overflow-auto">
        <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mb-6", isLocked ? "bg-red-100" : "bg-blue-100")}>
          {isLocked ? <ShieldOff className="w-12 h-12 text-red-500" /> : <Smartphone className="w-12 h-12 text-[#1A3872]" />}
        </div>

        {isLocked ? (
          <div className="text-center mb-8">
            <p className="font-bold text-red-600 text-lg mb-2">Account Temporarily Locked</p>
            <p className="text-gray-500 text-sm">Too many resend attempts. Please contact support or try again after 30 minutes.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-center mb-6">
              {isPatient
                ? "We've sent a 6-digit OTP to your phone"
                : "We've sent a 6-digit OTP to both your phone and email"}
            </p>

            {channels.map(ch => (
              <OtpRow
                key={ch}
                channel={ch}
                destination={ch === "phone" ? maskPhone(PHONE_COUNTRY_CODE, PHONE_NUMBER) : maskEmail(EMAIL)}
                value={ch === "phone" ? phoneOtp : emailOtp}
                onChange={(i, v) => setOtpDigit(ch, i, v)}
              />
            ))}

            {timeLeft > 0 ? (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span>Expires in <span className="font-semibold text-[#1A3872]">{formatTime(timeLeft)}</span></span>
              </div>
            ) : (
              <p className="text-red-500 text-sm mb-4">OTP expired</p>
            )}

            <div className="flex flex-col items-center gap-1 mb-8">
              <button
                onClick={handleResend}
                disabled={timeLeft > 0}
                className={cn("font-medium", timeLeft > 0 ? "text-slate-400" : "text-[#1A3872]")}
              >
                Resend OTP
              </button>
              <p className="text-xs text-slate-400">{resendCount}/{MAX_RESEND} resend attempts used</p>
            </div>
          </>
        )}
      </div>

      <div className="px-6 py-4">
        <button
          onClick={onVerify}
          disabled={isLocked || !allComplete}
          className={cn("w-full py-4 rounded-full font-semibold", isLocked || !allComplete ? "bg-slate-200 text-slate-400" : "bg-[#1A3872] text-white")}
        >
          Verify OTP
        </button>
      </div>
    </div>
  )
}
