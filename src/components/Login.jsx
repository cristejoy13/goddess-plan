import { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C17.657 14.123 17.64 9.205 17.64 9.205z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function toE164(raw) {
  const d = raw.replace(/[^\d+]/g, '');
  return d.startsWith('+') ? d : '+' + d;
}

function emailError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':     return 'No account found with this email.';
    case 'auth/wrong-password':         return 'Incorrect password. Try again.';
    case 'auth/email-already-in-use':   return 'An account with this email already exists. Try signing in.';
    case 'auth/weak-password':          return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':          return 'Please enter a valid email address.';
    case 'auth/too-many-requests':      return 'Too many attempts. Please wait a moment and try again.';
    default: return `Sign-in failed (${code}). Please try again.`;
  }
}

export default function Login() {
  const [tab, setTab] = useState('signin');   // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRedirectResult(auth).catch((e) => {
      console.error('[Firebase redirect]', e.code, e.message);
    });
  }, []);

  function switchTab(t) {
    setTab(t); setError(''); setInfo('');
    setEmail(''); setPassword(''); setConfirmPw(''); setUsername('');
  }

  async function handleGoogle() {
    setError(''); setInfo(''); setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      console.error('[Google]', e.code, e.message);
      if (e.code === 'auth/popup-blocked') {
        try { await signInWithRedirect(auth, new GoogleAuthProvider()); }
        catch (e2) { setError(`Sign-in failed (${e2.code}).`); setLoading(false); }
      } else if (e.code !== 'auth/popup-closed-by-user') {
        setError(e.code === 'auth/unauthorized-domain'
          ? 'This domain is not authorized. Please contact the app owner.'
          : `Sign-in failed (${e.code}).`);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }

  async function handleEmailSignIn(e) {
    e.preventDefault();
    setError(''); setInfo(''); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      console.error('[Email sign-in]', e.code);
      setError(emailError(e.code));
      setLoading(false);
    }
  }

  async function handleEmailSignUp(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (!username.trim()) { setError('Please choose a display name.'); return; }
    if (username.trim().length < 2) { setError('Display name must be at least 2 characters.'); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: username.trim() });
    } catch (e) {
      console.error('[Email sign-up]', e.code);
      setError(emailError(e.code));
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) { setError('Enter your email above first.'); return; }
    setError(''); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo('Password reset email sent! Check your inbox. 💕');
    } catch (e) {
      setError(emailError(e.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-crown">👑</div>
        <h1 className="login-title">The Goddess Plan</h1>
        <p className="login-subtitle">Your wellness journey for 2026</p>

        {/* Tab switcher */}
        <div className="login-tabs">
          <button className={`login-tab${tab === 'signin' ? ' active' : ''}`} onClick={() => switchTab('signin')}>
            Sign In
          </button>
          <button className={`login-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => switchTab('signup')}>
            Sign Up
          </button>
        </div>

        {/* Google */}
        <button className="login-google-btn" onClick={handleGoogle} disabled={loading}>
          <GoogleIcon />
          <span>{loading ? 'Signing in…' : tab === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
        </button>

        <div className="login-divider"><span>or</span></div>

        {/* Sign In form */}
        {tab === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="login-phone-form">
            <input className="login-phone-input" type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} disabled={loading} autoComplete="email" />
            <div className="login-pw-wrap">
              <input className="login-phone-input login-pw-input"
                type={showPw ? 'text' : 'password'} placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)}
                disabled={loading} autoComplete="current-password" />
              <button type="button" className="login-pw-toggle" onClick={() => setShowPw(v => !v)}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            <button className="login-submit-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
            <button type="button" className="login-change-phone" onClick={handleForgotPassword}>
              Forgot password?
            </button>
          </form>
        )}

        {/* Sign Up form */}
        {tab === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="login-phone-form">
            <input className="login-phone-input" type="text" placeholder="Choose a display name"
              value={username} onChange={e => setUsername(e.target.value)}
              disabled={loading} autoComplete="nickname" maxLength={32} />
            <input className="login-phone-input" type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} disabled={loading} autoComplete="email" />
            <div className="login-pw-wrap">
              <input className="login-phone-input login-pw-input"
                type={showPw ? 'text' : 'password'} placeholder="Choose a password (min 6 characters)"
                value={password} onChange={e => setPassword(e.target.value)}
                disabled={loading} autoComplete="new-password" />
              <button type="button" className="login-pw-toggle" onClick={() => setShowPw(v => !v)}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            <input className="login-phone-input"
              type={showPw ? 'text' : 'password'} placeholder="Confirm your password"
              value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
              disabled={loading} autoComplete="new-password" />
            <button className="login-submit-btn" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>
        )}

        {error && <p className="login-error">{error}</p>}
        {info  && <p className="login-info">{info}</p>}

        <p className="login-footer">
          By signing in you agree to use this app for personal wellness tracking only.
        </p>
      </div>
    </div>
  );
}
