import { motion } from 'framer-motion'
import { calculateStars } from '../game/battleLogic'

function Star({ filled, delay, won }) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={
        won && filled
          ? { delay, type: 'spring', stiffness: 200, damping: 12 }
          : { delay, duration: 0.4, ease: 'easeOut' }
      }
      className="text-5xl"
    >
      {filled ? '⭐' : '☆'}
    </motion.span>
  )
}

// Small confetti particles for the win screen
const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  angle: (i / 14) * 360,
  distance: 70 + (i % 3) * 30,
  size: 6 + (i % 3) * 3,
  color: ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa'][i % 5],
  delay: 0.5 + (i % 4) * 0.06,
}))

function Confetti() {
  return (
    <div style={{ position: 'absolute', top: '28%', left: '50%', pointerEvents: 'none' }}>
      {CONFETTI.map(({ id, angle, distance, size, color, delay }) => {
        const rad = (angle * Math.PI) / 180
        const tx = Math.cos(rad) * distance
        const ty = Math.sin(rad) * distance
        return (
          <motion.div
            key={id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x: tx, y: ty, opacity: [1, 1, 0], scale: [0, 1, 1] }}
            transition={{ duration: 0.9, delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: id % 2 === 0 ? '50%' : 2,
              background: color,
              marginLeft: -size / 2,
              marginTop: -size / 2,
            }}
          />
        )
      })}
    </div>
  )
}

function Podium() {
  return (
    <svg width="120" height="44" viewBox="0 0 120 44" fill="none">
      {/* Step 2 left */}
      <rect x="0" y="16" width="34" height="28" rx="3" fill="#b8860b" stroke="#8b6508" strokeWidth="2" />
      <rect x="2" y="18" width="30" height="8" rx="2" fill="#d4a017" opacity="0.5" />
      {/* Step 1 center */}
      <rect x="36" y="0" width="48" height="44" rx="3" fill="#d4a017" stroke="#b8860b" strokeWidth="2" />
      <rect x="38" y="2" width="44" height="10" rx="2" fill="#fbbf24" opacity="0.5" />
      <text x="60" y="30" textAnchor="middle" fontSize="16" fill="#7c5c00" fontWeight="bold">1</text>
      {/* Step 3 right */}
      <rect x="86" y="24" width="34" height="20" rx="3" fill="#8b7355" stroke="#6b5a45" strokeWidth="2" />
      <rect x="88" y="26" width="30" height="6" rx="2" fill="#a0926a" opacity="0.5" />
    </svg>
  )
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
      {won && <Confetti />}

      {/* Win: knight on podium — Lose: gravestone */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.05 }}
        className="flex flex-col items-center gap-2"
      >
        {won ? (
          <>
            <span style={{ fontSize: 72 }}>🧑‍⚔️</span>
            <Podium />
          </>
        ) : (
          <>
            <span style={{ fontSize: 48, marginBottom: -8 }}>💀</span>
            <Gravestone />
          </>
        )}
      </motion.div>

      {/* Stars */}
      <div className="flex gap-3">
        {[1, 2, 3].map((n) => (
          <Star key={n} filled={n <= stars} delay={0.35 + n * 0.15} won={won} />
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

      {/* Play again / retry */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
        onClick={onPlayAgain}
        className={`w-full border-b-4 text-black font-black text-3xl rounded-2xl h-16 shadow-xl cursor-pointer ${
          won
            ? 'bg-yellow-400 border-yellow-600'
            : 'bg-red-400 border-red-700 text-white'
        }`}
      >
        {won ? '▶️' : '🔄'}
      </motion.button>
    </div>
  )
}
