// ═══════════════════════════════════════════════════════════════════════
//  NUMKNIGHT — Campaign Configuration
// ═══════════════════════════════════════════════════════════════════════
//
//  Design principles — see CLAUDE.md "Campaign design principles"
//
//  Field reference:
//    enemy.id      goblin | skeleton | orc | darkKnight | dragon
//    enemy.hp      hits to kill — keep low (≤5), snappy fights
//    enemyDamage   HP the enemy deals per wrong answer (default 1 if omitted)
//    battles       fights in this world — ramps up across the campaign
//    timer         null = no limit | N = N seconds/question (miss = damage)
//    multipliers   left-hand factor pool for a × b questions
//    factorRange   always [1, 10] — right-hand factor range
//
//  playerHP is NOT in the config — it is always 3 (hardcoded in BattleScreen).
// ═══════════════════════════════════════════════════════════════════════

// ── Easy ──────────────────────────────────────────────────────────────
//  Easy-pattern tables only (1s, 2s, 5s, 10s). No timers.
//  3–4 battles per world.
//  Total: 60 questions on a perfect run.
export const EASY = [
  {
    id: 'forest', name: 'Forest', battles: 3,
    enemy: { id: 'goblin', name: 'Goblin', hp: 4 },
    timer: null, multipliers: [0, 1, 2], factorRange: [1, 10],
  },
  {
    id: 'swamp', name: 'Swamp', battles: 3,
    enemy: { id: 'skeleton', name: 'Skeleton', hp: 4 },
    timer: null, multipliers: [2, 5, 10], factorRange: [1, 10],
  },
  {
    id: 'mountains', name: 'Mountains', battles: 3,
    enemy: { id: 'orc', name: 'Orc', hp: 4 },
    timer: null, multipliers: [3, 4, 6], factorRange: [1, 10],
  },
  {
    id: 'castle', name: 'Castle', battles: 3,
    enemy: { id: 'darkKnight', name: 'Dark Knight', hp: 4 },
    timer: null, multipliers: [7, 8, 9], factorRange: [1, 10],
  },
  {
    id: 'dragonLair', name: 'Dragon Lair', battles: 3,
    enemy: { id: 'dragon', name: 'Dragon', hp: 3 },
    timer: 20, multipliers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], factorRange: [1, 10],
  },
]

// ── Medium ────────────────────────────────────────────────────────────
//  No 2s. Multipliers expand world by world toward the full 10×10 board.
//  3 battles per world. Timers in Castle and Dragon Lair.
//  Dragon deals 2 damage — one mistake = dead.
//  Total: 54 questions on a perfect run.
export const MEDIUM = [
  {
    id: 'forest', name: 'Forest', battles: 3,
    enemy: { id: 'goblin', name: 'Goblin', hp: 4 },
    timer: null, multipliers: [0, 1, 2, 3], factorRange: [1, 10],
  },
  {
    id: 'swamp', name: 'Swamp', battles: 3,
    enemy: { id: 'skeleton', name: 'Skeleton', hp: 5 },
    timer: null, multipliers: [2, 3, 4, 5, 6], factorRange: [1, 10],
  },
  {
    id: 'mountains', name: 'Mountains', battles: 3,
    enemy: { id: 'orc', name: 'Orc', hp: 5 },
    timer: null, multipliers: [3, 4, 5, 6, 7], factorRange: [1, 10],
  },
  {
    id: 'castle', name: 'Castle', battles: 3,
    enemy: { id: 'darkKnight', name: 'Dark Knight', hp: 5 },
    timer: 10, multipliers: [3, 4, 5, 6, 7, 8, 9], factorRange: [1, 10],
  },
  {
    id: 'dragonLair', name: 'Dragon Lair', battles: 3,
    enemy: { id: 'dragon', name: 'Dragon', hp: 4 },
    timer: 8, multipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], factorRange: [1, 10],
    enemyDamage: 2,
  },
]

// ── Hard ──────────────────────────────────────────────────────────────
//  1s, 2s, and 10s stripped from Swamp onward — focus on the hard middle (4–9).
//  Timers from Swamp onward. 3 battles per world.
//  Castle enemy deals 2 damage; Dragon deals 3 (instant death).
//  Total: 69 questions on a perfect run.
export const HARD = [
  {
    id: 'forest', name: 'Forest', battles: 3,
    enemy: { id: 'goblin', name: 'Goblin', hp: 5 },
    timer: null, multipliers: [1, 2, 3, 4, 5], factorRange: [1, 10],
  },
  {
    id: 'swamp', name: 'Swamp', battles: 3,
    enemy: { id: 'skeleton', name: 'Skeleton', hp: 5 },
    timer: 10, multipliers: [2, 3, 4, 5, 6], factorRange: [1, 10],
  },
  {
    id: 'mountains', name: 'Mountains', battles: 3,
    enemy: { id: 'orc', name: 'Orc', hp: 5 },
    timer: 8, multipliers: [3, 4, 5, 6, 7, 8], factorRange: [1, 10],
  },
  {
    id: 'castle', name: 'Castle', battles: 3,
    enemy: { id: 'darkKnight', name: 'Dark Knight', hp: 5 },
    timer: 7, multipliers: [3, 4, 5, 6, 7, 8, 9], factorRange: [1, 10],
    enemyDamage: 2,
  },
  {
    id: 'dragonLair', name: 'Dragon Lair', battles: 3,
    enemy: { id: 'dragon', name: 'Dragon', hp: 5 },
    timer: 5, multipliers: [2, 3, 4, 5, 6, 7, 8, 9], factorRange: [1, 10],
    enemyDamage: 3,
  },
]

// ── Dev ───────────────────────────────────────────────────────────────
//  Activated by ?dev in the URL. Never used in production gameplay.
//  2 worlds, 2 battles each, enemy hp 1, player hp 2, all 0× questions.
export const DEV = [
  {
    id: 'forest', name: 'Forest', battles: 2, playerHP: 2,
    enemy: { id: 'goblin', name: 'Goblin', hp: 1 },
    timer: null, multipliers: [0], factorRange: [1, 10],
  },
  {
    id: 'dragonLair', name: 'Dragon Lair', battles: 2, playerHP: 2,
    enemy: { id: 'dragon', name: 'Dragon', hp: 2 },
    timer: null, multipliers: [0], factorRange: [1, 10],
  },
]

export const CAMPAIGN = { easy: EASY, medium: MEDIUM, hard: HARD }
