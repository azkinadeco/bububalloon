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

function createPlushBalloonGeo(isMobile: boolean): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = []
  const steps = isMobile ? 16 : 22
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = t * Math.PI
    const r = Math.max(0.001, Math.sin(a) * (0.9 + 0.14 * Math.sin(t * Math.PI * 0.8)) * 0.92)
    const y = -Math.cos(a) * 1.08
    pts.push(new THREE.Vector2(r, y))
  }
  return new THREE.LatheGeometry(pts, isMobile ? 20 : 28)
}

interface FloatingBalloonProps {
  geometry: THREE.LatheGeometry
  position: [number, number, number]
  scale: number
  color: string
  finish: 'satin' | 'chrome' | 'pearl'
  speed: number
  rotation?: [number, number, number]
  onPop?: (color: string) => void
  interactive: boolean
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
  interactive,
}: FloatingBalloonProps) {
  const ref = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const popAnim = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current) return
    const dt = Math.min(delta, 0.05)
    if (popAnim.current > 0.001) {
      popAnim.current = THREE.MathUtils.lerp(popAnim.current, 0, dt * 6)
    }
    const target = scale * (hovered ? 1.07 : 1) * (1 + Math.sin(popAnim.current * Math.PI) * 0.18)
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, target, dt * 7))
  })

  const matProps = useMemo(() => {
    if (finish === 'chrome') {
      return { color, metalness: 0.72, roughness: 0.16, clearcoat: 0.9, clearcoatRoughness: 0.1 }
    }
    if (finish === 'pearl') {
      return { color, metalness: 0.08, roughness: 0.26, clearcoat: 0.78, clearcoatRoughness: 0.16 }
    }
    return { color, metalness: 0.02, roughness: 0.22, clearcoat: 0.88, clearcoatRoughness: 0.12 }
  }, [color, finish])

  return (
    <Float speed={speed} rotationIntensity={0.12} floatIntensity={0.28}>
      <group
        ref={ref}
        position={position}
        rotation={rotation}
        scale={scale}
        onPointerOver={
          interactive
            ? (e) => {
                e.stopPropagation()
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            : undefined
        }
        onPointerOut={
          interactive
            ? () => {
                setHovered(false)
                document.body.style.cursor = 'auto'
              }
            : undefined
        }
        onClick={
          interactive
            ? (e) => {
                e.stopPropagation()
                popAnim.current = 1
                onPop?.(color)
              }
            : undefined
        }
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

function SeamlessScene({
  mood,
  isMobile,
  onPop,
}: {
  mood: BalloonMood
  isMobile: boolean
  onPop: (color: string) => void
}) {
  const rootRef = useRef<THREE.Group>(null)
  const balloonGeo = useMemo(() => createPlushBalloonGeo(isMobile), [isMobile])
  const [c1, c2, c3, c4, c5] = mood.swatches

  useFrame((state, delta) => {
    if (!rootRef.current) return
    const dt = Math.min(delta, 0.05)
    if (isMobile) {
      // Gentle autonomous breathing sway on iPhone (zero touch/pointer overhead)
      rootRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.08
      return
    }
    rootRef.current.rotation.y = THREE.MathUtils.lerp(
      rootRef.current.rotation.y,
      state.pointer.x * 0.12,
      dt * 2.2
    )
    rootRef.current.rotation.x = THREE.MathUtils.lerp(
      rootRef.current.rotation.x,
      -state.pointer.y * 0.08,
      dt * 2.2
    )
  })

  if (isMobile) {
    // Precision iPhone portrait composition — frames the upper area cleanly with zero overlap!
    return (
      <group ref={rootRef}>
        <FloatingBalloon
          geometry={balloonGeo}
          position={[1.35, 1.85, 0.1]}
          scale={0.86}
          color={c1}
          finish="satin"
          speed={1.25}
          rotation={[0.04, 0, -0.08]}
          interactive={false}
        />
        <FloatingBalloon
          geometry={balloonGeo}
          position={[-1.45, 2.25, -0.6]}
          scale={0.72}
          color={c2}
          finish="satin"
          speed={1.45}
          rotation={[-0.03, 0.1, 0.1]}
          interactive={false}
        />
        <FloatingBalloon
          geometry={balloonGeo}
          position={[0.05, 2.75, -1.35]}
          scale={0.62}
          color={c3}
          finish="pearl"
          speed={1.15}
          interactive={false}
        />
        <FloatingBalloon
          geometry={balloonGeo}
          position={[1.75, -1.65, -0.8]}
          scale={0.58}
          color={c5}
          finish="chrome"
          speed={1.55}
          interactive={false}
        />
        <FloatingBalloon
          geometry={balloonGeo}
          position={[-1.55, -1.85, -1.1]}
          scale={0.52}
          color={c4}
          finish="satin"
          speed={1.35}
          interactive={false}
        />
      </group>
    )
  }

  return (
    <group ref={rootRef}>
      {/* Desktop non-overlapping hero balloons */}
      <FloatingBalloon
        geometry={balloonGeo}
        position={[2.15, 0.35, 0.3]}
        scale={1.08}
        color={c1}
        finish="satin"
        speed={1.3}
        rotation={[0.04, 0, -0.08]}
        onPop={onPop}
        interactive={true}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[4.55, 1.35, -0.4]}
        scale={0.95}
        color={c2}
        finish="satin"
        speed={1.55}
        rotation={[-0.04, 0.18, 0.1]}
        onPop={onPop}
        interactive={true}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[0.65, 2.05, -1.1]}
        scale={0.78}
        color={c3}
        finish="pearl"
        speed={1.2}
        rotation={[0.04, 0, -0.12]}
        onPop={onPop}
        interactive={true}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[4.65, -1.25, 0.45]}
        scale={0.74}
        color={c5}
        finish="chrome"
        speed={1.75}
        rotation={[0, 0, 0.12]}
        onPop={onPop}
        interactive={true}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[1.95, -1.85, 0.75]}
        scale={0.62}
        color={c4}
        finish="satin"
        speed={1.65}
        rotation={[0.05, 0, -0.1]}
        onPop={onPop}
        interactive={true}
      />

      {/* Ambient distant left-side balloons */}
      <FloatingBalloon
        geometry={balloonGeo}
        position={[-4.85, 1.75, -2.4]}
        scale={0.78}
        color={c1}
        finish="pearl"
        speed={1.15}
        rotation={[0, 0, 0.14]}
        onPop={onPop}
        interactive={true}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[-4.2, -1.85, -2.0]}
        scale={0.6}
        color={c5}
        finish="chrome"
        speed={1.45}
        rotation={[0, 0, -0.1]}
        onPop={onPop}
        interactive={true}
      />

      <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.2}>
        <mesh position={[3.0, 0.15, -2.1]} rotation={[0.08, -0.18, 0]}>
          <torusGeometry args={[2.6, 0.024, 12, 72]} />
          <meshPhysicalMaterial color="#E5C691" metalness={0.82} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  )
}

interface Hero3DSceneProps {
  mood: BalloonMood
  onBalloonPop?: () => void
}

export default function Hero3DScene({ mood, onBalloonPop }: Hero3DSceneProps) {
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
      particleCount: 22,
      spread: 56,
      origin: { y: 0.45, x: 0.7 },
      colors: [color, '#FDEBED', '#162A4C', '#DFBE8A'],
      scalar: 0.8,
      ticks: 95,
    })
  }

  return (
    <Canvas
      dpr={isMobile ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, isMobile ? 9.2 : 8.6], fov: isMobile ? 42 : 36 }}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', pointerEvents: isMobile ? 'none' : 'auto' }}
    >
      <ambientLight intensity={0.96} />
      <directionalLight position={[6, 8, 6]} intensity={1.25} color="#FFF9F7" />
      <directionalLight position={[-6, 2, 5]} intensity={0.7} color="#FDEBED" />
      {!isMobile && <pointLight position={[2, -4, 4]} intensity={0.48} color="#F3B6C1" />}

      <Environment resolution={isMobile ? 64 : 128}>
        <Lightformer form="ring" intensity={2.1} position={[0, 6, 4]} scale={10} color="#FFFFFF" />
        <Lightformer form="circle" intensity={1.8} position={[-6, 2, 4]} scale={6} color="#FDEBED" />
        <Lightformer form="rect" intensity={1.5} position={[6, 3, 2]} scale={[6, 8, 1]} color="#FFF4E6" />
      </Environment>

      <SeamlessScene mood={mood} isMobile={isMobile} onPop={handlePop} />
    </Canvas>
  )
}
