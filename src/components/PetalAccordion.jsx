import { useState } from 'react';

export default function PetalAccordion({
  id, emoji, emojiBg, day, title, sub, children,
  defaultOpen = false, isToday = false,
  // controlled mode: pass both to opt in
  open: controlledOpen, onToggle,
}) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  function handleToggle() {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen(o => !o);
    }
  }

  return (
    <div id={id} className={`petal-acc splash-item${open ? ' is-open' : ''}${isToday ? ' is-today' : ''}`}>
      <button className="acc-trigger" onClick={handleToggle}>
        <div className="acc-emoji" style={{ background: emojiBg }}>{emoji}</div>
        <div className="acc-text">
          <div className="acc-day">
            {isToday && <span className="acc-today-badge">Today</span>}
            {day}
          </div>
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
