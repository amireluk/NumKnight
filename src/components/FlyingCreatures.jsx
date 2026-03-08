import { useMemo } from 'react'
import { motion } from 'framer-motion'

// ── SVGs ──────────────────────────────────────────────────────────────────────

function BirdSVG({ scale = 1, opacity = 0.72 }) {
  return (
    <svg width={32 * scale} height={14 * scale} viewBox="0 0 32 14" fill="none">
      <path
        d="M0 7 Q8 1 16 6 Q24 1 32 7"
        stroke={`rgba(255,255,255,${opacity})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function BatSVG({ eyes = false, color = '#3a1560', scale = 1 }) {
  return (
    <svg width={38 * scale} height={20 * scale} viewBox="0 0 38 20" fill="none">
      {/* Left wing */}
      <path d="M19 11 Q10 5 3 8 Q1 13 7 13 Q13 13 19 11Z" fill={color} />
      {/* Right wing */}
      <path d="M19 11 Q28 5 35 8 Q37 13 31 13 Q25 13 19 11Z" fill={color} />
      {/* Left ear */}
      <path d="M15 10 L13 2 L18 9Z" fill={color} />
      {/* Right ear */}
      <path d="M23 10 L25 2 L20 9Z" fill={color} />
      {/* Body */}
      <ellipse cx="19" cy="12" rx="4.5" ry="4" fill={color} />
      {eyes && (
        <>
          <circle cx="17" cy="11" r="2.2" fill="#ef4444" opacity="0.35" />
          <circle cx="21" cy="11" r="2.2" fill="#ef4444" opacity="0.35" />
          <circle cx="17" cy="11" r="1.1" fill="#ef4444" />
          <circle cx="21" cy="11" r="1.1" fill="#ef4444" />
        </>
      )}
    </svg>
  )
}

// ── Config ────────────────────────────────────────────────────────────────────

const CONFIG = {
  easy:   { count: 5, type: 'bird', color: null,    eyes: false, speedMult: 1.0 },
  medium: { count: 5, type: 'bat',  color: '#3a1560', eyes: false, speedMult: 1.35 },
  hard:   { count: 6, type: 'bat',  color: '#100818', eyes: true,  speedMult: 1.7 },
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FlyingCreatures({ difficulty = 'easy' }) {
  const cfg = CONFIG[difficulty] ?? CONFIG.easy

  // Regenerate layout when difficulty changes — key change will remount + restart animations
  const creatures = useMemo(() =>
    Array.from({ length: cfg.count }, (_, i) => ({
      id: i,
      topPct: 4 + (i / cfg.count) * 48 + (Math.random() - 0.5) * 6,
      duration: (10 + Math.random() * 8) / cfg.speedMult,
      delay: -(i / cfg.count) * (12 / cfg.speedMult), // negative delay = already in-flight on mount
      scale: 0.65 + Math.random() * 0.55,
      yAmp: 8 + Math.random() * 14,
      yPeriod: 2.2 + Math.random() * 1.8,
      opacity: cfg.type === 'bird' ? 0.55 + Math.random() * 0.3 : 1,
    })),
  [difficulty]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {creatures.map(c => (
        // Outer div: horizontal flight (left → right)
        <motion.div
          key={`${difficulty}-${c.id}`}
          initial={{ x: -150 }}
          animate={{ x: 620 }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 0,
          }}
          style={{ position: 'absolute', top: `${c.topPct}%` }}
        >
          {/* Inner div: vertical oscillation */}
          <motion.div
            animate={{ y: [0, c.yAmp, 0, -c.yAmp, 0] }}
            transition={{ duration: c.yPeriod, repeat: Infinity, ease: 'easeInOut' }}
          >
            {cfg.type === 'bird'
              ? <BirdSVG scale={c.scale} opacity={c.opacity} />
              : <BatSVG eyes={cfg.eyes} color={cfg.color} scale={c.scale} />
            }
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
