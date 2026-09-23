# Privacy predicate

**One pure, fail-closed decision replacing two rules that disagreed — and a
test that proves it across every input.**

```bash
npx tsx decide.test.ts
```

## The problem

Two parts of a product answered "may we show this person's name?" with two
different rules. The looser one leaked what the stricter one hid.

## What this shows

- **Removing the duplication, not patching it.** Two rules that happen to
  agree today will drift tomorrow. There is now one function.
- **Pure logic, separated from I/O.** The decision takes facts; something
  else fetches them. That split is what makes an exhaustive test possible.
- **Failing closed.** An unanswerable privacy question resolves to the answer
  that can't hurt anyone.
- **A test that calls the code.** My first guard for this checked that the
  code *contained* a call to the helper — and passed while the helper
  returned the wrong answer. This test transcribes the other view's rule
  independently and checks all 64 input combinations for disagreement.

Extracted and generalised from production code; names and context are
simplified.
