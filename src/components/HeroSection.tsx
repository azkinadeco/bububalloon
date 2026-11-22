import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownRight, Sparkles, ArrowUpRight, Hand } from 'lucide-react'
import { BALLOON_MOODS, type PopBurstEvent } from './heroMoods'
import { MobileBlenderBalloons } from './MobileBlenderBalloons'
import { useSiteConfig } from '../context/SiteConfigContext'

const Hero3DScene = lazy(() => import('./Hero3DScene'))

export function HeroSection() {
  const { config } = useSiteConfig()
  const [moodIdx, setMoodIdx] = useState(0)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [bursts, setBursts] = useState<PopBurstEvent[]>([])
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  )
  const activeMood = BALLOON_MOODS[moodIdx]

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const handlePopBurst = (ev: PopBurstEvent) => {
    setBursts((prev) => [...prev.slice(-4), ev])
    setStatusMsg(
      ev.isExplode
        ? `${ev.word} Balon meledak! Muncul lagi dalam 5 detik...`
        : `${ev.word} (${ev.tapNum}/10)`
    )
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== ev.id))
    }, ev.isExplode ? 1100 : 650)
  }

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col justify-end lg:justify-center overflow-hidden pt-20 pb-6 lg:py-24"
      style={{
        background:
          'radial-gradient(circle at 50% 24%, #FCE5EA 0%, #FFF7F9 48%, #FFFDFC 100%)',
      }}
    >
      {/* Soft ambient pastel aura */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-80 sm:w-[32rem] h-80 sm:h-[32rem] rounded-full bg-[#F7D3DA]/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-6 w-80 sm:w-[30rem] h-80 sm:h-[30rem] rounded-full bg-[#FDEBED]/80 blur-3xl" />

      {/* Full-bleed Seamless 3D Balloon Canvas (Blender-rendered 60fps on Mobile, Live WebGL on PC) */}
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          <MobileBlenderBalloons mood={activeMood} onPopBurst={handlePopBurst} />
        ) : (
          <Suspense fallback={null}>
            <Hero3DScene mood={activeMood} onPopBurst={handlePopBurst} />
          </Suspense>
        )}
      </div>

      {/* Cute Lag-Free Floating PAW! / BLOOP! / POP! Comic-Chic Burst Overlay */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        <AnimatePresence>
          {bursts.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.4, y: 8, rotate: -10 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: b.isExplode ? [0.4, 1.35, 1.15] : [0.5, 1.05, 0.95],
                y: b.isExplode ? -36 : -26,
                rotate: b.isExplode ? [-12, 6, 0] : [-6, 4],
              }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: b.isExplode ? 0.95 : 0.6, ease: 'easeOut' }}
              style={{ left: b.x, top: b.y }}
              className="fixed -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            >
              {/* Cute burst rays on 10th tap explode! */}
              {b.isExplode && (
                <svg
                  viewBox="0 0 120 120"
                  className="absolute w-32 h-32 -z-10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <line
                      key={deg}
                      x1="60"
                      y1="14"
                      x2="60"
                      y2="28"
                      stroke={deg % 90 === 0 ? '#162A4C' : '#EFAAB6'}
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      transform={`rotate(${deg} 60 60)`}
                    />
                  ))}
                  <circle
                    cx="60"
                    cy="60"
                    r="38"
                    fill="none"
                    stroke={b.color}
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    opacity="0.7"
                  />
                </svg>
              )}
              <span
                className={
                  b.isExplode
                    ? 'px-4 py-1.5 rounded-full bg-[#162A4C] text-[#FDEBED] font-extrabold text-xl sm:text-2xl tracking-wide shadow-xl border-2 border-white'
                    : 'px-3 py-1 rounded-full bg-white/95 text-[#162A4C] font-extrabold text-xs sm:text-sm shadow-md border border-[#F2D5DC]'
                }
              >
                {b.word}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Subtle iPhone interactive hint */}
      <div className="lg:hidden absolute top-20 inset-x-0 z-10 flex justify-center pointer-events-none">
        <div className="glass-pill px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 text-[11px] font-bold text-[#162A4C]">
          <Hand className="w-3.5 h-3.5 text-[#D98395]" />
          <span>{statusMsg || 'Ketuk balon 3D 10× untuk POP!'}</span>
        </div>
      </div>

      {/* Editorial Foreground Content */}
      <div className="mx-auto max-w-6xl w-full px-5 sm:px-6 relative z-10 pointer-events-none mt-auto lg:mt-0 mb-4 lg:mb-0">
        <div className="max-w-lg lg:max-w-xl space-y-4 sm:space-y-6 text-center lg:text-left mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-[11px] sm:text-xs font-bold text-[#162A4C] pointer-events-auto"
          >
            <span className="w-2 h-2 rounded-full bg-[#EFAAB6] animate-pulse" />
            {config.brand.heroBadge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[2.6rem] sm:text-6xl lg:text-[4.4rem] font-extrabold tracking-tight text-[#162A4C] leading-[1.03]"
          >
            {config.brand.heroTitle}
            <br />
            <span className="font-display italic font-semibold text-[#D98395]">
              {config.brand.heroHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs sm:text-base lg:text-lg text-[#162A4C]/75 max-w-xs sm:max-w-md mx-auto lg:mx-0 leading-relaxed"
          >
            {config.brand.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center justify-center lg:justify-start gap-2.5 pt-1 pointer-events-auto"
          >
            <a
              href="#model-desain"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 sm:px-7 py-3.5 rounded-full bg-[#162A4C] text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#162A4C]/20 hover:bg-[#243E6B] active:scale-[0.98] transition-all"
            >
              Lihat Paket
              <ArrowDownRight className="w-4 h-4 text-[#F2B3BD]" />
            </a>
            <a
              href="/?studio=1"
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-3.5 rounded-full glass-pill text-[#162A4C] text-xs sm:text-sm font-bold hover:bg-white active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#D98395]" />
              Studio 2D
              <ArrowUpRight className="w-3.5 h-3.5 text-[#162A4C]/50" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom Floating 3D Color Palette Switcher */}
      <div className="relative lg:absolute lg:bottom-5 inset-x-3 sm:inset-x-4 z-10 flex flex-col items-center gap-2 pointer-events-none mt-2 lg:mt-0">
        {statusMsg && (
          <div className="hidden lg:block px-3.5 py-1 rounded-full bg-[#162A4C] text-white text-[11px] font-bold shadow-lg">
            {statusMsg}
          </div>
        )}
        <div className="glass-pill rounded-full px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 sm:gap-3 pointer-events-auto max-w-full overflow-x-auto no-scrollbar">
          <span className="hidden md:inline text-[11px] font-bold text-[#162A4C]/65 pl-2 shrink-0">
            Ketuk balon 10× untuk POP! • Warna:
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
