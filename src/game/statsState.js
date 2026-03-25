export const STATS_KEY = 'numknight_stats'

const MAX_PLAYERS = 5
const MAX_RESULTS = 40

// ---------- internal helpers ----------

function loadRaw() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY)) ?? { players: [] }
  } catch {
    return { players: [] }
  }
}

function saveRaw(data) {
  localStorage.setItem(STATS_KEY, JSON.stringify(data))
}

function getOrCreatePlayer(data, name) {
  let player = data.players.find((p) => p.name === name)
  if (!player) {
    // evict oldest when at capacity
    if (data.players.length >= MAX_PLAYERS) {
      data.players.sort((a, b) => a.lastUsed - b.lastUsed)
      data.players.shift()
    }
    player = { name, lastUsed: Date.now(), numbers: {} }
    data.players.push(player)
  }
  player.lastUsed = Date.now()
  return player
}

function pushResult(player, key, result) {
  if (!player.numbers[key]) player.numbers[key] = { results: [] }
  player.numbers[key].results.push(result)
  // keep only last MAX_RESULTS
  if (player.numbers[key].results.length > MAX_RESULTS) {
    player.numbers[key].results = player.numbers[key].results.slice(-MAX_RESULTS)
  }
}

// ---------- public API ----------

/**
 * Record one question result.
 * For a × b: records to both numbers[a] and numbers[b] (skip duplicate if a === b).
 *
 * @param {string} playerName
 * @param {number} a  - left factor
 * @param {number} b  - right factor
 * @param {boolean} success - true = correct on first attempt
 * @param {number} timeMs   - ms from question display to first interaction
 */
export function recordResult(playerName, a, b, success, timeMs) {
  if (!playerName) return
  const data = loadRaw()
  const player = getOrCreatePlayer(data, playerName)
  // Store a and b so history panel can show the full question
  const result = { success, timeMs: Math.round(timeMs), a, b }

  pushResult(player, String(a), result)
  if (a !== b) pushResult(player, String(b), result)

  saveRaw(data)
}

/**
 * Returns the numbers map for a player, or an empty object.
 * Shape: { "3": { results: [{success, timeMs}, ...] }, ... }
 */
export function loadPlayerStats(playerName) {
  if (!playerName) return {}
  const data = loadRaw()
  const player = data.players.find((p) => p.name === playerName)
  return player?.numbers ?? {}
}

/**
 * Compute display stats and a 0–1 rating for a single number's result array.
 *
 * rating = pct×0.6 + speedScore×0.4
 * speedScore = 1 − clamp(medianMs, 500, 4000) / 4000
 *
 * Bands:
 *   < 0.40  → 'weak'   (red)
 *   0.40–0.69 → 'mid'  (amber)
 *   ≥ 0.70  → 'strong' (green)
 *
 * Returns null if fewer than MIN_RESULTS results.
 */
const MIN_RESULTS = 5

export function computeNumberRating(results) {
  if (!results || results.length < MIN_RESULTS) return null

  const successes = results.filter((r) => r.success).length
  const pct = successes / results.length

  // Only use successful results for timing — wrong answers are excluded
  const successTimes = results
    .filter((r) => r.success && r.timeMs != null)
    .map((r) => r.timeMs)
    .sort((a, b) => a - b)

  // Fall back to a slow time if no successful results yet
  const times = successTimes.length > 0 ? successTimes : [4000]
  const mid = Math.floor(times.length / 2)
  const medianMs = times.length % 2 === 0
    ? (times[mid - 1] + times[mid]) / 2
    : times[mid]

  const SPEED_MIN = 500
  const SPEED_MAX = 6000
  const clamped = Math.min(Math.max(medianMs, SPEED_MIN), SPEED_MAX)
  const speedScore = 1 - (clamped - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)

  const rating = pct * 0.6 + speedScore * 0.4

  const band = rating >= 0.70 ? 'strong' : rating >= 0.40 ? 'mid' : 'weak'

  return { pct, medianMs: Math.round(medianMs), rating, band, total: results.length, successes }
}

/** Clears all stored stats for a given player name. */
export function clearPlayerStats(playerName) {
  if (!playerName) return
  const data = loadRaw()
  data.players = data.players.filter((p) => p.name !== playerName)
  saveRaw(data)
}

/** Returns list of all stored player names, sorted most-recent first. */
export function loadAllPlayerNames() {
  const data = loadRaw()
  return data.players
    .slice()
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .map((p) => p.name)
}
