/**
 * init-apex-tracking.ts - Initialize APEX tracking for a project.
 * Creates .claude/apex/ structure with task.json and AGENTS.md.
 * Called by detect-and-inject-apex.ts or directly via CLI.
 */
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { writeJsonFile, writeTextFile, readTextFile } from "./lib/core";

const PROJECT_ROOT = process.cwd();
const APEX_DIR = `${PROJECT_ROOT}/.claude/apex`;
const DOCS_DIR = `${APEX_DIR}/docs`;
const TASK_FILE = `${APEX_DIR}/task.json`;
const AGENTS_FILE = `${APEX_DIR}/AGENTS.md`;
const TASK_ID = process.argv[2] ?? "1";
const TIMESTAMP = new Date().toISOString();

/** Build the initial task.json content */
function buildTaskJson(): Record<string, unknown> {
  return {
    current_task: TASK_ID,
    created_at: TIMESTAMP,
    tasks: {
      [TASK_ID]: {
        subject: "", description: "", status: "in_progress", phase: "analyze",
        started_at: TIMESTAMP, doc_consulted: {}, files_modified: [],
      },
    },
  };
}

/** AGENTS.md template with APEX rules for sub-agents */
const AGENTS_MD = `# APEX Agent Rules

## For Main Agent (Orchestrator)
1. Use \`TaskCreate\` to add tasks to task.json
2. Use \`TaskUpdate\` to change task status
3. Fill task.json with subject, description for each task
4. Consult docs BEFORE writing code (MCP or skills)

## For Sub-Agents (Expert Agents)
1. **Read your skills first**: Check your SOLID principles in your agent config
2. Read \`task.json\` - find last 3 completed tasks (status: "completed")
3. Read their research notes in \`docs/\` folder
4. Use \`TaskList\` to see pending tasks
5. Pick a task not blocked by others
6. Use \`TaskUpdate(taskId, status: "in_progress")\` before starting
7. Apply YOUR SOLID principles (from your agent definition)
8. Use \`TaskUpdate(taskId, status: "completed")\` when done

## Research Tools (Use BEFORE coding)
- \`mcp__context7__resolve-library-id\` + \`mcp__context7__query-docs\`
- \`mcp__exa__web_search_exa\`
- Skills: \`plugins/[expert]/skills/[skill]/SKILL.md\`

## SOLID Rules (ALL Agents)
- Files < 100 lines (split at 90)
- Interfaces in \`src/interfaces/\` or \`Contracts/\`
- Single Responsibility: one purpose per file
- Each agent has specific SOLID rules - READ YOUR AGENT CONFIG

## Documentation (MANDATORY)
Write notes to: \`docs/task-{ID}-{subject-slug}.md\`

## Validation
After modifications, run \`sniper\` agent for ZERO linter errors.

## Auto-Commit
- Do NOT run \`git commit\` - hooks handle it
- \`TaskUpdate(status: "completed")\` triggers auto-commit

## Files
\`\`\`
.claude/apex/
├── task.json   # Task state (read first)
├── AGENTS.md   # This file (rules)
└── docs/       # Agents write notes here
\`\`\`
`;

/** Add .claude/apex/ to .gitignore if not already present */
async function updateGitignore(): Promise<void> {
  const gitignore = `${PROJECT_ROOT}/.gitignore`;
  if (!existsSync(gitignore)) return;
  const content = await readTextFile(gitignore);
  if (content.includes(".claude/apex/")) return;
  await writeTextFile(gitignore, `${content}\n# APEX tracking (auto-generated)\n.claude/apex/\n`);
}

/** Main initialization */
async function main(): Promise<void> {
  await mkdir(DOCS_DIR, { recursive: true });
  await writeJsonFile(TASK_FILE, buildTaskJson());
  await writeTextFile(AGENTS_FILE, AGENTS_MD);
  await updateGitignore();
  console.log(`APEX tracking initialized: ${APEX_DIR}/ (task: ${TASK_ID})`);
}

await main();
