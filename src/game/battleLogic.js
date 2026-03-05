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

export function makeRound(multipliers, factorRange = [1, 10]) {
  const problem = generateProblem(multipliers, factorRange)
  return { problem, options: generateOptions(problem.answer) }
}

// 0 hits = gold, 1 = silver, 2 = bronze (3 hits = dead, never reaches result)
export function getTrophy(mistakes) {
  if (mistakes === 0) return 'gold'
  if (mistakes === 1) return 'silver'
  return 'bronze'
}
