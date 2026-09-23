'use client';

// motion-system — a shared animation vocabulary for a whole product.
//
// Extracted and generalised from production code (React 19, Next.js App
// Router, the `motion` library — formerly Framer Motion). Every animated
// surface imports from here, so timings, easing and the reduced-motion
// contract are decided ONCE.
//
// ─────────────────────────────────────────────────────────────────────────────
// THE RULE THAT MATTERS MOST: DO NOT PUT A TRANSFORM ON A CONTAINER.
//
// A transformed element becomes the containing block for every
// `position: fixed` descendant, so a fixed overlay inside it is trapped in the
// card instead of covering the viewport. A real card component hit exactly this
// and had to portal a dialog out of itself to escape.
// CSS only had the problem while :hover was active; a Motion transform sits on
// the element permanently, which turns an occasional bug into a constant one.
//
// So: containers that may hold anything fixed — page wrappers, feed cards,
// list rows — get `FadeIn` / `fadeOnly`, which animate OPACITY ALONE. Opacity
// does not create a containing block. Transforms are for leaves and for
// elements that are themselves the overlay (modals, toasts, buttons).
// ─────────────────────────────────────────────────────────────────────────────
//
// WHY THIS FILE EXISTS. A marketing page had hand-rolled motion in three
// different styles: a `scrollY` React state driving inline `transform` strings
// for parallax, an IntersectionObserver toggling an `.is-visible` class for
// scroll reveals, and a `setInterval` swapping CSS classes on the hero word.
// Three mechanisms, three sets of timings, and one real performance problem —
// every scroll event called setState, so the whole 800-line page re-rendered
// on every frame of a scroll.
//
// Motion (prev Framer Motion, npm `motion`) does all three properly: parallax
// rides MotionValues that write to the DOM WITHOUT a React render, reveals are
// declarative, and exits are possible at all. Keeping the vocabulary in one
// file means the page reads as content rather than as animation plumbing, and
// the timings stay consistent across sections.
//
// ACCESSIBILITY IS NOT OPTIONAL HERE. Every primitive below collapses to a
// no-op under `prefers-reduced-motion`: content renders in its final state,
// parallax freezes at zero. A visitor who has asked for less motion gets a
// still page, never a broken one — and never a page with content stuck at
// opacity 0 because the animation that would have revealed it was skipped.

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

/** next/link with gesture props. `motion.create` is the v12+ API for wrapping
 *  a custom component; plain `motion(Link)` is the older spelling. */
export const MotionLink = motion.create(Link);

// ── Shared timings ──────────────────────────────────────────────────────────
// One set of numbers for the whole page. The reveal duration matches the 0.9s
// the old CSS transition used, so the page's rhythm is unchanged — only the
// mechanism is.

const REVEAL_DURATION_S = 0.9;
const REVEAL_DISTANCE_PX = 28;
/** Matches the old IntersectionObserver: threshold 0.18, bottom margin -8%. */
const VIEWPORT = { once: true, amount: 0.18, margin: '0px 0px -8% 0px' } as const;
/** A soft decelerating curve — the cubic-bezier the CSS used, as a named ease. */
const REVEAL_EASE = [0.2, 0.7, 0.2, 1] as const;

const revealVariants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE_PX },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION_S, ease: REVEAL_EASE },
  },
};

/** Children reveal one after another rather than as a single block. */
const staggerVariants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/**
 * Marks an element that Motion renders in a HIDDEN state on the server.
 *
 * Motion writes `initial` into the server HTML, so a reveal ships as
 * `opacity: 0` and only becomes visible once JavaScript hydrates. The page
 * still contains the text (crawlers that do not run JS can read it), but a
 * human with JS blocked or broken would see a blank marketing page. The
 * page pairs this attribute with a <noscript> rule whose `!important`
 * beats Motion's inline style, so no-JS visitors get the finished page instead
 * of an empty one. The old CSS `.reveal` class had the same flaw and no
 * fallback at all.
 */
export const REVEAL_MARKER = { 'data-reveal': '' } as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Hold the reveal back, e.g. to let a heading land before its body copy. */
  delay?: number;
  /** Cross-fade with no travel — for elements whose position is already
   *  animated by something else (a parallax wrapper, say). */
  fadeOnly?: boolean;
}

/**
 * Reveal a block as it scrolls into view. Replaces the `.reveal` class plus
 * the page's IntersectionObserver.
 */
export function Reveal({ children, className, delay = 0, fadeOnly = false }: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      {...REVEAL_MARKER}
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{
        hidden: { opacity: 0, y: fadeOnly ? 0 : REVEAL_DISTANCE_PX },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: REVEAL_DURATION_S, ease: REVEAL_EASE, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A reveal whose direct `RevealItem` children arrive in sequence. Use for
 * grids — nine feature cards appearing at once reads as a flash; the same nine
 * arriving over half a second reads as intent.
 */
export function RevealStagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      {...REVEAL_MARKER}
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={staggerVariants}
    >
      {children}
    </motion.div>
  );
}

/**
 * `Reveal` for a page landmark. Same behaviour, but renders a <section> so the
 * document outline survives the conversion — a reveal wrapper must not cost us
 * a semantic element.
 */
export function RevealSection({ children, className, delay = 0 }: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <section className={className}>{children}</section>;

  return (
    <motion.section
      {...REVEAL_MARKER}
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{
        hidden: { opacity: 0, y: REVEAL_DISTANCE_PX },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: REVEAL_DURATION_S, ease: REVEAL_EASE, delay },
        },
      }}
    >
      {children}
    </motion.section>
  );
}

/** One member of a `RevealStagger`. Inherits its state from the parent. */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div {...REVEAL_MARKER} className={className} variants={revealVariants}>
      {children}
    </motion.div>
  );
}

/**
 * CONTAINER-SAFE entrance: opacity only, never a transform.
 *
 * This is the primitive for anything that wraps other UI — feed cards, list
 * rows, page content. It exists because a transform on a container becomes the
 * containing block for every `position: fixed` descendant, which traps
 * overlays inside the card (see the rule at the top of this file). Opacity has
 * no such effect.
 *
 * Deliberately quicker and shorter than `Reveal`: a feed is scrolled, not
 * read top-to-bottom, so a long fade on every card reads as lag rather than
 * polish. Renders a plain wrapper under reduced motion.
 *
 * @param as  the element to render — feed rows are often <section>/<article>
 */
export function FadeIn({
  children, className, style, as = 'div', durationS = 0.28,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'section' | 'article' | 'li';
  durationS?: number;
}) {
  const reduced = useReducedMotion();
  const Tag = as;
  if (reduced) return <Tag className={className} style={style}>{children}</Tag>;

  const MotionTag = motion[as];
  return (
    <MotionTag
      {...REVEAL_MARKER}
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -4% 0px' }}
      transition={{ duration: durationS, ease: 'easeOut' }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * A MotionValue tracking page scroll, mapped for parallax.
 *
 * `y = (scrollY - offset) * factor`, which is exactly the arithmetic the inline
 * transform strings did — but the result is written straight to the element's
 * transform, so scrolling no longer re-renders the page. Returns a value
 * pinned at 0 under reduced motion.
 *
 * @param factor  how far this layer moves per pixel scrolled (negative = up)
 * @param offset  scroll position at which this layer sits at rest
 */
export function useParallax(factor: number, offset = 0): MotionValue<number> {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  return useTransform(scrollY, (v) => (reduced ? 0 : (v - offset) * factor));
}

/** Rotation companion to useParallax, in degrees. */
export function useParallaxRotate(factor: number): MotionValue<number> {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  return useTransform(scrollY, (v) => (reduced ? 0 : v * factor));
}

// ── Gesture presets ─────────────────────────────────────────────────────────
// Kept as objects rather than props so every call site animates identically.
// The transition lives INSIDE each gesture object on purpose: a `transition`
// prop on the element does NOT apply to whileHover/whileTap.

/** Primary call-to-action: lifts on hover, presses in on tap. The tap state
 *  matters most on touch, where there is no hover to give feedback. */
export const ctaMotion = {
  whileHover: { y: -2, scale: 1.02, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } },
  whileTap: { scale: 0.97, y: 0, transition: { duration: 0.1 } },
};

/** Secondary/ghost buttons and text links — the same idea, quieter. */
export const linkMotion = {
  whileHover: { x: 3, transition: { type: 'spring' as const, stiffness: 400, damping: 30 } },
  whileTap: { scale: 0.98, transition: { duration: 0.1 } },
};

/** Decorative cards that invite a look but are not interactive targets. */
export const cardHoverMotion = {
  whileHover: { y: -6, scale: 1.015, transition: { type: 'spring' as const, stiffness: 300, damping: 22 } },
};
