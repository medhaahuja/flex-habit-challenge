// Pure-CSS confetti burst, mounts for ~1.6s. No dependencies.
const COLORS = ['#28c76f', '#ff9f1c', '#2f8fdd', '#8b5cf6', '#ff5a5a', '#ffcf5a']

export default function Confetti({ count = 44 }) {
  const bits = Array.from({ length: count }, (_, i) => {
    const left = (i * 97) % 100
    const delay = ((i * 53) % 60) / 100
    const dur = 1 + ((i * 29) % 90) / 100
    const color = COLORS[i % COLORS.length]
    const rot = (i * 47) % 360
    return (
      <i
        key={i}
        style={{
          left: `${left}%`,
          background: color,
          animationDelay: `${delay}s`,
          animationDuration: `${dur}s`,
          transform: `rotate(${rot}deg)`,
        }}
      />
    )
  })
  return <div className="confetti">{bits}</div>
}
