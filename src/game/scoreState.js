const KEY = 'numknight_scores'
const OLD_KEYS = ['numknight_scores_easy', 'numknight_scores_medium', 'numknight_scores_hard']
const DIFFS = ['easy', 'medium', 'hard']
const CAP = 15

function migrate() {
  if (localStorage.getItem(KEY) !== null) return
  const merged = []
  OLD_KEYS.forEach((k, i) => {
    try {
      const raw = localStorage.getItem(k)
      if (raw) {
        const entries = JSON.parse(raw)
        entries.forEach(e => merged.push({ ...e, difficulty: DIFFS[i] }))
      }
    } catch { /* ignore */ }
  })
  merged.sort((a, b) => b.score - a.score)
  try {
    localStorage.setItem(KEY, JSON.stringify(merged.slice(0, CAP)))
    OLD_KEYS.forEach(k => localStorage.removeItem(k))
  } catch { /* ignore */ }
}

export function saveScore(difficulty, entry) {
  migrate()
  const scores = loadScores()
  scores.push({ ...entry, difficulty })
  scores.sort((a, b) => b.score - a.score)
  try {
    localStorage.setItem(KEY, JSON.stringify(scores.slice(0, CAP)))
  } catch { /* ignore */ }
}

export function loadScores() {
  migrate()
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearScores() {
  try {
    localStorage.removeItem(KEY)
  } catch { /* ignore */ }
}
