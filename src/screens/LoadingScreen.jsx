import { motion } from 'framer-motion'
import { LogoBanner } from '../components/LogoBanner'

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div
        animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.04, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <LogoBanner />
      </motion.div>
    </motion.div>
  )
}
