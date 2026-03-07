# NumKnight — Dev Notes for Claude

## ⚠️ Always bump the version after making changes
The version lives in `package.json` → `"version"` field (patch digit = third number).
Increment it at the end of every session that changes code.
`npm run build` bumps it automatically via `scripts/bump-version.js`.
If the user is only running `npm run dev`, update `package.json` manually.

---

## Deploying
When the user asks to deploy, run:
```
npm run deploy
```
This runs `npm run build` (bumps version + builds) then `gh-pages -d dist` to publish to GitHub Pages.

---

## Stack
- React 18 + Vite, Tailwind CSS, Framer Motion
- `vite-plugin-singlefile` → entire app builds to a single self-contained HTML file
- No router — screen state managed in `App.jsx`
- Platform: Windows 11, shell: bash

---

## Key files

| File | Purpose |
|------|---------|
| `src/game/campaign.config.js` | **Single source of truth for all level design** — defines EASY/MEDIUM/HARD configs |
| `src/game/runState.js` | localStorage helpers: `createNewRun / loadRun / saveRun / clearRun` |
| `src/game/battleLogic.js` | `makeRound`, `generateOptions`, `getTrophy`, `calcBattleScore` |
| `src/game/scoreState.js` | Leaderboard helpers: `saveScore / loadScores` (key: `numknight_scores`) |
| `src/game/i18n.js` | EN + Hebrew translations; `T[lang]` object; `LANG_KEY` constant |
| `src/game/sounds.js` | `playCorrect/Wrong/SwordSwing/Impact/Victory/Defeat` |
| `src/App.jsx` | Campaign state machine — screen routing, run persistence, score tracking |
| `src/screens/StartScreen.jsx` | Name input + Easy/Medium/Hard difficulty picker + lang toggle |
| `src/screens/WorldMapScreen.jsx` | Vertical 5-world map with trophies and world bands |
| `src/screens/BattleScreen.jsx` | Battle UI + countdown timer + TrophyOverlay |
| `src/screens/ResultScreen.jsx` | Trophy result (win) or game over (loss) |
| `src/screens/AreaClearedScreen.jsx` | World cleared — trophy grid + animated score transfer |
| `src/screens/LeaderboardScreen.jsx` | Top-10 local leaderboard with name entry |
| `src/screens/DesignScreen.jsx` | Dev tool — browse all screens/backgrounds (add `?design` to URL) |
| `src/components/EnemyCharacter.jsx` | All 5 enemy SVGs + shared animation logic |
| `src/components/KnightCharacter.jsx` | Player SVG |
| `src/components/BattleBackground.jsx` | Per-world 3-layer background (sky, light source, terrain) |
| `src/components/BattleIntro.jsx` | Fighting-game style slide-in + sword banner on battle start |
| `src/components/HPBar.jsx` | HP bar component |
| `src/components/AnswerButton.jsx` | Answer button with idle/correct/wrong states |
| `scripts/bump-version.js` | Increments patch version in package.json before each build |
| `CLAUDE.md` | This file — always loaded by Claude Code |

---

## Campaign config (`campaign.config.js`)

Three named configs — `EASY`, `MEDIUM`, `HARD` — are exported. The active config is determined at runtime by the difficulty the player picks on `StartScreen`. Each world entry shape:

```js
{
  id, name, icon,
  battles,       // number of fights in this world
  playerHP,      // hits before death (3 = gold/silver/bronze possible)
  enemy: { id, name, hp },   // id: goblin|skeleton|orc|darkKnight|dragon
  timer,         // null = unlimited | N = N seconds/question (miss = damage)
  multipliers,   // times-tables for left factor  a × b
  factorRange,   // [min, max] for right factor
}
```

---

## World table (Medium difficulty)

| # | World | Enemy | HP | Timer | Multipliers |
|---|-------|-------|----|-------|-------------|
| 0 | Forest 🌲 | Goblin | 4 | — | 2,3,4 |
| 1 | Swamp 🌿 | Skeleton | 5 | — | 2–6 |
| 2 | Mountains ⛰️ | Orc | 6 | — | 3–8 |
| 3 | Castle 🏰 | Dark Knight | 6 | 8s | full 1–10 |
| 4 | Dragon Lair 🐉 | Dragon | 7 | 5s | 3–9 |

Easy: 1 battle/world, hp:1, no timers — good for quick testing.
Hard: tighter timers (Castle 6s, Dragon Lair 4s), Dragon Lair playerHP:2.

---

## Architecture

### Run state (localStorage key: `numknight_run`)
```js
{
  worldIndex,
  battleIndex,
  trophies[],      // 'gold'|'silver'|'bronze' — one per completed battle
  totalScore,      // cumulative score across all battles
  worldScores[],   // score per world (indexed by worldIndex)
}
```
- Victory when `trophies.length >= sum of all worlds' battles`
- Death (playerHP → 0) → game over → leaderboard → restart

### Trophy logic
- 0 mistakes → gold, 1 → silver, 2 → bronze, 3 hits → dead

### Scoring
```
battleScore = calcBattleScore(trophy, timeBonus)
  trophy multiplier: gold×3, silver×2, bronze×1
  timeBonus: only for timed worlds — floor((timeLeft / world.timer) × 50) per correct answer
```

### Multiplier system
- Each world has an explicit `multipliers` array in the config
- `makeRound(multipliers, factorRange)` picks `a` from the array, `b` from factorRange

### Timer mechanic (Castle / Dragon Lair)
- Countdown starts after intro; resets on each new round
- Expiry = wrong answer (highlights correct button, deals damage)
- Visual: draining bar green→amber→red + seconds label inside problem card

### i18n
- `src/game/i18n.js` exports `T` (translation map) and `LANG_KEY` (localStorage key)
- `lang` state lives in `App.jsx`, passed as `lang` + `t` props to all screens
- Screens apply `dir="rtl"` when `lang === 'he'`
- Toggle on `StartScreen` (EN / עב)

### Screen flow
```
start → map → battle → result (won)  → next battle OR cleared → map / leaderboard (victory)
                     → result (lost) → leaderboard → start
```

---

## Enemy SVGs (`EnemyCharacter.jsx`)

Each enemy: `BodySVG` + `WeaponArmSVG` (same `viewBox="0 0 90 120"`, overlaid).
Rendered at 84×112 px, mirrored with `scaleX(-1)`.
Weapon arm pivot: `transformOrigin: '66px 50px'` (shoulder — same for all).

| Enemy | Weapon | Splash colour |
|-------|--------|---------------|
| Goblin | Club | `#fbbf24` |
| Skeleton | Scythe | `#a78bfa` |
| Orc | Axe | `#fb923c` |
| Dark Knight | Sword | `#94a3b8` |
| Dragon | Claw + fire | `#f87171` |

---

## BattleBackground layers
1. **Sky** — CSS `linear-gradient` div (`inset: 0`) — never clipped
2. **Sun** — CSS absolute div pinned `top:18 right:18`, 64px glow + 40px core
3. **Hills** — SVG `position:absolute bottom:0 height:48%` with `overflow="visible"` so crests render into sky; `preserveAspectRatio="none"` stretches to fill width

The arena div has **no** `overflow:hidden` so weapon/wing sprites aren't clipped.

---

## UI details
- Version label + `debug`/`prod` mode shown top-left of the skybox (in BattleScreen)
- Encounter dots: outlined SVG circles (○) that fill gold (●) as battles complete; active battle has a centre dot
- Result screen: `CONTINUE →` button, dots use same outlined→filled style, `battleNum/totalBattles` is dynamic

---

## What was last worked on
- Knight RTL/flicker fix, world name translated on defeat screen
- gh-pages deploy script (`npm run deploy`)
- Grounded forest trees, brightened castle, overhauled dragon lair background
- Design mode: phone frame, bottom nav, swipe support
- Knight strolls castle fields, layered behind trees and castle
- i18n (EN + Hebrew), difficulty system (Easy/Medium/Hard), StartScreen
- Scoring, local leaderboard, Area Cleared screen with animated score transfer
- All 5 per-world backgrounds and all 5 enemy SVGs

## Implementation status
- **Phases 1–4** (World Map, Backgrounds, Scoring, Leaderboard): ✅ Complete
- **Phase 5** (Visual Polish): ⏳ Pending
- **Phase 6** (Backend Leaderboard): ⏳ Pending

---

---

# ROADMAP

> Phases 1–4 are **complete**. See PROGRESS.md for details.
> Phases 5–6 are pending. See PLAN.md and PLAN_PENDING.md.

## Phase 1 — World Map Screen ✅ COMPLETE
**Goal:** Show the player where they are in the campaign between battles.

### What it looks like
- A vertical or winding path with 5 world nodes (icon + name)
- Completed nodes show the best trophy earned across their battles
- Current world node pulses / is highlighted
- Future nodes are locked/dimmed
- Shown after the result screen when advancing to a new world (not between battles in the same world)
- A "FIGHT" button at the current node launches the next battle

### Technical approach
- New screen: `src/screens/WorldMapScreen.jsx`
- New App screen state: `'map'` — inserted between `result` (last battle of a world) and `battle` (first of next world)
- Props needed: `worlds` (WORLDS array), `worldIndex` (current), `trophies[]` (all earned so far)
- Trophy per world = best trophy across that world's completed battles (gold > silver > bronze)
- Framer Motion: staggered node entrance, path draw animation (`pathLength` 0→1)

### Data shape addition to runState (no breaking change)
- Trophies array is already stored; derive per-world best at render time

---

## Phase 2 — Per-World Backgrounds ✅ COMPLETE
**Goal:** Each region feels visually distinct.

### Palette plan
| World | Sky | Ground/terrain | Special elements |
|-------|-----|----------------|-----------------|
| Forest | Blue→light blue (current) | Green hills (current) | Sun |
| Swamp | Murky purple-green→grey-green | Dark boggy ground, dead trees | Dim moon |
| Mountains | Cold grey-blue→pale | Rocky grey ground, snow patches | Snow-capped peaks |
| Castle | Dark navy→charcoal | Stone floor, battlements silhouette | Storm clouds |
| Dragon Lair | Deep red-orange→dark | Volcanic rock, lava cracks | Glowing lava glow at bottom |

### Technical approach
- `BattleBackground` accepts a `worldId` prop
- Internal switch/map returns the right layer config (sky gradient stops, ground colour, extra SVG elements)
- Sun becomes a world-specific light source (sun for forest/mountains, moon for swamp, no sun for castle/lair)
- Add `background` field to `campaign.config.js` world entries (or derive from `id` — simpler)
- No new files needed; all within `BattleBackground.jsx`

---

## Phase 3 — Scoring System ✅ COMPLETE
**Goal:** Give players a numeric score to chase, rewarding speed and accuracy.

### Score formula (per battle)
```
battleScore = basePoints × trophyMultiplier + timeBonus

basePoints       = enemy.hp × 100          (harder enemies = more base points)
trophyMultiplier = gold:3  silver:2  bronze:1
timeBonus        = only for timed worlds (timer !== null)
                 = sum over all questions of: floor((timeLeft / world.timer) × 50)
                   (answered with 8s left on an 8s timer = 50 bonus pts)
```

### Run score
`totalScore = sum of all battleScores`

### What needs tracking
- `questionTimeLeft` at moment of correct answer — already available in BattleScreen state
- Pass `score` out of `onBattleEnd({ won, mistakes, score })`
- Store per-battle scores in `runState.trophies` → extend to `runState.battles[]`:
  ```js
  battles: [{ trophy, score, worldIndex, battleIndex }]
  ```
- Show battle score on the result screen (animates up like a counter)
- Show cumulative run score on the victory screen

### Changes needed
- `battleLogic.js`: add `calcBattleScore(enemyHp, trophy, timeBonuses)`
- `BattleScreen.jsx`: track `timeBonuses[]`, pass score to `onBattleEnd`
- `ResultScreen.jsx`: display battle score + running total
- `runState.js`: extend battles array shape

---

## Phase 4 — Local Leaderboard ✅ COMPLETE
**Goal:** Top runs stored in the browser, shown after each completed run.

### Data (localStorage key: `numknight_scores`)
```js
[
  { name, totalScore, worldsCleared, date, trophySummary },
  // kept sorted, capped at top 10
]
```

### Flow
1. Victory screen: show final score + prompt for player name (simple text input)
2. Save entry to `numknight_scores`
3. Transition to leaderboard screen showing top 10
4. "PLAY AGAIN" from leaderboard restarts

### New files
- `src/game/scoreState.js` — `saveScore(entry)`, `loadScores()`, `clearScores()`
- `src/screens/LeaderboardScreen.jsx` — ranked table with trophy icons, score, name, date
- `src/screens/NameEntryScreen.jsx` — simple input + confirm (or inline on victory screen)

### UI
- Gold/silver/bronze row tinting based on avg trophy
- Animated rank numbers counting in
- Player's just-submitted run highlighted

---

## Phase 5 — Visual Polish ⏳ PENDING
**Goal:** Juice up the moments that matter most.

### Priority list
1. **Enemy death animation** — when enemy HP hits 0: rotate + fall off-screen (translateY +200, rotate 90deg, fade out). Currently enemy just disappears when `won` phase starts.
2. **Player death animation** — knight topples/falls when HP hits 0 (similar fall + fade)
3. **Screen flash on hit** — brief red overlay (opacity 0→0.3→0) when player takes damage
4. **Victory particle burst** — confetti/star particles explode on gold trophy
5. **World transition** — cinematic wipe or flash between worlds on the map
6. **Answer button shake** — wrong answer: button shakes left-right
7. **HP bar animate** — smooth lerp instead of instant drop; flash red on damage
8. **Idle enemy variety** — enemies do occasional random actions (scratch head, look around) during long idle

### Technical notes
- Enemy fall: add `'dying'` phase to EnemyCharacter, triggered when `phase === 'won'` and `enemyHP === 0`; use Framer Motion exit animation
- Player fall: same in KnightCharacter
- Screen flash: absolute overlay div in BattleScreen, `AnimatePresence` + opacity keyframe
- Particles: can use a simple hand-rolled CSS/SVG burst (no library needed) similar to the existing `HitSplash`

---

## Phase 6 — Cross-Device Backend Leaderboard ⏳ PENDING
**Goal:** Global high scores visible across all devices/players.

### Recommended stack
**Supabase** (free tier, no self-hosting needed)
- PostgreSQL database
- Auto-generated REST API
- No auth required for a public leaderboard (anon key is fine)
- Works with `vite-plugin-singlefile` (pure HTTP calls, no SSR needed)

### Schema
```sql
CREATE TABLE scores (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  total_score integer NOT NULL,
  worlds_cleared integer NOT NULL,
  trophy_summary  text,   -- e.g. "GGSBS" (G=gold S=silver B=bronze)
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX ON scores(total_score DESC);
```

### App changes
- `src/game/api.js` — `submitScore(entry)`, `fetchLeaderboard(limit=20)`
- Leaderboard screen fetches global scores on mount; falls back to local if offline
- Player name persisted locally (`numknight_player_name`) so they don't re-enter it each run
- Submit score at end of run (fire-and-forget, non-blocking)

### Anti-cheat (lightweight)
- Score is recomputed server-side from the submitted `battles[]` array (validate formula)
- Rate-limit submissions per IP (Supabase Edge Functions or just rely on their built-in rate limits)
- Names: client-side length cap (16 chars), no validation for content (keep it simple)

### Considerations
- The app is currently a single HTML file — Supabase JS client adds ~40KB gzipped. Acceptable.
- Offline-first: always save locally, submit globally when possible
- No login/accounts — name is the identity. Same name from different devices = separate entries (by design, keeps it simple)

---

## Suggested implementation order
```
Phase 1 (World Map)      ✅ Done
Phase 2 (Backgrounds)   ✅ Done
Phase 3 (Scoring)       ✅ Done
Phase 4 (Local LB)      ✅ Done
Phase 5 (Polish)        ← next up — do incrementally, high impact per effort
Phase 6 (Backend LB)    ← last, biggest lift
```
