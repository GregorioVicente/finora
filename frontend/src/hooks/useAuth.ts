import { useCallback, useEffect, useState } from 'react'
import { SESSION_EXPIRED_EVENT } from '../services/api'
import type { Auth } from '../types'

const readStoredAuth = (): Auth | null => {
  const saved = localStorage.getItem('finora_auth')
  const token = localStorage.getItem('finora_token')
  if (!saved || !token) return null
  try { return JSON.parse(saved) as Auth } catch {
    localStorage.removeItem('finora_auth')
    localStorage.removeItem('finora_token')
    return null
  }
}

export function useAuth() {
  const [auth, setAuth] = useState<Auth | null>(readStoredAuth)

  const logout = useCallback(() => {
    localStorage.removeItem('finora_token')
    localStorage.removeItem('finora_auth')
    setAuth(null)
  }, [])

  const authenticate = useCallback((nextAuth: Auth) => {
    localStorage.setItem('finora_token', nextAuth.token)
    localStorage.setItem('finora_auth', JSON.stringify(nextAuth))
    setAuth(nextAuth)
  }, [])

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, logout)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, logout)
  }, [logout])

  return { auth, authenticate, logout }
}
