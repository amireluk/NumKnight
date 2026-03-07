# NumKnight — Fine-Grained Pending Tasks

> These are detailed task lists for features not yet confirmed complete.
> Phases 1–4 are done — see PROGRESS.md. Phases 5–6 are pending.

---

## Phase 5 — Visual Polish

### P5-A: Enemy death animation
- [ ] Add `'dying'` phase to `EnemyCharacter.jsx` state machine
- [ ] Trigger when `phase === 'won'` and `enemyHP === 0`
- [ ] Framer Motion exit: `translateY +200, rotate 90deg, opacity 0`
- [ ] Hold result screen until animation completes

### P5-B: Player death animation
- [ ] Add `'dying'` state to `KnightCharacter.jsx`
- [ ] Trigger when player HP hits 0 (`phase === 'lost'`)
- [ ] Same fall animation: translateY +200, rotate -90deg, fade out

### P5-C: Screen flash on hit
- [ ] Add absolute overlay div in `BattleScreen.jsx`
- [ ] Use `AnimatePresence` with opacity keyframe: `0 → 0.3 → 0`
- [ ] Trigger on every player hit (both wrong answer and timer expiry)

### P5-D: Victory particle burst
- [ ] Hand-rolled CSS/SVG burst (no library)
- [ ] Trigger on gold trophy result
- [ ] Similar to existing `HitSplash` component pattern

### P5-E: Answer button shake
- [ ] Add shake animation to `AnswerButton.jsx` on wrong answer
- [ ] Framer Motion: `x: [0, -8, 8, -8, 0]` keyframe

### P5-F: HP bar smooth lerp
- [ ] Animate HP bar width change with spring or tween in `HPBar.jsx`
- [ ] Flash red on damage

### P5-G: Idle enemy variety
- [ ] Add occasional random idle actions to `EnemyCharacter.jsx`
- [ ] e.g. small sway, head bob after 3–4s of inactivity

---

## Phase 6 — Backend Leaderboard

### P6-A: Supabase setup
- [ ] Create Supabase project + `scores` table (see PLAN.md schema)
- [ ] Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`

### P6-B: API module
- [ ] Create `src/game/api.js` with `submitScore(entry)` and `fetchLeaderboard(limit)`
- [ ] Fire-and-forget submit (non-blocking)
- [ ] Offline fallback: if fetch fails, silently use local scores

### P6-C: Leaderboard screen update
- [ ] Fetch global scores on mount
- [ ] Show loading state while fetching
- [ ] Highlight player's just-submitted row

### P6-D: Anti-cheat (lightweight)
- [ ] Submit `battles[]` array alongside the total score
- [ ] Server-side Supabase Edge Function validates the score formula
- [ ] Rate limit submissions per IP

---

## Previously Pending (A–F from old PLAN_PENDING) — Status

| Section | Description | Status |
|---------|-------------|--------|
| A | World Map redesign (reverse order, X overlay, bigger icons) | ✅ Done |
| B | Leaderboard (endWorld column, comma-format, per-difficulty carousel) | ✅ Done |
| C | Start Screen (split into StartScreen + NewGameScreen with difficulty picker) | ✅ Done |
| D | Battle Intro "FINAL ROUND" text for last battle | ⚠️ Not implemented — low priority |
| E | Battle bug fixes (stop timer on death, score formula) | ✅ Done |
| F | Area Cleared animated score transfer | ✅ Done |
