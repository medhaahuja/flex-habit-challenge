// The Flex mascot: a spark-bean whose face + chest battery reflect the day's
// progress. Fully custom SVG (no emoji / no stock art). Driven by:
//   color   - body colour chosen at setup
//   mood    - 'sleepy' | 'sad' | 'content' | 'beaming'
//   fraction- battery fill 0..1
//   battery - battery colour (red/orange/green)
export default function Flex({ color = '#ffcf5a', mood = 'sleepy', fraction = 0, battery = '#ff5a5a', size = 150, jump = false }) {
  const dark = shade(color, -0.32)
  const cheek = mood === 'beaming' || mood === 'content'
  const fillW = Math.max(0, Math.min(1, fraction)) * 40 // battery inner max width 40

  return (
    <svg width={size} height={size * 1.02} viewBox="0 0 150 152" className={jump ? 'jump' : ''}>
      {/* shadow */}
      <ellipse cx="75" cy="145" rx="34" ry="6" fill="#000" opacity="0.06" />

      {/* sparkles when beaming */}
      {mood === 'beaming' && (
        <g stroke={dark} strokeWidth="3" strokeLinecap="round">
          <path d="M75 6 l0 8 M118 20 l-5 6 M32 20 l5 6" />
        </g>
      )}

      {/* body */}
      <path
        d="M75 16 C40 16 30 68 30 100 C30 130 50 144 75 144 C100 144 120 130 120 100 C120 68 110 16 75 16 Z"
        fill={color}
      />
      {/* soft inner shading */}
      <path
        d="M75 16 C40 16 30 68 30 100 C30 130 50 144 75 144 C100 144 120 130 120 100 C120 68 110 16 75 16 Z"
        fill={dark} opacity="0.12"
      />

      {/* arms — droopy when low, up when beaming */}
      {mood === 'beaming' ? (
        <>
          <path d="M31 92 Q16 84 18 70" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M119 92 Q134 84 132 70" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M31 98 Q17 108 19 122" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M119 98 Q133 108 131 122" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* cheeks */}
      {cheek && (
        <>
          <circle cx="49" cy="92" r="7" fill="#ff9d6b" opacity="0.45" />
          <circle cx="101" cy="92" r="7" fill="#ff9d6b" opacity="0.45" />
        </>
      )}

      {/* eyes + mouth by mood */}
      <Face mood={mood} />

      {/* battery on chest */}
      <rect x="53" y="112" width="44" height="22" rx="6" fill="#fff" stroke="#3a2f16" strokeWidth="2.6" />
      <rect x="97" y="119" width="4" height="8" rx="2" fill="#3a2f16" />
      {fillW > 0 && <rect x="56" y="115" width={fillW} height="16" rx="3" fill={battery} />}
      {/* little feet */}
      <ellipse cx="62" cy="146" rx="9" ry="5" fill={dark} />
      <ellipse cx="88" cy="146" rx="9" ry="5" fill={dark} />
    </svg>
  )
}

function Face({ mood }) {
  const ink = '#3a2f16'
  if (mood === 'sleepy') {
    return (
      <g stroke={ink} fill="none" strokeWidth="3" strokeLinecap="round">
        <path d="M52 78 Q60 84 68 78" />
        <path d="M82 78 Q90 84 98 78" />
        <path d="M64 100 Q75 96 86 100" />
        {/* zzz */}
        <path d="M104 60 h8 l-8 8 h8" strokeWidth="2" opacity="0.6" />
      </g>
    )
  }
  if (mood === 'sad') {
    return (
      <g>
        <path d="M50 68 L64 72 M100 68 L86 72" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
        <ellipse cx="60" cy="80" rx="7.5" ry="9" fill={ink} />
        <ellipse cx="90" cy="80" rx="7.5" ry="9" fill={ink} />
        <circle cx="63" cy="76" r="2.4" fill="#fff" />
        <circle cx="93" cy="76" r="2.4" fill="#fff" />
        <path d="M63 102 Q75 94 87 102" stroke={ink} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </g>
    )
  }
  if (mood === 'content') {
    return (
      <g>
        <ellipse cx="60" cy="78" rx="7.5" ry="9" fill={ink} />
        <ellipse cx="90" cy="78" rx="7.5" ry="9" fill={ink} />
        <circle cx="63" cy="74" r="2.6" fill="#fff" />
        <circle cx="93" cy="74" r="2.6" fill="#fff" />
        <path d="M64 98 Q75 105 86 98" stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </g>
    )
  }
  // beaming
  return (
    <g>
      <ellipse cx="60" cy="76" rx="8.5" ry="10" fill={ink} />
      <ellipse cx="90" cy="76" rx="8.5" ry="10" fill={ink} />
      <circle cx="64" cy="72" r="3" fill="#fff" />
      <circle cx="94" cy="72" r="3" fill="#fff" />
      <path d="M60 96 Q75 112 90 96 Q84 106 75 106 Q66 106 60 96 Z" fill={ink} />
    </g>
  )
}

// darken/lighten a hex colour
function shade(hex, amt) {
  const c = hex.replace('#', '')
  const n = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16)
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  r = Math.round(Math.min(255, Math.max(0, r + r * amt)))
  g = Math.round(Math.min(255, Math.max(0, g + g * amt)))
  b = Math.round(Math.min(255, Math.max(0, b + b * amt)))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
