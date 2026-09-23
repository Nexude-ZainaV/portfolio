# Stellar Forge

**An idle / battler game about forging stars.** Players unlock elements,
direct production streams, and forge celestial bodies whose outcomes feed
back into the progression.

Originally a web game, then **rebuilt and redesigned natively in Godot 4** for
Steam (Windows, macOS, Linux) and Android. The Godot version is now the lead.

**My role:** designer and engineer.

## Engineering notes

- **Headless-verified.** Game systems are exercised by automated test suites
  that run without a window, so progression, economy and save logic are
  checked on every change rather than by playing through.
- **Saves you can't lose.** Every exit path — closing the window, the app
  being paused or backgrounded on mobile, the Android back gesture, losing
  focus — funnels through one save routine, so there is exactly one place
  where a save can go wrong.
- **A separate developer build.** Debugging tools ship in a distinct build
  with a distinct binary, never in the store build.
- Stack: Godot 4, GDScript.
