import { useEffect, useState } from 'react'
import c1Audio from '../../assets/moonChapters/MC1.mp3'
import c2Audio from '../../assets/moonChapters/MC2.mp3'
import c3Audio from '../../assets/moonChapters/MC3.mp3'
import c4Audio from '../../assets/moonChapters/MC4.mp3'
import moonImg from '../../assets/Moon-round.png'
import moonSurfaceImg from '../../assets/moonSurface.png'
import '@google/model-viewer'
import c1Model from '../../assets/moon/c1.glb'
import c2Model from '../../assets/moon/c2.glb'
import c3Model from '../../assets/moon/c3.glb'
import c4Model from '../../assets/moon/c4.glb'
import { CHAPTERS } from '../../data/chapters'
import Chapter from '../../components/World/Chapter'
import Surface from '../../components/World/Surface'
import { slideGate } from '../../utils/slideScroll'

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

const C2_CAPTIONS = [
  "Now meet humanity's farthest ambassador — Voyager 1!",
  "Launched on September 5, 1977, this spacecraft explored Jupiter and Saturn before continuing its journey toward interstellar space.",
  "Its launch mass was approximately 815 kilograms!",
  "It uses three Radioisotope Thermoelectric Generators, or RTGs, which produce electricity from heat released by radioactive Plutonium-238 decay.",
  "Originally, Voyager carried 11 scientific instruments, including plasma wave and cosmic ray instruments to investigate its surrounding space.",
  "Today, only two science instruments remain operational!",
  "But its most famous object is the Golden Record — a 12-inch gold-plated copper phonograph disc containing sounds, music, greetings and images representing life on Earth!",
  "On August 25, 2012, Voyager 1 crossed the heliopause and entered interstellar space!",
  "It is the farthest human-made object, travelling more than 24 billion kilometres from Earth.",
  "Imagine this — a radio message takes nearly 22.5 hours to reach it!",
  "Even after decades in space, Voyager 1 continues its incredible journey through interstellar space!",
  "What an extraordinary ambassador from Earth! Come on, explorers — our next deep-space relic awaits!",
]

const C3_CAPTIONS = [
  "Now, Earth explorers, let's discover the hidden planets orbiting distant stars with NASA's planet hunter — Kepler!",
  "Meet the Kepler Space Telescope, launched on March 7, 2009, UTC!",
  "Its spacecraft mass was approximately 1,039 kilograms, and its telescope had an aperture of 0.95 metres.",
  "Its mission was to discover how common Earth-sized planets are around other stars, especially in their habitable zones!",
  "Now, how did Kepler find these distant worlds?",
  "It used a technique called the Transit Method.",
  "When a planet passes in front of its star, it blocks a tiny amount of light, creating a small dip in the star's brightness.",
  "Kepler detected these changes using its 95-megapixel photometer, containing 42 CCD detectors!",
  "Kepler continuously observed stars in our Milky Way and, together with its extended K2 mission, studied more than half a million stars!",
  "And the result? More than 2,600 confirmed exoplanets discovered!",
  "Its observations transformed our understanding of planetary systems beyond our Solar System!",
  "After nine years of space exploration, Kepler ran out of fuel and NASA officially retired the telescope on October 30, 2018.",
  "Although its mission has ended, scientists continue studying its valuable data to discover more distant worlds!",
  "What an incredible planet hunter! Come on, explorers — our next deep-space relic awaits!",
]

const C4_CAPTIONS = [
  "And finally, Earth explorers, meet Dawn — the spacecraft with one of the most remarkable propulsion systems ever used for deep-space exploration!",
  "Launched on September 27, 2007, Dawn had a launch mass of 1,217.7 kilograms, including its fuel.",
  "Without propellant, the spacecraft itself weighed about 747.1 kilograms.",
  "Its International Designator, also known as its COSPAR ID, was 2007-043A. Its NASA NSSDC ID was also 2007-043A.",
  "The spacecraft body measured approximately 1.64 meters long, 1.27 meters wide and 1.77 meters tall.",
  "With its solar arrays fully extended, its wingspan reached an incredible 19.7 meters!",
  "Its mission was to orbit and compare two of the largest objects in the asteroid belt — asteroid Vesta and dwarf planet Ceres.",
  "But how did Dawn travel such enormous distances?",
  "It used a revolutionary Xenon Ion Propulsion System, powered by electricity generated from its two large solar arrays.",
  "Here's how it worked: electricity first converted xenon gas into charged particles called ions.",
  "Powerful electric fields then accelerated these ions and expelled them through the thruster, producing a gentle but continuous thrust that pushed the spacecraft forward.",
  "Dawn carried three ion thrusters, but operated only one at a time. Each produced a maximum thrust of 91 millinewtons — very small, but extremely fuel-efficient!",
  "Dawn also carried three main scientific instruments: a framing camera, a visible and infrared mapping spectrometer, and a gamma ray and neutron detector.",
  "These instruments helped scientists study the surface, composition, minerals and internal structure of Vesta and Ceres.",
  "And here's its historic achievement: Dawn became the first spacecraft ever to orbit two different extraterrestrial bodies!",
  "After an extraordinary journey, NASA officially concluded its mission on November 1, 2018, after Dawn ran out of the hydrazine fuel needed to control its orientation.",
  "Today, Dawn remains in orbit around Ceres — a silent relic of extraordinary engineering!",
]

// One narration per chapter; `slide` is the index of that chapter's surface-spacer.
const NARRATIONS = [
  { src: c1Audio, captions: C1_CAPTIONS, slide: 0 },
  { src: c2Audio, captions: C2_CAPTIONS, slide: 1 },
  { src: c3Audio, captions: C3_CAPTIONS, slide: 2 },
  { src: c4Audio, captions: C4_CAPTIONS, slide: 3 },
]

export default function Moon() {
  const [caption, setCaption] = useState('')

  // Each chapter's narration plays when its 3D model slide is reached; stops when leaving it.
  useEffect(() => {
    let raf = 0
    const slideEl = (n) => document.querySelectorAll('.surface-spacer')[n]
    const players = NARRATIONS.map(({ src, captions, slide }) => {
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
          {i >= 1 && i <= 3 && (
            <model-viewer
              class={`moon__model moon__model--c${i + 1}`}
              src={[c2Model, c3Model, c4Model][i - 1]}
              alt="Moon 3D model"
              camera-controls
              touch-action="pan-y"
              interaction-prompt="none"
              auto-rotate
              disable-zoom
              disable-pan
              shadow-intensity="1"
            />
          )}
        </Chapter>
      ))}
    </>
  )
}
