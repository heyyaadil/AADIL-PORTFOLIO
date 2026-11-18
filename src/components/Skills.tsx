'use client'

import React from 'react'
import DATA from '@/data/portfolio'
import { Heading } from './Reveal'

export default function Skills() {
  return (
    <section id="skills">
      <div className="wrap">
        <Heading
          title="The tools I build with."
          sub="What I'm working with right now. This list grows as I learn."
        />
        <div className="bento">
          {DATA.skills.map((s) => (
            <div key={s.name} className={'bw' + (s.wide ? ' w2' : '')}>
              <article
                className="sk"
                data-s="1"
                style={{ '--tint': s.tint } as React.CSSProperties}
              >
                <div className="g">{s.glyph}</div>
                <div>
                  <h3>{s.name}</h3>
                  <p>{s.note}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
