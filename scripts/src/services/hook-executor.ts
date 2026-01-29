/**
 * Hook execution service
 * Single Responsibility: Execute commands and collect results
 */
import type { ExecutableHook, HookResult } from "../interfaces/hooks";

/** Execute a hook and return the result */
export async function executeHook(hook: ExecutableHook, input: string): Promise<HookResult> {
  if (hook.isAsync) {
    // Fire and forget for sounds
    Bun.spawn(["bash", "-c", hook.command], { stdout: "ignore", stderr: "ignore" });
    return { success: true, exitCode: 0, stdout: "", stderr: "", blocked: false };
  }

  const proc = Bun.spawn(["bash", "-c", hook.command], {
    stdin: new TextEncoder().encode(input),
    stdout: "pipe",
    stderr: "pipe",
  });

  const exitCode = await proc.exited;
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();

  return { success: exitCode === 0, exitCode, stdout, stderr, blocked: exitCode === 2 };
}

/** Execute a list of hooks in PARALLEL, check for blocks after execution */
export async function executeHooks(
  hooks: ExecutableHook[],
  input: string
): Promise<{ blocked: boolean; stderr: string; output: string }> {
  if (hooks.length === 0) {
    return { blocked: false, stderr: "", output: "" };
  }

  const results = await Promise.all(hooks.map((hook) => executeHook(hook, input)));

  const blockedResult = results.find((r) => r.blocked);
  if (blockedResult) {
    return { blocked: true, stderr: blockedResult.stderr, output: "" };
  }

  let collectedOutput = "";
  for (const result of results) {
    if (result.stdout.trim()) {
      collectedOutput = mergeJsonOutput(collectedOutput, result.stdout);
    }
  }

  return { blocked: false, stderr: "", output: collectedOutput };
}

/** Merge JSON outputs (additionalContext and hookSpecificOutput) */
function mergeJsonOutput(existing: string, newOutput: string): string {
  try {
    const json = JSON.parse(newOutput);

    // hookSpecificOutput takes priority (permission decisions)
    if (json.hookSpecificOutput) {
      return newOutput;
    }

    // Merge additionalContext
    if (!json.additionalContext) return existing;
    if (!existing) return newOutput;

    const existingJson = JSON.parse(existing);
    existingJson.additionalContext += "\n\n" + json.additionalContext;
    return JSON.stringify(existingJson);
  } catch {
    return existing;
  }
}
