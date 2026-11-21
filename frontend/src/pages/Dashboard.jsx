import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Activity,
  Smile,
  Frown,
  Meh,
  RefreshCw
} from 'lucide-react'

const API_URL = 'http://127.0.0.1:5000'

function Dashboard() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(`${API_URL}/api/history`)
      setHistory(response.data.history || [])
    } catch (err) {
      setError('Unable to connect to the backend. Please check Flask.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const stats = [
    {
      title: 'Records Loaded',
      value: history.length,
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Positive',
      value: history.filter(item => item.sentiment === 'Positive').length,
      icon: Smile,
      color: 'green'
    },
    {
      title: 'Negative',
      value: history.filter(item => item.sentiment === 'Negative').length,
      icon: Frown,
      color: 'red'
    },
    {
      title: 'Neutral',
      value: history.filter(item => item.sentiment === 'Neutral').length,
      icon: Meh,
      color: 'orange'
    }
  ]

  return (
    <div className="dashboard-body">

      <section className="welcome-banner">
        <div>
          <span className="banner-label">AI POWERED PLATFORM</span>
          <h2>Welcome to Your Smart Analysis Dashboard</h2>
          <p>
            Analyze text, understand sentiments and monitor your AI
            predictions in one place.
          </p>
        </div>
      </section>

      <section className="stats-section">
        <div className="section-heading">
          <div>
            <h2>Analysis Statistics</h2>
            <p>Summary of your latest saved records</p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchHistory}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading && <p>Loading statistics...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div className="stat-card" key={stat.title}>
                <div className={`stat-icon ${stat.color}`}>
                  <Icon size={23} />
                </div>

                <div className="stat-info">
                  <p>{stat.title}</p>
                  <h3>{loading ? '...' : stat.value}</h3>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="history-section">
        <div className="section-heading">
          <div>
            <h2>Recent Analysis History</h2>
            <p>Latest sentiment predictions from MongoDB</p>
          </div>
        </div>

        {!loading && !error && history.length === 0 && (
          <p>No analysis records found.</p>
        )}

        {!loading && !error && history.length > 0 && (
          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Text</th>
                  <th>Sentiment</th>
                  <th>Compound Score</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {history.map(item => (
                  <tr key={item.id}>
                    <td className="text-cell">{item.text}</td>
                    <td>
                      <span className={`sentiment-badge ${item.sentiment?.toLowerCase()}`}>
                        {item.sentiment}
                      </span>
                    </td>
                    <td className="score-cell">
                      {item.scores?.compound?.toFixed(4) ?? 'N/A'}
                    </td>
                    <td>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : 'Unavailable'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  )
}

export default Dashboard