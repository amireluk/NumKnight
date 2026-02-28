export const WORLDS = {
  forest: {
    id: 'forest',
    icon: '🌲',
    tableRange: [1, 3],
    playerHP: 3,
    enemyHP: 5,
    enemies: [
      { id: 'goblin' },
      { id: 'slime' },
    ],
  },
  mountains: {
    id: 'mountains',
    icon: '⛰️',
    tableRange: [4, 6],
    playerHP: 6,
    enemyHP: 5,
    enemies: [
      { id: 'orc' },
      { id: 'troll' },
    ],
  },
  castle: {
    id: 'castle',
    icon: '🏰',
    tableRange: [7, 9],
    playerHP: 5,
    enemyHP: 5,
    enemies: [
      { id: 'darkKnight' },
      { id: 'wizard' },
    ],
  },
  dragonLair: {
    id: 'dragonLair',
    icon: '🐉',
    tableRange: [1, 10],
    playerHP: 4,
    enemyHP: 5,
    enemies: [{ id: 'dragon' }],
  },
}

export const DEFAULT_WORLD = WORLDS.forest
