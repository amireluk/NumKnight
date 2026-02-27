import { motion } from 'framer-motion'

const BASE_COLORS = [
  { bg: 'bg-blue-600', border: 'border-blue-800' },
  { bg: 'bg-purple-600', border: 'border-purple-800' },
  { bg: 'bg-orange-500', border: 'border-orange-700' },
  { bg: 'bg-teal-600', border: 'border-teal-800' },
]

export function AnswerButton({ value, index, onClick, disabled, state }) {
  const base = BASE_COLORS[index % 4]

  let bgClass = `${base.bg} ${base.border}`
  if (state === 'correct') bgClass = 'bg-green-500 border-green-700'
  if (state === 'wrong') bgClass = 'bg-red-500 border-red-700'

  const wrongAnimation =
    state === 'wrong'
      ? { x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.4 } }
      : {}

  const correctAnimation =
    state === 'correct'
      ? { scale: [1, 1.08, 1], transition: { duration: 0.25, ease: 'easeOut' } }
      : {}

  return (
    <motion.button
      animate={{ ...wrongAnimation, ...correctAnimation }}
      whileTap={!disabled && state === 'idle' ? { scale: 0.91, y: 4 } : {}}
      whileHover={!disabled && state === 'idle' ? { scale: 1.04, y: -1 } : {}}
      onClick={() => !disabled && onClick(value)}
      className={`
        ${bgClass}
        border-b-4 rounded-2xl
        text-white font-black text-2xl
        h-16 w-full shadow-lg select-none
        transition-colors duration-150
        ${disabled ? 'cursor-default opacity-80' : 'cursor-pointer'}
        flex items-center justify-center
      `}
    >
      {value}
    </motion.button>
  )
}
