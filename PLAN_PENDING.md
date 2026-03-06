# NumKnight — Pending Work Plan

## A — World Map Screen (`WorldMapScreen.jsx`)

| # | Change |
|---|--------|
| A1 | **Reverse render order** — Dragon Lair at top, Forest at bottom. Display index `di` maps to world index `worlds.length-1-di`. All selection/click logic stays on world index. |
| A2 | **Remove region emoji** — strip `world.icon` from the left content area of each band |
| A3 | **Remove timer indicator** — remove the "Xs / question" sub-label |
| A4 | **Locked areas** — remove "PATH NOT UNLOCKED" text from info strip; keep dark overlay |
| A5 | **Bigger icons** — lock emoji 18→28px, medal emoji 22→28px |
| A6 | **Remove knight helmet** — delete `KnightHelmet` component and all `isKnight`/`knightPos` state and logic |
| A7 | **Cleared indicator** — absolute SVG overlay on completed bands: two thick red diagonal lines forming an X across the full band |

---

## B — Scoring & Leaderboard

Score entry shape: `{ name, score, date, endWorld, cleared }`

| # | Change | Files |
|---|--------|-------|
| B1 | **Score on death, keep result screen** — result screen stays on loss; add a button that navigates to the leaderboard after. Leaderboard receives `{ totalScore, endWorld: world.name, cleared: false }`. On victory, already goes to leaderboard with `cleared: true`. | `App.jsx`, `ResultScreen.jsx` |
| B2 | **Cap at 10 entries** | `scoreState.js` |
| B3+B4 | **Region column** — leaderboard table shows the world where the run ended. If `cleared === true`, show **"CONQUERED"** in gold. If `cleared === false`, show `endWorld` name in muted color. No separate icon column. | `LeaderboardScreen.jsx` |
| B5 | **Comma-format scores** — all displayed numbers use `.toLocaleString()` | `LeaderboardScreen.jsx`, `AreaClearedScreen.jsx` |
| B6 | **New high score highlight** — if score qualifies for top 10, pulse/animate the name-entry card | `LeaderboardScreen.jsx` |

---

## C — Start Screen (new `StartScreen.jsx`)

| # | Change |
|---|--------|
| C1 | New screen shown on first launch and after restart: name input (pre-filled from `localStorage`) + Easy / Medium / Hard difficulty picker + "START ADVENTURE" button |
| C2 | Difficulty becomes **runtime state** in `App.jsx` — derive `worlds = {easy:EASY, medium:MEDIUM, hard:HARD}[difficulty]` instead of compile-time constant |
| C3 | Player name persisted to `localStorage` key `numknight_player_name` (same key already used by leaderboard) |

---

## D — Battle Intro (`BattleIntro.jsx`)

| # | Change |
|---|--------|
| D1 | Add `isFinal` prop (passed from `BattleScreen` when `battleIndex === world.battles - 1`) |
| D2 | On final battle: after "ROUND N" slams in and holds, slam in "FINAL ROUND" text below it with the same animation. Then both burst out together. Sequence: ROUND N in → 100ms → FINAL ROUND in → 200ms → both burst out |

---

## E — Battle Screen (`BattleScreen.jsx`)

| # | Change |
|---|--------|
| E1 | **Bug: stop timer on enemy death** — timer interval keeps running when `phase === 'won'`. Guard the interval so it clears immediately when phase transitions to `'won'` or `'lost'`. |
| E2 | **Fix time bonus formula** — current: `Math.floor(timeLeft * 10)`. Fix: `Math.floor((timeLeft / world.timer) * 50)`. Percentage-based so all timer worlds are equally weighted (50% time left = 25 pts regardless of timer length). |
| E3 | **Split score display in TrophyOverlay** — show base score and time bonus on separate lines. Only show bonus line if `timeBonus > 0`. Pass `baseScore` and `timeBonus` as separate props. |
| E4 | **Overlay region/round text on arena** — remove the "campaign position strip" div between arena and problem card. Replace with an absolute-positioned overlay at the top of the arena (world name left, "Round X / Y" right). Arena gains the freed height → bigger fight scene. |

---

## F — Area Cleared Screen (`AreaClearedScreen.jsx`)

| # | Change |
|---|--------|
| F1 | Rename "WORLD SCORE" label to `{world.name} Score` |
| F2 | Add total accumulated score display (passed as new `totalScore` prop from `App.jsx`) |
| F3 | **Animated score transfer** — battle score counts up from 0 → holds → counts down to 0 while total score counts up by the same amount. Two counters: "Battle Score" and "Total Score". CONTINUE button appears after transfer completes. |

---

## Suggested implementation order

```
C  (Start screen)      — changes difficulty plumbing everything else depends on
E  (Battle fixes)      — bug fix + layout, self-contained
D  (Intro)             — small, self-contained
A  (Map)               — self-contained
F  (Area Cleared)      — needs totalScore prop wired from App
B  (Leaderboard)       — needs endWorld + cleared wired from App
```
