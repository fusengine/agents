/**
 * content-intel-page.ts — HTML fetch/extract + meta and heading analysis.
 */
import * as cheerio from "cheerio";
import { type CliOptions, type HeadingItem, type Issue, type Report } from "./content-intel-types";
import { cleanText, includesTerm, jaccardSimilarity, normalize, wordsOf } from "./content-intel-text";

/** Fetch HTML from a URL or read a local file. Throws on non-2xx HTTP. */
export async function fetchHtml(input: string): Promise<string> {
  if (/^https?:\/\//.test(input)) {
    const res = await fetch(input);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${input}`);
    return res.text();
  }
  return Bun.file(input).text();
}

/** Extract title, meta description, headings, paragraphs and body text. */
export function extractContent(html: string) {
  const $ = cheerio.load(html);
  const title = cleanText($("title").first().text());
  const description = cleanText($("meta[name='description']").attr("content") ?? "");
  $("script,style,nav,footer,header,aside,noscript,svg").remove();
  const headingItems: HeadingItem[] = [];
  $("h1,h2,h3").each((_, el) => {
    const level = el.tagName.toLowerCase() as HeadingItem["level"];
    headingItems.push({ level, text: cleanText($(el).text()) });
  });
  const paragraphs = $("p").map((_, el) => cleanText($(el).text())).get().filter(Boolean);
  const bodyText = cleanText($("body").text());
  const fullText = cleanText([title, description, ...headingItems.map((h) => h.text), bodyText].filter(Boolean).join(" "));
  return { title, description, headingItems, paragraphs, bodyText, fullText };
}

/** Title/description length, brand-in-title and title↔H1 similarity checks. */
export function analyzeMeta(title: string, description: string, h1s: string[], opts: CliOptions): Report["meta"] {
  const issues: Issue[] = [];
  if (!title) issues.push({ level: "error", message: "Missing title" });
  if (title.length > 60) issues.push({ level: "warning", message: "Title exceeds 60 characters", detail: `${title.length} chars` });
  if (!description) issues.push({ level: "warning", message: "Missing meta description" });
  if (description.length > 150) issues.push({ level: "warning", message: "Description exceeds 150 characters", detail: `${description.length} chars` });
  if (opts.brand && !opts.allowBrandTitle && includesTerm(title, opts.brand)) {
    issues.push({ level: "warning", message: "Brand appears in title", detail: "Pass --allow-brand-title to suppress" });
  }
  const bestH1Similarity = Math.max(0, ...h1s.map((h1) => jaccardSimilarity(title, h1)));
  if (title && h1s.length && bestH1Similarity < 0.25) issues.push({ level: "warning", message: "Title and H1 appear semantically distant", detail: `${bestH1Similarity}` });
  const titleOrH1 = [title, ...h1s].join(" ");
  if (![opts.keyword, ...opts.synonyms].some((term) => includesTerm(titleOrH1, term))) {
    issues.push({ level: "warning", message: "Keyword or synonym missing from title/H1" });
  }
  return { title, titleLength: title.length, description, descriptionLength: description.length, h1: h1s, titleH1Similarity: bestH1Similarity, issues };
}

/** Heading keyword coverage + exact-match overuse + empty-heading detection. */
export function analyzeHeadings(headings: HeadingItem[], opts: CliOptions): Report["headings"] {
  const terms = [opts.keyword, ...opts.synonyms];
  const coverage: Record<string, string[]> = {};
  const issues: Issue[] = [];
  for (const term of terms) coverage[term] = headings.filter((h) => includesTerm(h.text, term)).map((h) => `${h.level}: ${h.text}`);
  const exactMatches = headings.filter((h) => normalize(h.text) === normalize(opts.keyword)).length;
  const exactMatchOveruse = exactMatches >= 2;
  if (exactMatchOveruse) issues.push({ level: "warning", message: "Exact-match heading overuse", detail: `${exactMatches} exact headings` });
  const emptyHeadingSections = headings.filter((h) => wordsOf(h.text).length === 0).map((h) => h.level);
  if (emptyHeadingSections.length) issues.push({ level: "warning", message: "Empty heading text found", detail: emptyHeadingSections.join(", ") });
  if (!headings.some((h) => h.level === "h2" && terms.some((term) => includesTerm(h.text, term)))) {
    issues.push({ level: "info", message: "No H2 covers keyword or synonym" });
  }
  return { items: headings, coverage, exactMatchOveruse, emptyHeadingSections, issues };
}

/** Thin-content risk from word count, paragraph count and heading count. */
export function thinRisk(words: number, paragraphs: number, headings: number): "low" | "medium" | "high" {
  if (words < 300 || paragraphs < 2) return "high";
  if (words < 700 || headings < 2) return "medium";
  return "low";
}
