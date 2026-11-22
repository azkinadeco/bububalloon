import React from 'react'

export type StickerCategory = 'Backdrop' | 'Balon' | 'Properti'

export type StickerType =
  | 'arch-panel'
  | 'arch-panel-small'
  | 'double-arch'
  | 'scallop-arch'
  | 'circle-backdrop'
  | 'square-backdrop-2x2'
  | 'square-backdrop-2x3'
  | 'sequin-wall-2x2'
  | 'garland-arch'
  | 'balloon-cluster'
  | 'foil-heart'
  | 'foil-star'
  | 'ribbon-bow'
  | 'uplight-spot'
  | 'cylinder-fluted-60x25'
  | 'cylinder-fluted-80x40'
  | 'acrylic-cube-table'
  | 'gold-cross-table'
  | 'marquee-number'
  | 'custom-text'
  | 'neon-sign'
  | 'teddy-bear'
  | 'ribbon-cake'
  | 'floral-bouquet'
  | 'jumbo-balloon'
  | 'number-balloon'
  | 'custom-png'

export interface TextFontOption {
  id: string
  label: string
  family: string
  italic?: boolean
}

export const TEXT_FONTS: TextFontOption[] = [
  { id: 'cormorant', label: 'Elegan Serif', family: 'Cormorant Garamond, Georgia, serif', italic: true },
  { id: 'dancing', label: 'Script Manis', family: 'Dancing Script, cursive' },
  { id: 'pacifico', label: 'Brush Lucu', family: 'Pacifico, cursive' },
  { id: 'playfair', label: 'Classic Editorial', family: 'Playfair Display, Georgia, serif' },
  { id: 'caveat', label: 'Handwritten', family: 'Caveat, cursive' },
  { id: 'montserrat', label: 'Modern Bold', family: 'Montserrat, sans-serif' },
]

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
  fontFamily?: string
  customImageUrl?: string
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
  { id: 'blush', label: 'Studio Blush', wallTop: '#FFF7F9', wallBottom: '#FCE8EC', floor: '#F1D6DC', accent: '#EFAAB6', style: 'studio' },
  { id: 'living-room', label: 'Ruang Tamu', wallTop: '#FAF6F0', wallBottom: '#EDE3D7', floor: '#C9A785', accent: '#D8C7B4', style: 'living' },
  { id: 'hotel-lobby', label: 'Lobby Hotel', wallTop: '#F5F0E8', wallBottom: '#E6DCCE', floor: '#D5CBBF', accent: '#DFBE8A', style: 'hotel' },
  { id: 'resto', label: 'Resto', wallTop: '#2E2622', wallBottom: '#4A3B33', floor: '#241D19', accent: '#E5BE8A', style: 'resto' },
  { id: 'cafe', label: 'Cafe Estetik', wallTop: '#F7F1EB', wallBottom: '#E9DDD0', floor: '#B89577', accent: '#C9A98B', style: 'cafe' },
  { id: 'stage', label: 'Atas Panggung', wallTop: '#111829', wallBottom: '#1F2B47', floor: '#26201E', accent: '#FFE49E', style: 'stage' },
  { id: 'ballroom', label: 'Ballroom', wallTop: '#F8F2E9', wallBottom: '#E8DBC7', floor: '#C9B8A3', accent: '#DFBE8A', style: 'ballroom' },
  { id: 'outdoor', label: 'Outdoor Taman', wallTop: '#CBE8FF', wallBottom: '#F2F9FF', floor: '#8EB87F', accent: '#6B995E', style: 'outdoor' },
]

/**
 * Real-world proportional 2D decoration library:
 * Scale reference: 2m = ~32% canvas width, 1m = ~16% canvas width.
 */
export const STICKER_DEFINITIONS: StickerDefinition[] = [
  // Backdrop (exact real-world scale: 2.0m = 32% width, 1.0m = 16.8% width, 0.9m = 15% width)
  { type: 'arch-panel', label: 'Oval 2×1m', category: 'Backdrop', defaultColor: '#FFFDFC', defaultWidth: 16.8, supportsBanner: true },
  { type: 'arch-panel-small', label: 'Oval 1,5×0,9m', category: 'Backdrop', defaultColor: '#FDEBED', defaultWidth: 15, supportsBanner: true },
  { type: 'double-arch', label: 'Double Oval', category: 'Backdrop', defaultColor: '#FFFDFC', defaultSecondary: '#FDEBED', defaultWidth: 32, supportsBanner: true },
  { type: 'scallop-arch', label: 'Arch Gelombang', category: 'Backdrop', defaultColor: '#FDEBED', defaultWidth: 22, supportsBanner: true },
  { type: 'circle-backdrop', label: 'Bulat 2×2m', category: 'Backdrop', defaultColor: '#FFFDFC', defaultWidth: 32, supportsBanner: true },
  { type: 'square-backdrop-2x2', label: 'Kotak 2×2m', category: 'Backdrop', defaultColor: '#FFFDFC', defaultWidth: 32, supportsBanner: true },
  { type: 'square-backdrop-2x3', label: 'Kotak 2×3m', category: 'Backdrop', defaultColor: '#FFFDFC', defaultWidth: 46, supportsBanner: true },
  { type: 'sequin-wall-2x2', label: 'Shimmer 2×2m', category: 'Backdrop', defaultColor: '#DFBE8A', defaultWidth: 32 },

  // Balon (default 1 warna seragam, bebas diubah warna)
  { type: 'garland-arch', label: 'Garland Lengkung', category: 'Balon', defaultColor: '#F2B3BD', defaultSecondary: '#F2B3BD', defaultWidth: 42 },
  { type: 'balloon-cluster', label: 'Balon Cluster', category: 'Balon', defaultColor: '#F2B3BD', defaultSecondary: '#F2B3BD', defaultWidth: 18 },
  { type: 'jumbo-balloon', label: 'Balon Jumbo', category: 'Balon', defaultColor: '#F2B3BD', defaultWidth: 13 },
  { type: 'foil-heart', label: 'Foil Love', category: 'Balon', defaultColor: '#D98395', defaultWidth: 10 },
  { type: 'foil-star', label: 'Foil Bintang', category: 'Balon', defaultColor: '#DFBE8A', defaultWidth: 10 },
  { type: 'ribbon-bow', label: 'Pita Satin', category: 'Balon', defaultColor: '#EFAAB6', defaultWidth: 10 },

  // Properti Dekor Sesungguhnya (Proporsi Realistis)
  { type: 'uplight-spot', label: 'Lampu Sorot Bawah', category: 'Properti', defaultColor: '#FFE599', defaultWidth: 16 },
  { type: 'cylinder-fluted-60x25', label: 'Silinder Garis 60×25', category: 'Properti', defaultColor: '#FFFDFC', defaultWidth: 7.2 },
  { type: 'cylinder-fluted-80x40', label: 'Silinder Garis 80×40', category: 'Properti', defaultColor: '#FFFDFC', defaultWidth: 12 },
  { type: 'acrylic-cube-table', label: 'Meja Acrylic Kotak', category: 'Properti', defaultColor: '#E8F4FA', defaultWidth: 12.5 },
  { type: 'gold-cross-table', label: 'Meja Emas Silang', category: 'Properti', defaultColor: '#FFFDFC', defaultSecondary: '#D4AF37', defaultWidth: 15.5 },
  { type: 'number-balloon', label: 'Balon Angka 0-9', category: 'Properti', defaultColor: '#DFBE8A', defaultWidth: 10.5, defaultText: '1' },
  { type: 'marquee-number', label: 'Angka Lampu', category: 'Properti', defaultColor: '#FFFDF8', defaultWidth: 15, defaultText: '17' },
  { type: 'custom-text', label: 'Tulisan Backdrop', category: 'Properti', defaultColor: '#162A4C', defaultWidth: 24, defaultText: 'Happy Birthday' },
  { type: 'neon-sign', label: 'Tulisan LED', category: 'Properti', defaultColor: '#FFD95A', defaultWidth: 22, defaultText: 'Happy Birthday' },
  { type: 'teddy-bear', label: 'Boneka Teddy', category: 'Properti', defaultColor: '#D8AD86', defaultWidth: 10.5 },
  { type: 'ribbon-cake', label: 'Kue Pita', category: 'Properti', defaultColor: '#FDEBED', defaultWidth: 8.5 },
  { type: 'floral-bouquet', label: 'Buket Bunga', category: 'Properti', defaultColor: '#EFAAB6', defaultWidth: 10.5 },
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
      { id: 's1', type: 'arch-panel', x: 46, y: 53, width: 16.8, rotation: 0, color: '#FFFDFC' },
      { id: 's2', type: 'arch-panel-small', x: 58, y: 59, width: 15, rotation: 0, color: '#FDEBED' },
      { id: 's3', type: 'garland-arch', x: 49, y: 39, width: 42, rotation: 0, color: '#F2B3BD', secondaryColor: '#162A4C' },
      { id: 's4', type: 'custom-text', x: 46, y: 47, width: 20, rotation: 0, color: '#162A4C', text: 'Happy Birthday' },
      { id: 's5', type: 'ribbon-bow', x: 66, y: 54, width: 9.5, rotation: 8, color: '#EFAAB6' },
      { id: 's6', type: 'cylinder-fluted-80x40', x: 50, y: 71, width: 11.5, rotation: 0, color: '#FFFDFC' },
      { id: 's7', type: 'ribbon-cake', x: 50, y: 55, width: 8, rotation: 0, color: '#FDEBED' },
      { id: 's8', type: 'balloon-cluster', x: 31, y: 72, width: 15.5, rotation: -4, color: '#F2B3BD', secondaryColor: '#162A4C' },
    ],
  },
  {
    id: 'sweet-17-glow',
    name: 'Champagne 17 Shimmer',
    backgroundId: 'ballroom',
    elements: [
      { id: 'g0', type: 'uplight-spot', x: 50, y: 70, width: 24, rotation: 0, color: '#FFE49E' },
      { id: 'g1', type: 'sequin-wall-2x2', x: 50, y: 50, width: 34, rotation: 0, color: '#DFBE8A' },
      { id: 'g2', type: 'garland-arch', x: 50, y: 34, width: 46, rotation: 0, color: '#F2B3BD', secondaryColor: '#DFBE8A' },
      { id: 'g3', type: 'neon-sign', x: 50, y: 43, width: 22, rotation: 0, color: '#FFF5C2', text: 'Sweet 17' },
      { id: 'g4', type: 'marquee-number', x: 38, y: 71, width: 15, rotation: 0, color: '#FFFDF8', text: '17' },
      { id: 'g5', type: 'gold-cross-table', x: 61, y: 71, width: 15, rotation: 0, color: '#FFFDFC', secondaryColor: '#D4AF37' },
      { id: 'g6', type: 'ribbon-cake', x: 61, y: 55, width: 8, rotation: 0, color: '#FFFDFC' },
    ],
  },
  {
    id: 'pastel-cloud',
    name: 'Teddy Pastel Cloud',
    backgroundId: 'living-room',
    elements: [
      { id: 'p1', type: 'arch-panel', x: 45, y: 53, width: 16.8, rotation: 0, color: '#FFFDFC' },
      { id: 'p2', type: 'arch-panel-small', x: 57, y: 59, width: 15, rotation: 0, color: '#BFDDF0' },
      { id: 'p3', type: 'garland-arch', x: 50, y: 38, width: 42, rotation: 0, color: '#BFDDF0', secondaryColor: '#F7E6B5' },
      { id: 'p4', type: 'custom-text', x: 56, y: 50, width: 19, rotation: 0, color: '#162A4C', text: 'Baby Theo 1st' },
      { id: 'p5', type: 'cylinder-fluted-80x40', x: 42, y: 71, width: 11, rotation: 0, color: '#FFFDFC' },
      { id: 'p6', type: 'teddy-bear', x: 42, y: 54, width: 9.5, rotation: 0, color: '#D8AD86' },
      { id: 'p7', type: 'cylinder-fluted-60x25', x: 63, y: 74, width: 7.2, rotation: 0, color: '#F7E6B5' },
      { id: 'p8', type: 'balloon-cluster', x: 71, y: 72, width: 15, rotation: 6, color: '#F2B3BD', secondaryColor: '#F7E6B5' },
    ],
  },
  {
    id: 'bridal-intimate',
    name: 'Rose Satin Intimate',
    backgroundId: 'hotel-lobby',
    elements: [
      { id: 'b0', type: 'uplight-spot', x: 50, y: 70, width: 22, rotation: 0, color: '#FFD8E0' },
      { id: 'b1', type: 'circle-backdrop', x: 50, y: 50, width: 32, rotation: 0, color: '#FFFDFC' },
      { id: 'b2', type: 'garland-arch', x: 50, y: 34, width: 44, rotation: 0, color: '#EFAAB6', secondaryColor: '#DFBE8A' },
      { id: 'b3', type: 'custom-text', x: 50, y: 47, width: 23, rotation: 0, color: '#D98395', text: 'Bride to Be' },
      { id: 'b4', type: 'acrylic-cube-table', x: 50, y: 72, width: 12.5, rotation: 0, color: '#E8F4FA' },
      { id: 'b5', type: 'floral-bouquet', x: 50, y: 56, width: 10.5, rotation: 0, color: '#EFAAB6' },
      { id: 'b6', type: 'ribbon-bow', x: 67, y: 52, width: 10, rotation: 8, color: '#D98395' },
    ],
  },
]

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
 * High-craft editorial architectural Room Background SVG overlays!
 */
export function RoomBackgroundOverlay({ bg }: { bg: RoomBackground }) {
  if (bg.style === 'studio') {
    return (
      <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="studio-soft-glow" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="390" fill="url(#studio-soft-glow)" />
        {/* Clean baseboard molding */}
        <rect x="0" y="378" width="800" height="12" fill="#FFFFFF" opacity="0.7" />
        <line x1="0" y1="390" x2="800" y2="390" stroke="#D9B7BE" strokeWidth="1.5" opacity="0.6" />
        {/* Soft floor bounce shadow */}
        <ellipse cx="400" cy="412" rx="260" ry="20" fill="#162A4C" opacity="0.06" />
      </svg>
    )
  }

  if (bg.style === 'living') {
    return (
      <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
        {/* Classic wainscoting panels */}
        <rect x="0" y="285" width="800" height="105" fill="#E9DFD3" opacity="0.6" />
        <line x1="0" y1="285" x2="800" y2="285" stroke="#D4C4B0" strokeWidth="4" />
        {[40, 210, 440, 610].map((x) => (
          <rect key={x} x={x} y="302" width="145" height="68" rx="3" fill="none" stroke="#D4C4B0" strokeWidth="2" opacity="0.7" />
        ))}
        {/* Sunlit tall window + sheer curtain on left */}
        <rect x="28" y="34" width="118" height="225" rx="6" fill="#FFFDF8" stroke="#D8C9B8" strokeWidth="7" />
        <line x1="87" y1="34" x2="87" y2="259" stroke="#D8C9B8" strokeWidth="4" />
        <line x1="28" y1="145" x2="146" y2="145" stroke="#D8C9B8" strokeWidth="4" />
        <path d="M18 28 H62 Q48 160 54 388 H18 Z" fill="#FFFDFB" opacity="0.72" />
        {/* Warm potted indoor plant on far right */}
        <ellipse cx="732" cy="340" rx="22" ry="38" fill="#89A882" opacity="0.75" />
        <ellipse cx="712" cy="352" rx="18" ry="28" fill="#76966F" opacity="0.75" transform="rotate(-18 712 352)" />
        <ellipse cx="752" cy="352" rx="18" ry="28" fill="#9BB894" opacity="0.75" transform="rotate(18 752 352)" />
        <rect x="714" y="366" width="36" height="36" rx="6" fill="#D9C3AE" />
        {/* Warm wood floor planks */}
        <rect x="0" y="388" width="800" height="112" fill="#C9A785" opacity="0.35" />
        {[410, 434, 462, 488].map((y) => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#9E7C5C" strokeWidth="1.2" opacity="0.32" />
        ))}
        <ellipse cx="400" cy="415" rx="250" ry="18" fill="#4A3520" opacity="0.08" />
      </svg>
    )
  }

  if (bg.style === 'hotel' || bg.style === 'ballroom') {
    return (
      <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="chandelier-glow" cx="50%" cy="10%" r="55%">
            <stop offset="0%" stopColor="#FFF4D0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFF4D0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="390" fill="url(#chandelier-glow)" />
        {/* Grand marble pillars */}
        <rect x="18" y="0" width="58" height="390" fill="#FFFDF8" opacity="0.55" />
        <rect x="724" y="0" width="58" height="390" fill="#FFFDF8" opacity="0.55" />
        <line x1="76" y1="0" x2="76" y2="390" stroke={bg.accent} strokeWidth="2.5" opacity="0.65" />
        <line x1="724" y1="0" x2="724" y2="390" stroke={bg.accent} strokeWidth="2.5" opacity="0.65" />
        {/* Gold architectural wall trim */}
        <rect x="108" y="42" width="584" height="316" fill="none" stroke={bg.accent} strokeWidth="2" opacity="0.55" />
        <rect x="118" y="52" width="564" height="296" fill="none" stroke={bg.accent} strokeWidth="1" opacity="0.35" />
        {/* Stylized Crystal Chandelier silhouette at top */}
        <g opacity="0.72">
          <line x1="400" y1="0" x2="400" y2="26" stroke="#DFBE8A" strokeWidth="3" />
          <ellipse cx="400" cy="30" rx="68" ry="10" fill="#FFF7DE" stroke="#DFBE8A" strokeWidth="2" />
          <ellipse cx="400" cy="42" rx="44" ry="8" fill="#FFF7DE" stroke="#DFBE8A" strokeWidth="1.5" />
        </g>
        {bg.style === 'ballroom' && (
          <>
            <ellipse cx="185" cy="24" rx="42" ry="7" fill="#FFF7DE" stroke="#DFBE8A" strokeWidth="1.5" opacity="0.6" />
            <ellipse cx="615" cy="24" rx="42" ry="7" fill="#FFF7DE" stroke="#DFBE8A" strokeWidth="1.5" opacity="0.6" />
          </>
        )}
        {/* Polished marble floor reflection */}
        <line x1="0" y1="390" x2="800" y2="390" stroke={bg.accent} strokeWidth="2" opacity="0.5" />
        <ellipse cx="400" cy="414" rx="270" ry="20" fill="#162A4C" opacity="0.08" />
      </svg>
    )
  }

  if (bg.style === 'resto' || bg.style === 'cafe') {
    const isDark = bg.style === 'resto'
    return (
      <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
        {/* Vertical wooden acoustic slats on sides */}
        {[18, 34, 50, 66, 734, 750, 766, 782].map((x) => (
          <rect key={x} x={x} y="0" width="8" height="390" fill={bg.accent} opacity={isDark ? 0.18 : 0.28} />
        ))}
        {/* Hanging warm Edison pendant lamps */}
        {[165, 400, 635].map((cx) => (
          <g key={cx}>
            <line x1={cx} y1="0" x2={cx} y2="54" stroke={bg.accent} strokeWidth="2.5" opacity="0.7" />
            <path d={`M${cx - 22} 72 Q${cx} 48 ${cx + 22} 72 Z`} fill={isDark ? '#D4A86A' : '#B89577'} />
            <circle cx={cx} cy="74" r="6" fill="#FFE8A3" />
            <ellipse cx={cx} cy="118" rx="95" ry="62" fill="#FFE6A8" opacity={isDark ? 0.14 : 0.22} />
          </g>
        ))}
        {/* Subtle cafe menu board / framed art */}
        <rect
          x="105"
          y="100"
          width="82"
          height="110"
          rx="4"
          fill={isDark ? '#1F1A17' : '#FFFDF9'}
          stroke={bg.accent}
          strokeWidth="3"
          opacity="0.55"
        />
        <line x1="0" y1="390" x2="800" y2="390" stroke={bg.accent} strokeWidth="2" opacity="0.35" />
      </svg>
    )
  }

  if (bg.style === 'stage') {
    return (
      <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
        {/* Velvet stage curtains */}
        <path d="M0 0 H125 Q95 190 112 390 H0 Z" fill="#0B101E" opacity="0.82" />
        <path d="M800 0 H675 Q705 190 688 390 H800 Z" fill="#0B101E" opacity="0.82" />
        {/* Dramatic crossed stage spotlights */}
        <polygon points="180,0 50,390 320,390" fill="#FFE8A8" opacity="0.11" />
        <polygon points="620,0 480,390 750,390" fill="#F2B3BD" opacity="0.11" />
        <polygon points="400,0 240,390 560,390" fill="#FFFFFF" opacity="0.06" />
        {/* Truss bar & stage lamps */}
        <rect x="0" y="0" width="800" height="12" fill="#0A0E1A" />
        {[180, 400, 620].map((cx) => (
          <circle key={cx} cx={cx} cy="14" r="7" fill="#FFE8A8" opacity="0.9" />
        ))}
        {/* Stage wooden lip */}
        <rect x="0" y="384" width="800" height="9" fill="#DFBE8A" opacity="0.65" />
      </svg>
    )
  }

  // Outdoor Garden — sunlit sky, soft clouds, lush layered garden hedge & grass
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 w-full h-full">
      {/* Soft sunlit clouds */}
      <g fill="#FFFFFF" opacity="0.88">
        <circle cx="120" cy="76" r="28" />
        <circle cx="154" cy="70" r="36" />
        <circle cx="192" cy="78" r="24" />
        <circle cx="610" cy="64" r="26" />
        <circle cx="646" cy="58" r="34" />
        <circle cx="680" cy="68" r="24" />
      </g>
      {/* Distant rolling garden hills */}
      <path d="M0 390 Q200 330 420 365 T800 350 V390 Z" fill="#A5C996" opacity="0.65" />
      {/* Lush side garden trees/bushes */}
      <g fill="#7EA872" opacity="0.72">
        <circle cx="48" cy="365" r="72" />
        <circle cx="128" cy="382" r="54" />
        <circle cx="682" cy="380" r="56" />
        <circle cx="755" cy="362" r="74" />
      </g>
      {/* Subtle garden string lights overhead */}
      <path d="M0 35 Q400 95 800 35" fill="none" stroke="#8C7B6B" strokeWidth="1.5" opacity="0.45" />
      {[120, 240, 360, 440, 560, 680].map((cx, i) => (
        <circle key={cx} cx={cx} cy={52 + (i === 2 || i === 3 ? 16 : i === 1 || i === 4 ? 10 : 0)} r="4" fill="#FFF3B0" />
      ))}
      <ellipse cx="400" cy="415" rx="250" ry="18" fill="#2D4A22" opacity="0.1" />
    </svg>
  )
}

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
      <rect x="4" y="4" width={viewW - 8} height={viewH - 8} rx="4" fill={dark} />
      {tiles}
      <polygon points={`10,10 ${viewW * 0.45},10 10,${viewH * 0.65}`} fill="#FFFFFF" opacity="0.14" />
    </svg>
  )
}

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
      // Exact 2.0m total height (INCLUDING top semicircle r=50) × 1.0m width (100×200 inner)
      return (
        <svg viewBox="0 0 116 216" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <path d="M8 208 V58 A50 50 0 0 1 108 58 V208 Z" />
            </clipPath>
          </defs>
          <path d="M8 208 V58 A50 50 0 0 1 108 58 V208 Z" fill={color} stroke="#162A4C" strokeOpacity="0.14" strokeWidth="2.5" />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="8"
              y="8"
              width="100"
              height="200"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
          <path d="M8 208 V58 A50 50 0 0 1 108 58 V208 Z" fill="none" stroke="#162A4C" strokeOpacity="0.14" strokeWidth="2.5" />
        </svg>
      )

    case 'arch-panel-small':
      // Exact 1.5m total height (INCLUDING top semicircle r=45) × 0.9m width (90×150 inner)
      return (
        <svg viewBox="0 0 106 166" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <path d="M8 158 V53 A45 45 0 0 1 98 53 V158 Z" />
            </clipPath>
          </defs>
          <path d="M8 158 V53 A45 45 0 0 1 98 53 V158 Z" fill={color} stroke="#162A4C" strokeOpacity="0.14" strokeWidth="2.5" />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="8"
              y="8"
              width="90"
              height="150"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
          <path d="M8 158 V53 A45 45 0 0 1 98 53 V158 Z" fill="none" stroke="#162A4C" strokeOpacity="0.14" strokeWidth="2.5" />
        </svg>
      )

    case 'double-arch':
      return (
        <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <path d="M12 214 V62 A50 50 0 0 1 112 62 V214 Z" />
            </clipPath>
          </defs>
          <path d="M12 214 V62 A50 50 0 0 1 112 62 V214 Z" fill={color} stroke="#162A4C" strokeOpacity="0.14" strokeWidth="2.5" />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="12"
              y="12"
              width="100"
              height="202"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
          <path d="M104 214 V94 A48 48 0 0 1 200 94 V214 Z" fill={sec} stroke="#162A4C" strokeOpacity="0.14" strokeWidth="2.5" />
        </svg>
      )

    case 'scallop-arch':
      return (
        <svg viewBox="0 0 150 220" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <path d="M14 214 V88 C14 72 24 64 31 52 C38 38 48 26 60 20 C70 15 80 15 90 20 C102 26 112 38 119 52 C126 64 136 72 136 88 V214 Z" />
            </clipPath>
          </defs>
          <path
            d="M14 214 V88 C14 72 24 64 31 52 C38 38 48 26 60 20 C70 15 80 15 90 20 C102 26 112 38 119 52 C126 64 136 72 136 88 V214 Z"
            fill={color}
            stroke="#162A4C"
            strokeOpacity="0.14"
            strokeWidth="2.5"
          />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="14"
              y="14"
              width="122"
              height="200"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
        </svg>
      )

    case 'circle-backdrop':
      // True 2m × 2m Circle Backdrop
      return (
        <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-sm">
          <defs>
            <clipPath id={clipId}>
              <circle cx="110" cy="110" r="100" />
            </clipPath>
          </defs>
          <circle cx="110" cy="110" r="102" fill={color} stroke="#DFBE8A" strokeWidth="4" />
          {customImageUrl && (
            <image
              href={customImageUrl}
              x="10"
              y="10"
              width="200"
              height="200"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          )}
          <circle cx="110" cy="110" r="102" fill="none" stroke="#DFBE8A" strokeWidth="4" />
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
          <polygon points="74,154 106,154 172,10 8,10" fill={`url(#beam-${clipId})`} />
          <rect x="66" y="150" width="48" height="18" rx="4" fill="#232936" />
          <ellipse cx="90" cy="151" rx="20" ry="4.5" fill={color} />
          <path d="M62 172 H118" stroke="#161B24" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )

    case 'cylinder-fluted-60x25': {
      // Exact 60cm tall × 25cm wide fluted cylinder plinth (aspect 2.4:1)
      const groove = shadeHex(color, -14)
      return (
        <svg viewBox="0 0 80 180" className="w-full h-full drop-shadow-sm">
          <rect x="8" y="12" width="64" height="160" rx="6" fill={color} stroke="#162A4C" strokeOpacity="0.15" strokeWidth="2" />
          {[18, 28, 38, 48, 58, 66].map((x) => (
            <line key={x} x1={x} y1="18" x2={x} y2="168" stroke={groove} strokeWidth="2.5" opacity="0.65" />
          ))}
          <ellipse cx="40" cy="14" rx="32" ry="6" fill={shadeHex(color, 8)} stroke="#162A4C" strokeOpacity="0.12" strokeWidth="1.5" />
          <rect x="6" y="166" width="68" height="6" rx="3" fill={groove} opacity="0.45" />
        </svg>
      )
    }

    case 'cylinder-fluted-80x40': {
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
      return (
        <svg viewBox="0 0 130 190" className="w-full h-full drop-shadow-sm">
          <rect x="12" y="14" width="106" height="166" rx="4" fill={color} fillOpacity="0.34" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="12" y="14" width="106" height="166" rx="4" fill="none" stroke="#9CB6C9" strokeOpacity="0.55" strokeWidth="1.5" />
          <line x1="24" y1="26" x2="106" y2="26" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.5" />
          <line x1="24" y1="26" x2="24" y2="168" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1="106" y1="26" x2="106" y2="168" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.5" />
          <polygon points="18,18 58,18 18,108" fill="#FFFFFF" opacity="0.45" />
          <polygon points="112,80 112,150 64,176" fill="#FFFFFF" opacity="0.22" />
        </svg>
      )

    case 'gold-cross-table': {
      const gold = secondaryColor || '#D4AF37'
      const goldDark = shadeHex(gold, -22)
      return (
        <svg viewBox="0 0 160 180" className="w-full h-full drop-shadow-sm">
          <rect x="10" y="12" width="140" height="16" rx="3" fill={color} stroke="#162A4C" strokeOpacity="0.16" strokeWidth="2" />
          <rect x="20" y="28" width="120" height="142" fill="none" stroke={gold} strokeWidth="5.5" />
          <line x1="22" y1="30" x2="138" y2="168" stroke={gold} strokeWidth="5" />
          <line x1="138" y1="30" x2="22" y2="168" stroke={goldDark} strokeWidth="5" />
          <line x1="22" y1="30" x2="138" y2="168" stroke="#FFF7D6" strokeWidth="1.4" opacity="0.65" />
          <line x1="16" y1="170" x2="144" y2="170" stroke={gold} strokeWidth="5" strokeLinecap="round" />
        </svg>
      )
    }

    case 'marquee-number': {
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

    case 'custom-text': {
      const fontMeta = TEXT_FONTS.find((f) => f.id === element.fontFamily) ?? TEXT_FONTS[0]
      return (
        <svg viewBox="0 0 280 82" className="w-full h-full">
          <text
            x="140"
            y="52"
            textAnchor="middle"
            fill={color}
            fontSize="31"
            fontFamily={fontMeta.family}
            fontStyle={fontMeta.italic ? 'italic' : 'normal'}
            fontWeight="700"
          >
            {text || 'Happy Birthday'}
          </text>
        </svg>
      )
    }

    case 'neon-sign': {
      // Genuine glowing Warm Yellow LED Neon Flex (1 fixed warm yellow color!)
      const ledText = text || 'Happy Birthday'
      return (
        <svg viewBox="0 0 280 96" className="w-full h-full overflow-visible">
          <defs>
            <filter id={`led-outer-${clipId}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="b1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b2" />
              <feMerge>
                <feMergeNode in="b1" />
                <feMergeNode in="b2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Wide warm yellow ambient LED halo */}
          <text
            x="140"
            y="60"
            textAnchor="middle"
            fill="#FFB703"
            fillOpacity="0.85"
            stroke="#FFB703"
            strokeWidth="8"
            strokeLinejoin="round"
            fontSize="38"
            fontFamily="Dancing Script, Caveat, cursive"
            fontWeight="700"
            filter={`url(#led-outer-${clipId})`}
          >
            {ledText}
          </text>
          {/* Mid golden LED neon tube */}
          <text
            x="140"
            y="60"
            textAnchor="middle"
            fill="#FFE066"
            stroke="#FFD43B"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fontSize="38"
            fontFamily="Dancing Script, Caveat, cursive"
            fontWeight="700"
          >
            {ledText}
          </text>
          {/* Bright incandescent warm-white core */}
          <text
            x="140"
            y="60"
            textAnchor="middle"
            fill="#FFFDF0"
            fontSize="38"
            fontFamily="Dancing Script, Caveat, cursive"
            fontWeight="700"
          >
            {ledText}
          </text>
        </svg>
      )
    }

    case 'jumbo-balloon': {
      // Pure round glossy jumbo latex balloon — NO string, NO tassel!
      const light = shadeHex(color, 26)
      const dark = shadeHex(color, -18)
      return (
        <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id={`jumbo-${clipId}`} cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor={light} />
              <stop offset="52%" stopColor={color} />
              <stop offset="100%" stopColor={dark} />
            </radialGradient>
          </defs>
          <circle cx="70" cy="70" r="60" fill={`url(#jumbo-${clipId})`} stroke="#162A4C" strokeOpacity="0.08" strokeWidth="1.5" />
          {/* Glossy studio specular shine */}
          <ellipse cx="47" cy="46" rx="13" ry="22" fill="#FFFFFF" opacity="0.54" transform="rotate(-24 47 46)" />
          <circle cx="37" cy="72" r="4.8" fill="#FFFFFF" opacity="0.4" />
        </svg>
      )
    }

    case 'number-balloon': {
      // Exact 40-inch (~100cm tall × 54cm wide) tall inflated glossy foil number balloon — NOT squat/cebol!
      const digit = (text || '1').slice(0, 1)
      const bright = shadeHex(color, 46)
      const light = shadeHex(color, 22)
      const dark = shadeHex(color, -26)
      return (
        <svg viewBox="0 0 100 185" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id={`foil-${clipId}`} cx="34%" cy="28%" r="72%">
              <stop offset="0%" stopColor={bright} />
              <stop offset="36%" stopColor={light} />
              <stop offset="72%" stopColor={color} />
              <stop offset="100%" stopColor={dark} />
            </radialGradient>
          </defs>
          {/* Authentic top & bottom foil inflation tabs (kuping balon foil) */}
          <rect x="44" y="4" width="12" height="9" rx="2.5" fill={dark} opacity="0.72" />
          <rect x="45.5" y="172" width="9" height="9" rx="2.5" fill={dark} opacity="0.72" />

          <g transform="translate(50 96) scale(0.84, 1.24) translate(-50 -96)">
            {/* Chubby outer foil seam edge */}
            <text
              x="50"
              y="136"
              textAnchor="middle"
              fill={dark}
              stroke={dark}
              strokeWidth="16"
              strokeLinejoin="round"
              strokeLinecap="round"
              fontSize="120"
              fontWeight="700"
              fontFamily="Fredoka, Plus Jakarta Sans, sans-serif"
            >
              {digit}
            </text>
            {/* Inflated 3D metallic foil cushion body */}
            <text
              x="50"
              y="136"
              textAnchor="middle"
              fill={`url(#foil-${clipId})`}
              stroke={`url(#foil-${clipId})`}
              strokeWidth="9"
              strokeLinejoin="round"
              strokeLinecap="round"
              fontSize="120"
              fontWeight="700"
              fontFamily="Fredoka, Plus Jakarta Sans, sans-serif"
            >
              {digit}
            </text>
            {/* Soft inner glossy specular air-cushion highlight */}
            <text
              x="47"
              y="132"
              textAnchor="middle"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.64"
              strokeWidth="4"
              strokeDasharray="16 24"
              strokeLinecap="round"
              fontSize="120"
              fontWeight="700"
              fontFamily="Fredoka, Plus Jakarta Sans, sans-serif"
            >
              {digit}
            </text>
          </g>
        </svg>
      )
    }

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
