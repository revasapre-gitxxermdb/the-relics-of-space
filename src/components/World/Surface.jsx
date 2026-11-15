import { useEffect, useRef } from 'react'
import astronautImg from '../../assets/Astronaut.png'
import characterImg from '../../assets/character.png'
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
      ref.current.style.opacity = String(reached ? FAINT + (1 - FAINT) * best : best)
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
  const isSpace = world.key === 'deepspace'
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
