// Merging two copies of the notebook.
//
// Every other synced key is a single small value where "newest wins" is the
// right answer. The notebook is not: it is a whole collection of notes, diary
// pages and checklists living under ONE key, so newest-wins throws away
// everything the losing device wrote. Write a note on the phone and another on
// the iPad inside the same moment and one of them simply vanished — and
// because the timestamps compare with a strict >, neither device would ever
// accept the other's copy again. The two gadgets stayed split forever.
//
// So the notebook merges item by item instead. Two rules do all the work:
//
//   1. A page, list or item is kept if EITHER side has it. Nothing is lost
//      just because the other gadget had not heard about it yet.
//   2. When both sides have the same item, the one edited most recently wins.
//
// The merge has to be commutative and deterministic: both gadgets run it on
// the same pair of copies and must land on byte-identical output, or they
// would push edits back and forth at each other forever. That is why every
// list comes out sorted, and why every tie is broken by comparing the items
// themselves rather than by which side they arrived from.

// How long a deletion is remembered. Without a tombstone, a page deleted on
// the phone comes straight back from the iPad's copy on the next merge. Two
// months is far longer than any gadget realistically stays offline, and the
// tombstones are tiny (an id and a date).
export const TOMBSTONE_TTL_MS = 60 * 24 * 60 * 60 * 1000;

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

// A stable id derived from an item's own content. Older saves predate ids, and
// the two gadgets must derive the SAME id for the same item or the merge would
// keep both copies as duplicates. Deliberately not random.
function stableId(prefix, seed) {
  let h = 5381;
  const text = JSON.stringify(seed);
  for (let i = 0; i < text.length; i += 1) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
  return `${prefix}-${h.toString(36)}`;
}

// Bring an older save up to the current shape BEFORE merging. The app has
// carried two earlier layouts: a single diary entry kept as top-level
// note/mood/images with no `pages` array at all, and a single `checklist`
// array before lists could be named. A gadget that has not been opened in a
// while still holds one of these, and reading only `pages`/`checklists` would
// quietly drop everything in it. This mirrors normalizeNotebookData in
// Hero.jsx, which does the same migration for display.
function adoptLegacy(raw) {
  if (!raw) return raw;
  const out = { ...raw };

  const hasPages = Array.isArray(out.pages) && out.pages.length > 0;
  const legacyEntry = str(raw.note).trim() || str(raw.mood) ||
    (Array.isArray(raw.images) && raw.images.length > 0);
  if (!hasPages && legacyEntry) {
    out.pages = [{
      id: 'legacy-page',
      title: 'Today',
      note: str(raw.note),
      images: Array.isArray(raw.images) ? raw.images : [],
      mood: str(raw.mood),
      userCreated: true,
      createdAt: str(raw.createdAt) || str(raw.updatedAt),
      updatedAt: str(raw.updatedAt) || str(raw.createdAt),
    }];
  }

  const hasLists = Array.isArray(out.checklists) && out.checklists.length > 0;
  if (!hasLists && Array.isArray(raw.checklist) && raw.checklist.length > 0) {
    out.checklists = [{
      id: 'legacy-list',
      title: '',
      items: raw.checklist,
      createdAt: str(raw.updatedAt),
      updatedAt: str(raw.updatedAt),
    }];
  }

  return out;
}

// Give anything that arrived without an id a stable one, so it merges instead
// of being skipped. Never invent an id for something that already has one.
function withIds(list, prefix) {
  if (!Array.isArray(list)) return [];
  return list.map(x => (
    (x && typeof x === 'object' && !x.id) ? { ...x, id: stableId(prefix, x) } : x
  ));
}

// ISO dates sort correctly as plain strings, so no Date parsing is needed.
// When two edits carry the same stamp, the JSON itself breaks the tie: it is
// arbitrary, but it is the SAME arbitrary answer on both gadgets.
function pickNewer(a, b, stampOf) {
  const ta = str(stampOf(a));
  const tb = str(stampOf(b));
  if (ta !== tb) return ta > tb ? a : b;
  return JSON.stringify(a) >= JSON.stringify(b) ? a : b;
}

const itemStamp = x => x.updatedAt || x.completedAt || x.createdAt;
const pageStamp = x => x.updatedAt || x.createdAt;

// Stable order for anything that came out of a merge: oldest first, id as the
// tie-break so the result never depends on which side was read first.
function byCreated(a, b) {
  const ca = str(a.createdAt);
  const cb = str(b.createdAt);
  if (ca !== cb) return ca < cb ? -1 : 1;
  return str(a.id) < str(b.id) ? -1 : 1;
}

function mergeLists(a, b, deleted, stampOf, combine) {
  const byId = new Map();
  for (const x of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]) {
    if (!x || typeof x !== 'object' || !x.id) continue;
    if (deleted[x.id]) continue;
    const prev = byId.get(x.id);
    byId.set(x.id, prev ? (combine ? combine(prev, x) : pickNewer(prev, x, stampOf)) : x);
  }
  return [...byId.values()].sort(byCreated);
}

// A checklist is itself a collection, so two copies of the same list have to
// merge their items rather than one copy replacing the other — otherwise
// adding an item on each gadget loses one of them.
function combineChecklists(deleted) {
  return (a, b) => {
    const winner = pickNewer(a, b, pageStamp);
    return {
      ...winner,
      items: mergeLists(withIds(a.items, 'item'), withIds(b.items, 'item'), deleted, itemStamp),
    };
  };
}

function mergeTombstones(a = {}, b = {}) {
  const out = {};
  const cutoff = Date.now() - TOMBSTONE_TTL_MS;
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
 * Merge two serialized notebooks into one. Takes and returns the raw JSON
 * strings that live in localStorage, so sync can treat it as a drop-in
 * replacement for "take whichever value is newer".
 *
 * Either side may be missing or unreadable; whatever is left is returned.
 */
export function mergeNotebookBlobs(localRaw, remoteRaw) {
  const local = adoptLegacy(parse(localRaw));
  const remote = adoptLegacy(parse(remoteRaw));
  if (!local) return typeof remoteRaw === 'string' ? remoteRaw : localRaw;
  if (!remote) return localRaw;

  const deleted = mergeTombstones(local.deleted, remote.deleted);
  const pages = mergeLists(
    withIds(local.pages, 'page'), withIds(remote.pages, 'page'), deleted, pageStamp,
  );
  const checklists = mergeLists(
    withIds(local.checklists, 'list'), withIds(remote.checklists, 'list'),
    deleted, pageStamp, combineChecklists(deleted),
  );

  // The scalars — which page is open, the date stamp — come as a set from
  // whichever copy was touched last, so both gadgets choose the same one.
  const lead = pickNewer(local, remote, x => x.updatedAt);
  const has = (list, id) => list.some(x => x.id === id);

  return JSON.stringify({
    date: str(lead.date),
    pages,
    activePageId: has(pages, lead.activePageId) ? lead.activePageId : (pages[0]?.id || ''),
    checklists,
    activeChecklistId: has(checklists, lead.activeChecklistId)
      ? lead.activeChecklistId
      : (checklists[0]?.id || ''),
    deleted,
    updatedAt: str(local.updatedAt) > str(remote.updatedAt)
      ? str(local.updatedAt)
      : str(remote.updatedAt),
  });
}
