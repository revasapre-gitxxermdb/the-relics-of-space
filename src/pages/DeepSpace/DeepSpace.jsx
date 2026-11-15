import deepSpaceImg from '../../assets/Deepspace.png'
import '@google/model-viewer'
import c1Audio from '../../assets/deepSpace/DeepC1.mp3'
import c2Audio from '../../assets/deepSpace/DeepC2.mp3'
import c3Audio from '../../assets/deepSpace/DeepC3.mp3'
import c4Audio from '../../assets/deepSpace/DeepC4.mp3'
import c1Model from '../../assets/deep/c1.glb'
import c2Model from '../../assets/deep/c2.glb'
import { CHAPTERS } from '../../data/chapters'
import Chapter from '../../components/World/Chapter'
import Surface from '../../components/World/Surface'
import Galaxy from '../../components/World/Galaxy'
import useNarrations from '../../hooks/useNarrations'

const WORLD = { key: 'deepspace', name: 'Deep Space', img: deepSpaceImg }

// Chapter 1 captions. Each line's on-screen time is proportional to its length, spread across the audio duration.
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

const C2_CAPTIONS = [
  "Now meet humanity's farthest ambassador — Voyager 1!",
  "Launched on September 5, 1977, this spacecraft explored Jupiter and Saturn before continuing its journey toward interstellar space. Its launch mass was approximately 815 kilograms!",
  "It uses three Radioisotope Thermoelectric Generators, or RTGs, which produce electricity from heat released by radioactive Plutonium-238 decay. Originally, Voyager carried 11 scientific instruments, including plasma wave and cosmic ray instruments to investigate its surrounding space. Today, only two science instruments remain operational!",
  "But its most famous object is the Golden Record — a 12-inch gold-plated copper phonograph disc containing sounds, music, greetings and images representing life on Earth!",
  "On August 25, 2012, Voyager 1 crossed the heliopause and entered interstellar space! It is the farthest human-made object, travelling more than 24 billion kilometres from Earth. Imagine this — a radio message takes nearly 22.5 hours to reach it!",
  "Even after decades in space, Voyager 1 continues its incredible journey through interstellar space! What an extraordinary ambassador from Earth! Come on, explorers — our next deep-space relic awaits!",
]

const C3_CAPTIONS = [
  "Now, Earth explorers, let's discover the hidden planets orbiting distant stars with NASA's planet hunter — Kepler!",
  "Meet the Kepler Space Telescope, launched on March 7, 2009, UTC! Its spacecraft mass was approximately 1,039 kilograms, and its telescope had an aperture of 0.95 metres. Its mission was to discover how common Earth-sized planets are around other stars, especially in their habitable zones!",
  "Now, how did Kepler find these distant worlds? It used a technique called the Transit Method. When a planet passes in front of its star, it blocks a tiny amount of light, creating a small dip in the star's brightness. Kepler detected these changes using its 95-megapixel photometer, containing 42 CCD detectors!",
  "Kepler continuously observed stars in our Milky Way and, together with its extended K2 mission, studied more than half a million stars! And the result? More than 2,600 confirmed exoplanets discovered! Its observations transformed our understanding of planetary systems beyond our Solar System!",
  "After nine years of space exploration, Kepler ran out of fuel and NASA officially retired the telescope on October 30, 2018. Although its mission has ended, scientists continue studying its valuable data to discover more distant worlds! What an incredible planet hunter! Come on, explorers — our next deep-space relic awaits!",
]

const C4_CAPTIONS = [
  "And finally, Earth explorers, meet Dawn — the spacecraft with one of the most remarkable propulsion systems ever used for deep-space exploration!",
  "Launched on September 27, 2007, Dawn had a launch mass of 1,217.7 kilograms, including its fuel. Without propellant, the spacecraft itself weighed about 747.1 kilograms.",
  "Its International Designator, also known as its COSPAR ID, was 2007-043A. Its NASA NSSDC ID was also 2007-043A.",
  "The spacecraft body measured approximately 1.64 meters long, 1.27 meters wide and 1.77 meters tall. With its solar arrays fully extended, its wingspan reached an incredible 19.7 meters!",
  "Its mission was to orbit and compare two of the largest objects in the asteroid belt — asteroid Vesta and dwarf planet Ceres.",
  "But how did Dawn travel such enormous distances? It used a revolutionary Xenon Ion Propulsion System, powered by electricity generated from its two large solar arrays.",
  "Here's how it worked: electricity first converted xenon gas into charged particles called ions. Powerful electric fields then accelerated these ions and expelled them through the thruster, producing a gentle but continuous thrust that pushed the spacecraft forward.",
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

export default function DeepSpace() {
  const caption = useNarrations(NARRATIONS)

  return (
    <>
      <Galaxy />
      <Surface world={WORLD} />
      <div className={`caption${caption ? ' caption--on' : ''}`} role="status" aria-live="polite">
        <span className="caption__text">{caption}</span>
      </div>
      {CHAPTERS.deepSpace.map((title, i) => (
        <Chapter key={i} index={i} title={title} world={WORLD}>
          {i === 0 && (
            <model-viewer
              class="moon__model"
              style={{ transform: 'none' }}
              src={c1Model}
              alt="James Webb Space Telescope 3D model"
              camera-controls
              touch-action="pan-y"
              interaction-prompt="none"
              auto-rotate
              disable-zoom
              disable-pan
              shadow-intensity="1"
            />
          )}
          {i === 1 && (
            <model-viewer
              class="moon__model moon__model--c2"
              style={{ bottom: 'calc(11vh - 9vh)' }}
              src={c2Model}
              alt="Voyager 1 3D model"
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
            <iframe
              className="moon__model moon__model--c3"
              style={{ border: 0, colorScheme: 'normal', width: 'min(54vw, 990px)', height: 'min(66vh, 630px)', transform: 'none', left: 'calc(64% - min(54vw, 990px) / 2)', bottom: 'calc(11vh - 6vh)' }}
              src="/deepSpaceC3.html"
              title="Kepler Space Telescope 3D model"
              allowTransparency="true"
              loading="eager"
            />
          )}
          {i === 3 && (
            <iframe
              className="moon__model moon__model--c4"
              style={{ border: 0, colorScheme: 'normal', width: 'min(54vw, 990px)', height: 'min(66vh, 630px)', transform: 'none', left: 'calc(64% - min(54vw, 990px) / 2)', bottom: 'calc(11vh - 6vh)' }}
              src="/deepSpaceC4.html"
              title="Dawn spacecraft 3D model"
              allowTransparency="true"
              loading="eager"
            />
          )}
        </Chapter>
      ))}
    </>
  )
}
