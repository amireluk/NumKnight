import { motion } from 'framer-motion'

const BASE_COLORS = [
  { bg: 'bg-blue-600', border: 'border-blue-800', hover: 'hover:bg-blue-500' },
  { bg: 'bg-purple-600', border: 'border-purple-800', hover: 'hover:bg-purple-500' },
  { bg: 'bg-orange-500', border: 'border-orange-700', hover: 'hover:bg-orange-400' },
  { bg: 'bg-teal-600', border: 'border-teal-800', hover: 'hover:bg-teal-500' },
]

export function AnswerButton({ value, index, onClick, disabled, state }) {
  const base = BASE_COLORS[index % 4]

  let bgClass = `${base.bg} ${base.border}`
  if (state === 'correct') bgClass = 'bg-green-500 border-green-700'
  if (state === 'wrong') bgClass = 'bg-red-500 border-red-700'

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.93, y: 3 } : {}}
      whileHover={!disabled && state === 'idle' ? { scale: 1.04 } : {}}
      onClick={() => !disabled && onClick(value)}
      className={`
        ${bgClass}
        border-b-4 rounded-2xl
        text-white font-black text-2xl
        h-16 w-full
        shadow-lg select-none
        transition-colors duration-150
        ${disabled ? 'cursor-default opacity-80' : 'cursor-pointer'}
        flex items-center justify-center
      `}
    >
      {value}
    </motion.button>
  )
}
