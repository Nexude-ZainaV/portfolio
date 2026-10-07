# HuniWhisp

**An anonymous journaling and community platform.** People write things they
can't say out loud — journals, confessions, questions, goals — under a chosen
name or fully anonymously. Live on the web and Google Play, with about 4,200
members and around 800 active in a typical month (October 2026).

**My role:** sole founder and engineer. Product, architecture, every line of
application code, database, mobile shells, infrastructure, deployment,
moderation tooling, legal pages and incident response.

---

## Architecture

- **Web:** Next.js 16 (App Router), React 19, TypeScript. 580+ API routes, and most of
  the product is server-rendered with client islands.
- **Data:** MySQL on AWS RDS. Sensitive columns are encrypted at rest with
  AES-256-GCM, and the key has been rotated in production across every
  encrypted value without downtime.
- **Mobile:** Android and iOS are Capacitor shells that load the live site.
  I chose this deliberately: one codebase, and a web deploy *is* the app
  deploy, so a fix reaches every platform in minutes instead of waiting on
  store review. Native capabilities (push, privacy screen, in-app purchase)
  are plugins.
- **Delivery:** Docker images built and deployed through GitHub Actions, with
  a pre-flight config validation step that aborts the deploy rather than take
  the site down.
- **Schema changes:** nearly 500 guarded, idempotent SQL migrations. Each one checks
  the live schema before acting, ends with a self-verifying query, and is
  claimed in a ledger before it is written so two machines can never collide
  on a number.
- **Guards:** 81 behaviour checks, each pinning one rule (for example, an
  anonymous author's identity must never reach the browser).
- **Internationalisation:** 13 languages including right-to-left, which
  shapes every layout decision (no fixed widths anywhere a word can land).

## Selected engineering problems

### One privacy rule, two answers
A member could be anonymous in one place and named in another, because two
parts of the system each answered "may we name this person?" with their own
rule. The fix was not to patch the second rule — it was to make there be only
one. I extracted the decision into a single **pure, fail-closed function** and
wrote a test that transcribes the *other* side's rule independently and
checks all 64 combinations of inputs for disagreement.

The first test I wrote for this grepped the source for a call to the shared
helper — and passed while the helper returned the wrong answer. That taught
me the rule I now apply everywhere: **a test has to call the code.**
→ [`samples/privacy-predicate`](../samples/privacy-predicate)

### A bug that lived between two functions
Members signed in on more than one device found some messages unreadable on
one of them. Each function involved was correct on its own. The defect was in
*which function got asked*: a check ran only when a session was first
created, so every existing conversation skipped it. I found and proved it
with a **simulation** of the decision as production runs it, then asserted
the invariant across 72 sender/recipient device combinations.
→ [`samples/delivery-simulation`](../samples/delivery-simulation)

### A motion system for a whole platform
Scroll-linked parallax was driven by React state, so every scroll event
re-rendered an 800-line page. Moving it to motion values that write straight
to the DOM removed the render cost entirely. I then built a shared animation
vocabulary for the platform with two non-negotiables: reduced-motion support
in every primitive, and a no-JavaScript fallback so server-rendered pages
are never shipped blank. The design turned on one layout rule — *never put a
transform on a container* — learned from a real bug.
→ [`samples/motion-system`](../samples/motion-system)

### PDF generation with no browser in production
Certificates had to be generated on the server at the moment an admin
approved them, but the production image has no Chrome. I rebuilt the design
in pure JavaScript with pdf-lib, and worked through two traps along the way:
the PDF subsetter silently drops glyphs from **variable fonts**, and drawing
a word in one call forms ligatures that the library then positions by the
un-ligated width.

### Email that can't go out by accident
Every product update was being mailed to the whole membership, because the
announcement flag defaulted to *send* and a kill switch stopped new mail
being queued but not mail already in the queue. I made email opt-in per
announcement, made the switch reach the delivery loop too, and pinned both
with a regression test.

### Admin tooling that works inside the app
An admin action silently did nothing on mobile: it relied on the browser's
native prompt dialog, which Android's WebView does not implement. Every input
in that tool is now an ordinary inline field that behaves the same in any
browser or WebView.

### A model that answered but didn't finish
An AI assistant drafts support replies to members. Nine of its first twelve replies were cut off
mid-sentence, and each ticket was then marked resolved. Members wrote back asking again, which is how
I found it. The model's own reasoning was spending the output budget, and the code accepted any
non-empty text. A reply is now used only when the model reports a clean stop, the text is long enough
to be an answer, and it ends like a sentence. Otherwise a prepared reply goes out. The same trap had
already hit a moderation call, so I checked every other model call and fixed one more.
→ [`samples/llm-completion-guard`](../samples/llm-completion-guard)

### Deleted, but still in someone's inbox
A tester reported that after a comment was deleted, the post owner's notification still showed the
commenter's name and words. A notification copies its text when it is created, and more than twenty
code paths can delete or hide content: a block, a moderation hold, an account deletion, going
anonymous after the fact. Clearing notifications in the delete handler would have fixed one path and
missed the rest. Instead, every notification re-checks its source **when the inbox is read**: a
deleted source is scrubbed, a hidden one is held back (hiding can be reversed on appeal), and a name
that is no longer shown becomes "Someone". One gate, every cause.

### Offline without lying
Some Android WebViews report "online" behind a dead connection, or never report coming back. So the
app trusts "offline" immediately, but confirms "back online" with a tiny request before retrying
anything, and keeps probing while it believes it's offline. Only one action is queued for replay
while offline: a reaction, because applying it twice lands in the same place. Posts and messages are
never queued, because a replay would create a second copy.

## Operating it

Running a community platform is as much operations as code. I built and run
the moderation stack — reporting, a strike ladder with appeals, evidence
retention, admin review queues, and an LLM-assisted triage lane that is never
allowed to remove content a person hasn't read. Several of the fixes above
started as reports from members and security researchers; I built a
recognition programme to credit researchers who report responsibly.
