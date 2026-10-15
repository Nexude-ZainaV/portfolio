// guard.test.ts: every way a reply can look finished without being finished.
// Run: npx tsx guard.test.ts

import { chooseReply, isCompleteReply, MIN_REPLY_CHARS } from './guard';

let failures = 0;
const check = (cond: boolean, label: string) => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`);
  if (!cond) failures++;
};

// A reply long enough to clear the length rule, so each test isolates one rule.
const BODY = 'Thanks for writing in. You can turn that off under Settings, then Privacy, '
  + 'and the change applies to every post you have already shared';
const PREPARED = 'Thanks for reaching out. A teammate is looking into this and will reply here.';

// 'STOP' is the clean finish; 'MAX_TOKENS' stands for "ran out of output budget".
console.log('finish reason');
check(isCompleteReply(BODY + '.', 'STOP'), 'clean stop and a full sentence is used');
check(!isCompleteReply(BODY + '.', 'MAX_TOKENS'), 'ran out of tokens is rejected even if it looks fine');
check(!isCompleteReply(BODY + '.', undefined), 'no finish reason is rejected (fail closed)');

console.log('length');
check(!isCompleteReply('Sure.', 'STOP'), 'a one-word reply is a fragment');
check(BODY.length + 1 >= MIN_REPLY_CHARS, 'the test body really is long enough');

// \u2014 is an em dash, the character the real cut-off reply ended on.
console.log('ending');
check(!isCompleteReply(BODY + ', and', 'STOP'), 'ends on a bare word');
check(!isCompleteReply(BODY + '\u2014', 'STOP'), 'ends on a dash (the real production failure)');
check(isCompleteReply(BODY + '?', 'STOP'), 'a question mark ends a sentence');
check(isCompleteReply(BODY + ' 💛', 'STOP'), 'an emoji can end a warm reply');
check(isCompleteReply(BODY + ' (Settings → Privacy).', 'STOP'), 'closing bracket and period');
check(isCompleteReply(BODY + '.   \n', 'STOP'), 'trailing whitespace is ignored');

console.log('choosing');
const good = chooseReply({ text: BODY + '.', finishReason: 'STOP' }, PREPARED);
check(good.usedModel && good.reply === BODY + '.', 'a complete reply is sent as written');
// The actual truncated reply from production.
const cut = chooseReply({ text: 'Thank you so much for your sweet words\u2014', finishReason: 'MAX_TOKENS' }, PREPARED);
check(!cut.usedModel && cut.reply === PREPARED, 'a cut-off reply falls back to the prepared one');
const none = chooseReply(null, PREPARED);
check(!none.usedModel && none.reply === PREPARED, 'no model result falls back to the prepared one');

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
