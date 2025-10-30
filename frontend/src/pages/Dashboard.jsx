import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Scripts, Novels } from '../services/api.js'
import { useApp } from '../contexts/AppContext.jsx'

export default function Dashboard() {
  const [stats, setStats] = useState({ scripts: 0, novels: 0 })
  const [recentScripts, setRecentScripts] = useState([])
  const { apiOnline } = useApp()

  useEffect(() => {
    Promise.all([Scripts.list({ per_page: 5 }), Novels.list({ per_page: 1 })]).then(([s, n]) => {
      setRecentScripts(s.data || [])
      setStats({ scripts: (s.pagination?.returned ?? recentScripts.length), novels: (n.pagination?.returned ?? 0) })
    }).catch(() => {})
  }, [])

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={{ display: 'flex', gap: 16 }}>
        <Card title="Scripts Processed" value={stats.scripts} />
        <Card title="Novels Generated" value={stats.novels} />
        <Card title="API Status" value={apiOnline ? 'Online' : 'Offline'} />
      </section>
      <section>
        <h3>Recent Scripts</h3>
        <ul>
          {recentScripts.map(s => (
            <li key={s.id}><Link to={`/scripts/${s.id}`}>{s.title}</Link> — {s.status}</li>
          ))}
        </ul>
      </section>
      <section style={{ display: 'flex', gap: 12 }}>
        <Link className="btn" to="/upload">Upload Script</Link>
        <Link className="btn" to="/novels">View Novels</Link>
      </section>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, minWidth: 160 }}>
      <div style={{ fontSize: 12, color: '#666' }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 600 }}>{value}</div>
    </div>
  )
}


