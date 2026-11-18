'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export default function Fx() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const g = gsap
    const root = document.documentElement
    const ac = new AbortController()
    const o = { signal: ac.signal }
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches

    let lenis: Lenis | null = null
    let tk: ((time: number) => void) | null = null

    try {
      lenis = new Lenis({ lerp: 0.09 })
      lenis.on('scroll', ScrollTrigger.update)
      tk = (time: number) => lenis?.raf(time * 1000)
      g.ticker.add(tk)
      g.ticker.lagSmoothing(0)

      document.addEventListener(
        'click',
        (e: MouseEvent) => {
          const target = e.target as HTMLElement | null
          const a = target?.closest('a[href^="#"]') as HTMLAnchorElement | null
          const h = a?.getAttribute('href')
          const el = h && h.length > 1 ? document.getElementById(h.slice(1)) : null
          if (!el) return
          e.preventDefault()
          lenis?.scrollTo(el, { offset: -64, duration: 1.5 })
          history.replaceState(null, '', h)
        },
        o
      )
    } catch (err) {
      console.warn('Lenis initialization failed:', err)
    }

    const ctx = g.context(() => {
      const sc = (t: string | Element, s: string, e: string) => ({
        trigger: t,
        start: s,
        end: e,
        scrub: true,
      })

      g.to('.name', {
        yPercent: -8,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: sc('#home', 'top top', 'bottom top'),
      })
      g.fromTo(
        '.aurora',
        { '--py': '0px' },
        {
          '--py': '-160px',
          ease: 'none',
          scrollTrigger: {
            trigger: 'main',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      )
      g.utils.toArray<HTMLElement>('section:not(.hero)').forEach((s) =>
        g.fromTo(
          s,
          { '--ls': 0 },
          { '--ls': 1, ease: 'power2.out', scrollTrigger: sc(s, 'top 92%', 'top 60%') }
        )
      )
      g.utils.toArray<HTMLElement>('[data-r]').forEach((el) => {
        const h = el.querySelector('h2')
        if (h) {
          const sb = el.querySelector('.sub')
          const tl = g.timeline({
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
          tl.from(h, {
            y: 34,
            opacity: 0,
            clipPath: 'inset(0 0 100% 0)',
            letterSpacing: '.015em',
            duration: 1.2,
            ease: 'expo.out',
          })
          if (sb) {
            tl.from(sb, { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.18)
          }
        } else {
          g.from(el, {
            y: 36,
            opacity: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        }
      })
      g.from('.bw', {
        y: 40,
        opacity: 0,
        scale: 0.96,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.bento', start: 'top 85%', once: true },
      })
      g.utils.toArray<HTMLElement>('.shot').forEach((s) => {
        g.fromTo(
          s,
          { clipPath: 'ellipse(0% 0% at 50% 65%)' },
          {
            clipPath: 'ellipse(100% 100% at 50% 50%)',
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: s, start: 'top 85%', once: true },
          }
        )
        const w = s.querySelector('.win')
        if (w) {
          g.fromTo(
            w,
            { yPercent: 10 },
            { yPercent: -4, ease: 'none', scrollTrigger: sc(s, 'top bottom', 'bottom top') }
          )
        }
      })
    })

    if (fine && ring.current && dot.current) {
      root.classList.add('has-cur')
      const r = ring.current
      const d = dot.current
      const rq = [
        g.quickTo(r, 'x', { duration: 0.5, ease: 'power3' }),
        g.quickTo(r, 'y', { duration: 0.5, ease: 'power3' }),
      ]
      const dq = [g.quickTo(d, 'x', { duration: 0.1 }), g.quickTo(d, 'y', { duration: 0.1 })]

      let first = true
      window.addEventListener(
        'pointermove',
        (e: PointerEvent) => {
          if (first) {
            first = false
            g.set([r, d], { x: e.clientX, y: e.clientY })
            r.classList.add('on')
            d.classList.add('on')
          }
          r.classList.add('on')
          d.classList.add('on')
          const target = (e.target as HTMLElement | null)?.closest('.btn,.logo,.gh,button')
          let gx = e.clientX
          let gy = e.clientY
          if (target) {
            const b = target.getBoundingClientRect()
            gx += (b.left + b.width / 2 - gx) * 0.12
            gy += (b.top + b.height / 2 - gy) * 0.2
          }
          rq[0](gx)
          rq[1](gy)
          dq[0](e.clientX)
          dq[1](e.clientY)
        },
        { passive: true, signal: ac.signal }
      )

      document.addEventListener(
        'pointerover',
        (e: MouseEvent) => {
          const target = e.target as HTMLElement | null
          const t = target?.closest('.shot,.sk,a,button') as HTMLElement | null
          r.dataset.s = !t ? '' : t.matches('.shot') ? 'card' : 'link'
        },
        o
      )

      document.querySelectorAll<HTMLElement>('.btn,.logo').forEach((el) => {
        el.classList.add('mag')
        el.addEventListener(
          'pointermove',
          (e: MouseEvent) => {
            const b = el.getBoundingClientRect()
            g.to(el, {
              x: (e.clientX - b.left - b.width / 2) * 0.3,
              y: (e.clientY - b.top - b.height / 2) * 0.3,
              duration: 0.5,
              ease: 'power3.out',
            })
          },
          o
        )
        el.addEventListener(
          'pointerleave',
          () => {
            g.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,.5)' })
          },
          o
        )
      })

      document.querySelectorAll<HTMLElement>('.shot').forEach((el) => {
        el.addEventListener(
          'pointermove',
          (e: MouseEvent) => {
            const b = el.getBoundingClientRect()
            const px = (e.clientX - b.left) / b.width
            const py = (e.clientY - b.top) / b.height
            g.to(el, {
              rotationY: (px - 0.5) * 10,
              rotationX: -(py - 0.5) * 10,
              y: -8,
              transformPerspective: 1000,
              duration: 0.7,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          },
          o
        )
        el.addEventListener(
          'pointerleave',
          () => {
            g.to(el, {
              rotationX: 0,
              rotationY: 0,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          },
          o
        )
      })
    }

    document.documentElement.addEventListener(
      'pointerleave',
      () => {
        if (ring.current) ring.current.classList.remove('on')
        if (dot.current) dot.current.classList.remove('on')
      },
      o
    )

    const rf = () => ScrollTrigger.refresh()
    window.addEventListener('load', rf, o)
    const rt = setTimeout(rf, 1500)

    return () => {
      clearTimeout(rt)
      ac.abort()
      ctx.revert()
      if (lenis && tk) {
        g.ticker.remove(tk)
        lenis.destroy()
      }
      root.classList.remove('has-cur')
    }
  }, [])

  return (
    <>
      <div className="cur" ref={ring} aria-hidden="true"></div>
      <div className="dot" ref={dot} aria-hidden="true"></div>
    </>
  )
}
