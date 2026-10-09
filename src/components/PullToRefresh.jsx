// Pull down from the very top to refresh the app (2026-10-10).
//
// An app on the home screen has no browser reload button and no built-in
// pull-to-refresh, so she had no way to make it load the newest version or
// the newest synced numbers on demand. Pulling down from the top of the page
// shows a small pill; past the line it says "Release to refresh", and letting
// go reloads — after any unsent edit has gone out, and after asking for the
// newest version of the app.
//
// Only starts when the page is already at the top, the pull is mostly
// straight down, and the finger is not inside an open notebook, goals page,
// question box or a box that scrolls on its own — so it never fights with
// scrolling, the swipe-back gesture or typing.

import { useEffect, useRef, useState } from 'react';
import { hasPendingSyncWrites } from '../utils/sync';

const TRIGGER = 80;       // pixels of pull (after damping) that count
const IGNORE = '.daily-notebook-overlay, .goals-overlay, .ask-backdrop, .si-overlay, .sheet-overlay, input, textarea, select, [contenteditable="true"]';

function scrollsOnItsOwn(el) {
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const s = getComputedStyle(n);
    if (/(auto|scroll)/.test(s.overflowY) && n.scrollHeight > n.clientHeight && n.scrollTop > 0) return true;
  }
  return false;
}

const wait = ms => new Promise(r => setTimeout(r, ms));

export default function PullToRefresh() {
  const [pull, setPull] = useState(0);          // shown distance, damped
  const [refreshing, setRefreshing] = useState(false);
  const startRef = useRef(null);
  const pullRef = useRef(0);
  const show = (v) => { pullRef.current = v; setPull(v); };

  useEffect(() => {
    if (!('ontouchstart' in window)) return undefined;

    const onStart = (e) => {
      if (refreshing || e.touches.length !== 1) return;
      if (window.scrollY > 0 || document.scrollingElement?.scrollTop > 0) return;
      const t = e.target;
      if (t.closest?.(IGNORE) || scrollsOnItsOwn(t)) return;
      startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onMove = (e) => {
      const s = startRef.current;
      if (!s) return;
      const dx = e.touches[0].clientX - s.x;
      const dy = e.touches[0].clientY - s.y;
      if (dy <= 0 || Math.abs(dx) > dy) { if (dy < -10 || Math.abs(dx) > 30) { startRef.current = null; show(0); } return; }
      show(Math.min(120, dy * 0.5));
    };
    const onEnd = () => {
      const s = startRef.current;
      startRef.current = null;
      if (!s) return;
      if (pullRef.current >= TRIGGER) { show(TRIGGER); setRefreshing(true); } else show(0);
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('touchcancel', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [refreshing]);

  useEffect(() => {
    if (!refreshing) return;
    (async () => {
      // Let any unsent edit go out first (it is safe on the device either
      // way), and ask for the newest version of the app, then reload.
      for (let i = 0; i < 15; i += 1) {
        let pending = false;
        try { pending = hasPendingSyncWrites(); } catch { /* fine */ }
        if (!pending) break;
        await wait(200);
      }
      // One reload only. If a newer version is on its way, the update system
      // (swUpdate.js) reloads the moment it takes over — reloading here too
      // made the screen flash twice. Otherwise this is the one reload.
      try {
        const reg = await navigator.serviceWorker?.getRegistration();
        if (reg) {
          await Promise.race([reg.update(), wait(1500)]);
          if (reg.installing || reg.waiting) await wait(6000);
        }
      } catch { /* reload anyway */ }
      window.location.reload();
    })();
  }, [refreshing]);

  if (!pull && !refreshing) return null;
  const ready = pull >= TRIGGER;
  return (
    <div className="ptr" style={{ transform: `translate(-50%, ${Math.round(pull * 0.6)}px)` }} role="status" aria-live="polite">
      <span className={`ptr-icon${refreshing ? ' is-spinning' : ''}`} aria-hidden="true">{refreshing ? '↻' : ready ? '↻' : '↓'}</span>
      {refreshing ? 'Refreshing…' : ready ? 'Let go to refresh' : 'Pull to refresh'}
    </div>
  );
}
