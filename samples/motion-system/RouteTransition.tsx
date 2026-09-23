'use client';

// RouteTransition.tsx — a short cross-fade between pages.
//
// Mounted ONCE in the root layout, so every page gets the same transition
// without any of them knowing about it — including inside mobile WebView
// shells, which run the same web code.
//
// OPACITY ONLY, AND THAT IS NOT A STYLE CHOICE. This wraps every page, which
// means it wraps the app's fixed chrome and every modal, sheet and overlay any
// page mounts. A transform here would become the containing block for all of
// them and pin them inside the page instead of the viewport — the same hazard
// documented at the top of components/motion, but platform-wide. There is no
// `y` on this element, ever.
//
// It also keeps `mode="wait"` OFF on purpose. Waiting for the old page to
// leave before the new one enters adds the exit duration to every navigation,
// which on a mid-range phone over mobile data is latency the user feels. The
// pages cross-fade instead.

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/** Short enough to read as responsiveness rather than as an animation. */
const FADE_S = 0.18;

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // Reduced motion gets no cross-fade at all. A fade is a motion effect even
  // without movement, and the point of the setting is fewer of them.
  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: FADE_S, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
