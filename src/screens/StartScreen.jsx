import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, useAnimation } from 'framer-motion'
import { KnightCharacter } from '../components/KnightCharacter'

const NAME_KEY = 'numknight_player_name'

const DIFF_VALUES = ['easy', 'medium', 'hard']
const DIFF_COLOR  = { easy: '#4ade80', medium: '#fbbf24', hard: '#ef4444' }

// ── Background layer: sky, sun, clouds, hills, ground (knight walks in front of this)
function KingdomBackground() {
  return (
    <svg
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', pointerEvents: 'none', display: 'block', zIndex: 0 }}
      viewBox="0 0 400 230"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
    >
      <defs>
        <linearGradient id="ks-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4a80c0" stopOpacity="0" />
          <stop offset="30%"  stopColor="#4a80c0" stopOpacity="0" />
          <stop offset="54%"  stopColor="#5a8ed4" stopOpacity="0.55" />
          <stop offset="76%"  stopColor="#7ab0d8" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#a8d0e8" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="400" height="230" fill="url(#ks-sky)" />
      <circle cx="310" cy="148" r="28" fill="#ffd060" opacity="0.28" />
      <circle cx="310" cy="148" r="18" fill="#ffdc80" opacity="0.55" />
      <circle cx="310" cy="148" r="11" fill="#ffe8a0" opacity="0.80" />
      <ellipse cx="80"  cy="110" rx="34" ry="14" fill="white" opacity="0.18" />
      <ellipse cx="104" cy="104" rx="22" ry="12" fill="white" opacity="0.14" />
      <ellipse cx="58"  cy="108" rx="20" ry="10" fill="white" opacity="0.12" />
      <ellipse cx="240" cy="118" rx="28" ry="11" fill="white" opacity="0.14" />
      <ellipse cx="262" cy="113" rx="18" ry="10" fill="white" opacity="0.10" />
      <path d="M0 162 Q40 142 80 154 Q120 164 162 144 Q202 126 244 144 Q286 162 328 142 Q364 126 400 140 L400 230 L0 230Z"
        fill="#7abf6a" />
      <path d="M0 180 Q50 166 100 174 Q155 182 210 170 Q264 158 320 172 Q362 180 400 170 L400 230 L0 230Z"
        fill="#5aaf48" />
      <path d="M0 194 Q80 186 160 192 Q240 198 320 190 Q370 186 400 192 L400 230 L0 230Z"
        fill="#4a9a38" />
      <rect x="0" y="206" width="400" height="24" fill="#3a8828" />
    </svg>
  )
}

// ── Foreground layer: trees + castle (knight walks behind these)
function KingdomForeground() {
  return (
    <svg
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', pointerEvents: 'none', display: 'block', zIndex: 3 }}
      viewBox="0 0 400 230"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
    >
      {/* Left tree cluster */}
      <path d="M12 182 L26 148 L40 182Z"  fill="#3a8c30" />
      <path d="M30 185 L44 152 L58 185Z"  fill="#4a9c3a" />
      <path d="M4  188 L16  160 L28 188Z" fill="#358c2c" />
      <path d="M46 184 L58  156 L70 184Z" fill="#3a8c30" />
      <rect x="24" y="182" width="4" height="10" rx="2" fill="#7c5a38" />
      <rect x="42" y="185" width="4" height="10" rx="2" fill="#7c5a38" />
      {/* Castle body */}
      <rect x="165" y="118" width="70" height="112" fill="#d4c4a8" />
      <rect x="165" y="128" width="70" height="5" fill="#c4b498" opacity="0.5" />
      <rect x="165" y="146" width="70" height="5" fill="#c4b498" opacity="0.5" />
      <rect x="165" y="164" width="70" height="5" fill="#c4b498" opacity="0.5" />
      <path d="M183 230 L183 186 Q200 172 217 186 L217 230Z" fill="#7a6248" />
      <path d="M163 118 L165 118 L165 108 L174 108 L174 118 L183 118 L183 108 L192 108 L192 118 L201 118 L201 108 L210 108 L210 118 L219 118 L219 108 L228 108 L228 118 L235 118 L235 126 L163 126Z"
        fill="#d4c4a8" />
      {/* Left tower */}
      <rect x="138" y="134" width="30" height="96" fill="#c8b89c" />
      <path d="M134 134 L153 106 L172 134Z" fill="#5a7aaa" />
      <path d="M136 134 L138 134 L138 124 L147 124 L147 134 L156 134 L156 124 L165 124 L165 134 L168 134 L168 140 L136 140Z"
        fill="#c8b89c" />
      {/* Right tower */}
      <rect x="232" y="134" width="30" height="96" fill="#c8b89c" />
      <path d="M228 134 L247 106 L266 134Z" fill="#5a7aaa" />
      <path d="M230 134 L232 134 L232 124 L241 124 L241 134 L250 134 L250 124 L259 124 L259 134 L262 134 L262 140 L230 140Z"
        fill="#c8b89c" />
      {/* Windows */}
      <rect x="186" y="134" width="28" height="30" rx="14" fill="#ffcc60" opacity="0.55" />
      <rect x="188" y="136" width="24" height="26" rx="12" fill="#ffe090" opacity="0.40" />
      <rect x="143" y="148" width="16" height="20" rx="8" fill="#ffcc60" opacity="0.45" />
      <rect x="241" y="148" width="16" height="20" rx="8" fill="#ffcc60" opacity="0.45" />
      {/* Flags */}
      <rect x="152" y="100" width="2" height="14" fill="#7c6a50" />
      <path d="M154 100 L166 106 L154 112Z" fill="#e04040" />
      <rect x="246" y="100" width="2" height="14" fill="#7c6a50" />
      <path d="M248 100 L260 106 L248 112Z" fill="#e04040" />
      {/* Right tree cluster */}
      <path d="M330 182 L344 148 L358 182Z" fill="#3a8c30" />
      <path d="M346 185 L360 150 L374 185Z" fill="#4a9c3a" />
      <path d="M362 183 L374 156 L386 183Z" fill="#3a8c30" />
      <path d="M318 187 L330 160 L342 187Z" fill="#358c2c" />
      <rect x="342" y="182" width="4" height="10" rx="2" fill="#7c5a38" />
      <rect x="358" y="185" width="4" height="10" rx="2" fill="#7c5a38" />
    </svg>
  )
}

// Sampled points from the near-hills bezier path in KingdomBackground
// (viewBox 0 0 400 230) — used to follow the ground curve
const GROUND_PTS = [
  [0, 180], [25, 174], [50, 171.5], [75, 171.5], [100, 174],
  [128, 177], [155, 177], [183, 175], [210, 170],
  [237, 166], [265, 164.5], [292, 167], [320, 172],
  [341, 175], [361, 175.5], [381, 174], [400, 170],
]

function groundBottom(screenX, containerW) {
  const scale = containerW / 400
  const vx = Math.max(0, Math.min(400, (screenX / containerW) * 400))
  let vy = 174
  for (let i = 0; i < GROUND_PTS.length - 1; i++) {
    const [x0, y0] = GROUND_PTS[i]
    const [x1, y1] = GROUND_PTS[i + 1]
    if (vx >= x0 && vx <= x1) {
      vy = y0 + (y1 - y0) * ((vx - x0) / (x1 - x0))
      break
    }
  }
  return (230 - vy) * scale
}

function StrollingKnight() {
  const wrapRef   = useRef(null)
  const motionX   = useMotionValue(20)
  const cancelled = useRef(false)
  const [facingRight, setFacingRight] = useState(true)
  const [visible, setVisible] = useState(false)

  // Derive bottom offset from motionX so feet track the ground curve
  const motionBottom = useTransform(motionX, (x) => {
    const w = wrapRef.current?.offsetWidth ?? 390
    return groundBottom(x, w)
  })

  useEffect(() => {
    cancelled.current = false

    async function stroll() {
      // Wait one rAF so wrapRef is measured, then snap to correct position and show
      await new Promise(r => requestAnimationFrame(r))
      motionX.set(20)
      setVisible(true)
      await new Promise(r => setTimeout(r, 700))
      let goRight = true
      while (!cancelled.current) {
        const w       = wrapRef.current?.offsetWidth ?? 390
        const targetX = goRight ? w - 84 : 20
        const dist    = Math.abs(targetX - motionX.get())
        setFacingRight(goRight)
        await new Promise(resolve =>
          animate(motionX, targetX, { duration: dist / 36, ease: 'linear', onComplete: resolve })
        )
        goRight = !goRight
        if (cancelled.current) break
        await new Promise(r => setTimeout(r, 700 + Math.random() * 1000))
      }
    }

    stroll()
    return () => { cancelled.current = true }
  }, [motionX])

  return (
    // dir="ltr" prevents RTL inheritance from parent from flipping absolute positioning
    <div ref={wrapRef} dir="ltr" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
      <motion.div style={{
        x: motionX, bottom: motionBottom,
        position: 'absolute', left: 0, display: 'inline-block',
        opacity: visible ? 1 : 0,
      }}>
        <div style={{
          transform: `scale(0.72) scaleX(${facingRight ? 1 : -1})`,
          transformOrigin: 'center bottom',
          display: 'inline-block',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
        }}>
          <KnightCharacter phase="idle" hitKey={0} />
        </div>
      </motion.div>
    </div>
  )
}

export function StartScreen({ onStart, lang, onLangChange, t }) {
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) ?? '')
  const [nameError, setNameError] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const nameShake = useAnimation()

  const isRtl = lang === 'he'

  const handleStart = () => {
    const trimmed = name.trim().slice(0, 16)
    if (!trimmed) {
      setNameError(true)
      nameShake.start({ x: [0, -10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.4 } })
      return
    }
    localStorage.setItem(NAME_KEY, trimmed)
    onStart({ name: trimmed, diff: difficulty })
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col items-center justify-center min-h-dvh max-w-md mx-auto px-6 gap-7 select-none"
      style={{
        position: 'relative',
        paddingBottom: 210,
        background:
          'radial-gradient(ellipse at 50% 20%, rgba(251,191,36,0.12) 0%, transparent 55%), ' +
          'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
      }}
    >
      {/* Language toggle — top right corner, always LTR regardless of language */}
      <div dir="ltr" style={{
        position: 'absolute', top: 14, right: 14, zIndex: 10,
        display: 'flex', gap: 4,
      }}>
        {['en', 'he'].map((l) => (
          <button
            key={l}
            onClick={() => onLangChange(l)}
            style={{
              padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
              fontSize: 11, fontWeight: 900, letterSpacing: '0.06em',
              border: lang === l ? '1.5px solid rgba(251,191,36,0.8)' : '1.5px solid rgba(255,255,255,0.18)',
              background: lang === l ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.08)',
              color: lang === l ? '#fbbf24' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.15s',
            }}
          >
            {l === 'en' ? 'EN' : 'עב'}
          </button>
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <p className="font-black text-white tracking-widest" style={{
          fontSize: 52, lineHeight: 1,
          textShadow: '0 0 48px rgba(251,191,36,0.45), 0 2px 0 rgba(0,0,0,0.6)',
        }}>
          NumKnight
        </p>
      </motion.div>

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        style={{ width: '100%', position: 'relative', zIndex: 1 }}
      >
      <motion.div
        animate={nameShake}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}
      >
        <label style={{ fontSize: 11, color: nameError ? '#ef4444' : 'rgba(255,255,255,0.38)', fontWeight: 700, letterSpacing: '0.22em', transition: 'color 0.2s' }}>
          {t.yourName}
        </label>
        <input
          dir={isRtl ? 'rtl' : 'ltr'}
          value={name}
          onChange={(e) => { setName(e.target.value.slice(0, 16)); setNameError(false) }}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          placeholder={t.namePlaceholder}
          maxLength={16}
          style={{
            width: '100%', borderRadius: 14,
            border: `1.5px solid ${nameError ? '#ef4444' : 'rgba(255,255,255,0.16)'}`,
            background: nameError ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.18)',
            color: 'white', padding: '13px 16px',
            fontSize: 17, outline: 'none',
            boxSizing: 'border-box', transition: 'border-color 0.2s, background 0.2s',
          }}
        />
      </motion.div>
      </motion.div>

      {/* Difficulty picker */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7, position: 'relative', zIndex: 1 }}
      >
        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 700, letterSpacing: '0.22em' }}>
          {t.difficulty}
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {DIFF_VALUES.map((val) => {
            const selected = difficulty === val
            const color = DIFF_COLOR[val]
            return (
              <motion.button
                key={val}
                onClick={() => setDifficulty(val)}
                whileTap={{ scale: 0.94 }}
                style={{
                  flex: 1, padding: '11px 4px', borderRadius: 14,
                  border: `2px solid ${selected ? color : 'rgba(255,255,255,0.11)'}`,
                  background: selected ? `${color}2e` : 'rgba(255,255,255,0.12)',
                  color: selected ? color : 'rgba(255,255,255,0.35)',
                  fontWeight: 900, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}
              >
                <span>{t.diffLabel[val]}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, type: 'spring', stiffness: 200, damping: 18 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={handleStart}
        style={{ position: 'relative', zIndex: 1 }}
        className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
      >
        {t.startAdventure}
      </motion.button>

      {/* Layer 0: hills + sky */}
      <KingdomBackground />
      {/* Layer 1: knight walks between ground and trees/castle */}
      <StrollingKnight />
      {/* Layer 2: trees + castle in front of knight */}
      <KingdomForeground />
    </div>
  )
}
