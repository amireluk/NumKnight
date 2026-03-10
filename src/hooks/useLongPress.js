import { useRef } from 'react'

// Returns event handlers that fire `callback` after `delay` ms of continuous press.
export function useLongPress(callback, delay = 2000) {
  const timer = useRef(null)

  const start = () => { timer.current = setTimeout(callback, delay) }
  const cancel = () => { clearTimeout(timer.current) }

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchCancel: cancel,
  }
}
