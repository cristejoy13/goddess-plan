import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App, { ErrorBoundary } from './App.jsx'
import { initSync } from './utils/sync'

try {
  initSync()
} catch {
  // Sync must not block app startup.
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
