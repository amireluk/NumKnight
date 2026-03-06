import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

export function BattleIntro({ onComplete, battleIndex, isFinal }) {
  const bannerControls = useAnimation()
  const roundControls  = useAnimation()
  const finalControls  = useAnimation()

  useEffect(() => {
    async function run() {
      await new Promise((r) => setTimeout(r, battleIndex === 0 ? 530 : 460))

      // "ROUND N" slams in
      await roundControls.start({
        y: ['-120%', '0%'],
        scale: [0.55, 1.18, 1],
        opacity: 1,
        transition: { duration: 0.2, ease: 'easeOut' },
      })
      await new Promise((r) => setTimeout(r, isFinal ? 100 : 120))

      // "FINAL ROUND" slams in below (only on last battle of the world)
      if (isFinal) {
        await finalControls.start({
          y: ['-120%', '0%'],
          scale: [0.55, 1.18, 1],
          opacity: 1,
          transition: { duration: 0.2, ease: 'easeOut' },
        })
        await new Promise((r) => setTimeout(r, 200))
      }

      // Sword slams in
      await bannerControls.start({
        y: ['-120%', '0%'],
        scale: [0.5, 1.12, 1],
        opacity: 1,
        transition: { duration: 0.2, ease: 'easeOut' },
      })

      // Hold
      await new Promise((r) => setTimeout(r, 340))

      // Everything bursts off
      const burst = { duration: 0.18, ease: 'easeIn' }
      roundControls.start({ scale: 2.4, opacity: 0, transition: burst })
      if (isFinal) finalControls.start({ scale: 2.4, opacity: 0, transition: burst })
      await bannerControls.start({ scale: 2.6, opacity: 0, transition: burst })

      onComplete()
    }
    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 6, pointerEvents: 'none',
    }}>
      <motion.div
        animate={roundControls}
        initial={{ y: '-120%', scale: 0.55, opacity: 0 }}
        style={{ textAlign: 'center' }}
      >
        <span style={{
          fontSize: 30, fontWeight: 900, letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#fbbf24',
          WebkitTextStroke: '1.5px #7c3a00',
          filter: 'drop-shadow(0 0 14px rgba(251,191,36,0.85)) drop-shadow(0 3px 0 rgba(0,0,0,0.8))',
          display: 'block',
        }}>
          ROUND {battleIndex + 1}
        </span>
      </motion.div>

      {isFinal && (
        <motion.div
          animate={finalControls}
          initial={{ y: '-120%', scale: 0.55, opacity: 0 }}
          style={{ textAlign: 'center' }}
        >
          <span style={{
            fontSize: 22, fontWeight: 900, letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#ef4444',
            WebkitTextStroke: '1.5px #7f1d1d',
            filter: 'drop-shadow(0 0 14px rgba(239,68,68,0.85)) drop-shadow(0 3px 0 rgba(0,0,0,0.8))',
            display: 'block',
          }}>
            FINAL ROUND
          </span>
        </motion.div>
      )}

      <motion.div
        animate={bannerControls}
        initial={{ y: '-120%', scale: 0.5, opacity: 0 }}
      >
        <span style={{ fontSize: 96, filter: 'drop-shadow(0 0 28px rgba(251,191,36,0.9))' }}>
          ⚔️
        </span>
      </motion.div>
    </div>
  )
}
