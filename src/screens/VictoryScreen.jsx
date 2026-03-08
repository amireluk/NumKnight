import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { KnightBodySVG, KnightSwordArmSVG } from '../components/KnightCharacter'

const CONFETTI_COLORS = ['#fbbf24', '#f59e0b', '#fde68a', '#86efac', '#93c5fd', '#f9a8d4', '#c084fc', '#fff']

function ConfettiRain() {
  const particles = useMemo(() =>
    Array.from({ length: 48 }, (_, i) => ({
      id: i,
      leftPct: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 2.8 + Math.random() * 2.2,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      w: 6 + Math.random() * 7,
      h: 4 + Math.random() * 5,
      isRect: Math.random() > 0.35,
      rotateEnd: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360),
      xEnd: (Math.random() - 0.5) * 80,
    })), [])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 2 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: -24, rotate: 0, opacity: 0 }}
          animate={{ x: p.xEnd, y: '108vh', rotate: p.rotateEnd, opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, repeatDelay: Math.random() * 1.5, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: `${p.leftPct}%`,
            top: 0,
            width: p.isRect ? p.w * 1.5 : p.w,
            height: p.isRect ? p.h : p.w,
            borderRadius: p.isRect ? 2 : '50%',
            background: p.color,
          }}
        />
      ))}
    </div>
  )
}

function animateCount(from, to, ms, onTick, onDone) {
  const steps = Math.max(1, Math.ceil(ms / 16))
  let step = 0
  let raf
  const tick = () => {
    step++
    const t2 = Math.min(step / steps, 1)
    const ease = 1 - Math.pow(1 - t2, 3)
    onTick(Math.round(from + (to - from) * ease))
    if (t2 < 1) { raf = requestAnimationFrame(tick) } else { onDone?.() }
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

export function VictoryScreen({ playerName, totalScore, onContinue, lang, t }) {
  const isRtl = lang === 'he'
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const line1 = t?.victoryLine1 ?? 'REALM'
  const line2 = t?.victoryLine2 ?? 'CONQUERED'

  // Letter delays: line1 then line2
  const line1Delays = line1.split('').map((_, i) => 0.5 + i * 0.07)
  const line2Delays = line2.split('').map((_, i) => 0.5 + line1.length * 0.07 + 0.12 + i * 0.07)
  const titleDone = 0.5 + (line1.length + line2.length) * 0.07 + 0.12

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowScore(true)
      const cancel = animateCount(0, totalScore, 1400, setScoreDisplay, () => {
        const t2 = setTimeout(() => setShowButton(true), 400)
        return () => clearTimeout(t2)
      })
      return cancel
    }, titleDone * 1000 + 400)
    return () => clearTimeout(t1)
  }, [totalScore]) // eslint-disable-line react-hooks/exhaustive-deps

  const letterStyle = {
    fontSize: 32,
    fontWeight: 900,
    color: '#fbbf24',
    display: 'inline-block',
    filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.7))',
    letterSpacing: '0.08em',
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        maxWidth: 448,
        margin: '0 auto',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at 50% 55%, rgba(251,191,36,0.2) 0%, transparent 58%), ' +
          'linear-gradient(to bottom, #050810, #0d1424)',
      }}
    >
      <ConfettiRain />

      {/* Gold glow — absolute, never affects layout */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 260, height: 260,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(251,191,36,0.28) 0%, transparent 68%)',
        pointerEvents: 'none',
        zIndex: 3,
      }} />

      {/* Knight */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.75 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 4,
          filter: 'drop-shadow(0 0 22px rgba(251,191,36,0.55))',
          marginBottom: 6,
          height: 116, // fixed height — never shifts
          display: 'flex', alignItems: 'flex-end',
        }}
      >
        <div style={{
          position: 'relative',
          width: 84, height: 112,
          overflow: 'visible',
          transform: 'scale(1.9) scaleX(-1)',
          transformOrigin: 'center bottom',
        }}>
          <KnightBodySVG />
          <div style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', transformOrigin: '73px 58px' }}>
            <KnightSwordArmSVG />
          </div>
        </div>
      </motion.div>

      {/* Title — always in DOM, letters animate in */}
      <div style={{ zIndex: 4, textAlign: 'center', lineHeight: 1.1, marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {line1.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: line1Delays[i], type: 'spring', stiffness: 320, damping: 18 }}
              style={letterStyle}
            >
              {ch}
            </motion.span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {line2.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: line2Delays[i], type: 'spring', stiffness: 320, damping: 18 }}
              style={letterStyle}
            >
              {ch}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Subtitle — always in DOM */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: titleDone + 0.1 }}
        style={{
          zIndex: 4,
          fontSize: 13,
          color: 'rgba(255,255,255,0.45)',
          fontWeight: 700,
          letterSpacing: '0.12em',
          marginTop: 10,
          textAlign: 'center',
          paddingLeft: 24,
          paddingRight: 24,
          height: 20, // fixed height
        }}
      >
        {t?.victorySubtitle ? t.victorySubtitle(playerName) : (playerName ? `${playerName} — your legend is written` : 'Your legend is written')}
      </motion.p>

      {/* Score box — always in DOM, fades in */}
      <motion.div
        animate={{ opacity: showScore ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          zIndex: 4,
          marginTop: 28,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(251,191,36,0.28)',
          borderRadius: 16,
          padding: '12px 40px',
          textAlign: 'center',
          minWidth: 180,
        }}
      >
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.22em', marginBottom: 4 }}>
          {t?.finalScore ?? 'FINAL SCORE'}
        </div>
        <div style={{ fontSize: 38, fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>
          {scoreDisplay.toLocaleString()}
        </div>
      </motion.div>

      {/* CTA button — always in DOM, fades in */}
      <motion.button
        animate={{ opacity: showButton ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        whileTap={showButton ? { scale: 0.95 } : {}}
        whileHover={showButton ? { scale: 1.04 } : {}}
        onClick={showButton ? onContinue : undefined}
        style={{
          zIndex: 4,
          marginTop: 28,
          marginLeft: 24,
          marginRight: 24,
          alignSelf: 'stretch',
          height: 56,
          borderRadius: 18,
          background: '#fbbf24',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: '4px solid #b45309',
          color: '#000',
          fontWeight: 900,
          fontSize: 17,
          letterSpacing: '0.08em',
          cursor: showButton ? 'pointer' : 'default',
          boxShadow: '0 0 28px rgba(251,191,36,0.35)',
          pointerEvents: showButton ? 'auto' : 'none',
        }}
      >
        {t?.hallOfFame ?? 'ENTER THE HALL OF FAME'}
      </motion.button>
    </div>
  )
}
