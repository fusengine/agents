/**
 * content-intel-types.ts — Shared types + constants for SEO Content Intelligence.
 */

export type OutputFormat = "json" | "markdown";

export interface CliOptions {
  input: string;
  keyword: string;
  synonyms: string[];
  locations: string[];
  brand: string | null;
  allowBrandTitle: boolean;
  format: OutputFormat;
}

export interface HeadingItem { level: "h1" | "h2" | "h3"; text: string }
export interface TermStat { term: string; count: number; density: number; inTitle: boolean; inH1: boolean }
export interface Issue { level: "info" | "warning" | "error"; message: string; detail?: string }
export interface NgramStat { phrase: string; count: number }
export interface LocalSignal { location: string; mentions: number; contextualMentions: number; stuffingSignals: string[] }

export interface Report {
  input: string;
  target: { keyword: string; synonyms: string[]; locations: string[]; brand: string | null };
  metrics: {
    chars: number;
    words: number;
    sentences: number;
    paragraphs: number;
    headings: { h1: number; h2: number; h3: number; total: number };
    thinContentRisk: "low" | "medium" | "high";
  };
  meta: {
    title: string;
    titleLength: number;
    description: string;
    descriptionLength: number;
    h1: string[];
    titleH1Similarity: number;
    issues: Issue[];
  };
  headings: {
    items: HeadingItem[];
    coverage: Record<string, string[]>;
    exactMatchOveruse: boolean;
    emptyHeadingSections: string[];
    issues: Issue[];
  };
  keywords: {
    exact: TermStat;
    variants: TermStat[];
    repeatedWords: NgramStat[];
    ngrams: Record<"2" | "3" | "4" | "5", NgramStat[]>;
    repeatedSimilarPhrases: NgramStat[];
    localRepetitionWindows: Array<{ term: string; windowStart: number; count: number }>;
    stuffingScore: number;
    stuffingSignals: Issue[];
  };
  local: { distribution: LocalSignal[]; listStuffing: Issue[] };
  warnings: string[];
}

export const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "de", "des", "du", "en", "et", "for", "from", "in", "is", "la", "le", "les",
  "of", "on", "or", "pour", "that", "the", "to", "un", "une", "with", "your", "vous", "vos", "notre", "nos", "dans",
]);

export const SERVICE_TERMS = [
  "service", "services", "solution", "solutions", "agency", "agence", "expert", "experts", "consultant", "creation", "création",
  "website", "site", "web", "seo", "marketing", "development", "développement", "design", "audit", "local", "business",
];
