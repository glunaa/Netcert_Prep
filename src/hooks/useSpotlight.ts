import { useEffect } from 'react'

/**
 * useSpotlight — one delegated pointer listener (mouse + touch) feeding every
 * .card its pointer position as CSS vars. The glow itself lives in index.css.
 */
export function useSpotlight() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onMove = (e: PointerEvent) => {
      document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${e.clientX - r.left}px`)
        card.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
}
