import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App, { ErrorBoundary } from './App.jsx'
import { initSync } from './utils/sync'
import { initSwUpdates } from './utils/swUpdate'

// Paint first. Sync and update checks both pull in code the first screen does
// not need, so they start only once the UI is on screen and tappable.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

function startBackgroundServices() {
  // initSync is async now (Firebase is fetched on demand), so a rejection has
  // to be caught on the promise — a try/catch around the call would miss it.
  try {
    initSync()?.catch(() => {})
  } catch {
    // Sync must not block app startup.
  }

  try {
    initSwUpdates()
  } catch {
    // Update checks must not block app startup.
  }
}

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(startBackgroundServices, { timeout: 2000 })
} else {
  setTimeout(startBackgroundServices, 200)
}
