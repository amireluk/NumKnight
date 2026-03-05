import { motion } from 'framer-motion'

// SVG coordinate space
const VW = 360
const VH = 500

// Node positions [cx, cy] in SVG units — winding left-right-left-right-center
const NODE_POS = [
  [72,  440],  // 0 Forest
  [285, 360],  // 1 Swamp
  [75,  265],  // 2 Mountains
  [275, 162],  // 3 Castle
  [180,  58],  // 4 Dragon Lair
]

// Cubic-bezier path through all five nodes
const PATH =
  'M 72 440' +
  ' C 72 395 285 395 285 360' +
  ' C 285 325 75 305 75 265' +
  ' C 75 225 275 202 275 162' +
  ' C 275 115 180 95 180 58'

const TROPHY_EMOJI = { gold: '🥇', silver: '🥈', bronze: '🥉' }

// Derive best trophy for a given world from the flat trophies array
function getBestTrophy(trophies, worlds, worldIndex) {
  const offset = worlds.slice(0, worldIndex).reduce((sum, w) => sum + w.battles, 0)
  const slice = trophies.slice(offset, offset + worlds[worldIndex].battles)
  if (slice.includes('gold'))   return 'gold'
  if (slice.includes('silver')) return 'silver'
  if (slice.includes('bronze')) return 'bronze'
  return null
}

function WorldNode({ world, index, status, trophy, delay }) {
  const [cx, cy] = NODE_POS[index]
  const isCurrent = status === 'current'
  const isLocked  = status === 'locked'

  const circleStyle = {
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    position: 'relative',
    flexShrink: 0,
    ...(status === 'completed' && {
      background: '#1a1040',
      border: '2.5px solid rgba(251,191,36,0.8)',
      boxShadow: '0 0 14px rgba(251,191,36,0.35)',
    }),
    ...(isCurrent && {
      background: '#2d1060',
      border: '2.5px solid #fbbf24',
      boxShadow: '0 0 22px rgba(251,191,36,0.7)',
    }),
    ...(isLocked && {
      background: '#090916',
      border: '2px solid rgba(255,255,255,0.10)',
    }),
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${(cx / VW) * 100}%`,
        top:  `${(cy / VH) * 100}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isLocked ? 0.38 : 1 }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 18 }}
    >
      {/* Pulse ring — current world only */}
      {isCurrent && (
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: '2px solid rgba(251,191,36,0.65)',
            translateX: '-50%',
            translateY: '-50%',
            // offset the label below the circle
            marginTop: -20,
          }}
          animate={{ scale: [1, 1.65, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
        />
      )}

      {/* Node circle */}
      <div style={circleStyle}>
        <span style={{ filter: isLocked ? 'grayscale(1) brightness(0.5)' : undefined }}>
          {world.icon}
        </span>

        {/* Trophy badge — top-right corner */}
        {trophy && (
          <span style={{
            position: 'absolute',
            top: -7,
            right: -9,
            fontSize: 17,
            lineHeight: 1,
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))',
          }}>
            {TROPHY_EMOJI[trophy]}
          </span>
        )}
      </div>

      {/* World name label */}
      <span style={{
        fontSize: 9.5,
        fontWeight: 800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: isLocked
          ? 'rgba(255,255,255,0.22)'
          : isCurrent
            ? '#fbbf24'
            : 'rgba(255,255,255,0.65)',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}>
        {world.name}
      </span>
    </motion.div>
  )
}

export function WorldMapScreen({ worlds, currentWorldIndex, trophies, onFight }) {
  const currentWorld = worlds[currentWorldIndex]

  return (
    <div
      className="flex flex-col min-h-dvh max-w-md mx-auto select-none"
      style={{ background: 'linear-gradient(160deg, #0d0d1e 0%, #110830 55%, #1a1040 100%)' }}
    >
      {/* Header */}
      <motion.div
        className="text-center pt-10 pb-3 px-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-white/35 text-xs font-black tracking-[0.35em] uppercase mb-1">
          World Map
        </p>
        {currentWorld && (
          <p className="text-white font-black text-xl tracking-wide">
            {currentWorld.icon}&nbsp;&nbsp;{currentWorld.name}
          </p>
        )}
      </motion.div>

      {/* Map — SVG path + absolutely-positioned nodes */}
      <div className="flex-1 relative px-5 pb-2">
        <div style={{ position: 'relative', width: '100%' }}>
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            style={{ width: '100%', display: 'block', overflow: 'visible' }}
          >
            {/* Dim guide trail (always full) */}
            <path
              d={PATH}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Gold animated path — draws in on mount */}
            <motion.path
              d={PATH}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.75 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.15 }}
              style={{ filter: 'drop-shadow(0 0 5px rgba(251,191,36,0.5))' }}
            />
          </svg>

          {/* Node overlays */}
          {worlds.map((world, i) => {
            const status =
              i < currentWorldIndex ? 'completed' :
              i === currentWorldIndex ? 'current' :
              'locked'
            const trophy = i < currentWorldIndex
              ? getBestTrophy(trophies, worlds, i)
              : null

            return (
              <WorldNode
                key={world.id}
                world={world}
                index={i}
                status={status}
                trophy={trophy}
                delay={0.25 + i * 0.1}
              />
            )
          })}
        </div>
      </div>

      {/* FIGHT button */}
      <div className="px-6 pb-10 pt-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, type: 'spring', stiffness: 210, damping: 18 }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={onFight}
          className="w-full bg-yellow-400 border-b-4 border-yellow-600 text-black font-black text-2xl rounded-2xl h-16 shadow-xl cursor-pointer tracking-widest"
        >
          FIGHT
        </motion.button>
      </div>
    </div>
  )
}
