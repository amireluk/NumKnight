import { useState } from 'react'
import { motion } from 'framer-motion'

const NAME_KEY = 'numknight_player_name'

const DIFF_OPTIONS = [
  { value: 'easy',   label: 'Easy',   color: '#4ade80' },
  { value: 'medium', label: 'Medium', color: '#fbbf24' },
  { value: 'hard',   label: 'Hard',   color: '#ef4444' },
]

export function StartScreen({ onStart }) {
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) ?? '')
  const [difficulty, setDifficulty] = useState('medium')

  const handleStart = () => {
    const trimmed = name.trim().slice(0, 16)
    if (trimmed) localStorage.setItem(NAME_KEY, trimmed)
    onStart({ name: trimmed || 'Knight', diff: difficulty })
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh max-w-md mx-auto px-6 gap-7"
      style={{
        background:
          'radial-gradient(ellipse at 50% 28%, rgba(251,191,36,0.10) 0%, transparent 65%), ' +
          'linear-gradient(to bottom, #0a0a1a, #14102e)',
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
      >
        <p className="font-black text-white tracking-widest" style={{
          fontSize: 52, lineHeight: 1,
          textShadow: '0 0 48px rgba(251,191,36,0.45), 0 2px 0 rgba(0,0,0,0.6)',
        }}>
          NumKnight
        </p>
      </motion.div>

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}
      >
        <label style={{
          fontSize: 11, color: 'rgba(255,255,255,0.38)',
          fontWeight: 700, letterSpacing: '0.22em',
        }}>
          YOUR NAME
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 16))}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          placeholder="Enter your name..."
          maxLength={16}
          style={{
            width: '100%', borderRadius: 14,
            border: '1.5px solid rgba(255,255,255,0.16)',
            background: 'rgba(255,255,255,0.07)',
            color: 'white', padding: '13px 16px',
            fontSize: 17, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </motion.div>

      {/* Difficulty picker */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}
      >
        <label style={{
          fontSize: 11, color: 'rgba(255,255,255,0.38)',
          fontWeight: 700, letterSpacing: '0.22em',
        }}>
          DIFFICULTY
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {DIFF_OPTIONS.map((opt) => {
            const selected = difficulty === opt.value
            return (
              <motion.button
                key={opt.value}
                onClick={() => setDifficulty(opt.value)}
                whileTap={{ scale: 0.94 }}
                style={{
                  flex: 1, padding: '11px 4px', borderRadius: 14,
                  border: `2px solid ${selected ? opt.color : 'rgba(255,255,255,0.11)'}`,
                  background: selected ? `${opt.color}1e` : 'rgba(255,255,255,0.04)',
                  color: selected ? opt.color : 'rgba(255,255,255,0.35)',
                  fontWeight: 900, fontSize: 14,
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}
              >
                <span>{opt.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, type: 'spring', stiffness: 200, damping: 18 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={handleStart}
        className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
      >
        START ADVENTURE
      </motion.button>
    </div>
  )
}
