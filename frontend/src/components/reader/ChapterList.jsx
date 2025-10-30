import React, { useMemo, useState } from 'react'

export default function ChapterList({ chapters = [], activeId, onSelect, bookmarks = [] }) {
  const [open, setOpen] = useState(true)
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const t = q.toLowerCase()
    return chapters.filter(c => !t || c.title?.toLowerCase().includes(t) || String(c.chapter_number).includes(t))
  }, [q, chapters])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" onClick={() => setOpen(o => !o)}>{open ? '▾' : '▸'}</button>
        <strong>Chapters</strong>
      </div>
      {open && (
        <div style={{ marginTop: 8 }}>
          <input placeholder="Search chapters" value={q} onChange={e => setQ(e.target.value)} />
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 8, maxHeight: 320, overflow: 'auto' }}>
            {filtered.map(c => (
              <li key={c.id}>
                <button
                  onClick={() => onSelect?.(c)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: c.id === activeId ? '#eef' : 'transparent',
                    border: '1px solid #ddd',
                    marginBottom: 6,
                    borderRadius: 6,
                    padding: 8
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{c.chapter_number}. {c.title}</span>
                    <span style={{ opacity: 0.7 }}>{c.word_count?.toLocaleString?.() || 0}w</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 12, marginTop: 4 }}>
                    <StatusBadge status={c.status} />
                    {bookmarks.includes(c.id) && <span>🔖</span>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const color = status === 'completed' ? '#4caf50' : status === 'generating' ? '#ff9800' : '#999'
  return <span style={{ color }}>{status}</span>
}


