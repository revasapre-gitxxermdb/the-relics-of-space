import { useEffect, useRef } from 'react'
import moonImg from '../../assets/Moon-round.png'
import marsImg from '../../assets/Marse-round.png'
import deepSpaceImg from '../../assets/Deepspace.png'
import characterImg from '../../assets/character.png'
import moonSurfaceImg from '../../assets/moonSurface.png'
import marsSurfaceImg from '../../assets/marsSurface.png'
import { CHAPTERS } from '../../data/chapters'
import '../../sections/Hero/Hero.css'
import './Moon.css'

const WORLD_INFO = {
  moon: { key: 'moon', name: 'Moon', img: moonImg },
  mars: { key: 'mars', name: 'Mars', img: marsImg },
  deepspace: { key: 'deepspace', name: 'Deep Space', img: deepSpaceImg },
}

function Chapter({ index, title, world }) {
  let titleIndex = 0
  const rootRef = useRef(null)
  const surfaceRef = useRef(null)

  // Hold the entrance animations until the chapter scrolls into view.
  useEffect(() => {
    const el = rootRef.current
    if (index === 0 || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add('is-visible')
        io.disconnect()
      }
    }, { threshold: 0.4 })
    io.observe(el.firstElementChild)
    return () => io.disconnect()
  }, [index])

  // First chapter only: glide down once the title has animated in.
  // Cancelled if the visitor scrolls or interacts first.
  useEffect(() => {
    if (index !== 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cancel = () => clearTimeout(timer)
    const timer = setTimeout(() => {
      surfaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 4200)
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown']
    events.forEach((e) => window.addEventListener(e, cancel, { passive: true }))
    return () => {
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, cancel))
    }
  }, [index])

  return (
    <div className={`chapter chapter--${world.key}`} ref={rootRef}>
      <section className="moon">
        {index === 0 && <img className="moon__img" src={world.img} alt={world.name} />}
        <p className="moon__chapter">Chapter {index + 1}</p>
        <h1 className="hero__title moon__title" aria-label={title}>
          {title.split(' ').map((word, wi) => (
            <span className="hero__word" key={wi} aria-hidden="true">
              {[...word].map((ch, ci) => (
                <span className="hero__char" key={ci} style={{ '--i': titleIndex++ }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <span className="hero__rule" aria-hidden="true" />
        {index === 0 && <a className="moon__back" href="#/">← Back</a>}
      </section>
      <section className="surface-spacer" ref={surfaceRef} aria-hidden="true" />
    </div>
  )
}

// Fixed ground + alien. Fully visible on each surface screen, slightly faint
// while a chapter's text scrolls up from behind it.
function Surface({ world }) {
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
  return (
    <section className={`surface surface--${world.key}`} ref={ref} aria-label={`${world.name} surface`}>
      <img className="surface__ground" src={world.key === 'mars' ? marsSurfaceImg : moonSurfaceImg} alt="" aria-hidden="true" />
      <div className="surface__character">
        <img src={characterImg} alt="Alien explorer" />
        <span className="surface__mouth" aria-hidden="true" />
        <span className="surface__shadow" aria-hidden="true" />
      </div>
    </section>
  )
}

export default function Moon({ world = 'moon' }) {
  const info = WORLD_INFO[world]
  const titles = CHAPTERS[world === 'deepspace' ? 'deepSpace' : world]
  return (
    <>
      <Surface world={info} />
      {titles.map((title, i) => (
        <Chapter key={`${world}-${i}`} index={i} title={title} world={info} />
      ))}
    </>
  )
}
