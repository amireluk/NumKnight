const KEY_PREFIX = 'numknight_scores_'

export function saveScore(difficulty, entry) {
  const scores = loadScores(difficulty)
  scores.push(entry)
  scores.sort((a, b) => b.score - a.score)
  try {
    localStorage.setItem(KEY_PREFIX + difficulty, JSON.stringify(scores.slice(0, 10)))
  } catch {
    // ignore storage errors
  }
}

export function loadScores(difficulty) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + difficulty)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearScores(difficulty) {
  try {
    localStorage.removeItem(KEY_PREFIX + difficulty)
  } catch {
    // ignore
  }
}
