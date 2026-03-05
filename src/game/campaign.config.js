// ═══════════════════════════════════════════════════════════════════════
//  NUMKNIGHT — Campaign Configuration
// ═══════════════════════════════════════════════════════════════════════
//
//  Change DIFFICULTY to switch the active config:  'easy' | 'medium' | 'hard'
//
//  Field reference:
//    enemy.id     goblin | skeleton | orc | darkKnight | dragon
//    timer        null = no limit | N = N seconds/question (miss = damage)
//    multipliers  times-tables for the left factor a × b
//    factorRange  [min, max] for the right factor
//    playerHP     hits before death (3 = gold/silver/bronze possible)
//    battles      fights in this world
// ═══════════════════════════════════════════════════════════════════════

// ── Easy ──────────────────────────────────────────────────────────────
//  Small tables (×2-×5 max), no timers, generous HP — great for kids
export const EASY = [
  {
    id: 'forest', name: 'Forest', icon: '🌲', battles: 2, playerHP: 3,
    enemy: { id: 'goblin', name: 'Goblin', hp: 2 },
    timer: null, multipliers: [2, 3], factorRange: [1, 10],
  },
  {
    id: 'swamp', name: 'Swamp', icon: '🌿', battles: 2, playerHP: 3,
    enemy: { id: 'skeleton', name: 'Skeleton', hp: 2 },
    timer: null, multipliers: [2, 3, 4], factorRange: [1, 10],
  },
  {
    id: 'mountains', name: 'Mountains', icon: '⛰️', battles: 2, playerHP: 3,
    enemy: { id: 'orc', name: 'Orc', hp: 2 },
    timer: null, multipliers: [2, 3, 4, 5], factorRange: [1, 10],
  },
  {
    id: 'castle', name: 'Castle', icon: '🏰', battles: 3, playerHP: 3,
    enemy: { id: 'darkKnight', name: 'Dark Knight', hp: 2 },
    timer: null, multipliers: [2, 3, 4, 5, 6], factorRange: [1, 10],
  },
  {
    id: 'dragonLair', name: 'Dragon Lair', icon: '🐉', battles: 3, playerHP: 3,
    enemy: { id: 'dragon', name: 'Dragon', hp: 2 },
    timer: null, multipliers: [2, 3, 4, 5, 6, 7, 8], factorRange: [1, 10],
  },
]

// ── Medium ────────────────────────────────────────────────────────────
//  Broader tables, timed pressure in the last two worlds
export const MEDIUM = [
  {
    id: 'forest', name: 'Forest', icon: '🌲', battles: 3, playerHP: 3,
    enemy: { id: 'goblin', name: 'Goblin', hp: 4 },
    timer: null, multipliers: [2, 3, 4], factorRange: [1, 10],
  },
  {
    id: 'swamp', name: 'Swamp', icon: '🌿', battles: 3, playerHP: 3,
    enemy: { id: 'skeleton', name: 'Skeleton', hp: 5 },
    timer: null, multipliers: [2, 3, 4, 5, 6], factorRange: [1, 10],
  },
  {
    id: 'mountains', name: 'Mountains', icon: '⛰️', battles: 3, playerHP: 3,
    enemy: { id: 'orc', name: 'Orc', hp: 6 },
    timer: null, multipliers: [3, 4, 5, 6, 7, 8], factorRange: [1, 10],
  },
  {
    id: 'castle', name: 'Castle', icon: '🏰', battles: 3, playerHP: 3,
    enemy: { id: 'darkKnight', name: 'Dark Knight', hp: 6 },
    timer: 8, multipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], factorRange: [1, 10],
  },
  {
    id: 'dragonLair', name: 'Dragon Lair', icon: '🐉', battles: 3, playerHP: 3,
    enemy: { id: 'dragon', name: 'Dragon', hp: 7 },
    timer: 5, multipliers: [3, 4, 5, 6, 7, 8, 9], factorRange: [1, 10],
  },
]

// ── Hard ──────────────────────────────────────────────────────────────
//  Full tables (×1-×10), timers from Mountains onwards, Dragon Lair is 2 HP
export const HARD = [
  {
    id: 'forest', name: 'Forest', icon: '🌲', battles: 3, playerHP: 3,
    enemy: { id: 'goblin', name: 'Goblin', hp: 5 },
    timer: null, multipliers: [2, 3, 4, 5, 6, 7], factorRange: [1, 10],
  },
  {
    id: 'swamp', name: 'Swamp', icon: '🌿', battles: 3, playerHP: 3,
    enemy: { id: 'skeleton', name: 'Skeleton', hp: 6 },
    timer: null, multipliers: [3, 4, 5, 6, 7, 8, 9], factorRange: [1, 10],
  },
  {
    id: 'mountains', name: 'Mountains', icon: '⛰️', battles: 3, playerHP: 3,
    enemy: { id: 'orc', name: 'Orc', hp: 7 },
    timer: 10, multipliers: [4, 5, 6, 7, 8, 9, 10], factorRange: [1, 10],
  },
  {
    id: 'castle', name: 'Castle', icon: '🏰', battles: 3, playerHP: 3,
    enemy: { id: 'darkKnight', name: 'Dark Knight', hp: 8 },
    timer: 6, multipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], factorRange: [1, 10],
  },
  {
    id: 'dragonLair', name: 'Dragon Lair', icon: '🐉', battles: 3, playerHP: 2,
    enemy: { id: 'dragon', name: 'Dragon', hp: 9 },
    timer: 4, multipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], factorRange: [1, 10],
  },
]

// ── Active difficulty ─────────────────────────────────────────────────
//  Change this to 'easy' | 'medium' | 'hard' to switch configs.
export const DIFFICULTY = 'easy'

export const CAMPAIGN = { easy: EASY, medium: MEDIUM, hard: HARD }[DIFFICULTY] ?? MEDIUM
