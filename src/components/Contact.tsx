'use client'

import DATA from '@/data/portfolio'
import { Reveal } from './Reveal'

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <Reveal>
          <h2>Let’s build something together.</h2>
          <p className="sub">
            Open to hackathon teams, collaborations, internships and conversations with other developers.
          </p>
        </Reveal>
        <div className="clist">
          {DATA.contacts.map((c) => (
            <a
              key={c.label}
              data-r="1"
              className="crow"
              href={c.href}
              target={c.href.startsWith('mailto') ? '_self' : '_blank'}
              rel="noopener noreferrer"
            >
              <b>{c.label}</b>
              <span>{c.value}</span>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
