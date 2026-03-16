import { motion } from 'framer-motion'
import { useState, useEffect, memo } from 'react'

const PIP_H = 22
const GAP   = 6

// Static crack line drawn on a pip — appears on hit 1, stays until hit 2
function CrackLine() {
  return (
    <svg
      width="14" height="22" viewBox="0 0 14 22"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}
    >
      <path
        d="M7 0 L5 7 L9 12 L4 17 L7 22"
        stroke="rgba(255,255,255,0.9)" strokeWidth="0.8" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M7 0 L5 7 L9 12 L4 17 L7 22"
        stroke="rgba(251,191,36,0.45)" strokeWidth="1.4" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ mixBlendMode: 'overlay' }}
      />
    </svg>
  )
}

// One-pip fall animation — triggers on hit 2, positioned at the falling pip
function ShieldFallOverlay({ pipIdx }) {
  const W   = 14
  const H   = PIP_H
  const cx  = 7
  const top = pipIdx * (PIP_H + GAP)

  const steps = 4
  const jag   = Array.from({ length: steps + 1 }, (_, i) => {
    const y = Math.round((H / steps) * i)
    const x = cx + (i % 2 === 0 ? -2 : 2)
    return [x, y]
  })

  const leftPoints  = `0,0 ${jag.map(([x, y]) => `${x},${y}`).join(' ')} 0,${H}`
  const rightPoints = `${W},0 ${jag.map(([x, y]) => `${x},${y}`).join(' ')} ${W},${H}`
  const sharedEdge  = jag.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <div style={{
      position: 'absolute', top, left: 0,
      width: W, height: H,
      pointerEvents: 'none', zIndex: 10, overflow: 'visible',
    }}>
      <motion.svg width={W} height={H}
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        animate={{ x: -9, y: -4, rotate: -14, opacity: 0 }}
        transition={{ duration: 0.42, ease: 'easeIn' }}
      >
        <polygon points={leftPoints}
          fill="rgba(96,165,250,0.35)" stroke="#93c5fd" strokeWidth="1.5" strokeLinejoin="round" />
        <polyline points={sharedEdge}
          stroke="white" strokeWidth="1.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      </motion.svg>

      <motion.svg width={W} height={H}
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        animate={{ x: 9, y: 4, rotate: 14, opacity: 0 }}
        transition={{ duration: 0.42, ease: 'easeIn' }}
      >
        <polygon points={rightPoints}
          fill="rgba(96,165,250,0.35)" stroke="#93c5fd" strokeWidth="1.5" strokeLinejoin="round" />
        <polyline points={sharedEdge}
          stroke="white" strokeWidth="1.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      </motion.svg>

      <motion.div
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: -1,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.85) 0%, rgba(147,197,253,0.4) 60%, rgba(147,197,253,0) 100%)',
          borderRadius: 4, pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// shieldState:   null | 'full' | 'cracked' | 'broken'
//   full    — all filled pips have blue border
//   cracked — top pip has blue border + visible crack line (hit 1)
//   broken  — top pip has no border (shield stripped), rest still blue (hit 2)
// shieldFlashKey: increments on shield power-up
// shieldFallKey:  increments on hit 2 → triggers fall animation
// shieldFallPip:  pip index that falls (captured at trigger time)
export function HPBar({ current, max, color = 'green', shieldState = null, shieldFlashKey = 0, shieldFallKey = 0, shieldFallPip = 0, damageFlashKey = 0 }) {
  const isGreen   = color === 'green'
  const topFilled = max - current

  const [flashing, setFlashing] = useState(false)
  useEffect(() => {
    if (damageFlashKey === 0) return
    setFlashing(true)
    const t = setTimeout(() => setFlashing(false), 300)
    return () => clearTimeout(t)
  }, [damageFlashKey])

  return (
    <div className="flex flex-col justify-center gap-1.5" style={{ position: 'relative', overflow: 'visible' }}>
      {shieldFallKey > 0 && (
        <ShieldFallOverlay key={shieldFallKey} pipIdx={shieldFallPip} />
      )}

      {Array.from({ length: max }, (_, i) => {
        const filled = i >= topFilled

        // cracked: top pip keeps blue border (crack line overlaid)
        // broken:  top pip loses blue border, rest keep it
        const shielded = filled && (
          shieldState === 'full' ||
          shieldState === 'cracked' ||
          (shieldState === 'broken' && i > topFilled)
        )

        const baseBg    = filled ? (isGreen ? (flashing ? '#ef4444' : '#22c55e') : '#ef4444') : '#1f2937'
        const borderCol = shielded ? '#60a5fa' : filled ? (isGreen ? '#4ade80' : '#f87171') : '#374151'
        const borderW   = shielded ? 2.5 : 1
        const shadow    = shielded
          ? '0 0 8px rgba(96,165,250,0.85), inset 0 0 5px rgba(96,165,250,0.4)'
          : filled
            ? isGreen ? '0 0 6px rgba(34,197,94,0.5)' : '0 0 6px rgba(239,68,68,0.5)'
            : 'none'

        const flashDelay = (max - 1 - i) * 0.16

        return (
          <div key={i} style={{ position: 'relative', width: 14, height: 22 }}>
            <div
              style={{
                width: 14, height: 22, borderRadius: 4,
                border: `${borderW}px solid ${borderCol}`,
                backgroundColor: baseBg,
                boxShadow: shadow,
                transition: 'background-color 0.25s, border-color 0.25s, box-shadow 0.25s',
              }}
            />

            {/* Crack line — static, shown on hit 1 until hit 2 clears it */}
            {shieldState === 'cracked' && i === topFilled && <CrackLine />}

            {/* Shield power-up beam */}
            {shieldFlashKey > 0 && filled && (
              <motion.div
                key={`flash-${shieldFlashKey}`}
                initial={{ opacity: 0.65 }}
                animate={{ opacity: 0 }}
                transition={{ delay: flashDelay, duration: 0.55, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: -2, bottom: -2, left: -16, right: -16,
                  borderRadius: 6,
                  background: 'linear-gradient(90deg, rgba(147,197,253,0) 0%, rgba(147,197,253,0.45) 25%, rgba(219,234,254,0.7) 50%, rgba(147,197,253,0.45) 75%, rgba(147,197,253,0) 100%)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
