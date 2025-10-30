import { API_BASE } from '../utils/constants.js'

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${API_BASE}${path}`
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers }
  }
  if (body !== undefined) opts.body = JSON.stringify(body)

  const res = await fetch(url, opts)
  if (!res.ok) {
    let error
    try { error = await res.json() } catch { error = { error: res.statusText } }
    throw new Error(error.error || res.statusText)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export const Scripts = {
  create: (payload) => request('/scripts', { method: 'POST', body: payload }),
  list: (params = {}) => request(`/scripts${toQuery(params)}`),
  get: (id) => request(`/scripts/${id}`),
  delete: (id) => request(`/scripts/${id}`, { method: 'DELETE' }),
  reprocess: (id) => request(`/scripts/${id}/reprocess`, { method: 'POST' })
}

export const Novels = {
  list: (params = {}) => request(`/novels${toQuery(params)}`),
  get: (id) => request(`/novels/${id}`),
  update: (id, attrs) => request(`/novels/${id}`, { method: 'PATCH', body: attrs }),
  regenerate: (id, chapters) => request(`/novels/${id}/regenerate`, { method: 'POST', body: { chapters } }),
  export: (id, format = 'json') => request(`/novels/${id}/export?format=${encodeURIComponent(format)}`)
}

export const Chapters = {
  list: (novelId, params = {}) => request(`/novels/${novelId}/chapters${toQuery(params)}`),
  get: (id) => request(`/chapters/${id}`),
  update: (id, attrs) => request(`/chapters/${id}`, { method: 'PATCH', body: attrs }),
  regenerate: (id) => request(`/chapters/${id}/regenerate`, { method: 'POST' })
}

export const ReferenceBooks = {
  list: (params = {}) => request(`/reference_books${toQuery(params)}`),
  create: (payload) => request('/reference_books', { method: 'POST', body: payload }),
  delete: (id) => request(`/reference_books/${id}`, { method: 'DELETE' })
}

export const Contexts = {
  create: (scriptId, payload) => request(`/scripts/${scriptId}/contexts`, { method: 'POST', body: payload }),
  update: (id, payload) => request(`/contexts/${id}`, { method: 'PATCH', body: payload }),
  delete: (id) => request(`/contexts/${id}`, { method: 'DELETE' })
}

function toQuery(params) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  if (!entries.length) return ''
  const str = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
  return `?${str}`
}


