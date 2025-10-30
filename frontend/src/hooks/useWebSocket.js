import { useEffect, useRef, useState } from 'react'

export function useWebSocket({ token = '' } = {}) {
  const [status, setStatus] = useState('disconnected')
  const socketRef = useRef(null)
  const handlersRef = useRef([])
  const reconnectRef = useRef(null)

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [token])

  function connect() {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    const host = location.hostname
    const url = (import.meta.env.VITE_WS_URL) || `${protocol}://${host}:4000/ws?token=${encodeURIComponent(token)}`
    try {
      socketRef.current = new WebSocket(url)
      socketRef.current.onopen = () => setStatus('connected')
      socketRef.current.onclose = () => { setStatus('disconnected'); scheduleReconnect() }
      socketRef.current.onerror = () => { setStatus('error'); scheduleReconnect() }
      socketRef.current.onmessage = (ev) => {
        const msg = (() => { try { return JSON.parse(ev.data) } catch { return null } })()
        if (!msg) return
        handlersRef.current.forEach(h => h?.(msg))
      }
      setStatus('connected')
    } catch (e) {
      setStatus('error')
      scheduleReconnect()
    }
  }

  function scheduleReconnect() {
    if (reconnectRef.current) return
    reconnectRef.current = setTimeout(() => {
      reconnectRef.current = null
      connect()
    }, 2000)
  }

  function disconnect() {
    handlersRef.current = []
    try { socketRef.current?.close?.() } catch {}
    socketRef.current = null
    setStatus('disconnected')
    if (reconnectRef.current) { clearTimeout(reconnectRef.current); reconnectRef.current = null }
  }

  function subscribe(params, handlers = {}) {
    if (!socketRef.current) connect()
    const handler = (data) => handlers.onMessage?.(data)
    handlersRef.current.push(handler)
    // Optional kick-off
    try { socketRef.current.send(JSON.stringify({ type: 'subscribe', ...params })) } catch {}
    return { unsubscribe() { handlersRef.current = handlersRef.current.filter(h => h !== handler) } }
  }

  return { status, subscribe, disconnect }
}


