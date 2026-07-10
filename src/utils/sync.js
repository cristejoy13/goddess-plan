import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAsWJPYWcwJ5XtnJPOV_PRmL7dyt5eJems',
  authDomain: 'goddess-plan.firebaseapp.com',
  projectId: 'goddess-plan',
  storageBucket: 'goddess-plan.firebasestorage.app',
  messagingSenderId: '225308869833',
  appId: '1:225308869833:web:b5cc454324237a0ec87918',
};

const SYNC_KEYS = ['gp_profile', 'gp_today_checks', 'gp_daily_notebook', 'gp_daily', 'gp_done', 'gp_year', 'gp_color_mode'];
const SYNC_CODE_KEY = 'gp_sync_code';
const SYNC_META_KEY = 'gp_sync_meta';
const SYNC_ADOPT_KEY = 'gp_sync_adopt';
const DEVICE_ID_KEY = 'gp_device_id';
const DEVICE_NAME_KEY = 'gp_device_name';
const PRESENCE_INTERVAL_MS = 5 * 60 * 1000;
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_RE = /^GP-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/;

let initialized = false;
let applyingRemote = false;
let syncActive = false;
let statusCallbacks = new Set();
let deviceCallbacks = new Set();
let latestDevices = {};
let presenceTimer = null;
let pushTimer = null;
let dirtyKeys = new Set();
let dbRef = null;
let originalSetItem = null;
let originalRemoveItem = null;

function isValidSyncCode(code) {
  return CODE_RE.test(String(code || '').trim().toUpperCase());
}

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    const setter = originalSetItem || localStorage.setItem;
    setter.call(localStorage, key, value);
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

function safeRemoveItem(key) {
  try {
    const remover = originalRemoveItem || localStorage.removeItem;
    remover.call(localStorage, key);
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

function readMeta() {
  try {
    return JSON.parse(safeGetItem(SYNC_META_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function writeMeta(meta) {
  safeSetItem(SYNC_META_KEY, JSON.stringify(meta));
}

function generateSyncCode() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let code = 'GP-';
  for (const byte of bytes) {
    code += CODE_ALPHABET[byte % CODE_ALPHABET.length];
  }
  return code;
}

function notifySyncStatus() {
  statusCallbacks.forEach(cb => {
    try {
      cb(syncActive);
    } catch {
      // Status listeners should not break sync delivery.
    }
  });
}

function markSyncActive() {
  if (!syncActive) {
    syncActive = true;
    notifySyncStatus();
  }
}

function schedulePush() {
  if (!dbRef) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    pushDirtyKeys();
  }, 600);
}

// Push any pending changes immediately, without waiting for the debounce.
// Called when the app is hidden/closed so a note written right before the
// user backgrounds the app is not lost with the pending timer.
function flushNow() {
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  pushDirtyKeys();
}

async function pushDirtyKeys() {
  if (!dbRef || dirtyKeys.size === 0) return;
  const keys = [...dirtyKeys];
  dirtyKeys.clear();
  const meta = readMeta();
  const dataPatch = {};
  const metaPatch = {};

  keys.forEach(key => {
    dataPatch[key] = safeGetItem(key);
    metaPatch[key] = meta[key] || Date.now();
  });

  try {
    await setDoc(dbRef, { data: dataPatch, meta: metaPatch }, { merge: true });
  } catch {
    keys.forEach(key => dirtyKeys.add(key));
    schedulePush();
  }
}

async function pushAllLocalKeys() {
  if (!dbRef) return;
  const meta = readMeta();
  const data = {};
  const metaPatch = {};
  let changed = false;
  const now = Date.now();

  SYNC_KEYS.forEach(key => {
    const value = safeGetItem(key);
    if (value !== null) {
      data[key] = value;
      metaPatch[key] = meta[key] || now;
      meta[key] = metaPatch[key];
      changed = true;
    }
  });

  if (!changed) return;
  writeMeta(meta);

  try {
    await setDoc(dbRef, { data, meta: metaPatch }, { merge: true });
  } catch {
    // Firestore queues offline writes; failures should not break the app.
  }
}

function applyRemoteValue(key, value, timestamp) {
  applyingRemote = true;
  try {
    if (value === null) {
      safeRemoveItem(key);
    } else if (typeof value === 'string') {
      safeSetItem(key, value);
    }
    const meta = readMeta();
    meta[key] = timestamp;
    writeMeta(meta);
  } finally {
    applyingRemote = false;
  }
}

// Two-way, per-key reconcile between this device and the cloud doc. Runs on
// EVERY snapshot, so sync self-heals: if the cloud is missing a key this
// device has (e.g. the doc was created by a presence write before any data
// upload, or the app was killed before a push finished, or edits were made
// offline), the local value is queued for upload; if the cloud has a newer
// value, it is applied locally. Strict > comparisons both ways mean a stable,
// fully-synced state produces no writes — no loops.
function reconcileWithRemote(remoteData, remoteMeta, adopting) {
  const localMeta = readMeta();
  let applied = false;
  let needPush = false;
  let metaChanged = false;

  SYNC_KEYS.forEach(key => {
    const remoteHas = Object.prototype.hasOwnProperty.call(remoteData, key);
    const remoteTime = remoteMeta[key] || 0;
    const localTime = localMeta[key] || 0;
    const localValue = safeGetItem(key);

    if (adopting && remoteHas) {
      // Adoption: take the cloud's value for every key it has, regardless of
      // local timestamps — the user asked this device to match the group.
      applyRemoteValue(key, remoteData[key], remoteTime || Date.now());
      applied = true;
      return;
    }

    if (remoteHas && remoteTime > localTime) {
      applyRemoteValue(key, remoteData[key], remoteTime);
      applied = true;
    } else if (localTime > remoteTime || (!remoteHas && localValue !== null)) {
      // This device is ahead of the cloud (newer edit — including a deletion,
      // where the local value is null and pushes as null to delete remotely),
      // or the cloud is missing a key this device has. Send it up.
      if (!localMeta[key]) {
        localMeta[key] = Date.now();
        metaChanged = true;
      }
      dirtyKeys.add(key);
      needPush = true;
    }
  });

  if (metaChanged) writeMeta(localMeta);
  if (needPush) schedulePush();
  return applied;
}

function handleRemoteSnapshot(snapshot) {
  try {
    markSyncActive();

    if (!snapshot.exists()) {
      pushAllLocalKeys();
      return;
    }

    const remote = snapshot.data() || {};
    latestDevices = remote.devices || {};
    notifyDevices();
    const adopting = safeGetItem(SYNC_ADOPT_KEY) === '1';
    const applied = reconcileWithRemote(remote.data || {}, remote.meta || {}, adopting);
    if (adopting) safeRemoveItem(SYNC_ADOPT_KEY);

    if (applied) {
      window.dispatchEvent(new CustomEvent('gp-remote-sync'));
    }
  } catch {
    // Malformed remote data should not break the app.
  }
}

function patchLocalStorage() {
  if (originalSetItem || originalRemoveItem) return;
  originalSetItem = localStorage.setItem;
  originalRemoveItem = localStorage.removeItem;

  localStorage.setItem = function setItem(key, value) {
    originalSetItem.call(this, key, value);
    if (!applyingRemote && SYNC_KEYS.includes(key)) {
      const meta = readMeta();
      meta[key] = Date.now();
      writeMeta(meta);
      dirtyKeys.add(key);
      schedulePush();
    }
  };

  localStorage.removeItem = function removeItem(key) {
    originalRemoveItem.call(this, key);
    if (!applyingRemote && SYNC_KEYS.includes(key)) {
      const meta = readMeta();
      meta[key] = Date.now();
      writeMeta(meta);
      dirtyKeys.add(key);
      schedulePush();
    }
  };
}

function adoptFromUrl() {
  try {
    const params = new URLSearchParams(location.search);
    const code = params.get('sync');
    if (!isValidSyncCode(code)) return;
    const normalized = code.trim().toUpperCase();
    if (normalized !== safeGetItem(SYNC_CODE_KEY)) {
      safeSetItem(SYNC_CODE_KEY, normalized);
      safeSetItem(SYNC_ADOPT_KEY, '1');
    }
    params.delete('sync');
    const query = params.toString();
    const nextUrl = `${location.pathname}${query ? `?${query}` : ''}${location.hash}`;
    history.replaceState(null, '', nextUrl);
  } catch {
    // URL adoption is optional; startup continues without it.
  }
}

function getDeviceId() {
  let id = safeGetItem(DEVICE_ID_KEY);
  if (!id) {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    id = 'd-' + [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
    safeSetItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// A friendly label for this device, guessed once from the user agent so the
// gadget list reads "iPad", "iPhone", "Mac" instead of a random id.
function guessDeviceName() {
  const stored = safeGetItem(DEVICE_NAME_KEY);
  if (stored) return stored;
  let name = 'Device';
  try {
    const ua = navigator.userAgent || '';
    const touch = navigator.maxTouchPoints || 0;
    if (/iPad/.test(ua) || (/Macintosh/.test(ua) && touch > 1)) name = 'iPad';
    else if (/iPhone/.test(ua)) name = 'iPhone';
    else if (/Android/.test(ua)) name = /Mobile/.test(ua) ? 'Android phone' : 'Android tablet';
    else if (/Macintosh|Mac OS X/.test(ua)) name = 'Mac';
    else if (/Windows/.test(ua)) name = 'Windows PC';
    else if (/CrOS/.test(ua)) name = 'Chromebook';
    else if (/Linux/.test(ua)) name = 'Linux';
  } catch {
    // Fall back to the generic name.
  }
  safeSetItem(DEVICE_NAME_KEY, name);
  return name;
}

export function getThisDeviceId() {
  return getDeviceId();
}

export function onDevices(cb) {
  deviceCallbacks.add(cb);
  try {
    cb(latestDevices);
  } catch {
    // Device listeners should not break registration.
  }
  return () => {
    deviceCallbacks.delete(cb);
  };
}

function notifyDevices() {
  deviceCallbacks.forEach(cb => {
    try {
      cb(latestDevices);
    } catch {
      // Device listeners should not break sync delivery.
    }
  });
}

// Record this device in the shared doc so every gadget can see who is linked
// and when they were last online. Kept in its own `devices` field so it never
// interferes with the synced data/meta.
async function writePresence() {
  if (!dbRef) return;
  const id = getDeviceId();
  try {
    await setDoc(dbRef, {
      devices: { [id]: { name: guessDeviceName(), lastSeen: Date.now() } },
    }, { merge: true });
  } catch {
    // Presence is best-effort and never blocks the app.
  }
}

function startPresence() {
  writePresence();
  try {
    if (presenceTimer) clearInterval(presenceTimer);
    presenceTimer = setInterval(() => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        writePresence();
      }
    }, PRESENCE_INTERVAL_MS);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') writePresence();
    });
  } catch {
    // Heartbeat wiring is optional.
  }
}

export function getSyncCode() {
  let code = safeGetItem(SYNC_CODE_KEY);
  if (!isValidSyncCode(code)) {
    code = generateSyncCode();
    safeSetItem(SYNC_CODE_KEY, code);
  }
  return code;
}

export function adoptSyncCode(code) {
  if (!isValidSyncCode(code)) return false;
  safeSetItem(SYNC_CODE_KEY, code.trim().toUpperCase());
  safeSetItem(SYNC_ADOPT_KEY, '1');
  return true;
}

export function isSyncActive() {
  return syncActive;
}

export function onSyncStatus(cb) {
  statusCallbacks.add(cb);
  try {
    cb(syncActive);
  } catch {
    // Status listeners should not break registration.
  }
  return () => {
    statusCallbacks.delete(cb);
  };
}

// Force this device's data up to the cloud right now, stamping every key with
// the current time so it wins last-write-wins on all other linked devices.
// This is the "make everyone match this device" button.
export async function forceSyncFromThisDevice() {
  if (!dbRef) return false;
  const now = Date.now();
  const meta = readMeta();
  const data = {};
  const metaPatch = {};

  SYNC_KEYS.forEach(key => {
    const value = safeGetItem(key);
    if (value !== null) {
      data[key] = value;
      meta[key] = now;
      metaPatch[key] = now;
    }
  });

  writeMeta(meta);

  try {
    await setDoc(dbRef, { data, meta: metaPatch }, { merge: true });
    return true;
  } catch {
    return false;
  }
}

function registerFlushHandlers() {
  try {
    // When the app is backgrounded or closed (very common on phones/tablets
    // right after writing a note), send pending changes before the OS suspends
    // or kills the page.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushNow();
    });
    window.addEventListener('pagehide', flushNow);
    // Back online (wifi returned): send anything still waiting right away.
    window.addEventListener('online', flushNow);
  } catch {
    // Event wiring is best-effort; sync still works while the app is open.
  }
}

export function initSync() {
  if (initialized) return;
  initialized = true;

  try {
    adoptFromUrl();
    const code = getSyncCode();
    patchLocalStorage();
    const app = initializeApp(firebaseConfig);
    // Persistent cache keeps queued writes in IndexedDB, so a note written just
    // before the app is closed (or while offline) is delivered automatically on
    // the next launch / when wifi returns. Fall back to the in-memory Firestore
    // when IndexedDB is unavailable (private mode, restricted webviews).
    let db;
    try {
      if (typeof indexedDB !== 'undefined') {
        db = initializeFirestore(app, {
          localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
        });
      } else {
        db = getFirestore(app);
      }
    } catch {
      db = getFirestore(app);
    }
    dbRef = doc(db, 'sync', code);
    registerFlushHandlers();
    // Subscribe BEFORE the first presence write: presence creates the doc, and
    // the data bootstrap must never be skipped because presence got there first.
    // (reconcileWithRemote also covers this, as a second line of defense.)
    onSnapshot(dbRef, handleRemoteSnapshot, () => {
      // Firestore snapshot errors are non-fatal for the local app.
    });
    startPresence();
  } catch {
    // Sync failures must never break the app.
  }
}
