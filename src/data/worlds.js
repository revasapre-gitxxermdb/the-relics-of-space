import moonImg from '../assets/Moon-round.png'
import marsImg from '../assets/Marse-round.png'
import deepSpaceImg from '../assets/Deepspace.png'

export const WORLDS = [
  { name: 'Moon', src: moonImg, to: '#/moon' },
  { name: 'Mars', src: marsImg, featured: true, to: '#/mars' },
  { name: 'Deep Space', src: deepSpaceImg, flat: true, to: '#/deepspace' },
]
