import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

import moonImg from './assets/Moon-round.png'
import marsImg from './assets/Marse-round.png'
import deepSpaceImg from './assets/Deepspace.png'

const WORLDS = [
  { name: 'Moon', src: moonImg },
  { name: 'Mars', src: marsImg, featured: true },
  { name: 'Deep Space', src: deepSpaceImg, flat: true },
]

const STAR_COUNT = 160
const STAR_COLORS = ['#ffffff', '#bfe9ff', '#ffd9a0']

// Occasional meteor streak; re-randomises its path every time it finishes.
function ShootingStar() {
  const ref = useRef(null)
  const randomise = () => {
    const el = ref.current
    if (!el) return
    el.style.left = `${Math.random() * 70}%`
    el.style.top = `${Math.random() * 45}%`
    el.style.animationDuration = `${7 + Math.random() * 10}s`
  }
  useEffect(() => {
    randomise()
    if (ref.current) ref.current.style.animationDelay = `${Math.random() * 6}s`
  }, [])
  return (
    <span
      ref={ref}
      className="shooting-star"
      aria-hidden="true"
      onAnimationIteration={randomise}
    />
  )
}

// Interactive ball: drag to spin (with inertia), hover tilt, idle auto-rotate,
// float + shadow, rise-in intro, double-click to reset.
const AUTO_SPEED = 0.12 // deg per frame
const AUTO_DELAY = 2000 // ms of idle before auto-rotate resumes
const HOVER_TILT = 12 // deg

function Ball({ src, name, delay, flat }) {
  const ballRef = useRef(null)

  useEffect(() => {
    const ballEl = ballRef.current
    if (!ballEl) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let pos = 0
    let vel = 0
    let dragging = false
    let resetting = false
    let lastX = 0
    let idleUntil = performance.now() + AUTO_DELAY
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf

    const onDown = (e) => {
      dragging = true
      resetting = false
      lastX = e.clientX
      ballEl.setPointerCapture?.(e.pointerId)
      ballEl.classList.add('is-dragging')
    }
    const onMove = (e) => {
      const r = ballEl.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
      if (dragging) {
        const dx = e.clientX - lastX
        lastX = e.clientX
        pos += dx * 0.5
        vel = dx * 0.5
      }
    }
    const endDrag = () => {
      if (!dragging) return
      dragging = false
      idleUntil = performance.now() + AUTO_DELAY
      ballEl.classList.remove('is-dragging')
    }
    const onLeave = () => {
      tx = 0
      ty = 0
    }
    const onDouble = () => {
      const tile = 360
      pos %= tile
      if (pos > tile / 2) pos -= tile
      if (pos < -tile / 2) pos += tile
      resetting = true
    }

    const tick = () => {
      if (!dragging) {
        if (resetting) {
          pos += (0 - pos) * 0.1
          vel = 0
          if (Math.abs(pos) < 0.5) {
            pos = 0
            resetting = false
            idleUntil = performance.now() + AUTO_DELAY
          }
        } else if (!reduce && performance.now() > idleUntil) {
          vel += (AUTO_SPEED - vel) * 0.04
          pos += vel
        } else {
          vel *= 0.94
          pos += vel
        }
      }
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      ballEl.style.setProperty('--spin', `${pos}deg`)
      ballEl.style.transform = `perspective(800px) rotateY(${cx * HOVER_TILT}deg) rotateX(${-cy * HOVER_TILT}deg)`
      raf = requestAnimationFrame(tick)
    }

    ballEl.addEventListener('pointerdown', onDown)
    ballEl.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    ballEl.addEventListener('pointerleave', onLeave)
    ballEl.addEventListener('dblclick', onDouble)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ballEl.removeEventListener('pointerdown', onDown)
      ballEl.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      ballEl.removeEventListener('pointerleave', onLeave)
      ballEl.removeEventListener('dblclick', onDouble)
    }
  }, [])

  return (
    <div
      className={`world__ball${flat ? ' world__ball--flat' : ''}`}
      ref={ballRef}
      role="img"
      aria-label={name}
      style={{ backgroundImage: `url(${src})`, '--d': `${delay}s` }}
    />
  )
}

const TITLE = 'The Relics of Space'
const TITLE_WORDS = TITLE.split(' ')
const DESC =
  'A digital storytelling experience inspired by the NASA Space Apps Challenge 2026 — "Abandoned but not Forgotten: The Relics Of Space".'

function Home() {
  const heroRef = useRef(null)
  let titleIndex = 0

  // Stars live in 3D space: x/y spread a bit beyond the screen, z gives depth.
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        id: i,
        left: -10 + Math.random() * 120,
        top: -10 + Math.random() * 120,
        z: -300 + Math.random() * 520,
        size: 2 + Math.random() * 3.5,
        lo: Math.random() * 0.15,
        hi: 0.35 + Math.random() * 0.65,
        duration: 3 + Math.random() * 4,
        delay: -Math.random() * 8,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      })),
    [],
  )

  // Smoothly tilt the 3D scene toward the pointer (parallax).
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const page = hero.parentElement
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf

    const onMove = (e) => {
      const r = hero.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const onLeave = () => {
      tx = 0
      ty = 0
    }
    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      hero.style.setProperty('--ry', `${cx * 6}deg`)
      hero.style.setProperty('--rx', `${-cy * 6}deg`)
      // Shared background shifts opposite to the cursor for depth
      page?.style.setProperty('--bx', `${-cx * 28}px`)
      page?.style.setProperty('--by', `${-cy * 28}px`)
      raf = requestAnimationFrame(tick)
    }

    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero__scene" aria-hidden="true">
        <div className="hero__sway">
          {stars.map((s) => (
            <span
              key={s.id}
              className="star"
              style={{
                '--lo': s.lo,
                '--hi': s.hi,
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                background: s.color,
                boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
                transform: `translateZ(${s.z}px)`,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      <ShootingStar />
      <ShootingStar />

      <div className="hero__content">
        <h1 className="hero__title" aria-label={TITLE}>
          {TITLE_WORDS.map((word, wi) => (
            <span className="hero__word" key={wi} aria-hidden="true">
              {[...word].map((ch, ci) => (
                <span
                  className="hero__char"
                  key={ci}
                  style={{ '--i': titleIndex++ }}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <span className="hero__rule" aria-hidden="true" />
        <p className="hero__desc" aria-label={DESC}>
          {DESC.split(' ').map((w, i) => (
            <span
              className="hero__dword"
              key={i}
              aria-hidden="true"
              style={{ '--w': i }}
            >
              {w}{' '}
            </span>
          ))}
        </p>
        <div className="hero__actions">
          <a
            className="hero__github"
            href="https://github.com/revasapre-gitxxermdb/the-relics-of-space"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
          >
            <svg viewBox="0 0 16 16" width="48" height="48" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <span className="hero__github-text">
              GitHub<small>repository</small>
            </span>
          </a>
          <a
            className="hero__cta"
            href="#experience"
            onClick={(e) => {
              e.preventDefault()
              document
                .getElementById('experience')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            Watch the experience
          </a>
        </div>
      </div>
    </section>

    <section className="worlds" id="experience">
      <div className="worlds__row">
        {WORLDS.map((w, i) => (
          <figure key={w.name} className={`world ${w.featured ? 'world--main' : ''}`}>
            <Ball src={w.src} name={w.name} delay={i * -1.7} flat={w.flat} />
            <figcaption className="world__name">{w.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
    </>
  )
}

function Timeline() {
  return (
    <section className="timeline">
      <h1 className="timeline__title">Timeline</h1>
    </section>
  )
}

function useHashRoute() {
  const get = () => (window.location.hash === '#/timeline' ? 'timeline' : 'home')
  const [route, setRoute] = useState(get)
  useEffect(() => {
    const onHash = () => {
      setRoute(get())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

function App() {
  const route = useHashRoute()
  return (
    <div className="page">
      <div className="page__bg" aria-hidden="true" />
      <nav className="navbar" aria-label="Main">
        <a
          className="navbar__btn"
          href="#/"
          aria-current={route === 'home' ? 'page' : undefined}
        >
          Home
        </a>
        <a
          className="navbar__btn navbar__btn--timeline"
          href="#/timeline"
          aria-current={route === 'timeline' ? 'page' : undefined}
        >
          Timeline
        </a>
      </nav>
      {route === 'timeline' ? <Timeline /> : <Home />}
    </div>
  )
}

export default App
