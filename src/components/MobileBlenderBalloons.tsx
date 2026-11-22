import { useEffect, useRef, useState } from 'react'
import type { BalloonMood, PopBurstEvent } from './heroMoods'

const TAP_WORDS = ['Bloop!', 'Boop!', 'Pop!', 'Paw!']
const BOOM_WORDS = ['PAW!', 'BLOOP!', 'POP!']

// Photorealistic, zero-grain Blender Cycles 3D balloon renders
const MOOD_BLENDER_SPRITES: Record<string, [string, string, string, string, string]> = {
  bubu: [
    '/balloons/blush.png',
    '/balloons/navy.png',
    '/balloons/pearl.png',
    '/balloons/rose.png',
    '/balloons/gold.png',
  ],
  champagne: [
    '/balloons/gold.png',
    '/balloons/pearl.png',
    '/balloons/blush.png',
    '/balloons/gold.png',
    '/balloons/pearl.png',
  ],
  pastel: [
    '/balloons/sky.png',
    '/balloons/butter.png',
    '/balloons/blush.png',
    '/balloons/lilac.png',
    '/balloons/pearl.png',
  ],
  velvet: [
    '/balloons/rose.png',
    '/balloons/blush.png',
    '/balloons/velvet.png',
    '/balloons/gold.png',
    '/balloons/pearl.png',
  ],
}

interface BalloonSlot {
  id: number
  left: string
  top: string
  width: string
  rotate: number
  duration: string
  delay: string
  zIndex: number
}

// Balanced Dribbble-style 5-balloon composition tailored for iPhone portrait
const MOBILE_SLOTS: BalloonSlot[] = [
  { id: 0, left: '50%', top: '27%', width: '40vw', rotate: -5, duration: '4.4s', delay: '0s', zIndex: 5 },
  { id: 1, left: '78%', top: '16%', width: '33vw', rotate: 10, duration: '5.0s', delay: '-1.2s', zIndex: 4 },
  { id: 2, left: '21%', top: '18%', width: '31vw', rotate: -11, duration: '4.7s', delay: '-2.1s', zIndex: 3 },
  { id: 3, left: '80%', top: '39%', width: '25vw', rotate: 12, duration: '4.1s', delay: '-0.8s', zIndex: 2 },
  { id: 4, left: '19%', top: '39%', width: '24vw', rotate: -10, duration: '4.3s', delay: '-1.7s', zIndex: 2 },
]

interface InteractiveBlenderBalloonProps {
  slot: BalloonSlot
  src: string
  color: string
  onPopBurst?: (ev: PopBurstEvent) => void
}

function InteractiveBlenderBalloon({
  slot,
  src,
  color,
  onPopBurst,
}: InteractiveBlenderBalloonProps) {
  const [tapCount, setTapCount] = useState(0)
  const [popped, setPopped] = useState(false)
  const [squish, setSquish] = useState(false)
  const respawnRef = useRef<number | null>(null)
  const squishRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (respawnRef.current) window.clearTimeout(respawnRef.current)
      if (squishRef.current) window.clearTimeout(squishRef.current)
    }
  }, [])

  const handleTap = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (popped) return

    const nextTap = tapCount + 1
    const cx = e.clientX
    const cy = e.clientY

    if (nextTap >= 10) {
      setPopped(true)
      setTapCount(0)
      onPopBurst?.({
        id: Date.now() + Math.random(),
        word: BOOM_WORDS[Math.floor(Math.random() * BOOM_WORDS.length)],
        x: cx,
        y: cy,
        color,
        isExplode: true,
        tapNum: 10,
      })
      if (respawnRef.current) window.clearTimeout(respawnRef.current)
      respawnRef.current = window.setTimeout(() => {
        setPopped(false)
        setSquish(true)
        squishRef.current = window.setTimeout(() => setSquish(false), 180)
      }, 5000)
    } else {
      setTapCount(nextTap)
      setSquish(true)
      if (squishRef.current) window.clearTimeout(squishRef.current)
      squishRef.current = window.setTimeout(() => setSquish(false), 160)
      onPopBurst?.({
        id: Date.now() + Math.random(),
        word: TAP_WORDS[(nextTap - 1) % TAP_WORDS.length],
        x: cx,
        y: cy,
        color,
        isExplode: false,
        tapNum: nextTap,
      })
    }
  }

  const tensionScale = 1 + tapCount * 0.026
  const activeScale = popped ? 0.02 : squish ? tensionScale * 1.16 : tensionScale

  return (
    <div
      style={{
        left: slot.left,
        top: slot.top,
        width: slot.width,
        maxWidth: '172px',
        zIndex: slot.zIndex,
        transform: 'translate3d(-50%, -50%, 0)',
      }}
      className="absolute pointer-events-auto select-none"
    >
      {/* Pure CoreAnimation GPU CSS float (0% JS main-thread CPU, locked 60-120fps on iPhone!) */}
      <div
        className="bubu-balloon-float"
        style={{
          animationDuration: slot.duration,
          animationDelay: slot.delay,
        }}
      >
        <button
          type="button"
          aria-label="Ketuk Balon 3D"
          onPointerDown={handleTap}
          style={{
            transform: `rotate(${slot.rotate + (squish ? 6 : 0)}deg) scale(${activeScale})`,
            opacity: popped ? 0 : 1,
            pointerEvents: popped ? 'none' : 'auto',
            transition: popped
              ? 'transform 130ms ease-in, opacity 130ms ease-in'
              : 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 240ms ease-out',
          }}
          className="w-full aspect-[340/440] cursor-pointer focus:outline-none touch-manipulation will-change-transform [-webkit-tap-highlight-color:transparent]"
        >
          <img
            src={src}
            alt="Bubu 3D Balloon"
            draggable={false}
            decoding="async"
            className="w-full h-full object-contain select-none pointer-events-none"
          />
        </button>
      </div>
    </div>
  )
}

interface MobileBlenderBalloonsProps {
  mood: BalloonMood
  onPopBurst?: (ev: PopBurstEvent) => void
}

export function MobileBlenderBalloons({ mood, onPopBurst }: MobileBlenderBalloonsProps) {
  const sprites = MOOD_BLENDER_SPRITES[mood.id] ?? MOOD_BLENDER_SPRITES.bubu

  return (
    <div className="relative w-full h-full overflow-hidden">
      {MOBILE_SLOTS.map((slot, i) => (
        <InteractiveBlenderBalloon
          key={slot.id}
          slot={slot}
          src={sprites[i]}
          color={mood.swatches[i]}
          onPopBurst={onPopBurst}
        />
      ))}
    </div>
  )
}
