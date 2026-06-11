"use client"

import { useState } from "react"
import { ArrowLeft, AlertCircle, FileText, Check, X } from "lucide-react"
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

interface MasterDataScreenProps {
  onBack?: () => void
}

const customValues = [
  {
    id: "1",
    fieldType: "Disease/Indication",
    value: "Idiopathic Pulmonary Fibrosis",
    submittedBy: "Dr. Sharma",
    organization: "AIIMS Delhi",
    dateSubmitted: "22 May 2025",
    status: "pending",
  },
  {
    id: "2",
    fieldType: "Therapeutic Area",
    value: "Rare Genetic Disorders",
    submittedBy: "Dr. Patel",
    organization: "PGI Chandigarh",
    dateSubmitted: "21 May 2025",
    status: "pending",
  },
  {
    id: "3",
    fieldType: "Disease/Indication",
    value: "Non-Alcoholic Steatohepatitis (NASH)",
    submittedBy: "Dr. Kumar",
    organization: "KEM Mumbai",
    dateSubmitted: "20 May 2025",
    status: "approved",
    actionBy: "Admin",
    actionDate: "21 May 2025",
  },
  {
    id: "4",
    fieldType: "Study Drug Route",
    value: "Intrathecal Injection",
    submittedBy: "Dr. Singh",
    organization: "AIIMS Delhi",
    dateSubmitted: "19 May 2025",
    status: "rejected",
    actionBy: "Admin",
    actionDate: "20 May 2025",
    rejectReason: "Value already exists as 'Intrathecal'",
  },
  {
    id: "5",
    fieldType: "Adverse Event Term",
    value: "Infusion-related hypersensitivity",
    submittedBy: "Dr. Reddy",
    organization: "CMC Vellore",
    dateSubmitted: "18 May 2025",
    status: "pending",
  },
]

export function MasterDataScreen({ onBack }: MasterDataScreenProps) {
  const [filter, setFilter] = useState("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [values, setValues] = useState(customValues)

  const filteredValues = values.filter((v) => {
    if (filter === "all") return true
    return v.status === filter
  })

  const handleApprove = (id: string) => {
    setValues((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: "approved", actionBy: "Admin", actionDate: "25 May 2025" }
          : v
      )
    )
  }

  const handleEditApprove = (id: string) => {
    if (editingId === id) {
      // Save the edit
      setValues((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                value: editValue,
                status: "approved",
                actionBy: "Admin",
                actionDate: "25 May 2025",
              }
            : v
        )
      )
      setEditingId(null)
      setEditValue("")
    } else {
      // Start editing
      const item = values.find((v) => v.id === id)
      if (item) {
        setEditingId(id)
        setEditValue(item.value)
      }
    }
  }

  const handleReject = (id: string) => {
    setValues((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: "rejected",
              actionBy: "Admin",
              actionDate: "25 May 2025",
              rejectReason: "Value not suitable for global use",
            }
          : v
      )
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div>
        <h1 className="text-xl font-bold text-primary">Others Specify approvals</h1>
        <p className="text-sm text-muted-foreground">Review custom dropdown values submitted by users across all modules.</p>
      </div>

      {/* Summary tiles (ADM-05 Section 1) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending", value: values.filter((v) => v.status === "pending").length, color: "text-warning" },
          { label: "Approved (global)", value: values.filter((v) => v.status === "approved").length, color: "text-success" },
          { label: "Rejected", value: values.filter((v) => v.status === "rejected").length, color: "text-destructive" },
          { label: "Total submissions", value: values.length, color: "text-primary" },
        ].map((t) => (
          <div key={t.label} className="rounded-xl bg-card border border-border p-4">
            <div className={`text-2xl font-bold leading-none ${t.color}`}>{t.value}</div>
            <div className="text-xs text-muted-foreground mt-2">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="p-3 bg-info/5 rounded-xl border border-info/20 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
        <p className="text-sm text-primary">
          Approved values are added to the global dropdown list visible to all users. Rejected values remain private to the submitting user.
        </p>
      </div>

      {/* Filter */}
      <div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[240px] h-10 bg-card rounded-lg border-border">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Values List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredValues.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-xl p-4 shadow-md"
          >
            {/* Field Type Badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                {item.fieldType}
              </span>
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  item.status === "pending"
                    ? "bg-warning/15 text-warning"
                    : item.status === "approved"
                    ? "bg-success/15 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>

            {/* Value */}
            {editingId === item.id ? (
              <div className="mb-3">
                <Label className="text-xs text-muted-foreground">Edit Value</Label>
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="mt-1 text-sm"
                  rows={2}
                />
              </div>
            ) : (
              <div className="mb-3">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground/70 mt-0.5" />
                  <p className="text-sm font-medium text-primary-deep">{item.value}</p>
                </div>
              </div>
            )}

            {/* Submitted By */}
            <div className="text-xs text-muted-foreground mb-3">
              <p>
                Submitted by: <span className="text-foreground/80">{item.submittedBy}</span> &middot;{" "}
                {item.organization}
              </p>
              <p>Date: {item.dateSubmitted}</p>
            </div>

            {/* Action Result (for approved/rejected) */}
            {item.status !== "pending" && (
              <div
                className={`text-xs p-2 rounded-lg mb-3 ${
                  item.status === "approved" ? "bg-success/10" : "bg-destructive/5"
                }`}
              >
                <p className={item.status === "approved" ? "text-success" : "text-destructive"}>
                  {item.status === "approved" ? "Approved" : "Rejected"} by {item.actionBy} on{" "}
                  {item.actionDate}
                </p>
                {item.rejectReason && (
                  <p className="text-destructive mt-1">Reason: {item.rejectReason}</p>
                )}
              </div>
            )}

            {/* Action Buttons (only for pending) */}
            {item.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(item.id)}
                  className="flex-1 h-9 bg-success hover:bg-success text-white rounded-lg text-xs"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditApprove(item.id)}
                  className="flex-1 h-9 border-info text-info hover:bg-info/5 rounded-lg text-xs"
                >
                  {editingId === item.id ? "Save Edit" : "Edit & Approve"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(item.id)}
                  className="flex-1 h-9 border-red-500 text-destructive hover:bg-destructive/5 rounded-lg text-xs"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}

        {filteredValues.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/70">
            <FileText className="w-12 h-12 mb-3" />
            <p>No custom values found</p>
          </div>
        )}
      </div>
    </div>
  )
}
