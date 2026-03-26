import { useState } from 'react'
import { motion } from 'framer-motion'
import { KingdomBackground, KingdomForeground, StrollingKnight } from '../components/KingdomScenery'
import { FlyingCreatures } from '../components/FlyingCreatures'
import { LogoBanner } from '../components/LogoBanner'

const NAME_KEY = 'numknight_player_name'
const DIFF_VALUES = ['easy', 'medium', 'hard']

export function NameEntryScreen({ difficulty, onDifficultyChange, lang, onLangChange, useRaster, onStart, t }) {
  const isRtl = lang === 'he'
  const [name, setName] = useState('')

  const canStart = name.trim().length > 0

  const handleStart = () => {
    if (!canStart) return
    const trimmed = name.trim()
    localStorage.setItem(NAME_KEY, trimmed)
    onStart(trimmed)
  }

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
      <FlyingCreatures difficulty={difficulty} useRaster={useRaster} />
      {useRaster ? (
        <img
          src={`${import.meta.env.BASE_URL}assets/backgrounds/title.webp`}
          alt=""
          style={{
            position: 'absolute', bottom: 0, left: 0, width: '100%', display: 'block',
            zIndex: 1, pointerEvents: 'none',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%)',
            filter: difficulty === 'easy' ? 'brightness(1.25)' : difficulty === 'hard' ? 'brightness(0.55) saturate(0.7)' : 'brightness(1)',
            transition: 'filter 0.5s ease',
          }}
        />
      ) : (
        <>
          <KingdomBackground />
          <KingdomForeground difficulty={difficulty} />
        </>
      )}
      <StrollingKnight useRaster={useRaster} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 4 }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 4 }}>
          <LogoBanner />
        </div>

        {/* Name input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
            {t?.optionsName ?? 'YOUR NAME'}
          </p>
          <input
            dir={isRtl ? 'rtl' : 'ltr'}
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 16))}
            onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
            placeholder={t?.namePlaceholder ?? 'Enter your name...'}
            maxLength={16}
            autoFocus
            style={{
              width: '100%', borderRadius: 12,
              border: '1.5px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.12)',
              color: 'white', padding: '14px 16px', fontSize: 18,
              outline: 'none', boxSizing: 'border-box', textAlign: 'center',
              fontWeight: 700,
            }}
          />
        </div>

        {/* Difficulty */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
            {t?.optionsDifficulty ?? 'DIFFICULTY'}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {DIFF_VALUES.map((val) => {
              const selected = difficulty === val
              return (
                <motion.button
                  key={val}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onDifficultyChange(val)}
                  style={{
                    flex: 1, padding: '11px 4px', borderRadius: 12,
                    border: selected ? '2px solid #d97706' : '2px solid rgba(255,255,255,0.25)',
                    background: selected ? '#fbbf24' : 'rgba(0,0,0,0.35)',
                    color: selected ? '#1a1a2e' : 'rgba(255,255,255,0.8)',
                    boxShadow: selected ? '0 3px 0 #92400e' : '0 2px 0 rgba(0,0,0,0.4)',
                    fontWeight: 900, fontSize: 13, cursor: 'pointer',
                    transition: 'all 0.15s', letterSpacing: '0.04em',
                  }}
                >
                  {t?.diffLabel?.[val] ?? val}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Language */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ key: 'en', label: 'English' }, { key: 'he', label: 'עברית' }].map(({ key, label }) => {
            const selected = lang === key
            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.94 }}
                onClick={() => onLangChange(key)}
                style={{
                  flex: 1, padding: '9px 8px', borderRadius: 12,
                  border: selected ? '2px solid #d97706' : '2px solid rgba(255,255,255,0.25)',
                  background: selected ? '#fbbf24' : 'rgba(0,0,0,0.35)',
                  color: selected ? '#1a1a2e' : 'rgba(255,255,255,0.8)',
                  boxShadow: selected ? '0 3px 0 #92400e' : '0 2px 0 rgba(0,0,0,0.4)',
                  fontWeight: 900, fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </motion.button>
            )
          })}
        </div>

        {/* Start button */}
        <motion.button
          whileTap={{ scale: canStart ? 0.95 : 1 }}
          whileHover={{ scale: canStart ? 1.03 : 1 }}
          onClick={handleStart}
          disabled={!canStart}
          className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-14 shadow-xl tracking-widest"
          style={{ opacity: canStart ? 1 : 0.4, cursor: canStart ? 'pointer' : 'not-allowed' }}
        >
          {t?.newGame ?? 'START GAME'}
        </motion.button>
      </motion.div>
    </div>
  )
}
