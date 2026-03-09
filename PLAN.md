# NumKnight — Feature Roadmap

> Phases 1–4 complete. Phase 6 and enemy/background visual overhaul are out of scope.
> Boss work tracked in [PLAN_BOSS.md](./PLAN_BOSS.md).
> Architecture details in [CLAUDE.md](./CLAUDE.md).

---

## Phase 1 — World Map Screen ✅ COMPLETE
## Phase 2 — Per-World Backgrounds ✅ COMPLETE
## Phase 3 — Scoring System ✅ COMPLETE
## Phase 4 — Local Leaderboard ✅ COMPLETE
## Phase 6 — Backend Leaderboard 🚫 OUT OF SCOPE

---

## Phase 5 — Visual Polish

### P5-A  Enemy death animation ⏳ PENDING

**Trigger:** `phase === 'won'` fires in BattleScreen (after the last HP drops).

**What to build — `EnemyCharacter.jsx`:**
- Add a `dying` prop (boolean). When `true`, run a Framer Motion animate sequence:
  - `rotate: 90, y: 200, opacity: 0` over `duration: 0.6, ease: 'easeIn'`
  - Use `animate` on the wrapper div; normal state is `{ rotate:0, y:0, opacity:1 }`
- BattleScreen sets `enemyDying = true` the moment `enemyHP` reaches 0 (before transitioning phase).
- Wait ~700 ms after setting `enemyDying`, then proceed to `phase = 'won'` as normal.
- Shield (dragon) should also exit at the same time — set `shieldState = null` alongside `enemyDying`.

**Files:** `src/components/EnemyCharacter.jsx`, `src/screens/BattleScreen.jsx`

---

### P5-B  Player death animation ⏳ PENDING

**Trigger:** `playerHP` hits 0 in BattleScreen.

**What to build — `KnightCharacter.jsx`:**
- Add a `dying` prop (boolean). Animate: `rotate: -90, y: 200, opacity: 0` over `0.6s easeIn`.
  - Knight falls to the left (negative rotate) since it faces right.
- BattleScreen sets `knightDying = true` when `playerHP` reaches 0.
- Wait ~700 ms, then transition to `phase = 'lost'` / `onBattleEnd` as normal.

**Files:** `src/components/KnightCharacter.jsx`, `src/screens/BattleScreen.jsx`

---

### P5-C  Screen flash on hit ⏳ PENDING

**Trigger:** Any time the player takes damage (wrong answer or timer expiry).

**What to build — `BattleScreen.jsx`:**
- Add a `flashHit` state (boolean, default false).
- When player takes damage: `setFlashHit(true)`, then `setTimeout(() => setFlashHit(false), 300)`.
- Render an absolute-positioned `div` covering the full arena, pointer-events none:
  ```jsx
  <motion.div
    className="absolute inset-0 pointer-events-none z-50"
    animate={{ opacity: flashHit ? [0, 0.35, 0] : 0 }}
    transition={{ duration: 0.3 }}
    style={{ background: 'red' }}
  />
  ```
- Also flash for boss shield restore (same mechanism, same color).

**Files:** `src/screens/BattleScreen.jsx`

---

### P5-D  Answer button shake ⏳ PENDING

**Trigger:** Wrong answer selected.

**What to build — `AnswerButton.jsx`:**
- Track a `shaking` state in the parent (`BattleScreen`) or inside the button via a key trick.
- On wrong answer, set the selected button's `shaking = true`; clear after 400 ms.
- Framer Motion `animate` on the button wrapper:
  ```js
  shaking ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : { x: 0 }
  transition: { duration: 0.4 }
  ```
- Only the selected wrong button shakes (not the correct-highlight button).
- The `state` prop already tracks `'wrong'` — use that to drive the shake.

**Files:** `src/components/AnswerButton.jsx`, `src/screens/BattleScreen.jsx`

---

### P5-E  HP bar smooth lerp ⏳ PENDING

**Trigger:** Player or enemy HP changes.

**What to build — `HPBar.jsx`:**
- Replace instant width with a `motion.div` width transition:
  ```jsx
  <motion.div
    className="h-full rounded-full"
    animate={{ width: `${(hp / maxHp) * 100}%` }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    style={{ background: barColor }}
  />
  ```
- On damage: flash the bar red briefly. Add a `flashing` state — `true` for 300 ms after hp drops. While `flashing`, override bar color to `#ef4444` (red-500), then back to normal.
- Apply to both the player HP bar and the enemy HP bar.

**Files:** `src/components/HPBar.jsx`

---

### P5-F  Idle enemy variety ⏳ PENDING

**Trigger:** During idle phase when no answer is being processed.

**What to build — `EnemyCharacter.jsx`:**
- Every 4–7 seconds (random interval), trigger one of 3 random idle actions:
  1. **Head bob** — `y: [0, -6, 0]` over 0.5s
  2. **Weapon twitch** — weapon arm rotates briefly: `rotate: [0, -15, 0]` over 0.4s
  3. **Body sway** — `x: [0, 4, -4, 0]` over 0.6s
- Use a `useEffect` that sets a random timeout; on each fire, pick an action at random, animate it, then schedule the next one.
- Only run during `phase === 'idle'` or `phase === 'question'` (not during `hit`, `dying`, `attack`, or `won`/`lost`).
- Use a ref for the timeout so it clears on unmount.

**Files:** `src/components/EnemyCharacter.jsx`

---

## Dragon Boss — see PLAN_BOSS.md

```
Boss Phase 1  Shield mechanic (3-hit crack/fall/damage)  ✅ complete
Boss Phase 2  Boss polish (intro banner, rage phase)      ⏳ pending
Boss Phase 3  Audio cues (entire app)                     ⏳ pending
Boss Phase 4  Visual overhaul (enemies + backgrounds)     🚫 out of scope
```

---

## Implementation order

```
P5-C  Screen flash on hit        ← 20 min, single file, no dependencies
P5-D  Answer button shake        ← 20 min, AnswerButton.jsx only
P5-E  HP bar smooth lerp         ← 20 min, HPBar.jsx only
P5-A  Enemy death animation      ← 45 min, biggest wow moment
P5-B  Player death animation     ← 20 min, reuses P5-A pattern
P5-F  Idle enemy variety         ← 30 min, EnemyCharacter.jsx only
Boss Phase 2  Boss polish        ← see PLAN_BOSS.md
Boss Phase 3  Audio cues         ← see PLAN_BOSS.md
```
