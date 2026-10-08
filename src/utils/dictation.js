// Talking instead of typing, using the phone's or computer's own speech
// recognition. It is free and needs no account: Safari and Chrome both carry
// it. What she says is written into the box as she speaks, so she can read it
// back and fix any word before saving.
//
// Some places do not offer it (an older iPhone, some home-screen apps). Then
// `supported` is false and the caller says so plainly — the keyboard's own
// mic still works in any text box.

import { useEffect, useRef, useState } from 'react';

// Tidy what was heard (2026-10-09): the phone hands back pieces of speech
// with no space between them and punctuation hugging the next word
// ("good day.I went"). One space after . , ! ? ; : — none before — a capital
// at the start of each sentence, and numbers like 3.5 or 1,000 left alone.
export function tidySpeech(text, { capStart = true } = {}) {
  const out = String(text || '')
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/([.,!?;:])(?=[^\s\d.,!?;:)\]"'’])/g, '$1 ')
    .replace(/\s{2,}/g, ' ')
    .replace(/([.!?]\s+)([a-z])/g, (m, p, c) => p + c.toUpperCase())
    .replace(/\bi\b/g, 'I')
    .trim();
  return capStart ? out.charAt(0).toUpperCase() + out.slice(1) : out;
}

// Put the spoken words after what was already in the box. Only the spoken
// part is tidied — what she typed (a web address, "e.g.") is left exactly as
// it is. A new sentence after her full stop starts with a capital.
export function joinSpeech(before, heard) {
  const a = String(before || '').replace(/\s+$/, '');
  if (!a) return tidySpeech(heard);
  // Mid-sentence, the first spoken word keeps the case the phone gave it, so
  // a name ("I live in Cebu") stays a name.
  let b = tidySpeech(heard, { capStart: /[.!?]$/.test(a) });
  if (!b) return a;
  if (/^[.,!?;:]/.test(b)) {
    b = b.replace(/^([.!?])\s*([a-z])/, (m, p, c) => `${p} ${c.toUpperCase()}`);
    return `${a}${b}`;
  }
  return `${a} ${b}`;
}

// One recogniser for the whole time the app is open. iPhones ask for
// permission again for every NEW recogniser, so making a fresh one on each
// tap of the mic meant the pop-up came back every time. Reused, it asks once
// per app opening (and not at all once she sets the Microphone permission to
// Allow in Settings).
let shared = null;

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
    if (!shared) {
      shared = new Rec();
      shared.lang = navigator.language || 'en-US';
      shared.continuous = true;
      shared.interimResults = true;
    }
    const rec = shared;
    rec.onresult = e => {
      const parts = [];
      for (let i = 0; i < e.results.length; i += 1) parts.push(e.results[i][0].transcript);
      onTextRef.current(tidySpeech(parts.join(' ')));
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
