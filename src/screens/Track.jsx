import MiniFlex from '../components/MiniFlex.jsx'
import { Bolt } from '../components/Icons.jsx'
import { useStore, leaderboard, myRank, challengeDayIndex, challengeDaysLeft } from '../data/store.js'
import { ordinal } from '../data/format.js'

const CHALLENGE_DAYS = 7
const POINTS_PER_DAY = 4
const TARGET = CHALLENGE_DAYS * POINTS_PER_DAY // 28 = a perfect 7-day run

export default function Track() {
  useStore()
  const board = leaderboard()
  const rank = myRank()
  const day = challengeDayIndex()
  const left = challengeDaysLeft()
  const n = board.length

  // vertical track geometry — a gentle S-curve. frac 0 = start line (bottom,
  // before day 1), frac 1 = finish (top, a perfect day 7).
  const H = 150 + n * 52
  const top = 44, bottom = H - 40
  const trackXY = (frac) => ({
    x: 150 + Math.sin(frac * Math.PI * 3) * 105,
    y: bottom - frac * (bottom - top),
  })
  // A racer's spot is their ACTUAL progress through the 7-day challenge, not
  // their rank: total points / 28. So finishing day 1 (=4 pts) puts you at the
  // Day 1 marker (1/7 of the way), regardless of whether you're 1st.
  const progressFrac = (total) => Math.max(0, Math.min(1, (total || 0) / TARGET))
  // Day marker d sits where you'd be after fully completing d days (d/7).
  const dayFrac = (d) => d / CHALLENGE_DAYS

  let pathD = ''
  for (let i = 0; i <= 40; i++) {
    const { x, y } = trackXY(i / 40)
    pathD += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : ` L${x.toFixed(1)} ${y.toFixed(1)}`
  }

  return (
    <div className="screen with-nav">
      <div className="row between" style={{ alignItems: 'center' }}>
        <div>
          <h2>Fitness Race</h2>
          <div className="sub" style={{ margin: 0 }}>Day {day} of {CHALLENGE_DAYS} · {left === 0 ? 'final day' : `${left} day${left > 1 ? 's' : ''} left`}</div>
        </div>
        <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: 14, padding: '6px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 700 }}>YOU'RE</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{ordinal(rank)}</div>
        </div>
      </div>

      {left === 0 && (
        <div className="card mt12" style={{ background: '#eafaf0', borderColor: 'var(--bat-green)' }}>
          <div style={{ fontWeight: 800 }}>Final day! You're {ordinal(rank)} of {board.length}.</div>
          <div className="sub" style={{ margin: 0 }}>Finish strong — a fresh Fitness Race opens tomorrow.</div>
        </div>
      )}

      <div className="card mt12" style={{ background: 'var(--cream-2)', borderColor: 'transparent', padding: 8 }}>
        <div style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 300 ${H}`} width="100%" height={H} style={{ display: 'block' }}>
            {/* winding trail */}
            <path d={pathD} fill="none" stroke="#ddd4c0" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathD} fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />
            <text x={trackXY(1).x} y={top - 22} fontSize="12" fontWeight="800" fill="#1ba85b" textAnchor="middle" fontFamily="var(--font)">FINISH</text>

            {/* day-by-day waypoints — Day 1 near the start, Day 7 at the finish */}
            {Array.from({ length: CHALLENGE_DAYS }, (_, i) => {
              const dayNum = i + 1
              const { x, y } = trackXY(dayFrac(dayNum))
              const status = dayNum < day ? 'done' : dayNum === day ? 'today' : 'future'
              const fill = status === 'done' ? 'var(--bat-green)' : '#fff'
              const stroke = status === 'future' ? '#cfc5b4' : status === 'today' ? 'var(--wake)' : 'var(--bat-green)'
              const textFill = status === 'done' ? '#fff' : status === 'today' ? 'var(--wake)' : '#a89f90'
              return (
                <g key={dayNum}>
                  <circle cx={x} cy={y} r="11" fill={fill} stroke={stroke} strokeWidth={status === 'today' ? 3 : 2} />
                  <text x={x} y={y + 3.5} fontSize="9.5" fontWeight="800" fill={textFill} textAnchor="middle" fontFamily="var(--font)">{dayNum}</text>
                </g>
              )
            })}
          </svg>

          {/* runners — placed by real challenge progress (points / 28) */}
          {board.map((p, i) => {
            const { x: px, y } = trackXY(progressFrac(p.total))
            const x = px + (i % 2 === 0 ? -58 : 58)
            return (
              <div key={p.id} className="pop" style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <MiniFlex color={p.color} mood={p.isMe ? 'beaming' : 'content'} s={p.isMe ? 46 : 38} ring={p.isMe} />
                <div style={{
                  fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap',
                  background: p.isMe ? 'var(--ink)' : '#fff', color: p.isMe ? '#fff' : 'var(--ink)',
                  border: p.isMe ? 'none' : '1px solid var(--line)', borderRadius: 8, padding: '2px 7px', marginTop: 2,
                }}>
                  {p.isMe ? 'You' : p.name} · {ordinal(p.rank)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ChaseLine board={board} rank={rank} />
    </div>
  )
}

function ChaseLine({ board, rank }) {
  const ahead = board.find((p) => p.rank === rank - 1)
  if (!ahead) {
    return <div className="card mt12 center" style={{ background: '#fff6df', borderColor: '#ffd98a', fontWeight: 800, fontSize: 13 }}>
      <Bolt c="var(--bat-orange)" /> You're leading the pack — don't let up!
    </div>
  }
  const me = board.find((p) => p.rank === rank)
  const gap = Math.max(1, Math.round(ahead.total - (me?.total ?? 0)))
  return (
    <div className="card mt12 center" style={{ background: '#fff6df', borderColor: '#ffd98a', fontWeight: 700, fontSize: 13, color: '#8a6a2a' }}>
      {ahead.name} is just {gap} pt{gap > 1 ? 's' : ''} ahead — charge up again tomorrow to pass them.
    </div>
  )
}
