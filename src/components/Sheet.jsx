import { useEffect } from 'react';
import { createPortal } from 'react-dom';

// A floating page.
//
// A routine opened as an accordion leaves the whole rest of the screen around
// it — every other routine, the tab bar, the page heading — so the thing you
// are actually doing is a slot in a list rather than the thing in front of you.
// This covers all of that. One routine, nothing else, and a close button.
//
// It is a page rather than a modal in feel: a floating card, centred on every
// screen.
//
// It renders into document.body rather than where it sits in the tree. This is
// not tidiness — it is the whole reason it works. `.section` runs a keyframe
// animation with `both`, so it keeps a transform value forever, and an element
// with a transform becomes the containing block for `position: fixed` inside
// it. The overlay was therefore sized to the section — 980px wide and as tall
// as the page — rather than to the screen, which is why it kept coming out
// off-centre no matter what the centring rules said.
export default function Sheet({ open, emoji, emojiBg, kicker, title, sub, onClose, children }) {
  // Escape closes it, and the page behind it stops scrolling — without this the
  // background slides under your finger while you are reading the sheet.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    (
    <div className="sheet-overlay" onClick={onClose}>
      <div
        className="sheet-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
      >
        <div className="sheet-head">
          {emoji && <div className="sheet-emoji" style={{ background: emojiBg }}>{emoji}</div>}
          <div className="sheet-headtext">
            {kicker && <div className="sheet-kicker">{kicker}</div>}
            <div className="sheet-title">{title}</div>
            {sub && <div className="sheet-sub">{sub}</div>}
          </div>
          <button className="sheet-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
    ),
    document.body,
  );
}
