// Three independent layers — each anchored so it can never be clipped:
//   1. Sky     — CSS gradient fills the full arena
//   2. Sun     — CSS div pinned top-right, always visible
//   3. Hills   — SVG pinned to bottom:0; overflow="visible" so crests/edges
//                extend naturally into sky and are clipped only by the wrapper
export function BattleBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

      {/* 1. Sky gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, #7aa8c2, #b8d4e4)',
      }} />

      {/* 2. Sun — two CSS circles for glow + core, pinned top-right */}
      <div style={{
        position: 'absolute', top: 18, right: 18,
        width: 64, height: 64, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,240,140,0.70) 0%, rgba(232,208,144,0.30) 55%, transparent 75%)',
        boxShadow: '0 0 48px 24px rgba(232,208,144,0.35)',
      }} />
      <div style={{
        position: 'absolute', top: 30, right: 30,
        width: 40, height: 40, borderRadius: '50%',
        background: '#edd98a',
        opacity: 0.55,
      }} />

      {/* 3. Hills — anchored to bottom, overflow visible so crests render into sky */}
      <svg
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '48%' }}
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        overflow="visible"
        fill="none"
      >
        {/* Far hill */}
        <path d="M-5 22 Q15 -6 32 2 Q52 10 68 -6 Q82 -20 105 -6 L105 60 L-5 60Z"
          fill="#4a6340" />
        {/* Mid hill */}
        <path d="M-5 32 Q18 8 36 16 Q56 24 72 8 Q86 -5 105 10 L105 60 L-5 60Z"
          fill="#567248" />
        {/* Near hill */}
        <path d="M-5 48 Q22 34 45 40 Q65 46 82 35 Q93 28 105 38 L105 60 L-5 60Z"
          fill="#61804f" />
        {/* Ground fill */}
        <rect x="-5" y="44" width="115" height="20" fill="#3e5635" />
      </svg>

    </div>
  )
}
