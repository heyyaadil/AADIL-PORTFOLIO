'use client'

import { useRef, useEffect } from 'react'

export default function Backdrop() {
  const cv = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = cv.current
    if (!el) return
    const x = el.getContext('2d')
    if (!x) return
    const cols = ['111,143,255', '139,92,246', '255,95,196', '55,227,208', '255,166,107']
    let w: number, h: number, raf = 0
    let P: { x: number; y: number; v: number; r: number; c: string; a: number }[] = []

    const fit = () => {
      w = el.width = innerWidth
      h = el.height = innerHeight
      P = Array.from({ length: w < 700 ? 18 : 32 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        v: 0.08 + Math.random() * 0.18,
        r: 0.7 + Math.random() * 1.2,
        c: cols[(Math.random() * 5) | 0],
        a: 0.25 + Math.random() * 0.4,
      }))
    }

    const draw = () => {
      x.clearRect(0, 0, w, h)
      for (const p of P) {
        p.y -= p.v
        if (p.y < -4) {
          p.y = h + 4
          p.x = Math.random() * w
        }
        x.fillStyle = 'rgba(' + p.c + ',' + p.a + ')'
        x.beginPath()
        x.arc(p.x, p.y, p.r, 0, 6.283)
        x.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    const vis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) draw()
    }

    fit()
    draw()
    addEventListener('resize', fit)
    document.addEventListener('visibilitychange', vis)

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', fit)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [])

  return (
    <>
      <div className="aurora" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i>
      </div>
      <canvas className="dust" ref={cv} aria-hidden="true"></canvas>
    </>
  )
}
