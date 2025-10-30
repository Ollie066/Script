import React, { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react'
import { API_BASE } from '../utils/constants.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentScript, setCurrentScript] = useState(null)
  const [currentNovel, setCurrentNovel] = useState(null)
  const [preferences, setPreferences] = useState({ theme: 'light' })
  const [apiOnline, setApiOnline] = useState(true)
  const cableRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE.replace('/api/v1','')}/health`)
        setApiOnline(res.ok)
      } catch (e) {
        setApiOnline(false)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  function connectCable(token) {
    if (cableRef.current) return cableRef.current
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    const host = location.hostname
    const wsUrl = (import.meta.env.VITE_WS_URL) || `${protocol}://${host}:4000/ws?token=${encodeURIComponent(token || '')}`
    cableRef.current = new WebSocket(wsUrl)
    return cableRef.current
  }

  function subscribeToGeneration(scriptId, handlers = {}) {
    const ws = cableRef.current || connectCable()
    function onMessage(ev) {
      try {
        const data = JSON.parse(ev.data)
        if (data.type === 'chapter_progress') handlers.onProgress?.(data)
        else if (data.type === 'status_change') handlers.onStatus?.(data)
        else if (data.type === 'error') handlers.onError?.(data)
        else if (data.type === 'completed') handlers.onComplete?.(data)
      } catch (_) {}
    }
    ws.addEventListener('message', onMessage)
    // Kick off fake generation on the server
    ws.addEventListener('open', () => {
      try { ws.send(JSON.stringify({ type: 'start_generation', script_id: scriptId })) } catch {}
    }, { once: true })
    return {
      unsubscribe() { try { ws.removeEventListener('message', onMessage) } catch {} }
    }
  }

  const value = useMemo(() => ({
    currentScript,
    setCurrentScript,
    currentNovel,
    setCurrentNovel,
    preferences,
    setPreferences,
    apiOnline,
    connectCable,
    subscribeToGeneration
  }), [currentScript, currentNovel, preferences, apiOnline])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}


