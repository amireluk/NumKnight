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
import { LANG_KEY, T } from './game/i18n'

const CONFIGS = { easy: EASY, medium: MEDIUM, hard: HARD }

export default function App() {
  const [difficulty, setDifficulty] = useState('medium')
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('numknight_player_name') ?? '')
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) ?? 'he')

  const handleLangChange = (l) => { setLang(l); localStorage.setItem(LANG_KEY, l) }
  const t = T[lang] ?? T.en

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
      const isVictory = newTrophies.length >= totalBattles
      const isLastBattleInWorld = run.battleIndex + 1 >= world.battles

      const newWorldScores = [...(run.worldScores || [])]
      if (isVictory || isLastBattleInWorld) newWorldScores[run.worldIndex] = newWorldScore

      const newRun = { ...run, trophies: newTrophies, totalScore: newTotalScore, worldScores: newWorldScores }
      setRun(newRun)
      saveRun(newRun)
      setWorldScore(newWorldScore)

      if (isVictory || isLastBattleInWorld) {
        const offset = newTrophies.length - world.battles
        const worldTrophies = newTrophies.slice(offset)
        setClearedData({ world, worldTrophies, worldScore: newWorldScore, totalScore: newTotalScore, isVictory })
        setScreen('cleared')
      } else {
        setRun((r) => ({ ...r, battleIndex: run.battleIndex + 1 }))
        setBattleKey((k) => k + 1)
        setScreen('battle')
      }
    } else {
      setPendingScore({ totalScore: run.totalScore ?? 0, endWorld: world.name, endWorldId: world.id, cleared: false })
      setScreen('result')
    }
  }

  const handleClearContinue = () => {
    const nextWorldIndex = run.worldIndex + 1
    if (nextWorldIndex >= worlds.length || clearedData?.isVictory) {
      setPendingScore({ totalScore: clearedData.totalScore, endWorld: clearedData.world.name, cleared: true })
      setClearedData(null)
      setWorldScore(0)
      setScreen('leaderboard')
      return
    }
    setClearedData(null)
    setWorldScore(0)
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
          <StartScreen onStart={handleStart} lang={lang} onLangChange={handleLangChange} t={t} />
        </motion.div>
      )}

      {screen === 'battle' && (
        <motion.div key="battle-screen"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <BattleScreen key={battleKey} world={world} battleIndex={run.battleIndex} onBattleEnd={handleBattleEnd} lang={lang} t={t} />
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
            lang={lang} t={t}
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
            worldId={pendingScore?.endWorldId ?? 'forest'}
            totalScore={pendingScore?.totalScore ?? 0}
            onRestart={handleRestart}
            onViewScores={handleViewScores}
            lang={lang} t={t}
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
            lang={lang} t={t}
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
            worldScores={run.worldScores ?? []}
            isTransition={mapIsTransition}
            difficulty={difficulty}
            onFight={handleFight}
            onRestart={handleRestart}
            lang={lang} t={t}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
