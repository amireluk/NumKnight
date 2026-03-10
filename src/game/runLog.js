// ─── Run Event Log ────────────────────────────────────────────────────────────
// In-memory log of battle events for the current session.
// Cleared on every new run. Readable via RunLogViewer (long-press logo).

let entries = []

export function logEvent(type, data = {}) {
  entries.push({ type, ts: Date.now(), ...data })
}

export function getLog() { return [...entries] }
export function clearLog() { entries = [] }
