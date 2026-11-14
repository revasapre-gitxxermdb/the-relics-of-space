import { useEffect, useState } from 'react'

const ROUTES = ['timeline', 'moon', 'mars', 'deepspace']
const get = () => {
  const r = window.location.hash.replace(/^#\/?/, '')
  return ROUTES.includes(r) ? r : 'home'
}

export default function useHashRoute() {
  const [route, setRoute] = useState(get)
  useEffect(() => {
    const onHash = () => {
      setRoute(get())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}
