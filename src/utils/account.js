// Sign in with Google, so removing the app never loses anything.
//
// The data itself does not move. It still lives in one cloud document per
// sync code, exactly as before. Signing in only REMEMBERS which code belongs
// to this person: on a fresh install, signing in finds that code again and
// the app pulls everything back down.
//
// Where the "this account uses code X" note lives: a document in the same
// sync collection, named from a one-way hash of the account's Firebase user
// id. The user id is random and only handed out after a real Google sign-in,
// so the name cannot be guessed — the same protection the sync codes
// themselves have — and no new database rules are needed. The note holds the
// code and nothing else (no email, no name).
//
// First sign-in on a gadget, with no note yet:
//   • the gadget already holds her data  → link its code
//   • the gadget is empty (a reinstall)  → ask: type the old code, or start
//     fresh. Linking an empty gadget automatically is what would tie the
//     account to nothing and hide her real data.

import { whenFirebaseReady, getSyncCode, adoptSyncCode } from './sync.js';

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_RE = /^GP-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/;
const LATER_KEY = 'gp_signin_later';

let auth = null;
let authMod = null;
let started = false;
let state = { status: 'loading', email: '', error: '' };
const listeners = new Set();

function set(patch) {
  state = { ...state, ...patch };
  listeners.forEach(fn => fn(state));
}

export function onAccount(fn) {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}

export function getAccount() {
  return state;
}

// "Not now" on the sign-in screen is remembered on this gadget only, so the
// screen does not come back every time the app opens.
export function signInLater() {
  try { localStorage.setItem(LATER_KEY, '1'); } catch { /* shown again next time */ }
  set({});
}
export function saidLater() {
  try { return localStorage.getItem(LATER_KEY) === '1'; } catch { return false; }
}

// The note's name: "GP-U" + 12 letters from a SHA-256 of the user id, in the
// sync-code alphabet so it fits the existing database rules.
async function noteId(uid) {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`goddess-plan-account:${uid}`)));
  let out = 'GP-U';
  for (let i = 0; i < 12; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return out;
}

// Does this gadget hold anything she made? Any meal, weigh-in, workout,
// goal, note or lift counts.
export function gadgetHasData() {
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  const log = read('gp_meal_log');
  const nb = read('gp_daily_notebook');
  const counts = [
    log && Object.values(log.days || {}).some(d => Array.isArray(d) && d.length),
    log && Object.keys(log.weights || {}).length,
    read('gp_workouts') && Object.keys(read('gp_workouts').days || {}).length,
    read('gp_goals') && (read('gp_goals').items || []).length,
    nb && ['pages', 'checklists'].some(k => Array.isArray(nb[k]) && nb[k].length),
    read('gp_lifts') && Object.keys(read('gp_lifts')).length,
    // Someone who has just answered the sign-up questions has a plan to keep.
    read('gp_profile')?.onboarded,
  ];
  return counts.some(Boolean);
}

function friendly(err) {
  const code = err && err.code ? String(err.code) : '';
  if (code.includes('network')) return 'No internet. Try again when you are online.';
  if (code.includes('popup-closed') || code.includes('cancelled') || code.includes('user-cancelled')) return '';
  if (code.includes('unauthorized-domain') || code.includes('operation-not-allowed')) return 'Google sign-in is not switched on yet.';
  return 'Could not sign in. Try again.';
}

async function readNote(uid) {
  const { fb, db } = await whenFirebaseReady();
  const snap = await fb.getDoc(fb.doc(db, 'sync', await noteId(uid)));
  const code = snap.exists() ? snap.data()?.account?.syncCode : null;
  return CODE_RE.test(code || '') ? code : null;
}

async function writeNote(uid, code) {
  const { fb, db } = await whenFirebaseReady();
  await fb.setDoc(fb.doc(db, 'sync', await noteId(uid)), { account: { syncCode: code, linkedAt: Date.now() } }, { merge: true });
}

// Make the app use a code and reload so the saved data comes down. Adopting
// takes the cloud's copy of everything, which is what a returning person wants.
function switchTo(code) {
  if (code === getSyncCode()) return false;
  adoptSyncCode(code);
  window.location.reload();
  return true;
}

async function linkSignedIn(user) {
  set({ status: 'linking', email: user.email || '', error: '' });
  try {
    const saved = await readNote(user.uid);
    if (saved) {
      if (switchTo(saved)) return;
      set({ status: 'signed-in' });
      return;
    }
    if (gadgetHasData()) {
      await writeNote(user.uid, getSyncCode());
      set({ status: 'signed-in' });
      return;
    }
    set({ status: 'choose' });
  } catch {
    set({ status: 'signed-in', error: 'Signed in, but could not reach your saved data. It will try again next time.' });
  }
}

async function recheck() {
  const user = auth?.currentUser;
  if (!user || state.status === 'linking') return;
  try {
    const saved = await readNote(user.uid);
    if (saved) switchTo(saved);
    else if (state.status === 'signed-in' && !gadgetHasData()) set({ status: 'choose' });
  } catch {
    // Offline: the next time the app comes to the front tries again.
  }
}

export async function initAccount() {
  if (started) return;
  started = true;
  try {
    const { fb, app } = await whenFirebaseReady();
    authMod = await import('firebase/auth');
    // Local testing only: a pretend Google sign-in, never on the live site. Its
    // passes are not real, so the real database would refuse every request
    // made with one; in that mode sign-in gets its own Firebase app and the
    // database carries on unsigned, exactly as it does for anyone today.
    const practice = Boolean(import.meta.env?.DEV && new URLSearchParams(location.search).has('authEmulator'));
    const authApp = practice ? fb.initializeApp(app.options, 'practice-sign-in') : app;
    auth = authMod.initializeAuth(authApp, {
      persistence: [authMod.indexedDBLocalPersistence, authMod.browserLocalPersistence],
      popupRedirectResolver: authMod.browserPopupRedirectResolver,
    });
    if (practice) authMod.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    try {
      await authMod.getRedirectResult(auth);
    } catch (err) {
      set({ error: friendly(err) });
    }
    authMod.onAuthStateChanged(auth, user => {
      if (!user) { set({ status: 'signed-out', email: '' }); return; }
      linkSignedIn(user);
    });
    // A gadget left open in the background never restarts, so it would miss
    // a link made on another gadget meanwhile (her iPad did, 2026-09-30).
    // Every time the app comes back to the front, check the account's code
    // again and move to it if it changed.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') recheck();
    });
  } catch {
    set({ status: 'unavailable' });
  }
}

export async function signInWithGoogle() {
  if (!auth) return;
  set({ error: '' });
  const provider = new authMod.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    // A full-page trip to Google and back. Pop-up windows do not come back
    // to a home-screen app on iPhone, so the page itself goes.
    await authMod.signInWithRedirect(auth, provider);
  } catch (err) {
    set({ error: friendly(err) });
  }
}

// After a first sign-in on an empty gadget: bring back the data under an old
// code she types. Checks that code really has saved data first.
export async function bringBack(input) {
  const code = String(input || '').trim().toUpperCase();
  if (!CODE_RE.test(code)) return 'That code does not look right. It starts with GP- and has 12 letters and numbers after it.';
  const user = auth?.currentUser;
  if (!user) return 'Sign in first.';
  try {
    const { fb, db } = await whenFirebaseReady();
    const snap = await fb.getDoc(fb.doc(db, 'sync', code));
    const keys = Object.keys(snap.exists() ? snap.data()?.data || {} : {});
    if (!keys.length) return 'Nothing is saved under that code. Check it on another gadget under the flower.';
    await writeNote(user.uid, code);
    if (!switchTo(code)) set({ status: 'signed-in' });
    return '';
  } catch {
    return 'No internet. Try again when you are online.';
  }
}

export async function startFresh() {
  const user = auth?.currentUser;
  if (!user) return;
  try {
    await writeNote(user.uid, getSyncCode());
    set({ status: 'signed-in' });
  } catch {
    set({ error: 'No internet. Try again when you are online.' });
  }
}

// When she connects a different code by hand under the flower while signed
// in, the account follows it, so the next reinstall brings back that one.
export async function relinkIfSignedIn(code) {
  const user = auth?.currentUser;
  if (!user || !CODE_RE.test(code || '')) return;
  try { await writeNote(user.uid, code); } catch { /* next sign-in fixes it */ }
}

export async function signOutAccount() {
  if (!auth) return;
  await authMod.signOut(auth);
}
