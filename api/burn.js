// POST /api/burn  { cal: number, day?: 'yesterday' | 'today', date?: 'YYYY-MM-DD' }
//   → { ok: true, date, cal }
//
// Called by her iPhone Shortcut with the day's calories burned from Apple
// Health (which her Garmin fills). Writes the number into her synced data
// under gp_garmin — never into the meal log itself, so a measured number can
// never overwrite one she typed (see src/utils/garmin.js). Every gadget picks
// it up through the normal sync.
//
// Only her own Shortcut may call it: it sends her sync code, which must match
// SCAN_CODE. The sync document is written through Firestore's REST API with
// the app's public web key — the same access the app itself has, nothing more.

import { withGarminBurn } from '../src/utils/garmin.js';

const PROJECT = 'goddess-plan';
const WEB_KEY = process.env.FIREBASE_WEB_KEY || 'AIzaSyAsWJPYWcwJ5XtnJPOV_PRmL7dyt5eJems';
const TIME_ZONE = 'Asia/Manila';

// The date in Cebu, so a number sent just after midnight files under the day
// it belongs to.
export function dayKey(offsetDays = 0, now = new Date(), timeZone = TIME_ZONE) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date(now.getTime() + offsetDays * 86400000)).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function docUrl(code, query) {
  return `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/sync/${encodeURIComponent(code)}?key=${WEB_KEY}${query}`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  const norm = v => String(v || '').trim().toUpperCase();
  const code = norm(process.env.SCAN_CODE);
  if (!code || norm(req.headers['x-gp-code']) !== code) {
    return res.status(403).json({ error: 'Wrong code. Use the sync code from the app’s Settings.' });
  }

  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  // Shortcuts may send the number as text: "1,876.4", "1876.4 kcal".
  const cal = Math.round(Number((String(body.cal ?? '').replace(/,/g, '').match(/\d+(\.\d+)?/) || [])[0]));
  if (!Number.isFinite(cal) || cal < 1 || cal > 10000) {
    return res.status(400).json({ error: 'Send cal as a number between 1 and 10,000.' });
  }
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(body.date || ''))
    ? body.date
    : dayKey(body.day === 'today' ? 0 : -1);

  // Read only the Garmin field, add this day, write only that field back.
  const got = await fetch(docUrl(code, '&mask.fieldPaths=data.gp_garmin'));
  if (got.status === 404) return res.status(404).json({ error: 'No synced data for this code yet. Open the app once first.' });
  if (!got.ok) return res.status(502).json({ error: 'Could not reach your saved data. Try again.' });
  const doc = await got.json();
  const current = doc.fields?.data?.mapValue?.fields?.gp_garmin?.stringValue || '';
  const next = withGarminBurn(current, date, cal);

  const put = await fetch(
    docUrl(code, '&updateMask.fieldPaths=data.gp_garmin&updateMask.fieldPaths=meta.gp_garmin&currentDocument.exists=true'),
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          data: { mapValue: { fields: { gp_garmin: { stringValue: next } } } },
          meta: { mapValue: { fields: { gp_garmin: { integerValue: String(Date.now()) } } } },
        },
      }),
    },
  );
  if (!put.ok) return res.status(502).json({ error: 'Could not save it. Try again.' });
  return res.status(200).json({ ok: true, date, cal });
}
