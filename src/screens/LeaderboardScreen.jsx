import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { saveScore, loadScores, clearScores } from '../game/scoreState'

const DIFFS = ['easy', 'medium', 'hard']
const DIFF_LABEL_DEFAULT = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const DIFF_COLOR = { easy: '#4ade80', medium: '#fbbf24', hard: '#ef4444' }

const WORLD_ID_BY_NAME = {
  'Forest': 'forest', 'Swamp': 'swamp', 'Mountains': 'mountains',
  'Castle': 'castle', 'Dragon Lair': 'dragonLair',
}
const worldDisplayName = (name, t) => (t?.worldName?.[WORLD_ID_BY_NAME[name]]) ?? name

const NAME_KEY = 'numknight_player_name'

const PEEK = 18  // px of adjacent card visible on each side
const GAP = 10   // px gap between cards

// Pill indicator — 5-slot virtual track (same infinite-carousel trick as main cards)
const PILL_W = 84
const PILL_GAP = 8
const PILL_SIDE_VISIBLE = 50  // px of ±1 slot shown on each side
const PILL_CONTAINER_W = PILL_W + 2 * (PILL_GAP + PILL_SIDE_VISIBLE)  // 200px
const PILL_BASE_X = (PILL_CONTAINER_W - PILL_W) / 2 - 2 * (PILL_W + PILL_GAP)  // centers slot[2]

export function LeaderboardScreen({ totalScore, endWorld, cleared, difficulty, playerName, onBack, lang, t }) {
  const isRtl = lang === 'he'

  const [[allScores, newScoreIndex]] = useState(() => {
    const name = playerName || localStorage.getItem(NAME_KEY) || ''
    if (name) localStorage.setItem(NAME_KEY, name)
    if (totalScore > 0) {
      saveScore(difficulty, {
        name,
        score: totalScore,
        date: new Date().toLocaleDateString(),
        endWorld,
        cleared,
        version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '',
      })
    }
    const scores = {
      easy: loadScores('easy'),
      medium: loadScores('medium'),
      hard: loadScores('hard'),
    }
    const idx = totalScore > 0
      ? scores[difficulty].findIndex(e => e.score === totalScore && e.endWorld === endWorld && e.cleared === cleared)
      : -1
    return [scores, idx]
  })

  const [displayScores, setDisplayScores] = useState(allScores)
  const [viewIndex, setViewIndex] = useState(DIFFS.indexOf(difficulty))
  const viewDiff = DIFFS[viewIndex]

  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(() => Math.min(window.innerWidth, 448))
  const [animated, setAnimated] = useState(true)

  // Pill indicator state — pillIndex lags viewIndex so content holds during slide animation
  const [pillIndex, setPillIndex] = useState(DIFFS.indexOf(difficulty))
  const [pillExtraX, setPillExtraX] = useState(0)
  const [pillAnimated, setPillAnimated] = useState(true)
  const animatingRef = useRef(false)

  useEffect(() => {
    if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
  }, [])

  const [clearConfirm, setClearConfirm] = useState(false)
  useEffect(() => { setClearConfirm(false) }, [viewIndex])

  // Circular navigation — pills animate like the main carousel, both run simultaneously
  const goTo = (next) => {
    if (next === viewIndex || animatingRef.current) return
    animatingRef.current = true

    const rawDiff = (next - viewIndex + 3) % 3
    const pillDir = rawDiff === 1 ? -1 : 1  // -1 slides left (forward), +1 slides right (back)

    // Main carousel: update immediately (handles its own wrap detection)
    const wrapping = (viewIndex === 0 && next === 2) || (viewIndex === 2 && next === 0)
    setAnimated(!wrapping)
    setViewIndex(next)

    // Pill indicator: animate track, then snap content
    setPillAnimated(true)
    setPillExtraX(pillDir * (PILL_W + PILL_GAP))
    setTimeout(() => {
      setPillAnimated(false)
      setPillExtraX(0)
      setPillIndex(next)
      requestAnimationFrame(() => {
        setPillAnimated(true)
        animatingRef.current = false
      })
    }, 290)
  }

  // Touch swipe on outer div so whole screen is swipeable
  const touchStartX = useRef(null)
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) {
      if (dx < 0) goTo((viewIndex + 1) % 3)
      if (dx > 0) goTo((viewIndex + 2) % 3)
    }
    touchStartX.current = null
  }

  // Android back
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => { onBack() }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onBack])

  const handleClear = () => {
    if (!clearConfirm) { setClearConfirm(true); return }
    clearScores(viewDiff)
    setDisplayScores(prev => ({ ...prev, [viewDiff]: [] }))
    setClearConfirm(false)
  }

  const cardWidth = containerWidth - 2 * PEEK
  const trackX = PEEK - viewIndex * (cardWidth + GAP)
  const pillTrackX = PILL_BASE_X + pillExtraX

  const diffLabels = t?.diffLabel ?? DIFF_LABEL_DEFAULT

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col h-dvh max-w-md mx-auto py-5 gap-4"
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.12) 0%, transparent 65%), ' +
          'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}
      >
        <p className="text-white font-black text-3xl tracking-wide">{t?.hallOfFameTitle ?? 'HALL OF FAME'}</p>

        {/* Pill indicator — 5-slot virtual track, same infinite-carousel trick as main cards */}
        <div style={{
          width: PILL_CONTAINER_W,
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)',
        }}>
          <div style={{
            display: 'flex',
            direction: 'ltr',
            gap: PILL_GAP,
            transform: `translateX(${pillTrackX}px)`,
            transition: pillAnimated ? 'transform 0.28s ease' : 'none',
          }}>
            {[-2, -1, 0, 1, 2].map((offset) => {
              const diffIdx = (pillIndex + offset + 300) % 3
              const isActive = offset === 0
              return (
                <button
                  key={offset}
                  onClick={isActive ? undefined : () => goTo(diffIdx)}
                  style={{
                    width: PILL_W,
                    flexShrink: 0,
                    background: DIFF_COLOR[DIFFS[diffIdx]],
                    color: '#000',
                    borderRadius: 99,
                    padding: '4px 0',
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    opacity: isActive ? 1 : 0.68,
                    transform: `scale(${isActive ? 1 : 0.88})`,
                    transition: 'opacity 0.28s, transform 0.28s',
                    cursor: isActive ? 'default' : 'pointer',
                    border: 'none',
                    textAlign: 'center',
                  }}
                >
                  {diffLabels[DIFFS[diffIdx]] ?? DIFFS[diffIdx]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 5 }}>
          {DIFFS.map((_, i) => (
            <div key={i} style={{
              width: i === viewIndex ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: i === viewIndex ? DIFF_COLOR[DIFFS[i]] : 'rgba(255,255,255,0.22)',
              transition: 'width 0.25s, background 0.25s',
            }} />
          ))}
        </div>
      </motion.div>

      {/* Carousel — flex:1 so back button stays pinned at bottom */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
      >
        <div style={{
          display: 'flex',
          direction: 'ltr',
          gap: GAP,
          transform: `translateX(${trackX}px)`,
          transition: animated ? 'transform 0.3s ease' : 'none',
          alignItems: 'flex-start',
        }}>
          {DIFFS.map((d) => {
            const scores = displayScores[d]
            return (
              <div key={d} dir={isRtl ? 'rtl' : 'ltr'} style={{ width: cardWidth, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                {/* Score rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {Array.from({ length: 3 }, (_, i) => {
                    const entry = scores[i] ?? null
                    const isNew = entry && d === difficulty && i === newScoreIndex
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: isRtl ? 18 : -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.18 + i * 0.04 }}
                        style={{
                          background: isNew ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.04)',
                          border: `${isNew ? 2 : 1}px solid ${isNew ? 'rgba(251,191,36,0.75)' : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: 12,
                          padding: isNew ? '13px 14px' : '10px 14px',
                          display: 'flex', alignItems: 'center', gap: 10,
                          transform: isNew ? 'scale(1.025)' : 'scale(1)',
                          transformOrigin: 'center',
                          boxShadow: isNew ? '0 0 18px rgba(251,191,36,0.22)' : 'none',
                        }}
                      >
                        <span style={{
                          fontSize: isNew ? 15 : 13,
                          width: 26, textAlign: 'center',
                          color: isNew ? '#fbbf24' : 'rgba(255,255,255,0.25)',
                          fontWeight: 900, flexShrink: 0,
                        }}>
                          {i + 1}
                        </span>
                        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {entry ? (
                            <>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                                <span style={{
                                  color: isNew ? '#fff' : 'rgba(255,255,255,0.85)',
                                  fontWeight: isNew ? 900 : 700, fontSize: isNew ? 15 : 14,
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                  flex: 1, minWidth: 0,
                                }}>
                                  {entry.name}
                                </span>
                                {isNew && (
                                  <span style={{
                                    flexShrink: 0, fontSize: 9, fontWeight: 900, letterSpacing: '0.12em',
                                    background: '#fbbf24', color: '#000',
                                    borderRadius: 4, padding: '1px 5px',
                                  }}>
                                    {t?.newBadge ?? 'NEW'}
                                  </span>
                                )}
                              </span>
                              {entry.version && (
                                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', fontWeight: 600, letterSpacing: '0.08em' }}>
                                  v{entry.version}
                                </span>
                              )}
                            </>
                          ) : (
                            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 13, fontWeight: 700 }}>—</span>
                          )}
                        </span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                          color: entry?.cleared ? '#fbbf24' : 'rgba(255,255,255,0.18)',
                          flexShrink: 0, minWidth: 60, textAlign: 'center',
                        }}>
                          {entry
                            ? (entry.cleared ? (t?.conquered ?? 'CONQUERED') : (t?.fellAtShort ? t.fellAtShort(worldDisplayName(entry.endWorld ?? '', t)) : (entry.endWorld ?? '')))
                            : '—'}
                        </span>
                        <span style={{
                          color: isNew ? '#fbbf24' : entry ? 'rgba(251,191,36,0.85)' : 'rgba(255,255,255,0.12)',
                          fontWeight: 900, fontSize: isNew ? 18 : 16,
                          flexShrink: 0, minWidth: 40, textAlign: 'right',
                        }}>
                          {entry ? entry.score.toLocaleString() : '—'}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Clear button — more top margin, shorter padding */}
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                  <motion.button
                    onClick={d === viewDiff ? handleClear : undefined}
                    onBlur={() => setClearConfirm(false)}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '5px 14px', borderRadius: 10, cursor: 'pointer',
                      fontSize: 11, fontWeight: 900, letterSpacing: '0.06em',
                      border: `1.5px solid ${clearConfirm && d === viewDiff ? 'rgba(239,68,68,0.8)' : 'rgba(255,255,255,0.14)'}`,
                      background: clearConfirm && d === viewDiff ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.06)',
                      color: clearConfirm && d === viewDiff ? '#ef4444' : 'rgba(255,255,255,0.30)',
                      transition: 'all 0.18s',
                    }}
                  >
                    {clearConfirm && d === viewDiff ? (t?.confirmClear ?? '⚠ YES, ERASE ALL') : (t?.clearBoard ?? 'Clear all scores')}
                  </motion.button>
                  {clearConfirm && d === viewDiff && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, textAlign: 'center' }}
                    >
                      {t?.clearWarning ?? '⚠ This will permanently erase all scores'}
                    </motion.p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Back button — pinned at bottom by the flex:1 carousel above */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={onBack}
        style={{ flexShrink: 0, marginLeft: 16, marginRight: 16 }}
        className="bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-14 shadow-xl cursor-pointer tracking-widest"
      >
        {t?.back ?? 'BACK'}
      </motion.button>
    </div>
  )
}
