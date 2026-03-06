import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BattleScreen } from './screens/BattleScreen'
import { ResultScreen } from './screens/ResultScreen'
import { WorldMapScreen } from './screens/WorldMapScreen'
import { AreaClearedScreen } from './screens/AreaClearedScreen'
import { LeaderboardScreen } from './screens/LeaderboardScreen'
import { StartScreen } from './screens/StartScreen'
import { EASY, MEDIUM, HARD } from './game/campaign.config'
import { createNewRun, loadRun, saveRun, clearRun } from './game/runState'
import { getTrophy, calcBattleScore } from './game/battleLogic'

const CONFIGS = { easy: EASY, medium: MEDIUM, hard: HARD }

export default function App() {
  const [difficulty, setDifficulty] = useState('medium')
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('numknight_player_name') ?? '')

  const worlds = CONFIGS[difficulty] ?? MEDIUM
  const totalBattles = worlds.reduce((sum, w) => sum + w.battles, 0)

  const [run, setRun] = useState(() => loadRun() ?? createNewRun())
  const [screen, setScreen] = useState('start')
  const [clearedData, setClearedData] = useState(null)
  const [battleKey, setBattleKey] = useState(0)
  const [mapIsTransition, setMapIsTransition] = useState(false)
  const [worldScore, setWorldScore] = useState(0)
  // Holds score context passed to leaderboard
  const [pendingScore, setPendingScore] = useState(null)

  const world = worlds[run.worldIndex]

  useEffect(() => { saveRun(run) }, [run])

  const handleStart = ({ name, diff }) => {
    setPlayerName(name)
    setDifficulty(diff)
    clearRun()
    const fresh = createNewRun()
    setRun(fresh)
    saveRun(fresh)
    setBattleKey(0)
    setWorldScore(0)
    setMapIsTransition(false)
    setPendingScore(null)
    setScreen('map')
  }

  const handleBattleEnd = ({ won, mistakes, timeBonus = 0 }) => {
    if (won) {
      const trophy = getTrophy(mistakes)
      const battleScore = calcBattleScore(trophy, timeBonus)
      const newTrophies = [...run.trophies, trophy]
      const newWorldScore = worldScore + battleScore
      const newTotalScore = (run.totalScore ?? 0) + battleScore
      const newRun = { ...run, trophies: newTrophies, totalScore: newTotalScore }
      setRun(newRun)
      saveRun(newRun)
      setWorldScore(newWorldScore)

      const isVictory = newTrophies.length >= totalBattles
      const isLastBattleInWorld = run.battleIndex + 1 >= world.battles

      if (isVictory) {
        setPendingScore({ totalScore: newTotalScore, endWorld: world.name, cleared: true })
        setScreen('leaderboard')
      } else if (isLastBattleInWorld) {
        const offset = newTrophies.length - world.battles
        const worldTrophies = newTrophies.slice(offset)
        setClearedData({ world, worldTrophies, worldScore: newWorldScore, totalScore: newTotalScore })
        setScreen('cleared')
      } else {
        setRun((r) => ({ ...r, battleIndex: run.battleIndex + 1 }))
        setBattleKey((k) => k + 1)
        setScreen('battle')
      }
    } else {
      setPendingScore({ totalScore: run.totalScore ?? 0, endWorld: world.name, cleared: false })
      setScreen('result')
    }
  }

  const handleClearContinue = () => {
    const nextWorldIndex = run.worldIndex + 1
    setClearedData(null)
    setWorldScore(0)
    if (nextWorldIndex >= worlds.length) {
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

  const handleViewScores = () => {
    setScreen('leaderboard')
  }

  const handleRestart = () => {
    clearRun()
    const fresh = createNewRun()
    setRun(fresh)
    saveRun(fresh)
    setClearedData(null)
    setMapIsTransition(false)
    setWorldScore(0)
    setPendingScore(null)
    setBattleKey((k) => k + 1)
    setScreen('start')
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'start' && (
        <motion.div key="start"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <StartScreen onStart={handleStart} />
        </motion.div>
      )}

      {screen === 'battle' && (
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
            totalScore={clearedData.totalScore}
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
            worldName={pendingScore?.endWorld ?? ''}
            onRestart={handleRestart}
            onViewScores={handleViewScores}
          />
        </motion.div>
      )}

      {screen === 'leaderboard' && (
        <motion.div key="leaderboard"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} className="w-full"
        >
          <LeaderboardScreen
            totalScore={pendingScore?.totalScore ?? 0}
            endWorld={pendingScore?.endWorld ?? ''}
            cleared={pendingScore?.cleared ?? false}
            difficulty={difficulty}
            playerName={playerName}
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
            worlds={worlds}
            currentWorldIndex={run.worldIndex}
            trophies={run.trophies}
            isTransition={mapIsTransition}
            difficulty={difficulty}
            onFight={handleFight}
            onRestart={handleRestart}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
