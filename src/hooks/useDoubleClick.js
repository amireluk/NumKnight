import { useRef } from 'react'

// Returns event handlers that fire `callback` on double-tap / double-click
// within `delay` ms (default 350ms).
export function useDoubleClick(callback, delay = 350) {
  const lastTap = useRef(0)

  const handle = () => {
    const now = Date.now()
    if (now - lastTap.current < delay) {
      callback()
      lastTap.current = 0
    } else {
      lastTap.current = now
    }
  }

  return { onClick: handle, onTouchEnd: handle }
}
