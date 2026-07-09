// Celebration sound generated with the Web Audio API — no binary asset to bundle.
// Plays a short cheerful arpeggio. Called on a user tap (the completing tap),
// so it satisfies browser autoplay rules.
let ctx
export function playCelebration() {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const t = now + i * 0.1
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.3)
    })
  } catch (e) { /* audio not available — fail silently */ }
}
