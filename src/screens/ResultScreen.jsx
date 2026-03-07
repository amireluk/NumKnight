import { motion } from 'framer-motion'
import { EnemyCharacter } from '../components/EnemyCharacter'
import { BattleBackground } from '../components/BattleBackground'
import { KnightBodySVG, KnightSwordArmSVG } from '../components/KnightCharacter'

export function ResultScreen({ worldName, worldId, enemy, totalScore, onRestart, onViewScores, lang, t }) {
  const isRtl = lang === 'he'
  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col h-dvh max-w-md mx-auto px-6 py-5 gap-4"
      style={{
        overflow: 'hidden',
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
        style={{ flexShrink: 0 }}
      >
        <p className="text-white font-black text-3xl tracking-wide">{t?.defeated ?? 'DEFEATED'}</p>
        {worldName && (
          <p className="text-white/40 text-xs font-black tracking-[0.35em] uppercase mt-1">
            {t?.fellAt ? t.fellAt(t.worldName?.[worldId] ?? worldName) : `Fell at ${worldName}`}
          </p>
        )}
      </motion.div>

      {/* Enemy victory arena — fills remaining space */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        style={{
          flex: 1, minHeight: 0,
          position: 'relative', overflow: 'hidden',
          borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <BattleBackground worldId={worldId} />

        {/* Dim overlay for drama */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 1 }} />

        {/* Fallen knight — large, centered at the bottom */}
        <div style={{
          position: 'absolute', bottom: 18, left: 0, right: 0, zIndex: 2,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          pointerEvents: 'none', overflow: 'visible',
        }}>
          <div style={{
            position: 'relative', width: 84, height: 112, overflow: 'visible',
            transform: 'rotate(-90deg) scale(0.75)',
            transformOrigin: 'center center',
          }}>
            <KnightBodySVG />
            <div style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', transformOrigin: '73px 58px' }}>
              <KnightSwordArmSVG />
            </div>
          </div>
        </div>

        {/* Sword planted pommel-up in the ground, right of knight */}
        <svg
          style={{ position: 'absolute', left: '55%', bottom: 0, zIndex: 2, pointerEvents: 'none' }}
          width="30" height="88" viewBox="0 0 30 88" fill="none"
        >
          {/* Pommel */}
          <ellipse cx="15" cy="7" rx="8.5" ry="6.5" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.5" />
          <ellipse cx="15" cy="6" rx="5.5" ry="3.5" fill="#b08070" opacity="0.55" />
          {/* Handle / grip wrap */}
          <rect x="12" y="12" width="6" height="20" rx="3" fill="#7c5040" stroke="#4e342e" strokeWidth="1.2" />
          <line x1="12" y1="16" x2="18" y2="16" stroke="#5a3828" strokeWidth="1.2" opacity="0.5" />
          <line x1="12" y1="20" x2="18" y2="20" stroke="#5a3828" strokeWidth="1.2" opacity="0.5" />
          <line x1="12" y1="24" x2="18" y2="24" stroke="#5a3828" strokeWidth="1.2" opacity="0.5" />
          {/* Crossguard */}
          <rect x="1" y="30" width="28" height="6" rx="3" fill="#6d4c41" stroke="#3e2723" strokeWidth="1.5" />
          {/* Blade (lower half buried in ground) */}
          <path d="M13 36 L17 36 L16 82 L15 88 L14 82Z" fill="#c8d0da" stroke="#424242" strokeWidth="0.9" />
          {/* Blade shine */}
          <line x1="14.5" y1="38" x2="14" y2="78" stroke="#e8eef4" strokeWidth="1.2" opacity="0.55" strokeLinecap="round" />
        </svg>

        {/* Enemy standing victorious — right side */}
        {enemy && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
            paddingBottom: 20, paddingRight: 16,
          }}>
            <EnemyCharacter phase="idle" enemy={enemy} hitKey={0} />
          </div>
        )}
      </motion.div>

      {/* Score panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 220, damping: 15 }}
        style={{
          flexShrink: 0,
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
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
        onClick={onViewScores}
        style={{ flexShrink: 0 }}
        className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-14 shadow-xl cursor-pointer tracking-widest"
      >
        {t?.seeScores ?? 'SEE SCORES'}
      </motion.button>
    </div>
  )
}
