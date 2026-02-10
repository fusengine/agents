#!/usr/bin/env bun
/**
 * explore-cache-check.ts - SubagentStart hook for explore-codebase
 * Injects cached architecture report or instructs agent to save after exploration.
 * Replaces explore-cache-check.sh
 */
import { readStdin, hashText, projectHash, cacheBaseDir, cacheAge, readJsonFile, readTextFile, outputHookResponse } from "./lib/core";
import { logCacheEvent } from "./lib/analytics";
import type { HookInput, HookOutput } from "./lib/interfaces/hook.interface";

const TTL_SECONDS = 86400; // 24 hours

/** Compute config hash from git-tracked config files */
async function getConfigHash(): Promise<string> {
  try {
    const proc = Bun.spawn(["git", "ls-tree", "HEAD",
      "package.json", "tsconfig.json", "composer.json", "go.mod", "Cargo.toml",
      "Package.swift", "biome.json", ".eslintrc.js", ".eslintrc.json"], { stdout: "pipe", stderr: "ignore" });
    const output = await new Response(proc.stdout).text();
    return output.trim() ? hashText(output) : "noconfig";
  } catch {
    return "noconfig";
  }
}

/** Build cache hit context with the cached report */
function buildHitContext(report: string, ageMin: number): string {
  return `## CACHED ARCHITECTURE AVAILABLE (age: ${ageMin}min)\nUSE this cached report. Do NOT run full exploration. Return it immediately.\n\n${report}`;
}

/** Build cache miss context with save instructions */
function buildMissContext(cacheDir: string, metaFile: string, snapFile: string, ts: string, cfgHash: string, projPath: string): string {
  return `## EXPLORATION CACHE INSTRUCTIONS
After completing your exploration, save the report for future runs:
\`\`\`bash
mkdir -p ${cacheDir}
cat > ${metaFile} << 'METAEOF'
{"timestamp":"${ts}","config_hash":"${cfgHash}","project":"${projPath}"}
METAEOF
\`\`\`
Then write your full exploration report (markdown) to: ${snapFile}`;
}

/** Main: inject cached architecture or instruct agent to save */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput;
  if (!input.agent_type?.includes("explore-codebase")) process.exit(0);

  const projPath = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const projHash = projectHash(projPath);
  const cacheDir = `${cacheBaseDir()}/explore/${projHash}`;
  const metaFile = `${cacheDir}/metadata.json`;
  const snapFile = `${cacheDir}/snapshot.md`;
  const configHash = await getConfigHash();

  let context = "";
  const meta = await readJsonFile<{ timestamp: string; config_hash: string }>(metaFile);
  const snapshot = await readTextFile(snapFile);

  if (meta?.timestamp && snapshot) {
    const age = cacheAge(meta.timestamp);
    if (age < TTL_SECONDS && meta.config_hash === configHash) {
      context = buildHitContext(snapshot, Math.floor(age / 60));
      logCacheEvent("explore", "hit", projHash).catch(() => {});
    }
  }

  if (!context) {
    logCacheEvent("explore", "miss", projHash).catch(() => {});
    const ts = new Date().toISOString().replace(/\.\d+Z$/, "");
    context = buildMissContext(cacheDir, metaFile, snapFile, ts, configHash, projPath);
  }

  const response: HookOutput = {
    hookSpecificOutput: { hookEventName: "SubagentStart", additionalContext: context },
  };
  outputHookResponse(response);
}

await main();
