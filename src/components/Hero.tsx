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
          <div className="name-shape saturn-shape" aria-label="Planet Saturn" role="img">
            <div className="saturn-container">
              {/* Golden atmospheric glow */}
              <div className="saturn-glow"></div>

              {/* Orbiting Moon: Titan */}
              <div className="moon-orbit orbit-titan">
                <div className="moon moon-titan" title="Titan"></div>
              </div>

              {/* Orbiting Moon: Enceladus */}
              <div className="moon-orbit orbit-enceladus">
                <div className="moon moon-enceladus" title="Enceladus"></div>
              </div>

              {/* Realistic SVG Planet Saturn with 3D Ring System */}
              <svg viewBox="0 0 200 200" className="saturn-svg" aria-hidden="true">
                <defs>
                  {/* Clip paths to split rings into back (behind planet) and front (in front of planet) */}
                  <clipPath id="ringBackClip">
                    <rect x="0" y="0" width="200" height="100" />
                  </clipPath>
                  <clipPath id="ringFrontClip">
                    <rect x="0" y="100" width="200" height="100" />
                  </clipPath>
                  <clipPath id="planetGlobeClip">
                    <circle cx="100" cy="100" r="42" />
                  </clipPath>

                  {/* Atmospheric cloud bands */}
                  <linearGradient id="saturnBands" x1="15%" y1="0%" x2="85%" y2="100%">
                    <stop offset="0%" stopColor="#edd09b" />
                    <stop offset="12%" stopColor="#cca067" />
                    <stop offset="22%" stopColor="#f3ddb3" />
                    <stop offset="34%" stopColor="#ba8651" />
                    <stop offset="46%" stopColor="#e9cca0" />
                    <stop offset="58%" stopColor="#c58e58" />
                    <stop offset="70%" stopColor="#dfb784" />
                    <stop offset="84%" stopColor="#aa723e" />
                    <stop offset="100%" stopColor="#7a4f29" />
                  </linearGradient>

                  {/* 3D planetary lighting terminator (sunlit top-left, shadowed bottom-right) */}
                  <radialGradient id="saturnLighting" cx="36%" cy="32%" r="68%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                    <stop offset="35%" stopColor="#ffd89b" stopOpacity="0.1" />
                    <stop offset="60%" stopColor="#0b0c10" stopOpacity="0.65" />
                    <stop offset="88%" stopColor="#06070a" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="1" />
                  </radialGradient>

                  {/* Ring System Gradients */}
                  <linearGradient id="ringGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4b483" />
                    <stop offset="45%" stopColor="#ebd6b0" />
                    <stop offset="70%" stopColor="#c49f69" />
                    <stop offset="100%" stopColor="#dfc397" />
                  </linearGradient>

                  <linearGradient id="ringGradB" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8e5c2" />
                    <stop offset="25%" stopColor="#e2bf8b" />
                    <stop offset="50%" stopColor="#ffefd5" />
                    <stop offset="75%" stopColor="#d5aa6e" />
                    <stop offset="100%" stopColor="#f4e0bc" />
                  </linearGradient>

                  <linearGradient id="ringGradC" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a68456" />
                    <stop offset="50%" stopColor="#cbb085" />
                    <stop offset="100%" stopColor="#8d6c40" />
                  </linearGradient>
                </defs>

                {/* Tilted Ring System Coordinate Space */}
                <g transform="rotate(-23 100 100)">
                  {/* 1. BACK RINGS (rendered behind planet) */}
                  <g clipPath="url(#ringBackClip)">
                    {/* Ring C (Inner crepe ring) */}
                    <ellipse cx="100" cy="100" rx="58" ry="16" fill="none" stroke="url(#ringGradC)" strokeWidth="12" opacity="0.45" />
                    {/* Ring B (Dense main ring) */}
                    <ellipse cx="100" cy="100" rx="76" ry="21" fill="none" stroke="url(#ringGradB)" strokeWidth="16" />
                    {/* Cassini Division */}
                    <ellipse cx="100" cy="100" rx="85.5" ry="23.6" fill="none" stroke="#0b0c10" strokeWidth="1.8" />
                    {/* Ring A (Outer ring) */}
                    <ellipse cx="100" cy="100" rx="92" ry="25.5" fill="none" stroke="url(#ringGradA)" strokeWidth="6.5" opacity="0.9" />
                    {/* Planet shadow cast onto back rings */}
                    <ellipse cx="98" cy="98" rx="42" ry="16" fill="#000000" opacity="0.65" />
                  </g>

                  {/* 2. PLANET GLOBE */}
                  <g>
                    {/* Base Gas Giant Textured Bands */}
                    <circle cx="100" cy="100" r="42" fill="url(#saturnBands)" />
                    {/* Ring Shadow cast across globe */}
                    <g clipPath="url(#planetGlobeClip)">
                      <path d="M 50 100 Q 100 106 150 100 Q 100 96 50 100 Z" fill="#000000" opacity="0.65" />
                    </g>
                    {/* Atmospheric Lighting & Shadow */}
                    <circle cx="100" cy="100" r="42" fill="url(#saturnLighting)" />
                    {/* Subtle golden atmospheric rim glow */}
                    <circle cx="100" cy="100" r="42.3" fill="none" stroke="rgba(255, 222, 173, 0.4)" strokeWidth="1.2" />
                  </g>

                  {/* 3. FRONT RINGS (rendered in front of planet) */}
                  <g clipPath="url(#ringFrontClip)">
                    {/* Ring C (Inner crepe ring) */}
                    <ellipse cx="100" cy="100" rx="58" ry="16" fill="none" stroke="url(#ringGradC)" strokeWidth="12" opacity="0.45" />
                    {/* Ring B (Dense main ring) */}
                    <ellipse cx="100" cy="100" rx="76" ry="21" fill="none" stroke="url(#ringGradB)" strokeWidth="16" />
                    {/* Cassini Division */}
                    <ellipse cx="100" cy="100" rx="85.5" ry="23.6" fill="none" stroke="#0b0c10" strokeWidth="1.8" />
                    {/* Ring A (Outer ring) */}
                    <ellipse cx="100" cy="100" rx="92" ry="25.5" fill="none" stroke="url(#ringGradA)" strokeWidth="6.5" opacity="0.9" />
                  </g>
                </g>
              </svg>
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
