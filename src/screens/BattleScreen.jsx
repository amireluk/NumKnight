/* eslint-disable no-undef */
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { makeRound, getTrophy } from '../game/battleLogic'
import { playCorrect, playWrong, playSwordSwing, playImpact, playVictory, playDefeat } from '../game/sounds'
import { HPBar } from '../components/HPBar'
import { KnightCharacter } from '../components/KnightCharacter'
import { EnemyCharacter } from '../components/EnemyCharacter'
import { ParticleBurst } from '../components/ParticleBurst'
import { AnswerButton } from '../components/AnswerButton'
import { BattleBackground } from '../components/BattleBackground'
import { BattleIntro } from '../components/BattleIntro'

const PLAYER_HP = 3
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

// In-scene overlay shown when the enemy is defeated
function TrophyOverlay({ trophy, timeBonus, onContinue, t }) {
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
        {baseScore.toLocaleString()} {t?.pts ?? 'pts'}
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
          {timeBonus.toLocaleString()} {t?.timeBonus ?? 'time bonus'}
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

export function BattleScreen({ world, battleIndex, onBattleEnd, lang, t }) {
  const shakeControls = useAnimation()

  const [playerHP,  setPlayerHP]  = useState(PLAYER_HP)
  const [enemyHP,   setEnemyHP]   = useState(world.enemy.hp)
  const [round,     setRound]     = useState(() => makeRound(world.multipliers, world.factorRange))
  const [phase,     setPhase]     = useState('idle')
  const [mistakes,  setMistakes]  = useState(0)
  const [buttonStates, setButtonStates] = useState(IDLE_BUTTON_STATES)
  const [enemyHitKey,  setEnemyHitKey]  = useState(0)
  const [playerHitKey, setPlayerHitKey] = useState(0)
  const [introPlaying, setIntroPlaying] = useState(true)

  // Trophy overlay — shown after enemy dies, before onBattleEnd fires
  const [showTrophy,  setShowTrophy]  = useState(false)
  const wonMistakesRef  = useRef(0)
  const wonTimeBonusRef = useRef(0)
  const timeBonusAccRef = useRef(0) // accumulated per correct answer this battle
  const timerActiveRef  = useRef(false) // set false to stop timer on enemy/player death

  // Timer
  const [timeLeft,  setTimeLeft]  = useState(world.timer ?? null)
  const [timedOut,  setTimedOut]  = useState(false)

  // Refs for timer callbacks
  const phaseRef     = useRef(phase);     phaseRef.current     = phase
  const mistakesRef  = useRef(mistakes);  mistakesRef.current  = mistakes
  const playerHPRef  = useRef(playerHP);  playerHPRef.current  = playerHP

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
    setTimeLeft(world.timer)
    setTimedOut(false)

    timerActiveRef.current = true
    const id = setInterval(() => {
      if (!timerActiveRef.current) { clearInterval(id); return }
      setTimeLeft((t) => {
        if (t <= 1) { setTimedOut(true); clearInterval(id); return 0 }
        return t - 1
      })
    }, 1000)

    return () => { timerActiveRef.current = false; clearInterval(id) }
  }, [round, introPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // Timer expiry → wrong answer
  useEffect(() => {
    if (!timedOut || phaseRef.current !== 'idle') return
    setTimedOut(false)
    setButtonStates(round.options.map((opt) => (opt === round.problem.answer ? 'correct' : 'idle')))
    playWrong()
    const newMistakes = mistakesRef.current + 1
    setMistakes(newMistakes)
    setPhase('hit')

    setTimeout(() => {
      playImpact()
      setPlayerHitKey((k) => k + 1)
      shakeControls.start({ x: [0, -12, 11, -8, 7, -4, 3, 0], transition: { duration: 0.5 } })
      const newPlayerHP = Math.max(0, playerHPRef.current - (world.enemyDamage ?? 1))
      setPlayerHP(newPlayerHP)

      if (newPlayerHP <= 0) {
        timerActiveRef.current = false
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
      if (world.timer && timeLeft !== null) {
        timeBonusAccRef.current += Math.floor((timeLeft / world.timer) * 50)
      }
      playCorrect()
      setPhase('attacking')

      setTimeout(() => {
        playSwordSwing()
        setEnemyHitKey((k) => k + 1)
        const newEnemyHP = Math.max(0, enemyHP - 1)
        setEnemyHP(newEnemyHP)

        if (newEnemyHP <= 0) {
          timerActiveRef.current = false
          setPhase('won')
          playVictory()
          // Capture mistakes and timeBonus (state won't change after this point)
          wonMistakesRef.current = mistakes
          wonTimeBonusRef.current = timeBonusAccRef.current
          // Enemy death-anim plays (~650ms), then trophy overlay appears
          setTimeout(() => setShowTrophy(true), 700)
        } else {
          loadNextRound()
        }
      }, 280)

    } else {
      playWrong()
      const newMistakes = mistakes + 1
      setMistakes(newMistakes)
      setPhase('hit')

      setTimeout(() => {
        playImpact()
        setPlayerHitKey((k) => k + 1)
        shakeControls.start({ x: [0, -12, 11, -8, 7, -4, 3, 0], transition: { duration: 0.5 } })
        const newPlayerHP = Math.max(0, playerHP - (world.enemyDamage ?? 1))
        setPlayerHP(newPlayerHP)

        if (newPlayerHP <= 0) {
          timerActiveRef.current = false
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
      className="flex flex-col min-h-dvh max-w-md mx-auto px-3 py-4 gap-4"
      style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, #1e3a70, #2d5aaa)' }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>

        {/* Battle arena */}
        <div className="flex flex-1 min-h-0" style={{ position: 'relative' }}>
          <BattleBackground worldId={world.id} />

          {/* Region + round — stacked top-left */}
          <div style={{
            position: 'absolute', top: 8, left: 10, zIndex: 2,
            pointerEvents: 'none', userSelect: 'none',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
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

          <div className="flex flex-1 items-end gap-3 px-2" style={{ position: 'relative', zIndex: 1 }}>
            {/* Player HP */}
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={introPlaying ? {} : { y: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="mb-6"
            >
              <HPBar current={playerHP} max={PLAYER_HP} color="green" />
            </motion.div>

            {/* Characters */}
            <div className="relative flex flex-1 justify-around items-end">
              {/* Knight — slides in from left only on first encounter; stays put on subsequent ones */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ x: battleIndex === 0 ? -220 : 0 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <KnightCharacter phase={phase} hitKey={playerHitKey} />
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
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ x: 120, opacity: 0 }}
                  animate={{ x: 0, opacity: showTrophy ? 0 : 1 }}
                  transition={showTrophy
                    ? { opacity: { duration: 0.35, ease: 'easeOut' } }
                    : { duration: 0.45, ease: 'easeOut' }
                  }
                >
                  <EnemyCharacter phase={phase} enemy={world.enemy} hitKey={enemyHitKey} />
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

            {/* Enemy HP */}
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={introPlaying ? {} : { y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="mb-6"
            >
              <HPBar current={enemyHP} max={world.enemy.hp} color="red" />
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

      {/* Intro overlay */}
      {introPlaying && <BattleIntro onComplete={() => setIntroPlaying(false)} battleIndex={battleIndex} totalBattles={world.battles} isFinal={battleIndex === world.battles - 1} t={t} />}

      {/* In-scene trophy overlay — dims arena and shows trophy drop */}
      {showTrophy && (
        <TrophyOverlay
          trophy={getTrophy(wonMistakesRef.current)}
          timeBonus={wonTimeBonusRef.current}
          onContinue={() => onBattleEnd({ won: true, mistakes: wonMistakesRef.current, timeBonus: wonTimeBonusRef.current })}
          t={t}
        />
      )}
    </motion.div>
  )
}
