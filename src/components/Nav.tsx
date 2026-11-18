'use client'

import { useState } from 'react'
import DATA from '@/data/portfolio'

export default function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header>
      <div className="wrap nav">
        <a className="logo" href="#home" onClick={() => setOpen(false)}>
          {DATA.name}
        </a>
        <button
          className="burger"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <nav className={'links' + (open ? ' open' : '')}>
          {DATA.nav.map(([l, id]) => (
            <a
              key={id}
              href={'#' + id}
              className={active === id ? 'on' : ''}
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
