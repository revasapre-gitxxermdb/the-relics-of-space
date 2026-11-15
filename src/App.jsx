import './App.css'
import useHashRoute from './hooks/useHashRoute'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Timeline from './pages/Timeline/Timeline'
import Moon from './pages/Moon/Moon'
import Mars from './pages/Mars/Mars'
import DeepSpace from './pages/DeepSpace/DeepSpace'

const PAGES = { timeline: Timeline, moon: Moon, mars: Mars, deepspace: DeepSpace }

export default function App() {
  const route = useHashRoute()
  const Page = PAGES[route] ?? Home
  return (
    <div className={`page${route in PAGES ? ' page--black' : ''}`}>
      <div className="page__bg" aria-hidden="true" />
      <Navbar route={route} />
      <div className="page__view" key={route}>
        <Page />
      </div>
    </div>
  )
}
