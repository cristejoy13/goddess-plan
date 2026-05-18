import { useState, useCallback } from 'react';
import { MONTHS } from '../data/months';

function loadState() {
  try {
    return {
      checks: JSON.parse(localStorage.getItem('gp_checks') || '{}'),
      done:   JSON.parse(localStorage.getItem('gp_done')   || '{}'),
    };
  } catch {
    return { checks: {}, done: {} };
  }
}

function saveState(state) {
  try {
    localStorage.setItem('gp_checks', JSON.stringify(state.checks));
    localStorage.setItem('gp_done',   JSON.stringify(state.done));
  } catch {
    // Storage can be unavailable in private browsing or restricted webviews.
  }
}

function MonthCard({ month, idx, checks, done, onToggleCheck, onToggleDone }) {
  const [open, setOpen] = useState(false);
  const cd = checks[idx] || [];
  const count = cd.filter(Boolean).length;
  const pct = Math.round((count / month.tasks.length) * 100);

  return (
    <div className={`month-card${done[idx] ? ' done' : ''}`}>
      <div className="m-top">
        <div>
          <div className="m-name">{month.name}</div>
          <div className="m-challenge">{month.ch}</div>
        </div>
        <span className="m-badge">{done[idx] ? '✓ Complete' : 'In Progress'}</span>
      </div>

      <p className="m-why">{month.why}</p>

      <button
        className={`m-toggle${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>Weekly Tasks</span>
        <span className="m-toggle-arrow">▾</span>
      </button>

      <div className={`m-detail-body${open ? ' open' : ''}`}>
        <div className="m-detail-inner">
          {month.tasks.map((task, ti) => (
            <div
              key={ti}
              className={`check-item${cd[ti] ? ' chk' : ''}`}
              onClick={() => onToggleCheck(idx, ti)}
            >
              <div className="check-box" />
              <span className="check-text">{task}</span>
            </div>
          ))}
          <div className="prog-wrap">
            <div className="prog-bg">
              <div className="prog-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="prog-note">{count} of {month.tasks.length} tasks completed</div>
          </div>
        </div>
      </div>

      <button className="comp-btn" onClick={() => onToggleDone(idx)}>
        {done[idx] ? '✓ Month Completed!' : 'Mark Month Complete →'}
      </button>
    </div>
  );
}

export default function Challenges() {
  const [state, setState] = useState(loadState);

  const toggleCheck = useCallback((monthIdx, taskIdx) => {
    setState(prev => {
      const next = {
        checks: { ...prev.checks, [monthIdx]: [...(prev.checks[monthIdx] || [])] },
        done: prev.done,
      };
      next.checks[monthIdx][taskIdx] = !next.checks[monthIdx][taskIdx];
      saveState(next);
      return next;
    });
  }, []);

  const toggleDone = useCallback((monthIdx) => {
    setState(prev => {
      const next = { checks: prev.checks, done: { ...prev.done, [monthIdx]: !prev.done[monthIdx] } };
      saveState(next);
      return next;
    });
  }, []);

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">May — December</div>
        <h2 className="s-title">Monthly <em>Challenges</em></h2>
        <p className="s-desc">Tap each month to open the weekly tasks. Check them off as you complete them — progress saves automatically.</p>
      </div>

      <div className="month-grid">
        {MONTHS.map((m, i) => (
          <MonthCard
            key={i}
            month={m}
            idx={i}
            checks={state.checks}
            done={state.done}
            onToggleCheck={toggleCheck}
            onToggleDone={toggleDone}
          />
        ))}
      </div>
    </div>
  );
}
