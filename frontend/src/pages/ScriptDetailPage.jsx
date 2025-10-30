import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Scripts } from '../services/api.js'
import { useApp } from '../contexts/AppContext.jsx'

export default function ScriptDetailPage() {
  const { id } = useParams()
  const [script, setScript] = useState(null)
  const { subscribeToGeneration } = useApp()

  useEffect(() => {
    Scripts.get(id).then(setScript)
  }, [id])

  useEffect(() => {
    if (!script) return
    const sub = subscribeToGeneration(script.id, {
      onProgress: (d) => setScript(prev => ({ ...prev })),
      onStatus: (d) => setScript(prev => ({ ...prev, status: d.status })),
      onComplete: () => setScript(prev => ({ ...prev, status: 'completed' }))
    })
    return () => sub?.unsubscribe?.()
  }, [script])

  if (!script) return <p>Loading...</p>
  const progress = script.novel?.progress_percentage ?? 0

  return (
    <div>
      <h2>{script.title}</h2>
      <p>Status: {script.status}</p>
      <p>Progress: {progress}%</p>
    </div>
  )
}


