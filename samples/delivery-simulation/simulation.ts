// simulation.ts: replays the send path's lane choice for every device combination, before and after the fix.
// Run: npx tsx simulation.ts
// Came from people on two devices who couldn't read some messages: the
// recipient's device check only ran while a new session was being set up.

// "device": strongest protection, but encrypted for ONE device only.
// "shared": protected at rest and readable on every device the person uses.
// So "device" is only safe when both people have exactly one device.
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
  // The bug: when the peer check only runs during session setup, an existing
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

// A message is stranded if any recipient device can't open it, or the sender
// can't re-read it on all of theirs.
const strands = (w: World, fixed: boolean): boolean => {
  const lane = chooseLane(w, fixed);
  return readableOn(lane, w.recipientDevices) < w.recipientDevices || !senderCanReread(lane, w.senderDevices);
};

// Reproduce first. Neither function is wrong on its own, so only running the
// whole decision shows the bug, and why a new-conversation test missed it.
console.log('BEFORE the fix: the bug reproduces');
const theReportedCase: World = { deviceLaneEnabled: true, senderDevices: 1, recipientDevices: 2, existingSession: true };
check(strands(theReportedCase, false), 'existing conversation to a phone + laptop recipient strands the message');
check(!strands({ ...theReportedCase, existingSession: false }, false),
  '...while a NEW conversation was fine, which is why the first fix looked like it worked');

// Then the invariant over 6 x 6 device counts x session or not (72 cases).
console.log('\nAFTER the fix: the invariant, over every combination');
let violations = 0;
let combos = 0;
for (let s = 1; s <= 6; s++)
  for (let r = 1; r <= 6; r++)
    for (const existingSession of [false, true]) {
      combos++;
      if (strands({ deviceLaneEnabled: true, senderDevices: s, recipientDevices: r, existingSession }, true)) violations++;
    }
check(violations === 0, `every person can read every message on every device (${combos} combinations, ${violations} violations)`);
// The fix must not just push everything onto "shared".
check(chooseLane({ deviceLaneEnabled: true, senderDevices: 1, recipientDevices: 1, existingSession: true }, true) === 'device',
  'the strongest lane is still used when it is actually safe');

console.log(failures ? `\n${failures} failure(s)` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
