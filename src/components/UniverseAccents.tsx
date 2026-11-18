'use client'

import { useEffect } from 'react'

interface LocalParticleController {
  play: () => void
  destroy: () => void
}

interface Particle {
  x: number
  y: number
  dx: number
  dy: number
  color: string
  size: number
}

function createLocalParticles(
  canvas: HTMLCanvasElement,
  contact = false
): LocalParticleController {
  const context = canvas.getContext('2d')
  if (!context) return { play() {}, destroy() {} }

  const small = matchMedia('(max-width:760px)').matches
  const count = contact ? (small ? 64 : 150) : small ? 24 : 64
  const colors = ['#6f8fff', '#8b5cf6', '#37e3d0', '#ff5fc4', '#ffa66b']

  let raf = 0
  let active = false
  let time = 0
  let last = 0
  let w = 1
  let h = 1
  let particles: Particle[] = []
  let disposed = false

  const fit = () => {
    const b = canvas.getBoundingClientRect()
    w = Math.max(1, b.width)
    h = Math.max(1, b.height)
    const d = Math.min(devicePixelRatio || 1, 1.5)
    canvas.width = Math.ceil(w * d)
    canvas.height = Math.ceil(h * d)
    context.setTransform(d, 0, 0, d, 0, 0)
    particles = Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2
      return {
        x: contact
          ? w * 0.5 + Math.cos(a) * w * 0.46
          : ((i % 8) + 0.5) / 8 * w,
        y: contact
          ? h * 0.5 + Math.sin(a) * h * 0.35
          : (Math.floor(i / 8) + 0.5) / Math.ceil(count / 8) * h,
        dx: Math.cos(i * 2.399) * w * 0.15,
        dy: Math.sin(i * 2.399) * h * 0.28,
        color: colors[i % colors.length],
        size: 0.8 + (i % 3) * 0.45,
      }
    })
  }

  const draw = (now: number) => {
    raf = 0
    if (disposed || !active || document.hidden) return
    const dt = Math.min((now - (last || now)) / 1000, 0.05)
    last = now
    time += dt
    const t = Math.min(1, time / (contact ? 1.9 : 1.1))
    const ease = 1 - Math.pow(1 - t, 3)
    context.clearRect(0, 0, w, h)

    for (const p of particles) {
      const x = p.x + p.dx * (1 - ease)
      let y = p.y + p.dy * (1 - ease)
      if (contact) y += Math.sin(t * 4 + p.x * 0.008) * (1 - t) * 8
      context.globalAlpha = Math.sin(Math.PI * Math.min(0.999, t)) * (contact ? 0.7 : 0.6)
      context.fillStyle = p.color
      context.beginPath()
      context.arc(x, y, p.size, 0, Math.PI * 2)
      context.fill()
    }
    context.globalAlpha = 1
    if (t < 1) raf = requestAnimationFrame(draw)
    else {
      active = false
      context.clearRect(0, 0, w, h)
    }
  }

  const visibility = () => {
    cancelAnimationFrame(raf)
    last = 0
    if (active && !document.hidden) raf = requestAnimationFrame(draw)
  }

  document.addEventListener('visibilitychange', visibility)

  return {
    play() {
      if (disposed) return
      cancelAnimationFrame(raf)
      fit()
      time = 0
      last = 0
      active = true
      raf = requestAnimationFrame(draw)
    },
    destroy() {
      disposed = true
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', visibility)
      context.clearRect(0, 0, w, h)
    },
  }
}

export default function UniverseAccents() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ac = new AbortController()
    const signal = ac.signal
    const cleanups: (() => void)[] = []
    const localControllers = new Map<Element, LocalParticleController>()
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches

    const makeCanvas = (host: HTMLElement, contact = false) => {
      const canvas = document.createElement('canvas')
      canvas.className = contact ? 'contact-wave' : 'accent-particles'
      canvas.setAttribute('aria-hidden', 'true')
      host.append(canvas)
      const controller = createLocalParticles(canvas, contact)
      cleanups.push(() => {
        controller.destroy()
        canvas.remove()
      })
      return controller
    }

    document.querySelectorAll<HTMLElement>('.shot').forEach((card) => {
      const controller = makeCanvas(card)
      localControllers.set(card, controller)
      if (fine) {
        card.addEventListener('pointerenter', () => controller.play(), { signal })
        card.addEventListener(
          'pointermove',
          (e: MouseEvent) => {
            const b = card.getBoundingClientRect()
            card.style.setProperty('--mx', `${((e.clientX - b.left) / b.width - 0.5) * 7}px`)
            card.style.setProperty('--my', `${((e.clientY - b.top) / b.height - 0.5) * 5}px`)
          },
          { passive: true, signal }
        )
        card.addEventListener(
          'pointerleave',
          () => {
            card.style.setProperty('--mx', '0px')
            card.style.setProperty('--my', '0px')
          },
          { signal }
        )
      }
      const link = card.closest('.pj')?.querySelector('.gh')
      if (link) link.addEventListener('focus', () => controller.play(), { signal })
    })

    const contactWrap = document.querySelector<HTMLElement>('#contact .wrap')
    if (contactWrap) {
      const c = makeCanvas(contactWrap, true)
      localControllers.set(contactWrap, c)
    }

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            localControllers.get(e.target)?.play()
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.2 }
    )
    localControllers.forEach((_, host) => io.observe(host))

    const bento = document.querySelector<HTMLElement>('.bento')
    let resize: ResizeObserver | null = null
    if (bento) {
      const ns = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(ns, 'svg')
      svg.classList.add('skill-constellation')
      svg.setAttribute('aria-hidden', 'true')
      bento.prepend(svg)

      const update = () => {
        const box = bento.getBoundingClientRect()
        svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`)
        svg.replaceChildren()
        const nodes = Array.from(bento.querySelectorAll<HTMLElement>('.sk .g')).map((n) => {
          const b = n.getBoundingClientRect()
          return {
            x: b.left - box.left + b.width / 2,
            y: b.top - box.top + b.height / 2,
          }
        })
        const edges = new Set<string>()
        nodes.forEach((a, i) => {
          const nearest = nodes
            .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
            .filter((v) => v.j !== i)
            .sort((x, y) => x.d - y.d)
            .slice(0, 2)
          nearest.forEach(({ j }) => {
            const key = [i, j].sort((x, y) => x - y).join('-')
            if (edges.has(key)) return
            edges.add(key)
            const l = document.createElementNS(ns, 'line')
            l.setAttribute('x1', String(a.x))
            l.setAttribute('y1', String(a.y))
            l.setAttribute('x2', String(nodes[j].x))
            l.setAttribute('y2', String(nodes[j].y))
            svg.append(l)
          })
          const dot = document.createElementNS(ns, 'circle')
          dot.setAttribute('cx', String(a.x))
          dot.setAttribute('cy', String(a.y))
          dot.setAttribute('r', '2')
          svg.append(dot)
        })
      }
      resize = new ResizeObserver(update)
      resize.observe(bento)
      update()
      cleanups.push(() => svg.remove())
    }

    const visibility = () =>
      document.documentElement.classList.toggle('page-paused', document.hidden)
    document.addEventListener('visibilitychange', visibility, { signal })

    const refreshTimer = window.setTimeout(() => {
      const winAny = window as unknown as { ScrollTrigger?: { refresh: () => void } }
      if (winAny.ScrollTrigger) winAny.ScrollTrigger.refresh()
    }, 300)

    return () => {
      window.clearTimeout(refreshTimer)
      ac.abort()
      io.disconnect()
      if (resize) resize.disconnect()
      cleanups.forEach((fn) => fn())
      document.documentElement.classList.remove('page-paused')
    }
  }, [])

  return null
}
