import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTestEngine, useProgress, useBookmarks, useStreak } from '../hooks/useTestEngine'
import { netplusQuestions } from '../data/netplusQuestions'
import { awsQuestions } from '../data/awsQuestions'
import type { Question, TestResult } from '../types'

// ── Types ─────────────────────────────────────────────────────────────────────

interface TestPageProps {
  accentCls: string; accentBg: string; accentText: string
  label: string; code: string; passThreshold: number
  examKey: 'netplus' | 'aws'; tagCls: string
}

interface StartConfig {
  count: number
  timerSeconds: number | null
  pool: 'all' | 'weak' | 'bookmarked'
}

// ── Option helpers ────────────────────────────────────────────────────────────

function optionClass(idx: number, selected: number | null, answered: boolean, correct: number): string {
  const base = 'w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150 flex items-start gap-3'
  if (!answered) return `${base} border-border bg-surface hover:bg-white/[0.04] hover:border-slate-500 text-slate-200 cursor-pointer`
  if (idx === correct) return `${base} border-success bg-success/10 text-success cursor-default`
  if (idx === selected && idx !== correct) return `${base} border-danger bg-danger/10 text-danger cursor-default`
  return `${base} border-border/50 bg-surface/50 text-subtle cursor-default`
}

function OptionIcon({ idx, selected, answered, correct }: { idx: number; selected: number | null; answered: boolean; correct: number }) {
  const letters = ['A', 'B', 'C', 'D']
  if (!answered) return <span className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs font-mono text-subtle flex-shrink-0 mt-0.5">{letters[idx]}</span>
  if (idx === correct) return <span className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5"><svg className="w-3.5 h-3.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg></span>
  if (idx === selected) return <span className="w-6 h-6 rounded-full bg-danger/20 flex items-center justify-center flex-shrink-0 mt-0.5"><svg className="w-3.5 h-3.5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></span>
  return <span className="w-6 h-6 rounded-full border border-border/40 flex items-center justify-center text-xs font-mono text-subtle/50 flex-shrink-0 mt-0.5">{letters[idx]}</span>
}

// ── Results helpers ───────────────────────────────────────────────────────────

function DomainBreakdown({ results }: { results: TestResult[] }) {
  const domains = Array.from(new Set(results.map(r => r.domain)))
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Domain Breakdown</h3>
      <div className="space-y-3">
        {domains.map(domain => {
          const dr = results.filter(r => r.domain === domain)
          const correct = dr.filter(r => r.correct).length
          const pct = Math.round((correct / dr.length) * 100)
          return (
            <div key={domain}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-subtle">{domain}</span>
                <span className={`font-mono font-semibold ${pct >= 70 ? 'text-success' : pct >= 55 ? 'text-aws' : 'text-danger'}`}>{correct}/{dr.length} ({pct}%)</span>
              </div>
              <div className="progress-track">
                <div className={`progress-fill ${pct >= 70 ? 'bg-success' : pct >= 55 ? 'bg-aws' : 'bg-danger'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReviewWrongAnswers({ results }: { results: TestResult[] }) {
  const [open, setOpen] = useState(false)
  const wrong = results.filter(r => !r.correct)
  if (wrong.length === 0) return <div className="card p-5 border-success/20"><p className="text-success text-sm font-semibold text-center">Perfect score — no wrong answers!</p></div>
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
        <h3 className="text-sm font-semibold text-slate-200">Review Wrong Answers ({wrong.length})</h3>
        <svg className={`w-4 h-4 text-subtle transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
      </button>
      {open && (
        <div className="border-t border-border divide-y divide-border/40">
          {wrong.map(r => (
            <div key={r.questionId} className="p-5">
              <p className="text-sm text-slate-200 mb-3 leading-relaxed">{r.question}</p>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-start gap-2 text-xs"><span className="text-danger flex-shrink-0 font-semibold">Your answer:</span><span className="text-danger">{r.yourAnswer}</span></div>
                <div className="flex items-start gap-2 text-xs"><span className="text-success flex-shrink-0 font-semibold">Correct answer:</span><span className="text-success">{r.correctAnswer}</span></div>
              </div>
              <div className="bg-surface rounded-lg p-3 border border-border/50">
                <p className="text-xs text-subtle leading-relaxed"><span className="text-accent font-semibold">Explanation: </span>{r.explanation}</p>
              </div>
              <span className="text-[10px] text-subtle font-mono mt-2 block">{r.domain}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Results Screen ────────────────────────────────────────────────────────────

function ResultsScreen({ results, score, total, passThreshold, label, code, accentCls, tagCls, onRestart }: {
  results: TestResult[]; score: number; total: number; passThreshold: number
  label: string; code: string; accentCls: string; tagCls: string; onRestart: () => void
}) {
  const pct = Math.round((score / total) * 100)
  const passed = pct >= passThreshold
  const scoreColor = pct >= 80 ? 'text-success' : pct >= passThreshold ? 'text-aws' : 'text-danger'
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className={`card p-8 text-center border ${passed ? 'border-success/30' : 'border-danger/30'}`}>
        <div className="mb-2"><span className={tagCls}>{code}</span></div>
        <p className="text-subtle text-sm mb-4">{label} Practice Exam Results</p>
        <div className={`text-6xl font-bold font-mono mb-2 ${scoreColor}`}>{pct}%</div>
        <p className="text-slate-400 text-sm mb-5">{score} of {total} correct</p>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${passed ? 'bg-success/10 text-success border border-success/30' : 'bg-danger/10 text-danger border border-danger/30'}`}>
          {passed
            ? <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>Passed — above {passThreshold}% threshold</>
            : <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>Did not pass — need {passThreshold}% ({Math.ceil((passThreshold / 100) * total)} correct)</>
          }
        </div>
        <div className="mt-6 progress-track h-2.5 max-w-sm mx-auto">
          <div className={`progress-fill ${scoreColor.replace('text-', 'bg-')}`} style={{ width: `${pct}%` }} />
          <div className="absolute top-0 h-full w-px bg-slate-500/50" style={{ left: `${passThreshold}%` }} />
        </div>
        <p className="text-xs text-subtle mt-2">Pass mark: {passThreshold}%</p>
      </div>
      <DomainBreakdown results={results} />
      <ReviewWrongAnswers results={results} />
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onRestart} className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm ${accentCls} transition-colors`}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
          New Exam
        </button>
        <Link to="/" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border border-border text-subtle hover:text-slate-200 hover:border-slate-500 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

// ── Config Screen ─────────────────────────────────────────────────────────────

function ConfigScreen({ label, code, tagCls, accentCls, accentText, weakCount, bookmarkCount, onStart }: TestPageProps & {
  weakCount: number; bookmarkCount: number; onStart: (cfg: StartConfig) => void
}) {
  const [count, setCount] = useState(30)
  const [timer, setTimer] = useState<number | null>(null)
  const [pool, setPool] = useState<'all' | 'weak' | 'bookmarked'>('all')

  const poolOpts = [
    { id: 'all' as const, label: 'All Questions', count: null },
    { id: 'weak' as const, label: 'Weak Spots', count: weakCount },
    { id: 'bookmarked' as const, label: 'Bookmarked', count: bookmarkCount },
  ]

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <div className="card p-8 space-y-8">
        <div className="text-center">
          <span className={tagCls}>{code}</span>
          <h1 className="text-2xl font-bold text-slate-100 mt-3 mb-1">{label} Practice Exam</h1>
          <p className="text-subtle text-sm">Configure your session</p>
        </div>

        {/* Pool */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Question Pool</label>
          <div className="space-y-2">
            {poolOpts.map(opt => (
              <button key={opt.id} onClick={() => setPool(opt.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all border ${pool === opt.id ? `${accentCls} border-transparent` : 'border-border text-subtle hover:border-slate-500 hover:text-slate-200'}`}>
                <span>{opt.label}</span>
                {opt.count !== null && (
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${pool === opt.id ? 'bg-black/20' : 'bg-surface text-subtle'}`}>
                    {opt.count} {opt.count === 1 ? 'question' : 'questions'}
                  </span>
                )}
              </button>
            ))}
          </div>
          {pool === 'weak' && weakCount === 0 && (
            <p className="text-xs text-subtle/70 mt-2 pl-1">Complete some tests first to build your weak spots list.</p>
          )}
          {pool === 'bookmarked' && bookmarkCount === 0 && (
            <p className="text-xs text-subtle/70 mt-2 pl-1">Bookmark questions during tests to use this mode.</p>
          )}
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Questions</label>
          <div className="grid grid-cols-3 gap-3">
            {[10, 20, 30].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`py-3 rounded-xl font-bold text-sm transition-all border ${count === n ? `${accentCls} border-transparent` : 'border-border text-subtle hover:border-slate-500 hover:text-slate-200'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Timer</label>
          <div className="grid grid-cols-3 gap-3">
            {([{ label: 'Off', value: null }, { label: '45 min', value: 45 * 60 }, { label: '90 min', value: 90 * 60 }] as const).map(opt => (
              <button key={opt.label} onClick={() => setTimer(opt.value ?? null)}
                className={`py-3 rounded-xl font-bold text-sm transition-all border ${timer === (opt.value ?? null) ? `${accentCls} border-transparent` : 'border-border text-subtle hover:border-slate-500 hover:text-slate-200'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="bg-surface rounded-xl p-4 border border-border/50">
          <p className={`text-xs font-semibold mb-3 uppercase tracking-wider ${accentText}`}>Keyboard shortcuts</p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-subtle">
            {[['1 – 4', 'Select answer'], ['Enter / →', 'Next question'], ['S / Space', 'Skip question'], ['B', 'Bookmark question']].map(([k, d]) => (
              <span key={k} className="flex items-center gap-2">
                <kbd className="font-mono bg-border/60 px-1.5 py-0.5 rounded text-slate-300 text-[10px]">{k}</kbd>{d}
              </span>
            ))}
          </div>
        </div>

        <button onClick={() => onStart({ count, timerSeconds: timer, pool })}
          className={`w-full py-3.5 rounded-xl font-bold text-sm ${accentCls} transition-colors`}>
          Start — {count} Questions{timer ? ` · ${timer / 60} min` : ''}
        </button>
      </div>
    </div>
  )
}

// ── Active Test ───────────────────────────────────────────────────────────────

function ActiveTest(props: TestPageProps & {
  questions: Question[]; count: number; timerSeconds: number | null
  bookmarkIds: number[]; onToggleBookmark: (id: number) => void; onBackToConfig: () => void
}) {
  const { accentCls, accentBg, accentText, label, code, passThreshold, examKey, tagCls,
    questions, count, timerSeconds, bookmarkIds, onToggleBookmark, onBackToConfig } = props
  const engine = useTestEngine(questions, count)
  const { recordScore } = useProgress()
  const { updateStreak } = useStreak()
  const [scored, setScored] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(timerSeconds)
  const forceFinishRef = useRef(engine.forceFinish)
  useEffect(() => { forceFinishRef.current = engine.forceFinish }, [engine.forceFinish])

  useEffect(() => {
    if (engine.finished && !scored) {
      recordScore(examKey, engine.score, engine.total, engine.results)
      updateStreak(engine.total)
      setScored(true)
    }
  }, [engine.finished, scored, recordScore, updateStreak, examKey, engine.score, engine.total, engine.results])

  useEffect(() => {
    if (timerSeconds === null) return
    const id = setInterval(() => setTimeLeft(t => (t === null || t <= 1) ? (clearInterval(id), 0) : t - 1), 1000)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (timeLeft === 0 && !engine.finished) forceFinishRef.current()
  }, [timeLeft, engine.finished])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (engine.finished) return
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    if (!engine.answered) {
      if (['1', '2', '3', '4'].includes(e.key)) engine.selectAnswer(Number(e.key) - 1)
      if (e.key === 's' || e.key === 'S' || e.key === ' ') { e.preventDefault(); engine.skip() }
      if (e.key === 'b' || e.key === 'B') onToggleBookmark(engine.currentQuestion.id)
    } else {
      if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); engine.next() }
    }
  }, [engine, onToggleBookmark])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  if (engine.finished) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResultsScreen results={engine.results} score={engine.score} total={engine.total}
          passThreshold={passThreshold} label={label} code={code}
          accentCls={accentCls} tagCls={tagCls} onRestart={onBackToConfig} />
      </div>
    )
  }

  const q = engine.currentQuestion
  const bookmarked = bookmarkIds.includes(q.id)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className={tagCls}>{code}</span>
          <span className="text-subtle text-xs">Question {engine.current + 1} of {engine.total}</span>
        </div>
        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <div className={`flex items-center gap-1.5 font-mono text-sm font-bold ${timeLeft < 300 ? 'text-danger' : timeLeft < 600 ? 'text-aws' : accentText}`}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={10} /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
              {fmt(timeLeft)}
            </div>
          )}
          <div className="text-right">
            <p className="text-[10px] text-subtle uppercase tracking-wider">Score</p>
            <p className={`text-sm font-bold font-mono ${accentText}`}>{engine.score}/{engine.current}</p>
          </div>
        </div>
      </div>

      <div className="progress-track mb-2">
        <div className={`progress-fill ${accentBg}`} style={{ width: `${engine.progress}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-subtle mb-6">
        <span>Progress</span><span>{Math.round(engine.progress)}%</span>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-[10px] font-mono text-subtle uppercase tracking-widest bg-surface border border-border px-2.5 py-1 rounded-full">{q.domain}</span>
      </div>

      <div className="card p-6 mb-5 relative">
        <button onClick={() => onToggleBookmark(q.id)} title="Bookmark (B)"
          className={`absolute top-4 right-4 transition-colors ${bookmarked ? 'text-amber-400' : 'text-subtle hover:text-amber-400'}`}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </button>
        <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-medium pr-8">{q.q}</p>
      </div>

      <div className="space-y-3 mb-6">
        {q.options.map((option, idx) => (
          <button key={idx} onClick={() => engine.selectAnswer(idx)} disabled={engine.answered}
            className={optionClass(idx, engine.selected, engine.answered, q.answer)}>
            <OptionIcon idx={idx} selected={engine.selected} answered={engine.answered} correct={q.answer} />
            <span>{option}</span>
          </button>
        ))}
      </div>

      {engine.answered && (
        <div className={`card p-4 mb-5 border ${engine.selected === q.answer ? 'border-success/30 bg-success/5' : 'border-accent/20 bg-accent/5'}`}>
          <div className="flex items-start gap-2">
            <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${engine.selected === q.answer ? 'text-success' : 'text-accent'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
            <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] text-subtle/40 mb-3">
        {engine.answered
          ? <><kbd className="font-mono bg-border/40 px-1 rounded">Enter</kbd> / <kbd className="font-mono bg-border/40 px-1 rounded">→</kbd> next</>
          : <><kbd className="font-mono bg-border/40 px-1 rounded">1–4</kbd> select · <kbd className="font-mono bg-border/40 px-1 rounded">S</kbd> skip · <kbd className="font-mono bg-border/40 px-1 rounded">B</kbd> bookmark</>
        }
      </p>

      <div className="flex items-center gap-3">
        {engine.answered ? (
          <button onClick={engine.next} className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm ${accentCls} transition-colors`}>
            {engine.current + 1 >= engine.total ? 'View Results' : 'Next Question'}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </button>
        ) : (
          <button onClick={engine.skip} className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border border-border text-subtle hover:text-slate-200 hover:border-slate-500 transition-colors">
            Skip
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </button>
        )}
      </div>
    </div>
  )
}

// ── TestScreen ────────────────────────────────────────────────────────────────

function TestScreen(props: TestPageProps) {
  const [config, setConfig] = useState<StartConfig | null>(null)
  const { progress } = useProgress()
  const { bookmarks, toggleBookmark } = useBookmarks()

  const allQuestions: Question[] = props.examKey === 'netplus' ? netplusQuestions : awsQuestions

  const weakCount = Object.entries(progress[props.examKey].weakSpots)
    .filter(([, ws]) => ws.seen >= 2 && ws.wrong / ws.seen >= 0.4).length

  const bookmarkCount = bookmarks[props.examKey].length

  const getPool = (cfg: StartConfig): Question[] => {
    if (cfg.pool === 'weak') {
      const ws = progress[props.examKey].weakSpots
      const weak = allQuestions
        .filter(q => { const e = ws[q.id]; return e && e.seen >= 2 && e.wrong / e.seen >= 0.4 })
        .sort((a, b) => {
          const ea = ws[a.id], eb = ws[b.id]
          return (eb.wrong / eb.seen) - (ea.wrong / ea.seen)
        })
      if (weak.length >= cfg.count) return weak
      const rest = allQuestions.filter(q => !weak.find(w => w.id === q.id)).sort(() => Math.random() - 0.5)
      return [...weak, ...rest]
    }
    if (cfg.pool === 'bookmarked') {
      const ids = new Set(bookmarks[props.examKey])
      const bq = allQuestions.filter(q => ids.has(q.id))
      return bq.length > 0 ? bq : allQuestions
    }
    return allQuestions
  }

  if (!config) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConfigScreen {...props} weakCount={weakCount} bookmarkCount={bookmarkCount} onStart={setConfig} />
      </div>
    )
  }

  const pool = getPool(config)
  const actualCount = Math.min(config.count, pool.length)

  return (
    <ActiveTest {...props}
      questions={pool} count={actualCount}
      timerSeconds={config.timerSeconds}
      bookmarkIds={bookmarks[props.examKey]}
      onToggleBookmark={(id) => toggleBookmark(props.examKey, id)}
      onBackToConfig={() => setConfig(null)}
    />
  )
}

// ── Exports ───────────────────────────────────────────────────────────────────

export function NetPlusTestPage() {
  return <TestScreen accentCls="bg-accent text-void hover:bg-accent/85" accentBg="bg-accent" accentText="text-accent" label="Network+" code="N10-009" passThreshold={75} examKey="netplus" tagCls="tag-net" />
}

export function AWSTestPage() {
  return <TestScreen accentCls="bg-aws text-void hover:bg-aws/85" accentBg="bg-aws" accentText="text-aws" label="AWS CLF" code="CLF-C02" passThreshold={72} examKey="aws" tagCls="tag-aws" />
}
