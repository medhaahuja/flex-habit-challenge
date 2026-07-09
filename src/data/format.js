// Small shared display-formatting helpers (kept out of habits.js/store.js so
// both Home and Track can import without duplicating).
export function ordinal(n) {
  if (!n) return '—'
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

// Water is the one place decimals are allowed, but a whole number like 0 or 2
// shouldn't render as "0.0" / "2.0" — only show the decimal when it's a genuine half-litre.
export function formatLiters(halves) {
  const liters = (halves || 0) * 0.5
  return Number.isInteger(liters) ? String(liters) : liters.toFixed(1)
}
