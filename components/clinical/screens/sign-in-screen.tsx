"use client"

import { Building2, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface SignInScreenProps {
  onSignIn: () => void
  onSignUp: () => void
  onForgotPassword: () => void
}

export function SignInScreen({ onSignIn, onSignUp, onForgotPassword }: SignInScreenProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 px-6 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-[#1A3872] rounded-2xl flex items-center justify-center">
            <Building2 className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Sign in to continue
        </p>
        
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email or Phone</label>
            <input
              type="text"
              defaultValue="john.doe@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                defaultValue="password123"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
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
          
          {/* Remember Me & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#1A3872] focus:ring-[#1A3872]"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button onClick={onForgotPassword} className="text-sm text-[#1A3872] font-medium">
              Forgot?
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="px-6 py-4 space-y-4">
        <button
          onClick={onSignIn}
          className="w-full py-4 rounded-full font-semibold bg-[#1A3872] text-white"
        >
          Sign In
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        
        <p className="text-center text-gray-600 text-sm">
          {"Don't have an account? "}
          <button onClick={onSignUp} className="text-[#1A3872] font-semibold">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
