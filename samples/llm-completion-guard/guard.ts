// guard.ts — decide whether a language model's reply is finished enough to send.
//
// WHY THIS EXISTS. An automated support assistant drafted replies to members.
// Nine of its first twelve replies were cut off mid-sentence ("Thank you so
// much for your sweet words—" and then the signature), and each ticket was
// then marked resolved. The model's own reasoning was spending most of the
// output budget, and the code accepted any non-empty text. A successful API
// response means the model answered. It does not mean the model finished.
//
// THE RULE. Use the model's text only when all three hold:
//   1. the model reports a clean stop (not "ran out of tokens"),
//   2. the text is long enough to be an answer,
//   3. it ends like a sentence, not on a dash or half a word.
// Otherwise send the prepared reply. The fallback is the safe default.

/** The finish reason a model reports when it stopped on its own. */
export const CLEAN_FINISH = 'STOP';

/** Shorter than this is a fragment, not an answer. A tuning value, not a law. */
export const MIN_REPLY_CHARS = 120;

// Sentence punctuation, a closing bracket or quote, or an emoji. A truncated
// reply usually ends on a dash, a comma or a bare word.
const SENTENCE_END = /[.!?…)\]"'”’\p{Extended_Pictographic}]\s*$/u;

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

/** Pick what to send: the model's reply if it is complete, the prepared one if not. */
export function chooseReply(
  model: { text?: string; finishReason?: string } | null,
  prepared: string,
): { reply: string; usedModel: boolean } {
  if (model && isCompleteReply(model.text, model.finishReason)) {
    return { reply: model.text!.trim(), usedModel: true };
  }
  return { reply: prepared, usedModel: false };
}
