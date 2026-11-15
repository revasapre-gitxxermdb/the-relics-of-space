import { useEffect, useRef } from 'react'
import Galaxy from '../../components/World/Galaxy'
import './Timeline.css'

import surveyor from '../../assets/Timeline/surveyor 3.webp'
import apollo from '../../assets/Timeline/apollo11_lem_big.webp'
import voyager from '../../assets/Timeline/voyager.webp'
import sojourner from '../../assets/Timeline/Sojourner_on_Mars_PIA01122.webp'
import dawn from '../../assets/Timeline/dawn.webp'
import lro from '../../assets/Timeline/LRO.webp'
import kepler from '../../assets/Timeline/kepler.webp'
import curiosity from '../../assets/Timeline/CURIOSITY.webp'
import perseverance from '../../assets/Timeline/PRESERVARANCE ROVER.webp'
import helicopter from '../../assets/Timeline/HELICOPTER (1).webp'
import jwst from '../../assets/Timeline/JAMES WEBB SPACE TELESCOPE (1).webp'
import capstone from '../../assets/Timeline/imageCAPSTONE.webp'

const EVENTS = [
  { year: '1967', world: 'Moon', title: 'Surveyor 3', img: surveyor, text: 'A robotic lander scooped lunar soil and tested the surface that astronauts would soon walk on.' },
  { year: '1969', world: 'Moon', title: 'Apollo 11 Lunar Module', img: apollo, text: 'Eagle touched down in the Sea of Tranquility, and humanity took its first steps on another world.' },
  { year: '1977', world: 'Deep Space', title: 'Voyager', img: voyager, text: 'Twin probes began a grand tour of the outer planets and later became the first to enter interstellar space.' },
  { year: '1997', world: 'Mars', title: 'Sojourner', img: sojourner, text: 'The first rover to roam Mars, a microwave-sized pioneer that proved wheeled exploration was possible.' },
  { year: '2007', world: 'Asteroid Belt', title: 'Dawn', img: dawn, text: 'The first mission to orbit two worlds, studying the giant asteroid Vesta and the dwarf planet Ceres.' },
  { year: '2009', world: 'Moon', title: 'Lunar Reconnaissance Orbiter', img: lro, text: 'Mapping the Moon in stunning detail, revealing landing sites, hidden ice, and future base candidates.' },
  { year: '2009', world: 'Deep Space', title: 'Kepler', img: kepler, text: 'A planet-hunting telescope that showed our galaxy is full of worlds beyond our solar system.' },
  { year: '2012', world: 'Mars', title: 'Curiosity', img: curiosity, text: 'A car-sized rover that found Mars once had the right conditions to support microbial life.' },
  { year: '2021', world: 'Mars', title: 'Perseverance', img: perseverance, text: 'Exploring Jezero Crater, collecting rock samples that may hold signs of ancient life.' },
  { year: '2021', world: 'Mars', title: 'Ingenuity Helicopter', img: helicopter, text: 'The first powered, controlled flight on another planet, a Wright brothers moment for Mars.' },
  { year: '2021', world: 'Deep Space', title: 'James Webb Space Telescope', img: jwst, text: 'Peering back to the dawn of the first galaxies with its giant golden mirror in infrared light.' },
  { year: '2022', world: 'Moon', title: 'CAPSTONE', img: capstone, text: 'A tiny CubeSat testing the lunar orbit planned for the Gateway station and Artemis missions.' },
]

export default function Timeline() {
  const root = useRef(null)

  useEffect(() => {
    const section = root.current
    const items = section.querySelectorAll('.tl__item')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.2 }
    )
    items.forEach((el) => io.observe(el))

    const list = section.querySelector('.tl__list')
    const onScroll = () => {
      const r = list.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height))
      list.style.setProperty('--progress', `${p * 100}%`)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <Galaxy sparkle />
      <section className="timeline" aria-label="Timeline" ref={root}>
        <header className="tl__head">
          <p className="tl__eyebrow">Relics of Space</p>
          <h1 className="timeline__title">Timeline of Exploration</h1>
          <p className="tl__sub">From the first robotic landers to the telescopes that look back at the dawn of time.</p>
        </header>

        <ol className="tl__list">
          {EVENTS.map((ev, i) => (
            <li key={ev.title} className={`tl__item ${i % 2 ? 'tl__item--right' : 'tl__item--left'}`}>
              <span className="tl__node" aria-hidden="true" />
              <span className="tl__year">{ev.year}</span>
              <article className="tl__card">
                <div className="tl__img">
                  <img src={ev.img} alt={ev.title} loading="lazy" />
                </div>
                <div className="tl__body">
                  <span className="tl__tag">{ev.world}</span>
                  <h2>{ev.title}</h2>
                  <p>{ev.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
