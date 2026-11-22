import { useState, useEffect } from 'react'
import { Menu, X, Sparkles, MessageCircle, Settings, ArrowUpRight } from 'lucide-react'
import { useSiteConfig } from '../context/SiteConfigContext'

const NAV_LINKS = [
  { label: 'Model', href: '#model-desain' },
  { label: 'Cara Pesan', href: '#cara-pesan' },
  { label: 'Portofolio', href: '#portofolio' },
]

interface NavbarProps {
  onOpenSettings: () => void
}

export function Navbar({ onOpenSettings }: NavbarProps) {
  const { config, buildWhatsAppUrl } = useSiteConfig()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const waUrl = buildWhatsAppUrl(
    `Halo Kak admin ${config.brand.name} 🎈\nSaya dapat info dari website ${config.brand.name}, mau tanya-tanya & konsultasi dekorasi balon untuk acara saya ya. Terima kasih!`
  )

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-4 pointer-events-none">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-3">
        {/* Main Floating Pill */}
        <div
          className={`flex-1 transition-all duration-300 pointer-events-auto rounded-full ${
            scrolled
              ? 'glass-pill px-4 sm:px-5 py-2 shadow-lg'
              : 'bg-white/70 backdrop-blur-md border border-white/85 px-4 sm:px-5 py-2.5'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <a href="#top" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#FDEBED] ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src="/logo.png"
                  alt={config.brand.name}
                  className="w-full h-full object-cover scale-115"
                />
              </div>
              <div className="leading-tight">
                <span className="block font-extrabold text-sm tracking-tight text-[#162A4C]">
                  {config.brand.name.toUpperCase()}
                </span>
                <span className="block font-script text-sm -mt-1 text-[#D98395]">
                  {config.brand.subtitle}
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-4 py-1.5 rounded-full text-xs font-bold text-[#162A4C]/75 hover:text-[#162A4C] hover:bg-[#FDEBED]/80 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/?studio=1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold text-[#D98395] hover:bg-[#FDEBED]/80 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Studio 2D
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </nav>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#162A4C] hover:bg-[#243E6B] shadow-md shadow-[#162A4C]/15 transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#F2B3BD]" />
                WhatsApp
              </a>
            </div>

            {/* Mobile Quick Studio 2D Pill + Menu Button */}
            <div className="md:hidden flex items-center gap-1.5">
              <a
                href="/?studio=1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FDEBED] text-[11px] font-extrabold text-[#162A4C]"
              >
                <Sparkles className="w-3 h-3 text-[#D98395]" />
                2D
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menu"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FDEBED] text-[#162A4C]"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Small Gear Settings Icon in Top-Right Corner */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="Pengaturan Konten Web"
          aria-label="Pengaturan Konten Web"
          className="pointer-events-auto w-10 h-10 rounded-full glass-pill flex items-center justify-center text-[#162A4C]/75 hover:text-[#162A4C] hover:rotate-45 transition-all duration-300 shrink-0 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-6xl glass-card rounded-3xl p-4 pointer-events-auto">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-sm font-bold text-[#162A4C] hover:bg-[#FDEBED]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/?studio=1"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 rounded-2xl text-sm font-bold text-[#D98395] hover:bg-[#FDEBED] flex items-center justify-between"
            >
              <span>Studio Simulasi 2D</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 w-full py-3 rounded-2xl bg-[#162A4C] text-white text-sm font-bold text-center flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#F2B3BD]" />
              Chat WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
