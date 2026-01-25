#!/bin/bash
# init-apex-tracking.sh - Initialize APEX tracking for a project
# Usage: bash init-apex-tracking.sh [task_id]
# Creates .claude/apex/ structure with task.json and AGENTS.md

set -e

PROJECT_ROOT="${PWD}"
APEX_DIR="$PROJECT_ROOT/.claude/apex"
DOCS_DIR="$APEX_DIR/docs"
TASK_FILE="$APEX_DIR/task.json"
AGENTS_FILE="$APEX_DIR/AGENTS.md"

# Get task ID from argument or default to "1"
TASK_ID="${1:-1}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create directories
mkdir -p "$DOCS_DIR"

# Initialize or reset task.json
cat > "$TASK_FILE" << EOF
{
  "current_task": "$TASK_ID",
  "created_at": "$TIMESTAMP",
  "tasks": {
    "$TASK_ID": {
      "subject": "",
      "description": "",
      "status": "in_progress",
      "phase": "analyze",
      "started_at": "$TIMESTAMP",
      "doc_consulted": {},
      "files_modified": []
    }
  }
}
EOF

# Create AGENTS.md with APEX rules
cat > "$AGENTS_FILE" << 'EOF'
# APEX Agent Rules

## For Main Agent (Orchestrator)
1. Use `TaskCreate` to add tasks to task.json
2. Use `TaskUpdate` to change task status
3. Fill task.json with subject, description for each task
4. Consult docs BEFORE writing code (MCP or skills)

## For Sub-Agents (Expert Agents)
1. **Read your skills first**: Check your SOLID principles in your agent config
2. Read `task.json` - find last 3 completed tasks (status: "completed")
3. Read their research notes in `docs/` folder
4. Use `TaskList` to see pending tasks
5. Pick a task not blocked by others
6. Use `TaskUpdate(taskId, status: "in_progress")` before starting
7. Apply YOUR SOLID principles (from your agent definition)
8. Use `TaskUpdate(taskId, status: "completed")` when done

## Research Tools (Use BEFORE coding)
- `mcp__context7__resolve-library-id` + `mcp__context7__query-docs` → Official docs
- `mcp__exa__web_search_exa` → Web search for examples
- Skills: `plugins/[expert]/skills/[skill]/SKILL.md`

## SOLID Rules (ALL Agents)
- Files < 100 lines (split at 90)
- Interfaces in `src/interfaces/` or `Contracts/`
- Single Responsibility: one purpose per file
- Each agent has specific SOLID rules - READ YOUR AGENT CONFIG

## Documentation (MANDATORY)
Write notes to: `docs/task-{ID}-{subject-slug}.md`
Example: `docs/task-3-create-header-component.md`

Content:
- What you consulted (MCP, skills, web)
- Key findings relevant to the task
- Decisions made and why
- Files created/modified

## Validation
After modifications, run `sniper` agent for:
- Linter errors → ZERO tolerance
- SOLID compliance check
- Code quality validation

## Auto-Commit
- Do NOT run `git commit` - hooks handle it
- `TaskUpdate(status: "completed")` triggers auto-commit
- Blocked if no code changes exist

## Files
```
.claude/apex/
├── task.json   # Task state (read first)
├── AGENTS.md   # This file (rules)
└── docs/       # Agents write notes here
    └── task-{ID}-{subject}.md
```
EOF

# Add to .gitignore if exists
if [[ -f "$PROJECT_ROOT/.gitignore" ]]; then
  if ! grep -q "^\.claude/apex/" "$PROJECT_ROOT/.gitignore" 2>/dev/null; then
    echo "" >> "$PROJECT_ROOT/.gitignore"
    echo "# APEX tracking (auto-generated)" >> "$PROJECT_ROOT/.gitignore"
    echo ".claude/apex/" >> "$PROJECT_ROOT/.gitignore"
  fi
fi

echo "✅ APEX tracking initialized"
echo ""
echo "Structure created:"
echo "  $APEX_DIR/"
echo "  ├── task.json (current_task: $TASK_ID)"
echo "  ├── AGENTS.md (rules for agents)"
echo "  └── docs/ (research notes)"
echo ""
echo "Agents will now:"
echo "  1. Read AGENTS.md for rules"
echo "  2. Read their skills and SOLID principles"
echo "  3. Consult MCP (Context7/Exa) before coding"
echo "  4. Write notes to docs/task-{ID}-{subject}.md"
echo "  5. Auto-commit on task completion"
