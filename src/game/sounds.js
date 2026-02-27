let audioCtx = null

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
  const ctx = getCtx()
  const t = ctx.currentTime
  tone(ctx, 523, 'sine', t, 0.12, 0.2)
  tone(ctx, 659, 'sine', t + 0.1, 0.15, 0.2)
}

export function playWrong() {
  const ctx = getCtx()
  const t = ctx.currentTime
  tone(ctx, 220, 'sawtooth', t, 0.08, 0.12)
  tone(ctx, 200, 'sawtooth', t + 0.06, 0.2, 0.1)
}

export function playSwordSwing() {
  const ctx = getCtx()
  const t = ctx.currentTime
  sweep(ctx, 700, 100, 'sawtooth', t, 0.22, 0.15)
}

export function playImpact() {
  const ctx = getCtx()
  const t = ctx.currentTime
  sweep(ctx, 180, 35, 'sine', t, 0.18, 0.45)
}

export function playPowerStrike() {
  const ctx = getCtx()
  const t = ctx.currentTime
  sweep(ctx, 1000, 60, 'sawtooth', t, 0.3, 0.18)
  tone(ctx, 80, 'sine', t + 0.18, 0.25, 0.5)
}

export function playVictory() {
  const ctx = getCtx()
  const t = ctx.currentTime
  ;[523, 659, 784, 1047].forEach((freq, i) => {
    tone(ctx, freq, 'sine', t + i * 0.14, 0.22, 0.25)
  })
}

export function playDefeat() {
  const ctx = getCtx()
  const t = ctx.currentTime
  ;[392, 349, 311, 262].forEach((freq, i) => {
    tone(ctx, freq, 'sine', t + i * 0.22, 0.3, 0.18)
  })
}
