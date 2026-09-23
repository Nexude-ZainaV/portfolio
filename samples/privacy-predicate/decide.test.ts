// decide.test.ts — exercises the decision itself, exhaustively.
//
// Run: npx tsx decide.test.ts
//
// WHY THIS REPLACED A SOURCE-GREP TEST. The first guard for this rule checked
// that the calling code CONTAINED a call to the shared helper. That passes
// even when the helper returns the wrong answer — and it did. A test that
// reads source cannot catch a wrong answer; this one calls the function.
//
// THE INVARIANT. Two views of the same person must never disagree. So the
// other view's rule is written out independently below, and every
// combination of facts is checked against both. If one masks and the other
// names, that is the bug, whichever direction it points.

import { decideLabel, MASKED_LABEL, type IdentityFacts } from './decide';

let failures = 0;
const check = (cond: boolean, label: string) => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`);
  if (!cond) failures++;
};

/**
 * The OTHER view's rule, transcribed independently on purpose. If this were a
 * copy of decideLabel, the test would prove nothing.
 */
function otherViewMasks(f: IdentityFacts): boolean {
  const bare = f.isAnonymousAuthorHere || f.hasAnonymousPostHere || f.alwaysAnonymous || !f.factsComplete;
  return bare || f.pseudonymMode;
}

const PSEUDONYM = 'Anon-5F2A';
const NAME = 'theJollyDune';

const facts = (over: Partial<IdentityFacts>): IdentityFacts => ({
  alwaysAnonymous: false,
  pseudonymMode: false,
  pseudonym: PSEUDONYM,
  displayName: NAME,
  isAnonymousAuthorHere: false,
  hasAnonymousPostHere: false,
  factsComplete: true,
  ...over,
});

console.log('Named cases');
check(decideLabel(facts({ pseudonymMode: true })) === PSEUDONYM, 'pseudonym mode shows the pseudonym, never the name');
check(decideLabel(facts({ hasAnonymousPostHere: true })) === MASKED_LABEL, 'anonymous in this thread -> masked');
check(decideLabel(facts({ isAnonymousAuthorHere: true })) === MASKED_LABEL, 'anonymous author of this thread -> masked');
check(decideLabel(facts({ alwaysAnonymous: true, pseudonymMode: true })) === MASKED_LABEL,
  'always-anonymous outranks pseudonym mode and withholds even the pseudonym');
check(decideLabel(facts({})) === NAME, 'no reason to mask -> the name is used');

console.log('\nFails closed');
check(decideLabel(facts({ factsComplete: false })) === MASKED_LABEL, 'incomplete facts mask the person');
check(decideLabel(facts({ pseudonymMode: true, pseudonym: null })) === MASKED_LABEL,
  'pseudonym mode with no pseudonym masks rather than falling through to the name');
check(decideLabel(facts({ displayName: null })) === MASKED_LABEL, 'a missing name masks, never renders empty');

console.log('\nInvariant — never name someone the other view hides');
const bools = [false, true];
let checked = 0;
let disagreements = 0;
for (const alwaysAnonymous of bools)
for (const pseudonymMode of bools)
for (const isAnonymousAuthorHere of bools)
for (const hasAnonymousPostHere of bools)
for (const factsComplete of bools)
for (const pseudonym of [PSEUDONYM, null]) {
  const f = facts({ alwaysAnonymous, pseudonymMode, isAnonymousAuthorHere, hasAnonymousPostHere, factsComplete, pseudonym });
  checked++;
  if (otherViewMasks(f) && decideLabel(f) === NAME) disagreements++;
}
check(disagreements === 0, `${checked} combinations, ${disagreements} disagreements`);

console.log(failures ? `\n${failures} failure(s)` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
