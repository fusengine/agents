/**
 * content-intel-local.ts — Local-term distribution + city-list stuffing detection.
 */
import { SERVICE_TERMS, type CliOptions, type Issue, type Report } from "./content-intel-types";
import { findTokenSequence, includesTerm, sentencesOf, wordsOf } from "./content-intel-text";

/** True when a location sits near a service/keyword term in the sentence. */
function nearbyContext(sentence: string, location: string, terms: string[]): boolean {
  if (!includesTerm(sentence, location)) return false;
  const sentenceWords = wordsOf(sentence);
  if (terms.some((term) => includesTerm(sentence, term))) return true;
  const locIndex = findTokenSequence(sentenceWords, wordsOf(location));
  const serviceIndex = sentenceWords.findIndex((word) => SERVICE_TERMS.includes(word));
  return serviceIndex >= 0 && locIndex >= 0 && Math.abs(serviceIndex - locIndex) <= 15;
}

/** Per-location mention/context distribution + comma-list stuffing signals. */
export function analyzeLocal(text: string, opts: CliOptions): Report["local"] {
  const sentences = sentencesOf(text);
  const terms = [opts.keyword, ...opts.synonyms, ...SERVICE_TERMS];
  const distribution = opts.locations.map((location) => {
    const matching = sentences.filter((sentence) => includesTerm(sentence, location));
    const contextualMentions = matching.filter((sentence) => nearbyContext(sentence, location, terms)).length;
    const stuffingSignals: string[] = [];
    if (matching.length > 0 && contextualMentions === 0) stuffingSignals.push("mentioned without nearby service or keyword context");
    return { location, mentions: matching.length, contextualMentions, stuffingSignals };
  });
  const listStuffing: Issue[] = [];
  for (const sentence of sentences) {
    const locationsInSentence = opts.locations.filter((location) => includesTerm(sentence, location));
    if (locationsInSentence.length > 4) listStuffing.push({ level: "warning", message: "Many locations in one sentence", detail: locationsInSentence.join(", ") });
    if (locationsInSentence.length >= 3 && /^[\w\s,'-]+[.!?]?$/.test(sentence) && (sentence.match(/,/g) ?? []).length >= locationsInSentence.length - 1) {
      listStuffing.push({ level: "warning", message: "Possible comma-only location list", detail: sentence.slice(0, 180) });
    }
  }
  return { distribution, listStuffing };
}
