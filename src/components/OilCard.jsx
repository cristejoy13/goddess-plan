import { useState } from 'react';

export default function OilCard({ emoji, name, tagline, detail, ratio, steps }) {
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
          {steps && steps.length > 0 && (
            <div className="oil-ritual">
              <div className="oil-ritual-title">Step-by-Step Ritual</div>
              {steps.map((s, i) => (
                <div key={i} className="oil-step">
                  <div className="oil-sn">{i + 1}</div>
                  <div>
                    <h4>{s.h}</h4>
                    <p>{s.p}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
