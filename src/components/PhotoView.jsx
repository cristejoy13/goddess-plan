import { useEffect } from 'react';
import { createPortal } from 'react-dom';

// A picture shown whole, on its own, over everything (2026-10-22). Clicking
// anywhere, ✕ or Escape closes it.
export default function PhotoView({ src, alt = '', onClose }) {
  useEffect(() => {
    if (!src) return undefined;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [src, onClose]);

  if (!src || typeof document === 'undefined') return null;
  return createPortal(
    <div className="photo-view" role="dialog" aria-modal="true" aria-label={alt || 'Picture'} onClick={onClose}>
      <button type="button" className="photo-view-x" onClick={onClose} aria-label="Close">✕</button>
      <img src={src} alt={alt} />
    </div>,
    document.body,
  );
}
