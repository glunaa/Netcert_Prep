import { useEffect, useRef } from 'react'

/**
 * GridPackets — sparse glowing packets traveling along the background grid.
 * Fixed canvas behind all content. Cheap: ≤7 packets, no per-frame allocation
 * beyond the packet list. Respects prefers-reduced-motion; pauses when the
 * tab is hidden (rAF suspends, spawner checks document.hidden).
 */
const GRID = 40
const MAX_PACKETS = 7
const SPAWN_MS = 700

interface Packet {
  x: number; y: number
  axis: 'h' | 'v'
  dir: 1 | -1
  speed: number
  color: string
  life: number
}

export default function GridPackets() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const packets: Packet[] = []

    const spawn = window.setInterval(() => {
      if (document.hidden || packets.length >= MAX_PACKETS) return
      const axis: 'h' | 'v' = Math.random() < 0.5 ? 'h' : 'v'
      const lane = (n: number) => Math.floor((Math.random() * n) / GRID) * GRID
      // ~1 in 8 packets run AWS-orange; the rest are Net+ cyan
      const color = Math.random() < 0.125 ? '255,153,0' : '0,212,255'
      packets.push({
        x: axis === 'h' ? (Math.random() < 0.5 ? -10 : canvas.width + 10) : lane(canvas.width),
        y: axis === 'v' ? (Math.random() < 0.5 ? -10 : canvas.height + 10) : lane(canvas.height),
        axis,
        dir: 1,
        speed: 1.1 + Math.random() * 1.6,
        color,
        life: 1,
      })
      const p = packets[packets.length - 1]
      if (axis === 'h') p.dir = p.x < 0 ? 1 : -1
      else p.dir = p.y < 0 ? 1 : -1
    }, SPAWN_MS)

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        if (p.axis === 'h') p.x += p.speed * p.dir
        else p.y += p.speed * p.dir
        if (p.x < -40 || p.x > canvas.width + 40 || p.y < -40 || p.y > canvas.height + 40) {
          packets.splice(i, 1)
          continue
        }
        const TAIL = 26
        const tx = p.axis === 'h' ? p.x - TAIL * p.dir : p.x
        const ty = p.axis === 'v' ? p.y - TAIL * p.dir : p.y
        const grad = ctx.createLinearGradient(tx, ty, p.x, p.y)
        grad.addColorStop(0, `rgba(${p.color},0)`)
        grad.addColorStop(1, `rgba(${p.color},0.5)`)
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.4
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},0.95)`
        ctx.shadowColor = `rgba(${p.color},0.8)`
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(spawn)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  )
}
