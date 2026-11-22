import { motion, useScroll, useSpring } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const MARQUEE_ITEMS = [
  'Ulang Tahun Dewasa',
  'Sweet Seventeen',
  'Baby Shower & Aqiqah',
  'Bridal Shower',
  'Kids Birthday Party',
  'Intimate Dinner',
  'Grand Opening',
  'Custom Organic Garland',
]

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#EFAAB6] via-[#162A4C] to-[#DFBE8A] origin-left z-[60]"
    />
  )
}

export function BrandMarqueeStrip() {
  return (
    <div className="relative py-4 bg-[#162A4C] text-white overflow-hidden border-y border-white/10">
      <div className="flex whitespace-nowrap animate-[marquee_28s_linear_infinite]">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="inline-flex items-center gap-3 mx-5 text-xs sm:text-sm font-bold tracking-wide text-white/90"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F2B3BD]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
