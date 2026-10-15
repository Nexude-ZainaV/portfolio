# LLM completion guard

A model call that came back successfully doesn't mean the model finished.

Our support desk used a language model to draft replies to members. Nine of
its first twelve replies were cut off mid-sentence, one of them ending on
"Thank you so much for your sweet words" and a dash, then the signature. Each
ticket was marked resolved anyway. Members wrote back asking again, nobody
answered, and that's how I found it.

Two things combined. The model's own reasoning counted against a small output
limit, so it ran out partway through the answer. And the code accepted any
non-empty text, so a truncated reply looked exactly like a finished one.

## Run it

From this folder:

```bash
npx tsx guard.test.ts
```

## What to look at

`guard.ts` uses the model's text only when three things hold: the model says
it stopped on its own, the reply is long enough to be an answer, and it ends
like a sentence. A missing finish reason counts as unfinished. When the check
fails, a prepared reply goes out instead, so the member always gets something
correct and never half of something.

`guard.test.ts` builds its cases on a body that already clears the length
rule, so each case tests one rule. One of them is the real failure, a reply
ending on a dash.

The same trap had already hit a moderation call. After this fix I went
through every other model call, and one more had the same bug.

Extracted from production code and generalised; names and context are
simplified.
