import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BattleScreen } from './screens/BattleScreen'
import { ResultScreen } from './screens/ResultScreen'
import { WorldMapScreen } from './screens/WorldMapScreen'
import { AreaClearedScreen } from './screens/AreaClearedScreen'
import { CAMPAIGN as WORLDS } from './game/campaign.config'
import { createNewRun, loadRun, saveRun, clearRun } from './game/runState'
import { getTrophy } from './game/battleLogic'

const TOTAL_BATTLES = WORLDS.reduce((sum, w) => sum + w.battles, 0)

export default function App() {
  const [run, setRun] = useState(() => loadRun() ?? createNewRun())
  // 'map' | 'battle' | 'cleared' | 'result' — always start on map
  const [screen, setScreen] = useState('map')
  const [battleResult, setBattleResult] = useState(null)
  const [clearedData, setClearedData] = useState(null)
  const [battleKey, setBattleKey] = useState(0)
  // true when we just cleared a world — knight stays at cleared world
  // until the player manually moves it to the new one
  const [mapIsTransition, setMapIsTransition] = useState(false)

  const world = WORLDS[run.worldIndex]

  useEffect(() => { saveRun(run) }, [run])

  const handleBattleEnd = ({ won, mistakes }) => {
    if (won) {
      const trophy = getTrophy(mistakes)
      const newTrophies = [...run.trophies, trophy]
      const newRun = { ...run, trophies: newTrophies }
      setRun(newRun)
      saveRun(newRun)

      const isVictory = newTrophies.length >= TOTAL_BATTLES
      const isLastBattleInWorld = run.battleIndex + 1 >= world.battles

      if (isVictory) {
        setBattleResult({ won: true, trophy, isVictory: true })
        setScreen('result')
      } else if (isLastBattleInWorld) {
        // Show "Area Cleared" screen — slice the trophies for this world
        const offset = newTrophies.length - world.battles
        const worldTrophies = newTrophies.slice(offset)
        setClearedData({ world, worldTrophies })
        setScreen('cleared')
      } else {
        // More battles in this world — go straight to the next one
        setRun((r) => ({ ...r, battleIndex: run.battleIndex + 1 }))
        setBattleKey((k) => k + 1)
        setScreen('battle')
      }
    } else {
      setBattleResult({ won: false })
      setScreen('result')
    }
  }

  const handleClearContinue = () => {
    setRun((r) => ({ ...r, worldIndex: r.worldIndex + 1, battleIndex: 0 }))
    setClearedData(null)
    setMapIsTransition(true)
    setScreen('map')
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
    setClearedData(null)
    setMapIsTransition(false)
    setBattleKey((k) => k + 1)
    setScreen('map')
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'battle' && (
        <motion.div key={`battle-${battleKey}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <BattleScreen world={world} battleIndex={run.battleIndex} onBattleEnd={handleBattleEnd} />
        </motion.div>
      )}

      {screen === 'cleared' && clearedData && (
        <motion.div key={`cleared-${run.worldIndex}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} className="w-full"
        >
          <AreaClearedScreen
            world={clearedData.world}
            worldTrophies={clearedData.worldTrophies}
            onContinue={handleClearContinue}
          />
        </motion.div>
      )}

      {screen === 'result' && (
        <motion.div key={`result-${battleKey}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <ResultScreen
            won={battleResult?.won ?? false}
            trophy={battleResult?.trophy ?? null}
            isVictory={battleResult?.isVictory ?? false}
            onRestart={handleRestart}
          />
        </motion.div>
      )}

      {screen === 'map' && (
        <motion.div key={`map-${run.worldIndex}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} className="w-full"
        >
          <WorldMapScreen
            worlds={WORLDS}
            currentWorldIndex={run.worldIndex}
            trophies={run.trophies}
            isTransition={mapIsTransition}
            onFight={handleFight}
            onRestart={handleRestart}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
