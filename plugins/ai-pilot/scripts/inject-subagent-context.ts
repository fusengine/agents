/**
 * inject-subagent-context.ts - SubagentStart hook.
 * Injects APEX rules into sub-agent prompt via additionalContext.
 * Reads .claude/apex/ structure and provides task context to sub-agents.
 */
import { existsSync } from "node:fs";
import { readStdin, readTextFile, readJsonFile, outputHookResponse } from "./lib/core";
import type { HookInput } from "./lib/interfaces/hook.interface";
import type { ApexTaskFile } from "./lib/interfaces/apex.interface";

/**
 * Extract last 3 completed task subjects from task.json.
 * @param tasks - Tasks record from task.json
 */
function getCompletedTasks(tasks: Record<string, { status: string; subject: string; completed_at?: string }>): string {
  const completed = Object.entries(tasks)
    .filter(([, t]) => t.status === "completed")
    .sort((a, b) => (b[1].completed_at ?? "").localeCompare(a[1].completed_at ?? ""))
    .slice(0, 3)
    .map(([id, t]) => `#${id}: ${t.subject}`);
  return completed.length > 0 ? completed.join(", ") : "none";
}

/**
 * Extract pending task subjects from task.json.
 * @param tasks - Tasks record from task.json
 */
function getPendingTasks(tasks: Record<string, { status: string; subject: string }>): string {
  const pending = Object.entries(tasks)
    .filter(([, t]) => t.status === "pending")
    .map(([id, t]) => `#${id}: ${t.subject}`);
  return pending.length > 0 ? pending.join(", ") : "none";
}

/** Main hook handler */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput;
  if (input.hook_event_name !== "SubagentStart") return;

  const projectRoot = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const apexDir = `${projectRoot}/.claude/apex`;

  if (!existsSync(apexDir)) return;

  const agentsContent = (await readTextFile(`${apexDir}/AGENTS.md`)).slice(0, 4000);
  const taskData = await readJsonFile<ApexTaskFile>(`${apexDir}/task.json`);

  const completed = taskData ? getCompletedTasks(taskData.tasks) : "none";
  const pending = taskData ? getPendingTasks(taskData.tasks) : "none";

  const context = `## APEX Sub-Agent Instructions

You are a sub-agent in APEX workflow. Follow these rules:

### 1. AGENTS.md Rules
${agentsContent}

### 2. Task Context
- Last completed: ${completed}
- Pending: ${pending}

### 3. Before Starting Work
- Use TaskUpdate(taskId, status: in_progress) before starting

### 4. SOLID Rules
- Files < 100 lines | Interfaces in src/interfaces/ | JSDoc/PHPDoc required

### 5. Research Before Code
- Use Context7/Exa for docs | Write notes to .claude/apex/docs/

### 6. When Done
- TaskUpdate(taskId, status: completed) triggers auto-commit`;

  outputHookResponse({
    hookSpecificOutput: { hookEventName: "SubagentStart", additionalContext: context },
  });
}

await main();
