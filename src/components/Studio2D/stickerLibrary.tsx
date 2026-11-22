import React from 'react'

export type StickerCategory = 'Backdrop' | 'Balon' | 'Properti'

export type StickerType =
  | 'arch-panel'
  | 'double-arch'
  | 'scallop-arch'
  | 'circle-backdrop'
  | 'square-backdrop-2x2'
  | 'square-backdrop-2x3'
  | 'sequin-wall-2x2'
  | 'sequin-wall-2x3'
  | 'garland-arch'
  | 'balloon-cluster'
  | 'single-balloon'
  | 'foil-heart'
  | 'foil-star'
  | 'ribbon-bow'
  | 'uplight-spot'
  | 'cylinder-fluted-70x25'
  | 'cylinder-fluted-80x40'
  | 'acrylic-cube-table'
  | 'gold-cross-table'
  | 'marquee-number'
  | 'custom-text'
  | 'neon-sign'
  | 'teddy-bear'
  | 'ribbon-cake'
  | 'floral-bouquet'
  | 'custom-png'

export interface CanvasElement {
  id: string
  type: StickerType
  x: number // percentage 0..100
  y: number // percentage 0..100
  width: number // percentage of canvas width
  rotation: number // degrees
  flipX?: boolean
  color: string
  secondaryColor?: string
  text?: string
  customImageUrl?: string // For custom backdrop banner (per panel) OR custom PNG property
}

export interface StickerDefinition {
  type: StickerType
  label: string
  category: StickerCategory
  defaultColor: string
  defaultSecondary?: string
  defaultWidth: number
  defaultText?: string
  supportsBanner?: boolean
}

export const STUDIO_PALETTE = [
  { name: 'Blush Pink', hex: '#F2B3BD' },
  { name: 'Soft Blush', hex: '#FDEBED' },
  { name: 'Bubu Navy', hex: '#162A4C' },
  { name: 'Pearl White', hex: '#FFFDFC' },
  { name: 'Champagne Gold', hex: '#DFBE8A' },
  { name: 'Rose Gold', hex: '#E3A4A8' },
  { name: 'Silver Shimmer', hex: '#D4DBE3' },
  { name: 'Dusty Rose', hex: '#D98395' },
  { name: 'Baby Blue', hex: '#BFDDF0' },
  { name: 'Butter Cream', hex: '#F7E6B5' },
  { name: 'Soft Lilac', hex: '#D9CCF2' },
  { name: 'Sage Mist', hex: '#C7DFCF' },
  { name: 'Jet Black', hex: '#1E2430' },
]

export interface RoomBackground {
  id: string
  label: string
  wallTop: string
  wallBottom: string
  floor: string
  accent: string
  style: 'studio' | 'living' | 'hotel' | 'resto' | 'cafe' | 'stage' | 'ballroom' | 'outdoor'
}

export const ROOM_BACKGROUNDS: RoomBackground[] = [
  { id: 'blush', label: 'Studio Blush', wallTop: '#FFF7F8', wallBottom: '#FDEBED', floor: '#F3DCE1', accent: '#EFAAB6', style: 'studio' },
  { id: 'living-room', label: 'Ruang Tamu', wallTop: '#F9F5F0', wallBottom: '#EFE6DC', floor: '#C9A889', accent: '#DFD2C3', style: 'living' },
  { id: 'hotel-lobby', label: 'Lobby Hotel', wallTop: '#F4EFE8', wallBottom: '#E6DDD1', floor: '#D8CFC4', accent: '#DFBE8A', style: 'hotel' },
  { id: 'resto', label: 'Resto', wallTop: '#3C322C', wallBottom: '#57463C', floor: '#2E2520', accent: '#E5BE8A', style: 'resto' },
  { id: 'cafe', label: 'Cafe Estetik', wallTop: '#F5EFE9', wallBottom: '#E8DDD1', floor: '#B9987B', accent: '#C8A98E', style: 'cafe' },
  { id: 'stage', label: 'Atas Panggung', wallTop: '#161D30', wallBottom: '#232E4A', floor: '#2B2320', accent: '#FFE49E', style: 'stage' },
  { id: 'ballroom', label: 'Ballroom', wallTop: '#F7F1E8', wallBottom: '#EADFCB', floor: '#CBBBA6', accent: '#DFBE8A', style: 'ballroom' },
  { id: 'outdoor', label: 'Outdoor Taman', wallTop: '#DDF0FF', wallBottom: '#F5FAFF', floor: '#9BC18D', accent: '#79A56C', style: 'outdoor' },
]

export const STICKER_DEFINITIONS: StickerDefinition[] = [
  // Backdrop
  { type: 'arch-panel', label: 'Arch Panel', category: 'Backdrop', defaultColor: '#FFFDFC', defaultWidth: 26, supportsBanner: true },
  { type: 'double-arch', label: 'Double Arch', category: 'Backdrop', defaultColor: '#FFFDFC', defaultSecondary: '#FDEBED', defaultWidth: 36, supportsBanner: true },
  { type: 'scallop-arch', label: 'Arch Gelombang', category: 'Backdrop', defaultColor: '#FDEBED', defaultWidth: 26, supportsBanner: true },
  { type: 'circle-backdrop', label: 'Backdrop Bulat', category: 'Backdrop', defaultColor: '#FFFDFC', defaultWidth: 30, supportsBanner: true },
  { type: 'square-backdrop-2x2', label: 'Kotak 2×2m', category: 'Backdrop', defaultColor: '#FFFDFC', defaultWidth: 32, supportsBanner: true },
  { type: 'square-backdrop-2x3', label: 'Kotak 2×3m', category: 'Backdrop', defaultColor: '#FFFDFC', defaultWidth: 44, supportsBanner: true },
  { type: 'sequin-wall-2x2', label: 'Shimmer 2×2m', category: 'Backdrop', defaultColor: '#DFBE8A', defaultWidth: 32 },
  { type: 'sequin-wall-2x3', label: 'Shimmer 2×3m', category: 'Backdrop', defaultColor: '#DFBE8A', defaultWidth: 44 },

  // Balon (default 1 warna agar konsisten & semua balon bisa diubah warna!)
  { type: 'garland-arch', label: 'Garland Lengkung', category: 'Balon', defaultColor: '#F2B3BD', defaultSecondary: '#F2B3BD', defaultWidth: 46 },
  { type: 'balloon-cluster', label: 'Balon Cluster', category: 'Balon', defaultColor: '#F2B3BD', defaultSecondary: '#F2B3BD', defaultWidth: 19 },
  { type: 'single-balloon', label: 'Balon Satuan', category: 'Balon', defaultColor: '#EFAAB6', defaultWidth: 9 },
  { type: 'foil-heart', label: 'Foil Love', category: 'Balon', defaultColor: '#D98395', defaultWidth: 10 },
  { type: 'foil-star', label: 'Foil Bintang', category: 'Balon', defaultColor: '#DFBE8A', defaultWidth: 10 },
  { type: 'ribbon-bow', label: 'Pita Satin', category: 'Balon', defaultColor: '#EFAAB6', defaultWidth: 11 },

  // Properti Dekor Sesungguhnya (Proporsi Realistis)
  { type: 'uplight-spot', label: 'Lampu Sorot Bawah', category: 'Properti', defaultColor: '#FFE599', defaultWidth: 16 },
  { type: 'cylinder-fluted-70x25', label: 'Silinder Garis 70×25', category: 'Properti', defaultColor: '#FFFDFC', defaultWidth: 8 },
  { type: 'cylinder-fluted-80x40', label: 'Silinder Garis 80×40', category: 'Properti', defaultColor: '#FFFDFC', defaultWidth: 13 },
  { type: 'acrylic-cube-table', label: 'Meja Acrylic Kotak', category: 'Properti', defaultColor: '#E8F4FA', defaultWidth: 13 },
  { type: 'gold-cross-table', label: 'Meja Emas Silang', category: 'Properti', defaultColor: '#FFFDFC', defaultSecondary: '#D4AF37', defaultWidth: 16 },
  { type: 'marquee-number', label: 'Angka Lampu', category: 'Properti', defaultColor: '#FFFDF8', defaultWidth: 16, defaultText: '17' },
  { type: 'custom-text', label: 'Tulisan Nama', category: 'Properti', defaultColor: '#162A4C', defaultWidth: 26, defaultText: 'Happy Birthday' },
  { type: 'neon-sign', label: 'Lampu Neon', category: 'Properti', defaultColor: '#FFE28A', defaultWidth: 22, defaultText: 'Oh Baby' },
  { type: 'teddy-bear', label: 'Boneka Teddy', category: 'Properti', defaultColor: '#D8AD86', defaultWidth: 11 },
  { type: 'ribbon-cake', label: 'Kue Pita', category: 'Properti', defaultColor: '#FDEBED', defaultWidth: 9 },
  { type: 'floral-bouquet', label: 'Buket Bunga', category: 'Properti', defaultColor: '#EFAAB6', defaultWidth: 11 },
]

export interface StudioPreset {
  id: string
  name: string
  backgroundId: string
  elements: CanvasElement[]
}

export const STUDIO_PRESETS: StudioPreset[] = [
  {
    id: 'bubu-signature',
    name: 'Blush & Navy Ribbon',
    backgroundId: 'blush',
    elements: [
      { id: 's0', type: 'uplight-spot', x: 50, y: 69, width: 22, rotation: 0, color: '#FFE5A3' },
      { id: 's1', type: 'double-arch', x: 51, y: 52, width: 42, rotation: 0, color: '#FFFDFC', secondaryColor: '#FDEBED' },
      { id: 's3', type: 'garland-arch', x: 48, y: 36, width: 47, rotation: 0, color: '#F2B3BD', secondaryColor: '#162A4C' },
      { id: 's4', type: 'custom-text', x: 44, y: 45, width: 23, rotation: 0, color: '#162A4C', text: 'Happy Birthday' },
      { id: 's5', type: 'ribbon-bow', x: 69, y: 52, width: 10, rotation: 8, color: '#EFAAB6' },
      { id: 's6', type: 'cylinder-fluted-80x40', x: 50, y: 71, width: 12, rotation: 0, color: '#FFFDFC' },
      { id: 's7', type: 'ribbon-cake', x: 50, y: 54, width: 9, rotation: 0, color: '#FDEBED' },
      { id: 's8', type: 'balloon-cluster', x: 28, y: 72, width: 17, rotation: -4, color: '#F2B3BD', secondaryColor: '#162A4C' },
    ],
  },
  {
    id: 'sweet-17-glow',
    name: 'Champagne 17 Shimmer',
    backgroundId: 'ballroom',
    elements: [
      { id: 'g0', type: 'uplight-spot', x: 50, y: 70, width: 26, rotation: 0, color: '#FFE49E' },
      { id: 'g1', type: 'sequin-wall-2x3', x: 50, y: 50, width: 46, rotation: 0, color: '#DFBE8A' },
      { id: 'g2', type: 'garland-arch', x: 50, y: 34, width: 52, rotation: 0, color: '#F2B3BD', secondaryColor: '#DFBE8A' },
      { id: 'g3', type: 'neon-sign', x: 50, y: 43, width: 24, rotation: 0, color: '#FFF5C2', text: 'Sweet 17' },
      { id: 'g4', type: 'marquee-number', x: 38, y: 71, width: 16, rotation: 0, color: '#FFFDF8', text: '17' },
      { id: 'g5', type: 'gold-cross-table', x: 61, y: 71, width: 15, rotation: 0, color: '#FFFDFC', secondaryColor: '#D4AF37' },
      { id: 'g6', type: 'ribbon-cake', x: 61, y: 55, width: 8, rotation: 0, color: '#FFFDFC' },
    ],
  },
  {
    id: 'pastel-cloud',
    name: 'Teddy Pastel Cloud',
    backgroundId: 'living-room',
    elements: [
      { id: 'p1', type: 'scallop-arch', x: 43, y: 53, width: 27, rotation: 0, color: '#FFFDFC' },
      { id: 'p2', type: 'arch-panel', x: 59, y: 52, width: 25, rotation: 0, color: '#BFDDF0' },
      { id: 'p3', type: 'garland-arch', x: 50, y: 35, width: 48, rotation: 0, color: '#BFDDF0', secondaryColor: '#F7E6B5' },
      { id: 'p4', type: 'custom-text', x: 58, y: 46, width: 22, rotation: 0, color: '#162A4C', text: 'Baby Theo 1st' },
      { id: 'p5', type: 'cylinder-fluted-80x40', x: 41, y: 71, width: 12, rotation: 0, color: '#FFFDFC' },
      { id: 'p6', type: 'teddy-bear', x: 41, y: 53, width: 10, rotation: 0, color: '#D8AD86' },
      { id: 'p7', type: 'cylinder-fluted-70x25', x: 66, y: 73, width: 7.5, rotation: 0, color: '#F7E6B5' },
      { id: 'p8', type: 'balloon-cluster', x: 74, y: 72, width: 16, rotation: 6, color: '#F2B3BD', secondaryColor: '#F7E6B5' },
    ],
  },
  {
    id: 'bridal-intimate',
    name: 'Rose Satin Intimate',
    backgroundId: 'hotel-lobby',
    elements: [
      { id: 'b0', type: 'uplight-spot', x: 50, y: 70, width: 22, rotation: 0, color: '#FFD8E0' },
      { id: 'b1', type: 'square-backdrop-2x2', x: 50, y: 51, width: 34, rotation: 0, color: '#FFFDFC' },
      { id: 'b2', type: 'garland-arch', x: 50, y: 34, width: 46, rotation: 0, color: '#EFAAB6', secondaryColor: '#DFBE8A' },
      { id: 'b3', type: 'custom-text', x: 50, y: 46, width: 24, rotation: 0, color: '#D98395', text: 'Bride to Be' },
      { id: 'b4', type: 'acrylic-cube-table', x: 50, y: 72, width: 13, rotation: 0, color: '#E8F4FA' },
      { id: 'b5', type: 'floral-bouquet', x: 50, y: 56, width: 11, rotation: 0, color: '#EFAAB6' },
      { id: 'b6', type: 'ribbon-bow', x: 68, y: 52, width: 10, rotation: 8, color: '#D98395' },
    ],
  },
]

/**
 * Helper: slightly lighten or darken a hex color for realistic sequin & balloon shading.
 */
function shadeHex(hex: string, percent: number): string {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return hex
  const num = parseInt(clean, 16)
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + Math.round(2.55 * percent)))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)))
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(2.55 * percent)))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

/**
 * Renders architectural Room Background SVG overlay (windows, pillars, stage lights, etc.)
 */
export function RoomBackgroundOverlay({ bg }: { bg: RoomBackground }) {
  if (bg.style === 'studio') return null

  if (bg.style === 'living') {
    return (
      <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
        {/* Wainscoting wall molding */}
        <rect x="0" y="295" width="800" height="95" fill="#E6DACB" opacity="0.45" />
        <line x1="0" y1="295" x2="800" y2="295" stroke="#CBBAA6" strokeWidth="3" />
        {/* Sunlit side window */}
        <rect x="34" y="48" width="110" height="200" rx="4" fill="#FFFDF8" stroke="#D8C9B8" strokeWidth="6" opacity="0.7" />
        <line x1="89" y1="48" x2="89" y2="248" stroke="#D8C9B8" strokeWidth="4" opacity="0.7" />
        <line x1="34" y1="148" x2="144" y2="148" stroke="#D8C9B8" strokeWidth="4" opacity="0.7" />
        {/* Wood floor planks */}
        <line x1="0" y1="420" x2="800" y2="420" stroke="#A68567" strokeWidth="1" opacity="0.35" />
        <line x1="0" y1="458" x2="800" y2="458" stroke="#A68567" strokeWidth="1" opacity="0.35" />
      </svg>
    )
  }

  if (bg.style === 'hotel' || bg.style === 'ballroom') {
    return (
      <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
        {/* Classic luxury pillars */}
        <rect x="22" y="0" width="52" height="390" fill="#FFFDF8" opacity="0.32" />
        <rect x="726" y="0" width="52" height="390" fill="#FFFDF8" opacity="0.32" />
        {/* Wall panel frames */}
        <rect x="105" y="45" width="590" height="310" fill="none" stroke={bg.accent} strokeWidth="2" opacity="0.45" />
        {/* Soft chandelier glow at top */}
        <ellipse cx="400" cy="18" rx="180" ry="42" fill="#FFF5D6" opacity="0.55" />
        {bg.style === 'ballroom' && (
          <>
            <ellipse cx="190" cy="24" rx="90" ry="26" fill="#FFF5D6" opacity="0.45" />
            <ellipse cx="610" cy="24" rx="90" ry="26" fill="#FFF5D6" opacity="0.45" />
          </>
        )}
      </svg>
    )
  }

  if (bg.style === 'resto' || bg.style === 'cafe') {
    return (
      <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
        {/* Warm pendant lamps */}
        {[160, 400, 640].map((cx) => (
          <g key={cx}>
            <line x1={cx} y1="0" x2={cx} y2="62" stroke={bg.accent} strokeWidth="2" opacity="0.6" />
            <ellipse cx={cx} cy="72" rx="22" ry="12" fill={bg.accent} opacity="0.7" />
            <ellipse cx={cx} cy="96" rx="70" ry="42" fill="#FFE6B0" opacity="0.16" />
          </g>
        ))}
        {/* Vertical slat paneling on sides */}
        {[24, 42, 60, 740, 758, 776].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="390" stroke={bg.accent} strokeWidth="4" opacity="0.22" />
        ))}
      </svg>
    )
  }

  if (bg.style === 'stage') {
    return (
      <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
        {/* Stage curtains */}
        <path d="M0 0 H110 Q85 200 100 390 H0 Z" fill="#0F1526" opacity="0.65" />
        <path d="M800 0 H690 Q715 200 700 390 H800 Z" fill="#0F1526" opacity="0.65" />
        {/* Stage spotlights */}
        <polygon points="180,0 80,390 310,390" fill="#FFE8A8" opacity="0.09" />
        <polygon points="620,0 490,390 720,390" fill="#F2B3BD" opacity="0.09" />
        {/* Stage edge */}
        <rect x="0" y="385" width="800" height="8" fill="#DFBE8A" opacity="0.55" />
      </svg>
    )
  }

  // Outdoor garden
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
      {/* Soft clouds */}
      <g fill="#FFFFFF" opacity="0.8">
        <circle cx="140" cy="76" r="28" />
        <circle cx="172" cy="72" r="34" />
        <circle cx="206" cy="78" r="24" />
        <circle cx="620" cy="68" r="26" />
        <circle cx="654" cy="64" r="32" />
      </g>
      {/* Distant soft garden bushes */}
      <g fill="#8BB77E" opacity="0.55">
        <circle cx="60" cy="380" r="65" />
        <circle cx="150" cy="390" r="55" />
        <circle cx="660" cy="390" r="58" />
        <circle cx="745" cy="378" r="68" />
      </g>
    </svg>
  )
}

/**
 * Helper to render authentic Sequin Shimmer Wall (grid of reflective 30x30cm shimmer tiles)
 */
function SequinShimmerSVG({
  color,
  cols,
  rows,
  viewW,
  viewH,
}: {
  color: string
  cols: number
  rows: number
  viewW: number
  viewH: number
}) {
  const pad = 10
  const cellW = (viewW - pad * 2) / cols
  const cellH = (viewH - pad * 2) / rows
  const light = shadeHex(color, 26)
  const bright = shadeHex(color, 44)
  const dark = shadeHex(color, -20)

  const tiles: React.ReactElement[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const hash = (r * 31 + c * 17) % 11
      const fill =
        hash === 0 || hash === 5
          ? bright
          : hash === 2 || hash === 7 || hash === 9
            ? light
            : hash === 4 || hash === 10
              ? dark
              : color
      const x = pad + c * cellW
      const y = pad + r * cellH
      tiles.push(
        <g key={`${r}-${c}`}>
          <rect
            x={x + 0.8}
            y={y + 0.8}
            width={cellW - 1.6}
            height={cellH - 1.6}
            rx="1.2"
            fill={fill}
            stroke={dark}
            strokeOpacity="0.28"
            strokeWidth="0.6"
          />
          {hash === 0 && (
            <path
              d={`M${x + cellW / 2} ${y + 1.5} L${x + cellW / 2 + 1.2} ${y + cellH / 2} L${x + cellW / 2} ${y + cellH - 1.5} L${x + cellW / 2 - 1.2} ${y + cellH / 2} Z`}
              fill="#FFFFFF"
              opacity="0.88"
            />
          )}
        </g>
      )
    }
  }

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full h-full drop-shadow-md">
      {/* Backing grid frame */}
      <rect x="4" y="4" width={viewW - 8} height={viewH - 8} rx="4" fill={dark} />
      {tiles}
      {/* Subtle diagonal shimmer sheen */}
      <polygon
        points={`10,10 ${viewW * 0.45},10 10,${viewH * 0.65}`}
        fill="#FFFFFF"
        opacity="0.14"
      />
    </svg>
  )
}

/**
 * Renders every realistic 2D decoration property & custom PNG sticker.
 */
export function StickerSVG({ element }: { element: CanvasElement }): React.ReactElement {
  const { id, type, color, secondaryColor, text = '', customImageUrl } = element
  const sec = secondaryColor || color
  const clipId = `clip-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`

  switch (type) {
    case 'custom-png':
      return (
        <svg viewBox="0 0 180 180" className="w-full h-full drop-shadow-sm">
          {customImageUrl ? (
            <image href={customImageUrl} x="4" y="4" width="172" height="172" preserveAspectRatio="xMidYMid meet" />
          ) : (
            <rect x="10" y="10" width="160" height="160" rx="16" fill="#FDEBED" stroke="#EFAAB6" strokeDasharray="6 4" />
          )}
        </svg>
      )

    case 'arch-panel':
      return (
        <svg viewBox="0 0 180 240" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <path d="M12 234 V94 A78 78 0 0 1 168 94 V234 Z" />
            </clipPath>
          </defs>
          <path d="M12 234 V94 A78 78 0 0 1 168 94 V234 Z" fill={color} stroke="#162A4C" strokeOpacity="0.14" strokeWidth="2.5" />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="12"
              y="16"
              width="156"
              height="218"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
          <path d="M12 234 V94 A78 78 0 0 1 168 94 V234 Z" fill="none" stroke="#162A4C" strokeOpacity="0.14" strokeWidth="2.5" />
        </svg>
      )

    case 'double-arch':
      return (
        <svg viewBox="0 0 260 230" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <path d="M16 224 V92 A74 74 0 0 1 164 92 V224 Z" />
            </clipPath>
          </defs>
          <path d="M16 224 V92 A74 74 0 0 1 164 92 V224 Z" fill={color} stroke="#162A4C" strokeOpacity="0.14" strokeWidth="2.5" />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="16"
              y="18"
              width="148"
              height="206"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
          <path d="M124 224 V116 A60 60 0 0 1 244 116 V224 Z" fill={sec} stroke="#162A4C" strokeOpacity="0.14" strokeWidth="2.5" />
        </svg>
      )

    case 'scallop-arch':
      return (
        <svg viewBox="0 0 180 240" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <path d="M16 234 V98 C16 82 28 74 36 62 C44 48 56 36 70 30 C82 24 98 24 110 30 C124 36 136 48 144 62 C152 74 164 82 164 98 V234 Z" />
            </clipPath>
          </defs>
          <path
            d="M16 234 V98 C16 82 28 74 36 62 C44 48 56 36 70 30 C82 24 98 24 110 30 C124 36 136 48 144 62 C152 74 164 82 164 98 V234 Z"
            fill={color}
            stroke="#162A4C"
            strokeOpacity="0.14"
            strokeWidth="2.5"
          />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="16"
              y="22"
              width="148"
              height="212"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
        </svg>
      )

    case 'circle-backdrop':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <circle cx="100" cy="100" r="88" />
            </clipPath>
          </defs>
          <circle cx="100" cy="100" r="90" fill={color} stroke="#DFBE8A" strokeWidth="4" />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="12"
              y="12"
              width="176"
              height="176"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
          <circle cx="100" cy="100" r="90" fill="none" stroke="#DFBE8A" strokeWidth="4" />
        </svg>
      )

    case 'square-backdrop-2x2':
      return (
        <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <rect x="8" y="8" width="204" height="204" rx="4" />
            </clipPath>
          </defs>
          <rect x="8" y="8" width="204" height="204" rx="4" fill={color} stroke="#162A4C" strokeOpacity="0.16" strokeWidth="3" />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="8"
              y="8"
              width="204"
              height="204"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
          <rect x="8" y="8" width="204" height="204" rx="4" fill="none" stroke="#162A4C" strokeOpacity="0.16" strokeWidth="3" />
        </svg>
      )

    case 'square-backdrop-2x3':
      return (
        <svg viewBox="0 0 330 220" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <rect x="8" y="8" width="314" height="204" rx="4" />
            </clipPath>
          </defs>
          <rect x="8" y="8" width="314" height="204" rx="4" fill={color} stroke="#162A4C" strokeOpacity="0.16" strokeWidth="3" />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="8"
              y="8"
              width="314"
              height="204"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
          <rect x="8" y="8" width="314" height="204" rx="4" fill="none" stroke="#162A4C" strokeOpacity="0.16" strokeWidth="3" />
        </svg>
      )

    case 'sequin-wall-2x2':
      return <SequinShimmerSVG color={color} cols={10} rows={10} viewW={220} viewH={220} />

    case 'sequin-wall-2x3':
      return <SequinShimmerSVG color={color} cols={15} rows={10} viewW={330} viewH={220} />

    case 'garland-arch': {
      const midTone = shadeHex(color, 12)
      return (
        <svg viewBox="0 0 320 180" className="w-full h-full drop-shadow-sm">
          {[
            { cx: 34, cy: 148, r: 22, c: color },
            { cx: 50, cy: 118, r: 24, c: sec },
            { cx: 42, cy: 86, r: 19, c: midTone },
            { cx: 68, cy: 62, r: 26, c: color },
            { cx: 100, cy: 42, r: 23, c: sec },
            { cx: 135, cy: 32, r: 27, c: midTone },
            { cx: 172, cy: 28, r: 24, c: color },
            { cx: 208, cy: 36, r: 26, c: sec },
            { cx: 242, cy: 52, r: 22, c: midTone },
            { cx: 270, cy: 76, r: 25, c: color },
            { cx: 284, cy: 108, r: 21, c: sec },
            { cx: 278, cy: 138, r: 18, c: midTone },
          ].map((b, i) => (
            <g key={i}>
              <circle cx={b.cx} cy={b.cy} r={b.r} fill={b.c} stroke="#162A4C" strokeOpacity="0.09" strokeWidth="1.5" />
              <ellipse
                cx={b.cx - b.r * 0.32}
                cy={b.cy - b.r * 0.32}
                rx={b.r * 0.22}
                ry={b.r * 0.34}
                fill="#FFFFFF"
                opacity="0.48"
                transform={`rotate(-24 ${b.cx - b.r * 0.32} ${b.cy - b.r * 0.32})`}
              />
            </g>
          ))}
        </svg>
      )
    }

    case 'balloon-cluster': {
      // FIXED: ZERO hardcoded white balloon — all 5 balloons follow color & secondaryColor!
      const tint = shadeHex(color, 10)
      return (
        <svg viewBox="0 0 140 130" className="w-full h-full drop-shadow-sm">
          {[
            { cx: 45, cy: 86, r: 28, c: color },
            { cx: 90, cy: 88, r: 26, c: sec },
            { cx: 68, cy: 52, r: 30, c: tint },
            { cx: 36, cy: 50, r: 18, c: sec },
            { cx: 102, cy: 54, r: 19, c: color },
          ].map((b, i) => (
            <g key={i}>
              <circle cx={b.cx} cy={b.cy} r={b.r} fill={b.c} stroke="#162A4C" strokeOpacity="0.09" strokeWidth="1.5" />
              <ellipse
                cx={b.cx - b.r * 0.3}
                cy={b.cy - b.r * 0.3}
                rx={b.r * 0.2}
                ry={b.r * 0.32}
                fill="#FFF"
                opacity="0.5"
                transform={`rotate(-22 ${b.cx - b.r * 0.3} ${b.cy - b.r * 0.3})`}
              />
            </g>
          ))}
        </svg>
      )
    }

    case 'single-balloon':
      return (
        <svg viewBox="0 0 90 150" className="w-full h-full drop-shadow-sm">
          <path d="M45 96 Q49 118 42 146" fill="none" stroke="#C5A9AF" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="45" cy="48" rx="34" ry="42" fill={color} stroke="#162A4C" strokeOpacity="0.09" strokeWidth="1.5" />
          <polygon points="40,90 50,90 45,98" fill={color} />
          <ellipse cx="32" cy="34" rx="7" ry="13" fill="#FFF" opacity="0.52" transform="rotate(-18 32 34)" />
        </svg>
      )

    case 'foil-heart':
      return (
        <svg viewBox="0 0 110 110" className="w-full h-full drop-shadow-sm">
          <path
            d="M55 96 C25 74 10 56 10 36 C10 20 22 10 36 10 C45 10 51 15 55 22 C59 15 65 10 74 10 C88 10 100 20 100 36 C100 56 85 74 55 96 Z"
            fill={color}
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          <path d="M26 30 Q30 20 40 20" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
        </svg>
      )

    case 'foil-star':
      return (
        <svg viewBox="0 0 110 110" className="w-full h-full drop-shadow-sm">
          <polygon
            points="55,8 68,38 100,41 75,62 83,95 55,77 27,95 35,62 10,41 42,38"
            fill={color}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon points="55,20 62,42 55,54 48,42" fill="#FFFFFF" opacity="0.45" />
        </svg>
      )

    case 'ribbon-bow':
      return (
        <svg viewBox="0 0 130 110" className="w-full h-full drop-shadow-sm">
          <path d="M58 50 L36 100 L50 94 L62 56 Z" fill={color} />
          <path d="M72 50 L94 100 L80 94 L68 56 Z" fill={color} />
          <ellipse cx="38" cy="40" rx="28" ry="17" fill={color} transform="rotate(-16 38 40)" stroke="#162A4C" strokeOpacity="0.1" strokeWidth="2" />
          <ellipse cx="92" cy="40" rx="28" ry="17" fill={color} transform="rotate(16 92 40)" stroke="#162A4C" strokeOpacity="0.1" strokeWidth="2" />
          <circle cx="65" cy="44" r="11" fill={color} stroke="#162A4C" strokeOpacity="0.16" strokeWidth="2" />
        </svg>
      )

    case 'uplight-spot':
      return (
        <svg viewBox="0 0 180 180" className="w-full h-full">
          <defs>
            <linearGradient id={`beam-${clipId}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity="0.68" />
              <stop offset="55%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Upward soft spotlight cone */}
          <polygon points="74,154 106,154 172,10 8,10" fill={`url(#beam-${clipId})`} />
          {/* Realistic black LED Par Lamp housing on floor */}
          <rect x="66" y="150" width="48" height="18" rx="4" fill="#232936" />
          <ellipse cx="90" cy="151" rx="20" ry="4.5" fill={color} />
          <path d="M62 172 H118" stroke="#161B24" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )

    case 'cylinder-fluted-70x25': {
      // Realistic slender 70cm tall x 25cm wide fluted cylinder plinth (aspect ~1:2.6)
      const groove = shadeHex(color, -14)
      return (
        <svg viewBox="0 0 80 200" className="w-full h-full drop-shadow-sm">
          <rect x="8" y="12" width="64" height="180" rx="6" fill={color} stroke="#162A4C" strokeOpacity="0.15" strokeWidth="2" />
          {[18, 28, 38, 48, 58, 66].map((x) => (
            <line key={x} x1={x} y1="18" x2={x} y2="188" stroke={groove} strokeWidth="2.5" opacity="0.65" />
          ))}
          <ellipse cx="40" cy="14" rx="32" ry="6" fill={shadeHex(color, 8)} stroke="#162A4C" strokeOpacity="0.12" strokeWidth="1.5" />
          <rect x="6" y="186" width="68" height="6" rx="3" fill={groove} opacity="0.45" />
        </svg>
      )
    }

    case 'cylinder-fluted-80x40': {
      // Realistic sturdy 80cm tall x 40cm wide fluted cylinder plinth (aspect 1:2)
      const groove = shadeHex(color, -14)
      return (
        <svg viewBox="0 0 120 220" className="w-full h-full drop-shadow-sm">
          <rect x="8" y="14" width="104" height="196" rx="7" fill={color} stroke="#162A4C" strokeOpacity="0.15" strokeWidth="2" />
          {[20, 32, 44, 56, 68, 80, 92, 102].map((x) => (
            <line key={x} x1={x} y1="22" x2={x} y2="205" stroke={groove} strokeWidth="3" opacity="0.65" />
          ))}
          <ellipse cx="60" cy="16" rx="52" ry="8" fill={shadeHex(color, 8)} stroke="#162A4C" strokeOpacity="0.12" strokeWidth="1.5" />
          <rect x="6" y="204" width="108" height="7" rx="3" fill={groove} opacity="0.45" />
        </svg>
      )
    }

    case 'acrylic-cube-table':
      // Realistic clear glossy square acrylic pedestal table
      return (
        <svg viewBox="0 0 130 190" className="w-full h-full drop-shadow-sm">
          <rect x="12" y="14" width="106" height="166" rx="4" fill={color} fillOpacity="0.34" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="12" y="14" width="106" height="166" rx="4" fill="none" stroke="#9CB6C9" strokeOpacity="0.55" strokeWidth="1.5" />
          {/* Inner perspective back edges */}
          <line x1="24" y1="26" x2="106" y2="26" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.5" />
          <line x1="24" y1="26" x2="24" y2="168" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1="106" y1="26" x2="106" y2="168" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.5" />
          {/* Diagonal glass specular reflection */}
          <polygon points="18,18 58,18 18,108" fill="#FFFFFF" opacity="0.45" />
          <polygon points="112,80 112,150 64,176" fill="#FFFFFF" opacity="0.22" />
        </svg>
      )

    case 'gold-cross-table': {
      // Realistic square top + metallic gold X-cross iron legs
      const gold = secondaryColor || '#D4AF37'
      const goldDark = shadeHex(gold, -22)
      return (
        <svg viewBox="0 0 160 180" className="w-full h-full drop-shadow-sm">
          {/* Square tabletop */}
          <rect x="10" y="12" width="140" height="16" rx="3" fill={color} stroke="#162A4C" strokeOpacity="0.16" strokeWidth="2" />
          {/* Gold outer frame */}
          <rect x="20" y="28" width="120" height="142" fill="none" stroke={gold} strokeWidth="5.5" />
          {/* Metallic Gold Cross (X) legs */}
          <line x1="22" y1="30" x2="138" y2="168" stroke={gold} strokeWidth="5" />
          <line x1="138" y1="30" x2="22" y2="168" stroke={goldDark} strokeWidth="5" />
          {/* Subtle gold highlight */}
          <line x1="22" y1="30" x2="138" y2="168" stroke="#FFF7D6" strokeWidth="1.4" opacity="0.65" />
          {/* Bottom horizontal gold bar */}
          <line x1="16" y1="170" x2="144" y2="170" stroke={gold} strokeWidth="5" strokeLinecap="round" />
        </svg>
      )
    }

    case 'marquee-number': {
      // FIXED: NO BOX! Freestanding giant illuminated marquee digits with warm glowing bulbs!
      const display = (text || '17').slice(0, 3)
      return (
        <svg viewBox="0 0 150 150" className="w-full h-full">
          <defs>
            <filter id={`glow-${clipId}`} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Warm soft halo behind freestanding number */}
          <text
            x="75"
            y="118"
            textAnchor="middle"
            fill="#FFE28A"
            fillOpacity="0.45"
            fontSize="112"
            fontWeight="900"
            fontFamily="Plus Jakarta Sans, sans-serif"
            filter={`url(#glow-${clipId})`}
          >
            {display}
          </text>
          {/* Crisp 3D-edged white/custom marquee number body */}
          <text
            x="75"
            y="118"
            textAnchor="middle"
            fill={color}
            stroke="#D6B57A"
            strokeWidth="3.5"
            fontSize="112"
            fontWeight="900"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            {display}
          </text>
          {/* Glowing warm marquee bulbs inlaid along the number */}
          <text
            x="75"
            y="118"
            textAnchor="middle"
            fill="none"
            stroke="#FFF4B8"
            strokeWidth="5.5"
            strokeDasharray="1 14"
            strokeLinecap="round"
            fontSize="112"
            fontWeight="900"
            fontFamily="Plus Jakarta Sans, sans-serif"
            filter={`url(#glow-${clipId})`}
          >
            {display}
          </text>
        </svg>
      )
    }

    case 'custom-text':
      return (
        <svg viewBox="0 0 260 76" className="w-full h-full">
          <text
            x="130"
            y="48"
            textAnchor="middle"
            fill={color}
            fontSize="30"
            fontFamily="Cormorant Garamond, Georgia, serif"
            fontStyle="italic"
            fontWeight="700"
          >
            {text || 'Happy Birthday'}
          </text>
        </svg>
      )

    case 'neon-sign':
      return (
        <svg viewBox="0 0 240 84" className="w-full h-full">
          <text
            x="120"
            y="56"
            textAnchor="middle"
            fill={color}
            fontSize="38"
            fontFamily="Caveat, cursive"
            fontWeight="700"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          >
            {text || 'Oh Baby'}
          </text>
        </svg>
      )

    case 'teddy-bear':
      return (
        <svg viewBox="0 0 110 130" className="w-full h-full drop-shadow-sm">
          <circle cx="32" cy="28" r="14" fill={color} />
          <circle cx="78" cy="28" r="14" fill={color} />
          <circle cx="32" cy="28" r="7" fill="#F3DEC9" />
          <circle cx="78" cy="28" r="7" fill="#F3DEC9" />
          <ellipse cx="55" cy="92" rx="30" ry="30" fill={color} />
          <ellipse cx="55" cy="94" rx="17" ry="18" fill="#F3DEC9" />
          <circle cx="55" cy="48" r="27" fill={color} />
          <ellipse cx="55" cy="56" rx="13" ry="9" fill="#F3DEC9" />
          <circle cx="45" cy="44" r="3.2" fill="#162A4C" />
          <circle cx="65" cy="44" r="3.2" fill="#162A4C" />
          <ellipse cx="55" cy="53" rx="4.5" ry="3" fill="#5D3E28" />
          <path d="M44 74 L55 79 L44 84 Z M66 74 L55 79 L66 84 Z" fill="#EFAAB6" />
        </svg>
      )

    case 'ribbon-cake':
      return (
        <svg viewBox="0 0 110 100" className="w-full h-full drop-shadow-sm">
          <rect x="20" y="78" width="70" height="8" rx="4" fill="#DFBE8A" />
          <rect x="26" y="42" width="58" height="36" rx="8" fill={color} stroke="#EFAAB6" strokeWidth="2" />
          <path d="M26 58 Q55 68 84 58" fill="none" stroke="#EFAAB6" strokeWidth="4" />
          <rect x="52" y="22" width="6" height="20" rx="3" fill="#162A4C" />
          <ellipse cx="55" cy="17" rx="5" ry="7" fill="#FFD166" />
        </svg>
      )

    case 'floral-bouquet':
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm">
          <path d="M40 76 L60 112 L80 76 Z" fill="#FFFDFC" stroke="#DFBE8A" strokeWidth="2.5" />
          <ellipse cx="38" cy="54" rx="14" ry="8" fill="#A9C9B3" transform="rotate(-35 38 54)" />
          <ellipse cx="82" cy="54" rx="14" ry="8" fill="#A9C9B3" transform="rotate(35 82 54)" />
          <circle cx="46" cy="58" r="15" fill={color} />
          <circle cx="74" cy="58" r="15" fill="#FDEBED" stroke={color} strokeWidth="2" />
          <circle cx="60" cy="42" r="17" fill={color} />
          <circle cx="60" cy="42" r="7" fill="#FFFDFC" opacity="0.6" />
        </svg>
      )
  }
}

/**
 * Compact 2D Studio Preview Renderer — supports both built-in presets
 * AND custom user-created Studio 2D packages!
 */
export function StudioPresetPreview({
  presetId,
  customElements,
  customBgId,
  className = '',
}: {
  presetId: string
  customElements?: CanvasElement[]
  customBgId?: string
  className?: string
}) {
  const preset = STUDIO_PRESETS.find((p) => p.id === presetId) ?? STUDIO_PRESETS[0]
  const activeElements = customElements && customElements.length > 0 ? customElements : preset.elements
  const bg =
    ROOM_BACKGROUNDS.find((b) => b.id === (customBgId || preset.backgroundId)) ??
    ROOM_BACKGROUNDS[0]

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{
        background: `linear-gradient(180deg, ${bg.wallTop} 0%, ${bg.wallBottom} 78%, ${bg.floor} 78%, ${bg.floor} 100%)`,
      }}
    >
      <RoomBackgroundOverlay bg={bg} />
      {activeElements.map((el) => (
        <div
          key={el.id}
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: `${el.width}%`,
            transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scaleX(${el.flipX ? -1 : 1})`,
          }}
          className="absolute pointer-events-none"
        >
          <StickerSVG element={el} />
        </div>
      ))}
    </div>
  )
}
