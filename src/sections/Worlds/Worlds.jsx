import Ball from '../../components/Ball/Ball'
import { WORLDS } from '../../data/worlds'
import './Worlds.css'

export default function Worlds() {
  return (
    <section className="worlds" id="experience">
      <div className="worlds__row">
        {WORLDS.map((w, i) => (
          <figure key={w.name} className={`world ${w.featured ? 'world--main' : ''}`}>
            <Ball src={w.src} name={w.name} delay={i * -1.7} flat={w.flat} to={w.to} />
            <figcaption>
              <a className="world__name" href={w.to || '#/timeline'}>{w.name}</a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
