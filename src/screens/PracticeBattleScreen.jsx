import { useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { makeRound } from '../game/battleLogic'
import { playCorrect, playWrong, playSwordSwing, playImpact } from '../game/sounds'
import { KnightCharacter } from '../components/KnightCharacter'
import { AnswerButton } from '../components/AnswerButton'
import { BattleBackground } from '../components/BattleBackground'

const TOTAL_QUESTIONS = 20
const IDLE_BUTTON_STATES = ['idle', 'idle', 'idle', 'idle']

const PRAISE_EN = ['GREAT!', 'GOOD JOB!', 'AWESOME!', 'CORRECT!', 'NICE ONE!']
const PRAISE_HE = ['מעולה!', 'כל הכבוד!', 'נהדר!', 'נכון!', 'יפה מאוד!']

function ShadowBlob() {
  return (
    <div style={{
      width: 58, height: 12, borderRadius: '50%',
      background: 'rgba(0,0,0,0.32)', filter: 'blur(5px)',
      marginTop: -6, flexShrink: 0,
    }} />
  )
}

// Greyed-out knight used as the straw dummy (placeholder until real art)
function DummyCharacter({ hitKey, useRaster }) {
  return (
    <div style={{ transform: 'scaleX(-1)', filter: 'grayscale(1) brightness(0.55)' }}>
      <KnightCharacter phase="idle" hitKey={hitKey} useRaster={useRaster} />
    </div>
  )
}

// Praise popup that jumps and pops after a correct answer
function PraisePopup({ text, popKey }) {
  return (
    <AnimatePresence>
      {popKey > 0 && (
        <motion.div
          key={popKey}
          initial={{ scale: 0.3, opacity: 1, y: 10 }}
          animate={{ scale: [0.3, 1.45, 1.1, 1.1], opacity: [1, 1, 1, 0], y: [10, -14, -22, -40] }}
          transition={{ duration: 0.85, times: [0, 0.35, 0.55, 1], ease: 'easeOut' }}
          style={{
            position: 'absolute', top: '36%', left: 0, right: 0,
            display: 'flex', justifyContent: 'center',
            pointerEvents: 'none', zIndex: 10,
          }}
        >
          <span style={{
            fontSize: 30, fontWeight: 900, letterSpacing: '0.08em',
            color: '#fbbf24',
            textShadow: '0 0 22px rgba(251,191,36,0.9), 0 2px 0 rgba(0,0,0,0.8)',
          }}>
            {text}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Progress bar fills left→right as questions are completed
function ProgressBar({ completed, total }) {
  const pct = (completed / total) * 100
  return (
    <div dir="ltr" style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
      height: 5, background: 'rgba(0,0,0,0.35)',
    }}>
      <motion.div
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          height: '100%',
          background: 'linear-gradient(to right, #4ade80, #fbbf24)',
          borderRadius: '0 3px 3px 0',
        }}
      />
    </div>
  )
}

export function PracticeBattleScreen({ selectedNumbers, onPracticeEnd, onQuit, useRaster, lang, t }) {
  const shakeControls = useAnimation()
  const bgControls = useAnimation()

  const [questionNum, setQuestionNum] = useState(0)
  const [firstAttempt, setFirstAttempt] = useState(true)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(() => makeRound(selectedNumbers, [0, 10]))
  const [phase, setPhase] = useState('idle')
  const [buttonStates, setButtonStates] = useState(IDLE_BUTTON_STATES)
  const [dummyHitKey, setDummyHitKey] = useState(0)
  const [playerHitKey, setPlayerHitKey] = useState(0)
  const [flashHitKey, setFlashHitKey] = useState(0)
  const [praiseKey, setPraiseKey] = useState(0)
  const [praiseText, setPraiseText] = useState('')

  const { problem, options } = round
  const isRtl = lang === 'he'
  const praiseList = lang === 'he' ? PRAISE_HE : PRAISE_EN

  // Android back → quit
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPop = () => onQuit?.()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (selected) => {
    if (phase !== 'idle') return
    const isCorrect = selected === problem.answer

    setButtonStates(options.map((opt) => {
      if (opt === problem.answer) return 'correct'
      if (opt === selected) return 'wrong'
      return 'idle'
    }))

    if (isCorrect) {
      playCorrect()
      setPhase('attacking')
      const newScore = firstAttempt ? score + 1 : score
      const nextNum = questionNum + 1
      // Show praise popup
      const randomPraise = praiseList[Math.floor(Math.random() * praiseList.length)]
      setPraiseText(randomPraise)
      setPraiseKey((k) => k + 1)

      setTimeout(() => {
        playSwordSwing()
        setDummyHitKey((k) => k + 1)
        bgControls.start({ scale: 1.12, x: [0, 45, -22, 12, -5, 0], transition: { duration: 0.45 } })

        if (nextNum >= TOTAL_QUESTIONS) {
          setScore(newScore)
          setPhase('idle')
          setTimeout(() => onPracticeEnd(newScore), 600)
        } else {
          setScore(newScore)
          setQuestionNum(nextNum)
          setFirstAttempt(true)
          setRound(makeRound(selectedNumbers, [0, 10]))
          setButtonStates(IDLE_BUTTON_STATES)
          setPhase('idle')
        }
      }, 225)
    } else {
      playWrong()
      setFirstAttempt(false)
      setPhase('hit')

      setTimeout(() => {
        playImpact()
        setPlayerHitKey((k) => k + 1)
        setFlashHitKey((k) => k + 1)
        shakeControls.start({ x: [0, -12, 11, -8, 7, -4, 3, 0], transition: { duration: 0.5 } })
        bgControls.start({ scale: 1.12, x: [0, -45, 22, -12, 5, 0], transition: { duration: 0.45 } })
        setButtonStates(IDLE_BUTTON_STATES)
        setPhase('idle')
      }, 225)
    }
  }

  const numbersLabel = selectedNumbers.join(' · ')

  return (
    <motion.div
      animate={shakeControls}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col h-dvh max-w-md mx-auto px-1 py-2 gap-2"
      style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, #1e3a70, #2d5aaa)' }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>

        {/* Battle arena */}
        <div className="flex flex-1 min-h-0" style={{ position: 'relative', overflow: 'hidden' }}>
          <motion.div animate={bgControls} initial={{ x: 0, scale: 1.12 }} style={{ position: 'absolute', inset: 0 }}>
            <BattleBackground worldId="castle" useRaster={useRaster} />
          </motion.div>

          {/* Quit button */}
          {onQuit && (
            <button
              onClick={onQuit}
              style={{
                position: 'absolute', top: 8, left: 10, zIndex: 5,
                background: 'rgba(0,0,0,0.35)', border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: 8, padding: '4px 10px',
                fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', letterSpacing: '0.04em',
              }}
            >
              ✕
            </button>
          )}

          {/* Top header: PRACTICE label + selected numbers */}
          <div style={{
            position: 'absolute', top: 10, left: 0, right: 0, zIndex: 4,
            display: 'flex', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.45)', borderRadius: 10,
              padding: '4px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
            }}>
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                {t?.practice ?? 'PRACTICE'}
              </span>
              <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '0.12em', color: '#fbbf24', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                {numbersLabel}
              </span>
            </div>
          </div>

          {/* Characters — dir=ltr so RTL never flips positions */}
          <div dir="ltr" className="flex flex-1 justify-around items-end" style={{ position: 'relative', zIndex: 1, paddingBottom: 8 }}>
            {/* Player knight */}
            <div className="flex flex-col items-center" style={{
              zIndex: phase === 'attacking' ? 2 : 1, position: 'relative',
              marginBottom: useRaster ? 11 : 0,
            }}>
              <KnightCharacter phase={phase} hitKey={playerHitKey} useRaster={useRaster} />
              <ShadowBlob />
            </div>

            {/* Straw dummy (greyed knight) */}
            <div className="flex flex-col items-center" style={{
              zIndex: 1, position: 'relative',
              marginBottom: useRaster ? 11 : 0,
            }}>
              <DummyCharacter hitKey={dummyHitKey} useRaster={useRaster} />
              <ShadowBlob />
            </div>
          </div>

          {/* Praise popup — floats between knights */}
          <PraisePopup text={praiseText} popKey={praiseKey} />

          {/* Progress bar — bottom edge of arena */}
          <ProgressBar completed={questionNum} total={TOTAL_QUESTIONS} />
        </div>

        {/* Problem card */}
        <div className="bg-white/10 border border-white/20 rounded-3xl py-5 px-4 text-center shadow-xl">
          <p className="text-5xl font-black text-white tracking-wide">
            {problem.a} × {problem.b} = ?
          </p>
        </div>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          {options.map((opt, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18, delay: i * 0.06 }}
            >
              <AnswerButton
                value={opt} index={i} onClick={handleAnswer}
                disabled={phase !== 'idle'}
                state={buttonStates[i]}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Red screen flash on wrong answer */}
      {flashHitKey > 0 && (
        <motion.div
          key={flashHitKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.35, 0] }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', inset: 0, background: 'red', pointerEvents: 'none', zIndex: 15 }}
        />
      )}
    </motion.div>
  )
}
