/* eslint-disable no-undef */
// Shared NumKnight logo + sword banner — used on Main, Name-select, and Regions screens.
//
// Sword anatomy (left → right): pommel · grip · crossguard · blade → tip
// The crossguard extends above the SVG's own bounding box (overflow:visible + negative y)
// so its top pokes up into the text above. The inner nook — where guard right meets
// blade top — lands near the bottom-left corner of the "N", giving the effect that
// the N is sitting in the nook.
//
// The title <p> gets position:relative + zIndex:1 so it always renders on top of the
// guard's upward bleed.

export function SwordDivider({ style = {} }) {
  // ViewBox 340 × 24. Rendered width = 100% of content container (~342 px on a 390 px phone).
  // Guard right edge (gR=20) ≈ left edge of "N" — tune gR if text width differs.
  // marginTop: -5 pulls the SVG up so the guard pokes ~5 px into the bottom of the text.
  const mid = 12           // vertical centre of the 24-unit viewBox
  const gL  = 34, gR = 40  // guard left / right x  (gR ≈ where N starts in screen px)
  const bT  = mid - 4      // blade top y  = 8
  const bB  = mid + 4      // blade bottom y = 16

  return (
    <svg
      viewBox="0 0 340 24"
      style={{
        display: 'block', width: '100%', height: 'auto',
        overflow: 'visible',
        marginTop: -5,        // pulls SVG up so guard bleeds into text
        position: 'relative', // needed for z-index to keep text on top
        ...style,
      }}
    >
      {/* ── Pommel (negative x — bleeds into left padding, safe within px-6) ── */}
      <ellipse cx={6} cy={mid} rx={7}   ry={8}   fill="#b09050" />
      <ellipse cx={6} cy={mid} rx={4}   ry={5}   fill="#d8be6a" opacity={0.65} />

      {/* ── Grip ── */}
      <rect x={13} y={mid - 4} width={21} height={8} rx={3} fill="#6b4820" />
      {[16, 20, 24, 28, 32].map((x, i) => (
        <line key={i} x1={x} y1={mid - 4} x2={x} y2={mid + 4}
          stroke="#3a2010" strokeWidth={1.1} opacity={0.5} />
      ))}

      {/* ── Crossguard — symmetric around mid, top bleeds above SVG creating the nook ── */}
      <rect   x={gL}     y={-5} width={gR - gL} height={34} rx={2}   fill="#a08040" />
      <rect   x={gL+1.5} y={-3} width={3}       height={30} rx={1.5} fill="#d0aa58" opacity={0.6} />

      {/* ── Blade — straight body, taper only at tip ── */}
      {/* flat section */}
      <rect x={gR} y={bT} width={290 - gR} height={bB - bT} fill="#c2cedf" />
      {/* tapered tip */}
      <polygon points={`290,${bT} 310,${mid} 290,${bB}`} fill="#c2cedf" />

      {/* ── Fuller (central groove) ── */}
      <line x1={gR + 6} y1={mid} x2={291} y2={mid}
        stroke="#8a9ab8" strokeWidth={1.6} opacity={0.65} />

      {/* ── Top bevel shine ── */}
      <line x1={gR + 5} y1={bT + 1.5} x2={289} y2={bT + 1.5}
        stroke="white" strokeWidth={1} opacity={0.32} />
    </svg>
  )
}

// Full banner: title text + sword below it.
// logoLongPress — spread onto the <p> for the long-press dev trigger.
export function LogoBanner({ logoLongPress = {}, showSword = true }) {
  return (
    <div style={{ width: '100%' }}>
      <p
        {...logoLongPress}
        className="font-black text-white tracking-widest text-center"
        style={{
          fontSize: 52, lineHeight: 1,
          textShadow: '0 0 48px rgba(251,191,36,0.45), 0 2px 0 rgba(0,0,0,0.6)',
          userSelect: 'none', WebkitUserSelect: 'none',
          position: 'relative', zIndex: 1,
        }}
      >
        NumKnight
      </p>
      {showSword && <SwordDivider />}
    </div>
  )
}
