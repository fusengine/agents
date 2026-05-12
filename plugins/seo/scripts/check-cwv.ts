#!/usr/bin/env bun
/**
 * check-cwv.ts — Core Web Vitals via Lighthouse Node API
 * Usage: bun check-cwv.ts <url>
 * Requires: bun add lighthouse chrome-launcher
 */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

interface CwvMetric { value: number; unit: string; target: number; pass: boolean }
interface CwvReport { url: string; performanceScore: number; metrics: Record<string, CwvMetric> }

/** Run Lighthouse on a URL and return CWV report. Throws on Lighthouse failure. */
async function runLighthouse(url: string): Promise<CwvReport> {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless", "--no-sandbox"] });
  try {
    const result = await lighthouse(url, { port: chrome.port, onlyCategories: ["performance"], output: "json" });
    if (!result) throw new Error("Lighthouse returned no result");
    const lhr = result.lhr;
    const lcp = lhr.audits["largest-contentful-paint"]?.numericValue ?? 0;
    const cls = lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0;
    const tbt = lhr.audits["total-blocking-time"]?.numericValue ?? 0;
    const fcp = lhr.audits["first-contentful-paint"]?.numericValue ?? 0;
    return {
      url,
      performanceScore: Math.round((lhr.categories.performance.score ?? 0) * 100),
      metrics: {
        LCP: { value: lcp, unit: "ms", target: 2500, pass: lcp < 2500 },
        INP_proxy_TBT: { value: tbt, unit: "ms", target: 200, pass: tbt < 200 },
        CLS: { value: cls, unit: "score", target: 0.1, pass: cls < 0.1 },
        FCP: { value: fcp, unit: "ms", target: 1800, pass: fcp < 1800 },
      },
    };
  } finally {
    await chrome.kill();
  }
}

const url = process.argv[2];
if (!url) { console.error("Usage: bun check-cwv.ts <url>"); process.exit(1); }

try {
  console.log(JSON.stringify(await runLighthouse(url), null, 2));
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
