import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import confetti from 'canvas-confetti'

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

export interface SpawnedBalloon {
  id: string
  position: [number, number, number]
  scale: number
  colorIdx: number
  finish: 'satin' | 'chrome' | 'pearl'
}

function createPlushBalloonGeo(isMobile: boolean): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = []
  const steps = isMobile ? 18 : 24
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = t * Math.PI
    const r = Math.max(0.001, Math.sin(a) * (0.9 + 0.14 * Math.sin(t * Math.PI * 0.8)) * 0.92)
    const y = -Math.cos(a) * 1.08
    pts.push(new THREE.Vector2(r, y))
  }
  return new THREE.LatheGeometry(pts, isMobile ? 22 : 30)
}

interface FloatingBalloonProps {
  geometry: THREE.LatheGeometry
  position: [number, number, number]
  scale: number
  color: string
  finish: 'satin' | 'chrome' | 'pearl'
  speed: number
  rotation?: [number, number, number]
  onPop: (color: string) => void
}

function FloatingBalloon({
  geometry,
  position,
  scale,
  color,
  finish,
  speed,
  rotation = [0, 0, 0],
  onPop,
}: FloatingBalloonProps) {
  const ref = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const popAnim = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    const dt = Math.min(delta, 0.05)
    if (popAnim.current > 0.001) {
      popAnim.current = THREE.MathUtils.lerp(popAnim.current, 0, dt * 5.5)
      ref.current.rotation.y += dt * 4.5 * popAnim.current
    }
    const target = scale * (hovered ? 1.08 : 1) * (1 + Math.sin(popAnim.current * Math.PI) * 0.24)
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, target, dt * 8))
  })

  const matProps = useMemo(() => {
    if (finish === 'chrome') {
      return { color, metalness: 0.74, roughness: 0.15, clearcoat: 0.92, clearcoatRoughness: 0.09 }
    }
    if (finish === 'pearl') {
      return { color, metalness: 0.08, roughness: 0.24, clearcoat: 0.8, clearcoatRoughness: 0.15 }
    }
    return { color, metalness: 0.02, roughness: 0.2, clearcoat: 0.9, clearcoatRoughness: 0.11 }
  }, [color, finish])

  return (
    <Float speed={speed} rotationIntensity={0.14} floatIntensity={0.3}>
      <group
        ref={ref}
        position={position}
        rotation={rotation}
        scale={scale}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          popAnim.current = 1
          onPop(color)
        }}
      >
        <mesh geometry={geometry}>
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        <mesh position={[0, -1.1, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.095, 0.13, 12]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
      </group>
    </Float>
  )
}

function InteractiveBalloonStage({
  mood,
  isMobile,
  spawned,
  onPop,
}: {
  mood: BalloonMood
  isMobile: boolean
  spawned: SpawnedBalloon[]
  onPop: (color: string) => void
}) {
  const rootRef = useRef<THREE.Group>(null)
  const balloonGeo = useMemo(() => createPlushBalloonGeo(isMobile), [isMobile])
  const [c1, c2, c3, c4, c5] = mood.swatches

  useFrame((state, delta) => {
    if (!rootRef.current) return
    const dt = Math.min(delta, 0.05)
    const targetY = isMobile
      ? Math.sin(state.clock.elapsedTime * 0.55) * 0.12 + state.pointer.x * 0.18
      : state.pointer.x * 0.18
    const targetX = isMobile ? -state.pointer.y * 0.08 : -state.pointer.y * 0.1
    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetY, dt * 2.6)
    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetX, dt * 2.6)
  })

  return (
    <group ref={rootRef}>
      {/* Sculpted non-overlapping centerpiece balloons (every pair has clean clearance!) */}
      <FloatingBalloon
        geometry={balloonGeo}
        position={[0.0, 0.35, 0.3]}
        scale={isMobile ? 1.02 : 1.12}
        color={c1}
        finish="satin"
        speed={1.35}
        rotation={[0.04, 0, -0.06]}
        onPop={onPop}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[1.95, 1.15, -0.35]}
        scale={isMobile ? 0.84 : 0.94}
        color={c2}
        finish="satin"
        speed={1.6}
        rotation={[-0.04, 0.18, 0.1]}
        onPop={onPop}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[-1.95, 1.05, -0.45]}
        scale={isMobile ? 0.8 : 0.88}
        color={c3}
        finish="pearl"
        speed={1.25}
        rotation={[0.04, 0, -0.12]}
        onPop={onPop}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[1.85, -1.25, 0.35]}
        scale={isMobile ? 0.66 : 0.72}
        color={c5}
        finish="chrome"
        speed={1.8}
        rotation={[0, 0, 0.12]}
        onPop={onPop}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[-1.75, -1.25, 0.45]}
        scale={isMobile ? 0.62 : 0.68}
        color={c4}
        finish="satin"
        speed={1.65}
        rotation={[0.05, 0, -0.1]}
        onPop={onPop}
      />

      {/* Extra user-spawned interactive balloons */}
      {spawned.map((b) => (
        <FloatingBalloon
          key={b.id}
          geometry={balloonGeo}
          position={b.position}
          scale={b.scale}
          color={mood.swatches[b.colorIdx % mood.swatches.length]}
          finish={b.finish}
          speed={1.9}
          onPop={onPop}
        />
      ))}

      {/* Soft gold decorative ring cleanly behind */}
      <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.18}>
        <mesh position={[0, 0.1, -1.75]} rotation={[0.08, -0.15, 0]}>
          <torusGeometry args={[2.35, 0.028, 12, 68]} />
          <meshPhysicalMaterial color="#E5C691" metalness={0.82} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  )
}

interface Hero3DSceneProps {
  mood: BalloonMood
  spawned: SpawnedBalloon[]
  onBalloonPop?: () => void
}

export default function Hero3DScene({ mood, spawned, onBalloonPop }: Hero3DSceneProps) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const handlePop = (color: string) => {
    onBalloonPop?.()
    confetti({
      particleCount: isMobile ? 16 : 24,
      spread: 56,
      origin: { y: isMobile ? 0.62 : 0.48, x: isMobile ? 0.5 : 0.68 },
      colors: [color, '#FDEBED', '#162A4C', '#DFBE8A'],
      scalar: 0.78,
      ticks: 90,
    })
  }

  return (
    <Canvas
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [0, 0, isMobile ? 7.6 : 7.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.96} />
      <directionalLight position={[6, 8, 6]} intensity={1.25} color="#FFF9F7" />
      <directionalLight position={[-6, 2, 5]} intensity={0.72} color="#FDEBED" />
      <pointLight position={[0, -4, 4]} intensity={0.45} color="#F3B6C1" />

      <Environment resolution={isMobile ? 64 : 128}>
        <Lightformer form="ring" intensity={2.1} position={[0, 6, 4]} scale={10} color="#FFFFFF" />
        <Lightformer form="circle" intensity={1.8} position={[-6, 2, 4]} scale={6} color="#FDEBED" />
        <Lightformer form="rect" intensity={1.5} position={[6, 3, 2]} scale={[6, 8, 1]} color="#FFF4E6" />
      </Environment>

      <InteractiveBalloonStage
        mood={mood}
        isMobile={isMobile}
        spawned={spawned}
        onPop={handlePop}
      />
    </Canvas>
  )
}
