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
// ("good day.I went"). One space after . , ! ? ; : — none before — and numbers
// like 3.5 or 1,000 left alone. Saying "new paragraph" starts a new paragraph
// (an empty line between); "new line" starts a new line.
//
// Capitals: only at the start of a sentence (after a full stop, ? or !, or a
// new paragraph) and on names. The phone capitalises the first word every
// time she starts talking again; that is undone for everyday words, so a
// pause mid-sentence does not leave a stray capital. A word that is not an
// everyday word (Cebu, Garmin, Joy) keeps its capital.
const EVERYDAY_WORDS = new Set(`a about after again all also am an and any are as at back be because been before being both but by can could day did do does done down each even every for from get go going good got had has have he her here him his how if in into is it its just know last like made make many me more most much my need never new next no not now of off on once one only or other our out over really right said same see she should since so some still such take than that the their them then there these they thing think this those though through time to today tomorrow too two under up us very was way we well went were what when where which while who why will with would yes yet you your went felt feel ate eat had have walked worked work slept sleep did tonight morning evening night later also maybe still just almost`.split(/\s+/));

const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Lower the first word when it is an everyday word the phone capitalised.
function unCapFirst(str) {
  return str.replace(/^([A-Z][a-z']*)/, (w) => (EVERYDAY_WORDS.has(w.toLowerCase()) && w !== 'I' && !/^I'/.test(w) ? w.toLowerCase() : w));
}

const endsSentence = (str) => /([.!?]|\n)\s*$/.test(str);

export function tidySpeech(text, { capStart = true } = {}) {
  let out = String(text || '')
    .replace(/[ \t]*\bnew paragraph\b[ \t]*[.,]?[ \t]*/gi, '\n\n')
    .replace(/[ \t]*\bnew line\b[ \t]*[.,]?[ \t]*/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+([.,!?;:])/g, '$1')
    .replace(/([.,!?;:])(?=[^\s\d.,!?;:)\]"'’”])/g, '$1 ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/([.!?][ \t]+|\n[ \t]*)([a-z])/g, (m, p, c) => p + c.toUpperCase())
    .replace(/\bi\b/g, 'I')
    .replace(/^[ \t]+|[ \t]+$/g, '');
  out = capStart ? cap(out) : unCapFirst(out);
  return out;
}

// The pieces of one go of talking, joined: each piece the phone began with a
// capital is lowered unless it starts a sentence.
export function joinPieces(parts) {
  let out = '';
  for (const raw of parts) {
    const piece = String(raw || '').trim();
    if (!piece) continue;
    if (!out) { out = piece; continue; }
    out = `${out} ${endsSentence(out) ? piece : unCapFirst(piece)}`;
  }
  return out;
}

// Put the spoken words after what was already in the box. Only the spoken
// part is tidied — what she typed (a web address, "e.g.") is left exactly as
// it is.
export function joinSpeech(before, heard) {
  const a = String(before || '').replace(/[ \t]+$/, '');
  if (!a.trim()) return tidySpeech(heard);
  let b = tidySpeech(heard, { capStart: endsSentence(a) });
  if (!b) return a;
  if (/^\n/.test(b)) return `${a.replace(/\s+$/, '')}${b}`;
  if (/\n$/.test(a)) return `${a}${cap(b)}`;
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
      // Raw pieces joined; the caller tidies them as it adds them to the box.
      onTextRef.current(joinPieces(parts));
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
