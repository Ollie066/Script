import React, { useCallback, useRef, useState } from 'react'
import { LIMITS, SUPPORTED_TYPES } from '../../utils/constants.js'

export default function ScriptUploader({ onScriptLoaded, onReferencesLoaded }) {
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState([])
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const validateFile = (file) => {
    const errs = []
    if (file.size > LIMITS.maxFileSizeMB * 1024 * 1024) errs.push(`${file.name}: exceeds ${LIMITS.maxFileSizeMB}MB`)
    if (!SUPPORTED_TYPES.includes(file.type) && !file.name.endsWith('.txt')) errs.push(`${file.name}: unsupported type`)
    return errs
  }

  const handleFiles = async (files) => {
    const list = Array.from(files)
    const errs = list.flatMap(validateFile)
    setErrors(errs)
    if (errs.length) return

    setProgress(10)
    // Assume first is script, rest are references
    const [scriptFile, ...referenceFiles] = list
    let scriptText = ''
    if (scriptFile) {
      scriptText = await scriptFile.text()
      setPreview({ name: scriptFile.name, content: scriptText.slice(0, 2000) })
      onScriptLoaded?.({ name: scriptFile.name, content: scriptText })
    }
    setProgress(60)
    if (referenceFiles.length) {
      const refs = await Promise.all(referenceFiles.map(async (f) => ({ name: f.name, content: await f.text() })))
      onReferencesLoaded?.(refs)
    }
    setProgress(100)
    setTimeout(() => setProgress(0), 800)
  }

  const onDrop = useCallback(async (e) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false)
    if (e.dataTransfer.files?.length) await handleFiles(e.dataTransfer.files)
  }, [])

  const onBrowse = async (e) => {
    if (e.target.files?.length) await handleFiles(e.target.files)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{ border: '2px dashed #999', padding: 24, borderRadius: 8, background: dragOver ? '#f5f5f5' : 'transparent' }}
      >
        <p>Drag & drop your script (.txt) and optional reference files here, or</p>
        <button type="button" onClick={() => inputRef.current?.click()}>Browse</button>
        <input ref={inputRef} type="file" multiple accept=".txt,text/plain" style={{ display: 'none' }} onChange={onBrowse} />
        {progress > 0 && (
          <div style={{ marginTop: 12, background: '#eee', height: 8, borderRadius: 4 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#4caf50', borderRadius: 4 }} />
          </div>
        )}
      </div>
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}
      {preview && (
        <details style={{ marginTop: 12 }}>
          <summary>Preview: {preview.name}</summary>
          <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 240, overflow: 'auto' }}>{preview.content}</pre>
        </details>
      )}
    </div>
  )
}


