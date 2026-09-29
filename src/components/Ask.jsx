import { useEffect, useState } from 'react';
import { ASK_EVENT } from '../utils/ask';

// Draws the question asked through ask() in utils/ask.js.
export default function AskHost() {
  const [q, setQ] = useState(null);

  useEffect(() => {
    const onAsk = e => setQ(prev => { prev?.resolve(false); return e.detail; });
    window.addEventListener(ASK_EVENT, onAsk);
    return () => window.removeEventListener(ASK_EVENT, onAsk);
  }, []);

  useEffect(() => {
    if (!q) return;
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); answer(false); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  });

  function answer(v) { q?.resolve(v); setQ(null); }

  if (!q) return null;
  return (
    <div className="ask-backdrop" onClick={() => answer(false)}>
      <div className="ask-card" role="alertdialog" aria-modal="true" aria-label={q.text} onClick={e => e.stopPropagation()}>
        <p className="ask-text">{q.text}</p>
        <div className="ask-btns">
          <button type="button" className="ask-no" onClick={() => answer(false)}>{q.no}</button>
          <button type="button" className={`ask-yes${q.danger ? ' ask-danger' : ''}`} onClick={() => answer(true)}>{q.yes}</button>
        </div>
      </div>
    </div>
  );
}
