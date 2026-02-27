import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BattleScreen } from './screens/BattleScreen'
import { ResultScreen } from './screens/ResultScreen'
import { DEFAULT_WORLD } from './game/worldConfig'

export default function App() {
  const [screen, setScreen] = useState('battle')
  const [battleResult, setBattleResult] = useState(null)
  const [battleKey, setBattleKey] = useState(0)

  const handleBattleEnd = ({ won, mistakes }) => {
    setBattleResult({ won, mistakes })
    setScreen('result')
  }

  const handlePlayAgain = () => {
    setBattleResult(null)
    setBattleKey((k) => k + 1) // forces BattleScreen to fully reset
    setScreen('battle')
  }

  return (
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
            world={DEFAULT_WORLD}
            onBattleEnd={handleBattleEnd}
          />
        </motion.div>
      ) : (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <ResultScreen
            won={battleResult?.won}
            mistakes={battleResult?.mistakes ?? 0}
            enemy={DEFAULT_WORLD.enemies[0]}
            onPlayAgain={handlePlayAgain}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
