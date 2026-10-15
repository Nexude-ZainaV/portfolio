// guard.ts: decides whether a language model's reply is finished enough to send.
// Test: npx tsx guard.test.ts
// Came from support replies that were cut off mid-sentence (9 of the first 12)
// while their tickets still closed. A successful call doesn't mean the model finished.

/**
 * The finish reason a model reports when it stopped on its own. Providers
 * spell their finish reasons differently, so map yours to this value first.
 */
export const CLEAN_FINISH = 'STOP';

/** Shorter than this is a fragment, not an answer. A tuning value, not a law. */
export const MIN_REPLY_CHARS = 120;

// Sentence punctuation, a closing bracket or quote, or an emoji. A truncated
// reply usually ends on a dash, a comma or a bare word.
// \u201D and \u2019 are the typographic closing double and single quotes.
const SENTENCE_END = /[.!?…)\]"'\u201D\u2019\p{Extended_Pictographic}]\s*$/u;

/**
 * True only when all three hold: a clean stop, long enough to be an answer,
 * and it ends like a sentence. Any other finish reason, including none at all,
 * fails: the model's reasoning had been using up the output limit, and the old
 * code accepted any non-empty text.
 */
export function isCompleteReply(
  text: string | null | undefined,
  finishReason: string | undefined,
  minChars: number = MIN_REPLY_CHARS,
): boolean {
  const t = (text ?? '').trim();
  if (finishReason !== CLEAN_FINISH) return false;
  if (t.length < minChars) return false;
  return SENTENCE_END.test(t);
}

/**
 * Pick what to send: the model's reply if it is complete, the prepared one if
 * not. The prepared reply is the safe default, so a member never gets half an
 * answer.
 */
export function chooseReply(
  model: { text?: string; finishReason?: string } | null,
  prepared: string,
): { reply: string; usedModel: boolean } {
  if (model && isCompleteReply(model.text, model.finishReason)) {
    return { reply: model.text!.trim(), usedModel: true };
  }
  return { reply: prepared, usedModel: false };
}
