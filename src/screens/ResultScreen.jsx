import { motion } from 'framer-motion'

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
        <path d="M8 112 Q14 106 20 112"  stroke="#3e5635" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M76 112 Q82 106 88 112" stroke="#3e5635" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

export function ResultScreen({ won, worldName, onRestart }) {
  // Game over (won === false)
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
        {worldName && (
          <p className="text-white/45 mt-2 text-base tracking-wide">
            Fell at {worldName}
          </p>
        )}
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
