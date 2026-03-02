import { useState, useCallback } from 'react'
import type { Question, TestResult } from '../types'

function pickRandom(arr: Question[], count: number): Question[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count)
}

export function useTestEngine(questions: Question[]) {
  const [shuffled, setShuffled] = useState<Question[]>(() => pickRandom(questions, 30))
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [results, setResults] = useState<TestResult[]>([])
  const [finished, setFinished] = useState(false)

  const start = useCallback((count = 30) => {
    setShuffled(pickRandom(questions, count))
    setCurrent(0)
    setAnswered(false)
    setSelected(null)
    setResults([])
    setFinished(false)
  }, [questions])

  const selectAnswer = useCallback((idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const q = shuffled[current]
    setResults(prev => [...prev, {
      questionId: q.id,
      question: q.q,
      correct: idx === q.answer,
      yourAnswer: q.options[idx],
      correctAnswer: q.options[q.answer],
      explanation: q.explanation,
      domain: q.domain,
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

  return {
    currentQuestion: shuffled[current],
    current, total: shuffled.length,
    answered, selected, results, finished,
    score: results.filter(r => r.correct).length,
    progress: shuffled.length > 0 ? (current / shuffled.length) * 100 : 0,
    selectAnswer, next, skip, restart: start,
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('netcert_progress')
      return saved ? JSON.parse(saved) : {
        netplus: { lastScore: null, attempts: 0, bestScore: null },
        aws: { lastScore: null, attempts: 0, bestScore: null },
      }
    } catch {
      return {
        netplus: { lastScore: null, attempts: 0, bestScore: null },
        aws: { lastScore: null, attempts: 0, bestScore: null },
      }
    }
  })

  const recordScore = useCallback((exam: 'netplus' | 'aws', score: number, total: number) => {
    const pct = Math.round((score / total) * 100)
    setProgress((prev: typeof progress) => {
      const updated = {
        ...prev,
        [exam]: {
          lastScore: pct,
          attempts: prev[exam].attempts + 1,
          bestScore: prev[exam].bestScore === null ? pct : Math.max(prev[exam].bestScore, pct),
        },
      }
      localStorage.setItem('netcert_progress', JSON.stringify(updated))
      return updated
    })
  }, [])

  return { progress, recordScore }
}