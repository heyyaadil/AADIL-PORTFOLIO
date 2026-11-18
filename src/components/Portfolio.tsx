'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import DATA from '@/data/portfolio'
import Backdrop from './Backdrop'
import Nav from './Nav'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Achievements from './Achievements'
import Contact from './Contact'
import Footer from './Footer'

const Fx = dynamic(() => import('./Fx'), { ssr: false })
const UniverseAccents = dynamic(() => import('./UniverseAccents'), { ssr: false })

export default function Portfolio() {
  const [active, setActive] = useState('home')
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const q = matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(q.matches)
    const update = () => setReduced(q.matches)
    q.addEventListener('change', update)
    return () => q.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id)
          }
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )

    DATA.nav.forEach(([, id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })

    return () => io.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Backdrop />
      <Fx key={'fx' + reduced} />
      <UniverseAccents key={'accents' + reduced} />
      <Nav active={active} />
      <main id="main-content" tabIndex={-1}>
        <Hero key={'hero' + reduced} />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
