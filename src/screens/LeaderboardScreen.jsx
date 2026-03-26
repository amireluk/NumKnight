import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { saveScore, loadScores, clearScores } from '../game/scoreState'

const DIFF_COLOR = { easy: '#4ade80', medium: '#fbbf24', hard: '#ef4444' }
const DIFF_LABEL_DEFAULT = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

const WORLD_ID_BY_NAME = {
  'Forest': 'forest', 'Swamp': 'swamp', 'Mountains': 'mountains',
  'Castle': 'castle', 'Dragon Lair': 'dragonLair',
}
const worldDisplayName = (name, t) => (t?.worldName?.[WORLD_ID_BY_NAME[name]]) ?? name

const NAME_KEY = 'numknight_player_name'

export function LeaderboardScreen({ totalScore, endWorld, cleared, difficulty, playerName, onBack, useRaster, lang, t }) {
  const isRtl = lang === 'he'
  const diffLabels = t?.diffLabel ?? DIFF_LABEL_DEFAULT

  const [[scores, newScoreIndex]] = useState(() => {
    const name = playerName || localStorage.getItem(NAME_KEY) || ''
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
    const all = loadScores()
    const idx = totalScore > 0
      ? all.findIndex(e => e.score === totalScore && e.endWorld === endWorld && e.cleared === cleared && e.difficulty === difficulty)
      : -1
    return [all, idx]
  })

  const [displayScores, setDisplayScores] = useState(scores)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [clearConfirmReady, setClearConfirmReady] = useState(false)

  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => onBack()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onBack])

  const handleClear = () => {
    if (!clearConfirm) {
      setClearConfirm(true)
      setClearConfirmReady(false)
      setTimeout(() => setClearConfirmReady(true), 1000)
      return
    }
    if (!clearConfirmReady) return
    clearScores()
    setDisplayScores([])
    setClearConfirm(false)
    setClearConfirmReady(false)
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col h-dvh max-w-md mx-auto py-5 gap-4"
      style={{
        position: 'relative',
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
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}
      >
        <p className="text-white font-black text-3xl tracking-wide">{t?.hallOfFameTitle ?? 'HALL OF FAME'}</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.06em' }}>
          {t?.kingdomRecords ?? 'Kingdom Records'}
        </p>
      </motion.div>

      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingInline: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {displayScores.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, fontWeight: 700 }}>
              {t?.noScores ?? 'No scores yet — be the first!'}
            </p>
          </div>
        ) : (
          displayScores.map((entry, i) => {
            const isNew = i === newScoreIndex
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isRtl ? 18 : -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
                style={{
                  background: isNew ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.04)',
                  border: `${isNew ? 2 : 1}px solid ${isNew ? 'rgba(251,191,36,0.75)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12,
                  padding: isNew ? '11px 12px' : '9px 12px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transform: isNew ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isNew ? '0 0 18px rgba(251,191,36,0.22)' : 'none',
                  flexShrink: 0,
                }}
              >
                {/* Rank */}
                <span style={{
                  fontSize: isNew ? 15 : 13, width: 24, textAlign: 'center',
                  color: isNew ? '#fbbf24' : 'rgba(255,255,255,0.25)',
                  fontWeight: 900, flexShrink: 0,
                }}>
                  {i + 1}
                </span>

                {/* Name + version */}
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
                    <span style={{
                      color: isNew ? '#fff' : 'rgba(255,255,255,0.85)',
                      fontWeight: isNew ? 900 : 700, fontSize: isNew ? 14 : 13,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      flex: 1, minWidth: 0,
                    }}>
                      {entry.name}
                    </span>
                    {isNew && (
                      <span style={{
                        flexShrink: 0, fontSize: 9, fontWeight: 900, letterSpacing: '0.12em',
                        background: '#fbbf24', color: '#000', borderRadius: 4, padding: '1px 5px',
                      }}>
                        {t?.newBadge ?? 'NEW'}
                      </span>
                    )}
                  </span>
                  {entry.version && (
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', fontWeight: 600, letterSpacing: '0.08em' }}>
                      v{entry.version}
                    </span>
                  )}
                </span>

                {/* Difficulty badge */}
                <span style={{
                  flexShrink: 0,
                  background: DIFF_COLOR[entry.difficulty] ?? 'rgba(255,255,255,0.2)',
                  color: '#000',
                  borderRadius: 99,
                  padding: '2px 7px',
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                }}>
                  {diffLabels[entry.difficulty] ?? entry.difficulty}
                </span>

                {/* Conquered / fell at */}
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                  color: entry.cleared ? '#fbbf24' : 'rgba(255,255,255,0.35)',
                  flexShrink: 0, minWidth: 52, textAlign: 'center',
                }}>
                  {entry.cleared
                    ? (t?.conquered ?? 'CONQUERED')
                    : (t?.fellAtShort ? t.fellAtShort(worldDisplayName(entry.endWorld ?? '', t)) : (entry.endWorld ?? ''))}
                </span>

                {/* Score */}
                <span style={{
                  color: isNew ? '#fbbf24' : 'rgba(251,191,36,0.85)',
                  fontWeight: 900, fontSize: isNew ? 17 : 15,
                  flexShrink: 0, minWidth: 38, textAlign: 'right',
                }}>
                  {entry.score.toLocaleString()}
                </span>
              </motion.div>
            )
          })
        )}

        {/* Clear button */}
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
          <motion.button
            onClick={handleClear}
            onBlur={() => { setClearConfirm(false); setClearConfirmReady(false) }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '5px 14px', borderRadius: 10,
              cursor: clearConfirm && !clearConfirmReady ? 'default' : 'pointer',
              fontSize: 11, fontWeight: 900, letterSpacing: '0.06em',
              border: 'none',
              borderBottom: `4px solid ${clearConfirm ? '#b91c1c' : '#ca8a04'}`,
              background: clearConfirm ? '#ef4444' : '#facc15',
              color: clearConfirm ? (clearConfirmReady ? '#fff' : 'rgba(255,255,255,0.5)') : '#000',
              opacity: clearConfirm && !clearConfirmReady ? 0.6 : 1,
              transition: 'all 0.18s',
            }}
          >
            {clearConfirm ? (t?.confirmClear ?? '⚠ YES, ERASE ALL') : (t?.clearBoard ?? 'Clear scores')}
          </motion.button>
          {clearConfirm && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, textAlign: 'center' }}
            >
              {t?.clearWarning ?? 'This will permanently delete all your scores and rankings. This cannot be undone.'}
            </motion.p>
          )}
        </div>
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={onBack}
        style={{ flexShrink: 0, marginLeft: 16, marginRight: 16 }}
        className="bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-14 shadow-xl cursor-pointer tracking-widest"
      >
        {t?.back ?? 'BACK'}
      </motion.button>
    </div>
  )
}
