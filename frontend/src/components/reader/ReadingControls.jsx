import React from 'react'

export default function ReadingControls({
  fontSize, setFontSize,
  family, setFamily,
  theme, setTheme,
  lineHeight, setLineHeight,
  onToggleFullscreen,
  onBookmark,
  onNote
}) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label>Font size {fontSize}px
        <input type="range" min={14} max={24} value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} />
      </label>
      <label>Font family
        <select value={family} onChange={e => setFamily(e.target.value)}>
          <option value="serif">Serif</option>
          <option value="sans">Sans-serif</option>
        </select>
      </label>
      <label>Theme
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="sepia">Sepia</option>
        </select>
      </label>
      <label>Line height {lineHeight}
        <input type="range" min={1.2} max={2.0} step={0.1} value={lineHeight} onChange={e => setLineHeight(parseFloat(e.target.value))} />
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={onToggleFullscreen}>Full screen</button>
        <button type="button" onClick={onBookmark}>Bookmark</button>
        <button type="button" onClick={() => onNote?.(prompt('Note:') || '')}>Add note</button>
      </div>
    </div>
  )
}


