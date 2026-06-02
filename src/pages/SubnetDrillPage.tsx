import { useState, useCallback } from 'react'
import { generateQuestions } from '../utils/subnetDrill'
import type { DrillQuestion } from '../utils/subnetDrill'

const TOTAL = 10

function getTypeLabel(type: DrillQuestion['type']): string {
  const labels: Record<DrillQuestion['type'], string> = {
    network: 'Network Address',
    broadcast: 'Broadcast Address',
    hosts: 'Usable Hosts',
    mask: 'Subnet Mask',
    first: 'First Host',
    last: 'Last Host',
  }
  return labels[type]
}

export default function SubnetDrillPage() {
  const [questions, setQuestions] = useState<DrillQuestion[]>(() => generateQuestions(TOTAL))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = questions[current]
  const answered = selected !== null

  const handleSelect = useCallback((idx: number) => {
    if (answered) return
    setSelected(idx)
    if (idx === q.answerIndex) setScore(s => s + 1)
  }, [answered, q])

  const handleNext = useCallback(() => {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }, [current, questions.length])

  const restart = useCallback(() => {
    setQuestions(generateQuestions(TOTAL))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }, [])

  if (finished) {
    const pct = Math.round((score / TOTAL) * 100)
    const color = pct >= 80 ? 'text-success' : pct >= 60 ? 'text-aws' : 'text-danger'
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="card p-8 text-center">
          <p className="text-[10px] text-subtle font-mono tracking-widest uppercase mb-2">Drill Complete</p>
          <p className={`text-6xl font-bold font-mono ${color} mb-1`}>{pct}%</p>
          <p className="text-subtle text-sm mb-8">{score} / {TOTAL} correct</p>

          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            <div className="card p-4">
              <p className="text-[10px] text-subtle uppercase tracking-wider mb-1">Correct</p>
              <p className="text-2xl font-bold font-mono text-success">{score}</p>
            </div>
            <div className="card p-4">
              <p className="text-[10px] text-subtle uppercase tracking-wider mb-1">Wrong</p>
              <p className="text-2xl font-bold font-mono text-danger">{TOTAL - score}</p>
            </div>
            <div className="card p-4">
              <p className="text-[10px] text-subtle uppercase tracking-wider mb-1">Score</p>
              <p className={`text-2xl font-bold font-mono ${color}`}>{pct}%</p>
            </div>
          </div>

          <button onClick={restart}
            className="px-6 py-2.5 rounded-lg bg-accent text-void font-semibold text-sm hover:bg-accent/85 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-[10px] text-subtle font-mono tracking-widest uppercase">Subnet Drill</p>
            <h1 className="text-lg font-bold text-slate-200">IP / CIDR Practice</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-subtle uppercase tracking-wider">Score</p>
            <p className="text-lg font-bold font-mono text-accent">{score}<span className="text-subtle">/{current}</span></p>
          </div>
        </div>
        {/* progress */}
        <div className="progress-track mt-3">
          <div className="progress-fill bg-accent transition-all"
            style={{ width: `${(current / TOTAL) * 100}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-subtle mt-1">
          <span>Question {current + 1} of {TOTAL}</span>
          <span>{TOTAL - current - 1} remaining</span>
        </div>
      </div>

      {/* Question card */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] px-2 py-0.5 rounded border border-accent/30 text-accent bg-accent/5 font-mono">
            {getTypeLabel(q.type)}
          </span>
        </div>

        <div className="bg-surface rounded-lg p-4 mb-5 font-mono text-center">
          <p className="text-2xl font-bold text-slate-100 tracking-wider">{q.ip}/{q.prefix}</p>
        </div>

        <p className="text-slate-200 text-sm leading-relaxed mb-5">{q.question}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.choices.map((choice, idx) => {
            let cls = 'w-full px-4 py-3 rounded-lg border text-sm font-mono text-left transition-all '
            if (!answered) {
              cls += 'border-border text-slate-300 hover:border-accent/50 hover:bg-accent/5 cursor-pointer'
            } else if (idx === q.answerIndex) {
              cls += 'border-success/50 bg-success/10 text-success'
            } else if (idx === selected) {
              cls += 'border-danger/50 bg-danger/10 text-danger'
            } else {
              cls += 'border-border/40 text-subtle opacity-50 cursor-default'
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} className={cls}>
                <span className="text-subtle mr-2 text-xs">{String.fromCharCode(65 + idx)}.</span>
                {choice}
                {answered && idx === q.answerIndex && (
                  <span className="ml-2 text-success text-xs">✓</span>
                )}
                {answered && idx === selected && idx !== q.answerIndex && (
                  <span className="ml-2 text-danger text-xs">✗</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Explanation after answer */}
      {answered && (
        <div className={`rounded-lg border p-4 mb-4 text-sm ${selected === q.answerIndex ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5'}`}>
          {selected === q.answerIndex ? (
            <p className="text-success font-medium">Correct!</p>
          ) : (
            <>
              <p className="text-danger font-medium mb-1">Incorrect</p>
              <p className="text-subtle">
                The correct answer is <span className="text-slate-200 font-mono">{q.choices[q.answerIndex]}</span>
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <button onClick={restart}
          className="px-4 py-2 text-xs text-subtle hover:text-slate-200 border border-border/50 rounded-lg hover:border-border transition-colors">
          Restart
        </button>
        {answered && (
          <button onClick={handleNext}
            className="px-5 py-2 rounded-lg bg-accent text-void font-semibold text-sm hover:bg-accent/85 transition-colors">
            {current + 1 >= TOTAL ? 'View Results' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}
