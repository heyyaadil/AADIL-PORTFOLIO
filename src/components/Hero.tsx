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
            <div className="hyper-artifact">
              {/* Pulsing solar corona aura */}
              <div className="artifact-corona"></div>

              {/* 3D Multi-Axis Gyroscopic Rings */}
              <div className="artifact-gyro ring-a"></div>
              <div className="artifact-gyro ring-b"></div>
              <div className="artifact-gyro ring-c"></div>

              {/* Orbiting Quantum Nodes */}
              <div className="orb-node node-1"></div>
              <div className="orb-node node-2"></div>
              <div className="orb-node node-3"></div>

              {/* High-Tech 4D Tesseract Polyhedron */}
              <div className="artifact-polyhedron">
                <svg viewBox="0 0 120 120" className="tesseract-svg">
                  <defs>
                    <linearGradient id="polyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#37e3d0" />
                      <stop offset="50%" stopColor="#6f8fff" />
                      <stop offset="100%" stopColor="#ff5fc4" />
                    </linearGradient>
                    <linearGradient id="polyGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffa66b" />
                      <stop offset="50%" stopColor="#ff5fc4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <radialGradient id="singularityGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="35%" stopColor="#37e3d0" stopOpacity="0.85" />
                      <stop offset="70%" stopColor="#ff5fc4" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Outer Sacred Geometry / Tesseract Facets */}
                  <g className="tesseract-outer">
                    <polygon
                      points="60,8 96,23 112,60 96,97 60,112 24,97 8,60 24,23"
                      className="wire-octa"
                    />
                    <polygon
                      points="60,14 106,60 60,106 14,60"
                      className="wire-diamond"
                    />
                    <polygon
                      points="28,28 92,28 92,92 28,92"
                      className="wire-square"
                    />
                    {/* Dimensional Struts */}
                    <line x1="60" y1="8" x2="60" y2="112" className="strut-line" />
                    <line x1="8" y1="60" x2="112" y2="60" className="strut-line" />
                    <line x1="24" y1="23" x2="96" y2="97" className="strut-line" />
                    <line x1="96" y1="23" x2="24" y2="97" className="strut-line" />
                  </g>

                  {/* Inner Counter-Rotating Hexagram Star */}
                  <g className="tesseract-inner">
                    <polygon
                      points="60,30 86,75 34,75"
                      className="inner-tri tri-1"
                    />
                    <polygon
                      points="60,90 86,45 34,45"
                      className="inner-tri tri-2"
                    />
                    {/* Hyper Nova 4-Point Star Core */}
                    <path
                      d="M60 22 C60 44 44 60 22 60 C44 60 60 76 60 98 C60 76 76 60 98 60 C76 60 60 44 60 22 Z"
                      className="hyper-star"
                    />
                  </g>

                  {/* Central Singularity Pulse */}
                  <circle
                    cx="60"
                    cy="60"
                    r="18"
                    fill="url(#singularityGlow)"
                    className="singularity-core"
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
