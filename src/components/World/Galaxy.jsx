import './World.css'

// Fixed galaxy backdrop used by the Deep Space and Timeline pages.
export default function Galaxy({ sparkle = false }) {
  return (
    <div className={`galaxy${sparkle ? ' galaxy--sparkle' : ''}`} aria-hidden="true">
      <div className="galaxy__stars" />
      <div className="galaxy__stars galaxy__stars--far" />
      {sparkle && <div className="galaxy__stars galaxy__stars--glint" />}
    </div>
  )
}
