import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { API_BASE } from '../utils/constants.js'

export function useApi({ base = API_BASE, retries = 2, cacheTimeMs = 30000 } = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortRef = useRef(null)
  const cacheRef = useRef(new Map())

  useEffect(() => () => abortRef.current?.abort?.(), [])

  const getCacheKey = useCallback((url, options) => `${url}::${JSON.stringify(options || {})}`, [])

  const request = useCallback(async (path, options = {}, { useCache = false } = {}) => {
    const url = `${base}${path}`
    const key = getCacheKey(url, options)
    if (useCache) {
      const hit = cacheRef.current.get(key)
      if (hit && Date.now() - hit.t < cacheTimeMs) {
        setData(hit.v); setError(null); setLoading(false)
        return hit.v
      }
    }

    abortRef.current?.abort?.()
    abortRef.current = new AbortController()
    let attempt = 0
    setLoading(true); setError(null)
    while (attempt <= retries) {
      try {
        const res = await fetch(url, { ...options, signal: abortRef.current.signal })
        if (!res.ok) throw new Error((await safeJson(res))?.error || res.statusText)
        const out = await autoBody(res)
        setData(out); setLoading(false)
        cacheRef.current.set(key, { v: out, t: Date.now() })
        return out
      } catch (e) {
        if (e.name === 'AbortError') { setLoading(false); throw e }
        attempt++
        if (attempt > retries) { setError(e); setLoading(false); throw e }
        await new Promise(r => setTimeout(r, 300 * attempt))
      }
    }
  }, [base, retries, cacheTimeMs])

  const cancel = useCallback(() => abortRef.current?.abort?.(), [])

  const paginate = useCallback(async (path, { page = 1, per_page = 20 } = {}) => {
    const qs = new URLSearchParams({ page, per_page }).toString()
    return request(`${path}?${qs}`, {}, { useCache: true })
  }, [request])

  return { data, error, loading, request, cancel, paginate }
}

async function safeJson(res) { try { return await res.json() } catch { return null } }
async function autoBody(res) {
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}


