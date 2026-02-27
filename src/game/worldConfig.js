export const WORLDS = {
  forest: {
    id: 'forest',
    name: 'Enchanted Forest',
    tableRange: [1, 3],
    playerHP: 7,
    enemyHP: 5,
    enemies: [
      { id: 'goblin', name: 'Goblin' },
      { id: 'slime', name: 'Slime' },
    ],
  },
  mountains: {
    id: 'mountains',
    name: 'Rocky Mountains',
    tableRange: [4, 6],
    playerHP: 6,
    enemyHP: 5,
    enemies: [
      { id: 'orc', name: 'Orc' },
      { id: 'troll', name: 'Troll' },
    ],
  },
  castle: {
    id: 'castle',
    name: 'Dark Castle',
    tableRange: [7, 9],
    playerHP: 5,
    enemyHP: 5,
    enemies: [
      { id: 'darkKnight', name: 'Dark Knight' },
      { id: 'wizard', name: 'Wizard' },
    ],
  },
  dragonLair: {
    id: 'dragonLair',
    name: "Dragon's Lair",
    tableRange: [1, 10],
    playerHP: 4,
    enemyHP: 5,
    enemies: [{ id: 'dragon', name: 'Dragon' }],
  },
}

export const DEFAULT_WORLD = WORLDS.forest
