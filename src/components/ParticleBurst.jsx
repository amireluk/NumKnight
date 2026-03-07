import { useState } from 'react'
import { motion } from 'framer-motion'

function generate(count, colors, spread, gravity) {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * 360
    const rad = (angle * Math.PI) / 180
    const dist = spread * (0.4 + Math.random() * 0.6)
    const w = 5 + Math.random() * 6
    const h = 4 + Math.random() * 5
    return {
      id: i,
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist + gravity,
      color: colors[Math.floor(Math.random() * colors.length)],
      w, h,
      isRect: Math.random() > 0.45,
      rotateEnd: (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 270),
      delay: Math.random() * 0.12,
      duration: 0.5 + Math.random() * 0.45,
    }
  })
}

export function ParticleBurst({
  count = 20,
  colors = ['#fbbf24', '#fff', '#f59e0b'],
  originX = '50%',
  originY = '50%',
  spread = 110,
  gravity = 50,
  baseDelay = 0,
}) {
  const [particles] = useState(() => generate(count, colors, spread, gravity))

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40, overflow: 'visible' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 0.15, rotate: p.rotateEnd }}
          transition={{ duration: p.duration, delay: p.delay + baseDelay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: originX,
            top: originY,
            marginLeft: -p.w / 2,
            marginTop: -p.h / 2,
            width: p.isRect ? p.w * 1.6 : p.w,
            height: p.h,
            borderRadius: p.isRect ? 2 : '50%',
            background: p.color,
          }}
        />
      ))}
    </div>
  )
}
