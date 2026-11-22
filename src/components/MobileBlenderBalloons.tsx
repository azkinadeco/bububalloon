import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { BalloonMood, PopBurstEvent } from './heroMoods'

const TAP_WORDS = ['Bloop!', 'Boop!', 'Pop!', 'Paw!']
const BOOM_WORDS = ['PAW!', 'BLOOP!', 'POP!']

// Maps each mood to 5 photorealistic Blender Cycles-rendered 3D balloon PNGs!
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
  floatY: number
  duration: number
  zIndex: number
}

// Balanced Dribbble-style 5-balloon composition tailored for iPhone portrait viewport
const MOBILE_SLOTS: BalloonSlot[] = [
  { id: 0, left: '50%', top: '26%', width: '40vw', rotate: -5, floatY: -10, duration: 4.2, zIndex: 5 },
  { id: 1, left: '78%', top: '16%', width: '33vw', rotate: 10, floatY: -13, duration: 4.8, zIndex: 4 },
  { id: 2, left: '21%', top: '18%', width: '31vw', rotate: -11, floatY: -11, duration: 4.5, zIndex: 3 },
  { id: 3, left: '80%', top: '38%', width: '25vw', rotate: 12, floatY: -9, duration: 3.9, zIndex: 2 },
  { id: 4, left: '19%', top: '38%', width: '24vw', rotate: -10, floatY: -8, duration: 4.1, zIndex: 2 },
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
  const [bounceKey, setBounceKey] = useState(0)
  const respawnRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (respawnRef.current) window.clearTimeout(respawnRef.current)
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
        setBounceKey((k) => k + 1)
      }, 5000)
    } else {
      setTapCount(nextTap)
      setBounceKey((k) => k + 1)
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

  const tensionScale = 1 + tapCount * 0.028

  return (
    <div
      style={{
        left: slot.left,
        top: slot.top,
        width: slot.width,
        maxWidth: '175px',
        zIndex: slot.zIndex,
        transform: 'translate(-50%, -50%)',
      }}
      className="absolute pointer-events-auto select-none"
    >
      {/* Pure GPU-composited continuous gentle floating motion */}
      <motion.div
        animate={{
          y: [0, slot.floatY, 0],
          rotate: [slot.rotate - 2, slot.rotate + 2, slot.rotate - 2],
        }}
        transition={{
          duration: slot.duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.button
          key={bounceKey}
          type="button"
          aria-label="Ketuk Balon 3D"
          onPointerDown={handleTap}
          initial={
            popped
              ? { scale: tensionScale, opacity: 1 }
              : bounceKey > 0
                ? { scale: tensionScale * 1.18, rotate: 6 }
                : { scale: 0.9, opacity: 0 }
          }
          animate={
            popped
              ? { scale: 0.01, opacity: 0 }
              : { scale: tensionScale, opacity: 1, rotate: 0 }
          }
          transition={
            popped
              ? { duration: 0.14, ease: 'easeIn' }
              : { type: 'spring', stiffness: 460, damping: 16 }
          }
          className="w-full aspect-[420/540] cursor-pointer focus:outline-none touch-manipulation [-webkit-tap-highlight-color:transparent]"
          style={{ pointerEvents: popped ? 'none' : 'auto' }}
        >
          <img
            src={src}
            alt="Bubu 3D Balloon"
            draggable={false}
            decoding="async"
            className="w-full h-full object-contain drop-shadow-[0_14px_20px_rgba(22,42,76,0.14)] will-change-transform"
          />
        </motion.button>
      </motion.div>
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
