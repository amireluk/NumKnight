import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { isMuted, toggleMute } from '../game/sounds'
import { getLog } from '../game/runLog'
import { RunLogViewer } from '../components/RunLogViewer'
import { AnimatePresence } from 'framer-motion'
import { KingdomBackground, KingdomForeground, StrollingKnight } from '../components/KingdomScenery'
import { FlyingCreatures } from '../components/FlyingCreatures'

const NAME_KEY = 'numknight_player_name'
const DIFF_VALUES = ['easy', 'medium', 'hard']

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 900, letterSpacing: '0.22em',
      color: 'rgba(255,255,255,0.35)', marginBottom: 8,
      textTransform: 'uppercase',
    }}>
      {children}
    </p>
  )
}

function ToggleRow({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map(({ key, label }) => {
        const selected = value === key
        return (
          <motion.button
            key={key}
            whileTap={{ scale: 0.94 }}
            onClick={() => onChange(key)}
            style={{
              flex: 1, padding: '11px 8px', borderRadius: 12,
              border: selected ? '2px solid #d97706' : '2px solid rgba(255,255,255,0.25)',
              background: selected ? '#fbbf24' : 'rgba(0,0,0,0.35)',
              color: selected ? '#1a1a2e' : 'rgba(255,255,255,0.8)',
              boxShadow: selected ? '0 3px 0 #92400e' : '0 2px 0 rgba(0,0,0,0.4)',
              fontWeight: 900, fontSize: 13, cursor: 'pointer',
              letterSpacing: '0.04em', transition: 'all 0.15s',
            }}
          >
            {label}
          </motion.button>
        )
      })}
    </div>
  )
}

export function OptionsScreen({ difficulty, onDifficultyChange, useRaster, onRasterChange, lang, onLangChange, onBack, t }) {
  const isRtl = lang === 'he'

  const [name, setName]   = useState(() => localStorage.getItem(NAME_KEY) ?? '')
  const [muted, setMuted] = useState(() => isMuted())
  const [showLog, setShowLog] = useState(false)

  const hasLog = getLog().length > 0

  // Android hardware back → close options
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => onBack()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onBack])

  const handleNameChange = (v) => {
    const trimmed = v.slice(0, 16)
    setName(trimmed)
    localStorage.setItem(NAME_KEY, trimmed)
  }

  const handleMuteToggle = () => {
    toggleMute()
    setMuted(isMuted())
  }

  const totalQuestions = (diff) => {
    // imported lazily to avoid circular deps — just show diff without count
    return null
  }

  const SECTION_GAP = 22

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col h-dvh max-w-md mx-auto"
      style={{
        position: 'relative', overflow: 'hidden',
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.08) 0%, transparent 55%), ' +
          'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
      }}
    >
      <FlyingCreatures />
      <KingdomBackground />
      <StrollingKnight />
      <KingdomForeground />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px 14px', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'relative', zIndex: 1,
      }}>
        <p style={{ fontSize: 15, fontWeight: 900, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.9)' }}>
          {t?.optionsTitle ?? 'OPTIONS'}
        </p>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(0,0,0,0.35)', border: '1.5px solid rgba(255,255,255,0.18)',
            borderRadius: 8, padding: '5px 12px',
            fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer', letterSpacing: '0.04em',
          }}
        >
          ✕
        </button>
      </div>

      {/* Settings list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', gap: SECTION_GAP, position: 'relative', zIndex: 1 }}>

        {/* Name */}
        <div>
          <SectionLabel>{t?.optionsName ?? 'YOUR NAME'}</SectionLabel>
          <input
            dir={isRtl ? 'rtl' : 'ltr'}
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={t?.namePlaceholder ?? 'Enter your name...'}
            maxLength={16}
            style={{
              width: '100%', borderRadius: 12,
              border: '1.5px solid rgba(255,255,255,0.16)',
              background: 'rgba(255,255,255,0.12)',
              color: 'white', padding: '12px 14px', fontSize: 16,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Language */}
        <div>
          <SectionLabel>{t?.optionsLanguage ?? 'LANGUAGE'}</SectionLabel>
          <ToggleRow
            value={lang}
            options={[{ key: 'en', label: 'English' }, { key: 'he', label: 'עברית' }]}
            onChange={onLangChange}
          />
        </div>

        {/* Difficulty */}
        <div>
          <SectionLabel>{t?.optionsDifficulty ?? 'DIFFICULTY'}</SectionLabel>
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

        {/* Graphics */}
        <div>
          <SectionLabel>{t?.optionsGraphics ?? 'GRAPHICS'}</SectionLabel>
          <ToggleRow
            value={useRaster ? 'img' : 'svg'}
            options={[
              { key: 'svg', label: t?.optionsGraphicsSvg ?? 'Classic' },
              { key: 'img', label: t?.optionsGraphicsImg ?? 'Illustrated' },
            ]}
            onChange={(v) => onRasterChange(v === 'img')}
          />
        </div>

        {/* Sound */}
        <div>
          <SectionLabel>{t?.optionsSound ?? 'SOUND'}</SectionLabel>
          <ToggleRow
            value={muted ? 'off' : 'on'}
            options={[
              { key: 'on',  label: t?.optionsSoundOn  ?? 'On' },
              { key: 'off', label: t?.optionsSoundOff ?? 'Off' },
            ]}
            onChange={(v) => { if ((v === 'off') !== muted) handleMuteToggle() }}
          />
        </div>

        {/* View Game Log */}
        {hasLog && (
          <div>
            <SectionLabel>{' '}</SectionLabel>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowLog(true)}
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 12,
                border: '1.5px solid rgba(251,191,36,0.35)',
                background: 'rgba(251,191,36,0.08)',
                color: 'rgba(251,191,36,0.85)',
                fontWeight: 800, fontSize: 14, cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              {t?.optionsViewLog ?? 'View Game Log'}
            </motion.button>
          </div>
        )}

      </div>

      {/* Log overlay */}
      <AnimatePresence>
        {showLog && <RunLogViewer onClose={() => setShowLog(false)} />}
      </AnimatePresence>
    </div>
  )
}
