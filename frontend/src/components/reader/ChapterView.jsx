import React, { useMemo } from 'react'

export default function ChapterView({ chapter, fontSize = 18, lineHeight = 1.6, family = 'serif', theme = 'light' }) {
  const text = chapter?.content || ''
  const paragraphs = useMemo(() => text.split(/\n\s*\n/), [text])
  const words = text.trim().split(/\s+/).filter(Boolean)
  const readingMinutes = Math.max(1, Math.round(words.length / 250))
  const progress = chapter?.word_count ? Math.min(100, Math.round((chapter.word_count / Math.max(1, words.length)) * 100)) : 0

  return (
    <div style={{
      fontSize,
      lineHeight,
      fontFamily: family === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif',
      background: theme === 'dark' ? '#111' : theme === 'sepia' ? '#f4ecd8' : '#fff',
      color: theme === 'dark' ? '#f2f2f2' : '#111',
      padding: 16,
      borderRadius: 8
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ margin: 0 }}>{chapter?.chapter_number}. {chapter?.title}</h2>
        <small>{readingMinutes} min read</small>
      </header>
      <div>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ textIndent: i === 0 ? 0 : '1.5em', margin: '1em 0' }}>
            {i === 0 ? <DropCap text={p} /> : formatSceneBreaks(p)}
          </p>
        ))}
      </div>
    </div>
  )
}

function DropCap({ text }) {
  const first = text.charAt(0)
  const rest = text.slice(1)
  return (
    <span>
      <span style={{ float: 'left', fontSize: '3.2em', lineHeight: 0.8, paddingRight: 6 }}>{first}</span>
      {formatSceneBreaks(rest)}
    </span>
  )
}

function formatSceneBreaks(paragraph) {
  // Replace "***" or "# # #" with styled scene breaks
  const parts = paragraph.split(/\n?\s*(\*\*\*|#\s?#\s?#)\s*\n?/)
  if (parts.length === 1) return paragraph
  const out = []
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part === '***' || part?.includes('#')) {
      out.push(<SceneBreak key={`sb-${i}`} />)
    } else if (part) {
      out.push(<span key={`p-${i}`}>{part}</span>)
    }
  }
  return <>{out}</>
}

function SceneBreak() {
  return <div style={{ textAlign: 'center', opacity: 0.5, margin: '1em 0' }}>⁂</div>
}


