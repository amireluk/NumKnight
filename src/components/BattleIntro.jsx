import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'


export function BattleIntro({ onComplete, battleIndex, totalBattles, isFinal, t }) {
  const bannerControls = useAnimation()
  const roundControls  = useAnimation()

  useEffect(() => {
    async function run() {
      await new Promise((r) => setTimeout(r, battleIndex === 0 ? 530 : 460))

      if (totalBattles > 1) {
        // "ROUND N" or "FINAL ROUND" slams in
        await roundControls.start({
          y: ['-120%', '0%'],
          scale: [0.55, 1.18, 1],
          opacity: 1,
          transition: { duration: 0.2, ease: 'easeOut' },
        })
        await new Promise((r) => setTimeout(r, 140))
      }

      // "Go!" slams in
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
      if (totalBattles > 1) roundControls.start({ scale: 2.4, opacity: 0, transition: burst })
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
      {totalBattles > 1 && <motion.div
        animate={roundControls}
        initial={{ y: '-120%', scale: 0.55, opacity: 0 }}
      >
        {isFinal ? (
          <span style={{
            fontSize: 28, fontWeight: 900, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: '#ef4444',
            background: 'rgba(0,0,0,0.55)', borderRadius: 10,
            padding: '7px 22px', display: 'block',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}>
            {t?.finalRound ?? 'FINAL ROUND'}
          </span>
        ) : (
          <span style={{
            fontSize: 28, fontWeight: 900, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: '#fbbf24',
            background: 'rgba(0,0,0,0.55)', borderRadius: 10,
            padding: '7px 22px', display: 'block',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}>
            {(t?.round ?? 'ROUND')} {battleIndex + 1}
          </span>
        )}
      </motion.div>}

      <motion.div
        animate={bannerControls}
        initial={{ y: '-120%', scale: 0.5, opacity: 0 }}
      >
        <span style={{
          fontSize: 52, fontWeight: 900, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#fbbf24',
          background: 'rgba(0,0,0,0.55)', borderRadius: 14,
          padding: '10px 32px', display: 'block',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}>
          {t?.go ?? 'Go!'}
        </span>
      </motion.div>
    </div>
  )
}
