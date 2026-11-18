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
