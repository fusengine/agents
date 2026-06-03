/**
 * content-intel-keywords.ts — Keyword density, n-grams and stuffing detection.
 */
import { STOP_WORDS, type CliOptions, type Issue, type NgramStat, type Report, type TermStat } from "./content-intel-types";
import { countPhrase, includesTerm, wordsOf } from "./content-intel-text";

/** Top repeated n-grams of a given size (count > 1). */
export function topNgrams(words: string[], size: 2 | 3 | 4 | 5, limit = 12): NgramStat[] {
  const counts = new Map<string, number>();
  for (let i = 0; i <= words.length - size; i += 1) {
    const phraseWords = words.slice(i, i + size);
    if (phraseWords.every((word) => STOP_WORDS.has(word))) continue;
    counts.set(phraseWords.join(" "), (counts.get(phraseWords.join(" ")) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([phrase, count]) => ({ phrase, count }));
}

/** Single words repeated 5+ times (length >= 4, non stop-word). */
export function repeatedWords(words: string[]): NgramStat[] {
  const counts = new Map<string, number>();
  for (const word of words) {
    if (word.length < 4 || STOP_WORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 5)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([phrase, count]) => ({ phrase, count }));
}

/** Occurrence/density stats for a single term. */
export function termStats(term: string, text: string, title: string, h1s: string[], totalWords: number): TermStat {
  const count = countPhrase(text, term);
  return {
    term,
    count,
    density: totalWords ? Number(((count * wordsOf(term).length / totalWords) * 100).toFixed(2)) : 0,
    inTitle: includesTerm(title, term),
    inH1: h1s.some((h1) => includesTerm(h1, term)),
  };
}

/** Group near-duplicate phrase patterns (shared first 3 content words). */
export function similarRepeatedPhrases(ngrams: NgramStat[]): NgramStat[] {
  const grouped = new Map<string, number>();
  for (const item of ngrams) {
    const key = wordsOf(item.phrase).filter((w) => !STOP_WORDS.has(w)).slice(0, 3).join(" ");
    if (!key) continue;
    grouped.set(key, (grouped.get(key) ?? 0) + item.count);
  }
  return [...grouped.entries()].filter(([, count]) => count >= 4).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([phrase, count]) => ({ phrase, count }));
}

/** Dense repetition windows (50-word sliding) for the given terms. */
export function localWindows(words: string[], terms: string[]): Array<{ term: string; windowStart: number; count: number }> {
  const out: Array<{ term: string; windowStart: number; count: number }> = [];
  const normalizedTerms = terms.map((term) => ({ raw: term, tokens: wordsOf(term) })).filter((t) => t.tokens.length);
  for (let i = 0; i < words.length; i += 25) {
    const slice = words.slice(i, i + 50).join(" ");
    for (const term of normalizedTerms) {
      const count = slice.split(term.tokens.join(" ")).length - 1;
      if (count >= 3) out.push({ term: term.raw, windowStart: i, count });
    }
  }
  return out.slice(0, 20);
}

/** Full keyword report: density, n-grams, multi-signal stuffing score. */
export function analyzeKeywords(text: string, title: string, h1s: string[], opts: CliOptions): Report["keywords"] {
  const words = wordsOf(text);
  const exact = termStats(opts.keyword, text, title, h1s, words.length);
  const variants = opts.synonyms.map((term) => termStats(term, text, title, h1s, words.length));
  const ngrams = { "2": topNgrams(words, 2), "3": topNgrams(words, 3), "4": topNgrams(words, 4), "5": topNgrams(words, 5) };
  const repeated = repeatedWords(words);
  const repeatedSimilarPhrases = similarRepeatedPhrases([...ngrams["3"], ...ngrams["4"], ...ngrams["5"]]);
  const localRepetitionWindows = localWindows(words, [opts.keyword, ...opts.synonyms]);
  const stuffingSignals: Issue[] = [];
  if (exact.density > 3.5) stuffingSignals.push({ level: "warning", message: "High exact keyword density", detail: `${exact.density}%` });
  if (exact.count >= 10 && variants.every((v) => v.count === 0)) stuffingSignals.push({ level: "warning", message: "Exact keyword repeated without synonym support" });
  if (repeated[0]?.count >= Math.max(8, words.length * 0.025)) stuffingSignals.push({ level: "warning", message: "Dominant repeated word", detail: `${repeated[0].phrase}: ${repeated[0].count}` });
  if (localRepetitionWindows.length >= 2) stuffingSignals.push({ level: "warning", message: "Clustered local keyword repetition", detail: `${localRepetitionWindows.length} dense windows` });
  if (repeatedSimilarPhrases.length >= 4) stuffingSignals.push({ level: "warning", message: "Repeated similar phrase patterns", detail: `${repeatedSimilarPhrases.length} phrase groups` });
  const stuffingScore = Math.min(100, stuffingSignals.length * 18 + Math.max(0, exact.density - 2) * 8 + localRepetitionWindows.length * 4);
  return { exact, variants, repeatedWords: repeated, ngrams, repeatedSimilarPhrases, localRepetitionWindows, stuffingScore: Number(stuffingScore.toFixed(1)), stuffingSignals };
}
