/* eslint-disable no-undef */
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DIFFICULTY } from '../game/campaign.config'

const VW = 360
const VH = 500

const NODE_POS = [
  [ 72, 428],  // 0 Forest
  [285, 350],  // 1 Swamp
  [ 75, 258],  // 2 Mountains
  [275, 158],  // 3 Castle
  [180,  55],  // 4 Dragon Lair
]

const PATH =
  'M 72 428' +
  ' C 72 385 285 385 285 350' +
  ' C 285 315 75 296 75 258' +
  ' C 75 218 275 196 275 158' +
  ' C 275 110 180 88 180 55'

const TROPHY_EMOJI = { gold: '🥇', silver: '🥈', bronze: '🥉' }

function getBestTrophy(trophies, worlds, worldIndex) {
  const offset = worlds.slice(0, worldIndex).reduce((sum, w) => sum + w.battles, 0)
  const slice  = trophies.slice(offset, offset + worlds[worldIndex].battles)
  if (slice.includes('gold'))   return 'gold'
  if (slice.includes('silver')) return 'silver'
  if (slice.includes('bronze')) return 'bronze'
  return null
}

function KnightHelmet() {
  return (
    <div style={{ filter: 'drop-shadow(0 0 7px rgba(251,191,36,0.9))' }}>
      <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
        <path d="M 8 6 Q 12 0 16 6" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 3.5 17 Q 3.5 6 12 6 Q 20.5 6 20.5 17 L 20.5 21 L 3.5 21 Z" fill="#e2e8f0" />
        <rect x="5"    y="14"   width="14" height="4.5" rx="1.5" fill="#1e293b" />
        <rect x="6.5"  y="15.2" width="4"  height="1.8" rx="0.7" fill="#334155" />
        <rect x="13.5" y="15.2" width="4"  height="1.8" rx="0.7" fill="#334155" />
        <rect x="2.5"  y="20"   width="19" height="3.5" rx="2.5" fill="#94a3b8" />
        <rect x="7"    y="23"   width="10" height="5"   rx="2"   fill="#cbd5e1" />
        <ellipse cx="8.5" cy="10" rx="3" ry="2.5" fill="white" opacity="0.22" />
      </svg>
    </div>
  )
}

// Red × — fills the node circle exactly (56×56)
function ConqueredX() {
  return (
    <svg
      width="56" height="56" viewBox="0 0 56 56"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <line x1="11" y1="11" x2="45" y2="45" stroke="rgba(239,68,68,0.88)" strokeWidth="6.5" strokeLinecap="round" />
      <line x1="45" y1="11" x2="11" y2="45" stroke="rgba(239,68,68,0.88)" strokeWidth="6.5" strokeLinecap="round" />
    </svg>
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
      animate={{ scale: 1, opacity: isLocked ? 0.5 : 1 }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 18 }}
    >
      <div style={{ position: 'relative' }}>
        {/* Pulse ring */}
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

        {/* Selection ring */}
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

        {/* Node circle */}
        <div style={circleStyle} onClick={onClick}>
          {/* World icon — dimmed for locked */}
          <span style={{ filter: isLocked ? 'grayscale(1) brightness(0.35)' : undefined }}>
            {world.icon}
          </span>

          {/* Conquered: red × stamped over the icon */}
          {isComplete && <ConqueredX />}

          {/* Locked: lock emoji centered over the icon */}
          {isLocked && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>
              🔒
            </div>
          )}
        </div>

        {/* Trophy badge — top-right, only on completed nodes */}
        {trophy && (
          <span style={{
            position: 'absolute', top: -12, right: -13,
            fontSize: 24, lineHeight: 1,
            filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.8))',
            zIndex: 2,
          }}>
            {TROPHY_EMOJI[trophy]}
          </span>
        )}
      </div>

      {/* Name */}
      <span style={{
        fontSize: 9.5, fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: nameColor,
        whiteSpace: 'nowrap', lineHeight: 1,
      }}>
        {world.name}
      </span>

      {/* Timer indicator (only shown for timed worlds) */}
      {world.timer !== null && (
        <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700, opacity: isLocked ? 0.45 : 0.85 }}>
          ⏱{world.timer}s
        </span>
      )}
    </motion.div>
  )
}

export function WorldMapScreen({
  worlds, currentWorldIndex, trophies,
  isTransition, onFight, onRestart,
}) {
  const initPos = isTransition ? Math.max(0, currentWorldIndex - 1) : currentWorldIndex

  const [selectedIndex, setSelectedIndex] = useState(initPos)
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
    }, 150)
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

  const knightLeft = `${(NODE_POS[knightPos][0] / VW) * 100}%`
  const knightTop  = `${(NODE_POS[knightPos][1] / VH) * 100}%`
  const initLeft   = `${(NODE_POS[initPos][0]   / VW) * 100}%`
  const initTop    = `${(NODE_POS[initPos][1]   / VH) * 100}%`

  return (
    <div
      className="flex flex-col min-h-dvh max-w-md mx-auto select-none"
      style={{ background: 'linear-gradient(to bottom, #0a1208, #0e1a0a, #0c1608)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Kingdom landscape background */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        viewBox="0 0 360 760" preserveAspectRatio="xMidYMid slice">
        {/* Distant mountain silhouette */}
        <path d="M0 228 L32 155 L65 198 L98 128 L135 172 L168 115 L204 158 L238 125 L272 162 L306 135 L338 155 L360 140 L360 252 L0 252Z"
          fill="#0c1c0a" />
        <path d="M0 248 L45 185 L82 218 L118 168 L155 202 L192 148 L228 184 L265 152 L300 178 L335 155 L360 165 L360 268 L0 268Z"
          fill="#091408" opacity="0.9" />
        {/* Castle (upper-right, behind Dragon Lair node area) */}
        <rect x="256" y="132" width="32" height="96" fill="#070e06" />
        <rect x="244" y="112" width="18" height="116" fill="#070e06" />
        {/* Left tower battlements */}
        <path d="M242 112 L244 112 L244 105 L249 105 L249 112 L254 112 L254 105 L259 105 L259 112 L262 112 L262 118 L242 118Z" fill="#070e06" />
        <rect x="270" y="120" width="18" height="108" fill="#070e06" />
        {/* Right tower battlements */}
        <path d="M268 120 L270 120 L270 113 L275 113 L275 120 L280 120 L280 113 L285 113 L285 120 L288 120 L288 126 L268 126Z" fill="#070e06" />
        {/* Keep battlements */}
        <path d="M254 132 L256 132 L256 126 L261 126 L261 132 L266 132 L266 126 L271 126 L271 132 L276 132 L276 126 L281 126 L281 132 L288 132 L288 138 L254 138Z" fill="#070e06" />
        {/* Castle windows — warm amber glow */}
        <rect x="263" y="158" width="9"  height="14" rx="4.5" fill="#6b4a06" />
        <rect x="264" y="159" width="7"  height="12" rx="3.5" fill="#f59e0b" opacity="0.38" />
        <rect x="248" y="142" width="7"  height="11" rx="3.5" fill="#6b4a06" />
        <rect x="249" y="143" width="5"  height="9"  rx="2.5" fill="#f59e0b" opacity="0.32" />
        {/* Castle walls */}
        <path d="M232 224 L232 210 L238 210 L238 203 L243 203 L243 210 L250 210 L250 203 L255 203 L255 210 L262 210 L262 224Z" fill="#070e06" />
        <path d="M280 224 L280 212 L286 212 L286 205 L291 205 L291 212 L298 212 L298 205 L303 205 L303 212 L310 212 L310 224Z" fill="#070e06" />
        {/* Tree clusters — upper middle */}
        {[[12,308],[28,316],[48,308],[68,314],[4,320],[86,310],[104,318]].map(([x,y],i) => (
          <path key={i} d={`M${x} ${y} L${x+12} ${y-36} L${x+24} ${y}Z`} fill={i%2===0 ? '#091508' : '#0b1c0a'} />
        ))}
        {[[274,302],[290,310],[308,304],[325,312],[342,308]].map(([x,y],i) => (
          <path key={i} d={`M${x} ${y} L${x+12} ${y-34} L${x+24} ${y}Z`} fill={i%2===0 ? '#091508' : '#0b1c0a'} />
        ))}
        {/* River */}
        <path d="M18 448 Q72 408 138 432 Q202 456 268 415 Q312 388 355 402"
          stroke="#0d2218" strokeWidth="20" fill="none" strokeLinecap="round" />
        <path d="M18 448 Q72 408 138 432 Q202 456 268 415 Q312 388 355 402"
          stroke="#112a20" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M18 448 Q72 408 138 432 Q202 456 268 415 Q312 388 355 402"
          stroke="#183228" strokeWidth="4"  fill="none" strokeLinecap="round" opacity="0.55" />
        {/* Rolling hills */}
        <path d="M0 495 Q48 460 95 478 Q142 496 188 462 Q234 428 280 455 Q318 474 360 452 L360 760 L0 760Z"
          fill="#0c1a0a" />
        <path d="M0 540 Q58 510 115 528 Q172 546 228 514 Q272 490 315 510 Q342 522 360 508 L360 760 L0 760Z"
          fill="#0e1e0c" />
        {/* Pasture patches */}
        <ellipse cx="78"  cy="520" rx="58" ry="24" fill="#122214" opacity="0.65" />
        <ellipse cx="238" cy="508" rx="52" ry="22" fill="#122214" opacity="0.65" />
        <ellipse cx="335" cy="525" rx="38" ry="18" fill="#122214" opacity="0.60" />
        {/* Small farmhouse left pasture */}
        <rect x="55" y="508" width="14" height="10" fill="#0a1608" />
        <path d="M53 508 L62 500 L71 508Z" fill="#0a1608" />
        {/* Small farmhouse right pasture */}
        <rect x="220" y="497" width="12" height="9" fill="#0a1608" />
        <path d="M218 497 L226 490 L234 497Z" fill="#0a1608" />
        {/* Dense near-forest trees */}
        {Array.from({ length: 12 }, (_, i) => {
          const x = i * 32
          const y = 622 + (i % 3) * 6
          return <path key={i} d={`M${x} ${y} L${x+16} ${y-50} L${x+32} ${y}Z`} fill={i%2===0 ? '#091508' : '#0b1c0a'} />
        })}
        {/* Ground */}
        <rect x="0" y="628" width="360" height="132" fill="#080e06" />
      </svg>
      {/* Header */}
      <motion.div
        className="text-center pt-8 pb-2 px-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-black text-3xl tracking-widest text-white">NumKnight</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace', marginTop: 4, letterSpacing: '0.08em' }}>
          v{APP_VERSION} · {DIFFICULTY}
        </p>
      </motion.div>

      {/* Map */}
      <div className="flex-1 px-4 pb-1" style={{ position: 'relative', overflow: 'visible' }}>
        <div style={{ position: 'relative', width: '100%', overflow: 'visible' }}>
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            style={{ width: '100%', display: 'block', overflow: 'visible' }}
          >
            {/* Dim guide trail */}
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
          </svg>

          {/* Knight marker */}
          <motion.div
            style={{ position: 'absolute', zIndex: 10, pointerEvents: 'none' }}
            initial={{ left: initLeft, top: initTop }}
            animate={{ left: knightLeft, top: knightTop }}
            transition={{ type: 'tween', duration: 0.14, ease: 'linear' }}
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
                world={world} index={i} status={status} trophy={trophy}
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
          {canFight ? 'FIGHT !' : selectedStatus === 'locked' ? 'LOCKED' : 'CLEARED'}
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={onRestart}
          className="w-full text-white/28 text-sm font-bold tracking-widest py-1 cursor-pointer hover:text-white/50 transition-colors"
        >
          ↺ New Game
        </motion.button>
      </div>
    </div>
  )
}
