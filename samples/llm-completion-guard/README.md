# LLM completion guard

**A model call that returned successfully is not the same as a model that finished.**

```bash
npx tsx guard.test.ts
```

## The problem

An automated support assistant drafted replies to members. Nine of its first twelve replies were
cut off mid-sentence, one ending on "Thank you so much for your sweet words—" and then the
signature, and each ticket was then marked resolved. Members wrote back asking again, and nobody
answered. That is how it was found.

Two things combined. The model's own reasoning counted against a small output limit, so it ran out
partway through the answer. And the code accepted any non-empty text, so a truncated reply looked
exactly like a finished one.

## What this shows

- **Check the finish, not the status code.** The model says why it stopped. A reply is used only
  when it stopped on its own, is long enough to be an answer, and ends like a sentence.
- **A safe fallback, not an error.** When the check fails, a prepared reply goes out. The member
  always gets something correct, and never half of something.
- **Failing closed.** A missing finish reason is treated as unfinished.
- **Sweeping for siblings.** The same trap had already hit a moderation call. After this fix, I
  checked every other model call, and one more had the same bug.
- **The test isolates each rule.** It uses a body long enough to pass the length rule, so each case
  proves exactly one thing, including the real production failure (a reply ending on a dash).

Extracted and generalised from production code; names and context are simplified.
