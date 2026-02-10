/**
 * detect-and-inject-apex.ts - UserPromptSubmit hook for ai-pilot.
 * Detects development tasks and injects APEX methodology instruction.
 * Auto-initializes APEX tracking if /apex command is used.
 */
import { existsSync } from "node:fs";
import { readStdin } from "./lib/core";
import { DEV_KEYWORDS, isApexCommand, detectProjectType, getExpertAgent } from "./lib/apex/detection";
import type { HookInput } from "./lib/interfaces/hook.interface";

/** Initialize APEX tracking by spawning init-apex-tracking.ts */
async function initTracking(): Promise<void> {
  const scriptDir = import.meta.dir;
  const proc = Bun.spawn(["bun", `${scriptDir}/init-apex-tracking.ts`, "1"], {
    stdout: "ignore", stderr: "ignore",
  });
  await proc.exited;
}

/** Build the APEX instruction message for Claude */
function buildInstruction(projectType: string, expertAgent: string): string {
  return `INSTRUCTION: This is a development task. Use APEX methodology:

**TRACKING FILE**: [project]/.claude/apex/task.json (auto-created on first Write/Edit)

1. **ANALYZE** (MANDATORY - 3 AGENTS IN PARALLEL):
   - Launch explore-codebase agent (architecture)
   - Launch research-expert agent (documentation)
   - Launch ${expertAgent} agent (framework expertise)
   - Project type detected: ${projectType}

2. **PLAN**: Use TaskCreate to break down tasks (<100 lines per file)

3. **EXECUTE**: Use ${expertAgent}, follow SOLID principles, split at 90 lines

4. **EXAMINE**: Run sniper agent after ANY modification

Expert agent for this project: ${expertAgent}
Framework references: references/${projectType}/

**IMPORTANT**: Read .claude/apex/task.json to check documentation status before writing code.`;
}

/** Main hook handler */
async function main(): Promise<void> {
  const input = (await readStdin()) as HookInput;
  const prompt = input.prompt ?? "";
  const promptLower = prompt.toLowerCase();

  const apexCmd = isApexCommand(promptLower);

  if (apexCmd) {
    const taskFile = `${process.cwd()}/.claude/apex/task.json`;
    if (!existsSync(taskFile)) await initTracking();
  }

  if (!DEV_KEYWORDS.test(promptLower) && !apexCmd) return;

  const projectType = detectProjectType(process.cwd());
  const expertAgent = getExpertAgent(projectType);

  console.log(buildInstruction(projectType, expertAgent));
}

await main();
