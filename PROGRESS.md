# NumKnight — Progress Tracker

> Update this file at the end of each session.
> Last updated: 2026-02-27

---

## Phase 0 — Project Setup ✅ COMPLETE

- [x] Verify Node.js and npm are installed (Node 22, npm 11)
- [x] Scaffold project with Vite + React inside `/NumKnight`
- [x] Install dependencies: Tailwind CSS, Framer Motion
- [x] Configure Tailwind + PostCSS
- [x] Set up folder structure (components, screens, game)
- [ ] Push initial scaffold to GitHub ← _pending, do at end of next session_
- [ ] Confirm app runs on mobile browser via local network ← _not yet tested_

---

## Phase 1 — Core Battle Loop ✅ COMPLETE

- [x] BattleScreen layout — knight side, enemy side, HP bars, problem area, answer buttons
- [x] Problem generator — random multiplication from table range
- [x] Distractor generator — 3 smart wrong answers near correct answer
- [x] Answer handling — correct/wrong tap updates HP
- [x] Battle end detection — win/lose after HP hits 0
- [x] Basic animations — knight attack, enemy attack (Framer Motion), HP bar decrease
- [x] Win/Lose screen — ResultScreen with star rating and Play Again
- [x] Combo mechanic — every 3rd correct answer = power strike (double damage)

**Milestone reached:** Full battle is playable end to end. ✅

---

## Phase 2 — World & Enemy Variety 🔄 IN PROGRESS

- [x] World config file — all 4 worlds defined (tableRange, playerHP, enemyHP, enemies)
- [x] Knight design — SVG knight with armor, sword, shield, plume
- [x] Goblin enemy — SVG goblin with animations
- [ ] All enemy designs — Slime, Orc, Troll, Dark Knight, Wizard, Dragon
- [ ] HP scaling per world — wired up correctly per world (7/6/5/4)
- [ ] Enemy attack animations — unique feel per enemy type
- [ ] Battle entry screen — show enemy name and world before battle starts

**Milestone:** Each world feels different, enemies have personality.

---

## Phase 3 — Campaign Map ⏳ PENDING

- [ ] MapScreen layout — scrollable map with battle nodes
- [ ] World sections — 4 visually distinct world zones
- [ ] Node states — locked / unlocked / completed (with star display)
- [ ] Unlock logic — completing a battle unlocks the next node
- [ ] Navigation — tap node → battle → result → back to map
- [ ] Home screen — title screen with "Play" button

---

## Phase 4 — Rewards & Polish ⏳ PENDING

- [ ] Coin reward — earn coins on win, display total
- [ ] Item drops — unlock cosmetic items
- [ ] Knight customization — equip unlocked items
- [ ] Sound effects — sword swing, hit, level up, wrong answer
- [ ] Screen transitions — smooth page transitions
- [ ] Mobile UX pass — touch targets, layout on small screens
- [ ] PWA setup — manifest.json + service worker for home screen install

---

## Phase 5 — Future / Optional ⏳ OUT OF SCOPE FOR V1

- [ ] localStorage persistence
- [ ] Timer / Hard Mode toggle
- [ ] More math operations
- [ ] Additional game modes
- [ ] Parent dashboard
- [ ] Background music

---

## Notes

- App runs on `npm run dev` → `http://localhost:5173`
- For mobile testing: `npm run dev -- --host` → open Network URL on phone
- No backend at any phase — pure frontend
- GitHub repo: https://github.com/amireluk/NumKnight
