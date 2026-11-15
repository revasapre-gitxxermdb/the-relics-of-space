import deepSpaceImg from '../../assets/Deepspace.png'
import { CHAPTERS } from '../../data/chapters'
import Chapter from '../../components/World/Chapter'
import Surface from '../../components/World/Surface'
import Galaxy from '../../components/World/Galaxy'

const WORLD = { key: 'deepspace', name: 'Deep Space', img: deepSpaceImg }

export default function DeepSpace() {
  return (
    <>
      <Galaxy />
      <Surface world={WORLD} />
      {CHAPTERS.deepSpace.map((title, i) => (
        <Chapter key={i} index={i} title={title} world={WORLD} />
      ))}
    </>
  )
}
