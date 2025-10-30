export function createGenerationSubscription(scriptId, handlers = {}, token = '') {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
  const host = location.hostname
  const url = (import.meta.env.VITE_WS_URL) || `${protocol}://${host}:4000/ws?token=${encodeURIComponent(token)}`
  const ws = new WebSocket(url)
  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data)
      if (data?.type && handlers[`on${capitalize(data.type)}`]) {
        handlers[`on${capitalize(data.type)}`](data)
      }
      handlers.onMessage?.(data)
    } catch (_) {}
  }
  ws.onopen = () => {
    try { ws.send(JSON.stringify({ type: 'start_generation', script_id: scriptId })) } catch {}
  }
  ws.onclose = () => {
    handlers.onDisconnect?.()
    setTimeout(() => createGenerationSubscription(scriptId, handlers, token), 2000)
  }
  return { unsubscribe() { try { ws.close() } catch {} } }
}

function capitalize(s) {
  return (s || '').charAt(0).toUpperCase() + (s || '').slice(1)
}


