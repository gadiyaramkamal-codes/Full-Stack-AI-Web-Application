import { useState } from 'react'
import axios from 'axios'
import { BrainCircuit, Send, RefreshCw } from 'lucide-react'

const API_URL = 'http://127.0.0.1:5000'

function Sentiment() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyzeSentiment = async (e) => {
    e.preventDefault()

    if (!text.trim()) {
      setError('Please enter some text before analysis.')
      setResult(null)
      return
    }

    try {
      setLoading(true)
      setError('')
      setResult(null)

      const response = await axios.post(`${API_URL}/api/sentiment`, {
        text: text
      })

      setResult(response.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to connect to the backend. Please check Flask.'
      )
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setText('')
    setResult(null)
    setError('')
  }

  return (
    <div className="dashboard-body">

      <section className="welcome-banner">
        <div>
          <span className="banner-label">NATURAL LANGUAGE PROCESSING</span>
          <h2>AI Sentiment Analysis</h2>
          <p>
            Enter your text and let AI identify its emotional tone.
          </p>
        </div>
        <BrainCircuit size={75} />
      </section>

      <section className="history-section sentiment-panel">
        <div className="section-heading">
          <div>
            <h2>Analyze Your Text</h2>
            <p>Powered by VADER Sentiment Analysis</p>
          </div>
        </div>

        <form onSubmit={analyzeSentiment}>
          <label htmlFor="sentiment-text">Enter your text</label>

          <textarea
            id="sentiment-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: I really love this application. It is amazing!"
            rows={7}
          />

          <div className="sentiment-actions">
            <button type="submit" disabled={loading}>
              {loading ? (
                <RefreshCw size={17} className="loading-icon" />
              ) : (
                <Send size={17} />
              )}
              {loading ? 'Analyzing...' : 'Analyze Sentiment'}
            </button>

            <button type="button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <div className="sentiment-result">
            <h2>Analysis Result</h2>

            <div className={`sentiment-badge ${result.sentiment.toLowerCase()}`}>
              {result.sentiment}
            </div>

            <p className="result-message">{result.message}</p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <p>Positive Score</p>
                  <h3>{result.scores.pos.toFixed(4)}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <p>Negative Score</p>
                  <h3>{result.scores.neg.toFixed(4)}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <p>Neutral Score</p>
                  <h3>{result.scores.neu.toFixed(4)}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <p>Compound Score</p>
                  <h3>{result.scores.compound.toFixed(4)}</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  )
}

export default Sentiment