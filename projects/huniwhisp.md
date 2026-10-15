# HuniWhisp

An anonymous journaling and community platform. People write the things they
can't say out loud (journals, confessions, questions, goals) under a chosen
name or fully anonymously. It's live on the web and Google Play, with about
4,200 members and around 800 active in a typical month (October 2026).

My role: sole founder and engineer. Product, architecture, all of the
application code, the database, the mobile shells, infrastructure, deployment,
moderation tools, the legal pages and incident response.

---

## Architecture

- The web app is Next.js 16 (App Router), React 19 and TypeScript, with 590 API
  routes. Most pages render on the server with small client islands.
- Data lives in MySQL on AWS RDS. Sensitive columns are encrypted at rest with
  AES-256-GCM, and I've rotated the key in production across every encrypted
  value without downtime.
- Android and iOS are Capacitor shells around the live site. I chose that on
  purpose: one codebase, and a web deploy is the app deploy, so a fix reaches
  every platform in minutes instead of waiting on store review. Push, the
  privacy screen and in-app purchases are native plugins.
- Docker images are built and deployed by GitHub Actions. A pre-flight step
  validates the config and aborts the deploy rather than take the site down.
- About 500 SQL migrations so far. Each one checks the live schema before it
  acts, ends with a query that verifies itself, and claims its number in a
  ledger first, so two machines can't collide on the same number.
- Over 90 automated checks, each pinning one rule. For example: an anonymous
  author's identity must never reach the browser.
- 13 languages, including right-to-left. That shapes every layout: no fixed
  widths anywhere a word can land.

## Selected engineering problems

### One privacy rule, two answers
A member could be anonymous in one place and named in another, because two
parts of the system each answered "may we show this person's name?" with
their own rule. Patching the looser rule would have left two rules that
happened to agree for now. I wanted one. So the decision became a single pure
function that fails closed, and the test writes out the other side's rule
independently and checks all 64 input combinations for disagreement.

My first test for this grepped the source for a call to the shared helper. It
passed while the helper returned the wrong answer. Since then my rule is that
a test has to call the code.
Code: [`samples/privacy-predicate`](../samples/privacy-predicate)

### A bug that lived between two functions
Members signed in on more than one device found some messages unreadable on
one of them. Every function involved was correct on its own. The problem was
which function got asked: a device check only ran when a secure session was
first set up, so every existing conversation skipped it. I proved it with a
simulation of the decision as production runs it, then checked the invariant
across 72 sender and recipient device combinations.
Code: [`samples/delivery-simulation`](../samples/delivery-simulation)

### Every post page returned 502
After one deploy, every post, diary and group page started returning 502. The
home page and profiles were fine, which was the clue. nginx's default buffer
for upstream response headers is 4 KB, and the app's headers (two CSP headers,
preload hints, cookies) were already close to it. A new font preload added one
more header to every response and pushed the heavier pages over. The lighter
pages were sitting at 4,085 bytes, eleven short of failing. I raised the
buffer to 16 KB, dropped the preload header, and added a check that pins both.
I now load a post, a diary and a group page after every deploy.

### English posts tagged as German
Editing an English post showed "German" as if the author had picked it. Four
routes each had their own copy of the language guess (a learning job had a
fifth), and all of them matched keywords as substrings. So "under" counted as
German because it contains "und", "order" because of "der", "which" because
of "ich". I moved the guess into one module that matches whole words (and
characters, for Chinese, Japanese and Korean). A Latin-script guess now has to
beat half of the English function words. The automatic tags became
server-only: the edit page no longer offers them, the edit route ignores any
that are submitted, and changing the text re-runs the guess. Tags the author
chose are left alone. 19 checks cover it.

### Erasing a diary for good
Members asked for a way to delete a diary, and to erase one permanently. A
review of my first design found four ways it could destroy records it
shouldn't, or tell the member something it shouldn't. The version that
shipped works like this. The request only hides the diary and schedules the
erase. A job does the erase after a 30-day grace period, which a setting can
lengthen but never shorten. The erase runs in one transaction: lock the row,
re-check the request, check for holds, remove media through the one safe
deletion path, check holds again, commit. Any doubt or error rolls back, and a
failed hold check counts as a hold. The response is the same whether or not a
hold exists. Payment, moderation and legal records are never touched, and the
member can cancel from "Deleted diaries" during the grace period.

The checks grew from 122 to 156. I broke each safeguard on purpose, 31 times
in total, and confirmed the checks fail every time.

### Deleted, but still in someone's inbox
A tester noticed that after a comment was deleted, the post owner's
notification still showed the commenter's name and words. A notification
copies its text when it's created, and more than twenty code paths can delete
or hide content: blocking, a moderation hold, account deletion, going
anonymous after the fact. Clearing notifications in the delete handler would
have fixed one path and missed the rest. So every notification re-checks its
source when the inbox is read. A deleted source gets scrubbed, a hidden one is
held back (hiding can be reversed on appeal), and a name that's no longer
shown becomes "Someone". One gate covers every cause.

### Model replies that stopped mid-sentence
A language model drafts replies to member support requests. Nine of its first
twelve replies were cut off mid-sentence, and each ticket was then marked
resolved. I found out because members wrote back asking again. The model's
reasoning was using up the output budget, and the code accepted any non-empty
text. Now a reply is only used when the model reports a clean stop, the text
is long enough to be an answer, and it ends like a sentence. Otherwise a
prepared reply goes out. The same trap had already hit a moderation call, so I
went through every other model call and fixed one more.
Code: [`samples/llm-completion-guard`](../samples/llm-completion-guard)

### Rebuilding the admin dashboard
The admin dashboard had grown panel by panel, each one styled inline, so
spacing and buttons drifted everywhere. I built one stylesheet scoped to the
admin area (so it can't leak into member pages after a client-side
navigation), with scales for spacing, radius and control height, and colours
taken from the site theme so light and dark both work. On top of it went about
a dozen shared components: cards, tabs with arrow-key support, accordions on
native `<details>`, action rows that put destructive buttons after a divider.
Then the panels moved over in batches.

The move turned up twelve real bugs, each now pinned by a check that fails on
the old code. Some favourites: writes the server refused were silently
ignored. An editor closed even when its save failed. A failed read showed as
an empty list instead of an error with Retry. A scheduling field saved "every
5 minutes" as 0, so the job never ran, and saved "monthly" as weekly. And the
email preview rendered raw HTML, so it now goes through the same escaping as
the real email. Earlier, an admin action silently did nothing on Android
because it used the browser's `prompt()`, which Android's WebView doesn't
implement. Every input there is now a normal inline field.

### One database pool, not one per bundle
Local development hit 1,000 MySQL connections, and production was running
several pools side by side. The pool was created when its module loaded, so
every server bundle, and every hot reload in dev, opened its own. With
production allowing 61 connections, a handful of duplicates is enough to run
out. It's now one pool per Node process, cached on the global object, and a
check loads the module twice and requires the same pool back.

### A motion system for the whole platform
Scroll parallax on one page was driven by React state, so every scroll event
re-rendered an 800-line page. Moving it to motion values that write straight
to the DOM removed that cost completely. From there I built shared animation
components for the platform. Every one of them respects reduced motion, and
server-rendered pages have a no-JavaScript fallback so they never ship blank.
The design rests on one rule I learned from a real bug: never put a transform
on a container. This month the same system took on icons whose parts move
(the bell rings, the door opens) and a small scene for each of the 79
reactions, all held to limits a check enforces: transform and opacity only,
a few particles at most, and nothing moves under reduced motion.
Code: [`samples/motion-system`](../samples/motion-system)

### PDF generation with no browser in production
Certificates had to be generated on the server the moment an admin approved
them, but the production image has no Chrome. I rebuilt the design in plain
JavaScript with pdf-lib and hit two traps on the way. The PDF subsetter
silently drops glyphs from variable fonts. And drawing a word in one call
forms ligatures, which the library then positions using the un-ligated width.

### Email that can't go out by accident
Every product update was being mailed to the whole membership. The
announcement flag defaulted to "send", and the kill switch stopped new mail
being queued but not mail already in the queue. Email is now opt-in per
announcement, the switch reaches the delivery loop too, and a regression test
pins both.

### Offline without lying
Some Android WebViews report "online" behind a dead connection, or never
report coming back. So the app believes "offline" straight away, but confirms
"back online" with a tiny request before retrying anything, and keeps probing
while it thinks it's offline. Only reactions are queued for replay, because
applying one twice lands in the same place. Posts and messages are never
queued, since a replay would create a second copy.

## Running it

A community platform is as much operations as code. I built and run the
moderation side: reporting, a strike ladder with appeals, evidence retention,
admin review queues, and a model-assisted triage lane that is never allowed to
remove anything a person hasn't read. Several of the fixes above started as
reports from members or security researchers, and I set up a recognition
programme to credit researchers who report responsibly.
