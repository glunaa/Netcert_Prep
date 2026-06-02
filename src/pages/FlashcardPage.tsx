import { useState, useEffect, useCallback } from 'react'
import { flashcardDecks } from '../data/flashcardData'
import type { Flashcard, FlashcardDeck } from '../data/flashcardData'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ── Card ──────────────────────────────────────────────────────────────────────

function FlipCard({ card, flipped, onFlip }: { card: Flashcard; flipped: boolean; onFlip: () => void }) {
  return (
    <div style={{ perspective: '1000px' }} className="w-full select-none">
      <div
        onClick={onFlip}
        className="relative w-full cursor-pointer transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: 280,
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 card p-8 flex flex-col items-center justify-center text-center rounded-2xl"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <p className="text-slate-100 text-lg sm:text-xl font-semibold leading-relaxed">{card.front}</p>
          <p className="text-xs text-subtle/60 mt-6 flex items-center gap-1.5">
            Click or press
            <kbd className="font-mono bg-border/60 px-1.5 py-0.5 rounded text-slate-400 text-[10px]">Space</kbd>
            to reveal
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 card p-6 overflow-auto rounded-2xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">{card.back}</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function FlashcardPage() {
  const [deckId, setDeckId] = useState<'netplus' | 'aws'>('netplus')
  const [category, setCategory] = useState('all')
  const [cards, setCards] = useState<Flashcard[]>([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const deck = flashcardDecks.find(d => d.id === deckId) as FlashcardDeck

  // Rebuild card list when deck or category changes
  useEffect(() => {
    const filtered = category === 'all' ? deck.cards : deck.cards.filter(c => c.category === category)
    setCards(shuffle(filtered))
    setIdx(0)
    setFlipped(false)
  }, [deckId, category]) // deck derived from deckId

  const goTo = useCallback((newIdx: number) => {
    setFlipped(false)
    setTimeout(() => setIdx(newIdx), flipped ? 0 : 0)
    setIdx(newIdx)
  }, [flipped])

  const prev = useCallback(() => goTo(idx === 0 ? cards.length - 1 : idx - 1), [idx, cards.length, goTo])
  const next = useCallback(() => goTo(idx === cards.length - 1 ? 0 : idx + 1), [idx, cards.length, goTo])

  const reshuffle = () => {
    setCards(c => shuffle(c))
    setIdx(0)
    setFlipped(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === ' ') { e.preventDefault(); setFlipped(f => !f) }
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  const card = cards[idx]
  const progress = cards.length > 0 ? ((idx + 1) / cards.length) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-slate-100">Flashcards</h1>
          <span className={deck.tagCls}>{deck.code}</span>
        </div>
        <p className="text-subtle text-sm">Click a card or press Space to flip · ← → to navigate</p>
      </div>

      {/* Deck selector */}
      <div className="flex gap-2 mb-5">
        {flashcardDecks.map(d => (
          <button
            key={d.id}
            onClick={() => { setDeckId(d.id); setCategory('all') }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              deckId === d.id
                ? d.id === 'netplus'
                  ? 'bg-accent text-void border-transparent'
                  : 'bg-aws text-void border-transparent'
                : 'border-border text-subtle hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            {d.label}
          </button>
        ))}
        <button
          onClick={reshuffle}
          title="Shuffle deck"
          className="ml-auto px-3 py-2 rounded-lg text-sm border border-border text-subtle hover:border-slate-500 hover:text-slate-200 transition-all flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
          </svg>
          Shuffle
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {deck.categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              category === cat.id
                ? 'bg-white/10 border-white/20 text-slate-100'
                : 'border-border text-subtle hover:border-slate-500 hover:text-slate-300'
            }`}
          >
            {cat.label}
            {cat.id !== 'all' && (
              <span className="ml-1.5 text-[10px] opacity-60">
                {deck.cards.filter(c => c.category === cat.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-subtle mb-2">
        <span>{cards.length} cards</span>
        <span>{idx + 1} / {cards.length}</span>
      </div>
      <div className="progress-track mb-6">
        <div
          className={`progress-fill transition-all duration-300 ${deckId === 'netplus' ? 'bg-accent' : 'bg-aws'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      {card ? (
        <FlipCard card={card} flipped={flipped} onFlip={() => setFlipped(f => !f)} />
      ) : (
        <div className="card p-12 text-center text-subtle">No cards in this category.</div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-4">
        <button onClick={prev}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-border text-subtle hover:text-slate-200 hover:border-slate-500 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Previous
        </button>

        <button
          onClick={() => setFlipped(f => !f)}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
            deckId === 'netplus' ? 'bg-accent text-void hover:bg-accent/85' : 'bg-aws text-void hover:bg-aws/85'
          }`}
        >
          {flipped ? 'Show question' : 'Reveal answer'}
        </button>

        <button onClick={next}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-border text-subtle hover:text-slate-200 hover:border-slate-500 transition-colors">
          Next
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-[10px] text-subtle/40 mt-4">
        <kbd className="font-mono bg-border/40 px-1 rounded">Space</kbd> flip ·{' '}
        <kbd className="font-mono bg-border/40 px-1 rounded">←</kbd>{' '}
        <kbd className="font-mono bg-border/40 px-1 rounded">→</kbd> navigate
      </p>
    </div>
  )
}
