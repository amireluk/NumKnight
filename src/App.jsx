import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BattleScreen } from './screens/BattleScreen'
import { ResultScreen } from './screens/ResultScreen'
import { WORLDS } from './game/worldConfig'
import { createNewRun, loadRun, saveRun, clearRun } from './game/runState'
import { getTrophy } from './game/battleLogic'

export default function App() {
  // Restore or create a fresh run
  const [run, setRun] = useState(() => loadRun() ?? createNewRun())
  // 'battle' | 'result' | 'gameover' | 'victory'
  const [screen, setScreen] = useState('battle')
  const [battleResult, setBattleResult] = useState(null)
  const [battleKey, setBattleKey] = useState(0)

  // Persist run state on every change
  useEffect(() => {
    saveRun(run)
  }, [run])

  const world = WORLDS[run.worldIndex]

  const handleBattleEnd = ({ won, mistakes }) => {
    if (won) {
      const trophy = getTrophy(mistakes)
      const newTrophies = [...run.trophies, trophy]
      const newRun = { ...run, trophies: newTrophies }
      setRun(newRun)
      saveRun(newRun)

      // Check for full campaign victory
      const totalBattles = WORLDS.reduce((sum, w) => sum + w.battles, 0)
      const completedBattles = newTrophies.length
      if (completedBattles >= totalBattles) {
        setBattleResult({ won: true, trophy, isVictory: true })
      } else {
        setBattleResult({ won: true, trophy, isVictory: false })
      }
      setScreen('result')
    } else {
      // Died — game over
      setBattleResult({ won: false })
      setScreen('result')
    }
  }

  const handleContinue = () => {
    const nextBattle = run.battleIndex + 1

    if (nextBattle >= world.battles) {
      // Advance to next world
      const nextWorld = run.worldIndex + 1
      setRun((r) => ({ ...r, worldIndex: nextWorld, battleIndex: 0 }))
    } else {
      setRun((r) => ({ ...r, battleIndex: nextBattle }))
    }

    setBattleResult(null)
    setBattleKey((k) => k + 1)
    setScreen('battle')
  }

  const handleRestart = () => {
    clearRun()
    const fresh = createNewRun()
    setRun(fresh)
    saveRun(fresh)
    setBattleResult(null)
    setBattleKey((k) => k + 1)
    setScreen('battle')
  }

  return (
    <>
    <AnimatePresence mode="wait">
      {screen === 'battle' ? (
        <motion.div
          key={`battle-${battleKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <BattleScreen
            world={world}
            battleIndex={run.battleIndex}
            onBattleEnd={handleBattleEnd}
          />
        </motion.div>
      ) : (
        <motion.div
          key={`result-${battleKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <ResultScreen
            won={battleResult?.won ?? false}
            trophy={battleResult?.trophy ?? null}
            worldName={world.name}
            worldNum={run.worldIndex + 1}
            battleNum={run.battleIndex + 1}
            totalBattles={world.battles}
            isVictory={battleResult?.isVictory ?? false}
            onContinue={handleContinue}
            onRestart={handleRestart}
          />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
