#!/usr/bin/env bun
/**
 * doc-cache-inject.ts - SubagentStart hook for research-expert
 * Injects cached documentation summaries into research-expert context.
 * Doc saving is handled by cache-doc-from-transcript.ts (SubagentStop).
 * Replaces doc-cache-inject.sh
 */
import { readStdin, projectHash, cacheBaseDir, cacheAge, readJsonFile, readTextFile, outputHookResponse } from "./lib/core";
import { logCacheEvent } from "./lib/analytics";
import type { HookInput, HookOutput } from "./lib/interfaces/hook.interface";
import type { CacheIndex, CacheEntry } from "./lib/interfaces/cache.interface";

const TTL_SECONDS = 604800; // 7 days
const MAX_SIZE = 8192; // 8KB cap
/** Build context string from cached doc entries (dedup by hash to avoid re-reading same synthesis) */
async function buildDocsContext(entries: CacheEntry[], docsDir: string): Promise<{ ctx: string; count: number; maxAge: number }> {
  let ctx = "";
  let count = 0;
  let maxAge = 0;
  const seen = new Set<string>();

  for (const entry of entries) {
    if (!entry.timestamp) continue;
    const age = cacheAge(entry.timestamp);
    if (age >= TTL_SECONDS) continue;
    if (age > maxAge) maxAge = age;
    if (!entry.hash || seen.has(entry.hash)) continue;
    seen.add(entry.hash);

    const content = await readTextFile(`${docsDir}/${entry.hash}.md`);
    if (!content) continue;

    ctx += `\n${content}\n`;
    count++;
  }
  return { ctx, count, maxAge };
}

/** Main: inject cached docs into research-expert context */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput;
  if (!input.agent_type?.includes("research-expert")) process.exit(0);

  const projPath = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const projHash = projectHash(projPath);
  const cacheDir = `${cacheBaseDir()}/doc/${projHash}`;
  const indexFile = `${cacheDir}/index.json`;
  const docsDir = `${cacheDir}/docs`;

  const index = await readJsonFile<CacheIndex>(indexFile);
  if (!index?.docs?.length) process.exit(0);

  const { ctx, count, maxAge } = await buildDocsContext(index.docs, docsDir);
  if (count === 0) process.exit(0);

  logCacheEvent("doc", "hit", projHash, { docs_injected: count }).catch(() => {});

  const ageH = Math.ceil(maxAge / 3600);
  const header = `## CACHED DOCUMENTATION (${count} docs, ${ageH}h ago)\nUse this knowledge. Only query Context7 for topics NOT covered below.\n`;
  let fullCtx = `${header}${ctx}Full docs: ${docsDir}/`;
  fullCtx = fullCtx.slice(0, MAX_SIZE);

  const response: HookOutput = {
    hookSpecificOutput: { hookEventName: "SubagentStart", additionalContext: fullCtx },
  };
  outputHookResponse(response);
}

await main();
