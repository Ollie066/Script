import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Novels } from '../services/api.js'

export default function NovelsPage() {
  const [items, setItems] = useState([])

  useEffect(() => {
    Novels.list().then(r => setItems(r.data || [])).catch(() => setItems([]))
  }, [])

  return (
    <div>
      <h2>Novels</h2>
      <ul>
        {items.map(n => (
          <li key={n.id}><Link to={`/novels/${n.id}`}>{n.title}</Link> — {n.status} ({n.progress_percentage}%)</li>
        ))}
      </ul>
    </div>
  )
}


