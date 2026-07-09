# Flex — a gamified daily habit tracker

Do four daily habits, keep your energy twin **Flex** charged, and race everyone else on a recurring 7-day track. Built to be *fun to come back to*, not a chore.

## The four habits
- **10,000 steps** — tap when you hit it
- **Wake up early** — you set your own wakeup time
- **Workout / Yoga** — any session counts
- **Drink 3 bottles (3L)** — tap each bottle once for half (0.5L), twice for full

Each fills Flex's chest battery (red under 50% → orange at 50%+ → green when all four are done) and changes its face. Full charge triggers a jump, confetti, and a celebration sound. A forgiving streak counts any day you do at least one habit.

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (default http://localhost:5180). Add `?dev` to the URL for a small toolbar to simulate the next day or reset local data — handy for testing streaks.

## How it's built
- **React + Vite**, plain CSS design system, mobile-first, installable as a **PWA**.
- **Local-first**: all state persists to `localStorage` via `src/data/store.js`, so it runs with zero backend setup. The store's small read/write surface is designed to be swapped for **Supabase** (Google auth + Postgres) to make the race truly multiplayer — see the plan for the data model. Seeded competitors currently populate the race.
- All illustrations (Flex, icons) are custom SVG — no emoji, no stock art.

## Structure
- `src/data/habits.js` — battery %, mood, and race-points maths (pure)
- `src/data/store.js` — persistence, streak, challenge days, leaderboard
- `src/components/Flex.jsx` — the mascot, driven by mood + battery fill
- `src/screens/` — onboarding wizard (Landing → SignUp → ChallengeIntro → JoinChallenge → Setup) and the main Home + Track
