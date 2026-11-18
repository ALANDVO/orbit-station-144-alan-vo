import { useState, useRef, useEffect } from 'react'
import { apiClient } from '../api/client'

export interface VoiceCloningState {
  loading: boolean
  uploading: boolean
  error: string | null
  audioUrl: string | null
  text: string
  language: string
}

export function VoiceCloningPage() {
  const [state, setState] = useState<VoiceCloningState>({
    loading: false,
    uploading: false,
    error: null,
    audioUrl: null,
    text: '',
    language: 'en',
  })

  const fileRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setState({ ...state, uploading: true })
      readFileAsDataURL(file).then((dataUrl) => {
        setState({ ...state, audioUrl: dataUrl, uploading: false })
      })
    }
  }

  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
    })

  const handleSynthesize = async () => {
    if (!state.text.trim()) {
      setState({ ...state, error: 'Text cannot be empty' })
      return
    }
    if (state.text.length > 500) {
      setState({ ...state, error: 'Text too long (max 500 characters)' })
      return
    }
    setState({ ...state, loading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('text', state.text)
      formData.append('language', state.language)
      if (state.audioUrl) {
        // Extract base64 data and send as data URI
        const base64 = state.audioUrl.split(',')[1]
        formData.append('reference_audio', `data:audio/wav;base64,${base64}`)
      }
      const result = await apiClient.post<{ audio_url: string }>(
        '/voice/cloning/synthesize',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setState({ ...state, loading: false, audioUrl: result.audio_url })
    } catch (err: any) {
      setState({ ...state, loading: false, error: err.message || 'Synthesis failed' })
    }
  }

  return (
    <div className="voice-cloning-page">
      <header className="page-header">
        <h1>Voice Cloning</h1>
        <p>Upload reference audio and generate speech</p>
      </header>

      <section className="upload-section">
        <h2>Reference Audio</h2>
        {state.uploading ? (
          <p>Uploading...</p>
        ) : (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="audio/wav, audio/mpeg, audio/mp3"
              onChange={handleChange}
              className="file-input"
            />
            <label htmlFor="reference-audio" className="file-label">
              Browse... (WAV, MP3)
            </label>
          </div>
        )}
        {state.audioUrl && (
          <div className="uploaded-preview">
            <audio controls className="preview-audio">
              <source src={state.audioUrl} type="audio/wav" />
            </audio>
            <button
              onClick={() => setState({ ...state, audioUrl: null })}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        )}
      </section>

      <section className="synthesis-section">
        <h2>Synthesize Speech</h2>
        
        <div className="form-group">
          <label htmlFor="text-input">Text to synthesize</label>
          <textarea
            id="text-input"
            value={state.text}
            onChange={(e) => 
              setState({ ...state, text: e.target.value.substring(0, 500) }}
            )
            rows={3}
            maxLength={500}
            placeholder="Enter text to synthesize with cloned voice..."
            disabled={state.loading}
            className="textarea-input"
          /></textarea>
          {state.error && (
            <p className="error-message">{state.error}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="language-select">Language</label>
          <select
            id="language-select"
            value={state.language}
            onChange={(e) => setState({ ...state, language: e.target.value })}
            disabled={state.loading}
            className="select-input"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        <button
          onClick={handleSynthesize}
          disabled={state.loading || !state.text.trim()}
          className={state.loading ? 'btn-primary disabled' : 'btn-primary'}
        >
          {state.loading ? 'Generating...' : 'Generate Audio'}
        </button>
      </section>

      {state.audioUrl && (
        <section className="result-section">
          <h2>Generated Audio</h2>
          <audio controls className="result-audio">
            <source src={state.audioUrl} type="audio/wav" />
          </audio>
          <div className="action-buttons">
            <a 
              href={state.audioUrl} 
              download="cloned-audio.wav"
              className="download-link"
            >
              Download Audio
            </a>
            <button
              onClick={() => setState({ ...state, audioUrl: null })}
              className="remove-button"
            >
              New Synthesis
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
