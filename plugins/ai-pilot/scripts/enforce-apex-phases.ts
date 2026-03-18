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
import { isDocConsulted, formatDocDeny, resolveSessions, type AuthEntry } from "./lib/apex/doc-helpers";
import { routeReferences } from "./lib/apex/ref-router";
import { incrementTrivialEditCounter } from "./lib/apex/trivial-edit-counter";

const CODE_EXT = /\.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java|vue|svelte|astro|css)$/; // requires doc
const SKIP_DIRS = /(node_modules|vendor|dist|build|\.next|DerivedData)/; // skip deps/build
const PROTECTED_PATHS = /\.claude\/(plugins\/(marketplaces|cache)|logs\/00-apex|fusengine-cache\/skill-tracking)/;

/** Shorthand deny helper to reduce repetition */
function deny(reason: string): void {
  outputHookResponse({ hookSpecificOutput: {
    hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason,
  }});
}

/** Check if authorization is still valid (same session + < 2 min) */
function isAuthorized(
  auth: (AuthEntry & { doc_consulted?: string }) | undefined,
  sessionId: string,
): boolean {
  if (!auth?.doc_consulted || !resolveSessions(auth).includes(sessionId)) return false;
  const readEpoch = new Date(auth.doc_consulted).getTime();
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
    deny("[APEX Hook Guard] Write blocked — this path is managed automatically by APEX hooks. Manual edits are forbidden and would corrupt tracked state.");
    return;
  }
  if (!CODE_EXT.test(filePath)) return;
  if (SKIP_DIRS.test(filePath)) return;

  const content = String((input.tool_input as Record<string, string>)?.content
    ?? (input.tool_input as Record<string, string>)?.new_string ?? "");
  // Trivial edits: replace_all is NEVER trivial
  const replaceAll = (input.tool_input as Record<string, unknown>)?.replace_all;
  if (replaceAll) { /* fall through to APEX check */ }
  else if (toolName === "Edit" && content.split("\n").length < 5) {
    const count = await incrementTrivialEditCounter(sessionId);
    if (count < 5) return;
    // 5+ trivial edits in 2 min → require full APEX
  }
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
    // Check 1: SOLID refs (2min TTL, framework-specific)
    if (!isAuthorized(auth, sessionId)) {
      state.target = { project: projectRoot, framework, set_by: "enforce-apex-phases.ts", set_at: new Date().toISOString() };
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
    // Check 2: Online doc (once per session, ANY framework counts)
    if (!isDocConsulted(state.authorizations, sessionId)) {
      deny(formatDocDeny(framework));
      return;
    }
  } finally {
    await unlock();
  }
}
await main();
