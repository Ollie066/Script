import React, { useMemo, useState } from 'react'

export default function ExportOptions({ novel, chapters = [] }) {
  const [format, setFormat] = useState('txt')
  const [includeMeta, setIncludeMeta] = useState(true)
  const [cover, setCover] = useState('none')
  const [selected, setSelected] = useState([])

  const allSelected = selected.length === chapters.length

  function toggleChapter(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function toggleAll() {
    setSelected(allSelected ? [] : chapters.map(c => c.id))
  }

  function download() {
    const query = new URLSearchParams({ format })
    window.open(`http://localhost:3000/api/v1/novels/${novel.id}/export?${query}`)
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label>Format
        <select value={format} onChange={e => setFormat(e.target.value)}>
          <option value="txt">TXT</option>
          <option value="md">Markdown</option>
          <option value="html">HTML</option>
          <option value="epub" disabled>EPUB</option>
          <option value="pdf" disabled>PDF</option>
        </select>
      </label>
      <label>
        <input type="checkbox" checked={includeMeta} onChange={e => setIncludeMeta(e.target.checked)} /> Include metadata
      </label>
      <label>Cover page
        <select value={cover} onChange={e => setCover(e.target.value)}>
          <option value="none">None</option>
          <option value="basic">Basic</option>
          <option value="image" disabled>Image</option>
        </select>
      </label>

      <details>
        <summary>Select chapters ({selected.length}/{chapters.length})</summary>
        <button type="button" onClick={toggleAll} style={{ margin: '8px 0' }}>{allSelected ? 'Clear' : 'Select All'}</button>
        <ul style={{ maxHeight: 200, overflow: 'auto' }}>
          {chapters.map(c => (
            <li key={c.id}>
              <label><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleChapter(c.id)} /> {c.chapter_number}. {c.title}</label>
            </li>
          ))}
        </ul>
      </details>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={download}>Download</button>
        <button type="button" disabled>Email</button>
        <button type="button" disabled>Save to Google Drive</button>
      </div>
    </div>
  )
}


