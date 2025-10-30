import React, { useEffect, useRef, useState } from 'react'

const TYPES = ['style_guide', 'character_profile', 'world_building', 'tone_reference']

export default function ContextBuilder({ value = [], onChange }) {
  const [items, setItems] = useState(value)

  useEffect(() => { onChange?.(items) }, [items])

  function add() {
    setItems(prev => [...prev, { context_type: 'style_guide', content: '', priority: 5 }])
  }
  function remove(i) {
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }
  function update(i, key, v) {
    setItems(prev => prev.map((c, idx) => idx === i ? { ...c, [key]: v } : c))
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {items.map((c, i) => (
        <div key={i} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={c.context_type} onChange={e => update(i, 'context_type', e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
            </select>
            <input type="number" min={0} max={10} value={c.priority} onChange={e => update(i, 'priority', parseInt(e.target.value || 0))} style={{ width: 100 }} />
            <button type="button" onClick={() => remove(i)}>Remove</button>
          </div>
          <RichText value={c.content} onChange={v => update(i, 'content', v)} />
          <details>
            <summary>Preview</summary>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{c.content}</pre>
          </details>
          <TemplateHints onInsert={(t) => update(i, 'content', (c.content || '') + (c.content ? '\n' : '') + t)} />
        </div>
      ))}
      <button type="button" onClick={add}>Add Context Section</button>
    </div>
  )
}

function RichText({ value, onChange }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value || '')) ref.current.innerText = value || ''
  }, [value])
  return (
    <div
      ref={ref}
      contentEditable
      onInput={(e) => onChange(e.currentTarget.innerText)}
      style={{ minHeight: 100, border: '1px solid #eee', padding: 8, borderRadius: 6 }}
      suppressContentEditableWarning
    />
  )
}

function TemplateHints({ onInsert }) {
  const templates = [
    'Tone: Warm, introspective. POV: Third-person limited. Tense: Past.',
    'Character: Name, Motivation, Conflict, Transformation.',
    'World Rule: Magic requires sacrifice. Technology is scarce.',
  ]
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {templates.map((t, i) => <button type="button" key={i} onClick={() => onInsert(t)}>{`Insert template ${i+1}`}</button>)}
    </div>
  )
}


