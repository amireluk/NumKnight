import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

function KnightSVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none">
      <defs>
        <linearGradient id="kn-helm" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#cfd8dc" />
          <stop offset="100%" stopColor="#607d8b" />
        </linearGradient>
        <linearGradient id="kn-body" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#b0bec5" />
          <stop offset="100%" stopColor="#546e7a" />
        </linearGradient>
        <linearGradient id="kn-chest" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#eceff1" />
          <stop offset="100%" stopColor="#90a4ae" />
        </linearGradient>
        <linearGradient id="kn-sword" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#90a4ae" />
        </linearGradient>
        <linearGradient id="kn-shield" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#42a5f5" />
          <stop offset="100%" stopColor="#0d47a1" />
        </linearGradient>
      </defs>

      {/* Plume */}
      <path d="M45 2 C38 8 35 20 40 28 C42 31 48 31 50 28 C55 20 52 8 45 2Z"
        fill="#ef5350" stroke="#b71c1c" strokeWidth="1.5" />
      <path d="M45 5 C40 11 39 21 43 26 C44 27 46 26 47 25 C50 20 49 11 45 5Z"
        fill="#ff8a80" opacity="0.55" />

      {/* Sword (behind body) */}
      <path d="M77 4 L81 4 L82 58 L76 58Z" fill="url(#kn-sword)" stroke="#90a4ae" strokeWidth="1.5" />
      <path d="M76 4 L79 0 L82 4Z" fill="url(#kn-sword)" stroke="#90a4ae" strokeWidth="1" />
      <line x1="78" y1="4" x2="78" y2="55" stroke="white" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
      <rect x="69" y="55" width="22" height="7" rx="3.5" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.5" />
      <rect x="77" y="62" width="6" height="19" rx="3" fill="#6d4c41" stroke="#3e2723" strokeWidth="1.5" />
      <circle cx="80" cy="83" r="6" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.5" />
      <circle cx="78" cy="81" r="2" fill="#a1887f" opacity="0.5" />

      {/* Helmet */}
      <path d="M20 55 L20 30 Q20 11 45 11 Q70 11 70 30 L70 55Z"
        fill="url(#kn-helm)" stroke="#263238" strokeWidth="2.5" />
      <rect x="20" y="45" width="13" height="16" rx="5" fill="url(#kn-helm)" stroke="#263238" strokeWidth="2" />
      <rect x="57" y="45" width="13" height="16" rx="5" fill="url(#kn-helm)" stroke="#263238" strokeWidth="2" />
      <path d="M26 15 Q38 11 48 13 Q44 26 32 27 Q24 24 26 15Z" fill="white" opacity="0.18" />
      <rect x="20" y="36" width="50" height="6" rx="2" fill="#ffb300" stroke="#f57f17" strokeWidth="1" />
      <rect x="26" y="28" width="38" height="10" rx="4" fill="#1a1a2e" />
      <rect x="40" y="28" width="10" height="22" rx="4" fill="#1a1a2e" />

      {/* Pauldrons */}
      <ellipse cx="15" cy="61" rx="12" ry="11" fill="url(#kn-body)" stroke="#263238" strokeWidth="2" />
      <ellipse cx="75" cy="61" rx="12" ry="11" fill="url(#kn-body)" stroke="#263238" strokeWidth="2" />
      <ellipse cx="12" cy="57" rx="6" ry="5" fill="white" opacity="0.15" />
      <ellipse cx="72" cy="57" rx="6" ry="5" fill="white" opacity="0.15" />

      {/* Torso */}
      <rect x="18" y="54" width="54" height="38" rx="11" fill="url(#kn-body)" stroke="#263238" strokeWidth="2.5" />
      <rect x="25" y="58" width="40" height="26" rx="8" fill="url(#kn-chest)" stroke="#90a4ae" strokeWidth="1.5" />
      <line x1="45" y1="60" x2="45" y2="82" stroke="#90a4ae" strokeWidth="3" strokeLinecap="round" />
      <path d="M27 60 Q36 57 44 61 Q37 70 27 68Z" fill="white" opacity="0.14" />
      <rect x="18" y="86" width="54" height="6" rx="3" fill="#ffb300" stroke="#f57f17" strokeWidth="1.5" />

      {/* Arms */}
      <rect x="4" y="60" width="15" height="26" rx="7" fill="url(#kn-body)" stroke="#263238" strokeWidth="2" />
      <rect x="71" y="60" width="15" height="26" rx="7" fill="url(#kn-body)" stroke="#263238" strokeWidth="2" />

      {/* Shield */}
      <path d="M1 51 L17 51 L17 76 Q9 87 1 76Z"
        fill="url(#kn-shield)" stroke="#0d47a1" strokeWidth="2" />
      <path d="M3 53 L15 53 L15 65 Q9 70 3 65Z" fill="white" opacity="0.15" />
      <line x1="9" y1="53" x2="9" y2="75" stroke="#ffb300" strokeWidth="2" opacity="0.9" strokeLinecap="round" />
      <line x1="2" y1="63" x2="16" y2="63" stroke="#ffb300" strokeWidth="2" opacity="0.9" strokeLinecap="round" />

      {/* Legs */}
      <rect x="22" y="90" width="20" height="20" rx="6" fill="#546e7a" stroke="#263238" strokeWidth="2" />
      <rect x="48" y="90" width="20" height="20" rx="6" fill="#546e7a" stroke="#263238" strokeWidth="2" />
      <ellipse cx="32" cy="95" rx="8" ry="6" fill="#607d8b" stroke="#263238" strokeWidth="1.5" />
      <ellipse cx="58" cy="95" rx="8" ry="6" fill="#607d8b" stroke="#263238" strokeWidth="1.5" />

      {/* Boots */}
      <rect x="18" y="106" width="25" height="13" rx="7" fill="#37474f" stroke="#263238" strokeWidth="2" />
      <rect x="47" y="106" width="25" height="13" rx="7" fill="#37474f" stroke="#263238" strokeWidth="2" />
      <rect x="20" y="108" width="10" height="4" rx="2" fill="#546e7a" opacity="0.6" />
      <rect x="49" y="108" width="10" height="4" rx="2" fill="#546e7a" opacity="0.6" />
    </svg>
  )
}

export function KnightCharacter({ phase }) {
  const combatControls = useAnimation()

  useEffect(() => {
    if (phase === 'attacking') {
      combatControls.start({ x: [0, 80, 0], transition: { duration: 0.45, ease: 'easeInOut' } })
    } else if (phase === 'hit') {
      combatControls.start({ x: [0, -18, 12, -8, 0], transition: { duration: 0.4 } })
    }
  }, [phase, combatControls])

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
        <motion.div animate={combatControls}>
          <KnightSVG />
        </motion.div>
      </motion.div>
    </div>
  )
}
