/**
 * sync-task-tracking.ts - PostToolUse hook for TaskCreate/TaskUpdate.
 * Synchronizes Claude task tools with APEX task.json and prompts
 * auto-commit on task completion when git changes are detected.
 */
import { existsSync } from "node:fs";
import { readStdin, outputHookResponse, readJsonFile } from "./lib/core";
import { acquireLock, taskCreate, taskStart, taskComplete } from "./lib/apex/state";
import type { HookInput } from "./lib/interfaces/hook.interface";
import type { ApexTaskFile } from "./lib/interfaces/apex.interface";

/** Check if there are uncommitted git changes in the project */
async function hasGitChanges(cwd: string): Promise<boolean> {
  try {
    const proc = Bun.spawn(["git", "status", "--porcelain"], { cwd, stdout: "pipe", stderr: "ignore" });
    const out = await new Response(proc.stdout).text();
    return out.trim().length > 0;
  } catch { return false; }
}

/** Main hook handler */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput & { tool_response?: { id?: string } };
  const toolName = input.tool_name ?? "";

  if (toolName !== "TaskCreate" && toolName !== "TaskUpdate") return;

  const projectRoot = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const taskFile = `${projectRoot}/.claude/apex/task.json`;
  if (!existsSync(taskFile)) return;

  const lockDir = `${projectRoot}/.claude/apex/.task.lock`;
  const unlock = await acquireLock(lockDir, 10000);
  if (!unlock) return;

  try {
    const ti = (input.tool_input ?? {}) as Record<string, string>;

    if (toolName === "TaskCreate") {
      const subject = ti.subject ?? "";
      const desc = ti.description ?? "";
      const taskId = input.tool_response?.id ?? String(
        Math.max(0, ...Object.keys((await readJsonFile<ApexTaskFile>(taskFile))?.tasks ?? {}).map(Number)) + 1,
      );
      await taskCreate(taskFile, taskId, subject, desc);
      return;
    }

    const taskId = ti.taskId ?? "";
    const newStatus = ti.status ?? "";
    if (!taskId) return;

    if (newStatus === "in_progress") {
      const subject = ti.subject ?? "";
      const desc = ti.description ?? "";
      const blocked = (ti.addBlockedBy as unknown as string[] | undefined)?.join(",") ?? "";
      await taskStart(taskFile, taskId, subject || undefined, desc || undefined, blocked || undefined);
    }

    if (newStatus === "completed") {
      await taskComplete(taskFile, taskId);

      if (!(await hasGitChanges(projectRoot))) {
        outputHookResponse({
          hookSpecificOutput: {
            hookEventName: "PostToolUse",
            additionalContext: "Task completed. No changes to commit.",
          },
        });
        return;
      }

      const data = await readJsonFile<ApexTaskFile>(taskFile);
      const subject = data?.tasks[taskId]?.subject ?? "Task";
      outputHookResponse({
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: `Task #${taskId} completed: ${subject}\n\nChanges detected. MANDATORY: Run /fuse-commit-pro:commit to commit with smart detection.`,
        },
      });
    }
  } finally {
    await unlock();
  }
}

await main();
