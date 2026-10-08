// Spoken words, tidied: spaces after punctuation, capitals, numbers left alone.
// Run with:  node src/utils/__tests__/dictation.test.mjs
import { tidySpeech, joinSpeech } from '../dictation.js';
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };
ok('a space after a full stop, and a capital', tidySpeech('a good day.i went') === 'A good day. I went');
ok('no space before a comma, one after', tidySpeech('the gym ,then home') === 'The gym, then home');
ok('numbers are left alone', tidySpeech('3.5 eggs and 1,000 calories') === '3.5 eggs and 1,000 calories');
ok('a lone i becomes I', tidySpeech('then i rested') === 'Then I rested');
ok('after her full stop the next sentence starts with a capital', joinSpeech('Dear diary.', 'today was calm') === 'Dear diary. Today was calm');
ok('mid-sentence a name keeps its capital', joinSpeech('I live in', 'Cebu now') === 'I live in Cebu now');
ok('what she typed is never changed', joinSpeech('see goddess-plan.vercel.app, e.g. this', 'and that') === 'see goddess-plan.vercel.app, e.g. this and that');
ok('spoken punctuation joins without a stray space', joinSpeech('I am happy', '. tomorrow too') === 'I am happy. Tomorrow too');
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
