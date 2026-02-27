/**
 * enforce-apex-phases.ts - PreToolUse hook.
 * Blocks Write/Edit on code files unless documentation was consulted
 * within the same session and within the last 2 minutes.
 * State stored in ~/.claude/logs/00-apex/YYYY-MM-DD-state.json.
 */
import { readStdin, outputHookResponse } from "./lib/core";
import {
  acquireLock, ensureStateDir, stateFilePath, loadState, saveState,
} from "./lib/apex/state";
import type { HookInput } from "./lib/interfaces/hook.interface";
import { detectFramework, getSkillSource, getSkillDir, formatRoutedDeny } from "./lib/apex/enforce-helpers";
import { findProjectRoot } from "./lib/apex/fs-helpers";
import { isDocConsulted, formatDocDeny } from "./lib/apex/doc-helpers";
import { routeReferences } from "./lib/apex/ref-router";

/** Code file extensions that require doc consultation */
const CODE_EXT = /\.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java|vue|svelte|css)$/;
/** Directories to skip (dependencies, build output) */
const SKIP_DIRS = /(node_modules|vendor|dist|build|\.next|DerivedData)/;
/** Protected paths — deny Write/Edit completely */
const PROTECTED_PATHS = /\.claude\/plugins\/(marketplaces|cache)/;

/** Shorthand deny helper to reduce repetition */
function deny(reason: string): void {
  outputHookResponse({ hookSpecificOutput: {
    hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason,
  }});
}

/** Check if authorization is still valid (same session + < 2 min) */
function isAuthorized(
  storedSession: string | undefined,
  docConsulted: string | undefined,
  sessionId: string,
): boolean {
  if (!docConsulted || storedSession !== sessionId) return false;
  const readEpoch = new Date(docConsulted).getTime();
  if (Number.isNaN(readEpoch)) return false;
  return (Date.now() - readEpoch) < 120_000;
}

/** Main hook handler */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput;
  const toolName = input.tool_name ?? "";
  const filePath = (input.tool_input as Record<string, string>)?.file_path ?? "";
  const sessionId = input.session_id ?? "";

  if (toolName !== "Write" && toolName !== "Edit") return;
  if (PROTECTED_PATHS.test(filePath)) {
    deny("PROTECTED: Cannot modify ~/.claude/plugins/. Edit the source repo instead.");
    return;
  }
  if (!CODE_EXT.test(filePath)) return;
  if (SKIP_DIRS.test(filePath)) return;

  const content = String((input.tool_input as Record<string, string>)?.content
    ?? (input.tool_input as Record<string, string>)?.new_string ?? "");
  const projectRoot = findProjectRoot(filePath.replace(/\/[^/]+$/, ""));
  const framework = detectFramework(filePath, content);

  await ensureStateDir();
  const statePath = stateFilePath();
  const lockDir = `${statePath}.lockdir`;
  const unlock = await acquireLock(lockDir);
  if (!unlock) return;

  try {
    const state = await loadState(statePath);
    const auth = state.authorizations[framework];
    // Check 1: SOLID refs (2min TTL)
    if (!isAuthorized(auth?.session, auth?.doc_consulted, sessionId)) {
      state.target = {
        project: projectRoot, framework,
        set_by: "enforce-apex-phases.ts",
        set_at: new Date().toISOString(),
      };
      await saveState(statePath, state);
      const src = getSkillSource(framework);
      const skillDir = getSkillDir(framework);
      const routed = await routeReferences(filePath, content, skillDir);
      const denyReason = routed
        ? formatRoutedDeny(framework, filePath, routed)
        : `APEX: Read doc first (expires every 2min) for ${framework}! Source: ${src}`;
      deny(denyReason);
      return;
    }
    // Check 2: Online doc (once per session)
    if (!isDocConsulted(auth, sessionId)) {
      deny(formatDocDeny(framework));
      return;
    }
  } finally {
    await unlock();
  }
}

await main();
