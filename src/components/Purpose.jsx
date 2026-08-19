import { useState, useCallback } from 'react';
import { seedDefault } from '../utils/sync';

// ─── MY PURPOSE ────────────────────────────────────────────────────────────
// The things you are actually working toward. Everything lives in one
// localStorage key so it rides the normal device sync, and the rule is simple:
// once a purpose exists it is never touched again unless YOU edit or delete it.
// The starter list below is written ONCE, on the very first launch. After that
// the stored list is the only source of truth — a deleted starter stays
// deleted, an edited one keeps your wording, and nothing is ever re-added
// behind your back.

const STORE_KEY = 'gp_purposes';

const STARTERS = [
  { title: '100,000 pesos this year',              kind: 'Savings' },
  { title: '500,000 pesos when I become 24',       kind: 'Savings' },
  { title: '1,000 dollars monthly income',         kind: 'Income' },
  { title: '100,000 pesos monthly income',         kind: 'Income' },
  { title: '10,000 dollars income',                kind: 'Income' },
];

// Short, unobtrusive stamp — "19 Aug" this year, "19 Aug 25" for older ones.
function shortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const s = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const yr = d.getFullYear();
  return yr === new Date().getFullYear() ? s : `${s} ${String(yr).slice(2)}`;
}

function newId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    // Anything already stored — including an empty list you cleared yourself —
    // is honoured exactly as it is. Only a completely absent key seeds.
    if (raw && Array.isArray(raw.items)) return raw;
  } catch { /* fall through to seeding */ }
  const now = new Date().toISOString();
  const seeded = {
    seeded: true,
    items: STARTERS.map(s => ({ id: newId(), ...s, done: false, createdAt: now })),
  };
  // seedDefault, not setItem: a starter list must never outrank the real list
  // already sitting on your other devices.
  seedDefault(STORE_KEY, JSON.stringify(seeded));
  return seeded;
}

function save(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
}

// The add / edit form — one title, one optional kind, nothing else to fill in.
function PurposeForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [kind,  setKind]  = useState(initial?.kind  || '');

  function submit(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onSave({ title: t, kind: kind.trim() });
  }

  return (
    <form className="pp-form" onSubmit={submit}>
      <label className="pp-field">
        <span>What is the purpose?</span>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. 250,000 pesos emergency fund"
          autoFocus
        />
      </label>
      <label className="pp-field">
        <span>What kind of purpose is it? <em>(optional)</em></span>
        <input
          value={kind}
          onChange={e => setKind(e.target.value)}
          placeholder="e.g. Savings · Income · Health · Travel"
        />
      </label>
      <div className="pp-form-btns">
        <button type="submit" className="pp-save" disabled={!title.trim()}>
          {initial ? 'Save changes' : '＋ Add purpose'}
        </button>
        <button type="button" className="pp-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// Six pastels, rotated by position so a long list never repeats side by side.
const PASTELS = 6;

function PurposeRow({ item, index, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="pp-item pp-item-editing">
        <PurposeForm
          initial={item}
          onSave={(fields) => { onEdit(fields); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={`pp-item pp-c${index % PASTELS}${item.done ? ' done' : ''}`}>
      <button
        className={`pp-check${item.done ? ' checked' : ''}`}
        onClick={onToggle}
        aria-label={item.done ? 'Mark as not reached yet' : 'Mark as reached'}
      >
        {item.done ? '✓' : ''}
      </button>

      <div className="pp-body">
        <div className="pp-title">{item.title}</div>
        <div className="pp-meta">
          {item.kind && <span className="pp-kind">{item.kind}</span>}
          <span className="pp-date">{shortDate(item.createdAt)}</span>
          {item.done && item.doneAt && <span className="pp-doneat">✓ {shortDate(item.doneAt)}</span>}
        </div>
      </div>

      <div className="pp-actions">
        <button className="pp-icon-btn" onClick={() => setEditing(true)} aria-label="Edit">✏️</button>
        <button className="pp-icon-btn pp-del" onClick={onDelete} aria-label="Delete">🗑</button>
      </div>
    </li>
  );
}

export default function Purpose() {
  const [state, setState] = useState(load);
  const [adding, setAdding] = useState(false);

  const commit = useCallback((updater) => {
    setState(prev => {
      const next = { ...prev, items: updater(prev.items) };
      save(next);
      return next;
    });
  }, []);

  const add = (fields) => {
    commit(items => [...items, { id: newId(), ...fields, done: false, createdAt: new Date().toISOString() }]);
    setAdding(false);
  };

  const edit = (id, fields) =>
    commit(items => items.map(it => (it.id === id ? { ...it, ...fields } : it)));

  const toggle = (id) =>
    commit(items => items.map(it => (
      it.id === id
        ? { ...it, done: !it.done, doneAt: !it.done ? new Date().toISOString() : undefined }
        : it
    )));

  const remove = (item) => {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    commit(items => items.filter(it => it.id !== item.id));
  };

  const items = state.items || [];
  const reached = items.filter(i => i.done).length;

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Why you are doing all of this</div>
        <h2 className="s-title">My <em>Purpose</em></h2>
        <p className="s-desc">
          Tick one off the day you reach it. Add your own, edit the wording any time — nothing here
          ever changes or disappears unless you delete it yourself, and it syncs to all your devices.
        </p>
      </div>

      <div className="pp-summary splash-item">
        🎯 {reached} of {items.length} reached
      </div>

      <ul className="pp-list splash-item">
        {items.map((item, i) => (
          <PurposeRow
            key={item.id}
            item={item}
            index={i}
            onToggle={() => toggle(item.id)}
            onEdit={(fields) => edit(item.id, fields)}
            onDelete={() => remove(item)}
          />
        ))}
        {items.length === 0 && (
          <li className="pp-empty">Nothing here yet. Add the first thing you are working toward.</li>
        )}
      </ul>

      <div className="pp-add-wrap splash-item">
        {adding ? (
          <div className="pp-add-card">
            <PurposeForm onSave={add} onCancel={() => setAdding(false)} />
          </div>
        ) : (
          <button className="pp-add-btn" onClick={() => setAdding(true)}>＋ Add another purpose</button>
        )}
      </div>
    </div>
  );
}
