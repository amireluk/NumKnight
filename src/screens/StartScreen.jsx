/* eslint-disable no-undef */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useLongPress } from '../hooks/useLongPress'
import { KingdomBackground, KingdomForeground, StrollingKnight } from '../components/KingdomScenery'
import { FlyingCreatures } from '../components/FlyingCreatures'
import { CAMPAIGN } from '../game/campaign.config'
import { isRunInProgress, hasSavedBattle } from '../game/runState'
import { playMapTap } from '../game/sounds'
import { LogoBanner } from '../components/LogoBanner'

const NAME_KEY    = 'numknight_player_name'
const DIFF_KEY    = 'numknight_difficulty'
const DIFF_VALUES = ['easy', 'medium', 'hard']
const DIFF_COLOR  = { easy: '#4ade80', medium: '#fbbf24', hard: '#ef4444' }
const totalQuestions = (diff) =>
  CAMPAIGN[diff].reduce((sum, w) => sum + w.battles * w.enemy.hp, 0)

// Merged start + new-game screen — background layers never remount when toggling views
export function StartScreen({ onStart, onContinue, run, onViewLeaderboard, onLogoLongPress, lang, onLangChange, t }) {
  const isRtl = lang === 'he'
  const logoLongPress = useLongPress(onLogoLongPress ?? (() => {}))
  const canContinue = isRunInProgress(run) || hasSavedBattle()

  const [view,       setView]       = useState('home')
  const [name,       setName]       = useState(() => localStorage.getItem(NAME_KEY) ?? '')
  const [nameError,  setNameError]  = useState(false)
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem(DIFF_KEY) ?? 'medium')

  const savedWorld    = canContinue ? CAMPAIGN[difficulty]?.[run?.worldIndex] ?? null : null
  const savedName     = localStorage.getItem(NAME_KEY) ?? ''
  const savedDiffLabel = t?.diffLabel?.[difficulty] ?? difficulty
  const handleDifficulty = (val) => { setDifficulty(val); localStorage.setItem(DIFF_KEY, val) }
  const nameShake = useAnimation()

  // Android back: newgame view → home view; home view → no listener (back closes/minimizes app)
  useEffect(() => {
    if (view !== 'newgame') return
    window.history.pushState(null, '', window.location.href)
    const onPop = () => setView('home')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [view])

  const handleStart = () => {
    const trimmed = name.trim().slice(0, 16)
    if (!trimmed) {
      setNameError(true)
      nameShake.start({ x: [0, -10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.4 } })
      return
    }
    localStorage.setItem(NAME_KEY, trimmed)
    onStart({ name: trimmed, diff: difficulty })
  }

  const flyDiff = difficulty

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
      <FlyingCreatures difficulty={flyDiff} />
      <KingdomBackground />
      <StrollingKnight />
      <KingdomForeground difficulty={difficulty} />

      {/* ── Animated UI panel ── */}
      <AnimatePresence mode="wait">

        {/* HOME view */}
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 28, position: 'relative', zIndex: 1 }}
          >
            {/* Title */}
            <div>
              <LogoBanner logoLongPress={logoLongPress} />
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', fontWeight: 600, marginTop: 10, letterSpacing: '0.05em', textAlign: 'center' }}>
                {isRtl ? 'נוצר על ידי אמיר אלוק' : 'Created by Amir Eluk'}
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.20)', fontWeight: 600, marginTop: 2, letterSpacing: '0.12em', textAlign: 'center' }}>
                v{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : ''}
              </p>
            </div>

            {canContinue && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={onContinue}
                className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
              >
                <span style={{ lineHeight: 1 }}>{t?.continueRun ?? 'CONTINUE'}</span>
                {savedWorld && (
                  <span dir="ltr" style={{ fontSize: 11, fontWeight: 700, opacity: 0.60, letterSpacing: '0.05em', lineHeight: 1 }}>
                    {[
                      savedName,
                      savedDiffLabel,
                      t?.worldName?.[savedWorld.id] ?? savedWorld.name,
                      savedWorld.battles > 1 ? `${run.battleIndex + 1}/${savedWorld.battles}` : null,
                    ].filter(Boolean).join(' · ')}
                  </span>
                )}
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
              onClick={() => setView('newgame')}
              className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
            >
              {t?.newGame ?? 'NEW GAME'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
              onClick={onViewLeaderboard}
              className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
            >
              {t?.hallOfFameTitle ?? 'HALL OF FAME'}
            </motion.button>

            <div dir="ltr" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => onLangChange(lang === 'en' ? 'he' : 'en')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 14px', borderRadius: 20, cursor: 'pointer',
                  fontSize: 12, fontWeight: 900, letterSpacing: '0.06em',
                  border: '1.5px solid rgba(255,255,255,0.22)',
                  background: 'rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.70)',
                }}
              >
                🌐 {lang === 'en' ? 'EN' : 'עב'}
              </button>
            </div>
          </motion.div>
        )}

        {/* NEW GAME view */}
        {view === 'newgame' && (
          <motion.div
            key="newgame"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 22, position: 'relative', zIndex: 1 }}
          >
            {/* Title — same banner as home screen */}
            <div style={{ position: 'relative' }}>
              <LogoBanner />
              <button
                dir="ltr"
                onClick={() => setView('home')}
                style={{
                  position: 'absolute', top: 0, right: 0, zIndex: 2,
                  background: 'rgba(0,0,0,0.35)', border: '1.5px solid rgba(255,255,255,0.18)',
                  borderRadius: 8, padding: '4px 10px',
                  fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer', letterSpacing: '0.04em',
                }}
              >
                ✕
              </button>
            </div>

            {/* Name input */}
            <motion.div animate={nameShake} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 11, color: nameError ? '#ef4444' : 'rgba(255,255,255,0.38)', fontWeight: 700, letterSpacing: '0.22em', transition: 'color 0.2s' }}>
                {t?.yourName ?? 'YOUR NAME'}
              </label>
              <input
                dir={isRtl ? 'rtl' : 'ltr'}
                value={name}
                onChange={(e) => { setName(e.target.value.slice(0, 16)); setNameError(false) }}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                placeholder={t?.namePlaceholder ?? 'Enter your name...'}
                maxLength={16}
                style={{
                  width: '100%', borderRadius: 14,
                  border: `1.5px solid ${nameError ? '#ef4444' : 'rgba(255,255,255,0.16)'}`,
                  background: nameError ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.18)',
                  color: 'white', padding: '13px 16px', fontSize: 17, outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.2s, background 0.2s',
                }}
              />
            </motion.div>

            {/* Difficulty */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 700, letterSpacing: '0.22em' }}>
                {t?.difficulty ?? 'DIFFICULTY'}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {DIFF_VALUES.map((val) => {
                  const selected = difficulty === val
                  const color    = DIFF_COLOR[val]
                  return (
                    <motion.button
                      key={val}
                      onClick={() => { handleDifficulty(val); playMapTap() }}
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.04 }}
                      style={{
                        flex: 1, padding: '11px 4px', borderRadius: 14,
                        border: `2px solid ${selected ? color : 'rgba(255,255,255,0.11)'}`,
                        background: selected ? `${color}2e` : 'rgba(255,255,255,0.12)',
                        color: selected ? color : 'rgba(255,255,255,0.35)',
                        fontWeight: 900, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      }}
                    >
                      <span>{t?.diffLabel?.[val] ?? val}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.65, letterSpacing: '0.04em' }}>
                        {totalQuestions(val)} {t?.questions ?? 'questions'}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Start */}
            <motion.button
              whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
              onClick={handleStart}
              className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
            >
              {t?.startAdventure ?? 'START ADVENTURE'}
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
