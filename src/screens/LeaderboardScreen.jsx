import { useState } from 'react'
import { motion } from 'framer-motion'
import { saveScore, loadScores } from '../game/scoreState'

const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const DIFF_COLOR = { easy: '#4ade80', medium: '#fbbf24', hard: '#ef4444' }

const NAME_KEY = 'numknight_player_name'

const RANK_ROW_BG = [
  'rgba(251,191,36,0.13)',
  'rgba(203,213,225,0.09)',
  'rgba(180,83,9,0.10)',
]
const RANK_BORDER = [
  'rgba(251,191,36,0.30)',
  'rgba(203,213,225,0.20)',
  'rgba(180,83,9,0.22)',
]

export function LeaderboardScreen({ totalScore, endWorld, cleared, difficulty, playerName, onPlayAgain }) {
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
      })
    }
    const list = loadScores(difficulty)
    // Find the index of the run we just added (first entry matching score+world)
    const idx = totalScore > 0
      ? list.findIndex(e => e.score === totalScore && e.endWorld === endWorld && e.cleared === cleared)
      : -1
    return [list, idx]
  })

  return (
    <div
      className="flex flex-col min-h-dvh max-w-md mx-auto px-4 py-5 gap-4"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.12) 0%, transparent 65%), ' +
          'linear-gradient(to bottom, #0d0d1e, #1a1040)',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
      >
        <p className="text-white/40 text-xs font-black tracking-[0.35em] uppercase">
          Kingdom Records
        </p>
        <p className="text-white font-black text-3xl tracking-wide">Leaderboard</p>
        <span style={{
          background: DIFF_COLOR[difficulty], color: '#000',
          borderRadius: 99, padding: '2px 14px',
          fontSize: 11, fontWeight: 900, letterSpacing: '0.08em',
        }}>
          {DIFF_LABEL[difficulty] ?? difficulty}
        </span>
      </motion.div>

      {/* Your score summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 18, padding: '12px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>
            YOUR SCORE
          </span>
          {endWorld && (
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: cleared ? '#fbbf24' : 'rgba(255,255,255,0.35)',
              letterSpacing: '0.06em',
            }}>
              {cleared ? 'CONQUERED' : `Fell at ${endWorld}`}
            </span>
          )}
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.25 }}
          style={{ color: '#fbbf24', fontSize: 28, fontWeight: 900 }}
        >
          {totalScore.toLocaleString()}
        </motion.span>
      </motion.div>

      {/* Scores list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {scores.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.28)', textAlign: 'center', marginTop: 24, fontSize: 14 }}>
            No scores yet — be the first!
          </p>
        ) : scores.map((entry, i) => {
          const isNew = i === newScoreIndex
          const isTop3 = i < 3
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 + i * 0.05 }}
              style={{
                background: isNew
                  ? 'rgba(251,191,36,0.18)'
                  : isTop3 ? RANK_ROW_BG[i] : 'rgba(255,255,255,0.04)',
                border: `${isNew ? 2 : 1}px solid ${
                  isNew ? 'rgba(251,191,36,0.75)'
                  : isTop3 ? RANK_BORDER[i] : 'rgba(255,255,255,0.08)'
                }`,
                borderRadius: 12,
                padding: isNew ? '13px 14px' : '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                transform: isNew ? 'scale(1.025)' : 'scale(1)',
                transformOrigin: 'center',
                boxShadow: isNew ? '0 0 18px rgba(251,191,36,0.22)' : 'none',
              }}
            >
              {/* Rank */}
              <span style={{
                fontSize: isNew ? 15 : (isTop3 ? 18 : 13),
                width: 26, textAlign: 'center',
                color: isNew ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                fontWeight: 900, flexShrink: 0,
              }}>
                {i + 1}
              </span>
              {/* Name */}
              <span style={{
                flex: 1, color: isNew ? '#fff' : 'rgba(255,255,255,0.85)',
                fontWeight: isNew ? 900 : 700,
                fontSize: isNew ? 15 : 14,
                minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
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
              {/* Region / conquered */}
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                color: entry.cleared ? '#fbbf24' : 'rgba(255,255,255,0.28)',
                flexShrink: 0, minWidth: 60, textAlign: 'center',
              }}>
                {entry.cleared ? 'CONQUERED' : (entry.endWorld ?? '')}
              </span>
              {/* Score */}
              <span style={{
                color: isNew ? '#fbbf24' : 'rgba(251,191,36,0.85)',
                fontWeight: 900, fontSize: isNew ? 18 : 16,
                flexShrink: 0, minWidth: 40, textAlign: 'right',
              }}>
                {entry.score.toLocaleString()}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Play again */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={onPlayAgain}
        className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-14 shadow-xl cursor-pointer tracking-widest"
      >
        PLAY AGAIN
      </motion.button>
    </div>
  )
}
