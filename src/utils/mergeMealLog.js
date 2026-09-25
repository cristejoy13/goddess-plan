// Merging two copies of the meal log.
//
// Same problem the notebook has, and the same answer. The whole log — every
// day, every line she wrote — lives under ONE localStorage key, so "newest
// wins" would throw away everything the losing gadget recorded. Write lunch on
// the phone and dinner on the iPad inside the same minute and one of the two
// simply disappears, which is fatal for a record whose only job is to be
// trusted.
//
// So the log merges entry by entry:
//
//   1. An entry is kept if EITHER side has it.
//   2. When both sides hold the same entry, the one edited last wins.
//   3. A deleted entry stays deleted, remembered by a tombstone, so the other
//      gadget's copy cannot resurrect it on the next merge.
//
// The daily weight, the calories burned and the weekly calorie goal merge the same way, one key at
// a time, newest stamp wins. A cleared one is carried as null rather than
// dropped, for the same reason a deleted meal leaves a tombstone: without it
// the other gadget's old number comes straight back.
//
// The merge must be commutative and deterministic — both gadgets run it on the
// same pair and must produce byte-identical output, or they push edits back and
// forth forever. Hence the sorted output and the content-based tie-breaks.

// How long a deletion is remembered. Two months is far longer than any gadget
// realistically stays offline, and a tombstone is only an id and a date.
export const MEAL_TOMBSTONE_TTL_MS = 60 * 24 * 60 * 60 * 1000;

function parse(raw) {
  if (typeof raw !== 'string') return null;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? v : null;
  } catch {
    return null;
  }
}

const str = v => (typeof v === 'string' ? v : '');

const stampOf = x => str(x.updatedAt) || str(x.createdAt);

// ISO stamps sort correctly as plain strings. When two edits carry the same
// stamp the JSON breaks the tie — arbitrary, but the SAME arbitrary answer on
// both gadgets, which is the whole requirement.
function pickNewer(a, b) {
  const ta = stampOf(a);
  const tb = stampOf(b);
  if (ta !== tb) return ta > tb ? a : b;
  return JSON.stringify(a) >= JSON.stringify(b) ? a : b;
}

// Earliest meal first, id as the tie-break so the order never depends on which
// side was read first.
function byTime(a, b) {
  const ta = str(a.time);
  const tb = str(b.time);
  if (ta !== tb) return ta < tb ? -1 : 1;
  return str(a.id) < str(b.id) ? -1 : 1;
}

function mergeDay(a, b, deleted) {
  const byId = new Map();
  for (const x of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]) {
    if (!x || typeof x !== 'object' || !x.id) continue;
    if (deleted[x.id]) continue;
    const prev = byId.get(x.id);
    byId.set(x.id, prev ? pickNewer(prev, x) : x);
  }
  return [...byId.values()].sort(byTime);
}

// One key's number, newest stamp wins. Serves the daily weight (keyed by date,
// field `kg`) and the weekly calorie goal (keyed by that week's Monday, field
// `cal`) — the shape and the rule are identical, so they share one merge
// rather than two that could drift apart.
//
// The JSON tie-break is the same one the entries use, for the same reason:
// both gadgets must land on the same answer or they push the log back and
// forth forever.
function mergeNumbers(a = {}, b = {}, field) {
  const cutoff = Date.now() - MEAL_TOMBSTONE_TTL_MS;
  const out = {};
  const keys = [...new Set([
    ...Object.keys(a && typeof a === 'object' ? a : {}),
    ...Object.keys(b && typeof b === 'object' ? b : {}),
  ])].sort();
  for (const key of keys) {
    const pair = [a?.[key], b?.[key]].filter(w => w && typeof w === 'object');
    if (!pair.length) continue;
    const win = pair.length === 1 ? pair[0] : pickNewer(pair[0], pair[1]);
    const n = typeof win[field] === 'number' && Number.isFinite(win[field]) ? win[field] : null;
    // A cleared number is only kept long enough for every gadget to have seen
    // it. After that it is an empty record of nothing.
    if (n === null) {
      const at = Date.parse(stampOf(win));
      if (!Number.isFinite(at) || at < cutoff) continue;
    }
    out[key] = { [field]: n, updatedAt: stampOf(win) };
  }
  return out;
}

function mergeTombstones(a = {}, b = {}) {
  const out = {};
  const cutoff = Date.now() - MEAL_TOMBSTONE_TTL_MS;
  for (const [id, when] of [...Object.entries(a), ...Object.entries(b)]) {
    const t = str(when);
    if (!t) continue;
    const at = Date.parse(t);
    // Drop tombstones old enough that every gadget has certainly seen them.
    if (Number.isFinite(at) && at < cutoff) continue;
    if (!out[id] || t > out[id]) out[id] = t;
  }
  return out;
}

/**
 * Merge two serialized meal logs into one. Takes and returns the raw JSON
 * strings that live in localStorage, so sync can treat it as a drop-in
 * replacement for "take whichever value is newer".
 *
 * Either side may be missing or unreadable; whatever is left is returned.
 */
export function mergeMealLogBlobs(localRaw, remoteRaw) {
  const local = parse(localRaw);
  const remote = parse(remoteRaw);
  if (!local) return typeof remoteRaw === 'string' ? remoteRaw : localRaw;
  if (!remote) return localRaw;

  const deleted = mergeTombstones(local.deleted, remote.deleted);
  const localDays = (local.days && typeof local.days === 'object') ? local.days : {};
  const remoteDays = (remote.days && typeof remote.days === 'object') ? remote.days : {};

  // Sorted keys, so two gadgets serialize the object in the same order and
  // stop seeing each other's identical log as a change worth pushing back.
  const dates = [...new Set([...Object.keys(localDays), ...Object.keys(remoteDays)])].sort();
  const days = {};
  for (const date of dates) {
    const entries = mergeDay(localDays[date], remoteDays[date], deleted);
    // A day whose every entry was deleted carries no information, so it does
    // not survive as an empty key.
    if (entries.length) days[date] = entries;
  }

  return JSON.stringify({
    days,
    weights: mergeNumbers(local.weights, remote.weights, 'kg'),
    goals: mergeNumbers(local.goals, remote.goals, 'cal'),
    burns: mergeNumbers(local.burns, remote.burns, 'cal'),
    deleted,
    updatedAt: str(local.updatedAt) > str(remote.updatedAt)
      ? str(local.updatedAt)
      : str(remote.updatedAt),
  });
}
