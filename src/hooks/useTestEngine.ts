import { useState, useCallback } from 'react'
import type { Question, TestResult, WeakSpotEntry, ScoreHistoryEntry } from '../types'

// Fisher–Yates shuffle: unbiased, unlike sort(() => Math.random() - 0.5),
// which produces uneven orderings because the comparator isn't consistent.
function pickRandom(arr: Question[], count: number): Question[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

// ── Test Engine ───────────────────────────────────────────────────────────────

export function useTestEngine(questions: Question[], initialCount = 30) {
  const [shuffled, setShuffled] = useState<Question[]>(() => pickRandom(questions, initialCount))
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [results, setResults] = useState<TestResult[]>([])
  const [finished, setFinished] = useState(false)

  const start = useCallback((count = initialCount) => {
    setShuffled(pickRandom(questions, count))
    setCurrent(0)
    setAnswered(false)
    setSelected(null)
    setResults([])
    setFinished(false)
  }, [questions, initialCount])

  const selectAnswer = useCallback((idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const q = shuffled[current]
    setResults(prev => [...prev, {
      questionId: q.id, question: q.q,
      correct: idx === q.answer,
      yourAnswer: q.options[idx],
      correctAnswer: q.options[q.answer],
      explanation: q.explanation, domain: q.domain,
    }])
  }, [answered, shuffled, current])

  const next = useCallback(() => {
    if (current + 1 >= shuffled.length) setFinished(true)
    else { setCurrent(c => c + 1); setAnswered(false); setSelected(null) }
  }, [current, shuffled.length])

  const skip = useCallback(() => {
    const q = shuffled[current]
    setResults(prev => [...prev, {
      questionId: q.id, question: q.q, correct: false,
      yourAnswer: 'Skipped', correctAnswer: q.options[q.answer],
      explanation: q.explanation, domain: q.domain,
    }])
    next()
  }, [shuffled, current, next])

  const forceFinish = useCallback(() => {
    setResults(prev => {
      const answeredIds = new Set(prev.map(r => r.questionId))
      const remaining = shuffled.slice(current).filter(q => !answeredIds.has(q.id))
      return [...prev, ...remaining.map(q => ({
        questionId: q.id, question: q.q, correct: false,
        yourAnswer: 'Time expired', correctAnswer: q.options[q.answer],
        explanation: q.explanation, domain: q.domain,
      }))]
    })
    setFinished(true)
  }, [shuffled, current])

  return {
    currentQuestion: shuffled[current],
    current, total: shuffled.length,
    answered, selected, results, finished,
    score: results.filter(r => r.correct).length,
    progress: shuffled.length > 0 ? (current / shuffled.length) * 100 : 0,
    selectAnswer, next, skip, restart: start, forceFinish,
  }
}

// ── Progress (scores, history, weak spots) ────────────────────────────────────

type ExamProgress = {
  lastScore: number | null
  attempts: number
  bestScore: number | null
  history: ScoreHistoryEntry[]
  weakSpots: Record<number, WeakSpotEntry>
}

type ProgressStore = { netplus: ExamProgress; aws: ExamProgress }

const emptyExam = (): ExamProgress => ({
  lastScore: null, attempts: 0, bestScore: null, history: [], weakSpots: {},
})

const normalizeExam = (e: Partial<ExamProgress>): ExamProgress => ({
  lastScore: e.lastScore ?? null,
  attempts: e.attempts ?? 0,
  bestScore: e.bestScore ?? null,
  history: e.history ?? [],
  weakSpots: e.weakSpots ?? {},
})

export function useProgress() {
  const [progress, setProgress] = useState<ProgressStore>(() => {
    try {
      const saved = localStorage.getItem('netcert_progress')
      if (saved) {
        const p = JSON.parse(saved)
        return { netplus: normalizeExam(p.netplus ?? {}), aws: normalizeExam(p.aws ?? {}) }
      }
    } catch { /* ignore */ }
    return { netplus: emptyExam(), aws: emptyExam() }
  })

  const recordScore = useCallback((
    exam: 'netplus' | 'aws',
    score: number,
    total: number,
    results: TestResult[],
  ) => {
    const pct = Math.round((score / total) * 100)
    const today = new Date().toISOString().split('T')[0]
    setProgress(prev => {
      const e = prev[exam]
      const newHistory = [...e.history, { score: pct, date: today }].slice(-10)
      const newWeakSpots = { ...e.weakSpots }
      for (const r of results) {
        const cur = newWeakSpots[r.questionId] ?? { wrong: 0, seen: 0 }
        const attempted = r.yourAnswer !== 'Skipped' && r.yourAnswer !== 'Time expired'
        newWeakSpots[r.questionId] = {
          seen: cur.seen + 1,
          wrong: cur.wrong + (attempted && !r.correct ? 1 : 0),
        }
      }
      const updated: ProgressStore = {
        ...prev,
        [exam]: {
          lastScore: pct,
          attempts: e.attempts + 1,
          bestScore: e.bestScore === null ? pct : Math.max(e.bestScore, pct),
          history: newHistory,
          weakSpots: newWeakSpots,
        },
      }
      localStorage.setItem('netcert_progress', JSON.stringify(updated))
      return updated
    })
  }, [])

  return { progress, recordScore }
}

// ── Streak ────────────────────────────────────────────────────────────────────

type StreakStore = {
  current: number
  longest: number
  lastDate: string
  dailyGoal: number
  todayCount: number
  todayDate: string
}

const emptyStreak = (): StreakStore => ({
  current: 0, longest: 0, lastDate: '',
  dailyGoal: 20, todayCount: 0, todayDate: '',
})

function prevDay(date: string): string {
  const d = new Date(date)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakStore>(() => {
    try {
      const s = localStorage.getItem('netcert_streak')
      return s ? { ...emptyStreak(), ...JSON.parse(s) } : emptyStreak()
    } catch { return emptyStreak() }
  })

  const updateStreak = useCallback((questionsAnswered: number) => {
    const today = new Date().toISOString().split('T')[0]
    setStreak(prev => {
      const isToday = prev.todayDate === today
      const todayCount = (isToday ? prev.todayCount : 0) + questionsAnswered
      let current = prev.current
      if (!isToday) {
        if (prev.lastDate === prevDay(today)) current = prev.current + 1
        else if (prev.lastDate !== today) current = 1
      }
      const updated: StreakStore = {
        current,
        longest: Math.max(current, prev.longest),
        lastDate: today,
        dailyGoal: prev.dailyGoal,
        todayCount,
        todayDate: today,
      }
      localStorage.setItem('netcert_streak', JSON.stringify(updated))
      return updated
    })
  }, [])

  const setDailyGoal = useCallback((goal: number) => {
    setStreak(prev => {
      const updated = { ...prev, dailyGoal: goal }
      localStorage.setItem('netcert_streak', JSON.stringify(updated))
      return updated
    })
  }, [])

  return { streak, updateStreak, setDailyGoal }
}

// ── Bookmarks ─────────────────────────────────────────────────────────────────

type BookmarkStore = { netplus: number[]; aws: number[] }

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkStore>(() => {
    try {
      const s = localStorage.getItem('netcert_bookmarks')
      return s ? JSON.parse(s) : { netplus: [], aws: [] }
    } catch { return { netplus: [], aws: [] } }
  })

  const toggleBookmark = useCallback((exam: 'netplus' | 'aws', questionId: number) => {
    setBookmarks(prev => {
      const list = prev[exam]
      const next = list.includes(questionId)
        ? list.filter(id => id !== questionId)
        : [...list, questionId]
      const updated = { ...prev, [exam]: next }
      localStorage.setItem('netcert_bookmarks', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isBookmarked = useCallback((exam: 'netplus' | 'aws', questionId: number): boolean => {
    return bookmarks[exam].includes(questionId)
  }, [bookmarks])

  return { bookmarks, toggleBookmark, isBookmarked }
}
