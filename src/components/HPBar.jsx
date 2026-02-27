import { motion } from 'framer-motion'

export function HPBar({ current, max, color = 'green' }) {
  const isGreen = color === 'green'

  return (
    <div className="flex flex-col justify-center gap-1.5">
      {Array.from({ length: max }, (_, i) => {
        // Drain from top: top cells empty first as HP drops
        const filled = i >= max - current

        return (
          <motion.div
            key={i}
            animate={{
              backgroundColor: filled
                ? isGreen ? '#22c55e' : '#ef4444'
                : '#1f2937',
              boxShadow: filled
                ? isGreen
                  ? '0 0 6px rgba(34,197,94,0.5)'
                  : '0 0 6px rgba(239,68,68,0.5)'
                : 'none',
            }}
            transition={{ duration: 0.3 }}
            style={{ width: 14, height: 22, borderRadius: 4 }}
            className={`border ${
              filled
                ? isGreen ? 'border-green-400' : 'border-red-400'
                : 'border-gray-700'
            }`}
          />
        )
      })}
    </div>
  )
}
