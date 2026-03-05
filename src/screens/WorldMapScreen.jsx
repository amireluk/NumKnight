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

        <div style={circleStyle} onClick={onClick}>
          <span style={{ filter: isLocked ? 'grayscale(1) brightness(0.35)' : undefined }}>
            {world.icon}
          </span>
          {isComplete && <ConqueredX />}
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

      <span style={{
        fontSize: 9.5, fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: nameColor,
        whiteSpace: 'nowrap', lineHeight: 1,
        textShadow: '0 1px 4px rgba(0,0,0,0.9)',
      }}>
        {world.name}
      </span>

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
    // h-dvh + overflow-hidden keeps footer always in view
    <div
      className="flex flex-col h-dvh max-w-md mx-auto select-none"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* ── Kingdomino-style kingdom background ────────────────────────── */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        viewBox="0 0 360 760" preserveAspectRatio="xMidYMid slice"
      >
        {/* Sky */}
        <defs>
          <linearGradient id="km-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a9ed8" />
            <stop offset="100%" stopColor="#89cef0" />
          </linearGradient>
          <linearGradient id="km-hill1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6abf50" />
            <stop offset="100%" stopColor="#4e9a38" />
          </linearGradient>
          <linearGradient id="km-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#52a83a" />
            <stop offset="100%" stopColor="#3e8228" />
          </linearGradient>
          <radialGradient id="km-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffe066" />
            <stop offset="70%"  stopColor="#f0c030" />
            <stop offset="100%" stopColor="rgba(240,192,48,0)" />
          </radialGradient>
        </defs>

        <rect width="360" height="760" fill="url(#km-sky)" />

        {/* Sun */}
        <circle cx="316" cy="58" r="44" fill="url(#km-sun)" opacity="0.55" />
        <circle cx="316" cy="58" r="26" fill="#ffe066" opacity="0.95" />
        {/* Sun rays */}
        {[0,45,90,135,180,225,270,315].map((a, i) => {
          const r = (a * Math.PI) / 180
          return <line key={i}
            x1={316 + Math.cos(r)*30} y1={58 + Math.sin(r)*30}
            x2={316 + Math.cos(r)*46} y2={58 + Math.sin(r)*46}
            stroke="#ffe066" strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
        })}

        {/* Clouds */}
        <g opacity="0.92">
          <ellipse cx="60"  cy="72" rx="36" ry="18" fill="white" />
          <ellipse cx="44"  cy="80" rx="22" ry="14" fill="white" />
          <ellipse cx="82"  cy="78" rx="26" ry="16" fill="white" />
          <ellipse cx="60"  cy="84" rx="34" ry="12" fill="white" />
        </g>
        <g opacity="0.85">
          <ellipse cx="198" cy="50" rx="28" ry="14" fill="white" />
          <ellipse cx="184" cy="58" rx="18" ry="11" fill="white" />
          <ellipse cx="216" cy="56" rx="20" ry="12" fill="white" />
          <ellipse cx="198" cy="62" rx="26" ry="10" fill="white" />
        </g>

        {/* ── Cheerful castle (upper centre-right) ── */}
        {/* Castle base / keep */}
        <rect x="232" y="148" width="88" height="110" rx="4" fill="#d4b870" />
        <rect x="232" y="148" width="88" height="110" rx="4" fill="#c8a858" opacity="0.6" />
        {/* Stone lines */}
        {[160,172,184,196,208,220,232].map((y,i)=>(
          <line key={i} x1="232" y1={y} x2="320" y2={y} stroke="#b09040" strokeWidth="1" opacity="0.5"/>
        ))}
        {[248,264,280,296,312].map((x,i)=>(
          <line key={i} x1={x} y1="148" x2={x} y2="258" stroke="#b09040" strokeWidth="1" opacity="0.4"/>
        ))}
        {/* Left tower */}
        <rect x="222" y="128" width="28" height="130" rx="3" fill="#c8a858" />
        <rect x="222" y="128" width="28" height="130" rx="3" fill="#d4b870" opacity="0.5" />
        {/* Right tower */}
        <rect x="302" y="136" width="28" height="122" rx="3" fill="#c8a858" />
        {/* Left battlements */}
        <path d="M220 128 L222 128 L222 120 L228 120 L228 128 L234 128 L234 120 L240 120 L240 128 L246 128 L246 120 L250 120 L250 128 L252 128 L252 134 L220 134Z" fill="#d4b870" />
        {/* Right battlements */}
        <path d="M300 136 L302 136 L302 128 L308 128 L308 136 L314 136 L314 128 L320 128 L320 136 L326 136 L326 128 L330 128 L330 136 L332 136 L332 142 L300 142Z" fill="#c8a858" />
        {/* Keep battlements */}
        <path d="M230 148 L232 148 L232 140 L238 140 L238 148 L246 148 L246 140 L252 140 L252 148 L260 148 L260 140 L266 140 L266 148 L274 148 L274 140 L280 140 L280 148 L288 148 L288 140 L294 140 L294 148 L302 148 L302 140 L308 140 L308 148 L320 148 L320 154 L230 154Z" fill="#d4b870" />
        {/* Gate arch */}
        <rect x="265" y="220" width="22" height="38" rx="11" fill="#6b4a18" />
        <rect x="267" y="222" width="18" height="34" rx="9"  fill="#4a3010" />
        {/* Windows */}
        <rect x="230" y="162" width="12" height="16" rx="6" fill="#5a8ab0" />
        <rect x="231" y="163" width="10" height="14" rx="5" fill="#7ab4d8" opacity="0.7" />
        <rect x="306" y="168" width="12" height="16" rx="6" fill="#5a8ab0" />
        <rect x="307" y="169" width="10" height="14" rx="5" fill="#7ab4d8" opacity="0.7" />
        <rect x="258" y="165" width="11" height="15" rx="5.5" fill="#5a8ab0" />
        <rect x="293" y="165" width="11" height="15" rx="5.5" fill="#5a8ab0" />
        {/* Pennants / flags */}
        <line x1="236" y1="120" x2="236" y2="96"  stroke="#8b6020" strokeWidth="2" />
        <path d="M236 96 L252 103 L236 110Z" fill="#e84040" />
        <line x1="316" y1="128" x2="316" y2="104" stroke="#8b6020" strokeWidth="2" />
        <path d="M316 104 L332 111 L316 118Z" fill="#4040e8" />

        {/* ── Far rolling hills ── */}
        <path d="M0 310 Q40 272 80 290 Q120 308 160 278 Q200 248 240 272 Q280 295 320 268 Q345 252 360 260 L360 380 L0 380Z"
          fill="#6abf50" />
        <path d="M0 330 Q50 298 95 315 Q140 332 185 305 Q225 280 265 302 Q305 322 360 295 L360 400 L0 400Z"
          fill="#5aad42" />

        {/* ── Forest tree clusters ── */}
        {/* Left cluster */}
        {[[6,312],[22,320],[38,312],[54,320],[70,312],[4,328],[20,332]].map(([x,y],i) => (
          <g key={i}>
            <ellipse cx={x+14} cy={y-18} rx={13} ry={16} fill={i%2===0?'#2e7e28':'#3a9230'} />
            <ellipse cx={x+14} cy={y-22} rx={10} ry={12} fill={i%2===0?'#3a9230':'#4aaa3a'} />
            <rect x={x+11} y={y-4} width={6} height={12} rx={2} fill="#7a4820" />
          </g>
        ))}
        {/* Right cluster */}
        {[[276,298],[292,308],[308,298],[324,306],[340,298],[284,316],[300,320]].map(([x,y],i) => (
          <g key={i}>
            <ellipse cx={x+10} cy={y-16} rx={12} ry={15} fill={i%2===0?'#2e7e28':'#3a9230'} />
            <ellipse cx={x+10} cy={y-20} rx={9}  ry={11} fill={i%2===0?'#3a9230':'#4aaa3a'} />
            <rect x={x+7} y={y-4} width={6} height={10} rx={2} fill="#7a4820" />
          </g>
        ))}

        {/* ── River ── */}
        <path d="M10 455 Q68 418 135 440 Q200 462 266 422 Q312 396 355 410"
          stroke="#3a8ed8" strokeWidth="22" fill="none" strokeLinecap="round" />
        <path d="M10 455 Q68 418 135 440 Q200 462 266 422 Q312 396 355 410"
          stroke="#5aaae8" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M10 455 Q68 418 135 440 Q200 462 266 422 Q312 396 355 410"
          stroke="#7ac0f0" strokeWidth="5"  fill="none" strokeLinecap="round" opacity="0.6" />
        {/* River shimmer */}
        <path d="M50 438 Q80 428 110 436" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35" />
        <path d="M180 450 Q210 440 240 446" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35" />

        {/* ── Wheat / grain fields ── */}
        <path d="M0 480 Q35 465 70 475 L70 540 Q35 550 0 540Z" fill="#e8b830" />
        <path d="M0 480 Q35 465 70 475 L70 540 Q35 550 0 540Z" fill="#d4a020" opacity="0.4" />
        {/* Wheat lines */}
        {[10,20,30,40,50,60].map((x,i)=>(
          <line key={i} x1={x} y1="478" x2={x} y2="538" stroke="#c09018" strokeWidth="1" opacity="0.5"/>
        ))}

        <path d="M290 470 Q322 455 360 465 L360 535 Q328 548 290 538Z" fill="#e8b830" />
        {[302,314,326,338,350].map((x,i)=>(
          <line key={i} x1={x} y1="468" x2={x} y2="534" stroke="#c09018" strokeWidth="1" opacity="0.5"/>
        ))}

        {/* ── Pasture / green fields ── */}
        <path d="M70 475 Q130 458 185 470 L185 545 Q130 558 70 540Z" fill="#5cb84a" />
        <path d="M185 468 Q240 452 290 462 L290 532 Q240 548 185 538Z" fill="#64c452" />

        {/* Windmill (left pasture) */}
        <rect x="108" y="482" width="8" height="40" rx="2" fill="#c8a050" />
        <circle cx="112" cy="482" r="5" fill="#b08840" />
        {[0,90,180,270].map((a,i) => {
          const r = (a * Math.PI)/180
          return <line key={i} x1="112" y1="482"
            x2={112+Math.cos(r)*18} y2={482+Math.sin(r)*18}
            stroke="#d4a858" strokeWidth="3" strokeLinecap="round" />
        })}

        {/* Farmhouse (right pasture) */}
        <rect x="218" y="492" width="22" height="16" rx="2" fill="#e8c880" />
        <path d="M215 492 L229 480 L243 492Z" fill="#d44030" />
        <rect x="225" y="498" width="7" height="10" rx="1" fill="#7ab4d8" />

        {/* ── Rolling near hills ── */}
        <path d="M0 548 Q55 518 110 535 Q165 552 220 520 Q268 492 315 514 Q342 526 360 510 L360 760 L0 760Z"
          fill="#52a83a" />
        <path d="M0 590 Q60 565 120 582 Q178 598 235 568 Q278 546 325 566 Q348 576 360 562 L360 760 L0 760Z"
          fill="#4a9832" />

        {/* Near trees */}
        {Array.from({ length: 10 }, (_, i) => {
          const x = i * 38 + 4
          const y = 600 + (i % 3) * 8
          return (
            <g key={i}>
              <ellipse cx={x+14} cy={y-22} rx={14} ry={18} fill={i%2===0?'#2e7e28':'#3a9230'} />
              <ellipse cx={x+14} cy={y-28} rx={10} ry={13} fill={i%2===0?'#3a9230':'#4aaa3a'} />
              <rect x={x+11} y={y-6} width={6} height={14} rx={2} fill="#7a4820" />
            </g>
          )
        })}

        {/* Ground base */}
        <rect x="0" y="618" width="360" height="142" fill="#3e8228" />
      </svg>

      {/* ── Restart button — top-left corner, unobtrusive ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onRestart}
        style={{
          position: 'absolute', top: 14, left: 14, zIndex: 20,
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 16,
          backdropFilter: 'blur(4px)',
        }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ background: 'rgba(0,0,0,0.45)', color: 'rgba(255,255,255,0.75)' }}
        title="New Game"
      >
        ↺
      </motion.button>

      {/* ── Header ── */}
      <motion.div
        className="text-center pt-8 pb-2 px-6"
        style={{ position: 'relative', zIndex: 10 }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-black text-3xl tracking-widest text-white"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
          NumKnight
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace', marginTop: 4, letterSpacing: '0.08em',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
          v{APP_VERSION} · {DIFFICULTY}
        </p>
      </motion.div>

      {/* ── Map ── */}
      <div className="flex-1 min-h-0 px-4 pb-1" style={{ position: 'relative', zIndex: 10, overflow: 'visible' }}>
        <div style={{ position: 'relative', width: '100%', overflow: 'visible' }}>
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            style={{ width: '100%', display: 'block', overflow: 'visible' }}
          >
            {/* Guide trail */}
            <path d={PATH} fill="none" stroke="rgba(0,0,0,0.18)"
              strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Animated gold path */}
            <motion.path
              d={PATH} fill="none" stroke="#fbbf24" strokeWidth="3.5"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.15 }}
              style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.6))' }}
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

      {/* ── Info strip ── */}
      <div className="px-6" style={{ minHeight: 22, position: 'relative', zIndex: 10 }}>
        {!canFight && (
          <motion.p
            key={selectedIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs font-bold tracking-widest"
            style={{
              color: selectedStatus === 'locked'
                ? 'rgba(167,139,250,0.75)'
                : 'rgba(251,191,36,0.75)',
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {selectedStatus === 'locked' ? 'PATH NOT UNLOCKED' : 'WORLD CLEARED'}
          </motion.p>
        )}
      </div>

      {/* ── Footer — FIGHT button only ── */}
      <div className="px-6 pb-6 pt-2" style={{ position: 'relative', zIndex: 10 }}>
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
      </div>
    </div>
  )
}
