// ═══════════════════════════════════════════════════════════════════════
//  NUMKNIGHT — Campaign Configuration
// ═══════════════════════════════════════════════════════════════════════
//
//  ▼▼▼  Flip this flag to switch configs  ▼▼▼
export const DEBUG = false
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//
//  DEBUG = true  → 1 HP enemies, 1 battle per world (fast full-run test)
//  DEBUG = false → production values
//
// ───────────────────────────────────────────────────────────────────────
//  Field reference:
//
//  enemy.id      goblin | skeleton | orc | darkKnight | dragon
//  timer         null = no limit  |  8 = 8 s/question (miss = take damage)
//  multipliers   times-tables for the left factor  a × b
//  factorRange   [min, max] for the right factor  (e.g. [1,5] = easier)
//  playerHP      hits before death  (3 allows gold/silver/bronze)
//  battles       fights in this world
// ═══════════════════════════════════════════════════════════════════════

const PRODUCTION = [

  // ── World 1 ── Forest ────────────────────────────────────────────────
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    battles: 3,
    playerHP: 3,
    enemy: { id: 'goblin', name: 'Goblin', hp: 4 },
    timer: null,
    multipliers: [2, 3, 4],
    factorRange: [1, 10],
  },

  // ── World 2 ── Swamp ─────────────────────────────────────────────────
  {
    id: 'swamp',
    name: 'Swamp',
    icon: '🌿',
    battles: 3,
    playerHP: 3,
    enemy: { id: 'skeleton', name: 'Skeleton', hp: 5 },
    timer: null,
    multipliers: [2, 3, 4, 5, 6],
    factorRange: [1, 10],
  },

  // ── World 3 ── Mountains ─────────────────────────────────────────────
  {
    id: 'mountains',
    name: 'Mountains',
    icon: '⛰️',
    battles: 3,
    playerHP: 3,
    enemy: { id: 'orc', name: 'Orc', hp: 6 },
    timer: null,
    multipliers: [3, 4, 5, 6, 7, 8],
    factorRange: [1, 10],
  },

  // ── World 4 ── Castle ────────────────────────────────────────────────
  {
    id: 'castle',
    name: 'Castle',
    icon: '🏰',
    battles: 3,
    playerHP: 3,
    enemy: { id: 'darkKnight', name: 'Dark Knight', hp: 6 },
    timer: 8,
    multipliers: [6, 7, 8, 9],
    factorRange: [1, 10],
  },

  // ── World 5 ── Dragon Lair ───────────────────────────────────────────
  {
    id: 'dragonLair',
    name: 'Dragon Lair',
    icon: '🐉',
    battles: 3,
    playerHP: 3,
    enemy: { id: 'dragon', name: 'Dragon', hp: 7 },
    timer: 5,
    multipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    factorRange: [1, 10],
  },

]

// ── Debug: 1 HP, 1 battle per world — races through all 5 enemies ──────
const DEBUG_CONFIG = PRODUCTION.map((world) => ({
  ...world,
  battles: 1,
  enemy: { ...world.enemy, hp: 1 },
}))

export const CAMPAIGN = DEBUG ? DEBUG_CONFIG : PRODUCTION
