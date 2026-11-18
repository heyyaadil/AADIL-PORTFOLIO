'use client'

import React from 'react'
import DATA from '@/data/portfolio'
import { Heading } from './Reveal'
import type { Project as ProjectType } from '@/data/portfolio'

function Project({ p }: { p: ProjectType }) {
  return (
    <article
      className="pj"
      data-r="1"
      style={{ '--tint': p.tint } as React.CSSProperties}
    >
      <a
        className="shot"
        data-tilt="1"
        href={p.github}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        style={{ '--art': p.art } as React.CSSProperties}
      >
        {p.image ? (
          <img src={p.image} alt="" />
        ) : (
          <>
            <i></i>
            <div className="win">
              <u></u><u></u><u></u><u></u>
            </div>
          </>
        )}
        <div className="reveal">
          <em>
            {p.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </em>
          <b>View on GitHub ↗</b>
        </div>
      </a>
      <div>
        <h3>{p.title}</h3>
        <p>{p.desc}</p>
        <div className="tags">
          {p.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <a
          className="gh"
          href={p.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
          <span className="ar" aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projects">
      <div className="wrap">
        <Heading
          title="Things I've made."
          sub="Placeholder projects for now. Swap in your own in the DATA object at the top of the script."
        />
        <div className="projects">
          {DATA.projects.map((p, i) => (
            <Project key={i} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
