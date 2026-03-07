# NumKnight — Feature Roadmap

> The original 4-phase plan has been superseded. This file now reflects the current 6-phase roadmap.
> See [`PROGRESS.md`](./PROGRESS.md) for what is already done.
> See [`CLAUDE.md`](./CLAUDE.md) for architecture details and the canonical roadmap description.

---

## Phase 1 — World Map Screen ✅ COMPLETE

A vertical world map with 5 nodes shown between worlds.

- World bands with icon + name + trophy indicator
- Completed worlds show best trophy across their battles
- Locked worlds are dimmed
- Framer Motion staggered entrance and path draw
- Screen state: `'map'` — inserted between `result` and `battle`

---

## Phase 2 — Per-World Backgrounds ✅ COMPLETE

Each world has a visually distinct battle arena.

| World | Sky | Special |
|-------|-----|---------|
| Forest | Blue → light blue | Sun, green hills |
| Swamp | Purple-grey | Dim moon, dead trees |
| Mountains | Cold grey-blue | Rocky peaks, snow |
| Castle | Dark navy | Battlements, storm clouds |
| Dragon Lair | Deep red | Volcanic rock, lava glow |

---

## Phase 3 — Scoring System ✅ COMPLETE

```
battleScore = basePoints × trophyMultiplier + timeBonus

basePoints       = enemy.hp × 100
trophyMultiplier = gold:3  silver:2  bronze:1
timeBonus        = floor((timeLeft / world.timer) × 50)  [timed worlds only]
```

- Score tracked in `runState.totalScore` and per-world `runState.worldScores`
- Battle score shown on result screen
- Animated score transfer on Area Cleared screen

---

## Phase 4 — Local Leaderboard ✅ COMPLETE

Top 10 runs stored in `localStorage` (`numknight_scores`).

```js
{ name, score, date, endWorld, cleared }
```

- Victory → LeaderboardScreen with name entry
- Death → ResultScreen → LeaderboardScreen
- `cleared: true` shows "CONQUERED" for full-campaign wins
- Scores persist across sessions

---

## Phase 5 — Visual Polish ⏳ PENDING

Priority list:

1. **Enemy death animation** — rotate + fall off-screen when HP hits 0
2. **Player death animation** — knight topples/falls on death
3. **Screen flash on hit** — brief red overlay when player takes damage
4. **Victory particle burst** — confetti/stars on gold trophy
5. **Answer button shake** — wrong answer: button shakes left-right
6. **HP bar animate** — smooth lerp + flash red on damage
7. **Idle enemy variety** — occasional random actions during long idle

### Technical notes
- Enemy fall: add `'dying'` phase to `EnemyCharacter`, Framer Motion exit animation
- Player fall: same in `KnightCharacter`
- Screen flash: absolute overlay in `BattleScreen`, `AnimatePresence` + opacity keyframe
- Particles: hand-rolled CSS/SVG burst, no library needed

---

## Phase 6 — Backend Leaderboard ⏳ PENDING

Global scores across devices using Supabase (free tier).

### Schema
```sql
CREATE TABLE scores (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  total_score integer NOT NULL,
  worlds_cleared integer NOT NULL,
  trophy_summary  text,
  created_at  timestamptz DEFAULT now()
);
```

### App changes
- `src/game/api.js` — `submitScore(entry)`, `fetchLeaderboard(limit=20)`
- Leaderboard screen fetches global scores on mount; falls back to local if offline
- Player name persisted in `localStorage` so they don't re-enter each run
- Score recomputed server-side from submitted `battles[]` for basic anti-cheat

---

## Suggested implementation order

```
Phase 5 (Polish)    ← do incrementally, highest perceived value per effort
Phase 6 (Backend)   ← biggest lift, needs Phase 3+4 (done) as prereqs
```
