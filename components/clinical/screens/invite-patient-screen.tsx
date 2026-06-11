"use client"

import { useState } from "react"
import { ArrowLeft, Send, User, Mail, Phone, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InvitePatientScreenProps {
  onBack?: () => void
  onSuccess?: () => void
}

const siteTrials = [
  { id: "Protocol-001", name: "Diabetes Phase II Study" },
  { id: "Protocol-002", name: "Hypertension Phase III Study" },
  { id: "Protocol-003", name: "Cardiology Phase II Study" },
]

export function InvitePatientScreen({ onBack, onSuccess }: InvitePatientScreenProps) {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [protocol, setProtocol] = useState("")
  const [subjectId, setSubjectId] = useState("SUBJ-")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const canSend = (phone || email) && protocol && subjectId.length > 5

  const handleSendInvitation = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
    }, 1500)
  }

  if (sent) {
    return (
      <div className="flex flex-col h-full bg-card">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground/80" />
          </button>
          <h1 className="text-lg font-semibold text-primary-deep font-[family-name:var(--font-heading)]">
            Invite Patient
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mb-6">
            <Send className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-xl font-semibold text-primary-deep mb-2 font-[family-name:var(--font-heading)]">
            Invitation Sent!
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            The patient will receive an SMS/email with a registration link to join the trial.
          </p>

          <div className="w-full bg-surface rounded-xl p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protocol:</span>
                <span className="text-foreground/80 font-medium">{protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject ID:</span>
                <span className="text-foreground/80 font-medium">{subjectId}</span>
              </div>
              {phone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="text-foreground/80 font-medium">+91 {phone}</span>
                </div>
              )}
              {email && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground/80 font-medium">{email}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={() => {
              setSent(false)
              setPhone("")
              setEmail("")
              setSubjectId("SUBJ-")
              setProtocol("")
            }}
            variant="outline"
            className="w-full h-11 border-info text-info rounded-xl"
          >
            Invite Another Patient
          </Button>
          <Button
            onClick={onSuccess || onBack}
            className="w-full mt-3 h-11 bg-info hover:bg-primary text-white rounded-xl"
          >
            Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground/80" />
        </button>
        <h1 className="text-lg font-semibold text-primary-deep font-[family-name:var(--font-heading)]">
          Invite Patient
        </h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Info Notice */}
        <div className="p-3 bg-info/5 rounded-xl border border-info/20 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
          <p className="text-sm text-primary">
            Patient will receive an SMS/email with a registration link. They can complete their profile and consent process through the app.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Phone Number */}
          <div>
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Patient Phone Number
            </Label>
            <div className="flex mt-1.5">
              <div className="flex items-center px-3 bg-muted border border-r-0 border-border rounded-l-lg text-sm text-muted-foreground">
                +91
              </div>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-l-none rounded-r-lg border-border"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Patient Email
            </Label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 mt-1.5 rounded-lg border-border"
            />
          </div>

          {/* Protocol Selection */}
          <div>
            <Label className="text-sm text-muted-foreground">Protocol ID</Label>
            <Select value={protocol} onValueChange={setProtocol}>
              <SelectTrigger className="w-full h-11 mt-1.5 bg-card rounded-lg border-border">
                <SelectValue placeholder="Select trial" />
              </SelectTrigger>
              <SelectContent>
                {siteTrials.map((trial) => (
                  <SelectItem key={trial.id} value={trial.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{trial.id}</span>
                      <span className="text-xs text-muted-foreground">{trial.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject ID */}
          <div>
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Subject ID
            </Label>
            <Input
              type="text"
              placeholder="SUBJ-XXX"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="h-11 mt-1.5 rounded-lg border-border"
            />
            <p className="text-xs text-muted-foreground/70 mt-1">
              Pre-assigned subject ID for this patient
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={handleSendInvitation}
          disabled={!canSend || sending}
          className="w-full h-12 bg-info hover:bg-primary text-white rounded-xl font-medium disabled:bg-gray-300"
        >
          {sending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </div>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Invitation
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
