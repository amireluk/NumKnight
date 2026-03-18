import { memo } from 'react'

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
      {/* Hills */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%' }}
        viewBox="0 0 100 55" preserveAspectRatio="none" overflow="visible">
        {/* Far hill */}
        <path d="M-5 24 Q14 -4 32 4 Q52 12 68 -4 Q83 -18 105 -4 L105 55 L-5 55Z" fill="#406038" />
        {/* Mid hill */}
        <path d="M-5 34 Q18 10 36 18 Q56 26 72 10 Q87 -3 105 12 L105 55 L-5 55Z" fill="#4e7044" />
        {/* Near hill */}
        <path d="M-5 48 Q22 34 46 41 Q66 48 83 36 Q94 28 105 38 L105 55 L-5 55Z" fill="#5a7e4e" />
        {/* Trees — bases 3+ units below hill surface for clear grounding */}
        <path d="M6  11 L10  -2 L14  11Z"  fill="#1e3e14" />
        <path d="M13  7 L17  -6 L21   7Z"  fill="#264c1a" />
        <path d="M20  6 L24  -7 L28   6Z"  fill="#1e3e14" />
        <path d="M60  3 L64 -10 L68   3Z"  fill="#1e3e14" />
        <path d="M67 -3 L71 -16 L75  -3Z"  fill="#264c1a" />
        <path d="M74 -6 L78 -19 L82  -6Z"  fill="#1e3e14" />
        {/* Ground */}
        <rect x="-5" y="46" width="115" height="12" fill="#3a5830" />
        {/* Grass tufts */}
        {[18, 55, 88].map((x, i) => (
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
        background: 'linear-gradient(to bottom, #0a1428, #1a2e52)',
      }} />
      {/* Stars */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '55%', pointerEvents: 'none' }}
        viewBox="0 0 100 55" preserveAspectRatio="none">
        {[[12,8,0.7,0.55],[44,11,0.45,0.35],[76,9,0.7,0.55],[18,22,0.45,0.35],[68,18,0.7,0.55],[92,25,0.45,0.35]].map(([x,y,r,o],i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={o} />
        ))}
      </svg>
      {/* Moon glow */}
      <div style={{
        position: 'absolute', top: 10, right: 14,
        width: 60, height: 60, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(210,225,244,0.50) 0%, rgba(180,205,230,0.18) 55%, transparent 75%)',
        boxShadow: '0 0 36px 18px rgba(180,210,240,0.20)',
      }} />
      <div style={{
        position: 'absolute', top: 19, right: 22,
        width: 42, height: 42, borderRadius: '50%',
        background: '#ccd8e8', opacity: 0.68,
      }} />
      {/* Cloud partly covering moon */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '35%', pointerEvents: 'none' }}
        viewBox="0 0 100 35" preserveAspectRatio="none">
        <path d="M62 4 Q72 -4 84 0 Q92 -4 94 4 Q98 2 99 8 Q98 13 90 11 Q84 16 72 12 Q62 16 60 10 Q57 4 62 4Z"
          fill="#162236" opacity="0.85" />
        <path d="M4 6 Q12 -2 22 2 Q28 -2 30 5 Q34 3 35 9 Q34 14 26 12 Q20 17 10 13 Q2 15 0 9 Q-2 4 4 6Z"
          fill="#121e34" opacity="0.78" />
      </svg>
      {/* Castle scene */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '62%' }}
        viewBox="0 0 100 62" preserveAspectRatio="none" overflow="visible">
        {/* Distant wall left */}
        <path d="M-5 38 L-5 26 L2 26 L2 20 L6 20 L6 26 L12 26 L12 20 L16 20 L16 26 L22 26 L22 20 L26 20 L26 26 L34 26 L34 38Z"
          fill="#1e2e4a" />
        {/* Wall highlight (moonlit edge) */}
        <line x1="34" y1="26" x2="34" y2="38" stroke="#3a5070" strokeWidth="0.5" opacity="0.7" />
        {/* Distant wall right */}
        <path d="M66 38 L66 26 L74 26 L74 20 L78 20 L78 26 L85 26 L85 20 L89 20 L89 26 L96 26 L96 20 L100 20 L100 26 L105 26 L105 38Z"
          fill="#1e2e4a" />
        <line x1="66" y1="26" x2="66" y2="38" stroke="#3a5070" strokeWidth="0.5" opacity="0.7" />
        {/* Torch glow left wall */}
        <ellipse cx="18" cy="28" rx="4" ry="3" fill="#f59e1a" opacity="0.18" />
        <rect x="17.5" y="27" width="1.2" height="2" fill="#f59e1a" opacity="0.55" rx="0.3" />
        {/* Torch glow right wall */}
        <ellipse cx="82" cy="28" rx="4" ry="3" fill="#f59e1a" opacity="0.18" />
        <rect x="81.5" y="27" width="1.2" height="2" fill="#f59e1a" opacity="0.55" rx="0.3" />
        {/* Central tower */}
        <rect x="40" y="2" width="20" height="50" fill="#182238" />
        {/* Tower moonlit face */}
        <rect x="40" y="2" width="3" height="50" fill="#243452" opacity="0.6" />
        {/* Tower battlements */}
        <path d="M38 2 L40 2 L40 -2 L44 -2 L44 2 L48 2 L48 -2 L52 -2 L52 2 L56 2 L56 -2 L60 -2 L60 2 L62 2 L62 6 L38 6Z"
          fill="#182238" />
        {/* Tower window — glowing amber */}
        <rect x="47" y="14" width="6" height="9" rx="3" fill="#f59e1a" opacity="0.55" />
        <rect x="48" y="15" width="4" height="7" rx="2" fill="#fbbf5a" opacity="0.45" />
        {/* Arrow slits */}
        <rect x="43" y="22" width="1.5" height="5" rx="0.6" fill="#0d1828" opacity="0.8" />
        <rect x="55.5" y="22" width="1.5" height="5" rx="0.6" fill="#0d1828" opacity="0.8" />
        {/* Side wall battlements */}
        <path d="M-5 52 L-5 40 L4 40 L4 34 L8 34 L8 40 L16 40 L16 34 L20 34 L20 40 L28 40 L28 34 L32 34 L32 40 L40 40 L40 52Z"
          fill="#162032" />
        <path d="M60 52 L60 40 L68 40 L68 34 L72 34 L72 40 L80 40 L80 34 L84 34 L84 40 L92 40 L92 34 L96 34 L96 40 L105 40 L105 52Z"
          fill="#162032" />
        {/* Ground — flagstone */}
        <rect x="-5" y="50" width="115" height="15" fill="#121c2e" />
        {/* Moonlit ground highlight */}
        <rect x="-5" y="50" width="115" height="1.5" fill="#2a3e58" opacity="0.5" />
        {/* Stone joints */}
        <line x1="-5" y1="54" x2="105" y2="54" stroke="#1a2840" strokeWidth="0.8" />
        <line x1="-5" y1="58" x2="105" y2="58" stroke="#1a2840" strokeWidth="0.8" />
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
        background: 'linear-gradient(to bottom, #0d0200, #320800)',
      }} />
      {/* Strong lava up-glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(255,90,0,0.42) 0%, rgba(200,40,0,0.20) 45%, transparent 75%)',
        pointerEvents: 'none',
      }} />
      {/* Side hot-spots */}
      <div style={{
        position: 'absolute', bottom: '18%', left: '-5%',
        width: '40%', height: '40%',
        background: 'radial-gradient(ellipse, rgba(255,100,0,0.22) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '18%', right: '-5%',
        width: '40%', height: '40%',
        background: 'radial-gradient(ellipse, rgba(255,100,0,0.22) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Stalactites — hang from ceiling, with lava-lit tips */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '36%', pointerEvents: 'none' }}
        viewBox="0 0 100 32" preserveAspectRatio="none">
        <path d="M0 0 L5 0 L2.5 18Z"    fill="#200600" />
        <path d="M11 0 L17 0 L14 24Z"   fill="#280800" />
        <path d="M23 0 L28 0 L25.5 15Z" fill="#200600" />
        <path d="M34 0 L40 0 L37 22Z"   fill="#280800" />
        <path d="M47 0 L53 0 L50 19Z"   fill="#200600" />
        <path d="M60 0 L65 0 L62.5 14Z" fill="#280800" />
        <path d="M71 0 L77 0 L74 23Z"   fill="#200600" />
        <path d="M83 0 L88 0 L85.5 16Z" fill="#280800" />
        <path d="M94 0 L100 0 L97 20Z"  fill="#200600" />
        {/* Glowing tips */}
        <circle cx="2.5" cy="18" r="1.2" fill="#ff6600" opacity="0.55" />
        <circle cx="14"  cy="24" r="1.5" fill="#ff4400" opacity="0.60" />
        <circle cx="37"  cy="22" r="1.4" fill="#ff6600" opacity="0.55" />
        <circle cx="50"  cy="19" r="1.2" fill="#ff4400" opacity="0.50" />
        <circle cx="74"  cy="23" r="1.5" fill="#ff6600" opacity="0.60" />
        <circle cx="97"  cy="20" r="1.3" fill="#ff4400" opacity="0.55" />
      </svg>
      {/* Ground, pillars, and lava */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '65%' }}
        viewBox="0 0 100 62" preserveAspectRatio="none" overflow="visible">
        {/* Rock back wall with jagged silhouette */}
        <path d="M-5 30 Q8 18 16 24 Q24 14 36 20 Q46 10 58 18 Q68 8 80 16 Q92 6 105 14 L105 62 L-5 62Z"
          fill="#1e0600" />
        {/* Far spires */}
        <path d="M10 24 L13 6  L16 24Z" fill="#2a0800" />
        <path d="M28 20 L31 5  L34 20Z" fill="#240600" />
        <path d="M62 18 L65 4  L68 18Z" fill="#2a0800" />
        <path d="M80 16 L84 2  L88 16Z" fill="#240600" />
        {/* Left fire pillar — bright column of light */}
        <rect x="-5" y="20" width="8" height="42" fill="#1a0500" />
        <rect x="-3" y="14" width="4" height="10" rx="1" fill="#ff5500" opacity="0.70" />
        {/* Right fire pillar */}
        <rect x="97" y="20" width="8" height="42" fill="#1a0500" />
        <rect x="99" y="14" width="4" height="10" rx="1" fill="#ff5500" opacity="0.70" />
        {/* Rocky ground */}
        <path d="M-5 44 Q12 38 24 42 Q38 46 52 40 Q66 34 80 40 Q92 46 105 40 L105 62 L-5 62Z"
          fill="#120400" />
        {/* Lava rivers — wide glowing cracks */}
        <path d="M6 46 Q14 42 22 48 Q28 44 36 50" stroke="#cc3300" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M6 46 Q14 42 22 48 Q28 44 36 50" stroke="#ff6600" strokeWidth="1.0" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M50 44 Q58 40 66 46 Q72 42 82 48" stroke="#cc3300" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M50 44 Q58 40 66 46 Q72 42 82 48" stroke="#ff6600" strokeWidth="1.0" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M26 52 Q36 48 42 54 Q50 50 60 56" stroke="#cc3300" strokeWidth="2.0" fill="none" strokeLinecap="round" />
        <path d="M26 52 Q36 48 42 54 Q50 50 60 56" stroke="#ff6600" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.80" />
        {/* Lava pools */}
        <ellipse cx="20" cy="52" rx="10" ry="4"   fill="#7a1400" />
        <ellipse cx="20" cy="52" rx="6.5" ry="2.4" fill="#ff5500" opacity="0.65" />
        <ellipse cx="76" cy="53" rx="9"  ry="3.5"  fill="#7a1400" />
        <ellipse cx="76" cy="53" rx="6"  ry="2.2"  fill="#ff5500" opacity="0.65" />
        {/* Rock foreground edges */}
        <path d="M-5 56 Q8 50 16 54 Q22 58 30 52 L30 62 L-5 62Z"  fill="#0e0200" />
        <path d="M74 52 Q82 46 90 50 Q97 54 105 50 L105 62 L74 62Z" fill="#0e0200" />
        <rect x="-5" y="58" width="115" height="6" fill="#0a0100" />
      </svg>
    </div>
  )
}

// ─── Registry ─────────────────────────────────────────────────────────────────
const BACKGROUNDS = {
  forest:     memo(ForestBackground),
  swamp:      memo(SwampBackground),
  mountains:  memo(MountainsBackground),
  castle:     memo(CastleBackground),
  dragonLair: memo(DragonLairBackground),
}

const RASTER_FILENAMES = {
  forest:     'forest',
  swamp:      'swamp',
  mountains:  'mountains',
  castle:     'castle',
  dragonLair: 'dragon-lair',
}

export function BattleBackground({ worldId, useRaster }) {
  if (useRaster) {
    const filename = RASTER_FILENAMES[worldId] ?? 'forest'
    return (
      <img
        src={`${import.meta.env.BASE_URL}assets/backgrounds/${filename}.webp`}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 65%',
        }}
      />
    )
  }
  const Bg = BACKGROUNDS[worldId] ?? ForestBackground
  return <Bg />
}
