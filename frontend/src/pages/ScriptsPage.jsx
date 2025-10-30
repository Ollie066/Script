import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Scripts } from '../services/api.js'

export default function ScriptsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    Scripts.list().then(r => setItems(r.data || [])).catch(e => setError(e.message))
  }, [])

  return (
    <div>
      <h2>Scripts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {items.map(s => (
          <li key={s.id}>
            <Link to={`/scripts/${s.id}`}>{s.title}</Link> — {s.status}
          </li>
        ))}
      </ul>
    </div>
  )
}


