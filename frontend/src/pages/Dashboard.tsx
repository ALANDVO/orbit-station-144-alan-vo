export function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>VoiceStudio</h1>
        <p className="subtitle">Open-source voice AI platform</p>
      </header>
      <main className="dashboard-main">
        <section className="features">
          <h2>Features</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>Health Monitoring</h3>
              <p>Real-time backend and database health checks</p>
            </div>
            <div className="feature-card">
              <h3>Voice Synthesis</h3>
              <p>High-quality text-to-speech with multiple voices</p>
            </div>
            <div className="feature-card">
              <h3>Model Management</h3>
              <p>Manage and deploy voice AI models</p>
            </div>
          </div>
        </section>
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button>Check Backend Health</button>
            <button>View API Docs</button>
          </div>
        </section>
        <section className="system-status">
          <h2>System Status</h2>
          <div className="status-items">
            <div className="status-item">
              <span>Backend</span>
              <span className="status unknown">Unknown</span>
            </div>
            <div className="status-item">
              <span>Database</span>
              <span className="status unknown">Unknown</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}