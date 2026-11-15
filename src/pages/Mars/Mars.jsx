import { useEffect } from 'react'
import c1Audio from '../../assets/marseChapters/MarseC1.mp3'
import c2Audio from '../../assets/marseChapters/MarseC2.mp3'
import c3Audio from '../../assets/marseChapters/MarseC3.mp3'
import c4Audio from '../../assets/marseChapters/MarseC4.mp3'
import '@google/model-viewer'
import marsImg from '../../assets/Marse-round.png'
import marsSurfaceImg from '../../assets/marsSurface.png'
import c1Model from '../../assets/mars/c1.glb'
import c2Model from '../../assets/mars/c2.glb'
import c3Model from '../../assets/mars/c3.glb'
import { CHAPTERS } from '../../data/chapters'
import Chapter from '../../components/World/Chapter'
import Surface from '../../components/World/Surface'
import useNarrations from '../../hooks/useNarrations'

const WORLD = { key: 'mars', name: 'Mars', img: marsImg }

// Captions per chapter (currently the same text for all four - replace each list when the scripts differ).
// Each line's on-screen time is proportional to its length, spread across the real audio duration.
const C1_CAPTIONS = [
  "Well, Earth explorers! Now, let's journey into the mysteries of DEEP SPACE and discover our golden time machine — James Webb Space Telescope!",
  "Behold the golden giant — the James Webb Space Telescope!",
  "Launched on December 25, 2021, JWST reached its destination near the Sun-Earth Lagrange Point 2, approximately 1.5 million kilometres from Earth, on January 24, 2022.",
  "Its total payload mass is approximately 6,200 kilograms, and its primary mirror measures 6.5 metres across!",
  "Look closely! Its primary mirror contains 18 hexagonal beryllium segments coated with gold. Together, they work like one giant mirror to collect faint light from distant objects.",
  "A five-layer sunshield, approximately the size of a tennis court, protects its sensitive mirrors and instruments from the Sun's heat.",
  "Its NIRCam observes near-infrared light, while MIRI observes mid-infrared wavelengths!",
  "But why infrared? Because as the universe expands, light from extremely distant galaxies gets stretched to longer wavelengths.",
  "JWST detects this infrared light to study some of the earliest galaxies and investigate the atmospheres of planets orbiting other stars — called exoplanets!",
  "And here's a surprising fact! The gold coating on each mirror segment is only about 100 nanometres thick!",
  "All that gold together weighs approximately 48 grams — about the mass of a golf ball!",
  "Incredible, isn't it? This golden giant helps us explore the universe's oldest mysteries!",
]
const C2_CAPTIONS = C1_CAPTIONS
const C3_CAPTIONS = [
  "Earth explorers, can anything fly on Mars? Let's meet the little pioneer that proved it could — Ingenuity!",
  "Vroooom! Meet Ingenuity, NASA's tiny Mars helicopter!",
  "It travelled attached beneath Perseverance, launched on July 30, 2020, and arrived on Mars on February 18, 2021.",
  "Its International Designator is 2020-052D, and its mass is just 1.8 kilograms!",
  "It stands approximately 49 centimetres tall, with rotor blades spanning 1.2 metres!",
  "But how could it fly in Mars' extremely thin atmosphere, with less than 1% of Earth's atmospheric density?",
  "Its four carbon-fibre blades, arranged in two counter-rotating rotors, spun at approximately 2,400 revolutions per minute!",
  "A solar panel charges its six lithium-ion batteries, powering its flight and onboard systems!",
  "Here's the unbelievable achievement! NASA originally planned just five test flights, but Ingenuity completed an incredible 72 flights!",
  "It flew for more than 128 minutes and covered approximately 17 kilometres!",
  "Its final flight took place on January 18, 2024. A damaged rotor blade ended its flying operations, and NASA officially ended the mission on January 25, 2024.",
  "Ingenuity became the first aircraft to achieve powered, controlled flight on another planet!",
  "What a flying pioneer! Come on, explorers — our next Martian relic awaits!",
]
const C4_CAPTIONS = C1_CAPTIONS

// One narration per chapter; `slide` is the index of that chapter's surface-spacer.
const NARRATIONS = [
  { src: c1Audio, captions: C1_CAPTIONS, slide: 0 },
  { src: c2Audio, captions: C2_CAPTIONS, slide: 1 },
  { src: c3Audio, captions: C3_CAPTIONS, slide: 2 },
  { src: c4Audio, captions: C4_CAPTIONS, slide: 3 },
]

export default function Mars() {
  const caption = useNarrations(NARRATIONS)

  // Wheels turn while the rover drives in and stop the moment it arrives.
  useEffect(() => {
    const mv = document.querySelector('.moon__model')
    if (!mv) return
    const DRIVE_MS = 30000
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
      <Surface world={WORLD} groundImg={marsSurfaceImg} />
      <div className={`caption${caption ? ' caption--on' : ''}`} role="status" aria-live="polite">
        <span className="caption__text">{caption}</span>
      </div>
      {CHAPTERS.mars.map((title, i) => (
        <Chapter key={i} index={i} title={title} world={WORLD}>
          {i === 0 && (
            <model-viewer
              class="moon__model"
              src={c1Model}
              alt="Mars 3D model"
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
          {i === 1 && (
            <model-viewer
              class="moon__model moon__model--c2"
              src={c2Model}
              alt="Mars 3D model"
              camera-controls
              touch-action="pan-y"
              interaction-prompt="none"
              auto-rotate
              disable-zoom
              disable-pan
              shadow-intensity="1"
            />
          )}
          {i === 2 && (
            <model-viewer
              class="moon__model moon__model--c3"
              src={c3Model}
              alt="Ingenuity helicopter 3D model"
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
