import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { KingdomBackground, KingdomForeground, StrollingKnight } from '../components/KingdomScenery'
import { FlyingCreatures } from '../components/FlyingCreatures'
import { loadRun, isRunInProgress } from '../game/runState'
import { LogoBanner } from '../components/LogoBanner'
import { EASY, MEDIUM, HARD } from '../game/campaign.config'

const CONFIGS = { easy: EASY, medium: MEDIUM, hard: HARD }

export function StartScreen({ onNewGame, onContinue, onOptions, onViewLeaderboard, onPractice, playerName, difficulty, lang, t }) {
  const isRtl = lang === 'he'
  const run = loadRun()
  const canContinue = isRunInProgress(run)
  const worlds = CONFIGS[difficulty] ?? MEDIUM
  const savedWorldName = run ? (worlds[run.worldIndex]?.name ?? '') : ''
  const savedDiffLabel = t?.diffLabel?.[difficulty] ?? difficulty

  // Android hardware back — no-op on home screen (lets OS handle it)
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col items-center justify-center h-dvh max-w-md mx-auto px-6 select-none"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: 210,
        background:
          'radial-gradient(ellipse at 50% 20%, rgba(251,191,36,0.12) 0%, transparent 55%), ' +
          'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
      }}
    >
      {/* ── Persistent background — never remounts ── */}
      <FlyingCreatures difficulty={difficulty} />
      <KingdomBackground />
      <StrollingKnight />
      <KingdomForeground difficulty={difficulty} />

      {/* ── UI panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}
      >
        {/* Title */}
        <div>
          <LogoBanner />
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', fontWeight: 600, marginTop: 10, letterSpacing: '0.05em', textAlign: 'center' }}>
            {isRtl ? 'נוצר על ידי אמיר אלוק' : 'Created by Amir Eluk'}
          </p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.20)', fontWeight: 600, marginTop: 2, letterSpacing: '0.12em', textAlign: 'center' }}>
            v{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : ''}
          </p>
        </div>

        {/* NEW RUN / CONTINUE RUN — single button */}
        <motion.button
          whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
          onClick={canContinue ? onContinue : onNewGame}
          className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
        >
          <span style={{ lineHeight: 1 }}>
            {canContinue ? (t?.continueRun ?? 'CONTINUE RUN') : (t?.newGame ?? 'NEW RUN')}
          </span>
          {canContinue && (
            <span dir="ltr" style={{ fontSize: 11, fontWeight: 700, opacity: 0.60, letterSpacing: '0.05em', lineHeight: 1 }}>
              {[playerName, savedWorldName, savedDiffLabel].filter(Boolean).join(' · ')}
            </span>
          )}
        </motion.button>

        {/* PRACTICE — full width */}
        <motion.button
          whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
          onClick={onPractice}
          className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
        >
          {t?.practice ?? 'PRACTICE'}
        </motion.button>

        {/* OPTIONS */}
        <motion.button
          whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
          onClick={onOptions}
          className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-14 shadow-xl cursor-pointer tracking-widest"
        >
          {t?.optionsTitle ?? 'OPTIONS'}
        </motion.button>

        {/* HALL OF FAME */}
        <motion.button
          whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
          onClick={onViewLeaderboard}
          className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-14 shadow-xl cursor-pointer tracking-widest"
        >
          {t?.hallOfFameTitle ?? 'HALL OF FAME'}
        </motion.button>

      </motion.div>
    </div>
  )
}
