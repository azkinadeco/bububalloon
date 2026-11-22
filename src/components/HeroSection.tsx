import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, Sparkles, ArrowUpRight, Plus, Hand } from 'lucide-react'
import { BALLOON_MOODS, SpawnedBalloon } from './Hero3DScene'
import { useSiteConfig } from '../context/SiteConfigContext'

const Hero3DScene = lazy(() => import('./Hero3DScene'))

export function HeroSection() {
  const { config } = useSiteConfig()
  const [moodIdx, setMoodIdx] = useState(0)
  const [popCount, setPopCount] = useState(0)
  const [spawned, setSpawned] = useState<SpawnedBalloon[]>([])
  const activeMood = BALLOON_MOODS[moodIdx]

  const addExtraBalloon = () => {
    const finishes: Array<'satin' | 'chrome' | 'pearl'> = ['satin', 'chrome', 'pearl']
    // Place gently around the outer ring so it stays spaced cleanly
    const angle = Math.random() * Math.PI * 2
    const radius = 2.4 + Math.random() * 0.7
    const next: SpawnedBalloon = {
      id: `sp-${Date.now()}-${Math.random()}`,
      position: [Math.cos(angle) * radius, Math.sin(angle) * 1.45, -0.8 - Math.random() * 0.6],
      scale: 0.44 + Math.random() * 0.16,
      colorIdx: Math.floor(Math.random() * 5),
      finish: finishes[Math.floor(Math.random() * finishes.length)],
    }
    setSpawned((prev) => [...prev.slice(-4), next])
  }

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-16"
      style={{
        background:
          'radial-gradient(circle at 75% 25%, #FDEBED 0%, #FFF8FA 52%, #FFFDFC 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-12 gap-7 lg:gap-8 items-center">
        {/* Left Editorial Typography */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 space-y-5 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-[11px] sm:text-xs font-bold text-[#162A4C]">
            <span className="w-2 h-2 rounded-full bg-[#EFAAB6] animate-pulse" />
            {config.brand.heroBadge}
          </div>

          <h1 className="text-[2.5rem] sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-[#162A4C] leading-[1.03]">
            {config.brand.heroTitle}
            <br />
            <span className="font-display italic font-semibold text-[#D98395]">
              {config.brand.heroHighlight}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#162A4C]/70 max-w-sm sm:max-w-md mx-auto lg:mx-0 leading-relaxed">
            {config.brand.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
            <a
              href="#cara-pesan"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#162A4C] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#162A4C]/20 hover:bg-[#243E6B] active:scale-[0.98] transition-all"
            >
              Cara Pemesanan
              <ArrowDownRight className="w-4 h-4 text-[#F2B3BD]" />
            </a>
            <a
              href="/?studio=1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-full bg-white border border-[#EFAAB6]/60 text-[#162A4C] text-xs sm:text-sm font-bold shadow-xs hover:bg-[#FDEBED] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#D98395]" />
              Studio 2D
              <ArrowUpRight className="w-3.5 h-3.5 text-[#162A4C]/50" />
            </a>
          </div>
        </motion.div>

        {/* Right Dribbble Sculpted Arch 3D Interactive Stage (Works beautifully on iPhone & PC!) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 relative"
        >
          <div className="relative h-[340px] sm:h-[460px] lg:h-[520px] rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-b from-[#FDEBED]/85 via-[#FFF5F7]/75 to-white/60 border border-white/95 shadow-2xl shadow-[#EFAAB6]/20 overflow-hidden">
            {/* Soft Dribbble Arch Silhouette */}
            <div className="pointer-events-none absolute inset-x-8 sm:inset-x-12 top-7 bottom-0 rounded-t-full border border-[#EFAAB6]/40 bg-gradient-to-b from-white/55 to-transparent" />

            {/* Interactive 3D Balloons (Tap any balloon on iPhone or PC!) */}
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#162A4C]/50">
                  Memuat Balon 3D...
                </div>
              }
            >
              <Hero3DScene
                mood={activeMood}
                spawned={spawned}
                onBalloonPop={() => setPopCount((c) => c + 1)}
              />
            </Suspense>

            {/* Top Interactive Pill Bar */}
            <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none">
              <div className="glass-pill px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-[11px] font-bold text-[#162A4C]">
                <Hand className="w-3.5 h-3.5 text-[#D98395]" />
                <span>{popCount > 0 ? `Pop! ${popCount}× ✨` : 'Ketuk balon 3D!'}</span>
              </div>
              <button
                type="button"
                onClick={addExtraBalloon}
                className="pointer-events-auto glass-pill px-3 py-1.5 rounded-full inline-flex items-center gap-1 text-[11px] font-extrabold text-[#162A4C] hover:bg-[#162A4C] hover:text-white active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Balon
              </button>
            </div>

            {/* Bottom Floating 3D Color Theme Switcher */}
            <div className="absolute bottom-3.5 inset-x-3.5 flex justify-center">
              <div className="glass-pill rounded-full px-2 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
                {BALLOON_MOODS.map((m, i) => {
                  const active = i === moodIdx
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMoodIdx(i)}
                      className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                        active
                          ? 'bg-[#162A4C] text-white shadow-xs'
                          : 'text-[#162A4C]/75 hover:bg-[#FDEBED]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: m.swatches[0] }}
                      />
                      <span>{m.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
