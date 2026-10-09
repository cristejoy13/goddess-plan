import { useEffect, useState } from 'react';
import { ask } from '../utils/ask';
import {
  onAccount, signInWithGoogle, signInLater, saidLater,
  bringBack, startFresh, signOutAccount,
} from '../utils/account';

// ─── SIGN IN ───────────────────────────────────────────────────────────────
// One screen, one button. It shows on a gadget that is not signed in, until
// she signs in or says "Not now". After a reinstall it is the first thing she
// sees, and signing in brings everything back.

function useAccount() {
  const [acc, setAcc] = useState({ status: 'loading', email: '', error: '' });
  useEffect(() => onAccount(setAcc), []);
  return acc;
}

export function GoogleMark() {
  return (
    <svg className="si-g" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.5 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17z" />
      <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function GoogleButton({ label = 'Continue with Google' }) {
  const [going, setGoing] = useState(false);
  return (
    <button
      type="button"
      className="si-google"
      disabled={going}
      onClick={() => { setGoing(true); signInWithGoogle().finally(() => setGoing(false)); }}
    >
      <GoogleMark />
      <span>{going ? 'Opening Google…' : label}</span>
    </button>
  );
}

function ChooseScreen() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(await bringBack(code));
    setBusy(false);
  }
  return (
    <div className="si-card">
      <img className="si-logo" src="/icon-192.png" alt="" />
      <h2 className="si-title">Welcome <em>back</em></h2>
      <p className="si-text">Had the app before? Type your old code to bring everything back.</p>
      <form className="si-form" onSubmit={submit}>
        <input
          id="si-code"
          className="ob-input si-input"
          value={code}
          onChange={e => { setCode(e.target.value); setError(''); }}
          placeholder="GP-XXXXXXXXXXXX"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Your old code"
        />
        <button type="submit" className="ob-btn-primary si-primary" disabled={busy || !code.trim()}>
          {busy ? 'Bringing it back…' : 'Bring it back'}
        </button>
      </form>
      {error && <p className="si-error">{error}</p>}
      <p className="si-hint">Your code is under the 🌸 flower on any other gadget with the app.</p>
      <button type="button" className="si-later" onClick={() => startFresh()}>I’m new — start fresh</button>
    </div>
  );
}

// The full-screen gate. Only for "not signed in" (and not "Not now") and for
// the first-sign-in choice; everything else lets the app through.
export function SignInGate() {
  const acc = useAccount();
  const [, bump] = useState(0);
  if (acc.status === 'choose') {
    return <div className="si-overlay" role="dialog" aria-modal="true" aria-label="Bring your data back"><ChooseScreen /></div>;
  }
  if (acc.status === 'linking') {
    return (
      <div className="si-overlay" role="status">
        <div className="si-card"><img className="si-logo" src="/icon-192.png" alt="" /><p className="si-text">Loading your plan…</p></div>
      </div>
    );
  }
  if (acc.status !== 'signed-out' || saidLater()) return null;
  return (
    <div className="si-overlay" role="dialog" aria-modal="true" aria-label="Sign in">
      <div className="si-card">
        <img className="si-logo" src="/icon-192.png" alt="" />
        <h2 className="si-title">Keep your plan <em>safe</em></h2>
        <p className="si-text">Sign in once. If you ever remove the app, sign in again and everything comes back.</p>
        <GoogleButton />
        {acc.error && <p className="si-error">{acc.error}</p>}
        <button type="button" className="si-later" onClick={() => { signInLater(); bump(n => n + 1); }}>Not now</button>
      </div>
    </div>
  );
}

// Under the flower: who is signed in, or a way to sign in.
export function AccountCard() {
  const acc = useAccount();
  if (acc.status === 'loading' || acc.status === 'unavailable') return null;
  const signedIn = acc.status === 'signed-in' || acc.status === 'linking';
  return (
    <div className="g-card splash-item settings-card si-account">
      <div className="settings-section-title">Account</div>
      {signedIn ? (
        <>
          <div className="si-who"><GoogleMark /><span>Signed in as <b>{acc.email || 'your Google account'}</b></span></div>
          <p className="sync-note">Your things are saved to this account. Remove the app any time — sign in again and it all comes back.</p>
          {acc.error && <p className="si-error">{acc.error}</p>}
          <button
            type="button"
            className="si-signout"
            onClick={async () => {
              if (await ask('Sign out of Google on this gadget? Your things stay on this gadget and stay saved online.', { yes: 'Sign out' })) signOutAccount();
            }}
          >Sign out</button>
        </>
      ) : (
        <>
          <p className="sync-note">Sign in so nothing is lost if you remove the app.</p>
          <GoogleButton label="Sign in with Google" />
          {acc.error && <p className="si-error">{acc.error}</p>}
        </>
      )}
    </div>
  );
}
