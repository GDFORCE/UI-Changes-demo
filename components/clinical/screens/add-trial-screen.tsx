"use client"

import { AppBar } from "../app-bar"
import { RefreshCw, X, ArrowRight, CheckCircle2, UploadCloud } from "lucide-react"
import { useState } from "react"

interface AddTrialScreenProps {
  onSave: (details?: TrialDetails) => void
  onBack: () => void
  /** App-bar title. Defaults to "Add New Trial". */
  title?: string
  /** Label for the final CTA. Defaults to "Save Trial". */
  saveLabel?: string
}

export interface TrialDetails {
  ctri: string
  title: string
  phase: string
  indications: string[]
  drug: string
  duration: string
  sampleSize: string
  totalVisits: string
}

// Mock "database" of known protocols. In production this is a backend lookup.
const PROTOCOL_DB: Record<string, TrialDetails> = {
  "PROT-2024-001": {
    ctri: "CTRI/2024/01/061234",
    title: "A Phase III Study of Drug X in Type 2 Diabetes",
    phase: "Phase III",
    indications: ["Diabetes", "Hypertension"],
    drug: "Drug X",
    duration: "18 months",
    sampleSize: "100",
    totalVisits: "18",
  },
  "PROT-2023-114": {
    ctri: "CTRI/2023/11/058921",
    title: "Efficacy of Compound Y in Rheumatoid Arthritis",
    phase: "Phase II",
    indications: ["Rheumatoid Arthritis"],
    drug: "Compound Y",
    duration: "12 months",
    sampleSize: "60",
    totalVisits: "10",
  },
}

const EMPTY_DETAILS: TrialDetails = {
  ctri: "",
  title: "",
  phase: "",
  indications: [],
  drug: "",
  duration: "",
  sampleSize: "",
  totalVisits: "",
}

// Details inferred from an uploaded (unknown) protocol document.
const EXTRACTED_FROM_UPLOAD: TrialDetails = {
  ctri: "CTRI/2024/06/067890",
  title: "Extracted Study Title — please review",
  phase: "Phase II",
  indications: ["Diabetes"],
  drug: "Investigational Drug",
  duration: "12 months",
  sampleSize: "80",
  totalVisits: "12",
}

export function AddTrialScreen({ onSave, onBack, title = "Add New Trial", saveLabel = "Save Trial" }: AddTrialScreenProps) {
  const [protocolId, setProtocolId] = useState("")
  const [resolved, setResolved] = useState(false)
  const [source, setSource] = useState<"database" | "upload" | null>(null)
  const [details, setDetails] = useState<TrialDetails>(EMPTY_DETAILS)

  // Upload popup state (shown when the protocol ID is not in the database)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const checkProtocol = () => {
    const key = protocolId.trim().toUpperCase()
    if (!key) return
    const found = PROTOCOL_DB[key]
    if (found) {
      setDetails(found)
      setSource("database")
      setResolved(true)
    } else {
      // Not in the database — ask the user to upload the protocol document.
      setShowUploadModal(true)
    }
  }

  const handleUpload = () => {
    // Simulate document upload + AI extraction.
    setAnalyzing(true)
    setTimeout(() => {
      setDetails(EXTRACTED_FROM_UPLOAD)
      setSource("upload")
      setAnalyzing(false)
      setShowUploadModal(false)
      setResolved(true)
    }, 1800)
  }

  const update = (patch: Partial<TrialDetails>) => setDetails((d) => ({ ...d, ...patch }))

  const removeIndication = (indication: string) =>
    update({ indications: details.indications.filter((i) => i !== indication) })

  return (
    <div className="h-full flex flex-col bg-surface">
      <AppBar title={title} showBack onBack={onBack} />

      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {/* Step 1 — Protocol ID lookup */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Protocol ID *</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={protocolId}
              onChange={(e) => {
                setProtocolId(e.target.value)
                setResolved(false)
                setSource(null)
              }}
              onKeyDown={(e) => e.key === "Enter" && checkProtocol()}
              placeholder="Enter protocol ID"
              className="flex-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
            />
            <button
              onClick={checkProtocol}
              disabled={!protocolId.trim()}
              aria-label="Look up protocol"
              title="Look up protocol"
              className="w-12 h-12 shrink-0 rounded-full bg-primary text-white flex items-center justify-center shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-1.5">
            Enter the protocol ID to auto-fill trial details. If it's not on record, you'll be asked to upload the protocol.
          </p>
        </div>

        {/* Source banner once resolved */}
        {resolved && (
          <div className="bg-success/10 rounded-2xl p-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            <p className="text-sm text-foreground">
              {source === "database"
                ? "Protocol found on record — details auto-filled. Review and save."
                : "Details extracted from the uploaded protocol — review and save."}
            </p>
          </div>
        )}

        {/* Step 2 — Trial details. Shaded preview until a protocol is resolved. */}
        <div
          className={`space-y-4 transition-opacity ${
            resolved ? "" : "opacity-50 pointer-events-none select-none"
          }`}
          aria-disabled={!resolved}
        >
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">CTRI Number *</label>
              <input
                type="text"
                value={details.ctri}
                onChange={(e) => update({ ctri: e.target.value })}
                placeholder="Enter CTRI number"
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Study Title</label>
              <input
                type="text"
                value={details.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Enter study title"
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Phase *</label>
              <select
                value={details.phase}
                onChange={(e) => update({ phase: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
              >
                <option value="" disabled>Select phase</option>
                <option>Phase I</option>
                <option>Phase II</option>
                <option>Phase III</option>
                <option>Phase IV</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Disease/Indication *</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {details.indications.map((indication) => (
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
                onKeyDown={(e) => {
                  const value = (e.target as HTMLInputElement).value.trim()
                  if (e.key === "Enter" && value) {
                    e.preventDefault()
                    if (!details.indications.includes(value)) update({ indications: [...details.indications, value] })
                    ;(e.target as HTMLInputElement).value = ""
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Study Drug Name</label>
              <input
                type="text"
                value={details.drug}
                onChange={(e) => update({ drug: e.target.value })}
                placeholder="Enter drug name"
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Duration of the Trial *</label>
              <input
                type="text"
                value={details.duration}
                onChange={(e) => update({ duration: e.target.value })}
                placeholder="e.g. 18 months"
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">Sample Size *</label>
                <input
                  type="number"
                  value={details.sampleSize}
                  onChange={(e) => update({ sampleSize: e.target.value })}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">Total Visits *</label>
                <input
                  type="number"
                  value={details.totalVisits}
                  onChange={(e) => update({ totalVisits: e.target.value })}
                  placeholder="e.g. 18"
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-info/15 outline-none bg-card"
                />
              </div>
            </div>

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

            <button
              onClick={() => onSave(details)}
              disabled={!resolved}
              className="w-full py-4 rounded-full font-semibold bg-primary text-white disabled:opacity-60"
            >
              {saveLabel}
            </button>
        </div>
      </div>

      {/* Upload popup — shown when the protocol ID is not on record */}
      {showUploadModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm bg-card rounded-2xl p-5 shadow-xl">
            {!analyzing ? (
              <>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">Protocol not on record</h3>
                  <button onClick={() => setShowUploadModal(false)}>
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  We couldn't find <span className="font-medium text-foreground">{protocolId.trim()}</span> in the
                  database. Upload the protocol document and we'll extract the details for you.
                </p>
                <div
                  onClick={handleUpload}
                  className="border-2 border-dashed border-border rounded-2xl p-6 bg-surface text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-3">Drop your protocol document here</p>
                  <span className="inline-block px-4 py-2 border-2 border-primary text-primary rounded-lg font-medium text-sm">
                    Browse Files
                  </span>
                  <p className="text-xs text-muted-foreground/70 mt-2">PDF, DOC, XLS, PNG, JPG</p>
                </div>
              </>
            ) : (
              <div className="py-4 text-center">
                <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                </div>
                <p className="font-medium text-foreground">Analyzing document…</p>
                <div className="h-2 bg-info/15 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "75%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Extracting protocol details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
