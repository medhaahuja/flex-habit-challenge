// Decorative botanical leaves that peek in from a corner, matching the
// foliage framing in the wellness reference. Purely decorative — aria-hidden.
// `corner` places + mirrors the cluster; leaves are forest-toned so they read
// against the warm sand scene.
export default function Leaves({ corner = 'tl', size = 92, style }) {
  const flip = corner === 'tr' || corner === 'br'
  const vy = corner === 'bl' || corner === 'br'
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ position: 'absolute', pointerEvents: 'none', transform: `scale(${flip ? -1 : 1},${vy ? -1 : 1})`, ...style }}
    >
      <g fill="none" stroke="#2c5240" strokeWidth="1.6">
        <path d="M2 8 C24 10 40 24 46 46" />
        <path d="M2 30 C20 30 33 40 39 58" />
      </g>
      <Leaf x={12} y={2} r={-18} fill="#2f8f5b" />
      <Leaf x={30} y={14} r={12} fill="#1f3d2e" />
      <Leaf x={4} y={26} r={28} fill="#3ea06a" />
      <Leaf x={26} y={40} r={54} fill="#2c5240" />
      <Leaf x={2} y={52} r={72} fill="#7fb069" />
    </svg>
  )
}

function Leaf({ x, y, r, fill }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${r})`}>
      <path d="M0 0 C16 2 24 12 24 26 C10 24 2 14 0 0 Z" fill={fill} />
      <path d="M2 4 C10 10 16 16 21 23" stroke="rgba(255,255,255,.35)" strokeWidth="1.2" fill="none" />
    </g>
  )
}
