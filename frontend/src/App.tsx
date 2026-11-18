import { Dashboard } from './pages/Dashboard'
import { VoiceCloningPage } from './pages/VoiceCloningPage'
import { HealthCheck } from './components/HealthCheck'

function App() {
  return (
    <div className="app">
      <Dashboard />
      <VoiceCloningPage />
      <HealthCheck />
    </div>
  )
}

export default App
