import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BattleScreen } from './screens/BattleScreen'
import { ResultScreen } from './screens/ResultScreen'
import { WorldMapScreen } from './screens/WorldMapScreen'
import { AreaClearedScreen } from './screens/AreaClearedScreen'
import { LeaderboardScreen } from './screens/LeaderboardScreen'
import { CAMPAIGN as WORLDS, DIFFICULTY } from './game/campaign.config'
import { createNewRun, loadRun, saveRun, clearRun } from './game/runState'
import { getTrophy, calcBattleScore } from './game/battleLogic'

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
  // running score within the current world (resets each world)
  const [worldScore, setWorldScore] = useState(0)

  const world = WORLDS[run.worldIndex]

  useEffect(() => { saveRun(run) }, [run])

  const handleBattleEnd = ({ won, mistakes, timeBonus = 0 }) => {
    if (won) {
      const trophy = getTrophy(mistakes)
      const battleScore = calcBattleScore(trophy, timeBonus)
      const newTrophies = [...run.trophies, trophy]
      const newWorldScore = worldScore + battleScore
      const newRun = { ...run, trophies: newTrophies, totalScore: (run.totalScore ?? 0) + battleScore }
      setRun(newRun)
      saveRun(newRun)
      setWorldScore(newWorldScore)

      const isVictory = newTrophies.length >= TOTAL_BATTLES
      const isLastBattleInWorld = run.battleIndex + 1 >= world.battles

      if (isVictory) {
        setScreen('leaderboard')
      } else if (isLastBattleInWorld) {
        // Show "Area Cleared" screen — slice the trophies for this world
        const offset = newTrophies.length - world.battles
        const worldTrophies = newTrophies.slice(offset)
        setClearedData({ world, worldTrophies, worldScore: newWorldScore })
        setScreen('cleared')
      } else {
        // More battles in this world — go straight to the next one
        setRun((r) => ({ ...r, battleIndex: run.battleIndex + 1 }))
        setBattleKey((k) => k + 1)
        setScreen('battle')
      }
    } else {
      setBattleResult({ won: false, worldName: world.name })
      setScreen('result')
    }
  }

  const handleClearContinue = () => {
    const nextWorldIndex = run.worldIndex + 1
    setClearedData(null)
    setWorldScore(0)
    // Safety net: if this was somehow the last world, go to leaderboard
    if (nextWorldIndex >= WORLDS.length) {
      setScreen('leaderboard')
      return
    }
    setRun((r) => ({ ...r, worldIndex: nextWorldIndex, battleIndex: 0 }))
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
    setWorldScore(0)
    setBattleKey((k) => k + 1)
    setScreen('map')
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'battle' && (
        // Constant key so AnimatePresence only fades on screen-type changes,
        // not between encounters in the same world (avoids background flash).
        // BattleScreen itself is re-keyed by battleKey to reset internal state.
        <motion.div key="battle-screen"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <BattleScreen key={battleKey} world={world} battleIndex={run.battleIndex} onBattleEnd={handleBattleEnd} />
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
            worldScore={clearedData.worldScore}
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
            worldName={battleResult?.worldName ?? ''}
            onRestart={handleRestart}
          />
        </motion.div>
      )}

      {screen === 'leaderboard' && (
        <motion.div key="leaderboard"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} className="w-full"
        >
          <LeaderboardScreen
            totalScore={run.totalScore ?? 0}
            difficulty={DIFFICULTY}
            onPlayAgain={handleRestart}
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
