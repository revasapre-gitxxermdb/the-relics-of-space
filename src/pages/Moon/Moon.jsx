import c1Audio from '../../assets/moonChapters/MC1.mp3'
import c2Audio from '../../assets/moonChapters/MC2.mp3'
import c3Audio from '../../assets/moonChapters/MC3.mp3'
import c4Audio from '../../assets/moonChapters/MC4.mp3'
import moonImg from '../../assets/Moon-round.png'
import moonSurfaceImg from '../../assets/moonSurface.png'
import '@google/model-viewer'
import c2Model from '../../assets/moon/c2.glb'
import c3Model from '../../assets/moon/c3.glb'
import c4Model from '../../assets/moon/c4.glb'
import { CHAPTERS } from '../../data/chapters'
import Chapter from '../../components/World/Chapter'
import Surface from '../../components/World/Surface'
import useNarrations from '../../hooks/useNarrations'

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
  "Look at this tiny explorer, Earth explorers! Meet CAPSTONE — a microwave-sized CubeSat weighing just 25 kilograms! Launched on June 28, 2022, its International Designator is 2022-070A, and its NORAD Catalog Number is 52914. But don't underestimate its size! This little spacecraft had a big mission — testing a special lunar orbit planned for NASA's Gateway space station!",
  "But why test an orbit first? Because before sending a huge space station there, NASA needed to understand how this unusual orbit works! It's called a Near-Rectilinear Halo Orbit, or NRHO — an elongated path shaped by the combined gravity of Earth and the Moon.",
  "Now, let's see how CAPSTONE navigates! It travels around the Moon in an approximately six-and-a-half-day orbit. Its CAPS navigation system communicates with NASA's Lunar Reconnaissance Orbiter, or LRO, to measure their distance and help calculate CAPSTONE's position!",
  "And here's the historic achievement! CAPSTONE became the first spacecraft to successfully enter and operate in this special lunar orbit, helping confirm that it could work for future missions!",
  "CAPSTONE completed its primary and extended mission objectives, and NASA's mission activities concluded in June 2026. Amazing, isn't it? A tiny CubeSat helped pave the way for a future space station around the Moon! Come on, explorers — our next relic awaits!",
]

const C3_CAPTIONS = [
  "Earth explorers, get ready for a historic moment! Meet Eagle, the Apollo 11 Lunar Module that carried Neil Armstrong and Buzz Aldrin to the Moon in 1969! Apollo 11 launched on July 16, 1969, and landed on July 20 at the Sea of Tranquility. Its International Designator is 1969-059C, and its NASA NSSDC ID is 69-059C!",
  "But don't let its unusual shape fool you! Eagle was a powerful two-stage spacecraft! Its combined ascent and descent stages had a mass of approximately 15,103 kilograms, while the descent stage alone had a dry mass of 2,034 kilograms!",
  "Now, let's discover how Eagle worked! Its descent engine produced a maximum thrust of approximately 44,000 newtons and could be throttled to control the lunar landing. Eagle also carried the Early Apollo Scientific Experiments Package, or EASEP, which included scientific instruments left behind on the Moon!",
  "And here's the incredible achievement! Armstrong and Aldrin spent 21 hours and 36 minutes on the lunar surface and collected 21.55 kilograms of Moon samples! They made history as the first humans to walk on the Moon!",
  "But wait, explorers! Eagle left behind something that is still scientifically useful — a Laser Ranging Retroreflector! Even today, observatories on Earth send laser pulses toward its mirrors and measure the reflected signals to calculate the distance between Earth and the Moon!",
  "Eagle's historic mission was completed! Its descent stage remains at the Apollo 11 landing site, while the laser reflector continues to support scientific measurements. Amazing, isn't it? A spacecraft that helped humans take their first steps on another world! Come on, explorers — our next relic awaits!",
]

const C4_CAPTIONS = [
  "Meet Surveyor 3, NASA's robotic Moon explorer! Launched on April 17, 1967, it landed on April 20 in Oceanus Procellarum, the Ocean of Storms! Its International Designator and NASA NSSDC ID are both 1967-035A and 67-035A, respectively. Its launch mass was approximately 998 kilograms!",
  "This lander stood approximately 3 metres tall and had a width of 4.2 metres with its landing legs extended! It used solar cells and silver-zinc batteries for power. Its Soil Mechanics Surface Sampler had an extendable arm reaching approximately 1.5 metres and could dig up to 18 centimetres deep!",
  "Surveyor 3 also carried a television camera with 200-line and 600-line imaging modes. It transmitted 6,326 pictures of the lunar surface!",
  "But here's the unbelievable part! In November 1969, Apollo 12 astronauts Pete Conrad and Alan Bean visited Surveyor 3, approximately 180 metres from their landing site! They recovered its camera system, soil scoop and other components and brought them back to Earth for examination!",
  "Surveyor 3's last communication was on May 4, 1967, but its scientific legacy continued through Apollo 12! Amazing, isn't it? A robotic explorer helped prepare humans for lunar exploration! Come on, explorers — our next relic awaits!",
]

// One narration per chapter; `slide` is the index of that chapter's surface-spacer.
const NARRATIONS = [
  { src: c1Audio, captions: C1_CAPTIONS, slide: 0 },
  { src: c2Audio, captions: C2_CAPTIONS, slide: 1 },
  { src: c3Audio, captions: C3_CAPTIONS, slide: 2 },
  { src: c4Audio, captions: C4_CAPTIONS, slide: 3 },
]

export default function Moon() {
  const caption = useNarrations(NARRATIONS, { holdUntilEnd: true })

  return (
    <>
      <Surface world={WORLD} groundImg={moonSurfaceImg} />
      <div className={`caption${caption ? ' caption--on' : ''}`} role="status" aria-live="polite">
        <span className="caption__text">{caption}</span>
      </div>
      {CHAPTERS.moon.map((title, i) => (
        <Chapter key={i} index={i} title={title} world={WORLD}>
          {i === 0 && (
            <iframe
              className="moon__model moon__model--c1"
              src="/moonCM.html"
              title="LRO 3D model"
              allowTransparency="true"
              loading="eager"
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
