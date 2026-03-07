// ─── Forest ───────────────────────────────────────────────────────────────────
function ForestBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, #4a9ed8, #89cef0)',
      }} />
      {/* Sun glow + core */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        width: 70, height: 70, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,240,130,0.75) 0%, rgba(240,210,110,0.28) 55%, transparent 75%)',
        boxShadow: '0 0 52px 26px rgba(240,210,100,0.32)',
      }} />
      <div style={{
        position: 'absolute', top: 29, right: 29,
        width: 44, height: 44, borderRadius: '50%',
        background: '#f0d878', opacity: 0.60,
      }} />
      {/* Birds (3 tiny arcs) */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40%', pointerEvents: 'none' }}
        viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M28 12 Q30 10 32 12" stroke="#3a6a88" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        <path d="M34 9  Q36 7  38 9"  stroke="#3a6a88" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        <path d="M22 17 Q24 15 26 17" stroke="#3a6a88" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </svg>
      {/* Hills */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%' }}
        viewBox="0 0 100 55" preserveAspectRatio="none" overflow="visible">
        {/* Far hill */}
        <path d="M-5 24 Q14 -4 32 4 Q52 12 68 -4 Q83 -18 105 -4 L105 55 L-5 55Z" fill="#406038" />
        {/* Mid hill */}
        <path d="M-5 34 Q18 10 36 18 Q56 26 72 10 Q87 -3 105 12 L105 55 L-5 55Z" fill="#4e7044" />
        {/* Near hill */}
        <path d="M-5 48 Q22 34 46 41 Q66 48 83 36 Q94 28 105 38 L105 55 L-5 55Z" fill="#5a7e4e" />
        {/* Ground */}
        <rect x="-5" y="46" width="115" height="12" fill="#3a5830" />
        {/* Grass tufts */}
        {[18, 27, 55, 63, 80, 88].map((x, i) => (
          <g key={i}>
            <line x1={x}   y1="47" x2={x}   y2="44" stroke="#4a7040" strokeWidth="0.9" strokeLinecap="round" />
            <line x1={x+2} y1="47" x2={x+2} y2="44.8" stroke="#3e6036" strokeWidth="0.9" strokeLinecap="round" />
            <line x1={x-2} y1="47" x2={x-2} y2="45.2" stroke="#4a7040" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </div>
  )
}

// ─── Swamp ────────────────────────────────────────────────────────────────────
function SwampBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, #182218, #2e4230)',
      }} />
      {/* Sickly moon — dim, upper-left */}
      <div style={{
        position: 'absolute', top: 18, left: 20,
        width: 40, height: 40, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(195,210,148,0.55) 0%, rgba(175,190,130,0.18) 58%, transparent 78%)',
        boxShadow: '0 0 18px 8px rgba(180,195,130,0.14)',
      }} />
      <div style={{
        position: 'absolute', top: 27, left: 28,
        width: 24, height: 24, borderRadius: '50%',
        background: '#c3d294', opacity: 0.38,
      }} />
      {/* Fog wisps */}
      <div style={{
        position: 'absolute', bottom: '36%', left: 0, right: 0, height: '18%',
        background: 'linear-gradient(to top, rgba(180,200,170,0.07) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      {/* Scenery */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '58%' }}
        viewBox="0 0 100 58" preserveAspectRatio="none" overflow="visible">
        {/* Background boggy ground */}
        <rect x="-5" y="28" width="115" height="35" fill="#182818" />
        {/* Dark water patches */}
        <ellipse cx="22" cy="35" rx="13" ry="3.5" fill="#0e2018" />
        <ellipse cx="74" cy="37" rx="11" ry="3" fill="#0e2018" />
        {/* Water shimmer lines */}
        <line x1="15" y1="34" x2="28" y2="34" stroke="#243830" strokeWidth="0.7" opacity="0.8" />
        <line x1="66" y1="36" x2="80" y2="36" stroke="#243830" strokeWidth="0.7" opacity="0.8" />
        {/* Dead tree left */}
        <line x1="9"  y1="28" x2="9"  y2="-8"  stroke="#0d1a0e" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="9"  y1="6"  x2="2"  y2="-4"  stroke="#0d1a0e" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="9"  y1="6"  x2="16" y2="-1"  stroke="#0d1a0e" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="9"  y1="14" x2="3"  y2="8"   stroke="#0d1a0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="9"  y1="20" x2="14" y2="14"  stroke="#0d1a0e" strokeWidth="1.0" strokeLinecap="round" />
        {/* Dead tree right */}
        <line x1="91" y1="28" x2="91" y2="-5"  stroke="#0d1a0e" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="91" y1="8"  x2="84" y2="0"   stroke="#0d1a0e" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="91" y1="8"  x2="98" y2="1"   stroke="#0d1a0e" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="91" y1="18" x2="96" y2="11"  stroke="#0d1a0e" strokeWidth="1.0" strokeLinecap="round" />
        {/* Reeds */}
        <line x1="38" y1="30" x2="37" y2="16" stroke="#2a3e28" strokeWidth="1.3" strokeLinecap="round" />
        <ellipse cx="37" cy="14" rx="1.6" ry="4.5" fill="#2a3e28" />
        <line x1="44" y1="30" x2="44" y2="18" stroke="#2a3e28" strokeWidth="1.3" strokeLinecap="round" />
        <ellipse cx="44" cy="16" rx="1.6" ry="4.5" fill="#2a3e28" />
        <line x1="58" y1="30" x2="59" y2="17" stroke="#2a3e28" strokeWidth="1.3" strokeLinecap="round" />
        <ellipse cx="59" cy="15" rx="1.6" ry="4.5" fill="#2a3e28" />
        <line x1="63" y1="30" x2="62" y2="20" stroke="#2a3e28" strokeWidth="1.1" strokeLinecap="round" />
        <ellipse cx="62" cy="18" rx="1.4" ry="3.8" fill="#2a3e28" />
        {/* Ground fill */}
        <rect x="-5" y="44" width="115" height="18" fill="#121e12" />
        {/* Mist layer */}
        <path d="M-5 30 Q20 26 40 30 Q62 34 80 28 Q94 24 105 28 L105 36 L-5 36Z"
          fill="white" opacity="0.03" />
      </svg>
    </div>
  )
}

// ─── Mountains ────────────────────────────────────────────────────────────────
function MountainsBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, #223848, #72a8be)',
      }} />
      {/* Pale cold sun */}
      <div style={{
        position: 'absolute', top: 12, right: 18,
        width: 48, height: 48, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(215,232,244,0.80) 0%, rgba(195,218,234,0.28) 55%, transparent 76%)',
        boxShadow: '0 0 30px 14px rgba(195,220,238,0.26)',
      }} />
      <div style={{
        position: 'absolute', top: 20, right: 26,
        width: 32, height: 32, borderRadius: '50%',
        background: '#d8eaf4', opacity: 0.58,
      }} />
      {/* Far mountain range */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70%' }}
        viewBox="0 0 100 68" preserveAspectRatio="none" overflow="visible">
        {/* Distant peaks — blue-grey */}
        <path d="M-5 46 L8 14 L20 32 L33 8 L46 26 L56 10 L68 28 L80 12 L93 32 L105 20 L105 68 L-5 68Z"
          fill="#3e5a6a" />
        {/* Distant snow caps */}
        <path d="M8  14 L4  25 L12 25Z"  fill="#e2eef4" opacity="0.72" />
        <path d="M33  8 L29 20 L37 20Z"  fill="#e2eef4" opacity="0.72" />
        <path d="M56 10 L52 20 L60 20Z"  fill="#e2eef4" opacity="0.72" />
        <path d="M80 12 L76 22 L84 22Z"  fill="#e2eef4" opacity="0.72" />
        {/* Near peaks — darker */}
        <path d="M-5 58 L4 28 L16 48 L26 22 L40 44 L53 18 L66 42 L76 24 L88 46 L105 30 L105 68 L-5 68Z"
          fill="#2e404c" />
        {/* Near snow caps */}
        <path d="M4  28 L0  40 L8  40Z"  fill="#dde8f0" opacity="0.86" />
        <path d="M26 22 L22 34 L30 34Z"  fill="#dde8f0" opacity="0.86" />
        <path d="M53 18 L49 30 L57 30Z"  fill="#dde8f0" opacity="0.86" />
        <path d="M76 24 L72 35 L80 35Z"  fill="#dde8f0" opacity="0.86" />
        {/* Rocky ground */}
        <path d="M-5 60 Q12 54 24 58 Q38 62 52 56 Q66 50 80 57 Q92 62 105 56 L105 68 L-5 68Z"
          fill="#22323a" />
        {/* Snow patches on ground */}
        <ellipse cx="16" cy="60" rx="9"  ry="2.5" fill="#dde8f0" opacity="0.50" />
        <ellipse cx="65" cy="58" rx="7"  ry="2"   fill="#dde8f0" opacity="0.42" />
        <ellipse cx="90" cy="60" rx="5"  ry="1.8" fill="#dde8f0" opacity="0.38" />
        {/* Ground base */}
        <rect x="-5" y="63" width="115" height="8" fill="#1a2830" />
      </svg>
    </div>
  )
}

// ─── Castle ───────────────────────────────────────────────────────────────────
function CastleBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, #040710, #0c1628)',
      }} />
      {/* Distant lightning ambient glow */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: '60%', height: '35%',
        background: 'radial-gradient(ellipse, rgba(120,140,200,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Moon */}
      <div style={{
        position: 'absolute', top: 14, right: 18,
        width: 42, height: 42, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,208,222,0.72) 0%, rgba(176,192,210,0.26) 56%, transparent 76%)',
        boxShadow: '0 0 22px 10px rgba(176,196,218,0.22)',
      }} />
      <div style={{
        position: 'absolute', top: 22, right: 25,
        width: 28, height: 28, borderRadius: '50%',
        background: '#c4d0de', opacity: 0.52,
      }} />
      {/* Cloud partly covering moon */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '35%', pointerEvents: 'none' }}
        viewBox="0 0 100 35" preserveAspectRatio="none">
        <path d="M62 4 Q72 -4 84 0 Q92 -4 94 4 Q98 2 99 8 Q98 13 90 11 Q84 16 72 12 Q62 16 60 10 Q57 4 62 4Z"
          fill="#121e30" opacity="0.88" />
        <path d="M4 6 Q12 -2 22 2 Q28 -2 30 5 Q34 3 35 9 Q34 14 26 12 Q20 17 10 13 Q2 15 0 9 Q-2 4 4 6Z"
          fill="#0e1828" opacity="0.82" />
      </svg>
      {/* Castle scene */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '62%' }}
        viewBox="0 0 100 62" preserveAspectRatio="none" overflow="visible">
        {/* Distant wall left */}
        <path d="M-5 38 L-5 26 L2 26 L2 20 L6 20 L6 26 L12 26 L12 20 L16 20 L16 26 L22 26 L22 20 L26 20 L26 26 L34 26 L34 38Z"
          fill="#0b1320" />
        {/* Distant wall right */}
        <path d="M66 38 L66 26 L74 26 L74 20 L78 20 L78 26 L85 26 L85 20 L89 20 L89 26 L96 26 L96 20 L100 20 L100 26 L105 26 L105 38Z"
          fill="#0b1320" />
        {/* Central tower */}
        <rect x="40" y="2" width="20" height="50" fill="#090e18" />
        {/* Tower battlements */}
        <path d="M38 2 L40 2 L40 -2 L44 -2 L44 2 L48 2 L48 -2 L52 -2 L52 2 L56 2 L56 -2 L60 -2 L60 2 L62 2 L62 6 L38 6Z"
          fill="#090e18" />
        {/* Side wall battlements */}
        <path d="M-5 52 L-5 40 L4 40 L4 34 L8 34 L8 40 L16 40 L16 34 L20 34 L20 40 L28 40 L28 34 L32 34 L32 40 L40 40 L40 52Z"
          fill="#080e1a" />
        <path d="M60 52 L60 40 L68 40 L68 34 L72 34 L72 40 L80 40 L80 34 L84 34 L84 40 L92 40 L92 34 L96 34 L96 40 L105 40 L105 52Z"
          fill="#080e1a" />
        {/* Ground — stone */}
        <rect x="-5" y="50" width="115" height="15" fill="#070c16" />
        {/* Stone joint lines */}
        <line x1="-5" y1="54" x2="105" y2="54" stroke="#0d1522" strokeWidth="0.7" />
        <line x1="-5" y1="58" x2="105" y2="58" stroke="#0d1522" strokeWidth="0.7" />
        {[8,24,40,56,72,88].map((x, i) => (
          <line key={i} x1={x} y1="50" x2={x} y2="62" stroke="#0d1522" strokeWidth="0.6" />
        ))}
      </svg>
    </div>
  )
}

// ─── Dragon Lair ──────────────────────────────────────────────────────────────
function DragonLairBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, #050100, #2a0600)',
      }} />
      {/* Lava up-glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(240,70,0,0.32) 0%, rgba(180,30,0,0.14) 48%, transparent 78%)',
        pointerEvents: 'none',
      }} />
      {/* Secondary hot-spot */}
      <div style={{
        position: 'absolute', bottom: '22%', left: '20%',
        width: '60%', height: '30%',
        background: 'radial-gradient(ellipse, rgba(255,100,0,0.16) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Stalactites — hang from ceiling */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '32%', pointerEvents: 'none' }}
        viewBox="0 0 100 28" preserveAspectRatio="none">
        <path d="M0 0 L5 0 L2.5 16Z"    fill="#0e0400" />
        <path d="M11 0 L17 0 L14 22Z"   fill="#140500" />
        <path d="M23 0 L28 0 L25.5 13Z" fill="#0e0400" />
        <path d="M34 0 L40 0 L37 20Z"   fill="#140500" />
        <path d="M47 0 L53 0 L50 17Z"   fill="#0e0400" />
        <path d="M60 0 L65 0 L62.5 12Z" fill="#140500" />
        <path d="M71 0 L77 0 L74 21Z"   fill="#0e0400" />
        <path d="M83 0 L88 0 L85.5 14Z" fill="#140500" />
        <path d="M94 0 L100 0 L97 18Z"  fill="#0e0400" />
      </svg>
      {/* Ground and lava */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '58%' }}
        viewBox="0 0 100 56" preserveAspectRatio="none" overflow="visible">
        {/* Rock back wall */}
        <path d="M-5 28 Q10 20 18 24 Q28 16 40 22 Q50 14 62 20 Q72 12 84 18 Q94 10 105 16 L105 56 L-5 56Z"
          fill="#180600" />
        {/* Rock ground */}
        <path d="M-5 42 Q14 36 26 40 Q40 44 54 38 Q68 32 80 38 Q92 44 105 38 L105 56 L-5 56Z"
          fill="#100400" />
        {/* Lava cracks — bright */}
        <path d="M8  44 Q16 40 22 46 Q27 43 34 48" stroke="#ff4500" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.9" />
        <path d="M8  44 Q16 40 22 46 Q27 43 34 48" stroke="#ffaa00" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M52 42 Q60 38 67 44 Q72 41 80 46" stroke="#ff4500" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.9" />
        <path d="M52 42 Q60 38 67 44 Q72 41 80 46" stroke="#ffaa00" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M28 50 Q38 46 44 52 Q50 49 58 54" stroke="#ff4500" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M28 50 Q38 46 44 52 Q50 49 58 54" stroke="#ffaa00" strokeWidth="0.5" fill="none" strokeLinecap="round" opacity="0.6" />
        {/* Lava pools */}
        <ellipse cx="19" cy="50" rx="9"  ry="3.5" fill="#8b1a00" opacity="0.7" />
        <ellipse cx="19" cy="50" rx="5.5" ry="2"  fill="#ff5500" opacity="0.55" />
        <ellipse cx="74" cy="51" rx="8"  ry="3"   fill="#8b1a00" opacity="0.7" />
        <ellipse cx="74" cy="51" rx="5"  ry="1.8" fill="#ff5500" opacity="0.55" />
        {/* Rock chunks */}
        <path d="M-5 52 Q6 46 14 50 Q20 54 28 48 L28 56 L-5 56Z"  fill="#0a0200" />
        <path d="M76 50 Q84 44 92 49 Q98 53 105 48 L105 56 L76 56Z" fill="#0a0200" />
        <rect x="-5" y="53" width="115" height="6" fill="#080100" />
      </svg>
    </div>
  )
}

// ─── Registry ─────────────────────────────────────────────────────────────────
const BACKGROUNDS = {
  forest:    ForestBackground,
  swamp:     SwampBackground,
  mountains: MountainsBackground,
  castle:    CastleBackground,
  dragonLair: DragonLairBackground,
}

export function BattleBackground({ worldId }) {
  const Bg = BACKGROUNDS[worldId] ?? ForestBackground
  return <Bg />
}
