import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

function GoblinSVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none">
      <defs>
        <radialGradient id="gb-skin" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#2e7d32" />
        </radialGradient>
        <radialGradient id="gb-belly" cx="38%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#a5d6a7" />
          <stop offset="100%" stopColor="#43a047" />
        </radialGradient>
        <radialGradient id="gb-iris" cx="38%" cy="35%" r="58%">
          <stop offset="0%" stopColor="#ff6659" />
          <stop offset="55%" stopColor="#d32f2f" />
          <stop offset="100%" stopColor="#7f0000" />
        </radialGradient>
        <radialGradient id="gb-sclera" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fff9c4" />
          <stop offset="100%" stopColor="#f9a825" />
        </radialGradient>
      </defs>

      {/* Ears */}
      <path d="M14 35 Q0 18 8 6 Q18 16 24 30Z" fill="#43a047" stroke="#1b5e20" strokeWidth="2" />
      <path d="M14 33 Q4 19 10 9 Q18 18 22 30Z" fill="#81c784" opacity="0.4" />
      <path d="M76 35 Q90 18 82 6 Q72 16 66 30Z" fill="#43a047" stroke="#1b5e20" strokeWidth="2" />
      <path d="M76 33 Q86 19 80 9 Q72 18 68 30Z" fill="#81c784" opacity="0.4" />

      {/* Horns */}
      <path d="M34 17 Q29 3 37 5 Q38 12 36 18Z" fill="#33691e" stroke="#1b5e20" strokeWidth="1.5" />
      <path d="M56 17 Q61 3 53 5 Q52 12 54 18Z" fill="#33691e" stroke="#1b5e20" strokeWidth="1.5" />

      {/* Body */}
      <ellipse cx="45" cy="97" rx="21" ry="18" fill="url(#gb-skin)" stroke="#1b5e20" strokeWidth="2" />
      <ellipse cx="45" cy="99" rx="13" ry="11" fill="url(#gb-belly)" stroke="#43a047" strokeWidth="1" />

      {/* Arms */}
      <path d="M27 84 Q10 92 5 110 Q12 114 16 110 Q19 96 30 88Z"
        fill="url(#gb-skin)" stroke="#1b5e20" strokeWidth="2" strokeLinejoin="round" />
      <line x1="5" y1="110" x2="1" y2="117" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="113" x2="8" y2="119" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="112" x2="16" y2="118" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M63 84 Q80 92 85 110 Q78 114 74 110 Q71 96 60 88Z"
        fill="url(#gb-skin)" stroke="#1b5e20" strokeWidth="2" strokeLinejoin="round" />
      <line x1="85" y1="110" x2="89" y2="117" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="113" x2="82" y2="119" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="74" y1="112" x2="74" y2="118" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />

      {/* Legs */}
      <path d="M32 111 Q28 119 34 120 Q40 121 39 113Z" fill="#2e7d32" stroke="#1b5e20" strokeWidth="1.5" />
      <path d="M58 111 Q62 119 56 120 Q50 121 51 113Z" fill="#2e7d32" stroke="#1b5e20" strokeWidth="1.5" />

      {/* Head */}
      <ellipse cx="45" cy="43" rx="33" ry="31" fill="url(#gb-skin)" stroke="#1b5e20" strokeWidth="2.5" />
      <ellipse cx="35" cy="29" rx="14" ry="10" fill="white" opacity="0.13" />

      {/* Angry brows */}
      <path d="M18 37 Q28 29 39 35" stroke="#1b5e20" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M72 37 Q62 29 51 35" stroke="#1b5e20" strokeWidth="4.5" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <ellipse cx="30" cy="42" rx="10" ry="11" fill="url(#gb-sclera)" stroke="#1b5e20" strokeWidth="1.5" />
      <ellipse cx="60" cy="42" rx="10" ry="11" fill="url(#gb-sclera)" stroke="#1b5e20" strokeWidth="1.5" />
      <circle cx="31" cy="43" r="6.5" fill="url(#gb-iris)" />
      <circle cx="61" cy="43" r="6.5" fill="url(#gb-iris)" />
      <ellipse cx="31" cy="44" rx="2.5" ry="4.5" fill="#1a1a1a" />
      <ellipse cx="61" cy="44" rx="2.5" ry="4.5" fill="#1a1a1a" />
      <circle cx="33" cy="40" r="1.8" fill="white" />
      <circle cx="63" cy="40" r="1.8" fill="white" />
      <ellipse cx="30" cy="42" rx="11" ry="12" fill="#ef5350" opacity="0.1" />
      <ellipse cx="60" cy="42" rx="11" ry="12" fill="#ef5350" opacity="0.1" />

      {/* Nose */}
      <ellipse cx="45" cy="57" rx="7" ry="5" fill="#2e7d32" stroke="#1b5e20" strokeWidth="1" />
      <circle cx="42" cy="58" r="2.2" fill="#1b5e20" />
      <circle cx="48" cy="58" r="2.2" fill="#1b5e20" />

      {/* Mouth */}
      <path d="M23 66 Q45 82 67 66 L67 71 Q45 86 23 71Z" fill="#1a1a2e" stroke="#1b5e20" strokeWidth="1.5" />
      <path d="M23 66 Q45 82 67 66" stroke="#1b5e20" strokeWidth="2" fill="none" />
      <rect x="30" y="66" width="7" height="9" rx="2" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="0.5" />
      <rect x="39" y="66" width="7" height="10" rx="2" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="0.5" />
      <rect x="48" y="66" width="7" height="10" rx="2" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="0.5" />
      <rect x="57" y="66" width="7" height="9" rx="2" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="0.5" />
      <path d="M27 66 L30 79 L34 66Z" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="0.5" />
      <path d="M56 66 L60 79 L64 66Z" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="0.5" />
    </svg>
  )
}

export function EnemyCharacter({ phase, enemy }) {
  const combatControls = useAnimation()

  useEffect(() => {
    if (phase === 'hit') {
      // Enemy attacks — lunges left toward knight
      combatControls.start({ x: [0, -80, 0], transition: { duration: 0.45, ease: 'easeInOut' } })
    } else if (phase === 'attacking') {
      // Enemy flinches right when knight hits
      combatControls.start({ x: [0, 18, -12, 8, 0], transition: { duration: 0.4 } })
    }
  }, [phase, combatControls])

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={phase === 'idle' ? { y: [0, -5, 0] } : { y: 0 }}
        transition={
          phase === 'idle'
            ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }
            : { duration: 0.2 }
        }
      >
        <motion.div
          animate={combatControls}
          style={{ transform: 'scaleX(-1)' }}
        >
          <GoblinSVG />
        </motion.div>
      </motion.div>
    </div>
  )
}
