import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

export function useAuth() {
  const [token, setToken, clearToken] = useLocalStorage('auth.token', '')
  const [user, setUser] = useLocalStorage('auth.user', null)
  const [expiresAt, setExpiresAt] = useLocalStorage('auth.expiresAt', null)
  const [status, setStatus] = useState('anonymous')

  useEffect(() => { setStatus(token ? 'authenticated' : 'anonymous') }, [token])

  const login = useCallback(async (username, password) => {
    // Placeholder local auth; integrate with real backend as needed
    const basic = btoa(`${username}:${password}`)
    setToken(basic)
    setUser({ username })
    setExpiresAt(Date.now() + 3600_000)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(() => {
    clearToken(); setUser(null); setExpiresAt(null); setStatus('anonymous')
  }, [])

  const refresh = useCallback(() => {
    if (!expiresAt) return
    if (Date.now() > expiresAt - 60_000) setExpiresAt(Date.now() + 3600_000)
  }, [expiresAt])

  const isAuthenticated = !!token

  return { token, user, status, isAuthenticated, login, logout, refresh }
}


