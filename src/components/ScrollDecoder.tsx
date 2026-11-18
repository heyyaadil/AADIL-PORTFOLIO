'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TARGET_WORDS = ['BEYOND', 'THE', 'ORDINARY']
const TARGET_FULL = 'BEYOND THE ORDINARY'
const LINE_1 = 'I AM AADIL'
const LINE_2 = 'CREATIVE DEVELOPER'
const LINE_3 = 'BUILDING DIGITAL EXPERIENCES'

const HEX_CHARS = '0123456789ABCDEF'
const BINARY_CHARS = '01'
const GLYPH_CHARS = '0123456789ABCDEF∑∂∆Ω≈µ§ø¥¢£/\\|~*+='

export default function ScrollDecoder() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Character states for BEYOND THE ORDINARY
  const [chars, setChars] = useState<
    { char: string; isLocked: boolean; isDecoding: boolean; isSpace: boolean }[]
  >(() =>
    TARGET_FULL.split('').map((c) => ({
      char: c === ' ' ? ' ' : '0',
      isLocked: false,
      isDecoding: false,
      isSpace: c === ' ',
    }))
  )

  // Subsequent 3 lines states
  const [line1Progress, setLine1Progress] = useState(0) // 0 to 1
  const [line2Chars, setLine2Chars] = useState('')
  const [line2Cursor, setLine2Cursor] = useState(false)
  const [line3Progress, setLine3Progress] = useState(0) // 0 to 1
  const [scrollHint, setScrollHint] = useState(true)

  // Particle swarm on canvas
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[]
  >([])

  const getRandomChar = useCallback((type: 'bin' | 'hex' | 'glyph') => {
    if (type === 'bin') {
      return BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]
    }
    if (type === 'hex') {
      return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
    }
    return GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)]
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // If user prefers reduced motion, show fully decoded final state immediately
      setChars(
        TARGET_FULL.split('').map((c) => ({
          char: c,
          isLocked: true,
          isDecoding: false,
          isSpace: c === ' ',
        }))
      )
      setLine1Progress(1)
      setLine2Chars(LINE_2)
      setLine3Progress(1)
      setScrollHint(false)
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const container = containerRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!container || !stage || !canvas) return

    // Setup dissolving particle canvas
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const colors = ['#37e3d0', '#6f8fff', '#ff5fc4', '#ffa66b', '#ffffff']
    particlesRef.current = Array.from({ length: 65 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8,
      size: Math.random() * 2.2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.7 + 0.3,
    }))

    const handleResize = () => {
      if (!canvas) return
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    let currentProgress = 0
    let rafId = 0

    // Particle render loop
    const renderParticles = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      // Particles dissolve as text solidifies (fades as progress goes from 0 to 0.7)
      const globalFade = Math.max(0, 1 - currentProgress / 0.75)

      if (globalFade > 0.02) {
        for (const p of particlesRef.current) {
          p.x += p.vx
          p.y += p.vy

          // Wrap edges
          if (p.x < 0) p.x = w
          if (p.x > w) p.x = 0
          if (p.y < 0) p.y = h
          if (p.y > h) p.y = 0

          ctx.fillStyle = p.color
          ctx.globalAlpha = p.alpha * globalFade
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      rafId = requestAnimationFrame(renderParticles)
    }
    rafId = requestAnimationFrame(renderParticles)

    // Master ScrollTrigger directly bound to scroll progress
    const totalChars = TARGET_FULL.length
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=240%',
      pin: stage,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress
        currentProgress = p

        // Toggle scroll hint
        setScrollHint(p < 0.08)

        // ==========================================
        // 1. DECODING "BEYOND THE ORDINARY" (p: 0.00 -> 0.60)
        // ==========================================
        const newChars = TARGET_FULL.split('').map((targetChar, i) => {
          if (targetChar === ' ') {
            return { char: ' ', isLocked: true, isDecoding: false, isSpace: true }
          }

          // Individual character window in scroll
          const charStart = 0.06 + (i / totalChars) * 0.42
          const charLock = charStart + 0.07

          if (p >= charLock) {
            // Stage 3: Fully locked into target letter
            return {
              char: targetChar,
              isLocked: true,
              isDecoding: false,
              isSpace: false,
            }
          } else if (p >= charStart) {
            // Stage 2: Actively decrypting / flickering
            const flickerCandidates = [
              targetChar,
              getRandomChar('hex'),
              getRandomChar('glyph'),
              targetChar,
            ]
            const flickerChar =
              flickerCandidates[Math.floor(Math.random() * flickerCandidates.length)]
            return {
              char: flickerChar,
              isLocked: false,
              isDecoding: true,
              isSpace: false,
            }
          } else if (p >= 0.02) {
            // Stage 1: Hexadecimal / glitch scrambling
            return {
              char: getRandomChar('hex'),
              isLocked: false,
              isDecoding: false,
              isSpace: false,
            }
          } else {
            // Stage 0: Pure raw binary numbers
            return {
              char: getRandomChar('bin'),
              isLocked: false,
              isDecoding: false,
              isSpace: false,
            }
          }
        })
        setChars(newChars)

        // ==========================================
        // 2. LINE 1: "I AM AADIL" (p: 0.58 -> 0.74)
        // ==========================================
        const l1 = Math.max(0, Math.min(1, (p - 0.58) / 0.16))
        setLine1Progress(l1)

        // ==========================================
        // 3. LINE 2: "CREATIVE DEVELOPER" (p: 0.70 -> 0.86)
        // ==========================================
        const l2 = Math.max(0, Math.min(1, (p - 0.7) / 0.16))
        const numRevealed = Math.floor(l2 * LINE_2.length)
        if (numRevealed === 0) {
          setLine2Chars('')
          setLine2Cursor(p > 0.68 && p < 0.98)
        } else if (numRevealed >= LINE_2.length) {
          setLine2Chars(LINE_2)
          setLine2Cursor(p < 0.98)
        } else {
          const lockedPart = LINE_2.slice(0, numRevealed)
          const scramblePart = getRandomChar('glyph')
          setLine2Chars(lockedPart + scramblePart)
          setLine2Cursor(true)
        }

        // ==========================================
        // 4. LINE 3: "BUILDING DIGITAL EXPERIENCES" (p: 0.84 -> 1.00)
        // ==========================================
        const l3 = Math.max(0, Math.min(1, (p - 0.84) / 0.16))
        setLine3Progress(l3)
      },
    })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      st.kill()
    }
  }, [getRandomChar])

  // Split into words for responsive layout wrapping
  let charCounter = 0

  return (
    <section id="decoder" className="decoder-section" ref={containerRef}>
      <div className="decoder-stage" ref={stageRef}>
        {/* Particle dissolution canvas */}
        <canvas className="decoder-canvas" ref={canvasRef} aria-hidden="true" />

        {/* Ambient background glow & cyber grid lines */}
        <div className="decoder-backdrop" aria-hidden="true">
          <div className="decoder-grid-glow"></div>
          <div className="decoder-scanlines"></div>
        </div>

        <div className="decoder-content wrap">
          {/* Status telemetry header */}
          <div className="decoder-telemetry" aria-hidden="true">
            <span className="telemetry-badge">
              <span className="telemetry-dot"></span>
              REALITY_DECODER // v3.8
            </span>
            <span className="telemetry-status">
              {line3Progress >= 0.9
                ? 'SYSTEM_STABILIZED'
                : line1Progress > 0
                ? 'COMPOSING_IDENTITY'
                : chars[0]?.isLocked
                ? 'SYNTHESIZING_WORDS'
                : 'INTERCEPTING_SIGNAL'}
            </span>
          </div>

          {/* MAIN HEADING: NUMBERS → LETTERS → BEYOND THE ORDINARY */}
          <div className="decoder-heading-wrap">
            <h2 className="decoder-main-title" aria-label="BEYOND THE ORDINARY">
              {TARGET_WORDS.map((word, wordIndex) => {
                const wordChars = word.split('').map(() => {
                  const item = chars[charCounter]
                  charCounter++
                  return item
                })

                // Account for the space following the word
                if (charCounter < chars.length && chars[charCounter]?.isSpace) {
                  charCounter++
                }

                return (
                  <span key={wordIndex} className="decoder-word">
                    {wordChars.map((c, i) => (
                      <span
                        key={i}
                        className={`decoder-char ${c?.isLocked ? 'char-locked' : ''} ${
                          c?.isDecoding ? 'char-decoding' : ''
                        }`}
                        data-char={c?.char}
                      >
                        {c?.char || '0'}
                      </span>
                    ))}
                  </span>
                )
              })}
            </h2>
            <div className="decoder-heading-aura" aria-hidden="true"></div>
          </div>

          {/* 3 SUBSEQUENT LINES REVEALED PROGRESSIVELY */}
          <div className="decoder-sub-sequence">
            {/* LINE 1: "I AM AADIL" — 3D Kinetic Rise & Radiant Gold Shift */}
            <div
              className="sub-line line-1-aadil"
              style={{
                opacity: line1Progress,
                transform: `translate3d(0, ${(1 - line1Progress) * 35}px, 0) scale(${
                  0.94 + line1Progress * 0.06
                })`,
                filter: `blur(${(1 - line1Progress) * 8}px)`,
              }}
            >
              <span className="aadil-tagline">
                {LINE_1.split('').map((letter, i) => (
                  <span
                    key={i}
                    className="aadil-letter"
                    style={{
                      display: 'inline-block',
                      transform: `translateY(${
                        Math.max(0, 1 - line1Progress * 1.5 - i * 0.03) * 20
                      }px)`,
                      opacity: Math.min(1, line1Progress * 1.6 - i * 0.03),
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </span>
            </div>

            {/* LINE 2: "CREATIVE DEVELOPER" — Cybernetic Terminal Typing */}
            <div
              className="sub-line line-2-role"
              style={{
                opacity: line2Chars.length > 0 ? 1 : 0,
              }}
            >
              <span className="role-typed-text">{line2Chars}</span>
              {line2Cursor && <span className="role-cursor" aria-hidden="true">_</span>}
            </div>

            {/* LINE 3: "BUILDING DIGITAL EXPERIENCES" — Cinematic Tracking Expansion */}
            <div
              className="sub-line line-3-experience"
              style={{
                opacity: line3Progress,
                letterSpacing: `${0.28 - line3Progress * 0.22}em`,
                filter: `blur(${(1 - line3Progress) * 10}px)`,
                transform: `translateY(${(1 - line3Progress) * 20}px)`,
              }}
            >
              <span className="experience-text">{LINE_3}</span>
              <div
                className="experience-neon-sweep"
                style={{
                  transform: `scaleX(${line3Progress})`,
                }}
              ></div>
            </div>
          </div>

          {/* Scroll Down Prompt Indicator */}
          <div
            className="decoder-scroll-hint"
            style={{
              opacity: scrollHint ? 1 : 0,
              pointerEvents: scrollHint ? 'auto' : 'none',
            }}
          >
            <span>SCROLL TO DECODE REALITY</span>
            <div className="hint-chevron">↓</div>
          </div>
        </div>
      </div>
    </section>
  )
}
