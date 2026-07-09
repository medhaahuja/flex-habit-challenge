// Habit definitions and all the maths that turns a day's check-in into
// Flex's battery %, mood, and race points. Kept pure so it's easy to test.

export const WATER_TARGET_HALVES = 6 // 3 bottles x 2 taps (0.5L each)

export const HABIT_KEYS = ['steps', 'wake', 'workout', 'water']

export const HABIT_META = {
  steps: { title: '10,000 steps', accent: 'var(--steps)', tint: '#eafaf0' },
  wake: { title: 'Wake up early', accent: 'var(--wake)', tint: '#fff2d6' },
  workout: { title: 'Workout / Yoga', accent: 'var(--workout)', tint: '#f0e8ff' },
  water: { title: 'Drink 3 bottles', accent: 'var(--water)', tint: '#eef7fe' },
}

export function emptyCheckin() {
  return { steps: false, wake: false, workout: false, waterHalves: 0 }
}

// Fraction (0..1) of each habit completed.
export function habitFraction(c, key) {
  if (key === 'water') return Math.min(1, (c.waterHalves || 0) / WATER_TARGET_HALVES)
  return c[key] ? 1 : 0
}

// Overall battery fill 0..1 — each of the 4 habits is worth 25%.
export function batteryFraction(c) {
  return (
    (habitFraction(c, 'steps') +
      habitFraction(c, 'wake') +
      habitFraction(c, 'workout') +
      habitFraction(c, 'water')) / 4
  )
}

// Race points for a day: 0..4 (a full charge = 4, the biggest daily jump).
export function dayPoints(c) {
  return Number((batteryFraction(c) * 4).toFixed(3))
}

// Did the user engage with at least one habit today? (keeps the streak alive)
export function didSomething(c) {
  return c.steps || c.wake || c.workout || (c.waterHalves || 0) > 0
}

// How many of the 4 habits are fully done.
export function fullyDoneCount(c) {
  return (
    (c.steps ? 1 : 0) +
    (c.wake ? 1 : 0) +
    (c.workout ? 1 : 0) +
    ((c.waterHalves || 0) >= WATER_TARGET_HALVES ? 1 : 0)
  )
}

export function isFullyCharged(c) {
  return batteryFraction(c) >= 1
}

// Battery colour + mood follow the thresholds in the plan:
//  <50% -> red / sad,  >=50% -> orange / content,  100% -> green / beaming.
// If nothing done at all, Flex is "sleepy" (still red, but a gentle low-battery look).
export function flexState(c) {
  const f = batteryFraction(c)
  if (f >= 1) return { color: 'var(--bat-green)', mood: 'beaming', fraction: f }
  if (f >= 0.5) return { color: 'var(--bat-orange)', mood: 'content', fraction: f }
  if (f > 0) return { color: 'var(--bat-red)', mood: 'sad', fraction: f }
  return { color: 'var(--bat-red)', mood: 'sleepy', fraction: 0 }
}

export function chargeLabel(c) {
  return Math.round(batteryFraction(c) * 100)
}
