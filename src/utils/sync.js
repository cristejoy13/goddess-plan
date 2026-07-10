import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

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
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_RE = /^GP-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/;

let initialized = false;
let applyingRemote = false;
let syncActive = false;
let statusCallbacks = new Set();
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

function handleRemoteSnapshot(snapshot) {
  try {
    markSyncActive();

    if (!snapshot.exists()) {
      pushAllLocalKeys();
      return;
    }

    const remote = snapshot.data() || {};
    const remoteData = remote.data || {};
    const remoteMeta = remote.meta || {};
    const adopting = safeGetItem(SYNC_ADOPT_KEY) === '1';
    let applied = false;

    if (adopting) {
      Object.keys(remoteData).forEach(key => {
        if (!SYNC_KEYS.includes(key)) return;
        applyRemoteValue(key, remoteData[key], remoteMeta[key] || Date.now());
        applied = true;
      });
      safeRemoveItem(SYNC_ADOPT_KEY);
    } else {
      const localMeta = readMeta();
      Object.keys(remoteData).forEach(key => {
        if (!SYNC_KEYS.includes(key)) return;
        const remoteTime = remoteMeta[key] || 0;
        const localTime = localMeta[key] || 0;
        if (remoteTime > localTime) {
          applyRemoteValue(key, remoteData[key], remoteTime);
          applied = true;
        }
      });
    }

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

export function initSync() {
  if (initialized) return;
  initialized = true;

  try {
    adoptFromUrl();
    const code = getSyncCode();
    patchLocalStorage();
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    dbRef = doc(db, 'sync', code);
    onSnapshot(dbRef, handleRemoteSnapshot, () => {
      // Firestore snapshot errors are non-fatal for the local app.
    });
  } catch {
    // Sync failures must never break the app.
  }
}
