import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useProgress, useStreak } from '../hooks/useTestEngine'
import { osiLayers } from '../data/referenceData'
import type { ScoreHistoryEntry } from '../types'

const DailyQuestionSection = lazy(() => import('../components/DailyQuestionSection'))

const osiLayerColors: Record<number, string> = {
  7: 'text-purple-400', 6: 'text-blue-400', 5: 'text-cyan-400',
  4: 'text-green-400', 3: 'text-yellow-400', 2: 'text-orange-400', 1: 'text-red-400',
}

function scoreColor(score: number | null): string {
  if (score === null) return 'text-subtle'
  if (score >= 80) return 'text-success'
  if (score >= 65) return 'text-aws'
  return 'text-danger'
}

function ScoreChart({ history, passLine, strokeRgb = '0,212,255' }: { history: ScoreHistoryEntry[]; passLine: number; strokeRgb?: string }) {
  if (history.length < 2) {
    return (
      <div className="mt-4 flex items-center justify-center h-12 rounded border border-border/40 bg-surface/30">
        <p className="text-[10px] text-subtle">Complete 2+ tests to see chart</p>
      </div>
    )
  }
  const W = 260, H = 52, PAD = 8
  const iW = W - PAD * 2
  const iH = H - PAD * 2
  const pts = history.map((h, i) => ({
    x: PAD + (history.length === 1 ? iW / 2 : (i / (history.length - 1)) * iW),
    y: PAD + (1 - h.score / 100) * iH,
    score: h.score,
  }))
  const passY = PAD + (1 - passLine / 100) * iH
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const last = pts[pts.length - 1]
  const dotColor = last.score >= passLine ? '#22c55e' : '#ef4444'
  return (
    <div className="mt-4">
      <p className="text-[10px] text-subtle mb-1">Score history ({history.length} attempt{history.length !== 1 ? 's' : ''})</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 52 }}>
        <line x1={PAD} y1={passY} x2={W - PAD} y2={passY}
          stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 3" />
        <text x={W - PAD + 3} y={passY + 3.5} fontSize="7" fill="rgba(255,255,255,0.25)">pass</text>
        <path d={d} fill="none" stroke={`rgba(${strokeRgb},0.55)`} strokeWidth="1.5"
          strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={last.x} cy={last.y} r="3" fill={dotColor} />
      </svg>
    </div>
  )
}

const featureCards = [
  {
    title: 'Net+ Reference', description: 'OSI model, ports, subnets, and key facts for Network+ exam prep.',
    href: '/netplus', tag: 'NET+', tagCls: 'tag-net', borderCls: 'border-accent/20 hover:border-accent/50', iconCls: 'bg-accent/10 text-accent',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
  },
  {
    title: 'AWS Reference', description: 'Services overview, shared responsibility model, and well-architected pillars.',
    href: '/aws', tag: 'AWS', tagCls: 'tag-aws', borderCls: 'border-aws/20 hover:border-aws/50', iconCls: 'bg-aws/10 text-aws',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" /></svg>,
  },
  {
    title: 'VLSM Calculator', description: 'Plan your IP addressing scheme with variable-length subnet masking.',
    href: '/vlsm', tag: 'TOOL', tagCls: 'tag bg-purple-500/10 text-purple-400 border border-purple-500/20',
    borderCls: 'border-purple-500/20 hover:border-purple-500/50', iconCls: 'bg-purple-500/10 text-purple-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Z" /></svg>,
  },
  {
    title: 'CLI Reference', description: 'Windows, Linux/Mac, and Cisco IOS commands for network troubleshooting.',
    href: '/cli', tag: 'TOOL', tagCls: 'tag bg-success/10 text-success border border-success/20',
    borderCls: 'border-success/20 hover:border-success/50', iconCls: 'bg-success/10 text-success',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  },
  {
    title: 'VPC Reference', description: 'AWS VPC components, security groups vs NACLs, and common architectures.',
    href: '/vpc', tag: 'AWS', tagCls: 'tag bg-blue-500/10 text-blue-400 border border-blue-500/20',
    borderCls: 'border-blue-500/20 hover:border-blue-500/50', iconCls: 'bg-blue-500/10 text-blue-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" /></svg>,
  },
  {
    title: 'Net+ Practice Test', description: '30-question randomized exam covering all Network+ domains.',
    href: '/netplus/test', tag: 'EXAM', tagCls: 'tag-net', borderCls: 'border-accent/20 hover:border-accent/50', iconCls: 'bg-accent/10 text-accent',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>,
  },
  {
    title: 'AWS Practice Test', description: '30-question randomized exam covering CLF-C02 domains.',
    href: '/aws/test', tag: 'EXAM', tagCls: 'tag-aws', borderCls: 'border-aws/20 hover:border-aws/50', iconCls: 'bg-aws/10 text-aws',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V18Z" /></svg>,
  },
  {
    title: 'Flashcards', description: 'Flip-card drills for ports, OSI layers, AWS services, attacks, and more.',
    href: '/flashcards', tag: 'STUDY', tagCls: 'tag bg-violet-500/10 text-violet-400 border border-violet-500/20',
    borderCls: 'border-violet-500/20 hover:border-violet-500/50', iconCls: 'bg-violet-500/10 text-violet-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  },
  {
    title: 'Subnet Drill', description: 'Practice network/broadcast address, usable hosts, and subnet masks.',
    href: '/subnet-drill', tag: 'DRILL', tagCls: 'tag bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    borderCls: 'border-emerald-500/20 hover:border-emerald-500/50', iconCls: 'bg-emerald-500/10 text-emerald-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>,
  },
  {
    title: 'Search Reference', description: 'Instantly search ports, OSI layers, AWS services, attacks, and protocols.',
    href: '/search', tag: 'TOOL', tagCls: 'tag bg-pink-500/10 text-pink-400 border border-pink-500/20',
    borderCls: 'border-pink-500/20 hover:border-pink-500/50', iconCls: 'bg-pink-500/10 text-pink-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>,
  },
]

export default function HomePage() {
  const { progress } = useProgress()
  const { streak } = useStreak()
  const netplusLast = progress.netplus.lastScore as number | null
  const netplusBest = progress.netplus.bestScore as number | null
  const awsLast = progress.aws.lastScore as number | null
  const awsBest = progress.aws.bestScore as number | null
  const streakPct = streak.dailyGoal > 0 ? Math.min((streak.todayCount / streak.dailyGoal) * 100, 100) : 0
  const goalMet = streak.todayCount >= streak.dailyGoal && streak.dailyGoal > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Hero */}
      <section className="relative mb-12 text-center py-16 overflow-hidden rounded-2xl card-glass">
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,212,255,0.10), transparent)' }} />
        <div className="relative z-10 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            STUDY TERMINAL ACTIVE
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-slate-100 mb-4 leading-none">
            NET<span className="text-accent">CERT</span> <span className="text-slate-400">PREP</span>
          </h1>
          <p className="text-subtle text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Your complete study companion for{' '}
            <span className="text-accent font-semibold">CompTIA Network+</span> and{' '}
            <span className="text-aws font-semibold">AWS Cloud Practitioner</span>.
            Reference guides, practice tests, and interactive tools.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/netplus/test" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-void font-semibold text-sm hover:bg-accent/85 transition-colors">
              Start Net+ Exam
            </Link>
            <Link to="/aws/test" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-aws text-void font-semibold text-sm hover:bg-aws/85 transition-colors">
              Start AWS Exam
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Question */}
      <Suspense fallback={<div className="h-48 mb-12 rounded-2xl border border-border/40 bg-surface/20 animate-pulse" />}>
        <DailyQuestionSection />
      </Suspense>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {[
          {
            label: 'Network+', code: 'N10-009', tagCls: 'tag-net', borderCls: 'glow-accent',
            attempts: progress.netplus.attempts as number, last: netplusLast, best: netplusBest,
            pass: 75, barCls: 'bg-accent', icon: 'text-accent', chartRgb: '0,212,255',
            history: progress.netplus.history,
          },
          {
            label: 'AWS CLF', code: 'CLF-C02', tagCls: 'tag-aws', borderCls: 'glow-aws',
            attempts: progress.aws.attempts as number, last: awsLast, best: awsBest,
            pass: 72, barCls: 'bg-aws', icon: 'text-aws', chartRgb: '255,153,0',
            history: progress.aws.history,
          },
        ].map((stat) => (
          <div key={stat.code} className={`card p-6 ${stat.borderCls}`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] text-subtle font-mono tracking-widest uppercase">{stat.label}</p>
                <p className="text-sm font-semibold text-slate-200">Progress Tracker</p>
              </div>
              <span className={stat.tagCls}>{stat.code}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Attempts', val: stat.attempts.toString() },
                { label: 'Last', val: stat.last !== null ? `${stat.last}%` : '—', color: scoreColor(stat.last) },
                { label: 'Best', val: stat.best !== null ? `${stat.best}%` : '—', color: scoreColor(stat.best) },
              ].map((col) => (
                <div key={col.label}>
                  <p className="text-[10px] text-subtle uppercase tracking-wider mb-1">{col.label}</p>
                  <p className={`text-2xl font-bold font-mono ${col.color ?? 'text-slate-100'}`}>{col.val}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-subtle mb-1.5">
                <span>Passing score: {stat.pass}%</span>
                <span>{stat.best !== null ? `${stat.best}%` : 'No attempts'}</span>
              </div>
              <div className="progress-track">
                <div className={`progress-fill ${stat.barCls}`} style={{ width: `${stat.best !== null ? Math.min(stat.best, 100) : 0}%` }} />
              </div>
            </div>
            <ScoreChart history={stat.history} passLine={stat.pass} strokeRgb={stat.chartRgb} />
          </div>
        ))}
      </section>

      {/* Streak */}
      <section className="mb-12">
        <div className="card p-5 border border-orange-500/20">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                  <path d="M12 2C12 2 7 8.5 7 13a5 5 0 0 0 10 0c0-3.5-2-7-5-11ZM8.5 15a3.5 3.5 0 0 0 3.5 3.5V15c-.8 0-1.5-.7-1.5-1.5 0-.6.2-1.2.5-1.8-.9.9-2.5 2-2.5 3.3Z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-subtle font-mono tracking-widest uppercase">Study Streak</p>
                <p className="text-sm font-semibold text-slate-200">Daily Progress</p>
              </div>
              {goalMet && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-medium">
                  Goal Met!
                </span>
              )}
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] text-subtle uppercase tracking-wider mb-0.5">Current</p>
                <p className="text-xl font-bold font-mono text-orange-400">{streak.current}d</p>
              </div>
              <div>
                <p className="text-[10px] text-subtle uppercase tracking-wider mb-0.5">Longest</p>
                <p className="text-xl font-bold font-mono text-slate-200">{streak.longest}d</p>
              </div>
              <div>
                <p className="text-[10px] text-subtle uppercase tracking-wider mb-0.5">Today</p>
                <p className="text-xl font-bold font-mono text-slate-200">{streak.todayCount}/{streak.dailyGoal}</p>
              </div>
            </div>
            <div className="flex-1 min-w-40">
              <div className="flex justify-between text-[10px] text-subtle mb-1.5">
                <span>Daily goal: {streak.dailyGoal} questions</span>
                <span>{Math.round(streakPct)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill bg-orange-400 transition-all" style={{ width: `${streakPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mb-14">
        <h2 className="text-lg font-bold text-slate-200 mb-5 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-accent inline-block" />
          Study Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featureCards.map((card) => (
            <Link key={card.href} to={card.href}
              className={`card flex flex-col gap-3 p-5 border transition-all duration-200 hover:bg-white/2 group ${card.borderCls}`}>
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconCls}`}>{card.icon}</div>
                <span className={card.tagCls}>{card.tag}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100 text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-subtle leading-relaxed">{card.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-subtle group-hover:text-slate-300 transition-colors mt-auto">
                Open module
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* OSI Quick Reference */}
      <section>
        <h2 className="text-lg font-bold text-slate-200 mb-5 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-accent inline-block" />
          OSI Model — Quick Reference
        </h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['#', 'Layer', 'PDU', 'Key Protocols', 'Devices', 'Function'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-subtle font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {osiLayers.map((layer, i) => (
                  <tr key={layer.number}
                    className={`border-b border-border/40 hover:bg-white/[0.015] transition-colors ${i === osiLayers.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-4 py-3">
                      <span className={`font-bold font-mono text-base ${osiLayerColors[layer.number]}`}>{layer.number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold text-sm ${osiLayerColors[layer.number]}`}>{layer.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-subtle bg-surface px-2 py-0.5 rounded border border-border">{layer.pdu}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {layer.protocols.slice(0, 3).map((p) => (
                          <span key={p} className="text-xs text-slate-400 bg-border/40 px-1.5 py-0.5 rounded font-mono">{p}</span>
                        ))}
                        {layer.protocols.length > 3 && <span className="text-xs text-subtle">+{layer.protocols.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-subtle text-xs">{layer.devices.join(', ')}</td>
                    <td className="px-4 py-3 text-subtle text-xs leading-relaxed">{layer.function}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border bg-surface/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs text-subtle">
              Mnemonic (1→7): <span className="text-slate-300 font-mono">Please Do Not Throw Sausage Pizza Away</span>
            </p>
            <Link to="/netplus" className="text-xs text-accent hover:text-accent/80 transition-colors">Full Net+ reference →</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
