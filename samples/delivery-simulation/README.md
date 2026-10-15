# Delivery simulation

People signed in on two devices couldn't read some of their messages on one
of them. Messages can go out on two lanes: a strongly protected one that only
works when both people have a single device, and a shared one that every
device can read. The send path was supposed to fall back to the shared lane
whenever either side had more than one device.

The check on the recipient's devices lived inside the step that sets up a
secure session, and that step only runs for a new conversation. Every
existing conversation skipped it. My first fix passed every test I wrote for
it and did nothing for the people who reported the problem, because their
conversations already existed.

No single function was wrong. The bug was in which function got asked, so I
wrote a simulation that runs the whole decision the way production does.

## Run it

From this folder:

```bash
npx tsx simulation.ts
```

## What to look at

The first two checks reproduce the bug with the old logic, including the case
that made my first fix look like it worked (a new conversation was fine).

After that it checks an invariant instead of examples: every combination of
sender and recipient device counts, with and without an existing session.
That's 72 cases and zero stranded messages, and the last check makes sure the
strong lane is still used whenever it's actually safe.

`chooseLane` takes the fix as a flag, so the same code shows the before and
the after.

Extracted from production code and generalised; the delivery lanes are
described abstractly.
