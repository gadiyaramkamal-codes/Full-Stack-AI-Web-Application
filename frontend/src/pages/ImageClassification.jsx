import { useState } from 'react'
import { ImagePlus, Upload, RefreshCw } from 'lucide-react'

function ImageClassification() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      return
    }

    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  const handleClassify = async () => {
    if (!image) {
      alert('Please upload an image first.')
      return
    }

    alert('Image classification backend will be connected in a later step.')
  }

  const resetForm = () => {
    setImage(null)
    setPreview('')
    setResult(null)
  }

  return (
    <div className="dashboard-body">

      <section className="welcome-banner">
        <div>
          <span className="banner-label">COMPUTER VISION</span>
          <h2>AI Image Classification</h2>
          <p>
            Upload an image and use artificial intelligence to identify its contents.
          </p>
        </div>
        <ImagePlus size={75} />
      </section>

      <section className="history-section sentiment-panel">
        <div className="section-heading">
          <div>
            <h2>Upload Your Image</h2>
            <p>Supported formats: JPG, JPEG, PNG and WebP</p>
          </div>
        </div>

        <label htmlFor="image-upload" className="image-upload-area">
          <Upload size={38} />
          <h3>Select an Image</h3>
          <p>Click here to browse your device</p>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        {preview && (
          <div className="image-preview">
            <h3>Image Preview</h3>
            <img src={preview} alt="Selected image preview" />
            <p>{image?.name}</p>
          </div>
        )}

        <div className="sentiment-actions">
          <button onClick={handleClassify} disabled={loading || !image}>
            {loading ? (
              <RefreshCw size={17} className="loading-icon" />
            ) : (
              <ImagePlus size={17} />
            )}
            Classify Image
          </button>

          <button onClick={resetForm}>
            Reset
          </button>
        </div>

        {result && (
          <div className="sentiment-result">
            <h2>Classification Result</h2>
            <h3>{result.label}</h3>
            <p>Confidence: {result.confidence}%</p>
          </div>
        )}
      </section>

    </div>
  )
}

export default ImageClassification