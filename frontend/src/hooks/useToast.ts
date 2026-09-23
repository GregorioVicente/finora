import { useCallback, useEffect, useState } from 'react'

export function useToast(duration = 3500) {
  const [message, setMessage] = useState('')
  const dismiss = useCallback(() => setMessage(''), [])

  useEffect(() => {
    if (!message) return
    const timeout = window.setTimeout(dismiss, duration)
    return () => window.clearTimeout(timeout)
  }, [dismiss, duration, message])

  return { message, show: setMessage, dismiss }
}
