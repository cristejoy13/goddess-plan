// Spoken words, tidied: spaces after punctuation, capitals only where they
// belong, numbers left alone, "new paragraph".
// Run with:  node src/utils/__tests__/dictation.test.mjs
import { tidySpeech, joinSpeech, joinPieces } from '../dictation.js';
let pass = 0, fail = 0;
const ok = (name, cond, got) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (cond ? '' : `  → ${JSON.stringify(got)}`)); };
const t = (name, got, want) => ok(name, got === want, got);
t('a space after a full stop, and a capital', tidySpeech('a good day.i went'), 'A good day. I went');
t('no space before a comma, one after', tidySpeech('the gym ,then home'), 'The gym, then home');
t('numbers are left alone', tidySpeech('3.5 eggs and 1,000 calories'), '3.5 eggs and 1,000 calories');
t('a lone i becomes I', tidySpeech('then i rested'), 'Then I rested');
t('after her full stop the next sentence starts with a capital', joinSpeech('Dear diary.', 'today was calm'), 'Dear diary. Today was calm');
t('a pause mid-sentence leaves no stray capital', joinSpeech('I went to the gym and', 'Then I went home'), 'I went to the gym and then I went home');
t('mid-sentence a name keeps its capital', joinSpeech('I live in', 'Cebu now'), 'I live in Cebu now');
t('pieces of one go: no stray capitals', joinPieces(['Today I walked', 'Then I ate', 'With Joy']), 'Today I walked then I ate with Joy');
t('pieces after a full stop keep the capital', joinPieces(['It rained.', 'Then it stopped']), 'It rained. Then it stopped');
t('"new paragraph" makes an empty line and a fresh sentence', joinSpeech('First part.', 'new paragraph second part'), 'First part.\n\nSecond part');
t('"new paragraph" in the middle of one go', tidySpeech('one thing new paragraph another thing'), 'One thing\n\nAnother thing');
t('talking again after a new paragraph starts with a capital', joinSpeech('First part.\n\n', 'more words'), 'First part.\n\nMore words');
t('"new line"', tidySpeech('milk new line eggs'), 'Milk\nEggs');
t('what she typed is never changed', joinSpeech('see goddess-plan.vercel.app, e.g. this', 'and that'), 'see goddess-plan.vercel.app, e.g. this and that');
t('spoken punctuation joins without a stray space', joinSpeech('I am happy', '. tomorrow too'), 'I am happy. Tomorrow too');
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
