import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'

export function HealthCheck() {
  const [health, setHealth] = useState<{ status: string; database: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHealth = async () => {
    try {
      setError(null)
      setLoading(true)
      const res = await apiClient.get('/health')
      setHealth(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check backend health')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  if (loading) {
    return <div className="health-check loading">Checking backend health...</div>
  }

  if (error) {
    return (
      <div className="health-check error">
        Error: {error}
        <button onClick={fetchHealth}>Retry</button>
      </div>
    )
  }

  return (
    <div className="health-check">
      <h3>System Health</h3>
      <div className="health-item">
        <span className={`status ${health?.status === 'ok' ? 'healthy' : 'unhealthy'}`}>
          Backend: {health?.status === 'ok' ? 'Healthy' : health?.status === 'degraded' ? 'Degraded' : 'Unknown'}
        </span>
      </div>
      <div className="health-item">
        <span className={`status ${health?.database === 'connected' ? 'healthy' : 'unhealthy'}`}>
          Database: {health?.database === 'connected' ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </div>
  )
}