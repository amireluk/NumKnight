# NumKnight — Fine-Grained Pending Tasks

> These are detailed task lists for features not yet confirmed complete.
> Phases 1–4 are done — see PROGRESS.md. Phases 5–6 are pending.

---

## Phase GA — Google Analytics

> Goal: Understand how players actually use the game — which difficulties they pick, where they quit, how far they get.

### How it works with Firebase
Since Phase 6 uses Firebase, GA comes via `firebase/analytics` (not a separate `gtag.js` snippet). Both share one Firebase project. Setup order: create Firebase project → link a GA4 property to it → enable Analytics in the app.

### PGA-A: Setup (done alongside Phase 6 Firebase setup)
- [ ] Create Firebase project at console.firebase.google.com
- [ ] Enable Google Analytics when prompted (links a GA4 property automatically)
- [ ] Add `firebase/analytics` import to `src/game/firebase.js`

### PGA-B: Automatic events (free, no code)
GA4 tracks these out of the box: page views, session start, session duration, browser/device info.

### PGA-C: Custom game events
- [ ] `difficulty_selected` — `{ difficulty: 'easy'|'medium'|'hard', lang: 'en'|'he' }`
- [ ] `battle_started` — `{ difficulty, worldIndex, battleIndex, enemyId }`
- [ ] `battle_won` — `{ difficulty, worldIndex, battleIndex, trophy, score }`
- [ ] `battle_lost` — `{ difficulty, worldIndex, battleIndex }`
- [ ] `run_completed` — `{ difficulty, totalScore, worldsCleared }`
- [ ] `practice_started` — `{ numbers: [3,7,8] }`
- [ ] `practice_ended` — `{ numbers, correct, total: 20 }`

### PGA-D: Shared helper
- [ ] Create `src/game/analytics.js` — thin wrapper: `trackEvent(name, params)` that calls Firebase `logEvent()` and no-ops silently in dev

### Notes
- No user PII — player names are NOT sent to GA (keep it COPPA-safe for kids)
- GA is aggregate only; individual player scores go in Firestore (Phase 6), not GA

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

## Phase 6 — Backend Leaderboard (Firebase + Firestore)

### Stack
- **Firebase** (Google) — Firestore database + Firebase Analytics (GA4)
- Security via **Firestore Security Rules** — the API key is public in client JS by design; rules enforce what anyone can do with it
- No backend server needed — all calls are direct from the browser to Firestore's REST API

### Security rules (to be set in Firebase console)
```
allow read: if true;                          // leaderboard is public
allow create: if request.resource.data.keys()
  .hasOnly(['name','totalScore','worldsCleared','difficulty','date']);
allow update, delete: if false;               // nobody can touch existing rows
```
This prevents: using your DB for other apps, writing garbage schema, modifying other players' scores.

### P6-A: Firebase setup
- [ ] Create Firebase project at console.firebase.google.com (enable Analytics here too — see Phase GA)
- [ ] Create Firestore database in production mode
- [ ] Add `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID` etc. to `.env`
- [ ] Install `firebase` npm package

### P6-B: Firebase module
- [ ] Create `src/game/firebase.js` — initialise app, export `db` (Firestore) and `analytics`

### P6-C: API module
- [ ] Create `src/game/api.js` with `submitScore(entry)` and `fetchLeaderboard(limit)`
- [ ] Fire-and-forget submit (non-blocking)
- [ ] Offline fallback: if fetch fails, silently use local scores

### P6-D: Leaderboard screen update
- [ ] Fetch global scores on mount
- [ ] Show loading state while fetching
- [ ] Highlight player's just-submitted row

---

## Phase 7 — Per-Number Statistics

> Goal: Give players (especially kids) visibility into which multiplication tables they know well vs. struggle with. Feeds a rating shown in the practice number picker as a recommendation — does NOT affect question selection in any mode.

---

### Data model (`localStorage` key: `numknight_stats`)

```js
{
  players: [
    {
      name: "Alice",          // matched to playerName in App state
      lastUsed: 1234567890,   // timestamp — used to evict oldest when > 5 players
      numbers: {
        "1": { results: [{ success: bool, timeMs: number }, ...] }, // max 40 entries (rolling)
        "2": { results: [...] },
        // ... "3" through "9"
      }
    },
    // up to 5 players — when a 6th appears, evict the one with oldest lastUsed
  ]
}
```

**Result entry shape:**
- `success: true` — answered correctly on the **first attempt**
- `success: false` — wrong on first attempt, OR timer expired (campaign)
- `timeMs: number` — milliseconds from question display to first answer (or timer expiry)

**Per-question recording:**
For question `a × b`, record the **same result** to **both** `numbers[a]` and `numbers[b]`.
Exception: if `a === b`, record only once.

---

### Hidden response timer

A hidden timer starts when each question is rendered and stops on the player's **first** interaction (button tap or timer expiry). This runs in both practice mode and campaign battles.

- In practice: start timing when `phase` becomes `'idle'` and new question is set; stop on first `handleAnswer` call regardless of correctness.
- In campaign: same — start on question render, stop on first answer or timer expiry.
- Timer expiry in campaign counts as `success: false, timeMs: world.timer * 1000`.

---

### Recording events

Stats are recorded at two call sites:

| Screen | Trigger | What to record |
|--------|---------|----------------|
| `PracticeBattleScreen` | First answer to each question | `success = isCorrect`, `timeMs = elapsed` |
| `BattleScreen` | First answer or timer expiry | `success = isCorrect && firstAttempt`, `timeMs = elapsed or timerExpiry` |

Both pass `{ a, b, success, timeMs }` to a shared `recordResult(playerName, a, b, success, timeMs)` helper in `src/game/statsState.js`.

---

### `src/game/statsState.js` (new file)

```js
export const STATS_KEY = 'numknight_stats'
const MAX_PLAYERS = 5
const MAX_RESULTS = 40

export function recordResult(playerName, a, b, success, timeMs) { ... }
export function loadPlayerStats(playerName) { ... }   // returns numbers map or empty
export function computeNumberRating(results) { ... }  // returns { pct, medianMs, rating }
export function loadAllPlayerNames() { ... }          // returns string[] of known names
```

**`computeNumberRating(results)`** — called per-number to produce the stats page display and picker badge:
```
pct      = successCount / results.length  (0–1)
medianMs = median of ALL timeMs values (including failures — reflects hesitation)
rating   = pct * 0.6  +  (1 - clamp(medianMs, 500, 4000) / 4000) * 0.4
           → 0.0 = needs most work, 1.0 = mastered
```

Rating bands for UI:
| Rating | Label | Color |
|--------|-------|-------|
| < 0.40 | Needs work | Red `#f87171` |
| 0.40–0.69 | Getting there | Amber `#fbbf24` |
| ≥ 0.70 | Strong | Green `#4ade80` |

---

### Statistics screen (`src/screens/StatsScreen.jsx`)

Accessible from the **Start Screen** (new button, below HALL OF FAME, same solid yellow style).

Layout:
- Same kingdom scenery background as start/options/picker
- Title: "YOUR NUMBERS" (EN) / "המספרים שלך" (HE)
- Shows player name at top (current `playerName` from App state)
- 3×3 grid (numbers 1–9), each cell shows:
  - The number (large)
  - Success % (e.g. "73%")
  - Median time (e.g. "1.4s")
  - Color tint based on rating band
  - If < 10 results: show "Not enough data" / dim cell
- Below the grid: note explaining what the rating means

---

### Practice picker enhancement

Each number button in `PracticePickerScreen` gets a small **colored dot** (bottom-right corner of button) indicating rating band:
- Red / Amber / Green dot
- No dot if < 5 results for that number
- Tooltip/label NOT shown (keeps UI clean — color is enough)
- A legend line below the grid: `● needs work  ● getting there  ● strong` (EN) / same in HE

---

### i18n additions

```js
// EN
statsTitle: 'YOUR NUMBERS',
statsSubtitle: (name) => name ? `${name}'s progress` : 'Your progress',
statsNotEnoughData: 'Play more to see stats',
statsMedianTime: (s) => `${s}s avg`,
statsRatingNeedsWork: 'Needs work',
statsRatingGettingThere: 'Getting there',
statsRatingStrong: 'Strong',

// HE
statsTitle: 'המספרים שלך',
statsSubtitle: (name) => name ? `ההתקדמות של ${name}` : 'ההתקדמות שלך',
statsNotEnoughData: 'שחק עוד כדי לראות סטטיסטיקות',
statsMedianTime: (s) => `${s}שנ בממוצע`,
statsRatingNeedsWork: 'צריך תרגול',
statsRatingGettingThere: 'בדרך הנכונה',
statsRatingStrong: 'חזק',
```

---

### Implementation checklist

- [ ] **P7-A** — `src/game/statsState.js`: `recordResult`, `loadPlayerStats`, `computeNumberRating`, `loadAllPlayerNames`
- [ ] **P7-B** — Hidden timer in `PracticeBattleScreen` — start on question render, stop on first tap
- [ ] **P7-C** — Hidden timer in `BattleScreen` — same, plus timer-expiry = failure with `timeMs = timer * 1000`
- [ ] **P7-D** — Call `recordResult` in both screens after first answer
- [ ] **P7-E** — `src/screens/StatsScreen.jsx` — 3×3 grid with rating tints, % and median time per number
- [ ] **P7-F** — Add stats button to `StartScreen` + route in `App.jsx`
- [ ] **P7-G** — Rating dots on number buttons in `PracticePickerScreen`
- [ ] **P7-H** — i18n strings in `i18n.js` (EN + HE)
- [ ] **P7-I** — Document in `CLAUDE.md` key files table

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
