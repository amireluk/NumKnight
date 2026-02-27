import { motion } from 'framer-motion'

export function HPBar({ current, max, color = 'green' }) {
  const percent = Math.max(0, (current / max) * 100)

  const barColor =
    color === 'green'
      ? percent > 50
        ? 'bg-green-500'
        : percent > 25
        ? 'bg-yellow-500'
        : 'bg-red-500'
      : 'bg-red-500'

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span className="font-semibold">
          {'❤️'.repeat(Math.max(0, current))}
        </span>
        <span>
          {current}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
