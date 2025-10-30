export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api/v1'

export const STATUS = {
  script: ['uploaded', 'analyzing', 'processing', 'completed', 'failed'],
  novel: ['outline', 'generating', 'reviewing', 'completed'],
  chapter: ['pending', 'generating', 'completed', 'failed', 'regenerating']
}

export const LIMITS = {
  maxFileSizeMB: 10
}

export const SUPPORTED_TYPES = ['text/plain']


