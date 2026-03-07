import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { KnightCharacter } from './KnightCharacter'

// Ground sampling points — matches the near-hills bezier in KingdomBackground
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

export function StrollingKnight() {
  const wrapRef   = useRef(null)
  const motionX   = useMotionValue(20)
  const cancelled = useRef(false)
  const [facingRight, setFacingRight] = useState(true)
  const [visible, setVisible]         = useState(false)

  const motionBottom = useTransform(motionX, (x) => {
    const w = wrapRef.current?.offsetWidth ?? 390
    return groundBottom(x, w)
  })

  useEffect(() => {
    cancelled.current = false
    async function stroll() {
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

// Sky + ground background layer — difficulty changes atmosphere
export function KingdomBackground({ difficulty = 'easy' }) {
  const isHard   = difficulty === 'hard'
  const isMedium = difficulty === 'medium'

  return (
    <svg
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', pointerEvents: 'none', display: 'block', zIndex: 0 }}
      viewBox="0 0 400 230"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
    >
      <defs>
        <linearGradient id="ks-sky" x1="0" y1="0" x2="0" y2="1">
          {isHard ? <>
            <stop offset="0%"   stopColor="#050408" stopOpacity="0" />
            <stop offset="30%"  stopColor="#0a0612" stopOpacity="0" />
            <stop offset="54%"  stopColor="#12091e" stopOpacity="0.7" />
            <stop offset="76%"  stopColor="#1a0d28" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#200c30" stopOpacity="1" />
          </> : isMedium ? <>
            <stop offset="0%"   stopColor="#2a4a7a" stopOpacity="0" />
            <stop offset="30%"  stopColor="#2a4a7a" stopOpacity="0" />
            <stop offset="54%"  stopColor="#3a5a88" stopOpacity="0.6" />
            <stop offset="76%"  stopColor="#4a70a0" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#607898" stopOpacity="1" />
          </> : <>
            <stop offset="0%"   stopColor="#4a80c0" stopOpacity="0" />
            <stop offset="30%"  stopColor="#4a80c0" stopOpacity="0" />
            <stop offset="54%"  stopColor="#5a8ed4" stopOpacity="0.55" />
            <stop offset="76%"  stopColor="#7ab0d8" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#a8d0e8" stopOpacity="1" />
          </>}
        </linearGradient>
      </defs>
      <rect width="400" height="230" fill="url(#ks-sky)" />

      {/* Light source */}
      {!isHard && <>
        <circle cx="310" cy="148" r="28" fill={isMedium ? "#e8802a" : "#ffd060"} opacity={isMedium ? 0.15 : 0.28} />
        <circle cx="310" cy="148" r="18" fill={isMedium ? "#f09050" : "#ffdc80"} opacity={isMedium ? 0.30 : 0.55} />
        <circle cx="310" cy="148" r="11" fill={isMedium ? "#f8b070" : "#ffe8a0"} opacity={isMedium ? 0.50 : 0.80} />
      </>}

      {/* Clouds */}
      {isHard ? <>
        <ellipse cx="80"  cy="100" rx="50" ry="20" fill="#1a1020" opacity="0.90" />
        <ellipse cx="110" cy="92"  rx="34" ry="16" fill="#200c28" opacity="0.85" />
        <ellipse cx="50"  cy="106" rx="30" ry="14" fill="#150a1e" opacity="0.80" />
        <ellipse cx="240" cy="105" rx="44" ry="18" fill="#1a1020" opacity="0.88" />
        <ellipse cx="270" cy="97"  rx="28" ry="14" fill="#200c28" opacity="0.82" />
        <ellipse cx="210" cy="110" rx="22" ry="12" fill="#120810" opacity="0.75" />
      </> : isMedium ? <>
        <ellipse cx="80"  cy="110" rx="34" ry="14" fill="#8090a0" opacity="0.14" />
        <ellipse cx="104" cy="104" rx="22" ry="12" fill="#7080a0" opacity="0.11" />
        <ellipse cx="58"  cy="108" rx="20" ry="10" fill="#8090a0" opacity="0.10" />
        <ellipse cx="240" cy="118" rx="28" ry="11" fill="#7080a0" opacity="0.11" />
        <ellipse cx="262" cy="113" rx="18" ry="10" fill="#8090a0" opacity="0.08" />
      </> : <>
        <ellipse cx="80"  cy="110" rx="34" ry="14" fill="white" opacity="0.18" />
        <ellipse cx="104" cy="104" rx="22" ry="12" fill="white" opacity="0.14" />
        <ellipse cx="58"  cy="108" rx="20" ry="10" fill="white" opacity="0.12" />
        <ellipse cx="240" cy="118" rx="28" ry="11" fill="white" opacity="0.14" />
        <ellipse cx="262" cy="113" rx="18" ry="10" fill="white" opacity="0.10" />
      </>}

      {/* Ground hills */}
      {isHard ? <>
        <path d="M0 162 Q40 142 80 154 Q120 164 162 144 Q202 126 244 144 Q286 162 328 142 Q364 126 400 140 L400 230 L0 230Z" fill="#3a3025" />
        <path d="M0 180 Q50 166 100 174 Q155 182 210 170 Q264 158 320 172 Q362 180 400 170 L400 230 L0 230Z" fill="#2a2018" />
        <path d="M0 194 Q80 186 160 192 Q240 198 320 190 Q370 186 400 192 L400 230 L0 230Z" fill="#1e1810" />
        <rect x="0" y="206" width="400" height="24" fill="#160e08" />
      </> : isMedium ? <>
        <path d="M0 162 Q40 142 80 154 Q120 164 162 144 Q202 126 244 144 Q286 162 328 142 Q364 126 400 140 L400 230 L0 230Z" fill="#5a8f50" />
        <path d="M0 180 Q50 166 100 174 Q155 182 210 170 Q264 158 320 172 Q362 180 400 170 L400 230 L0 230Z" fill="#4a7f40" />
        <path d="M0 194 Q80 186 160 192 Q240 198 320 190 Q370 186 400 192 L400 230 L0 230Z" fill="#3a6f30" />
        <rect x="0" y="206" width="400" height="24" fill="#2a5f20" />
      </> : <>
        <path d="M0 162 Q40 142 80 154 Q120 164 162 144 Q202 126 244 144 Q286 162 328 142 Q364 126 400 140 L400 230 L0 230Z" fill="#7abf6a" />
        <path d="M0 180 Q50 166 100 174 Q155 182 210 170 Q264 158 320 172 Q362 180 400 170 L400 230 L0 230Z" fill="#5aaf48" />
        <path d="M0 194 Q80 186 160 192 Q240 198 320 190 Q370 186 400 192 L400 230 L0 230Z" fill="#4a9a38" />
        <rect x="0" y="206" width="400" height="24" fill="#3a8828" />
      </>}
    </svg>
  )
}

// Trees + castle foreground layer — castle style changes with difficulty
export function KingdomForeground({ difficulty = 'easy' }) {
  const isHard   = difficulty === 'hard'
  const isMedium = difficulty === 'medium'

  const treeA = isHard ? '#1a1510' : isMedium ? '#2a6020' : '#3a8c30'
  const treeB = isHard ? '#201a14' : isMedium ? '#357030' : '#4a9c3a'
  const treeC = isHard ? '#150f0a' : isMedium ? '#256018' : '#358c2c'
  const trunk  = isHard ? '#2a1a10' : '#7c5a38'

  const c = isHard ? {
    body:         '#2a2535',
    bodyHL:       '#1e1828',
    towers:       '#201c2a',
    roof:         '#0f0c18',
    winMain:      '#ff2200',
    winMainOp:    0.70,
    winSide:      '#ff1500',
    winSideOp:    0.60,
    flags:        '#0a0808',
    door:         '#100808',
    flagpole:     '#1a1010',
  } : isMedium ? {
    body:         '#95866a',
    bodyHL:       '#857860',
    towers:       '#857660',
    roof:         '#3a4a6a',
    winMain:      '#e8802a',
    winMainOp:    0.45,
    winSide:      '#d87020',
    winSideOp:    0.38,
    flags:        '#6b0000',
    door:         '#4a3220',
    flagpole:     '#5a4830',
  } : {
    body:         '#d4c4a8',
    bodyHL:       '#c4b498',
    towers:       '#c8b89c',
    roof:         '#5a7aaa',
    winMain:      '#ffcc60',
    winMainOp:    0.55,
    winSide:      '#ffcc60',
    winSideOp:    0.45,
    flags:        '#e04040',
    door:         '#7a6248',
    flagpole:     '#7c6a50',
  }

  return (
    <svg
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', pointerEvents: 'none', display: 'block', zIndex: 3 }}
      viewBox="0 0 400 230"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
    >
      {/* Left trees */}
      <path d="M12 182 L26 148 L40 182Z"  fill={treeA} />
      <path d="M30 185 L44 152 L58 185Z"  fill={treeB} />
      <path d="M4  188 L16  160 L28 188Z" fill={treeC} />
      <path d="M46 184 L58  156 L70 184Z" fill={treeA} />
      <rect x="24" y="182" width="4" height="10" rx="2" fill={trunk} />
      <rect x="42" y="185" width="4" height="10" rx="2" fill={trunk} />

      {/* Castle body */}
      <rect x="165" y="118" width="70" height="112" fill={c.body} />
      <rect x="165" y="128" width="70" height="5" fill={c.bodyHL} opacity="0.5" />
      <rect x="165" y="146" width="70" height="5" fill={c.bodyHL} opacity="0.5" />
      <rect x="165" y="164" width="70" height="5" fill={c.bodyHL} opacity="0.5" />
      {/* Door arch */}
      <path d="M183 230 L183 186 Q200 172 217 186 L217 230Z" fill={c.door} />
      {/* Battlements */}
      <path d="M163 118 L165 118 L165 108 L174 108 L174 118 L183 118 L183 108 L192 108 L192 118 L201 118 L201 108 L210 108 L210 118 L219 118 L219 108 L228 108 L228 118 L235 118 L235 126 L163 126Z"
        fill={c.body} />

      {/* Left tower */}
      <rect x="138" y="134" width="30" height="96" fill={c.towers} />
      <path d="M134 134 L153 106 L172 134Z" fill={c.roof} />
      <path d="M136 134 L138 134 L138 124 L147 124 L147 134 L156 134 L156 124 L165 124 L165 134 L168 134 L168 140 L136 140Z"
        fill={c.towers} />

      {/* Right tower */}
      <rect x="232" y="134" width="30" height="96" fill={c.towers} />
      <path d="M228 134 L247 106 L266 134Z" fill={c.roof} />
      <path d="M230 134 L232 134 L232 124 L241 124 L241 134 L250 134 L250 124 L259 124 L259 134 L262 134 L262 140 L230 140Z"
        fill={c.towers} />

      {/* Main window */}
      <rect x="186" y="134" width="28" height="30" rx="14" fill={c.winMain} opacity={c.winMainOp} />
      <rect x="188" y="136" width="24" height="26" rx="12" fill={c.winMain} opacity={c.winMainOp * 0.7} />

      {/* Side windows */}
      <rect x="143" y="148" width="16" height="20" rx="8" fill={c.winSide} opacity={c.winSideOp} />
      <rect x="241" y="148" width="16" height="20" rx="8" fill={c.winSide} opacity={c.winSideOp} />

      {/* Flags */}
      <rect x="152" y="100" width="2" height="14" fill={c.flagpole} />
      <path d="M154 100 L166 106 L154 112Z" fill={c.flags} />
      <rect x="246" y="100" width="2" height="14" fill={c.flagpole} />
      <path d="M248 100 L260 106 L248 112Z" fill={c.flags} />

      {/* Hard: cracks + sinister window glow */}
      {isHard && <>
        <path d="M175 130 L178 145 L173 155" stroke="#100a18" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <path d="M215 135 L218 148 L222 158" stroke="#100a18" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <rect x="183" y="130" width="34" height="38" rx="17" fill="#ff2200" opacity="0.12" />
        <rect x="140" y="144" width="22" height="28" rx="11" fill="#ff1500" opacity="0.10" />
        <rect x="238" y="144" width="22" height="28" rx="11" fill="#ff1500" opacity="0.10" />
      </>}

      {/* Right trees */}
      <path d="M330 182 L344 148 L358 182Z" fill={treeA} />
      <path d="M346 185 L360 150 L374 185Z" fill={treeB} />
      <path d="M362 183 L374 156 L386 183Z" fill={treeA} />
      <path d="M318 187 L330 160 L342 187Z" fill={treeC} />
      <rect x="342" y="182" width="4" height="10" rx="2" fill={trunk} />
      <rect x="358" y="185" width="4" height="10" rx="2" fill={trunk} />
    </svg>
  )
}

// Returns the outer-div CSS background string for a given difficulty
export function bgStyle(difficulty) {
  if (difficulty === 'hard') {
    return (
      'radial-gradient(ellipse at 50% 20%, rgba(160,0,0,0.15) 0%, transparent 55%), ' +
      'linear-gradient(to bottom, #04030a, #0c0616)'
    )
  }
  if (difficulty === 'medium') {
    return (
      'radial-gradient(ellipse at 50% 20%, rgba(251,191,36,0.07) 0%, transparent 55%), ' +
      'linear-gradient(to bottom, #0f2040, #182860)'
    )
  }
  return (
    'radial-gradient(ellipse at 50% 20%, rgba(251,191,36,0.12) 0%, transparent 55%), ' +
    'linear-gradient(to bottom, #1e3a70, #2d5aaa)'
  )
}
