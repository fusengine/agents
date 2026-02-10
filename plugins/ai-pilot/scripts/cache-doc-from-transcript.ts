#!/usr/bin/env bun
/**
 * cache-doc-from-transcript.ts - SubagentStop hook for research-expert
 * Extracts the agent's synthesis text (not raw tool results) and caches it.
 * The synthesis is high-quality: organized, deduplicated, with relevant code examples.
 */
import { readStdin, hashText, projectHash, cacheBaseDir, ensureDir, readJsonFile, writeJsonFile } from "./lib/core";
import type { HookInput } from "./lib/interfaces/hook.interface";
import type { CacheIndex, CacheEntry } from "./lib/interfaces/cache.interface";
import { extractAllFilePaths, detectProjectFromPaths } from "./lib/cache/project-detect";

const TOOL_PATTERN = /context7__query-docs|exa__get_code_context|exa__web_search/;
const MAX_DOC_SIZE = 20480;
const MIN_TEXT_SIZE = 200;
const MAX_DOCS = 15;
const RETRY_DELAYS = [500, 1000, 2000];

/** Extract the agent's synthesis text and queried library IDs from JSONL transcript */
async function extractSynthesis(path: string): Promise<{ text: string; libraries: string[] }> {
  const lines = (await Bun.file(path).text()).split("\n").filter(Boolean);
  const libraries: string[] = [];
  let synthesis = "";

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      const role = entry?.type ?? entry?.role;
      const contents = entry?.message?.content;
      if (!Array.isArray(contents)) continue;
      for (const block of contents) {
        if (block.type === "tool_use" && TOOL_PATTERN.test(block.name ?? "")) {
          const lib = block.input?.libraryId ?? block.input?.query ?? "";
          if (lib && !libraries.includes(lib)) libraries.push(lib);
        }
        if (role === "assistant" && block.type === "text" && typeof block.text === "string" && block.text.length > synthesis.length) {
          synthesis = block.text;
        }
      }
    } catch { /* skip malformed lines */ }
  }
  return { text: synthesis, libraries };
}

/** Main: cache research-expert synthesis from transcript */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput;
  if (!input.agent_type?.includes("research-expert")) process.exit(0);

  const transcript = input.agent_transcript_path;
  if (!transcript || !(await Bun.file(transcript).exists())) process.exit(0);

  const allPaths = await extractAllFilePaths(transcript);
  const projPath = detectProjectFromPaths(allPaths) ?? input.cwd ?? process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const projHash = projectHash(projPath);
  const cacheDir = `${cacheBaseDir()}/doc/${projHash}`;
  const docsDir = `${cacheDir}/docs`;
  await ensureDir(docsDir);

  /** Retry: transcript may not have final synthesis line yet (race condition) */
  let result = await extractSynthesis(transcript);
  for (const delay of RETRY_DELAYS) {
    if (result.text.length >= MIN_TEXT_SIZE && result.libraries.length > 0) break;
    await Bun.sleep(delay);
    result = await extractSynthesis(transcript);
  }
  const { text, libraries } = result;
  if (text.length < MIN_TEXT_SIZE || libraries.length === 0) process.exit(0);

  const indexFile = `${cacheDir}/index.json`;
  const index = (await readJsonFile<CacheIndex>(indexFile)) ?? { project: projPath, docs: [] };
  const timestamp = new Date().toISOString();
  const content = text.slice(0, MAX_DOC_SIZE);
  const topic = libraries.join(", ");
  const docHash = hashText(topic);
  const sizeKb = Math.floor(content.length / 1024);

  await Bun.write(`${docsDir}/${docHash}.md`, content);

  /** One index entry per library, all pointing to same synthesis file */
  for (const lib of libraries) {
    index.docs = index.docs.filter((d: CacheEntry) => d.library !== lib);
    index.docs.push({ hash: docHash, library: lib, topic, timestamp, size_kb: sizeKb });
  }
  if (index.docs.length > MAX_DOCS) index.docs = index.docs.slice(-MAX_DOCS);

  await writeJsonFile(indexFile, index, true);
}

await main();
