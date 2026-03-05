# NumKnight — Dev Notes for Claude

## ⚠️ Always bump the version after making changes
The version lives in `package.json` → `"version"` field (patch digit = third number).
Increment it at the end of every session that changes code.
`npm run build` bumps it automatically via `scripts/bump-version.js`.
If the user is only running `npm run dev`, update `package.json` manually.

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
| `src/game/campaign.config.js` | **Single source of truth for all level design** — edit this to tune worlds |
| `src/game/worldConfig.js` | Thin re-export: `CAMPAIGN as WORLDS` |
| `src/game/runState.js` | localStorage helpers: `createNewRun / loadRun / saveRun / clearRun` |
| `src/game/battleLogic.js` | `makeRound(multipliers, factorRange)`, `generateOptions`, `getTrophy` |
| `src/game/sounds.js` | `playCorrect/Wrong/SwordSwing/Impact/Victory/Defeat` |
| `src/App.jsx` | Campaign state machine, run persistence |
| `src/screens/BattleScreen.jsx` | Battle UI + countdown timer |
| `src/screens/ResultScreen.jsx` | Trophy result + game over screens |
| `src/components/EnemyCharacter.jsx` | All 5 enemy SVGs + shared animation logic |
| `src/components/KnightCharacter.jsx` | Player SVG |
| `src/components/BattleBackground.jsx` | 3-layer background: sky gradient, sun (CSS), hills (SVG anchored to bottom) |
| `src/components/BattleIntro.jsx` | Sword emoji slam-in animation on battle start |
| `src/components/HPBar.jsx` | HP bar component |
| `src/components/AnswerButton.jsx` | Answer button with idle/correct/wrong states |
| `scripts/bump-version.js` | Increments patch version in package.json before each build |
| `CLAUDE.md` | This file — always loaded by Claude Code |

---

## Campaign config (`campaign.config.js`)

```
export const DEBUG = false   // ← true = 1 HP enemies, 1 battle/world (fast test)
```

Each world entry shape:
```js
{
  id, name, icon,
  battles,       // number of fights in this world
  playerHP,      // hits before death (3 = gold/silver/bronze possible)
  enemy: { id, name, hp },   // id: goblin|skeleton|orc|darkKnight|dragon
  timer,         // null = unlimited | 8 = 8s/question (miss = damage)
  multipliers,   // times-tables for left factor  a × b
  factorRange,   // [min, max] for right factor (e.g. [1,5] = easier)
}
```

DEBUG config is auto-derived from PRODUCTION (`battles:1, enemy.hp:1`) — only one flag to flip.

---

## World table (production)

| # | World | Enemy | HP | Timer | Multipliers |
|---|-------|-------|----|-------|-------------|
| 0 | Forest 🌲 | Goblin | 4 | — | 2,3,4 |
| 1 | Swamp 🌿 | Skeleton | 5 | — | 2–6 |
| 2 | Mountains ⛰️ | Orc | 6 | — | 3–8 |
| 3 | Castle 🏰 | Dark Knight | 6 | 8s | 6–9 |
| 4 | Dragon Lair 🐉 | Dragon | 7 | 5s | 1–10 |

---

## Architecture

### Run state (localStorage key: `numknight_run`)
```js
{ worldIndex, battleIndex, trophies[] }
// trophies: 'gold'|'silver'|'bronze' — one per completed battle
```
- Victory when `trophies.length >= sum of all worlds' battles`
- Death (playerHP → 0) → game over → full reset

### Trophy logic
- 0 mistakes → gold, 1 → silver, 2 → bronze, 3 hits → dead

### Multiplier system
- Each world has an explicit `multipliers` array in the config
- `makeRound(multipliers, factorRange)` picks `a` from the array, `b` from factorRange

### Timer mechanic (Castle / Dragon Lair)
- Countdown starts after intro; resets on each new round
- Expiry = wrong answer (highlights correct button, deals damage)
- Visual: draining bar green→amber→red + seconds label inside problem card

### Screen flow
```
battle → result (won)  → next battle / next world / victory
       → result (lost) → game over → restart from world 0
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
- Full campaign implementation (all 5 worlds, 3 battles each)
- All 5 enemy character SVGs
- Trophy result screen with `CONTINUE →`
- Background clipping fixes (sun always visible, hills always at bottom)
- DEBUG/prod config flag
- Version auto-bump on build
