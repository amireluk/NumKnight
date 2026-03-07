import { motion } from 'framer-motion'
import { KingdomBackground, KingdomForeground, StrollingKnight } from '../components/KingdomScenery'

export function StartScreen({ onNewGame, onViewLeaderboard, lang, onLangChange, t }) {
  const isRtl = lang === 'he'

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col items-center justify-center min-h-dvh max-w-md mx-auto px-6 gap-7 select-none"
      style={{
        position: 'relative',
        paddingBottom: 210,
        background:
          'radial-gradient(ellipse at 50% 20%, rgba(251,191,36,0.12) 0%, transparent 55%), ' +
          'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
      }}
    >
      {/* Language toggle */}
      <div dir="ltr" style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => onLangChange(lang === 'en' ? 'he' : 'en')}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 11px', borderRadius: 20, cursor: 'pointer',
            fontSize: 12, fontWeight: 900, letterSpacing: '0.06em',
            border: '1.5px solid rgba(255,255,255,0.22)',
            background: 'rgba(255,255,255,0.10)',
            color: 'rgba(255,255,255,0.70)',
            transition: 'all 0.15s',
          }}
        >
          {lang === 'en' ? 'EN' : 'עב'}
        </button>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <p className="font-black text-white tracking-widest" style={{
          fontSize: 52, lineHeight: 1,
          textShadow: '0 0 48px rgba(251,191,36,0.45), 0 2px 0 rgba(0,0,0,0.6)',
        }}>
          NumKnight
        </p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', fontWeight: 600, marginTop: 6, letterSpacing: '0.05em' }}>
          {isRtl ? 'נוצר על ידי אמיר אלוק' : 'Created by Amir Eluk'}
        </p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.20)', fontWeight: 600, marginTop: 2, letterSpacing: '0.12em' }}>
          v{__APP_VERSION__}
        </p>
      </motion.div>

      {/* New Game button */}
      <motion.button
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, type: 'spring', stiffness: 200, damping: 18 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={onNewGame}
        style={{ position: 'relative', zIndex: 1 }}
        className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
      >
        {t?.newGame ?? 'NEW GAME'}
      </motion.button>

      {/* Leaderboard button */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={onViewLeaderboard}
        style={{ position: 'relative', zIndex: 1 }}
        className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
      >
        {t?.kingdomRecords ?? 'KINGDOM RECORDS'}
      </motion.button>

      {/* Scenery layers */}
      <KingdomBackground difficulty="easy" />
      <StrollingKnight />
      <KingdomForeground difficulty="easy" />
    </div>
  )
}
