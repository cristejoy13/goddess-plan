import { useState, useRef } from 'react';
import { auth } from '../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login() {
  const [mode, setMode] = useState('main'); // 'main' | 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const confirmRef = useRef(null);
  const recaptchaRef = useRef(null);

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.');
      }
      setLoading(false);
    }
  }

  async function handleSendOTP(e) {
    e.preventDefault();
    setError('');
    if (!phone.trim()) { setError('Please enter your phone number.'); return; }
    setLoading(true);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      }
      confirmRef.current = await signInWithPhoneNumber(auth, phone.trim(), recaptchaRef.current);
      setMode('otp');
    } catch (e) {
      setError('Could not send code. Check the number format (+63XXXXXXXXXX) and try again.');
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault();
    setError('');
    if (!otp.trim()) { setError('Please enter the 6-digit code.'); return; }
    setLoading(true);
    try {
      await confirmRef.current.confirm(otp.trim());
    } catch {
      setError('Incorrect code. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-crown">👑</div>
        <h1 className="login-title">The Goddess Plan</h1>
        <p className="login-subtitle">Your wellness journey for 2026</p>

        {mode === 'main' && (
          <>
            <button className="login-google-btn" onClick={handleGoogle} disabled={loading}>
              <GoogleIcon />
              <span>{loading ? 'Signing in…' : 'Continue with Google'}</span>
            </button>

            <div className="login-divider"><span>or</span></div>

            <form onSubmit={handleSendOTP} className="login-phone-form">
              <input
                className="login-phone-input"
                type="tel"
                placeholder="+63 XXX XXX XXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={loading}
              />
              <button className="login-submit-btn" type="submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send Code →'}
              </button>
            </form>
            <p className="login-phone-hint">Include your country code, e.g. +63 for Philippines</p>
          </>
        )}

        {mode === 'otp' && (
          <>
            <p className="login-otp-prompt">
              We sent a 6-digit code to<br /><strong>{phone}</strong>
            </p>
            <form onSubmit={handleVerifyOTP} className="login-phone-form">
              <input
                className="login-phone-input login-otp-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
                autoFocus
              />
              <button className="login-submit-btn" type="submit" disabled={loading}>
                {loading ? 'Verifying…' : 'Verify Code →'}
              </button>
            </form>
            <button
              className="login-change-phone"
              onClick={() => { setMode('main'); setOtp(''); setError(''); recaptchaRef.current = null; }}
              disabled={loading}
            >
              ← Change phone number
            </button>
          </>
        )}

        {error && <p className="login-error">{error}</p>}

        <div id="recaptcha-container" />

        <p className="login-footer">
          By signing in you agree to use this app for personal wellness tracking only.
        </p>
      </div>
    </div>
  );
}
