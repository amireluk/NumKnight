import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ParticleBurst } from '../components/ParticleBurst'

const TROPHY_COLOR = { gold: '#fbbf24', silver: '#c0c8d4', bronze: '#cd7c3a' }

function TrophyCup({ trophy, size = 48 }) {
  const color = TROPHY_COLOR[trophy]
  const s = size
  return (
    <svg width={s} height={Math.round(s * 1.1)} viewBox="0 0 48 52" fill="none">
      <path d="M10 4 L38 4 L34 28 Q32 36 24 38 Q16 36 14 28Z" fill={color} />
      <path d="M10 8 Q2 8 2 17 Q2 26 10 26" stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M38 8 Q46 8 46 17 Q46 26 38 26" stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <rect x="20" y="38" width="8" height="7" fill={color} />
      <rect x="12" y="45" width="24" height="5" rx="2.5" fill={color} />
    </svg>
  )
}

function animateCount(from, to, ms, onTick, onDone) {
  const steps = Math.max(1, Math.ceil(ms / 16))
  let step = 0
  let raf
  const tick = () => {
    step++
    const t = Math.min(step / steps, 1)
    const ease = 1 - Math.pow(1 - t, 3)
    onTick(Math.round(from + (to - from) * ease))
    if (t < 1) { raf = requestAnimationFrame(tick) }
    else { onDone?.() }
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

// ── Per-region SVG illustrations ─────────────────────────────────────────────

function ForestScene() {
  return (
    <svg width="100%" viewBox="0 0 200 140" style={{ display: 'block' }} fill="none">
      <defs>
        <linearGradient id="ac-sky-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a9ed8" />
          <stop offset="100%" stopColor="#89cef0" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" rx="18" fill="url(#ac-sky-f)" />
      {/* Sun */}
      <circle cx="158" cy="30" r="20" fill="#f0d070" opacity="0.45" />
      <circle cx="158" cy="30" r="13" fill="#f0d070" opacity="0.8" />
      {/* Far hills */}
      <path d="M0 90 Q50 65 100 78 Q150 92 200 70 L200 140 L0 140Z" fill="#3e5830" />
      {/* Near hill */}
      <path d="M0 108 Q55 88 100 100 Q145 112 200 92 L200 140 L0 140Z" fill="#4e7040" />
      {/* Ground */}
      <rect x="0" y="122" width="200" height="18" rx="0" fill="#3a5828" />
      {/* Trees */}
      <path d="M18 108 L30 72 L42 108Z"  fill="#1e3e14" />
      <path d="M36 112 L48 78 L60 112Z"  fill="#264c1a" />
      <path d="M10 114 L22 84 L34 114Z"  fill="#1e3e14" />
      <path d="M148 96 L160 62 L172 96Z" fill="#1e3e14" />
      <path d="M164 100 L176 68 L188 100Z" fill="#264c1a" />
      <path d="M142 100 L154 70 L166 100Z" fill="#1a3810" />
      {/* Birds */}
      <path d="M72 48 Q75 45 78 48" stroke="#2e6080" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M82 42 Q85 39 88 42" stroke="#2e6080" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function SwampScene() {
  return (
    <svg width="100%" viewBox="0 0 200 140" style={{ display: 'block' }} fill="none">
      <defs>
        <linearGradient id="ac-sky-s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#182218" />
          <stop offset="100%" stopColor="#2e4230" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" rx="18" fill="url(#ac-sky-s)" />
      {/* Moon */}
      <circle cx="42" cy="32" r="16" fill="#c3d294" opacity="0.28" />
      <circle cx="42" cy="32" r="10" fill="#c3d294" opacity="0.40" />
      {/* Ground */}
      <rect x="0" y="95" width="200" height="45" rx="0" fill="#111a10" />
      {/* Water */}
      <ellipse cx="68"  cy="102" rx="38" ry="7" fill="#0e2018" />
      <ellipse cx="150" cy="105" rx="32" ry="6" fill="#0e2018" />
      <line x1="48"  y1="100" x2="88"  y2="100" stroke="#1a3028" strokeWidth="1.2" opacity="0.8" />
      <line x1="124" y1="103" x2="174" y2="103" stroke="#1a3028" strokeWidth="1.2" opacity="0.8" />
      {/* Dead tree left */}
      <line x1="22" y1="95"  x2="22" y2="28"  stroke="#0a140a" strokeWidth="4"   strokeLinecap="round" />
      <line x1="22" y1="52"  x2="10" y2="38"  stroke="#0a140a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="22" y1="52"  x2="36" y2="42"  stroke="#0a140a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="22" y1="68"  x2="12" y2="58"  stroke="#0a140a" strokeWidth="1.6" strokeLinecap="round" />
      {/* Dead tree right */}
      <line x1="178" y1="95"  x2="178" y2="34"  stroke="#0a140a" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="178" y1="55"  x2="165" y2="42"  stroke="#0a140a" strokeWidth="2"   strokeLinecap="round" />
      <line x1="178" y1="55"  x2="192" y2="45"  stroke="#0a140a" strokeWidth="2"   strokeLinecap="round" />
      {/* Reeds */}
      <line x1="95"  y1="96" x2="94"  y2="75" stroke="#223820" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="94"  cy="73" rx="2.5" ry="6" fill="#223820" />
      <line x1="108" y1="96" x2="108" y2="78" stroke="#223820" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="108" cy="76" rx="2.5" ry="6" fill="#223820" />
    </svg>
  )
}

function MountainsScene() {
  return (
    <svg width="100%" viewBox="0 0 200 140" style={{ display: 'block' }} fill="none">
      <defs>
        <linearGradient id="ac-sky-m" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#223848" />
          <stop offset="100%" stopColor="#72a8be" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" rx="18" fill="url(#ac-sky-m)" />
      <circle cx="162" cy="24" r="14" fill="#d8eaf4" opacity="0.35" />
      <circle cx="162" cy="24" r="9"  fill="#d8eaf4" opacity="0.65" />
      <path d="M0 88 L22 48 L40 72 L58 32 L78 60 L96 40 L114 64 L132 44 L150 68 L168 38 L188 62 L200 48 L200 100 L0 100Z" fill="#324a58" />
      <path d="M22 48 L17 60 L27 60Z"  fill="#ddeef8" opacity="0.75" />
      <path d="M58 32 L53 46 L63 46Z"  fill="#ddeef8" opacity="0.75" />
      <path d="M96 40 L91 52 L101 52Z" fill="#ddeef8" opacity="0.75" />
      <path d="M132 44 L127 56 L137 56Z" fill="#ddeef8" opacity="0.75" />
      <path d="M168 38 L163 50 L173 50Z" fill="#ddeef8" opacity="0.75" />
      <path d="M0 110 L18 68 L36 92 L54 54 L72 82 L92 48 L112 76 L130 56 L150 80 L168 58 L188 82 L200 62 L200 140 L0 140Z" fill="#263848" />
      <path d="M18 68 L13 80 L23 80Z"  fill="#e0eef6" opacity="0.88" />
      <path d="M54 54 L49 68 L59 68Z"  fill="#e0eef6" opacity="0.88" />
      <path d="M92 48 L87 62 L97 62Z"  fill="#e0eef6" opacity="0.88" />
      <path d="M130 56 L125 68 L135 68Z" fill="#e0eef6" opacity="0.88" />
      <path d="M168 58 L163 70 L173 70Z" fill="#e0eef6" opacity="0.88" />
      <path d="M0 118 Q25 110 50 115 Q80 122 110 112 Q140 104 170 114 Q188 120 200 112 L200 140 L0 140Z" fill="#1c2c36" />
      <ellipse cx="30"  cy="118" rx="16" ry="4" fill="#ddeef8" opacity="0.45" />
      <ellipse cx="130" cy="115" rx="13" ry="3" fill="#ddeef8" opacity="0.38" />
    </svg>
  )
}

function CastleScene() {
  return (
    <svg width="100%" viewBox="0 0 200 140" style={{ display: 'block' }} fill="none">
      <defs>
        <linearGradient id="ac-sky-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#040710" />
          <stop offset="100%" stopColor="#0c1628" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" rx="18" fill="url(#ac-sky-c)" />
      {[[20,15],[45,8],[70,20],[95,10],[125,18],[150,8],[175,14],[188,24],[10,32],[55,28],[140,25]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="0.8" fill="white" opacity={0.25 + (i%4)*0.1} />
      ))}
      <circle cx="158" cy="26" r="14" fill="#c4d0de" opacity="0.30" />
      <circle cx="158" cy="26" r="9"  fill="#c4d0de" opacity="0.52" />
      <path d="M130 20 Q138 14 148 18 Q154 14 156 20 Q160 18 161 24 Q160 28 153 26 Q147 30 138 27 Q130 30 128 24 Q126 20 130 20Z" fill="#121e30" opacity="0.85" />
      <path d="M0 90 L0 78 L8 78 L8 72 L12 72 L12 78 L18 78 L18 72 L22 72 L22 78 L30 78 L30 90Z" fill="#060e18" />
      <path d="M160 90 L160 78 L168 78 L168 72 L172 72 L172 78 L180 78 L180 72 L184 72 L184 78 L192 78 L192 72 L196 72 L196 78 L200 78 L200 90Z" fill="#060e18" />
      <rect x="82" y="18" width="36" height="112" fill="#050c16" />
      <path d="M80 18 L82 18 L82 12 L88 12 L88 18 L94 18 L94 12 L100 12 L100 18 L106 18 L106 12 L112 12 L112 18 L118 18 L118 22 L80 22Z" fill="#050c16" />
      <rect x="95" y="48" width="10" height="16" rx="5" fill="#6b4a08" />
      <rect x="96" y="49" width="8"  height="14" rx="4" fill="#f59e0b" opacity="0.42" />
      <path d="M0 112 L0 100 L8 100 L8 94 L13 94 L13 100 L20 100 L20 94 L25 94 L25 100 L32 100 L32 94 L37 94 L37 100 L44 100 L44 112Z" fill="#040b14" />
      <path d="M156 112 L156 100 L163 100 L163 94 L168 94 L168 100 L175 100 L175 94 L180 94 L180 100 L187 100 L187 94 L192 94 L192 100 L200 100 L200 112Z" fill="#040b14" />
      <rect x="0" y="110" width="200" height="30" rx="0" fill="#03080e" />
      {[20,40,60,80,100,120,140,160,180].map((x,i) => (
        <line key={i} x1={x} y1="110" x2={x} y2="140" stroke="#070f1a" strokeWidth="0.8" />
      ))}
      <line x1="0" y1="118" x2="200" y2="118" stroke="#070f1a" strokeWidth="0.8" />
      <line x1="0" y1="128" x2="200" y2="128" stroke="#070f1a" strokeWidth="0.8" />
    </svg>
  )
}

function DragonLairScene() {
  return (
    <svg width="100%" viewBox="0 0 200 140" style={{ display: 'block' }} fill="none">
      <defs>
        <linearGradient id="ac-sky-d" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050100" />
          <stop offset="100%" stopColor="#2a0600" />
        </linearGradient>
        <radialGradient id="ac-lava-glow" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="rgba(220,60,0,0.5)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="200" height="140" rx="18" fill="url(#ac-sky-d)" />
      <rect width="200" height="140" rx="18" fill="url(#ac-lava-glow)" />
      <path d="M0   0 L8   0 L4   20Z" fill="#120400" />
      <path d="M14  0 L22  0 L18  28Z" fill="#160500" />
      <path d="M30  0 L38  0 L34  18Z" fill="#120400" />
      <path d="M46  0 L56  0 L51  32Z" fill="#160500" />
      <path d="M64  0 L72  0 L68  22Z" fill="#120400" />
      <path d="M80  0 L88  0 L84  26Z" fill="#160500" />
      <path d="M96  0 L104 0 L100 19Z" fill="#120400" />
      <path d="M112 0 L120 0 L116 30Z" fill="#160500" />
      <path d="M128 0 L136 0 L132 20Z" fill="#120400" />
      <path d="M144 0 L152 0 L148 27Z" fill="#160500" />
      <path d="M160 0 L168 0 L164 17Z" fill="#120400" />
      <path d="M176 0 L184 0 L180 24Z" fill="#160500" />
      <path d="M192 0 L200 0 L196 19Z" fill="#120400" />
      {[[4,20],[18,28],[51,32],[84,26],[116,30],[148,27],[180,24]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="#ff4500" opacity="0.45" />
      ))}
      <path d="M0 80 Q22 68 40 75 Q62 62 85 72 Q108 58 130 68 Q152 55 175 65 Q190 56 200 62 L200 140 L0 140Z" fill="#160400" />
      <path d="M0 100 Q28 90 55 97 Q85 104 115 92 Q145 82 170 92 Q188 98 200 90 L200 140 L0 140Z" fill="#0e0200" />
      <path d="M15 104 Q28 98 36 106 Q42 103 52 108" stroke="#ff4500" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M15 104 Q28 98 36 106 Q42 103 52 108" stroke="#ffaa00" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M80 100 Q94 94 102 102 Q108 99 118 104" stroke="#ff4500" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M80 100 Q94 94 102 102 Q108 99 118 104" stroke="#ffaa00" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M148 98 Q160 92 170 100 Q176 97 186 103" stroke="#ff4500" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.85" />
      <ellipse cx="36"  cy="118" rx="20" ry="7"   fill="#6b1200" opacity="0.75" />
      <ellipse cx="36"  cy="118" rx="12" ry="4"   fill="#ff5500" opacity="0.50" />
      <ellipse cx="155" cy="120" rx="18" ry="6.5" fill="#6b1200" opacity="0.75" />
      <ellipse cx="155" cy="120" rx="10" ry="3.5" fill="#ff5500" opacity="0.50" />
      <rect x="0" y="128" width="200" height="12" rx="0" fill="#080100" />
    </svg>
  )
}

export const WORLD_SCENES = {
  forest:     ForestScene,
  swamp:      SwampScene,
  mountains:  MountainsScene,
  castle:     CastleScene,
  dragonLair: DragonLairScene,
}

// ── Screen ────────────────────────────────────────────────────────────────────

const TROPHY_RANK = { gold: 0, silver: 1, bronze: 2 }
const BURST_COUNT  = { gold: 58, silver: 32, bronze: 14 }
const BURST_COLORS = {
  gold:   ['#fbbf24', '#fde68a', '#fff', '#f59e0b', '#86efac'],
  silver: ['#c0c8d4', '#e2e8f0', '#fff', '#94a3b8', '#93c5fd'],
  bronze: ['#cd7c3a', '#e9a96a', '#fff', '#b45309', '#fde68a'],
}

export function AreaClearedScreen({ world, worldTrophies, worldScore, totalScore, onContinue, lang, t }) {
  const isRtl = lang === 'he'
  const Scene     = WORLD_SCENES[world.id] ?? ForestScene
  const prevTotal = totalScore - worldScore

  const [battleDisplay, setBattleDisplay] = useState(0)
  const [totalDisplay,  setTotalDisplay]  = useState(prevTotal)
  const [showContinue,  setShowContinue]  = useState(worldScore === 0)
  const [showBurst,     setShowBurst]     = useState(false)
  const cancelRef     = useRef([])
  const roundControls = useAnimation()

  // Derive best trophy for burst sizing
  const bestTrophy = worldTrophies.reduce((best, tr) =>
    (TROPHY_RANK[tr] ?? 2) < (TROPHY_RANK[best] ?? 2) ? tr : best, 'bronze')

  useEffect(() => {
    if (worldScore === 0) return

    const t1 = setTimeout(() => {
      setShowBurst(true)
      const cancel1 = animateCount(0, worldScore, 700, setBattleDisplay, () => {
        const t2 = setTimeout(() => {
          roundControls.start({
            scale: [1, 1.22, 1],
            filter: ['brightness(1)', 'brightness(1.8)', 'brightness(1)'],
            transition: { duration: 0.38, ease: 'easeInOut' },
          })
          const cancel2 = animateCount(prevTotal, totalScore, 650, setTotalDisplay, () => {
            setShowContinue(true)
          })
          cancelRef.current.push(cancel2)
        }, 350)
        cancelRef.current.push(() => clearTimeout(t2))
      })
      cancelRef.current.push(cancel1)
    }, 600)

    cancelRef.current.push(() => clearTimeout(t1))
    return () => cancelRef.current.forEach((fn) => fn?.())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col items-center h-dvh max-w-md mx-auto px-4 py-5 gap-4"
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at 50% 38%, rgba(251,191,36,0.11) 0%, transparent 65%), ' +
          'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
      }}
    >
      {/* 1. Region name */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
      >
        <p className="text-white font-black text-3xl tracking-wide">
          {t?.worldName?.[world.id] ?? world.name}
        </p>
        <p className="text-white/40 text-xs font-black tracking-[0.35em] uppercase mt-1">
          {t?.areaCleared ?? 'Area Cleared'}
        </p>
      </motion.div>

      {/* 2. Region illustration — full width, capped so content fits */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 15, delay: 0.1 }}
        style={{ width: '100%', maxHeight: '30vh', borderRadius: 20, overflow: 'hidden', boxShadow: '0 0 32px rgba(0,0,0,0.6)', flexShrink: 0 }}
      >
        <Scene />
      </motion.div>

      {/* 3. Combined trophy + score panel — same width as scene */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 220, damping: 15 }}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.30)',
          borderRadius: 16, padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        {/* Trophy row */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', paddingBottom: 4, position: 'relative' }}>
          {worldTrophies.map((trophy, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 260, damping: 16 }}
            >
              <TrophyCup trophy={trophy} size={48} />
            </motion.div>
          ))}
          {showBurst && (
            <ParticleBurst
              count={BURST_COUNT[bestTrophy]}
              colors={BURST_COLORS[bestTrophy]}
              originX='50%' originY='50%'
              spread={bestTrophy === 'gold' ? 200 : bestTrophy === 'silver' ? 150 : 100}
              gravity={bestTrophy === 'gold' ? 80 : 50}
            />
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.22)' }} />

        {/* Round score — counts up, pulses on transfer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.15em' }}>
            {t?.roundScore ?? 'ROUND SCORE'}
          </span>
          <motion.span
            animate={roundControls}
            style={{ fontSize: 22, fontWeight: 900, color: '#fbbf24', minWidth: 60, textAlign: 'right', display: 'inline-block' }}
          >
            {battleDisplay.toLocaleString()}
          </motion.span>
        </div>
        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.22)' }} />
        {/* Previous total — static */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.15em' }}>
            {t?.previous ?? 'PREVIOUS'}
          </span>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.45)', minWidth: 60, textAlign: 'right' }}>
            {prevTotal.toLocaleString()}
          </span>
        </div>
        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.22)' }} />
        {/* New total — counts up */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.15em' }}>
            {t?.newTotal ?? 'NEW TOTAL'}
          </span>
          <span style={{ fontSize: 26, fontWeight: 900, color: 'white', minWidth: 60, textAlign: 'right' }}>
            {totalDisplay.toLocaleString()}
          </span>
        </div>
      </motion.div>

      {/* 4. Continue */}
      {showContinue ? (
        <motion.button
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 210, damping: 18 }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.04 }}
          onClick={onContinue}
          className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
        >
          {t?.continueCta ?? 'CONTINUE'} {isRtl ? '←' : '→'}
        </motion.button>
      ) : (
        <div style={{ height: 64 }} />
      )}
    </div>
  )
}
