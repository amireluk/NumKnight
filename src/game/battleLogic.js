// multipliers: number[] — times-tables active this world (from campaign.config)
// factorRange: [min, max] — range for the other factor
export function generateProblem(multipliers, factorRange = [1, 10]) {
  const [fMin, fMax] = factorRange
  const a = multipliers[Math.floor(Math.random() * multipliers.length)]
  const b = Math.floor(Math.random() * (fMax - fMin + 1)) + fMin
  return Math.random() > 0.5
    ? { a, b, answer: a * b }
    : { a: b, b: a, answer: a * b }
}

export function generateOptions(answer) {
  const distractors = new Set()
  const offsets = [2, 3, 4, 5, 6, -2, -3, -4, -5, 7, -6, 8, -7, 9, -8, 10, -9, 11, -10]
  const shuffled = [...offsets].sort(() => Math.random() - 0.5)

  for (const offset of shuffled) {
    if (distractors.size >= 3) break
    const d = answer + offset
    if (d > 0 && d !== answer && !distractors.has(d)) {
      distractors.add(d)
    }
  }

  let fallback = 1
  while (distractors.size < 3) {
    if (fallback !== answer && !distractors.has(fallback)) {
      distractors.add(fallback)
    }
    fallback++
  }

  return [answer, ...distractors].sort(() => Math.random() - 0.5)
}

export function makeRound(multipliers, factorRange = [1, 10], lastProblem = null) {
  let problem
  let attempts = 0
  do {
    problem = generateProblem(multipliers, factorRange)
    attempts++
  } while (
    attempts < 6 &&
    lastProblem !== null &&
    ((problem.a === lastProblem.a && problem.b === lastProblem.b) ||
     (problem.a === lastProblem.b && problem.b === lastProblem.a))
  )
  return { problem, options: generateOptions(problem.answer) }
}

// 0 hits = gold, 1 = silver, 2 = bronze (3 hits = dead, never reaches result)
export function getTrophy(mistakes) {
  if (mistakes === 0) return 'gold'
  if (mistakes === 1) return 'silver'
  return 'bronze'
}

// World multiplier applied to base score only (rewards campaign progression)
export const WORLD_SCORE_MULTIPLIERS = [1.0, 1.1, 1.3, 1.6, 2.0]
// Difficulty multiplier applied to the whole battle score
export const DIFF_SCORE_MULTIPLIERS = { easy: 1.0, medium: 1.2, hard: 1.5 }

export function calcBattleScore(trophy, timeBonus = 0, worldIndex = 0, difficulty = 'easy') {
  const base = { gold: 100, silver: 50, bronze: 25 }[trophy] ?? 0
  const worldMult = WORLD_SCORE_MULTIPLIERS[worldIndex] ?? 1.0
  const diffMult = DIFF_SCORE_MULTIPLIERS[difficulty] ?? 1.0
  return Math.round((base * worldMult + timeBonus) * diffMult)
}
