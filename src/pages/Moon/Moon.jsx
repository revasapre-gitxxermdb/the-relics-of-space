import moonImg from '../../assets/Moon-round.png'
import moonSurfaceImg from '../../assets/moonSurface.png'
import '@google/model-viewer'
import c1Model from '../../assets/moon/c1.glb'
import { CHAPTERS } from '../../data/chapters'
import Chapter from '../../components/World/Chapter'
import Surface from '../../components/World/Surface'

const WORLD = { key: 'moon', name: 'Moon', img: moonImg }

export default function Moon() {
  return (
    <>
      <Surface world={WORLD} groundImg={moonSurfaceImg} />
      {CHAPTERS.moon.map((title, i) => (
        <Chapter key={i} index={i} title={title} world={WORLD}>
          {i === 0 && (
            <model-viewer
              class="moon__model"
              src={c1Model}
              alt="Moon 3D model"
              autoplay
              camera-controls
              touch-action="pan-y"
              interaction-prompt="none"
              camera-orbit="55deg 78deg auto"
              disable-zoom
              disable-pan
              min-polar-angle="0deg"
              max-polar-angle="180deg"
              shadow-intensity="1"
            />
          )}
        </Chapter>
      ))}
    </>
  )
}
