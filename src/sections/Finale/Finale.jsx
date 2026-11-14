import { useEffect, useRef, useState } from 'react'
import './Finale.css'

export default function Finale() {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setShown(true), io.disconnect()),
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className={`finale${shown ? ' finale--in' : ''}`} id="finale">
      <div className="finale__rings" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="finale__content">
        <p className="finale__eyebrow">Still out there</p>
        <h2 className="finale__quote">
          Every relic on this site is still up there right now, exactly where its mission ended.
        </h2>
        <span className="finale__line" aria-hidden="true" />
        <p className="finale__credit">
          Built by <strong>JAGANTRA</strong> <i>·</i> NASA Space Apps Challenge 2026
        </p>
      </div>
    </section>
  )
}
