import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getLog } from '../game/runLog'

const TYPE_META = {
  battle_start: { icon: '⚔',  color: '#fbbf24' },
  question:     { icon: '?',   color: '#93c5fd' },
  correct:      { icon: '✓',   color: '#4ade80' },
  wrong:        { icon: '✗',   color: '#f87171' },
  timeout:      { icon: '⏱',   color: '#fb923c' },
  player_hit:   { icon: '💥',  color: '#f87171' },
  enemy_hit:    { icon: '⚡',  color: '#c084fc' },
  shield_hit:   { icon: '🛡',  color: '#93c5fd' },
  battle_won:   { icon: '🏆',  color: '#fbbf24' },
  battle_lost:  { icon: '☠',   color: '#94a3b8' },
}

function entryText(e) {
  switch (e.type) {
    case 'battle_start': return `${e.world}  ·  ${e.enemy} (HP ${e.enemyHp})  ·  Battle ${e.battle}`
    case 'question':     return `${e.q} = ?`
    case 'correct':      return `${e.selected}${e.timeBonus > 0 ? `  (+${e.timeBonus} pts)` : ''}`
    case 'wrong':        return `${e.selected}  ←  correct: ${e.correct}`
    case 'timeout':      return `Time out  —  correct: ${e.correct}`
    case 'player_hit':   return `Player  ${e.prevHp} → ${e.playerHp} HP`
    case 'enemy_hit':    return `Enemy  ${e.prevHp} → ${e.enemyHp}/${e.enemyMaxHp} HP`
    case 'shield_hit':   return `Shield crack  ${e.streak}/2`
    case 'battle_won':   return `Won — ${e.trophy}  (${e.mistakes} mistake${e.mistakes !== 1 ? 's' : ''})`
    case 'battle_lost':  return `Defeated  (${e.mistakes} mistake${e.mistakes !== 1 ? 's' : ''})`
    default:             return e.type
  }
}

export function RunLogViewer({ onClose, battleOnly = false }) {
  const fullLog = getLog()
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [])

  // Android / browser back button closes the viewer
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => onClose()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onClose])

  // If battleOnly, slice to everything from the last battle_start
  const lastBattleIdx = battleOnly
    ? [...fullLog].map((e, i) => e.type === 'battle_start' ? i : -1).filter(i => i >= 0).at(-1) ?? 0
    : 0
  const log = battleOnly ? fullLog.slice(lastBattleIdx) : fullLog

  // Annotate each entry with seconds elapsed since the nearest preceding battle_start
  let battleStartTs = log[0]?.ts ?? Date.now()
  const entries = log.map((entry) => {
    if (entry.type === 'battle_start') battleStartTs = entry.ts
    return { ...entry, relMs: entry.ts - battleStartTs }
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.93)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'ui-monospace, monospace',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 900, color: '#fbbf24', letterSpacing: '0.16em' }}>
          {battleOnly ? 'BATTLE LOG' : 'RUN LOG'}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em' }}>
          {entries.length} events · tap outside to close
        </span>
      </div>

      {/* Entries */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '4px 0 32px' }}
      >
        {entries.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.22)', fontSize: 13, marginTop: 56 }}>
            No events yet — start a battle first.
          </p>
        ) : entries.map((entry, i) => {
          const meta = TYPE_META[entry.type] ?? { icon: '·', color: '#888' }
          const isSep = entry.type === 'battle_start'
          return (
            <div
              key={i}
              style={{
                padding: isSep ? '14px 16px 4px' : '2px 16px',
                borderTop: isSep && i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                marginTop: isSep && i > 0 ? 8 : 0,
              }}
            >
              {isSep ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13 }}>{meta.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: meta.color, letterSpacing: '0.03em' }}>
                    {entryText(entry)}
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.20)', minWidth: 32, textAlign: 'right' }}>
                    +{Math.floor(entry.relMs / 1000)}s
                  </span>
                  <span style={{ fontSize: 11, width: 16, textAlign: 'center', flexShrink: 0 }}>
                    {meta.icon}
                  </span>
                  <span style={{ fontSize: 12, color: meta.color, lineHeight: 1.55 }}>
                    {entryText(entry)}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
