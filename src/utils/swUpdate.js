// ── Automatic updates for the installed PWA ────────────────────────────────
// The service worker (src/sw.js) already calls skipWaiting() + clientsClaim(),
// so a new build takes control as soon as the browser notices it. Two gaps
// remain for an app that lives on a home screen and is rarely fully closed:
//
//   1. The browser only re-checks sw.js on navigation, or roughly once a day.
//      An installed app resumed from the background may not check for days.
//   2. When the new worker does take control, the page already open still has
//      the OLD JavaScript in memory until something reloads it.
//
// This module fixes both: it asks for an update check whenever the app is
// opened or resumed (and hourly while open), then reloads once the new worker
// takes over. Nothing here ever requires reinstalling the app.

import { hasPendingSyncWrites } from './sync';

const CHECK_INTERVAL_MS = 60 * 60 * 1000; // hourly while the app stays open

export function initSwUpdates() {
  if (!('serviceWorker' in navigator)) return;

  // If there is no controller yet, this is the very first install. The
  // controllerchange that follows is the initial claim, not an update — so
  // don't treat it as a reason to reload.
  const hadController = !!navigator.serviceWorker.controller;
  let pendingReload = false;
  let reloading = false;

  function isTyping() {
    const el = document.activeElement;
    if (!el) return false;
    return el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
  }

  function applyUpdate() {
    if (reloading || !pendingReload) return;
    // Never yank the page out from under her mid-sentence — wait for the
    // next resume instead.
    if (isTyping()) return;
    // Let queued diary/notes edits finish uploading first, so a device that
    // updates right after an edit still hands that edit to the others.
    try {
      if (hasPendingSyncWrites()) {
        setTimeout(applyUpdate, 3000);
        return;
      }
    } catch {
      // If sync cannot be consulted, updating is still safe: every edit is
      // already written to localStorage, which a reload never clears.
    }
    reloading = true;
    window.location.reload();
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return; // first install, not an update
    pendingReload = true;
    applyUpdate();
  });

  navigator.serviceWorker.ready.then(reg => {
    const check = () => { reg.update().catch(() => {}); };

    check();
    setInterval(check, CHECK_INTERVAL_MS);

    // Reopening or resuming the app is the main moment we get to run — use it
    // to both check for a new build and apply one that already landed.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;
      check();
      applyUpdate();
    });
    window.addEventListener('focus', () => { check(); applyUpdate(); });
    window.addEventListener('online', check);
  }).catch(() => {
    // No registration available — the app still works, just without
    // background update checks.
  });
}
