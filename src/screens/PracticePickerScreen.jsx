import { useState, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { KingdomBackground, KingdomForeground, StrollingKnight } from '../components/KingdomScenery'

const MAX_SELECTED = 4

export function PracticePickerScreen({ onStart, onBack, lang, t }) {
  const [selected, setSelected] = useState([])
  // Map from number → shake animation controls
  const shakeRefs = useRef({})

  const isRtl = lang === 'he'

  const getShake = (n) => {
    if (!shakeRefs.current[n]) shakeRefs.current[n] = null
    return shakeRefs.current[n]
  }

  const handleTap = (n, controls) => {
    if (selected.includes(n)) {
      setSelected(selected.filter((x) => x !== n))
    } else if (selected.length >= MAX_SELECTED) {
      controls.start({ x: [0, -8, 8, -6, 6, -3, 0], transition: { duration: 0.35 } })
    } else {
      setSelected([...selected, n])
    }
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col items-center h-dvh max-w-md mx-auto px-6 select-none"
      style={{
        background: 'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 80,
        paddingBottom: 210,
        justifyContent: 'flex-start',
      }}
    >
      <KingdomBackground />
      <StrollingKnight />
      <KingdomForeground />

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute', top: 16, left: 16, zIndex: 2,
          background: 'rgba(0,0,0,0.35)', border: '1.5px solid rgba(255,255,255,0.18)',
          borderRadius: 8, padding: '5px 12px',
          fontSize: 13, fontWeight: 900, color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer', letterSpacing: '0.04em',
        }}
      >
        ✕
      </button>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '0.08em', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {t?.practicePickerTitle ?? 'Choose Numbers to Practice'}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, fontWeight: 600 }}>
            {t?.practicePickerSubtitle ?? 'Select up to 4'}
          </p>
        </div>

        {/* 3×3 grid of numbers 1–9 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', maxWidth: 300 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <NumberButton
              key={n}
              n={n}
              isSelected={selected.includes(n)}
              onTap={handleTap}
            />
          ))}
        </div>

        {/* Selection count indicator */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.06em' }}>
          {selected.length} / {MAX_SELECTED}
        </p>

        {/* Start button */}
        <motion.button
          whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
          onClick={() => selected.length > 0 && onStart(selected)}
          disabled={selected.length === 0}
          style={{
            width: '100%', maxWidth: 300, height: 60,
            background: selected.length > 0 ? '#fbbf24' : 'rgba(255,255,255,0.12)',
            border: selected.length > 0 ? '0 solid transparent' : '1.5px solid rgba(255,255,255,0.2)',
            borderBottom: selected.length > 0 ? '4px solid #d97706' : undefined,
            borderRadius: 18, cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
            fontSize: 18, fontWeight: 900, letterSpacing: '0.1em',
            color: selected.length > 0 ? '#1a1a2e' : 'rgba(255,255,255,0.35)',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {t?.practiceStartBtn ?? 'START PRACTICE'}
        </motion.button>
      </div>
    </div>
  )
}

function NumberButton({ n, isSelected, onTap }) {
  const controls = useAnimation()

  return (
    <motion.button
      animate={controls}
      whileTap={{ scale: 0.9 }}
      onClick={() => onTap(n, controls)}
      style={{
        aspectRatio: '1',
        borderRadius: 16,
        fontSize: 28,
        fontWeight: 900,
        cursor: 'pointer',
        border: isSelected ? '3px solid #fbbf24' : '2px solid rgba(255,255,255,0.2)',
        background: isSelected ? 'rgba(251,191,36,0.22)' : 'rgba(255,255,255,0.08)',
        color: isSelected ? '#fbbf24' : 'rgba(255,255,255,0.75)',
        boxShadow: isSelected ? '0 0 16px rgba(251,191,36,0.35)' : 'none',
        transition: 'background 0.15s, border 0.15s, color 0.15s, box-shadow 0.15s',
      }}
    >
      {n}
    </motion.button>
  )
}
