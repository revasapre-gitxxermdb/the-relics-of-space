// Slow, eased scrolling so changing slides feels like a presentation.
export const SLIDE_MS = 2200

let rafId = 0
export let isSliding = false

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function slideTo(targetY, duration = SLIDE_MS) {
  cancelAnimationFrame(rafId)
  const startY = window.scrollY
  const dist = targetY - startY
  if (Math.abs(dist) < 2) return Promise.resolve()
  isSliding = true
  const t0 = performance.now()
  return new Promise((resolve) => {
    const step = (now) => {
      const t = Math.min((now - t0) / duration, 1)
      window.scrollTo({ top: startY + dist * ease(t), behavior: 'instant' })
      if (t < 1) rafId = requestAnimationFrame(step)
      else { isSliding = false; resolve() }
    }
    rafId = requestAnimationFrame(step)
  })
}

// Wheel / swipe / keys move exactly one slide at a time, with a slow transition.
export function enableSlides(selector) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  const slides = () => [...document.querySelectorAll(selector)]
  const tops = () => slides().map((el) => el.getBoundingClientRect().top + window.scrollY)

  const go = (dir) => {
    if (isSliding) return
    const t = tops()
    if (!t.length) return
    const y = window.scrollY
    let cur = 0
    t.forEach((v, i) => { if (Math.abs(v - y) < Math.abs(t[cur] - y)) cur = i })
    const next = cur + dir
    if (next < 0 || next >= t.length) return false
    slideTo(t[next])
    return true
  }

  const onWheel = (e) => {
    if (Math.abs(e.deltaY) < 4) return
    e.preventDefault()
    go(e.deltaY > 0 ? 1 : -1)
  }
  const onKey = (e) => {
    const down = ['ArrowDown', 'PageDown', ' '].includes(e.key)
    const up = ['ArrowUp', 'PageUp'].includes(e.key)
    if (!down && !up) return
    e.preventDefault()
    go(down ? 1 : -1)
  }
  let startY = 0
  const onTouchStart = (e) => { startY = e.touches[0].clientY }
  const onTouchEnd = (e) => {
    const d = startY - e.changedTouches[0].clientY
    if (Math.abs(d) > 40) go(d > 0 ? 1 : -1)
  }
  const onTouchMove = (e) => { if (e.target.closest?.('model-viewer')) return; e.preventDefault() }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKey)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: false })
  return () => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('touchmove', onTouchMove)
    cancelAnimationFrame(rafId)
    isSliding = false
  }
}
