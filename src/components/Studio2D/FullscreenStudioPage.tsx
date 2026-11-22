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
} from 'lucide-react'
import {
  CanvasElement,
  ROOM_BACKGROUNDS,
  RoomBackgroundOverlay,
  STICKER_DEFINITIONS,
  STUDIO_PALETTE,
  STUDIO_PRESETS,
  StickerCategory,
  StickerDefinition,
  StickerSVG,
  StickerType,
} from './stickerLibrary'
import { useSiteConfig } from '../../context/SiteConfigContext'

type SidebarTab = 'elemen' | 'template' | 'latar'
const ELEMENT_CATEGORIES: StickerCategory[] = ['Backdrop', 'Balon', 'Properti']

const STUDIO_SETTINGS_KEY = 'bubu-studio-2d-settings-v1'
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
}

export default function FullscreenStudioPage({ initialPresetId }: FullscreenStudioPageProps) {
  const { config, buildWhatsAppUrl } = useSiteConfig()

  const initialPreset =
    STUDIO_PRESETS.find((p) => p.id === initialPresetId) ?? STUDIO_PRESETS[0]

  const [elements, setElements] = useState<CanvasElement[]>(initialPreset.elements)
  const [history, setHistory] = useState<CanvasElement[][]>([initialPreset.elements])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [backgroundId, setBackgroundId] = useState<string>(initialPreset.backgroundId)
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null)
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('elemen')
  const [activeCategory, setActiveCategory] = useState<StickerCategory>('Backdrop')
  const [snapGuide, setSnapGuide] = useState<{ x: boolean; y: boolean }>({ x: false, y: false })
  const [toast, setToast] = useState<string | null>(null)
  const [studioSettingsOpen, setStudioSettingsOpen] = useState(false)
  const [studioSettingsTab, setStudioSettingsTab] = useState<'elemen' | 'template' | 'latar'>('elemen')
  const [showLayers, setShowLayers] = useState(false)
  // iPhone / mobile Canva-style collapsible bottom sheet
  const [mobileSheet, setMobileSheet] = useState<'elemen' | 'template' | 'latar' | 'atur' | 'layer' | null>(null)

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
    mode: 'move' | 'resize'
    id: string
    startClientX: number
    startClientY: number
    startX: number
    startY: number
    startWidth: number
  } | null>(null)

  const currentBg = ROOM_BACKGROUNDS.find((b) => b.id === backgroundId) ?? ROOM_BACKGROUNDS[0]
  const selectedEl = elements.find((el) => el.id === selectedId) ?? null
  const selectedDef = selectedEl
    ? STICKER_DEFINITIONS.find((d) => d.type === selectedEl.type)
    : null

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
    setTimeout(() => setToast(null), 2600)
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

  const addSticker = (def: StickerDefinition) => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: def.type,
      x: 50 + (Math.random() * 8 - 4),
      y: 52 + (Math.random() * 8 - 4),
      width: def.defaultWidth,
      rotation: 0,
      color: def.defaultColor,
      secondaryColor: def.defaultSecondary ?? def.defaultColor,
      text: def.defaultText,
    }
    commitElements([...elements, newEl])
    setSelectedId(newEl.id)
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
      showToast('Properti PNG custom berhasil ditempel! ✨')
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
      showToast('Gambar banner berhasil dipasang ke panel backdrop! 🖼️')
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
    showToast(`Template "${preset.name}" dimuat!`)
  }

  const handleRoomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCustomBgUrl(URL.createObjectURL(file))
    showToast('Foto ruangan dipasang sebagai latar! 🏠')
    e.target.value = ''
  }

  const handleElementPointerDown = (
    e: React.PointerEvent,
    el: CanvasElement,
    mode: 'move' | 'resize'
  ) => {
    e.stopPropagation()
    setSelectedId(el.id)
    dragStateRef.current = {
      mode,
      id: el.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: el.x,
      startY: el.y,
      startWidth: el.width,
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
        return {
          ...el,
          width: Math.max(6, Math.min(72, drag.startWidth + dxPct * 1.4)),
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

  // Export crisp 1600x1000 PNG including architectural room background overlay!
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

    if (customBgUrl) {
      await new Promise<void>((resolve) => {
        const bgImg = new Image()
        bgImg.onload = () => {
          const scale = Math.max(exportW / bgImg.width, exportH / bgImg.height)
          const dw = bgImg.width * scale
          const dh = bgImg.height * scale
          ctx.drawImage(bgImg, (exportW - dw) / 2, (exportH - dh) / 2, dw, dh)
          resolve()
        }
        bgImg.onerror = () => resolve()
        bgImg.src = customBgUrl
      })
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, exportH * 0.78)
      grad.addColorStop(0, currentBg.wallTop)
      grad.addColorStop(1, currentBg.wallBottom)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, exportW, exportH)
      ctx.fillStyle = currentBg.floor
      ctx.fillRect(0, exportH * 0.78, exportW, exportH * 0.22)

      // Render architectural RoomBackgroundOverlay SVG if present
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
    showToast('Gambar desain PNG berhasil diunduh! 📸')
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
      `Halo ${config.brand.name}! 🎈`,
      'Saya baru saja membuat konsep dekorasi di *Studio 2D Fullscreen*:',
      '',
      `Latar: ${customBgUrl ? 'Foto Ruangan Sendiri' : currentBg.label}`,
      itemsText || '• (Konsep custom)',
      customTexts ? `Tulisan / Angka: ${customTexts}` : null,
      '',
      '(Saya lampirkan juga gambar PNG hasil desainnya ya!)',
      'Boleh dibantu info detail & jadwal kosongnya? ✨',
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

  const toggleHideType = (t: StickerType) => {
    setStudioSettings((prev) => ({
      ...prev,
      hiddenTypes: prev.hiddenTypes.includes(t)
        ? prev.hiddenTypes.filter((x) => x !== t)
        : [...prev.hiddenTypes, t],
    }))
  }

  const toggleHidePreset = (id: string) => {
    setStudioSettings((prev) => ({
      ...prev,
      hiddenPresetIds: prev.hiddenPresetIds.includes(id)
        ? prev.hiddenPresetIds.filter((x) => x !== id)
        : [...prev.hiddenPresetIds, id],
    }))
  }

  const toggleHideBg = (id: string) => {
    setStudioSettings((prev) => ({
      ...prev,
      hiddenBgIds: prev.hiddenBgIds.includes(id)
        ? prev.hiddenBgIds.filter((x) => x !== id)
        : [...prev.hiddenBgIds, id],
    }))
  }

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col bg-[#FAF3F5]">
      {/* Top Fullscreen Studio Bar */}
      <header className="h-14 px-3 sm:px-4 bg-white border-b border-[#FDEBED] flex items-center justify-between gap-2 shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FFF5F7] hover:bg-[#FDEBED] text-xs font-bold text-[#162A4C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Beranda</span>
          </a>
          <div className="hidden sm:flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-7 h-7 rounded-full object-cover bg-[#FDEBED]" />
            <span className="font-extrabold text-sm text-[#162A4C]">
              Studio 2D <span className="font-script text-[#D98395] text-base">Bubu</span>
            </span>
          </div>
          <div className="flex items-center gap-1 sm:ml-1 sm:pl-3 sm:border-l border-[#FDEBED]">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 rounded-xl hover:bg-[#FFF5F7] text-[#162A4C] disabled:opacity-30 cursor-pointer"
              title="Undo"
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
              onClick={() => {
                commitElements([])
                setSelectedId(null)
                showToast('Kanvas dibersihkan!')
              }}
              className="hidden sm:inline-block px-3 py-1.5 rounded-xl hover:bg-[#FFF5F7] text-xs font-bold text-[#162A4C]/75 cursor-pointer"
            >
              Kosongkan
            </button>
          </div>
        </div>

        {toast && (
          <span className="hidden lg:inline-block px-3.5 py-1 rounded-full bg-[#162A4C] text-white text-xs font-bold">
            {toast}
          </span>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            title="Simpan Draft Desain"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-full bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] text-xs font-bold cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#D98395]" />
            <span className="hidden md:inline">Simpan</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPNG}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-[#FDEBED] hover:bg-[#F7D3DA] text-[#162A4C] text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#D98395]" />
            <span className="hidden sm:inline">Unduh PNG</span>
          </button>
          <a
            href={designSummaryWaUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-[#162A4C] hover:bg-[#243E6B] text-white text-xs font-bold"
          >
            <Send className="w-3.5 h-3.5 text-[#F2B3BD]" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setStudioSettingsOpen(true)}
            title="Pengaturan Konten Studio 2D"
            aria-label="Pengaturan Konten Studio 2D"
            className="w-9 h-9 rounded-full bg-[#FFF5F7] hover:bg-[#FDEBED] border border-[#F2D5DC] flex items-center justify-center text-[#162A4C] hover:rotate-45 transition-all duration-300 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Fullscreen Workspace */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Desktop Left Sidebar (hidden on mobile — replaced by iPhone Bottom Sheet!) */}
        <aside className="hidden lg:flex lg:w-72 bg-[#FFF9FA] border-r border-[#FDEBED] p-3 flex-col gap-3 shrink-0 overflow-y-auto">
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

          {sidebarTab === 'elemen' && (
            <div className="space-y-3">
              <div className="flex gap-1.5 flex-wrap">
                {ELEMENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[#EFAAB6] text-[#162A4C]'
                        : 'bg-white text-[#162A4C]/65 border border-[#F2D5DC]/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {activeCategory === 'Properti' && (
                <div className="rounded-2xl border-2 border-dashed border-[#EFAAB6] bg-white p-2.5 space-y-1.5">
                  <input
                    ref={pngPropInputRef}
                    type="file"
                    accept="image/png"
                    onChange={handleCustomPngUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => pngPropInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl bg-[#FDEBED] hover:bg-[#F7D3DA] text-[#162A4C] text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#D98395]" />
                    + Tambah Properti / Karakter PNG
                  </button>
                  <p className="text-[10px] text-[#162A4C]/60 leading-snug text-center">
                    File harus <strong>PNG tanpa background</strong> (transparan) untuk karakter custom.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-2 gap-2">
                {visibleStickers
                  .filter((s) => s.category === activeCategory)
                  .map((def) => (
                    <button
                      key={def.type}
                      type="button"
                      onClick={() => addSticker(def)}
                      className="group p-2 rounded-2xl bg-white border border-[#F2D5DC]/60 hover:border-[#162A4C]/40 transition-all flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <div className="w-11 h-11 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <StickerSVG
                          element={{
                            id: `prev-${def.type}`,
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
                      <span className="text-[10px] font-bold text-[#162A4C] text-center leading-tight">
                        {getStickerLabel(def)}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {sidebarTab === 'template' && (
            <div className="space-y-3">
              {savedDrafts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#D98395]">
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
                        onClick={() =>
                          setSavedDrafts((prev) => prev.filter((item) => item.id !== d.id))
                        }
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#162A4C]/50">
                  Template Siap Pakai
                </span>
                {visiblePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => loadPreset(preset.id)}
                    className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-white border border-[#F2D5DC]/70 hover:border-[#162A4C] cursor-pointer"
                  >
                    <span className="block text-xs font-extrabold text-[#162A4C]">{preset.name}</span>
                    <span className="block text-[10px] text-[#162A4C]/55">
                      {preset.elements.length} elemen siap edit
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {sidebarTab === 'latar' && (
            <div className="space-y-3">
              <input
                ref={bgFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleRoomPhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => bgFileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-[#EFAAB6] bg-white hover:bg-[#FDEBED]/50 text-[#162A4C] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#D98395]" />
                Upload Foto Ruanganmu
              </button>
              <div className="grid grid-cols-2 gap-2">
                {visibleBgs.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => {
                      setCustomBgUrl(null)
                      setBackgroundId(bg.id)
                    }}
                    className={`p-2 rounded-2xl border-2 text-left cursor-pointer ${
                      !customBgUrl && backgroundId === bg.id
                        ? 'border-[#162A4C] bg-white shadow-xs'
                        : 'border-transparent bg-white/80 hover:border-[#EFAAB6]'
                    }`}
                  >
                    <div className="h-10 rounded-xl mb-1 overflow-hidden flex flex-col border border-black/5">
                      <div
                        className="flex-1"
                        style={{ background: `linear-gradient(180deg, ${bg.wallTop}, ${bg.wallBottom})` }}
                      />
                      <div className="h-2.5" style={{ backgroundColor: bg.floor }} />
                    </div>
                    <span className="block text-[10px] font-bold text-[#162A4C]">{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Center Spacious Fullscreen Canvas */}
        <main className="flex-1 min-h-0 p-3 sm:p-6 flex flex-col items-center justify-center overflow-hidden relative">
          {/* Mobile Toast */}
          {toast && (
            <div className="lg:hidden absolute top-2 z-30 px-3.5 py-1 rounded-full bg-[#162A4C] text-white text-[11px] font-bold shadow-md">
              {toast}
            </div>
          )}

          <div
            ref={stageRef}
            onPointerMove={handleStagePointerMove}
            onPointerUp={handleStagePointerUp}
            onPointerCancel={handleStagePointerUp}
            onClick={() => {
              setSelectedId(null)
              setMobileSheet(null)
            }}
            className="relative w-full max-w-4xl aspect-[16/10] max-h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-white select-none touch-none bg-cover bg-center"
            style={
              customBgUrl
                ? { backgroundImage: `url(${customBgUrl})` }
                : {
                    background: `linear-gradient(180deg, ${currentBg.wallTop} 0%, ${currentBg.wallBottom} 78%, ${currentBg.floor} 78%, ${currentBg.floor} 100%)`,
                  }
            }
          >
            {!customBgUrl && (
              <div data-room-overlay className="pointer-events-none absolute inset-0">
                <RoomBackgroundOverlay bg={currentBg} />
              </div>
            )}

            {snapGuide.x && (
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px border-l border-dashed border-[#D98395] z-30" />
            )}
            {snapGuide.y && (
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px border-t border-dashed border-[#D98395] z-30" />
            )}

            {elements.length === 0 && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Sparkles className="w-8 h-8 text-[#D98395] mb-2" />
                <p className="text-sm font-bold text-[#162A4C]/65">
                  Klik elemen di kiri untuk mulai menempel dekorasi!
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
                  }}
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    width: `${el.width}%`,
                    transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scaleX(${el.flipX ? -1 : 1})`,
                  }}
                  className={`absolute cursor-grab active:cursor-grabbing ${
                    isSelected
                      ? 'ring-2 ring-dashed ring-[#162A4C] bg-[#162A4C]/[0.03] rounded-xl z-20'
                      : 'hover:ring-1 hover:ring-[#EFAAB6]/80 rounded-xl'
                  }`}
                >
                  <StickerSVG element={el} />
                  {isSelected && (
                    <button
                      type="button"
                      aria-label="Resize"
                      onPointerDown={(e) => handleElementPointerDown(e, el, 'resize')}
                      className="absolute -right-2.5 -bottom-2.5 w-5 h-5 rounded-full bg-[#162A4C] border-2 border-white shadow-md cursor-nwse-resize"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </main>

        {/* Desktop Right Inspector (hidden on mobile — replaced by iPhone Bottom Sheet!) */}
        <aside className="hidden lg:block lg:w-64 bg-white border-l border-[#FDEBED] p-4 shrink-0 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#FDEBED]">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#162A4C]">
              <Layers className="w-4 h-4 text-[#D98395]" />
              {showLayers ? `Layer (${elements.length})` : 'Atur Elemen'}
            </span>
            <button
              type="button"
              onClick={() => setShowLayers((v) => !v)}
              className="px-2.5 py-1 rounded-full bg-[#FFF5F7] hover:bg-[#FDEBED] text-[10px] font-bold text-[#162A4C] cursor-pointer"
            >
              {showLayers ? 'Properti' : `Layer (${elements.length})`}
            </button>
          </div>

          {showLayers ? (
            <div className="space-y-1.5">
              {[...elements].reverse().map((el) => {
                const active = el.id === selectedId
                return (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(el.id)
                      setShowLayers(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-[#162A4C] text-white'
                        : 'bg-[#FFF9FA] text-[#162A4C] hover:bg-[#FDEBED]'
                    }`}
                  >
                    <span className="truncate">{getElementDisplayName(el)}</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/60 shrink-0"
                      style={{ backgroundColor: el.color }}
                    />
                  </button>
                )
              })}
              {elements.length === 0 && (
                <p className="text-xs text-[#162A4C]/50 text-center py-4">Belum ada elemen.</p>
              )}
            </div>
          ) : !selectedEl ? (
            <p className="text-xs text-[#162A4C]/55 leading-relaxed">
              Klik salah satu elemen di kanvas untuk ubah warna, upload banner backdrop, ukuran,
              atau buka tab <strong>Layer</strong> di atas.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => shiftLayer('up')}
                  title="Naik Layer"
                  className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] flex items-center justify-center cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => shiftLayer('down')}
                  title="Turun Layer"
                  className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] flex items-center justify-center cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateSelected({ flipX: !selectedEl.flipX })}
                  title="Flip"
                  className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] flex items-center justify-center cursor-pointer"
                >
                  <FlipHorizontal2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={duplicateSelected}
                  title="Duplikat"
                  className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FDEBED] text-[#162A4C] flex items-center justify-center cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={deleteSelected}
                  title="Hapus"
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {selectedDef?.supportsBanner && (
                <div className="rounded-xl bg-[#FFF5F7] p-2.5 space-y-2 border border-[#F2D5DC]">
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackdropBannerUpload}
                    className="hidden"
                  />
                  <span className="block text-[11px] font-extrabold text-[#162A4C]">
                    Custom Banner Backdrop
                  </span>
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-[#EFAAB6] text-[11px] font-bold text-[#162A4C] hover:bg-[#FDEBED] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-[#D98395]" />
                    {selectedEl.customImageUrl ? 'Ganti Gambar Banner' : 'Masukan Gambar Banner'}
                  </button>
                  {selectedEl.customImageUrl && (
                    <button
                      type="button"
                      onClick={() => updateSelected({ customImageUrl: undefined })}
                      className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Hapus gambar banner
                    </button>
                  )}
                </div>
              )}

              {(selectedEl.type === 'custom-text' ||
                selectedEl.type === 'marquee-number' ||
                selectedEl.type === 'neon-sign') && (
                <div>
                  <label className="block text-[11px] font-bold text-[#162A4C] mb-1">
                    {selectedEl.type === 'marquee-number' ? 'Angka Lampu' : 'Teks'}
                  </label>
                  <input
                    type="text"
                    maxLength={selectedEl.type === 'marquee-number' ? 3 : 24}
                    value={selectedEl.text ?? ''}
                    onChange={(e) => updateSelected({ text: e.target.value })}
                    className="w-full rounded-xl border border-[#EFAAB6]/60 bg-[#FFF9FA] px-3 py-1.5 text-xs font-bold text-[#162A4C]"
                  />
                </div>
              )}

              {selectedEl.type !== 'custom-png' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#162A4C] mb-1.5">
                    Warna Utama
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {STUDIO_PALETTE.map((swatch) => (
                      <button
                        key={swatch.hex}
                        type="button"
                        title={swatch.name}
                        onClick={() => {
                          if (
                            (selectedEl.type === 'balloon-cluster' ||
                              selectedEl.type === 'garland-arch') &&
                            selectedEl.secondaryColor === selectedEl.color
                          ) {
                            updateSelected({ color: swatch.hex, secondaryColor: swatch.hex })
                          } else {
                            updateSelected({ color: swatch.hex })
                          }
                        }}
                        className={`w-6 h-6 rounded-full border cursor-pointer ${
                          selectedEl.color === swatch.hex
                            ? 'ring-2 ring-[#162A4C] border-white scale-110'
                            : 'border-black/10'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {hasSecondaryColor(selectedEl.type) && (
                <div>
                  <label className="block text-[11px] font-bold text-[#162A4C] mb-1.5">
                    {selectedEl.type === 'gold-cross-table'
                      ? 'Warna Kaki Besi'
                      : 'Warna Kombinasi (Opsional)'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {STUDIO_PALETTE.map((swatch) => (
                      <button
                        key={`sec-${swatch.hex}`}
                        type="button"
                        title={swatch.name}
                        onClick={() => updateSelected({ secondaryColor: swatch.hex })}
                        className={`w-6 h-6 rounded-full border cursor-pointer ${
                          selectedEl.secondaryColor === swatch.hex
                            ? 'ring-2 ring-[#162A4C] border-white scale-110'
                            : 'border-black/10'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between text-[11px] font-bold text-[#162A4C] mb-1">
                  <span>Ukuran</span>
                  <span>{Math.round(selectedEl.width)}%</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={68}
                  value={selectedEl.width}
                  onChange={(e) => updateSelected({ width: Number(e.target.value) }, false)}
                  onMouseUp={() => commitElements(elements)}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-[#162A4C] mb-1">
                  <span className="inline-flex items-center gap-1">
                    <RotateCw className="w-3 h-3 text-[#D98395]" /> Putar
                  </span>
                  <span>{selectedEl.rotation}°</span>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={selectedEl.rotation}
                  onChange={(e) => updateSelected({ rotation: Number(e.target.value) }, false)}
                  onMouseUp={() => commitElements(elements)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* iPhone / Mobile Collapsible Bottom Sheet (Canva Mobile Pattern!) */}
      {mobileSheet && (
        <div className="lg:hidden bg-white border-t border-[#FDEBED] shadow-2xl rounded-t-3xl px-4 pt-3 pb-2 max-h-[38dvh] overflow-y-auto shrink-0 z-30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-[#162A4C] uppercase tracking-wider">
              {mobileSheet === 'elemen' && 'Tempel Elemen'}
              {mobileSheet === 'template' && 'Template & Draft'}
              {mobileSheet === 'latar' && 'Latar Ruangan'}
              {mobileSheet === 'atur' && 'Atur Elemen Terpilih'}
              {mobileSheet === 'layer' && `Daftar Layer (${elements.length})`}
            </span>
            <button
              type="button"
              onClick={() => setMobileSheet(null)}
              className="w-7 h-7 rounded-full bg-[#FFF5F7] text-[#162A4C] flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {mobileSheet === 'elemen' && (
            <div className="space-y-3 pb-2">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {ELEMENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 ${
                      activeCategory === cat
                        ? 'bg-[#162A4C] text-white'
                        : 'bg-[#FFF5F7] text-[#162A4C]/75'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {activeCategory === 'Properti' && (
                <button
                  type="button"
                  onClick={() => pngPropInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-[#EFAAB6] bg-[#FFF9FA] text-[#162A4C] text-xs font-extrabold flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-[#D98395]" />
                  + Upload Karakter PNG (Tanpa Background)
                </button>
              )}
              <div className="grid grid-cols-4 gap-2">
                {visibleStickers
                  .filter((s) => s.category === activeCategory)
                  .map((def) => (
                    <button
                      key={def.type}
                      type="button"
                      onClick={() => {
                        addSticker(def)
                        setMobileSheet(null)
                      }}
                      className="p-2 rounded-2xl bg-[#FFF9FA] border border-[#F2D5DC]/70 flex flex-col items-center gap-1 active:scale-95 transition-transform"
                    >
                      <div className="w-10 h-10 flex items-center justify-center">
                        <StickerSVG
                          element={{
                            id: `mprev-${def.type}`,
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
          )}

          {mobileSheet === 'template' && (
            <div className="space-y-2 pb-2">
              {visiblePresets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    loadPreset(p.id)
                    setMobileSheet(null)
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-[#FFF9FA] border border-[#F2D5DC] text-xs font-extrabold text-[#162A4C]"
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {mobileSheet === 'latar' && (
            <div className="space-y-2.5 pb-2">
              <button
                type="button"
                onClick={() => bgFileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-[#EFAAB6] bg-[#FFF9FA] text-[#162A4C] text-xs font-extrabold flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5 text-[#D98395]" />
                Upload Foto Ruanganmu
              </button>
              <div className="grid grid-cols-3 gap-2">
                {visibleBgs.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => {
                      setCustomBgUrl(null)
                      setBackgroundId(bg.id)
                      setMobileSheet(null)
                    }}
                    className={`p-1.5 rounded-xl border-2 text-left ${
                      !customBgUrl && backgroundId === bg.id
                        ? 'border-[#162A4C] bg-white'
                        : 'border-transparent bg-[#FFF9FA]'
                    }`}
                  >
                    <div className="h-8 rounded-lg mb-1 overflow-hidden flex flex-col">
                      <div
                        className="flex-1"
                        style={{ background: `linear-gradient(180deg, ${bg.wallTop}, ${bg.wallBottom})` }}
                      />
                      <div className="h-2" style={{ backgroundColor: bg.floor }} />
                    </div>
                    <span className="block text-[10px] font-bold text-[#162A4C] truncate">
                      {bg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mobileSheet === 'layer' && (
            <div className="space-y-1.5 pb-2">
              {[...elements].reverse().map((el) => (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(el.id)
                    setMobileSheet('atur')
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                    el.id === selectedId ? 'bg-[#162A4C] text-white' : 'bg-[#FFF9FA] text-[#162A4C]'
                  }`}
                >
                  <span>{getElementDisplayName(el)}</span>
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/60"
                    style={{ backgroundColor: el.color }}
                  />
                </button>
              ))}
            </div>
          )}

          {mobileSheet === 'atur' && (
            <div className="space-y-3 pb-2">
              {!selectedEl ? (
                <p className="text-xs text-[#162A4C]/55">
                  Ketuk salah satu elemen di kanvas terlebih dahulu untuk mengaturnya.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-5 gap-1.5">
                    <button
                      type="button"
                      onClick={() => shiftLayer('up')}
                      className="p-2.5 rounded-xl bg-[#FFF5F7] text-[#162A4C] flex items-center justify-center"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => shiftLayer('down')}
                      className="p-2.5 rounded-xl bg-[#FFF5F7] text-[#162A4C] flex items-center justify-center"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSelected({ flipX: !selectedEl.flipX })}
                      className="p-2.5 rounded-xl bg-[#FFF5F7] text-[#162A4C] flex items-center justify-center"
                    >
                      <FlipHorizontal2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={duplicateSelected}
                      className="p-2.5 rounded-xl bg-[#FFF5F7] text-[#162A4C] flex items-center justify-center"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={deleteSelected}
                      className="p-2.5 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {selectedDef?.supportsBanner && (
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-[#FDEBED] text-[#162A4C] text-xs font-extrabold flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D98395]" />
                      {selectedEl.customImageUrl ? 'Ganti Gambar Banner' : 'Masukan Gambar Banner'}
                    </button>
                  )}

                  {(selectedEl.type === 'custom-text' ||
                    selectedEl.type === 'marquee-number' ||
                    selectedEl.type === 'neon-sign') && (
                    <input
                      type="text"
                      maxLength={selectedEl.type === 'marquee-number' ? 3 : 24}
                      value={selectedEl.text ?? ''}
                      onChange={(e) => updateSelected({ text: e.target.value })}
                      className="w-full rounded-xl border border-[#EFAAB6]/60 bg-[#FFF9FA] px-3 py-2 text-sm font-bold text-[#162A4C]"
                    />
                  )}

                  {selectedEl.type !== 'custom-png' && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                      {STUDIO_PALETTE.map((swatch) => (
                        <button
                          key={`m-${swatch.hex}`}
                          type="button"
                          onClick={() => {
                            if (
                              (selectedEl.type === 'balloon-cluster' ||
                                selectedEl.type === 'garland-arch') &&
                              selectedEl.secondaryColor === selectedEl.color
                            ) {
                              updateSelected({ color: swatch.hex, secondaryColor: swatch.hex })
                            } else {
                              updateSelected({ color: swatch.hex })
                            }
                          }}
                          className={`w-7 h-7 rounded-full border shrink-0 ${
                            selectedEl.color === swatch.hex
                              ? 'ring-2 ring-[#162A4C] border-white'
                              : 'border-black/10'
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[10px] font-bold text-[#162A4C] mb-1">
                        Ukuran ({Math.round(selectedEl.width)}%)
                      </span>
                      <input
                        type="range"
                        min={6}
                        max={68}
                        value={selectedEl.width}
                        onChange={(e) => updateSelected({ width: Number(e.target.value) }, false)}
                        onTouchEnd={() => commitElements(elements)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-[#162A4C] mb-1">
                        Putar ({selectedEl.rotation}°)
                      </span>
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        value={selectedEl.rotation}
                        onChange={(e) => updateSelected({ rotation: Number(e.target.value) }, false)}
                        onTouchEnd={() => commitElements(elements)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* iPhone / Mobile Bottom Dock Bar */}
      <nav className="lg:hidden bg-white border-t border-[#FDEBED] px-2 pt-1.5 pb-safe grid grid-cols-5 gap-1 shrink-0 z-30">
        {[
          { id: 'elemen' as const, label: 'Elemen', icon: Plus },
          { id: 'template' as const, label: 'Template', icon: LayoutTemplate },
          { id: 'latar' as const, label: 'Latar', icon: ImageIcon },
          { id: 'atur' as const, label: 'Atur', icon: Sparkles },
          { id: 'layer' as const, label: 'Layer', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon
          const active = mobileSheet === tab.id
          const highlightAtur = tab.id === 'atur' && Boolean(selectedEl) && !active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileSheet(active ? null : tab.id)}
              className={`py-2 rounded-2xl flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
                active
                  ? 'bg-[#162A4C] text-white'
                  : highlightAtur
                    ? 'bg-[#FDEBED] text-[#162A4C]'
                    : 'text-[#162A4C]/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* Studio 2D Content Settings Drawer */}
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
                <h2 className="text-sm font-extrabold text-[#162A4C]">Pengaturan Konten Studio 2D</h2>
                <p className="text-[11px] text-[#162A4C]/55">
                  Edit nama, sembunyikan/hapus elemen, template &amp; latar.
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
                        onClick={() => toggleHideType(def.type)}
                        title={hidden ? 'Tampilkan lagi' : 'Sembunyikan / Hapus'}
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
                        onClick={() => toggleHidePreset(p.id)}
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
                        onClick={() => toggleHideBg(b.id)}
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
          </div>
        </div>
      )}
    </div>
  )
}
