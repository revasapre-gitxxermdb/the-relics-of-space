import { useEffect, useRef } from 'react'
import astronautImg from '../../assets/Astronaut.png'
import characterImg from '../../assets/character.png'
import { enableSlides } from '../../utils/slideScroll'
import './World.css'

// Fixed ground + alien (or floating astronaut). Fully visible on each surface
// screen, slightly faint while a chapter's text scrolls up from behind it.
export default function Surface({ world, groundImg }) {
  const ref = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const spacers = document.querySelectorAll('.surface-spacer')
      if (!spacers.length || !ref.current) return
      const vh = window.innerHeight
      let best = 0
      spacers.forEach((sp) => {
        const p = 1 - Math.min(Math.abs(sp.getBoundingClientRect().top) / vh, 1)
        best = Math.max(best, p)
      })
      // Before the first surface screen: fade in from nothing. After: never below the faint level.
      const reached = spacers[0].getBoundingClientRect().top <= 0
      const FAINT = 0.3
      const o = String(reached ? FAINT + (1 - FAINT) * best : best)
      ref.current.style.opacity = o
      // Page content (e.g. the 3D model) shares the same fade so it appears with the light/dark transition
      document.documentElement.style.setProperty('--surface-o', o)
      // Model belongs to chapter 1 only: fades in with the surface, fades fully out as chapter 2 arrives
      // Steeper than the surface fade: hidden on the title slide, visible only on the chapter 1 surface screen
      const first = Math.max(0, 1 - Math.abs(spacers[0].getBoundingClientRect().top) / (vh * 0.45))
      document.documentElement.style.setProperty('--model-o', String(first))
      document.documentElement.style.setProperty('--model-pe', first > 0.5 ? 'auto' : 'none')
      // Chapter 2 and 3 models: visible only on their own surface screen
      ;[1, 2, 3].forEach((n) => {
        if (!spacers[n]) return
        const k = Math.max(0, 1 - Math.abs(spacers[n].getBoundingClientRect().top) / (vh * 0.45))
        document.documentElement.style.setProperty(`--model${n + 1}-o`, String(k))
        document.documentElement.style.setProperty(`--model${n + 1}-pe`, k > 0.5 ? 'auto' : 'none')
      })
      // Rover drives in from the right once its slide is reached; parks off-screen again when leaving
      document.documentElement.style.setProperty('--model-x', first > 0.5 ? '0px' : '110vw')
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  useEffect(() => enableSlides('.moon, .surface-spacer'), [])
  const isSpace =world.key === 'deepspace'
  return (
    <section className={`surface surface--${world.key}`} ref={ref} aria-label={`${world.name} surface`}>
      {isSpace ? (
        <div className="surface__astronaut">
          <img src={astronautImg} alt="Astronaut" />
        </div>
      ) : (
        <>
          <img className="surface__ground" src={groundImg} alt="" aria-hidden="true" />
          <div className="surface__character">
            <img src={characterImg} alt="Alien explorer" />
            <span className="surface__mouth" aria-hidden="true" />
            <span className="surface__shadow" aria-hidden="true" />
          </div>
        </>
      )}
    </section>
  )
}
