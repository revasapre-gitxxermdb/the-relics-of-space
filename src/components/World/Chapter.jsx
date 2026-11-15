import { useEffect, useRef, useState } from 'react'
import { CHAPTERS, CHAPTER_INFO } from '../../data/chapters'
import { slideTo } from '../../utils/slideScroll'
import lroImg from '../../assets/Timeline/LRO.webp'
import capstoneImg from '../../assets/Timeline/imageCAPSTONE.webp'
import apolloImg from '../../assets/moreInfo/apollo 11.webp'
import surveyorVideo from '../../assets/moreInfo/surveyor.m4v.mp4'
import perseveranceImg from '../../assets/Timeline/PRESERVARANCE ROVER.webp'
import helicopterImg from '../../assets/Timeline/HELICOPTER (1).webp'
import curiosityImg from '../../assets/Timeline/CURIOSITY.webp'
import sojournerImg from '../../assets/Timeline/Sojourner_on_Mars_PIA01122.webp'
import webbImg from '../../assets/Timeline/JAMES WEBB SPACE TELESCOPE (1).webp'
import voyagerImg from '../../assets/Timeline/voyager.webp'
import keplerImg from '../../assets/Timeline/kepler.webp'
import dawnImg from '../../assets/Timeline/dawn.webp'
import clickMoreImg from '../../assets/ckcikMore.png'
import '../../sections/Hero/Hero.css'
import './World.css'

const ORDER = [
  { key: 'moon', name: 'Moon', chapters: 'moon' },
  { key: 'mars', name: 'Mars', chapters: 'mars' },
  { key: 'deepspace', name: 'Deep Space', chapters: 'deepSpace' },
]

// Per-chapter popup images; chapters not listed fall back to the world image.
const CHAPTER_IMG = { moon: [lroImg, capstoneImg, apolloImg, surveyorVideo], mars: [perseveranceImg, curiosityImg, helicopterImg, sojournerImg], deepspace: [webbImg, voyagerImg, keplerImg, dawnImg] }
const isVideo = (src) => typeof src === 'string' && /\.(mp4|m4v|webm)(\?|$)/.test(src)

// One scroll chapter: animated title, plus a "surface spacer" screen that can
// hold page-specific content (e.g. the Moon's 3D model) via children.
export default function Chapter({ index, title, world, children }) {
  let titleIndex = 0
  const pos = ORDER.findIndex((w) => w.key === world.key)
  const isLast = index === CHAPTERS[ORDER[pos].chapters].length - 1
  const prev = ORDER[pos - 1]
  const next = ORDER[pos + 1]
  const rootRef = useRef(null)
  const surfaceRef = useRef(null)

  // Hold the entrance animations until the chapter scrolls into view.
  useEffect(() => {
    const el = rootRef.current
    if (index === 0 || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add('is-visible')
        io.disconnect()
      }
    }, { threshold: 0.4 })
    io.observe(el.firstElementChild)
    return () => io.disconnect()
  }, [index])

  // "Click for More" is fixed on screen, but only shown once the visitor has
  // scrolled past the very first title slide.
  const [showMore, setShowMore] = useState(false)
  useEffect(() => {
    const update = () => {
      const r = surfaceRef.current?.getBoundingClientRect()
      const mid = window.innerHeight * 0.5
      setShowMore(!!r && r.top <= mid && r.bottom > mid)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [index])

  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  const media = CHAPTER_IMG[world.key]?.[index]
  const info = CHAPTER_INFO[ORDER[pos].chapters]?.[index]

  // First chapter only: glide down once the title has animated in.
  // Cancelled if the visitor scrolls or interacts first.
  useEffect(() => {
    if (index !== 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cancel = () => clearTimeout(timer)
    const timer = setTimeout(() => {
      if (surfaceRef.current) slideTo(surfaceRef.current.getBoundingClientRect().top + window.scrollY)
    }, 4200)
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown']
    events.forEach((e) => window.addEventListener(e, cancel, { passive: true }))
    return () => {
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, cancel))
    }
  }, [index])

  return (
    <div className={`chapter chapter--${world.key}`} ref={rootRef}>
      <section className="moon">
        {index === 0 && <img className="moon__img" src={world.img} alt={world.name} />}
        <p className="moon__chapter">Chapter {index + 1}</p>
        <h1 className="hero__title moon__title" aria-label={title}>
          {title.split(' ').map((word, wi) => (
            <span className="hero__word" key={wi} aria-hidden="true">
              {[...word].map((ch, ci) => (
                <span className="hero__char" key={ci} style={{ '--i': titleIndex++ }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <span className="hero__rule" aria-hidden="true" />
        {index === 0 && <a className="moon__back" href="#/">← Back</a>}
      </section>
      <section className="surface-spacer" ref={surfaceRef} aria-hidden={!children}>
        {children}
        <button type="button" className={`click-more${showMore ? ' click-more--on' : ''}`} aria-label="Click for more" onClick={() => setOpen(true)}>
          <img className="click-more__img" src={clickMoreImg} alt="" />
          <span className="click-more__text">Click for More</span>
        </button>
        {open && (
          <div className="info-modal" role="dialog" aria-modal="true" aria-label={title} onClick={() => setOpen(false)}>
            <div className="info-modal__wrap" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="info-modal__close" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
              <div className="info-modal__box">
              <div className="info-modal__media">
                {isVideo(media) ? (
                  <video className="info-modal__img" src={media} autoPlay loop muted playsInline controls />
                ) : (
                  <img className="info-modal__img" src={media ?? world.img} alt={media ? title : world.name} />
                )}
              </div>
              <div className="info-modal__body">
                <h2 className="info-modal__title">{title}</h2>
                <p className="info-modal__text">{info}</p>
              </div>
              </div>
            </div>
          </div>
        )}
        {isLast && (
          <nav className="world-nav" aria-label="Change world">
            <a className="world-nav__btn" href={prev ? `#/${prev.key}` : '#/'}>
              ← Back{prev ? ` to ${prev.name}` : ' Home'}
            </a>
            {next && (
              <a className="world-nav__btn world-nav__btn--next" href={`#/${next.key}`}>
                Next: {next.name} →
              </a>
            )}
          </nav>
        )}
      </section>
    </div>
  )
}
