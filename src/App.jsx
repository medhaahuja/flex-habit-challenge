import { useState } from 'react'
import { useStore, actions } from './data/store.js'
import { HomeIcon, TrackIcon } from './components/Icons.jsx'
import Flex from './components/Flex.jsx'
import Welcome from './screens/Welcome.jsx'
import ChallengeIntro from './screens/ChallengeIntro.jsx'
import Setup from './screens/Setup.jsx'
import Home from './screens/Home.jsx'
import Track from './screens/Track.jsx'

export default function App() {
  const state = useStore()
  const onboarded = state.auth.signedIn && state.joined && !!state.profile
  return (
    <div className="app">
      {!state.authChecked ? <Loading /> : onboarded ? <Main /> : <Onboarding />}
      {/* dev-only: the +1-day / reset toolbar must never reach the live build,
          or anyone can add ?dev to the URL and advance days to cheat the race */}
      {import.meta.env.DEV && new URLSearchParams(location.search).has('dev') && <DevBar />}
    </div>
  )
}

function Loading() {
  return (
    <div className="screen center" style={{ justifyContent: 'center' }}>
      <Flex color="#ffcf5a" mood="content" fraction={0.5} battery="var(--bat-orange)" size={90} />
    </div>
  )
}

// Post sign-in/join screens are derived straight from live store state (not
// a local step index) because Google OAuth does a full page redirect —
// there's no in-memory step to resume, only what's persisted/re-fetched.
function Onboarding() {
  const state = useStore()
  if (!state.auth.signedIn) return <Welcome />
  if (!state.joined) return <ChallengeIntro onJoin={() => actions.joinChallenge()} />
  return <Setup onDone={() => {}} />
}

function Main() {
  const [tab, setTab] = useState('home')
  return (
    <>
      {tab === 'home' ? <Home onOpenTrack={() => setTab('track')} /> : <Track />}
      <div className="nav">
        <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>
          <HomeIcon c={tab === 'home' ? '#fff' : 'rgba(255,255,255,.55)'} s={24} /> Home
        </button>
        <button className={tab === 'track' ? 'active' : ''} onClick={() => setTab('track')}>
          <TrackIcon c={tab === 'track' ? '#fff' : 'rgba(255,255,255,.55)'} s={24} /> Fitness Race
        </button>
      </div>
    </>
  )
}

// Only shown with ?dev in the URL — helps test streaks/rollover & reset.
function DevBar() {
  return (
    <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 6, zIndex: 100 }}>
      <button onClick={() => actions.advanceDay()} style={devBtn}>+1 day</button>
      <button onClick={() => actions.reset()} style={devBtn}>reset</button>
    </div>
  )
}
const devBtn = { fontSize: 10, fontWeight: 700, background: '#1f1a12', color: '#fff', borderRadius: 8, padding: '4px 7px' }
