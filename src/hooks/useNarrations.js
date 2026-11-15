import { useEffect, useState } from 'react'
import { slideGate } from '../utils/slideScroll'

// One narration per chapter slide, played ONE LINE AT A TIME. `narrations` is
// [{ src, captions, slide }]; returns the caption text currently on screen.
// Arriving on a slide speaks only the first line and stops. Each scroll step then speaks
// only the next line. After the last line, the next scroll moves on to the next chapter.
// (Line boundaries are estimated from caption length across the real audio duration.)
const HINT = 'Click anywhere or press any key to start the narration'

export default function useNarrations(narrations, { holdUntilEnd = false } = {}) {
  const [caption, setCaption] = useState('')

  useEffect(() => {
    let raf = 0
    let current = null // the player whose caption is on screen
    const show = (pl, text) => { current = pl; setCaption(text) }
    const clearFor = (pl) => { if (current === pl) { current = null; setCaption('') } }
    const slideEl = (n) => document.querySelectorAll('.surface-spacer')[n]

    const players = narrations.map(({ src, captions, slide }) => {
      const audio = new Audio(src)
      audio.preload = 'auto'
      const total = captions.reduce((n, s) => n + s.length, 0)
      const pl ={ audio, captions, line: 0, active: false, done: false, pending: false, hinted: false, lastStep: 0 }
      pl.isOnSlide = () => {
        const sp = slideEl(slide)
        return !!sp && Math.abs(sp.getBoundingClientRect().top) < window.innerHeight * 0.225
      }
      // Where line i begins in the audio (seconds); line `last + 1` is the end of the audio.
      pl.lineStart = (i) => {
        let before = 0
        for (let k = 0; k < i; k++) before += captions[k].length
        return (before / total) * audio.duration
      }
      // Speak only line i: seek to its start, show its caption, play (the tick below stops it at its end).
      pl.playLine = (i) => {
        pl.line = i
        if (i > 0 && isFinite(audio.duration)) audio.currentTime = pl.lineStart(i) + 0.02
        else if (i === 0) audio.currentTime = 0
        show(pl, captions[i])
        return audio.play()
      }
      pl.reset = () => {
        pl.active = false
        pl.done = false
        pl.line = 0
        if (!audio.paused || audio.currentTime) { audio.pause(); audio.currentTime = 0 }
      }
      return pl
    })

    // Stop each line when it reaches the start of the next one (so it never reads past its own line).
    const tick = setInterval(() => {
      players.forEach((pl) => {
        const { audio } = pl
        if (!pl.active || audio.paused || !isFinite(audio.duration)) return
        if (pl.line < pl.captions.length - 1 && audio.currentTime >= pl.lineStart(pl.line + 1)) audio.pause()
      })
    }, 40)

    // Each scroll step on a slide speaks the next (or previous) line. Past the last line, scroll moves on.
    // If the narration never started (autoplay blocked), don't trap the visitor.
    slideGate.handle = (dir) => {
      const pl = players.find((p) => p.isOnSlide())
      if (!pl) return false
      // The first line is still starting up: hold the scroll instead of skipping the whole chapter.
      if (pl.pending && !pl.done) return true
      if (!pl.active || pl.done || !isFinite(pl.audio.duration)) return false
      const last = pl.captions.length - 1
      if (dir > 0 && pl.line >= last) {
        // Optionally hold the visitor here until the last line has finished speaking.
        if (holdUntilEnd && !pl.audio.paused && !pl.audio.ended) return true
        pl.done = true
        return false
      }
      if (dir < 0 && pl.line <= 0) return false
      const now = performance.now()
      if (now - pl.lastStep < 350) return true // swallow wheel/trackpad bursts
      pl.lastStep = now
      pl.audio.pause()
      pl.playLine(pl.line + dir).catch(() => {})
      return true
    }

    const update = () => {
      raf = 0
      players.forEach((pl) => {
        if (pl.isOnSlide()) {
          if (pl.done || pl.active || pl.pending) return
          // No click / key / touch on the page yet: the browser won't allow sound. Say so right away
          // (on every chapter); the first click or key press starts this slide's narration by itself.
          if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
            if (!pl.hinted) { pl.hinted = true; show(pl, HINT) }
            return
          }
          pl.pending = true
          pl.playLine(0).then(() => {
            pl.pending = false
            pl.hinted = false
            if (pl.isOnSlide()) pl.active = true
            else { clearFor(pl); pl.reset() } // scrolled away while the play request was pending
          }).catch((err) => {
            pl.pending = false
            // Browser blocked autoplay (no click/key/touch yet): ask for one, then it starts by itself.
            if (err && err.name === 'NotAllowedError' && !pl.hinted && pl.isOnSlide()) {
              pl.hinted = true
              show(pl, HINT)
            }
          })
        } else {
          // Left the slide: stop, and replay from the first line next time (scrolling up or down).
          if (pl.active || pl.hinted) { pl.hinted = false; clearFor(pl) }
          pl.reset()
        }
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const unlock = () => update()
    update()
    // Autoplay is allowed once the page has had any click/key/touch (e.g. entering this world).
    // If the browser still blocked it, keep retrying while on the slide so it starts by itself.
    const retry = setInterval(update, 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('pointerup', unlock)
    window.addEventListener('mousedown', unlock)
    window.addEventListener('click', unlock)
    window.addEventListener('keydown', unlock)
    window.addEventListener('touchend', unlock)
    window.addEventListener('wheel', unlock, { passive: true })
    return () => {
      window.removeEventListener('pointerup', unlock)
      window.removeEventListener('mousedown', unlock)
      window.removeEventListener('click', unlock)
      slideGate.handle = null
      clearInterval(retry)
      clearInterval(tick)
      window.removeEventListener('touchend', unlock)
      window.removeEventListener('wheel', unlock)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      cancelAnimationFrame(raf)
      players.forEach((pl) => pl.audio.pause())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return caption
}
