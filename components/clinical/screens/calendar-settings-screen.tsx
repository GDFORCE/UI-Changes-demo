"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarSettingsScreenProps {
  onBack: () => void
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200",
        on ? "bg-accent" : "bg-slate-300"
      )}
    >
      <div
        className={cn(
          "absolute top-1 w-4 h-4 bg-card rounded-full shadow transition-transform duration-200",
          on ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  )
}

function RadioGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2 mt-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="flex items-center gap-3 w-full text-left"
        >
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
            value === opt ? "border-primary-deep bg-primary-deep" : "border-border bg-card"
          )}>
            {value === opt && <div className="w-2 h-2 rounded-full bg-card" />}
          </div>
          <span className="text-sm text-foreground">{opt}</span>
        </button>
      ))}
    </div>
  )
}

export function CalendarSettingsScreen({ onBack }: CalendarSettingsScreenProps) {
  const [defaultView, setDefaultView] = useState("Month")
  const [startWeekOn, setStartWeekOn] = useState("Sunday")
  const [showReminders, setShowReminders] = useState(true)
  const [reminderTiming, setReminderTiming] = useState("2 days before")
  const [syncCalendar, setSyncCalendar] = useState(true)
  const [showWindowDates, setShowWindowDates] = useState(true)
  const [showLocation, setShowLocation] = useState(true)
  const [showDoctorName, setShowDoctorName] = useState(true)
  const [saved, setSaved] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncDone, setSyncDone] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onBack()
    }, 1500)
  }

  const handleSyncNow = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      setSyncDone(true)
      setTimeout(() => setSyncDone(false), 2000)
    }, 1500)
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* App Bar */}
      <div className="bg-primary-deep text-white px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg">Calendar Settings</h1>
      </div>

      {/* Toast */}
      {saved && (
        <div className="mx-4 mt-3 bg-success/15 text-success border border-success/20 rounded-xl px-4 py-3 text-sm font-medium text-center">
          ✓ Settings saved
        </div>
      )}

      <div className="flex-1 overflow-auto pb-4 px-4 py-4 space-y-4">
        {/* DISPLAY */}
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="px-4 py-2 bg-surface border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Display</p>
          </div>
          <div className="px-4 py-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground">Default View</p>
              <RadioGroup
                options={["Day", "Month", "Week"]}
                value={defaultView}
                onChange={setDefaultView}
              />
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground">Start Week On</p>
              <RadioGroup
                options={["Sunday", "Monday"]}
                value={startWeekOn}
                onChange={setStartWeekOn}
              />
            </div>
          </div>
        </div>

        {/* VISIT REMINDERS */}
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="px-4 py-2 bg-surface border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Visit Reminders</p>
          </div>
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Show visit reminders</p>
              <Toggle on={showReminders} onToggle={() => setShowReminders(!showReminders)} />
            </div>
            {showReminders && (
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground mb-2">Reminder timing</p>
                <RadioGroup
                  options={["1 day before", "2 days before", "3 days before"]}
                  value={reminderTiming}
                  onChange={setReminderTiming}
                />
              </div>
            )}
          </div>
        </div>

        {/* SYNC */}
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="px-4 py-2 bg-surface border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Sync</p>
          </div>
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Sync with device calendar</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {syncDone ? "✓ Synced just now" : "Last synced: Today at 9:41 AM"}
                </p>
              </div>
              <Toggle on={syncCalendar} onToggle={() => setSyncCalendar(!syncCalendar)} />
            </div>
            {syncCalendar && (
              <button
                onClick={handleSyncNow}
                disabled={syncing}
                className="w-full border-2 border-info text-info rounded-xl py-2.5 text-sm font-semibold"
              >
                {syncing ? "Syncing..." : "Sync Now"}
              </button>
            )}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground">Export calendar as PDF</p>
              <ChevronLeft className="w-5 h-5 text-muted-foreground/70 rotate-180" />
            </div>
          </div>
        </div>

        {/* VISIT DISPLAY */}
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="px-4 py-2 bg-surface border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Visit Display</p>
          </div>
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Show visit window dates</p>
              <Toggle on={showWindowDates} onToggle={() => setShowWindowDates(!showWindowDates)} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Show hospital location</p>
              <Toggle on={showLocation} onToggle={() => setShowLocation(!showLocation)} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Show doctor name</p>
              <Toggle on={showDoctorName} onToggle={() => setShowDoctorName(!showDoctorName)} />
            </div>
          </div>
        </div>

        {/* Save Button — part of the form, scrolls with the content */}
        <button
          onClick={handleSave}
          className="w-full bg-primary-deep text-white rounded-xl py-3 font-semibold text-sm"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
