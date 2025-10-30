import { useEffect, useMemo, useState } from 'react'

export function useProgress({ total = 0, completed = 0, startTime = null } = {}) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const percent = useMemo(() => total > 0 ? Math.round((completed / total) * 100) : 0, [completed, total])
  const elapsedSec = useMemo(() => startTime ? Math.round((now - startTime) / 1000) : 0, [now, startTime])
  const etaSec = useMemo(() => {
    if (!startTime || percent <= 0) return null
    const rate = completed / elapsedSec // units per second
    if (rate <= 0) return null
    const remaining = total - completed
    return Math.max(0, Math.round(remaining / rate))
  }, [completed, total, elapsedSec, startTime])

  function format(seconds) {
    if (seconds == null) return '—'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  return { percent, elapsedSec, etaSec, format }
}


