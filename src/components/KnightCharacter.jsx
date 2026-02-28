import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

// Static body — everything except the sword arm
function KnightBodySVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none">
      <defs>
        <radialGradient id="kn-skin" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#ffe0b2" />
          <stop offset="100%" stopColor="#ffb74d" />
        </radialGradient>
        <linearGradient id="kn-metal" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#eceff1" />
          <stop offset="100%" stopColor="#78909c" />
        </linearGradient>
        <linearGradient id="kn-shield" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#42a5f5" />
          <stop offset="100%" stopColor="#0d47a1" />
        </linearGradient>
      </defs>

      {/* Left arm */}
      <rect x="4" y="60" width="17" height="26" rx="7" fill="url(#kn-metal)" stroke="#424242" strokeWidth="2" />

      {/* Shield */}
      <path d="M0 52 L14 52 L14 78 Q7 88 0 78Z" fill="url(#kn-shield)" stroke="#424242" strokeWidth="2.5" />
      <path d="M2 55 L12 55 L12 68 Q7 74 2 68Z" fill="white" opacity="0.15" />
      <line x1="7" y1="53" x2="7" y2="76" stroke="#ffd54f" strokeWidth="2.5" opacity="0.9" strokeLinecap="round" />
      <line x1="0" y1="65" x2="14" y2="65" stroke="#ffd54f" strokeWidth="2.5" opacity="0.9" strokeLinecap="round" />

      {/* Legs */}
      <rect x="25" y="90" width="17" height="20" rx="7" fill="#546e7a" stroke="#424242" strokeWidth="2" />
      <rect x="48" y="90" width="17" height="20" rx="7" fill="#546e7a" stroke="#424242" strokeWidth="2" />

      {/* Boots */}
      <rect x="18" y="104" width="26" height="14" rx="7" fill="#3e2723" stroke="#424242" strokeWidth="2" />
      <rect x="46" y="104" width="26" height="14" rx="7" fill="#3e2723" stroke="#424242" strokeWidth="2" />
      <ellipse cx="27" cy="108" rx="9" ry="3.5" fill="white" opacity="0.1" />
      <ellipse cx="55" cy="108" rx="9" ry="3.5" fill="white" opacity="0.1" />

      {/* Body */}
      <rect x="19" y="58" width="52" height="36" rx="12" fill="url(#kn-metal)" stroke="#424242" strokeWidth="2.5" />
      <ellipse cx="34" cy="67" rx="12" ry="8" fill="white" opacity="0.2" />
      <line x1="45" y1="62" x2="45" y2="90" stroke="#78909c" strokeWidth="2" strokeLinecap="round" />
      <rect x="19" y="88" width="52" height="7" rx="3" fill="#4e342e" stroke="#3e2723" strokeWidth="1.5" />
      <rect x="40" y="88" width="10" height="7" rx="2" fill="#795548" stroke="#4e342e" strokeWidth="1" />

      {/* Neck */}
      <rect x="36" y="54" width="18" height="10" rx="4" fill="url(#kn-skin)" stroke="#424242" strokeWidth="2" />

      {/* Head */}
      <ellipse cx="45" cy="36" rx="27" ry="26" fill="url(#kn-skin)" stroke="#424242" strokeWidth="2.5" />
      <ellipse cx="34" cy="24" rx="14" ry="9" fill="white" opacity="0.2" />

      {/* Helmet cheek guards */}
      <rect x="16" y="32" width="13" height="18" rx="6" fill="url(#kn-metal)" stroke="#424242" strokeWidth="2" />
      <rect x="61" y="32" width="13" height="18" rx="6" fill="url(#kn-metal)" stroke="#424242" strokeWidth="2" />

      {/* Helmet dome */}
      <path d="M17 37 Q17 10 45 10 Q73 10 73 37 L70 39 Q63 34 56 38 L45 40 L34 38 Q27 34 20 39Z"
        fill="url(#kn-metal)" stroke="#424242" strokeWidth="2.5" />
      <ellipse cx="33" cy="21" rx="15" ry="8" fill="white" opacity="0.22" />
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
}

// Sword arm only — same viewBox, overlaid on top of body
function KnightSwordArmSVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none" overflow="visible">
      <defs>
        <linearGradient id="kn-metal2" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#eceff1" />
          <stop offset="100%" stopColor="#78909c" />
        </linearGradient>
      </defs>
      {/* Sword blade */}
      <rect x="73" y="8" width="7" height="44" rx="2" fill="#e0e0e0" stroke="#424242" strokeWidth="1.5" />
      <polygon points="76.5,4 72,11 81,11" fill="#e0e0e0" stroke="#424242" strokeWidth="1.5" />
      <line x1="76.5" y1="8" x2="76.5" y2="48" stroke="white" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      {/* Crossguard + handle + pommel */}
      <rect x="65" y="50" width="22" height="6" rx="3" fill="#6d4c41" stroke="#3e2723" strokeWidth="1.5" />
      <rect x="74" y="56" width="6" height="12" rx="3" fill="#6d4c41" stroke="#3e2723" strokeWidth="1.5" />
      <circle cx="77" cy="69" r="4.5" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.5" />
      {/* Right arm */}
      <rect x="69" y="60" width="17" height="26" rx="7" fill="url(#kn-metal2)" stroke="#424242" strokeWidth="2" />
    </svg>
  )
}

const SPLASH_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const SPLASH_ANGLES_OFFSET = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]

// Hit splash rendered on the character, at the impact point
function HitSplash({ color }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        // Right side of knight (facing the goblin) — torso level
        left: 65,
        top: 50,
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
      }}
      initial={{ scale: 0.05, opacity: 1 }}
      animate={{ scale: [0.05, 1.4, 1.7], opacity: [1, 1, 0] }}
      transition={{ duration: 0.5, times: [0, 0.28, 1], ease: 'easeOut' }}
    >
      <svg width="90" height="90" viewBox="-45 -45 90 90" fill="none">
        {SPLASH_ANGLES.map((angle) => {
          const rad = (angle * Math.PI) / 180
          return (
            <line
              key={angle}
              x1={Math.cos(rad) * 7} y1={Math.sin(rad) * 7}
              x2={Math.cos(rad) * 32} y2={Math.sin(rad) * 32}
              stroke={color} strokeWidth="5" strokeLinecap="round"
            />
          )
        })}
        {SPLASH_ANGLES_OFFSET.map((angle) => {
          const rad = (angle * Math.PI) / 180
          return (
            <line
              key={angle}
              x1={Math.cos(rad) * 9} y1={Math.sin(rad) * 9}
              x2={Math.cos(rad) * 22} y2={Math.sin(rad) * 22}
              stroke={color} strokeWidth="3" strokeLinecap="round"
            />
          )
        })}
        <circle cx="0" cy="0" r="9" fill={color} />
        <circle cx="0" cy="0" r="4" fill="white" opacity="0.7" />
      </svg>
    </motion.div>
  )
}

export function KnightCharacter({ phase, hitKey }) {
  const moveControls = useAnimation()
  const swordControls = useAnimation()
  const [splashKey, setSplashKey] = useState(null)

  // Knight attacks — lunge right + sword swing
  useEffect(() => {
    if (phase === 'attacking') {
      moveControls.start({ x: [0, 80, 0], transition: { duration: 0.45, ease: 'easeInOut' } })
      swordControls.start({
        rotate: [0, 62, -12, 0],
        transition: { duration: 0.45, times: [0, 0.32, 0.62, 1] },
      })
    }
  }, [phase, moveControls, swordControls])

  // Knight takes a hit — recoil + splash (triggered at moment of impact)
  useEffect(() => {
    if (hitKey > 0) {
      moveControls.start({ x: [0, -12, 5, 0], transition: { duration: 0.35 } })
      swordControls.start({ rotate: [0, -15, 5, 0], transition: { duration: 0.35 } })
      setSplashKey(hitKey)
      const t = setTimeout(() => setSplashKey(null), 550)
      return () => clearTimeout(t)
    }
  }, [hitKey, moveControls, swordControls])

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={phase === 'idle' ? { y: [0, -5, 0] } : { y: 0 }}
        transition={
          phase === 'idle'
            ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.2 }
        }
      >
        <motion.div animate={moveControls}>
          {/* Relative container: body + weapon arm overlaid */}
          <div style={{ position: 'relative', width: 84, height: 112, overflow: 'visible' }}>
            <KnightBodySVG />
            {/*
              Sword arm rotates around the shoulder (SVG 78,62).
              SVG viewBox 0 0 90 120 is rendered at 84×112 → scale = 84/90 = 0.9333
              Shoulder in div-pixels: 78×0.9333 = 72.8 ≈ 73px, 62×0.9333 = 57.9 ≈ 58px
            */}
            <motion.div
              animate={swordControls}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 84,
                height: 112,
                overflow: 'visible',
                transformOrigin: '73px 58px',
              }}
            >
              <KnightSwordArmSVG />
            </motion.div>

            {/* Hit splash — appears at impact point on knight's right (goblin-facing) side */}
            <AnimatePresence>
              {splashKey !== null && <HitSplash key={splashKey} color="#f87171" />}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
