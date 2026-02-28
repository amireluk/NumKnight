export function BattleBackground() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7aa8c2" />
          <stop offset="100%" stopColor="#b8d4e4" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="300" fill="url(#bg-sky)" />

      {/* Sun — soft, low opacity, top right */}
      <circle cx="340" cy="55" r="36" fill="#e8d090" opacity="0.35" />
      <circle cx="340" cy="55" r="26" fill="#edd98a" opacity="0.3" />

      {/* Far hill — wide, low, dark muted green */}
      <path d="M-10 220 Q60 150 130 165 Q200 178 270 155 Q330 138 410 170 L410 300 L-10 300Z"
        fill="#4a6340" />

      {/* Mid hill */}
      <path d="M-10 240 Q50 185 120 195 Q190 205 250 182 Q310 162 410 200 L410 300 L-10 300Z"
        fill="#567248" />

      {/* Near hill */}
      <path d="M-10 260 Q70 215 150 225 Q220 232 290 210 Q350 195 410 225 L410 300 L-10 300Z"
        fill="#61804f" />

      {/* Ground strip */}
      <rect x="-10" y="272" width="420" height="40" fill="#3e5635" />
    </svg>
  )
}
