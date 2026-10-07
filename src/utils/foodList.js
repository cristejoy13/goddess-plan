// The USDA food list, kept on this gadget so calories can be worked out with
// no internet. It is downloaded once from /api/foods (her gadgets only) while
// online and stored in the browser's own database — not in localStorage,
// which her notebook and photos need, and not synced, since every gadget can
// fetch its own copy. About 800 KB stored.

import { estimateMeal } from './foodMatch';

const DB = 'gp-foods';
const STORE = 'list';
const CHECKED_KEY = 'gp_foods_checked';
const RECHECK_MS = 30 * 24 * 60 * 60 * 1000;

let memory = null;      // { version, foods } once loaded
let loading = null;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function readStored() {
  const db = await openDb();
  return new Promise((resolve) => {
    const r = db.transaction(STORE).objectStore(STORE).get('current');
    r.onsuccess = () => resolve(r.result || null);
    r.onerror = () => resolve(null);
  });
}

async function writeStored(value) {
  const db = await openDb();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, 'current');
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

export async function loadFoodList() {
  if (memory) return memory;
  if (!loading) {
    loading = readStored().catch(() => null).then(v => { memory = v?.foods ? v : null; return memory; });
  }
  return loading;
}

/**
 * Called when the app opens. Downloads the list if this gadget has none, and
 * once a month asks whether it changed. Quiet: it never shows an error, and
 * it does nothing offline or on a gadget that is not linked yet.
 */
export async function ensureFoodList() {
  try {
    if (navigator.onLine === false) return;
    const code = localStorage.getItem('gp_sync_code');
    if (!code) return;
    const have = await loadFoodList();
    const last = Number(localStorage.getItem(CHECKED_KEY) || 0);
    if (have && Date.now() - last < RECHECK_MS) return;
    const r = await fetch(`/api/foods${have ? `?v=${encodeURIComponent(have.version)}` : ''}`, { headers: { 'X-GP-Code': code } });
    if (!r.ok) return;
    const j = await r.json();
    localStorage.setItem(CHECKED_KEY, String(Date.now()));
    if (j.same || !Array.isArray(j.foods)) return;
    const value = { version: j.version, foods: j.foods };
    if (await writeStored(value)) memory = value;
  } catch {
    // The online scanner still works; the list arrives next time.
  }
}

// Her words → calories, from the stored list. null when the list is not here.
export async function estimateOffline(text) {
  const list = await loadFoodList();
  if (!list) return null;
  return estimateMeal(list.foods, text);
}
