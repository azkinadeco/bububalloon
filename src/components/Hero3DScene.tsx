import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { Float, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import type { BalloonMood, PopBurstEvent } from './heroMoods'

export type { BalloonMood, PopBurstEvent } from './heroMoods'
export { BALLOON_MOODS } from './heroMoods'

const TAP_WORDS = ['Bloop!', 'Boop!', 'Pop!', 'Paw!']
const BOOM_WORDS = ['PAW!', 'BLOOP!', 'POP!']

function createPlushBalloonGeo(isMobile: boolean): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = []
  const steps = isMobile ? 13 : 24
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = t * Math.PI
    const r = Math.max(0.001, Math.sin(a) * (0.9 + 0.14 * Math.sin(t * Math.PI * 0.8)) * 0.92)
    const y = -Math.cos(a) * 1.08
    pts.push(new THREE.Vector2(r, y))
  }
  return new THREE.LatheGeometry(pts, isMobile ? 18 : 30)
}

interface FloatingBalloonProps {
  geometry: THREE.LatheGeometry
  position: [number, number, number]
  scale: number
  color: string
  finish: 'satin' | 'chrome' | 'pearl'
  speed: number
  isMobile: boolean
  rotation?: [number, number, number]
  onTap: (color: string, tapNum: number, clientX: number, clientY: number) => void
  onExplode: (color: string, clientX: number, clientY: number) => void
}

function FloatingBalloon({
  geometry,
  position,
  scale,
  color,
  finish,
  speed,
  isMobile,
  rotation = [0, 0, 0],
  onTap,
  onExplode,
}: FloatingBalloonProps) {
  const ref = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [popped, setPopped] = useState(false)
  const tapCountRef = useRef(0)
  const bounceRef = useRef(0)
  const respawnTimerRef = useRef<number | null>(null)
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    return () => {
      if (respawnTimerRef.current) window.clearTimeout(respawnTimerRef.current)
    }
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const dt = Math.min(delta, 0.05)

    if (popped) {
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, 0.0001, dt * 18))
      return
    }

    if (bounceRef.current > 0.001) {
      bounceRef.current = THREE.MathUtils.lerp(bounceRef.current, 0, dt * 6)
      ref.current.rotation.y += dt * 3.8 * bounceRef.current
    }

    const tensionGrow = 1 + tapCountRef.current * 0.026
    const target =
      scale *
      tensionGrow *
      (hovered ? 1.07 : 1) *
      (1 + Math.sin(bounceRef.current * Math.PI) * 0.2)

    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, target, dt * 7.5))
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

  const mobilePhongProps = useMemo(() => {
    if (finish === 'chrome') {
      return { color, specular: '#FFF7E8', shininess: 140 }
    }
    if (finish === 'pearl') {
      return { color, specular: '#FFFFFF', shininess: 95 }
    }
    return { color, specular: '#FFF4F7', shininess: 110 }
  }, [color, finish])

  const triggerPop = (cx: number, cy: number) => {
    if (popped) return
    const nextTap = tapCountRef.current + 1
    tapCountRef.current = nextTap

    if (nextTap >= 10) {
      setPopped(true)
      tapCountRef.current = 0
      onExplode(color, cx, cy)
      if (respawnTimerRef.current) window.clearTimeout(respawnTimerRef.current)
      respawnTimerRef.current = window.setTimeout(() => {
        setPopped(false)
        bounceRef.current = 1
      }, 5000)
    } else {
      bounceRef.current = 1
      onTap(color, nextTap, cx, cy)
    }
  }

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (popped) return
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY }
    if (isMobile) {
      // Instant zero-delay tactile pop on iPhone/Android!
      triggerPop(e.clientX, e.clientY)
    }
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (isMobile || popped) return
    const down = pointerDownPosRef.current
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 16) return
    triggerPop(e.clientX, e.clientY)
  }

  return (
    <Float speed={speed} rotationIntensity={0.13} floatIntensity={0.28}>
      <group
        ref={ref}
        position={position}
        rotation={rotation}
        scale={scale}
        visible={!popped || (ref.current ? ref.current.scale.x > 0.01 : true)}
        onPointerOver={(e) => {
          if (isMobile || popped) return
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          if (isMobile) return
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <mesh geometry={geometry}>
          {isMobile ? (
            <meshPhongMaterial {...mobilePhongProps} />
          ) : (
            <meshPhysicalMaterial {...matProps} />
          )}
        </mesh>
        <mesh position={[0, -1.1, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.095, 0.13, isMobile ? 8 : 12]} />
          {isMobile ? (
            <meshPhongMaterial {...mobilePhongProps} />
          ) : (
            <meshPhysicalMaterial {...matProps} />
          )}
        </mesh>
      </group>
    </Float>
  )
}

function SeamlessScene({
  mood,
  isMobile,
  onTap,
  onExplode,
}: {
  mood: BalloonMood
  isMobile: boolean
  onTap: (color: string, tapNum: number, clientX: number, clientY: number) => void
  onExplode: (color: string, clientX: number, clientY: number) => void
}) {
  const rootRef = useRef<THREE.Group>(null)
  const balloonGeo = useMemo(() => createPlushBalloonGeo(isMobile), [isMobile])
  const [c1, c2, c3, c4, c5] = mood.swatches

  useFrame((state, delta) => {
    if (!rootRef.current) return
    const dt = Math.min(delta, 0.05)
    if (isMobile) {
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        Math.sin(state.clock.elapsedTime * 0.45) * 0.09 + state.pointer.x * 0.12,
        dt * 2.2
      )
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
    return (
      <group ref={rootRef} position={[0, 0.25, 0]}>
        <FloatingBalloon
          geometry={balloonGeo}
          position={[0.05, 1.55, 0.35]}
          scale={1.0}
          color={c1}
          finish="satin"
          speed={1.3}
          isMobile
          rotation={[0.04, 0, -0.06]}
          onTap={onTap}
          onExplode={onExplode}
        />
        <FloatingBalloon
          geometry={balloonGeo}
          position={[1.75, 2.25, -0.35]}
          scale={0.84}
          color={c2}
          finish="satin"
          speed={1.55}
          isMobile
          rotation={[-0.03, 0.16, 0.1]}
          onTap={onTap}
          onExplode={onExplode}
        />
        <FloatingBalloon
          geometry={balloonGeo}
          position={[-1.75, 2.1, -0.45]}
          scale={0.8}
          color={c3}
          finish="pearl"
          speed={1.25}
          isMobile
          rotation={[0.04, 0, -0.12]}
          onTap={onTap}
          onExplode={onExplode}
        />
        <FloatingBalloon
          geometry={balloonGeo}
          position={[1.7, 0.45, -0.75]}
          scale={0.64}
          color={c5}
          finish="chrome"
          speed={1.7}
          isMobile
          rotation={[0, 0, 0.12]}
          onTap={onTap}
          onExplode={onExplode}
        />
        <FloatingBalloon
          geometry={balloonGeo}
          position={[-1.65, 0.45, -0.8]}
          scale={0.62}
          color={c4}
          finish="satin"
          speed={1.5}
          isMobile
          rotation={[0.05, 0, -0.1]}
          onTap={onTap}
          onExplode={onExplode}
        />
      </group>
    )
  }

  return (
    <group ref={rootRef}>
      <FloatingBalloon
        geometry={balloonGeo}
        position={[2.15, 0.35, 0.3]}
        scale={1.08}
        color={c1}
        finish="satin"
        speed={1.3}
        isMobile={false}
        rotation={[0.04, 0, -0.08]}
        onTap={onTap}
        onExplode={onExplode}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[4.55, 1.35, -0.4]}
        scale={0.95}
        color={c2}
        finish="satin"
        speed={1.55}
        isMobile={false}
        rotation={[-0.04, 0.18, 0.1]}
        onTap={onTap}
        onExplode={onExplode}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[0.65, 2.05, -1.1]}
        scale={0.78}
        color={c3}
        finish="pearl"
        speed={1.2}
        isMobile={false}
        rotation={[0.04, 0, -0.12]}
        onTap={onTap}
        onExplode={onExplode}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[4.65, -1.25, 0.45]}
        scale={0.74}
        color={c5}
        finish="chrome"
        speed={1.75}
        isMobile={false}
        rotation={[0, 0, 0.12]}
        onTap={onTap}
        onExplode={onExplode}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[1.95, -1.85, 0.75]}
        scale={0.62}
        color={c4}
        finish="satin"
        speed={1.65}
        isMobile={false}
        rotation={[0.05, 0, -0.1]}
        onTap={onTap}
        onExplode={onExplode}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[-4.85, 1.75, -2.4]}
        scale={0.78}
        color={c1}
        finish="pearl"
        speed={1.15}
        isMobile={false}
        rotation={[0, 0, 0.14]}
        onTap={onTap}
        onExplode={onExplode}
      />
      <FloatingBalloon
        geometry={balloonGeo}
        position={[-4.2, -1.85, -2.0]}
        scale={0.6}
        color={c5}
        finish="chrome"
        speed={1.45}
        isMobile={false}
        rotation={[0, 0, -0.1]}
        onTap={onTap}
        onExplode={onExplode}
      />
    </group>
  )
}

interface Hero3DSceneProps {
  mood: BalloonMood
  onPopBurst?: (ev: PopBurstEvent) => void
}

export default function Hero3DScene({ mood, onPopBurst }: Hero3DSceneProps) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const handleTap = (color: string, tapNum: number, clientX: number, clientY: number) => {
    onPopBurst?.({
      id: Date.now() + Math.random(),
      word: TAP_WORDS[(tapNum - 1) % TAP_WORDS.length],
      x: clientX,
      y: clientY,
      color,
      isExplode: false,
      tapNum,
    })
  }

  const handleExplode = (color: string, clientX: number, clientY: number) => {
    onPopBurst?.({
      id: Date.now() + Math.random(),
      word: BOOM_WORDS[Math.floor(Math.random() * BOOM_WORDS.length)],
      x: clientX,
      y: clientY,
      color,
      isExplode: true,
      tapNum: 10,
    })
  }

  return (
    <Canvas
      dpr={isMobile ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, isMobile ? 9.4 : 8.6], fov: isMobile ? 42 : 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <ambientLight intensity={isMobile ? 1.05 : 0.96} />
      <hemisphereLight args={['#FFFDFC', '#F7D3DA', isMobile ? 0.7 : 0.35]} />
      <directionalLight position={[6, 8, 6]} intensity={isMobile ? 1.45 : 1.25} color="#FFF9F7" />
      <directionalLight position={[-6, 2, 5]} intensity={0.8} color="#FDEBED" />
      <pointLight position={[2, -4, 4]} intensity={0.5} color="#F3B6C1" />

      {!isMobile && (
        <Environment resolution={128}>
          <Lightformer form="ring" intensity={2.1} position={[0, 6, 4]} scale={10} color="#FFFFFF" />
          <Lightformer form="circle" intensity={1.8} position={[-6, 2, 4]} scale={6} color="#FDEBED" />
          <Lightformer form="rect" intensity={1.5} position={[6, 3, 2]} scale={[6, 8, 1]} color="#FFF4E6" />
        </Environment>
      )}

      <SeamlessScene
        mood={mood}
        isMobile={isMobile}
        onTap={handleTap}
        onExplode={handleExplode}
      />
    </Canvas>
  )
}
