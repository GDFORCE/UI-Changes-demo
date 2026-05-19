"use client"

import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

interface WelcomeScreenProps {
  onSignUp: () => void
  onSignIn: () => void
  onForgotPassword: () => void
}

export function WelcomeScreen({ onSignUp, onSignIn, onForgotPassword }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Gradient Background */}
      <div className="flex-1 bg-gradient-to-b from-[#0D1B3E] via-[#1E3A6E] to-[#EFF6FF] flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <Building2 className="w-12 h-12 text-[#1A3872]" />
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Patient Visit Schedule
        </h1>
        <p className="text-base text-blue-300 text-center">
          Simplifying Clinical Trial Visit Management
        </p>
      </div>
      
      {/* Bottom Card */}
      <div className="bg-white rounded-t-3xl -mt-8 px-6 py-8 space-y-4">
        <Button
          onClick={onSignUp}
          className="w-full bg-[#1A3872] hover:bg-[#0D1B3E] text-white rounded-full py-6 text-base font-semibold"
        >
          Sign Up
        </Button>
        <Button
          onClick={onSignIn}
          variant="outline"
          className="w-full border-[#1A3872] text-[#1A3872] rounded-full py-6 text-base font-semibold"
        >
          Sign In
        </Button>
        <button
          onClick={onForgotPassword}
          className="w-full text-[#1A3872] text-sm font-medium py-2"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  )
}
