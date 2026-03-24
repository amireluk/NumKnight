const KEY = 'numknight_run'
const RUN_VERSION = 2  // bump when run shape changes to discard incompatible saves

export function createNewRun(difficulty = 'medium') {
  return {
    _v: RUN_VERSION,
    difficulty,
    worldIndex: 0,
    battleIndex: 0,
    trophies: [], // 'gold' | 'silver' | 'bronze', one per completed battle
    totalScore: 0,
    worldScores: [], // numeric score per completed world, indexed by worldIndex
  }
}

export function isRunInProgress(run) {
  if (!run) return false
  return run.trophies?.length > 0 || run.worldIndex > 0 || run.battleIndex > 0
}

export function loadRun() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Discard saves from incompatible older versions
    if (parsed._v !== RUN_VERSION) { clearRun(); clearBattleState(); return null }
    return parsed
  } catch {
    return null
  }
}

export function saveRun(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore storage errors
  }
}

export function clearRun() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

// ── Mid-battle persistence ────────────────────────────────────────────────────
const BATTLE_KEY = 'numknight_battle'

export function saveBattleState(state) {
  try { localStorage.setItem(BATTLE_KEY, JSON.stringify(state)) } catch {}
}

export function loadBattleState(worldIndex, battleIndex) {
  try {
    const raw = localStorage.getItem(BATTLE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    if (s.worldIndex !== worldIndex || s.battleIndex !== battleIndex) return null
    // Sanity-check required fields — corrupted state starts fresh
    if (typeof s.playerHP !== 'number' || typeof s.enemyHP !== 'number') return null
    return s
  } catch {
    clearBattleState()
    return null
  }
}

export function clearBattleState() {
  try { localStorage.removeItem(BATTLE_KEY) } catch {}
}

export function hasSavedBattle() {
  try { return !!localStorage.getItem(BATTLE_KEY) } catch { return false }
}

export function hasSavedRun() {
  try { return !!localStorage.getItem(KEY) } catch { return false }
}
