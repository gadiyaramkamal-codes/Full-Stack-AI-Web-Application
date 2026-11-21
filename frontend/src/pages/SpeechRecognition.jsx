import { useState } from 'react'
import { Mic, MicOff, RotateCcw, BrainCircuit } from 'lucide-react'

function SpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [error, setError] = useState('')

  const startRecognition = () => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser. Try Google Chrome.')
      return
    }

    const recognition = new SpeechRecognitionAPI()

    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setListening(true)
      setError('')
    }

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript
      setTranscript(speechText)
    }

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`)
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
  }

  const resetTranscript = () => {
    setTranscript('')
    setError('')
  }

  return (
    <div className="dashboard-body">

      <section className="welcome-banner">
        <div>
          <span className="banner-label">SPEECH TECHNOLOGY</span>
          <h2>AI Speech Recognition</h2>
          <p>
            Convert your spoken words into text using browser-based speech recognition.
          </p>
        </div>
        <Mic size={75} />
      </section>

      <section className="history-section sentiment-panel">

        <div className="section-heading">
          <div>
            <h2>Speech to Text</h2>
            <p>Click the microphone and start speaking.</p>
          </div>
        </div>

        <div className="speech-controls">
          <button
            onClick={startRecognition}
            disabled={listening}
          >
            <Mic size={18} />
            {listening ? 'Listening...' : 'Start Recording'}
          </button>

          <button onClick={resetTranscript}>
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

        {listening && (
          <div className="message-box">
            <Mic size={22} />
            <p>Listening... Please speak clearly.</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="speech-result">
          <h3>Recognized Text</h3>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your recognized speech will appear here..."
            rows={7}
          />

          {transcript && (
            <p className="result-message">
              Speech successfully converted into text.
            </p>
          )}
        </div>

        <div className="speech-note">
          <BrainCircuit size={20} />
          <p>
            You can use this recognized text for sentiment analysis.
          </p>
        </div>

      </section>
    </div>
  )
}

export default SpeechRecognition