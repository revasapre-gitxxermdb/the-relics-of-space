import './Navbar.css'

export default function Navbar({ route }) {
  return (
    <nav className="navbar" aria-label="Main">
      <a
        className="navbar__btn"
        href="#/"
        aria-current={route === 'home' ? 'page' : undefined}
      >
        Home
      </a>
      <a
        className="navbar__btn navbar__btn--timeline"
        href="#/timeline"
        aria-current={route === 'timeline' ? 'page' : undefined}
      >
        Timeline
      </a>
    </nav>
  )
}
