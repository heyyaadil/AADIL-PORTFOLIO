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

export default function Portfolio() {
  const [active, setActive] = useState('home')

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
      <Backdrop />
      <Fx />
      <Nav active={active} />
      <main>
        <Hero />
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
