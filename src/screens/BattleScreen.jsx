import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { makeRound } from '../game/battleLogic'
import { HPBar } from '../components/HPBar'
import { KnightCharacter } from '../components/KnightCharacter'
import { EnemyCharacter } from '../components/EnemyCharacter'
import { AnswerButton } from '../components/AnswerButton'

const IDLE_BUTTON_STATES = ['idle', 'idle', 'idle', 'idle']

export function BattleScreen({ world, onBattleEnd }) {
  const enemy = world.enemies[0]

  const [playerHP, setPlayerHP] = useState(world.playerHP)
  const [enemyHP, setEnemyHP] = useState(world.enemyHP)
  const [round, setRound] = useState(() => makeRound(world.tableRange))
  const [phase, setPhase] = useState('idle') // 'idle'|'attacking'|'combo'|'hit'|'won'|'lost'
  const [combo, setCombo] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [buttonStates, setButtonStates] = useState(IDLE_BUTTON_STATES)

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
      const newCombo = combo + 1
      setCombo(newCombo)
      const isComboStrike = newCombo > 0 && newCombo % 3 === 0
      const damage = isComboStrike ? 2 : 1
      setPhase(isComboStrike ? 'combo' : 'attacking')

      setTimeout(() => {
        const newEnemyHP = Math.max(0, enemyHP - damage)
        setEnemyHP(newEnemyHP)

        if (newEnemyHP <= 0) {
          setPhase('won')
          setTimeout(() => onBattleEnd({ won: true, mistakes }), 900)
        } else {
          loadNextRound()
        }
      }, 750)
    } else {
      const newMistakes = mistakes + 1
      setMistakes(newMistakes)
      setCombo(0)
      setPhase('hit')

      setTimeout(() => {
        const newPlayerHP = Math.max(0, playerHP - 1)
        setPlayerHP(newPlayerHP)

        if (newPlayerHP <= 0) {
          setPhase('lost')
          setTimeout(() => onBattleEnd({ won: false, mistakes: newMistakes }), 900)
        } else {
          loadNextRound()
        }
      }, 750)
    }
  }

  const isActive = phase !== 'won' && phase !== 'lost'

  return (
    <div className="flex flex-col min-h-dvh max-w-md mx-auto px-4 py-4 gap-3 bg-gradient-to-b from-[#0d0d1e] to-[#1a1040]">
      {/* World icon header */}
      <div className="text-center text-2xl">{world.icon}</div>

      {/* Enemy HP */}
      <HPBar current={enemyHP} max={world.enemyHP} color="red" />

      {/* Battle arena — characters side by side */}
      <div className="flex justify-around items-end flex-1 min-h-0 py-2">
        <KnightCharacter phase={phase} />

        {/* Center — combo badge or crossed swords */}
        <div className="flex flex-col items-center gap-1">
          <AnimatePresence>
            {combo >= 2 && phase === 'idle' && (
              <motion.div
                key="combo"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="bg-yellow-500 text-black font-black text-xs px-2 py-1 rounded-full shadow-lg"
              >
                🔥 {combo}
              </motion.div>
            )}
          </AnimatePresence>
          <span className="text-gray-600 text-xl">⚔️</span>
        </div>

        <EnemyCharacter phase={phase} enemy={enemy} />
      </div>

      {/* Player HP */}
      <HPBar current={playerHP} max={world.playerHP} color="green" />

      {/* Problem card */}
      <motion.div
        key={problem.a + '-' + problem.b}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white/10 border border-white/20 rounded-3xl py-5 px-4 text-center shadow-xl"
      >
        <p className="text-5xl font-black text-white tracking-wide">
          {problem.a} × {problem.b} = ?
        </p>
      </motion.div>

      {/* Answer buttons — 2×2 grid */}
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
    </div>
  )
}
