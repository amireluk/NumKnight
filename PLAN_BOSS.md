# Dragon Boss Mechanic — Design Plan

## Core Concept
The dragon behaves differently from every other enemy. You cannot simply answer correctly to deal damage — the dragon is protected by a magical **scale-shield**. You must crack it first.

---

## Mechanic: 2-Hit Streak Per HP Point

### Rule
- Correct answer #1 → **shield CRACKS** (absorbs blow — no HP damage)
- Correct answer #2 (in a row) → **shield SHATTERS** → HP drops by 1 → shield resets to FULL
- Any wrong answer → player takes damage as normal + **shield resets to FULL** (even if cracked)

### Why This Works
- Every HP point requires at minimum 2 correct answers in a row
- Mistakes punish doubly: HP loss + losing your crack progress
- On Hard (dragon damage = 3 = instakill), you need perfect 2-streaks with a 5s timer — extremely tense
- Creates a rhythmic "crack → shatter → crack → shatter" loop that feels boss-like

---

## Visual Design

### Shield Aura (on dragon sprite)
- A hexagonal magical barrier overlaid on the dragon body
- **Full shield**: glowing blue, slow pulse, semi-transparent hex
- **Cracked shield**: amber/gold color, faster pulse, visible fracture lines on the hex
- **Shattered**: scales up + fades out (exit animation), then new shield fades in

### Boss Banners (floating text in arena)
- **"SHIELD CRACK!"** — blue/gold text, appears center-arena, fades after ~1s
  - Subtext: "one more!" (hint to player)
- **"SHATTERED!"** — red/orange text, larger, appears when damage lands
  - Subtext: "hit landed!"
- Animations: pop-in scale (0.4→1.15→1), exit slide up + fade

### Screen Flash
- On crack: brief blue-white flash overlay (very subtle)
- On shatter: brief red-orange flash (uses existing `playImpact` sound emphasis)

---

## Implementation Scope

### Files to modify
| File | Change |
|------|--------|
| `src/components/EnemyCharacter.jsx` | Add `DragonShield` component; accept `shieldState` prop |
| `src/screens/BattleScreen.jsx` | Boss streak logic; `BossBanner` component; shield state wiring |
| `src/game/i18n.js` | Crack/shatter banner text in EN + HE |

### New state in BattleScreen
```js
const isBoss = world.enemy.id === 'dragon'
const [shieldStreak, setShieldStreak] = useState(0)          // 0 = full, 1 = cracked
const [shieldState, setShieldState]   = useState(isBoss ? 'full' : null)  // 'full' | 'cracked' | null
const [bossBanner, setBossBanner]     = useState(null)        // 'crack' | 'shatter' | null
```

### handleAnswer flow (correct, boss)
```
streak = 0 → crack:   setStreak(1), setShieldState('cracked'), setBossBanner('crack'), loadNextRound
streak = 1 → shatter: setStreak(0), setShieldState(null) [exit anim], playSwordSwing, HP--, reset shield to 'full' after 700ms
```

### handleAnswer flow (wrong, boss)
```
same as normal (player takes damage) +
if (streak === 1) → setShieldState('full') [crack disappears, shield restores]
setStreak(0)
```

### Timer expiry (boss)
```
same as wrong — reset streak + restore shield to 'full'
```

---

## HP Tuning (no change needed)
- Dragon HP stays at 6 (medium) and 6 (hard)
- Minimum correct answers: 12 (medium, 8s timer) and 12 (hard, 5s timer)
- This is appropriate for a final boss — longer than regular fights but not grinding

---

## Phase 2 (Future, not in this sprint)
- Boss-specific intro banner: "BOSS FIGHT" slide-in (like BattleIntro but different)
- Dragon roar / special sound on shield restore after player mistake
- Shield HP bar (separate small bar showing 0/2 cracks) — visual aid for new players
- Dragon "rage phase" at low HP (speed multiplier on timer? more dramatic animations?)
