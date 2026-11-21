import { useState } from 'react'
import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BrainCircuit,
  History,
  Image,
  Mic,
  Settings as SettingsIcon,
  Bell,
  Menu,
  X
} from 'lucide-react'

import Dashboard from './pages/Dashboard'
import Sentiment from './pages/Sentiment'
import ImageClassification from './pages/ImageClassification'
import SpeechRecognition from './pages/SpeechRecognition'
import HistoryPage from './pages/History'
import Settings from './pages/Settings'

import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Sentiment Analysis', path: '/sentiment', icon: BrainCircuit },
    { name: 'Image Classification', path: '/image-classification', icon: Image },
    { name: 'Speech Recognition', path: '/speech-recognition', icon: Mic },
    { name: 'Analysis History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: SettingsIcon }
  ]

  const pageTitles = {
    '/dashboard': 'Dashboard Overview',
    '/sentiment': 'Sentiment Analysis',
    '/image-classification': 'Image Classification',
    '/speech-recognition': 'Speech Recognition',
    '/history': 'Analysis History',
    '/settings': 'Application Settings'
  }

  return (
    <div className="dashboard">

      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>

        <div className="brand">
          <div className="brand-icon">
            <BrainCircuit size={27} />
          </div>

          <div>
            <h2>AI Analysis</h2>
            <span>Smart Dashboard</span>
          </div>

          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="menu-heading">MAIN MENU</div>

        <nav className="sidebar-nav">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="menu-heading settings-heading">PREFERENCES</div>

        <nav className="sidebar-nav">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-avatar">AI</div>
          <div>
            <strong>Admin User</strong>
            <span>Dashboard</span>
          </div>
        </div>

      </aside>

      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="main-content">

        <header className="topbar">

          <div className="topbar-left">

            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={23} />
            </button>

            <div>
              <h1>
                {pageTitles[window.location.pathname] || 'AI Dashboard'}
              </h1>

              <p>Manage and monitor your AI-powered application.</p>
            </div>

          </div>

          <div className="topbar-actions">
            <button
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
          </div>

        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sentiment" element={<Sentiment />} />
          <Route path="/image-classification" element={<ImageClassification />} />
          <Route path="/speech-recognition" element={<SpeechRecognition />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <footer className="dashboard-footer">
          <p>AI Smart Analysis Dashboard</p>
          <span>Powered by React, Flask, MongoDB & AI</span>
        </footer>

      </main>
    </div>
  )
}

export default App