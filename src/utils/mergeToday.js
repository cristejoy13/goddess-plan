// Today's Plan across gadgets (2026-10-12).
//
// Two synced keys:
//   gp_today_checks  { date, checked: { id: true|false }, at: { id: ms } }
//   gp_plan_items    { items: [{ id, title, icon, pos, at? }], deleted: { id: ms } }
//
// Newest-wins on the whole value lost ticks: tick "Stretch" on the phone and
// "Gua Sha" on the iPad a moment apart, and whichever saved second wiped the
// other. These merge instead, item by item, so both ticks survive. Like the
// other mergers they are deterministic — both gadgets compute the same bytes
// from the same pair — or the two would push it back and forth forever.

function parse(raw) {
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}

// "2026-10-12" (or the older "2026-10-12" without padding) → a sortable number.
function dayNumber(date) {
  const m = String(date || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  return m ? Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3]) : 0;
}

const sorted = obj => Object.fromEntries(Object.keys(obj).sort().map(k => [k, obj[k]]));

export function mergeTodayChecks(localRaw, remoteRaw) {
  const a = parse(localRaw);
  const b = parse(remoteRaw);
  if (!a) return remoteRaw;
  if (!b) return localRaw;
  // A new day starts fresh: the later day wins outright.
  const da = dayNumber(a.date), db = dayNumber(b.date);
  if (da !== db) return da > db ? localRaw : remoteRaw;
  const checked = {}, at = {};
  const ids = new Set([...Object.keys(a.checked || {}), ...Object.keys(b.checked || {})]);
  for (const id of ids) {
    const ta = Number(a.at?.[id]) || 0, tb = Number(b.at?.[id]) || 0;
    const va = !!a.checked?.[id], vb = !!b.checked?.[id];
    // The side that changed it last wins; with no times (older saves), a tick
    // on either side counts.
    checked[id] = ta === tb ? va || vb : ta > tb ? va : vb;
    const t = Math.max(ta, tb);
    if (t) at[id] = t;
  }
  return JSON.stringify({ date: a.date, checked: sorted(checked), at: sorted(at) });
}

export function mergePlanItems(localRaw, remoteRaw) {
  const a = parse(localRaw);
  const b = parse(remoteRaw);
  if (!a) return remoteRaw;
  if (!b) return localRaw;
  const deleted = { ...(b.deleted || {}) };
  for (const [id, t] of Object.entries(a.deleted || {})) deleted[id] = Math.max(Number(t) || 0, Number(deleted[id]) || 0);
  const byId = new Map();
  for (const it of [...(b.items || []), ...(a.items || [])]) {
    if (!it?.id || deleted[it.id]) continue;
    const had = byId.get(it.id);
    // Same item on both sides: the copy changed last wins (moving a step
    // stamps it); with equal times, the larger copy, so both gadgets agree.
    const ti = Number(it.at) || 0, th = Number(had?.at) || 0;
    if (!had || ti > th || (ti === th && JSON.stringify(it) > JSON.stringify(had))) byId.set(it.id, it);
  }
  const items = [...byId.values()].sort((x, y) => (x.pos - y.pos) || (x.id < y.id ? -1 : x.id > y.id ? 1 : 0));
  return JSON.stringify({ items, deleted: sorted(deleted) });
}
