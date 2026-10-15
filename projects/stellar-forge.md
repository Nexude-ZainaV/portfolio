# Stellar Forge

A cosmic auto battler built on real stellar physics. A cold proto-mass sits in
the middle of the screen and the only thing you do is feed it. You never pick
what it becomes: its mass, density and heat decide which of 21 stars, planets
or collapsed bodies ignites. The forge gives you four starting elements, and
the rest of the 28-element table you find on a tour of the Solar System
(from the Oort cloud in to the Sun and back out) or take from rivals you
beat. Then you launch what you made into physics battles, with one of 77
gods from 25 mythologies riding along.

It started as a web game. I rebuilt it from scratch in Godot 4 (pure
GDScript), Windows and Steam first, with Android next. It has six languages
and optional online PvP, where a server replays every fight before it counts.

Status: Steam Early Access is planned for October 29, 2026. Android has a
test build but no store listing yet.

My role: designer and engineer. Everything from the physics to the store page.

---

## Selected engineering problems

### One door for every save
I wanted closing the game to always save. It turned out three exits didn't:
the Android back button, alt-tab followed by sleep or a crash (which could
lose up to 15 seconds), and any save that failed, because every caller
ignored the result.

Now there's one save entry point, and autosave, close, pause, Android back and
losing focus all go through it. It resets the autosave timer and logs failures
instead of dropping them. The write itself is atomic: write a temp file, read
it back, rotate the old save to a backup, then rename into place. Each save
carries an integrity tag, so a tampered save loads flagged instead of being
silently replaced. Save & Quit refuses to quit if the save fails. Losing the
quit is better than losing the progress.

Tests cover atomic writes, error paths, quitting, a truncated save and a save
from a newer version. The integrity tag only works if numbers survive a
save/load exactly, so I checked 20,000 float round trips: zero mismatches.

### Tests that give the same answer twice
The game has 348 headless test suites, plus a few hundred capture, probe and
measurement scripts. At one point two runs of identical code failed
differently. Suites were changing the saved data and not putting it back. A
translation object was being freed after the scripting runtime had shut down,
which crashed the game on quit in every language except English. And scripts
quit while their scene was still alive, which flooded the logs with leak
warnings.

So I wrote a parallel runner (four workers) that gives every suite its own
private save folder, reset from a clean copy each run. Results came back
byte-identical. A suite that fails headless gets one retry in a real window,
because some of them genuinely need one. One shared shutdown helper went into
489 scripts and took leak lines on the sample suites from 37 to zero. A quiet
launcher suppresses the Windows crash dialog, so a crash reports in about a
second instead of hanging the run.

It isn't all green, and I don't claim it is. The last full run was 264 of 289
suites passing. Most of the red ones need a real window.

### Fights the server can replay
Online ratings are only worth something if a fight can't be faked. The battle
simulation is deterministic, and the server's digest of a fight matches the
game's byte for byte. A headless copy of the game runs in a container next to
the TypeScript match server and replays each fight. Verified fights are
ranked. If the verifier is down, fights still count but stay unranked.

The verifier only rebuilds when the simulation or its config changes, so the
daily balance edits don't redeploy the live server. A security review turned
up a race on one-per-season rewards: two players could both claim the last
copy. Every rule is now re-checked inside one atomic database write, with
tests that fire many claims at once. The server has 21 test files (186 tests
passing in the last recorded run).

### Balance lives in data
There are 144 JSON data tables. Every tuning constant in the code has a
fallback, but when the data has a value, the data wins, so a balance change
never needs a code change. Big features ship as their own side tables so they
can't collide when merged. One test recounts the facts on the store page from
the data on every run, and flags any promise in the store copy that the build
can't keep.

### Performance budgets, measured
There are High, Medium and Low quality tiers plus a battery saver, each with a
frame budget in data. Effects use pooled, pre-warmed rigs so nothing gets built
in the middle of a cast. All 157 god abilities have a Low version made from
baked frame strips with no particles. On Low, the gas giants fit four weather
frames into the texture they already had, so the variety costs no memory and
no extra draw calls.

The numbers I trust: god effects add about 0.24 ms on High and under 0.5 ms on
Medium and Low, inside budgets of 4 ms (High) and 2 ms (phone tiers). The Steam
system requirements come from measured frame times, not guesses. What still
fails: the full-arena check on High is around 38 ms at p95 against a 16.7 ms
target, and every number so far is from one desktop GPU. I haven't measured on
a real phone yet.

### A release build that only ships the game
A custom export step strips internal notes out of the JSON and minifies it
(numbers stay bit-exact), drops shader comments, ships scripts as compiled
binary tokens (274 files, no plain source), and removes metadata from 86
images after checking the pixels and colour profiles are identical. A release
scan then reads the exported package, the store media and the translation
files, and fails the release if anything internal turns up. The final runs
were clean: 5,423 files in the full game, 5,407 in the demo.

Developer tools ship only in a separate developer build. The check that decides
it can only make a build more locked down, never less, so no code path can
turn a store build into a dev build.

## Stack

Godot 4.7, GDScript, JSON data tables. The match server is TypeScript on
Cloudflare Workers, with the headless game as a containerised verifier that
GitHub Actions rebuilds when the simulation changes.
