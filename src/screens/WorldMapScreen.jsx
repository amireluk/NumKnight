/* eslint-disable no-undef */
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DIFFICULTY } from '../game/campaign.config'

const TROPHY_EMOJI = { gold: '🥇', silver: '🥈', bronze: '🥉' }

function getBestTrophy(trophies, worlds, worldIndex) {
  const offset = worlds.slice(0, worldIndex).reduce((sum, w) => sum + w.battles, 0)
  const slice  = trophies.slice(offset, offset + worlds[worldIndex].battles)
  if (slice.includes('gold'))   return 'gold'
  if (slice.includes('silver')) return 'silver'
  if (slice.includes('bronze')) return 'bronze'
  return null
}

// ── Region panoramic strips (360×100, xMidYMid slice) ───────────────────────

function ForestStrip() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 100"
      preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="wm-fs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4a9ed8" />
          <stop offset="100%" stopColor="#89cef0" />
        </linearGradient>
      </defs>
      <rect width="360" height="100" fill="url(#wm-fs-sky)" />
      {/* Sun */}
      <circle cx="316" cy="20" r="18" fill="#f0d070" opacity="0.35" />
      <circle cx="316" cy="20" r="11" fill="#f0d070" opacity="0.85" />
      {/* Birds */}
      <path d="M90 28 Q93 25 96 28" stroke="#2e6080" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M104 23 Q107 20 110 23" stroke="#2e6080" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Far hill */}
      <path d="M0 58 Q60 36 120 52 Q180 66 240 44 Q300 24 360 42 L360 100 L0 100Z" fill="#3e6830" />
      {/* Near hill */}
      <path d="M0 72 Q70 54 140 68 Q210 80 280 62 Q330 50 360 60 L360 100 L0 100Z" fill="#4e8040" />
      {/* Ground */}
      <rect x="0" y="85" width="360" height="15" fill="#3a5828" />
      {/* Trees */}
      {[[30,72],[52,66],[76,72],[152,58],[174,52],[196,60],[262,64],[282,58],[304,66]].map(([x,y],i) => (
        <path key={i} d={`M${x-10} ${y} L${x} ${y-26} L${x+10} ${y}Z`}
          fill={i % 2 === 0 ? '#1e3e14' : '#264c1a'} />
      ))}
      {/* Flowers */}
      <circle cx="110" cy="87" r="2.2" fill="#f9d84a" opacity="0.8" />
      <circle cx="200" cy="88" r="1.8" fill="#f87171" opacity="0.75" />
      <circle cx="240" cy="87" r="2"   fill="#f9d84a" opacity="0.7" />
    </svg>
  )
}

function SwampStrip() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 100"
      preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="wm-sw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#182218" />
          <stop offset="100%" stopColor="#2e4230" />
        </linearGradient>
      </defs>
      <rect width="360" height="100" fill="url(#wm-sw-sky)" />
      {/* Moon */}
      <circle cx="48" cy="20" r="14" fill="#c3d294" opacity="0.28" />
      <circle cx="48" cy="20" r="9"  fill="#c3d294" opacity="0.42" />
      {/* Ground */}
      <rect x="0" y="60" width="360" height="40" fill="#111a10" />
      {/* Water */}
      <ellipse cx="80"  cy="74" rx="50" ry="8"  fill="#0e2018" />
      <ellipse cx="220" cy="76" rx="44" ry="7"  fill="#0e2018" />
      <ellipse cx="320" cy="71" rx="32" ry="6"  fill="#0e2018" />
      {/* Ripples */}
      <path d="M48 72 Q62 69 76 72"  stroke="#1a3028" strokeWidth="1" fill="none" opacity="0.7" />
      <path d="M192 73 Q208 70 224 73" stroke="#1a3028" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Dead trees */}
      <line x1="28"  y1="60" x2="28"  y2="14" stroke="#0a140a" strokeWidth="4"   strokeLinecap="round" />
      <line x1="28"  y1="28" x2="14"  y2="18" stroke="#0a140a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="28"  y1="28" x2="44"  y2="20" stroke="#0a140a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="28"  y1="44" x2="16"  y2="36" stroke="#0a140a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="148" y1="60" x2="148" y2="16" stroke="#0a140a" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="148" y1="30" x2="132" y2="20" stroke="#0a140a" strokeWidth="2"   strokeLinecap="round" />
      <line x1="148" y1="30" x2="164" y2="22" stroke="#0a140a" strokeWidth="2"   strokeLinecap="round" />
      <line x1="310" y1="60" x2="310" y2="18" stroke="#0a140a" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="310" y1="32" x2="295" y2="22" stroke="#0a140a" strokeWidth="2"   strokeLinecap="round" />
      <line x1="310" y1="32" x2="326" y2="24" stroke="#0a140a" strokeWidth="2"   strokeLinecap="round" />
      {/* Reeds */}
      {[175, 188, 200, 338, 350].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="62" x2={x} y2="42" stroke="#223820" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx={x} cy="40" rx="2.5" ry="6" fill="#223820" />
        </g>
      ))}
      {/* Mist */}
      <path d="M0 57 Q90 51 180 57 Q270 63 360 55 L360 67 L0 67Z"
        fill="white" opacity="0.022" />
    </svg>
  )
}

function MountainsStrip() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 100"
      preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="wm-mt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#223848" />
          <stop offset="100%" stopColor="#72a8be" />
        </linearGradient>
      </defs>
      <rect width="360" height="100" fill="url(#wm-mt-sky)" />
      {/* Pale sun */}
      <circle cx="316" cy="18" r="14" fill="#d8eaf4" opacity="0.35" />
      <circle cx="316" cy="18" r="9"  fill="#d8eaf4" opacity="0.65" />
      {/* Far peaks */}
      <path d="M0 72 L24 34 L46 56 L72 18 L100 48 L128 26 L156 50 L186 30 L216 54 L244 26 L272 50 L300 20 L330 46 L360 28 L360 82 L0 82Z"
        fill="#324a58" />
      {/* Far snow */}
      {[[24,34],[72,18],[128,26],[186,30],[244,26],[300,20]].map(([x,y],i) => (
        <path key={i} d={`M${x} ${y} L${x-8} ${y+14} L${x+8} ${y+14}Z`}
          fill="#ddeef8" opacity="0.75" />
      ))}
      {/* Near peaks */}
      <path d="M0 90 L20 54 L40 74 L64 38 L90 64 L114 44 L140 68 L166 46 L194 70 L220 48 L248 72 L274 50 L302 74 L328 52 L360 68 L360 100 L0 100Z"
        fill="#263848" />
      {/* Near snow */}
      {[[20,54],[64,38],[114,44],[166,46],[220,48],[274,50],[328,52]].map(([x,y],i) => (
        <path key={i} d={`M${x} ${y} L${x-6} ${y+12} L${x+6} ${y+12}Z`}
          fill="#e0eef6" opacity="0.88" />
      ))}
      {/* Rocky ground */}
      <path d="M0 92 Q40 86 80 90 Q120 94 160 88 Q200 82 240 88 Q290 94 360 86 L360 100 L0 100Z"
        fill="#1c2c36" />
      {/* Snow patches on ground */}
      <ellipse cx="50"  cy="94" rx="18" ry="3.5" fill="#ddeef8" opacity="0.4" />
      <ellipse cx="210" cy="92" rx="14" ry="3"   fill="#ddeef8" opacity="0.35" />
    </svg>
  )
}

function CastleStrip() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 100"
      preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="wm-cs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#040710" />
          <stop offset="100%" stopColor="#0c1628" />
        </linearGradient>
      </defs>
      <rect width="360" height="100" fill="url(#wm-cs-sky)" />
      {/* Stars */}
      {[[22,10],[58,7],[94,16],[136,9],[176,14],[218,7],[256,12],[296,8],[334,16],[42,24],[156,22],[282,20]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill="white" opacity={0.2 + (i % 3) * 0.1} />
      ))}
      {/* Moon */}
      <circle cx="44" cy="20" r="14" fill="#c4d0de" opacity="0.28" />
      <circle cx="44" cy="20" r="9"  fill="#c4d0de" opacity="0.52" />
      {/* Storm cloud */}
      <path d="M140 14 Q152 8 166 12 Q172 6 176 14 Q182 10 184 18 Q182 24 172 22 Q162 26 150 22 Q140 24 136 18 Q134 12 140 14Z"
        fill="#121e30" opacity="0.9" />
      {/* Left battlements */}
      <path d="M0 68 L0 58 L8 58 L8 52 L14 52 L14 58 L22 58 L22 52 L28 52 L28 58 L36 58 L36 52 L42 52 L42 58 L52 58 L52 68Z"
        fill="#040b14" />
      {/* Central tower */}
      <rect x="148" y="8" width="64" height="92" fill="#050c16" />
      <path d="M146 8 L148 8 L148 2 L156 2 L156 8 L164 8 L164 2 L172 2 L172 8 L180 8 L180 2 L188 2 L188 8 L196 8 L196 2 L204 2 L204 8 L212 8 L212 14 L146 14Z"
        fill="#050c16" />
      {/* Glowing window */}
      <rect x="172" y="32" width="16" height="22" rx="8" fill="#6b4a08" />
      <rect x="174" y="34" width="12" height="18" rx="6" fill="#f59e0b" opacity="0.45" />
      {/* Right battlements */}
      <path d="M212 68 L212 58 L220 58 L220 52 L226 52 L226 58 L234 58 L234 52 L240 52 L240 58 L248 58 L248 52 L254 52 L254 58 L262 58 L262 52 L268 52 L268 58 L276 58 L276 52 L282 52 L282 58 L290 58 L290 52 L296 52 L296 58 L304 58 L304 52 L310 52 L310 58 L318 58 L318 52 L324 52 L324 58 L332 58 L332 52 L338 52 L338 58 L346 58 L346 52 L352 52 L352 58 L360 58 L360 68Z"
        fill="#040b14" />
      {/* Stone floor */}
      <rect x="0" y="68" width="360" height="32" fill="#03080e" />
      {[40,80,120,200,240,280,320].map((x, i) => (
        <line key={i} x1={x} y1="68" x2={x} y2="100" stroke="#070f1a" strokeWidth="0.8" />
      ))}
      <line x1="0" y1="82" x2="360" y2="82" stroke="#070f1a" strokeWidth="0.8" />
    </svg>
  )
}

function DragonLairStrip() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 100"
      preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="wm-dl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#050100" />
          <stop offset="100%" stopColor="#2a0600" />
        </linearGradient>
        <radialGradient id="wm-dl-glow" cx="50%" cy="100%" r="65%">
          <stop offset="0%"   stopColor="rgba(220,60,0,0.55)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="360" height="100" fill="url(#wm-dl-sky)" />
      <rect width="360" height="100" fill="url(#wm-dl-glow)" />
      {/* Stalactites */}
      {[[0,20],[22,30],[44,20],[68,34],[90,22],[114,28],[138,20],[162,32],[186,22],[210,26],[234,20],[258,30],[282,18],[306,26],[330,22],[354,30]].map(([x,h],i) => (
        <path key={i} d={`M${x} 0 L${x + h * 0.45} 0 L${x + h * 0.22} ${h}Z`}
          fill={i % 2 === 0 ? '#120400' : '#1a0500'} />
      ))}
      {/* Tip glows */}
      {[[11,20],[33,30],[79,34],[125,28],[173,32],[221,26],[269,30],[317,26],[365,30]].map(([x,h],i) => (
        <circle key={i} cx={x} cy={h} r="1.8" fill="#ff4500" opacity="0.5" />
      ))}
      {/* Rock back wall */}
      <path d="M0 58 Q30 48 60 54 Q90 40 120 50 Q150 38 180 48 Q210 36 240 46 Q270 34 300 44 Q330 32 360 42 L360 100 L0 100Z"
        fill="#160400" />
      {/* Ground */}
      <path d="M0 74 Q45 64 90 70 Q135 76 180 64 Q225 54 270 64 Q315 72 360 60 L360 100 L0 100Z"
        fill="#0e0200" />
      {/* Lava cracks */}
      <path d="M20 80 Q38 74 48 82 Q56 78 68 84" stroke="#ff4500" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M20 80 Q38 74 48 82 Q56 78 68 84" stroke="#ffaa00" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M142 76 Q160 70 170 78 Q178 74 190 80" stroke="#ff4500" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M142 76 Q160 70 170 78 Q178 74 190 80" stroke="#ffaa00" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M272 74 Q286 68 296 76 Q304 72 316 78" stroke="#ff4500" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85" />
      {/* Lava pools */}
      <ellipse cx="52"  cy="90" rx="24" ry="7" fill="#6b1200" opacity="0.8" />
      <ellipse cx="52"  cy="90" rx="14" ry="4" fill="#ff5500" opacity="0.55" />
      <ellipse cx="220" cy="92" rx="22" ry="7" fill="#6b1200" opacity="0.8" />
      <ellipse cx="220" cy="92" rx="12" ry="4" fill="#ff5500" opacity="0.55" />
      <ellipse cx="330" cy="88" rx="18" ry="5" fill="#6b1200" opacity="0.7" />
      <ellipse cx="330" cy="88" rx="10" ry="3" fill="#ff5500" opacity="0.5" />
    </svg>
  )
}

const REGION_STRIPS = {
  forest:     ForestStrip,
  swamp:      SwampStrip,
  mountains:  MountainsStrip,
  castle:     CastleStrip,
  dragonLair: DragonLairStrip,
}

// ── Knight helmet marker ─────────────────────────────────────────────────────

function KnightHelmet() {
  return (
    <div style={{ filter: 'drop-shadow(0 0 7px rgba(251,191,36,0.9))' }}>
      <svg width="22" height="28" viewBox="0 0 24 30" fill="none">
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

// ── Region band ──────────────────────────────────────────────────────────────

function RegionBand({ world, status, trophy, isSelected, isKnight, onClick, delay }) {
  const Strip    = REGION_STRIPS[world.id] ?? ForestStrip
  const isLocked  = status === 'locked'
  const isCurrent = status === 'current'

  return (
    <motion.div
      initial={{ opacity: 0, x: -28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.28 }}
      onClick={onClick}
      style={{
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: 10,
        border: isSelected
          ? isCurrent
            ? '2px solid rgba(251,191,36,0.9)'
            : '2px solid rgba(167,139,250,0.65)'
          : '2px solid rgba(255,255,255,0.06)',
        boxShadow: isSelected
          ? isCurrent
            ? '0 0 20px rgba(251,191,36,0.4), inset 0 0 14px rgba(251,191,36,0.07)'
            : '0 0 14px rgba(167,139,250,0.25)'
          : 'none',
        transition: 'border-color 0.18s, box-shadow 0.18s',
      }}
    >
      {/* Scene background */}
      <Strip />

      {/* Left gradient for text legibility */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.20) 55%, rgba(0,0,0,0) 100%)',
      }} />

      {/* Locked overlay */}
      {isLocked && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', pointerEvents: 'none' }} />
      )}

      {/* Current pulsing border */}
      {isCurrent && (
        <motion.div
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 8, border: '2px solid rgba(251,191,36,0.55)' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
      )}

      {/* Left: icon + name */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        paddingInline: 14, gap: 10, pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 22, flexShrink: 0, filter: isLocked ? 'grayscale(1) brightness(0.35)' : undefined }}>
          {world.icon}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{
            fontSize: 13, fontWeight: 900, letterSpacing: '0.07em',
            color: isLocked ? 'rgba(255,255,255,0.25)' : isCurrent ? '#fbbf24' : 'rgba(255,255,255,0.88)',
            textShadow: '0 1px 5px rgba(0,0,0,0.95)',
            lineHeight: 1,
          }}>
            {world.name}
          </span>
          {world.timer !== null && !isLocked && (
            <span style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, opacity: 0.82, letterSpacing: '0.04em' }}>
              {world.timer}s / question
            </span>
          )}
        </div>
      </div>

      {/* Right: knight / trophy / lock */}
      <div style={{
        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {isKnight && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          >
            <KnightHelmet />
          </motion.div>
        )}
        {trophy && (
          <span style={{ fontSize: 22, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.8))', lineHeight: 1 }}>
            {TROPHY_EMOJI[trophy]}
          </span>
        )}
        {isLocked && (
          <span style={{ fontSize: 18, opacity: 0.45 }}>🔒</span>
        )}
      </div>
    </motion.div>
  )
}

// ── Screen ───────────────────────────────────────────────────────────────────

export function WorldMapScreen({
  worlds, currentWorldIndex, trophies,
  isTransition, onFight, onRestart,
}) {
  const initPos = isTransition ? Math.max(0, currentWorldIndex - 1) : currentWorldIndex

  const [selectedIndex, setSelectedIndex] = useState(initPos)
  const [knightPos,     setKnightPos]     = useState(initPos)
  const knightPosRef = useRef(initPos)
  const targetRef    = useRef(initPos)
  const stepTimerRef = useRef(null)

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

  const handleBandClick = (i) => {
    setSelectedIndex(i)
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current)
    targetRef.current = i
    scheduleStep()
  }

  const canFight = selectedIndex === currentWorldIndex
  const selectedStatus =
    selectedIndex < currentWorldIndex ? 'completed' :
    selectedIndex === currentWorldIndex ? 'current' : 'locked'

  return (
    <div
      className="flex flex-col h-dvh max-w-md mx-auto select-none"
      style={{ position: 'relative', background: '#04060c' }}
    >
      {/* Restart button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        onClick={onRestart}
        style={{
          position: 'absolute', top: 14, left: 14, zIndex: 30,
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 16,
          backdropFilter: 'blur(4px)',
        }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.75)' }}
        title="New Game"
      >
        ↺
      </motion.button>

      {/* Header */}
      <motion.div
        className="text-center pt-8 pb-3 px-6"
        style={{ flexShrink: 0 }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="font-black text-3xl tracking-widest text-white"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
          NumKnight
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', fontFamily: 'monospace', marginTop: 2, letterSpacing: '0.08em' }}>
          v{APP_VERSION} · {DIFFICULTY}
        </p>
      </motion.div>

      {/* Region bands */}
      <div className="flex-1 min-h-0 flex flex-col px-4" style={{ gap: 4 }}>
        {worlds.map((world, i) => {
          const status =
            i < currentWorldIndex  ? 'completed' :
            i === currentWorldIndex ? 'current'   : 'locked'
          const trophy = i < currentWorldIndex ? getBestTrophy(trophies, worlds, i) : null
          return (
            <RegionBand
              key={world.id}
              world={world}
              status={status}
              trophy={trophy}
              isSelected={selectedIndex === i}
              isKnight={knightPos === i}
              onClick={() => handleBandClick(i)}
              delay={0.08 + i * 0.06}
            />
          )
        })}
      </div>

      {/* Info strip */}
      <div className="px-6 pt-2" style={{ minHeight: 22, flexShrink: 0 }}>
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
            }}
          >
            {selectedStatus === 'locked' ? 'PATH NOT UNLOCKED' : 'WORLD CLEARED'}
          </motion.p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 pt-2" style={{ flexShrink: 0 }}>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, type: 'spring', stiffness: 210, damping: 18 }}
          whileTap={canFight ? { scale: 0.95 } : undefined}
          whileHover={canFight ? { scale: 1.03 } : undefined}
          onClick={canFight ? onFight : undefined}
          className={`w-full font-black text-2xl rounded-2xl h-14 shadow-xl tracking-widest transition-colors duration-200 ${
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
