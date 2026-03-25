import { useState, useRef, useMemo, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { KingdomBackground, KingdomForeground, StrollingKnight } from '../components/KingdomScenery'
import { FlyingCreatures } from '../components/FlyingCreatures'
import { loadPlayerStats, computeNumberRating } from '../game/statsState'

const MAX_SELECTED = 4

export function PracticePickerScreen({ onStart, onBack, difficulty, playerName, lang, t }) {
  const [selected, setSelected] = useState([])
  const shakeRefs = useRef({})

  const isRtl = lang === 'he'

  // Load rating for each number (computed once on mount)
  const ratings = useMemo(() => {
    const numbersMap = loadPlayerStats(playerName)
    const result = {}
    for (let n = 1; n <= 9; n++) {
      const stats = numbersMap[String(n)]
      result[n] = stats ? computeNumberRating(stats.results) : null
    }
    return result
  }, [playerName])

  // Numbers sorted by rating ascending (weakest first) that have enough data
  const recommended = useMemo(() => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .filter((n) => ratings[n] !== null && ratings[n].band !== 'strong')
      .sort((a, b) => ratings[a].rating - ratings[b].rating)
      .slice(0, 3)
  }, [ratings])

  // Android back button → same as ✕
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => onBack?.()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        paddingTop: 60,
        paddingBottom: 190,
        justifyContent: 'flex-start',
      }}
    >
      <FlyingCreatures difficulty={difficulty} />
      <KingdomBackground />
      <StrollingKnight />
      <KingdomForeground difficulty={difficulty} />

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute', top: 16, left: 16, zIndex: 5,
          background: 'rgba(0,0,0,0.35)', border: '1.5px solid rgba(255,255,255,0.18)',
          borderRadius: 8, padding: '5px 12px',
          fontSize: 13, fontWeight: 900, color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer', letterSpacing: '0.04em',
        }}
      >
        ✕
      </button>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', position: 'relative', zIndex: 4 }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '0.08em', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {t?.practicePickerTitle ?? 'Choose Numbers to Practice'}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4, fontWeight: 600 }}>
            {t?.practicePickerSubtitle ?? 'Select up to 4'}
          </p>
        </div>

        {/* 3×3 grid of numbers 1–9 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, width: '100%', maxWidth: 260 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <NumberButton
              key={n}
              n={n}
              isSelected={selected.includes(n)}
              isRecommended={recommended.includes(n)}
              onTap={handleTap}
              t={t}
            />
          ))}
        </div>

        {/* ★ legend — only when there are recommended numbers */}
        {recommended.length > 0 && (
          <p style={{ fontSize: 11, color: 'rgba(147,197,253,0.7)', fontWeight: 600, textAlign: 'center', marginTop: -6 }}>
            ★ {t?.practiceRecommended ?? 'recommended for you'}
          </p>
        )}

        {/* Start button */}
        <motion.button
          whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
          onClick={() => selected.length > 0 && onStart(selected)}
          disabled={selected.length === 0}
          style={{
            width: '100%', maxWidth: 260, height: 52,
            background: selected.length > 0 ? '#fbbf24' : 'rgba(255,255,255,0.12)',
            border: selected.length > 0 ? '0 solid transparent' : '1.5px solid rgba(255,255,255,0.2)',
            borderBottom: selected.length > 0 ? '4px solid #d97706' : undefined,
            borderRadius: 16, cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
            fontSize: 16, fontWeight: 900, letterSpacing: '0.1em',
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

function NumberButton({ n, isSelected, isRecommended, onTap, t }) {
  const controls = useAnimation()

  return (
    <motion.button
      animate={controls}
      whileTap={{ scale: 0.9 }}
      onClick={() => onTap(n, controls)}
      style={{
        aspectRatio: '1',
        borderRadius: 14,
        fontSize: 22,
        fontWeight: 900,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        border: isSelected
          ? '3px solid #d97706'
          : isRecommended
            ? '2px solid rgba(147,197,253,0.55)'
            : '2px solid rgba(255,255,255,0.25)',
        background: isSelected
          ? '#fbbf24'
          : isRecommended
            ? 'rgba(96,165,250,0.12)'
            : 'rgba(0,0,0,0.35)',
        color: isSelected ? '#1a1a2e' : 'rgba(255,255,255,0.9)',
        boxShadow: isSelected
          ? '0 4px 0 #92400e, 0 0 16px rgba(251,191,36,0.3)'
          : isRecommended
            ? '0 2px 0 rgba(0,0,0,0.4), 0 0 14px rgba(96,165,250,0.35)'
            : '0 2px 0 rgba(0,0,0,0.4)',
        transition: 'background 0.15s, border 0.15s, color 0.15s, box-shadow 0.15s',
      }}
    >
      <span style={{ lineHeight: 1 }}>{n}</span>
      {isRecommended && !isSelected && (
        <span style={{ fontSize: 10, color: 'rgba(147,197,253,0.9)', lineHeight: 1 }}>★</span>
      )}
    </motion.button>
  )
}
