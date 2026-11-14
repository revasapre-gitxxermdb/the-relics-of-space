import { useEffect, useRef } from 'react'
import './ShootingStar.css'

// Occasional meteor streak; re-randomises its path every time it finishes.
export default function ShootingStar() {
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
