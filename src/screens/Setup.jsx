import { useRef, useState } from 'react'
import Flex from '../components/Flex.jsx'
import { Pencil } from '../components/Icons.jsx'
import { actions } from '../data/store.js'

const COLORS = ['#ffcf5a', '#ff8f5e', '#5ec6ff', '#7ee081', '#c89bff', '#ff6b9d']

export default function Setup({ onDone }) {
  const [name, setName] = useState('Sunny')
  const [color, setColor] = useState(COLORS[0])
  const [wakeup, setWakeup] = useState('06:30')
  const colorInputRef = useRef(null)
  const isCustom = !COLORS.includes(color)

  function done() {
    actions.saveProfile({ flexName: name.trim() || 'Flex', flexColor: color, wakeupTime: wakeup })
    onDone()
  }

  return (
    <div className="screen" style={{ justifyContent: 'space-between' }}>
      <div>
        <h2>Make Flex yours</h2>
        <p className="sub">Everything else is preset: 10k steps, one workout, 3 bottles.</p>

        <div className="center mt16"><Flex color={color} mood="content" fraction={0.5} battery="var(--bat-orange)" size={120} /></div>

        <div className="mt16">
          <div className="label">Name your Flex</div>
          <input className="field mt8" value={name} onChange={(e) => setName(e.target.value)} maxLength={16} placeholder="e.g. Sunny" />
        </div>

        <div className="mt16">
          <div className="label">Pick a colour</div>
          <div className="swatches mt8">
            {COLORS.map((c) => (
              <button key={c} className={`swatch ${c === color ? 'sel' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={`colour ${c}`} />
            ))}
            {/* Circular trigger for a custom colour — shows a pencil by default,
                or the chosen custom colour once picked (still tappable to change it). */}
            <button
              className={`swatch ${isCustom ? 'sel' : ''}`}
              style={isCustom ? { background: color } : { background: '#fff', border: '2px dashed #cbbfa0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => colorInputRef.current?.click()}
              aria-label="custom colour"
            >
              {!isCustom && <Pencil c="#8a7658" s={16} />}
            </button>
            <input
              ref={colorInputRef}
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
              tabIndex={-1}
            />
          </div>
        </div>

        <div className="mt16">
          <div className="label">Set your wakeup time</div>
          <input type="time" className="field mt8" value={wakeup} onChange={(e) => setWakeup(e.target.value)} style={{ maxWidth: 160 }} />
        </div>
      </div>

      <button className="btn green mt20" onClick={done}>Enter the race →</button>
    </div>
  )
}
