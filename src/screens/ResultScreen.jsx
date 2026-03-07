import { motion } from 'framer-motion'
import { FallenKnightScene } from '../components/KnightCharacter'

export function ResultScreen({ worldName, totalScore, onRestart, onViewScores, lang, t }) {
  const isRtl = lang === 'he'
  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col items-center justify-center min-h-dvh max-w-md mx-auto px-6 gap-5"
      style={{
        background:
          'radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.07) 0%, transparent 65%), ' +
          'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="text-center"
      >
        <p className="text-white font-black text-3xl tracking-wide">{t?.defeated ?? 'DEFEATED'}</p>
        {worldName && (
          <p className="text-white/40 text-xs font-black tracking-[0.35em] uppercase mt-1">
            {t?.fellAt ? t.fellAt(worldName) : `Fell at ${worldName}`}
          </p>
        )}
      </motion.div>

      {/* Fallen knight illustration */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 15, delay: 0.1 }}
        style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 0 32px rgba(0,0,0,0.5)' }}
      >
        <FallenKnightScene />
      </motion.div>

      {/* Score panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.38, type: 'spring', stiffness: 220, damping: 15 }}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.30)',
          borderRadius: 16, padding: '14px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 700, letterSpacing: '0.15em' }}>
          {t?.finalScore ?? 'FINAL SCORE'}
        </span>
        <span style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>
          {(totalScore ?? 0).toLocaleString()}
        </span>
      </motion.div>

      {/* See scores */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
        onClick={onViewScores}
        className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
      >
        {t?.seeScores ?? 'SEE SCORES'}
      </motion.button>
    </div>
  )
}
