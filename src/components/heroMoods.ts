export interface BalloonMood {
  id: string
  label: string
  swatches: [string, string, string, string, string]
}

export const BALLOON_MOODS: BalloonMood[] = [
  {
    id: 'bubu',
    label: 'Bubu Blush',
    swatches: ['#F3B6C1', '#1A3056', '#FFF8F9', '#E58FA2', '#E5C691'],
  },
  {
    id: 'champagne',
    label: 'Champagne',
    swatches: ['#E5C691', '#FFF9F2', '#F5CBD3', '#C99B63', '#FFFFFF'],
  },
  {
    id: 'pastel',
    label: 'Pastel Sky',
    swatches: ['#BEDCF2', '#F9E8B8', '#F4C2CE', '#D9CCF2', '#FFFDFC'],
  },
  {
    id: 'velvet',
    label: 'Rose Velvet',
    swatches: ['#D98395', '#FCE4E8', '#8F4F65', '#E5C691', '#FFFDFC'],
  },
]

export interface PopBurstEvent {
  id: number
  word: string
  x: number
  y: number
  color: string
  isExplode: boolean
  tapNum: number
}
