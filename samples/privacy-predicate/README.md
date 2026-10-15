# Privacy predicate

Two parts of a community product answered the same question, "may we show
this person's name here?", with two different rules. The list of who reacted
to a post hid some people. The notification sent to the post's author named
them. The looser rule leaked what the stricter one hid.

I could have patched the looser rule, but then I'd have two rules that agree
today and drift apart later. So I replaced both with one function.

## Run it

From this folder:

```bash
npx tsx decide.test.ts
```

## What to look at

`decide.ts` is the whole rule. It's pure: a separate loader gathers the facts
and this only decides, which is what makes an exhaustive test possible. The
thread facts are inputs too, because my first version only looked at account
settings and missed people who had posted anonymously in that thread.

It fails closed. If any lookup failed, the person is masked. Naming someone
who asked not to be named can't be undone; calling a public person "Someone"
is only vague.

`decide.test.ts` calls the function. My first guard for this bug checked that
the calling code contained a call to the helper, and it passed while the
helper returned the wrong answer. This test writes the other view's rule out
independently and checks all 64 input combinations for a case where that view
hides someone and this one names them.

Extracted from production code and generalised; names and context are
simplified.
