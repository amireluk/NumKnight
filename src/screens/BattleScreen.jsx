/* eslint-disable no-undef */
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { makeRound, getTrophy } from '../game/battleLogic'
import { playCorrect, playWrong, playSwordSwing, playImpact, playVictory, playDefeat,
  playShieldCrack, playShieldRestore,
  playTimerTick, playTimerExpiry } from '../game/sounds'
import { saveBattleState, loadBattleState, clearBattleState } from '../game/runState'
import { logEvent } from '../game/runLog'
import { HPBar } from '../components/HPBar'
import { KnightCharacter } from '../components/KnightCharacter'
import { EnemyCharacter } from '../components/EnemyCharacter'
import { ParticleBurst } from '../components/ParticleBurst'
import { AnswerButton } from '../components/AnswerButton'
import { BattleBackground } from '../components/BattleBackground'
import { BattleIntro } from '../components/BattleIntro'

const DEFAULT_PLAYER_HP = 3
const RASTER_KEY = 'numknight_raster_bg'
const IDLE_BUTTON_STATES = ['idle', 'idle', 'idle', 'idle']

const TROPHY_LABEL_DEFAULT = { gold: 'PERFECT!', silver: 'GREAT!', bronze: 'SURVIVED!' }
const TROPHY_COLOR = { gold: '#fbbf24', silver: '#c0c8d4', bronze: '#cd7c3a' }

function TrophyCup({ trophy, size = 80 }) {
  const color = TROPHY_COLOR[trophy]
  const s = size
  return (
    <svg width={s} height={Math.round(s * 1.1)} viewBox="0 0 48 52" fill="none">
      {/* Cup body */}
      <path d="M10 4 L38 4 L34 28 Q32 36 24 38 Q16 36 14 28Z" fill={color} />
      {/* Left handle */}
      <path d="M10 8 Q2 8 2 17 Q2 26 10 26" stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {/* Right handle */}
      <path d="M38 8 Q46 8 46 17 Q46 26 38 26" stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {/* Stem */}
      <rect x="20" y="38" width="8" height="7" fill={color} />
      {/* Base */}
      <rect x="12" y="45" width="24" height="5" rx="2.5" fill={color} />
    </svg>
  )
}

function ShadowBlob() {
  return (
    <div style={{
      width: 58, height: 12, borderRadius: '50%',
      background: 'rgba(0,0,0,0.32)', filter: 'blur(5px)',
      marginTop: -6, flexShrink: 0,
    }} />
  )
}

function TimerBar({ timeLeft, maxTime }) {
  const pct = Math.max(0, timeLeft / maxTime)
  const color = timeLeft <= 2 ? '#ef4444' : timeLeft <= Math.ceil(maxTime / 2) ? '#f59e0b' : '#4ade80'
  return (
    <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.15)', overflow: 'hidden', marginTop: -4 }}>
      <div style={{
        height: '100%', width: `${pct * 100}%`, background: color,
        transition: 'width 0.85s linear, background 0.3s', borderRadius: 4,
      }} />
    </div>
  )
}

const BURST_COUNT  = { gold: 26, silver: 14, bronze: 7 }
const BURST_COLORS = {
  gold:   ['#fbbf24', '#fde68a', '#fff', '#f59e0b'],
  silver: ['#c0c8d4', '#e2e8f0', '#fff', '#94a3b8'],
  bronze: ['#cd7c3a', '#e9a96a', '#fff', '#b45309'],
}

// Blue banner shown when the dragon's shield powers up
function ShieldUpBanner({ t }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.92 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'absolute', top: '52%', left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        pointerEvents: 'none', zIndex: 15,
      }}
    >
      <span style={{
        fontSize: 22, fontWeight: 900, letterSpacing: '0.14em',
        color: '#93c5fd',
        textShadow: '0 0 22px rgba(96,165,250,0.9), 0 2px 0 rgba(0,0,0,0.7)',
      }}>
        {t?.bossShieldUp ?? 'SHIELD UP'}
      </span>
    </motion.div>
  )
}

// In-scene overlay shown when the enemy is defeated
function TrophyOverlay({ trophy, timeBonus, scoreBonus = 0, onContinue, t }) {
  const TROPHY_LABEL = t?.trophyLabel ?? TROPHY_LABEL_DEFAULT
  const BASE_SCORE = { gold: 100, silver: 50, bronze: 25 }
  const baseScore = BASE_SCORE[trophy] ?? 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      onClick={onContinue}
      style={{
        position: 'absolute', inset: 0, zIndex: 20,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.78)',
        cursor: 'pointer', gap: 14,
      }}
    >
      {/* Sparkle burst — fires when trophy lands (~0.55s after mount) */}
      <ParticleBurst
        count={BURST_COUNT[trophy] ?? 14}
        colors={BURST_COLORS[trophy] ?? BURST_COLORS.silver}
        originX='50%' originY='38%'
        spread={130} gravity={40}
        baseDelay={0.52}
      />

      {/* Trophy drops in from above */}
      <motion.div
        initial={{ y: -180, scale: 0.4, rotate: -8 }}
        animate={{ y: 0,    scale: 1,   rotate: 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 13, delay: 0.05 }}
      >
        <TrophyCup trophy={trophy} size={92} />
      </motion.div>

      {/* Quality label */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          fontSize: 30, fontWeight: 900, letterSpacing: '0.18em',
          color: TROPHY_COLOR[trophy],
          filter: `drop-shadow(0 0 12px ${TROPHY_COLOR[trophy]})`,
        }}
      >
        {TROPHY_LABEL[trophy]}
      </motion.p>

      {/* Base score */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        style={{
          fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '0.06em',
          background: 'rgba(255,255,255,0.15)', borderRadius: 12,
          padding: '4px 18px',
        }}
      >
        {t?.ptsLabel ? t.ptsLabel(baseScore.toLocaleString()) : `${baseScore.toLocaleString()} pts`}
      </motion.p>

      {/* Time bonus */}
      {timeBonus > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72 }}
          style={{
            fontSize: 15, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.05em',
            background: 'rgba(255,255,255,0.15)', borderRadius: 10,
            padding: '3px 14px',
          }}
        >
          {t?.timeBonusLabel ? t.timeBonusLabel(timeBonus.toLocaleString()) : `${timeBonus.toLocaleString()} time bonus`}
        </motion.p>
      )}

      {/* Chronicle bonus */}
      {scoreBonus > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: timeBonus > 0 ? 0.86 : 0.72 }}
          style={{
            fontSize: 15, fontWeight: 800, color: '#a78bfa', letterSpacing: '0.05em',
            background: 'rgba(255,255,255,0.15)', borderRadius: 10,
            padding: '3px 14px',
          }}
        >
          {t?.chronicleBonusLabel ? t.chronicleBonusLabel(scoreBonus.toLocaleString()) : `📜 +${scoreBonus.toLocaleString()} chronicle bonus`}
        </motion.p>
      )}

      {/* Tap hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}
      >
        {t?.tapToContinue ?? 'TAP TO CONTINUE'}
      </motion.p>
    </motion.div>
  )
}

// "BOSS FIGHT" overlay shown after regular intro ends, before first question
function BossIntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 25,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.78)', gap: 12, pointerEvents: 'none',
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
        transition={{ duration: 0.4, times: [0, 0.7, 1] }}
        style={{ fontSize: 30, fontWeight: 900, color: 'white', letterSpacing: '0.16em', textShadow: '0 0 30px rgba(248,113,113,0.9)' }}
      >
        ⚔ BOSS FIGHT ⚔
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.06em' }}
      >
        Crack the shield twice to deal damage
      </motion.div>
    </motion.div>
  )
}

// 2-segment crack-progress bar shown above enemy HP for dragon fights
function BossShieldBar({ streak }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)' }}>SHIELD</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            animate={{
              background: i < streak ? '#f59e0b' : 'transparent',
              borderColor: i < streak ? '#fbbf24' : 'rgba(147,197,253,0.6)',
              boxShadow: i < streak ? '0 0 8px rgba(251,191,36,0.8)' : 'none',
            }}
            transition={{ duration: 0.2 }}
            style={{ width: 14, height: 14, borderRadius: 3, border: '2px solid' }}
          />
        ))}
      </div>
    </div>
  )
}

// "DRAGON ENRAGED!" banner shown when HP drops to ≤ 2
// Rocks that fall from the ceiling when the dragon enters rage phase
const ROCK_SHAPES = [
  'M0,0 L12,2 L14,14 L2,16 Z',
  'M0,4 L8,0 L16,6 L10,14 L2,12 Z',
  'M0,6 L6,0 L14,4 L12,14 L4,14 Z',
  'M2,0 L10,0 L14,8 L8,14 L0,10 Z',
  'M0,2 L10,0 L12,10 L4,14 L0,8 Z',
]
function FallingRocks() {
  const rocks = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: 4 + (i * 7.1) % 92,           // spread across width %
    delay: (i * 0.13) % 1.2,
    duration: 1.1 + (i * 0.07) % 0.7,
    size: 10 + (i * 3) % 12,
    shape: ROCK_SHAPES[i % ROCK_SHAPES.length],
    rotate: (i * 47) % 360,
    rotateEnd: ((i * 47) + 90 + (i % 2 === 0 ? 1 : -1) * 120) % 360,
  }))
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 13, overflow: 'hidden' }}>
      {rocks.map((r) => (
        <motion.svg
          key={r.id}
          viewBox="0 0 16 16"
          width={r.size}
          height={r.size}
          initial={{ y: -r.size - 10, x: `${r.x}vw`, rotate: r.rotate, opacity: 0.85 }}
          animate={{ y: '110vh', rotate: r.rotateEnd, opacity: [0.85, 0.85, 0] }}
          transition={{ delay: r.delay, duration: r.duration, ease: 'easeIn', repeat: Infinity, repeatDelay: 1.2 + (r.id * 0.08) % 0.8 }}
          style={{ position: 'absolute', top: 0 }}
        >
          <path d={r.shape} fill="#78716c" stroke="#44403c" strokeWidth="1" />
          <path d={r.shape} fill="rgba(255,255,255,0.08)" stroke="none" />
        </motion.svg>
      ))}
    </div>
  )
}

export function BattleScreen({ world, worldIndex, battleIndex, onBattleEnd, onQuit, scoreBonus = 0, lang, t }) {
  const shakeControls = useAnimation()
  const bgControls = useAnimation()
  const [useRaster, setUseRaster] = useState(() => localStorage.getItem(RASTER_KEY) === 'true')

  const toggleRaster = () => setUseRaster((v) => {
    localStorage.setItem(RASTER_KEY, String(!v))
    return !v
  })

  const PLAYER_HP = world.playerHP ?? DEFAULT_PLAYER_HP
  const isBoss = world.enemy.id === 'dragon'

  // Restore mid-battle state if the player closed the app during this exact battle
  const [saved] = useState(() => loadBattleState(worldIndex, battleIndex))

  const [playerHP,  setPlayerHP]  = useState(saved?.playerHP  ?? PLAYER_HP)
  const [enemyHP,   setEnemyHP]   = useState(saved?.enemyHP   ?? world.enemy.hp)

  // Boss shield state
  const [shieldStreak,  setShieldStreak]  = useState(saved?.shieldStreak ?? 0)
  const shieldStreakRef = useRef(saved?.shieldStreak ?? 0)
  const [shieldState,      setShieldState]      = useState(saved?.shieldState ?? (isBoss ? 'full' : null))
  const shieldStateRef = useRef(saved?.shieldState ?? (isBoss ? 'full' : null))
  const [shieldFlashKey, setShieldFlashKey] = useState(0)
  const [shieldFallKey,  setShieldFallKey]  = useState(0)
  const [shieldFallPip,  setShieldFallPip]  = useState(0)
  const [shieldBanner,     setShieldBanner]     = useState(false)
  const shieldBannerTimer = useRef(null)

  // Keep refs in sync
  shieldStreakRef.current = shieldStreak
  shieldStateRef.current  = shieldState

  const [round,     setRound]     = useState(() => makeRound(world.multipliers, world.factorRange))
  const [phase,     setPhase]     = useState('idle')
  const [mistakes,  setMistakes]  = useState(saved?.mistakes ?? 0)
  const [buttonStates, setButtonStates] = useState(IDLE_BUTTON_STATES)
  const [enemyHitKey,  setEnemyHitKey]  = useState(0)
  const [playerHitKey, setPlayerHitKey] = useState(0)
  const [introPlaying, setIntroPlaying] = useState(saved ? false : true)
  // Rage phase
  const [raging, setRaging] = useState(saved?.raging ?? false)
  const ragingRef = useRef(saved?.raging ?? false)
  ragingRef.current = raging
  const [ragePulseKey, setRagePulseKey] = useState(0)
  const ragePulseTimer = useRef(null)

  // Trophy overlay — shown after enemy dies, before onBattleEnd fires
  const [showTrophy,  setShowTrophy]  = useState(false)
  const wonMistakesRef  = useRef(0)
  const wonTimeBonusRef = useRef(0)
  const timeBonusAccRef = useRef(saved?.timeBonusAcc ?? 0) // accumulated per correct answer this battle
  const timerActiveRef  = useRef(false) // set false to stop timer on enemy/player death

  // Screen flash on player hit
  const [flashHitKey, setFlashHitKey] = useState(0)

  // Timer — on resume, first question gets saved time + 1s bonus
  const resumeTimeLeft = useRef(saved?.timeLeft != null ? Math.min(saved.timeLeft + 1, world.timer ?? Infinity) : null)
  const [timeLeft,  setTimeLeft]  = useState(world.timer ?? null)
  const [timedOut,  setTimedOut]  = useState(false)

  // Refs for timer callbacks
  const phaseRef     = useRef(phase);     phaseRef.current     = phase
  const mistakesRef  = useRef(mistakes);  mistakesRef.current  = mistakes
  const playerHPRef  = useRef(playerHP);  playerHPRef.current  = playerHP

  // Shield power-up: flash pips + show banner for 2s
  const triggerShieldUp = () => {
    setShieldFlashKey((k) => k + 1)
    if (shieldBannerTimer.current) clearTimeout(shieldBannerTimer.current)
    setShieldBanner(true)
    shieldBannerTimer.current = setTimeout(() => setShieldBanner(false), 1000)
  }

  // Fire shield-up animation once regular intro ends
  useEffect(() => {
    if (!isBoss || introPlaying) return
    const t = setTimeout(triggerShieldUp, 350)
    return () => clearTimeout(t)
  }, [introPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // Rage pulse — pulses dark red overlay every 2s while raging
  useEffect(() => {
    if (!raging) return
    const pulse = () => {
      setRagePulseKey((k) => k + 1)
      ragePulseTimer.current = setTimeout(pulse, 2000)
    }
    ragePulseTimer.current = setTimeout(pulse, 500)
    return () => clearTimeout(ragePulseTimer.current)
  }, [raging])

  // Android back button → same as ✕ quit
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => { onQuit?.() }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Log battle start once intro ends (or immediately for resumed battles)
  useEffect(() => {
    if (introPlaying) return
    logEvent('battle_start', {
      world: world.name, battle: battleIndex + 1,
      enemy: world.enemy.name, enemyHp: world.enemy.hp,
      playerHp: playerHP, resumed: !!saved,
    })
  }, [introPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // Log each new question once intro is done
  useEffect(() => {
    if (introPlaying) return
    logEvent('question', { q: `${round.problem.a}×${round.problem.b}`, answer: round.problem.answer })
  }, [round, introPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // Landing shake — only on the very first encounter of a world
  useEffect(() => {
    if (battleIndex !== 0) return
    const t = setTimeout(() => {
      shakeControls.start({ x: [0, -8, 7, -5, 4, -2, 0], transition: { duration: 0.3 } })
    }, 500)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer — resets each round once intro is done
  useEffect(() => {
    if (!world.timer || introPlaying) return
    const startTime = resumeTimeLeft.current ?? world.timer
    resumeTimeLeft.current = null  // only applies to the first round after resume
    setTimeLeft(startTime)
    setTimedOut(false)

    timerActiveRef.current = true
    const id = setInterval(() => {
      if (!timerActiveRef.current) { clearInterval(id); return }
      setTimeLeft((t) => {
        if (t <= 1) { setTimedOut(true); clearInterval(id); return 0 }
        const next = t - 1
        if (next <= 5) playTimerTick()
        return next
      })
    }, 1000)

    return () => { timerActiveRef.current = false; clearInterval(id) }
  }, [round, introPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist mid-battle state so OS-kill or deliberate quit can be resumed
  useEffect(() => {
    if (introPlaying) return
    saveBattleState({
      worldIndex, battleIndex,
      playerHP, enemyHP, mistakes,
      timeLeft,
      shieldStreak, shieldState,
      raging,
      timeBonusAcc: timeBonusAccRef.current,
    })
  }, [playerHP, enemyHP, mistakes, timeLeft, shieldStreak, shieldState, raging]) // eslint-disable-line react-hooks/exhaustive-deps

  // Timer expiry → wrong answer
  useEffect(() => {
    if (!timedOut || phaseRef.current !== 'idle') return
    setTimedOut(false)
    setButtonStates(round.options.map((opt) => (opt === round.problem.answer ? 'correct' : 'idle')))
    logEvent('timeout', { q: `${round.problem.a}×${round.problem.b}`, correct: round.problem.answer })
    playTimerExpiry()
    playWrong()
    const newMistakes = mistakesRef.current + 1
    setMistakes(newMistakes)
    setPhase('hit')

    // Boss: reset shield streak on timeout — flash only if crack was active
    if (isBoss) {
      const wasCracked = shieldStreakRef.current > 0
      setShieldStreak(0)
      setShieldState('full')
      if (wasCracked) { playShieldRestore(); triggerShieldUp() }
    }

    setTimeout(() => {
      playImpact()
      setPlayerHitKey((k) => k + 1)
      setFlashHitKey((k) => k + 1)
      shakeControls.start({ x: [0, -12, 11, -8, 7, -4, 3, 0], transition: { duration: 0.5 } })
      bgControls.start({ scale: 1.12, x: [0, -45, 22, -12, 5, 0], transition: { duration: 0.45 } })
      const newPlayerHP = Math.max(0, playerHPRef.current - (world.enemyDamage ?? 1))
      setPlayerHP(newPlayerHP)
      logEvent('player_hit', { damage: world.enemyDamage ?? 1, prevHp: playerHPRef.current, playerHp: newPlayerHP })

      if (newPlayerHP <= 0) {
        logEvent('battle_lost', { mistakes: newMistakes })
        timerActiveRef.current = false
        clearBattleState()
        setPhase('lost')
        playDefeat()
        setTimeout(() => onBattleEnd({ won: false, mistakes: newMistakes }), 1100)
      } else {
        loadNextRound()
      }
    }, 280)
  }, [timedOut]) // eslint-disable-line react-hooks/exhaustive-deps

  const { problem, options } = round

  const loadNextRound = () => {
    setRound(makeRound(world.multipliers, world.factorRange))
    setButtonStates(IDLE_BUTTON_STATES)
    setPhase('idle')
  }

  const handleAnswer = (selected) => {
    if (phase !== 'idle') return

    const isCorrect = selected === problem.answer
    setButtonStates(options.map((opt) => {
      if (opt === problem.answer) return 'correct'
      if (opt === selected)       return 'wrong'
      return 'idle'
    }))

    if (isCorrect) {
      // Accumulate time bonus for timed worlds
      let qTimeBonus = 0
      if (world.timer && timeLeft !== null) {
        qTimeBonus = Math.floor((timeLeft / world.timer) * 50)
        timeBonusAccRef.current += qTimeBonus
      }
      logEvent('correct', { q: `${problem.a}×${problem.b}`, selected, timeBonus: qTimeBonus })
      playCorrect()
      setPhase('attacking')

      // ── Boss shield mechanic (3-hit) ─────────────────────────────────
      if (isBoss) {
        if (shieldStreak === 0) {
          // Hit 1: crack line appears on top pip, no HP damage
          logEvent('shield_hit', { streak: 1 })
          setTimeout(() => {
            playShieldCrack()
            setShieldStreak(1)
            setShieldState('cracked')
            setEnemyHitKey((k) => k + 1)
            loadNextRound()
          }, 280)
          return
        }

        if (shieldStreak === 1) {
          // Hit 2: pip falls — trigger fall anim immediately, then state update
          logEvent('shield_hit', { streak: 2 })
          const pip = (world.enemy.maxHp ?? world.enemy.hp) - enemyHP   // current top filled pip index
          setShieldFallPip(pip)
          setShieldFallKey((k) => k + 1)
          setTimeout(() => {
            playShieldCrack()
            setShieldStreak(2)
            setShieldState('broken')
            setEnemyHitKey((k) => k + 1)
            loadNextRound()
          }, 280)
          return
        }

        // Hit 3: actual HP damage, reset shield
        setTimeout(() => {
          playSwordSwing()
          setEnemyHitKey((k) => k + 1)
          bgControls.start({ scale: 1.12, x: [0, 45, -22, 12, -5, 0], transition: { duration: 0.45 } })
          const newEnemyHP = Math.max(0, enemyHP - 1)
          setEnemyHP(newEnemyHP)
          logEvent('enemy_hit', { prevHp: enemyHP, enemyHp: newEnemyHP, enemyMaxHp: world.enemy.hp })
          setShieldStreak(0)
          setShieldState(null)
          // Trigger rage phase when HP first drops to ≤ 2
          if (newEnemyHP > 0 && newEnemyHP <= 2 && !ragingRef.current) {
            setRaging(true)
          }
          if (newEnemyHP > 0) {
            setTimeout(() => { setShieldState('full'); triggerShieldUp() }, 650)
          }
          if (newEnemyHP <= 0) {
            logEvent('battle_won', { trophy: getTrophy(mistakes), mistakes })
            timerActiveRef.current = false
            clearBattleState()
            setPhase('won')
            playVictory()
            wonMistakesRef.current = mistakes
            wonTimeBonusRef.current = timeBonusAccRef.current
            setTimeout(() => setShowTrophy(true), 700)
          } else {
            loadNextRound()
          }
        }, 280)
        return
      }
      // ─────────────────────────────────────────────────────────────────

      setTimeout(() => {
        playSwordSwing()
        setEnemyHitKey((k) => k + 1)
        bgControls.start({ scale: 1.12, x: [0, 45, -22, 12, -5, 0], transition: { duration: 0.45 } })
        const newEnemyHP = Math.max(0, enemyHP - 1)
        setEnemyHP(newEnemyHP)
        logEvent('enemy_hit', { prevHp: enemyHP, enemyHp: newEnemyHP, enemyMaxHp: world.enemy.hp })
        if (newEnemyHP <= 0) {
          logEvent('battle_won', { trophy: getTrophy(mistakes), mistakes })
          timerActiveRef.current = false
          clearBattleState()
          setPhase('won')
          playVictory()
          wonMistakesRef.current = mistakes
          wonTimeBonusRef.current = timeBonusAccRef.current
          setTimeout(() => setShowTrophy(true), 700)
        } else {
          loadNextRound()
        }
      }, 280)

    } else {
      logEvent('wrong', { q: `${problem.a}×${problem.b}`, selected, correct: problem.answer })
      playWrong()
      const newMistakes = mistakes + 1
      setMistakes(newMistakes)
      setPhase('hit')

      // Boss: reset streak — flash only if crack progress was lost
      if (isBoss) {
        const wasCracked = shieldStreakRef.current > 0
        setShieldStreak(0)
        setShieldState('full')
        if (wasCracked) { playShieldRestore(); triggerShieldUp() }
      }

      setTimeout(() => {
        playImpact()
        setPlayerHitKey((k) => k + 1)
        setFlashHitKey((k) => k + 1)
        shakeControls.start({ x: [0, -12, 11, -8, 7, -4, 3, 0], transition: { duration: 0.5 } })
        bgControls.start({ scale: 1.12, x: [0, -45, 22, -12, 5, 0], transition: { duration: 0.45 } })
        const newPlayerHP = Math.max(0, playerHP - (world.enemyDamage ?? 1))
        setPlayerHP(newPlayerHP)
        logEvent('player_hit', { damage: world.enemyDamage ?? 1, prevHp: playerHP, playerHp: newPlayerHP })

        if (newPlayerHP <= 0) {
          logEvent('battle_lost', { mistakes: newMistakes })
          timerActiveRef.current = false
          clearBattleState()
          setPhase('lost')
          playDefeat()
          setTimeout(() => onBattleEnd({ won: false, mistakes: newMistakes }), 1100)
        } else {
          loadNextRound()
        }
      }, 280)
    }
  }

  const isActive = phase !== 'won' && phase !== 'lost'

  return (
    <motion.div
      animate={shakeControls}
      className="flex flex-col h-dvh max-w-md mx-auto px-1 py-2 gap-2"
      style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, #1e3a70, #2d5aaa)' }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>

        {/* Battle arena */}
        <div className="flex flex-1 min-h-0" style={{ position: 'relative', overflow: 'hidden' }}>
          <motion.div animate={bgControls} initial={{ x: 0, scale: 1.12 }} style={{ position: 'absolute', inset: 0 }}>
            <BattleBackground worldId={world.id} useRaster={useRaster} />
          </motion.div>

          {/* Region + round — below the ✕ button */}
          <div style={{
            position: 'absolute', top: 44, left: 10, zIndex: 2,
            pointerEvents: 'none', userSelect: 'none',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            {world.playerHP != null && (
              <span style={{
                fontSize: 9, fontWeight: 900, letterSpacing: '0.12em',
                background: '#ef4444', color: '#fff',
                borderRadius: 4, padding: '1px 5px',
                alignSelf: 'flex-start',
              }}>DEV</span>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={introPlaying ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.72)', letterSpacing: '0.04em', textShadow: '0 1px 5px rgba(0,0,0,0.9)' }}>
                {t?.worldName?.[world.id] ?? world.name}
              </span>
              {world.battles > 1 && (<>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)' }}>·</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em', textShadow: '0 1px 5px rgba(0,0,0,0.9)' }}>
                  {t?.roundLabel ? t.roundLabel(battleIndex + 1, world.battles) : `Round ${battleIndex + 1}/${world.battles}`}
                </span>
              </>)}
            </motion.div>
          </div>

          {/* Back to menu button — top-left */}
          {onQuit && (
            <button
              onClick={onQuit}
              style={{
                position: 'absolute', top: 8, left: 10, zIndex: 5,
                background: 'rgba(0,0,0,0.35)', border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: 8, padding: '4px 10px',
                fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', letterSpacing: '0.04em',
              }}
            >
              ✕
            </button>
          )}

          {/* Raster / vector toggle — top-right */}
          <button
            onClick={toggleRaster}
            title={useRaster ? 'Switch to vector' : 'Switch to image'}
            style={{
              position: 'absolute', top: 8, right: 10, zIndex: 5,
              background: 'rgba(0,0,0,0.35)', border: '1.5px solid rgba(255,255,255,0.18)',
              borderRadius: 8, padding: '4px 10px',
              fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer', letterSpacing: '0.04em',
            }}
          >
            {useRaster ? 'SVG' : 'IMG'}
          </button>

          {/* Shield-up banner */}
          <AnimatePresence>
            {shieldBanner && <ShieldUpBanner key={shieldFlashKey} t={t} />}
          </AnimatePresence>

          {/* Falling rocks when dragon enrages */}
          {raging && <FallingRocks />}

          <div className="flex flex-1 items-end gap-3 px-2" style={{ position: 'relative', zIndex: 1 }}>
            {/* Player HP */}
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={introPlaying ? {} : { y: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="mb-6"
            >
              <HPBar current={playerHP} max={PLAYER_HP} color="green" damageFlashKey={flashHitKey} />
            </motion.div>

            {/* Characters — dir=ltr so RTL language never flips character positions */}
            <div dir="ltr" className="relative flex flex-1 justify-around items-end">
              {/* Knight — slides in from left only on first encounter; stays put on subsequent ones */}
              {/* zIndex: knight on top while attacking (lunging right over enemy), enemy on top otherwise (it's last in DOM so naturally above) */}
              <div className="flex flex-col items-center" style={{ zIndex: phase === 'attacking' ? 2 : 1, position: 'relative' }}>
                <motion.div
                  initial={{ x: battleIndex === 0 ? -220 : 0 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <KnightCharacter phase={phase} hitKey={playerHitKey} useRaster={useRaster} />
                </motion.div>
                {/* Shadow: instant on round 2+, fades in on first encounter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: battleIndex === 0 ? 0.4 : 0, duration: 0.2 }}
                >
                  <ShadowBlob />
                </motion.div>
              </div>

              {/* Enemy — slides in from right alongside knight */}
              <div className="flex flex-col items-center" style={{ zIndex: phase === 'hit' ? 2 : 1, position: 'relative' }}>
                <motion.div
                  initial={{ x: 120, opacity: 0 }}
                  animate={{ x: 0, opacity: showTrophy ? 0 : 1 }}
                  transition={showTrophy
                    ? { opacity: { duration: 0.35, ease: 'easeOut' } }
                    : { duration: 0.45, ease: 'easeOut' }
                  }
                  style={{ position: 'relative' }}
                >
                  <EnemyCharacter phase={phase} enemy={world.enemy} hitKey={enemyHitKey} raging={raging} />
                </motion.div>
                {/* Shadow fades in as enemy lands */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showTrophy ? 0 : 1 }}
                  transition={{ delay: showTrophy ? 0 : 0.4, duration: 0.2 }}
                >
                  <ShadowBlob />
                </motion.div>
              </div>
            </div>

            {/* Enemy HP bar */}
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={introPlaying ? {} : { y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="mb-6"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            >
              <HPBar current={enemyHP} max={world.enemy.maxHp ?? world.enemy.hp} color="red" shieldState={shieldState} shieldFlashKey={shieldFlashKey} shieldFallKey={shieldFallKey} shieldFallPip={shieldFallPip} />
            </motion.div>
          </div>
        </div>

        {/* Problem card */}
        <motion.div
          key={`${problem.a}-${problem.b}`}
          initial={{ opacity: 0, y: 10 }}
          animate={introPlaying ? { opacity: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: introPlaying ? 0 : 0.15 }}
          className="bg-white/10 border border-white/20 rounded-3xl py-5 px-4 text-center shadow-xl"
        >
          <p className="text-5xl font-black text-white tracking-wide">
            {problem.a} × {problem.b} = ?
          </p>
          {world.timer && !introPlaying && timeLeft !== null && (
            <div className="mt-4 px-2">
              <TimerBar timeLeft={timeLeft} maxTime={world.timer} />
              <p className="text-xs text-white/50 mt-1 text-right tabular-nums">{timeLeft}s</p>
            </div>
          )}
        </motion.div>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          {options.map((opt, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={introPlaying ? {} : { scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.22 + i * 0.08 }}
            >
              <AnswerButton
                value={opt} index={i} onClick={handleAnswer}
                disabled={!isActive || phase !== 'idle' || introPlaying}
                state={buttonStates[i]}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rage pulse — dark red overlay every 2s when dragon is enraged */}
      {ragePulseKey > 0 && (
        <motion.div
          key={`rage-pulse-${ragePulseKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 1.0 }}
          style={{ position: 'absolute', inset: 0, background: '#7f1d1d', pointerEvents: 'none', zIndex: 14 }}
        />
      )}

      {/* Red screen flash on player hit */}
      {flashHitKey > 0 && (
        <motion.div
          key={flashHitKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.35, 0] }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', inset: 0, background: 'red', pointerEvents: 'none', zIndex: 15 }}
        />
      )}

      {/* Intro overlay */}
      {introPlaying && <BattleIntro onComplete={() => setIntroPlaying(false)} battleIndex={battleIndex} totalBattles={world.battles} isFinal={battleIndex === world.battles - 1} t={t} />}

      {/* In-scene trophy overlay — dims arena and shows trophy drop */}
      {showTrophy && (
        <TrophyOverlay
          trophy={getTrophy(wonMistakesRef.current)}
          timeBonus={wonTimeBonusRef.current}
          scoreBonus={scoreBonus}
          onContinue={() => onBattleEnd({ won: true, mistakes: wonMistakesRef.current, timeBonus: wonTimeBonusRef.current })}
          t={t}
        />
      )}
    </motion.div>
  )
}
