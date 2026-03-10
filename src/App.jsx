import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BattleScreen } from './screens/BattleScreen'
import { ResultScreen } from './screens/ResultScreen'
import { WorldMapScreen } from './screens/WorldMapScreen'
import { AreaClearedScreen } from './screens/AreaClearedScreen'
import { LeaderboardScreen } from './screens/LeaderboardScreen'
import { VictoryScreen } from './screens/VictoryScreen'
import { StartScreen } from './screens/StartScreen'
import { DesignScreen } from './screens/DesignScreen'
import { EASY, MEDIUM, HARD, DEV } from './game/campaign.config'
import { createNewRun, loadRun, saveRun, clearRun, isRunInProgress, clearBattleState } from './game/runState'
import { getTrophy, calcBattleScore } from './game/battleLogic'
import { LANG_KEY, T } from './game/i18n'
import { clearLog } from './game/runLog'
import { RunLogViewer } from './components/RunLogViewer'

const CONFIGS = { easy: EASY, medium: MEDIUM, hard: HARD }
const IS_DEV_MODE = new URLSearchParams(window.location.search).has('dev')

export default function App() {
  const [difficulty, setDifficulty] = useState(() => loadRun()?.difficulty ?? 'medium')
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('numknight_player_name') ?? '')
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) ?? 'he')

  const handleLangChange = (l) => { setLang(l); localStorage.setItem(LANG_KEY, l) }
  const t = T[lang] ?? T.en

  const worlds = IS_DEV_MODE ? DEV : (CONFIGS[difficulty] ?? MEDIUM)
  const totalBattles = worlds.reduce((sum, w) => sum + w.battles, 0)

  const [run, setRun] = useState(() => loadRun() ?? createNewRun())
  const [screen, setScreen] = useState(
    () => window.location.search.includes('design') ? 'design' : IS_DEV_MODE ? 'map' : 'start'
  )
  const [clearedData, setClearedData] = useState(null)
  const [battleKey, setBattleKey] = useState(0)
  const [mapIsTransition, setMapIsTransition] = useState(false)
  const [worldScore, setWorldScore] = useState(() => loadRun()?.currentWorldScore ?? 0)
  // Holds score context passed to leaderboard
  const [pendingScore, setPendingScore] = useState(null)
  const [showLog, setShowLog] = useState(false)

  const world = worlds[run.worldIndex]

  useEffect(() => { saveRun({ ...run, currentWorldScore: worldScore }) }, [run, worldScore])

  const handleContinue = () => {
    const saved = loadRun()
    if (!saved) return
    setDifficulty(saved.difficulty ?? 'medium')
    setRun(saved)
    setWorldScore(saved.currentWorldScore ?? 0)
    setBattleKey((k) => k + 1)
    setScreen('battle')
  }

  const handleQuitBattle = () => {
    setScreen('start')
  }

  const handleStart = ({ name, diff }) => {
    setPlayerName(name)
    setDifficulty(diff)
    clearRun()
    clearBattleState()
    clearLog()
    const fresh = createNewRun(diff)
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
      setPendingScore({ totalScore: run.totalScore ?? 0, endWorld: world.name, endWorldId: world.id, endEnemy: world.enemy, cleared: false })
      setScreen('result')
    }
  }

  const handleClearContinue = () => {
    const nextWorldIndex = run.worldIndex + 1
    if (nextWorldIndex >= worlds.length || clearedData?.isVictory) {
      setPendingScore({ totalScore: clearedData.totalScore, endWorld: clearedData.world.name, cleared: true })
      setClearedData(null)
      setWorldScore(0)
      setScreen('victory')
      return
    }
    setClearedData(null)
    setWorldScore(0)
    setRun((r) => ({ ...r, worldIndex: nextWorldIndex, battleIndex: 0 }))
    setMapIsTransition(true)
    setScreen('map')
  }

  const handleFight = (worldIndex) => {
    if (IS_DEV_MODE && worldIndex != null) {
      setRun((r) => ({ ...r, worldIndex, battleIndex: 0 }))
      setWorldScore(0)
    }
    setMapIsTransition(false)
    setBattleKey((k) => k + 1)
    setScreen('battle')
  }

  const handleVictoryContinue = () => {
    setScreen('leaderboard')
  }

  const handleViewScores = () => {
    setScreen('leaderboard')
  }

  const handleViewLeaderboard = () => {
    setPendingScore(null)
    setScreen('leaderboard')
  }

  const handleRestart = () => {
    clearRun()
    clearBattleState()
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
    <>
    <AnimatePresence mode="wait">
      {screen === 'design' && (
        <motion.div key="design"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} className="w-full"
        >
          <DesignScreen onExit={() => setScreen('start')} />
        </motion.div>
      )}

      {screen === 'start' && (
        <motion.div key="start"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <StartScreen onStart={handleStart} onContinue={handleContinue} run={run} onViewLeaderboard={handleViewLeaderboard} onLogoLongPress={() => setShowLog(true)} lang={lang} onLangChange={handleLangChange} t={t} />
        </motion.div>
      )}

      {screen === 'battle' && (
        <motion.div key="battle-screen"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <BattleScreen key={battleKey} world={world} worldIndex={run.worldIndex} battleIndex={run.battleIndex} onBattleEnd={handleBattleEnd} onQuit={handleQuitBattle} lang={lang} t={t} />
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
            enemy={pendingScore?.endEnemy ?? null}
            totalScore={pendingScore?.totalScore ?? 0}
            onRestart={handleRestart}
            onViewScores={handleViewScores}
            lang={lang} t={t}
          />
        </motion.div>
      )}

      {screen === 'victory' && (
        <motion.div key="victory"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} className="w-full"
        >
          <VictoryScreen
            playerName={playerName}
            totalScore={pendingScore?.totalScore ?? 0}
            onContinue={handleVictoryContinue}
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
            onBack={handleRestart}
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
            isDevMode={IS_DEV_MODE}
            onFight={handleFight}
            onRestart={handleRestart}
            onBack={() => setScreen('start')}
            onLogoLongPress={() => setShowLog(true)}
            lang={lang} t={t}
          />
        </motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>
      {showLog && <RunLogViewer onClose={() => setShowLog(false)} />}
    </AnimatePresence>
    </>
  )
}
