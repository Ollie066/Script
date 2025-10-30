import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Scripts } from '../services/api.js'
import { useApp } from '../contexts/AppContext.jsx'

export default function ScriptProcessor() {
  const { id } = useParams()
  const [script, setScript] = useState(null)
  const [logs, setLogs] = useState([])
  const { subscribeToGeneration } = useApp()
  const [paused, setPaused] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    Scripts.get(id).then(setScript)
  }, [id])

  useEffect(() => {
    if (!script) return
    const sub = subscribeToGeneration(script.id, {
      onProgress: (d) => setLogs(prev => [...prev, `Chapter ${d.chapter_number}: ${d.status} (${d.progress}%)`]),
      onStatus: (d) => setLogs(prev => [...prev, `Status: ${d.status}`]),
      onError: (d) => setLogs(prev => [...prev, `Error: ${d.message}`]),
      onComplete: () => setLogs(prev => [...prev, 'Completed'])
    })
    return () => sub?.unsubscribe?.()
  }, [script])

  const elapsed = Math.round((Date.now() - startTime) / 1000)

  if (!script) return <p>Loading...</p>
  const progress = script.novel?.progress_percentage ?? 0

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2>Processing: {script.title}</h2>
      <Progress value={progress} />
      <div>Elapsed: {elapsed}s</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setPaused(p => !p)}>{paused ? 'Resume' : 'Pause'}</button>
        <button onClick={() => window.confirm('Cancel processing?') && setLogs(prev => [...prev, 'Cancelled'])}>Cancel</button>
      </div>
      <pre style={{ maxHeight: 240, overflow: 'auto', background: '#111', color: '#eee', padding: 12 }}>
        {logs.join('\n')}
      </pre>
    </div>
  )
}

function Progress({ value }) {
  return (
    <div style={{ background: '#eee', height: 10, borderRadius: 4 }}>
      <div style={{ width: `${value}%`, height: '100%', background: '#4caf50', borderRadius: 4 }} />
    </div>
  )
}


