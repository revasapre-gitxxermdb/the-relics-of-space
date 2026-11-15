import { useEffect } from 'react'
import c1Audio from '../../assets/moonChapters/MC1.mp3'
import moonImg from '../../assets/Moon-round.png'
import moonSurfaceImg from '../../assets/moonSurface.png'
import '@google/model-viewer'
import c1Model from '../../assets/moon/c1.glb'
import { CHAPTERS } from '../../data/chapters'
import Chapter from '../../components/World/Chapter'
import Surface from '../../components/World/Surface'

const WORLD = { key: 'moon', name: 'Moon', img: moonImg }

export default function Moon() {
  // Narration for chapter 1 plays when the 3D model slide is reached; stops when leaving it.
  useEffect(() => {
    const audio = new Audio(c1Audio)
    let raf = 0
    const tryPlay = () => audio.play().catch(() => {}) // blocked until the visitor interacts
    const update = () => {
      raf = 0
      const sp = document.querySelector('.surface-spacer')
      if (!sp) return
      const onSlide = Math.abs(sp.getBoundingClientRect().top) < window.innerHeight * 0.2
      if (onSlide) { if (audio.paused && !audio.ended) tryPlay() }
      else if (!audio.paused || audio.currentTime) { audio.pause(); audio.currentTime = 0 }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const unlock = () => update()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      cancelAnimationFrame(raf)
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
