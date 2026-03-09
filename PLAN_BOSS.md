# Dragon Boss Mechanic — Design Plan

## Core Concept
The dragon behaves differently from every other enemy. You cannot simply answer correctly to deal damage — the dragon is protected by a magical **scale-shield**. You must crack it first.

---

## Mechanic: 2-Hit Streak Per HP Point ✅ COMPLETE

- Correct answer #1 → **shield CRACKS** (absorbs blow — no HP damage)
- Correct answer #2 (in a row) → **shield SHATTERS** → HP drops by 1 → shield resets to FULL
- Any wrong answer → player takes damage as normal + **shield resets to FULL**

---

## Boss Phase 1 — Shield Mechanic ✅ COMPLETE

- `shieldStreak` state (0 = full, 1 = cracked)
- `shieldState` prop on `EnemyCharacter`: `'full' | 'cracked' | null`
- `bossBanner` state: `'crack' | 'shatter' | null` — floating arena text
- Shield aura: hexagonal overlay, blue pulse (full) → amber + fracture lines (cracked) → shatter exit anim
- Banner text: "SHIELD CRACK!" / "SHATTERED!" — pop-in scale, slide-up exit
- Screen flash: blue-white on crack, red-orange on shatter
- Timer expiry resets streak + restores shield to full (same as wrong answer)

---

## Boss Phase 2 — Boss Polish ✅ COMPLETE

### Boss-specific battle intro banner

**What to build — `BattleScreen.jsx` or new `BossIntro.jsx`:**
- When `world.enemy.id === 'dragon'` and the battle starts, show a special intro overlay **after** the regular `BattleIntro` slide-in completes (or replace it entirely for the boss).
- Overlay covers the full arena for ~2s:
  - Background: dark semi-transparent (`rgba(0,0,0,0.75)`)
  - "⚔ BOSS FIGHT ⚔" in large white bold text — scale in from 0.5→1.1→1 over 0.4s
  - Subtext: "Crack the shield twice to deal damage" in smaller amber text, fades in 0.2s after
  - Whole overlay fades out after 2s
- Set `introPlaying = true` during this window so the timer doesn't start.

### Shield HP bar (crack progress indicator)

**What to build — `BattleScreen.jsx`:**
- A small secondary bar shown only during dragon fights, positioned above or below the enemy HP bar.
- Displays 2 segments (one per crack needed). Filled segment = crack progress.
  - 0 hits: both segments empty (grey outline)
  - 1 hit (cracked): first segment filled amber/gold
- Updates instantly on hit, resets to empty on shatter or wrong answer.
- Label: "SHIELD" in small caps above it.
- Hide for non-dragon enemies.

### Dragon rage phase at low HP

**Trigger:** Dragon HP ≤ 2 (out of 6 on medium / 6 on hard).

**What to build:**
- Set a `raging` boolean when `enemyHP <= 2 && isBoss`.
- While raging:
  - Enemy idle animation intensifies: faster body sway, weapon arm trembling (use existing idle variety but at 2× speed)
  - Arena background pulses darker every 2s (brief overlay flash, `opacity: 0 → 0.15 → 0`, dark red, 1s)
  - Show a one-time banner "DRAGON ENRAGED!" in red — same banner component as crack/shatter
- No timer change (keep timer as is — it's already brutal at 5s hard).

**Files:** `src/screens/BattleScreen.jsx`, `src/components/EnemyCharacter.jsx`

---

## Boss Phase 3 — Audio Cues (entire app) ✅ COMPLETE

All sounds use the Web Audio API pattern already established in `src/game/sounds.js`. No external files. Keep sounds short (< 1s). Classroom-safe — nothing jarring.

Add a **global mute toggle** first, then implement sounds in priority order.

### Mute toggle

- New localStorage key: `numknight_mute` (`'true'` / `'false'`)
- `sounds.js`: export `isMuted()` helper; all `play*` functions check it and early-return if muted.
- UI: small speaker icon button, top-right corner of BattleScreen and WorldMapScreen.
  - Use a simple SVG speaker (on) / speaker-x (off) — inline SVG, no icon library.
  - Clicking toggles `numknight_mute` and updates local state.

### New sounds to add in `sounds.js`

| Export name | Moment | Web Audio recipe |
|-------------|--------|-----------------|
| `playShieldCrack` | Boss shield cracks (hit 1) | Short oscillator burst: sine wave, freq 800→1200 Hz over 0.1s, gain 0.3→0, duration 0.15s |
| `playShieldShatter` | Boss shield shatters (hit 2) | Two overlapping oscillators: 400Hz sawtooth + 600Hz square, both decay 0→0 over 0.3s, gain 0.4 |
| `playShieldRestore` | Shield restores after wrong answer | Sine oscillator, 300→600 Hz rising over 0.4s, gain 0.2 |
| `playTimerTick` | Each second of countdown | Short click: oscillator 1000 Hz, duration 0.05s, gain 0.15 — silent above 5s remaining |
| `playTimerExpiry` | Timer hits 0 | Sawtooth 200 Hz, gain 0.5→0 over 0.4s (buzzer feel) |
| `playTrophyReveal` | Trophy shown on ResultScreen | Gold: sine 523→659→784 Hz arpeggiated (3 notes, 0.1s each). Silver/bronze: just first 2 notes |
| `playAreaCleared` | AreaClearedScreen appears | Same as victory but 2× duration — 4 ascending notes |
| `playMapTap` | Tapping a world node on map | Soft thud: sine 150 Hz, duration 0.08s, gain 0.3 |
| `playMapLocked` | Tapping a locked node | Low bonk: sine 100 Hz, duration 0.12s, slight pitch drop, gain 0.25 |

### Where to call them

| Sound | File | Trigger point |
|-------|------|--------------|
| `playShieldCrack` | `BattleScreen.jsx` | When `setBossBanner('crack')` fires |
| `playShieldShatter` | `BattleScreen.jsx` | When `setBossBanner('shatter')` fires |
| `playShieldRestore` | `BattleScreen.jsx` | When shield resets on wrong answer (boss only) |
| `playTimerTick` | `BattleScreen.jsx` | In the timer `setInterval`, when `timeLeft` decrements and `timeLeft <= 5` |
| `playTimerExpiry` | `BattleScreen.jsx` | When `timeLeft === 0` triggers damage |
| `playTrophyReveal` | `ResultScreen.jsx` | When trophy appears (pass trophy grade to pick note count) |
| `playAreaCleared` | `AreaClearedScreen.jsx` | On mount |
| `playMapTap` | `WorldMapScreen.jsx` | On unlocked node tap/click |
| `playMapLocked` | `WorldMapScreen.jsx` | On locked node tap/click |

---

## Boss Phase 4 — Visual Overhaul 🚫 OUT OF SCOPE
