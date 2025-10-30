import React, { useEffect, useMemo, useState } from 'react'
import { ReferenceBooks } from '../../services/api.js'

export default function ReferenceBookSelector({ selected = [], onChange }) {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    const r = await ReferenceBooks.list()
    setItems(r.data || [])
  }

  const filtered = useMemo(() => {
    const t = q.toLowerCase()
    return items.filter(b => !t || b.title?.toLowerCase().includes(t) || b.author?.toLowerCase().includes(t))
  }, [q, items])

  function toggle(id) {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]
    onChange?.(next)
  }

  async function add() {
    if (!title || !content) return
    await ReferenceBooks.create({ title, author, content })
    setTitle(''); setAuthor(''); setContent('')
    await refresh()
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Search references" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <ul style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #eee', padding: 8 }}>
        {filtered.map(b => (
          <li key={b.id}>
            <label>
              <input type="checkbox" checked={selected.includes(b.id)} onChange={() => toggle(b.id)} /> {b.title} — {b.author || 'Unknown'}
            </label>
          </li>
        ))}
      </ul>

      <details>
        <summary>Upload new reference</summary>
        <div style={{ display: 'grid', gap: 8 }}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
          <textarea rows={6} placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
          <button type="button" onClick={add}>Add</button>
        </div>
      </details>

      <section>
        <h4>Preview</h4>
        {selected.map(id => {
          const b = items.find(x => x.id === id)
          if (!b) return null
          return (
            <details key={id}>
              <summary>{b.title}</summary>
              <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 160, overflow: 'auto' }}>{(b.content || '').slice(0, 1200)}</pre>
            </details>
          )
        })}
      </section>
    </div>
  )
}


