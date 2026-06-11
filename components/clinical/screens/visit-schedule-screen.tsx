"use client"

import { AppBar } from "../app-bar"
import { Download, Edit, AlertTriangle, Check, Calendar, Clock, X, Stethoscope, ClipboardList, Plus, Trash2, Pencil, GripVertical } from "lucide-react"
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

  // ── Drag-and-drop reordering ───────────────────────────
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const reorderVisits = (from: number, to: number) => {
    if (from === to) return
    setVisits((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      // Renumber sequentially so the # column follows the new order.
      return next.map((v, i) => ({ ...v, num: i + 1 }))
    })
  }

  const handleSaveTemplate = () => {
    toast.success("Visit template saved")
    onSave()
  }

  return (
    <div className="relative h-full flex flex-col bg-surface">
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
      <div className="px-4 py-3 bg-card border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary bg-info/5 px-2 py-0.5 rounded-full">AI Extracted</span>
          <span className="text-sm text-muted-foreground">{visits.length} visits</span>
        </div>
        {counts.pending > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-warning/15 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            <span className="text-xs text-warning font-medium">{counts.pending} need review</span>
          </div>
        )}
      </div>

      {/* Edit-mode hint */}
      {isEditing && (
        <div className="px-4 py-2 bg-info/5 border-b border-info/20 flex items-center gap-2">
          <Pencil className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-primary font-medium">Editing — tap a visit to edit, drag <GripVertical className="inline w-3 h-3 -mt-0.5" /> to reorder, or remove it.</span>
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
              activeFilter === filter.id ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground"
            )}
          >
            {activeFilter === filter.id && <Check className="w-3.5 h-3.5" />}
            {filter.label}
            <span className={cn(
              "rounded-full px-1.5 text-[11px] font-bold",
              activeFilter === filter.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
            )}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Extracted template table — tap a row to open details */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
          {/* Table header */}
          <div className={cn(
            "grid gap-2 px-4 py-2.5 bg-surface border-b text-xs font-semibold text-muted-foreground",
            isEditing ? "grid-cols-[1.25rem_2rem_1fr_3rem_3rem_2rem]" : "grid-cols-[2rem_1fr_3rem_3rem]"
          )}>
            {isEditing && <span />}
            <span>#</span>
            <span>Visit Name</span>
            <span>Day</span>
            <span>Window</span>
            {isEditing && <span />}
          </div>

          {/* Table body */}
          {visibleVisits.map(({ v: visit, index }) => {
            const draggable = isEditing && activeFilter === "all"
            return (
            <div
              key={index}
              draggable={draggable}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => { if (draggable) { e.preventDefault(); setOverIndex(index) } }}
              onDrop={(e) => {
                if (!draggable) return
                e.preventDefault()
                if (dragIndex !== null) reorderVisits(dragIndex, index)
                setDragIndex(null); setOverIndex(null)
              }}
              onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
              className={cn(
                "grid gap-2 px-4 py-3 text-sm border-b last:border-b-0 items-center cursor-pointer transition-colors hover:bg-surface",
                isEditing ? "grid-cols-[1.25rem_2rem_1fr_3rem_3rem_2rem]" : "grid-cols-[2rem_1fr_3rem_3rem]",
                visit.warning ? "bg-warning/10/40" : "bg-card",
                dragIndex === index && "opacity-40",
                overIndex === index && dragIndex !== null && dragIndex !== index && "ring-2 ring-inset ring-primary"
              )}
              onClick={() => setOpenIndex(index)}
            >
              {isEditing && (
                <span
                  onClick={(e) => e.stopPropagation()}
                  className={cn("flex items-center justify-center text-slate-300", draggable ? "cursor-grab active:cursor-grabbing hover:text-muted-foreground" : "opacity-30")}
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </span>
              )}
              <span className={cn("font-semibold flex items-center", visit.warning ? "text-warning" : "text-foreground")}>
                {visit.warning ? <AlertTriangle className="w-3.5 h-3.5" /> : visit.num}
              </span>
              <span className="text-foreground font-medium truncate">{visit.name}</span>
              <span className="text-muted-foreground">{formatDay(visit.day)}</span>
              <span className="text-muted-foreground">{visit.window}</span>
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
            )
          })}

          {visibleVisits.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground/70">No visits in this filter.</div>
          )}
        </div>

        {/* Add visit */}
        <button
          onClick={addVisit}
          className="mt-3 w-full py-3 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground font-medium flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Visit
        </button>
      </div>

      {/* Save bar */}
      <div className="px-4 py-3 bg-card border-t border-border">
        <button
          onClick={handleSaveTemplate}
          className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm"
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

          <div className="relative bg-card rounded-t-3xl max-h-[88%] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Grab handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3 pt-1 flex items-start justify-between border-b border-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center font-bold flex-shrink-0",
                  openVisit.warning ? "bg-warning/15 text-warning" : "bg-info/5 text-primary"
                )}>
                  {openVisit.warning ? <AlertTriangle className="w-5 h-5" /> : openVisit.num}
                </div>
                <div className="min-w-0">
                  {isEditing ? (
                    <input
                      value={openVisit.name}
                      onChange={(e) => updateVisit(openIndex, { name: e.target.value })}
                      className="w-full font-bold text-foreground text-base border-b border-border focus:border-primary outline-none pb-0.5"
                    />
                  ) : (
                    <h4 className="font-bold text-foreground text-base leading-tight truncate">
                      Visit {openVisit.num} · {openVisit.name}
                    </h4>
                  )}
                  {!isEditing && (
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Day {formatDay(openVisit.day)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Window {openVisit.window} days</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpenIndex(null)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0 ml-2"
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
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Day</label>
                    <input
                      type="number"
                      value={openVisit.day}
                      onChange={(e) => updateVisit(openIndex, { day: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-info/15"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Window</label>
                    <input
                      value={openVisit.window}
                      onChange={(e) => updateVisit(openIndex, { window: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-info/15"
                    />
                  </div>
                </div>
              )}

              {!isEditing && openVisit.warning && (
                <div className="flex items-start gap-2 bg-warning/10 border border-warning/20 rounded-xl px-3 py-2.5">
                  <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-warning">This visit was flagged by AI extraction and needs manual review.</p>
                </div>
              )}

              {/* Clinical tasks */}
              <TaskSection
                title="Clinical Tasks"
                icon={<Stethoscope className="w-4 h-4 text-primary" />}
                dotClass="bg-info"
                tasks={openVisit.clinicalTasks}
                isEditing={isEditing}
                onChange={(ti, val) => updateTask(openIndex, "clinicalTasks", ti, val)}
                onAdd={() => addTask(openIndex, "clinicalTasks")}
                onRemove={(ti) => removeTask(openIndex, "clinicalTasks", ti)}
              />

              {/* Admin tasks */}
              <TaskSection
                title="Admin Tasks"
                icon={<ClipboardList className="w-4 h-4 text-primary" />}
                dotClass="bg-success"
                tasks={openVisit.adminTasks}
                isEditing={isEditing}
                onChange={(ti, val) => updateTask(openIndex, "adminTasks", ti, val)}
                onAdd={() => addTask(openIndex, "adminTasks")}
                onRemove={(ti) => removeTask(openIndex, "adminTasks", ti)}
              />

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">Comments</label>
                <textarea
                  rows={2}
                  placeholder="Add comments..."
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:border-primary focus:ring-2 focus:ring-info/15 outline-none resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border flex gap-3">
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
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold text-sm"
                  >
                    Done
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setOpenIndex(null)}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold text-sm"
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
        <h5 className="text-sm font-semibold text-foreground">{title}</h5>
      </div>
      <div className="space-y-1.5">
        {tasks.map((t, ti) =>
          isEditing ? (
            <div key={ti} className="flex items-center gap-2">
              <input
                value={t}
                onChange={(e) => onChange(ti, e.target.value)}
                placeholder="Task name"
                className="flex-1 px-3 py-2 rounded-lg border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-info/15"
              />
              <button onClick={() => onRemove(ti)} className="text-rose-400 hover:text-rose-600" aria-label="Remove task">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div key={ti} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotClass)} />
              {t}
            </div>
          )
        )}
        {!isEditing && tasks.length === 0 && (
          <p className="text-xs text-muted-foreground/70 italic">No tasks</p>
        )}
        {isEditing && (
          <button onClick={onAdd} className="text-xs font-medium text-primary flex items-center gap-1 mt-1">
            <Plus className="w-3.5 h-3.5" /> Add task
          </button>
        )}
      </div>
    </div>
  )
}
