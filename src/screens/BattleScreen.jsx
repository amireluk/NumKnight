import { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { makeRound } from '../game/battleLogic'
import { playCorrect, playWrong, playSwordSwing, playImpact, playVictory, playDefeat } from '../game/sounds'
import { HPBar } from '../components/HPBar'
import { KnightCharacter } from '../components/KnightCharacter'
import { EnemyCharacter } from '../components/EnemyCharacter'
import { AnswerButton } from '../components/AnswerButton'

const IDLE_BUTTON_STATES = ['idle', 'idle', 'idle', 'idle']

export function BattleScreen({ world, onBattleEnd }) {
  const enemy = world.enemies[0]
  const shakeControls = useAnimation()

  const [playerHP, setPlayerHP] = useState(world.playerHP)
  const [enemyHP, setEnemyHP] = useState(world.enemyHP)
  const [round, setRound] = useState(() => makeRound(world.tableRange))
  const [phase, setPhase] = useState('idle')
  const [mistakes, setMistakes] = useState(0)
  const [buttonStates, setButtonStates] = useState(IDLE_BUTTON_STATES)
  // Incrementing keys trigger recoil + splash inside character components
  const [enemyHitKey, setEnemyHitKey] = useState(0)
  const [playerHitKey, setPlayerHitKey] = useState(0)

  const { problem, options } = round

  const loadNextRound = () => {
    setRound(makeRound(world.tableRange))
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
      setPhase('attacking') // knight lunges immediately

      setTimeout(() => {
        playSwordSwing()
        setEnemyHitKey((k) => k + 1) // goblin recoils + splash at impact
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
      setPhase('hit') // goblin lunges immediately

      setTimeout(() => {
        playImpact()
        setPlayerHitKey((k) => k + 1) // knight recoils + splash at impact
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
      className="flex flex-col min-h-dvh max-w-md mx-auto px-3 py-4 gap-4 bg-gradient-to-b from-[#0d0d1e] to-[#1a1040]"
    >
      {/* Battle arena: HP cells | characters | HP cells */}
      <div className="flex flex-1 items-center gap-3 min-h-0">
        <HPBar current={playerHP} max={world.playerHP} color="green" />

        {/* Characters */}
        <div className="relative flex flex-1 justify-around items-end py-2">
          <KnightCharacter phase={phase} hitKey={playerHitKey} />
          <EnemyCharacter phase={phase} enemy={enemy} hitKey={enemyHitKey} />
        </div>

        <HPBar current={enemyHP} max={world.enemyHP} color="red" />
      </div>

      {/* Problem card */}
      <motion.div
        key={`${problem.a}-${problem.b}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="bg-white/10 border border-white/20 rounded-3xl py-5 px-4 text-center shadow-xl"
      >
        <p className="text-5xl font-black text-white tracking-wide">
          {problem.a} × {problem.b} = ?
        </p>
      </motion.div>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        {options.map((opt, i) => (
          <AnswerButton
            key={i}
            value={opt}
            index={i}
            onClick={handleAnswer}
            disabled={!isActive || phase !== 'idle'}
            state={buttonStates[i]}
          />
        ))}
      </div>
    </motion.div>
  )
}
