"use client"

import { AppBar } from "../app-bar"
import { FileText, RefreshCw, X } from "lucide-react"
import { useState } from "react"

interface AddTrialScreenProps {
  onSave: () => void
  onBack: () => void
}

export function AddTrialScreen({ onSave, onBack }: AddTrialScreenProps) {
  const [processing, setProcessing] = useState(true)
  const [selectedIndications, setSelectedIndications] = useState(["Diabetes", "Hypertension"])

  const removeIndication = (indication: string) => {
    setSelectedIndications(selectedIndications.filter((i) => i !== indication))
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      <AppBar title="Add New Trial" showBack onBack={onBack} />
      
      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {/* Upload Zone */}
        <div className="border-2 border-dashed border-border rounded-2xl p-6 bg-card text-center">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-3">Drop your protocol document here</p>
          <button className="px-4 py-2 border-2 border-primary text-primary rounded-lg font-medium text-sm">
            Browse Files
          </button>
          <p className="text-xs text-muted-foreground/70 mt-2">PDF, DOC, XLS, PNG, JPG</p>
        </div>
        
        {/* AI Processing State */}
        {processing && (
          <div className="bg-info/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-primary animate-spin" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Analyzing document…</p>
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-primary rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Protocol ID *</label>
          <input
            type="text"
            placeholder="Enter protocol ID"
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">CTRI Number *</label>
          <input
            type="text"
            placeholder="Enter CTRI number"
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Study Title</label>
          <input
            type="text"
            placeholder="Enter study title"
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
          />
        </div>
        
        {/* Phase */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Phase *</label>
          <select
            defaultValue=""
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
          >
            <option value="" disabled>Select phase</option>
            <option>Phase I</option>
            <option>Phase II</option>
            <option>Phase III</option>
            <option>Phase IV</option>
          </select>
        </div>

        {/* Disease/Indication Multi-select */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Disease/Indication *</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedIndications.map((indication) => (
              <span
                key={indication}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-info/10 text-primary rounded-full text-sm font-medium"
              >
                {indication}
                <button onClick={() => removeIndication(indication)}>
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add more..."
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Study Drug Name</label>
          <input
            type="text"
            placeholder="Enter drug name"
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
          />
        </div>

        {/* Duration of the Trial */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Duration of the Trial *</label>
          <input
            type="text"
            placeholder="e.g. 18 months"
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
          />
        </div>

        {/* Sample Size + Total Visits */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Sample Size *</label>
            <input
              type="number"
              placeholder="e.g. 100"
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Total Visits *</label>
            <input
              type="number"
              placeholder="e.g. 18"
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
            />
          </div>
        </div>

        {/* Status of Trial — default Active */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Status of Trial</label>
          <select
            defaultValue="Active"
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
          >
            <option>Active</option>
            <option>Completed</option>
            <option>Terminated</option>
          </select>
        </div>

        {/* Save Button — part of the form, scrolls with the content */}
        <button
          onClick={onSave}
          className="w-full py-4 rounded-full font-semibold bg-primary text-white"
        >
          Save Trial
        </button>
      </div>
    </div>
  )
}
