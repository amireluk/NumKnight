const KEY = 'numknight_run'

export function createNewRun() {
  return {
    worldIndex: 0,
    battleIndex: 0,
    trophies: [], // 'gold' | 'silver' | 'bronze', one per completed battle
    totalScore: 0,
  }
}

export function loadRun() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
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
