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
  "Well, Earth explorers! Our next destination is the Red Planet — MARS! A mysterious world full of ancient secrets! Ready? Let's meet its robotic detective — Perseverance!",
  "Zzzzt! Meet Perseverance, nicknamed Percy! Launched on July 30, 2020, NASA's 1,025-kilogram rover landed in Jezero Crater on February 18, 2021. Its International Designator is 2020-052A!",
  "But why did NASA choose Jezero Crater? Billions of years ago, this region contained a lake and an ancient river delta! Scientists are searching its rocks for clues of possible ancient microbial life.",
  "Now, let's discover its technology! SuperCam fires a laser at rocks from up to 7 metres away to study their chemical composition. Its robotic arm drills rock cores and stores samples in special tubes for possible future return to Earth!",
  "But wait, explorers! Its MOXIE experiment converted Martian atmospheric carbon dioxide into oxygen, producing a total of 122 grams! What an incredible achievement!",
  "MOXIE completed its experiment in September 2023, but Perseverance is still exploring Mars! Amazing, isn't it? A robotic detective searching for ancient life while testing technology for future human explorers! Come on, explorers — our next Martian relic awaits!",
]
const C2_CAPTIONS = [
  "And now, explorers, meet Curiosity — NASA's 899-kilogram robotic rover! Launched on November 26, 2011, it landed in Gale Crater on August 6, 2012. Its International Designator is 2011-070A, and its NASA NSSDC ID is 2011-070A! This rover measures approximately 3 metres long, 2.8 metres wide and 2.1 metres tall!",
  "But how did such a heavy rover land safely on Mars? NASA used an incredible technique called the Sky Crane! Rocket-powered thrusters slowed its descent while cables gently lowered Curiosity onto the Martian surface!",
  "Now, let's discover its technology! Curiosity uses an MMRTG nuclear power system, which converts heat from Plutonium-238's natural radioactive decay into electricity. Its ChemCam fires a laser at rocks to study their chemical composition, while its SAM laboratory uses ovens and scientific instruments to analyse rock samples and investigate organic molecules!",
  "But here's an amazing discovery! Curiosity found evidence that Gale Crater once contained an ancient freshwater lake environment with chemical ingredients and conditions suitable for microbial life!",
  "Curiosity is still actively exploring Mars and climbing the layered slopes of Mount Sharp! Amazing, isn't it? This robotic climber is uncovering the Red Planet's ancient watery history! Come on, explorers — our next Martian relic awaits!",
]
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
const C4_CAPTIONS = [
  "Earth explorers, meet a tiny robot that made history! This is Sojourner — the first wheeled rover to operate on another planet!",
  "Sojourner travelled aboard NASA's Mars Pathfinder mission, which landed on Mars on July 4, 1997, at Ares Vallis! The rover rolled onto the Martian surface the next day, July 5, 1997! It had a mass of just 10.5 kilograms and measured approximately 65 centimetres long, 48 centimetres wide, and 30 centimetres tall!",
  "Now, how did this little explorer move and investigate Mars? Its six-wheel Rocker-Bogie suspension helped it cross uneven terrain and climb over obstacles. It used solar panels for power, supported by primary batteries. Its key science instrument was the APXS — Alpha Proton X-ray Spectrometer — which analysed the elemental composition of Martian rocks and soil!",
  "Here's the amazing part! Sojourner was designed for a seven-day mission, but it operated for an incredible 83 days! It reached a maximum speed of approximately one centimetre per second and travelled about 100 metres across the Martian surface!",
  "After 83 days of rover operations, its last successful data transmission came on September 27, 1997. NASA officially terminated the Pathfinder mission on March 10, 1998. Sojourner's success helped establish the technology and engineering foundation for future Mars rovers. Small in size, but enormous in achievement! Come on, explorers — our next relic awaits!",
]

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

  // Chapter 4 rover drives in from the right when its slide is reached, parks, and leaves when scrolled away.
  useEffect(() => {
    const el = document.querySelector('.moon__model--c4')
    if (!el) return
    let here = false
    let anim = null
    const check = () => {
      const pe = getComputedStyle(document.documentElement).getPropertyValue('--model4-pe').trim()
      if (pe === 'auto' && !here) {
        here = true
        anim = el.animate(
          [{ transform: 'translateX(110vw)' }, { transform: 'translateX(0)' }],
          { duration: 3500, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }
        )
      } else if (pe !== 'auto' && here) {
        here = false
        anim?.cancel(); anim = null
      }
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => {
      anim?.cancel()
      window.removeEventListener('scroll', check)
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
          {i === 3 && (
            <iframe
              className="moon__model moon__model--c4"
              src="/marseC4.html"
              title="Sojourner rover 3D model"
              allowTransparency="true"
              loading="eager"
            />
          )}
        </Chapter>
      ))}
    </>
  )
}
