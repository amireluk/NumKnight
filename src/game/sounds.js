let audioCtx = null

const MUTE_KEY = 'numknight_mute'

export function isMuted() {
  return localStorage.getItem(MUTE_KEY) === 'true'
}

export function toggleMute() {
  localStorage.setItem(MUTE_KEY, isMuted() ? 'false' : 'true')
}

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function tone(ctx, freq, type, startTime, duration, volume = 0.3) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)
  gain.gain.setValueAtTime(volume, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.01)
}

function sweep(ctx, freqStart, freqEnd, type, startTime, duration, volume = 0.2) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freqStart, startTime)
  osc.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration)
  gain.gain.setValueAtTime(volume, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.01)
}

export function playCorrect() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  tone(ctx, 523, 'sine', t, 0.12, 0.2)
  tone(ctx, 659, 'sine', t + 0.1, 0.15, 0.2)
}

export function playWrong() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  tone(ctx, 220, 'sawtooth', t, 0.08, 0.12)
  tone(ctx, 200, 'sawtooth', t + 0.06, 0.2, 0.1)
}

export function playSwordSwing() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  sweep(ctx, 700, 100, 'sawtooth', t, 0.22, 0.15)
}

export function playImpact() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  sweep(ctx, 180, 35, 'sine', t, 0.18, 0.45)
}

export function playPowerStrike() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  sweep(ctx, 1000, 60, 'sawtooth', t, 0.3, 0.18)
  tone(ctx, 80, 'sine', t + 0.18, 0.25, 0.5)
}

export function playVictory() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  ;[523, 659, 784, 1047].forEach((freq, i) => {
    tone(ctx, freq, 'sine', t + i * 0.14, 0.22, 0.25)
  })
}

export function playDefeat() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  ;[392, 349, 311, 262].forEach((freq, i) => {
    tone(ctx, freq, 'sine', t + i * 0.22, 0.3, 0.18)
  })
}

// ── Boss shield sounds ─────────────────────────────────────────────────────────

export function playShieldCrack() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  sweep(ctx, 800, 1400, 'sine', t, 0.15, 0.3)
}

export function playShieldShatter() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  tone(ctx, 400, 'sawtooth', t, 0.3, 0.35)
  tone(ctx, 600, 'square',   t, 0.3, 0.18)
}

export function playShieldRestore() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  sweep(ctx, 300, 620, 'sine', t, 0.4, 0.2)
}

// ── Timer sounds ───────────────────────────────────────────────────────────────

export function playTimerTick() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  tone(ctx, 1000, 'sine', t, 0.05, 0.15)
}

export function playTimerExpiry() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  tone(ctx, 200, 'sawtooth', t, 0.4, 0.45)
}

// ── Trophy / area clear sounds ─────────────────────────────────────────────────

// grade: 'gold' (3 notes) | 'silver' (2 notes) | 'bronze' (1 note)
export function playTrophyReveal(grade = 'bronze') {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  const notes = grade === 'gold' ? [523, 659, 784] : grade === 'silver' ? [523, 659] : [523]
  notes.forEach((freq, i) => tone(ctx, freq, 'sine', t + i * 0.1, 0.22, 0.25))
}

export function playAreaCleared() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  ;[523, 659, 784, 1047].forEach((freq, i) => {
    tone(ctx, freq, 'sine', t + i * 0.18, 0.3, 0.25)
  })
}

// ── World map sounds ───────────────────────────────────────────────────────────

export function playMapTap() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  tone(ctx, 150, 'sine', t, 0.08, 0.3)
}

export function playMapLocked() {
  if (isMuted()) return
  const ctx = getCtx()
  const t = ctx.currentTime
  sweep(ctx, 100, 70, 'sine', t, 0.12, 0.25)
}
