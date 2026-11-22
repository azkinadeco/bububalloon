import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, MessageCircle, Ruler, Eye, X, Check, ArrowUpRight } from 'lucide-react'
import { useSiteConfig, DesignCategory, DesignModel } from '../context/SiteConfigContext'
import { StudioPresetPreview } from './Studio2D/stickerLibrary'

const CATEGORIES: DesignCategory[] = ['Semua', 'Ulang Tahun', 'Sweet 17', 'Kids & Baby', 'Intimate & Bridal']

function ModelVisual({ model, className = '' }: { model: DesignModel; className?: string }) {
  if (model.image) {
    return (
      <img
        src={model.image}
        alt={model.name}
        loading="lazy"
        className={`w-full h-full object-cover ${className}`}
      />
    )
  }
  return (
    <StudioPresetPreview
      presetId={model.studioPresetId}
      customElements={model.customStudioElements}
      customBgId={model.customStudioBgId}
      className={className}
    />
  )
}

export function ModelShowcaseSection() {
  const { config, buildWhatsAppUrl } = useSiteConfig()
  const [activeCategory, setActiveCategory] = useState<DesignCategory>('Semua')
  const [detailModel, setDetailModel] = useState<DesignModel | null>(null)

  const filtered =
    activeCategory === 'Semua'
      ? config.models
      : config.models.filter((m) => m.category === activeCategory)

  return (
    <section
      id="model-desain"
      className="py-16 sm:py-24 relative"
      style={{
        background: 'linear-gradient(180deg, #FFF9FA 0%, #FDEBED 50%, #FFF9FA 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header + Horizontal Scrollable Filter Pills on iPhone */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#D98395]">
              Katalog Paket
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#162A4C]">
              Model &amp;{' '}
              <span className="font-display italic font-semibold text-[#D98395]">Spesifikasi</span>
            </h2>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => {
              const active = cat === activeCategory
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    active
                      ? 'bg-[#162A4C] text-white shadow-md shadow-[#162A4C]/15'
                      : 'bg-white/90 text-[#162A4C]/75 hover:bg-white border border-[#EFAAB6]/40'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dribbble Horizontal Snap Carousel on iPhone -> Clean 2-Col Grid on Desktop */}
        <div className="flex md:grid md:grid-cols-2 gap-4 sm:gap-7 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0">
          {filtered.map((model, idx) => (
            <motion.article
              key={model.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="snap-center shrink-0 w-[84vw] sm:w-[70vw] md:w-auto group rounded-[2rem] bg-white border border-white/90 overflow-hidden soft-shadow md:hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-[#FFF5F7] overflow-hidden">
                <ModelVisual
                  model={model}
                  className="group-hover:scale-[1.03] transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full glass-pill text-[11px] font-extrabold text-[#162A4C]">
                  {model.tag}
                </span>
                <button
                  type="button"
                  onClick={() => setDetailModel(model)}
                  className="absolute top-3 right-3 glass-pill px-3 py-1.5 rounded-full inline-flex items-center gap-1 text-[11px] font-bold text-[#162A4C] hover:bg-[#162A4C] hover:text-white transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Detail
                </button>
                <div className="absolute bottom-3 right-3 glass-pill px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-[#162A4C]">
                  <Ruler className="w-3 h-3 text-[#D98395]" />
                  {model.size}
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D98395]">
                      {model.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#162A4C] mt-0.5">
                      {model.name}
                    </h3>
                  </div>
                  <div className="flex items-center -space-x-1 shrink-0">
                    {model.colors.map((hex) => (
                      <span
                        key={hex}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full ring-2 ring-white shadow-xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-2 text-xs sm:text-sm text-[#162A4C]/65 leading-relaxed line-clamp-2">
                  {model.description}
                </p>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {model.includes.map((inc) => (
                    <span
                      key={inc}
                      className="px-2.5 py-1 rounded-full bg-[#FFF5F7] text-[10px] sm:text-[11px] font-semibold text-[#162A4C]/80"
                    >
                      {inc}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-[#FDEBED] flex items-center gap-2">
                  <a
                    href={`/?studio=1&preset=${encodeURIComponent(model.studioPresetId)}&modelId=${encodeURIComponent(model.id)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-[#FDEBED] hover:bg-[#F7D3DA] text-[#162A4C] text-xs font-bold transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-[#D98395]" />
                    Studio 2D
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <a
                    href={buildWhatsAppUrl(
                      `Halo Kak admin ${config.brand.name} 🎈\nSaya lihat dari website dan tertarik dengan paket *${model.name}* (ukuran ${model.size}).\nBoleh dibantu info detail & cek jadwal kosongnya ya? Terima kasih!`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-[#162A4C] hover:bg-[#243E6B] text-white text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#F2B3BD]" />
                    Tanya
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="md:hidden text-center text-[11px] font-bold text-[#162A4C]/45 mt-1">
          ← Geser ke samping untuk lihat paket lainnya →
        </p>
      </div>

      {/* Spec Detail Modal */}
      {detailModel && (
        <div
          onClick={() => setDetailModel(null)}
          className="fixed inset-0 z-50 bg-[#162A4C]/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-xl w-full rounded-[2rem] bg-white overflow-hidden shadow-2xl border border-white max-h-[90vh] overflow-y-auto"
          >
            <div className="relative aspect-[16/10] bg-[#FFF5F7]">
              <ModelVisual model={detailModel} />
              <button
                type="button"
                onClick={() => setDetailModel(null)}
                aria-label="Tutup"
                className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#162A4C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#D98395]">
                  {detailModel.category} • {detailModel.size}
                </span>
                <h3 className="text-2xl font-extrabold text-[#162A4C] mt-0.5">{detailModel.name}</h3>
              </div>
              <p className="text-sm text-[#162A4C]/70">{detailModel.description}</p>
              <div className="rounded-2xl bg-[#FFF9FA] border border-[#F2D5DC]/60 p-4 space-y-2">
                <p className="text-xs font-extrabold text-[#162A4C]">Spesifikasi Paket:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {detailModel.includes.map((inc) => (
                    <span
                      key={inc}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#162A4C]/80"
                    >
                      <Check className="w-3.5 h-3.5 text-[#D98395]" />
                      {inc}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <a
                  href={`/?studio=1&preset=${encodeURIComponent(detailModel.studioPresetId)}&modelId=${encodeURIComponent(detailModel.id)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-[#FDEBED] hover:bg-[#F7D3DA] text-[#162A4C] text-xs font-extrabold"
                >
                  <Wand2 className="w-4 h-4 text-[#D98395]" />
                  Studio 2D ↗
                </a>
                <a
                  href={buildWhatsAppUrl(
                    `Halo ${config.brand.name}! Saya ingin tanya paket *${detailModel.name}* (${detailModel.size}). 🎈`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-[#162A4C] hover:bg-[#243E6B] text-white text-xs font-extrabold"
                >
                  <MessageCircle className="w-4 h-4 text-[#F2B3BD]" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
