#!/usr/bin/env bun
/**
 * geo-score.ts — LLM-readiness scoring (0-100) for AI search engines
 * Usage: bun geo-score.ts <url-or-path>
 */
import * as cheerio from "cheerio";

interface Signal { name: string; weight: number; pass: boolean; detail?: string }

/** Fetch HTML from URL or local path. Throws on non-2xx HTTP or missing file. */
async function fetchHtml(i: string): Promise<string> {
  if (/^https?:\/\//.test(i)) {
    const r = await fetch(i);
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${i}`);
    return r.text();
  }
  return Bun.file(i).text();
}

/** Score HTML against 10 LLM-readiness signals. Returns weighted signals. */
function score(html: string): Signal[] {
  const $ = cheerio.load(html);
  const out: Signal[] = [];
  const first = $("article p, main p, .content p, body p").first().text();
  const wc = first.split(/\s+/).filter(Boolean).length;
  out.push({ name: "Quick answer first 100 words", weight: 15, pass: wc >= 30 && wc <= 100, detail: `${wc} words` });
  const qH2 = $("h2").filter((_, el) => /^(what|why|how|when|where|who|is|are|can|should|do)/i.test($(el).text())).length;
  out.push({ name: "Direct H2 questions", weight: 10, pass: qH2 >= 1 });
  out.push({ name: "Tables/lists", weight: 10, pass: ($("table").length + $("ul, ol").length) >= 2 });
  const links = $("a[href^='http']").length;
  out.push({ name: "External citations", weight: 15, pass: links >= 3, detail: `${links} links` });
  out.push({ name: "Author bio", weight: 10, pass: $("[rel='author'], .author, [itemtype*='Person']").length > 0 });
  out.push({ name: "Schema.org markup", weight: 10, pass: $("script[type='application/ld+json']").length >= 1 });
  const dm = $("time[datetime], [itemprop='dateModified']").attr("datetime") ?? null;
  const recent = dm ? (Date.now() - new Date(dm).getTime()) < 365 * 86400000 : false;
  out.push({ name: "Recent update < 12mo", weight: 10, pass: recent, detail: dm ?? "no date" });
  const stats = ($("body").text().match(/\d{1,3}(?:[,.]\d{3})*\s*(?:%|percent|users|customers)/gi) ?? []).length;
  out.push({ name: "Statistics", weight: 10, pass: stats >= 2 });
  out.push({ name: "SSR content", weight: 5, pass: $("body").text().trim().length > 500 });
  out.push({ name: "llms.txt (manual check)", weight: 5, pass: false, detail: "check /llms.txt" });
  return out;
}

const input = process.argv[2];
if (!input) { console.error("Usage: bun geo-score.ts <url-or-path>"); process.exit(1); }

try {
  const signals = score(await fetchHtml(input));
  const total = signals.filter(s => s.pass).reduce((a, s) => a + s.weight, 0);
  console.log(JSON.stringify({
    score: total,
    maxScore: 100,
    grade: total >= 80 ? "A" : total >= 60 ? "B" : total >= 40 ? "C" : total >= 20 ? "D" : "F",
    signals,
  }, null, 2));
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
