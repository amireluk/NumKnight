import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

// Banner-only intro — no own background, no duplicate characters.
// Characters slide in via BattleScreen so there's no position jump when the overlay clears.
export function BattleIntro({ onComplete }) {
  const bannerControls = useAnimation()

  useEffect(() => {
    async function run() {
      // Wait for characters to land + screen shake (handled by BattleScreen at 500ms)
      await new Promise((r) => setTimeout(r, 650))

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
      await bannerControls.start({
        scale: 2.6,
        opacity: 0,
        transition: { duration: 0.18, ease: 'easeIn' },
      })

      onComplete()
    }

    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // No background — hills show through. Just an overlay for the banner.
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
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
