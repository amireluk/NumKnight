import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const VW = 360
const VH = 500

// Node [cx, cy] in SVG units — winding left-right-left-right-center
const NODE_POS = [
  [ 72, 428],  // 0 Forest
  [285, 350],  // 1 Swamp
  [ 75, 258],  // 2 Mountains
  [275, 158],  // 3 Castle
  [180,  55],  // 4 Dragon Lair
]

// Bezier t=0.5 midpoints for each segment (used for the × cleared marks)
const SEG_MID = [
  [179, 386],  // Forest → Swamp
  [180, 305],  // Swamp  → Mountains
  [175, 207],  // Mountains → Castle
  [228, 101],  // Castle → Dragon Lair
]

const PATH =
  'M 72 428' +
  ' C 72 385 285 385 285 350' +
  ' C 285 315 75 296 75 258' +
  ' C 75 218 275 196 275 158' +
  ' C 275 110 180 88 180 55'

const TROPHY_EMOJI = { gold: '🥇', silver: '🥈', bronze: '🥉' }

const DIFF_LABELS  = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const DIFF_ORDER   = ['easy', 'medium', 'hard']

function getBestTrophy(trophies, worlds, worldIndex) {
  const offset = worlds.slice(0, worldIndex).reduce((sum, w) => sum + w.battles, 0)
  const slice  = trophies.slice(offset, offset + worlds[worldIndex].battles)
  if (slice.includes('gold'))   return 'gold'
  if (slice.includes('silver')) return 'silver'
  if (slice.includes('bronze')) return 'bronze'
  return null
}

// Knight helmet — glows gold, appears above the selected node
function KnightHelmet() {
  return (
    <div style={{ filter: 'drop-shadow(0 0 7px rgba(251,191,36,0.9))' }}>
      <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
        <path d="M 8 6 Q 12 0 16 6" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 3.5 17 Q 3.5 6 12 6 Q 20.5 6 20.5 17 L 20.5 21 L 3.5 21 Z" fill="#e2e8f0" />
        <rect x="5"   y="14"  width="14" height="4.5" rx="1.5" fill="#1e293b" />
        <rect x="6.5" y="15.2" width="4"  height="1.8" rx="0.7" fill="#334155" />
        <rect x="13.5" y="15.2" width="4" height="1.8" rx="0.7" fill="#334155" />
        <rect x="2.5" y="20"  width="19" height="3.5" rx="2.5" fill="#94a3b8" />
        <rect x="7"   y="23"  width="10" height="5"   rx="2"   fill="#cbd5e1" />
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

  const circleStyle = {
    width: 56, height: 56,
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26,
    position: 'relative',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'box-shadow 0.18s, border-color 0.18s',
    ...(isComplete && {
      background: '#1a1040',
      border: isSelected ? '2.5px solid #a78bfa' : '2.5px solid rgba(251,191,36,0.75)',
      boxShadow: isSelected ? '0 0 16px rgba(167,139,250,0.45)' : '0 0 10px rgba(251,191,36,0.28)',
    }),
    ...(isCurrent && {
      background: '#2d1060',
      border: '2.5px solid #fbbf24',
      boxShadow: '0 0 22px rgba(251,191,36,0.75)',
    }),
    ...(isLocked && {
      background: '#090916',
      border: isSelected ? '2px solid rgba(167,139,250,0.4)' : '2px solid rgba(255,255,255,0.09)',
      boxShadow: isSelected ? '0 0 10px rgba(167,139,250,0.18)' : 'none',
    }),
  }

  const nameColor = isLocked
    ? 'rgba(255,255,255,0.22)'
    : isCurrent
      ? '#fbbf24'
      : isSelected ? '#c4b5fd' : 'rgba(255,255,255,0.62)'

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${(cx / VW) * 100}%`,
        top:  `${(cy / VH) * 100}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 4, zIndex: isSelected ? 5 : 3,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isLocked ? 0.45 : 1 }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 18 }}
    >
      <div style={{ position: 'relative' }}>
        {/* Pulse ring — current node only */}
        {isCurrent && (
          <motion.div
            style={{
              position: 'absolute', inset: -9, borderRadius: '50%',
              border: '2px solid rgba(251,191,36,0.6)', pointerEvents: 'none',
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.1, ease: 'easeInOut' }}
          />
        )}

        {/* Selection ring — non-current selected nodes */}
        {isSelected && !isCurrent && (
          <motion.div
            style={{
              position: 'absolute', inset: -6, borderRadius: '50%',
              border: '1.5px solid rgba(167,139,250,0.5)', pointerEvents: 'none',
            }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        )}

        {/* Circle */}
        <div style={circleStyle} onClick={onClick}>
          <span style={{ filter: isLocked ? 'grayscale(1) brightness(0.4)' : undefined }}>
            {world.icon}
          </span>
          {trophy && (
            <span style={{
              position: 'absolute', top: -7, right: -9,
              fontSize: 16, lineHeight: 1,
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))',
            }}>
              {TROPHY_EMOJI[trophy]}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <span style={{
        fontSize: 9.5, fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: nameColor,
        whiteSpace: 'nowrap', lineHeight: 1,
      }}>
        {world.name}
      </span>

      {/* Stats: battles count + timer (no enemy emoji) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: isLocked ? 0.5 : 0.8 }}>
        <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
          ×{world.battles}
        </span>
        {world.timer !== null && (
          <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700, opacity: 0.85 }}>
            ⏱{world.timer}s
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function WorldMapScreen({
  worlds, currentWorldIndex, trophies,
  isTransition, difficulty, onDifficultyChange, onFight, onRestart,
}) {
  // Knight starts at the just-cleared world on a transition, current world otherwise
  const initPos = isTransition ? Math.max(0, currentWorldIndex - 1) : currentWorldIndex

  const [selectedIndex, setSelectedIndex] = useState(initPos)

  // Knight visual position — steps toward selectedIndex one node at a time
  const [knightPos,    setKnightPos]    = useState(initPos)
  const knightPosRef  = useRef(initPos)
  const targetRef     = useRef(initPos)
  const stepTimerRef  = useRef(null)

  useEffect(() => () => {
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current)
  }, [])

  const scheduleStep = () => {
    stepTimerRef.current = setTimeout(() => {
      const curr   = knightPosRef.current
      const target = targetRef.current
      if (curr === target) return
      const next = curr + (target > curr ? 1 : -1)
      knightPosRef.current = next
      setKnightPos(next)
      if (next !== target) scheduleStep()
    }, 230)
  }

  const handleNodeClick = (i) => {
    setSelectedIndex(i)
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current)
    targetRef.current = i
    scheduleStep()
  }

  const canFight = selectedIndex === currentWorldIndex

  const selectedStatus =
    selectedIndex < currentWorldIndex ? 'completed' :
    selectedIndex === currentWorldIndex ? 'current' : 'locked'

  // Knight position as percentages — initial matches starting pos (no mount animation)
  const knightLeft = `${(NODE_POS[knightPos][0] / VW) * 100}%`
  const knightTop  = `${(NODE_POS[knightPos][1] / VH) * 100}%`
  const initLeft   = `${(NODE_POS[initPos][0]   / VW) * 100}%`
  const initTop    = `${(NODE_POS[initPos][1]   / VH) * 100}%`

  return (
    <div
      className="flex flex-col min-h-dvh max-w-md mx-auto select-none"
      style={{ background: 'linear-gradient(160deg, #0d0d1e 0%, #110830 55%, #1a1040 100%)' }}
    >
      {/* ── Header ── */}
      <motion.div
        className="text-center pt-8 pb-2 px-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-black text-3xl tracking-widest text-white">NumKnight</p>

        {/* Difficulty selector */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10 }}>
          {DIFF_ORDER.map(d => {
            const active = d === difficulty
            return (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                style={{
                  padding: '3px 11px',
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: active ? '1.5px solid #fbbf24' : '1.5px solid rgba(255,255,255,0.14)',
                  background: active ? 'rgba(251,191,36,0.14)' : 'transparent',
                  color: active ? '#fbbf24' : 'rgba(255,255,255,0.28)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {DIFF_LABELS[d]}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* ── Map ── */}
      <div className="flex-1 px-4 pb-1" style={{ position: 'relative', overflow: 'visible' }}>
        <div style={{ position: 'relative', width: '100%', overflow: 'visible' }}>
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            style={{ width: '100%', display: 'block', overflow: 'visible' }}
          >
            {/* Dim guide */}
            <path d={PATH} fill="none" stroke="rgba(255,255,255,0.06)"
              strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Animated gold draw */}
            <motion.path
              d={PATH} fill="none" stroke="#fbbf24" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.72 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.15 }}
              style={{ filter: 'drop-shadow(0 0 5px rgba(251,191,36,0.45))' }}
            />

            {/* Red × marks on cleared path segments */}
            {SEG_MID.map(([mx, my], i) =>
              currentWorldIndex > i && (
                <g key={i} transform={`translate(${mx}, ${my}) rotate(12)`}>
                  <line x1="-5.5" y1="-5.5" x2="5.5" y2="5.5"
                    stroke="rgba(239,68,68,0.62)" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="5.5" y1="-5.5" x2="-5.5" y2="5.5"
                    stroke="rgba(239,68,68,0.62)" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )
            )}
          </svg>

          {/* Knight marker — initial matches knightPos so no mount animation */}
          <motion.div
            style={{ position: 'absolute', zIndex: 10, pointerEvents: 'none' }}
            initial={{ left: initLeft, top: initTop }}
            animate={{ left: knightLeft, top: knightTop }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          >
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
                onClick={() => handleNodeClick(i)}
              />
            )
          })}
        </div>
      </div>

      {/* Info strip */}
      <div className="px-6" style={{ minHeight: 24 }}>
        {!canFight && (
          <motion.p
            key={selectedIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs font-bold tracking-widest"
            style={{
              color: selectedStatus === 'locked'
                ? 'rgba(167,139,250,0.55)'
                : 'rgba(251,191,36,0.55)',
            }}
          >
            {selectedStatus === 'locked' ? 'PATH NOT UNLOCKED' : 'WORLD CLEARED'}
          </motion.p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pt-2 flex flex-col gap-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 210, damping: 18 }}
          whileTap={canFight ? { scale: 0.95 } : undefined}
          whileHover={canFight ? { scale: 1.03 } : undefined}
          onClick={canFight ? onFight : undefined}
          className={`w-full font-black text-2xl rounded-2xl h-16 shadow-xl tracking-widest transition-colors duration-200 ${
            canFight
              ? 'bg-yellow-400 border-b-4 border-yellow-600 text-black cursor-pointer'
              : 'bg-slate-800/80 border-b-4 border-slate-900 text-white/20 cursor-default'
          }`}
        >
          {canFight
            ? 'FIGHT !'
            : selectedStatus === 'locked' ? 'LOCKED' : 'CLEARED'}
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={onRestart}
          className="w-full text-white/30 text-sm font-bold tracking-widest py-1 cursor-pointer hover:text-white/50 transition-colors"
        >
          ↺ New Game
        </motion.button>
      </div>
    </div>
  )
}
