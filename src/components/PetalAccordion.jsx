import { useState } from 'react';

export default function PetalAccordion({ id, emoji, emojiBg, day, title, sub, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div id={id} className={`petal-acc splash-item${open ? ' is-open' : ''}`}>
      <button className="acc-trigger" onClick={() => setOpen(o => !o)}>
        <div className="acc-emoji" style={{ background: emojiBg }}>{emoji}</div>
        <div className="acc-text">
          <div className="acc-day">{day}</div>
          <div className="acc-title">{title}</div>
          {sub && <div className="acc-sub">{sub}</div>}
        </div>
        <div className="acc-chevron">▾</div>
      </button>
      <div className="petal-body">
        <div className="petal-inner">{children}</div>
      </div>
    </div>
  );
}
