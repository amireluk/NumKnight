import { useState } from 'react'
import { motion } from 'framer-motion'

// SVG coordinate space
const VW = 360
const VH = 500

// Node positions [cx, cy] — winding left-right across the map
const NODE_POS = [
  [72,  428],  // 0 Forest
  [285, 350],  // 1 Swamp
  [75,  258],  // 2 Mountains
  [275, 158],  // 3 Castle
  [180,  55],  // 4 Dragon Lair
]

// Cubic-bezier winding path through all five nodes
const PATH =
  'M 72 428' +
  ' C 72 385 285 385 285 350' +
  ' C 285 315 75 296 75 258' +
  ' C 75 218 275 196 275 158' +
  ' C 275 110 180 88 180 55'

const TROPHY_EMOJI = { gold: '🥇', silver: '🥈', bronze: '🥉' }

const ENEMY_EMOJI = {
  goblin:    '👺',
  skeleton:  '💀',
  orc:       '👹',
  darkKnight:'🛡️',
  dragon:    '🐲',
}

function getBestTrophy(trophies, worlds, worldIndex) {
  const offset = worlds.slice(0, worldIndex).reduce((sum, w) => sum + w.battles, 0)
  const slice = trophies.slice(offset, offset + worlds[worldIndex].battles)
  if (slice.includes('gold'))   return 'gold'
  if (slice.includes('silver')) return 'silver'
  if (slice.includes('bronze')) return 'bronze'
  return null
}

// Small knight helmet SVG used as the player marker on the map
function KnightHelmet() {
  return (
    <div style={{ filter: 'drop-shadow(0 0 7px rgba(251,191,36,0.85))' }}>
      <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
        {/* Plume */}
        <path d="M 8 6 Q 12 0 16 6" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Helmet dome */}
        <path d="M 3.5 17 Q 3.5 6 12 6 Q 20.5 6 20.5 17 L 20.5 21 L 3.5 21 Z" fill="#e2e8f0" />
        {/* Visor bar */}
        <rect x="5" y="14" width="14" height="4.5" rx="1.5" fill="#1e293b" />
        {/* Visor eye slots */}
        <rect x="6.5" y="15.2" width="4" height="1.8" rx="0.7" fill="#334155" />
        <rect x="13.5" y="15.2" width="4" height="1.8" rx="0.7" fill="#334155" />
        {/* Shoulder plate */}
        <rect x="2.5" y="20" width="19" height="3.5" rx="2.5" fill="#94a3b8" />
        {/* Neck guard */}
        <rect x="7" y="23" width="10" height="5" rx="2" fill="#cbd5e1" />
        {/* Helmet highlight */}
        <ellipse cx="8.5" cy="10" rx="3" ry="2.5" fill="white" opacity="0.22" />
      </svg>
    </div>
  )
}

function WorldNode({ world, index, status, trophy, delay, isSelected, onClick }) {
  const isCurrent  = status === 'current'
  const isLocked   = status === 'locked'
  const isComplete = status === 'completed'
  const [cx, cy]   = NODE_POS[index]

  const circleBase = {
    width: 56, height: 56,
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26,
    position: 'relative',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  }

  const circleStyle = {
    ...circleBase,
    ...(isComplete && {
      background: '#1a1040',
      border: isSelected ? '2.5px solid #a78bfa' : '2.5px solid rgba(251,191,36,0.8)',
      boxShadow: isSelected ? '0 0 16px rgba(167,139,250,0.45)' : '0 0 12px rgba(251,191,36,0.3)',
    }),
    ...(isCurrent && {
      background: '#2d1060',
      border: '2.5px solid #fbbf24',
      boxShadow: '0 0 22px rgba(251,191,36,0.75)',
    }),
    ...(isLocked && {
      background: '#090916',
      border: isSelected ? '2px solid rgba(167,139,250,0.45)' : '2px solid rgba(255,255,255,0.10)',
      boxShadow: isSelected ? '0 0 10px rgba(167,139,250,0.2)' : 'none',
    }),
  }

  const nameColor = isLocked
    ? 'rgba(255,255,255,0.25)'
    : isCurrent
      ? '#fbbf24'
      : isSelected
        ? '#c4b5fd'
        : 'rgba(255,255,255,0.65)'

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${(cx / VW) * 100}%`,
        top:  `${(cy / VH) * 100}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        zIndex: isSelected ? 5 : 3,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isLocked ? 0.48 : 1 }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 18 }}
    >
      {/* Pulse ring — lives inside the circle for perfect centering */}
      <div style={{ position: 'relative' }}>
        {isCurrent && (
          <motion.div
            style={{
              position: 'absolute',
              inset: -9,
              borderRadius: '50%',
              border: '2px solid rgba(251,191,36,0.6)',
              pointerEvents: 'none',
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.1, ease: 'easeInOut' }}
          />
        )}

        {/* Selected ring for non-current nodes */}
        {isSelected && !isCurrent && (
          <motion.div
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '1.5px solid rgba(167,139,250,0.55)',
              pointerEvents: 'none',
            }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        )}

        {/* Node circle */}
        <div style={circleStyle} onClick={onClick}>
          <span style={{ filter: isLocked ? 'grayscale(1) brightness(0.45)' : undefined }}>
            {world.icon}
          </span>

          {/* Trophy badge — top-right */}
          {trophy && (
            <span style={{
              position: 'absolute', top: -7, right: -9,
              fontSize: 16, lineHeight: 1,
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))',
            }}>
              {TROPHY_EMOJI[trophy]}
            </span>
          )}

          {/* Lock badge — bottom-right for locked nodes */}
          {isLocked && (
            <span style={{
              position: 'absolute', bottom: -4, right: -6,
              fontSize: 12, lineHeight: 1,
            }}>
              🔒
            </span>
          )}
        </div>
      </div>

      {/* World name */}
      <span style={{
        fontSize: 9.5, fontWeight: 800,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: nameColor, whiteSpace: 'nowrap', lineHeight: 1,
      }}>
        {world.name}
      </span>

      {/* Stats: enemy · battles · timer */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        opacity: isLocked ? 0.55 : 0.85,
      }}>
        <span style={{ fontSize: 11 }}>{ENEMY_EMOJI[world.enemy.id]}</span>
        <span style={{
          fontSize: 8, color: 'rgba(255,255,255,0.5)',
          fontWeight: 700, letterSpacing: '0.04em',
        }}>
          ×{world.battles}
        </span>
        {world.timer !== null && (
          <span style={{
            fontSize: 8, color: '#fbbf24',
            fontWeight: 700, letterSpacing: '0.04em', opacity: 0.85,
          }}>
            ⏱{world.timer}s
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function WorldMapScreen({ worlds, currentWorldIndex, trophies, onFight }) {
  const [selectedIndex, setSelectedIndex] = useState(currentWorldIndex)

  const currentWorld  = worlds[currentWorldIndex]
  const selectedWorld = worlds[selectedIndex]
  const canFight      = selectedIndex === currentWorldIndex

  const selectedStatus =
    selectedIndex < currentWorldIndex ? 'completed' :
    selectedIndex === currentWorldIndex ? 'current' :
    'locked'

  return (
    <div
      className="flex flex-col min-h-dvh max-w-md mx-auto select-none"
      style={{ background: 'linear-gradient(160deg, #0d0d1e 0%, #110830 55%, #1a1040 100%)' }}
    >
      {/* Header */}
      <motion.div
        className="text-center pt-10 pb-2 px-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-white/35 text-xs font-black tracking-[0.35em] uppercase mb-1">
          World Map
        </p>
        {currentWorld && (
          <p className="text-white font-black text-xl tracking-wide">
            {currentWorld.icon}&nbsp;&nbsp;{currentWorld.name}
          </p>
        )}
      </motion.div>

      {/* Map — SVG path + absolute node overlays */}
      <div className="flex-1 px-4 pb-1" style={{ position: 'relative', overflow: 'visible' }}>
        <div style={{ position: 'relative', width: '100%', overflow: 'visible' }}>
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            style={{ width: '100%', display: 'block', overflow: 'visible' }}
          >
            {/* Dim guide trail (full path) */}
            <path
              d={PATH}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Gold animated draw */}
            <motion.path
              d={PATH}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.75 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.15 }}
              style={{ filter: 'drop-shadow(0 0 5px rgba(251,191,36,0.5))' }}
            />
          </svg>

          {/* Knight marker — animates to selected node */}
          <motion.div
            style={{ position: 'absolute', zIndex: 10, pointerEvents: 'none' }}
            initial={{
              left: `${(NODE_POS[currentWorldIndex][0] / VW) * 100}%`,
              top:  `${(NODE_POS[currentWorldIndex][1] / VH) * 100}%`,
            }}
            animate={{
              left: `${(NODE_POS[selectedIndex][0] / VW) * 100}%`,
              top:  `${(NODE_POS[selectedIndex][1] / VH) * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          >
            {/* Inner div handles visual offset so transform doesn't clash with Framer */}
            <div style={{ transform: 'translate(-50%, -62px)' }}>
              <KnightHelmet />
            </div>
          </motion.div>

          {/* World nodes */}
          {worlds.map((world, i) => {
            const status =
              i < currentWorldIndex  ? 'completed' :
              i === currentWorldIndex ? 'current'   : 'locked'
            const trophy = i < currentWorldIndex
              ? getBestTrophy(trophies, worlds, i)
              : null

            return (
              <WorldNode
                key={world.id}
                world={world}
                index={i}
                status={status}
                trophy={trophy}
                delay={0.2 + i * 0.1}
                isSelected={selectedIndex === i}
                onClick={() => setSelectedIndex(i)}
              />
            )
          })}
        </div>
      </div>

      {/* Info strip — shows selected node details when not current */}
      <div className="px-6 pb-1" style={{ minHeight: 28 }}>
        {!canFight && selectedWorld && (
          <motion.p
            key={selectedIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs font-bold tracking-widest"
            style={{
              color: selectedStatus === 'locked'
                ? 'rgba(167,139,250,0.6)'
                : 'rgba(251,191,36,0.6)',
            }}
          >
            {selectedStatus === 'locked' ? '🔒 NOT UNLOCKED YET' : '✓ WORLD CLEARED'}
          </motion.p>
        )}
      </div>

      {/* FIGHT button */}
      <div className="px-6 pb-10 pt-2">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, type: 'spring', stiffness: 210, damping: 18 }}
          whileTap={canFight ? { scale: 0.95 } : undefined}
          whileHover={canFight ? { scale: 1.03 } : undefined}
          onClick={canFight ? onFight : undefined}
          className={`w-full font-black text-2xl rounded-2xl h-16 shadow-xl tracking-widest transition-colors duration-200 ${
            canFight
              ? 'bg-yellow-400 border-b-4 border-yellow-600 text-black cursor-pointer'
              : 'bg-slate-800/80 border-b-4 border-slate-900 text-white/25 cursor-default'
          }`}
        >
          {canFight
            ? 'FIGHT !'
            : selectedStatus === 'locked'
              ? '🔒 LOCKED'
              : 'CLEARED'}
        </motion.button>
      </div>
    </div>
  )
}
