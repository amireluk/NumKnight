# ⚔️ NumKnight

A mobile-first multiplication battle game for kids in 2nd–3rd grade. Fight enemies by solving multiplication problems — get it right and your knight attacks, get it wrong and the enemy strikes back!

## What is this?

NumKnight wraps multiplication table practice inside an RPG battle game. Kids progress through 5 worlds of increasing difficulty, facing new enemies and harder math as they go. Score points, earn trophies, and climb the leaderboard.

## Features

- ⚔️ Knight vs enemy battles driven by multiplication questions
- 4 answer choices per question (smart distractors, not random)
- HP system — correct answers damage the enemy, wrong answers hurt you
- Trophy rating per battle (gold / silver / bronze based on mistakes)
- 5 worlds with unique enemies, backgrounds, and music difficulty
- Timer pressure in later worlds (Castle: 8s, Dragon Lair: 5s)
- Scoring system with time bonuses
- Local leaderboard (top 10 runs saved to browser)
- **3 difficulty modes** — Easy (1 battle/world, no timer), Medium, Hard
- **World Map** between worlds showing progress and trophies
- **Area Cleared screen** with animated score transfer
- **i18n** — English and Hebrew UI
- **Design Mode** — browse all screens/backgrounds (append `?design` to URL)
- Deploys to a single self-contained HTML file (no server needed)

## World progression

| # | World | Enemy | Medium HP | Timer |
|---|-------|-------|-----------|-------|
| 1 | Forest 🌲 | Goblin | 4 | — |
| 2 | Swamp 🌿 | Skeleton | 5 | — |
| 3 | Mountains ⛰️ | Orc | 6 | — |
| 4 | Castle 🏰 | Dark Knight | 6 | 8s |
| 5 | Dragon Lair 🐉 | Dragon | 7 | 5s |

## Tech stack

- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- `vite-plugin-singlefile` — entire app builds to one self-contained `index.html`
- No router — screen state managed in `App.jsx`
- No backend — all data stored in `localStorage`

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

To test on your phone (same Wi-Fi network):

```bash
npm run dev -- --host
```

Then open the Network URL shown in the terminal on your phone.

## Building & deploying

```bash
npm run build    # bumps patch version, builds dist/
npm run deploy   # build + publish to GitHub Pages via gh-pages
```

The build produces a single `dist/index.html` that can be opened directly in any browser or hosted anywhere.

## Project structure

```
src/
  components/         # Reusable UI (HPBar, AnswerButton, EnemyCharacter, KnightCharacter, …)
  screens/            # Full screens (StartScreen, WorldMapScreen, BattleScreen, ResultScreen, …)
  game/               # Pure logic & config
    campaign.config.js  ← single source of truth for all level design
    battleLogic.js      ← makeRound, generateOptions, getTrophy, calcBattleScore
    runState.js         ← localStorage helpers
    scoreState.js       ← leaderboard helpers
    i18n.js             ← EN + Hebrew translations
    sounds.js           ← Web Audio sound effects
  App.jsx             # Campaign state machine
scripts/
  bump-version.js     # Auto-increments patch version before each build
```

## For developers / AI agents

See [`CLAUDE.md`](./CLAUDE.md) for full architecture notes, key file descriptions, campaign config reference, and the feature roadmap.

See [`PROGRESS.md`](./PROGRESS.md) for current implementation status.

GitHub repo: https://github.com/amireluk/NumKnight
