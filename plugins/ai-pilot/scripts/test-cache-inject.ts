/**
 * test-cache-inject.ts - SubagentStart hook for sniper.
 * Injects cached test results: tells sniper which files changed vs unchanged.
 */
import { readStdin, projectHash, cacheBaseDir, readJsonFile, fileChecksum, cacheAge, outputHookResponse } from "./lib/core";
import type { HookInput } from "./lib/interfaces/hook.interface";
import type { TestResult, TestCache } from "./lib/interfaces/cache.interface";
import { collectSourceFiles } from "./lib/cache/source-collector";

const TTL_SECONDS = 172_800; // 48 hours

/** Main entry: compare file checksums with cache, inject changed file list. */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput;
  if (!input.agent_type?.includes("sniper")) {
    outputHookResponse({ systemMessage: "test-cache: not sniper", hookSpecificOutput: { hookEventName: "SubagentStart" } });
    return;
  }

  const projectPath = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const pHash = projectHash(projectPath);
  const resultsPath = `${cacheBaseDir()}/tests/${pHash}/results.json`;

  const cache = await readJsonFile<TestCache>(resultsPath);
  if (!cache?.files || Object.keys(cache.files).length === 0) return;

  const srcFiles = await collectSourceFiles(projectPath);
  if (srcFiles.length === 0) return;

  const changed: string[] = [];
  let unchanged = 0;

  for (const filepath of srcFiles) {
    const relPath = filepath.replace(`${projectPath}/`, "");
    const cached = cache.files[relPath];
    if (!cached) { changed.push(relPath); continue; }

    const currentSum = (await fileChecksum(filepath)).slice(0, 16);
    if (currentSum !== cached.checksum) { changed.push(relPath); continue; }
    if (cached.last_tested && cacheAge(cached.last_tested) > TTL_SECONDS) { changed.push(relPath); continue; }
    unchanged++;
  }

  if (unchanged === 0) return;
  const total = srcFiles.length;
  const changedList = changed.map((f) => `- ${f}`).join("\n");

  const ctx = `## TEST CACHE (${unchanged}/${total} files already validated)
Only run linters on these CHANGED files:
${changedList}
SKIP linting on ${unchanged} unchanged files - already PASS.`;

  outputHookResponse({
    hookSpecificOutput: { hookEventName: "SubagentStart", additionalContext: ctx },
  });
}

main().catch(() => {});
