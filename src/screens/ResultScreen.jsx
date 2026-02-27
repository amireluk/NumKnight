import { motion } from 'framer-motion'
import { calculateStars } from '../game/battleLogic'

function Star({ filled, delay }) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 12 }}
      className="text-5xl"
    >
      {filled ? '⭐' : '☆'}
    </motion.span>
  )
}

export function ResultScreen({ won, mistakes, onPlayAgain }) {
  const stars = calculateStars(mistakes)

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh max-w-md mx-auto px-6 gap-8 bg-gradient-to-b from-[#0d0d1e] to-[#1a1040]">
      {/* Outcome icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
      >
        <p className="text-8xl">{won ? '🏆' : '💀'}</p>
      </motion.div>

      {/* Stars */}
      <div className="flex gap-3">
        {[1, 2, 3].map((n) => (
          <Star key={n} filled={n <= stars} delay={0.3 + n * 0.15} />
        ))}
      </div>

      {/* Mistake count */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 border border-white/20 rounded-2xl px-8 py-4 text-center"
      >
        <p className="text-3xl">❌ {mistakes}</p>
      </motion.div>

      {/* Play again button — icon only */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
        onClick={onPlayAgain}
        className="w-full bg-yellow-500 border-b-4 border-yellow-700 text-black font-black text-3xl rounded-2xl h-16 shadow-xl cursor-pointer"
      >
        {won ? '▶️' : '🔄'}
      </motion.button>
    </div>
  )
}
