# Motion system

**A platform-wide animation vocabulary — performance, accessibility and
server rendering designed in, not bolted on.**

React 19 · Next.js App Router · [`motion`](https://motion.dev) (formerly
Framer Motion). Drop-in components; no build step of their own.

## The problems it solved

- **A scroll that re-rendered the whole page.** Parallax was driven by React
  state, so every scroll event re-rendered an 800-line page. `useParallax`
  returns a motion value that writes to the element's transform directly —
  same arithmetic, zero React renders.
- **Content hidden from people without JavaScript.** Animation libraries write
  their *initial* state into server-rendered HTML, so scroll reveals ship as
  `opacity: 0`. Every hidden-at-first element carries a marker that a
  `<noscript>` rule un-hides, so a visitor with JavaScript off gets the
  finished page instead of a blank one.
- **Overlays trapped inside cards.** The rule at the top of `index.tsx`: a
  transform on a container makes it the containing block for every
  `position: fixed` child, trapping modals inside it. Containers therefore
  animate **opacity only** (`FadeIn`, `RouteTransition`); transforms are
  reserved for leaves and for elements that *are* the overlay.

## What's here

| File | |
|---|---|
| `index.tsx` | `Reveal`, `RevealSection`, `RevealStagger`/`RevealItem`, container-safe `FadeIn`, `useParallax`, and shared gesture presets |
| `RouteTransition.tsx` | One cross-fade for every page, mounted once in the root layout — opacity-only, and deliberately *not* waiting for the old page to leave, because that adds latency to every navigation |

Every primitive collapses to a no-op under `prefers-reduced-motion`.
