import { motion } from 'framer-motion'

const TROPHY_FILTER = {
  gold:   'drop-shadow(0 0 18px rgba(251,191,36,0.9))',
  silver: 'grayscale(1) brightness(1.5) contrast(0.85)',
  bronze: 'sepia(1) saturate(1.4) hue-rotate(-10deg) brightness(0.82)',
}

export function AreaClearedScreen({ world, worldTrophies, onContinue }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh max-w-md mx-auto px-6 gap-6"
      style={{
        background:
          'radial-gradient(ellipse at 50% 38%, rgba(251,191,36,0.13) 0%, transparent 65%), ' +
          'linear-gradient(to bottom, #0d0d1e, #1a1040)',
      }}
    >
      {/* World icon — bounces in */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        style={{ fontSize: 76, lineHeight: 1 }}
      >
        {world.icon}
      </motion.div>

      {/* "Area Cleared" + world name */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.35 }}
      >
        <p className="text-white/45 text-xs font-black tracking-[0.35em] uppercase mb-1">
          Area Cleared
        </p>
        <p className="text-white font-black text-3xl tracking-wide">
          {world.name}
        </p>
      </motion.div>

      {/* Trophy row — one badge per battle, staggered */}
      <div style={{ display: 'flex', gap: 22, alignItems: 'flex-end', justifyContent: 'center' }}>
        {worldTrophies.map((trophy, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.48 + i * 0.16, type: 'spring', stiffness: 260, damping: 16 }}
          >
            <span style={{ fontSize: 52, filter: TROPHY_FILTER[trophy] }}>🏆</span>
          </motion.div>
        ))}
      </div>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, type: 'spring', stiffness: 210, damping: 18 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
        onClick={onContinue}
        className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest mt-2"
      >
        CONTINUE →
      </motion.button>
    </div>
  )
}
