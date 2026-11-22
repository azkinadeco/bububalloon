import { MessageCircle, Instagram, MapPin, Clock, Sparkles, ArrowUpRight } from 'lucide-react'
import { useSiteConfig } from '../context/SiteConfigContext'

export function Footer() {
  const { config, buildWhatsAppUrl } = useSiteConfig()
  const waUrl = buildWhatsAppUrl(
    `Halo ${config.brand.name}! Saya ingin konsultasi pemesanan dekorasi balon party. 🎈`
  )

  return (
    <footer className="px-4 sm:px-6 pb-8 pt-6">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-[#162A4C] text-white p-8 sm:p-10 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#EFAAB6]/20 blur-3xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#FDEBED]">
                <img src="/logo.png" alt={config.brand.name} className="w-full h-full object-cover scale-115" />
              </div>
              <div>
                <span className="block font-extrabold text-base tracking-tight">
                  {config.brand.name.toUpperCase()}
                </span>
                <span className="block font-script text-base -mt-1 text-[#F2B3BD]">
                  {config.brand.subtitle}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F2B3BD]" />
                {config.brand.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#F2B3BD]" />
                {config.brand.hours}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/?studio=1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F2B3BD]" />
              Studio 2D
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F2B3BD] hover:bg-[#EFAAB6] text-[#162A4C] text-xs font-extrabold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {config.brand.name} {config.brand.subtitle}.</p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#F2B3BD]"
          >
            <Instagram className="w-3.5 h-3.5" />
            {config.brand.instagram}
          </a>
        </div>
      </div>

      {/* Floating WhatsApp Pill */}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#162A4C] text-white text-xs font-extrabold shadow-xl shadow-[#162A4C]/25 border border-white/20 hover:scale-105 transition-transform"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <MessageCircle className="w-4 h-4 text-[#F2B3BD]" />
        <span className="hidden sm:inline">Tanya Bubu</span>
      </a>
    </footer>
  )
}
