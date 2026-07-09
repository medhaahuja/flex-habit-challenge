import { useState } from 'react'
import Flex from '../components/Flex.jsx'
import { Google } from '../components/Icons.jsx'
import { actions } from '../data/store.js'

// The one and only pre-auth screen — pitch + Google sign-in together, no
// separate "Get started" tap in between.
export default function Welcome() {
  const [busy, setBusy] = useState(false)
  function signIn() {
    setBusy(true)
    actions.signInWithGoogle()
  }
  return (
    <div className="screen center" style={{ justifyContent: 'space-between' }}>
      <div />
      <div>
        <div className="hero" style={{ padding: '26px 18px' }}>
          <Flex color="#ffcf5a" mood="beaming" fraction={1} battery="var(--bat-green)" size={168} />
        </div>
        <h1 className="mt24">Meet Flex.</h1>
        <p className="sub" style={{ fontSize: 15 }}>
          Your energy twin. Do your daily habits, keep Flex charged, and race everyone else to the finish.
        </p>
      </div>
      <div style={{ width: '100%' }}>
        <button className="btn light" onClick={signIn} disabled={busy} style={{ opacity: busy ? 0.6 : 1 }}>
          <Google /> {busy ? 'Redirecting to Google…' : 'Continue with Google'}
        </button>
        <p className="sub center" style={{ fontSize: 12 }}>Free · takes 3 seconds · no password</p>
      </div>
    </div>
  )
}
