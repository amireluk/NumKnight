/* eslint-disable no-undef */
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'

/* eslint-disable no-undef */
const V = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'
const RASTER_KEY = 'numknight_raster_bg'
const BASE = import.meta.env.BASE_URL
const SPRITES = {
  idle:   `${BASE}assets/characters/knight/knight-idle.webp?v=${V}`,
  attack: `${BASE}assets/characters/knight/knight-attack.webp?v=${V}`,
  hit:    `${BASE}assets/characters/knight/knight-hit.webp?v=${V}`,
  dead:   `${BASE}assets/characters/knight/knight-dead.webp?v=${V}`,
}

// Static body — everything except the sword arm
export const KnightBodySVG = React.memo(function KnightBodySVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none">
      {/* Left arm */}
      <rect x="4" y="60" width="17" height="26" rx="7" fill="#90a4ae" stroke="#424242" strokeWidth="2" />

      {/* Shield */}
      <path d="M0 52 L14 52 L14 78 Q7 88 0 78Z" fill="#1976d2" stroke="#424242" strokeWidth="2.5" />
      <line x1="7" y1="53" x2="7" y2="76" stroke="#ffd54f" strokeWidth="2.5" opacity="0.9" strokeLinecap="round" />
      <line x1="0" y1="65" x2="14" y2="65" stroke="#ffd54f" strokeWidth="2.5" opacity="0.9" strokeLinecap="round" />

      {/* Legs */}
      <rect x="25" y="90" width="17" height="20" rx="7" fill="#546e7a" stroke="#424242" strokeWidth="2" />
      <rect x="48" y="90" width="17" height="20" rx="7" fill="#546e7a" stroke="#424242" strokeWidth="2" />

      {/* Boots */}
      <rect x="18" y="104" width="26" height="14" rx="7" fill="#3e2723" stroke="#424242" strokeWidth="2" />
      <rect x="46" y="104" width="26" height="14" rx="7" fill="#3e2723" stroke="#424242" strokeWidth="2" />

      {/* Body */}
      <rect x="19" y="58" width="52" height="36" rx="12" fill="#90a4ae" stroke="#424242" strokeWidth="2.5" />
      <line x1="45" y1="62" x2="45" y2="90" stroke="#78909c" strokeWidth="2" strokeLinecap="round" />
      <rect x="19" y="88" width="52" height="7" rx="3" fill="#4e342e" stroke="#3e2723" strokeWidth="1.5" />
      <rect x="40" y="88" width="10" height="7" rx="2" fill="#795548" stroke="#4e342e" strokeWidth="1" />

      {/* Neck */}
      <rect x="36" y="54" width="18" height="10" rx="4" fill="#ffb74d" stroke="#424242" strokeWidth="2" />

      {/* Head */}
      <ellipse cx="45" cy="36" rx="27" ry="26" fill="#ffb74d" stroke="#424242" strokeWidth="2.5" />

      {/* Helmet cheek guards */}
      <rect x="16" y="32" width="13" height="18" rx="6" fill="#90a4ae" stroke="#424242" strokeWidth="2" />
      <rect x="61" y="32" width="13" height="18" rx="6" fill="#90a4ae" stroke="#424242" strokeWidth="2" />

      {/* Helmet dome */}
      <path d="M17 37 Q17 10 45 10 Q73 10 73 37 L70 39 Q63 34 56 38 L45 40 L34 38 Q27 34 20 39Z"
        fill="#90a4ae" stroke="#424242" strokeWidth="2.5" />
      <path d="M16 37 Q45 31 74 37" stroke="#607d8b" strokeWidth="6" fill="none" strokeLinecap="butt" />
      <path d="M16 37 Q45 31 74 37" stroke="#cfd8dc" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Face */}
      <ellipse cx="35" cy="42" rx="5.5" ry="6" fill="white" stroke="#424242" strokeWidth="1.5" />
      <ellipse cx="55" cy="42" rx="5.5" ry="6" fill="white" stroke="#424242" strokeWidth="1.5" />
      <circle cx="36.5" cy="43" r="4" fill="#3e2723" />
      <circle cx="56.5" cy="43" r="4" fill="#3e2723" />
      <circle cx="38" cy="41.5" r="1.5" fill="white" />
      <circle cx="58" cy="41.5" r="1.5" fill="white" />
      <ellipse cx="27" cy="48" rx="7" ry="4.5" fill="#f06292" opacity="0.45" />
      <ellipse cx="63" cy="48" rx="7" ry="4.5" fill="#f06292" opacity="0.45" />
      <circle cx="31" cy="51" r="1.3" fill="#d4845a" opacity="0.55" />
      <circle cx="36" cy="53" r="1.3" fill="#d4845a" opacity="0.55" />
      <circle cx="54" cy="53" r="1.3" fill="#d4845a" opacity="0.55" />
      <circle cx="59" cy="51" r="1.3" fill="#d4845a" opacity="0.55" />
      <path d="M35 51 Q45 58 55 51" stroke="#bf7a60" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
})

// Sword arm only — same viewBox, overlaid on top of body
export const KnightSwordArmSVG = React.memo(function KnightSwordArmSVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none" overflow="visible">
      {/* Sword blade */}
      <rect x="73" y="8" width="7" height="44" rx="2" fill="#e0e0e0" stroke="#424242" strokeWidth="1.5" />
      <polygon points="76.5,4 72,11 81,11" fill="#e0e0e0" stroke="#424242" strokeWidth="1.5" />
      {/* Crossguard + handle + pommel */}
      <rect x="65" y="50" width="22" height="6" rx="3" fill="#6d4c41" stroke="#3e2723" strokeWidth="1.5" />
      <rect x="74" y="56" width="6" height="12" rx="3" fill="#6d4c41" stroke="#3e2723" strokeWidth="1.5" />
      <circle cx="77" cy="69" r="4.5" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.5" />
      {/* Right arm */}
      <rect x="69" y="60" width="17" height="26" rx="7" fill="#90a4ae" stroke="#424242" strokeWidth="2" />
    </svg>
  )
})

const SPLASH_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const SPLASH_ANGLES_OFFSET = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]

// Pre-computed at module load — avoids trig on every hit
const SPLASH_LINES = SPLASH_ANGLES.map(a => {
  const r = (a * Math.PI) / 180
  return [Math.cos(r) * 7, Math.sin(r) * 7, Math.cos(r) * 32, Math.sin(r) * 32]
})
const SPLASH_LINES_OFFSET = SPLASH_ANGLES_OFFSET.map(a => {
  const r = (a * Math.PI) / 180
  return [Math.cos(r) * 9, Math.sin(r) * 9, Math.cos(r) * 22, Math.sin(r) * 22]
})

// Hit splash rendered on the character, at the impact point
function HitSplash({ color }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: 42, top: 62, transform: 'translate(-50%, -50%)', zIndex: 20, willChange: 'transform, opacity' }}
      initial={{ scale: 0.05, opacity: 1 }}
      animate={{ scale: [0.05, 1.4, 1.7], opacity: [1, 1, 0] }}
      transition={{ duration: 0.5, times: [0, 0.28, 1], ease: 'easeOut' }}
    >
      <svg width="90" height="90" viewBox="-45 -45 90 90" fill="none">
        {SPLASH_LINES.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" strokeLinecap="round" />
        ))}
        {SPLASH_LINES_OFFSET.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeLinecap="round" />
        ))}
        <circle cx="0" cy="0" r="9" fill={color} />
        <circle cx="0" cy="0" r="4" fill="white" opacity="0.7" />
      </svg>
    </motion.div>
  )
}

// ─── Fallen scene (used on ResultScreen) ──────────────────────────────────────
// Knight lies on its back via CSS rotate(-90deg) — exact same SVG parts as in battle
export function FallenKnightScene() {
  return (
    <div style={{
      width: 200, height: 140,
      position: 'relative', borderRadius: 18, overflow: 'hidden',
    }}>
      {/* Sky */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #3a78b8, #88bce0)' }} />
      {/* Sun */}
      <div style={{ position: 'absolute', top: 14, right: 16, width: 24, height: 24, borderRadius: '50%', background: '#f0d060', opacity: 0.85 }} />
      {/* Soft clouds */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '60%', pointerEvents: 'none' }}
        viewBox="0 0 200 84" preserveAspectRatio="none">
        <ellipse cx="52" cy="28" rx="24" ry="9" fill="white" opacity="0.28" />
        <ellipse cx="70" cy="24" rx="15" ry="8" fill="white" opacity="0.22" />
        <ellipse cx="38" cy="26" rx="14" ry="7" fill="white" opacity="0.18" />
      </svg>
      {/* Ground */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 36, background: '#5aaa42' }} />
      <svg style={{ position: 'absolute', bottom: 36, left: 0, width: '100%', height: 14, pointerEvents: 'none' }}
        viewBox="0 0 200 14" preserveAspectRatio="none">
        <path d="M0 10 Q50 0 100 8 Q150 14 200 4 L200 14 L0 14Z" fill="#5aaa42" />
      </svg>
      {/* Sword lying on ground */}
      <svg style={{ position: 'absolute', bottom: 36, left: 0, width: '100%', pointerEvents: 'none' }}
        viewBox="0 0 200 10" height="10" preserveAspectRatio="xMidYMax meet">
        <rect x="48" y="4" width="68" height="3" rx="1.5" fill="#e0e0e0" stroke="#424242" strokeWidth="0.8" />
        <polygon points="116,3.5 123,5 116,6.5" fill="#e0e0e0" stroke="#424242" strokeWidth="0.7" />
        <rect x="60" y="3" width="12" height="4" rx="1.5" fill="#6d4c41" stroke="#3e2723" strokeWidth="0.7" />
      </svg>
      {/* Knight body rotated to lie on back */}
      {/* center-x=100, center-y=104-42=62, so left=58, top=6 → rotate(-90deg) */}
      <div style={{
        position: 'absolute', left: 58, top: 6,
        transformOrigin: 'center center',
        transform: 'rotate(-90deg)',
        pointerEvents: 'none',
      }}>
        <div style={{ position: 'relative', width: 84, height: 112, overflow: 'visible' }}>
          <KnightBodySVG />
          <div style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', transformOrigin: '73px 58px' }}>
            <KnightSwordArmSVG />
          </div>
        </div>
      </div>
      {/* KO stars near head (head ends up around x=77, y=62 after rotation) */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="200" height="140" viewBox="0 0 200 140">
        <g transform="translate(60 46) rotate(15)">
          <polygon points="0,-8 2.5,-2.5 8,-2.5 3.5,1.5 5.5,7 0,3.5 -5.5,7 -3.5,1.5 -8,-2.5 -2.5,-2.5" fill="#ffd54f" stroke="#424242" strokeWidth="0.8" />
        </g>
        <g transform="translate(76 33) rotate(-10)">
          <polygon points="0,-6 2,-1.5 6,-1.5 3,1 4,6 0,3.5 -4,6 -3,1 -6,-1.5 -2,-1.5" fill="#ffd54f" stroke="#424242" strokeWidth="0.8" />
        </g>
        <g transform="translate(46 34) rotate(25)">
          <polygon points="0,-5 1.5,-1.5 5,-1.5 2.5,1 3.5,5 0,3 -3.5,5 -2.5,1 -5,-1.5 -1.5,-1.5" fill="#fbbf24" stroke="#424242" strokeWidth="0.8" />
        </g>
        <circle cx="68" cy="52" r="2" fill="#ffd54f" stroke="#424242" strokeWidth="0.6" />
        <circle cx="54" cy="42" r="1.5" fill="#ffd54f" stroke="#424242" strokeWidth="0.5" />
      </svg>
    </div>
  )
}

export function KnightCharacter({ phase, hitKey, useRaster }) {
  const moveControls = useAnimation()
  const swordControls = useAnimation()
  const [splashKey, setSplashKey] = useState(null)
  const [sprite, setSprite] = useState('idle')
  const raster = useRaster ?? (localStorage.getItem(RASTER_KEY) === 'true')

  // Preload all sprites on mount so swaps are instant
  useEffect(() => {
    if (!raster) return
    Object.values(SPRITES).forEach(src => { new Image().src = src })
  }, [raster])

  // Knight attacks — lunge right + sprite swap (raster) or sword swing (SVG)
  useEffect(() => {
    if (phase === 'attacking') {
      if (raster) setSprite('attack')
      moveControls.start({ x: [0, 80, 0], transition: { duration: 0.45, ease: 'easeInOut' } })
      if (!raster) swordControls.start({ rotate: [0, 62, -12, 0], transition: { duration: 0.45, times: [0, 0.32, 0.62, 1] } })
      if (raster) { const t = setTimeout(() => setSprite('idle'), 300); return () => clearTimeout(t) }
    }
    if (phase === 'lost') {
      if (raster) {
        setSprite('dead')
        moveControls.start({ opacity: [1, 1, 0], transition: { duration: 1.2, times: [0, 0.5, 1] } })
      } else {
        moveControls.start({
          x: [0, 18, -160], rotate: [0, 10, 80], opacity: [1, 1, 0],
          transition: { duration: 0.65, times: [0, 0.25, 1], ease: 'easeIn' },
        })
      }
    }
    if (phase === 'idle' && raster) setSprite('idle')
  }, [phase, moveControls, swordControls, raster]) // eslint-disable-line react-hooks/exhaustive-deps

  // Knight takes a hit — recoil + splash + sprite swap
  useEffect(() => {
    if (hitKey > 0) {
      if (raster) setSprite('hit')
      moveControls.start({ x: [0, -12, 5, 0], transition: { duration: 0.35 } })
      if (!raster) swordControls.start({ rotate: [0, -15, 5, 0], transition: { duration: 0.35 } })
      setSplashKey(hitKey)
      const t1 = setTimeout(() => setSplashKey(null), 550)
      const t2 = raster ? setTimeout(() => setSprite('idle'), 350) : null
      return () => { clearTimeout(t1); if (t2) clearTimeout(t2) }
    }
  }, [hitKey, moveControls, swordControls, raster]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={phase === 'idle' ? { y: [0, -2, 0] } : { y: 0 }}
        transition={
          phase === 'idle'
            ? { duration: 3.0, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.2 }
        }
        style={{ willChange: 'transform' }}
      >
        <motion.div animate={moveControls} style={{ willChange: 'transform' }}>
          {raster ? (
            /* ── Raster sprite swap mode ── */
            <div style={{ position: 'relative', width: 'min(100px, 22vw)', overflow: 'visible', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <img
                key={sprite}
                src={SPRITES[sprite]}
                style={{ height: 'min(180px, 39vw)', width: 'auto', display: 'block', flexShrink: 0 }}
                alt=""
              />
              <AnimatePresence>
                {splashKey !== null && <HitSplash key={splashKey} color="#f87171" />}
              </AnimatePresence>
            </div>
          ) : (
            /* ── SVG mode ── */
            <div style={{ position: 'relative', width: 84, height: 112, overflow: 'visible' }}>
              <KnightBodySVG />
              <motion.div
                animate={swordControls}
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: 84, height: 112, overflow: 'visible',
                  transformOrigin: '73px 58px',
                }}
              >
                <KnightSwordArmSVG />
              </motion.div>
              <AnimatePresence>
                {splashKey !== null && <HitSplash key={splashKey} color="#f87171" />}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
