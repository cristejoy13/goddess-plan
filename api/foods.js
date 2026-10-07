// GET /api/foods → { version, foods }
//
// The USDA food list (see scripts/build-food-list.mjs), handed to her own
// gadgets only — the same sync-code check as the scanner. The app downloads it
// once while online and keeps it, so calories can be worked out offline.
// About 170 KB on the wire; Vercel compresses it.

import foods from './_foods.js';

// Bump when api/_foods.js is rebuilt, so every gadget fetches the new copy.
export const FOODS_VERSION = 'sr-legacy-2018-04.v1';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' });
  const norm = v => String(v || '').trim().toUpperCase();
  const code = norm(req.headers['x-gp-code']);
  if (!process.env.SCAN_CODE || !code || code !== norm(process.env.SCAN_CODE)) {
    return res.status(403).json({ error: 'This gadget is not linked to your account.', code: 'code' });
  }
  if (req.query?.v === FOODS_VERSION) return res.status(200).json({ version: FOODS_VERSION, same: true });
  return res.status(200).json({ version: FOODS_VERSION, foods });
}
