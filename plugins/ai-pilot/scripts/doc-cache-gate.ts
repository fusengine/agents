#!/usr/bin/env bun
/**
 * doc-cache-gate.ts - PreToolUse hook
 * Blocks Context7/Exa calls when doc is already cached.
 * Returns deny decision with cached file path as reason.
 * Replaces doc-cache-gate.sh
 */
import { readStdin, projectHash, cacheBaseDir, cacheAge, readJsonFile, outputHookResponse } from "./lib/core";
import { logCacheEvent } from "./lib/analytics";
import type { HookInput, HookOutput } from "./lib/interfaces/hook.interface";
import type { CacheIndex } from "./lib/interfaces/cache.interface";

const GATED_TOOLS = /context7__query-docs|exa__get_code_context|exa__web_search/;
const TTL_SECONDS = 604800; // 7 days

/** Extract library and topic from tool input based on tool type */
function extractParams(input: HookInput): { library: string; topic: string } | null {
  const name = input.tool_name ?? "";
  if (name.includes("context7")) {
    const lib = (input.tool_input?.libraryId as string) ?? "";
    const topic = (input.tool_input?.topic as string) ?? "";
    return lib && topic ? { library: lib, topic } : null;
  }
  if (name.includes("exa")) {
    const query = (input.tool_input?.query as string) ?? "";
    return query ? { library: query, topic: query } : null;
  }
  return null;
}

/** Main: check cache and deny if doc exists and is fresh */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput;
  if (!input.tool_name || !GATED_TOOLS.test(input.tool_name)) process.exit(0);

  const params = extractParams(input);
  if (!params) process.exit(0);

  const projPath = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const projHash = projectHash(projPath);
  const cacheDir = `${cacheBaseDir()}/doc/${projHash}`;
  const indexFile = `${cacheDir}/index.json`;

  const index = await readJsonFile<CacheIndex>(indexFile);
  if (!index?.docs?.length) process.exit(0);

  const entry = index.docs.find((d) => d.library === params.library);
  if (!entry?.hash) process.exit(0);

  const docFile = `${cacheDir}/docs/${entry.hash}.md`;
  if (!(await Bun.file(docFile).exists())) process.exit(0);
  if (!entry?.timestamp) process.exit(0);

  const age = cacheAge(entry.timestamp);
  if (age >= TTL_SECONDS) process.exit(0);

  const ageH = Math.floor(age / 3600);
  logCacheEvent("doc", "blocked", projHash, { library: params.library }).catch(() => {});

  const reason = `Doc already cached at ${docFile} (age: ${ageH}h). Use Read tool to access it.`;
  const response: HookOutput = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  };
  outputHookResponse(response);
}

await main();
