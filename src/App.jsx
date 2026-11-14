import './App.css'
import useHashRoute from './hooks/useHashRoute'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Timeline from './pages/Timeline/Timeline'
import Moon from './pages/Moon/Moon'

const WORLD_ROUTES = ['moon', 'mars', 'deepspace']

export default function App() {
  const route = useHashRoute()
  return (
    <div className={`page${WORLD_ROUTES.includes(route) || route === 'timeline' ? ' page--black' : ''}`}>
      <div className="page__bg" aria-hidden="true" />
      <Navbar route={route} />
      <div className="page__view" key={route}>
        {route === 'timeline' ? <Timeline /> : WORLD_ROUTES.includes(route) ? <Moon world={route} /> : <Home />}
      </div>
    </div>
  )
}
