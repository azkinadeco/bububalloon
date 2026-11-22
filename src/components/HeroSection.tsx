import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, Sparkles, ArrowUpRight, Hand } from 'lucide-react'
import { BALLOON_MOODS } from './Hero3DScene'
import { useSiteConfig } from '../context/SiteConfigContext'

const Hero3DScene = lazy(() => import('./Hero3DScene'))

export function HeroSection() {
  const { config } = useSiteConfig()
  const [moodIdx, setMoodIdx] = useState(0)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const activeMood = BALLOON_MOODS[moodIdx]

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

      {/* Full-bleed Seamless 3D Balloon Canvas (100% integrated, NO box, interactive on PC & iPhone!) */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Hero3DScene mood={activeMood} onStatusChange={setStatusMsg} />
        </Suspense>
      </div>

      {/* Subtle iPhone interactive hint right below top navbar */}
      <div className="lg:hidden absolute top-20 inset-x-0 z-10 flex justify-center pointer-events-none">
        <div className="glass-pill px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 text-[11px] font-bold text-[#162A4C]">
          <Hand className="w-3.5 h-3.5 text-[#D98395]" />
          <span>{statusMsg || 'Ketuk balon 3D 10× untuk meledak!'}</span>
        </div>
      </div>

      {/* Editorial Foreground Content — positioned cleanly in lower showcase half on iPhone, left column on PC */}
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
            Ketuk balon 10× untuk meledak! • Warna:
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
