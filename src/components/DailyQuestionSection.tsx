import { useState, useCallback } from 'react'
import { netplusQuestions } from '../data/netplusQuestions'
import { awsQuestions } from '../data/awsQuestions'
import { useStreak } from '../hooks/useTestEngine'
import type { Question } from '../types'

interface DailyState {
  date: string
  answered: boolean
  correct: boolean
  selected: number | null
}

const ALL = [
  ...netplusQuestions.map(q => ({ q, exam: 'netplus' as const })),
  ...awsQuestions.map(q => ({ q, exam: 'aws' as const })),
]

function getTodayEntry(): { q: Question; exam: 'netplus' | 'aws' } {
  const today = new Date().toISOString().split('T')[0]
  const hash = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return ALL[hash % ALL.length]
}

const letters = ['A', 'B', 'C', 'D']

export default function DailyQuestionSection() {
  const today = new Date().toISOString().split('T')[0]
  const { q, exam } = getTodayEntry()
  const { updateStreak } = useStreak()

  const [state, setState] = useState<DailyState>(() => {
    try {
      const s = localStorage.getItem('netcert_daily')
      if (s) {
        const d = JSON.parse(s)
        if (d.date === today) return d
      }
    } catch { /* ignore */ }
    return { date: today, answered: false, correct: false, selected: null }
  })

  const answer = useCallback((idx: number) => {
    if (state.answered) return
    const correct = idx === q.answer
    const next: DailyState = { date: today, answered: true, correct, selected: idx }
    setState(next)
    localStorage.setItem('netcert_daily', JSON.stringify(next))
    updateStreak(1)
  }, [state.answered, q, today, updateStreak])

  const isNet = exam === 'netplus'

  return (
    <section className="mb-12">
      <h2 className="text-lg font-bold text-slate-200 mb-5 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-accent inline-block" />
        Daily Question
        {state.answered && (
          <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full border ${state.correct ? 'text-success border-success/30 bg-success/5' : 'text-danger border-danger/30 bg-danger/5'}`}>
            {state.correct ? 'Answered correctly' : 'Answered'}
          </span>
        )}
      </h2>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={isNet ? 'tag-net' : 'tag-aws'}>{isNet ? 'Net+' : 'AWS CLF'}</span>
            <span className="text-[10px] text-subtle font-mono">{q.domain}</span>
          </div>
          <span className="text-[10px] text-subtle font-mono">{today}</span>
        </div>

        <p className="text-slate-200 text-sm leading-relaxed mb-5">{q.q}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {q.options.map((opt, idx) => {
            let cls = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-start gap-2 '
            if (!state.answered) {
              cls += 'border-border text-slate-300 hover:border-accent/50 hover:bg-accent/5 cursor-pointer'
            } else if (idx === q.answer) {
              cls += 'border-success/40 bg-success/8 text-success cursor-default'
            } else if (idx === state.selected && idx !== q.answer) {
              cls += 'border-danger/40 bg-danger/8 text-danger cursor-default'
            } else {
              cls += 'border-border/40 text-subtle opacity-50 cursor-default'
            }
            return (
              <button key={idx} onClick={() => answer(idx)} className={cls} disabled={state.answered}>
                <span className="text-[10px] font-mono text-subtle mt-0.5 shrink-0">{letters[idx]}</span>
                <span>{opt}</span>
              </button>
            )
          })}
        </div>

        {state.answered && (
          <div className={`rounded-xl border p-4 ${state.correct ? 'border-success/25 bg-success/5' : 'border-accent/20 bg-accent/5'}`}>
            <p className="text-[10px] font-mono text-subtle uppercase tracking-widest mb-1">Explanation</p>
            <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {!state.answered && (
          <p className="text-[10px] text-subtle text-center mt-2">Answer to keep your streak going</p>
        )}
      </div>
    </section>
  )
}
