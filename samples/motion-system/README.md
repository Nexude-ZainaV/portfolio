# Motion system

The shared animation components for a whole platform. Built with React 19,
the Next.js App Router and [`motion`](https://motion.dev) (formerly Framer
Motion). They're drop-in components with no build step of their own.

It started with a marketing page that had motion hand-rolled three different
ways. Three problems shaped what's here.

Scrolling re-rendered the whole page. Parallax was driven by React state, so
every scroll event re-rendered an 800-line page. `useParallax` returns a
motion value that writes to the element's transform directly: same
arithmetic, no React renders.

Scroll reveals hid content from people without JavaScript. Animation
libraries write their initial state into the server HTML, so a reveal ships
as `opacity: 0`. Every element that starts hidden carries a marker that a
`<noscript>` rule un-hides, so a visitor with JavaScript off gets the finished
page instead of a blank one.

Overlays got trapped inside cards. A transform on a container makes it the
containing block for every `position: fixed` child, so a modal inside it is
stuck in the card. Containers here animate opacity only (`FadeIn`,
`RouteTransition`), and transforms are kept for leaves and for elements that
are the overlay themselves.

## Files

| File | What's in it |
|---|---|
| `index.tsx` | `Reveal`, `RevealSection`, `RevealStagger`/`RevealItem`, the container-safe `FadeIn`, `useParallax`, and shared gesture presets |
| `RouteTransition.tsx` | One cross-fade for every page, mounted once in the root layout. Opacity only, and it doesn't wait for the old page to leave, because that adds latency to every navigation |

Every component turns into a no-op under `prefers-reduced-motion`.

There's no test here. Start with `FadeIn` and the comment above it, since
that rule decided most of the rest.
