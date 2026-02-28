import { motion } from 'framer-motion'
import { calculateStars } from '../game/battleLogic'

function Star({ filled, delay }) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={
        filled
          ? { delay, type: 'spring', stiffness: 200, damping: 12 }
          : { delay, duration: 0.4, ease: 'easeOut' }
      }
      className="text-5xl"
    >
      {filled ? '⭐' : '☆'}
    </motion.span>
  )
}

// Trophy filter per star count: bronze (1), silver (2), gold (3)
const TROPHY_FILTER = {
  1: 'sepia(1) saturate(1.4) hue-rotate(-10deg) brightness(0.82)',
  2: 'grayscale(1) brightness(1.45) contrast(0.88)',
  3: 'drop-shadow(0 0 22px rgba(251,191,36,0.85))',
}

function Gravestone() {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 }}
    >
      <svg width="100" height="130" viewBox="0 0 100 130" fill="none">
        {/* Stone */}
        <rect x="18" y="30" width="64" height="76" rx="6" fill="#3a3a4a" stroke="#2a2a3a" strokeWidth="2" />
        {/* Dome */}
        <path d="M18 56 Q18 30 50 30 Q82 30 82 56Z" fill="#3a3a4a" stroke="#2a2a3a" strokeWidth="2" />
        {/* Highlight */}
        <ellipse cx="36" cy="38" rx="12" ry="7" fill="white" opacity="0.07" />
        {/* Cross */}
        <rect x="46" y="44" width="8" height="28" rx="3" fill="#5a5a6a" />
        <rect x="36" y="52" width="28" height="8" rx="3" fill="#5a5a6a" />
        {/* Base */}
        <rect x="8" y="104" width="84" height="12" rx="4" fill="#2a2a3a" stroke="#1a1a2a" strokeWidth="2" />
        {/* Grass tufts */}
        <path d="M8 112 Q14 106 20 112" stroke="#3e5635" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M76 112 Q82 106 88 112" stroke="#3e5635" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

export function ResultScreen({ won, mistakes, onPlayAgain }) {
  const stars = calculateStars(mistakes)

  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh max-w-md mx-auto px-6 gap-6"
      style={{
        background: won
          ? 'radial-gradient(ellipse at 50% 40%, rgba(251,191,36,0.12) 0%, transparent 70%), linear-gradient(to bottom, #0d0d1e, #1a1040)'
          : 'radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.10) 0%, transparent 70%), linear-gradient(to bottom, #0d0d1e, #1a1040)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {won ? (
        <>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.05 }}
          >
            <span style={{ fontSize: 96, filter: TROPHY_FILTER[stars] ?? TROPHY_FILTER[3] }}>
              🏆
            </span>
          </motion.div>

          <div className="flex gap-3">
            {[1, 2, 3].map((n) => (
              <Star key={n} filled={n <= stars} delay={0.35 + n * 0.15} />
            ))}
          </div>
        </>
      ) : (
        <Gravestone />
      )}

      {/* Play again / retry */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: won ? 1 : 0.7 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
        onClick={onPlayAgain}
        className={`w-full border-b-4 font-black text-3xl rounded-2xl h-16 shadow-xl cursor-pointer ${
          won
            ? 'bg-yellow-400 border-yellow-600 text-black'
            : 'bg-slate-700 border-slate-900 text-white'
        }`}
      >
        {won ? '▶' : '↺'}
      </motion.button>
    </div>
  )
}
