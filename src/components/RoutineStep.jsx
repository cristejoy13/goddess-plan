import { useState } from 'react';

export default function RoutineStep({ num, cat, name, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rstep${open ? ' is-open' : ''}`}>
      <button className="rs-trigger" onClick={() => setOpen(o => !o)}>
        <div className="rs-num">{num}</div>
        <div className="rs-wrap">
          <div className="rs-cat">{cat}</div>
          <div className="rs-name">{name}</div>
        </div>
        <span className="rs-arrow">▾</span>
      </button>
      <div className="rs-body">
        <div className="rs-inner">{children}</div>
      </div>
    </div>
  );
}
