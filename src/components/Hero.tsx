'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import DATA from '@/data/portfolio'

const Core = dynamic(() => import('./Core'), { ssr: false })

export default function Hero() {
  return (
    <section id="home" className="hero">
      <Core />
      <div className="wrap" style={{ width: 'min(1280px,100% - 2.5rem)' }}>
        <div className="name-row">
          <h1 className="name" aria-label={DATA.name}>
            {DATA.name.split('').map((c, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{ '--i': i } as React.CSSProperties}
              >
                {c}
              </span>
            ))}
          </h1>
          <div className="name-shape" aria-hidden="true">
            <div className="shape-orbit">
              <div className="orbit-ring ring-1"></div>
              <div className="orbit-ring ring-2"></div>
              <div className="orbit-ring ring-3"></div>
              <div className="orbit-dot"></div>
              <div className="shape-core">
                <svg viewBox="0 0 40 40" className="shape-star">
                  <defs>
                    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#37e3d0" />
                      <stop offset="50%" stopColor="#6f8fff" />
                      <stop offset="100%" stopColor="#ff5fc4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 0 C20 11 29 20 40 20 C29 20 20 29 20 40 C20 29 11 20 0 20 C11 20 20 11 20 0 Z"
                    fill="url(#starGrad)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-row">
          <div>
            <p className="role">{DATA.role}</p>
            <p className="lead">{DATA.tagline}</p>
            <div className="btns">
              <a className="btn p" href="#projects">
                Explore My Work
                <span className="ar" aria-hidden="true">→</span>
              </a>
              <a className="btn" href="#contact">
                Contact Me
                <span className="ar" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <span className="scroll">Scroll</span>
        </div>
      </div>
    </section>
  )
}
