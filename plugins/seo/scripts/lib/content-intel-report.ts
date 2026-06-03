/**
 * content-intel-report.ts — Assemble the full report and render markdown.
 */
import { type CliOptions, type Report } from "./content-intel-types";
import { sentencesOf, wordsOf } from "./content-intel-text";
import { analyzeKeywords } from "./content-intel-keywords";
import { analyzeHeadings, analyzeMeta, extractContent, fetchHtml, thinRisk } from "./content-intel-page";
import { analyzeLocal } from "./content-intel-local";

/** Fetch, parse and analyze the input into a full content-intelligence Report. */
export async function buildReport(opts: CliOptions): Promise<Report> {
  const html = await fetchHtml(opts.input);
  const content = extractContent(html);
  const h1s = content.headingItems.filter((h) => h.level === "h1").map((h) => h.text);
  const h2Count = content.headingItems.filter((h) => h.level === "h2").length;
  const h3Count = content.headingItems.filter((h) => h.level === "h3").length;
  const words = wordsOf(content.fullText);
  const sentences = sentencesOf(content.bodyText);
  const headings = content.headingItems.length;
  return {
    input: opts.input,
    target: { keyword: opts.keyword, synonyms: opts.synonyms, locations: opts.locations, brand: opts.brand },
    metrics: {
      chars: content.fullText.length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: content.paragraphs.length,
      headings: { h1: h1s.length, h2: h2Count, h3: h3Count, total: headings },
      thinContentRisk: thinRisk(words.length, content.paragraphs.length, headings),
    },
    meta: analyzeMeta(content.title, content.description, h1s, opts),
    headings: analyzeHeadings(content.headingItems, opts),
    keywords: analyzeKeywords(content.fullText, content.title, h1s, opts),
    local: analyzeLocal(content.bodyText, opts),
    warnings: [],
  };
}

/** Render a concise markdown summary of the report. */
export function markdown(report: Report): string {
  const lines = [
    `# SEO Content Intelligence`,
    ``,
    `- Input: ${report.input}`,
    `- Keyword: ${report.target.keyword}`,
    `- Words: ${report.metrics.words}`,
    `- Characters: ${report.metrics.chars}`,
    `- Thin content risk: ${report.metrics.thinContentRisk}`,
    `- Exact density: ${report.keywords.exact.density}% (${report.keywords.exact.count} occurrences)`,
    `- Keyword stuffing score: ${report.keywords.stuffingScore}/100`,
    ``,
    `## Meta`,
    `- Title (${report.meta.titleLength}): ${report.meta.title || "(missing)"}`,
    `- Description (${report.meta.descriptionLength}): ${report.meta.description || "(missing)"}`,
    `- Title/H1 similarity: ${report.meta.titleH1Similarity}`,
    ``,
    `## Issues`,
    ...[...report.meta.issues, ...report.headings.issues, ...report.keywords.stuffingSignals, ...report.local.listStuffing]
      .map((issue) => `- [${issue.level}] ${issue.message}${issue.detail ? ` — ${issue.detail}` : ""}`),
  ];
  if (report.warnings.length) lines.push(``, `## Warnings`, ...report.warnings.map((warning) => `- ${warning}`));
  return lines.join("\n");
}
