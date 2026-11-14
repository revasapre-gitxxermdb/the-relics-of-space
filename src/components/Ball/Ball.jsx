import { useEffect, useRef } from 'react'
import './Ball.css'

// Interactive ball: drag to spin (with inertia), hover tilt, idle auto-rotate,
// float + shadow, rise-in intro, double-click to reset.
const AUTO_SPEED = 0.12 // deg per frame
const AUTO_DELAY = 2000 // ms of idle before auto-rotate resumes
const HOVER_TILT = 12 // deg

export default function Ball({ src, name, delay, flat, to }) {
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
    let startX = 0
    let moved = 0
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
      startX = e.clientX
      moved = 0
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
        moved = Math.max(moved, Math.abs(e.clientX - startX))
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
    const onClick = () => {
      if (to && moved < 5) window.location.hash = to
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
    ballEl.addEventListener('click', onClick)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ballEl.removeEventListener('pointerdown', onDown)
      ballEl.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      ballEl.removeEventListener('pointerleave', onLeave)
      ballEl.removeEventListener('dblclick', onDouble)
      ballEl.removeEventListener('click', onClick)
    }
  }, [to])

  return (
    <div
      className={`world__ball${flat ? ' world__ball--flat' : ''}`}
      ref={ballRef}
      role="img"
      aria-label={name}
      style={{ cursor: to ? 'pointer' : undefined, backgroundImage: `url(${src})`, '--d': `${delay}s` }}
    />
  )
}
