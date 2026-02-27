# ⚔️ NumKnight

A fun, mobile-first math practice app for kids in 2nd–3rd grade. Fight enemies by solving multiplication problems — get it right and your knight attacks, get it wrong and the enemy strikes back!

## What is this?

NumKnight wraps multiplication table practice inside a battle game. Kids progress through worlds of increasing difficulty, facing new enemies and harder problems as they go. No time pressure, no frustration — just math disguised as adventure.

## Features (current)

- ⚔️ Knight vs enemy battles driven by multiplication problems
- 4 answer choices per question (smart distractors, not random)
- HP system — correct answers damage the enemy, wrong answers hurt you
- Combo mechanic — 3 correct answers in a row = ⚡ Power Strike (double damage)
- Animated knight and goblin characters (SVG + Framer Motion)
- Star rating based on accuracy after each battle
- 4 worlds planned with increasing difficulty (tables 1–3 up to full 10×10)

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- Pure frontend — no backend, no login, no data stored

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

## Project status

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Project setup | ✅ Done |
| 1 | Core battle loop | ✅ Done |
| 2 | World & enemy variety | 🔄 In progress |
| 3 | Campaign map | ⏳ Pending |
| 4 | Rewards & polish | ⏳ Pending |

See [`PLAN.md`](./PLAN.md) for the full execution plan and [`PROGRESS.md`](./PROGRESS.md) for current status.
