import { useState, Children, isValidElement, cloneElement } from 'react';
import { hiddenInMine, useShelfContext } from '../utils/bodyShelf';

// One step at a time, instead of a stack of drop-downs.
//
// A routine is done in order, so it is read in order. Seven closed drawers ask
// you to decide which one to open next, which is a decision the routine itself
// already made. This shows step one, and a Next button.
//
// It wraps whatever step elements it is given rather than taking a data prop,
// so a screen already written as a run of steps becomes a flow by being
// wrapped — no rewriting of the steps themselves.
export default function StepFlow({ children }) {
  const shelf = useShelfContext();
  // In "Mine", steps with none of her products drop out of the flow.
  const steps = Children.toArray(children).filter(isValidElement).filter(s => !hiddenInMine(s.props.children, shelf));
  const [i, setI] = useState(0);
  if (steps.length === 0) {
    return shelf?.onlyMine ? <p className="bk-shelf-empty">None of your products here yet. Switch to <b>All</b> and click “I have it”.</p> : null;
  }

  // Clamped rather than stored blindly: the step list can be shorter after a
  // tab switch, and an index left pointing past the end would render nothing.
  const idx = Math.min(i, steps.length - 1);
  const atStart = idx === 0;
  const atEnd = idx === steps.length - 1;

  return (
    <div className="stepflow">
      <div className="sf-rail">
        {steps.map((_, n) => (
          <button
            key={n}
            className={`sf-dot${n === idx ? ' is-on' : ''}${n < idx ? ' is-done' : ''}`}
            onClick={() => setI(n)}
            aria-label={`Step ${n + 1}`}
            aria-current={n === idx ? 'step' : undefined}
          >
            {n + 1}
          </button>
        ))}
      </div>

      <div className="sf-stage">
        {cloneElement(steps[idx], { flow: true })}
      </div>

      <div className="sf-nav">
        <button className="sf-btn" onClick={() => setI(idx - 1)} disabled={atStart}>‹ Back</button>
        <span className="sf-count">{idx + 1} of {steps.length}</span>
        <button className="sf-btn sf-btn-next" onClick={() => setI(idx + 1)} disabled={atEnd}>Next ›</button>
      </div>
    </div>
  );
}
