import { useState } from 'react';
import { liftKey, parsePlanned, suggestNext, stepFor, saveLift, clearLift } from '../utils/lifts';

// One row under a lift: what you are doing now, and what you step up to next.
// Collapsed it is a single tappable line; open it is four fields and the button
// that promotes your next target into your current weight.
export default function LiftTracker({ exercise, lifts, onChange }) {
  const [open, setOpen] = useState(false);
  const key = liftKey(exercise.name);
  const saved = lifts[key] || {};
  const planned = parsePlanned(exercise.detail);

  const sets = saved.sets ?? planned.sets ?? '';
  const reps = saved.reps ?? planned.reps ?? '';
  const kg = saved.kg ?? '';
  const nextKg = saved.nextKg ?? suggestNext(kg, exercise.name) ?? '';
  const step = stepFor(exercise.name);

  // Draft state so a half-typed number never lands in storage.
  const [draft, setDraft] = useState({ sets, reps, kg, nextKg });

  function openEditor() {
    setDraft({ sets, reps, kg, nextKg });
    setOpen(true);
  }

  function commit(patch) {
    onChange(saveLift(exercise.name, patch));
  }

  function save() {
    commit({
      sets: draft.sets === '' ? null : Number(draft.sets),
      reps: draft.reps === '' ? null : String(draft.reps),
      kg: draft.kg === '' ? null : Number(draft.kg),
      nextKg: draft.nextKg === '' ? null : Number(draft.nextKg),
    });
    setOpen(false);
  }

  // "I hit it" — today's next target becomes the weight you lift now, and the
  // following target is stepped up from there. This is the whole point of the
  // log: overload happens by promotion, not by remembering.
  function levelUp() {
    const promoted = Number(nextKg);
    if (!Number.isFinite(promoted) || promoted <= 0) return;
    commit({
      sets: sets === '' ? null : Number(sets),
      reps: reps === '' ? null : String(reps),
      kg: promoted,
      nextKg: Math.round((promoted + step) * 100) / 100,
    });
    setOpen(false);
  }

  function reset() {
    onChange(clearLift(exercise.name));
    setOpen(false);
  }

  const hasWeight = kg !== '' && kg !== null;

  if (!open) {
    return (
      <button className={`lift-chip${hasWeight ? ' logged' : ''}`} onClick={openEditor}>
        <span className="lift-chip-scheme">
          {sets && reps ? `${sets} × ${reps}` : 'set your reps'}
        </span>
        <span className="lift-chip-kg">{hasWeight ? `${kg} kg` : 'add weight'}</span>
        {hasWeight && nextKg !== '' && (
          <span className="lift-chip-next">→ next {nextKg} kg</span>
        )}
        <span className="lift-chip-edit">✏️</span>
      </button>
    );
  }

  return (
    <div className="lift-editor">
      <div className="lift-editor-grid">
        <label className="lift-field">
          <span>Sets</span>
          <input
            type="number" inputMode="numeric" min="1" max="20"
            value={draft.sets}
            onChange={e => setDraft(d => ({ ...d, sets: e.target.value }))}
          />
        </label>
        <label className="lift-field">
          <span>Reps</span>
          <input
            type="text" inputMode="numeric"
            placeholder="10 or 10–12"
            value={draft.reps}
            onChange={e => setDraft(d => ({ ...d, reps: e.target.value }))}
          />
        </label>
        <label className="lift-field">
          <span>Weight now (kg)</span>
          <input
            type="number" inputMode="decimal" min="0" step={step}
            placeholder="0"
            value={draft.kg}
            onChange={e => {
              const v = e.target.value;
              // Retarget the next weight as you type, unless you have already
              // written your own target in by hand.
              setDraft(d => ({
                ...d,
                kg: v,
                nextKg: d.nextKg === '' || String(d.nextKg) === String(suggestNext(d.kg, exercise.name) ?? '')
                  ? (suggestNext(v, exercise.name) ?? '')
                  : d.nextKg,
              }));
            }}
          />
        </label>
        <label className="lift-field">
          <span>Next target (kg)</span>
          <input
            type="number" inputMode="decimal" min="0" step={step}
            placeholder="0"
            value={draft.nextKg}
            onChange={e => setDraft(d => ({ ...d, nextKg: e.target.value }))}
          />
        </label>
      </div>

      <p className="lift-hint">
        Steps of {step} kg for this lift. Add weight only when every set stays controlled —
        if form breaks, add a rep instead and keep the weight.
      </p>

      <div className="lift-editor-btns">
        <button className="lift-save" onClick={save}>Save</button>
        {hasWeight && nextKg !== '' && (
          <button className="lift-levelup" onClick={levelUp}>✓ Hit {nextKg} kg — move up</button>
        )}
        <button className="lift-cancel" onClick={() => setOpen(false)}>Cancel</button>
        <button className="lift-reset" onClick={reset}>Clear</button>
      </div>
    </div>
  );
}
