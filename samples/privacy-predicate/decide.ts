// decide.ts — ONE answer to "may we show this person's name here?"
//
// Extracted and generalised from a production privacy fix. Run the test with:
//   npx tsx decide.test.ts
//
// THE PROBLEM. A community product lets people react to posts. The list of
// who reacted hid some people; the notification sent to the post's author
// named them. Two parts of the system were answering the same privacy
// question with two different rules, so the stricter one was simply bypassed
// by the looser one. Patching the looser rule would have left two rules that
// happened to agree today. The fix was to make there be only one.
//
// THE SECOND LESSON. The first version of this function only knew about the
// person's ACCOUNT settings. But the list also hid people for reasons that
// depend on the THREAD — anyone who had posted anonymously in it. A function
// that takes only a user can't answer a question that depends on where the
// user is. So the thread facts are inputs here too.
//
// DESIGN
//   - Pure: no I/O. A separate loader gathers the facts; this decides. That
//     split is what makes it testable exhaustively (see decide.test.ts).
//   - Fails closed: if any fact could not be established, the person is
//     masked. Naming someone who asked not to be named is irreversible;
//     calling a public person "Someone" is merely vague.

/** What a masked person is called when they have no pseudonym. */
export const MASKED_LABEL = 'Someone';

export interface IdentityFacts {
  /** The person asked for every reaction they leave to be unattributed. */
  alwaysAnonymous: boolean;
  /** The person presents publicly under a pseudonym. */
  pseudonymMode: boolean;
  pseudonym: string | null;
  displayName: string | null;
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
 *   pseudonym  when they present under one — that IS their public identity.
 *   name       otherwise.
 */
export function decideLabel(f: IdentityFacts): string {
  const bareMask =
    !f.factsComplete ||
    f.alwaysAnonymous ||
    f.isAnonymousAuthorHere ||
    f.hasAnonymousPostHere;

  if (bareMask) return MASKED_LABEL;
  if (f.pseudonymMode) return f.pseudonym || MASKED_LABEL;
  return f.displayName || MASKED_LABEL;
}
