import { useState } from 'react';

export default function RoutineStep({ num, cat, name, children, open: controlledOpen, onToggle }) {
  const isControlled = controlledOpen !== undefined;
  const [internal, setInternal] = useState(false);
  const open = isControlled ? controlledOpen : internal;

  function handleToggle() {
    if (isControlled) onToggle?.();
    else setInternal(o => !o);
  }

  return (
    <div className={`rstep${open ? ' is-open' : ''}`}>
      <button className="rs-trigger" onClick={handleToggle}>
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
