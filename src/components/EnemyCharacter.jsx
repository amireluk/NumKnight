import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

// Static body — everything except club + right arm
function GoblinBodySVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none">
      <defs>
        <radialGradient id="gb-skin" cx="35%" cy="25%" r="72%">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="55%" stopColor="#8bc34a" />
          <stop offset="100%" stopColor="#4e7c1f" />
        </radialGradient>
        <radialGradient id="gb-body" cx="28%" cy="18%" r="78%">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="50%" stopColor="#8bc34a" />
          <stop offset="100%" stopColor="#3d6b14" />
        </radialGradient>
      </defs>

      {/* Left arm — hanging fist */}
      <path d="M24 58 Q8 66 5 88 Q5 99 14 100 Q23 101 24 91 Q25 74 32 66Z"
        fill="url(#gb-body)" stroke="#1b2a1b" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="12" cy="100" rx="10" ry="9" fill="url(#gb-skin)" stroke="#1b2a1b" strokeWidth="2.5" />
      <path d="M5 97 Q9 92 14 92 Q18 92 21 95" stroke="#558b2f" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Legs */}
      <path d="M26 88 Q22 102 20 114 Q22 120 33 120 Q41 120 43 112 Q44 100 44 88Z"
        fill="url(#gb-body)" stroke="#1b2a1b" strokeWidth="2.5" />
      <path d="M64 88 Q68 102 70 114 Q68 120 57 120 Q49 120 47 112 Q46 100 46 88Z"
        fill="url(#gb-body)" stroke="#1b2a1b" strokeWidth="2.5" />

      {/* Feet + claws */}
      <ellipse cx="29" cy="116" rx="12" ry="6" fill="#4a7c1f" stroke="#1b2a1b" strokeWidth="2" />
      <ellipse cx="61" cy="116" rx="12" ry="6" fill="#4a7c1f" stroke="#1b2a1b" strokeWidth="2" />
      <path d="M19 116 L16 120" stroke="#1b2a1b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M25 118 L23 122" stroke="#1b2a1b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M31 119 L31 122" stroke="#1b2a1b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M37 118 L39 121" stroke="#1b2a1b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M53 118 L51 121" stroke="#1b2a1b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M59 119 L59 122" stroke="#1b2a1b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M65 118 L67 121" stroke="#1b2a1b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M71 116 L74 120" stroke="#1b2a1b" strokeWidth="2.5" strokeLinecap="round" />

      {/* Body */}
      <path d="M18 57 Q12 70 12 82 Q12 95 30 96 Q45 98 60 96 Q78 95 78 82 Q78 70 72 57 Q62 52 45 52 Q28 52 18 57Z"
        fill="url(#gb-body)" stroke="#1b2a1b" strokeWidth="2.5" />
      <ellipse cx="35" cy="65" rx="14" ry="11" fill="white" opacity="0.18" />
      <path d="M27 63 Q37 59 44 64" stroke="#558b2f" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M63 63 Q53 59 46 64" stroke="#558b2f" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
      <ellipse cx="44" cy="82" rx="13" ry="10" fill="#aed581" opacity="0.2" />
      <ellipse cx="44" cy="85" rx="2.5" ry="2" fill="#558b2f" opacity="0.6" />

      {/* Loincloth + belt */}
      <path d="M22 91 Q36 98 44 96 Q54 98 68 91 Q66 109 59 112 Q44 116 30 112 Q24 109 22 91Z"
        fill="#795548" stroke="#3e2723" strokeWidth="2" />
      <path d="M28 97 Q30 105 28 112" stroke="#5d4037" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M38 98 Q39 106 38 113" stroke="#5d4037" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M50 98 Q51 106 50 113" stroke="#5d4037" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M60 97 Q58 105 60 112" stroke="#5d4037" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <rect x="21" y="89" width="48" height="6" rx="3" fill="#4e342e" stroke="#3e2723" strokeWidth="1.5" />
      <rect x="38" y="89" width="14" height="6" rx="2" fill="#6d4c41" stroke="#4e342e" strokeWidth="1" />

      {/* Neck */}
      <path d="M34 52 Q37 48 45 48 Q53 48 56 52 L56 58 Q52 54 45 54 Q38 54 34 58Z"
        fill="url(#gb-skin)" stroke="#1b2a1b" strokeWidth="2" />
      <ellipse cx="45" cy="58" rx="9" ry="4" fill="#558b2f" opacity="0.35" />

      {/* Head */}
      <path d="M17 30 Q17 6 45 6 Q73 6 73 30 Q73 52 60 58 Q45 63 30 58 Q17 52 17 30Z"
        fill="url(#gb-skin)" stroke="#1b2a1b" strokeWidth="2.5" />
      <ellipse cx="32" cy="18" rx="16" ry="10" fill="white" opacity="0.2" />

      {/* Ears */}
      <path d="M17 28 Q3 18 8 8 Q18 15 22 28Z" fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2" />
      <path d="M73 28 Q87 18 82 8 Q72 15 68 28Z" fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2" />
      <path d="M14 26 Q6 18 10 10 Q16 16 18 26Z" fill="#aed581" opacity="0.3" />
      <path d="M76 26 Q84 18 80 10 Q74 16 72 26Z" fill="#aed581" opacity="0.3" />

      {/* Mohawk */}
      <path d="M38 8 Q41 0 45 2 Q49 0 52 8 Q49 4 45 5 Q41 4 38 8Z" fill="#1a1a2e" stroke="#111" strokeWidth="1.5" />
      <path d="M39 8 Q43 1 44 3" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M46 3 Q49 0 51 8" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />

      {/* Angry brows + scar */}
      <path d="M18 26 Q29 17 41 23" stroke="#1b2a1b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M72 26 Q61 17 49 23" stroke="#1b2a1b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <line x1="28" y1="19" x2="25" y2="27" stroke="#1b2a1b" strokeWidth="2.5" strokeLinecap="round" />

      {/* Eyes */}
      <ellipse cx="30" cy="33" rx="8" ry="8" fill="#f9a825" stroke="#1b2a1b" strokeWidth="1.5" />
      <ellipse cx="60" cy="33" rx="8" ry="8" fill="#f9a825" stroke="#1b2a1b" strokeWidth="1.5" />
      <circle cx="30" cy="33" r="5.5" fill="#e65100" />
      <circle cx="60" cy="33" r="5.5" fill="#e65100" />
      <ellipse cx="30" cy="33" rx="2" ry="5" fill="#111" />
      <ellipse cx="60" cy="33" rx="2" ry="5" fill="#111" />
      <circle cx="32" cy="30" r="2" fill="white" />
      <circle cx="62" cy="30" r="2" fill="white" />
      <path d="M22 29 L38 31" stroke="#558b2f" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68 29 L52 31" stroke="#558b2f" strokeWidth="1.5" strokeLinecap="round" />

      {/* Nose */}
      <ellipse cx="45" cy="44" rx="8" ry="6" fill="#6ca03a" stroke="#1b2a1b" strokeWidth="1.5" />
      <circle cx="41" cy="45" r="2.8" fill="#1b2a1b" />
      <circle cx="49" cy="45" r="2.8" fill="#1b2a1b" />

      {/* Mouth */}
      <path d="M20 52 Q34 67 45 64 Q56 67 70 52 L70 58 Q56 73 45 70 Q34 73 20 58Z"
        fill="#111" stroke="#1b2a1b" strokeWidth="2" />
      <rect x="27" y="53" width="8" height="11" rx="2" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <rect x="37" y="52" width="8" height="12" rx="2" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <rect x="47" y="52" width="8" height="12" rx="2" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <rect x="57" y="53" width="8" height="11" rx="2" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <path d="M22 52 L25 64 L29 52Z" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <path d="M61 52 L65 64 L68 52Z" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <path d="M20 52 Q45 48 70 52" stroke="#558b2f" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Warts */}
      <circle cx="22" cy="42" r="3" fill="#6ca03a" stroke="#558b2f" strokeWidth="1.5" />
      <circle cx="68" cy="40" r="2.5" fill="#6ca03a" stroke="#558b2f" strokeWidth="1.5" />
      <circle cx="19" cy="32" r="2" fill="#6ca03a" stroke="#558b2f" strokeWidth="1" />
    </svg>
  )
}

// Club + right arm only — same viewBox, overlaid on body
function GoblinClubArmSVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none" overflow="visible">
      <defs>
        <radialGradient id="gb-body2" cx="28%" cy="18%" r="78%">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="50%" stopColor="#8bc34a" />
          <stop offset="100%" stopColor="#3d6b14" />
        </radialGradient>
        <radialGradient id="gb-skin2" cx="35%" cy="25%" r="72%">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="55%" stopColor="#8bc34a" />
          <stop offset="100%" stopColor="#4e7c1f" />
        </radialGradient>
      </defs>
      {/* Club handle + head */}
      <rect x="68" y="2" width="11" height="52" rx="4" fill="#6d4c41" stroke="#3e2723" strokeWidth="2" />
      <ellipse cx="73.5" cy="5" rx="11" ry="14" fill="#795548" stroke="#3e2723" strokeWidth="2.5" />
      {/* Knots */}
      <circle cx="67" cy="4" r="4" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" />
      <circle cx="82" cy="8" r="3.5" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" />
      <circle cx="64" cy="15" r="3" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" />
      <circle cx="83" cy="20" r="2.5" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" />
      <line x1="71" y1="18" x2="70" y2="52" stroke="#5d4037" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Right arm */}
      <path d="M66 54 Q80 56 84 70 Q86 82 78 84 Q70 86 68 76 Q66 64 60 62Z"
        fill="url(#gb-body2)" stroke="#1b2a1b" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Right hand gripping club */}
      <rect x="64" y="46" width="14" height="15" rx="6" fill="url(#gb-skin2)" stroke="#1b2a1b" strokeWidth="2" />
      <path d="M65 49 Q71 46 77 49" stroke="#558b2f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

const SPLASH_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const SPLASH_ANGLES_OFFSET = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]

// Hit splash rendered on the goblin at the impact point.
// Goblin wrapper has scaleX(-1), so left: 65px appears at screen-left (goblin's front, facing knight).
function HitSplash({ color }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        // Center of goblin torso — left:42 after scaleX(-1) = 84-42=42, stays center
        left: 42,
        top: 62,
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

export function EnemyCharacter({ phase, enemy, hitKey }) {
  const moveControls = useAnimation()
  const clubControls = useAnimation()
  const [splashKey, setSplashKey] = useState(null)

  // Goblin attacks — lunges left, club smashes down
  useEffect(() => {
    if (phase === 'hit') {
      moveControls.start({ x: [0, -80, 0], transition: { duration: 0.45, ease: 'easeInOut' } })
      clubControls.start({
        rotate: [0, 62, -12, 0],
        transition: { duration: 0.45, times: [0, 0.32, 0.62, 1] },
      })
    }
  }, [phase, moveControls, clubControls])

  // Goblin takes a hit — recoil + splash (triggered at moment of impact)
  useEffect(() => {
    if (hitKey > 0) {
      moveControls.start({ x: [0, 12, -5, 0], transition: { duration: 0.35 } })
      clubControls.start({ rotate: [0, -15, 5, 0], transition: { duration: 0.35 } })
      setSplashKey(hitKey)
      const t = setTimeout(() => setSplashKey(null), 550)
      return () => clearTimeout(t)
    }
  }, [hitKey, moveControls, clubControls])

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={phase === 'idle' ? { y: [0, -2, 0] } : { y: 0 }}
        transition={
          phase === 'idle'
            ? { duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }
            : { duration: 0.2 }
        }
      >
        <motion.div
          animate={moveControls}
          style={{ transform: 'scaleX(-1)' }}
        >
          {/* Relative container: body + club arm overlaid */}
          <div style={{ position: 'relative', width: 84, height: 112, overflow: 'visible' }}>
            <GoblinBodySVG />
            {/*
              Club arm rotates around the shoulder (SVG 71, 54).
              SVG viewBox 0 0 90 120 rendered at 84×112 → scale = 84/90 = 0.9333
              Shoulder in div-pixels: 71×0.9333 = 66.3 ≈ 66px, 54×0.9333 = 50.4 ≈ 50px
            */}
            <motion.div
              animate={clubControls}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 84,
                height: 112,
                overflow: 'visible',
                transformOrigin: '66px 50px',
              }}
            >
              <GoblinClubArmSVG />
            </motion.div>

            {/* Hit splash — left: 65px in div space → appears on goblin's screen-left (front) after scaleX(-1) */}
            <AnimatePresence>
              {splashKey !== null && <HitSplash key={splashKey} color="#fbbf24" />}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
