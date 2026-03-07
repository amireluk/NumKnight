import { useState, useEffect, useRef, useCallback } from 'react'
import { BattleBackground } from '../components/BattleBackground'
import { KnightCharacter, FallenKnightScene } from '../components/KnightCharacter'
import { EnemyCharacter } from '../components/EnemyCharacter'
import { StartScreen } from './StartScreen'
import { WorldMapScreen, REGION_STRIPS } from './WorldMapScreen'
import { AreaClearedScreen, WORLD_SCENES } from './AreaClearedScreen'
import { ResultScreen } from './ResultScreen'
import { LeaderboardScreen } from './LeaderboardScreen'
import { BattleScreen } from './BattleScreen'
import { MEDIUM } from '../game/campaign.config'
import { T } from '../game/i18n'

// ── Shared constants ──────────────────────────────────────────────────────────

const WORLDS = MEDIUM
const NOOP   = () => {}
const EN     = T.en

// ── Slide wrapper components ──────────────────────────────────────────────────

// Full-screen battle background only
function BgSlide({ worldId }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <BattleBackground worldId={worldId} />
    </div>
  )
}

// World-map panoramic strip, centred on a dark canvas
function StripSlide({ worldId }) {
  const Strip = REGION_STRIPS[worldId]
  return (
    <div style={{
      width: '100%', height: '100%', background: '#111',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 16,
    }}>
      <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.7)' }}>
        <Strip />
      </div>
      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.12em' }}>
        WORLD MAP STRIP · 360 × 100
      </span>
    </div>
  )
}

// Area-cleared scene illustration, centred on a dark canvas
function SceneSlide({ worldId }) {
  const Scene = WORLD_SCENES[worldId]
  return (
    <div style={{
      width: '100%', height: '100%', background: '#111',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24,
    }}>
      <div style={{ width: '80%', maxWidth: 280, borderRadius: 18, overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.7)' }}>
        <Scene />
      </div>
      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.12em' }}>
        AREA CLEARED SCENE · 200 × 140
      </span>
    </div>
  )
}

// Battle background + idle knight + idle enemy
function ArenaSlide({ world }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <BattleBackground worldId={world.id} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        paddingBottom: '18%', paddingLeft: '6%', paddingRight: '6%',
      }}>
        <KnightCharacter phase="idle" hitKey={0} />
        <EnemyCharacter phase="idle" enemy={world.enemy} hitKey={0} />
      </div>
    </div>
  )
}

// Knight + enemy: character centred on its world's battle background
function CharSlide({ worldId, children }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <BattleBackground worldId={worldId} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        paddingBottom: '22%',
      }}>
        {children}
      </div>
    </div>
  )
}

// Knight fallen scene centred on a blue background
function FallenSlide() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <FallenKnightScene />
    </div>
  )
}

// Knight that cycles idle → attacking → idle
function CyclingKnight() {
  const [phase, setPhase] = useState('idle')
  useEffect(() => {
    let t
    const cycle = () => {
      setPhase('attacking')
      t = setTimeout(() => { setPhase('idle'); t = setTimeout(cycle, 1800) }, 700)
    }
    t = setTimeout(cycle, 600)
    return () => clearTimeout(t)
  }, [])
  return <KnightCharacter phase={phase} hitKey={0} />
}

// Enemy that cycles idle → attacking → idle
function CyclingEnemy({ enemy }) {
  const [phase, setPhase] = useState('idle')
  const [hitKey, setHitKey] = useState(0)
  useEffect(() => {
    let t
    const cycle = () => {
      setPhase('attacking')
      setHitKey(k => k + 1)
      t = setTimeout(() => { setPhase('idle'); t = setTimeout(cycle, 2200) }, 800)
    }
    t = setTimeout(cycle, 1000)
    return () => clearTimeout(t)
  }, [])
  return <EnemyCharacter phase={phase} enemy={enemy} hitKey={hitKey} />
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const TROPHIES_NONE = []
const TROPHIES_2W   = ['gold', 'silver', 'bronze', 'gold', 'gold', 'silver']
const TROPHIES_4W   = ['gold','silver','gold', 'gold','gold','silver', 'gold','gold','gold', 'silver','gold','gold']

const mockMap = (idx, trophies, scores) => ({
  worlds: WORLDS, currentWorldIndex: idx,
  trophies, worldScores: scores,
  isTransition: false, difficulty: 'medium',
  onFight: NOOP, onRestart: NOOP, lang: 'en', t: EN,
})

const mockCleared = (worldIdx, worldTrophies, worldScore, totalScore) => ({
  world: WORLDS[worldIdx], worldTrophies, worldScore, totalScore,
  onContinue: NOOP, lang: 'en', t: EN,
})

// ── Slides registry ───────────────────────────────────────────────────────────

const SLIDES = [
  // ── Backgrounds: battle full-screen ──────────────────────────────
  ...WORLDS.map(w => ({
    id: `bg-battle-${w.id}`, category: 'bg', label: `${w.name} · Battle BG`,
    render: () => <BgSlide worldId={w.id} />,
  })),
  // ── Backgrounds: world-map strips ────────────────────────────────
  ...WORLDS.map(w => ({
    id: `bg-strip-${w.id}`, category: 'bg', label: `${w.name} · Map Strip`,
    render: () => <StripSlide worldId={w.id} />,
  })),
  // ── Backgrounds: area-cleared scenes ─────────────────────────────
  ...WORLDS.map(w => ({
    id: `bg-scene-${w.id}`, category: 'bg', label: `${w.name} · Cleared Scene`,
    render: () => <SceneSlide worldId={w.id} />,
  })),
  // ── Arena previews ────────────────────────────────────────────────
  ...WORLDS.map(w => ({
    id: `arena-${w.id}`, category: 'battle', label: `${w.name} · Arena`,
    render: () => <ArenaSlide world={w} />,
  })),
  // ── Characters ────────────────────────────────────────────────────
  {
    id: 'char-knight-idle', category: 'chars', label: 'Knight · Idle',
    render: () => <CharSlide worldId="forest"><KnightCharacter phase="idle" hitKey={0} /></CharSlide>,
  },
  {
    id: 'char-knight-attack', category: 'chars', label: 'Knight · Attacking',
    render: () => <CharSlide worldId="forest"><CyclingKnight /></CharSlide>,
  },
  {
    id: 'char-knight-fallen', category: 'chars', label: 'Knight · Fallen',
    render: () => <FallenSlide />,
  },
  ...WORLDS.map(w => ({
    id: `char-enemy-${w.id}`, category: 'chars', label: `${w.enemy.name} · Idle`,
    render: () => <CharSlide worldId={w.id}><EnemyCharacter phase="idle" enemy={w.enemy} hitKey={0} /></CharSlide>,
  })),
  {
    id: 'char-enemy-dragon-attack', category: 'chars', label: 'Dragon · Attacking',
    render: () => (
      <CharSlide worldId="dragonLair">
        <CyclingEnemy enemy={WORLDS[4].enemy} />
      </CharSlide>
    ),
  },
  // ── Full screens ──────────────────────────────────────────────────
  {
    id: 'screen-start', category: 'screen', label: 'Start Screen',
    render: () => <StartScreen onNewGame={NOOP} onViewLeaderboard={NOOP} onLangChange={NOOP} lang="en" t={EN} />,
  },
  {
    id: 'screen-map-start', category: 'screen', label: 'World Map · Fresh',
    render: () => <WorldMapScreen {...mockMap(0, TROPHIES_NONE, [])} />,
  },
  {
    id: 'screen-map-mid', category: 'screen', label: 'World Map · Mid-game',
    render: () => <WorldMapScreen {...mockMap(2, TROPHIES_2W, [1200, 800])} />,
  },
  {
    id: 'screen-map-end', category: 'screen', label: 'World Map · Late',
    render: () => <WorldMapScreen {...mockMap(4, TROPHIES_4W, [1200, 800, 1900, 600])} />,
  },
  {
    id: 'screen-battle-forest', category: 'screen', label: 'Battle · Forest (live)',
    render: () => <BattleScreen world={WORLDS[0]} battleIndex={0} onBattleEnd={NOOP} lang="en" t={EN} />,
  },
  {
    id: 'screen-battle-dragon', category: 'screen', label: 'Battle · Dragon Lair (live)',
    render: () => <BattleScreen world={WORLDS[4]} battleIndex={0} onBattleEnd={NOOP} lang="en" t={EN} />,
  },
  {
    id: 'screen-cleared-forest', category: 'screen', label: 'Area Cleared · Forest',
    render: () => <AreaClearedScreen {...mockCleared(0, ['gold', 'silver', 'gold'], 1200, 1200)} />,
  },
  {
    id: 'screen-cleared-dragon', category: 'screen', label: 'Area Cleared · Dragon Lair',
    render: () => <AreaClearedScreen {...mockCleared(4, ['gold', 'gold', 'bronze'], 2100, 9800)} />,
  },
  {
    id: 'screen-result', category: 'screen', label: 'Result · Defeat',
    render: () => <ResultScreen worldName="Swamp" totalScore={640} onRestart={NOOP} onViewScores={NOOP} lang="en" t={EN} />,
  },
  {
    id: 'screen-leaderboard', category: 'screen', label: 'Leaderboard',
    render: () => (
      <LeaderboardScreen
        totalScore={9400} endWorld="Dragon Lair" cleared
        difficulty="medium" playerName="Knight"
        onBack={NOOP} lang="en" t={EN}
      />
    ),
  },
]

// ── Category filter config ────────────────────────────────────────────────────

const CATS = [
  { id: 'all',    label: 'All' },
  { id: 'bg',     label: 'Backgrounds' },
  { id: 'battle', label: 'Arenas' },
  { id: 'chars',  label: 'Characters' },
  { id: 'screen', label: 'Screens' },
]

// ── PhoneFrame ────────────────────────────────────────────────────────────────

const PHONE_W = 390
const PHONE_H = 844

function PhoneFrame({ children, onSwipeLeft, onSwipeRight }) {
  const wrapRef  = useRef(null)
  const [scale, setScale] = useState(1)
  const swipeX   = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.min(1, Math.min((width - 32) / PHONE_W, (height - 32) / PHONE_H)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handlePointerDown = (e) => { swipeX.current = e.clientX }
  const handlePointerUp   = (e) => {
    if (swipeX.current === null) return
    const dx = e.clientX - swipeX.current
    swipeX.current = null
    if (dx < -40) onSwipeLeft?.()
    if (dx >  40) onSwipeRight?.()
  }

  return (
    <div
      ref={wrapRef}
      style={{
        flex: 1, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 60%, #1a1a2e 0%, #0a0a0a 100%)',
      }}
    >
      {/* Phone shell */}
      <div
        style={{
          width: PHONE_W * scale,
          height: PHONE_H * scale,
          borderRadius: 44 * scale,
          overflow: 'hidden',
          boxShadow: `0 0 0 ${2 * scale}px #333, 0 ${24 * scale}px ${64 * scale}px rgba(0,0,0,0.7)`,
          flexShrink: 0,
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Zoom container — CSS zoom scales content+click-targets uniformly */}
        <div style={{ width: PHONE_W, height: PHONE_H, zoom: scale, overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function DesignScreen({ onExit }) {
  const [cat, setCat] = useState('all')
  const [idx, setIdx] = useState(0)

  const slides     = cat === 'all' ? SLIDES : SLIDES.filter(s => s.category === cat)
  const clampedIdx = Math.min(idx, slides.length - 1)
  const slide      = slides[clampedIdx]

  const go = useCallback((dir) =>
    setIdx(i => Math.max(0, Math.min(slides.length - 1, i + dir))),
    [slides.length]
  )

  const jumpCat = (newCat) => { setCat(newCat); setIdx(0) }

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  go(-1)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'Escape')     onExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onExit])

  return (
    <div style={{
      width: '100%', height: '100dvh',
      display: 'flex', flexDirection: 'column',
      background: '#0a0a0a', userSelect: 'none',
    }}>

      {/* Top bar: exit + category pills in one row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '0 10px', height: 48,
        background: 'rgba(0,0,0,0.90)', flexShrink: 0, zIndex: 200,
      }}>
        <button
          onClick={onExit}
          style={{
            background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8,
            color: 'white', padding: '5px 10px', cursor: 'pointer',
            fontSize: 16, fontWeight: 700, flexShrink: 0, lineHeight: 1,
          }}
        >
          ←
        </button>

        <div style={{ display: 'flex', gap: 5, overflowX: 'auto', flex: 1 }}>
          {CATS.map(c => (
            <button
              key={c.id}
              onClick={() => jumpCat(c.id)}
              style={{
                padding: '4px 11px', borderRadius: 20, cursor: 'pointer', flexShrink: 0,
                border: cat === c.id
                  ? '1.5px solid rgba(251,191,36,0.9)'
                  : '1.5px solid rgba(255,255,255,0.14)',
                background: cat === c.id
                  ? 'rgba(251,191,36,0.18)'
                  : 'rgba(255,255,255,0.07)',
                color: cat === c.id ? '#fbbf24' : 'rgba(255,255,255,0.40)',
                fontSize: 11, fontWeight: 900, letterSpacing: '0.05em',
                transition: 'all 0.12s',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phone frame area */}
      <PhoneFrame onSwipeLeft={() => go(1)} onSwipeRight={() => go(-1)}>
        <div key={slide?.id} style={{ width: '100%', height: '100%' }}>
          {slide?.render()}
        </div>
      </PhoneFrame>

      {/* Bottom nav bar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        height: 60, padding: '0 6px',
        background: 'rgba(0,0,0,0.90)', flexShrink: 0, zIndex: 200, gap: 6,
      }}>
        <button
          onClick={() => go(-1)}
          disabled={clampedIdx === 0}
          style={{
            width: 52, height: 44,
            background: clampedIdx === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.12)',
            border: 'none', borderRadius: 10, cursor: clampedIdx === 0 ? 'default' : 'pointer',
            color: clampedIdx === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.80)',
            fontSize: 28, lineHeight: 1, flexShrink: 0,
          }}
        >
          ‹
        </button>

        <div style={{ flex: 1, textAlign: 'center', overflow: 'hidden' }}>
          <div style={{
            color: 'white', fontWeight: 900, fontSize: 12,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {slide?.label}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.30)', fontSize: 10,
            fontFamily: 'monospace', marginTop: 2,
          }}>
            {clampedIdx + 1} / {slides.length}
          </div>
        </div>

        <button
          onClick={() => go(1)}
          disabled={clampedIdx === slides.length - 1}
          style={{
            width: 52, height: 44,
            background: clampedIdx === slides.length - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.12)',
            border: 'none', borderRadius: 10,
            cursor: clampedIdx === slides.length - 1 ? 'default' : 'pointer',
            color: clampedIdx === slides.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.80)',
            fontSize: 28, lineHeight: 1, flexShrink: 0,
          }}
        >
          ›
        </button>
      </div>
    </div>
  )
}
