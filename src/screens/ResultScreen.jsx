/* eslint-disable no-undef */
import { motion } from 'framer-motion'
import { EnemyCharacter } from '../components/EnemyCharacter'
import { BattleBackground } from '../components/BattleBackground'
import { KnightBodySVG, KnightSwordArmSVG } from '../components/KnightCharacter'

const _V    = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'
const _BASE = import.meta.env.BASE_URL
const DEAD_SPRITE = `${_BASE}assets/characters/knight/knight-dead.webp?v=${_V}`

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
          {localStorage.getItem('numknight_raster_bg') === 'true' ? (
            <img src={DEAD_SPRITE} style={{ width: 180, height: 'auto' }} alt="" />
          ) : (
            <div style={{
              position: 'relative', width: 84, height: 112, overflow: 'visible',
              transform: 'rotate(-90deg) scale(0.75)', transformOrigin: 'center center',
            }}>
              <KnightBodySVG />
              <div style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', transformOrigin: '73px 58px' }}>
                <KnightSwordArmSVG />
              </div>
            </div>
          )}
        </div>

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
