"use client"

import { AuthHeader } from "../auth-header"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SecurityQuestionsScreenProps {
  onSubmit: () => void
  onBack: () => void
  /** Override the header eyebrow (e.g. invite flow has no "Step 3 of 5"). */
  eyebrow?: string
  /** Progress step for the header bar; omit to hide it (invite flow). */
  step?: number
}

// Production apps ask several questions so a single leaked answer can't unlock an
// account. We ask 3, each drawn from a distinct pool so the same question can't
// be chosen twice.
const QUESTION_POOLS: string[][] = [
  [
    "What is the name of your first pet?",
    "What was the name of your first school?",
    "What was your childhood nickname?",
  ],
  [
    "What city were you born in?",
    "What is your favourite book?",
    "What was the make of your first car?",
  ],
  [
    "What is your mother's maiden name?",
    "What is the name of your closest childhood friend?",
    "In what town did your parents meet?",
  ],
]

const NUM_QUESTIONS = QUESTION_POOLS.length
const PLACEHOLDER = "Please select a question"

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-border bg-card text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/15"

export function SecurityQuestionsScreen({ onSubmit, onBack, eyebrow, step }: SecurityQuestionsScreenProps) {
  const [questions, setQuestions] = useState<string[]>(Array(NUM_QUESTIONS).fill(""))
  const [answers, setAnswers] = useState<string[]>(Array(NUM_QUESTIONS).fill(""))
  const [revealed, setRevealed] = useState<boolean[]>(Array(NUM_QUESTIONS).fill(false))

  const setQuestion = (i: number, q: string) =>
    setQuestions((prev) => prev.map((v, idx) => (idx === i ? q : v)))
  const setAnswer = (i: number, a: string) =>
    setAnswers((prev) => prev.map((v, idx) => (idx === i ? a : v)))
  const toggleReveal = (i: number) =>
    setRevealed((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const allComplete = questions.every((q) => q) && answers.every((a) => a.trim().length > 0)

  return (
    <div className="h-full flex flex-col bg-background paper-grain">
      <AuthHeader
        eyebrow={eyebrow}
        title="Only you would know"
        subtitle="Three security questions help us verify it's you and recover your account if it's ever locked."
        onBack={onBack}
        step={step}
      />

      <div className="flex-1 px-6 pt-3 pb-4 overflow-auto">
        <div className="space-y-4">
          {questions.map((selected, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card shadow-xs p-4 space-y-3 animate-rise"
              style={{ animationDelay: `${200 + i * 90}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="font-heading text-lg tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="eyebrow text-muted-foreground">Security question</span>
              </div>

              <select
                value={selected}
                onChange={(e) => setQuestion(i, e.target.value)}
                className={cn(inputClass, selected ? "text-foreground" : "text-muted-foreground/60")}
              >
                <option value="" disabled>{PLACEHOLDER}</option>
                {QUESTION_POOLS[i].map((q) => (
                  <option key={q} value={q} className="text-foreground">{q}</option>
                ))}
              </select>

              <div className="relative">
                <input
                  type={revealed[i] ? "text" : "password"}
                  value={answers[i]}
                  placeholder="Your answer"
                  onChange={(e) => setAnswer(i, e.target.value)}
                  className={cn(inputClass, "pr-10 placeholder:text-muted-foreground/55")}
                />
                <button
                  type="button"
                  onClick={() => toggleReveal(i)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
                  aria-label={revealed[i] ? "Hide answer" : "Show answer"}
                >
                  {revealed[i] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/70 text-center mt-5 leading-relaxed">
          Choose answers that don't change over time and that only you would know.
        </p>
      </div>

      <div className="px-6 py-4 bg-background/90 backdrop-blur-sm border-t border-border">
        <button
          onClick={onSubmit}
          disabled={!allComplete}
          className={cn(
            "w-full py-4 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-200",
            allComplete
              ? "bg-primary text-primary-foreground shadow-md hover:bg-primary-deep active:scale-[0.99]"
              : "bg-muted text-muted-foreground/60 cursor-not-allowed",
          )}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
