import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Novels, Chapters } from '../services/api.js'

export default function NovelDetailPage() {
  const { id } = useParams()
  const [novel, setNovel] = useState(null)
  const [chapters, setChapters] = useState([])

  useEffect(() => {
    Novels.get(id).then(setNovel)
    Chapters.list(id).then(r => setChapters(r.data || []))
  }, [id])

  if (!novel) return <p>Loading...</p>

  return (
    <div>
      <h2>{novel.title}</h2>
      <p>Status: {novel.status} — {novel.progress_percentage}%</p>
      <ul>
        {chapters.map(c => (
          <li key={c.id}>Chapter {c.chapter_number}: {c.title} — {c.status}</li>
        ))}
      </ul>
    </div>
  )
}


