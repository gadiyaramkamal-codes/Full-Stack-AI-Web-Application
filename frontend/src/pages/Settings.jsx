import { useEffect, useState } from 'react'
import axios from 'axios'
import { Settings as SettingsIcon, Database, Server, Moon, Globe } from 'lucide-react'

const API_URL = 'http://127.0.0.1:5000'

function Settings() {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [databaseStatus, setDatabaseStatus] = useState('Checking...')
  const [theme, setTheme] = useState('Dark')
  const [language, setLanguage] = useState('English')

  useEffect(() => {
    const checkConnections = async () => {
      try {
        await axios.get(`${API_URL}/api/health`)
        setBackendStatus('Connected')
      } catch {
        setBackendStatus('Disconnected')
      }

      try {
        await axios.get(`${API_URL}/api/db-health`)
        setDatabaseStatus('Connected')
      } catch {
        setDatabaseStatus('Disconnected')
      }
    }

    checkConnections()
  }, [])

  return (
    <div className="dashboard-body">

      <section className="welcome-banner">
        <div>
          <span className="banner-label">APPLICATION PREFERENCES</span>
          <h2>Settings</h2>
          <p>Manage your application preferences and connection information.</p>
        </div>
        <SettingsIcon size={75} />
      </section>

      <section className="history-section sentiment-panel">
        <h2>System Information</h2>

        <div className="settings-item">
          <Server size={23} />
          <div>
            <h3>Flask Backend</h3>
            <p>Connection Status: {backendStatus}</p>
          </div>
        </div>

        <div className="settings-item">
          <Database size={23} />
          <div>
            <h3>MongoDB Database</h3>
            <p>Connection Status: {databaseStatus}</p>
          </div>
        </div>

        <div className="settings-item">
          <Moon size={23} />
          <div>
            <h3>Theme Preference</h3>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="Dark">Dark</option>
              <option value="Light">Light</option>
            </select>
            <p>Selected theme: {theme}</p>
          </div>
        </div>

        <div className="settings-item">
          <Globe size={23} />
          <div>
            <h3>Language Preference</h3>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
            </select>
            <p>Selected language: {language}</p>
          </div>
        </div>

      </section>

      <section className="history-section">
        <h2>About Application</h2>
        <p><strong>Project:</strong> Full-Stack AI Web Application</p>
        <p><strong>Frontend:</strong> React + Vite</p>
        <p><strong>Backend:</strong> Python + Flask</p>
        <p><strong>Database:</strong> MongoDB</p>
        <p><strong>Sentiment Model:</strong> VADER</p>
      </section>

    </div>
  )
}

export default Settings