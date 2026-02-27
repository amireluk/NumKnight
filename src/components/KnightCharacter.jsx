import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

export function KnightCharacter({ phase }) {
  const controls = useAnimation()

  useEffect(() => {
    if (phase === 'attacking') {
      controls.start({ x: [0, 44, 0], transition: { duration: 0.5, ease: 'easeInOut' } })
    } else if (phase === 'combo') {
      controls.start({
        x: [0, 52, 0],
        scale: [1, 1.12, 1],
        transition: { duration: 0.55, ease: 'easeInOut' },
      })
    } else if (phase === 'hit') {
      controls.start({ x: [0, -14, 8, -6, 0], transition: { duration: 0.5 } })
    }
  }, [phase, controls])

  return (
    <div className="relative flex flex-col items-center">
      {phase === 'combo' && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.7 }}
          animate={{ opacity: [0, 1, 1, 0], y: -30, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute -top-8 text-3xl drop-shadow-lg"
        >
          ⚡
        </motion.div>
      )}

      <motion.div animate={controls} className="relative">
        <svg width="80" height="110" viewBox="0 0 80 110" fill="none">
          {/* Plume */}
          <ellipse cx="40" cy="5" rx="6" ry="9" fill="#dc2626" />
          <ellipse cx="40" cy="5" rx="3.5" ry="6" fill="#ef4444" />

          {/* Helmet */}
          <rect x="20" y="12" width="40" height="32" rx="9" fill="#64748b" />
          {/* Gold trim top */}
          <rect x="20" y="12" width="40" height="5" rx="3" fill="#fbbf24" />
          {/* Visor slit */}
          <rect x="26" y="28" width="28" height="9" rx="3" fill="#0f172a" />
          {/* Visor shine */}
          <rect x="26" y="28" width="9" height="4" rx="2" fill="#1e3a8a" opacity="0.7" />
          {/* Helmet chin */}
          <rect x="20" y="41" width="40" height="3" rx="1.5" fill="#fbbf24" />

          {/* Neck */}
          <rect x="30" y="44" width="20" height="7" rx="3" fill="#475569" />

          {/* Body armor */}
          <rect x="15" y="49" width="50" height="36" rx="8" fill="#64748b" />
          {/* Chest plate */}
          <rect x="22" y="52" width="36" height="24" rx="5" fill="#94a3b8" />
          {/* Center ridge */}
          <rect x="38" y="53" width="4" height="22" rx="2" fill="#64748b" />

          {/* Shoulders */}
          <ellipse cx="13" cy="55" rx="9" ry="8" fill="#64748b" />
          <ellipse cx="67" cy="55" rx="9" ry="8" fill="#64748b" />

          {/* Left arm (holds shield) */}
          <rect x="5" y="55" width="11" height="22" rx="4" fill="#64748b" />
          {/* Right arm (holds sword) */}
          <rect x="64" y="55" width="11" height="22" rx="4" fill="#64748b" />

          {/* Shield */}
          <rect x="-2" y="45" width="14" height="26" rx="5" fill="#1d4ed8" />
          <rect x="1" y="49" width="8" height="18" rx="3" fill="#3b82f6" />
          <rect x="4" y="50" width="2" height="16" fill="#fbbf24" />
          <rect x="1" y="57" width="8" height="2" fill="#fbbf24" />

          {/* Sword blade */}
          <rect x="73" y="6" width="6" height="50" rx="2.5" fill="#e2e8f0" />
          {/* Sword shine */}
          <rect x="73" y="6" width="2" height="44" rx="1" fill="white" opacity="0.6" />
          {/* Sword guard */}
          <rect x="66" y="46" width="20" height="6" rx="3" fill="#92400e" />
          {/* Sword grip */}
          <rect x="73" y="52" width="6" height="18" rx="2" fill="#7c2d12" />
          {/* Pommel */}
          <ellipse cx="76" cy="71" rx="5" ry="4" fill="#92400e" />

          {/* Legs */}
          <rect x="22" y="83" width="15" height="18" rx="4" fill="#475569" />
          <rect x="43" y="83" width="15" height="18" rx="4" fill="#475569" />
          {/* Boots */}
          <rect x="20" y="99" width="19" height="10" rx="4" fill="#1e293b" />
          <rect x="41" y="99" width="19" height="10" rx="4" fill="#1e293b" />
        </svg>

        {/* Red flash when hit */}
        {phase === 'hit' && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-red-500 pointer-events-none"
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          />
        )}
      </motion.div>

    </div>
  )
}
