import React, { useEffect, useState } from 'react'
import { ReferenceBooks } from '../services/api.js'

export default function ReferenceBooksPage() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    ReferenceBooks.list().then(r => setItems(r.data || []))
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    if (!title || !content) return
    await ReferenceBooks.create({ title, author, content })
    const r = await ReferenceBooks.list()
    setItems(r.data || [])
    setTitle(''); setAuthor(''); setContent('')
  }

  return (
    <div>
      <h2>Reference Books</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 600 }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows={6} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map(b => (
          <li key={b.id}>{b.title} — {b.author || 'Unknown'}</li>
        ))}
      </ul>
    </div>
  )
}


