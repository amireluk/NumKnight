# NumKnight — Design Document

## Motivation

Many kids in 2nd and 3rd grade struggle to internalize multiplication tables because traditional practice (worksheets, flashcards) is repetitive and demotivating. NumKnight aims to make that practice feel like play — wrapping math problems inside a battle game so kids are engaged without feeling like they're doing homework.

The app is a home project built for a single young user, with the potential to expand into a more complete math learning platform over time.

---

## Target Audience

- **Primary user:** Children in 2nd–3rd grade (~7–9 years old)
- **Device:** Phone or tablet (touch-first design)
- **Context:** Short play sessions, casual, no account or login required

---

## App Concept

NumKnight is a mobile-friendly browser app where a child practices multiplication by fighting enemies as a knight. Each battle is a series of multiplication problems presented as multiple-choice questions. Correct answers make the knight attack; wrong answers let the enemy strike back. Progress through worlds unlocks harder multiplication tables.

---

## Game Structure

### Campaign Map
- A scrollable world map with battle nodes (Candy Crush style)
- Worlds are grouped by multiplication difficulty
- Completing a battle unlocks the next node
- Completing a world unlocks the next world

### Worlds & Difficulty

| World | Tables Covered | Player HP | Enemy HP | Enemy Theme |
|-------|---------------|-----------|----------|-------------|
| Forest | 1–3 | 7 | 5 | Slimes, Goblins |
| Mountains | 4–6 | 6 | 5 | Orcs, Trolls |
| Castle | 7–9 | 5 | 5 | Dark Knights, Wizards |
| Dragon's Lair | Full 10×10 | 4 | 5 | Dragon |

Easier worlds give the player more HP so beginners can make mistakes and still win, building confidence before difficulty ramps up.

---

## Battle Mechanics

### Core Loop
1. A multiplication problem is displayed (e.g. **6 × 7 = ?**)
2. Four large answer buttons are shown
3. The player taps one answer
4. **Correct answer** → knight attacks, enemy loses 1 HP
5. **Wrong answer** → enemy attacks, player loses 1 HP
6. Next problem loads immediately
7. Battle ends when either side reaches 0 HP

### Answer Choices
- Always 4 options
- One correct answer
- Three **smart distractors** — numbers close to the correct answer or common mistakes (e.g. adjacent table values), not random noise
- Buttons are large and touch-friendly

### HP & Battle Length
- Enemy always has 5 HP → a perfect run requires exactly 5 correct answers
- A battle lasts at most 9 rounds (5 hits + 4 misses before someone dies)
- Battles feel quick and snappy, encouraging replays

### Feedback & Animations
- Correct answer: knight sword-swing animation, enemy flinches
- Wrong answer: enemy attack animation, knight takes damage
- Combo mechanic: 3 correct answers in a row = power strike (double damage, special animation)
- Win screen: celebration with star rating
- Lose screen: "Try Again" — no permanent failure, always encourages retry

### Star Rating (post-battle)
- 3 stars: won with no mistakes
- 2 stars: won with 1–2 mistakes
- 1 star: barely won

### Rewards
- Coins or item drops after each battle win (cosmetic, e.g. new shield color, armor piece)
- Motivates replaying battles for better stars

---

## Problems & Difficulty Generation

- Problems are randomly selected from the current world's table range
- No time limit in v1 (optional timer may be added later as a "Hard Mode" toggle)
- The goal for v1 is accuracy only — no pressure, no rushing

---

## Art & Visual Style

- CSS + SVG + emoji based — no external image assets required for v1
- Clean, colorful, mobile-optimized UI
- Knight and enemy characters built from CSS/SVG shapes
- HP bars, battle animations, and transitions handled in code
- If real illustrated assets are desired later, free RPG sprite packs (e.g. from itch.io) can be integrated

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React (Vite) | Component-based UI, fast dev setup, no backend needed |
| Styling | Tailwind CSS | Utility-first, great for rapid mobile-first UI |
| Animations | Framer Motion | Smooth declarative animations for game feel |
| Runtime | Browser (PWA-ready) | Works on any phone/tablet, can be added to home screen |
| Persistence | None (v1) | No login, no save state — resets on restart |
| Backend | None | Pure frontend, zero server complexity |

---

## Scope & Constraints

- Home project, not intended for public release
- Single user, no accounts, no backend
- v1 has no persistence — progress resets on app restart
- v1 has no timer — wrong/correct answers only
- Focus is on getting the core battle loop fun and polished before adding more games or features

---

## Future Ideas (Out of Scope for v1)

- Save progress (localStorage)
- Timer mode / Hard Mode
- More math operations: addition, subtraction, division
- More games beyond Knight Battle
- Multiplayer or parent dashboard
- Sound effects and background music
- Leaderboard or personal best tracking
