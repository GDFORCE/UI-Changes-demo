"use client"

import { useState } from "react"
import { MobileFrame } from "@/components/clinical/mobile-frame"
import { WelcomeScreen } from "@/components/clinical/screens/welcome-screen"
import { EntityTypeScreen } from "@/components/clinical/screens/entity-type-screen"
import { RegistrationScreen } from "@/components/clinical/screens/registration-screen"
import { OTPScreen } from "@/components/clinical/screens/otp-screen"
import { PasswordScreen } from "@/components/clinical/screens/password-screen"
import { SuccessScreen } from "@/components/clinical/screens/success-screen"
import { SignInScreen } from "@/components/clinical/screens/sign-in-screen"
import { SponsorDashboard } from "@/components/clinical/screens/sponsor-dashboard"
import { InvestigatorDashboard } from "@/components/clinical/screens/investigator-dashboard"
import { PatientDashboard } from "@/components/clinical/screens/patient-dashboard"
import { AddTrialScreen } from "@/components/clinical/screens/add-trial-screen"
import { VisitScheduleScreen } from "@/components/clinical/screens/visit-schedule-screen"
import { PatientListScreen } from "@/components/clinical/screens/patient-list-screen"
import { AddPatientScreen } from "@/components/clinical/screens/add-patient-screen"
import { VisitDetailScreen } from "@/components/clinical/screens/visit-detail-screen"
import { NotificationScreen } from "@/components/clinical/screens/notification-screen"
import { CalendarMonthScreen } from "@/components/clinical/screens/calendar-month-screen"
import { CalendarDayScreen } from "@/components/clinical/screens/calendar-day-screen"
import { cn } from "@/lib/utils"

type Screen =
  | "welcome"
  | "entity-type"
  | "registration"
  | "otp"
  | "password"
  | "success"
  | "sign-in"
  | "sponsor-dashboard"
  | "investigator-dashboard"
  | "patient-dashboard"
  | "add-trial"
  | "visit-schedule"
  | "patient-list"
  | "add-patient"
  | "visit-detail"
  | "notifications"
  | "calendar"
  | "calendar-day"

const screenCategories = [
  {
    name: "Auth Flow",
    screens: [
      { id: "welcome", label: "Welcome" },
      { id: "entity-type", label: "Entity Type" },
      { id: "registration", label: "Registration" },
      { id: "otp", label: "OTP" },
      { id: "password", label: "Password" },
      { id: "success", label: "Success" },
      { id: "sign-in", label: "Sign In" },
    ],
  },
  {
    name: "Dashboards",
    screens: [
      { id: "sponsor-dashboard", label: "Sponsor/CRO" },
      { id: "investigator-dashboard", label: "Investigator" },
      { id: "patient-dashboard", label: "Patient" },
    ],
  },
  {
    name: "Trial Management",
    screens: [
      { id: "add-trial", label: "Add Trial" },
      { id: "visit-schedule", label: "Visit Schedule" },
      { id: "patient-list", label: "Patient List" },
      { id: "add-patient", label: "Add Patient" },
      { id: "visit-detail", label: "Visit Detail" },
    ],
  },
  {
    name: "Notifications & Calendar",
    screens: [
      { id: "notifications", label: "Notifications" },
      { id: "calendar", label: "Calendar Month" },
      { id: "calendar-day", label: "Calendar Day" },
    ],
  },
]

export default function PatientVisitScheduleApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [history, setHistory] = useState<Screen[]>(["welcome"])

  const navigate = (screen: Screen) => {
    setHistory([...history, screen])
    setCurrentScreen(screen)
  }

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1)
      setHistory(newHistory)
      setCurrentScreen(newHistory[newHistory.length - 1])
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <WelcomeScreen
            onSignUp={() => navigate("entity-type")}
            onSignIn={() => navigate("sign-in")}
            onForgotPassword={() => {}}
          />
        )
      case "entity-type":
        return (
          <EntityTypeScreen
            selectedEntity={selectedEntity}
            onSelect={setSelectedEntity}
            onContinue={() => navigate("registration")}
            onBack={goBack}
          />
        )
      case "registration":
        return (
          <RegistrationScreen
            onSubmit={() => navigate("otp")}
            onBack={goBack}
          />
        )
      case "otp":
        return (
          <OTPScreen
            onVerify={() => navigate("password")}
            onBack={goBack}
          />
        )
      case "password":
        return (
          <PasswordScreen
            onCreateAccount={() => navigate("success")}
            onBack={goBack}
          />
        )
      case "success":
        return (
          <SuccessScreen
            onGoToSignIn={() => navigate("sign-in")}
          />
        )
      case "sign-in":
        return (
          <SignInScreen
            onSignIn={() => {
              // Route based on selected entity
              if (selectedEntity === "patient") {
                navigate("patient-dashboard")
              } else if (selectedEntity === "site") {
                navigate("investigator-dashboard")
              } else {
                navigate("sponsor-dashboard")
              }
            }}
            onSignUp={() => navigate("entity-type")}
            onForgotPassword={() => {}}
          />
        )
      case "sponsor-dashboard":
        return <SponsorDashboard onNavigate={(screen) => navigate(screen as Screen)} />
      case "investigator-dashboard":
        return <InvestigatorDashboard onNavigate={(screen) => navigate(screen as Screen)} />
      case "patient-dashboard":
        return <PatientDashboard onNavigate={(screen) => navigate(screen as Screen)} />
      case "add-trial":
        return (
          <AddTrialScreen
            onSave={() => navigate("visit-schedule")}
            onBack={goBack}
          />
        )
      case "visit-schedule":
        return (
          <VisitScheduleScreen
            onSave={() => navigate("sponsor-dashboard")}
            onBack={goBack}
          />
        )
      case "patient-list":
        return (
          <PatientListScreen
            onNavigate={(screen) => navigate(screen as Screen)}
            onBack={goBack}
          />
        )
      case "add-patient":
        return (
          <AddPatientScreen
            onAdd={() => navigate("patient-list")}
            onBack={goBack}
          />
        )
      case "visit-detail":
        return (
          <VisitDetailScreen
            onUpdate={() => navigate("patient-list")}
            onBack={goBack}
          />
        )
      case "notifications":
        return (
          <NotificationScreen
            onNavigate={(screen) => navigate(screen as Screen)}
            onBack={goBack}
          />
        )
      case "calendar":
        return (
          <CalendarMonthScreen
            onNavigate={(screen) => navigate(screen as Screen)}
            onBack={goBack}
          />
        )
      case "calendar-day":
        return (
          <CalendarDayScreen
            onNavigate={(screen) => navigate(screen as Screen)}
            onBack={goBack}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Visit Schedule</h1>
          <p className="text-gray-600">Clinical Trial Visit Management App UI</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Screen Navigator */}
          <div className="w-full lg:w-72 bg-white rounded-2xl shadow-lg p-4 order-2 lg:order-1">
            <h2 className="font-semibold text-gray-900 mb-4">Navigate Screens</h2>
            {screenCategories.map((category) => (
              <div key={category.name} className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {category.name}
                </h3>
                <div className="space-y-1">
                  {category.screens.map((screen) => (
                    <button
                      key={screen.id}
                      onClick={() => navigate(screen.id as Screen)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                        currentScreen === screen.id
                          ? "bg-[#1A3872] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {screen.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Frame */}
          <div className="order-1 lg:order-2 flex justify-center">
            <MobileFrame
              statusBarClassName={
                currentScreen === "welcome" ? "bg-transparent absolute top-0 left-0 right-0 z-10" : ""
              }
            >
              {renderScreen()}
            </MobileFrame>
          </div>

          {/* Quick Actions */}
          <div className="w-full lg:w-72 bg-white rounded-2xl shadow-lg p-4 order-3">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedEntity("sponsor")
                  navigate("sponsor-dashboard")
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-blue-50 text-[#1A3872] hover:bg-blue-100"
              >
                🏢 Login as Sponsor
              </button>
              <button
                onClick={() => {
                  setSelectedEntity("site")
                  navigate("investigator-dashboard")
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-teal-50 text-[#0D9488] hover:bg-teal-100"
              >
                🔬 Login as Investigator
              </button>
              <button
                onClick={() => {
                  setSelectedEntity("patient")
                  navigate("patient-dashboard")
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-purple-50 text-purple-700 hover:bg-purple-100"
              >
                👤 Login as Patient
              </button>
              <div className="h-px bg-gray-200 my-3" />
              <button
                onClick={() => navigate("add-trial")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-amber-50 text-[#D97706] hover:bg-amber-100"
              >
                ➕ Add New Trial
              </button>
              <button
                onClick={() => navigate("add-patient")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-green-50 text-green-700 hover:bg-green-100"
              >
                ➕ Add New Patient
              </button>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Current Path
              </h3>
              <div className="flex flex-wrap gap-1">
                {history.map((screen, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {screen}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
