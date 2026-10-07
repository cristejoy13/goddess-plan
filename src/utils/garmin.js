// Calories burned, as measured by her Garmin watch.
//
// The watch syncs to Garmin Connect, which shares them with Apple Health. An
// iPhone Shortcut reads the day's total (active + resting energy) from Health
// and sends it to /api/burn, which writes it here: one synced key, written
// only by that route, kept apart from the meal log so a measured number can
// never overwrite one she typed. The Meal page uses, in order: what she typed
// → the Garmin number → her average.
//
// Shape: { burns: { 'YYYY-MM-DD': { cal: number, at: ISO } } }

export const GARMIN_KEY = 'gp_garmin';

function parse(raw) {
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return v && typeof v === 'object' && v.burns && typeof v.burns === 'object' ? v : { burns: {} };
  } catch {
    return { burns: {} };
  }
}

export function loadGarmin() {
  try { return parse(localStorage.getItem(GARMIN_KEY)); } catch { return { burns: {} }; }
}

export function garminBurnOn(g, key) {
  const b = g?.burns?.[key];
  return typeof b?.cal === 'number' && b.cal > 0 ? b.cal : null;
}

// Add one day's number. Used by the server; newest reading of a day wins.
export function withGarminBurn(raw, key, cal, at = new Date().toISOString()) {
  const g = parse(raw);
  return JSON.stringify({ burns: { ...g.burns, [key]: { cal, at } } });
}

// Two gadgets' copies: every day from either side, newest reading wins, sorted
// so both gadgets compute the same bytes.
export function mergeGarminBlobs(localRaw, remoteRaw) {
  const a = parse(localRaw).burns;
  const b = parse(remoteRaw).burns;
  const out = {};
  for (const key of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) {
    const x = a[key], y = b[key];
    out[key] = !x ? y : !y ? x : (String(x.at) >= String(y.at) ? x : y);
  }
  return JSON.stringify({ burns: out });
}
