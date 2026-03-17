import { motion } from 'framer-motion'

// ── Scene pieces ──────────────────────────────────────────────────────────────

function Stars() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (i * 13.7 + 5) % 100,
    y: (i * 7.3 + 3) % 58,
    size: 1 + (i % 3) * 0.7,
    opacity: 0.25 + (i % 5) * 0.12,
    twinkle: i % 6 === 0,
  }))
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          animate={s.twinkle ? { opacity: [s.opacity, s.opacity * 0.3, s.opacity] } : {}}
          transition={s.twinkle ? { duration: 2.5 + (s.id % 4), repeat: Infinity, ease: 'easeInOut' } : {}}
          style={{
            position: 'absolute',
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            borderRadius: '50%',
            background: '#fff',
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  )
}

function HorizonGlow() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '22%', left: '50%', transform: 'translateX(-50%)',
      width: '90%', height: 70,
      background: 'radial-gradient(ellipse at 50% 100%, rgba(220,38,38,0.28) 0%, rgba(239,68,68,0.08) 40%, transparent 70%)',
      pointerEvents: 'none',
    }} />
  )
}

function Mountains() {
  return (
    <svg
      viewBox="0 0 400 90"
      preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: '22%', left: 0, right: 0, width: '100%', height: 90, pointerEvents: 'none' }}
    >
      {/* Back range — slightly lighter, further */}
      <path
        d="M0,90 L0,65 L35,28 L65,55 L100,14 L135,48 L175,6 L215,42 L255,18 L295,52 L335,20 L370,46 L400,32 L400,90 Z"
        fill="#150a05"
      />
      {/* Front range — darker, closer */}
      <path
        d="M0,90 L0,75 L28,52 L55,68 L85,38 L118,62 L150,32 L188,60 L222,30 L260,65 L295,40 L330,68 L365,44 L400,58 L400,90 Z"
        fill="#0f0703"
      />
    </svg>
  )
}

function Ground() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: '24%',
      background: 'linear-gradient(to bottom, #1c0d06 0%, #0e0602 100%)',
    }} />
  )
}

// Warm firelight radial glow cast onto the scene
function FireGlow() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '14%',
      left: '50%',
      transform: 'translateX(10px)',
      width: 180, height: 140,
      background: 'radial-gradient(ellipse at 40% 80%, rgba(251,146,60,0.22) 0%, rgba(251,146,60,0.06) 45%, transparent 70%)',
      pointerEvents: 'none',
    }} />
  )
}

function Flames() {
  const tongues = [
    { w: 20, h: 40, ml: -10, delay: 0,    color: '#ea580c' },
    { w: 14, h: 32, ml: -17, delay: 0.18, color: '#f97316' },
    { w: 12, h: 26, ml:   4, delay: 0.32, color: '#fb923c' },
    { w: 9,  h: 20, ml:  -5, delay: 0.08, color: '#fcd34d' },
  ]
  return (
    <div style={{ position: 'relative', width: 48, height: 54, flexShrink: 0 }}>
      {/* Log base */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 40, height: 10, borderRadius: 5,
        background: 'linear-gradient(to bottom, #7c3a12, #4a1f06)',
      }} />
      {/* Ember glow base */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 60, height: 24, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(251,146,60,0.55) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {tongues.map((f, i) => (
        <motion.div
          key={i}
          animate={{ scaleY: [1, 1.14, 0.9, 1.1, 1], scaleX: [1, 0.88, 1.06, 0.94, 1], y: [0, -3, 1, -2, 0] }}
          transition={{ duration: 0.85 + i * 0.17, repeat: Infinity, ease: 'easeInOut', delay: f.delay }}
          style={{
            position: 'absolute',
            bottom: 9,
            left: '50%',
            marginLeft: f.ml,
            width: f.w, height: f.h,
            background: f.color,
            borderRadius: '50% 50% 28% 28%',
            transformOrigin: 'bottom center',
            filter: 'blur(2px)',
            opacity: 0.88,
          }}
        />
      ))}
    </div>
  )
}

function Embers() {
  const embers = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: -6 + (i * 4.1) % 14,
    delay: (i * 0.38) % 2.6,
    duration: 1.7 + (i * 0.22) % 1.1,
    size: 1.5 + (i % 3) * 0.7,
    drift: (i % 2 === 0 ? 1 : -1) * (3 + (i * 1.9) % 7),
    color: i % 3 === 0 ? '#fde68a' : i % 3 === 1 ? '#fb923c' : '#fbbf24',
  }))
  return (
    <div style={{ position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
      {embers.map((e) => (
        <motion.div
          key={e.id}
          initial={{ x: e.x, y: 0, opacity: 0.9 }}
          animate={{ x: e.x + e.drift, y: -65, opacity: 0 }}
          transition={{ delay: e.delay, duration: e.duration, repeat: Infinity, ease: 'easeOut' }}
          style={{ position: 'absolute', width: e.size, height: e.size, borderRadius: '50%', background: e.color }}
        />
      ))}
    </div>
  )
}

// Simplified seated knight silhouette facing the fire (facing right)
function SeatedKnight() {
  return (
    <svg
      viewBox="0 0 56 68"
      width={56} height={68}
      style={{ filter: 'drop-shadow(3px 0 8px rgba(251,146,60,0.3))' }}
    >
      {/* Cloak/body */}
      <ellipse cx={27} cy={40} rx={14} ry={17} fill="#1a0e08" />
      {/* Head */}
      <circle cx={27} cy={17} r={9.5} fill="#1a0e08" />
      {/* Helmet T-visor */}
      <line x1={18} y1={17} x2={36} y2={17} stroke="#2d1610" strokeWidth={1.8} />
      <line x1={27} y1={11} x2={27} y2={23} stroke="#2d1610" strokeWidth={1.5} />
      {/* Legs extended forward (sitting) */}
      <rect x={11} y={50} width={22} height={7} rx={3.5} fill="#1a0e08" transform="rotate(-12 22 54)" />
      <rect x={22} y={52} width={20} height={6} rx={3} fill="#130b05" transform="rotate(4 32 55)" />
      {/* Sword resting point-down */}
      <rect x={36} y={26} width={4} height={28} rx={2} fill="#1a0e08" transform="rotate(12 38 40)" />
      {/* Warm firelight edge on right side */}
      <ellipse cx={42} cy={32} rx={7} ry={20} fill="rgba(251,146,60,0.07)" />
    </svg>
  )
}

// ── Boost card ────────────────────────────────────────────────────────────────

const CARD_COLORS = [
  { bg: '#c2410c', border: '#9a3412' }, // orange
  { bg: '#0f766e', border: '#0d5e57' }, // teal
  { bg: '#1d4ed8', border: '#1e3a8a' }, // blue
]

function BoostCard({ boost, onConfirm, index }) {
  const colors = CARD_COLORS[index % CARD_COLORS.length]
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 + index * 0.1, duration: 0.35 }}
    >
      <motion.button
        whileTap={{ scale: 0.95, y: 4, transition: { duration: 0.1 } }}
        whileHover={{ scale: 1.03, y: -1, transition: { duration: 0.12 } }}
        onClick={() => setTimeout(() => onConfirm(boost.id), 120)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: colors.bg,
          borderBottom: `4px solid ${colors.border}`,
          borderTop: 'none', borderLeft: 'none', borderRight: 'none',
          borderRadius: 16, padding: '13px 16px',
          cursor: 'pointer', textAlign: 'left', width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{boost.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 14, fontWeight: 900,
            color: 'white',
            letterSpacing: '0.05em', marginBottom: 3,
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}>
            {boost.name}
          </p>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>
            {boost.desc}
          </p>
        </div>
      </motion.button>
    </motion.div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function CampfireScreen({ onBoostChosen, lang, t }) {
  const boosts = [
    {
      id: 'weakSpot',
      name: t?.boostWeakSpotName ?? "Dragon's Weakness",
      icon: '⚔️',
      desc: t?.boostWeakSpotDesc ?? '−1 Dragon HP',
    },
    {
      id: 'steadyNerves',
      name: t?.boostSteadyNervesName ?? 'Steady Nerves',
      icon: '🕯️',
      desc: t?.boostSteadyNervesDesc ?? '+3 seconds on every question timer',
    },
    {
      id: 'chronicle',
      name: t?.boostChronicleName ?? "Hero's Chronicle",
      icon: '📜',
      desc: t?.boostChronicleDesc ?? '+100 bonus points per battle won',
    },
  ]

  return (
    <div
      dir={lang === 'he' ? 'rtl' : 'ltr'}
      style={{
        position: 'relative',
        width: '100%', height: '100dvh',
        maxWidth: 448, margin: '0 auto',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #050308 0%, #0d0605 50%, #1a0c06 100%)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* ── Scene ─────────────────────────────────────── */}
      <div style={{ position: 'relative', flex: '0 0 40%', minHeight: 0 }}>
        <Stars />
        <HorizonGlow />
        <Mountains />
        <Ground />
        <FireGlow />

        {/* Knight + fire on the ground */}
        <div style={{
          position: 'absolute', bottom: '8%', left: 0, right: 0,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          gap: 20, paddingInline: 32,
        }}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <SeatedKnight />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            style={{ position: 'relative' }}
          >
            <Flames />
            <Embers />
          </motion.div>
        </div>
      </div>

      {/* ── Title ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        style={{ textAlign: 'center', padding: '10px 20px 6px', flexShrink: 0 }}
      >
        <p style={{
          fontSize: 10, fontWeight: 900, letterSpacing: '0.22em',
          color: 'rgba(251,146,60,0.65)', marginBottom: 4,
          textTransform: 'uppercase',
        }}>
          {t?.campfireTitle ?? 'THE DRAGON LAIR AWAITS'}
        </p>
        <p style={{
          fontSize: 14, fontWeight: 600,
          color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em',
        }}>
          {t?.campfireSubtitle ?? 'Choose one boon before you enter'}
        </p>
      </motion.div>

      {/* ── Boost cards ───────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        gap: 8, padding: '6px 16px 0',
        overflowY: 'auto',
      }}>
        {boosts.map((boost, i) => (
          <BoostCard
            key={boost.id}
            boost={boost}
            onConfirm={onBoostChosen}
            index={i}
          />
        ))}
      </div>

      {/* ── Hint ─────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{
          textAlign: 'center', fontSize: 11,
          color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em',
          padding: '10px 16px 20px', flexShrink: 0,
        }}
      >
        {t?.campfireHint ?? 'TAP A BOON TO ENTER THE LAIR'}
      </motion.p>
    </div>
  )
}
