import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App, { ErrorBoundary } from './App.jsx'
import { initSync } from './utils/sync'
import { initSwUpdates } from './utils/swUpdate'

try {
  initSync()
} catch {
  // Sync must not block app startup.
}

try {
  initSwUpdates()
} catch {
  // Update checks must not block app startup.
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
