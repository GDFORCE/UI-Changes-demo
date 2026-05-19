"use client"

import { CheckCircle2 } from "lucide-react"

interface SuccessScreenProps {
  onGoToSignIn: () => void
}

export function SuccessScreen({ onGoToSignIn }: SuccessScreenProps) {
  return (
    <div className="h-full flex flex-col bg-white items-center justify-center px-6">
      {/* Success Icon */}
      <div className="w-36 h-36 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-20 h-20 text-[#0D9488]" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
      <p className="text-gray-600 text-center mb-8">
        Your account has been created successfully.
      </p>
      
      <button
        onClick={onGoToSignIn}
        className="w-full py-4 rounded-full font-semibold bg-[#1A3872] text-white"
      >
        Go to Sign In
      </button>
    </div>
  )
}
