import { useState } from 'react';

export default function OilCard({ emoji, name, tagline, detail, ratio }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`oil-card${open ? ' is-open' : ''}`}>
      <button className="oil-trigger" onClick={() => setOpen(o => !o)}>
        <div className="oil-em">{emoji}</div>
        <div>
          <div className="oil-n">{name}</div>
          <div className="oil-ts">{tagline}</div>
        </div>
        <span className="oil-arr">▾</span>
      </button>
      <div className="oil-body">
        <div className="oil-inner">
          <div className="oil-detail">{detail}</div>
          <div className="oil-ratio">📋 {ratio}</div>
        </div>
      </div>
    </div>
  );
}
