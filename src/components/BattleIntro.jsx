import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { KnightCharacter } from './KnightCharacter'
import { EnemyCharacter } from './EnemyCharacter'

export function BattleIntro({ onComplete }) {
  const shakeControls = useAnimation()
  const bannerControls = useAnimation()
  const overlayControls = useAnimation()

  useEffect(() => {
    async function run() {
      // Characters slide in simultaneously (handled by their own initial/animate)
      // 500ms for slide-in, then shake
      await new Promise((r) => setTimeout(r, 500))

      // Screen shake on landing
      shakeControls.start({
        x: [0, -8, 7, -5, 4, -2, 0],
        transition: { duration: 0.3 },
      })
      await new Promise((r) => setTimeout(r, 150))

      // Banner slams in
      await bannerControls.start({
        y: ['-120%', '0%'],
        scale: [0.5, 1.12, 1],
        opacity: 1,
        transition: { duration: 0.2, ease: 'easeOut' },
      })

      // Hold
      await new Promise((r) => setTimeout(r, 350))

      // Banner bursts off
      bannerControls.start({
        scale: [1, 2.6],
        opacity: [1, 0],
        transition: { duration: 0.18, ease: 'easeIn' },
      })
      await new Promise((r) => setTimeout(r, 200))

      // Overlay fades out
      await overlayControls.start({
        opacity: 0,
        transition: { duration: 0.25 },
      })

      onComplete()
    }

    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      animate={overlayControls}
      initial={{ opacity: 1 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, #0d0d1e, #1a1040)',
      }}
    >
      <motion.div
        animate={shakeControls}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          paddingBottom: 24,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* Knight slides in from left */}
        <motion.div
          initial={{ x: -220, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <KnightCharacter phase="idle" hitKey={0} />
        </motion.div>

        {/* Goblin slides in from right */}
        <motion.div
          initial={{ x: 220, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <EnemyCharacter phase="idle" hitKey={0} />
        </motion.div>
      </motion.div>

      {/* ⚔️ banner */}
      <motion.div
        animate={bannerControls}
        initial={{ y: '-120%', scale: 0.5, opacity: 0 }}
        style={{ position: 'absolute', top: '35%' }}
      >
        <span style={{ fontSize: 96, filter: 'drop-shadow(0 0 24px rgba(251,191,36,0.8))' }}>
          ⚔️
        </span>
      </motion.div>
    </motion.div>
  )
}
