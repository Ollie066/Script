import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Novels, Chapters } from '../services/api.js'

export default function NovelEditor() {
  const { id } = useParams()
  const [novel, setNovel] = useState(null)
  const [chapters, setChapters] = useState([])
  const [active, setActive] = useState(null)
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    Novels.get(id).then(setNovel)
    Chapters.list(id).then(r => { setChapters(r.data || []); setActive(r.data?.[0] || null) })
  }, [id])

  async function save() {
    if (!active) return
    await Chapters.update(active.id, { content: active.content })
    alert('Saved')
  }

  async function regenerate() {
    if (!active) return
    await Chapters.regenerate(active.id)
    alert('Regeneration queued')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <section>
        <h3>Original Script</h3>
        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 400, overflow: 'auto' }}>{novel?.script_section || 'N/A'}</pre>
      </section>
      <section>
        <h3>Generated Novel</h3>
        <select onChange={e => setActive(chapters.find(c => c.id === parseInt(e.target.value)))}>
          {chapters.map(c => <option key={c.id} value={c.id}>{c.chapter_number}. {c.title}</option>)}
        </select>
        {active && (
          <textarea rows={18} value={active.content || ''} onChange={e => setActive({ ...active, content: e.target.value })} style={{ width: '100%' }} />
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={save}>Save</button>
          <button onClick={regenerate}>Regenerate</button>
        </div>
        <details>
          <summary>Custom Prompt</summary>
          <textarea rows={6} value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%' }} />
        </details>
      </section>
      <aside style={{ gridColumn: '1 / span 2' }}>
        <h4>Version History</h4>
        <p>Visible in chapter details page.</p>
      </aside>
    </div>
  )
}


