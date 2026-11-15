// Slow, eased scrolling so changing slides feels like a presentation.
export const SLIDE_MS = 2200

// A page can set slideGate.handle = (dir) => boolean. If it returns true the scroll step was
// consumed (e.g. it advanced a caption) and the slide does not change.
export const slideGate = { handle: null }

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
  const maxY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  // Every stop, clamped to what the page can really reach, always including the very top and bottom.
  const tops = () => {
    const m = maxY()
    const all = [0, m, ...slides().map((el) => Math.min(m, Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY))))]
    return [...new Set(all)].sort((a, b) => a - b)
  }

  const go = (dir) => {
    if (isSliding) return true
    if (slideGate.handle?.(dir)) return true
    const y = window.scrollY
    const t = tops()
    // Next stop in the direction of travel: never gets stuck, even between slides or at the page ends.
    const target = dir > 0 ? t.find((v) => v > y + 2) : [...t].reverse().find((v) => v < y - 2)
    if (target === undefined) return false
    slideTo(target)
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
