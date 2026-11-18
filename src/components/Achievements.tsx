'use client'

import { useState } from 'react'
import DATA from '@/data/portfolio'
import { Heading } from './Reveal'

export default function Achievements() {
  const [k, setK] = useState(0)
  const a = DATA.achievements[k]

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
                aria-selected={i === k}
                onClick={() => setK(i)}
              >
                {x.key}
              </button>
            ))}
          </div>
          <div className="panel" key={k} role="tabpanel">
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
