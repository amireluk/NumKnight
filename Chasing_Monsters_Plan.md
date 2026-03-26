# Chasing Monsters — Implementation Plan

## Behaviour summary

```
knight strolls right→left (or left→right) at normal speed
  │
  reaches edge
  │
  ├── 2/3 chance → pause 0.4s, turn around, resume normal stroll
  │
  └── 1/3 chance → CHASE BEGINS
        │
        ├── knight turns around, flees at 2× stroll speed to far edge
        ├── monster spawns 80px behind knight at origin edge
        ├── monster chases at 2× + ~14% extra (closes gap slowly)
        ├── monster cycles idle↔attack sprite every 0.8–1.6s
        ├── when gap < 35px → monster pauses 0.5s with 'hit' sprite (once per chase)
        │                   → knight kept moving → gap reopens → chase resumes
        └── knight reaches far edge → monster despawns → knight resumes normal stroll
```

---

## Speed values

| | Speed | Notes |
|---|---|---|
| Normal stroll | 36px/s | unchanged |
| Knight fleeing | 72px/s | 2× stroll |
| Monster chasing | 82px/s | ~14% faster than knight → closes ~35px over full crossing |
| Monster spawn offset | 80px behind knight | just off-screen at origin edge |

Gap closes from 80px → ~43px during a full screen crossing — enough to trigger the hit-pause once mid-chase.

---

## Terrain-following motion

Both knight and monster share the same `groundBottom()` terrain curve already used by `StrollingKnight`. Each has its own `motionX` MotionValue; `bottom` is derived via `useTransform`:

```js
const bottom = useTransform(motionX, (x) => groundBottom(x, containerW))
// applied as: style={{ bottom }}
```

This gives both characters the subtle hill rise/fall across the screen — no separate oscillation needed.

---

## Sprite phases

| Character | Normal chase | Too-close pause |
|-----------|-------------|-----------------|
| Knight | `'idle'` throughout | — |
| Monster | cycles `'idle'` ↔ `'attack'` every 0.8–1.6s | `'hit'` for 0.5s |

The hit-pause fires **once per chase only** — a `pauseUsed` ref prevents re-triggering if the gap closes again after the pause.

---

## Too-close pause mechanic

- Track gap with `useMotionValueEvent` on both `monsterX` and `knightX`
- When gap drops below 35px:
  1. Pause monster animation (`monsterAnim.stop()`)
  2. Set monster phase → `'hit'`
  3. After 0.5s: set phase → `'idle'`, resume chase animation from current position
  4. Set `pauseUsed = true` — no further pauses this chase
- Knight keeps moving during the pause → gap naturally reopens

---

## Monster type by difficulty

| Difficulty | Enemy |
|------------|-------|
| easy | goblin |
| medium | orc |
| hard | darkKnight |

---

## Full state machine

```
STROLLING
  animate to far edge at 36px/s
  → reach edge:
      roll Math.random()
      ≥ 0.67 → pause 0.4s → STROLLING (reverse direction)
      < 0.67 → CHASE

FLEEING (knight state during chase)
  animate to far edge at 72px/s
  → reach far edge → STROLLING (reverse direction, normal speed)

MONSTER LIFECYCLE
  spawn: motionX = knightX − 80px (or + 80px depending on direction)
  animate toward far edge at 82px/s
  every 0.8–1.6s: toggle phase idle↔attack
  gap < 35px (once): pause 0.5s with 'hit' sprite, resume
  → knight reaches far edge: cancel animation, despawn (set chaseActive = false)
```

---

## Component design

### New export: `KingdomCreatures`

Lives in `src/components/KingdomScenery.jsx`. Replaces `<StrollingKnight>` in all kingdom-scenery screens.

```jsx
<KingdomCreatures difficulty="medium" useRaster={false} />
```

Props:
- `difficulty` — determines monster type
- `useRaster` — passed through for any size/scale adjustments

Internal state:
```js
const knightX       = useMotionValue(20)
const monsterX      = useMotionValue(-80)
const [chaseActive, setChaseActive]   = useState(false)
const [chaseDir, setChaseDir]         = useState('right')  // direction of the chase
const [facingRight, setFacingRight]   = useState(true)
const [monsterPhase, setMonsterPhase] = useState('idle')
const pauseUsed = useRef(false)
```

`StrollingKnight` becomes an internal helper — no longer exported.

### Monster rendering

Uses `EnemyCharacter` at the same `scale(0.32)` as the knight, flipped to face the chase direction. Positioned with `position: absolute, bottom: monsterBottom, left: monsterX`.

---

## Files to change

| File | Change |
|------|--------|
| `src/components/KingdomScenery.jsx` | Add `KingdomCreatures`, refactor stroll loop into chase-aware loop, add monster rendering |
| `src/screens/StartScreen.jsx` | Replace `<StrollingKnight>` with `<KingdomCreatures>` |
| `src/screens/OptionsScreen.jsx` | Same |
| `src/screens/PracticePickerScreen.jsx` | Same |
| `src/screens/PracticeEndScreen.jsx` | Same |
| `src/screens/StatsScreen.jsx` | Same |
| `src/screens/NameEntryScreen.jsx` | Same (new screen added in recent App changes) |

No new files needed.
