import React, { useEffect, useState } from 'react'
import { API_BASE } from '../utils/constants.js'

export default function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('claude-4.1')
  const [theme, setTheme] = useState('light')
  const [exportFormat, setExportFormat] = useState('json')

  useEffect(() => {
    fetch(`${API_BASE.replace('/api/v1','')}/api/v1/settings`)
      .then(r => r.ok ? r.json() : {})
      .then(j => { if (j?.anthropic_api_key) setApiKey('') })
      .catch(() => {})
  }, [])

  async function save() {
    localStorage.setItem('model', model)
    localStorage.setItem('theme', theme)
    localStorage.setItem('exportFormat', exportFormat)
    if (apiKey) {
      await fetch(`${API_BASE.replace('/api/v1','')}/api/v1/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anthropic_api_key: apiKey })
      })
      setApiKey('')
      alert('Server API key saved securely')
    } else {
      alert('Settings saved')
    }
  }

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <h2>Settings</h2>
      <label>API Key <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Set server-side API key" /></label>
      <label>Model
        <select value={model} onChange={e => setModel(e.target.value)}>
          <option value="claude-4.1">Claude Opus 4.1</option>
          <option value="claude-3-sonnet-20240229">Claude Sonnet 3</option>
        </select>
      </label>
      <label>Theme
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option>light</option>
          <option>dark</option>
        </select>
      </label>
      <label>Default export format
        <select value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
          <option>json</option>
          <option>txt</option>
        </select>
      </label>
      <button onClick={save}>Save</button>
    </div>
  )
}


