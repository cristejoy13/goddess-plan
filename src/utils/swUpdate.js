// ── Automatic updates for the installed PWA ────────────────────────────────
// The promise this file has to keep: once a new build is deployed, every
// device picks it up on its own — laptop, phone, iPad, browser tab or
// home-screen icon. Reinstalling the app is never the way to get new code.
//
// The service worker (src/sw.js) calls skipWaiting() + clientsClaim(), so a
// new build takes control as soon as the browser notices it. Two gaps remain
// for an app that lives on a home screen and is rarely fully closed:
//
//   1. The browser only re-checks sw.js on navigation, or roughly once a day.
//      An installed app resumed from the background may not check for days.
//   2. When the new worker does take control, the page already open still has
//      the OLD JavaScript in memory until something reloads it.
//
// This module closes both: it asks for an update check whenever the app is
// opened or resumed (and hourly while open), then reloads once the new worker
// takes over. Every path that can tell us "new code is live" is wired to the
// same reload, because a missed signal is exactly what makes an app look
// broken enough to reinstall.

import { hasPendingSyncWrites } from './sync';

const CHECK_INTERVAL_MS = 60 * 60 * 1000; // hourly while the app stays open
const BLOCKED_RETRY_MS  = 5000;           // re-try a reload we had to defer

export function initSwUpdates() {
  if (!('serviceWorker' in navigator)) return;

  // If there is no controller yet, this is the very first install. The
  // controllerchange that follows is the initial claim, not an update — so
  // don't treat it as a reason to reload.
  const hadController = !!navigator.serviceWorker.controller;
  let pendingReload = false;
  let reloading = false;
  let retryTimer = null;

  function isTyping() {
    const el = document.activeElement;
    if (!el) return false;
    return el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
  }

  function applyUpdate() {
    if (reloading || !pendingReload) return;
    // Never yank the page out from under her mid-sentence, and never lose a
    // queued edit — but always come back and try again, so a deferred update
    // is deferred rather than dropped.
    let defer = false;
    if (isTyping()) {
      defer = true;
    } else {
      try {
        if (hasPendingSyncWrites()) defer = true;
      } catch {
        // If sync cannot be consulted, updating is still safe: every edit is
        // already written to localStorage, which a reload never clears.
      }
    }
    if (defer) {
      if (retryTimer === null) {
        retryTimer = setTimeout(() => { retryTimer = null; applyUpdate(); }, BLOCKED_RETRY_MS);
      }
      return;
    }
    reloading = true;
    window.location.reload();
  }

  function markReady() {
    pendingReload = true;
    applyUpdate();
  }

  // Signal 1 — the new worker claimed this page. The usual path.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return; // first install, not an update
    markReady();
  });

  navigator.serviceWorker.ready.then(reg => {
    const check = () => { reg.update().catch(() => {}); };

    // A worker that has finished installing but has not taken over yet. Our
    // sw.js calls skipWaiting() itself so this should not happen, but if it
    // ever does, push it through rather than serving stale code.
    const promoteWaiting = () => {
      if (reg.waiting && navigator.serviceWorker.controller) {
        try {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        } catch {
          // An unreachable worker is not worth failing over — the next check
          // finds it again.
        }
      }
    };

    // Signal 2 — watch a new worker through its lifecycle. This is the safety
    // net for a controllerchange that fired before we were listening, or one
    // the browser never delivered.
    const watch = worker => {
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') promoteWaiting();
        if (worker.state === 'activated' && hadController) markReady();
      });
    };
    reg.addEventListener('updatefound', () => watch(reg.installing));
    watch(reg.installing);
    watch(reg.waiting);
    promoteWaiting();

    check();
    setInterval(check, CHECK_INTERVAL_MS);

    // Reopening or resuming the app is the main moment we get to run — use it
    // to both check for a new build and apply one that already landed.
    const wake = () => { check(); applyUpdate(); };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') wake();
    });
    window.addEventListener('focus', wake);
    // iOS restores a backgrounded home-screen app from the back/forward cache,
    // where visibilitychange alone is not dependable. pageshow always fires on
    // that restore, so it is the one that keeps iPhone and iPad current.
    window.addEventListener('pageshow', wake);
    window.addEventListener('online', check);
  }).catch(() => {
    // No registration available — the app still works, just without
    // background update checks.
  });
}
