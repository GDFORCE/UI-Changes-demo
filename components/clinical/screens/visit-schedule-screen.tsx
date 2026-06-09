"use client"

import { AppBar } from "../app-bar"
import { Download, Edit, AlertTriangle, Check, Calendar, Clock, X, Stethoscope, ClipboardList, Plus, Trash2, Pencil } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface VisitScheduleScreenProps {
  onSave: () => void
  onBack: () => void
}

interface Visit {
  num: number
  name: string
  day: number
  window: string
  warning: boolean
  clinicalTasks: string[]
  adminTasks: string[]
}

const INITIAL_VISITS: Visit[] = [
  { num: 1, name: "Screening", day: -14, window: "±3", warning: false,
    clinicalTasks: ["Vital signs", "Medical history", "Physical exam"], adminTasks: ["Informed Consent", "Eligibility check"] },
  { num: 2, name: "Baseline", day: 1, window: "-2/+2", warning: false,
    clinicalTasks: ["Vital signs", "Blood draw", "ECG"], adminTasks: ["Informed Consent", "eCRF"] },
  { num: 3, name: "Follow-up", day: 7, window: "±2", warning: true,
    clinicalTasks: ["Vital signs", "Adverse event review"], adminTasks: ["eCRF", "Drug accountability"] },
  { num: 4, name: "Follow-up", day: 14, window: "±2", warning: false,
    clinicalTasks: ["Vital signs", "Blood draw"], adminTasks: ["eCRF"] },
  { num: 5, name: "Follow-up", day: 28, window: "±3", warning: false,
    clinicalTasks: ["Vital signs", "ECG", "Lab panel"], adminTasks: ["eCRF", "Drug accountability"] },
  { num: 6, name: "End of Study", day: 56, window: "±5", warning: false,
    clinicalTasks: ["Vital signs", "Final exam", "Blood draw"], adminTasks: ["eCRF", "Study completion form"] },
]

export function VisitScheduleScreen({ onSave, onBack }: VisitScheduleScreenProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "ok">("all")
  const [visits, setVisits] = useState<Visit[]>(INITIAL_VISITS)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const counts = {
    all: visits.length,
    pending: visits.filter((v) => v.warning).length,
    ok: visits.filter((v) => !v.warning).length,
  }

  const filters = [
    { id: "all", label: "All", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "ok", label: "OK", count: counts.ok },
  ] as const

  // Keep original indices so edits map back to the source array even when filtered.
  const visibleVisits = visits
    .map((v, index) => ({ v, index }))
    .filter(({ v }) =>
      activeFilter === "all" ? true : activeFilter === "pending" ? v.warning : !v.warning
    )

  const formatDay = (day: number) => (day < 0 ? `${day}` : `+${day}`)
  const openVisit = openIndex !== null ? visits[openIndex] : null

  // ── Mutations ──────────────────────────────────────────
  const updateVisit = (index: number, patch: Partial<Visit>) =>
    setVisits((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)))

  const updateTask = (index: number, kind: "clinicalTasks" | "adminTasks", taskIdx: number, value: string) =>
    setVisits((prev) => prev.map((v, i) =>
      i === index ? { ...v, [kind]: v[kind].map((t, ti) => (ti === taskIdx ? value : t)) } : v))

  const addTask = (index: number, kind: "clinicalTasks" | "adminTasks") =>
    setVisits((prev) => prev.map((v, i) => (i === index ? { ...v, [kind]: [...v[kind], ""] } : v)))

  const removeTask = (index: number, kind: "clinicalTasks" | "adminTasks", taskIdx: number) =>
    setVisits((prev) => prev.map((v, i) =>
      i === index ? { ...v, [kind]: v[kind].filter((_, ti) => ti !== taskIdx) } : v))

  const addVisit = () => {
    const nextNum = visits.length ? Math.max(...visits.map((v) => v.num)) + 1 : 1
    const newVisit: Visit = { num: nextNum, name: "New Visit", day: 0, window: "±3", warning: false, clinicalTasks: [], adminTasks: [] }
    setVisits((prev) => [...prev, newVisit])
    setIsEditing(true)
    setOpenIndex(visits.length)
  }

  const removeVisit = (index: number) => {
    setVisits((prev) => prev.filter((_, i) => i !== index))
    setOpenIndex(null)
  }

  const handleSaveTemplate = () => {
    toast.success("Visit template saved")
    onSave()
  }

  return (
    <div className="relative h-full flex flex-col bg-gray-50">
      <AppBar
        title="Visit Schedule"
        showBack
        onBack={onBack}
        rightContent={
          <div className="flex items-center gap-1">
            <button className="p-2"><Download className="w-5 h-5 text-white" /></button>
            <button
              onClick={() => setIsEditing((e) => !e)}
              className={cn("p-2 rounded-lg transition-colors", isEditing ? "bg-white/20" : "")}
              aria-label="Edit schedule"
            >
              {isEditing ? <Check className="w-5 h-5 text-white" /> : <Edit className="w-5 h-5 text-white" />}
            </button>
          </div>
        }
      />

      {/* Summary banner */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#1A3872] bg-blue-50 px-2 py-0.5 rounded-full">AI Extracted</span>
          <span className="text-sm text-gray-500">{visits.length} visits</span>
        </div>
        {counts.pending > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="text-xs text-[#D97706] font-medium">{counts.pending} need review</span>
          </div>
        )}
      </div>

      {/* Edit-mode hint */}
      {isEditing && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
          <Pencil className="w-3.5 h-3.5 text-[#1A3872]" />
          <span className="text-xs text-[#1A3872] font-medium">Editing — tap a visit to edit its details, or remove it.</span>
        </div>
      )}

      {/* Filters */}
      <div className="px-4 py-3 flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors",
              activeFilter === filter.id ? "bg-[#1A3872] text-white" : "bg-white border border-slate-200 text-gray-600"
            )}
          >
            {activeFilter === filter.id && <Check className="w-3.5 h-3.5" />}
            {filter.label}
            <span className={cn(
              "rounded-full px-1.5 text-[11px] font-bold",
              activeFilter === filter.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            )}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Extracted template table — tap a row to open details */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          {/* Table header */}
          <div className={cn(
            "grid gap-2 px-4 py-2.5 bg-gray-50 border-b text-xs font-semibold text-gray-500",
            isEditing ? "grid-cols-[2rem_1fr_3rem_3rem_2rem]" : "grid-cols-[2rem_1fr_3rem_3rem]"
          )}>
            <span>#</span>
            <span>Visit Name</span>
            <span>Day</span>
            <span>Window</span>
            {isEditing && <span />}
          </div>

          {/* Table body */}
          {visibleVisits.map(({ v: visit, index }) => (
            <div
              key={index}
              className={cn(
                "grid gap-2 px-4 py-3 text-sm border-b last:border-b-0 items-center cursor-pointer transition-colors hover:bg-slate-50",
                isEditing ? "grid-cols-[2rem_1fr_3rem_3rem_2rem]" : "grid-cols-[2rem_1fr_3rem_3rem]",
                visit.warning ? "bg-amber-50/40" : "bg-white"
              )}
              onClick={() => setOpenIndex(index)}
            >
              <span className={cn("font-semibold flex items-center", visit.warning ? "text-[#D97706]" : "text-gray-900")}>
                {visit.warning ? <AlertTriangle className="w-3.5 h-3.5" /> : visit.num}
              </span>
              <span className="text-gray-800 font-medium truncate">{visit.name}</span>
              <span className="text-gray-600">{formatDay(visit.day)}</span>
              <span className="text-gray-500">{visit.window}</span>
              {isEditing && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeVisit(index) }}
                  className="text-rose-400 hover:text-rose-600 flex items-center justify-center"
                  aria-label="Remove visit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {visibleVisits.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">No visits in this filter.</div>
          )}
        </div>

        {/* Add visit */}
        <button
          onClick={addVisit}
          className="mt-3 w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-sm text-slate-500 font-medium flex items-center justify-center gap-1.5 hover:border-[#1A3872] hover:text-[#1A3872] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Visit
        </button>
      </div>

      {/* Save bar */}
      <div className="px-4 py-3 bg-white border-t border-slate-100">
        <button
          onClick={handleSaveTemplate}
          className="w-full py-3.5 bg-[#1A3872] text-white rounded-xl font-semibold text-sm"
        >
          Save Template
        </button>
      </div>

      {/* ── Dynamic visit-detail bottom sheet ── */}
      {openVisit && openIndex !== null && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
            onClick={() => setOpenIndex(null)}
          />

          <div className="relative bg-white rounded-t-3xl max-h-[88%] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Grab handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3 pt-1 flex items-start justify-between border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center font-bold flex-shrink-0",
                  openVisit.warning ? "bg-amber-100 text-[#D97706]" : "bg-blue-50 text-[#1A3872]"
                )}>
                  {openVisit.warning ? <AlertTriangle className="w-5 h-5" /> : openVisit.num}
                </div>
                <div className="min-w-0">
                  {isEditing ? (
                    <input
                      value={openVisit.name}
                      onChange={(e) => updateVisit(openIndex, { name: e.target.value })}
                      className="w-full font-bold text-gray-900 text-base border-b border-slate-300 focus:border-[#1A3872] outline-none pb-0.5"
                    />
                  ) : (
                    <h4 className="font-bold text-gray-900 text-base leading-tight truncate">
                      Visit {openVisit.num} · {openVisit.name}
                    </h4>
                  )}
                  {!isEditing && (
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Day {formatDay(openVisit.day)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Window {openVisit.window} days</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpenIndex(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 ml-2"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto px-5 py-4 space-y-5">
              {/* Editable day / window */}
              {isEditing && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Day</label>
                    <input
                      type="number"
                      value={openVisit.day}
                      onChange={(e) => updateVisit(openIndex, { day: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Window</label>
                    <input
                      value={openVisit.window}
                      onChange={(e) => updateVisit(openIndex, { window: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              )}

              {!isEditing && openVisit.warning && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">This visit was flagged by AI extraction and needs manual review.</p>
                </div>
              )}

              {/* Clinical tasks */}
              <TaskSection
                title="Clinical Tasks"
                icon={<Stethoscope className="w-4 h-4 text-[#1A3872]" />}
                dotClass="bg-[#2563EB]"
                tasks={openVisit.clinicalTasks}
                isEditing={isEditing}
                onChange={(ti, val) => updateTask(openIndex, "clinicalTasks", ti, val)}
                onAdd={() => addTask(openIndex, "clinicalTasks")}
                onRemove={(ti) => removeTask(openIndex, "clinicalTasks", ti)}
              />

              {/* Admin tasks */}
              <TaskSection
                title="Admin Tasks"
                icon={<ClipboardList className="w-4 h-4 text-[#1A3872]" />}
                dotClass="bg-emerald-500"
                tasks={openVisit.adminTasks}
                isEditing={isEditing}
                onChange={(ti, val) => updateTask(openIndex, "adminTasks", ti, val)}
                onAdd={() => addTask(openIndex, "adminTasks")}
                onRemove={(ti) => removeTask(openIndex, "adminTasks", ti)}
              />

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Comments</label>
                <textarea
                  rows={2}
                  placeholder="Add comments..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => removeVisit(openIndex)}
                    className="flex-1 py-3 border border-rose-200 text-rose-600 rounded-xl font-medium text-sm flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                  <button
                    onClick={() => setOpenIndex(null)}
                    className="flex-1 py-3 bg-[#1A3872] text-white rounded-xl font-semibold text-sm"
                  >
                    Done
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setOpenIndex(null)}
                  className="flex-1 py-3 bg-[#1A3872] text-white rounded-xl font-semibold text-sm"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Task list section (view + edit) ──────────────────────
function TaskSection({
  title, icon, dotClass, tasks, isEditing, onChange, onAdd, onRemove,
}: {
  title: string
  icon: React.ReactNode
  dotClass: string
  tasks: string[]
  isEditing: boolean
  onChange: (taskIdx: number, value: string) => void
  onAdd: () => void
  onRemove: (taskIdx: number) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h5 className="text-sm font-semibold text-gray-800">{title}</h5>
      </div>
      <div className="space-y-1.5">
        {tasks.map((t, ti) =>
          isEditing ? (
            <div key={ti} className="flex items-center gap-2">
              <input
                value={t}
                onChange={(e) => onChange(ti, e.target.value)}
                placeholder="Task name"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100"
              />
              <button onClick={() => onRemove(ti)} className="text-rose-400 hover:text-rose-600" aria-label="Remove task">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div key={ti} className="flex items-center gap-2 text-sm text-gray-600">
              <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotClass)} />
              {t}
            </div>
          )
        )}
        {!isEditing && tasks.length === 0 && (
          <p className="text-xs text-slate-400 italic">No tasks</p>
        )}
        {isEditing && (
          <button onClick={onAdd} className="text-xs font-medium text-[#1A3872] flex items-center gap-1 mt-1">
            <Plus className="w-3.5 h-3.5" /> Add task
          </button>
        )}
      </div>
    </div>
  )
}
