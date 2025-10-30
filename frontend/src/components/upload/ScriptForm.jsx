import React, { useEffect, useMemo, useState } from 'react'

const GENRES = ['Romance', 'Thriller', 'Sci-Fi', 'Fantasy', 'Drama', 'Mystery']

export default function ScriptForm({ initial = {}, onSubmit, submitting }) {
  const [title, setTitle] = useState(initial.title || '')
  const [genre, setGenre] = useState(initial.genre || '')
  const [style, setStyle] = useState(initial.style || '')
  const [mature, setMature] = useState(!!initial.mature)
  const [length, setLength] = useState(initial.length || 80000)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const data = { title, genre, style, mature, length }
    localStorage.setItem('scriptForm', JSON.stringify(data))
  }, [title, genre, style, mature, length])

  useEffect(() => {
    const saved = localStorage.getItem('scriptForm')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setTitle(data.title || '')
        setGenre(data.genre || '')
        setStyle(data.style || '')
        setMature(!!data.mature)
        setLength(data.length || 80000)
      } catch {}
    }
  }, [])

  useEffect(() => {
    validate()
  }, [title, genre, style, mature, length])

  function validate() {
    const e = {}
    if (!title || title.length === 0) e.title = 'Title is required'
    if (title.length > 200) e.title = 'Max 200 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit?.({ title, genre, style, mature_content: mature, target_word_count: length })
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
      <label>Title
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Your script title" />
      </label>
      {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}

      <label>Genre
        <select value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="">Select genre</option>
          {GENRES.map(g => <option key={g} value={g.toLowerCase()}>{g}</option>)}
        </select>
      </label>

      <label>Style
        <input value={style} onChange={e => setStyle(e.target.value)} placeholder="e.g., lyrical, minimalist" list="style-suggestions" />
      </label>
      <datalist id="style-suggestions">
        <option value="lyrical" />
        <option value="minimalist" />
        <option value="noir" />
        <option value="epic" />
      </datalist>

      <label>
        <input type="checkbox" checked={mature} onChange={e => setMature(e.target.checked)} /> Mature content
      </label>
      {mature && <small style={{ color: '#b36b00' }}>Please ensure content complies with guidelines.</small>}

      <label>Target length: {length.toLocaleString()} words
        <input type="range" min={50000} max={200000} step={5000} value={length} onChange={e => setLength(parseInt(e.target.value))} />
      </label>

      <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
    </form>
  )
}


