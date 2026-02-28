// ViewBox 100×216 ≈ iPhone aspect ratio (9:19.5).
// With xMidYMid slice the SVG maps almost 1:1 to a portrait phone screen
// so we can design the ground at the exact y% where characters stand.
// Characters' feet sit at ~76% of screen height → y ≈ 164 in this viewBox.
export function BattleBackground() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
      viewBox="0 0 100 216"
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
      <rect width="100" height="216" fill="url(#bg-sky)" />

      {/* Sun — upper right, very low opacity */}
      <circle cx="80" cy="28" r="13" fill="#e8d090" opacity="0.35" />
      <circle cx="80" cy="28" r="9"  fill="#edd98a" opacity="0.30" />

      {/* Far hill */}
      <path d="M-5 140 Q15 112 32 120 Q52 128 68 112 Q82 98 105 112 L105 216 L-5 216Z"
        fill="#4a6340" />

      {/* Mid hill */}
      <path d="M-5 152 Q18 128 36 136 Q56 144 72 128 Q86 115 105 130 L105 216 L-5 216Z"
        fill="#567248" />

      {/* Near hill — surface crest sits at ~y=164 where characters stand */}
      <path d="M-5 172 Q22 158 45 164 Q65 170 82 159 Q93 152 105 162 L105 216 L-5 216Z"
        fill="#61804f" />

      {/* Ground fill below the near hill */}
      <rect x="-5" y="175" width="115" height="46" fill="#3e5635" />
    </svg>
  )
}
