# Delivery simulation

**A bug where every function was correct — found by simulating the decision
the way production actually runs it.**

```bash
npx tsx simulation.ts
```

## The problem

People signed in on two devices couldn't read some of their messages on one
of them. A strongly protected delivery lane only works for single-device
conversations, and the send path was supposed to fall back to a
readable-everywhere lane otherwise.

The check that decided this lived inside the step that sets up a secure
session — and that step only runs for a *new* conversation. Every existing
conversation skipped it. My first fix therefore passed every test I wrote for
it, and did nothing for the people who reported the problem.

## What this shows

- **Recognising a bug with no single broken function.** The defect was in
  which function got asked, so the useful test is one that runs the whole
  decision.
- **Reproducing before fixing.** The simulation first proves the old logic
  fails, and shows exactly why the first fix *looked* like it worked.
- **An invariant, not examples.** Every combination of sender and recipient
  device counts, with and without an existing session: 72 cases, zero
  stranded messages — while still using the strongest lane whenever it's safe.

Extracted and generalised from production code; the delivery lanes are
described abstractly.
