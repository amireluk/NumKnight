import { motion } from 'framer-motion'

const PIP_H = 22
const GAP   = 6

// One-pip-sized crack overlay, positioned at the pip that is breaking
function ShieldCrackOverlay({ topFilled }) {
  const W   = 14
  const H   = PIP_H   // 22px — one pip only
  const cx  = 7
  const top = topFilled * (PIP_H + GAP)

  // Tight zigzag in 14×22px space
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
      {/* Left half — flies left */}
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

      {/* Right half — flies right */}
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

      {/* Quick flash */}
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

// shieldState:    null | 'full' | 'cracked'
// shieldFlashKey: increments each time shield powers up → triggers sweep anim
// shieldCrackKey: increments on first hit → triggers vertical crack animation
export function HPBar({ current, max, color = 'green', shieldState = null, shieldFlashKey = 0, shieldCrackKey = 0 }) {
  const isGreen   = color === 'green'
  const topFilled = max - current

  return (
    <div className="flex flex-col justify-center gap-1.5" style={{ position: 'relative', overflow: 'visible' }}>
      {shieldCrackKey > 0 && <ShieldCrackOverlay key={shieldCrackKey} topFilled={topFilled} />}

      {Array.from({ length: max }, (_, i) => {
        const filled = i >= topFilled

        const shielded = filled && (
          shieldState === 'full' ||
          (shieldState === 'cracked' && i > topFilled)
        )

        const baseBg    = filled ? (isGreen ? '#22c55e' : '#ef4444') : '#1f2937'
        const borderCol = shielded ? '#60a5fa' : filled ? (isGreen ? '#4ade80' : '#f87171') : '#374151'
        const borderW   = shielded ? 2.5 : 1
        const shadow    = shielded
          ? '0 0 8px rgba(96,165,250,0.85), inset 0 0 5px rgba(96,165,250,0.4)'
          : filled
            ? isGreen ? '0 0 6px rgba(34,197,94,0.5)' : '0 0 6px rgba(239,68,68,0.5)'
            : 'none'

        // Flash: narrower beam, lower opacity
        const flashDelay = (max - 1 - i) * 0.16

        return (
          <div key={i} style={{ position: 'relative', width: 14, height: 22 }}>
            <motion.div
              animate={{ backgroundColor: baseBg, borderColor: borderCol, boxShadow: shadow }}
              transition={{ duration: 0.25 }}
              style={{ width: 14, height: 22, borderRadius: 4, border: `${borderW}px solid` }}
            />

            {/* Shield power-up beam — toned down */}
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
