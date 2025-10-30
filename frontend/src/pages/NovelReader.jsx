import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Novels, Chapters } from '../services/api.js'
import ChapterList from '../components/reader/ChapterList.jsx'
import ChapterView from '../components/reader/ChapterView.jsx'
import ReadingControls from '../components/reader/ReadingControls.jsx'
import ExportOptions from '../components/reader/ExportOptions.jsx'

export default function NovelReader() {
  const { id } = useParams()
  const [novel, setNovel] = useState(null)
  const [chapters, setChapters] = useState([])
  const [active, setActive] = useState(null)
  const [activeFull, setActiveFull] = useState(null) // detailed chapter with content
  const [fontSize, setFontSize] = useState(18)
  const [family, setFamily] = useState('serif')
  const [lineHeight, setLineHeight] = useState(1.6)
  const [theme, setTheme] = useState('light')
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    Novels.get(id).then(setNovel)
    Chapters.list(id).then(r => { setChapters(r.data || []); setActive(r.data?.[0] || null) })
  }, [id])

  // Load full chapter content when active changes
  useEffect(() => {
    if (!active?.id) return
    Chapters.get(active.id).then(setActiveFull)
  }, [active?.id])

  if (!novel) return <p>Loading...</p>

  function toggleBookmark() {
    if (!active?.id) return
    setBookmarks(prev => prev.includes(active.id) ? prev.filter(x => x !== active.id) : [...prev, active.id])
  }

  function toggleFullscreen() {
    const el = document.documentElement
    if (!document.fullscreenElement) el.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: 16 }}>
      <aside style={{ borderRight: '1px solid #ddd', paddingRight: 12 }}>
        <ChapterList chapters={chapters} activeId={active?.id} onSelect={setActive} bookmarks={bookmarks} />
        <div style={{ marginTop: 16 }}>
          <ReadingControls
            fontSize={fontSize} setFontSize={setFontSize}
            family={family} setFamily={setFamily}
            theme={theme} setTheme={setTheme}
            lineHeight={lineHeight} setLineHeight={setLineHeight}
            onToggleFullscreen={toggleFullscreen}
            onBookmark={toggleBookmark}
          />
        </div>
      </aside>
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{novel.title}</h2>
          <span style={{ opacity: 0.7 }}>{novel.progress_percentage}%</span>
        </div>
        <div style={{ marginTop: 12 }}>
          {activeFull ? (
            <ChapterView chapter={activeFull} fontSize={fontSize} lineHeight={lineHeight} family={family} theme={theme} />
          ) : (
            <p>Loading chapter...</p>
          )}
        </div>
      </section>
      <aside style={{ borderLeft: '1px solid #ddd', paddingLeft: 12 }}>
        <h3>Export</h3>
        <ExportOptions novel={novel} chapters={chapters} />
      </aside>
    </div>
  )
}

function ExportButtons({ id }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <a href={`http://localhost:3000/api/v1/novels/${id}/export?format=json`} target="_blank" rel="noreferrer">Export JSON</a>
      <a href={`http://localhost:3000/api/v1/novels/${id}/export?format=txt`} target="_blank" rel="noreferrer">Export TXT</a>
    </div>
  )
}


