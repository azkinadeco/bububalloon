import React, { createContext, useContext, useState, useEffect } from 'react'
import type { CanvasElement } from '../components/Studio2D/stickerLibrary'
import {
  DEFAULT_GITHUB_REPO,
  verifyGithubAdminToken,
  publishSiteConfigToGithub,
  fetchLiveSiteConfig,
} from '../lib/githubSync'

export type DesignCategory = 'Semua' | 'Ulang Tahun' | 'Sweet 17' | 'Kids & Baby' | 'Intimate & Bridal'

export interface DesignModel {
  id: string
  name: string
  category: Exclude<DesignCategory, 'Semua'>
  tag: string
  size: string
  description: string
  image: string
  colors: string[]
  includes: string[]
  studioPresetId: string
  customStudioElements?: CanvasElement[]
  customStudioBgId?: string
}

export interface OrderStep {
  step: string
  title: string
  description: string
}

export interface PortfolioItem {
  id: string
  title: string
  eventType: string
  location: string
  image: string
  presetId: string
  palette: string[]
}

export interface SiteConfig {
  brand: {
    name: string
    subtitle: string
    heroBadge: string
    heroTitle: string
    heroHighlight: string
    heroSubtitle: string
    whatsappNumber: string
    instagram: string
    location: string
    hours: string
  }
  models: DesignModel[]
  addons: string[]
  orderSteps: OrderStep[]
  portfolio: PortfolioItem[]
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brand: {
    name: 'Bubu Balloon',
    subtitle: 'Decoration',
    heroBadge: 'Party Balloon Decoration • Malang & Surabaya',
    heroTitle: 'Dekorasi Balon',
    heroHighlight: 'Lucu & Elegan.',
    heroSubtitle:
      'Pilih model favorit atau susun konsep 2D sendiri — tim Bubu siap dekor di Malang, Surabaya & sekitarnya.',
    whatsappNumber: '6285122997943',
    instagram: '@bububalloon.decor',
    location: 'Malang, Surabaya & Sekitarnya',
    hours: 'Setiap Hari, 09.00 – 20.00 WIB',
  },
  models: [
    {
      id: 'blush-ribbon-signature',
      name: 'Blush & Navy Ribbon',
      category: 'Ulang Tahun',
      tag: 'Best Seller',
      size: '2,4m × 2,2m',
      description: 'Double arch cream-blush dengan organic garland, pita satin, dan silinder garis 80×40.',
      image: '',
      colors: ['#FDEBED', '#EFAAB6', '#162A4C', '#FFFDFC'],
      includes: ['Double Arch Backdrop', 'Organic Garland 4,5m', 'Silinder Garis 80×40', 'Lampu Sorot Bawah'],
      studioPresetId: 'bubu-signature',
    },
    {
      id: 'sweet-17-glow',
      name: 'Champagne 17 Shimmer',
      category: 'Sweet 17',
      tag: 'Sweet 17',
      size: '2m × 2m',
      description: 'Sequin shimmer wall 2×2m berkilau, angka lampu 17 menyala, dan meja emas kaki silang.',
      image: '',
      colors: ['#DFBE8A', '#FFFDFC', '#EFAAB6', '#162A4C'],
      includes: ['Shimmer Wall 2×2m', 'Garland Chrome & Blush', 'Angka Lampu 2 Digit', 'Meja Emas Kaki Silang'],
      studioPresetId: 'sweet-17-glow',
    },
    {
      id: 'pastel-cloud-dream',
      name: 'Teddy Pastel Cloud',
      category: 'Kids & Baby',
      tag: 'Kids & Baby',
      size: '2m × 1,9m',
      description: 'Panel oval 2×1m & 1,5×0,9m dengan boneka teddy bear, silinder 80×40 & 60×25.',
      image: '',
      colors: ['#F7E6B5', '#BFDDF0', '#F4C6D0', '#FFF9F0'],
      includes: ['Oval 2×1m & 1,5×0,9m', 'Garland Pastel', 'Silinder 80×40 & 60×25', 'Boneka Teddy & Nama'],
      studioPresetId: 'pastel-cloud',
    },
    {
      id: 'bridal-rose-intimate',
      name: 'Rose Satin Intimate',
      category: 'Intimate & Bridal',
      tag: 'Intimate',
      size: '2m × 2m',
      description: 'Backdrop bulat 2×2m elegan dengan meja acrylic bening, buket bunga, dan pita satin.',
      image: '',
      colors: ['#FFFDFC', '#EFAAB6', '#DFBE8A', '#D98395'],
      includes: ['Backdrop Bulat 2×2m', 'Organic Garland + Pita', 'Meja Acrylic Kotak', 'Lampu Sorot Bawah'],
      studioPresetId: 'bridal-intimate',
    },
  ],
  addons: [
    'Angka Lampu Marquee',
    'Backdrop Sequin Shimmer Wall',
    'Custom Banner Backdrop',
    'Meja Acrylic Kotak',
    'Meja Emas Kaki Silang',
    'Lampu Sorot Bawah Backdrop',
    'Boneka Teddy / Props Karakter',
  ],
  orderSteps: [
    {
      step: '01',
      title: 'Pilih Model / Studio 2D',
      description: 'Pilih katalog paket atau susun konsep tempel-tempel di Studio 2D.',
    },
    {
      step: '02',
      title: 'Chat & Cek Tanggal',
      description: 'Kirim konsep, tanggal, dan lokasi acara (Malang / Surabaya) ke WhatsApp.',
    },
    {
      step: '03',
      title: 'Konfirmasi & DP',
      description: 'Sepakati warna, properti & tulisan nama, lalu kunci jadwal acaramu.',
    },
    {
      step: '04',
      title: 'Tim Datang & Beres',
      description: 'Instalasi rapi sebelum acara dimulai, bongkar properti setelah selesai.',
    },
  ],
  portfolio: [
    {
      id: 'p1',
      title: "Nadia's 23rd Blush",
      eventType: 'Birthday',
      location: 'Kota Malang',
      image: '',
      presetId: 'bubu-signature',
      palette: ['#FDEBED', '#EFAAB6', '#162A4C'],
    },
    {
      id: 'p2',
      title: 'Clarissa Sweet 17',
      eventType: 'Sweet 17',
      location: 'Surabaya Barat',
      image: '',
      presetId: 'sweet-17-glow',
      palette: ['#DFBE8A', '#FFFDFC', '#EFAAB6'],
    },
    {
      id: 'p3',
      title: "Baby Theo's 1st",
      eventType: 'Kids Party',
      location: 'Kota Batu',
      image: '',
      presetId: 'pastel-cloud',
      palette: ['#F7E6B5', '#BFDDF0', '#F4C6D0'],
    },
    {
      id: 'p4',
      title: 'Intimate Bridal Soirée',
      eventType: 'Bridal Shower',
      location: 'Sidoarjo / Surabaya',
      image: '',
      presetId: 'bridal-intimate',
      palette: ['#FFFDFC', '#EFAAB6', '#DFBE8A'],
    },
  ],
}

export const SITE_CONFIG_STORAGE_KEY = 'bubu-balloon-site-config-v3'
const ADMIN_AUTH_STORAGE_KEY = 'bubu-balloon-github-admin-v1'
const UNSAVED_FLAG_STORAGE_KEY = 'bubu-balloon-unsaved-v1'

interface AdminSession {
  token: string
  repo: string
  username: string
}

interface SiteConfigContextValue {
  config: SiteConfig
  updateConfig: (updater: (prev: SiteConfig) => SiteConfig) => void
  resetConfig: () => void
  buildWhatsAppUrl: (message: string) => string
  // Admin GitHub Auth & Sync
  isAdmin: boolean
  adminUser: string | null
  adminRepo: string
  hasUnsavedChanges: boolean
  isSyncingRemote: boolean
  loginAdmin: (token: string, repo?: string) => Promise<{ ok: boolean; error?: string }>
  logoutAdmin: () => void
  publishToGithub: (overrideConfig?: SiteConfig) => Promise<{ ok: boolean; commitUrl?: string; error?: string }>
  saveModelAndPublish: (
    newModel: DesignModel
  ) => Promise<{ ok: boolean; totalModels: number; error?: string }>
  syncFromGithub: () => Promise<boolean>
  isPublishing: boolean
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null)

function mergeConfig(parsed: Partial<SiteConfig>): SiteConfig {
  return {
    ...DEFAULT_SITE_CONFIG,
    ...parsed,
    brand: { ...DEFAULT_SITE_CONFIG.brand, ...(parsed.brand ?? {}) },
  }
}

function loadConfigFromStorage(): SiteConfig {
  try {
    const raw = localStorage.getItem(SITE_CONFIG_STORAGE_KEY)
    if (!raw) return DEFAULT_SITE_CONFIG
    return mergeConfig(JSON.parse(raw) as Partial<SiteConfig>)
  } catch {
    return DEFAULT_SITE_CONFIG
  }
}

function loadAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AdminSession>
    if (parsed.token && parsed.repo && parsed.username) {
      return parsed as AdminSession
    }
    return null
  } catch {
    return null
  }
}

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(loadConfigFromStorage)
  const [adminSession, setAdminSession] = useState<AdminSession | null>(loadAdminSession)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSyncingRemote, setIsSyncingRemote] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(() => {
    try {
      return localStorage.getItem(UNSAVED_FLAG_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  const markUnsaved = (dirty: boolean) => {
    setHasUnsavedChanges(dirty)
    try {
      if (dirty) {
        localStorage.setItem(UNSAVED_FLAG_STORAGE_KEY, '1')
      } else {
        localStorage.removeItem(UNSAVED_FLAG_STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }

  const syncFromGithub = async (): Promise<boolean> => {
    setIsSyncingRemote(true)
    try {
      const repo = adminSession?.repo ?? DEFAULT_GITHUB_REPO
      const data = await fetchLiveSiteConfig(repo, undefined, adminSession?.token)
      if (data && data.brand) {
        setConfig(mergeConfig(data))
        markUnsaved(false)
        return true
      }
      return false
    } finally {
      setIsSyncingRemote(false)
    }
  }

  // Always fetch latest published config from GitHub API on mount.
  // For logged-in Admin: preserve any local custom packages not yet published to GitHub
  // (union merge) and flag unsaved changes so PC packages are NEVER lost!
  useEffect(() => {
    const repo = adminSession?.repo ?? DEFAULT_GITHUB_REPO
    fetchLiveSiteConfig(repo, undefined, adminSession?.token)
      .then((data) => {
        if (!data || !data.brand) return
        const remoteConfig = mergeConfig(data)

        if (adminSession) {
          const local = loadConfigFromStorage()
          const remoteIds = new Set(remoteConfig.models.map((m) => m.id))
          const localOnlyCustom = local.models.filter(
            (m) => m.id.startsWith('pkg-') && !remoteIds.has(m.id)
          )
          if (localOnlyCustom.length > 0) {
            setConfig({
              ...remoteConfig,
              models: [...localOnlyCustom, ...remoteConfig.models],
            })
            markUnsaved(true)
            return
          }
          const dirtyOnThisDevice = (() => {
            try {
              return localStorage.getItem(UNSAVED_FLAG_STORAGE_KEY) === '1'
            } catch {
              return false
            }
          })()
          if (dirtyOnThisDevice) return
        }

        setConfig(remoteConfig)
        markUnsaved(false)
      })
      .catch(() => {
        // Fallback silently to cached/default config
      })
  }, [adminSession])

  useEffect(() => {
    try {
      localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(config))
    } catch {
      // Ignore quota errors
    }
  }, [config])

  // Real-time sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SITE_CONFIG_STORAGE_KEY) {
        setConfig(loadConfigFromStorage())
      } else if (e.key === ADMIN_AUTH_STORAGE_KEY) {
        setAdminSession(loadAdminSession())
      } else if (e.key === UNSAVED_FLAG_STORAGE_KEY) {
        setHasUnsavedChanges(e.newValue === '1')
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const updateConfig = (updater: (prev: SiteConfig) => SiteConfig) => {
    setConfig((prev) => updater(prev))
    markUnsaved(true)
  }

  const resetConfig = () => {
    setConfig(DEFAULT_SITE_CONFIG)
    markUnsaved(true)
    try {
      localStorage.removeItem(SITE_CONFIG_STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const loginAdmin = async (token: string, repo: string = DEFAULT_GITHUB_REPO) => {
    const res = await verifyGithubAdminToken(token, repo)
    if (!res.ok) return { ok: false, error: res.error }

    const session: AdminSession = {
      token: token.trim(),
      repo: repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, ''),
      username: res.username || 'Admin',
    }
    setAdminSession(session)
    try {
      localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(session))
    } catch {
      // ignore
    }
    return { ok: true }
  }

  const logoutAdmin = () => {
    setAdminSession(null)
    try {
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const publishToGithub = async (overrideConfig?: SiteConfig) => {
    if (!adminSession) {
      return { ok: false, error: 'Silakan login sebagai Admin GitHub terlebih dahulu.' }
    }
    setIsPublishing(true)
    try {
      const res = await publishSiteConfigToGithub(
        adminSession.token,
        overrideConfig ?? config,
        adminSession.repo
      )
      if (res.ok) {
        markUnsaved(false)
      }
      return res
    } finally {
      setIsPublishing(false)
    }
  }

  /**
   * Bulletproof package save from Studio 2D:
   * Merges latest models from BOTH localStorage AND live GitHub before upserting newModel,
   * so creating multiple packages across tabs can NEVER drop previously created packages!
   */
  const saveModelAndPublish = async (
    newModel: DesignModel
  ): Promise<{ ok: boolean; totalModels: number; error?: string }> => {
    const latestLocal = loadConfigFromStorage()
    let baseModels: DesignModel[] = [...latestLocal.models]
    let baseConfig: SiteConfig = latestLocal

    if (adminSession) {
      try {
        const remote = await fetchLiveSiteConfig(adminSession.repo, undefined, adminSession.token)
        if (remote?.models && Array.isArray(remote.models)) {
          // Union merge: preserve all local models + any remote models missing locally
          const seenIds = new Set(baseModels.map((m) => m.id))
          for (const rm of remote.models) {
            if (!seenIds.has(rm.id)) {
              baseModels.push(rm)
              seenIds.add(rm.id)
            }
          }
          baseConfig = mergeConfig({ ...remote, ...latestLocal, models: baseModels })
        }
      } catch {
        // Proceed with latest local models
      }
    }

    const exists = baseModels.some((m) => m.id === newModel.id)
    const mergedModels = exists
      ? baseModels.map((m) => (m.id === newModel.id ? newModel : m))
      : [newModel, ...baseModels]

    const nextConfig: SiteConfig = {
      ...baseConfig,
      models: mergedModels,
    }

    setConfig(nextConfig)
    try {
      localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(nextConfig))
    } catch {
      // ignore quota error
    }

    if (!adminSession) {
      markUnsaved(true)
      return {
        ok: false,
        totalModels: mergedModels.length,
        error: 'Login Admin GitHub di ikon Gear dulu agar tersimpan ke HP.',
      }
    }

    const res = await publishToGithub(nextConfig)
    return {
      ok: res.ok,
      totalModels: mergedModels.length,
      error: res.error,
    }
  }

  const normalizeWhatsAppNumber = (raw: string): string => {
    const digits = (raw || '').replace(/\D/g, '')
    if (!digits) return '6285122997943'
    if (digits.startsWith('0')) return `62${digits.slice(1)}`
    if (digits.startsWith('8')) return `62${digits}`
    return digits
  }

  const buildWhatsAppUrl = (message: string) => {
    const phone = normalizeWhatsAppNumber(config.brand.whatsappNumber)
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
  }

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        buildWhatsAppUrl,
        isAdmin: Boolean(adminSession),
        adminUser: adminSession?.username ?? null,
        adminRepo: adminSession?.repo ?? DEFAULT_GITHUB_REPO,
        hasUnsavedChanges,
        isSyncingRemote,
        loginAdmin,
        logoutAdmin,
        publishToGithub,
        saveModelAndPublish,
        syncFromGithub,
        isPublishing,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext)
  if (!ctx) throw new Error('useSiteConfig must be used inside SiteConfigProvider')
  return ctx
}
