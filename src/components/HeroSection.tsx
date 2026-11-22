import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, Sparkles, ArrowUpRight } from 'lucide-react'
import { BALLOON_MOODS } from './Hero3DScene'
import { useSiteConfig } from '../context/SiteConfigContext'

const Hero3DScene = lazy(() => import('./Hero3DScene'))

export function HeroSection() {
  const { config } = useSiteConfig()
  const [moodIdx, setMoodIdx] = useState(0)
  const [popCount, setPopCount] = useState(0)
  const activeMood = BALLOON_MOODS[moodIdx]

  return (
    <section
      id="top"
      className="relative min-h-[96svh] sm:min-h-[100svh] flex items-center overflow-hidden pt-24 pb-24 sm:pb-16"
      style={{
        background:
          'radial-gradient(circle at 72% 45%, #FDEBED 0%, #FFF7F9 48%, #FFFDFC 100%)',
      }}
    >
      {/* Ambient pastel glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-[26rem] sm:w-[32rem] h-[26rem] sm:h-[32rem] rounded-full bg-[#F7D3DA]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-10 w-[24rem] sm:w-[30rem] h-[24rem] sm:h-[30rem] rounded-full bg-[#FDEBED]/80 blur-3xl" />

      {/* Full-bleed Seamless 3D Balloon Canvas */}
      <div className="absolute inset-0 z-0 opacity-85 sm:opacity-100">
        <Suspense fallback={null}>
          <Hero3DScene mood={activeMood} onBalloonPop={() => setPopCount((c) => c + 1)} />
        </Suspense>
      </div>

      {/* Subtle left-side readability veil on small mobile screens */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,249,250,0.72) 0%, rgba(255,249,250,0.45) 55%, rgba(255,249,250,0.18) 100%)',
        }}
      />

      {/* Editorial Foreground Content */}
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 relative z-10 pointer-events-none">
        <div className="max-w-lg lg:max-w-xl space-y-5 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full glass-pill text-[11px] sm:text-xs font-bold text-[#162A4C] pointer-events-auto"
          >
            <span className="w-2 h-2 rounded-full bg-[#EFAAB6] animate-pulse" />
            {config.brand.heroBadge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl lg:text-[4.35rem] font-extrabold tracking-tight text-[#162A4C] leading-[1.04]"
          >
            {config.brand.heroTitle}
            <br />
            <span className="font-display italic font-semibold text-[#D98395]">
              {config.brand.heroHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="text-sm sm:text-lg text-[#162A4C]/75 max-w-md leading-relaxed"
          >
            {config.brand.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="flex flex-wrap items-center gap-3 pt-1 pointer-events-auto"
          >
            <a
              href="#cara-pesan"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#162A4C] text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#162A4C]/20 hover:bg-[#243E6B] hover:-translate-y-0.5 transition-all"
            >
              Cara Pemesanan
              <ArrowDownRight className="w-4 h-4 text-[#F2B3BD]" />
            </a>
            <a
              href="/?studio=1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full glass-pill text-[#162A4C] text-xs sm:text-sm font-bold hover:bg-white hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#D98395]" />
              Studio 2D
              <ArrowUpRight className="w-4 h-4 text-[#162A4C]/50" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom Floating Interactive 3D Palette Bar */}
      <div className="absolute bottom-5 inset-x-3 sm:inset-x-4 z-10 flex justify-center pointer-events-none">
        <div className="glass-pill rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-3 pointer-events-auto max-w-full overflow-x-auto">
          <span className="hidden md:inline text-[11px] font-bold text-[#162A4C]/65 pl-2 shrink-0">
            {popCount > 0 ? `✨ ${popCount}× klik balon` : 'Klik balon 3D • Ganti warna:'}
          </span>
          <div className="flex items-center gap-1.5">
            {BALLOON_MOODS.map((m, i) => {
              const active = i === moodIdx
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMoodIdx(i)}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                    active
                      ? 'bg-[#162A4C] text-white shadow-sm'
                      : 'bg-white/80 text-[#162A4C]/75 hover:bg-[#FDEBED]'
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
    </section>
  )
}
