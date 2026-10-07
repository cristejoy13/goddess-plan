// Merging two gadgets' memory of scanned meals.
//
// The memory is { "<her words, tidied>": { result, at } }. A meal learned on
// the phone must reach the iPad, and neither gadget may wipe the other's, so
// the two copies are joined: every meal from either side is kept, the newer
// one wins when both have it, and only the newest MEMORY_MAX are kept so the
// shared cloud document stays small.
//
// Deterministic like the other mergers: both gadgets compute the same bytes
// from the same pair, or they would push it back and forth forever.

export const MEMORY_MAX = 100;

function parse(raw) {
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  } catch {
    return {};
  }
}

const newer = (a, b) => {
  const ta = Number(a?.at) || 0;
  const tb = Number(b?.at) || 0;
  if (ta !== tb) return ta > tb ? a : b;
  return JSON.stringify(a) >= JSON.stringify(b) ? a : b;
};

export function trimMemory(all) {
  const keys = Object.keys(all).filter(k => all[k] && all[k].result);
  keys.sort((x, y) => (Number(all[y].at) || 0) - (Number(all[x].at) || 0) || (x < y ? -1 : 1));
  const out = {};
  for (const k of keys.slice(0, MEMORY_MAX).sort()) out[k] = all[k];
  return out;
}

export function mergeScanMemoryBlobs(localRaw, remoteRaw) {
  const a = parse(localRaw);
  const b = parse(remoteRaw);
  const all = { ...a };
  for (const [k, v] of Object.entries(b)) all[k] = all[k] ? newer(all[k], v) : v;
  return JSON.stringify(trimMemory(all));
}
