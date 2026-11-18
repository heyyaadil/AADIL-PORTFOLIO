'use client'

import React from 'react'

export function Reveal({ children }: { children: React.ReactNode }) {
  return <div data-r="1">{children}</div>
}

export function Heading({ title, sub }: { title: string; sub?: string }) {
  return (
    <Reveal>
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
    </Reveal>
  )
}
