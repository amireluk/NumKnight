import { useState } from 'react'
import { motion } from 'framer-motion'
import { saveScore, loadScores } from '../game/scoreState'

const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const DIFF_COLOR = { easy: '#4ade80', medium: '#fbbf24', hard: '#ef4444' }

const RANK_MEDAL = ['🥇', '🥈', '🥉']
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

const NAME_KEY = 'numknight_player_name'

export function LeaderboardScreen({ totalScore, difficulty, onPlayAgain }) {
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) ?? '')
  const [saved, setSaved] = useState(false)
  const [scores, setScores] = useState(() => loadScores(difficulty))

  const handleSave = () => {
    const trimmed = name.trim().slice(0, 16)
    if (!trimmed) return
    localStorage.setItem(NAME_KEY, trimmed)
    saveScore(difficulty, {
      name: trimmed,
      score: totalScore,
      date: new Date().toLocaleDateString(),
    })
    setScores(loadScores(difficulty))
    setSaved(true)
  }

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

      {/* Your score + name entry */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        style={{
          background: 'rgba(251,191,36,0.10)',
          border: '1px solid rgba(251,191,36,0.28)',
          borderRadius: 18, padding: '14px 18px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>
            YOUR SCORE
          </span>
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.25 }}
            style={{ color: '#fbbf24', fontSize: 28, fontWeight: 900 }}
          >
            {totalScore}
          </motion.span>
        </div>

        {!saved ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 16))}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Your name..."
              maxLength={16}
              style={{
                flex: 1, borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.08)',
                color: 'white', padding: '8px 12px',
                fontSize: 14, outline: 'none',
              }}
            />
            <button
              onClick={handleSave}
              style={{
                borderRadius: 10, background: '#fbbf24',
                color: '#000', fontWeight: 900,
                padding: '8px 16px', fontSize: 13,
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              SAVE
            </button>
          </div>
        ) : (
          <p style={{ color: '#4ade80', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
            Score saved!
          </p>
        )}
      </motion.div>

      {/* Scores list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {scores.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.28)', textAlign: 'center', marginTop: 24, fontSize: 14 }}>
            No scores yet — be the first!
          </p>
        ) : scores.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22 + i * 0.05 }}
            style={{
              background: i < 3 ? RANK_ROW_BG[i] : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i < 3 ? RANK_BORDER[i] : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <span style={{ fontSize: i < 3 ? 18 : 13, width: 26, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontWeight: 900 }}>
              {i < 3 ? RANK_MEDAL[i] : `${i + 1}`}
            </span>
            <span style={{ flex: 1, color: 'white', fontWeight: 700, fontSize: 14 }}>
              {entry.name}
            </span>
            <span style={{ color: '#fbbf24', fontWeight: 900, fontSize: 16, minWidth: 40, textAlign: 'right' }}>
              {entry.score}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, marginLeft: 4 }}>
              {entry.date}
            </span>
          </motion.div>
        ))}
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
