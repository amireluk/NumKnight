import { motion } from 'framer-motion'
import { KingdomBackground, KingdomForeground, StrollingKnight } from '../components/KingdomScenery'
import { FlyingCreatures } from '../components/FlyingCreatures'

const TOTAL_QUESTIONS = 20

export function PracticeEndScreen({ score, selectedNumbers, onPracticeAgain, onChangeNumbers, difficulty, useRaster, lang, t }) {
  const isRtl = lang === 'he'
  const perfect = score === TOTAL_QUESTIONS

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col items-center justify-center h-dvh max-w-md mx-auto px-6 select-none"
      style={{
        background: 'linear-gradient(to bottom, #1e3a70, #2d5aaa)',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: 210,
      }}
    >
      <FlyingCreatures difficulty={difficulty} />
      {useRaster ? (
        <img
          src={`${import.meta.env.BASE_URL}assets/backgrounds/title.webp`}
          alt=""
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', display: 'block', zIndex: 1, pointerEvents: 'none',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%)' }}
        />
      ) : (
        <>
          <KingdomBackground />
          <KingdomForeground difficulty={difficulty} />
        </>
      )}
      <StrollingKnight />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', position: 'relative', zIndex: 4 }}
      >
        {/* Good job text */}
        <motion.p
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          style={{
            fontSize: 36, fontWeight: 900, letterSpacing: '0.1em',
            color: perfect ? '#fbbf24' : 'white',
            textShadow: perfect
              ? '0 0 24px rgba(251,191,36,0.7), 0 2px 0 rgba(0,0,0,0.5)'
              : '0 2px 0 rgba(0,0,0,0.5)',
          }}
        >
          {t?.practiceGoodJob ?? 'GOOD JOB!'}
        </motion.p>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          style={{
            background: 'rgba(0,0,0,0.35)', border: '1.5px solid rgba(255,255,255,0.18)',
            borderRadius: 20, padding: '16px 32px', textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '0.04em', margin: 0 }}>
            {t?.practiceResultText
              ? t.practiceResultText(score)
              : `You got ${score} right!`}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
            onClick={onPracticeAgain}
            className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
          >
            {t?.practiceAgain ? t.practiceAgain(selectedNumbers) : `PRACTICE AGAIN  ${selectedNumbers.join(', ')}`}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
            onClick={onChangeNumbers}
            className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-xl rounded-2xl h-14 shadow-xl cursor-pointer tracking-widest"
          >
            {t?.practiceNewNumbers ?? 'NEW NUMBERS'}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
