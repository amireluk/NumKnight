import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BattleScreen } from './screens/BattleScreen'
import { ResultScreen } from './screens/ResultScreen'
import { WorldMapScreen } from './screens/WorldMapScreen'
import { AreaClearedScreen } from './screens/AreaClearedScreen'
import { LeaderboardScreen } from './screens/LeaderboardScreen'
import { VictoryScreen } from './screens/VictoryScreen'
import { StartScreen } from './screens/StartScreen'
import { OptionsScreen } from './screens/OptionsScreen'
import { CampfireScreen } from './screens/CampfireScreen'
import { PracticePickerScreen } from './screens/PracticePickerScreen'
import { PracticeBattleScreen } from './screens/PracticeBattleScreen'
import { PracticeEndScreen } from './screens/PracticeEndScreen'
import { StatsScreen } from './screens/StatsScreen'
import { NameEntryScreen } from './screens/NameEntryScreen'
import { LoadingScreen } from './screens/LoadingScreen'
import { preloadCritical, preloadBackground } from './game/preload'
import { EASY, MEDIUM, HARD, DEV } from './game/campaign.config'
import { createNewRun, loadRun, saveRun, clearRun, clearBattleState } from './game/runState'
import { getTrophy, calcBattleScore } from './game/battleLogic'
import { LANG_KEY, T } from './game/i18n'
import { clearLog } from './game/runLog'

const CONFIGS = { easy: EASY, medium: MEDIUM, hard: HARD }
const IS_DEV_MODE = new URLSearchParams(window.location.search).has('dev')

export default function App() {
  const [difficulty, setDifficulty] = useState(() => loadRun()?.difficulty ?? localStorage.getItem('numknight_difficulty') ?? 'medium')
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('numknight_player_name') ?? '')
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) ?? 'he')

  const handleLangChange = (l) => { setLang(l); localStorage.setItem(LANG_KEY, l) }
  const handleDifficultyChange = (d) => {
    setDifficulty(d)
    localStorage.setItem('numknight_difficulty', d)
    clearRun()
    setRun(createNewRun(d))
  }
  const t = T[lang] ?? T.en

  const worlds = IS_DEV_MODE ? DEV : (CONFIGS[difficulty] ?? MEDIUM)
  const totalBattles = worlds.reduce((sum, w) => sum + w.battles, 0)

  const [run, setRun] = useState(() => loadRun() ?? createNewRun())
  const [screen, setScreen] = useState('start')
  const [clearedData, setClearedData] = useState(null)
  const [battleKey, setBattleKey] = useState(0)
  const [mapIsTransition, setMapIsTransition] = useState(false)
  const [worldScore, setWorldScore] = useState(() => loadRun()?.currentWorldScore ?? 0)
  // Holds score context passed to leaderboard
  const [pendingScore, setPendingScore] = useState(null)
  const [activeBoost, setActiveBoost] = useState(null)
  const RASTER_KEY = 'numknight_raster_bg'
  const [useRaster, setUseRaster] = useState(() => {
    const stored = localStorage.getItem(RASTER_KEY)
    return stored === null ? true : stored === 'true'
  })

  // Practice mode state
  const [practiceNumbers, setPracticeNumbers] = useState([])
  const [practiceScore, setPracticeScore] = useState(0)
  const [practiceBattleKey, setPracticeBattleKey] = useState(0)
  const handleRasterChange = (val) => { setUseRaster(val); localStorage.setItem(RASTER_KEY, String(val)) }

  // Asset preloading — only blocks on title.webp; everything else loads in background
  const [assetsReady, setAssetsReady] = useState(() => !useRaster)
  const [showLoader,  setShowLoader]  = useState(false)
  useEffect(() => {
    if (!useRaster) return
    preloadBackground()
    const threshold = setTimeout(() => setShowLoader(true), 20)
    preloadCritical().then(() => { clearTimeout(threshold); setAssetsReady(true) })
  }, []) // eslint-disable-line

  const world = worlds[run.worldIndex]

  // Apply campfire boost to the world before passing to BattleScreen
  const battleWorld = (() => {
    if (!world) return world
    if (activeBoost === 'weakSpot' && world.enemy.id === 'dragon') {
      return { ...world, enemy: { ...world.enemy, hp: Math.max(1, world.enemy.hp - 1), maxHp: world.enemy.hp } }
    }
    if (activeBoost === 'steadyNerves' && world.timer) {
      return { ...world, timer: world.timer + 3 }
    }
    return world
  })()

  useEffect(() => { if (run?.started) saveRun({ ...run, currentWorldScore: worldScore }) }, [run, worldScore])

  const handleContinue = () => {
    const saved = loadRun()
    if (!saved) { clearBattleState(); setScreen('start'); return }
    setDifficulty(saved.difficulty ?? 'medium')
    setRun({ ...saved, started: true })
    setWorldScore(saved.currentWorldScore ?? 0)
    const savedWorlds = CONFIGS[saved.difficulty ?? 'medium'] ?? MEDIUM
    const savedWorld = savedWorlds[saved.worldIndex]
    const isDragonLair = savedWorld?.enemy?.id === 'dragon'
    const campfireUsed = saved.campfireUsed ?? false
    if (isDragonLair && !campfireUsed) {
      setScreen('campfire')
      return
    }
    setBattleKey((k) => k + 1)
    setScreen('battle')
  }

  const handleQuitBattle = () => {
    setScreen('start')
  }

  // Called when user taps NEW GAME — goes to name-entry first if no name set
  const handleNewGame = () => {
    if (!playerName) { setScreen('name-entry'); return }
    startNewGame()
  }

  const startNewGame = () => {
    // Re-read name in case it was just set in Options
    const name = localStorage.getItem('numknight_player_name') ?? ''
    setPlayerName(name)
    clearRun()
    clearBattleState()
    clearLog()
    const fresh = { ...createNewRun(difficulty), started: true }
    setRun(fresh)
    saveRun(fresh)
    setBattleKey(0)
    setWorldScore(0)
    setMapIsTransition(false)
    setPendingScore(null)
    setActiveBoost(null)
    setScreen('map')
  }

  const handleBattleEnd = ({ won, mistakes, timeBonus = 0 }) => {
    if (won) {
      const trophy = getTrophy(mistakes)
      const rawScore = calcBattleScore(trophy, timeBonus, run.worldIndex, difficulty)
      const battleScore = activeBoost === 'chronicle' ? rawScore + 100 : rawScore
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
    const targetIndex = (IS_DEV_MODE && worldIndex != null) ? worldIndex : run.worldIndex
    if (IS_DEV_MODE && worldIndex != null) {
      setRun((r) => ({ ...r, worldIndex, battleIndex: 0 }))
      setWorldScore(0)
    }
    setMapIsTransition(false)
    const targetWorld = worlds[targetIndex]
    const isDragonLair = targetWorld?.enemy?.id === 'dragon'
    const campfireUsed = run.campfireUsed ?? false
    if (isDragonLair && !campfireUsed) {
      setScreen('campfire')
      return
    }
    setBattleKey((k) => k + 1)
    setScreen('battle')
  }

  const handleBoostChosen = (boost) => {
    setActiveBoost(boost)
    const updatedRun = { ...run, campfireUsed: true }
    setRun(updatedRun)
    saveRun(updatedRun)
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
    setClearedData(null)
    setMapIsTransition(false)
    setWorldScore(0)
    setPendingScore(null)
    setActiveBoost(null)
    setBattleKey((k) => k + 1)
    setScreen('start')
  }

  const handlePracticeStart = (numbers) => {
    setPracticeNumbers(numbers)
    setPracticeBattleKey((k) => k + 1)
    setScreen('practice-battle')
  }

  const handlePracticeEnd = (score) => {
    setPracticeScore(score)
    setScreen('practice-end')
  }

  const handlePracticeAgain = () => {
    setPracticeBattleKey((k) => k + 1)
    setScreen('practice-battle')
  }

  const handlePracticeChangeNumbers = () => {
    setScreen('practice-picker')
  }

  if (!assetsReady) return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(to bottom, #1e3a70, #2d5aaa)' }}>
      <AnimatePresence>{showLoader && <LoadingScreen key="loader" />}</AnimatePresence>
    </div>
  )

  return (
    <>
    <AnimatePresence mode="wait">
{screen === 'start' && (
        <motion.div key="start"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <StartScreen
            onNewGame={handleNewGame}
            onContinue={handleContinue}
            onOptions={() => setScreen('options')}
            onViewLeaderboard={handleViewLeaderboard}
            onPractice={() => setScreen('practice-picker')}
            playerName={playerName}
            difficulty={difficulty}
            useRaster={useRaster}
            lang={lang} t={t}
          />
        </motion.div>
      )}

      {screen === 'options' && (
        <motion.div key="options"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <OptionsScreen
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            useRaster={useRaster}
            onRasterChange={handleRasterChange}
            lang={lang}
            onLangChange={handleLangChange}
            onBack={() => {
              const newName = localStorage.getItem('numknight_player_name') ?? ''
              if (newName !== playerName) {
                clearRun()
                setRun(createNewRun(difficulty))
              }
              setPlayerName(newName)
              setScreen('start')
            }}
            onStats={() => {
              setPlayerName(localStorage.getItem('numknight_player_name') ?? '')
              setScreen('stats')
            }}
            t={t}
          />
        </motion.div>
      )}

      {screen === 'name-entry' && (
        <motion.div key="name-entry"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <NameEntryScreen
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            lang={lang}
            onLangChange={handleLangChange}
            useRaster={useRaster}
            onStart={(name) => {
              setPlayerName(name)
              startNewGame()
            }}
            t={t}
          />
        </motion.div>
      )}

      {screen === 'battle' && (
        <motion.div key="battle-screen"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <BattleScreen key={battleKey} world={battleWorld} worldIndex={run.worldIndex} battleIndex={run.battleIndex} onBattleEnd={handleBattleEnd} onQuit={handleQuitBattle} scoreBonus={activeBoost === 'chronicle' ? 100 : 0} useRaster={useRaster} playerName={playerName} lang={lang} t={t} />
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
            useRaster={useRaster}
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
            useRaster={useRaster}
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
            useRaster={useRaster}
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
            useRaster={useRaster}
            lang={lang} t={t}
          />
        </motion.div>
      )}

      {screen === 'campfire' && (
        <motion.div key="campfire"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }} className="w-full"
        >
          <CampfireScreen onBoostChosen={handleBoostChosen} onBack={() => setScreen('map')} useRaster={useRaster} lang={lang} t={t} />
        </motion.div>
      )}

      {screen === 'practice-picker' && (
        <motion.div key="practice-picker"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <PracticePickerScreen
            onStart={handlePracticeStart}
            onBack={() => setScreen('start')}
            difficulty={difficulty}
            playerName={playerName}
            useRaster={useRaster}
            lang={lang} t={t}
          />
        </motion.div>
      )}

      {screen === 'practice-battle' && (
        <motion.div key={`practice-battle-${practiceBattleKey}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <PracticeBattleScreen
            key={practiceBattleKey}
            selectedNumbers={practiceNumbers}
            onPracticeEnd={handlePracticeEnd}
            onQuit={() => setScreen('start')}
            useRaster={useRaster}
            playerName={playerName}
            lang={lang} t={t}
          />
        </motion.div>
      )}

      {screen === 'practice-end' && (
        <motion.div key="practice-end"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <PracticeEndScreen
            score={practiceScore}
            selectedNumbers={practiceNumbers}
            onPracticeAgain={handlePracticeAgain}
            onChangeNumbers={handlePracticeChangeNumbers}
            difficulty={difficulty}
            useRaster={useRaster}
            lang={lang} t={t}
          />
        </motion.div>
      )}

      {screen === 'stats' && (
        <motion.div key="stats"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }} className="w-full"
        >
          <StatsScreen
            onBack={() => setScreen('options')}
            playerName={playerName}
            difficulty={difficulty}
            useRaster={useRaster}
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
            useRaster={useRaster}
            lang={lang} t={t}
          />
        </motion.div>
      )}
    </AnimatePresence>

    {IS_DEV_MODE && (
      <button
        onClick={() => { localStorage.clear(); window.location.reload() }}
        style={{
          position: 'fixed', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, padding: '6px 16px', borderRadius: 8,
          background: 'rgba(220,38,38,0.85)', border: '1.5px solid rgba(255,100,100,0.4)',
          color: 'white', fontSize: 11, fontWeight: 900, letterSpacing: '0.08em',
          cursor: 'pointer',
        }}
      >
        ⚠ RESET ALL STATE
      </button>
    )}
</>
  )
}
