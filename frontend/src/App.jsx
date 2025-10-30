import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext.jsx'
import HomePage from './pages/HomePage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ScriptsPage from './pages/ScriptsPage.jsx'
import ScriptDetailPage from './pages/ScriptDetailPage.jsx'
import NovelsPage from './pages/NovelsPage.jsx'
import NovelDetailPage from './pages/NovelDetailPage.jsx'
import ReferenceBooksPage from './pages/ReferenceBooksPage.jsx'
import ScriptUpload from './pages/ScriptUpload.jsx'
import ScriptProcessor from './pages/ScriptProcessor.jsx'
import NovelReader from './pages/NovelReader.jsx'
import NovelEditor from './pages/NovelEditor.jsx'
import Settings from './pages/Settings.jsx'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="app-layout">
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/scripts">Scripts</Link>
            <Link to="/novels">Novels</Link>
            <Link to="/references">References</Link>
            <Link to="/settings">Settings</Link>
          </nav>
          <main className="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scripts" element={<ScriptsPage />} />
              <Route path="/scripts/:id" element={<ScriptDetailPage />} />
              <Route path="/upload" element={<ScriptUpload />} />
              <Route path="/process/:id" element={<ScriptProcessor />} />
              <Route path="/novels" element={<NovelsPage />} />
              <Route path="/novels/:id" element={<NovelDetailPage />} />
              <Route path="/read/:id" element={<NovelReader />} />
              <Route path="/edit/:id" element={<NovelEditor />} />
              <Route path="/references" element={<ReferenceBooksPage />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </AppProvider>
    </BrowserRouter>
  )
}
