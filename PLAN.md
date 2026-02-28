# NumKnight — Execution Plan

## Overview

Build NumKnight in vertical slices — each phase delivers something fully playable, not just a collection of half-finished pieces. By the end of Phase 1 you can already play a real battle. Each phase adds a layer on top.

---

## Phase 0 — Project Setup

- [ ] Verify Node.js and npm are installed
- [ ] Scaffold project with Vite + React template inside `/NumKnight`
- [ ] Install dependencies: Tailwind CSS, Framer Motion
- [ ] Configure Tailwind
- [ ] Set up folder structure (see below)
- [ ] Push initial scaffold to GitHub
- [ ] Confirm app runs locally on mobile browser via local network

### Folder Structure
```
src/
  components/       # Reusable UI components (HP bar, answer button, etc.)
  screens/          # Full screens (HomeScreen, MapScreen, BattleScreen, ResultScreen)
  game/             # Pure logic (problem generator, distractor generator, world config)
  assets/           # SVGs, any static art
  App.jsx
  main.jsx
```

---

## Phase 1 — Core Battle Loop (Playable MVP)

Goal: A single battle is fully playable end to end.

- [ ] **BattleScreen layout** — knight side, enemy side, HP bars, problem area, answer buttons
- [ ] **Problem generator** — randomly pick a multiplication problem from a given table range
- [ ] **Distractor generator** — generate 3 smart wrong answers near the correct answer
- [ ] **Answer handling** — detect correct/wrong tap, update HP accordingly
- [ ] **Battle end detection** — check win/lose condition after each answer
- [ ] **Basic animations** — knight attack, enemy attack, HP bar decrease (Framer Motion)
- [ ] **Win/Lose screen** — simple result screen with "Try Again" and star rating display
- [ ] **Combo mechanic** — track 3-in-a-row correct answers, trigger power strike

Milestone: You can fight a full battle, see animations, and reach a win/lose screen.

---

## Phase 2 — World & Enemy Variety

Goal: Multiple enemies and worlds with correct difficulty scaling.

- [ ] **World config file** — define all 4 worlds (table range, player HP, enemy HP, enemy list)
- [ ] **Enemy designs** — CSS/SVG characters for: Slime, Goblin, Orc, Troll, Dark Knight, Wizard, Dragon
- [ ] **Knight design** — CSS/SVG player character
- [ ] **HP scaling per world** — player HP varies by world (7/6/5/4), enemy always 5
- [ ] **Enemy attack animations** — unique feel per enemy type (at least 2–3 variants)
- [ ] **Battle entry screen** — show enemy name and world name before battle starts

### Phase 2 Polish (in progress)

- [x] **Character art redesign** — Knight and Goblin redrawn in cel-shaded cartoon style with reference art
- [x] **Split SVG weapon animations** — sword/club swing via motion.div overlay (reliable cross-browser)
- [x] **Impact splash** — starburst on hit character at moment of impact, sequenced with attacker lunge
- [x] **Combat clarity** — hitKey prop separates attack animation (0ms) from recoil+splash (280ms)
- [x] **Side HP bars** — vertical discrete cell bars flanking characters
- [x] **Single-file build** — vite-plugin-singlefile produces one deployable index.html
- [ ] **Battle background** — rolling hills at midday, low-saturation SVG behind characters
- [ ] **Battle intro sequence** — fighting-game style: characters slide in, ⚔️ banner, UI reveals with stagger
- [ ] **Result screen redesign** — win: podium + confetti; lose: gravestone + red vignette

Milestone: Each world feels different, enemies have personality.

---

## Phase 3 — Campaign Map

Goal: A navigable world map that ties battles together.

- [ ] **MapScreen layout** — scrollable map with battle nodes
- [ ] **World sections** — 4 visually distinct world zones on the map
- [ ] **Node states** — locked, unlocked, completed (with star display)
- [ ] **Unlock logic** — completing a battle unlocks the next node (in-memory only, resets on restart)
- [ ] **Navigation** — tap a node → enter battle → return to map on finish
- [ ] **Home screen** — simple title screen with "Play" button leading to the map

Milestone: The full game loop exists — home → map → battle → result → map.

---

## Phase 4 — Rewards & Polish

Goal: Make it feel rewarding and fun to replay.

- [ ] **Coin reward** — earn coins on battle win, display total
- [ ] **Item drops** — unlock cosmetic items (armor pieces, sword styles)
- [ ] **Knight customization** — simple equip screen or auto-apply unlocked items
- [ ] **Sound effects** — sword swing, hit, level up, wrong answer (simple beeps or free SFX)
- [ ] **Screen transitions** — smooth page transitions between screens (Framer Motion)
- [ ] **Mobile UX pass** — ensure all touch targets are large enough, no layout issues on small screens
- [ ] **PWA setup** — add manifest.json and service worker so it can be added to home screen

Milestone: The app feels complete and polished. Worth showing off.

---

## Phase 5 — Optional / Future

These are explicitly out of scope for v1 but documented for future reference:

- [ ] localStorage persistence (save progress across sessions)
- [ ] Timer mode / Hard Mode toggle
- [ ] More math operations (addition, subtraction, division)
- [ ] Additional game modes beyond Knight Battle
- [ ] Parent dashboard / progress tracking
- [ ] Background music

---

## Development Notes

- **Start each session** by reviewing where Phase 1–4 progress stands
- **Test on mobile** frequently — open `http://[your-local-ip]:5173` on your phone during dev
- **No backend needed** at any phase — everything is client-side
- **Commit to GitHub** at the end of each phase milestone
