'use client'

import React, { useState } from 'react'
import DATA from '@/data/portfolio'
import { Heading } from './Reveal'

export default function Achievements() {
  const [k, setK] = useState(0)
  const a = DATA.achievements[k]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = (i + 1) % DATA.achievements.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = (i - 1 + DATA.achievements.length) % DATA.achievements.length
    } else if (e.key === 'Home') {
      next = 0
    } else if (e.key === 'End') {
      next = DATA.achievements.length - 1
    } else {
      return
    }
    e.preventDefault()
    setK(next)
    const tabEl = document.getElementById('achievement-tab-' + next)
    tabEl?.focus()
  }

  return (
    <section id="achievements">
      <div className="wrap">
        <Heading
          title="Achievements & activities."
          sub="Hackathons, workshops, communities and more, added as they happen."
        />
        <div className="ach" data-r="1">
          <div className="tabs" role="tablist">
            {DATA.achievements.map((x, i) => (
              <button
                key={x.key}
                role="tab"
                className="tab"
                id={'achievement-tab-' + i}
                aria-controls="achievement-panel"
                tabIndex={i === k ? 0 : -1}
                aria-selected={i === k}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onClick={() => setK(i)}
              >
                {x.key}
              </button>
            ))}
          </div>
          <div
            className="panel"
            key={k}
            role="tabpanel"
            id="achievement-panel"
            aria-labelledby={'achievement-tab-' + k}
          >
            <h3>{a.key}</h3>
            <p>{a.blurb}</p>
            {a.items.length ? (
              a.items.map((it, i) => (
                <div className="item" key={i}>
                  <b>{it.title}</b>
                  <span>{it.meta}</span>
                </div>
              ))
            ) : (
              <div className="item">
                <b className="ph">Nothing added yet</b>
                <span>Add your first entry under &ldquo;{a.key}&rdquo; in the DATA object.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
