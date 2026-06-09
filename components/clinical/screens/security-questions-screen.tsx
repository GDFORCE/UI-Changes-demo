"use client"

import { AppBar } from "../app-bar"
import { ShieldCheck, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SecurityQuestionsScreenProps {
  onSubmit: () => void
  onBack: () => void
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

export function SecurityQuestionsScreen({ onSubmit, onBack }: SecurityQuestionsScreenProps) {
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
    <div className="h-full flex flex-col bg-white">
      <AppBar title="Account Security" showBack onBack={onBack} />

      <div className="flex-1 px-5 py-5 overflow-auto">
        {/* Intro */}
        <div className="flex items-start gap-2.5 mb-5">
          <ShieldCheck className="w-5 h-5 text-[#1A3872] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Set up {NUM_QUESTIONS} security questions. We&apos;ll use these to verify it&apos;s you and to
            recover your account if it gets locked. Choose answers only you would know.
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((selected, i) => (
            <div key={i} className="space-y-3">
              {/* Question */}
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">
                  Security Question {i + 1}:
                </label>
                <select
                  value={selected}
                  onChange={(e) => setQuestion(i, e.target.value)}
                  className={cn(
                    "w-full px-3.5 py-3 rounded-lg border border-slate-300 text-sm outline-none bg-white focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100",
                    selected ? "text-[#0F172A]" : "text-slate-400"
                  )}
                >
                  <option value="" disabled>{PLACEHOLDER}</option>
                  {QUESTION_POOLS[i].map((q) => (
                    <option key={q} value={q} className="text-[#0F172A]">{q}</option>
                  ))}
                </select>
              </div>

              {/* Answer */}
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">Answer:</label>
                <div className="relative">
                  <input
                    type={revealed[i] ? "text" : "password"}
                    value={answers[i]}
                    onChange={(e) => setAnswer(i, e.target.value)}
                    className="w-full px-3.5 pr-10 py-3 rounded-lg border border-slate-300 outline-none text-sm text-[#0F172A] focus:border-[#1A3872] focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => toggleReveal(i)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={revealed[i] ? "Hide answer" : "Show answer"}
                  >
                    {revealed[i] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 py-4 border-t border-slate-100">
        <button
          onClick={onSubmit}
          disabled={!allComplete}
          className={cn(
            "w-full py-3.5 rounded-xl font-semibold text-sm transition-all",
            allComplete ? "bg-[#0D1B3E] text-white" : "bg-slate-200 text-slate-400"
          )}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
