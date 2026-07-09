import { useEffect, useRef, useState } from 'react'
import Flex from '../components/Flex.jsx'
import Leaves from '../components/Leaves.jsx'
import Confetti from '../components/Confetti.jsx'
import { Steps, Sunrise, Dumbbell, Drop, Flame, Check, Bottle } from '../components/Icons.jsx'
import { playCelebration } from '../sound.js'
import { useStore, actions, getCheckin, todayKey, todayLabel, streak } from '../data/store.js'
import { batteryFraction, flexState, isFullyCharged, WATER_TARGET_HALVES } from '../data/habits.js'
import { formatLiters } from '../data/format.js'

export default function Home({ onOpenTrack }) {
  const state = useStore()
  const c = getCheckin(todayKey())
  const profile = state.profile || {}
  const fs = flexState(c)
  const frac = batteryFraction(c)
  const charged = isFullyCharged(c)
  const st = streak()
  const submitted = !!c.submitted

  // Once today is submitted we show a read-only "logged" summary instead of the
  // editable list — until the user taps Edit, or the day rolls over (a new
  // date key = a fresh, unsubmitted check-in, so the list returns automatically).
  const [editing, setEditing] = useState(false)
  const showLogged = submitted && !editing

  const [celebrate, setCelebrate] = useState(false)
  const prevCharged = useRef(charged)

  // Fire confetti + jump + sound the moment the last habit is completed.
  useEffect(() => {
    if (charged && !prevCharged.current) {
      setCelebrate(true)
      playCelebration()
      const t = setTimeout(() => setCelebrate(false), 1700)
      return () => clearTimeout(t)
    }
    prevCharged.current = charged
  }, [charged])

  // Read the freshest check-in at click time (not the render closure) so rapid
  // taps can't clobber each other before a re-render lands.
  function toggle(key) {
    const cur = getCheckin(todayKey())
    actions.updateToday({ [key]: !cur[key] })
  }

  function tapBottle(i) {
    const cur = getCheckin(todayKey())
    const level = Math.max(0, Math.min(2, (cur.waterHalves || 0) - 2 * i))
    const next = level === 2 ? 2 * i : 2 * i + level + 1
    actions.updateToday({ waterHalves: Math.max(0, Math.min(WATER_TARGET_HALVES, next)) })
  }

  return (
    <div className="screen with-nav">
      {celebrate && <Confetti />}

      {/* top bar */}
      <div className="row between" style={{ alignItems: 'center' }}>
        <div>
          <h2>Hi, {profile.flexName || 'Flex'}</h2>
          <div className="sub" style={{ margin: 0 }}>{todayLabel()}</div>
        </div>
        <div className={`streak ${st === 0 ? 'dead' : ''}`}>
          <Flame c={st === 0 ? '#c9bda3' : '#ff9f1c'} /> {st}
        </div>
      </div>

      {/* Flex on the race scene — advances toward the finish as habits are ticked */}
      <div className="hero mt12">
        <TrackScene profile={profile} frac={frac} mood={fs.mood} battery={fs.color} celebrate={celebrate} />
      </div>

      {showLogged ? (
        <LoggedToday c={c} charged={charged} onEdit={() => setEditing(true)} onOpenTrack={onOpenTrack} />
      ) : (
        <>
          <div className="stack gap8 mt16">
            <HabitRow done={c.steps} accent="var(--steps)" tint="#eafaf0" Icon={Steps} title="10,000 steps" desc={c.steps ? 'Nailed it' : 'Tap when you hit 10k'} onClick={() => toggle('steps')} />
            <HabitRow done={c.wake} accent="var(--wake)" tint="#fff2d6" Icon={Sunrise} title="Wake up early" desc={`Your goal: up by ${profile.wakeupTime || '06:30'}`} onClick={() => toggle('wake')} />
            <HabitRow done={c.workout} accent="var(--workout)" tint="#f0e8ff" Icon={Dumbbell} title="Workout / Yoga" desc="Gym, run, badminton, yoga…" onClick={() => toggle('workout')} />

            {/* water — the one place decimals are kept (litres) */}
            <div className="habit" style={{ flexDirection: 'column', alignItems: 'stretch', '--accent': 'var(--water)', '--accent-tint': '#eef7fe' }}>
              <div className="row gap10" style={{ alignItems: 'center' }}>
                <div className="ico"><Drop c="var(--water)" /></div>
                <div className="txt">
                  <div className="title">Drink 3 bottles</div>
                  <div className="desc">Tap once for half, twice for full</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--water)', fontSize: 13 }}>{formatLiters(c.waterHalves)}/3 L</div>
              </div>
              <div className="bottles">
                {[0, 1, 2].map((i) => {
                  const level = Math.max(0, Math.min(2, (c.waterHalves || 0) - 2 * i))
                  return <span key={i} onClick={() => tapBottle(i)}><Bottle level={level} s={30} /></span>
                })}
              </div>
            </div>
          </div>

          <button className="btn green mt16" onClick={() => { actions.submitToday(); setEditing(false) }}>
            {editing ? 'Save today' : "I'm done for today"}
          </button>
        </>
      )}
    </div>
  )
}

// Read-only summary shown when today is already logged. Lets the user edit or
// jump to their race standing — the daily task itself isn't re-shown.
function LoggedToday({ c, charged, onEdit, onOpenTrack }) {
  const items = [
    { Icon: Steps, accent: 'var(--steps)', tint: '#eafaf0', title: '10,000 steps', done: c.steps },
    { Icon: Sunrise, accent: 'var(--wake)', tint: '#fff2d6', title: 'Wake up early', done: c.wake },
    { Icon: Dumbbell, accent: 'var(--workout)', tint: '#f0e8ff', title: 'Workout / Yoga', done: c.workout },
    { Icon: Drop, accent: 'var(--water)', tint: '#eef7fe', title: `Water · ${formatLiters(c.waterHalves)}/3 L`, done: (c.waterHalves || 0) >= WATER_TARGET_HALVES },
  ]
  return (
    <div className="mt16">
      <div className="card">
        <div style={{ fontSize: 16, fontWeight: 800 }}>{charged ? 'All done — fully charged today!' : "Today's logged"}</div>
        <div className="sub" style={{ margin: '2px 0 12px' }}>Come back tomorrow to charge up again. You can still tweak today below.</div>
        <div className="stack gap8">
          {items.map(({ Icon, accent, tint, title, done }) => (
            <div className="row gap10" key={title} style={{ alignItems: 'center' }}>
              <div className="ico" style={{ width: 34, height: 34, borderRadius: 10, background: tint, display: 'grid', placeItems: 'center' }}><Icon c={accent} s={18} /></div>
              <div className="grow" style={{ fontSize: 14, fontWeight: 700, color: done ? 'var(--ink)' : 'var(--muted-2)' }}>{title}</div>
              <div className={`check ${done ? 'on' : ''}`}>{done && <Check />}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="btn mt12" onClick={onOpenTrack}>View my progress →</button>
      <button className="btn light mt8" onClick={onEdit}>Edit today</button>
    </div>
  )
}

// Just me on the track. My horizontal position is driven directly by today's
// charge (0% = start line on the left, 100% = the finish flag on the right).
// Because it's tied to today's battery fraction, every habit I tick only ever
// pushes me further right — it can never move backward.
const START_PCT = 14, FINISH_PCT = 78

function TrackScene({ profile, frac, mood, battery, celebrate }) {
  const myLeft = START_PCT + Math.max(0, Math.min(1, frac)) * (FINISH_PCT - START_PCT)

  return (
    <div style={{ position: 'relative', height: 150, borderRadius: 22, overflow: 'hidden', background: 'linear-gradient(160deg,#f6efdd,#e2cfa4)' }}>
      {/* sun */}
      <div style={{ position: 'absolute', top: 12, right: 22, width: 20, height: 20, borderRadius: '50%', background: 'var(--amber)', opacity: 0.55 }} />
      {/* botanical leaves framing the scene, like the reference */}
      <Leaves corner="tl" size={78} style={{ top: -6, left: -8, opacity: 0.95, zIndex: 1 }} />
      <Leaves corner="tr" size={70} style={{ top: -6, right: -8, opacity: 0.95, zIndex: 1 }} />
      {/* rolling hills */}
      <div style={{ position: 'absolute', bottom: 40, left: -20, width: 160, height: 44, background: '#e6d4ac', borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
      <div style={{ position: 'absolute', bottom: 40, left: 170, width: 150, height: 44, background: '#e6d4ac', borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
      <div style={{ position: 'absolute', bottom: 40, left: 60, width: 140, height: 30, background: '#d9c088', borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
      {/* ground / turf — forest green from the reference */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: 'var(--forest)',
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.1) 0 3px, transparent 3px 22px)',
      }} />
      {/* start line */}
      <div style={{ position: 'absolute', left: `${START_PCT}%`, bottom: 0, height: 40, width: 3, background: 'rgba(255,255,255,.5)', transform: 'translateX(-50%)' }} />
      {/* finish flag */}
      <div style={{ position: 'absolute', right: '5%', bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
        <div style={{ width: 16, height: 11, background: 'var(--amber)', clipPath: 'polygon(0 0,100% 20%,0 40%)', marginLeft: 2 }} />
        <div style={{ width: 2, height: 32, background: '#2a2318', marginTop: -1 }} />
      </div>

      {/* me — advances rightward toward the finish with each habit */}
      <div
        className={celebrate ? 'jump' : ''}
        style={{ position: 'absolute', left: `${myLeft}%`, bottom: 34, transform: 'translateX(-50%)', zIndex: 3, transition: 'left .6s cubic-bezier(.3,.8,.3,1)' }}
      >
        <Flex color={profile.flexColor || '#ffcf5a'} mood={mood} fraction={frac} battery={battery} size={84} />
      </div>
    </div>
  )
}

function HabitRow({ done, accent, tint, Icon, title, desc, onClick }) {
  return (
    <button className={`habit ${done ? 'done' : ''}`} style={{ '--accent': accent, '--accent-tint': tint }} onClick={onClick}>
      <div className="ico"><Icon c={accent} /></div>
      <div className="txt" style={{ textAlign: 'left' }}>
        <div className="title">{title}</div>
        <div className="desc">{desc}</div>
      </div>
      <div className={`check ${done ? 'on' : ''}`}>{done && <Check />}</div>
    </button>
  )
}
