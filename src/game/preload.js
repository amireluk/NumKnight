/* eslint-disable no-undef */
const BASE = import.meta.env.BASE_URL
const V = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'

function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve  // always resolve — fail open, never block the game
    img.src = src
  })
}

// Only what's needed to render the start/title screen without pop-in
const CRITICAL_IMAGES = [
  `${BASE}assets/backgrounds/title.webp`,
]

// Everything else — loaded in the background while the user is on the start screen
const BACKGROUND_IMAGES = [
  `${BASE}assets/backgrounds/forest.webp`,
  `${BASE}assets/backgrounds/swamp.webp`,
  `${BASE}assets/backgrounds/mountains.webp`,
  `${BASE}assets/backgrounds/castle.webp`,
  `${BASE}assets/backgrounds/dragon-lair.webp`,
  // Knight
  `${BASE}assets/characters/knight/knight-idle.webp?v=${V}`,
  `${BASE}assets/characters/knight/knight-attack.webp?v=${V}`,
  `${BASE}assets/characters/knight/knight-hit.webp?v=${V}`,
  `${BASE}assets/characters/knight/knight-dead.webp?v=${V}`,
  `${BASE}assets/characters/knight/knight-victory.webp?v=${V}`,
  `${BASE}assets/characters/knight/knight-camp.webp?v=${V}`,
  // Enemies
  ...['goblin', 'skeleton', 'orc', 'dark-knight', 'dragon'].flatMap(e =>
    ['idle', 'attack', 'hit', 'dead'].map(s => `${BASE}assets/characters/${e}/${e}-${s}.webp?v=${V}`)
  ),
]

// Resolves when the start screen background is ready to display
export function preloadCritical() {
  return Promise.all(CRITICAL_IMAGES.map(loadImage))
}

// Fire-and-forget — starts loading everything else in the background
export function preloadBackground() {
  BACKGROUND_IMAGES.forEach(src => loadImage(src))
}
