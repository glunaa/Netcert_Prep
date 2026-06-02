import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useTestEngine'
import { netplusQuestions } from '../data/netplusQuestions'
import { awsQuestions } from '../data/awsQuestions'
import type { ScoreHistoryEntry, WeakSpotEntry, Question } from '../types'

type Exam = 'netplus' | 'aws'

function scoreColor(score: number | null): string {
  if (score === null) return 'text-subtle'
  if (score >= 80) return 'text-success'
  if (score >= 65) return 'text-aws'
  return 'text-danger'
}

function accuracyColor(pct: number): string {
  if (pct >= 80) return 'bg-success'
  if (pct >= 65) return 'bg-aws'
  return 'bg-danger'
}

function ScoreHistoryChart({ history, passLine, accentRgb }: {
  history: ScoreHistoryEntry[]
  passLine: number
  accentRgb: string
}) {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 rounded-xl border border-border/40 bg-surface/30">
        <p className="text-sm text-subtle">No test history yet</p>
      </div>
    )
  }
  const W = 560, H = 100, PAD = 12
  const iW = W - PAD * 2
  const iH = H - PAD * 2
  const pts = history.map((h, i) => ({
    x: PAD + (history.length === 1 ? iW / 2 : (i / (history.length - 1)) * iW),
    y: PAD + (1 - h.score / 100) * iH,
    score: h.score,
    date: h.date,
  }))
  const passY = PAD + (1 - passLine / 100) * iH
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')

  // area fill path
  const area = `${d} L ${pts[pts.length - 1].x.toFixed(1)} ${H - PAD} L ${pts[0].x.toFixed(1)} ${H - PAD} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 100 }}>
      {/* pass line */}
      <line x1={PAD} y1={passY} x2={W - PAD} y2={passY}
        stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="6 4" />
      <text x={W - PAD + 4} y={passY + 4} fontSize="8" fill="rgba(255,255,255,0.3)">pass</text>
      {/* area */}
      <path d={area} fill={`rgba(${accentRgb},0.08)`} />
      {/* line */}
      <path d={d} fill="none" stroke={`rgba(${accentRgb},0.7)`} strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" />
      {/* dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5"
          fill={p.score >= passLine ? '#22c55e' : '#ef4444'} />
      ))}
      {/* date labels for first and last */}
      {history.length >= 2 && (
        <>
          <text x={pts[0].x} y={H - 1} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)">
            {pts[0].date}
          </text>
          <text x={pts[pts.length - 1].x} y={H - 1} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)">
            {pts[pts.length - 1].date}
          </text>
        </>
      )}
    </svg>
  )
}

interface DomainStat {
  domain: string
  seen: number
  wrong: number
  accuracy: number
}

function getDomainStats(weakSpots: Record<number, WeakSpotEntry>, questions: Question[]): DomainStat[] {
  const qById = new Map(questions.map(q => [q.id, q]))
  const map: Record<string, { seen: number; wrong: number }> = {}
  for (const [idStr, entry] of Object.entries(weakSpots)) {
    const q = qById.get(Number(idStr))
    if (!q) continue
    const cur = map[q.domain] ?? { seen: 0, wrong: 0 }
    map[q.domain] = { seen: cur.seen + entry.seen, wrong: cur.wrong + entry.wrong }
  }
  return Object.entries(map)
    .map(([domain, s]) => ({
      domain,
      seen: s.seen,
      wrong: s.wrong,
      accuracy: s.seen > 0 ? Math.round(((s.seen - s.wrong) / s.seen) * 100) : 100,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
}

interface WeakEntry {
  question: Question
  entry: WeakSpotEntry
  ratio: number
}

function getWeakQuestions(weakSpots: Record<number, WeakSpotEntry>, questions: Question[], n = 5): WeakEntry[] {
  const qById = new Map(questions.map(q => [q.id, q]))
  return Object.entries(weakSpots)
    .filter(([, e]) => e.seen >= 2 && e.wrong > 0)
    .map(([idStr, entry]) => ({ question: qById.get(Number(idStr))!, entry, ratio: entry.wrong / entry.seen }))
    .filter(x => x.question)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, n)
}

export default function AnalyticsPage() {
  const { progress } = useProgress()
  const [exam, setExam] = useState<Exam>('netplus')

  const data = progress[exam]
  const questions = exam === 'netplus' ? netplusQuestions : awsQuestions
  const passLine = exam === 'netplus' ? 75 : 72
  const accentRgb = exam === 'netplus' ? '0,212,255' : '255,153,0'
  const accentCls = exam === 'netplus' ? 'bg-accent/10 text-accent border-accent/30' : 'bg-aws/10 text-aws border-aws/30'

  const domainStats = useMemo(() => getDomainStats(data.weakSpots, questions), [data.weakSpots, questions])
  const weakQuestions = useMemo(() => getWeakQuestions(data.weakSpots, questions), [data.weakSpots, questions])
  const avgScore = data.history.length > 0
    ? Math.round(data.history.reduce((s, h) => s + h.score, 0) / data.history.length)
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] text-subtle font-mono tracking-widest uppercase mb-1">Performance</p>
        <h1 className="text-2xl font-bold text-slate-200">Analytics</h1>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-8">
        {(['netplus', 'aws'] as Exam[]).map(e => (
          <button key={e} onClick={() => setExam(e)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${exam === e
              ? e === 'netplus' ? 'bg-accent/10 text-accent border-accent/30' : 'bg-aws/10 text-aws border-aws/30'
              : 'border-border text-subtle hover:text-slate-200 hover:border-slate-500'}`}>
            {e === 'netplus' ? 'Network+ N10-009' : 'AWS CLF-C02'}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Overall Performance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Attempts', val: data.attempts.toString(), color: 'text-slate-100' },
            { label: 'Last Score', val: data.lastScore !== null ? `${data.lastScore}%` : '—', color: scoreColor(data.lastScore) },
            { label: 'Best Score', val: data.bestScore !== null ? `${data.bestScore}%` : '—', color: scoreColor(data.bestScore) },
            { label: 'Average', val: avgScore !== null ? `${avgScore}%` : '—', color: scoreColor(avgScore) },
          ].map(col => (
            <div key={col.label} className="card p-4 text-center">
              <p className="text-[10px] text-subtle uppercase tracking-wider mb-1">{col.label}</p>
              <p className={`text-2xl font-bold font-mono ${col.color}`}>{col.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Score history */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Score History</h2>
          <span className="text-[10px] text-subtle">{data.history.length} / 10 attempts stored</span>
        </div>
        <div className="card p-5">
          <ScoreHistoryChart history={data.history} passLine={passLine} accentRgb={accentRgb} />
          {data.history.length > 0 && (
            <div className="flex justify-between text-[10px] text-subtle mt-2">
              <span>Passing threshold: {passLine}%</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success inline-block" /> Pass</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger inline-block" /> Below pass</span>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Domain breakdown */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Domain Breakdown</h2>
        {domainStats.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-subtle text-sm">No domain data yet — complete a practice test to see your breakdown.</p>
            <Link to={exam === 'netplus' ? '/netplus/test' : '/aws/test'}
              className={`inline-block mt-4 px-4 py-2 rounded-lg text-sm font-medium border ${accentCls} transition-colors`}>
              Start a test →
            </Link>
          </div>
        ) : (
          <div className="card divide-y divide-border/40">
            {domainStats.map(ds => (
              <div key={ds.domain} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-200 font-medium">{ds.domain}</span>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-[10px] text-subtle">{ds.seen} seen</span>
                    <span className={`text-sm font-bold font-mono ${scoreColor(ds.accuracy)}`}>{ds.accuracy}%</span>
                  </div>
                </div>
                <div className="progress-track">
                  <div className={`progress-fill ${accuracyColor(ds.accuracy)} transition-all`}
                    style={{ width: `${ds.accuracy}%` }} />
                </div>
                <p className="text-[10px] text-subtle mt-1">
                  {ds.seen - ds.wrong} correct · {ds.wrong} wrong
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Hardest questions */}
      {weakQuestions.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Your Hardest Questions</h2>
          <div className="space-y-3">
            {weakQuestions.map(({ question, entry, ratio }) => (
              <div key={question.id} className="card p-4 border-danger/15">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] text-subtle font-mono shrink-0">{question.domain}</span>
                  <span className="text-[10px] font-mono text-danger shrink-0">
                    {entry.wrong}/{entry.seen} wrong ({Math.round(ratio * 100)}%)
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{question.q}</p>
                <p className="text-[10px] text-subtle mt-2 leading-relaxed">
                  <span className="text-slate-400">Answer: </span>{question.options[question.answer]}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
