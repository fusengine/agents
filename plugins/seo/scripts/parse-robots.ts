#!/usr/bin/env bun
/**
 * parse-robots.ts — Validate robots.txt directives
 * Usage: bun parse-robots.ts <url-or-path>
 */

interface Report {
  userAgents: string[];
  sitemaps: string[];
  disallow: Record<string, string[]>;
  allow: Record<string, string[]>;
  crawlDelay: Record<string, number>;
  issues: string[];
}

/** Fetch text from URL or local path. Throws on non-2xx HTTP or missing file. */
async function fetchText(i: string): Promise<string> {
  if (/^https?:\/\//.test(i)) {
    const r = await fetch(i);
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${i}`);
    return r.text();
  }
  return Bun.file(i).text();
}

/** Parse robots.txt directives into a structured report. */
function parseRobots(txt: string): Report {
  const lines = txt.split("\n").map(l => l.replace(/#.*$/, "").trim()).filter(Boolean);
  const report: Report = { userAgents: [], sitemaps: [], disallow: {}, allow: {}, crawlDelay: {}, issues: [] };
  let agent = "*";
  for (const line of lines) {
    const [k, ...rest] = line.split(":");
    const key = k.trim().toLowerCase();
    const value = rest.join(":").trim();
    switch (key) {
      case "user-agent":
        agent = value;
        if (!report.userAgents.includes(agent)) report.userAgents.push(agent);
        report.disallow[agent] ??= [];
        report.allow[agent] ??= [];
        break;
      case "disallow": report.disallow[agent]?.push(value); break;
      case "allow": report.allow[agent]?.push(value); break;
      case "sitemap": report.sitemaps.push(value); break;
      case "crawl-delay": report.crawlDelay[agent] = Number(value); break;
    }
  }
  if (report.sitemaps.length === 0) report.issues.push("No Sitemap directive — recommended");
  if (report.disallow["*"]?.includes("/")) report.issues.push("Disallow: / on * blocks ALL crawlers");
  return report;
}

const input = process.argv[2];
if (!input) { console.error("Usage: bun parse-robots.ts <url-or-path>"); process.exit(1); }

try {
  console.log(JSON.stringify(parseRobots(await fetchText(input)), null, 2));
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
