import { useState, lazy, Suspense } from 'react'
import { SiteConfigProvider } from './context/SiteConfigContext'
import { Navbar } from './components/Navbar'
import { ScrollProgressBar, BrandMarqueeStrip } from './components/ScrollProgressAndMarquee'
import { HeroSection } from './components/HeroSection'
import { HowToOrderSection } from './components/HowToOrderSection'
import { ModelShowcaseSection } from './components/ModelShowcaseSection'
import { Studio2DTeaserSection } from './components/Studio2DTeaserSection'
import { PortfolioSection } from './components/PortfolioSection'
import { Footer } from './components/Footer'
import { SettingsDrawer } from './components/SettingsDrawer'

const FullscreenStudioPage = lazy(() => import('./components/Studio2D/FullscreenStudioPage'))

function AppContent() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Check if opened in dedicated Fullscreen 2D Studio tab (?studio=1)
  const params = new URLSearchParams(window.location.search)
  const isStudioMode = params.get('studio') === '1'
  const presetParam = params.get('preset')

  if (isStudioMode) {
    return (
      <Suspense
        fallback={
          <div className="h-screen w-screen flex items-center justify-center bg-[#FFF9FA] text-sm font-bold text-[#162A4C]">
            Memuat Studio 2D Fullscreen...
          </div>
        }
      >
        <FullscreenStudioPage initialPresetId={presetParam} />
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgressBar />
      <Navbar onOpenSettings={() => setSettingsOpen(true)} />
      <main className="flex-1">
        <HeroSection />
        <BrandMarqueeStrip />
        <HowToOrderSection />
        <ModelShowcaseSection />
        <Studio2DTeaserSection />
        <PortfolioSection />
      </main>
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
