import { useState } from 'react'
import { Steps, Sunrise, Dumbbell, Drop, Flag } from '../components/Icons.jsx'

const ITEMS = [
  { Icon: Steps, c: 'var(--steps)', tint: '#eafaf0', t: '10,000 steps', d: 'Get your walk in' },
  { Icon: Sunrise, c: 'var(--wake)', tint: '#fff2d6', t: 'Wake up early', d: 'Your own wakeup time' },
  { Icon: Dumbbell, c: 'var(--workout)', tint: '#f0e8ff', t: 'Workout / Yoga', d: 'Gym, run, badminton, yoga…' },
  { Icon: Drop, c: 'var(--water)', tint: '#eef7fe', t: 'Drink 3 bottles', d: '3 litres of water a day' },
]

export default function ChallengeIntro({ onJoin }) {
  const [busy, setBusy] = useState(false)
  function join() {
    setBusy(true)
    onJoin() // async — App swaps to Setup once store.joined flips true
  }
  return (
    <div className="screen" style={{ justifyContent: 'space-between' }}>
      <div>
        <span className="label">The challenge</span>
        <h2 className="mt8">Four things, every day</h2>
        <p className="sub">Tick these off daily to keep Flex charged.</p>
        <div className="stack gap10 mt16">
          {ITEMS.map(({ Icon, c, tint, t, d }) => (
            <div className="card row gap10" key={t} style={{ alignItems: 'center' }}>
              <div className="ico" style={{ width: 42, height: 42, borderRadius: 12, background: tint, display: 'grid', placeItems: 'center' }}>
                <Icon c={c} />
              </div>
              <div className="grow">
                <div style={{ fontWeight: 800, fontSize: 15 }}>{t}</div>
                <div className="sub" style={{ margin: 0, fontSize: 12 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card mt16" style={{ background: '#fff6df', borderColor: '#ffd98a' }}>
          <div className="row gap8" style={{ alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><Flag /></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>It's a 7-day race that repeats</div>
              <div className="sub" style={{ margin: 0, fontSize: 12.5 }}>
                Every completed habit moves your Flex forward on a shared track. After 7 days we crown the winners — then a fresh challenge begins.
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="btn green mt16" onClick={join} disabled={busy} style={{ opacity: busy ? 0.7 : 1 }}>
        {busy ? 'Joining…' : 'Join the challenge'}
      </button>
    </div>
  )
}
