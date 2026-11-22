interface DesignIllustrationProps {
  variant: 'blush-ribbon-signature' | 'sweet-17-glow' | 'pastel-cloud-dream' | 'bridal-rose-intimate'
  className?: string
}

/**
 * Editorial 3D-shaded vector studio stage illustrations matching Bubu Balloon's aesthetic.
 * Renders glossy specular balloons, arched backdrops, satin bows, marquee lights & plinths.
 */
export function DesignIllustration({ variant, className = '' }: DesignIllustrationProps) {
  if (variant === 'sweet-17-glow') {
    return (
      <svg viewBox="0 0 480 340" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sw-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDF6EE" />
            <stop offset="72%" stopColor="#F8E9DB" />
            <stop offset="100%" stopColor="#EFE0D1" />
          </linearGradient>
          <radialGradient id="sw-halo" cx="50%" cy="46%" r="44%">
            <stop offset="0%" stopColor="#FFE8A3" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#F5CFA0" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#F5CFA0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="b-gold" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFF7DF" />
            <stop offset="45%" stopColor="#E5C691" />
            <stop offset="100%" stopColor="#B88E52" />
          </radialGradient>
          <radialGradient id="b-blush" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFF5F7" />
            <stop offset="45%" stopColor="#F2B3BD" />
            <stop offset="100%" stopColor="#C97B8C" />
          </radialGradient>
          <radialGradient id="b-pearl" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F7F1EB" />
            <stop offset="100%" stopColor="#DDD2C8" />
          </radialGradient>
          <radialGradient id="b-navy" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#4A6491" />
            <stop offset="48%" stopColor="#162A4C" />
            <stop offset="100%" stopColor="#0C182E" />
          </radialGradient>
        </defs>

        <rect width="480" height="340" fill="url(#sw-bg)" />
        {/* Floor */}
        <rect y="272" width="480" height="68" fill="#EFE2D5" />
        <ellipse cx="240" cy="288" rx="175" ry="18" fill="#162A4C" opacity="0.08" />

        {/* Warm LED Halo behind Arch */}
        <circle cx="240" cy="155" r="135" fill="url(#sw-halo)" />

        {/* Main Arch Backdrop */}
        <path d="M145 282 V145 A95 95 0 0 1 335 145 V282 Z" fill="#FFFDF9" stroke="#F0DFC8" strokeWidth="3" />
        {/* Inner Arch Accent */}
        <path d="M210 282 V168 A68 68 0 0 1 346 168 V282 Z" fill="#FDEBED" opacity="0.88" />

        {/* Custom Script Text */}
        <text x="235" y="130" textAnchor="middle" fill="#162A4C" fontSize="14" fontWeight="700" letterSpacing="2">
          SWEET SEVENTEEN
        </text>
        <text x="235" y="156" textAnchor="middle" fill="#D98395" fontSize="24" fontFamily="Georgia, serif" fontStyle="italic">
          Clarissa
        </text>

        {/* Organic Balloon Garland */}
        <g>
          <circle cx="132" cy="252" r="24" fill="url(#b-pearl)" />
          <circle cx="152" cy="232" r="19" fill="url(#b-gold)" />
          <circle cx="128" cy="212" r="22" fill="url(#b-blush)" />
          <circle cx="144" cy="182" r="25" fill="url(#b-pearl)" />
          <circle cx="122" cy="152" r="18" fill="url(#b-navy)" />
          <circle cx="148" cy="128" r="26" fill="url(#b-blush)" />
          <circle cx="172" cy="96" r="22" fill="url(#b-gold)" />
          <circle cx="204" cy="74" r="27" fill="url(#b-pearl)" />
          <circle cx="238" cy="64" r="20" fill="url(#b-blush)" />
          <circle cx="272" cy="68" r="25" fill="url(#b-gold)" />
          <circle cx="304" cy="84" r="21" fill="url(#b-navy)" />
          <circle cx="328" cy="108" r="24" fill="url(#b-pearl)" />
          <circle cx="348" cy="138" r="18" fill="url(#b-blush)" />
          <circle cx="342" cy="166" r="14" fill="url(#b-gold)" />
          {/* Glossy highlights */}
          <ellipse cx="140" cy="118" rx="6" ry="9" fill="#FFF" opacity="0.55" transform="rotate(-20 140 118)" />
          <ellipse cx="196" cy="64" rx="6" ry="9" fill="#FFF" opacity="0.6" transform="rotate(-18 196 64)" />
          <ellipse cx="265" cy="58" rx="5" ry="8" fill="#FFF" opacity="0.6" transform="rotate(-15 265 58)" />
        </g>

        {/* Glowing Marquee Number 17 */}
        <g transform="translate(178, 198)">
          <rect x="0" y="0" width="82" height="84" rx="14" fill="#FFFDF8" stroke="#E5C691" strokeWidth="2.5" />
          <text x="41" y="61" textAnchor="middle" fill="#162A4C" fontSize="52" fontWeight="800">17</text>
          {/* Warm marquee bulbs */}
          {[14, 30, 48, 66].map((x) => (
            <circle key={x} cx={x} cy={14} r="3.2" fill="#FFE28A" />
          ))}
          {[14, 30, 48, 66].map((x) => (
            <circle key={`b-${x}`} cx={x} cy={72} r="3.2" fill="#FFE28A" />
          ))}
        </g>

        {/* Cylinder Plinth */}
        <g transform="translate(284, 212)">
          <rect x="0" y="0" width="54" height="72" rx="6" fill="#FFFDFC" stroke="#EAE0D5" strokeWidth="1.5" />
          <ellipse cx="27" cy="2" rx="27" ry="6" fill="#F8EFE6" />
          {/* Mini Cake */}
          <rect x="11" y="-22" width="32" height="22" rx="4" fill="#FDEBED" stroke="#EFAAB6" strokeWidth="1" />
          <line x1="27" y1="-34" x2="27" y2="-22" stroke="#DFBE8A" strokeWidth="2" />
          <circle cx="27" cy="-36" r="3" fill="#FFD166" />
        </g>

        {/* Sparkles */}
        <path d="M92 86 L95 94 L103 97 L95 100 L92 108 L89 100 L81 97 L89 94 Z" fill="#DFBE8A" />
        <path d="M388 106 L390 112 L396 114 L390 116 L388 122 L386 116 L380 114 L386 112 Z" fill="#EFAAB6" />
      </svg>
    )
  }

  if (variant === 'pastel-cloud-dream') {
    return (
      <svg viewBox="0 0 480 340" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pc-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5FAFF" />
            <stop offset="72%" stopColor="#FFF9F2" />
            <stop offset="100%" stopColor="#F3E8DD" />
          </linearGradient>
          <radialGradient id="pc-blue" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#F2FAFF" />
            <stop offset="50%" stopColor="#BFDDF0" />
            <stop offset="100%" stopColor="#8DB8D6" />
          </radialGradient>
          <radialGradient id="pc-butter" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFFDF2" />
            <stop offset="50%" stopColor="#F7E6B5" />
            <stop offset="100%" stopColor="#DCC27D" />
          </radialGradient>
          <radialGradient id="pc-pink" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFF5F7" />
            <stop offset="50%" stopColor="#F4C6D0" />
            <stop offset="100%" stopColor="#D898A6" />
          </radialGradient>
          <radialGradient id="pc-cream" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#FFF9F0" />
            <stop offset="100%" stopColor="#E6DACB" />
          </radialGradient>
        </defs>

        <rect width="480" height="340" fill="url(#pc-bg)" />
        <rect y="272" width="480" height="68" fill="#F0E3D6" />
        <ellipse cx="240" cy="288" rx="170" ry="17" fill="#162A4C" opacity="0.07" />

        {/* Double Pastel Arch */}
        <path d="M125 282 V155 A78 78 0 0 1 281 155 V282 Z" fill="#FFFDF9" stroke="#EAE1D7" strokeWidth="2.5" />
        <path d="M210 282 V140 A75 75 0 0 1 360 140 V282 Z" fill="#EAF4FC" stroke="#D5E7F5" strokeWidth="2.5" />

        <text x="278" y="138" textAnchor="middle" fill="#162A4C" fontSize="12" fontWeight="700" letterSpacing="1.5">
          HAPPY 1ST BIRTHDAY
        </text>
        <text x="278" y="164" textAnchor="middle" fill="#5D8BB0" fontSize="24" fontFamily="Georgia, serif" fontStyle="italic">
          Baby Theo
        </text>

        {/* Cloud Pastel Balloon Arch */}
        <g>
          <circle cx="118" cy="248" r="24" fill="url(#pc-blue)" />
          <circle cx="136" cy="218" r="22" fill="url(#pc-cream)" />
          <circle cx="114" cy="186" r="20" fill="url(#pc-butter)" />
          <circle cx="136" cy="156" r="26" fill="url(#pc-pink)" />
          <circle cx="164" cy="118" r="24" fill="url(#pc-blue)" />
          <circle cx="198" cy="92" r="26" fill="url(#pc-cream)" />
          <circle cx="235" cy="76" r="22" fill="url(#pc-butter)" />
          <circle cx="274" cy="74" r="25" fill="url(#pc-pink)" />
          <circle cx="312" cy="86" r="23" fill="url(#pc-blue)" />
          <circle cx="346" cy="110" r="24" fill="url(#pc-cream)" />
          <circle cx="364" cy="144" r="20" fill="url(#pc-butter)" />
          <circle cx="358" cy="176" r="18" fill="url(#pc-pink)" />
        </g>

        {/* Cute Teddy Bear on Plinth */}
        <g transform="translate(178, 218)">
          <rect x="0" y="0" width="58" height="66" rx="8" fill="#FFFDFC" stroke="#E5DCD2" strokeWidth="1.5" />
          {/* Teddy ears */}
          <circle cx="17" cy="-35" r="8" fill="#C99B72" />
          <circle cx="41" cy="-35" r="8" fill="#C99B72" />
          {/* Teddy head */}
          <circle cx="29" cy="-26" r="15" fill="#D8AD86" />
          <ellipse cx="29" cy="-22" rx="7" ry="5" fill="#F2DEC9" />
          <circle cx="24" cy="-28" r="2" fill="#162A4C" />
          <circle cx="34" cy="-28" r="2" fill="#162A4C" />
          <circle cx="29" cy="-24" r="2.2" fill="#6E4930" />
          {/* Teddy body */}
          <ellipse cx="29" cy="-5" rx="16" ry="14" fill="#D8AD86" />
          {/* Cute pink bow tie */}
          <path d="M23 -12 L29 -9 L23 -6 Z M35 -12 L29 -9 L35 -6 Z" fill="#EFAAB6" />
        </g>

        {/* Cloud cutouts */}
        <g fill="#FFFFFF" opacity="0.92">
          <circle cx="322" cy="252" r="16" />
          <circle cx="340" cy="246" r="20" />
          <circle cx="358" cy="254" r="15" />
          <rect x="316" y="254" width="48" height="15" rx="7" />
        </g>
      </svg>
    )
  }

  if (variant === 'bridal-rose-intimate') {
    return (
      <svg viewBox="0 0 480 340" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="br-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF7F8" />
            <stop offset="72%" stopColor="#FCEEEF" />
            <stop offset="100%" stopColor="#F2E1E4" />
          </linearGradient>
          <radialGradient id="br-rose" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFF2F4" />
            <stop offset="48%" stopColor="#EFAAB6" />
            <stop offset="100%" stopColor="#C47486" />
          </radialGradient>
          <radialGradient id="br-pearl" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#FAF5F2" />
            <stop offset="100%" stopColor="#E2D5CF" />
          </radialGradient>
          <radialGradient id="br-gold" cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFF8E3" />
            <stop offset="48%" stopColor="#DFBE8A" />
            <stop offset="100%" stopColor="#B68E55" />
          </radialGradient>
        </defs>

        <rect width="480" height="340" fill="url(#br-bg)" />
        <rect y="272" width="480" height="68" fill="#F0DFE2" />
        <ellipse cx="240" cy="288" rx="165" ry="16" fill="#162A4C" opacity="0.07" />

        {/* Minimalist Arch */}
        <path d="M152 282 V136 A88 88 0 0 1 328 136 V282 Z" fill="#FFFDFC" stroke="#EFAAB6" strokeWidth="2.5" />

        <text x="240" y="138" textAnchor="middle" fill="#D98395" fontSize="24" fontFamily="Georgia, serif" fontStyle="italic">
          Bride to Be
        </text>
        <text x="240" y="160" textAnchor="middle" fill="#162A4C" fontSize="11" fontWeight="700" letterSpacing="2.4">
          NADYA’S BRIDAL SHOWER
        </text>

        {/* Romantic Draped Garland */}
        <g>
          <circle cx="144" cy="140" r="22" fill="url(#br-pearl)" />
          <circle cx="164" cy="108" r="24" fill="url(#br-rose)" />
          <circle cx="195" cy="84" r="25" fill="url(#br-pearl)" />
          <circle cx="232" cy="72" r="20" fill="url(#br-gold)" />
          <circle cx="268" cy="76" r="26" fill="url(#br-rose)" />
          <circle cx="304" cy="96" r="23" fill="url(#br-pearl)" />
          <circle cx="328" cy="126" r="22" fill="url(#br-rose)" />
          <circle cx="342" cy="162" r="20" fill="url(#br-pearl)" />
          <circle cx="332" cy="196" r="18" fill="url(#br-gold)" />
          <circle cx="344" cy="228" r="22" fill="url(#br-rose)" />
          <circle cx="328" cy="258" r="24" fill="url(#br-pearl)" />
        </g>

        {/* Satin Ribbon Bows */}
        <g transform="translate(154, 150)" fill="#EFAAB6">
          <ellipse cx="-10" cy="0" rx="10" ry="5" transform="rotate(-20 -10 0)" />
          <ellipse cx="10" cy="0" rx="10" ry="5" transform="rotate(20 10 0)" />
          <circle cx="0" cy="0" r="3.5" fill="#D98395" />
          <path d="M-3 3 L-8 24 M3 3 L8 24" stroke="#EFAAB6" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Intimate Table Foreground */}
        <g transform="translate(168, 224)">
          <rect x="0" y="0" width="144" height="58" rx="8" fill="#FFFDFC" stroke="#EEDCE0" strokeWidth="1.5" />
          {/* Floral vase */}
          <rect x="64" y="-18" width="16" height="18" rx="4" fill="#FDEBED" stroke="#EFAAB6" />
          <circle cx="66" cy="-24" r="7" fill="#EFAAB6" />
          <circle cx="77" cy="-25" r="8" fill="#F7D3DA" />
          <circle cx="72" cy="-31" r="6" fill="#FFFDFC" />
          {/* Taper candles */}
          <rect x="34" y="-22" width="4" height="22" rx="2" fill="#DFBE8A" />
          <circle cx="36" cy="-26" r="3" fill="#FFD166" />
          <rect x="106" y="-22" width="4" height="22" rx="2" fill="#DFBE8A" />
          <circle cx="108" cy="-26" r="3" fill="#FFD166" />
        </g>
      </svg>
    )
  }

  // Default: blush-ribbon-signature (Bubu Balloon Signature!)
  return (
    <svg viewBox="0 0 480 340" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bs-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF5F7" />
          <stop offset="72%" stopColor="#FDEBED" />
          <stop offset="100%" stopColor="#F5DCE0" />
        </linearGradient>
        <radialGradient id="bs-pink" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#FFF5F7" />
          <stop offset="48%" stopColor="#F2B3BD" />
          <stop offset="100%" stopColor="#CC7E8F" />
        </radialGradient>
        <radialGradient id="bs-navy" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#466394" />
          <stop offset="48%" stopColor="#162A4C" />
          <stop offset="100%" stopColor="#0D192E" />
        </radialGradient>
        <radialGradient id="bs-cream" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#FFF8F9" />
          <stop offset="100%" stopColor="#E4D6D9" />
        </radialGradient>
      </defs>

      <rect width="480" height="340" fill="url(#bs-bg)" />
      <rect y="272" width="480" height="68" fill="#F2D9DE" />
      <ellipse cx="240" cy="288" rx="178" ry="18" fill="#162A4C" opacity="0.09" />

      {/* Double Arch Backdrop: Cream + Blush */}
      <path d="M130 282 V142 A85 85 0 0 1 300 142 V282 Z" fill="#FFFDFC" stroke="#F4D5DC" strokeWidth="2.5" />
      <path d="M225 282 V160 A68 68 0 0 1 361 160 V282 Z" fill="#FDEBED" stroke="#EFAAB6" strokeWidth="2.5" />

      {/* Typography on Backdrop */}
      <text x="215" y="138" textAnchor="middle" fill="#162A4C" fontSize="12" fontWeight="800" letterSpacing="2">
        HAPPY BIRTHDAY
      </text>
      <text x="215" y="166" textAnchor="middle" fill="#D98395" fontSize="27" fontFamily="Georgia, serif" fontStyle="italic">
        Nadia
      </text>

      {/* Signature Organic Balloon Garland (Blush, Navy, Pearl Cream) */}
      <g>
        <circle cx="122" cy="252" r="24" fill="url(#bs-pink)" />
        <circle cx="144" cy="230" r="20" fill="url(#bs-navy)" />
        <circle cx="118" cy="204" r="22" fill="url(#bs-cream)" />
        <circle cx="138" cy="176" r="25" fill="url(#bs-pink)" />
        <circle cx="122" cy="144" r="18" fill="url(#bs-navy)" />
        <circle cx="146" cy="116" r="26" fill="url(#bs-cream)" />
        <circle cx="176" cy="88" r="23" fill="url(#bs-pink)" />
        <circle cx="212" cy="70" r="26" fill="url(#bs-navy)" />
        <circle cx="250" cy="68" r="22" fill="url(#bs-cream)" />
        <circle cx="286" cy="80" r="25" fill="url(#bs-pink)" />
        <circle cx="320" cy="102" r="20" fill="url(#bs-navy)" />
        <circle cx="344" cy="130" r="23" fill="url(#bs-cream)" />
        <circle cx="358" cy="162" r="18" fill="url(#bs-pink)" />
        {/* Specular gloss highlights */}
        <ellipse cx="204" cy="60" rx="5" ry="9" fill="#FFF" opacity="0.45" transform="rotate(-18 204 60)" />
        <ellipse cx="132" cy="166" rx="5" ry="8" fill="#FFF" opacity="0.6" transform="rotate(-18 132 166)" />
        <ellipse cx="280" cy="70" rx="5" ry="8" fill="#FFF" opacity="0.6" transform="rotate(-18 280 70)" />
      </g>

      {/* Cute Satin Ribbon Bow (Bubu Signature!) */}
      <g transform="translate(342, 186)" fill="#EFAAB6">
        <ellipse cx="-14" cy="0" rx="13" ry="6.5" transform="rotate(-18 -14 0)" />
        <ellipse cx="14" cy="0" rx="13" ry="6.5" transform="rotate(18 14 0)" />
        <circle cx="0" cy="0" r="4.5" fill="#162A4C" />
        <path d="M-4 4 L-10 30 M4 4 L10 30" stroke="#EFAAB6" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Cream Cylinder Table + Ribbon Cake */}
      <g transform="translate(216, 212)">
        <rect x="0" y="0" width="58" height="72" rx="8" fill="#FFFDFC" stroke="#EED8DD" strokeWidth="1.5" />
        <ellipse cx="29" cy="2" rx="29" ry="6" fill="#FDEBED" />
        <rect x="12" y="-24" width="34" height="24" rx="5" fill="#FFFDFC" stroke="#EFAAB6" strokeWidth="1.5" />
        <path d="M12 -12 Q29 -6 46 -12" fill="none" stroke="#EFAAB6" strokeWidth="2.5" />
        <circle cx="29" cy="-12" r="3" fill="#162A4C" />
      </g>

      {/* Cute Sparkles */}
      <path d="M90 98 L93 106 L101 109 L93 112 L90 120 L87 112 L79 109 L87 106 Z" fill="#162A4C" opacity="0.65" />
      <path d="M390 112 L392 118 L398 120 L392 122 L390 128 L388 122 L382 120 L388 118 Z" fill="#D98395" />
    </svg>
  )
}
