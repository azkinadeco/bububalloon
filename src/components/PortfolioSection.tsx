import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, X, Instagram, Sparkles, MessageCircle } from 'lucide-react'
import { useSiteConfig, PortfolioItem } from '../context/SiteConfigContext'
import { StudioPresetPreview } from './Studio2D/stickerLibrary'

function PortfolioVisual({ item, className = '' }: { item: PortfolioItem; className?: string }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className={`w-full h-full object-cover ${className}`}
      />
    )
  }
  return <StudioPresetPreview presetId={item.presetId || 'bubu-signature'} className={className} />
}

export function PortfolioSection() {
  const { config, buildWhatsAppUrl } = useSiteConfig()
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null)
  const igHandle = config.brand.instagram.replace(/^@/, '').trim() || 'bububalloon.decor'

  return (
    <section id="portofolio" className="py-16 sm:py-20 bg-[#FFF5F7]/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-10">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#D98395]">
              Portofolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#162A4C]">
              Momen Manis{' '}
              <span className="font-display italic font-semibold text-[#D98395]">Pilihan</span>
            </h2>
          </div>

          <a
            href={`https://instagram.com/${igHandle}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EFAAB6]/50 text-xs font-bold text-[#162A4C] hover:bg-[#FDEBED] transition-colors self-start sm:self-auto"
          >
            <Instagram className="w-3.5 h-3.5 text-[#D98395]" />
            {config.brand.instagram}
          </a>
        </div>

        {/* Horizontal Snap Carousel on iPhone -> 4-Col Grid on Desktop */}
        <div className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 pb-3 lg:pb-0">
          {config.portfolio.map((item, idx) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveItem(item)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="snap-center shrink-0 w-[72vw] sm:w-[46vw] lg:w-auto group text-left rounded-[1.85rem] bg-white border border-white overflow-hidden soft-shadow lg:hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#FFF5F7]">
                <PortfolioVisual
                  item={item}
                  className="group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D98395]">
                  {item.eventType}
                </span>
                <h3 className="text-sm font-extrabold text-[#162A4C]">{item.title}</h3>
                <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#162A4C]/55">
                  <MapPin className="w-3 h-3 text-[#D98395]" />
                  {item.location}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 bg-[#162A4C]/45 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-xl w-full rounded-[2rem] bg-white overflow-hidden shadow-2xl border border-white"
          >
            <div className="relative aspect-[16/10] bg-[#FFF5F7]">
              <PortfolioVisual item={activeItem} />
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                aria-label="Tutup"
                className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#162A4C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#D98395]">
                  {activeItem.eventType} • {activeItem.location}
                </span>
                <h3 className="text-xl font-extrabold text-[#162A4C] mt-1">{activeItem.title}</h3>
              </div>
              {activeItem.palette?.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#162A4C]/55">Palet Warna:</span>
                  {activeItem.palette.map((c, idx) => (
                    <span
                      key={idx}
                      className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`/?studio=1&preset=${encodeURIComponent(activeItem.presetId || 'bubu-signature')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[140px] py-2.5 px-4 rounded-full bg-[#FDEBED] hover:bg-[#F7D3DA] text-[#162A4C] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D98395]" />
                  Coba di Studio 2D
                </a>
                <a
                  href={buildWhatsAppUrl(
                    `Halo Bubu Balloon! 🎈 Saya lihat portofolio "${activeItem.title}" (${activeItem.eventType}) di website dan tertarik bikin konsep serupa. Boleh info jadwal kosongnya?`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[140px] py-2.5 px-4 rounded-full bg-[#162A4C] hover:bg-[#243E6B] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#F2B3BD]" />
                  Tanya Konsep Ini
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
