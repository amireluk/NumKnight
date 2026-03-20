import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

// ─────────────────────────────────────────────
// Shared hit-splash
// ─────────────────────────────────────────────
const SPLASH_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const SPLASH_ANGLES_OFFSET = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]

// Pre-computed at module load — avoids trig on every hit
const SPLASH_LINES = SPLASH_ANGLES.map(a => {
  const r = (a * Math.PI) / 180
  return [Math.cos(r) * 7, Math.sin(r) * 7, Math.cos(r) * 32, Math.sin(r) * 32]
})
const SPLASH_LINES_OFFSET = SPLASH_ANGLES_OFFSET.map(a => {
  const r = (a * Math.PI) / 180
  return [Math.cos(r) * 9, Math.sin(r) * 9, Math.cos(r) * 22, Math.sin(r) * 22]
})

function HitSplash({ color }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: '30%', top: '30%', transform: 'translate(-50%, -50%)', zIndex: 20, willChange: 'transform, opacity' }}
      initial={{ scale: 0.03, opacity: 1 }}
      animate={{ scale: [0.03, 0.84, 1.02], opacity: [1, 1, 0] }}
      transition={{ duration: 0.5, times: [0, 0.28, 1], ease: 'easeOut' }}
    >
      <svg width="90" height="90" viewBox="-45 -45 90 90" fill="none">
        {SPLASH_LINES.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" strokeLinecap="round" />
        ))}
        {SPLASH_LINES_OFFSET.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeLinecap="round" />
        ))}
        <circle cx="0" cy="0" r="9" fill={color} />
        <circle cx="0" cy="0" r="4" fill="white" opacity="0.7" />
      </svg>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// GOBLIN
// ─────────────────────────────────────────────
function GoblinBodySVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none">
      <path d="M24 58 Q8 66 5 88 Q5 99 14 100 Q23 101 24 91 Q25 74 32 66Z"
        fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="12" cy="100" rx="10" ry="9" fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2.5" />
      <path d="M5 97 Q9 92 14 92 Q18 92 21 95" stroke="#558b2f" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M26 88 Q22 102 20 114 Q22 120 33 120 Q41 120 43 112 Q44 100 44 88Z"
        fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2.5" />
      <path d="M64 88 Q68 102 70 114 Q68 120 57 120 Q49 120 47 112 Q46 100 46 88Z"
        fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2.5" />
      <ellipse cx="29" cy="116" rx="12" ry="6" fill="#4a7c1f" stroke="#1b2a1b" strokeWidth="2" />
      <ellipse cx="61" cy="116" rx="12" ry="6" fill="#4a7c1f" stroke="#1b2a1b" strokeWidth="2" />
      <path d="M18 57 Q12 70 12 82 Q12 95 30 96 Q45 98 60 96 Q78 95 78 82 Q78 70 72 57 Q62 52 45 52 Q28 52 18 57Z"
        fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2.5" />
      <path d="M27 63 Q37 59 44 64" stroke="#558b2f" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M63 63 Q53 59 46 64" stroke="#558b2f" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
      <ellipse cx="44" cy="85" rx="2.5" ry="2" fill="#558b2f" opacity="0.6" />
      <path d="M22 91 Q36 98 44 96 Q54 98 68 91 Q66 109 59 112 Q44 116 30 112 Q24 109 22 91Z"
        fill="#795548" stroke="#3e2723" strokeWidth="2" />
      <path d="M28 97 Q30 105 28 112" stroke="#5d4037" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M38 98 Q39 106 38 113" stroke="#5d4037" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M50 98 Q51 106 50 113" stroke="#5d4037" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M60 97 Q58 105 60 112" stroke="#5d4037" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <rect x="21" y="89" width="48" height="6" rx="3" fill="#4e342e" stroke="#3e2723" strokeWidth="1.5" />
      <rect x="38" y="89" width="14" height="6" rx="2" fill="#6d4c41" stroke="#4e342e" strokeWidth="1" />
      <path d="M34 52 Q37 48 45 48 Q53 48 56 52 L56 58 Q52 54 45 54 Q38 54 34 58Z"
        fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2" />
      <ellipse cx="45" cy="58" rx="9" ry="4" fill="#558b2f" opacity="0.35" />
      <path d="M17 30 Q17 6 45 6 Q73 6 73 30 Q73 52 60 58 Q45 63 30 58 Q17 52 17 30Z"
        fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2.5" />
      <path d="M17 28 Q3 18 8 8 Q18 15 22 28Z" fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2" />
      <path d="M73 28 Q87 18 82 8 Q72 15 68 28Z" fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2" />
      <path d="M38 8 Q41 0 45 2 Q49 0 52 8 Q49 4 45 5 Q41 4 38 8Z" fill="#1a1a2e" stroke="#111" strokeWidth="1.5" />
      <path d="M39 8 Q43 1 44 3" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M46 3 Q49 0 51 8" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 26 Q29 17 41 23" stroke="#1b2a1b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M72 26 Q61 17 49 23" stroke="#1b2a1b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <line x1="28" y1="19" x2="25" y2="27" stroke="#1b2a1b" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="30" cy="33" rx="8" ry="8" fill="#f9a825" stroke="#1b2a1b" strokeWidth="1.5" />
      <ellipse cx="60" cy="33" rx="8" ry="8" fill="#f9a825" stroke="#1b2a1b" strokeWidth="1.5" />
      <circle cx="30" cy="33" r="5.5" fill="#e65100" />
      <circle cx="60" cy="33" r="5.5" fill="#e65100" />
      <ellipse cx="30" cy="33" rx="2" ry="5" fill="#111" />
      <ellipse cx="60" cy="33" rx="2" ry="5" fill="#111" />
      <circle cx="32" cy="30" r="2" fill="white" />
      <circle cx="62" cy="30" r="2" fill="white" />
      <path d="M22 29 L38 31" stroke="#558b2f" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68 29 L52 31" stroke="#558b2f" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="45" cy="44" rx="8" ry="6" fill="#6ca03a" stroke="#1b2a1b" strokeWidth="1.5" />
      <circle cx="41" cy="45" r="2.8" fill="#1b2a1b" />
      <circle cx="49" cy="45" r="2.8" fill="#1b2a1b" />
      <path d="M20 52 Q34 67 45 64 Q56 67 70 52 L70 58 Q56 73 45 70 Q34 73 20 58Z"
        fill="#111" stroke="#1b2a1b" strokeWidth="2" />
      {/* Teeth — smaller */}
      <rect x="27" y="53" width="8" height="5" rx="2" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <rect x="37" y="52" width="8" height="6" rx="2" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <rect x="47" y="52" width="8" height="6" rx="2" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <rect x="57" y="53" width="8" height="5" rx="2" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <path d="M22 52 L24 58 L28 52Z" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <path d="M61 52 L64 58 L67 52Z" fill="#f9a825" stroke="#e65100" strokeWidth="0.5" />
      <path d="M20 52 Q45 48 70 52" stroke="#558b2f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function GoblinClubArmSVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none" overflow="visible">
      <rect x="68" y="2" width="11" height="52" rx="4" fill="#6d4c41" stroke="#3e2723" strokeWidth="2" />
      <ellipse cx="73.5" cy="5" rx="11" ry="14" fill="#795548" stroke="#3e2723" strokeWidth="2.5" />
      <circle cx="67" cy="4" r="4" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" />
      <circle cx="82" cy="8" r="3.5" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" />
      <circle cx="64" cy="15" r="3" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" />
      <circle cx="83" cy="20" r="2.5" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" />
      <path d="M66 54 Q80 56 84 70 Q86 82 78 84 Q70 86 68 76 Q66 64 60 62Z"
        fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="64" y="46" width="14" height="15" rx="6" fill="#8bc34a" stroke="#1b2a1b" strokeWidth="2" />
      <path d="M65 49 Q71 46 77 49" stroke="#558b2f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ─────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────
function SkeletonBodySVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none">
      {/* Left arm (hanging bone) */}
      <path d="M26 56 Q10 66 8 84 Q8 95 16 96 Q24 97 26 86 Q28 72 34 64Z"
        fill="#d8cdb4" stroke="#2a1a0a" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="14" cy="96" rx="9" ry="7" fill="#d8cdb4" stroke="#2a1a0a" strokeWidth="2" />

      {/* Left leg femur */}
      <rect x="26" y="92" width="12" height="26" rx="6" fill="#d8cdb4" stroke="#2a1a0a" strokeWidth="2" />
      {/* Left knee joint */}
      <circle cx="32" cy="110" r="7" fill="#c8bd9a" stroke="#2a1a0a" strokeWidth="2" />
      {/* Left tibia */}
      <rect x="28" y="108" width="8" height="14" rx="4" fill="#d8cdb4" stroke="#2a1a0a" strokeWidth="2" />
      {/* Left foot */}
      <ellipse cx="32" cy="120" rx="12" ry="5" fill="#c8bd9a" stroke="#2a1a0a" strokeWidth="2" />

      {/* Right leg femur */}
      <rect x="52" y="92" width="12" height="26" rx="6" fill="#d8cdb4" stroke="#2a1a0a" strokeWidth="2" />
      {/* Right knee joint */}
      <circle cx="58" cy="110" r="7" fill="#c8bd9a" stroke="#2a1a0a" strokeWidth="2" />
      {/* Right tibia */}
      <rect x="54" y="108" width="8" height="14" rx="4" fill="#d8cdb4" stroke="#2a1a0a" strokeWidth="2" />
      {/* Right foot */}
      <ellipse cx="58" cy="120" rx="12" ry="5" fill="#c8bd9a" stroke="#2a1a0a" strokeWidth="2" />

      {/* Pelvis */}
      <path d="M28 90 Q38 98 45 97 Q52 98 62 90 Q60 104 52 108 Q45 111 38 108 Q30 104 28 90Z"
        fill="#c8bd9a" stroke="#2a1a0a" strokeWidth="2" />

      {/* Spine */}
      <line x1="45" y1="46" x2="45" y2="90" stroke="#b5a88e" strokeWidth="5" strokeLinecap="round" />

      {/* Ribs left (3 pairs) */}
      <path d="M44 52 Q28 55 22 66 Q26 74 36 70 Q42 63 45 58"
        fill="none" stroke="#c8bd9a" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M44 60 Q26 63 20 76 Q24 84 34 80 Q41 73 44 68"
        fill="none" stroke="#c8bd9a" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M44 68 Q28 71 22 83 Q26 90 36 87 Q42 81 44 76"
        fill="none" stroke="#c8bd9a" strokeWidth="4.5" strokeLinecap="round" />

      {/* Ribs right */}
      <path d="M46 52 Q62 55 68 66 Q64 74 54 70 Q48 63 45 58"
        fill="none" stroke="#c8bd9a" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M46 60 Q64 63 70 76 Q66 84 56 80 Q49 73 46 68"
        fill="none" stroke="#c8bd9a" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M46 68 Q62 71 68 83 Q64 90 54 87 Q48 81 46 76"
        fill="none" stroke="#c8bd9a" strokeWidth="4.5" strokeLinecap="round" />

      {/* Neck */}
      <line x1="45" y1="38" x2="45" y2="48" stroke="#b5a88e" strokeWidth="6" strokeLinecap="round" />

      {/* Skull */}
      <ellipse cx="45" cy="22" rx="23" ry="21" fill="#d8cdb4" stroke="#2a1a0a" strokeWidth="2.5" />
      {/* Jaw */}
      <path d="M27 32 Q36 46 45 46 Q54 46 63 32 L61 40 Q53 52 45 52 Q37 52 29 40Z"
        fill="#d8cdb4" stroke="#2a1a0a" strokeWidth="2" />
      {/* Teeth — smaller */}
      <rect x="29" y="39" width="7" height="4" rx="2" fill="#f0ead8" stroke="#2a1a0a" strokeWidth="1" />
      <rect x="38" y="39" width="7" height="5" rx="2" fill="#f0ead8" stroke="#2a1a0a" strokeWidth="1" />
      <rect x="45" y="39" width="7" height="5" rx="2" fill="#f0ead8" stroke="#2a1a0a" strokeWidth="1" />
      <rect x="54" y="39" width="7" height="4" rx="2" fill="#f0ead8" stroke="#2a1a0a" strokeWidth="1" />
      {/* Eye sockets */}
      <ellipse cx="33" cy="22" rx="9" ry="10" fill="#1a1228" />
      <ellipse cx="57" cy="22" rx="9" ry="10" fill="#1a1228" />
      {/* Glowing eyes */}
      <ellipse cx="33" cy="22" rx="5" ry="6" fill="#4a3a8a" opacity="0.6" />
      <ellipse cx="57" cy="22" rx="5" ry="6" fill="#4a3a8a" opacity="0.6" />
      <circle cx="33" cy="20" r="2.5" fill="#8b7fd4" opacity="0.8" />
      <circle cx="57" cy="20" r="2.5" fill="#8b7fd4" opacity="0.8" />
      {/* Nasal cavity */}
      <path d="M41 30 L45 36 L49 30 Q45 27 41 30Z" fill="#1a1228" />
    </svg>
  )
}

function SkeletonScytheArmSVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none" overflow="visible">
      {/* Scythe pole */}
      <rect x="70" y="0" width="9" height="62" rx="4" fill="#5c3d1e" stroke="#2a1a0a" strokeWidth="2" />
      {/* Scythe blade (curved crescent) */}
      <path d="M74 2 Q92 -10 88 24 Q84 46 70 36 Q82 28 84 10 Q80 -2 74 2Z"
        fill="#708090" stroke="#2a1a0a" strokeWidth="2.5" />
      {/* Blade edge highlight */}
      <path d="M74 2 Q90 -6 87 22 Q83 42 72 36"
        stroke="#aab8c2" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Blade inner */}
      <path d="M74 6 Q86 0 84 20 Q82 34 73 32 Q82 22 82 12 Q79 2 74 6Z"
        fill="#4a5568" />
      {/* Right arm (bone) */}
      <path d="M64 54 Q78 56 82 70 Q84 82 76 84 Q68 86 66 76 Q64 64 58 62Z"
        fill="#d8cdb4" stroke="#2a1a0a" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Right hand */}
      <rect x="62" y="46" width="13" height="14" rx="5" fill="#c8bd9a" stroke="#2a1a0a" strokeWidth="2" />
      <path d="M63 49 Q68 46 75 49" stroke="#b5a88e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ─────────────────────────────────────────────
// ORC
// ─────────────────────────────────────────────
function OrcBodySVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none">
      {/* Left arm — thick */}
      <path d="M16 56 Q0 68 -2 90 Q-2 102 8 103 Q18 104 20 92 Q22 74 30 64Z"
        fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="5" cy="103" rx="12" ry="10" fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2.5" />
      {/* Knuckles */}
      <circle cx="-2" cy="100" r="3.5" fill="#4a6030" stroke="#1a1a0a" strokeWidth="1.5" />
      <circle cx="5" cy="103" r="3.5" fill="#4a6030" stroke="#1a1a0a" strokeWidth="1.5" />
      <circle cx="12" cy="103" r="3.5" fill="#4a6030" stroke="#1a1a0a" strokeWidth="1.5" />

      {/* Legs — massive */}
      <path d="M24 90 Q18 106 16 118 Q20 124 34 122 Q44 120 44 110 Q44 96 44 90Z"
        fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2.5" />
      <path d="M66 90 Q72 106 74 118 Q70 124 56 122 Q46 120 46 110 Q46 96 46 90Z"
        fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2.5" />
      {/* Boots */}
      <ellipse cx="28" cy="119" rx="14" ry="6" fill="#3a2e22" stroke="#1a1a0a" strokeWidth="2" />
      <ellipse cx="62" cy="119" rx="14" ry="6" fill="#3a2e22" stroke="#1a1a0a" strokeWidth="2" />

      {/* Body — wide barrel chest */}
      <path d="M12 54 Q6 68 6 82 Q6 98 28 100 Q45 102 62 100 Q84 98 84 82 Q84 68 78 54 Q66 48 45 48 Q24 48 12 54Z"
        fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2.5" />

      {/* Armor breastplate */}
      <path d="M20 62 Q32 58 45 60 Q58 58 70 62 Q72 78 65 86 Q55 92 45 90 Q35 92 25 86 Q18 78 20 62Z"
        fill="#5a4a38" stroke="#1a1a0a" strokeWidth="2" />

      {/* Neck */}
      <path d="M32 48 Q36 42 45 42 Q54 42 58 48 L58 56 Q54 50 45 50 Q36 50 32 56Z"
        fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2" />

      {/* Head — wide and heavy */}
      <path d="M14 26 Q14 2 45 2 Q76 2 76 26 Q76 52 62 58 Q45 64 28 58 Q14 52 14 26Z"
        fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2.5" />

      {/* Ears — wide */}
      <path d="M14 24 Q0 14 4 2 Q16 10 20 26Z" fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2" />
      <path d="M76 24 Q90 14 86 2 Q74 10 70 26Z" fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2" />

      {/* Tusks — smaller */}
      <path d="M32 54 Q29 60 26 64" stroke="#f0ead8" strokeWidth="3" strokeLinecap="round" />
      <path d="M58 54 Q61 60 64 64" stroke="#f0ead8" strokeWidth="3" strokeLinecap="round" />

      {/* Heavy brows */}
      <path d="M16 24 Q28 14 42 20" stroke="#1a1a0a" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M74 24 Q62 14 48 20" stroke="#1a1a0a" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* Eyes — small, mean */}
      <ellipse cx="30" cy="30" rx="7" ry="6" fill="#c62828" stroke="#1a1a0a" strokeWidth="1.5" />
      <ellipse cx="60" cy="30" rx="7" ry="6" fill="#c62828" stroke="#1a1a0a" strokeWidth="1.5" />
      <circle cx="30" cy="30" r="4" fill="#6a0000" />
      <circle cx="60" cy="30" r="4" fill="#6a0000" />
      <ellipse cx="30" cy="30" rx="1.5" ry="3.5" fill="#111" />
      <ellipse cx="60" cy="30" rx="1.5" ry="3.5" fill="#111" />
      <circle cx="32" cy="28" r="1.5" fill="white" />
      <circle cx="62" cy="28" r="1.5" fill="white" />

      {/* Flat nose */}
      <ellipse cx="45" cy="42" rx="10" ry="7" fill="#4a6030" stroke="#1a1a0a" strokeWidth="1.5" />
      <circle cx="40" cy="43" r="3.5" fill="#1a1a0a" />
      <circle cx="50" cy="43" r="3.5" fill="#1a1a0a" />

      {/* Snarl mouth */}
      <path d="M26 54 Q45 62 64 54 L62 60 Q45 68 28 60Z" fill="#111" stroke="#1a1a0a" strokeWidth="1.5" />
      <path d="M26 54 Q45 50 64 54" stroke="#3a5222" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Scar */}
      <line x1="34" y1="18" x2="30" y2="32" stroke="#3a5222" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function OrcAxeArmSVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none" overflow="visible">
      {/* Axe handle */}
      <rect x="68" y="4" width="11" height="56" rx="5" fill="#6b4226" stroke="#2a1a0a" strokeWidth="2" />
      {/* Axe head */}
      <path d="M64 4 Q58 -6 68 -4 Q82 -8 88 6 Q90 16 82 22 Q74 28 66 18 Q72 12 76 6 Q70 0 64 4Z"
        fill="#708090" stroke="#2a1a0a" strokeWidth="2.5" />
      {/* Axe edge */}
      <path d="M64 4 Q60 -4 70 -2 Q84 -6 88 6 Q90 14 83 20"
        stroke="#aab8c2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Axe body */}
      <path d="M68 4 Q78 0 82 8 Q84 14 80 18 Q74 24 68 18 Q72 12 73 8 Q70 2 68 4Z"
        fill="#546270" />
      {/* Right arm — thick */}
      <path d="M62 54 Q78 56 84 72 Q86 86 76 88 Q66 90 64 78 Q62 64 56 62Z"
        fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Right hand */}
      <rect x="60" y="46" width="16" height="16" rx="7" fill="#5e7a3a" stroke="#1a1a0a" strokeWidth="2" />
      <path d="M61 50 Q68 46 76 50" stroke="#3a5222" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ─────────────────────────────────────────────
// DARK KNIGHT
// ─────────────────────────────────────────────
function DarkKnightBodySVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none">
      {/* Left gauntlet arm */}
      <path d="M20 58 Q6 68 4 88 Q4 100 14 101 Q24 102 26 90 Q28 74 36 66Z"
        fill="#2e3640" stroke="#0a0e12" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Elbow plate */}
      <ellipse cx="20" cy="78" rx="9" ry="6" fill="#4a5462" stroke="#0a0e12" strokeWidth="2" />
      {/* Gauntlet */}
      <rect x="4" y="92" width="20" height="14" rx="4" fill="#1e242c" stroke="#0a0e12" strokeWidth="2" />
      {/* Fingers */}
      <path d="M6 106 L4 112" stroke="#0a0e12" strokeWidth="3" strokeLinecap="round" />
      <path d="M11 107 L10 113" stroke="#0a0e12" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 107 L16 114" stroke="#0a0e12" strokeWidth="3" strokeLinecap="round" />
      <path d="M21 106 L23 112" stroke="#0a0e12" strokeWidth="3" strokeLinecap="round" />

      {/* Legs — greaves */}
      <path d="M26 90 Q20 106 18 118 Q22 124 36 122 Q46 120 46 110 Q44 96 44 90Z"
        fill="#2e3640" stroke="#0a0e12" strokeWidth="2.5" />
      <path d="M64 90 Q70 106 72 118 Q68 124 54 122 Q44 120 44 110 Q46 96 46 90Z"
        fill="#2e3640" stroke="#0a0e12" strokeWidth="2.5" />
      {/* Knee guards */}
      <ellipse cx="30" cy="106" rx="10" ry="7" fill="#4a5462" stroke="#0a0e12" strokeWidth="2" />
      <ellipse cx="60" cy="106" rx="10" ry="7" fill="#4a5462" stroke="#0a0e12" strokeWidth="2" />
      {/* Sabatons (armored feet) */}
      <rect x="14" y="115" width="26" height="8" rx="4" fill="#1e242c" stroke="#0a0e12" strokeWidth="2" />
      <rect x="50" y="115" width="26" height="8" rx="4" fill="#1e242c" stroke="#0a0e12" strokeWidth="2" />

      {/* Body — full plate */}
      <path d="M14 54 Q8 68 8 84 Q8 100 30 102 Q45 104 60 102 Q82 100 82 84 Q82 68 76 54 Q64 48 45 48 Q26 48 14 54Z"
        fill="#2e3640" stroke="#0a0e12" strokeWidth="2.5" />
      {/* Breastplate center line */}
      <line x1="45" y1="52" x2="45" y2="96" stroke="#0a0e12" strokeWidth="2" opacity="0.8" />
      {/* Belt/waist */}
      <rect x="18" y="88" width="54" height="8" rx="2" fill="#1e242c" stroke="#0a0e12" strokeWidth="1.5" />
      <rect x="38" y="87" width="14" height="10" rx="2" fill="#3a4250" stroke="#0a0e12" strokeWidth="1.5" />
      {/* Belt buckle */}
      <rect x="42" y="89" width="6" height="6" rx="1" fill="#8a9ab0" stroke="#0a0e12" strokeWidth="1" />

      {/* Pauldron (left shoulder plate) */}
      <ellipse cx="18" cy="56" rx="14" ry="10" fill="#4a5462" stroke="#0a0e12" strokeWidth="2" />

      {/* Neck gorget */}
      <rect x="34" y="44" width="22" height="10" rx="4" fill="#1e242c" stroke="#0a0e12" strokeWidth="2" />

      {/* Helmet */}
      <path d="M16 28 Q16 4 45 4 Q74 4 74 28 Q74 54 62 60 Q45 66 28 60 Q16 54 16 28Z"
        fill="#2e3640" stroke="#0a0e12" strokeWidth="2.5" />
      {/* Visor */}
      <path d="M22 34 Q45 30 68 34 L68 46 Q45 50 22 46Z"
        fill="#1e242c" stroke="#0a0e12" strokeWidth="2" />
      {/* Visor slits — red glow */}
      <rect x="26" y="37" width="16" height="4" rx="2" fill="#dc2626" opacity="0.9" />
      <rect x="48" y="37" width="16" height="4" rx="2" fill="#dc2626" opacity="0.9" />
      {/* Glow effect */}
      <rect x="27" y="37.5" width="14" height="3" rx="1.5" fill="#ff4444" opacity="0.6" />
      <rect x="49" y="37.5" width="14" height="3" rx="1.5" fill="#ff4444" opacity="0.6" />
      {/* Helmet crest */}
      <path d="M38 4 Q45 -4 52 4" stroke="#0a0e12" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M40 4 Q45 -2 50 4" fill="#dc2626" opacity="0.8" />
      {/* Cheek guards */}
      <path d="M16 28 Q6 22 10 14 Q20 18 22 30Z" fill="#4a5462" stroke="#0a0e12" strokeWidth="2" />
      <path d="M74 28 Q84 22 80 14 Q70 18 68 30Z" fill="#4a5462" stroke="#0a0e12" strokeWidth="2" />
    </svg>
  )
}

function DarkKnightSwordArmSVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none" overflow="visible">
      {/* Sword blade */}
      <rect x="70" y="-8" width="9" height="62" rx="1" fill="#b0bec5" stroke="#0a0e12" strokeWidth="2" />
      {/* Blade point */}
      <path d="M70 54 L74.5 66 L79 54Z" fill="#b0bec5" stroke="#0a0e12" strokeWidth="1.5" />
      {/* Crossguard */}
      <rect x="60" y="50" width="30" height="8" rx="3" fill="#4a3a28" stroke="#0a0e12" strokeWidth="2" />
      {/* Guard decorations */}
      <circle cx="62" cy="54" r="3" fill="#8a9ab0" stroke="#0a0e12" strokeWidth="1.5" />
      <circle cx="88" cy="54" r="3" fill="#8a9ab0" stroke="#0a0e12" strokeWidth="1.5" />
      {/* Grip */}
      <rect x="69" y="56" width="12" height="16" rx="4" fill="#2a1a0a" stroke="#0a0e12" strokeWidth="2" />
      <path d="M69 62 L81 62" stroke="#4a3a28" strokeWidth="2" />
      <path d="M69 68 L81 68" stroke="#4a3a28" strokeWidth="2" />
      {/* Pommel */}
      <circle cx="75" cy="74" r="6" fill="#4a5462" stroke="#0a0e12" strokeWidth="2" />
      {/* Right arm gauntlet */}
      <path d="M62 56 Q78 58 84 74 Q86 86 76 88 Q66 90 64 78 Q62 64 56 62Z"
        fill="#2e3640" stroke="#0a0e12" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Gauntlet */}
      <rect x="58" y="46" width="18" height="16" rx="5" fill="#2e3640" stroke="#0a0e12" strokeWidth="2" />
    </svg>
  )
}

// ─────────────────────────────────────────────
// DRAGON
// ─────────────────────────────────────────────
function DragonBodySVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none">
      {/* Wing (left, behind body) */}
      <path d="M20 50 Q-10 20 -8 60 Q-6 90 20 80 Q10 70 8 58 Q10 40 20 50Z"
        fill="#6b0000" stroke="#1a0000" strokeWidth="2" opacity="0.9" />

      {/* Tail */}
      <path d="M24 100 Q10 108 8 118 Q10 122 16 120 Q22 118 26 110 Q28 102 24 100Z"
        fill="#8b0000" stroke="#1a0000" strokeWidth="2" />
      <path d="M16 120 Q14 126 18 128 Q22 126 20 120Z" fill="#8b0000" stroke="#1a0000" strokeWidth="1.5" />

      {/* Left arm/claw */}
      <path d="M18 60 Q4 70 2 90 Q2 102 12 104 Q22 106 24 94 Q26 78 32 68Z"
        fill="#8b0000" stroke="#1a0000" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Left claw */}
      <ellipse cx="9" cy="104" rx="11" ry="8" fill="#8b0000" stroke="#1a0000" strokeWidth="2" />
      <path d="M2 101 L-2 108" stroke="#1a0000" strokeWidth="3" strokeLinecap="round" />
      <path d="M7 105 L5 112" stroke="#1a0000" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 106 L12 113" stroke="#1a0000" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 104 L20 110" stroke="#1a0000" strokeWidth="3" strokeLinecap="round" />

      {/* Legs */}
      <path d="M24 94 Q18 108 16 120 Q20 126 36 124 Q46 122 46 112 Q44 98 44 94Z"
        fill="#8b0000" stroke="#1a0000" strokeWidth="2.5" />
      <path d="M66 94 Q72 108 74 120 Q70 126 54 124 Q44 122 44 112 Q46 98 46 94Z"
        fill="#8b0000" stroke="#1a0000" strokeWidth="2.5" />
      {/* Clawed feet */}
      <ellipse cx="30" cy="122" rx="14" ry="6" fill="#6b0000" stroke="#1a0000" strokeWidth="2" />
      <ellipse cx="60" cy="122" rx="14" ry="6" fill="#6b0000" stroke="#1a0000" strokeWidth="2" />
      <path d="M18 121 L16 126" stroke="#1a0000" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 123 L23 128" stroke="#1a0000" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 124 L30 129" stroke="#1a0000" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M36 123 L38 128" stroke="#1a0000" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M48 123 L46 128" stroke="#1a0000" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 124 L54 129" stroke="#1a0000" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 123 L62 128" stroke="#1a0000" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66 121 L68 126" stroke="#1a0000" strokeWidth="2.5" strokeLinecap="round" />

      {/* Body — large */}
      <path d="M12 52 Q6 68 6 84 Q6 102 30 104 Q45 106 60 104 Q84 102 84 84 Q84 68 78 52 Q64 44 45 44 Q26 44 12 52Z"
        fill="#8b0000" stroke="#1a0000" strokeWidth="2.5" />
      {/* Belly scales */}
      <path d="M26 62 Q45 58 64 62 Q66 78 60 90 Q52 100 45 98 Q38 100 30 90 Q24 78 26 62Z"
        fill="#c47c50" stroke="#c47c50" strokeWidth="1.5" />
      {/* Back spines */}
      <path d="M35 44 Q32 34 35 30" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" />
      <path d="M42 43 Q40 30 43 26" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" />
      <path d="M49 43 Q49 29 52 25" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" />
      <path d="M56 44 Q57 32 60 29" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" />

      {/* Neck */}
      <path d="M30 44 Q34 36 45 34 Q56 36 60 44 L60 52 Q55 46 45 46 Q35 46 30 52Z"
        fill="#8b0000" stroke="#1a0000" strokeWidth="2" />

      {/* Head — large, reptilian */}
      <path d="M14 22 Q14 -2 45 -2 Q76 -2 76 22 Q76 48 64 56 Q45 64 26 56 Q14 48 14 22Z"
        fill="#8b0000" stroke="#1a0000" strokeWidth="2.5" />

      {/* Horns */}
      <path d="M26 4 Q18 -14 24 -18 Q30 -12 28 4Z" fill="#4a0000" stroke="#1a0000" strokeWidth="2" />
      <path d="M64 4 Q72 -14 66 -18 Q60 -12 62 4Z" fill="#4a0000" stroke="#1a0000" strokeWidth="2" />
      <path d="M34 2 Q28 -10 32 -14 Q37 -8 36 2Z" fill="#6b0000" stroke="#1a0000" strokeWidth="1.5" />
      <path d="M56 2 Q62 -10 58 -14 Q53 -8 54 2Z" fill="#6b0000" stroke="#1a0000" strokeWidth="1.5" />

      {/* Eyes — glowing yellow */}
      <ellipse cx="28" cy="28" rx="10" ry="9" fill="#f57f17" stroke="#1a0000" strokeWidth="1.5" />
      <ellipse cx="62" cy="28" rx="10" ry="9" fill="#f57f17" stroke="#1a0000" strokeWidth="1.5" />
      <circle cx="28" cy="28" r="7" fill="#e65100" />
      <circle cx="62" cy="28" r="7" fill="#e65100" />
      <ellipse cx="28" cy="28" rx="2" ry="6" fill="#1a0000" />
      <ellipse cx="62" cy="28" rx="2" ry="6" fill="#1a0000" />
      <circle cx="30" cy="25" r="2.5" fill="white" opacity="0.7" />
      <circle cx="64" cy="25" r="2.5" fill="white" opacity="0.7" />

      {/* Snout */}
      <path d="M28 44 Q36 52 45 52 Q54 52 62 44 L60 50 Q52 60 45 60 Q38 60 30 50Z"
        fill="#6b0000" stroke="#1a0000" strokeWidth="2" />
      {/* Nostrils */}
      <circle cx="38" cy="46" r="3.5" fill="#4a0000" />
      <circle cx="52" cy="46" r="3.5" fill="#4a0000" />
      {/* Teeth — smaller */}
      <path d="M30 50 L29 54" stroke="#f0ead8" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 53 L37 57" stroke="#f0ead8" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 53 L53 57" stroke="#f0ead8" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 50 L61 54" stroke="#f0ead8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function DragonClawArmSVG() {
  return (
    <svg width="84" height="112" viewBox="0 0 90 120" fill="none" overflow="visible">
      {/* Fire breath */}
      <path d="M64 36 Q82 18 92 8 Q94 20 86 28 Q96 22 100 28 Q94 38 82 38 Q90 44 88 52 Q78 48 70 44Z"
        fill="#ff8c00" opacity="0.8" />
      <path d="M64 36 Q80 22 90 12 Q90 22 84 28 Q90 26 92 32 Q86 38 78 36 Q84 40 82 48 Q74 46 68 42Z"
        fill="#ffb300" opacity="0.9" />
      <path d="M64 36 Q78 26 85 20 Q85 28 80 32 Q84 30 86 36 Q80 40 74 36Z"
        fill="#fff176" opacity="0.7" />
      {/* Right arm */}
      <path d="M62 50 Q78 52 86 68 Q88 80 78 84 Q68 88 66 76 Q64 62 56 60Z"
        fill="#8b0000" stroke="#1a0000" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Claw (large) */}
      <ellipse cx="80" cy="82" rx="14" ry="10" fill="#8b0000" stroke="#1a0000" strokeWidth="2" />
      <path d="M70 80 L66 90" stroke="#1a0000" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M77 84 L75 94" stroke="#1a0000" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M84 84 L84 94" stroke="#1a0000" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M90 82 L93 90" stroke="#1a0000" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

// ─────────────────────────────────────────────
// Enemy registry
// ─────────────────────────────────────────────
const ENEMIES = {
  goblin:    { Body: React.memo(GoblinBodySVG),    Weapon: React.memo(GoblinClubArmSVG),     splashColor: '#fbbf24', pivotX: 66, pivotY: 50 },
  skeleton:  { Body: React.memo(SkeletonBodySVG),  Weapon: React.memo(SkeletonScytheArmSVG), splashColor: '#a78bfa', pivotX: 66, pivotY: 50 },
  orc:       { Body: React.memo(OrcBodySVG),       Weapon: React.memo(OrcAxeArmSVG),         splashColor: '#fb923c', pivotX: 66, pivotY: 50 },
  darkKnight:{ Body: React.memo(DarkKnightBodySVG),Weapon: React.memo(DarkKnightSwordArmSVG),splashColor: '#94a3b8', pivotX: 66, pivotY: 50 },
  dragon:    { Body: React.memo(DragonBodySVG),    Weapon: React.memo(DragonClawArmSVG),     splashColor: '#f87171', pivotX: 66, pivotY: 50 },
}

// Per-enemy visual scale applied to raster sprites
const RASTER_SCALE = { goblin: 0.8, orc: 1.2, darkKnight: 1.2, dragon: 1.7 }

/* eslint-disable no-undef */
const _VER  = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'
const _BASE = import.meta.env.BASE_URL
const _img  = (f) => `${_BASE}${f}?v=${_VER}`
const RASTER_KEY = 'numknight_raster_bg'

// Raster sprite sets — 4 poses per enemy
const RASTER_ENEMIES = {
  goblin: {
    idle:   _img('assets/characters/goblin/goblin-idle.webp'),
    attack: _img('assets/characters/goblin/goblin-attack.webp'),
    hit:    _img('assets/characters/goblin/goblin-hit.webp'),
    dead:   _img('assets/characters/goblin/goblin-dead.webp'),
    splashColor: '#fbbf24',
  },
  skeleton: {
    idle:   _img('assets/characters/skeleton/skeleton-idle.webp'),
    attack: _img('assets/characters/skeleton/skeleton-attack.webp'),
    hit:    _img('assets/characters/skeleton/skeleton-hit.webp'),
    dead:   _img('assets/characters/skeleton/skeleton-dead.webp'),
    splashColor: '#a78bfa',
  },
  orc: {
    idle:   _img('assets/characters/orc/orc-idle.webp'),
    attack: _img('assets/characters/orc/orc-attack.webp'),
    hit:    _img('assets/characters/orc/orc-hit.webp'),
    dead:   _img('assets/characters/orc/orc-dead.webp'),
    splashColor: '#fb923c',
  },
  darkKnight: {
    idle:   _img('assets/characters/dark-knight/dark-knight-idle.webp'),
    attack: _img('assets/characters/dark-knight/dark-knight-attack.webp'),
    hit:    _img('assets/characters/dark-knight/dark-knight-hit.webp'),
    dead:   _img('assets/characters/dark-knight/dark-knight-dead.webp'),
    splashColor: '#94a3b8',
  },
  dragon: {
    idle:   _img('assets/characters/dragon/dragon-idle.webp'),
    attack: _img('assets/characters/dragon/dragon-attack.webp'),
    hit:    _img('assets/characters/dragon/dragon-hit.webp'),
    dead:   _img('assets/characters/dragon/dragon-dead.webp'),
    splashColor: '#f87171',
  },
}

// ─────────────────────────────────────────────
// Animated enemy wrapper (shared for all)
// ─────────────────────────────────────────────
export function EnemyCharacter({ phase, enemy, hitKey, raging = false }) {
  const cfg = ENEMIES[enemy.id] ?? ENEMIES.goblin
  const { Body, Weapon, splashColor, pivotX, pivotY } = cfg
  const rasterSprites = (localStorage.getItem(RASTER_KEY) === 'true') ? (RASTER_ENEMIES[enemy.id] ?? null) : null

  const moveControls = useAnimation()
  const weaponControls = useAnimation()
  const idleTimerRef = useRef(null)
  const [splashKey, setSplashKey] = useState(null)
  const [sprite, setSprite] = useState('idle')

  // Preload sprites on mount
  useEffect(() => {
    if (!rasterSprites) return
    Object.values(rasterSprites).forEach(v => { if (typeof v === 'string') new Image().src = v })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Enemy attacks — lunges left + sprite swap
  useEffect(() => {
    if (phase === 'hit') {
      if (rasterSprites) setSprite('attack')
      if (enemy.id !== 'dragon') moveControls.start({ x: [0, rasterSprites ? -55 : -80, 0], transition: { duration: 0.45, ease: 'easeInOut' } })
      if (!rasterSprites) weaponControls.start({ rotate: [0, 62, -12, 0], transition: { duration: 0.45, times: [0, 0.32, 0.62, 1] } })
      if (rasterSprites) { const t = setTimeout(() => setSprite('idle'), 300); return () => clearTimeout(t) }
    }
    if (phase === 'won') {
      if (rasterSprites) { setSprite('dead'); return }
      moveControls.start({
        x: [0, -18, 160], rotate: [0, -12, -80], opacity: [1, 1, 0],
        transition: { duration: 0.65, times: [0, 0.25, 1], ease: 'easeIn' },
      })
    }
    if (phase === 'idle' && rasterSprites) setSprite('idle')
  }, [phase, moveControls, weaponControls, rasterSprites]) // eslint-disable-line react-hooks/exhaustive-deps

  // Enemy takes a hit — recoil + splash + sprite swap
  useEffect(() => {
    if (hitKey > 0) {
      if (rasterSprites) setSprite('hit')
      moveControls.start({ x: [0, 12, -5, 0], transition: { duration: 0.35 } })
      if (!rasterSprites) weaponControls.start({ rotate: [0, -15, 5, 0], transition: { duration: 0.35 } })
      setSplashKey(hitKey)
      const t1 = setTimeout(() => setSplashKey(null), 550)
      const t2 = rasterSprites ? setTimeout(() => setSprite('idle'), 350) : null
      return () => { clearTimeout(t1); if (t2) clearTimeout(t2) }
    }
  }, [hitKey, moveControls, weaponControls, rasterSprites]) // eslint-disable-line react-hooks/exhaustive-deps

  // Idle weapon wiggle (SVG only)
  useEffect(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (phase !== 'idle' || rasterSprites) return
    const schedule = () => {
      const minDelay = raging ? 4000 : 8000
      idleTimerRef.current = setTimeout(() => {
        weaponControls.start({ rotate: [0, -15, 0], transition: { duration: 0.4, ease: 'easeInOut' } })
        schedule()
      }, minDelay + Math.random() * (raging ? 3000 : 6000))
    }
    schedule()
    return () => clearTimeout(idleTimerRef.current)
  }, [phase, raging, rasterSprites]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={phase === 'idle' ? { y: [0, -2, 0] } : { y: 0 }}
        transition={
          phase === 'idle'
            ? { duration: raging ? 1.8 : 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }
            : { duration: 0.2 }
        }
        style={{ willChange: 'transform' }}
      >
        <motion.div animate={moveControls} style={{ willChange: 'transform' }}>
          {rasterSprites ? (
            /* Raster: sprite already faces left — no scaleX needed */
            <div style={{ position: 'relative', zIndex: 0, width: 'min(170px, 37vw)', flexShrink: 0, overflow: 'visible', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
              {splashKey !== null && <HitSplash key={splashKey} color={rasterSprites.splashColor} />}
              <div style={RASTER_SCALE[enemy.id] ? { transform: `scale(${RASTER_SCALE[enemy.id]})`, transformOrigin: 'center bottom', display: 'inline-block' } : undefined}>
                <img src={rasterSprites[sprite]} style={{ height: 'min(150px, 33vw)', width: 'auto', maxWidth: 'none', display: 'block', flexShrink: 0 }} alt="" />
              </div>
            </div>
          ) : (
            /* SVG: source faces right, flip to face left */
            <div style={{ transform: 'scaleX(-1)' }}>
              <div style={{ position: 'relative', width: 84, height: 112, overflow: 'visible' }}>
                <Body />
                <motion.div
                  animate={weaponControls}
                  style={{ position: 'absolute', top: 0, left: 0, width: 84, height: 112, overflow: 'visible', transformOrigin: `${pivotX}px ${pivotY}px` }}
                >
                  <Weapon />
                </motion.div>
                {splashKey !== null && <HitSplash key={splashKey} color={splashColor} />}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
