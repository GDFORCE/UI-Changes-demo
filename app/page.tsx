"use client"

import { useState } from "react"
import { MobileFrame } from "@/components/clinical/mobile-frame"
import { BottomNav, type UserRole } from "@/components/clinical/bottom-nav"
import { WelcomeScreen } from "@/components/clinical/screens/welcome-screen"
import { EntityTypeScreen } from "@/components/clinical/screens/entity-type-screen"
import { RegistrationScreen } from "@/components/clinical/screens/registration-screen"
import { OTPScreen } from "@/components/clinical/screens/otp-screen"
import { SecurityQuestionsScreen } from "@/components/clinical/screens/security-questions-screen"
import { PasswordScreen } from "@/components/clinical/screens/password-screen"
import { SuccessScreen } from "@/components/clinical/screens/success-screen"
import { SignInScreen } from "@/components/clinical/screens/sign-in-screen"
import { SponsorDashboard } from "@/components/clinical/screens/sponsor-dashboard"
import { PatientDashboard } from "@/components/clinical/screens/patient-dashboard"
import { AddTrialScreen } from "@/components/clinical/screens/add-trial-screen"
import { VisitScheduleScreen } from "@/components/clinical/screens/visit-schedule-screen"
import { PatientListScreen } from "@/components/clinical/screens/patient-list-screen"
import { AddPatientScreen } from "@/components/clinical/screens/add-patient-screen"
import { VisitDetailScreen } from "@/components/clinical/screens/visit-detail-screen"
import { NotificationScreen } from "@/components/clinical/screens/notification-screen"
// Patient-specific screens
import { MyVisitsScreen } from "@/components/clinical/screens/patient/my-visits-screen"
import { ProfileSettingsScreen } from "@/components/clinical/screens/patient/profile-settings-screen"
import { ChatScreen } from "@/components/clinical/screens/patient/chat-screen"
import { MedicationReminderScreen } from "@/components/clinical/screens/patient/medication-reminder-screen"
import { AboutTrialScreen } from "@/components/clinical/screens/patient/about-trial-screen"
import { ForgotPasswordScreen } from "@/components/clinical/screens/forgot-password-screen"
import { InvitePatientScreen } from "@/components/clinical/screens/invite-patient-screen"
import { SessionTimeoutScreen } from "@/components/clinical/screens/session-timeout-screen"
import { NoInternetScreen } from "@/components/clinical/screens/no-internet-screen"
import { PatientCalendarScreen } from "@/components/clinical/screens/patient-calendar-screen"
import { TeamCalendarScreen } from "@/components/clinical/screens/team-calendar-screen"
import { CalendarSettingsScreen } from "@/components/clinical/screens/calendar-settings-screen"
import { MyTrialScreen } from "@/components/clinical/screens/patient/my-trial-screen"
import { PIDashboard } from "@/components/clinical/screens/pi-dashboard"
import { ResearchTeamDashboard } from "@/components/clinical/screens/research-team-dashboard"
import { TeamScreen } from "@/components/clinical/screens/team-screen"
import { ShareScheduleFlow } from "@/components/clinical/screens/share-schedule-flow"
import { cn } from "@/lib/utils"
import { LanguageProvider } from "@/lib/i18n"

type Screen =
  | "welcome"
  | "entity-type"
  | "registration"
  | "security-questions"
  | "otp"
  | "password"
  | "success"
  | "sign-in"
  | "forgot-password"
  | "sponsor-dashboard"
  | "patient-dashboard"
  | "add-trial"
  | "visit-schedule"
  | "patient-list"
  | "add-patient"
  | "visit-detail"
  | "notifications"
  // Patient modules
  | "my-visits"
  | "profile-settings"
  | "chat"
  | "medication-reminder"
  | "about-trial"
  // Misc
  | "invite-patient"
  | "session-timeout"
  | "no-internet"
  | "patient-calendar"
  | "pi-calendar"
  | "crc-calendar"
  | "calendar-settings"
  | "my-trial"
  | "pi-dashboard"
  | "research-team-dashboard"
  | "team"
  | "share-schedule"

const screenCategories = [
  {
    name: "Auth Flow",
    screens: [
      { id: "welcome", label: "Welcome" },
      { id: "entity-type", label: "Entity Type" },
      { id: "registration", label: "Registration" },
      { id: "security-questions", label: "Security Questions" },
      { id: "otp", label: "OTP" },
      { id: "password", label: "Password" },
      { id: "success", label: "Success" },
      { id: "sign-in", label: "Sign In" },
      { id: "forgot-password", label: "Forgot Password" },
    ],
  },
  {
    name: "Dashboards",
    screens: [
      { id: "sponsor-dashboard", label: "Sponsor/CRO" },
      { id: "pi-dashboard", label: "PI Oversight" },
      { id: "research-team-dashboard", label: "Research Team (CRC)" },
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
      { id: "pi-calendar", label: "PI Calendar" },
      { id: "crc-calendar", label: "Research Team Calendar" },
    ],
  },
  {
    name: "Patient Modules",
    screens: [
      { id: "my-trial", label: "My Trial (Hub)" },
      { id: "my-visits", label: "My Visits" },
      { id: "patient-calendar", label: "Patient Calendar" },
      { id: "calendar-settings", label: "Calendar Settings" },
      { id: "medication-reminder", label: "Medication Reminder" },
      { id: "chat", label: "Chat" },
      { id: "about-trial", label: "About Trial" },
      { id: "profile-settings", label: "Profile & Settings" },
    ],
  },
  {
    name: "Collaboration",
    screens: [
      { id: "team", label: "Team Management" },
      { id: "chat", label: "Chat / Messages" },
    ],
  },
  {
    name: "Misc Screens",
    screens: [
      { id: "invite-patient", label: "Invite Patient" },
      { id: "session-timeout", label: "Session Timeout" },
      { id: "no-internet", label: "No Internet" },
    ],
  },
]

export default function PatientVisitScheduleApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [history, setHistory] = useState<Screen[]>(["welcome"])
  // When a trial's schedule is saved, open the Sponsor Dashboard on that trial's summary.
  const [openTrialSummary, setOpenTrialSummary] = useState(false)
  // The visit a patient tapped in My Visits, shown on the Visit Detail screen.
  const [selectedVisitId, setSelectedVisitId] = useState<string | undefined>(undefined)
  // Which sponsor-dashboard tab to open on when the global nav routes back to it.
  const [sponsorTab, setSponsorTab] = useState<string | undefined>(undefined)
  // Which view the PI/CRC calendar should open in (deep-linked from the dashboard).
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("month")
  // Which PI-dashboard tab to open on when the nav routes into it.
  const [piTab, setPiTab] = useState<"dashboard" | "my-trials">("dashboard")
  // Hide the bottom nav while a chat conversation (message thread) is open.
  const [chatConversationOpen, setChatConversationOpen] = useState(false)

  const navigate = (screen: Screen | string) => {
    let target = screen as string
    // Calendar deep-links: open the PI/CRC calendar directly in a given view.
    if (target === "pi-calendar-week") { setCalendarView("week"); target = "pi-calendar" }
    else if (target === "crc-calendar-week") { setCalendarView("week"); target = "crc-calendar" }
    else if (target === "pi-calendar" || target === "crc-calendar") { setCalendarView("month") }

    // Clear the pending trial-summary request on any nav except into a dashboard that consumes it.
    if (target !== "sponsor-dashboard" && target !== "pi-dashboard") {
      setOpenTrialSummary(false)
      setSponsorTab(undefined)
    }
    setHistory([...history, target as Screen])
    setCurrentScreen(target as Screen)
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
            onForgotPassword={() => navigate("forgot-password")}
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
            onSubmit={() => navigate("security-questions")}
            onBack={goBack}
            entityType={selectedEntity}
          />
        )
      case "security-questions":
        return (
          <SecurityQuestionsScreen
            onSubmit={() => navigate("otp")}
            onBack={goBack}
          />
        )
      case "otp":
        return (
          <OTPScreen
            onVerify={() => navigate("password")}
            onBack={goBack}
            entityType={selectedEntity}
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
                navigate("research-team-dashboard")
              } else {
                navigate("sponsor-dashboard")
              }
            }}
            onSignUp={() => navigate("entity-type")}
            onForgotPassword={() => navigate("forgot-password")}
          />
        )
      case "forgot-password":
        return (
          <ForgotPasswordScreen
            onBack={goBack}
            onSuccess={() => navigate("sign-in")}
          />
        )
      case "sponsor-dashboard":
        return <SponsorDashboard onNavigate={(screen) => navigate(screen as Screen)} initialTrialId={openTrialSummary ? "Protocol-001" : undefined} initialTab={sponsorTab} />
      case "pi-dashboard":
        return <PIDashboard initialTab={piTab} initialTrialId={openTrialSummary ? "Protocol-001" : undefined} onNavigate={(screen) => navigate(screen as Screen)} />
      case "research-team-dashboard":
        return <ResearchTeamDashboard onNavigate={(screen) => navigate(screen as Screen)} />
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
            onSave={() => {
              setOpenTrialSummary(true)
              // Return to whichever dashboard launched the add-trial flow.
              navigate(history.includes("pi-dashboard") ? "pi-dashboard" : "sponsor-dashboard")
            }}
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
            role={history.includes("my-visits") || history.includes("patient-dashboard") ? "patient" : "clinical"}
            visitId={selectedVisitId}
            onUpdate={() => navigate("patient-list")}
            onContact={() => navigate("chat")}
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
      // Patient-specific screens
      case "my-visits":
        return (
          <MyVisitsScreen
            onBack={goBack}
            onVisitClick={(visitId) => {
              setSelectedVisitId(visitId)
              navigate("visit-detail")
            }}
          />
        )
      case "profile-settings":
        return (
          <ProfileSettingsScreen
            onBack={goBack}
            onLogout={() => navigate("welcome")}
          />
        )
      case "chat":
        return (
          <ChatScreen
            onBack={goBack}
            userRole={
              selectedEntity === "patient" ? "patient" :
              selectedEntity === "cro"     ? "cro" :
              selectedEntity === "site"    ? "pi" :
              selectedEntity === "smo"     ? "research-team" :
              currentScreen === "chat" && history.includes("research-team-dashboard") ? "research-team" :
              currentScreen === "chat" && history.includes("pi-dashboard") ? "pi" :
              "sponsor"
            }
            onConversationOpenChange={setChatConversationOpen}
          />
        )
      case "medication-reminder":
        return (
          <MedicationReminderScreen
            onBack={goBack}
          />
        )
      case "about-trial":
        return (
          <AboutTrialScreen
            onBack={goBack}
          />
        )
      case "invite-patient":
        return (
          <InvitePatientScreen
            onBack={goBack}
            onSuccess={() => navigate("patient-list")}
          />
        )
      case "session-timeout":
        return (
          <SessionTimeoutScreen
            onSignIn={() => navigate("sign-in")}
          />
        )
      case "no-internet":
        return (
          <NoInternetScreen
            onRetry={() => navigate("welcome")}
          />
        )
      case "team":
        return (
          <TeamScreen
            onBack={goBack}
          />
        )
      case "share-schedule":
        return (
          <ShareScheduleFlow
            onBack={goBack}
            onSuccess={() => navigate("sponsor-dashboard")}
          />
        )
      case "patient-calendar":
        return (
          <PatientCalendarScreen
            onNavigate={(screen) => navigate(screen as Screen)}
            onBack={goBack}
          />
        )
      case "pi-calendar":
        return (
          <TeamCalendarScreen
            role="pi"
            initialView={calendarView}
            onNavigate={(screen) => navigate(screen as Screen)}
            onBack={goBack}
          />
        )
      case "crc-calendar":
        return (
          <TeamCalendarScreen
            role="crc"
            initialView={calendarView}
            onNavigate={(screen) => navigate(screen as Screen)}
            onBack={goBack}
          />
        )
      case "calendar-settings":
        return (
          <CalendarSettingsScreen
            onBack={goBack}
          />
        )
      case "my-trial":
        return (
          <MyTrialScreen
            onNavigate={(screen) => navigate(screen as Screen)}
          />
        )
      default:
        return null
    }
  }

  const renderedScreen = renderScreen()

  // ── Persistent role-based bottom navigation ──────────────────────────────
  // The nav differs per profile but stays pinned on every in-app page.
  const navRole: UserRole | null =
    selectedEntity === "patient" ? "patient" :
    (selectedEntity === "sponsor" || selectedEntity === "cro" || selectedEntity === "smo") ? "sponsor" :
    history.includes("research-team-dashboard") || history.includes("crc-calendar") ? "crc" :
    history.includes("pi-dashboard") || history.includes("pi-calendar") ? "pi" :
    selectedEntity === "site" ? "pi" :
    null

  // Pre-login / onboarding screens — no nav.
  const authScreens: Screen[] = [
    "welcome", "entity-type", "registration", "security-questions", "otp", "password", "success",
    "sign-in", "forgot-password", "session-timeout", "no-internet",
  ]
  // Screens that already render their own bottom nav.
  const selfNavScreens: Screen[] = [
    "sponsor-dashboard", "pi-dashboard", "research-team-dashboard", "patient-dashboard",
    "patient-calendar", "pi-calendar", "crc-calendar", "my-trial",
  ]
  // Screens that get the persistent global nav. The wrapper is always rendered for
  // these so the inner screen never remounts when the nav itself shows/hides.
  const isGlobalNavScreen =
    navRole !== null &&
    !authScreens.includes(currentScreen) &&
    !selfNavScreens.includes(currentScreen)
  // The nav is hidden while a chat conversation (message thread) is open.
  const navVisible = isGlobalNavScreen && !(currentScreen === "chat" && chatConversationOpen)

  // Highlight the nav tab that matches the current screen (best-effort).
  const globalActiveTab: Record<string, string> = {
    "patient-list": "patients",
    "add-patient": "patients",
    "chat": "chat",
    "notifications": "notifs",
    "profile-settings": "me",
    "add-trial": "trials",
    "visit-schedule": "trials",
    "my-visits": "my-trial",
    "about-trial": "my-trial",
  }

  // Maps a nav tab to its destination screen for the active role.
  const handleGlobalNav = (tab: string) => {
    if (tab === "chat") { navigate("chat"); return }
    if (navRole === "patient") {
      if (tab === "dashboard") navigate("patient-dashboard")
      else if (tab === "my-trial") navigate("my-visits")
      else if (tab === "calendar") navigate("patient-calendar")
      else if (tab === "me") navigate("profile-settings")
    } else if (navRole === "sponsor") {
      setSponsorTab(tab === "dashboard" ? undefined : tab)
      navigate("sponsor-dashboard")
    } else if (navRole === "pi") {
      if (tab === "dashboard") { setPiTab("dashboard"); navigate("pi-dashboard") }
      else if (tab === "my-trials") { setPiTab("my-trials"); navigate("pi-dashboard") }
      else if (tab === "calendar") navigate("pi-calendar")
      else if (tab === "me") navigate("profile-settings")
    } else if (navRole === "crc") {
      if (tab === "dashboard") navigate("research-team-dashboard")
      else if (tab === "patients") navigate("patient-list")
      else if (tab === "calendar") navigate("crc-calendar")
      else if (tab === "me") navigate("profile-settings")
    }
  }

  return (
    <LanguageProvider>
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Patient Visit Schedule</h1>
          <p className="text-muted-foreground">Clinical Trial Visit Management App UI</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Screen Navigator */}
          <div className="w-full lg:w-72 bg-card rounded-2xl shadow-lg p-4 order-2 lg:order-1 max-h-[80vh] overflow-y-auto">
            <h2 className="font-semibold text-foreground mb-4">Navigate Screens</h2>
            {screenCategories.map((category) => (
              <div key={category.name} className="mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
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
                          ? "bg-primary text-white"
                          : "text-foreground/80 hover:bg-muted"
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
              {isGlobalNavScreen && navRole ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 min-h-0 overflow-auto">{renderedScreen}</div>
                  {navVisible && (
                    <div className="shrink-0">
                      <BottomNav
                        role={navRole}
                        activeTab={globalActiveTab[currentScreen] ?? ""}
                        onTabChange={handleGlobalNav}
                        notificationCount={2}
                      />
                    </div>
                  )}
                </div>
              ) : (
                renderedScreen
              )}
            </MobileFrame>
          </div>

          {/* Quick Actions */}
          <div className="w-full lg:w-72 bg-card rounded-2xl shadow-lg p-4 order-3 max-h-[80vh] overflow-y-auto">
            <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedEntity("sponsor")
                  navigate("sponsor-dashboard")
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-info/5 text-primary hover:bg-info/10"
              >
                Login as Sponsor
              </button>
              <button
                onClick={() => {
                  setSelectedEntity("site")
                  navigate("pi-dashboard")
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-accent/5 text-accent hover:bg-accent/10"
              >
                Login as PI (Oversight)
              </button>
              <button
                onClick={() => {
                  setSelectedEntity("site")
                  navigate("research-team-dashboard")
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-success/10 text-success hover:bg-success/15"
              >
                Login as CRC / Research Team
              </button>
              <button
                onClick={() => {
                  setSelectedEntity("patient")
                  navigate("patient-dashboard")
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-violet/5 text-violet hover:bg-violet/10"
              >
                Login as Patient
              </button>

              <div className="h-px bg-border my-3" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Patient Features
              </p>
              <button
                onClick={() => navigate("my-trial")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-accent/5 text-accent hover:bg-accent/10"
              >
                My Trial Hub
              </button>
              <button
                onClick={() => navigate("patient-calendar")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-info/5 text-info hover:bg-info/10"
              >
                Patient Calendar
              </button>
              <button
                onClick={() => navigate("my-visits")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-violet/5 text-violet hover:bg-violet/10"
              >
                My Visits
              </button>
              <button
                onClick={() => navigate("medication-reminder")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-pink-50 text-pink-700 hover:bg-pink-100"
              >
                Medication Reminder
              </button>
              <button
                onClick={() => navigate("chat")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
              >
                Chat Interface
              </button>
              <button
                onClick={() => navigate("about-trial")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-warning/10 text-warning hover:bg-warning/15"
              >
                About Trial
              </button>
              <button
                onClick={() => navigate("profile-settings")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-surface text-foreground/80 hover:bg-muted"
              >
                Profile & Settings
              </button>

              <div className="h-px bg-border my-3" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Trial Actions
              </p>
              <button
                onClick={() => navigate("add-trial")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-warning/10 text-warning hover:bg-warning/15"
              >
                Add New Trial
              </button>
              <button
                onClick={() => navigate("add-patient")}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-success/10 text-success hover:bg-success/15"
              >
                Add New Patient
              </button>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Current Path
              </h3>
              <div className="flex flex-wrap gap-1">
                {history.map((screen, i) => (
                  <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                    {screen}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </LanguageProvider>
  )
}
