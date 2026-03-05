import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BattleScreen } from './screens/BattleScreen'
import { ResultScreen } from './screens/ResultScreen'
import { WorldMapScreen } from './screens/WorldMapScreen'
import { getConfig } from './game/campaign.config'
import { createNewRun, loadRun, saveRun, clearRun } from './game/runState'
import { getTrophy } from './game/battleLogic'

const DIFF_KEY = 'numknight_difficulty'
function loadDifficulty() {
  try { return localStorage.getItem(DIFF_KEY) || 'medium' } catch { return 'medium' }
}
function saveDifficulty(d) {
  try { localStorage.setItem(DIFF_KEY, d) } catch { /* ignore */ }
}

export default function App() {
  const [difficulty, setDifficulty] = useState(loadDifficulty)
  const [run, setRun] = useState(() => loadRun() ?? createNewRun())
  // always start on map
  const [screen, setScreen] = useState('map')
  const [battleResult, setBattleResult] = useState(null)
  const [battleKey, setBattleKey] = useState(0)
  // true when we just cleared a world — knight stays at cleared world
  // until the player manually moves it to the new one
  const [mapIsTransition, setMapIsTransition] = useState(false)

  // Derive world list from current difficulty
  const worlds = getConfig(difficulty)
  const world  = worlds[run.worldIndex]

  useEffect(() => { saveRun(run) }, [run])

  const handleBattleEnd = ({ won, mistakes }) => {
    if (won) {
      const trophy = getTrophy(mistakes)
      const newTrophies = [...run.trophies, trophy]
      const newRun = { ...run, trophies: newTrophies }
      setRun(newRun)
      saveRun(newRun)

      const totalBattles = worlds.reduce((sum, w) => sum + w.battles, 0)
      if (newTrophies.length >= totalBattles) {
        setBattleResult({ won: true, trophy, isVictory: true })
      } else {
        setBattleResult({ won: true, trophy, isVictory: false })
      }
      setScreen('result')
    } else {
      setBattleResult({ won: false })
      setScreen('result')
    }
  }

  const handleContinue = () => {
    const nextBattle = run.battleIndex + 1
    if (nextBattle >= world.battles) {
      // Cleared this world — show map, knight parks at cleared world
      setRun((r) => ({ ...r, worldIndex: run.worldIndex + 1, battleIndex: 0 }))
      setBattleResult(null)
      setMapIsTransition(true)
      setScreen('map')
    } else {
      setRun((r) => ({ ...r, battleIndex: nextBattle }))
      setBattleResult(null)
      setBattleKey((k) => k + 1)
      setScreen('battle')
    }
  }

  const handleFight = () => {
    setMapIsTransition(false)
    setBattleKey((k) => k + 1)
    setScreen('battle')
  }

  const handleRestart = () => {
    clearRun()
    const fresh = createNewRun()
    setRun(fresh)
    saveRun(fresh)
    setBattleResult(null)
    setMapIsTransition(false)
    setBattleKey((k) => k + 1)
    setScreen('map')
  }

  const handleDifficultyChange = (newDiff) => {
    if (newDiff === difficulty) return
    saveDifficulty(newDiff)
    setDifficulty(newDiff)
    // Difficulty change always resets progress
    clearRun()
    const fresh = createNewRun()
    setRun(fresh)
    saveRun(fresh)
    setBattleResult(null)
    setMapIsTransition(false)
    setBattleKey((k) => k + 1)
    setScreen('map')
  }

  return (
    <>
    <AnimatePresence mode="wait">
      {screen === 'battle' && (
        <motion.div
          key={`battle-${battleKey}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <BattleScreen world={world} battleIndex={run.battleIndex} onBattleEnd={handleBattleEnd} />
        </motion.div>
      )}

      {screen === 'result' && (
        <motion.div
          key={`result-${battleKey}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
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

      {screen === 'map' && (
        <motion.div
          key={`map-${run.worldIndex}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} className="w-full"
        >
          <WorldMapScreen
            worlds={worlds}
            currentWorldIndex={run.worldIndex}
            trophies={run.trophies}
            isTransition={mapIsTransition}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            onFight={handleFight}
            onRestart={handleRestart}
          />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
