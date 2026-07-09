import { useState } from 'react'
import MiniFlex from '../components/MiniFlex.jsx'
import { Bolt } from '../components/Icons.jsx'
import { useStore, leaderboard, myRank, challengeDayIndex, challengeDaysLeft } from '../data/store.js'
import { ordinal } from '../data/format.js'

const CHALLENGE_DAYS = 7

// One normalized coordinate system (fractions 0..1 of the track area) shared by
// the path, the day markers, and the racers — so a racer sits EXACTLY on its
// marker no matter how the container scales. t = 0 is the start line (bottom),
// t = 1 is the finish (top). Day marker d and "d days logged" both live at d/7.
const fx = (t) => 0.5 + 0.38 * Math.sin(t * Math.PI * 3)
const fy = (t) => 0.9 - t * 0.82
const clampDays = (d) => Math.max(0, Math.min(CHALLENGE_DAYS, d || 0))

export default function Track() {
  useStore()
  const board = leaderboard()
  const rank = myRank()
  const day = challengeDayIndex()
  const left = challengeDaysLeft()
  const [tappedId, setTappedId] = useState(null)

  // group racers by their day-marker — everyone in a group is tied, so they
  // must render at the exact same spot, not spread across different progress
  const groups = {}
  board.forEach((p) => { const d = clampDays(p.daysLogged); (groups[d] ||= []).push(p.id) })

  // winding path sampled across the whole track
  let pathD = ''
  for (let i = 0; i <= 60; i++) {
    const t = i / 60
    const x = (fx(t) * 100).toFixed(2)
    const y = (fy(t) * 100).toFixed(2)
    pathD += i === 0 ? `M${x} ${y}` : ` L${x} ${y}`
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
        <div className="card mt12" style={{ background: '#eafaf0' }}>
          <div style={{ fontWeight: 800 }}>Final day! You're {ordinal(rank)} of {board.length}.</div>
          <div className="sub" style={{ margin: 0 }}>Finish strong — a fresh Fitness Race opens tomorrow.</div>
        </div>
      )}

      {/* the track fills the rest of the screen */}
      <div className="card mt12" style={{ background: 'var(--cream-2)', flex: 1, position: 'relative', padding: 12, minHeight: 380 }}>
        {/* winding trail — non-scaling stroke keeps a constant width as it stretches */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" style={{ position: 'absolute', inset: 12, width: 'calc(100% - 24px)', height: 'calc(100% - 24px)' }}>
          <path d={pathD} fill="none" stroke="#ddd4c0" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d={pathD} fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="1 13" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.8" />
        </svg>

        {/* FINISH label above the day-7 marker */}
        <Positioned t={1} dy={-30}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#1ba85b', letterSpacing: 0.4 }}>FINISH</div>
        </Positioned>

        {/* day markers 1..7 */}
        {Array.from({ length: CHALLENGE_DAYS }, (_, i) => {
          const dayNum = i + 1
          const status = dayNum < day ? 'done' : dayNum === day ? 'today' : 'future'
          const bg = status === 'done' ? 'var(--forest)' : '#fff'
          const border = status === 'future' ? '#cfc5b4' : status === 'today' ? 'var(--amber)' : 'var(--forest)'
          const fg = status === 'done' ? '#fff' : status === 'today' ? 'var(--amber)' : '#a89f90'
          return (
            <Positioned key={dayNum} t={dayNum / CHALLENGE_DAYS} z={1}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', background: bg,
                border: `${status === 'today' ? 3 : 2}px solid ${border}`, color: fg,
                display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800,
              }}>{dayNum}</div>
            </Positioned>
          )
        })}

        {/* start line marker */}
        <Positioned t={0} z={1}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#fff', border: '2px solid #cfc5b4', color: '#a89f90', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 800 }}>GO</div>
        </Positioned>

        {/* Racers stand exactly ON the marker for how many days they've logged —
            same day = same spot, same height, never shifted ahead/behind. Tied
            racers spread ONLY sideways (never up/down, which would misread as
            more/less progress) in a tight huddle right on top of the marker.
            Only "You" keeps a name tag by default; tap anyone else to reveal
            theirs — avoids a wall of overlapping labels when several tie. */}
        {board.map((p) => {
          const d = clampDays(p.daysLogged)
          const grp = groups[d]
          const idx = grp.indexOf(p.id)
          const crowded = grp.length > 1
          const dx = crowded ? (idx - (grp.length - 1) / 2) * 6.5 : 0 // % sideways step only
          const showTag = p.isMe || !crowded || tappedId === p.id
          return (
            <Positioned key={p.id} t={d / CHALLENGE_DAYS} dx={dx} z={p.isMe ? 4 : 3} className="pop">
              <div
                style={{ textAlign: 'center', cursor: crowded && !p.isMe ? 'pointer' : 'default' }}
                onClick={() => crowded && !p.isMe && setTappedId((cur) => (cur === p.id ? null : p.id))}
              >
                <MiniFlex color={p.color} mood={p.isMe ? 'beaming' : 'content'} s={p.isMe ? 44 : crowded ? 30 : 38} ring={p.isMe} />
                {showTag && (
                  <div style={{
                    fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap',
                    background: p.isMe ? 'var(--ink)' : '#fff', color: p.isMe ? '#fff' : 'var(--ink)',
                    border: p.isMe ? 'none' : '1px solid var(--line)', borderRadius: 8, padding: '2px 7px', marginTop: 2,
                  }}>
                    {p.isMe ? 'You' : p.name} · {ordinal(p.rank)}
                  </div>
                )}
              </div>
            </Positioned>
          )
        })}
      </div>

      <ChaseLine board={board} rank={rank} />
    </div>
  )
}

// Places a child at fraction t along the track, offset by dx/dy (px for dy,
// % for dx), inside the padded track box.
function Positioned({ t, dx = 0, dy = 0, z, className, children }) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left: `calc(${(fx(t) * 100).toFixed(2)}% + ${dx}%)`,
        top: `calc(${(fy(t) * 100).toFixed(2)}% + ${dy}px)`,
        transform: 'translate(-50%,-50%)',
        zIndex: z,
      }}
    >
      {children}
    </div>
  )
}

function ChaseLine({ board, rank }) {
  const ahead = board.find((p) => p.rank === rank - 1)
  if (!ahead) {
    return <div className="card mt12 center" style={{ background: '#fff6df', fontWeight: 800, fontSize: 13 }}>
      <Bolt c="var(--amber)" /> You're leading the pack — don't let up!
    </div>
  }
  const me = board.find((p) => p.rank === rank)
  const dayGap = Math.max(1, (ahead.daysLogged || 0) - (me?.daysLogged || 0))
  return (
    <div className="card mt12 center" style={{ background: '#fff6df', fontWeight: 700, fontSize: 13, color: '#8a6a2a' }}>
      {ahead.name} is {dayGap} day{dayGap > 1 ? 's' : ''} ahead — log today to catch up.
    </div>
  )
}
