import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KingdomBackground, KingdomForeground, StrollingKnight } from '../components/KingdomScenery'
import { FlyingCreatures } from '../components/FlyingCreatures'
import { loadPlayerStats, computeNumberRating, clearPlayerStats } from '../game/statsState'
import { getLog } from '../game/runLog'
import { RunLogViewer } from '../components/RunLogViewer'

const BAND_COLOR = {
  strong: '#4ade80',
  mid:    '#fbbf24',
  weak:   '#f87171',
}

const BAND_BG = {
  strong: 'rgba(74,222,128,0.12)',
  mid:    'rgba(251,191,36,0.12)',
  weak:   'rgba(248,113,113,0.12)',
}

// All 11 numbers in a 4-column grid (12 slots, last empty)
const ALL_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function NumberCell({ n, stats, t, isSelected, onClick }) {
  const rating = stats ? computeNumberRating(stats.results) : null

  const pctText  = rating ? `${Math.round(rating.pct * 100)}%` : null
  const timeText = rating
    ? t?.statsMedianTime?.(+(rating.medianMs / 1000).toFixed(1)) ?? `${+(rating.medianMs / 1000).toFixed(1)}s`
    : null

  const bandColor = rating ? BAND_COLOR[rating.band] : 'rgba(255,255,255,0.15)'
  const bandBg    = rating ? BAND_BG[rating.band]    : 'rgba(255,255,255,0.05)'

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{
        aspectRatio: '1',
        borderRadius: 16,
        border: isSelected ? `2.5px solid ${bandColor}` : `2px solid ${bandColor}`,
        background: isSelected ? (rating ? bandBg : 'rgba(255,255,255,0.08)') : bandBg,
        boxShadow: isSelected ? `0 0 14px ${bandColor}` : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: '5px 3px',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 900, color: 'white', lineHeight: 1 }}>{n}</span>

      {rating ? (
        <>
          <span style={{ fontSize: 11, fontWeight: 800, color: bandColor, lineHeight: 1 }}>{pctText}</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.45)', lineHeight: 1 }}>{timeText}</span>
        </>
      ) : (
        <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.28)', textAlign: 'center', lineHeight: 1.2 }}>
          {t?.statsNotEnoughData ?? 'Play more'}
        </span>
      )}
    </motion.button>
  )
}

// Full-screen overlay showing history for a tapped number
function HistoryOverlay({ n, stats, t, onClose }) {
  const entries = stats?.results ? [...stats.results].reverse() : []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        cursor: 'pointer',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1e3a70',
          border: '1.5px solid rgba(255,255,255,0.15)',
          borderRadius: 20,
          padding: '18px 20px',
          width: '100%', maxWidth: 340,
          maxHeight: '72vh',
          display: 'flex', flexDirection: 'column', gap: 10,
          cursor: 'default',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
              padding: '4px 10px', fontSize: 12, fontWeight: 900,
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
            }}
          >✕</button>
        </div>

        {entries.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 12, padding: '12px 0' }}>
            {t?.statsPlayMoreToSee ?? 'play more to see statistics'}
          </p>
        ) : (
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {entries.map((r, i) => (
              <div key={i} dir="ltr" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '5px 8px', borderRadius: 8,
                background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
              }}>
                <span style={{
                  fontSize: 14, fontWeight: 900, lineHeight: 1,
                  color: r.success ? '#4ade80' : '#f87171',
                  width: 16, textAlign: 'center', flexShrink: 0,
                }}>
                  {r.success ? '✓' : '✗'}
                </span>
                {r.a != null && r.b != null ? (
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.8)', lineHeight: 1, minWidth: 56 }}>
                    {r.a} × {r.b}
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1, minWidth: 56 }}>—</span>
                )}
                {/* Only show time for successful answers */}
                {r.success && r.timeMs != null && (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, lineHeight: 1 }}>
                    {(r.timeMs / 1000).toFixed(1)}s
                  </span>
                )}
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 600, marginLeft: 'auto', lineHeight: 1 }}>
                  #{entries.length - i}
                </span>
              </div>
            ))}
          </div>
        )}

      </motion.div>
    </motion.div>
  )
}

export function StatsScreen({ onBack, playerName, difficulty, lang, t }) {
  const isRtl = lang === 'he'
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmReady, setConfirmReady] = useState(false)
  const [statsVersion, setStatsVersion] = useState(0)
  const [showLog, setShowLog] = useState(false)
  const hasLog = getLog().length > 0

  // Android back button — close overlay first, then navigate back
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => {
      if (selectedNumber !== null) { setSelectedNumber(null) }
      else onBack?.()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [selectedNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  const numbersMap = useMemo(() => loadPlayerStats(playerName), [playerName, statsVersion])

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      setConfirmReady(false)
      setTimeout(() => setConfirmReady(true), 1000)
      return
    }
    if (!confirmReady) return  // too fast — ignore accidental double-tap
    clearPlayerStats(playerName)
    setSelectedNumber(null)
    setConfirmClear(false)
    setConfirmReady(false)
    setStatsVersion((v) => v + 1)
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

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', position: 'relative', zIndex: 4 }}>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '0.08em', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {t?.statsTitle ?? 'YOUR NUMBERS'}
          </p>
          {playerName && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4, fontWeight: 600 }}>
              {t?.statsSubtitle ? t.statsSubtitle(playerName) : `${playerName}'s progress`}
            </p>
          )}
        </div>

        {/* 4-column grid for 0–10 (12 slots, last empty) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7, width: '100%', maxWidth: 300 }}>
          {ALL_NUMBERS.map((n, i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <NumberCell
                n={n}
                stats={numbersMap[String(n)]}
                t={t}
                isSelected={selectedNumber === n}
                onClick={() => setSelectedNumber((prev) => prev === n ? null : n)}
              />
            </motion.div>
          ))}
          <div /> {/* empty 12th slot */}
        </div>

        {/* Hint */}
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontWeight: 600, letterSpacing: '0.06em' }}>
          {t?.statsTapToSee ?? 'TAP A NUMBER TO SEE HISTORY'}
        </p>

        {/* Legend — dot position respects RTL (dot on right in Hebrew) */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {(['strong', 'mid', 'weak']).map((band) => (
            <span key={band} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              flexDirection: 'row',
              fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: BAND_COLOR[band], display: 'inline-block', flexShrink: 0 }} />
              {band === 'strong'
                ? (t?.statsLegendStrong ?? 'strong')
                : band === 'mid'
                  ? (t?.statsLegendMid ?? 'getting there')
                  : (t?.statsLegendWeak ?? 'needs work')}
            </span>
          ))}
        </div>

        {/* View log button */}
        {hasLog && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowLog(true)}
            style={{
              padding: '8px 20px', borderRadius: 10,
              border: 'none', borderBottom: '4px solid #ca8a04',
              background: '#facc15', color: '#000',
              fontWeight: 900, fontSize: 11, cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
          >
            {t?.optionsViewLog ?? 'VIEW GAME LOG'}
          </motion.button>
        )}

        {/* Clear stats button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            onBlur={() => { setConfirmClear(false); setConfirmReady(false) }}
            style={{
              border: 'none',
              borderBottom: `4px solid ${confirmClear ? '#b91c1c' : '#ca8a04'}`,
              background: confirmClear ? '#ef4444' : '#facc15',
              borderRadius: 10, padding: '6px 18px',
              fontSize: 11, fontWeight: 900, letterSpacing: '0.1em',
              color: confirmClear ? (confirmReady ? '#fff' : 'rgba(255,255,255,0.5)') : '#000',
              cursor: confirmClear && !confirmReady ? 'default' : 'pointer',
              transition: 'all 0.2s',
              opacity: confirmClear && !confirmReady ? 0.6 : 1,
            }}
          >
            {confirmClear ? (t?.confirmClearStats ?? '⚠ YES, CLEAR HISTORY') : (t?.clearStats ?? 'CLEAR HISTORY')}
          </motion.button>
          {confirmClear && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 10, color: '#f87171', fontWeight: 700, textAlign: 'center', maxWidth: 240 }}
            >
              {t?.clearStatsWarning ?? 'This will permanently delete your entire practice history. This cannot be undone.'}
            </motion.p>
          )}
        </div>

      </div>

      {/* History overlay — rendered outside the scrollable panel so it covers everything */}
      <AnimatePresence>
        {selectedNumber !== null && (
          <HistoryOverlay
            key={selectedNumber}
            n={selectedNumber}
            stats={numbersMap[String(selectedNumber)]}
            t={t}
            onClose={() => setSelectedNumber(null)}
          />
        )}
        {showLog && <RunLogViewer onClose={() => setShowLog(false)} />}
      </AnimatePresence>
    </div>
  )
}
