import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLongPress } from '../hooks/useLongPress'
import { LogoBanner } from '../components/LogoBanner'
import { EnemyCharacter } from '../components/EnemyCharacter'
import { KnightCharacter } from '../components/KnightCharacter'
import { playMapTap, playMapLocked } from '../game/sounds'

function MedalBadge({ trophy, size = 30 }) {
  const c = {
    gold:   { outer: '#fbbf24', inner: '#78350f', shine: '#fde68a', ribbon: '#d97706' },
    silver: { outer: '#c0c8d4', inner: '#374151', shine: '#e5e7eb', ribbon: '#6b7280' },
    bronze: { outer: '#cd7c3a', inner: '#7c2d12', shine: '#fca869', ribbon: '#b45309' },
  }[trophy] ?? { outer: '#888', inner: '#333', shine: '#aaa', ribbon: '#666' }
  return (
    <svg width={size} height={Math.round(size * 1.55)} viewBox="0 0 30 46" fill="none">
      {/* Ribbon */}
      <path d="M10 26 L10 44 L15 38 L15 26Z" fill={c.ribbon} />
      <path d="M20 26 L20 44 L15 38 L15 26Z" fill={c.ribbon} opacity="0.72" />
      {/* Outer ring */}
      <circle cx="15" cy="15" r="13" fill={c.outer} />
      {/* Inner circle */}
      <circle cx="15" cy="15" r="9"  fill={c.inner} />
      {/* Centre glow */}
      <circle cx="15" cy="15" r="4.5" fill={c.outer} opacity="0.45" />
      {/* Shine */}
      <ellipse cx="11" cy="11" rx="3" ry="2" fill={c.shine} opacity="0.38" transform="rotate(-30 11 11)" />
    </svg>
  )
}

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
      {/* Grass tufts */}
      {[110, 122, 200, 212, 240, 252].map((x, i) => (
        <g key={i}>
          <line x1={x}   y1="87" x2={x}   y2="83" stroke="#4a7040" strokeWidth="1.1" strokeLinecap="round" />
          <line x1={x+3} y1="87" x2={x+3} y2="84" stroke="#3e6036" strokeWidth="1.0" strokeLinecap="round" />
          <line x1={x-3} y1="87" x2={x-3} y2="84.5" stroke="#4a7040" strokeWidth="1.0" strokeLinecap="round" />
        </g>
      ))}
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
      {/* Moon — top-right, matching BattleBackground and CastleScene */}
      <circle cx="316" cy="20" r="14" fill="#c4d0de" opacity="0.28" />
      <circle cx="316" cy="20" r="9"  fill="#c4d0de" opacity="0.52" />
      {/* Storm cloud — partly covering moon */}
      <path d="M288 14 Q300 8 314 12 Q320 6 324 14 Q330 10 332 18 Q330 24 320 22 Q310 26 298 22 Q288 24 284 18 Q282 12 288 14Z"
        fill="#121e30" opacity="0.9" />
      {/* Left battlements */}
      <path d="M0 68 L0 58 L8 58 L8 52 L14 52 L14 58 L22 58 L22 52 L28 52 L28 58 L36 58 L36 52 L42 52 L42 58 L52 58 L52 68Z"
        fill="#040b14" />
      {/* Central tower */}
      <rect x="148" y="8" width="64" height="92" fill="#050c16" />
      <path d="M146 8 L148 8 L148 2 L156 2 L156 8 L164 8 L164 2 L172 2 L172 8 L180 8 L180 2 L188 2 L188 8 L196 8 L196 2 L204 2 L204 8 L212 8 L212 14 L146 14Z"
        fill="#050c16" />
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

export const REGION_STRIPS = {
  forest:     ForestStrip,
  swamp:      SwampStrip,
  mountains:  MountainsStrip,
  castle:     CastleStrip,
  dragonLair: DragonLairStrip,
}

// ── Region band ──────────────────────────────────────────────────────────────

function RegionBand({ world, worldIndex, status, trophy, score, delay, onTap, isDevMode, t }) {
  const Strip       = REGION_STRIPS[world.id] ?? ForestStrip
  const isLocked    = status === 'locked'
  const isCurrent   = status === 'current'
  const isCompleted = status === 'completed'
  const isClickable = isCurrent || isDevMode

  return (
    <motion.div
      initial={{ opacity: 0, x: -28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.28 }}
      onClick={() => {
        if (isClickable) { playMapTap(); onTap(worldIndex) }
        else if (isLocked) { playMapLocked() }
      }}
      whileTap={isClickable ? { scale: 0.95 } : undefined}
      whileHover={isClickable ? { scale: 1.02 } : undefined}
      style={{
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        borderRadius: 10,
        border: isCurrent
          ? '2px solid rgba(251,191,36,0.9)'
          : isDevMode && isLocked
            ? '2px solid rgba(255,100,100,0.5)'
            : '2px solid rgba(255,255,255,0.06)',
        cursor: isClickable ? 'pointer' : 'default',
      }}
    >
      {/* Scene background */}
      <Strip />

      {/* Locked overlay */}
      {isLocked && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)', pointerEvents: 'none' }} />
      )}

      {/* Completed: medal + score centered */}
      {isCompleted && trophy && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
        }}>
          <MedalBadge trophy={trophy} size={32} />
          {score != null && (
            <span style={{
              fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.80)',
              textShadow: '0 1px 6px rgba(0,0,0,0.95)',
              letterSpacing: '0.06em',
              background: 'rgba(0,0,0,0.30)', borderRadius: 6,
              padding: '2px 8px',
            }}>
              {score.toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Active: knight + enemy centered */}
      {isCurrent && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 12,
        }}>
          <div style={{ transform: 'scale(0.46) scaleX(-1)', transformOrigin: 'center bottom' }}>
            <EnemyCharacter phase="idle" enemy={world.enemy} hitKey={0} />
          </div>
          <div style={{ transform: 'scale(0.46)', transformOrigin: 'center bottom' }}>
            <KnightCharacter phase="idle" hitKey={0} />
          </div>
        </div>
      )}

      {/* Locked: lock icon centered */}
      {isLocked && (
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2, pointerEvents: 'none',
        }}>
          <svg width="36" height="44" viewBox="0 0 42 52" fill="none">
            <path d="M9 22 L9 15 Q9 4 21 4 Q33 4 33 15 L33 22"
              stroke="rgba(255,255,255,0.28)" strokeWidth="6" fill="none" strokeLinecap="round" />
            <rect x="4" y="20" width="34" height="28" rx="6" fill="rgba(255,255,255,0.14)" />
            <circle cx="21" cy="32" r="5" fill="rgba(0,0,0,0.5)" />
            <rect x="18.5" y="32" width="5" height="8" rx="2.5" fill="rgba(0,0,0,0.5)" />
          </svg>
        </div>
      )}

      {/* Region name — top-left label */}
      <div style={{
        position: 'absolute', top: 5, left: 7, zIndex: 4,
        pointerEvents: 'none',
        background: 'rgba(0,0,0,0.35)', borderRadius: 5,
        padding: '1px 7px',
        fontSize: 10, fontWeight: 900, letterSpacing: '0.08em',
        color: isLocked ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.82)',
        textTransform: 'uppercase',
      }}>
        {t?.worldName?.[world.id] ?? world.name}
      </div>

      {/* Active: glowing border animation */}
      {isCurrent && (
        <motion.div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 8,
            border: '2px solid rgba(251,191,36,0.7)',
          }}
          animate={{
            boxShadow: [
              '0 0 8px rgba(251,191,36,0.3), inset 0 0 8px rgba(251,191,36,0.05)',
              '0 0 22px rgba(251,191,36,0.75), inset 0 0 16px rgba(251,191,36,0.12)',
              '0 0 8px rgba(251,191,36,0.3), inset 0 0 8px rgba(251,191,36,0.05)',
            ],
            borderColor: [
              'rgba(251,191,36,0.55)',
              'rgba(251,191,36,1)',
              'rgba(251,191,36,0.55)',
            ],
          }}
          transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
        />
      )}

      {/* Active: tap-to-fight hint */}
      {isCurrent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ delay: 1.2, duration: 2.4, repeat: Infinity, repeatDelay: 1.0 }}
          style={{
            position: 'absolute', bottom: 6, right: 8, zIndex: 5, pointerEvents: 'none',
            fontSize: 9, fontWeight: 900, letterSpacing: '0.14em',
            color: 'rgba(251,191,36,0.9)',
            textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          }}
        >
          ⚔
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Screen ───────────────────────────────────────────────────────────────────

export function WorldMapScreen({
  worlds, currentWorldIndex, trophies, worldScores,
  isTransition, difficulty, isDevMode, onFight, onRestart, onBack, onLogoLongPress, lang, t,
}) {
  const isRtl = lang === 'he'
  const logoLongPress = useLongPress(onLogoLongPress ?? (() => {}))

  // Android hardware back → new game screen
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => { onBack?.() }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onBack])
  // Natural order: Forest at top, Dragon Lair at bottom
  const displayWorlds = worlds

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col h-dvh max-w-md mx-auto select-none"
      style={{
        position: 'relative',
        background:
          'radial-gradient(ellipse at 50% 20%, rgba(251,191,36,0.10) 0%, transparent 55%), ' +
          'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
      }}
    >
      {/* Restart button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        onClick={onRestart}
        style={{
          position: 'absolute', top: 14, left: 14, zIndex: 30,
          background: 'rgba(0,0,0,0.35)', border: '1.5px solid rgba(255,255,255,0.18)',
          borderRadius: 8, padding: '4px 10px',
          fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer', letterSpacing: '0.04em',
        }}
        whileTap={{ scale: 0.9 }}
        title="New Game"
      >
        ✕
      </motion.button>

      {/* Header */}
      <motion.div
        className="pt-4 pb-2 px-6"
        style={{ flexShrink: 0 }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <LogoBanner logoLongPress={logoLongPress} showSword={false} />
      </motion.div>

      {/* Region bands — Forest at top, Dragon Lair at bottom */}
      <div className="flex-1 min-h-0 flex flex-col px-4" style={{ gap: 4 }}>
        {displayWorlds.map((world, di) => {
          const i = di  // display index = real world index
          const status =
            i < currentWorldIndex  ? 'completed' :
            i === currentWorldIndex ? 'current'   : 'locked'
          const trophy = i < currentWorldIndex ? getBestTrophy(trophies, worlds, i) : null
          const score  = worldScores?.[i] ?? null
          return (
            <RegionBand
              key={world.id}
              world={world}
              worldIndex={i}
              status={status}
              trophy={trophy}
              score={score}
              delay={0.08 + di * 0.06}
              onTap={onFight}
              isDevMode={isDevMode}
              t={t}
            />
          )
        })}
      </div>

      {/* Bottom padding */}
      <div style={{ flexShrink: 0, height: 12 }} />
    </div>
  )
}
