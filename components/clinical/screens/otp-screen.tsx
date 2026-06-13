"use client"

import { AuthHeader } from "../auth-header"
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
    <div className="w-full rounded-xl border border-border bg-card shadow-xs p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary">
          <Icon className="w-3.5 h-3.5" />
        </span>
        <span className="eyebrow text-muted-foreground">{channel === "phone" ? "Phone" : "Email"}</span>
        <span className="text-sm font-medium text-foreground ml-auto tabular-nums">{destination}</span>
      </div>
      <div className="flex gap-2 justify-between">
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
              "w-11 h-14 text-center font-mono text-xl tabular-nums rounded-xl border outline-none transition-all duration-200 bg-background",
              digit
                ? "border-primary/60 bg-secondary/50 text-primary shadow-xs scale-[1.03]"
                : focusedIndex === index
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-border hover:border-primary/30",
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
    <div className="h-full flex flex-col bg-background paper-grain">
      <AuthHeader
        eyebrow="Step 4 of 5"
        title={isLocked ? "Verification paused" : "Check your messages"}
        subtitle={
          isLocked
            ? undefined
            : isPatient
              ? "We've sent a 6-digit code to your phone."
              : "We've sent a 6-digit code to both your phone and your email."
        }
        onBack={onBack}
        step={4}
      />

      <div className="flex-1 px-6 pt-3 pb-4 overflow-auto">
        {isLocked ? (
          <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-6 text-center animate-rise" style={{ animationDelay: "120ms" }}>
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <ShieldOff className="w-7 h-7 text-destructive" />
            </div>
            <p className="font-heading text-lg text-destructive mb-1.5">Account temporarily locked</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Too many resend attempts. Please contact support or try again after 30 minutes.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {channels.map((ch, i) => (
              <div key={ch} className="animate-rise" style={{ animationDelay: `${200 + i * 100}ms` }}>
                <OtpRow
                  channel={ch}
                  destination={ch === "phone" ? maskPhone(PHONE_COUNTRY_CODE, PHONE_NUMBER) : maskEmail(EMAIL)}
                  value={ch === "phone" ? phoneOtp : emailOtp}
                  onChange={(i, v) => setOtpDigit(ch, i, v)}
                />
              </div>
            ))}

            <div className="flex items-center justify-between pt-2 animate-rise" style={{ animationDelay: "400ms" }}>
              {timeLeft > 0 ? (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    Expires in <span className="font-semibold text-primary tabular-nums">{formatTime(timeLeft)}</span>
                  </span>
                </div>
              ) : (
                <p className="text-destructive text-sm font-medium">OTP expired</p>
              )}
              <div className="text-right">
                <button
                  onClick={handleResend}
                  disabled={timeLeft > 0}
                  className={cn(
                    "text-sm font-semibold",
                    timeLeft > 0 ? "text-muted-foreground/50" : "text-accent hover:underline",
                  )}
                >
                  Resend OTP
                </button>
                <p className="text-[11px] text-muted-foreground/60">{resendCount}/{MAX_RESEND} resends used</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-background/90 backdrop-blur-sm border-t border-border">
        <button
          onClick={onVerify}
          disabled={isLocked || !allComplete}
          className={cn(
            "w-full py-4 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-200",
            isLocked || !allComplete
              ? "bg-muted text-muted-foreground/60 cursor-not-allowed"
              : "bg-primary text-primary-foreground shadow-md hover:bg-primary-deep active:scale-[0.99]",
          )}
        >
          Verify OTP
        </button>
      </div>
    </div>
  )
}
