/* eslint-disable no-undef */
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'

import { useState, useEffect, useRef } from 'react'
import { DEBUG } from '../game/campaign.config'
import { motion, useAnimation } from 'framer-motion'
import { makeRound } from '../game/battleLogic'
import { playCorrect, playWrong, playSwordSwing, playImpact, playVictory, playDefeat } from '../game/sounds'
import { HPBar } from '../components/HPBar'
import { KnightCharacter } from '../components/KnightCharacter'
import { EnemyCharacter } from '../components/EnemyCharacter'
import { AnswerButton } from '../components/AnswerButton'
import { BattleBackground } from '../components/BattleBackground'
import { BattleIntro } from '../components/BattleIntro'

const IDLE_BUTTON_STATES = ['idle', 'idle', 'idle', 'idle']

function ShadowBlob() {
  return (
    <div
      style={{
        width: 58,
        height: 12,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.32)',
        filter: 'blur(5px)',
        marginTop: -6,
        flexShrink: 0,
      }}
    />
  )
}

// Draining countdown bar shown for timed worlds
function TimerBar({ timeLeft, maxTime }) {
  const pct = Math.max(0, timeLeft / maxTime)
  const color = timeLeft <= 2 ? '#ef4444' : timeLeft <= Math.ceil(maxTime / 2) ? '#f59e0b' : '#4ade80'
  return (
    <div
      style={{
        height: 6,
        borderRadius: 4,
        background: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
        marginTop: -4,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct * 100}%`,
          background: color,
          transition: 'width 0.85s linear, background 0.3s',
          borderRadius: 4,
        }}
      />
    </div>
  )
}

export function BattleScreen({ world, battleIndex, onBattleEnd }) {
  const shakeControls = useAnimation()

  const [playerHP, setPlayerHP] = useState(world.playerHP)
  const [enemyHP, setEnemyHP] = useState(world.enemy.hp)
  const [round, setRound] = useState(() => makeRound(world.multipliers, world.factorRange))
  const [phase, setPhase] = useState('idle')
  const [mistakes, setMistakes] = useState(0)
  const [buttonStates, setButtonStates] = useState(IDLE_BUTTON_STATES)
  const [enemyHitKey, setEnemyHitKey] = useState(0)
  const [playerHitKey, setPlayerHitKey] = useState(0)
  const [introPlaying, setIntroPlaying] = useState(true)

  // Timer state
  const [timeLeft, setTimeLeft] = useState(world.timer ?? null)
  const [timedOut, setTimedOut] = useState(false)

  // Refs so timer callbacks always see fresh state
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const mistakesRef = useRef(mistakes)
  mistakesRef.current = mistakes
  const playerHPRef = useRef(playerHP)
  playerHPRef.current = playerHP

  // Landing shake
  useEffect(() => {
    const t = setTimeout(() => {
      shakeControls.start({
        x: [0, -8, 7, -5, 4, -2, 0],
        transition: { duration: 0.3 },
      })
    }, 500)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer — starts fresh on each new round (once intro is done)
  useEffect(() => {
    if (!world.timer || introPlaying) return
    setTimeLeft(world.timer)
    setTimedOut(false)

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setTimedOut(true)
          clearInterval(id)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [round, introPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // React to timer expiry — treat as wrong answer
  useEffect(() => {
    if (!timedOut || phaseRef.current !== 'idle') return
    setTimedOut(false)

    // Highlight correct answer, grey out rest
    setButtonStates(round.options.map((opt) => (opt === round.problem.answer ? 'correct' : 'idle')))

    playWrong()
    const newMistakes = mistakesRef.current + 1
    setMistakes(newMistakes)
    setPhase('hit')

    setTimeout(() => {
      playImpact()
      setPlayerHitKey((k) => k + 1)
      shakeControls.start({
        x: [0, -12, 11, -8, 7, -4, 3, 0],
        transition: { duration: 0.5 },
      })
      const newPlayerHP = Math.max(0, playerHPRef.current - 1)
      setPlayerHP(newPlayerHP)

      if (newPlayerHP <= 0) {
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

    setButtonStates(
      options.map((opt) => {
        if (opt === problem.answer) return 'correct'
        if (opt === selected) return 'wrong'
        return 'idle'
      })
    )

    if (isCorrect) {
      playCorrect()
      setPhase('attacking')

      setTimeout(() => {
        playSwordSwing()
        setEnemyHitKey((k) => k + 1)
        const newEnemyHP = Math.max(0, enemyHP - 1)
        setEnemyHP(newEnemyHP)

        if (newEnemyHP <= 0) {
          setPhase('won')
          playVictory()
          setTimeout(() => onBattleEnd({ won: true, mistakes }), 1100)
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
        shakeControls.start({
          x: [0, -12, 11, -8, 7, -4, 3, 0],
          transition: { duration: 0.5 },
        })
        const newPlayerHP = Math.max(0, playerHP - 1)
        setPlayerHP(newPlayerHP)

        if (newPlayerHP <= 0) {
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
      style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, #0d0d1e, #1a1040)' }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>

        {/* Battle arena — no overflow:hidden so character sprites (wings, weapons) aren't clipped */}
        <div className="flex flex-1 min-h-0" style={{ position: 'relative' }}>
          <BattleBackground />
          {/* Version + config mode label — top-left of the arena */}
          <div style={{
            position: 'absolute', top: 8, left: 10, zIndex: 2,
            display: 'flex', flexDirection: 'column', gap: 1,
            pointerEvents: 'none', userSelect: 'none',
          }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)' }}>
              v{APP_VERSION}
            </span>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: DEBUG ? 'rgba(251,191,36,0.45)' : 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
              {DEBUG ? 'debug' : 'prod'}
            </span>
          </div>
          <div className="flex flex-1 items-end gap-3 px-2" style={{ position: 'relative', zIndex: 1 }}>

            {/* Left HP bar */}
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={introPlaying ? {} : { y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0 }}
              className="mb-6"
            >
              <HPBar current={playerHP} max={world.playerHP} color="green" />
            </motion.div>

            {/* Characters */}
            <div className="relative flex flex-1 justify-around items-end">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ x: -220 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <KnightCharacter phase={phase} hitKey={playerHitKey} />
                </motion.div>
                <ShadowBlob />
              </div>

              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ x: 220 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <EnemyCharacter phase={phase} enemy={world.enemy} hitKey={enemyHitKey} />
                </motion.div>
                <ShadowBlob />
              </div>
            </div>

            {/* Right HP bar */}
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

        {/* Campaign position strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={introPlaying ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: 4 }}
        >
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 700, letterSpacing: '0.04em' }}>
            {world.icon}&nbsp;&nbsp;{world.name}
          </span>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {Array.from({ length: world.battles }).map((_, i) => (
              <svg key={i} width="11" height="11" viewBox="0 0 11 11">
                <circle
                  cx="5.5" cy="5.5" r="4.5"
                  fill={i < battleIndex ? '#fbbf24' : 'none'}
                  stroke={
                    i < battleIndex ? '#fbbf24'
                    : i === battleIndex ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.28)'
                  }
                  strokeWidth="1.5"
                />
                {/* Active battle: small centre dot */}
                {i === battleIndex && (
                  <circle cx="5.5" cy="5.5" r="2" fill="rgba(255,255,255,0.9)" />
                )}
              </svg>
            ))}
          </div>
        </motion.div>

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
          {/* Timer bar — only for timed worlds */}
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
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 18,
                delay: 0.22 + i * 0.08,
              }}
            >
              <AnswerButton
                value={opt}
                index={i}
                onClick={handleAnswer}
                disabled={!isActive || phase !== 'idle' || introPlaying}
                state={buttonStates[i]}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {introPlaying && (
        <BattleIntro onComplete={() => setIntroPlaying(false)} />
      )}
    </motion.div>
  )
}
