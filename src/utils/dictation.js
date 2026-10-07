// Talking instead of typing, using the phone's or computer's own speech
// recognition. It is free and needs no account: Safari and Chrome both carry
// it. What she says is written into the box as she speaks, so she can read it
// back and fix any word before saving.
//
// Some places do not offer it (an older iPhone, some home-screen apps). Then
// `supported` is false and the caller says so plainly — the keyboard's own
// mic still works in any text box.

import { useEffect, useRef, useState } from 'react';

function recognitionClass() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * useDictation(onText)
 *   onText(text) is called with the words heard so far in this go, every time
 *   they change. The caller adds them to whatever was in the box before.
 * Returns { supported, listening, error, start, stop }.
 */
export function useDictation(onText) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const recRef = useRef(null);
  const onTextRef = useRef(onText);
  useEffect(() => { onTextRef.current = onText; }, [onText]);
  const supported = Boolean(recognitionClass());

  useEffect(() => () => {
    try { recRef.current?.abort(); } catch { /* already stopped */ }
  }, []);

  function start() {
    const Rec = recognitionClass();
    if (!Rec || recRef.current) return;
    setError('');
    const rec = new Rec();
    rec.lang = navigator.language || 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = e => {
      let heard = '';
      for (let i = 0; i < e.results.length; i += 1) heard += e.results[i][0].transcript;
      onTextRef.current(heard.trim());
    };
    rec.onerror = e => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError('The mic is blocked. Allow it in your settings, or use the keyboard mic.');
      } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
        setError('Could not hear that. Try again, or use the keyboard mic.');
      }
    };
    rec.onend = () => {
      recRef.current = null;
      setListening(false);
    };
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      recRef.current = null;
      setError('Could not start the mic. Use the keyboard mic instead.');
    }
  }

  function stop() {
    try { recRef.current?.stop(); } catch { /* already stopped */ }
  }

  return { supported, listening, error, start, stop };
}
