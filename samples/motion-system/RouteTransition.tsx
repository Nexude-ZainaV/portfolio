'use client';

// RouteTransition.tsx: a short cross-fade between pages.
// Mount it once in the root layout and every page gets the same transition,
// mobile WebView shells included (they run the same web code).

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

  // No mode="wait": waiting for the old page to leave adds its exit time to
  // every navigation, which a mid-range phone on mobile data makes you feel.
  // Opacity only: this wraps the fixed chrome and every modal a page mounts,
  // and a transform would pin them inside the page (see FadeIn in index.tsx).
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
