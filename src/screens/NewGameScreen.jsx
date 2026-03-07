import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { KingdomBackground, KingdomForeground, StrollingKnight } from '../components/KingdomScenery'
import { CAMPAIGN } from '../game/campaign.config'

const NAME_KEY = 'numknight_player_name'

const DIFF_VALUES = ['easy', 'medium', 'hard']
const DIFF_COLOR  = { easy: '#4ade80', medium: '#fbbf24', hard: '#ef4444' }

const totalQuestions = (diff) =>
  CAMPAIGN[diff].reduce((sum, w) => sum + w.battles * w.enemy.hp, 0)

export function NewGameScreen({ onStart, onBack, lang, t }) {
  const isRtl = lang === 'he'

  const [name, setName]           = useState(() => localStorage.getItem(NAME_KEY) ?? '')
  const [nameError, setNameError] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const nameShake = useAnimation()

  // Android hardware back → main screen
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => { onBack() }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onBack])

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
      {/* Back button */}
      <div dir="ltr" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', position: 'relative', zIndex: 1 }}>
        <button
          onClick={onBack}
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
          {isRtl ? '← חזור' : '← Back'}
        </button>
      </div>

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ width: '100%', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          animate={nameShake}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}
        >
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
              color: 'white', padding: '13px 16px',
              fontSize: 17, outline: 'none',
              boxSizing: 'border-box', transition: 'border-color 0.2s, background 0.2s',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Difficulty picker */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7, position: 'relative', zIndex: 1 }}
      >
        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 700, letterSpacing: '0.22em' }}>
          {t?.difficulty ?? 'DIFFICULTY'}
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {DIFF_VALUES.map((val) => {
            const selected = difficulty === val
            const color = DIFF_COLOR[val]
            return (
              <motion.button
                key={val}
                onClick={() => setDifficulty(val)}
                whileTap={{ scale: 0.94 }}
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
      </motion.div>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 18 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={handleStart}
        style={{ position: 'relative', zIndex: 1 }}
        className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
      >
        {t?.startAdventure ?? 'START ADVENTURE'}
      </motion.button>

      {/* Scenery — only the castle changes with difficulty */}
      <KingdomBackground />
      <StrollingKnight />
      <KingdomForeground difficulty={difficulty} />
    </div>
  )
}
