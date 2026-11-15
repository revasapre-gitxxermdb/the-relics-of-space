import marsImg from '../../assets/Marse-round.png'
import marsSurfaceImg from '../../assets/marsSurface.png'
import { CHAPTERS } from '../../data/chapters'
import Chapter from '../../components/World/Chapter'
import Surface from '../../components/World/Surface'

const WORLD = { key: 'mars', name: 'Mars', img: marsImg }

export default function Mars() {
  return (
    <>
      <Surface world={WORLD} groundImg={marsSurfaceImg} />
      {CHAPTERS.mars.map((title, i) => (
        <Chapter key={i} index={i} title={title} world={WORLD} />
      ))}
    </>
  )
}
