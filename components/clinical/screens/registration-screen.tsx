"use client"

import { AppBar } from "../app-bar"
import { Building2, MapPin, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface RegistrationScreenProps {
  onSubmit: () => void
  onBack: () => void
}

export function RegistrationScreen({ onSubmit, onBack }: RegistrationScreenProps) {
  const [email, setEmail] = useState("john.doe@example.com")
  const [showError, setShowError] = useState(true)
  const [role, setRole] = useState<"admin" | "user">("admin")
  const [showDropdown, setShowDropdown] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <AppBar title="Registration" showBack onBack={onBack} />
      
      <div className="flex-1 px-4 py-6 overflow-auto space-y-4">
        {/* Entity Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-[#1A3872] rounded-full text-sm font-medium">
          <Building2 className="w-4 h-4" />
          Sponsor
        </div>
        
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
          <input
            type="text"
            defaultValue="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
        
        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation</label>
          <input
            type="text"
            defaultValue="Clinical Research Manager"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
        
        {/* Email with Error */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setShowError(e.target.value === "john.doe@example.com")
            }}
            className={cn(
              "w-full px-4 py-3 rounded-xl border outline-none",
              showError ? "border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-[#1A3872] focus:ring-blue-100"
            )}
          />
          {showError && (
            <p className="text-red-500 text-sm mt-1">Email ID already exists</p>
          )}
        </div>
        
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
          <div className="flex gap-2">
            <div className="px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-600">
              +91
            </div>
            <input
              type="tel"
              defaultValue="98XXXXXXXX"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
        </div>
        
        {/* Organization Name with Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name *</label>
          <input
            type="text"
            defaultValue="Apollo"
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none"
          />
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg">
              <button className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 text-left">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>Apollo Hospitals</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Organization Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Address</label>
          <textarea
            rows={3}
            defaultValue="21, Greams Lane, Off Greams Road, Chennai - 600006"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none resize-none"
          />
        </div>
        
        {/* Role Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
          <div className="flex rounded-xl border border-gray-300 overflow-hidden">
            <button
              onClick={() => setRole("admin")}
              className={cn(
                "flex-1 py-3 font-medium transition-all",
                role === "admin" ? "bg-[#1A3872] text-white" : "bg-white text-gray-600"
              )}
            >
              Admin
            </button>
            <button
              onClick={() => setRole("user")}
              className={cn(
                "flex-1 py-3 font-medium transition-all",
                role === "user" ? "bg-[#1A3872] text-white" : "bg-white text-gray-600"
              )}
            >
              User
            </button>
          </div>
        </div>
        
        {/* Terms Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-[#1A3872] focus:ring-[#1A3872] mt-0.5"
          />
          <span className="text-sm text-gray-600">
            I agree to the <span className="text-[#1A3872] font-medium">Terms & Conditions</span> and <span className="text-[#1A3872] font-medium">Privacy Policy</span>
          </span>
        </label>
      </div>
      
      {/* Submit Button */}
      <div className="px-4 py-4 bg-white border-t">
        <button
          onClick={onSubmit}
          className="w-full py-4 rounded-full font-semibold bg-[#1A3872] text-white"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
