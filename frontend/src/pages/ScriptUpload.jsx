import React, { useCallback, useMemo, useState } from 'react'
import { Scripts, Contexts } from '../services/api.js'
import ScriptUploader from '../components/upload/ScriptUploader.jsx'
import ScriptForm from '../components/upload/ScriptForm.jsx'
import ReferenceBookSelector from '../components/upload/ReferenceBookSelector.jsx'
import ContextBuilder from '../components/upload/ContextBuilder.jsx'

export default function ScriptUpload() {
  const [meta, setMeta] = useState({ title: '', genre: '', style: '', mature_content: false, target_word_count: 80000 })
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState('')
  const [contexts, setContexts] = useState([])
  const [selectedRefs, setSelectedRefs] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onScriptLoaded = ({ name, content }) => { setContent(content); setPreview(content.slice(0, 2000)) }

  async function submit() {
    setError('')
    if (!meta.title || !content) { setError('Title and content are required.'); return }
    setSubmitting(true)
    try {
      const script = await Scripts.create({
        title: meta.title,
        content,
        genre: meta.genre,
        style: meta.style,
        mature_content: meta.mature_content,
        target_word_count: meta.target_word_count
      })

      for (const ctx of contexts) {
        await Contexts.create(script.id, ctx)
      }
      // Attach selected reference books as contexts (style_guide) with default priority
      for (const refId of selectedRefs) {
        await Contexts.create(script.id, { context_type: 'style_guide', content: '', priority: 5, reference_book_id: refId })
      }
      alert('Script submitted!')
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>Upload Script</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ScriptUploader onScriptLoaded={onScriptLoaded} onReferencesLoaded={() => { /* handled via selector */ }} />
      <ScriptForm
        initial={{ title: meta.title, genre: meta.genre, style: meta.style, mature: meta.mature_content, length: meta.target_word_count }}
        submitting={submitting}
        onSubmit={(m) => setMeta({ title: m.title, genre: m.genre, style: m.style, mature_content: m.mature_content, target_word_count: m.target_word_count })}
      />
      <details>
        <summary>Reference Books</summary>
        <ReferenceBookSelector selected={selectedRefs} onChange={setSelectedRefs} />
      </details>
      <details>
        <summary>Custom Contexts</summary>
        <ContextBuilder value={contexts} onChange={setContexts} />
      </details>
      <button onClick={submit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
      <section>
        <h3>Preview</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{preview}</pre>
      </section>
    </div>
  )
}


