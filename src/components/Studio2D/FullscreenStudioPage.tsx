import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Undo2,
  Redo2,
  Trash2,
  Copy,
  FlipHorizontal2,
  ArrowUp,
  ArrowDown,
  Download,
  Send,
  Layers,
  LayoutTemplate,
  Image as ImageIcon,
  Plus,
  RotateCw,
  Upload,
  ArrowLeft,
  Settings,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  Bookmark,
  FolderOpen,
  PackagePlus,
  Check,
  AlignHorizontalJustifyCenter,
  Grid3X3,
  Lock,
  KeyRound,
  LogOut,
  CloudUpload,
  Loader2,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Palette,
} from 'lucide-react'
import { DEFAULT_GITHUB_REPO } from '../../lib/githubSync'
import {
  CanvasElement,
  ROOM_BACKGROUNDS,
  RoomBackgroundOverlay,
  STICKER_DEFINITIONS,
  STUDIO_PALETTE,
  STUDIO_PRESETS,
  TEXT_FONTS,
  StickerCategory,
  StickerDefinition,
  StickerSVG,
  StickerType,
} from './stickerLibrary'
import { useSiteConfig, DesignModel } from '../../context/SiteConfigContext'

type SidebarTab = 'elemen' | 'template' | 'latar'
const ELEMENT_CATEGORIES: StickerCategory[] = ['Backdrop', 'Balon', 'Properti']

interface StudioColorTheme {
  id: string
  label: string
  backdrop: string
  balloonPrimary: string
  balloonSecondary: string
  accent: string
}

const STUDIO_COLOR_THEMES: StudioColorTheme[] = [
  {
    id: 'blush',
    label: 'Blush Pastel',
    backdrop: '#FFF5F7',
    balloonPrimary: '#F2B3BD',
    balloonSecondary: '#FCE4E8',
    accent: '#DFBE8A',
  },
  {
    id: 'navy-gold',
    label: 'Royal Navy',
    backdrop: '#162A4C',
    balloonPrimary: '#DFBE8A',
    balloonSecondary: '#FFF9FA',
    accent: '#D98395',
  },
  {
    id: 'sage',
    label: 'Sage Cream',
    backdrop: '#F3EFE6',
    balloonPrimary: '#B8D4BE',
    balloonSecondary: '#FFFDF8',
    accent: '#DFBE8A',
  },
  {
    id: 'baby-blue',
    label: 'Baby Sky',
    backdrop: '#EFF6FC',
    balloonPrimary: '#A9D1EC',
    balloonSecondary: '#FFFDFC',
    accent: '#DFBE8A',
  },
  {
    id: 'lavender',
    label: 'Lilac Dream',
    backdrop: '#F5EFFC',
    balloonPrimary: '#CFC0EE',
    balloonSecondary: '#F8D6E0',
    accent: '#DFBE8A',
  },
  {
    id: 'terracotta',
    label: 'Boho Latte',
    backdrop: '#F8EFE6',
    balloonPrimary: '#D99B82',
    balloonSecondary: '#EAD4C0',
    accent: '#C99B63',
  },
]

const STUDIO_SETTINGS_KEY = 'bubu-studio-2d-settings-v2'
const STUDIO_DRAFTS_KEY = 'bubu-studio-2d-drafts-v1'

interface StudioCustomSettings {
  hiddenTypes: StickerType[]
  customLabels: Partial<Record<StickerType, string>>
  hiddenPresetIds: string[]
  hiddenBgIds: string[]
}

interface SavedDraft {
  id: string
  name: string
  backgroundId: string
  elements: CanvasElement[]
  savedAt: string
}

const DEFAULT_STUDIO_SETTINGS: StudioCustomSettings = {
  hiddenTypes: [],
  customLabels: {},
  hiddenPresetIds: [],
  hiddenBgIds: [],
}

interface FullscreenStudioPageProps {
  initialPresetId?: string | null
  initialModelId?: string | null
  createPackageMode?: boolean
}

export default function FullscreenStudioPage({
  initialPresetId,
  initialModelId,
  createPackageMode = false,
}: FullscreenStudioPageProps) {
  const {
    config,
    buildWhatsAppUrl,
    isAdmin,
    adminUser,
    adminRepo,
    loginAdmin,
    logoutAdmin,
    saveModelAndPublish,
    isPublishing,
  } = useSiteConfig()

  const [tokenInput, setTokenInput] = useState('')
  const [repoInput, setRepoInput] = useState(adminRepo || DEFAULT_GITHUB_REPO)
  const [verifyingToken, setVerifyingToken] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [pkgPublishMsg, setPkgPublishMsg] = useState<string | null>(null)

  const existingModel = initialModelId
    ? config.models.find((m) => m.id === initialModelId)
    : undefined
  const initialPreset =
    STUDIO_PRESETS.find((p) => p.id === initialPresetId) ?? STUDIO_PRESETS[0]

  const startElements = existingModel?.customStudioElements?.length
    ? existingModel.customStudioElements
    : createPackageMode
      ? []
      : initialPreset.elements
  const startBgId = existingModel?.customStudioBgId || initialPreset.backgroundId

  const [elements, setElements] = useState<CanvasElement[]>(startElements)
  const [history, setHistory] = useState<CanvasElement[][]>([startElements])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [backgroundId, setBackgroundId] = useState<string>(startBgId)
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null)
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('elemen')
  const [activeCategory, setActiveCategory] = useState<StickerCategory>('Backdrop')
  const [colorSlot, setColorSlot] = useState<'primary' | 'secondary'>('primary')
  const [showGrid, setShowGrid] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isCompactLandscape, setIsCompactLandscape] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-height: 540px) and (orientation: landscape)').matches
      : false
  )
  const [layersPopoverOpen, setLayersPopoverOpen] = useState(false)
  const [textModalOpen, setTextModalOpen] = useState(false)
  const [snapGuide, setSnapGuide] = useState<{ x: boolean; y: boolean }>({ x: false, y: false })
  const [toast, setToast] = useState<string | null>(null)
  const [studioSettingsOpen, setStudioSettingsOpen] = useState(false)
  const [studioSettingsTab, setStudioSettingsTab] = useState<'elemen' | 'template' | 'latar'>('elemen')
  const [mobileSheet, setMobileSheet] = useState<SidebarTab | null>(null)

  // Save as Homepage Package modal state
  const [pkgModalOpen, setPkgModalOpen] = useState(false)
  const [pkgName, setPkgName] = useState(existingModel?.name ?? '')
  const [pkgCategory, setPkgCategory] = useState<DesignModel['category']>(
    existingModel?.category ?? 'Ulang Tahun'
  )
  const [pkgSize, setPkgSize] = useState(existingModel?.size ?? '2,4m × 2,2m')
  const [pkgTag, setPkgTag] = useState(existingModel?.tag ?? 'Baru')
  const [pkgDesc, setPkgDesc] = useState(existingModel?.description ?? '')
  const [pkgSpecsText, setPkgSpecsText] = useState('')
  const [pkgSavedDone, setPkgSavedDone] = useState(false)

  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>(() => {
    try {
      const raw = localStorage.getItem(STUDIO_DRAFTS_KEY)
      return raw ? (JSON.parse(raw) as SavedDraft[]) : []
    } catch {
      return []
    }
  })

  const [studioSettings, setStudioSettings] = useState<StudioCustomSettings>(() => {
    try {
      const raw = localStorage.getItem(STUDIO_SETTINGS_KEY)
      return raw ? { ...DEFAULT_STUDIO_SETTINGS, ...JSON.parse(raw) } : DEFAULT_STUDIO_SETTINGS
    } catch {
      return DEFAULT_STUDIO_SETTINGS
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STUDIO_SETTINGS_KEY, JSON.stringify(studioSettings))
    } catch {
      // ignore
    }
  }, [studioSettings])

  useEffect(() => {
    try {
      localStorage.setItem(STUDIO_DRAFTS_KEY, JSON.stringify(savedDrafts))
    } catch {
      // ignore
    }
  }, [savedDrafts])

  const stageRef = useRef<HTMLDivElement>(null)
  const bgFileInputRef = useRef<HTMLInputElement>(null)
  const pngPropInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const dragStateRef = useRef<{
    mode: 'move' | 'resize' | 'rotate'
    id: string
    startClientX: number
    startClientY: number
    startX: number
    startY: number
    startWidth: number
    startRotation: number
    centerX: number
    centerY: number
    startAngle: number
  } | null>(null)

  const pinchRef = useRef<{
    startDist: number
    startZoom: number
    startMidX: number
    startMidY: number
    startPanX: number
    startPanY: number
  } | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-height: 540px) and (orientation: landscape)')
    const onChange = () => setIsCompactLandscape(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const resetViewport = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleViewportTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Cancel any single-element drag so 2-finger pinch-to-zoom is silky smooth!
      dragStateRef.current = null
      const t1 = e.touches[0]
      const t2 = e.touches[1]
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
      pinchRef.current = {
        startDist: Math.max(10, dist),
        startZoom: zoom,
        startMidX: (t1.clientX + t2.clientX) / 2,
        startMidY: (t1.clientY + t2.clientY) / 2,
        startPanX: pan.x,
        startPanY: pan.y,
      }
    }
  }

  const handleViewportTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault()
      const t1 = e.touches[0]
      const t2 = e.touches[1]
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
      const midX = (t1.clientX + t2.clientX) / 2
      const midY = (t1.clientY + t2.clientY) / 2

      const nextZoom = Math.max(0.65, Math.min(2.5, pinchRef.current.startZoom * (dist / pinchRef.current.startDist)))
      setZoom(Number(nextZoom.toFixed(3)))
      setPan({
        x: Math.max(-320, Math.min(320, pinchRef.current.startPanX + (midX - pinchRef.current.startMidX))),
        y: Math.max(-220, Math.min(220, pinchRef.current.startPanY + (midY - pinchRef.current.startMidY))),
      })
    }
  }

  const handleViewportTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      pinchRef.current = null
    }
  }

  const handleViewportWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = -e.deltaY * 0.005
      setZoom((z) => Number(Math.max(0.65, Math.min(2.5, z + delta)).toFixed(3)))
    }
  }

  const currentBg = ROOM_BACKGROUNDS.find((b) => b.id === backgroundId) ?? ROOM_BACKGROUNDS[0]
  const selectedEl = elements.find((el) => el.id === selectedId) ?? null
  const selectedDef = selectedEl
    ? STICKER_DEFINITIONS.find((d) => d.type === selectedEl.type)
    : null

  // Reset secondary color tab if switching to single-color sticker
  useEffect(() => {
    setColorSlot('primary')
  }, [selectedId])

  const getStickerLabel = (def: StickerDefinition) =>
    studioSettings.customLabels[def.type]?.trim() || def.label

  const getElementDisplayName = (el: CanvasElement) => {
    if (el.type === 'custom-png') return 'Karakter PNG'
    const def = STICKER_DEFINITIONS.find((d) => d.type === el.type)
    return def ? getStickerLabel(def) : el.type
  }

  const visibleStickers = STICKER_DEFINITIONS.filter(
    (s) => !studioSettings.hiddenTypes.includes(s.type)
  )
  const visiblePresets = STUDIO_PRESETS.filter(
    (p) => !studioSettings.hiddenPresetIds.includes(p.id)
  )
  const visibleBgs = ROOM_BACKGROUNDS.filter(
    (b) => !studioSettings.hiddenBgIds.includes(b.id)
  )

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const commitElements = (next: CanvasElement[]) => {
    setElements(next)
    const sliced = history.slice(0, historyIndex + 1)
    sliced.push(next)
    setHistory(sliced)
    setHistoryIndex(sliced.length - 1)
  }

  useEffect(() => {
    document.title = `Studio 2D Fullscreen — ${config.brand.name}`
  }, [config.brand.name])

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        handleUndo()
        return
      }
      if (!selectedId) return

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        duplicateSelected()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        deleteSelected()
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const dx = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0
        const dy = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0
        commitElements(
          elements.map((el) =>
            el.id === selectedId
              ? {
                  ...el,
                  x: Math.max(4, Math.min(96, el.x + dx)),
                  y: Math.max(6, Math.min(94, el.y + dy)),
                }
              : el
          )
        )
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, elements, historyIndex])

  const handleUndo = () => {
    if (historyIndex <= 0) return
    const nextIdx = historyIndex - 1
    setHistoryIndex(nextIdx)
    setElements(history[nextIdx])
    setSelectedId(null)
  }

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return
    const nextIdx = historyIndex + 1
    setHistoryIndex(nextIdx)
    setElements(history[nextIdx])
    setSelectedId(null)
  }

  // SMART AUTO-LAYERING: Backdrops & Uplights automatically go to the back; Balloons/Props on top!
  const addSticker = (def: StickerDefinition) => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: def.type,
      x: 50,
      y: def.category === 'Backdrop' ? 51 : def.type === 'uplight-spot' ? 69 : 54,
      width: def.defaultWidth,
      rotation: 0,
      color: def.defaultColor,
      secondaryColor: def.defaultSecondary ?? def.defaultColor,
      text: def.defaultText,
    }

    let next: CanvasElement[]
    if (def.type === 'uplight-spot') {
      next = [newEl, ...elements]
    } else if (def.category === 'Backdrop') {
      // Insert right after uplights, behind balloons & tables
      const firstNonBgIdx = elements.findIndex((el) => {
        const d = STICKER_DEFINITIONS.find((s) => s.type === el.type)
        return el.type !== 'uplight-spot' && d?.category !== 'Backdrop'
      })
      if (firstNonBgIdx === -1) next = [...elements, newEl]
      else next = [...elements.slice(0, firstNonBgIdx), newEl, ...elements.slice(firstNonBgIdx)]
    } else {
      next = [...elements, newEl]
    }

    commitElements(next)
    setSelectedId(newEl.id)
    setMobileSheet(null)
  }

  const handleCustomPngUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'image/png') {
      showToast('Gunakan file PNG tanpa background (transparan) ya! ⚠️')
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      const newEl: CanvasElement = {
        id: `png-${Date.now()}`,
        type: 'custom-png',
        x: 50,
        y: 58,
        width: 18,
        rotation: 0,
        color: '#FFFFFF',
        customImageUrl: reader.result,
      }
      commitElements([...elements, newEl])
      setSelectedId(newEl.id)
      setMobileSheet(null)
      showToast('Properti PNG berhasil ditempel! ✨')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleBackdropBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedId) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      updateSelected({ customImageUrl: reader.result })
      showToast('Gambar banner dipasang ke backdrop! 🖼️')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSaveDraft = () => {
    const draftName = `Desain #${savedDrafts.length + 1} (${currentBg.label})`
    const draft: SavedDraft = {
      id: `draft-${Date.now()}`,
      name: draftName,
      backgroundId,
      elements,
      savedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }
    setSavedDrafts((prev) => [draft, ...prev.slice(0, 7)])
    showToast(`Disimpan ke Template → "${draftName}" 💾`)
  }

  const openSavePackageModal = () => {
    const uniqueSpecs = Array.from(new Set(elements.map((el) => getElementDisplayName(el))))
    if (!pkgSpecsText) {
      setPkgSpecsText(uniqueSpecs.slice(0, 5).join(', '))
    }
    setPkgSavedDone(false)
    setStudioSettingsOpen(false)
    setPkgModalOpen(true)
  }

  const handleStudioAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setTokenError(null)
    setVerifyingToken(true)
    const res = await loginAdmin(tokenInput, repoInput)
    setVerifyingToken(false)
    if (!res.ok) setTokenError(res.error || 'Token GitHub tidak valid.')
    else setTokenInput('')
  }

  const handleSaveAsHomepagePackage = async () => {
    const cleanName = pkgName.trim() || `Paket Custom ${config.models.length + 1}`
    const specs = pkgSpecsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const palette = Array.from(new Set(elements.map((e) => e.color).filter(Boolean))).slice(0, 4)

    const newModel: DesignModel = {
      id: existingModel ? existingModel.id : `pkg-${Date.now()}`,
      name: cleanName,
      category: pkgCategory,
      tag: pkgTag.trim() || 'Baru',
      size: pkgSize.trim() || '2,4m × 2,2m',
      description:
        pkgDesc.trim() || 'Desain dekorasi balon modern yang dibuat langsung di Studio 2D Bubu.',
      image: '',
      colors: palette.length > 0 ? palette : ['#FDEBED', '#EFAAB6', '#162A4C'],
      includes: specs.length > 0 ? specs : ['Custom Backdrop', 'Organic Garland'],
      studioPresetId: 'bubu-signature',
      customStudioElements: elements,
      customStudioBgId: backgroundId,
    }

    setPkgSavedDone(true)
    setPkgPublishMsg('Menyimpan & menyinkronkan semua paket ke GitHub...')

    const res = await saveModelAndPublish(newModel)
    if (res.ok) {
      setPkgPublishMsg(
        `✅ Berhasil ter-publish ke GitHub! Semua ${res.totalModels} paket langsung muncul di HP & PC 🚀`
      )
    } else {
      setPkgPublishMsg(`⚠️ Tersimpan di PC saja (${res.error || 'gagal publish ke GitHub'}).`)
    }
    showToast(`Paket "${cleanName}" berhasil disimpan! 🎉`)
  }

  const updateSelected = (patch: Partial<CanvasElement>, recordHistory = true) => {
    if (!selectedId) return
    const next = elements.map((el) => (el.id === selectedId ? { ...el, ...patch } : el))
    if (recordHistory) commitElements(next)
    else setElements(next)
  }

  const duplicateSelected = () => {
    if (!selectedEl) return
    const copy: CanvasElement = {
      ...selectedEl,
      id: `el-${Date.now()}`,
      x: Math.min(92, selectedEl.x + 4),
      y: Math.min(90, selectedEl.y + 4),
    }
    commitElements([...elements, copy])
    setSelectedId(copy.id)
  }

  const deleteSelected = () => {
    if (!selectedId) return
    commitElements(elements.filter((el) => el.id !== selectedId))
    setSelectedId(null)
  }

  const shiftLayer = (direction: 'up' | 'down') => {
    if (!selectedId) return
    const idx = elements.findIndex((el) => el.id === selectedId)
    if (idx === -1) return
    const targetIdx = direction === 'up' ? idx + 1 : idx - 1
    if (targetIdx < 0 || targetIdx >= elements.length) return
    const next = [...elements]
    const [moved] = next.splice(idx, 1)
    next.splice(targetIdx, 0, moved)
    commitElements(next)
  }

  const loadPreset = (presetId: string) => {
    const preset = STUDIO_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setBackgroundId(preset.backgroundId)
    setCustomBgUrl(null)
    commitElements(preset.elements.map((e) => ({ ...e, id: `${e.id}-${Date.now()}` })))
    setSelectedId(null)
    setMobileSheet(null)
    showToast(`Template "${preset.name}" dimuat!`)
  }

  const loadHomepageModelAsTemplate = (model: DesignModel) => {
    if (model.customStudioElements && model.customStudioElements.length > 0) {
      setBackgroundId(model.customStudioBgId || 'blush')
      setCustomBgUrl(null)
      commitElements(
        model.customStudioElements.map((e) => ({ ...e, id: `${e.id}-${Date.now()}` }))
      )
      setSelectedId(null)
      setMobileSheet(null)
      showToast(`Template Paket "${model.name}" dimuat! ✨`)
      return
    }
    loadPreset(model.studioPresetId)
  }

  const handleRoomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCustomBgUrl(URL.createObjectURL(file))
    setMobileSheet(null)
    showToast('Foto ruangan dipasang! 🏠')
    e.target.value = ''
  }

  // Smooth direct pointer manipulation: Move, Resize, AND Direct On-Canvas Rotate!
  const handleElementPointerDown = (
    e: React.PointerEvent,
    el: CanvasElement,
    mode: 'move' | 'resize' | 'rotate'
  ) => {
    e.stopPropagation()
    setSelectedId(el.id)
    const stage = stageRef.current
    const rect = stage?.getBoundingClientRect()
    const centerX = rect ? rect.left + (el.x / 100) * rect.width : e.clientX
    const centerY = rect ? rect.top + (el.y / 100) * rect.height : e.clientY
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)

    dragStateRef.current = {
      mode,
      id: el.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: el.x,
      startY: el.y,
      startWidth: el.width,
      startRotation: el.rotation,
      centerX,
      centerY,
      startAngle,
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handleStagePointerMove = (e: React.PointerEvent) => {
    const drag = dragStateRef.current
    const stage = stageRef.current
    if (!drag || !stage) return

    const rect = stage.getBoundingClientRect()
    const dxPct = ((e.clientX - drag.startClientX) / rect.width) * 100
    const dyPct = ((e.clientY - drag.startClientY) / rect.height) * 100

    let snapX = false
    let snapY = false

    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== drag.id) return el
        if (drag.mode === 'move') {
          let nx = Math.max(4, Math.min(96, drag.startX + dxPct))
          let ny = Math.max(6, Math.min(94, drag.startY + dyPct))
          if (Math.abs(nx - 50) < 1.8) {
            nx = 50
            snapX = true
          }
          if (Math.abs(ny - 50) < 1.8) {
            ny = 50
            snapY = true
          }
          return { ...el, x: nx, y: ny }
        }
        if (drag.mode === 'rotate') {
          const curAngle =
            Math.atan2(e.clientY - drag.centerY, e.clientX - drag.centerX) * (180 / Math.PI)
          let deg = Math.round(drag.startRotation + (curAngle - drag.startAngle))
          // Gentle snap to 0°, 90°, -90°
          if (Math.abs(deg) < 5) deg = 0
          return { ...el, rotation: deg }
        }
        return {
          ...el,
          width: Math.max(6, Math.min(72, drag.startWidth + dxPct * 1.45)),
        }
      })
    )
    setSnapGuide({ x: snapX, y: snapY })
  }

  const handleStagePointerUp = () => {
    if (!dragStateRef.current) return
    dragStateRef.current = null
    setSnapGuide({ x: false, y: false })
    commitElements(elements)
  }

  const handleDownloadPNG = async () => {
    const stage = stageRef.current
    if (!stage) return

    const exportW = 1600
    const exportH = 1000
    const canvas = document.createElement('canvas')
    canvas.width = exportW
    canvas.height = exportH
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bgImageSrc = customBgUrl || currentBg.imageUrl
    if (bgImageSrc) {
      await new Promise<void>((resolve) => {
        const bgImg = new Image()
        bgImg.crossOrigin = 'anonymous'
        bgImg.onload = () => {
          const scale = Math.max(exportW / bgImg.width, exportH / bgImg.height)
          const dw = bgImg.width * scale
          const dh = bgImg.height * scale
          ctx.drawImage(bgImg, (exportW - dw) / 2, (exportH - dh) / 2, dw, dh)
          resolve()
        }
        bgImg.onerror = () => resolve()
        bgImg.src = bgImageSrc
      })
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, exportH * 0.78)
      grad.addColorStop(0, currentBg.wallTop)
      grad.addColorStop(1, currentBg.wallBottom)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, exportW, exportH)
      ctx.fillStyle = currentBg.floor
      ctx.fillRect(0, exportH * 0.78, exportW, exportH * 0.22)

      const bgOverlaySvg = stage.querySelector<SVGSVGElement>('[data-room-overlay] svg')
      if (bgOverlaySvg) {
        const clonedOverlay = bgOverlaySvg.cloneNode(true) as SVGSVGElement
        clonedOverlay.setAttribute('width', String(exportW))
        clonedOverlay.setAttribute('height', String(exportH))
        clonedOverlay.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        const str = new XMLSerializer().serializeToString(clonedOverlay)
        const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        await new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0, exportW, exportH)
            URL.revokeObjectURL(url)
            resolve()
          }
          img.onerror = () => {
            URL.revokeObjectURL(url)
            resolve()
          }
          img.src = url
        })
      }
    }

    const stageNodes = stage.querySelectorAll<HTMLElement>('[data-sticker-id]')
    for (const node of Array.from(stageNodes)) {
      const id = node.dataset.stickerId
      const el = elements.find((item) => item.id === id)
      const svgEl = node.querySelector('svg')
      if (!el || !svgEl) continue

      const clonedSvg = svgEl.cloneNode(true) as SVGSVGElement
      const vb = clonedSvg.getAttribute('viewBox')?.split(' ').map(Number) ?? [0, 0, 100, 100]
      const aspect = vb[3] / vb[2]
      const drawW = (el.width / 100) * exportW
      const drawH = drawW * aspect
      clonedSvg.setAttribute('width', String(drawW))
      clonedSvg.setAttribute('height', String(drawH))
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

      const svgString = new XMLSerializer().serializeToString(clonedSvg)
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      await new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          ctx.save()
          ctx.translate((el.x / 100) * exportW, (el.y / 100) * exportH)
          ctx.rotate((el.rotation * Math.PI) / 180)
          if (el.flipX) ctx.scale(-1, 1)
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
          ctx.restore()
          URL.revokeObjectURL(url)
          resolve()
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          resolve()
        }
        img.src = url
      })
    }

    ctx.fillStyle = 'rgba(22, 42, 76, 0.5)'
    ctx.font = 'bold 24px Plus Jakarta Sans, sans-serif'
    ctx.fillText(`${config.brand.name} • Studio 2D`, 40, exportH - 32)

    const link = document.createElement('a')
    link.download = 'bubu-balloon-desain-2d.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast('Gambar PNG berhasil diunduh! 📸')
  }

  const designSummaryWaUrl = () => {
    const counts = elements.reduce<Record<string, number>>((acc, el) => {
      const label = getElementDisplayName(el)
      acc[label] = (acc[label] || 0) + 1
      return acc
    }, {})

    const itemsText = Object.entries(counts)
      .map(([label, qty]) => `• ${label} (${qty}x)`)
      .join('\n')

    const customTexts = elements
      .filter((e) => e.text)
      .map((e) => `"${e.text}"`)
      .join(', ')

    const msg = [
      `Halo Kak admin ${config.brand.name} 🎈`,
      `Saya baru saja membuat simulasi konsep dekorasi di *Studio 2D Website ${config.brand.name}*:`,
      '',
      `• Latar Venue: ${customBgUrl ? 'Foto Ruangan Sendiri' : currentBg.label}`,
      itemsText || '• (Konsep custom)',
      customTexts ? `• Tulisan / Angka: ${customTexts}` : null,
      '',
      '(Gambar hasil simulasi 2D saya lampirkan juga ya Kak 📸)',
      'Boleh dibantu info estimasi & cek jadwal kosongnya? Terima kasih! ✨',
    ]
      .filter(Boolean)
      .join('\n')

    return buildWhatsAppUrl(msg)
  }

  const hasSecondaryColor = (type: StickerType) =>
    type === 'garland-arch' ||
    type === 'balloon-cluster' ||
    type === 'double-arch' ||
    type === 'gold-cross-table'

  const handleApplyColor = (hex: string) => {
    if (!selectedEl) return
    if (colorSlot === 'secondary' && hasSecondaryColor(selectedEl.type)) {
      updateSelected({ secondaryColor: hex })
      return
    }
    if (
      (selectedEl.type === 'balloon-cluster' || selectedEl.type === 'garland-arch') &&
      selectedEl.secondaryColor === selectedEl.color
    ) {
      updateSelected({ color: hex, secondaryColor: hex })
    } else {
      updateSelected({ color: hex })
    }
  }

  const applyColorTheme = (theme: StudioColorTheme) => {
    if (elements.length === 0) {
      showToast('Tambahkan elemen dulu untuk ubah tema warna')
      return
    }
    const next = elements.map((el) => {
      if (
        el.type === 'arch-panel' ||
        el.type === 'arch-panel-small' ||
        el.type === 'circle-backdrop' ||
        el.type === 'square-backdrop-2x2' ||
        el.type === 'square-backdrop-2x3' ||
        el.type === 'double-arch' ||
        el.type === 'scallop-arch'
      ) {
        return {
          ...el,
          color: theme.backdrop,
          secondaryColor: theme.balloonSecondary,
        }
      }
      if (
        el.type === 'garland-arch' ||
        el.type === 'balloon-cluster' ||
        el.type === 'jumbo-balloon'
      ) {
        return {
          ...el,
          color: theme.balloonPrimary,
          secondaryColor: theme.balloonSecondary,
        }
      }
      if (el.type === 'number-balloon' || el.type === 'sequin-wall-2x2') {
        return { ...el, color: theme.accent }
      }
      return el
    })
    commitElements(next)
    setMobileSheet(null)
    showToast(`Tema warna "${theme.label}" diterapkan!`)
  }

  const renderSidebarContent = (tab: SidebarTab) => {
    if (tab === 'elemen') {
      return (
        <div className="space-y-3">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {ELEMENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#162A4C] text-white'
                    : 'bg-white text-[#162A4C]/70 border border-[#F2D5DC]/70 hover:bg-[#FDEBED]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {activeCategory === 'Properti' && (
            <div className="rounded-2xl border-2 border-dashed border-[#EFAAB6] bg-white p-2.5 space-y-1">
              <button
                type="button"
                onClick={() => pngPropInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-xl bg-[#FDEBED] hover:bg-[#F7D3DA] text-[#162A4C] text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#D98395]" />
                + Upload Karakter PNG
              </button>
              <p className="text-[10px] text-[#162A4C]/60 text-center">
                Wajib <strong>PNG tanpa background</strong> (transparan).
              </p>
            </div>
          )}

          <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
            {visibleStickers
              .filter((s) => s.category === activeCategory)
              .map((def) => (
                <button
                  key={def.type}
                  type="button"
                  onClick={() => addSticker(def)}
                  className="group p-2 rounded-2xl bg-white border border-[#F2D5DC]/65 hover:border-[#162A4C]/45 active:scale-95 transition-all flex flex-col items-center gap-1 cursor-pointer"
                >
                  <div className="w-11 h-11 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <StickerSVG
                      element={{
                        id: `lib-${def.type}`,
                        type: def.type,
                        x: 0,
                        y: 0,
                        width: 100,
                        rotation: 0,
                        color: def.defaultColor,
                        secondaryColor: def.defaultSecondary ?? def.defaultColor,
                        text: def.defaultText,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#162A4C] text-center leading-tight line-clamp-2">
                    {getStickerLabel(def)}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )
    }

    if (tab === 'template') {
      return (
        <div className="space-y-3.5">
          {/* Latest Homepage Packages as Live 2D Templates */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#D98395]">
              <Sparkles className="w-3 h-3" /> Template Paket Homepage
            </span>
            {config.models.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => loadHomepageModelAsTemplate(model)}
                className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-white border border-[#EFAAB6]/75 hover:border-[#162A4C] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-[#162A4C] truncate">
                    {model.name}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FDEBED] text-[#162A4C] shrink-0">
                    {model.size}
                  </span>
                </div>
                <span className="block text-[10px] text-[#162A4C]/55 mt-0.5 truncate">
                  {model.category} • {model.includes.slice(0, 2).join(', ')}
                </span>
              </button>
            ))}
          </div>

          {savedDrafts.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-[#FDEBED]">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#162A4C]/60">
                <FolderOpen className="w-3 h-3" /> Desain Tersimpanmu
              </span>
              {savedDrafts.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#EFAAB6]/60"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setBackgroundId(d.backgroundId)
                      setCustomBgUrl(null)
                      commitElements(d.elements)
                      setSelectedId(null)
                      setMobileSheet(null)
                      showToast(`Draft "${d.name}" dimuat!`)
                    }}
                    className="flex-1 text-left cursor-pointer"
                  >
                    <span className="block text-xs font-bold text-[#162A4C]">{d.name}</span>
                    <span className="block text-[10px] text-[#162A4C]/50">
                      {d.elements.length} elemen • {d.savedAt}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSavedDrafts((prev) => prev.filter((item) => item.id !== d.id))}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {visiblePresets.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-[#FDEBED]">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#162A4C]/45">
                Preset Bawaan
              </span>
              {visiblePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => loadPreset(preset.id)}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/80 border border-[#F2D5DC]/60 hover:border-[#162A4C] cursor-pointer"
                >
                  <span className="block text-xs font-bold text-[#162A4C]">{preset.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {/* One-Click Color Theme Harmony */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#D98395]">
            <Palette className="w-3 h-3" /> Ubah Tema Warna Sekaligus
          </span>
          <div className="grid grid-cols-3 lg:grid-cols-2 gap-1.5">
            {STUDIO_COLOR_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => applyColorTheme(theme)}
                className="p-2 rounded-xl bg-white border border-[#F2D5DC]/75 hover:border-[#162A4C] active:scale-95 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-1 mb-1">
                  {[theme.backdrop, theme.balloonPrimary, theme.balloonSecondary, theme.accent].map(
                    (swatch, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: swatch }}
                      />
                    )
                  )}
                </div>
                <span className="block text-[10px] font-bold text-[#162A4C] truncate">
                  {theme.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-[#FDEBED]">
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#162A4C]/55">
            Latar Ruangan
          </span>
          <button
            type="button"
            onClick={() => bgFileInputRef.current?.click()}
            className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-[#EFAAB6] bg-white hover:bg-[#FDEBED]/50 text-[#162A4C] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#D98395]" />
            Upload Foto Ruanganmu
          </button>
          <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
            {visibleBgs.map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => {
                  setCustomBgUrl(null)
                  setBackgroundId(bg.id)
                  setMobileSheet(null)
                }}
                className={`p-1.5 rounded-xl border-2 text-left cursor-pointer ${
                  !customBgUrl && backgroundId === bg.id
                    ? 'border-[#162A4C] bg-white shadow-xs'
                    : 'border-transparent bg-white/85 hover:border-[#EFAAB6]'
                }`}
              >
                <div className="h-11 rounded-lg mb-1 overflow-hidden flex flex-col border border-black/5 bg-[#FFF5F7]">
                  {bg.imageUrl ? (
                    <img
                      src={bg.imageUrl}
                      alt={bg.label}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div
                        className="flex-1"
                        style={{ background: `linear-gradient(180deg, ${bg.wallTop}, ${bg.wallBottom})` }}
                      />
                      <div className="h-2" style={{ backgroundColor: bg.floor }} />
                    </>
                  )}
                </div>
                <span className="block text-[10px] font-bold text-[#162A4C] truncate">{bg.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen overflow-hidden flex flex-col bg-[#F7EFF1]">
      {/* Hidden shared file inputs (always mounted on PC & iPhone) */}
      <input
        ref={bgFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleRoomPhotoUpload}
        className="hidden"
      />
      <input
        ref={pngPropInputRef}
        type="file"
        accept="image/png"
        onChange={handleCustomPngUpload}
        className="hidden"
      />
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        onChange={handleBackdropBannerUpload}
        className="hidden"
      />

      {/* Clean Minimal Top Bar (ultra-slim in mobile landscape for huge canvas!) */}
      <header
        className={`${
          isCompactLandscape ? 'h-10 px-2.5' : 'h-13 px-3 sm:px-4'
        } bg-white border-b border-[#FDEBED] flex items-center justify-between gap-2 shrink-0 z-30`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <a
            href="/"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#FFF5F7] hover:bg-[#FDEBED] text-xs font-bold text-[#162A4C]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Beranda</span>
          </a>
          <div className="flex items-center gap-0.5 sm:pl-2 sm:border-l border-[#FDEBED]">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 rounded-xl hover:bg-[#FFF5F7] text-[#162A4C] disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-xl hover:bg-[#FFF5F7] text-[#162A4C] disabled:opacity-30 cursor-pointer"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowGrid((v) => !v)}
              className={`p-2 rounded-xl cursor-pointer transition-colors ${
                showGrid ? 'bg-[#162A4C] text-white' : 'hover:bg-[#FFF5F7] text-[#162A4C]/75'
              }`}
              title="Garis Bantu Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-0.5 pl-1 border-l border-[#FDEBED]">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.15).toFixed(2)))}
                className="p-1.5 rounded-lg hover:bg-[#FFF5F7] text-[#162A4C]/75 cursor-pointer"
                title="Perkecil Kanvas"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={resetViewport}
                className="px-1.5 py-1 rounded-lg hover:bg-[#FFF5F7] text-[10px] font-extrabold text-[#162A4C] cursor-pointer min-w-[38px]"
                title="Reset Zoom 100%"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.15).toFixed(2)))}
                className="p-1.5 rounded-lg hover:bg-[#FFF5F7] text-[#162A4C]/75 cursor-pointer"
                title="Perbesar Kanvas"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setLayersPopoverOpen((v) => !v)}
                className={`px-2.5 py-1.5 rounded-xl inline-flex items-center gap-1 text-xs font-bold cursor-pointer ${
                  layersPopoverOpen ? 'bg-[#162A4C] text-white' : 'hover:bg-[#FFF5F7] text-[#162A4C]'
                }`}
                title="Daftar Layer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[11px]">{elements.length}</span>
              </button>

              {layersPopoverOpen && (
                <div className="absolute left-0 top-11 w-56 max-h-64 overflow-y-auto rounded-2xl bg-white border border-[#F2D5DC] shadow-xl p-2 space-y-1 z-50">
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-extrabold uppercase text-[#D98395]">
                    <span>Urutan Layer</span>
                    <button
                      type="button"
                      onClick={() => {
                        commitElements([])
                        setSelectedId(null)
                        setLayersPopoverOpen(false)
                      }}
                      className="text-rose-500 hover:underline cursor-pointer"
                    >
                      Kosongkan
                    </button>
                  </div>
                  {[...elements].reverse().map((el) => (
                    <button
                      key={el.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(el.id)
                        setLayersPopoverOpen(false)
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                        el.id === selectedId
                          ? 'bg-[#162A4C] text-white'
                          : 'hover:bg-[#FFF5F7] text-[#162A4C]'
                      }`}
                    >
                      <span className="truncate">{getElementDisplayName(el)}</span>
                      <span
                        className="w-3 h-3 rounded-full border border-white/70 shrink-0"
                        style={{ backgroundColor: el.color }}
                      />
                    </button>
                  ))}
                  {elements.length === 0 && (
                    <p className="text-xs text-[#162A4C]/50 text-center py-3">Kanvas kosong</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {toast && (
          <span className="hidden md:inline-block px-3.5 py-1 rounded-full bg-[#162A4C] text-white text-xs font-bold">
            {toast}
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {createPackageMode && isAdmin && (
            <button
              type="button"
              onClick={openSavePackageModal}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EFAAB6] hover:bg-[#D98395] text-[#162A4C] hover:text-white text-xs font-extrabold cursor-pointer"
            >
              <PackagePlus className="w-3.5 h-3.5" />
              <span>Jadikan Paket</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            title="Simpan Draft"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#D98395]" />
            <span className="hidden lg:inline">Simpan</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPNG}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FDEBED] hover:bg-[#F7D3DA] text-[#162A4C] text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#D98395]" />
            <span className="hidden sm:inline">PNG</span>
          </button>
          <a
            href={designSummaryWaUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#162A4C] hover:bg-[#243E6B] text-white text-xs font-bold"
          >
            <Send className="w-3.5 h-3.5 text-[#F2B3BD]" />
            <span className="hidden sm:inline">WA</span>
          </a>
          <button
            type="button"
            onClick={() => setStudioSettingsOpen(true)}
            title="Pengaturan Studio 2D"
            className="w-8 h-8 rounded-full bg-[#FFF5F7] hover:bg-[#FDEBED] border border-[#F2D5DC] flex items-center justify-center text-[#162A4C] hover:rotate-45 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Spacious Canva Workspace (Desktop Sidebar OR Mobile Landscape Left Rail + Huge Pinch-Zoom Canvas!) */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Mobile Landscape Left Slim Vertical Tool Rail (Procreate/Canva Landscape style!) */}
        {isCompactLandscape && (
          <nav className="lg:hidden w-14 bg-white border-r border-[#FDEBED] py-2 flex flex-col items-center gap-2 shrink-0 z-30">
            {[
              { id: 'elemen' as const, label: 'Elemen', icon: Plus },
              { id: 'template' as const, label: 'Paket', icon: LayoutTemplate },
              { id: 'latar' as const, label: 'Latar', icon: ImageIcon },
            ].map((tab) => {
              const Icon = tab.icon
              const active = mobileSheet === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMobileSheet(active ? null : tab.id)}
                  className={`w-11 py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[9px] font-extrabold transition-colors cursor-pointer ${
                    active ? 'bg-[#162A4C] text-white shadow-xs' : 'bg-[#FFF5F7] text-[#162A4C]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        )}

        {/* Mobile Landscape Left Slide-Over Panel */}
        {isCompactLandscape && mobileSheet && (
          <div className="lg:hidden w-64 bg-[#FFF9FA] border-r border-[#FDEBED] shadow-xl p-3 flex flex-col gap-2 overflow-y-auto shrink-0 z-30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#162A4C] uppercase tracking-wider">
                {mobileSheet === 'elemen' && 'Tempel Elemen'}
                {mobileSheet === 'template' && 'Template & Draft'}
                {mobileSheet === 'latar' && 'Latar & Tema'}
              </span>
              <button
                type="button"
                onClick={() => setMobileSheet(null)}
                className="w-6 h-6 rounded-full bg-white text-[#162A4C] flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {renderSidebarContent(mobileSheet)}
          </div>
        )}

        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:flex w-72 bg-[#FFF9FA] border-r border-[#FDEBED] p-3.5 flex-col gap-3 shrink-0 overflow-y-auto">
          <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-white border border-[#F2D5DC]/60 shrink-0">
            {[
              { id: 'elemen' as const, label: 'Elemen', icon: Plus },
              { id: 'template' as const, label: 'Template', icon: LayoutTemplate },
              { id: 'latar' as const, label: 'Latar', icon: ImageIcon },
            ].map((t) => {
              const Icon = t.icon
              const active = sidebarTab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSidebarTab(t.id)}
                  className={`py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    active ? 'bg-[#162A4C] text-white' : 'text-[#162A4C]/70 hover:bg-[#FDEBED]/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              )
            })}
          </div>
          {renderSidebarContent(sidebarTab)}
        </aside>

        {/* HUGE Center Canvas + Direct Contextual Edit Strip */}
        <main
          className={`flex-1 min-h-0 flex flex-col items-center justify-center ${
            isCompactLandscape ? 'p-1.5' : 'p-2.5 sm:p-5'
          } overflow-hidden relative`}
        >
          {toast && (
            <div className="md:hidden absolute top-2 z-30 px-3.5 py-1 rounded-full bg-[#162A4C] text-white text-[11px] font-bold shadow-md">
              {toast}
            </div>
          )}

          {/* Pinch-to-Zoom & 2-Finger Pan Canvas Viewport */}
          <div
            onTouchStart={handleViewportTouchStart}
            onTouchMove={handleViewportTouchMove}
            onTouchEnd={handleViewportTouchEnd}
            onWheel={handleViewportWheel}
            className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden relative touch-none"
          >
            {/* Floating Reset Zoom Pill (shows when pinched/zoomed!) */}
            {(zoom !== 1 || pan.x !== 0 || pan.y !== 0) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  resetViewport()
                }}
                className="absolute bottom-2.5 right-2.5 z-40 px-3 py-1.5 rounded-full bg-[#162A4C]/90 text-white text-[11px] font-extrabold shadow-lg backdrop-blur-sm hover:bg-[#162A4C] cursor-pointer"
              >
                {Math.round(zoom * 100)}% • Reset
              </button>
            )}

            <div
              ref={stageRef}
              onPointerMove={handleStagePointerMove}
              onPointerUp={handleStagePointerUp}
              onPointerCancel={handleStagePointerUp}
              onClick={() => {
                setSelectedId(null)
                setMobileSheet(null)
                setLayersPopoverOpen(false)
              }}
              className="relative w-full max-w-5xl aspect-[16/10] max-h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-white select-none touch-none bg-cover bg-center will-change-transform"
              style={
                customBgUrl || currentBg.imageUrl
                  ? {
                      backgroundImage: `url(${customBgUrl || currentBg.imageUrl})`,
                      transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                      transition: pinchRef.current ? 'none' : 'transform 120ms ease-out',
                    }
                  : {
                      background: `linear-gradient(180deg, ${currentBg.wallTop} 0%, ${currentBg.wallBottom} 78%, ${currentBg.floor} 78%, ${currentBg.floor} 100%)`,
                      transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                      transition: pinchRef.current ? 'none' : 'transform 120ms ease-out',
                    }
              }
            >
              {!customBgUrl && !currentBg.imageUrl && (
                <div data-room-overlay className="pointer-events-none absolute inset-0">
                  <RoomBackgroundOverlay bg={currentBg} />
                </div>
              )}

              {/* Optional Precision Grid */}
              {showGrid && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 z-10"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #162A4C 1px, transparent 1px), linear-gradient(to bottom, #162A4C 1px, transparent 1px)',
                    backgroundSize: '10% 10%',
                  }}
                />
              )}

              {/* Canva Auto-Snap Guides */}
              {snapGuide.x && (
                <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px border-l-2 border-dashed border-[#D98395] z-30" />
              )}
              {snapGuide.y && (
                <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px border-t-2 border-dashed border-[#D98395] z-30" />
              )}

              {elements.length === 0 && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <Sparkles className="w-8 h-8 text-[#D98395] mb-2" />
                  <p className="text-sm font-bold text-[#162A4C]/65">
                    Pilih elemen untuk mulai menempel dekorasi!
                  </p>
                </div>
              )}

              {elements.map((el) => {
                const isSelected = el.id === selectedId
                return (
                  <div
                    key={el.id}
                    data-sticker-id={el.id}
                    onPointerDown={(e) => handleElementPointerDown(e, el, 'move')}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedId(el.id)
                      setLayersPopoverOpen(false)
                    }}
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scaleX(${el.flipX ? -1 : 1})`,
                    }}
                    className={`absolute cursor-grab active:cursor-grabbing ${
                      isSelected
                        ? 'ring-2 ring-[#162A4C] bg-[#162A4C]/[0.03] rounded-xl z-20'
                        : 'hover:ring-1 hover:ring-[#EFAAB6]/90 rounded-xl'
                    }`}
                  >
                    <StickerSVG element={el} />

                    {isSelected && (
                      <>
                        {/* Direct On-Canvas Rotate Handle (top center) */}
                        <button
                          type="button"
                          aria-label="Putar"
                          onPointerDown={(e) => handleElementPointerDown(e, el, 'rotate')}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#162A4C] text-[#162A4C] shadow-md flex items-center justify-center cursor-grab"
                        >
                          <RotateCw className="w-3 h-3" />
                        </button>

                        {/* Large Touch-Friendly Resize Handle (bottom right) */}
                        <button
                          type="button"
                          aria-label="Ubah Ukuran"
                          onPointerDown={(e) => handleElementPointerDown(e, el, 'resize')}
                          className="absolute -right-3 -bottom-3 w-6 h-6 rounded-full bg-[#162A4C] border-2 border-white shadow-md cursor-nwse-resize"
                        />
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* CANVA-STYLE CONTEXTUAL EDIT BAR — Rock-solid Event Isolation (Fixes Disappearing/Stuck Text Edit!) */}
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full max-w-5xl mt-2.5 shrink-0 relative z-30"
          >
            {selectedEl ? (
              <div className="glass-card rounded-2xl px-3.5 py-2.5 space-y-2">
                {/* Row 1: Actions + Banner / Text / Font / Digit Picker + Quick Size */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateSelected({ x: 50 })}
                      title="Tengahkan Horizontal"
                      className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] cursor-pointer"
                    >
                      <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => shiftLayer('up')}
                      title="Naik Layer"
                      className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => shiftLayer('down')}
                      title="Turun Layer"
                      className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSelected({ flipX: !selectedEl.flipX })}
                      title="Flip Horizontal"
                      className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] cursor-pointer"
                    >
                      <FlipHorizontal2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={duplicateSelected}
                      title="Duplikat (Ctrl+D)"
                      className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={deleteSelected}
                      title="Hapus (Delete)"
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedDef?.supportsBanner && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-full bg-[#FDEBED] hover:bg-[#F7D3DA] text-[#162A4C] text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3 text-[#D98395]" />
                          {selectedEl.customImageUrl ? 'Ganti Banner' : 'Banner'}
                        </button>
                        {selectedEl.customImageUrl && (
                          <button
                            type="button"
                            onClick={() => updateSelected({ customImageUrl: undefined })}
                            className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    )}

                    {/* Rock-solid Text Editor Trigger (Top-pinned modal above iOS keyboard so it NEVER disappears!) */}
                    {(selectedEl.type === 'custom-text' ||
                      selectedEl.type === 'marquee-number' ||
                      selectedEl.type === 'neon-sign') && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setTextModalOpen(true)
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#162A4C] hover:bg-[#243E6B] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          ✏️ Edit Teks: &ldquo;{(selectedEl.text || '').slice(0, 14)}&rdquo;
                        </button>
                      </div>
                    )}

                    {/* Font Picker for Backdrop Text */}
                    {selectedEl.type === 'custom-text' && (
                      <select
                        value={selectedEl.fontFamily || TEXT_FONTS[0].id}
                        onChange={(e) => updateSelected({ fontFamily: e.target.value })}
                        className="rounded-full border border-[#EFAAB6] bg-[#FFF9FA] px-3 py-1 text-xs font-bold text-[#162A4C] cursor-pointer"
                      >
                        {TEXT_FONTS.map((f) => (
                          <option key={f.id} value={f.id}>
                            Font: {f.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* LED Warm Yellow Fixed Badge */}
                    {selectedEl.type === 'neon-sign' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-extrabold text-amber-700">
                        ✨ LED Warm Kuning
                      </span>
                    )}

                    {/* Quick Precision Size Control */}
                    <div className="inline-flex items-center gap-1 rounded-full bg-[#FFF5F7] px-1.5 py-0.5 border border-[#F2D5DC]/70">
                      <button
                        type="button"
                        onClick={() => updateSelected({ width: Math.max(6, selectedEl.width - 2) })}
                        className="w-6 h-6 rounded-full hover:bg-white text-xs font-extrabold text-[#162A4C] cursor-pointer"
                      >
                        −
                      </button>
                      <span className="text-[10px] font-extrabold text-[#162A4C]/70 min-w-[30px] text-center">
                        {Math.round(selectedEl.width)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => updateSelected({ width: Math.min(72, selectedEl.width + 2) })}
                        className="w-6 h-6 rounded-full hover:bg-white text-xs font-extrabold text-[#162A4C] cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 0-9 Digit Quick Picker for Balon Angka */}
                {selectedEl.type === 'number-balloon' && (
                  <div className="pt-1.5 border-t border-[#FDEBED] flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    <span className="text-[10px] font-extrabold text-[#162A4C]/60 shrink-0 mr-1">
                      Angka:
                    </span>
                    {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => {
                      const active = (selectedEl.text || '1') === digit
                      return (
                        <button
                          key={digit}
                          type="button"
                          onClick={() => updateSelected({ text: digit })}
                          className={`w-7 h-7 rounded-full text-xs font-extrabold shrink-0 cursor-pointer transition-all ${
                            active
                              ? 'bg-[#162A4C] text-white shadow-xs scale-105'
                              : 'bg-[#FFF5F7] text-[#162A4C] hover:bg-[#FDEBED]'
                          }`}
                        >
                          {digit}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Row 2: Unclipped Color Swatch Bar + Custom Spectrum Color Picker (hidden for LED & PNG!) */}
                {selectedEl.type !== 'custom-png' && selectedEl.type !== 'neon-sign' && (
                  <div className="pt-1.5 border-t border-[#FDEBED] flex items-center gap-2.5">
                    {hasSecondaryColor(selectedEl.type) && (
                      <div className="flex rounded-full bg-[#FFF5F7] p-0.5 border border-[#F2D5DC]/70 shrink-0">
                        <button
                          type="button"
                          onClick={() => setColorSlot('primary')}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer ${
                            colorSlot === 'primary' ? 'bg-[#162A4C] text-white' : 'text-[#162A4C]/65'
                          }`}
                        >
                          W1
                        </button>
                        <button
                          type="button"
                          onClick={() => setColorSlot('secondary')}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer ${
                            colorSlot === 'secondary' ? 'bg-[#162A4C] text-white' : 'text-[#162A4C]/65'
                          }`}
                        >
                          W2
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-1.5">
                      {/* Custom Full-Spectrum Color Picker */}
                      <label
                        title="Pilih Warna Sendiri (Custom)"
                        className="relative w-6 h-6 rounded-full shrink-0 cursor-pointer ring-1 ring-black/20 hover:scale-105 transition-transform flex items-center justify-center overflow-hidden"
                        style={{
                          background:
                            'conic-gradient(#ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9d65c9, #ff6b6b)',
                        }}
                      >
                        <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                        <input
                          type="color"
                          value={
                            colorSlot === 'secondary'
                              ? selectedEl.secondaryColor || selectedEl.color
                              : selectedEl.color
                          }
                          onChange={(e) => handleApplyColor(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </label>

                      {STUDIO_PALETTE.map((swatch) => {
                        const activeHex =
                          colorSlot === 'secondary' ? selectedEl.secondaryColor : selectedEl.color
                        const isPicked = activeHex?.toLowerCase() === swatch.hex.toLowerCase()
                        return (
                          <button
                            key={swatch.hex}
                            type="button"
                            title={swatch.name}
                            onClick={() => handleApplyColor(swatch.hex)}
                            className={`w-6 h-6 rounded-full shrink-0 transition-transform cursor-pointer ${
                              isPicked
                                ? 'ring-2 ring-offset-2 ring-[#162A4C] scale-105'
                                : 'ring-1 ring-black/15 hover:scale-105'
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-[11px] font-semibold text-[#162A4C]/50 py-1.5">
                Ketuk elemen di kanvas untuk geser, putar (titik atas), ubah ukuran (sudut kanan bawah), atau ganti warna.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* iPhone / Mobile Portrait Collapsible Bottom Sheet (hidden in Landscape where Left Rail is used!) */}
      {!isCompactLandscape && mobileSheet && (
        <div className="lg:hidden bg-white border-t border-[#FDEBED] shadow-2xl rounded-t-3xl px-4 pt-3 pb-3 max-h-[38dvh] overflow-y-auto shrink-0 z-30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-[#162A4C] uppercase tracking-wider">
              {mobileSheet === 'elemen' && 'Tempel Elemen'}
              {mobileSheet === 'template' && 'Template & Draft'}
              {mobileSheet === 'latar' && 'Latar & Tema'}
            </span>
            <button
              type="button"
              onClick={() => setMobileSheet(null)}
              className="w-7 h-7 rounded-full bg-[#FFF5F7] text-[#162A4C] flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {renderSidebarContent(mobileSheet)}
        </div>
      )}

      {/* Ultra-Simple 3-Tab iPhone Portrait Bottom Dock (hidden in Landscape!) */}
      {!isCompactLandscape && (
        <nav className="lg:hidden bg-white border-t border-[#FDEBED] px-3 pt-1.5 pb-safe grid grid-cols-3 gap-2 shrink-0 z-30">
          {[
            { id: 'elemen' as const, label: 'Tempel Elemen', icon: Plus },
            { id: 'template' as const, label: 'Template', icon: LayoutTemplate },
            { id: 'latar' as const, label: 'Latar Venue', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon
            const active = mobileSheet === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMobileSheet(active ? null : tab.id)}
                className={`py-2.5 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${
                  active ? 'bg-[#162A4C] text-white' : 'bg-[#FFF5F7] text-[#162A4C]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      )}

      {/* Top-Anchored Text / Name / Font Editor Modal (Always ABOVE iOS Keyboard — NEVER disappears!) */}
      {textModalOpen &&
        selectedEl &&
        (selectedEl.type === 'custom-text' ||
          selectedEl.type === 'marquee-number' ||
          selectedEl.type === 'neon-sign') && (
          <div
            onClick={() => {
              commitElements(elements)
              setTextModalOpen(false)
            }}
            className="fixed inset-0 z-[70] bg-[#162A4C]/30 backdrop-blur-[2px] flex items-start justify-center pt-14 sm:pt-20 px-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-[#F2D5DC] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#162A4C]">
                  {selectedEl.type === 'marquee-number'
                    ? 'Edit Angka Lampu'
                    : selectedEl.type === 'neon-sign'
                      ? 'Edit Tulisan LED Kuning'
                      : 'Edit Tulisan Backdrop'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    commitElements(elements)
                    setTextModalOpen(false)
                  }}
                  className="px-3.5 py-1 rounded-full bg-[#162A4C] text-white text-xs font-extrabold cursor-pointer"
                >
                  Selesai
                </button>
              </div>

              <input
                type="text"
                autoFocus
                maxLength={selectedEl.type === 'marquee-number' ? 3 : 28}
                value={selectedEl.text ?? ''}
                onChange={(e) => updateSelected({ text: e.target.value }, false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    commitElements(elements)
                    setTextModalOpen(false)
                  }
                }}
                placeholder="Ketik nama / ucapan di sini..."
                className="w-full rounded-2xl border-2 border-[#EFAAB6] bg-[#FFF9FA] px-4 py-2.5 text-sm font-bold text-[#162A4C] focus:outline-none focus:ring-2 focus:ring-[#162A4C]/20"
              />

              {selectedEl.type === 'custom-text' && (
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#162A4C]/55">
                    Pilih Jenis Font
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TEXT_FONTS.map((f) => {
                      const active = (selectedEl.fontFamily || TEXT_FONTS[0].id) === f.id
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => updateSelected({ fontFamily: f.id })}
                          style={{ fontFamily: f.family, fontStyle: f.italic ? 'italic' : 'normal' }}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                            active
                              ? 'bg-[#162A4C] text-white border-[#162A4C]'
                              : 'bg-[#FFF9FA] text-[#162A4C] border-[#F2D5DC] hover:bg-[#FDEBED]'
                          }`}
                        >
                          {f.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Studio 2D Content Settings Drawer (Admin-Only via GitHub Personal Access Token) */}
      {studioSettingsOpen && (
        <div
          onClick={() => setStudioSettingsOpen(false)}
          className="fixed inset-0 z-50 bg-[#162A4C]/35 backdrop-blur-sm flex justify-end"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#FDEBED]"
          >
            <div className="px-5 py-4 border-b border-[#FDEBED] flex items-center justify-between bg-[#FFF9FA]">
              <div>
                <h2 className="text-sm font-extrabold text-[#162A4C] flex items-center gap-1.5">
                  {isAdmin ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-[#D98395]" />
                  )}
                  Pengaturan Admin Studio 2D
                </h2>
                <p className="text-[11px] text-[#162A4C]/55">
                  {isAdmin
                    ? `Admin @${adminUser} (${adminRepo})`
                    : 'Khusus Admin — login pakai GitHub Personal Access Token.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStudioSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FDEBED] text-[#162A4C] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isAdmin ? (
              <form
                onSubmit={handleStudioAdminLogin}
                className="flex-1 overflow-y-auto p-6 flex flex-col justify-center space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FDEBED] flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6 text-[#162A4C]" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-base font-extrabold text-[#162A4C]">Verifikasi Admin GitHub</h3>
                  <p className="text-xs text-[#162A4C]/65">
                    Masukkan GitHub Personal Access Token dengan akses push ke repo Bubu Balloon.
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#162A4C] mb-1">
                      Repository GitHub
                    </label>
                    <input
                      type="text"
                      value={repoInput}
                      onChange={(e) => setRepoInput(e.target.value)}
                      className="w-full rounded-xl border border-[#EFAAB6]/60 bg-[#FFF9FA] px-3 py-2 text-xs font-bold text-[#162A4C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#162A4C] mb-1">
                      GitHub Personal Access Token
                    </label>
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="ghp_xxxx atau github_pat_xxxx"
                      autoComplete="off"
                      className="w-full rounded-xl border border-[#EFAAB6]/60 bg-[#FFF9FA] px-3 py-2 text-xs font-mono text-[#162A4C]"
                    />
                  </div>
                  {tokenError && (
                    <p className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] font-bold text-rose-600">
                      {tokenError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={verifyingToken}
                    className="w-full py-3 rounded-full bg-[#162A4C] hover:bg-[#243E6B] disabled:opacity-60 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {verifyingToken ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 text-[#F2B3BD]" />
                        Hubungkan &amp; Buka Pengaturan
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-[#FDEBED] bg-[#FFF5F7] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openSavePackageModal}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-[#162A4C] hover:bg-[#243E6B] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                  >
                    <PackagePlus className="w-4 h-4 text-[#F2B3BD]" />
                    + Jadikan Paket Homepage
                  </button>
                  <button
                    type="button"
                    onClick={logoutAdmin}
                    title="Logout Admin"
                    className="p-2.5 rounded-2xl bg-white border border-[#F2D5DC] text-rose-500 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-4 py-2 border-b border-[#FDEBED] grid grid-cols-3 gap-1">
                  {[
                    { id: 'elemen' as const, label: 'Elemen' },
                    { id: 'template' as const, label: 'Template' },
                    { id: 'latar' as const, label: 'Latar' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setStudioSettingsTab(t.id)}
                      className={`py-2 rounded-xl text-xs font-bold cursor-pointer ${
                        studioSettingsTab === t.id
                          ? 'bg-[#162A4C] text-white'
                          : 'text-[#162A4C]/65 hover:bg-[#FFF5F7]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {studioSettingsTab === 'elemen' &&
                    STICKER_DEFINITIONS.map((def) => {
                      const hidden = studioSettings.hiddenTypes.includes(def.type)
                      return (
                        <div
                          key={def.type}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                            hidden ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-[#FFF9FA] border-[#F2D5DC]'
                          }`}
                        >
                          <input
                            type="text"
                            value={getStickerLabel(def)}
                            onChange={(e) => {
                              const val = e.target.value
                              setStudioSettings((prev) => ({
                                ...prev,
                                customLabels: { ...prev.customLabels, [def.type]: val },
                              }))
                            }}
                            className="flex-1 rounded-lg border border-[#EFAAB6]/40 bg-white px-2.5 py-1 text-xs font-bold text-[#162A4C]"
                          />
                          <span className="text-[10px] font-semibold text-[#162A4C]/50">{def.category}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setStudioSettings((prev) => ({
                                ...prev,
                                hiddenTypes: prev.hiddenTypes.includes(def.type)
                                  ? prev.hiddenTypes.filter((x) => x !== def.type)
                                  : [...prev.hiddenTypes, def.type],
                              }))
                            }
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              hidden ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                            }`}
                          >
                            {hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )
                    })}

                  {studioSettingsTab === 'template' &&
                    STUDIO_PRESETS.map((p) => {
                      const hidden = studioSettings.hiddenPresetIds.includes(p.id)
                      return (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9FA] border border-[#F2D5DC]"
                        >
                          <span className={`text-xs font-bold ${hidden ? 'line-through text-gray-400' : 'text-[#162A4C]'}`}>
                            {p.name}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setStudioSettings((prev) => ({
                                ...prev,
                                hiddenPresetIds: prev.hiddenPresetIds.includes(p.id)
                                  ? prev.hiddenPresetIds.filter((x) => x !== p.id)
                                  : [...prev.hiddenPresetIds, p.id],
                              }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                              hidden ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {hidden ? 'Tampilkan' : 'Hapus'}
                          </button>
                        </div>
                      )
                    })}

                  {studioSettingsTab === 'latar' &&
                    ROOM_BACKGROUNDS.map((b) => {
                      const hidden = studioSettings.hiddenBgIds.includes(b.id)
                      return (
                        <div
                          key={b.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9FA] border border-[#F2D5DC]"
                        >
                          <span className={`text-xs font-bold ${hidden ? 'line-through text-gray-400' : 'text-[#162A4C]'}`}>
                            {b.label}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setStudioSettings((prev) => ({
                                ...prev,
                                hiddenBgIds: prev.hiddenBgIds.includes(b.id)
                                  ? prev.hiddenBgIds.filter((x) => x !== b.id)
                                  : [...prev.hiddenBgIds, b.id],
                              }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                              hidden ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {hidden ? 'Tampilkan' : 'Hapus'}
                          </button>
                        </div>
                      )
                    })}
                </div>

                <div className="px-5 py-3.5 border-t border-[#FDEBED] bg-[#FFF9FA] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStudioSettings(DEFAULT_STUDIO_SETTINGS)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudioSettingsOpen(false)}
                    className="px-5 py-2 rounded-full bg-[#162A4C] text-white text-xs font-bold cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal: Simpan Desain 2D sebagai Model Paket Homepage */}
      {pkgModalOpen && (
        <div
          onClick={() => setPkgModalOpen(false)}
          className="fixed inset-0 z-[60] bg-[#162A4C]/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl border border-white space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#162A4C]">Simpan ke Paket Homepage</h3>
                <p className="text-[11px] text-[#162A4C]/55">
                  Desain kanvas 2D ini akan langsung muncul di Katalog Paket beranda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPkgModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FDEBED] text-[#162A4C] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pkgSavedDone ? (
              <div className="py-4 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#162A4C]">
                    Berhasil ditambahkan ke Homepage Paket! 🎉
                  </p>
                  <p className="text-xs text-[#162A4C]/60 mt-1">
                    {pkgPublishMsg || 'Buka beranda untuk melihat kartu paket baru kamu langsung tampil.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPkgModalOpen(false)}
                    className="flex-1 py-2.5 rounded-full bg-[#FFF5F7] text-[#162A4C] text-xs font-bold cursor-pointer"
                  >
                    Lanjut Edit
                  </button>
                  <a
                    href="/#model-desain"
                    className="flex-1 py-2.5 rounded-full bg-[#162A4C] text-white text-xs font-bold text-center"
                  >
                    Lihat di Beranda ↗
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#162A4C] mb-1">
                    Nama Model Paket
                  </label>
                  <input
                    type="text"
                    value={pkgName}
                    onChange={(e) => setPkgName(e.target.value)}
                    placeholder="Contoh: Princess Shimmer Gold"
                    className="w-full rounded-xl border border-[#EFAAB6]/60 bg-[#FFF9FA] px-3.5 py-2 text-xs font-bold text-[#162A4C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#162A4C] mb-1">
                      Kategori
                    </label>
                    <select
                      value={pkgCategory}
                      onChange={(e) => setPkgCategory(e.target.value as DesignModel['category'])}
                      className="w-full rounded-xl border border-[#EFAAB6]/60 bg-[#FFF9FA] px-3 py-2 text-xs text-[#162A4C]"
                    >
                      <option value="Ulang Tahun">Ulang Tahun</option>
                      <option value="Sweet 17">Sweet 17</option>
                      <option value="Kids & Baby">Kids & Baby</option>
                      <option value="Intimate & Bridal">Intimate & Bridal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#162A4C] mb-1">
                      Ukuran
                    </label>
                    <input
                      type="text"
                      value={pkgSize}
                      onChange={(e) => setPkgSize(e.target.value)}
                      placeholder="2,4m × 2,2m"
                      className="w-full rounded-xl border border-[#EFAAB6]/60 bg-[#FFF9FA] px-3 py-2 text-xs text-[#162A4C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#162A4C] mb-1">Label Tag</label>
                  <input
                    type="text"
                    value={pkgTag}
                    onChange={(e) => setPkgTag(e.target.value)}
                    placeholder="Baru / Best Seller"
                    className="w-full rounded-xl border border-[#EFAAB6]/60 bg-[#FFF9FA] px-3 py-2 text-xs text-[#162A4C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#162A4C] mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={2}
                    value={pkgDesc}
                    onChange={(e) => setPkgDesc(e.target.value)}
                    placeholder="Dekorasi balon modern elegan..."
                    className="w-full rounded-xl border border-[#EFAAB6]/60 bg-[#FFF9FA] px-3 py-2 text-xs text-[#162A4C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#162A4C] mb-1">
                    Spesifikasi Paket (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={pkgSpecsText}
                    onChange={(e) => setPkgSpecsText(e.target.value)}
                    placeholder="Shimmer 2x3m, Garland Lengkung, Meja Emas..."
                    className="w-full rounded-xl border border-[#EFAAB6]/60 bg-[#FFF9FA] px-3 py-2 text-xs text-[#162A4C]"
                  />
                </div>

                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={handleSaveAsHomepagePackage}
                  className="w-full py-3 rounded-full bg-[#162A4C] hover:bg-[#243E6B] disabled:opacity-60 text-white text-xs font-extrabold shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan &amp; Publish ke GitHub...
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-4 h-4 text-[#F2B3BD]" />
                      Simpan &amp; Publish ke Homepage ✨
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
