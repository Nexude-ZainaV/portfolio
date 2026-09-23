// simulation.ts — finding a bug that lived BETWEEN functions.
//
// Run: npx tsx simulation.ts
//
// Extracted and generalised from a production messaging fix.
//
// THE SYMPTOM. People signed in on more than one device (say, phone and
// laptop) found some of their messages unreadable on one of them.
//
// THE SETUP. A message can take one of two delivery lanes:
//   "device" — the strongest protection, but encrypted for ONE device only.
//   "shared" — protected at rest, and readable on every device the person
//              signs in on.
// The "device" lane is only safe when BOTH people have exactly one device.
// So the send path checks device counts and falls back to "shared" otherwise.
//
// THE BUG. Every function was correct on its own. The peer's device check
// lived inside the step that SETS UP a secure session — and the send path only
// runs that step when no session exists yet. Every conversation that already
// had a session skipped the check entirely. The first fix therefore helped
// brand-new conversations and did nothing for existing ones, which is every
// conversation a real person actually has.
//
// WHY A SIMULATION. No unit test of either function could have caught this,
// because neither function was wrong. The defect was in WHICH function got
// asked. Only running the decision the way production runs it exposes that.

type Lane = 'device' | 'shared';

interface World {
  /** Is the "device" lane switched on at all? */
  deviceLaneEnabled: boolean;
  senderDevices: number;
  recipientDevices: number;
  /** Does a secure session already exist for this conversation? */
  existingSession: boolean;
}

/** Which lane a send takes. `checkPeerEverySend` is the fix. */
function chooseLane(w: World, checkPeerEverySend: boolean): Lane {
  if (!w.deviceLaneEnabled) return 'shared';
  if (w.senderDevices > 1) return 'shared';
  // THE BUG: when the peer check only runs during session setup, an existing
  // session never reaches it.
  const peerChecked = checkPeerEverySend || !w.existingSession;
  if (peerChecked && w.recipientDevices > 1) return 'shared';
  return 'device';
}

/** How many of the recipient's devices can open the message. */
const readableOn = (lane: Lane, devices: number): number => (lane === 'device' ? 1 : devices);

/** Can the sender re-read their own sent message on all their devices?
 *  On the "device" lane the sender's copy lives only on the device that sent it. */
const senderCanReread = (lane: Lane, devices: number): boolean => lane === 'shared' || devices <= 1;

let failures = 0;
const check = (cond: boolean, label: string) => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`);
  if (!cond) failures++;
};

const strands = (w: World, fixed: boolean): boolean => {
  const lane = chooseLane(w, fixed);
  return readableOn(lane, w.recipientDevices) < w.recipientDevices || !senderCanReread(lane, w.senderDevices);
};

console.log('BEFORE the fix — the bug reproduces');
const theReportedCase: World = { deviceLaneEnabled: true, senderDevices: 1, recipientDevices: 2, existingSession: true };
check(strands(theReportedCase, false), 'existing conversation to a phone + laptop recipient strands the message');
check(!strands({ ...theReportedCase, existingSession: false }, false),
  '...while a NEW conversation was fine — which is why the first fix looked like it worked');

console.log('\nAFTER the fix — the invariant, over every combination');
let violations = 0;
let combos = 0;
for (let s = 1; s <= 6; s++)
  for (let r = 1; r <= 6; r++)
    for (const existingSession of [false, true]) {
      combos++;
      if (strands({ deviceLaneEnabled: true, senderDevices: s, recipientDevices: r, existingSession }, true)) violations++;
    }
check(violations === 0, `every person can read every message on every device (${combos} combinations, ${violations} violations)`);
check(chooseLane({ deviceLaneEnabled: true, senderDevices: 1, recipientDevices: 1, existingSession: true }, true) === 'device',
  'the strongest lane is still used when it is actually safe');

console.log(failures ? `\n${failures} failure(s)` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
