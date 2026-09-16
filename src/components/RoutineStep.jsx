import { useState } from 'react';

export default function RoutineStep({ num, cat, name, children, open: controlledOpen, onToggle, flow = false }) {
  const isControlled = controlledOpen !== undefined;
  const [internal, setInternal] = useState(false);
  const open = isControlled ? controlledOpen : internal;

  function handleToggle() {
    if (isControlled) onToggle?.();
    else setInternal(o => !o);
  }

  // Inside a StepFlow there is nothing to open — this IS the step you are on —
  // so the trigger becomes a plain heading and the body is simply there.
  if (flow) {
    return (
      <div className="rstep rstep-flow">
        <div className="rs-head">
          <div className="rs-num">{num}</div>
          <div className="rs-wrap">
            <div className="rs-cat">{cat}</div>
            <div className="rs-name">{name}</div>
          </div>
        </div>
        <div className="rs-flow-body">{children}</div>
      </div>
    );
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
