import { useEffect, useState } from 'react'

export function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw == null ? defaultValue : JSON.parse(raw)
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)) } catch {}
  }, [key, state])

  useEffect(() => {
    function onStorage(e) {
      if (e.key === key) {
        try { setState(JSON.parse(e.newValue)) } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  function clear() { try { localStorage.removeItem(key); setState(defaultValue) } catch {} }

  return [state, setState, clear]
}


