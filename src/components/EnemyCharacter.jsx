import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

function GoblinSVG() {
  return (
    <svg width="80" height="110" viewBox="0 0 80 110" fill="none">
      {/* Horns */}
      <polygon points="28,14 22,0 35,12" fill="#15803d" />
      <polygon points="52,14 58,0 45,12" fill="#15803d" />

      {/* Head */}
      <ellipse cx="40" cy="34" rx="26" ry="24" fill="#16a34a" />

      {/* Left ear (pointy) */}
      <polygon points="16,26 6,12 22,22" fill="#16a34a" />
      {/* Right ear (pointy) */}
      <polygon points="64,26 74,12 58,22" fill="#16a34a" />
      {/* Ear shadows */}
      <polygon points="16,26 9,14 20,23" fill="#15803d" />
      <polygon points="64,26 71,14 60,23" fill="#15803d" />

      {/* Eyes — yellow sclera, red iris */}
      <ellipse cx="32" cy="30" rx="7" ry="8" fill="#fef08a" />
      <ellipse cx="48" cy="30" rx="7" ry="8" fill="#fef08a" />
      <circle cx="32" cy="31" r="4.5" fill="#dc2626" />
      <circle cx="48" cy="31" r="4.5" fill="#dc2626" />
      <circle cx="33" cy="30" r="2.5" fill="#111" />
      <circle cx="49" cy="30" r="2.5" fill="#111" />
      {/* Eye glints */}
      <circle cx="34" cy="29" r="1" fill="white" />
      <circle cx="50" cy="29" r="1" fill="white" />

      {/* Nose */}
      <ellipse cx="40" cy="42" rx="5" ry="4" fill="#15803d" />
      <circle cx="38" cy="43" r="1.5" fill="#166534" />
      <circle cx="42" cy="43" r="1.5" fill="#166534" />

      {/* Mouth */}
      <path d="M29 51 Q40 59 51 51" stroke="#166534" strokeWidth="2" fill="none" />
      {/* Fangs */}
      <rect x="36" y="51" width="4" height="8" rx="2" fill="white" />
      <rect x="43" y="51" width="4" height="8" rx="2" fill="white" />

      {/* Body */}
      <rect x="18" y="56" width="44" height="36" rx="10" fill="#16a34a" />
      {/* Belly */}
      <ellipse cx="40" cy="73" rx="16" ry="12" fill="#22c55e" />

      {/* Left arm */}
      <rect x="4" y="58" width="16" height="24" rx="7" fill="#16a34a" />
      {/* Right arm */}
      <rect x="60" y="58" width="16" height="24" rx="7" fill="#16a34a" />

      {/* Left claws */}
      <ellipse cx="7" cy="85" rx="4" ry="5" fill="#15803d" transform="rotate(-25 7 85)" />
      <ellipse cx="13" cy="87" rx="4" ry="5" fill="#15803d" transform="rotate(-10 13 87)" />
      {/* Right claws */}
      <ellipse cx="67" cy="85" rx="4" ry="5" fill="#15803d" transform="rotate(25 67 85)" />
      <ellipse cx="73" cy="87" rx="4" ry="5" fill="#15803d" transform="rotate(10 73 87)" />

      {/* Legs */}
      <rect x="21" y="88" width="16" height="16" rx="5" fill="#15803d" />
      <rect x="43" y="88" width="16" height="16" rx="5" fill="#15803d" />
      {/* Feet */}
      <ellipse cx="29" cy="105" rx="12" ry="6" fill="#166534" />
      <ellipse cx="51" cy="105" rx="12" ry="6" fill="#166534" />
    </svg>
  )
}

export function EnemyCharacter({ phase, enemy }) {
  const controls = useAnimation()

  useEffect(() => {
    if (phase === 'hit') {
      // Enemy attacks — lunges toward knight (left)
      controls.start({ x: [0, -44, 0], transition: { duration: 0.5, ease: 'easeInOut' } })
    } else if (phase === 'attacking' || phase === 'combo') {
      // Enemy gets hurt — flinches right
      controls.start({ x: [0, 14, -8, 6, 0], transition: { duration: 0.5 } })
    }
  }, [phase, controls])

  return (
    <div className="relative flex flex-col items-center">
      <motion.div animate={controls} className="relative" style={{ transform: 'scaleX(-1)' }}>
        <GoblinSVG />

        {/* Red flash when hit by knight */}
        {(phase === 'attacking' || phase === 'combo') && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-red-500 pointer-events-none"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          />
        )}
      </motion.div>

    </div>
  )
}
