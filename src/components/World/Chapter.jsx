import { useEffect, useRef } from 'react'
import '../../sections/Hero/Hero.css'
import './World.css'

// One scroll chapter: animated title, plus a "surface spacer" screen that can
// hold page-specific content (e.g. the Moon's 3D model) via children.
export default function Chapter({ index, title, world, children }) {
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
      <section className="surface-spacer" ref={surfaceRef} aria-hidden={!children}>
        {children}
      </section>
    </div>
  )
}
