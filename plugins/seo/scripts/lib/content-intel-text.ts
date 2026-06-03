/**
 * content-intel-text.ts — Pure text utilities for content analysis (no I/O).
 */
import { STOP_WORDS } from "./content-intel-types";

/** Collapse whitespace and trim. */
export function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** Lowercase, strip diacritics, collapse whitespace. */
export function normalize(value: string): string {
  return cleanText(value).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Tokenize into normalized word tokens (keeps internal '/- ). */
export function wordsOf(value: string): string[] {
  return normalize(value).match(/[a-z0-9]+(?:['-][a-z0-9]+)?/gi) ?? [];
}

/** Split into sentences with more than two words. */
export function sentencesOf(value: string): string[] {
  return cleanText(value).split(/(?<=[.!?])\s+|\n+/).map(cleanText).filter((s) => wordsOf(s).length > 2);
}

/** Count occurrences of a phrase (word-normalized) inside text. */
export function countPhrase(text: string, phrase: string): number {
  const target = wordsOf(phrase).join(" ");
  if (!target) return 0;
  const haystack = wordsOf(text).join(" ");
  return haystack.split(target).length - 1;
}

/** True when the phrase appears at least once. */
export function includesTerm(text: string, term: string): boolean {
  return countPhrase(text, term) > 0;
}

/** Jaccard similarity (0-1) of two strings, stop-words removed. */
export function jaccardSimilarity(a: string, b: string): number {
  const left = new Set(wordsOf(a).filter((w) => !STOP_WORDS.has(w)));
  const right = new Set(wordsOf(b).filter((w) => !STOP_WORDS.has(w)));
  if (left.size === 0 || right.size === 0) return 0;
  const intersection = [...left].filter((w) => right.has(w)).length;
  return Number((intersection / new Set([...left, ...right]).size).toFixed(2));
}

/** Index of the first occurrence of a token sequence, or -1. */
export function findTokenSequence(words: string[], sequence: string[]): number {
  if (!sequence.length || sequence.length > words.length) return -1;
  for (let i = 0; i <= words.length - sequence.length; i += 1) {
    if (sequence.every((token, offset) => words[i + offset] === token)) return i;
  }
  return -1;
}
