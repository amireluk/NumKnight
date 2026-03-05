import { motion } from 'framer-motion'

// Trophy CSS filters: bronze, silver, gold
const TROPHY_FILTER = {
  gold:   'drop-shadow(0 0 22px rgba(251,191,36,0.9))',
  silver: 'grayscale(1) brightness(1.5) contrast(0.85)',
  bronze: 'sepia(1) saturate(1.4) hue-rotate(-10deg) brightness(0.82)',
}

const TROPHY_LABEL = {
  gold:   'PERFECT!',
  silver: 'GREAT!',
  bronze: 'SURVIVED!',
}

function Gravestone() {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 }}
    >
      <svg width="100" height="130" viewBox="0 0 100 130" fill="none">
        <rect x="18" y="30" width="64" height="76" rx="6" fill="#3a3a4a" stroke="#2a2a3a" strokeWidth="2" />
        <path d="M18 56 Q18 30 50 30 Q82 30 82 56Z" fill="#3a3a4a" stroke="#2a2a3a" strokeWidth="2" />
        <ellipse cx="36" cy="38" rx="12" ry="7" fill="white" opacity="0.07" />
        <rect x="46" y="44" width="8" height="28" rx="3" fill="#5a5a6a" />
        <rect x="36" y="52" width="28" height="8" rx="3" fill="#5a5a6a" />
        <rect x="8" y="104" width="84" height="12" rx="4" fill="#2a2a3a" stroke="#1a1a2a" strokeWidth="2" />
        <path d="M8 112 Q14 106 20 112" stroke="#3e5635" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M76 112 Q82 106 88 112" stroke="#3e5635" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

function VictoryBurst() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 0.05 }}
      style={{ fontSize: 96, textAlign: 'center', lineHeight: 1 }}
    >
      🏆
    </motion.div>
  )
}

export function ResultScreen({
  won,
  trophy,        // 'gold' | 'silver' | 'bronze' — only when won
  worldName,
  worldNum,      // 1–5
  battleNum,     // 1-based index of the battle just completed
  totalBattles,  // world.battles — total encounters in this world
  isVictory,     // true when all battles in the whole campaign are done
  onContinue,    // advance to next battle
  onRestart,     // restart from world 1
}) {
  if (isVictory) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-dvh max-w-md mx-auto px-6 gap-6"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(251,191,36,0.18) 0%, transparent 70%), linear-gradient(to bottom, #0d0d1e, #1a1040)',
        }}
      >
        <VictoryBurst />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-4xl font-black text-yellow-400 tracking-widest">VICTORY!</p>
          <p className="text-white/60 mt-2 text-lg">All worlds conquered</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.04 }}
          onClick={onRestart}
          className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer"
        >
          Play Again
        </motion.button>
      </div>
    )
  }

  if (won) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-dvh max-w-md mx-auto px-6 gap-6"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(251,191,36,0.12) 0%, transparent 70%), linear-gradient(to bottom, #0d0d1e, #1a1040)',
        }}
      >
        {/* World / battle label */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/50 text-base font-semibold tracking-widest uppercase"
        >
          {worldName} · {battleNum}/{totalBattles}
        </motion.p>

        {/* Trophy */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
        >
          <span style={{ fontSize: 96, filter: TROPHY_FILTER[trophy] ?? TROPHY_FILTER.gold }}>
            🏆
          </span>
        </motion.div>

        {/* Trophy label */}
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.45 }}
          className="text-2xl font-black tracking-widest"
          style={{
            color: trophy === 'gold' ? '#fbbf24' : trophy === 'silver' ? '#cbd5e1' : '#b45309',
          }}
        >
          {TROPHY_LABEL[trophy]}
        </motion.p>

        {/* World progress dots — filled = completed, outlined = upcoming */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: 8, alignItems: 'center' }}
        >
          {Array.from({ length: totalBattles }).map((_, i) => (
            <svg key={i} width="13" height="13" viewBox="0 0 13 13">
              <circle
                cx="6.5" cy="6.5" r="5.5"
                fill={i < battleNum ? '#fbbf24' : 'none'}
                stroke={i < battleNum ? '#fbbf24' : 'rgba(255,255,255,0.25)'}
                strokeWidth="1.5"
              />
            </svg>
          ))}
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.04 }}
          onClick={onContinue}
          className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
        >
          CONTINUE →
        </motion.button>
      </div>
    )
  }

  // Game over
  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh max-w-md mx-auto px-6 gap-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.10) 0%, transparent 70%), linear-gradient(to bottom, #0d0d1e, #1a1040)',
      }}
    >
      <Gravestone />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-3xl font-black text-white/80 tracking-widest">GAME OVER</p>
        <p className="text-white/40 mt-1">Fell in {worldName}</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
        onClick={onRestart}
        className="w-full bg-slate-700 border-b-4 border-slate-900 text-white font-black text-3xl rounded-2xl h-16 shadow-xl cursor-pointer"
      >
        ↺
      </motion.button>
    </div>
  )
}
