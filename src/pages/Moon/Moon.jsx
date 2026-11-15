import { useEffect, useState } from 'react'
import c1Audio from '../../assets/moonChapters/MC1.mp3'
import moonImg from '../../assets/Moon-round.png'
import moonSurfaceImg from '../../assets/moonSurface.png'
import '@google/model-viewer'
import c1Model from '../../assets/moon/c1.glb'
import { CHAPTERS } from '../../data/chapters'
import Chapter from '../../components/World/Chapter'
import Surface from '../../components/World/Surface'

const WORLD = { key: 'moon', name: 'Moon', img: moonImg }

// Captions for the chapter 1 narration. Each line's on-screen time is proportional to its length,
// spread across the real audio duration (so no manual timestamps are needed).
const C1_CAPTIONS = [
  "Well, well, well! Welcome, Earth explorers!",
  "I'm Zog, your friendly guide from beyond the stars!",
  "Today, we're visiting the Moon, where some craters never see sunlight!",
  "Curious? Let's meet their detective — LRO!",
  "But first, let's get to know our Moon detective!",
  "Launched on June 18, 2009, NASA's Lunar Reconnaissance Orbiter, or LRO,",
  "has a mass of approximately 1,850 kilograms and carries the identifier 2009-035A.",
  "It orbits the Moon in a near-polar orbit, approximately 50 kilometres above its surface!",
  "And guess what? LRO isn't abandoned!",
  "It's still operational, collecting valuable lunar science data!",
  "Now, let's discover how it works!",
  "Its LROC camera captures incredibly detailed lunar images,",
  "while Diviner measures temperatures across the Moon!",
  "But wait, explorers! Here's where things get really exciting!",
  "Brrrr! Diviner detected temperatures as low as minus 248°C in permanently shadowed craters!",
  "These freezing regions could preserve valuable water ice!",
  "And there's another fascinating discovery!",
  "LRO photographed all six Apollo landing sites,",
  "revealing lunar modules, equipment, and traces of astronauts' footsteps.",
  "Talk about a blast from the past!",
  "Amazing, isn't it?",
  "From hidden ice to historic footprints, LRO is helping us prepare for future lunar exploration!",
  "Come on, explorers — our next relic awaits!",
]
const C1_TOTAL = C1_CAPTIONS.reduce((n, s) => n + s.length, 0)

export default function Moon() {
  const [caption, setCaption] = useState('')

  // Narration for chapter 1 plays when the 3D model slide is reached; stops when leaving it.
  useEffect(() => {
    const audio = new Audio(c1Audio)
    let raf = 0
    let lastIdx = -2
    const showCaption = () => {
      const dur = audio.duration
      if (audio.paused || !isFinite(dur) || dur <= 0) {
        if (lastIdx !== -1) { lastIdx = -1; setCaption('') }
        return
      }
      const pos = (audio.currentTime / dur) * C1_TOTAL
      let acc = 0, idx = C1_CAPTIONS.length - 1
      for (let i = 0; i < C1_CAPTIONS.length; i++) {
        acc += C1_CAPTIONS[i].length
        if (pos < acc) { idx = i; break }
      }
      if (idx !== lastIdx) { lastIdx = idx; setCaption(C1_CAPTIONS[idx]) }
    }
    const clearCaption = () => { lastIdx = -1; setCaption('') }
    audio.addEventListener('timeupdate', showCaption)
    audio.addEventListener('pause', clearCaption)
    audio.addEventListener('ended', clearCaption)
    const tryPlay = () => audio.play().catch(() => {}) // blocked until the visitor interacts
    const update = () => {
      raf = 0
      const sp = document.querySelector('.surface-spacer')
      if (!sp) return
      // Same threshold as the rover's entry in Surface.jsx (first > 0.5), so audio starts as the model drives in
      const onSlide = Math.abs(sp.getBoundingClientRect().top) < window.innerHeight * 0.225
      if (onSlide) { if (audio.paused && !audio.ended) tryPlay() }
      else if (!audio.paused || audio.currentTime) { audio.pause(); audio.currentTime = 0 }
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
      clearInterval(retry)
      window.removeEventListener('touchend', unlock)
      window.removeEventListener('wheel', unlock)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      cancelAnimationFrame(raf)
      audio.removeEventListener('timeupdate', showCaption)
      audio.removeEventListener('pause', clearCaption)
      audio.removeEventListener('ended', clearCaption)
      audio.pause()
    }
  }, [])

  // Wheels turn while the rover drives in (same duration as the CSS slide-in) and stop the moment it arrives.
  useEffect(() => {
    const mv = document.querySelector('.moon__model')
    if (!mv) return
    const DRIVE_MS = 30000 // keep in sync with .moon__model transition in World.css
    let state = 'away' // away | driving | parked
    let timer = 0
    let drive = null
    const spin = (on) => {
      if (on) mv.play({ repetitions: Infinity }); else mv.pause()
    }
    const check = () => {
      const x = getComputedStyle(document.documentElement).getPropertyValue('--model-x').trim()
      if (x === '0px' && state === 'away') {
        state = 'driving'
        spin(true)
        drive = mv.animate(
          [{ transform: 'translateX(110vw)' }, { transform: 'translateX(0)' }],
          { duration: DRIVE_MS, easing: 'linear', fill: 'forwards' }
        )
        timer = setTimeout(() => { state = 'parked'; spin(false) }, DRIVE_MS)
      } else if (x === '110vw' && state !== 'away') {
        clearTimeout(timer)
        state = 'away'
        spin(false)
        drive?.cancel(); drive = null
      }
    }
    const onLoad = () => { spin(state === 'driving'); check() }
    window.addEventListener('scroll', check, { passive: true })
    mv.addEventListener('load', onLoad)
    check()
    return () => {
      clearTimeout(timer)
      drive?.cancel()
      window.removeEventListener('scroll', check)
      mv.removeEventListener('load', onLoad)
    }
  }, [])

  return (
    <>
      <Surface world={WORLD} groundImg={moonSurfaceImg} />
      <div className={`caption${caption ? ' caption--on' : ''}`} role="status" aria-live="polite">
        <span className="caption__text">{caption}</span>
      </div>
      {CHAPTERS.moon.map((title, i) => (
        <Chapter key={i} index={i} title={title} world={WORLD}>
          {i === 0 && (
            <model-viewer
              class="moon__model"
              src={c1Model}
              alt="Moon 3D model"
              camera-controls
              touch-action="pan-y"
              interaction-prompt="none"
              camera-orbit="55deg 78deg auto"
              disable-zoom
              disable-pan
              min-polar-angle="0deg"
              max-polar-angle="180deg"
              shadow-intensity="1"
            />
          )}
        </Chapter>
      ))}
    </>
  )
}
