import { motion } from 'framer-motion'
import { Sparkles, ArrowUpRight, Layers, Upload, Download } from 'lucide-react'
import { StudioPresetPreview } from './Studio2D/stickerLibrary'
import { useSiteConfig } from '../context/SiteConfigContext'

export function Studio2DTeaserSection() {
  const { config } = useSiteConfig()
  const featuredModel = config.models[0]

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="relative rounded-[2.25rem] sm:rounded-[2.75rem] bg-[#162A4C] text-white p-6 sm:p-12 overflow-hidden shadow-2xl shadow-[#162A4C]/15"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EFAAB6]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-[#DFBE8A]/15 blur-3xl" />

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#F2B3BD] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                SIMULASI 2D FULLSCREEN
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Susun Sendiri Dekorasimu{' '}
                <span className="font-display italic font-semibold text-[#F2B3BD]">
                  ala Canva.
                </span>
              </h2>
              <p className="text-sm text-white/75 max-w-md leading-relaxed">
                Atur backdrop shimmer, custom banner, properti meja, karakter PNG, hingga latar
                venue (Hotel, Resto, Cafe, Ballroom, Outdoor) di tab penuh.
              </p>

              <div className="flex flex-wrap gap-2.5 text-xs text-white/85 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10">
                  <Layers className="w-3.5 h-3.5 text-[#F2B3BD]" /> Shimmer Wall &amp; Properti Realistis
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10">
                  <Upload className="w-3.5 h-3.5 text-[#DFBE8A]" /> Banner &amp; Karakter PNG
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10">
                  <Download className="w-3.5 h-3.5 text-[#F2B3BD]" /> Unduh PNG &amp; Kirim WA
                </span>
              </div>

              <div className="pt-2">
                <a
                  href="/?studio=1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#F2B3BD] hover:bg-[#EFAAB6] text-[#162A4C] text-sm font-extrabold shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Buka Studio 2D Fullscreen
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <a
                href="/?studio=1"
                target="_blank"
                rel="noreferrer"
                className="group block rounded-[1.75rem] bg-white/10 border border-white/15 p-2.5 hover:bg-white/15 transition-colors"
              >
                <div className="aspect-[16/10] rounded-[1.25rem] overflow-hidden relative bg-[#FFF5F7]">
                  <StudioPresetPreview
                    presetId={featuredModel?.studioPresetId || 'sweet-17-glow'}
                    customElements={featuredModel?.customStudioElements}
                    customBgId={featuredModel?.customStudioBgId}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#162A4C]/12 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full glass-pill text-xs font-extrabold text-[#162A4C] inline-flex items-center gap-1.5 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-[#D98395]" />
                      Coba di Tab Baru ↗
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
