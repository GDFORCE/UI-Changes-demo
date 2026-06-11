"use client"

import { useState } from "react"
import { ArrowLeft, AlertTriangle, Clock, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EmergencyAccessScreenProps {
  onBack?: () => void
}

export function EmergencyAccessScreen({ onBack }: EmergencyAccessScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [reason, setReason] = useState("")
  const [justification, setJustification] = useState("")
  const [countdown, setCountdown] = useState(7200) // 2 hours in seconds

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleRequestApproval = () => {
    if (reason && justification) {
      setStep(2)
    }
  }

  const handleApproved = () => {
    setStep(3)
    // Start countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setStep(1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header row */}
      <div>
        <h1 className="text-xl font-bold text-primary">Break-the-Glass access</h1>
        <p className="text-sm text-muted-foreground">
          Temporary, time-limited access to protected patient PHI. Every access is permanently logged.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-destructive mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-destructive">Restricted Access Area</p>
          <p className="text-xs text-destructive mt-1">
            Emergency access is intended only for critical situations. All actions are fully logged and audited.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Step 1: Request Form */}
        {step === 1 && (
          <div className="bg-card rounded-xl p-4 shadow-md">
            <h2 className="text-base font-semibold text-primary-deep mb-4 font-[family-name:var(--font-heading)]">
              Step 1: Request Justification
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Reason for Emergency Access</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="w-full h-11 mt-1.5 bg-card rounded-lg border-border">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Failure</SelectItem>
                    <SelectItem value="security">Security Breach</SelectItem>
                    <SelectItem value="legal">Legal Requirement</SelectItem>
                    <SelectItem value="recovery">Data Recovery</SelectItem>
                    <SelectItem value="court">Court Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Detailed Justification</Label>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Provide detailed justification for emergency access request..."
                  className="mt-1.5 min-h-[120px] rounded-lg border-border"
                />
              </div>

              <Button
                onClick={handleRequestApproval}
                disabled={!reason || !justification}
                className="w-full h-12 bg-destructive hover:bg-destructive text-white rounded-xl font-medium"
              >
                <Shield className="w-4 h-4 mr-2" />
                Request Approval
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Pending Approval */}
        {step === 2 && (
          <div className="bg-card rounded-xl p-6 shadow-md text-center">
            <div className="w-16 h-16 rounded-full bg-warning/15 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-warning" />
            </div>
            <h2 className="text-lg font-semibold text-primary-deep mb-2 font-[family-name:var(--font-heading)]">
              Awaiting Senior Approval
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your emergency access request has been submitted and is pending approval from a senior administrator.
            </p>

            <div className="p-4 bg-warning/10 rounded-xl border border-warning/20 mb-6">
              <p className="text-sm text-warning">
                <span className="font-semibold">Request ID:</span> EMG-2025-0042
              </p>
              <p className="text-xs text-warning mt-1">
                Submitted: 25 May 2025, 10:30 AM
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-surface rounded-lg text-left">
                <p className="text-xs text-muted-foreground">Reason</p>
                <p className="text-sm text-foreground/80 font-medium">
                  {reason === "technical"
                    ? "Technical Failure"
                    : reason === "security"
                    ? "Security Breach"
                    : reason === "legal"
                    ? "Legal Requirement"
                    : reason === "recovery"
                    ? "Data Recovery"
                    : "Court Order"}
                </p>
              </div>
              <div className="p-3 bg-surface rounded-lg text-left">
                <p className="text-xs text-muted-foreground">Justification</p>
                <p className="text-sm text-foreground/80">{justification}</p>
              </div>
            </div>

            {/* For demo, add approve button */}
            <Button
              onClick={handleApproved}
              variant="outline"
              className="w-full mt-6 h-10 border-border text-muted-foreground"
            >
              (Demo) Simulate Approval
            </Button>
          </div>
        )}

        {/* Step 3: Access Granted */}
        {step === 3 && (
          <div className="bg-card rounded-xl p-6 shadow-md text-center">
            <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-lg font-semibold text-primary-deep mb-2 font-[family-name:var(--font-heading)]">
              Emergency Access Granted
            </h2>

            {/* Countdown Timer */}
            <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20 mb-6">
              <p className="text-xs text-destructive mb-1">Access expires in</p>
              <p className="text-3xl font-bold text-destructive font-mono">
                {formatCountdown(countdown)}
              </p>
            </div>

            <div className="p-4 bg-warning/10 rounded-xl border border-warning/20 mb-6 text-left">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                <div className="text-xs text-warning">
                  <p className="font-semibold mb-1">Important Reminders:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>All actions are fully logged and audited</li>
                    <li>Access only what is absolutely necessary</li>
                    <li>Document all actions taken during this session</li>
                    <li>Access will automatically expire after the countdown</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions Log */}
            <div className="p-4 bg-surface rounded-xl text-left">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground/80">Session Log</p>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>10:35:42 - Emergency session initiated</p>
                <p>10:35:42 - User: admin@pvs.com</p>
                <p>10:35:42 - IP: 192.168.1.100</p>
              </div>
            </div>

            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="w-full mt-6 h-10 border-border text-muted-foreground"
            >
              End Emergency Session
            </Button>
          </div>
        )}
      </div>

      {/* Footer Warning */}
      <div className="p-4 bg-muted border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          All actions during emergency access are fully logged and subject to audit.
        </p>
      </div>
    </div>
  )
}
