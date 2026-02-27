export function generateProblem(tableRange) {
  const [min, max] = tableRange
  const a = Math.floor(Math.random() * (max - min + 1)) + min
  const b = Math.floor(Math.random() * 10) + 1
  // Randomize order so it's not always "table × other"
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

  // Fallback if not enough distractors (e.g. answer is very small)
  let fallback = 1
  while (distractors.size < 3) {
    if (fallback !== answer && !distractors.has(fallback)) {
      distractors.add(fallback)
    }
    fallback++
  }

  return [answer, ...distractors].sort(() => Math.random() - 0.5)
}

export function calculateStars(mistakes) {
  if (mistakes === 0) return 3
  if (mistakes <= 2) return 2
  return 1
}

export function makeRound(tableRange) {
  const problem = generateProblem(tableRange)
  return {
    problem,
    options: generateOptions(problem.answer),
  }
}
