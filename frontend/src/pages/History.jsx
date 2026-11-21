import { useEffect, useState } from 'react'
import axios from 'axios'
import { History as HistoryIcon, RefreshCw } from 'lucide-react'

const API_URL = 'http://127.0.0.1:5000'

function History() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(`${API_URL}/api/history`)
      setRecords(response.data.history || [])
    } catch (err) {
      setError('Unable to load history. Please check Flask backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div className="dashboard-body">

      <section className="welcome-banner">
        <div>
          <span className="banner-label">ANALYSIS RECORDS</span>
          <h2>Analysis History</h2>
          <p>View your previously saved AI sentiment predictions.</p>
        </div>
        <HistoryIcon size={75} />
      </section>

      <section className="history-section">

        <div className="section-heading">
          <div>
            <h2>Saved Analysis Records</h2>
            <p>Total records loaded: {records.length}</p>
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

        {loading && <p>Loading history...</p>}

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchHistory}>Try Again</button>
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <p>No saved records found.</p>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Text</th>
                  <th>Sentiment</th>
                  <th>Positive</th>
                  <th>Negative</th>
                  <th>Neutral</th>
                  <th>Compound</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {records.map((item) => (
                  <tr key={item.id}>
                    <td className="text-cell">{item.text}</td>

                    <td>
                      <span className={`sentiment-badge ${item.sentiment?.toLowerCase()}`}>
                        {item.sentiment}
                      </span>
                    </td>

                    <td>{item.scores?.pos?.toFixed(3) ?? 'N/A'}</td>
                    <td>{item.scores?.neg?.toFixed(3) ?? 'N/A'}</td>
                    <td>{item.scores?.neu?.toFixed(3) ?? 'N/A'}</td>
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

export default History