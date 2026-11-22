import { useState, lazy, Suspense } from 'react'
import { SiteConfigProvider } from './context/SiteConfigContext'
import { Navbar } from './components/Navbar'
import { ScrollProgressBar, BrandMarqueeStrip } from './components/ScrollProgressAndMarquee'
import { HeroSection } from './components/HeroSection'
import { ModelShowcaseSection } from './components/ModelShowcaseSection'
import { Studio2DTeaserSection } from './components/Studio2DTeaserSection'
import { HowToOrderSection } from './components/HowToOrderSection'
import { PortfolioSection } from './components/PortfolioSection'
import { Footer } from './components/Footer'
import { SettingsDrawer } from './components/SettingsDrawer'

const FullscreenStudioPage = lazy(() => import('./components/Studio2D/FullscreenStudioPage'))

function AppContent() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  const params = new URLSearchParams(window.location.search)
  const isStudioMode = params.get('studio') === '1'
  const presetParam = params.get('preset')
  const modelIdParam = params.get('modelId')
  const isCreatePackageMode = params.get('mode') === 'create-package'

  if (isStudioMode) {
    return (
      <Suspense
        fallback={
          <div className="h-screen w-screen flex items-center justify-center bg-[#FFF9FA] text-sm font-bold text-[#162A4C]">
            Memuat Studio 2D Fullscreen...
          </div>
        }
      >
        <FullscreenStudioPage
          initialPresetId={presetParam}
          initialModelId={modelIdParam}
          createPackageMode={isCreatePackageMode}
        />
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgressBar />
      <Navbar onOpenSettings={() => setSettingsOpen(true)} />
      <main className="flex-1">
        {/* 1. Hero 3D Balon */}
        <HeroSection />
        {/* 2. Tipe-tipe dekor berjalan (vidiotron marquee) */}
        <BrandMarqueeStrip />
        {/* 3. Katalog Paket */}
        <ModelShowcaseSection />
        {/* 4. Simulasi 2D */}
        <Studio2DTeaserSection />
        {/* 5. Cara Pemesanan + Cek Jadwal via WA & Rules */}
        <HowToOrderSection />
        {/* 6. Portofolio Momen Manis */}
        <PortfolioSection />
      </main>
      {/* 7. Footer */}
      <Footer />
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default function App() {
  return (
    <SiteConfigProvider>
      <AppContent />
    </SiteConfigProvider>
  )
}
