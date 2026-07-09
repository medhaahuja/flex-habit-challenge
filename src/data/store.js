// Supabase-backed store, with a local-storage cache so the UI always reads
// synchronously (useSyncExternalStore) while writes go to Supabase in the
// background. If Supabase isn't configured (.env.local missing), everything
// falls back to a pure local-only demo mode — the app still fully works.
import { useSyncExternalStore } from 'react'
import { emptyCheckin, dayPoints, didSomething } from './habits.js'
import { supabase } from './supabaseClient.js'

const KEY = 'flex.v1'
const CHALLENGE_DAYS = 7

const DEFAULT = {
  authChecked: false,
  auth: { signedIn: false, email: null, name: null, id: null },
  profile: null, // { flexName, flexColor, wakeupTime }
  joined: false,
  challengeId: null,
  challengeStart: null, // 'YYYY-MM-DD'
  checkins: {}, // { 'YYYY-MM-DD': {steps,wake,workout,waterHalves} }
  remoteBoard: [], // [{id,name,color,total}] — other real participants
  offsetDays: 0, // dev-only: lets us simulate "tomorrow" for testing rollover
}

// ---- seeded competitors (make the race feel alive even with few real users) ----
export const COMPETITORS = [
  { id: 'c1', name: 'Aisha', color: '#28c76f', pace: 3.7, today: 1.0 },
  { id: 'c2', name: 'Neha', color: '#2f8fdd', pace: 3.2, today: 1.0 },
  { id: 'c3', name: 'Rahul', color: '#ff5a5a', pace: 2.6, today: 0.5 },
  { id: 'c4', name: 'Sam', color: '#f0a72c', pace: 1.8, today: 0.25 },
  { id: 'c5', name: 'Dev', color: '#8b5cf6', pace: 1.2, today: 0.0 },
  { id: 'c6', name: 'Priya', color: '#ff8f5e', pace: 2.1, today: 0.75 },
]

let state = load()
const listeners = new Set()

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) }
  } catch (e) { /* ignore */ }
  return { ...DEFAULT }
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) { /* ignore */ }
}
function set(patch) {
  state = { ...state, ...patch }
  persist()
  listeners.forEach((l) => l())
}

// ---- dates ----
function dateToKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
export function todayKey() {
  const d = new Date()
  d.setDate(d.getDate() + (state.offsetDays || 0))
  return dateToKey(d)
}
function daysBetween(aKey, bKey) {
  const a = new Date(aKey + 'T00:00:00')
  const b = new Date(bKey + 'T00:00:00')
  return Math.round((b - a) / 86400000)
}
export function todayLabel() {
  const d = new Date(todayKey() + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
}

// ---- row <-> local shape mapping ----
function rowToCheckin(row) {
  return { steps: !!row.steps, wake: !!row.wake, workout: !!row.workout, waterHalves: row.water_halves || 0 }
}
function checkinToRow(c) {
  return { steps: !!c.steps, wake: !!c.wake, workout: !!c.workout, water_halves: c.waterHalves || 0 }
}

// ---- selectors ----
export function getState() { return state }

export function getCheckin(dateKey = todayKey()) {
  return state.checkins[dateKey] || emptyCheckin()
}

// Current day within the 7-day sprint (1..7).
export function challengeDayIndex() {
  if (!state.challengeStart) return 1
  const diff = daysBetween(state.challengeStart, todayKey())
  return Math.min(CHALLENGE_DAYS, Math.max(1, diff + 1))
}
export function challengeDaysLeft() {
  return CHALLENGE_DAYS - challengeDayIndex()
}
export function challengeEndKey() {
  if (!state.challengeStart) return todayKey()
  const start = new Date(state.challengeStart + 'T00:00:00')
  start.setDate(start.getDate() + CHALLENGE_DAYS - 1)
  return dateToKey(start)
}

// Sum of my race points across the current sprint's days (from local cache,
// which is hydrated from Supabase on sign-in and kept live thereafter).
export function myTotalPoints() {
  if (!state.challengeStart) return 0
  let total = 0
  for (let i = 0; i < CHALLENGE_DAYS; i++) {
    const d = new Date(state.challengeStart + 'T00:00:00')
    d.setDate(d.getDate() + i)
    const c = state.checkins[dateToKey(d)]
    if (c) total += dayPoints(c)
  }
  return Number(total.toFixed(2))
}

export function competitorTotals() {
  const dIndex = challengeDayIndex()
  const completed = Math.max(0, dIndex - 1)
  return COMPETITORS.map((c) => ({
    ...c,
    total: Number((c.pace * completed + c.today * c.pace).toFixed(2)),
  }))
}

// Full leaderboard incl. the player and any real signed-in competitors.
export function leaderboard() {
  const me = {
    id: 'me',
    name: state.profile?.flexName || 'You',
    color: state.profile?.flexColor || '#ffcf5a',
    total: myTotalPoints(),
    isMe: true,
  }
  const others = state.remoteBoard.filter((p) => p.id !== state.auth.id)
  const all = [...competitorTotals(), ...others, me].sort((a, b) => b.total - a.total)
  all.forEach((p, i) => { p.rank = i + 1 })
  return all
}

export function myRank() {
  return leaderboard().find((p) => p.isMe)?.rank ?? null
}

// Forgiving streak: consecutive days (ending today) with at least one habit.
export function streak() {
  let n = 0
  const d = new Date(todayKey() + 'T00:00:00')
  const todayC = state.checkins[todayKey()]
  if (!todayC || !didSomething(todayC)) d.setDate(d.getDate() - 1)
  while (true) {
    const c = state.checkins[dateToKey(d)]
    if (c && didSomething(c)) { n++; d.setDate(d.getDate() - 1) } else break
  }
  return n
}

// ---- Supabase sync helpers ----
async function refreshLeaderboard() {
  if (!supabase || !state.challengeId) return
  const { data, error } = await supabase
    .from('checkins')
    .select('user_id, steps, wake, workout, water_halves')
    .eq('challenge_id', state.challengeId)
  if (error || !data) return
  const totals = new Map()
  for (const row of data) {
    const pts = dayPoints(rowToCheckin(row))
    totals.set(row.user_id, (totals.get(row.user_id) || 0) + pts)
  }
  const ids = [...totals.keys()].filter((id) => id !== state.auth.id)
  let profilesById = {}
  if (ids.length) {
    const { data: profs } = await supabase.from('profiles').select('id, flex_name, flex_color').in('id', ids)
    profilesById = Object.fromEntries((profs || []).map((p) => [p.id, p]))
  }
  const remoteBoard = ids.map((id) => ({
    id,
    name: profilesById[id]?.flex_name || 'Climber',
    color: profilesById[id]?.flex_color || '#c9bda3',
    total: Number((totals.get(id) || 0).toFixed(2)),
  }))
  set({ remoteBoard })
}

async function findOrCreateActiveChallenge() {
  const today = todayKey()
  const { data: existing } = await supabase
    .from('challenges')
    .select('*')
    .eq('status', 'active')
    .gte('ends_on', today)
    .order('starts_on', { ascending: false })
    .limit(1)
  if (existing && existing.length) return existing[0]
  const end = new Date(today + 'T00:00:00')
  end.setDate(end.getDate() + CHALLENGE_DAYS - 1)
  const { data: created, error } = await supabase
    .from('challenges')
    .insert({ starts_on: today, ends_on: dateToKey(end), status: 'active' })
    .select()
    .single()
  if (error) throw error
  return created
}

async function bootstrapUser(user) {
  if (!supabase) return
  const userId = user.id
  set({
    auth: { signedIn: true, name: user.user_metadata?.full_name || user.email, email: user.email, id: userId },
  })

  const { data: profileRow } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (profileRow) {
    set({ profile: { flexName: profileRow.flex_name, flexColor: profileRow.flex_color, wakeupTime: profileRow.wakeup_time } })
  }

  const { data: participantRows } = await supabase
    .from('participants')
    .select('challenge_id, challenges(starts_on, ends_on, status)')
    .eq('user_id', userId)
  const active = (participantRows || []).find((p) => p.challenges?.status === 'active' && p.challenges?.ends_on >= todayKey())
  if (active) {
    set({ joined: true, challengeId: active.challenge_id, challengeStart: active.challenges.starts_on })
    const { data: myCheckins } = await supabase
      .from('checkins')
      .select('date, steps, wake, workout, water_halves')
      .eq('user_id', userId)
      .eq('challenge_id', active.challenge_id)
    if (myCheckins) {
      const checkins = { ...state.checkins }
      myCheckins.forEach((row) => { checkins[row.date] = rowToCheckin(row) })
      set({ checkins })
    }
    refreshLeaderboard()
  }
}

// ---- actions ----
export const actions = {
  async signInWithGoogle() {
    if (!supabase) {
      // local-only fallback demo (no backend configured)
      set({ auth: { signedIn: true, name: 'You', email: 'you@local', id: 'local-demo' } })
      return
    }
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  },

  async joinChallenge() {
    if (!supabase || state.auth.id === 'local-demo') {
      if (!state.challengeStart) set({ joined: true, challengeStart: todayKey() })
      else set({ joined: true })
      return
    }
    const challenge = await findOrCreateActiveChallenge()
    await supabase.from('participants').upsert({ challenge_id: challenge.id, user_id: state.auth.id }, { onConflict: 'challenge_id,user_id' })
    set({ joined: true, challengeId: challenge.id, challengeStart: challenge.starts_on })
    refreshLeaderboard()
  },

  async saveProfile(profile) {
    set({ profile })
    if (!supabase || state.auth.id === 'local-demo') return
    await supabase.from('profiles').upsert({
      id: state.auth.id,
      flex_name: profile.flexName,
      flex_color: profile.flexColor,
      wakeup_time: profile.wakeupTime,
    })
    refreshLeaderboard()
  },

  setCheckin(dateKey, checkin) {
    set({ checkins: { ...state.checkins, [dateKey]: checkin } })
  },

  updateToday(patch) {
    const key = todayKey()
    const cur = getCheckin(key)
    const next = { ...cur, ...patch }
    actions.setCheckin(key, next) // optimistic local update — instant UI feedback

    if (supabase && state.auth.id && state.auth.id !== 'local-demo' && state.challengeId) {
      supabase.from('checkins').upsert(
        { user_id: state.auth.id, challenge_id: state.challengeId, date: key, ...checkinToRow(next) },
        { onConflict: 'user_id,date' },
      ).then(() => refreshLeaderboard())
    }
  },

  // dev helpers (for verification / testing)
  advanceDay() { set({ offsetDays: (state.offsetDays || 0) + 1 }) },

  // Wipes local cache AND your Supabase rows (checkins/participation/profile),
  // then signs out — so you land back on the very first screen, exactly like
  // a brand-new user. Without deleting the remote rows, signing back in with
  // the same Google account would just skip straight to Home.
  async reset() {
    if (supabase && state.auth.id && state.auth.id !== 'local-demo') {
      const uid = state.auth.id
      await Promise.all([
        supabase.from('checkins').delete().eq('user_id', uid),
        supabase.from('participants').delete().eq('user_id', uid),
      ])
      await supabase.from('profiles').delete().eq('id', uid)
      await supabase.auth.signOut()
    }
    localStorage.removeItem(KEY)
    state = { ...DEFAULT, authChecked: true }
    listeners.forEach((l) => l())
  },
}

// ---- bootstrap auth on load ----
if (supabase) {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session?.user) bootstrapUser(data.session.user)
    set({ authChecked: true })
  })
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) bootstrapUser(session.user)
    if (event === 'SIGNED_OUT') set({ ...DEFAULT, authChecked: true })
  })
} else {
  set({ authChecked: true })
}

// ---- react binding ----
function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb) }
export function useStore() {
  return useSyncExternalStore(subscribe, getState)
}
