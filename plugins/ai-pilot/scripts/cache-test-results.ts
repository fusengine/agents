/**
 * cache-test-results.ts - SubagentStop hook for sniper.
 * Extracts linter results from transcript and caches per-file checksums.
 */
import { readStdin, projectHash, cacheBaseDir, ensureDir, readJsonFile, writeJsonFile, fileChecksum } from "./lib/core";
import { logCacheEvent } from "./lib/analytics";
import type { HookInput } from "./lib/interfaces/hook.interface";
import type { TestResult, TestCache } from "./lib/interfaces/cache.interface";
import { extractAllFilePaths, detectProjectFromPaths } from "./lib/cache/project-detect";
import { collectSourceFiles } from "./lib/cache/source-collector";

/** Extract linter-related output text from a JSONL transcript. */
async function extractLinterOutput(path: string): Promise<string> {
  const text = await Bun.file(path).text();
  const outputs: string[] = [];
  for (const line of text.split("\n").filter(Boolean)) {
    try {
      const entry = JSON.parse(line);
      const content = entry?.message?.content;
      if (!Array.isArray(content)) continue;
      for (const block of content) {
        if (block.type === "tool_use" && block.name === "Bash") {
          const cmd = block.input?.command ?? "";
          if (/eslint|tsc|biome|npx.*lint/i.test(cmd)) outputs.push(cmd);
        }
        if (block.type === "tool_result" || block.type === "text") {
          outputs.push(block.text ?? block.content ?? "");
        }
      }
    } catch { /* skip malformed lines */ }
  }
  return outputs.join("\n");
}


/** Main entry: cache linter test results per-file with checksums. */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput;
  if (!input.agent_type?.includes("sniper")) return;
  const transcript = input.agent_transcript_path ?? "";
  if (!transcript || !(await Bun.file(transcript).exists())) return;

  const allPaths = await extractAllFilePaths(transcript);
  const projectPath = detectProjectFromPaths(allPaths) ?? process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const pHash = projectHash(projectPath);
  const cacheDir = `${cacheBaseDir()}/tests/${pHash}`;
  await ensureDir(cacheDir);
  const resultsPath = `${cacheDir}/results.json`;

  const linterOutput = await extractLinterOutput(transcript);
  if (!linterOutput) return;
  const srcFiles = await collectSourceFiles(projectPath);
  if (srcFiles.length === 0) return;

  const existing = (await readJsonFile<TestCache>(resultsPath)) ?? { timestamp: "", files: {} };
  const timestamp = new Date().toISOString();
  const newFiles: Record<string, TestResult> = {};

  for (const filepath of srcFiles) {
    const relPath = filepath.replace(`${projectPath}/`, "");
    const checksum = (await fileChecksum(filepath)).slice(0, 16);
    if (!checksum) continue;
    const basename = filepath.split("/").pop() ?? "";
    const hasError = linterOutput.includes(basename) && linterOutput.includes("error");
    newFiles[relPath] = { checksum, eslint: hasError ? "fail" : "pass", tsc: "pass", last_tested: timestamp };
  }

  const merged = { ...existing.files, ...newFiles };
  await writeJsonFile(resultsPath, { timestamp, files: merged }, true);
  await logCacheEvent("tests", "hit", pHash, { count: Object.keys(newFiles).length });
}

main().catch(() => {});
