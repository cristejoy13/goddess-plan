import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App, { ErrorBoundary } from './App.jsx'
import { initSync, initSyncStorage } from './utils/sync'
import { initSwUpdates } from './utils/swUpdate'
import { initAccount } from './utils/account'

// Stamp-tracking for local edits must be live before anything can be edited,
// so this runs first and synchronously. It touches no network and loads no
// Firebase — see initSyncStorage for why the ordering matters.
initSyncStorage()

// Paint first. Sync and update checks both pull in code the first screen does
// not need, so they start only once the UI is on screen and tappable.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// The app started, so the boot safety net in index.html may run again in a
// later session if it is ever needed.
setTimeout(() => { try { sessionStorage.removeItem('gp_boot_retry') } catch { /* fine */ } }, 15000)

function startBackgroundServices() {
  // initSync is async now (Firebase is fetched on demand), so a rejection has
  // to be caught on the promise — a try/catch around the call would miss it.
  try {
    initSync()?.catch(() => {})
  } catch {
    // Sync must not block app startup.
  }

  // Sign-in waits for sync to start Firebase, then shares it.
  try {
    initAccount()?.catch(() => {})
  } catch {
    // Sign-in must not block app startup.
  }

  try {
    initSwUpdates()
  } catch {
    // Update checks must not block app startup.
  }

  // The USDA food list, kept on this gadget for offline calories. A few
  // seconds after start so it never competes with the first screen, and again
  // whenever the connection comes back.
  const fetchFoods = () => import('./utils/foodList').then(m => m.ensureFoodList()).catch(() => {})
  setTimeout(fetchFoods, 5000)
  window.addEventListener('online', fetchFoods)
}

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(startBackgroundServices, { timeout: 2000 })
} else {
  setTimeout(startBackgroundServices, 200)
}
