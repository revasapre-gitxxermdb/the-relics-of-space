import { useEffect, useMemo, useRef } from 'react'
import './App.css'

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

function App() {
  const heroRef = useRef(null)

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
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero__scene" aria-hidden="true">
        <div className="hero__sway">
          <div className="hero__bg" />
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

      <div className="hero__content">{/* hero text / nav goes here */}</div>
    </section>
  )
}

export default App
