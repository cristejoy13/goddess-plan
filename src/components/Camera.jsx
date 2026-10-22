import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// The app's own camera (2026-10-22), like a normal phone camera: ⚡ flash,
// ⏱ timer (off, 3 s, 10 s), flip between back and front, and 🖼 to pick a
// photo she already took instead.
//
// Flash: a phone's flash can only be switched on by a website where the
// browser allows it. Where it does, the light comes on for the picture. On the
// front camera the screen itself lights up white, like a selfie flash. Where
// neither is possible the button reads "No flash" rather than pretending.
//
// If the camera cannot open at all (no permission, no camera), it hands over
// to the phone's own picker — the way the photo buttons always worked.
//
// onPhoto receives a File, the same as a file picker gives.

const TIMERS = [0, 3, 10];

export default function Camera({ open, onClose, onPhoto, title = 'Camera' }) {
  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const streamRef = useRef(null);
  const [facing, setFacing] = useState('environment');
  const [flash, setFlash] = useState(false);
  const [timer, setTimer] = useState(0);
  const [count, setCount] = useState(0);
  const [canTorch, setCanTorch] = useState(false);
  const [canFlash, setCanFlash] = useState(false);   // a real photo flash (some Android phones)
  const [whiteout, setWhiteout] = useState(false);
  const [failed, setFailed] = useState('');
  const [ready, setReady] = useState(false);
  // Each press of the shutter is one run; stopping the timer or closing
  // starts a new number, so a countdown already going quietly gives up.
  const run = useRef(0);

  const stop = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (!open) return undefined;
    let gone = false;
    setReady(false); setFailed(''); setCanTorch(false); setCanFlash(false);
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('none');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1440 } },
          audio: false,
        });
        if (gone) { stream.getTracks().forEach(t => t.stop()); return; }
        stop();
        streamRef.current = stream;
        const v = videoRef.current;
        if (v) { v.srcObject = stream; await v.play().catch(() => {}); }
        const track = stream.getVideoTracks()[0];
        const caps = track?.getCapabilities?.() || {};
        setCanTorch(!!caps.torch);
        if ('ImageCapture' in window && track) {
          try {
            const pc = await new window.ImageCapture(track).getPhotoCapabilities();
            setCanFlash(!!pc?.fillLightMode?.includes?.('flash'));
          } catch { /* no photo flash here */ }
        }
        setReady(true);
      } catch {
        if (!gone) setFailed('The camera did not open. Pick a photo instead, or allow the camera in Settings.');
      }
    })();
    return () => { gone = true; stop(); };
  }, [open, facing]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => { if (e.key === 'Escape') close(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  });

  function close() {
    run.current += 1;
    setCount(0);
    stop();
    onClose();
  }

  const front = facing === 'user';
  const flashWorks = front || canTorch || canFlash;

  const wait = ms => new Promise(r => setTimeout(r, ms));

  async function grab() {
    const v = videoRef.current;
    const track = streamRef.current?.getVideoTracks()[0];
    if (!v || !track) return null;
    // A real photo flash, where the phone offers one.
    if (flash && canFlash && !front) {
      try { return await new window.ImageCapture(track).takePhoto({ fillLightMode: 'flash' }); } catch { /* fall back to a frame */ }
    }
    const light = flash && !front && canTorch;
    if (light) { try { await track.applyConstraints({ advanced: [{ torch: true }] }); await wait(450); } catch { /* light refused */ } }
    if (flash && front) { setWhiteout(true); await wait(350); }
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    const g = c.getContext('2d');
    if (front) { g.translate(c.width, 0); g.scale(-1, 1); }   // as she sees it
    g.drawImage(v, 0, 0, c.width, c.height);
    if (light) { try { await track.applyConstraints({ advanced: [{ torch: false }] }); } catch { /* fine */ } }
    if (flash && front) setWhiteout(false);
    return new Promise(r => c.toBlob(r, 'image/jpeg', 0.92));
  }

  const counting = count > 0;
  function stopTimer() { run.current += 1; setCount(0); }

  async function shoot() {
    if (!ready) return;
    const mine = ++run.current;
    for (let n = timer; n > 0; n -= 1) {
      setCount(n);
      await wait(1000);
      if (run.current !== mine) return;
    }
    setCount(0);
    const blob = await grab();
    if (!blob || run.current !== mine) return;
    run.current += 1;
    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
    stop();
    onClose();
    onPhoto(file);
  }

  function picked(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    stop();
    onClose();
    onPhoto(file);
  }

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="cam" role="dialog" aria-modal="true" aria-label={title}>
      <input ref={fileRef} type="file" accept="image/*" className="ml-scan-file" onChange={picked} tabIndex={-1} aria-hidden="true" />
      <div className="cam-top">
        <button type="button" className="cam-btn" onClick={close} aria-label="Close">✕</button>
        <div className="cam-opts">
          <button
            type="button"
            className={`cam-chip${flash && flashWorks ? ' on' : ''}`}
            onClick={() => setFlash(f => !f)}
            disabled={!ready || !flashWorks}
            aria-pressed={flash && flashWorks}
          >⚡ {!ready ? 'Flash' : !flashWorks ? 'No flash' : flash ? 'On' : 'Off'}</button>
          <button
            type="button"
            className={`cam-chip${timer ? ' on' : ''}`}
            onClick={() => setTimer(t => TIMERS[(TIMERS.indexOf(t) + 1) % TIMERS.length])}
            disabled={counting}
          >⏱ {timer ? `${timer}s` : 'Off'}</button>
        </div>
      </div>

      <div className="cam-view">
        {failed
          ? <p className="cam-failed">{failed}</p>
          : <video ref={videoRef} className={front ? 'is-front' : undefined} playsInline muted autoPlay />}
        {counting && <span className="cam-count" aria-live="assertive">{count}</span>}
      </div>

      <div className="cam-bottom">
        <button type="button" className="cam-btn cam-side" onClick={() => fileRef.current?.click()} aria-label="Pick a photo">🖼</button>
        <button
          type="button"
          className="cam-shutter"
          onClick={failed ? () => fileRef.current?.click() : counting ? stopTimer : shoot}
          disabled={!ready && !failed}
          aria-label={failed ? 'Pick a photo' : counting ? 'Stop the timer' : 'Take the photo'}
        >{counting ? <span className="cam-stop" aria-hidden="true" /> : null}</button>
        <button
          type="button"
          className="cam-btn cam-side"
          onClick={() => { setFlash(false); setFacing(f => (f === 'user' ? 'environment' : 'user')); }}
          disabled={!!failed || counting}
          aria-label="Flip the camera"
        >🔄</button>
      </div>
      {whiteout && <div className="cam-white" aria-hidden="true" />}
    </div>,
    document.body,
  );
}
