import { useEffect, useState } from 'react'
import { slideGate } from '../utils/slideScroll'

// Plays one narration per chapter slide, with synced captions. `narrations` is
// [{ src, captions, slide }]; returns the caption text currently on screen.
export default function useNarrations(narrations) {
  const [caption, setCaption] = useState('')

  // Each chapter's narration plays when its 3D model slide is reached; stops when leaving it.
  useEffect(() => {
    let raf = 0
    const slideEl = (n) => document.querySelectorAll('.surface-spacer')[n]
    const players = narrations.map(({ src, captions, slide }) => {
      const audio = new Audio(src)
      const total = captions.reduce((n, s) => n + s.length, 0)
      const pl = { audio, captions, total, done: false, lastIdx: -2, lastStep: 0 }
      pl.isOnSlide = () => {
        const sp = slideEl(slide)
        return !!sp && Math.abs(sp.getBoundingClientRect().top) < window.innerHeight * 0.225
      }
      pl.index = () => {
        const pos = (audio.currentTime / audio.duration) * total
        let acc = 0
        for (let i = 0; i < captions.length; i++) {
          acc += captions[i].length
          if (pos < acc) return i
        }
        return captions.length - 1
      }
      pl.clear = () => { pl.lastIdx = -1; setCaption('') }
      pl.show = () => {
        const dur = audio.duration
        if (audio.paused || !isFinite(dur) || dur <= 0) {
          if (pl.lastIdx !== -1) { pl.lastIdx = -1; setCaption('') }
          return
        }
        const idx = pl.index()
        if (idx !== pl.lastIdx) { pl.lastIdx = idx; setCaption(captions[idx]) }
      }
      pl.onEnded = () => { pl.done = true; pl.clear() } // finished once: don't lock the visitor again
      audio.addEventListener('timeupdate', pl.show)
      audio.addEventListener('pause', pl.clear)
      audio.addEventListener('ended', pl.onEnded)
      return pl
    })

    // While on a slide, each scroll step moves one caption (seeking the narration to it).
    // Only after the last caption is showing does the next scroll go to the next chapter.
    // If the audio isn't playing (autoplay blocked), don't trap the visitor.
    slideGate.handle = (dir) => {
      const pl = players.find((p) => p.isOnSlide())
      if (!pl) return false
      const { audio, captions, total } = pl
      if (pl.done || audio.paused || audio.ended || !isFinite(audio.duration)) return false
      const cur = pl.index()
      if (dir > 0 && cur >= captions.length - 1) { pl.done = true; return false }
      if (dir < 0 && cur <= 0) return false
      const now = performance.now()
      if (now - pl.lastStep < 700) return true // swallow wheel/trackpad bursts
      pl.lastStep = now
      const next = cur + dir
      let before = 0
      for (let i = 0; i < next; i++) before += captions[i].length
      audio.currentTime = (before / total) * audio.duration + 0.02
      pl.lastIdx = next
      setCaption(captions[next])
      return true
    }
    const update = () => {
      raf = 0
      players.forEach((pl) => {
        const { audio } = pl
        const onSlide = pl.isOnSlide()
        if (onSlide && pl.done) return
        if (onSlide) { if (audio.paused && !audio.ended) audio.play().catch(() => {}) } // blocked until the visitor interacts
        else if (!audio.paused || audio.currentTime) { audio.pause(); audio.currentTime = 0 }
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
    window.addEventListener('keydown', unlock)
    window.addEventListener('touchend', unlock)
    window.addEventListener('wheel', unlock, { passive: true })
    return () => {
      slideGate.handle = null
      clearInterval(retry)
      window.removeEventListener('touchend', unlock)
      window.removeEventListener('wheel', unlock)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      cancelAnimationFrame(raf)
      players.forEach((pl) => {
        pl.audio.removeEventListener('timeupdate', pl.show)
        pl.audio.removeEventListener('pause', pl.clear)
        pl.audio.removeEventListener('ended', pl.onEnded)
        pl.audio.pause()
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return caption
}
