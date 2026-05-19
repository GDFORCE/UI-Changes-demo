"use client"

import { AppBar } from "../app-bar"
import { Smartphone, Clock } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OTPScreenProps {
  onVerify: () => void
  onBack: () => void
}

export function OTPScreen({ onVerify, onBack }: OTPScreenProps) {
  const [otp, setOtp] = useState(["4", "7", "", "", "", ""])
  const [focusedIndex, setFocusedIndex] = useState(2)

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 5) {
        setFocusedIndex(index + 1)
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <AppBar title="Verify OTP" showBack onBack={onBack} />
      
      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        {/* Phone Illustration */}
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Smartphone className="w-12 h-12 text-[#1A3872]" />
        </div>
        
        <p className="text-gray-600 text-center mb-8">
          {"We've sent a 6-digit OTP to"}<br />
          <span className="font-semibold text-gray-900">+91 98XXXXXXXX</span>
        </p>
        
        {/* OTP Input Boxes */}
        <div className="flex gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onFocus={() => setFocusedIndex(index)}
              className={cn(
                "w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 outline-none transition-all",
                digit
                  ? "border-[#2563EB] bg-blue-50"
                  : focusedIndex === index
                    ? "border-[#1A3872] bg-white"
                    : "border-gray-300 bg-white"
              )}
            />
          ))}
        </div>
        
        {/* Timer */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Clock className="w-4 h-4" />
          <span>Expires in <span className="font-semibold text-[#1A3872]">14:32</span></span>
        </div>
        
        {/* Resend Link */}
        <button className="text-[#1A3872] font-medium mb-8">
          Resend OTP
        </button>
      </div>
      
      {/* Verify Button */}
      <div className="px-6 py-4">
        <button
          onClick={onVerify}
          className="w-full py-4 rounded-full font-semibold bg-[#1A3872] text-white"
        >
          Verify OTP
        </button>
      </div>
    </div>
  )
}
