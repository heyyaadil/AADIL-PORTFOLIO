'use client'

import DATA from '@/data/portfolio'
import { Heading } from './Reveal'

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <Heading title="Curious by default, building by habit." />
        <div className="about">
          <div>
            {DATA.about.map((p, i) => (
              <p key={i} data-r="1">{p}</p>
            ))}
          </div>
          <div className="facts" data-r="1">
            {DATA.facts.map((f) => (
              <div key={f.k}>
                <b>{f.k}</b>
                <span className={f.ph ? 'ph' : ''}>{f.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
