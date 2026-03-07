import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { saveScore, loadScores, clearScores } from '../game/scoreState'

const DIFF_LABEL_DEFAULT = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const DIFF_COLOR = { easy: '#4ade80', medium: '#fbbf24', hard: '#ef4444' }

const WORLD_ID_BY_NAME = {
  'Forest': 'forest', 'Swamp': 'swamp', 'Mountains': 'mountains',
  'Castle': 'castle', 'Dragon Lair': 'dragonLair',
}
const worldDisplayName = (name, t) => (t?.worldName?.[WORLD_ID_BY_NAME[name]]) ?? name

const NAME_KEY = 'numknight_player_name'

export function LeaderboardScreen({ totalScore, endWorld, cleared, difficulty, playerName, onBack, lang, t }) {
  const isRtl = lang === 'he'
  const [[scores, newScoreIndex]] = useState(() => {
    const name = playerName || localStorage.getItem(NAME_KEY) || 'Knight'
    if (name) localStorage.setItem(NAME_KEY, name)
    if (totalScore > 0) {
      saveScore(difficulty, {
        name,
        score: totalScore,
        date: new Date().toLocaleDateString(),
        endWorld,
        cleared,
        version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '',
      })
    }
    const list = loadScores(difficulty)
    const idx = totalScore > 0
      ? list.findIndex(e => e.score === totalScore && e.endWorld === endWorld && e.cleared === cleared)
      : -1
    return [list, idx]
  })

  const [clearConfirm, setClearConfirm] = useState(false)
  const [displayScores, setDisplayScores] = useState(scores)

  // Android hardware back button support
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => { onBack() }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onBack])

  const handleClear = () => {
    if (!clearConfirm) { setClearConfirm(true); return }
    clearScores(difficulty)
    setDisplayScores([])
    setClearConfirm(false)
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col h-dvh max-w-md mx-auto px-4 py-5 gap-4"
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.12) 0%, transparent 65%), ' +
          'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}
      >
        <p className="text-white font-black text-3xl tracking-wide">{t?.kingdomRecords ?? 'Kingdom Records'}</p>
        <span style={{
          background: DIFF_COLOR[difficulty], color: '#000',
          borderRadius: 99, padding: '2px 14px',
          fontSize: 11, fontWeight: 900, letterSpacing: '0.08em',
        }}>
          {(t?.diffLabel ?? DIFF_LABEL_DEFAULT)[difficulty] ?? difficulty}
        </span>
      </motion.div>

      {/* Scores list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Array.from({ length: 3 }, (_, i) => {
          const entry = displayScores[i] ?? null
          const isNew = entry && i === newScoreIndex
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 + i * 0.04 }}
              style={{
                background: isNew ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.04)',
                border: `${isNew ? 2 : 1}px solid ${isNew ? 'rgba(251,191,36,0.75)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 12,
                padding: isNew ? '13px 14px' : '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                transform: isNew ? 'scale(1.025)' : 'scale(1)',
                transformOrigin: 'center',
                boxShadow: isNew ? '0 0 18px rgba(251,191,36,0.22)' : 'none',
              }}
            >
              <span style={{
                fontSize: isNew ? 15 : 13,
                width: 26, textAlign: 'center',
                color: isNew ? '#fbbf24' : 'rgba(255,255,255,0.25)',
                fontWeight: 900, flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {entry ? (
                  <>
                    <span style={{
                      color: isNew ? '#fff' : 'rgba(255,255,255,0.85)',
                      fontWeight: isNew ? 900 : 700, fontSize: isNew ? 15 : 14,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {entry.name}
                      {isNew && (
                        <span style={{
                          marginLeft: 8, fontSize: 9, fontWeight: 900, letterSpacing: '0.12em',
                          background: '#fbbf24', color: '#000',
                          borderRadius: 4, padding: '1px 5px', verticalAlign: 'middle',
                        }}>
                          NEW
                        </span>
                      )}
                    </span>
                    {entry.version && (
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', fontWeight: 600, letterSpacing: '0.08em' }}>
                        v{entry.version}
                      </span>
                    )}
                  </>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 13, fontWeight: 700 }}>—</span>
                )}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                color: entry?.cleared ? '#fbbf24' : 'rgba(255,255,255,0.18)',
                flexShrink: 0, minWidth: 60, textAlign: 'center',
              }}>
                {entry
                  ? (entry.cleared ? (t?.conquered ?? 'CONQUERED') : (t?.fellAtShort ? t.fellAtShort(worldDisplayName(entry.endWorld ?? '', t)) : (entry.endWorld ?? '')))
                  : '—'}
              </span>
              <span style={{
                color: isNew ? '#fbbf24' : entry ? 'rgba(251,191,36,0.85)' : 'rgba(255,255,255,0.12)',
                fontWeight: 900, fontSize: isNew ? 18 : 16,
                flexShrink: 0, minWidth: 40, textAlign: 'right',
              }}>
                {entry ? entry.score.toLocaleString() : '—'}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Clear button — right after the table */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
        <motion.button
          onClick={handleClear}
          onBlur={() => setClearConfirm(false)}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '9px 14px', borderRadius: 10, cursor: 'pointer',
            fontSize: 11, fontWeight: 900, letterSpacing: '0.06em',
            border: `1.5px solid ${clearConfirm ? 'rgba(239,68,68,0.8)' : 'rgba(255,255,255,0.14)'}`,
            background: clearConfirm ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.06)',
            color: clearConfirm ? '#ef4444' : 'rgba(255,255,255,0.30)',
            transition: 'all 0.18s',
          }}
        >
          {clearConfirm ? (t?.confirmClear ?? '⚠ YES, ERASE ALL') : (t?.clearBoard ?? 'Clear all scores')}
        </motion.button>
        {clearConfirm && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, textAlign: 'center' }}
          >
            {t?.clearWarning ?? '⚠ This will permanently erase all scores'}
          </motion.p>
        )}
      </div>

      {/* Spacer so back button is visually separated */}
      <div style={{ flexShrink: 0, height: 8 }} />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={onBack}
        className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-14 shadow-xl cursor-pointer tracking-widest"
        style={{ flexShrink: 0 }}
      >
        {t?.back ?? 'BACK'}
      </motion.button>
    </div>
  )
}
