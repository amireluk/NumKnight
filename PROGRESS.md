# NumKnight — Progress Tracker

> Update this file at the end of each session.
> Last updated: 2026-03-07 | Version: 1.3.76

---

## Summary

The core game is feature-complete through Phase 4 of the roadmap. Phases 5–6 (visual polish and backend leaderboard) are still pending.

---

## ✅ Complete

### Foundation
- [x] Project scaffold — Vite + React + Tailwind + Framer Motion
- [x] Single-file build (`vite-plugin-singlefile` → one `index.html`)
- [x] Auto version bump on build (`scripts/bump-version.js`)
- [x] GitHub Pages deploy (`npm run deploy` via `gh-pages`)
- [x] `localStorage` run persistence across page reloads
- [x] Design mode — browse all screens at `?design` URL param

### Campaign & Battle
- [x] Full 5-world campaign (Forest → Swamp → Mountains → Castle → Dragon Lair)
- [x] All 5 enemies: Goblin, Skeleton, Orc, Dark Knight, Dragon (SVG + Framer Motion)
- [x] Knight SVG character with attack/hit/idle animations
- [x] HP system — 3 hits = death (enables gold/silver/bronze trophies)
- [x] Trophy rating per battle (gold/silver/bronze based on mistake count)
- [x] Timer mechanic — Castle (8s), Dragon Lair (5s); timeout = damage
- [x] Battle intro sequence (fighting-game style slide-in + sword banner)
- [x] Smart distractors — 3 wrong answers near the correct answer
- [x] Sound effects — correct, wrong, sword swing, impact, victory, defeat

### Screens
- [x] `StartScreen` — main menu (play + leaderboard buttons, lang toggle)
- [x] `NewGameScreen` — name input + Easy / Medium / Hard difficulty picker
- [x] `WorldMapScreen` — vertical map with 5 world bands, trophy indicators, knight position
- [x] `BattleScreen` — full battle UI with countdown timer, HP bars, encounter dots
- [x] `ResultScreen` — trophy result (win) or game over (loss)
- [x] `AreaClearedScreen` — world score + trophy grid, animated score transfer to total
- [x] `LeaderboardScreen` — per-difficulty carousel (swipe/peek/circular), top 3 per difficulty, name entry

### Scoring
- [x] Per-battle score: base points × trophy multiplier + time bonus
- [x] World score accumulation
- [x] Run total score tracked in `runState`
- [x] Scores persisted to `localStorage` (`numknight_scores`)

### Per-world Backgrounds
- [x] Forest — blue sky, sun, green hills
- [x] Swamp — purple-grey sky, dim moon, dead trees, dark ground
- [x] Mountains — cold grey-blue sky, rocky peaks, snow patches
- [x] Castle — dark navy sky, stone battlements, storm clouds
- [x] Dragon Lair — deep red sky, volcanic rock, lava glow

### i18n
- [x] English and Hebrew translations (`src/game/i18n.js`)
- [x] Language toggle on StartScreen (EN / עב)
- [x] RTL layout support when lang = `'he'`
- [x] `lang` + `t` passed from `App.jsx` to all screens

### Difficulty System
- [x] 3 difficulty configs in `campaign.config.js`: `EASY`, `MEDIUM`, `HARD`
- [x] Difficulty selected on NewGameScreen, drives all world/enemy/timer parameters
- [x] Player name persisted to `localStorage`
- [x] Scores stored separately per difficulty (`numknight_scores_easy/medium/hard`)

### UX & Polish
- [x] Android hardware back button support (all screens)
- [x] Design mode — phone frame, bottom nav, swipe between screens (`?design` URL param)
- [x] Castle spikes / battlements added to world map
- [x] Difficulty-reactive castle appearance on world map
- [x] Knight strolls castle fields, layered behind trees and castle
- [x] Version label in battle screen skybox

---

---

## ⏳ Pending (from Roadmap)

### Phase 5 — Visual Polish
- [ ] Enemy death animation (fall off-screen when HP → 0)
- [ ] Player death animation (knight topples/falls)
- [ ] Screen flash on hit (brief red overlay)
- [ ] Victory particle burst (confetti on gold trophy)
- [ ] Answer button shake on wrong answer
- [ ] HP bar smooth lerp + flash red on damage
- [ ] Idle enemy variety (random actions during long idle)

### Phase 6 — Backend Leaderboard
- [ ] Supabase schema + REST API
- [ ] `src/game/api.js` — `submitScore` / `fetchLeaderboard`
- [ ] Global leaderboard with offline fallback to local
- [ ] Player name persisted across devices

---

## Suggested Next Steps

In priority order (highest impact / lowest effort first):

1. **Answer button shake** (P5-E) — 30 min, very satisfying wrong-answer feedback. Just a Framer Motion keyframe on `AnswerButton.jsx`.
2. **Screen flash on hit** (P5-C) — 30 min, visceral damage feel. Absolute overlay in `BattleScreen`.
3. **Enemy death animation** (P5-A) — 1–2 hrs, biggest "wow" moment. Add `'dying'` phase + Framer Motion exit.
4. **Player death animation** (P5-B) — 30 min once P5-A is done, reuses same pattern.
5. **HP bar smooth lerp** (P5-F) — 30 min, easy win. Spring animation on bar width.
6. **Victory particle burst** (P5-D) — 1 hr, great feel on gold. Hand-rolled SVG burst like `HitSplash`.
7. **Idle enemy variety** (P5-G) — 1 hr, brings the world alive.
8. **Backend leaderboard** (Phase 6) — biggest lift (~1 day). Do after all Phase 5 items.

---

## Notes

- `npm run dev` → `http://localhost:5173`
- Mobile testing: `npm run dev -- --host` → open Network URL on phone
- `npm run deploy` → builds + publishes to GitHub Pages
- GitHub: https://github.com/amireluk/NumKnight
