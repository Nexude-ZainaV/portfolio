// decide.ts: the one answer to "may we show this person's name here?"
// Test: npx tsx decide.test.ts
// Came from a leak where the reactions list hid people but the author's
// notification named them. Two rules for one question; now there is one.

/** What a masked person is called when they have no pseudonym. */
export const MASKED_LABEL = 'Someone';

// Plain facts, gathered by a separate loader. Keeping this file free of I/O is
// what lets the test try every combination.
export interface IdentityFacts {
  /** The person asked for every reaction they leave to be unattributed. */
  alwaysAnonymous: boolean;
  /** The person presents publicly under a pseudonym. */
  pseudonymMode: boolean;
  pseudonym: string | null;
  displayName: string | null;
  // The thread facts are here because masking also depends on WHERE the
  // person is, not only on their account settings. The first version missed
  // this and named people who had posted anonymously in the thread.
  /** The person is the anonymous author of this thread. */
  isAnonymousAuthorHere: boolean;
  /** The person has posted anonymously somewhere in this thread. */
  hasAnonymousPostHere: boolean;
  /**
   * Did every lookup succeed? false means a privacy question could not be
   * answered, and an unanswered privacy question must resolve to "mask".
   */
  factsComplete: boolean;
}

/**
 * The label to show for a person in this context.
 *
 *   bare mask  when they are anonymous IN THIS THREAD, or asked never to be
 *              attributed, or the facts are incomplete. A pseudonym is
 *              withheld here on purpose: it is the same on every thread, so
 *              showing it would swap a name leak for a correlation leak.
 *   pseudonym  when they present under one; that is their public identity.
 *   name       otherwise.
 */
export function decideLabel(f: IdentityFacts): string {
  // Fails closed. Naming someone who asked not to be named can't be undone;
  // calling a public person "Someone" is only vague.
  const bareMask =
    !f.factsComplete ||
    f.alwaysAnonymous ||
    f.isAnonymousAuthorHere ||
    f.hasAnonymousPostHere;

  if (bareMask) return MASKED_LABEL;
  // A missing pseudonym or name also masks, so the label is never empty and
  // pseudonym mode never falls through to the real name.
  if (f.pseudonymMode) return f.pseudonym || MASKED_LABEL;
  return f.displayName || MASKED_LABEL;
}
