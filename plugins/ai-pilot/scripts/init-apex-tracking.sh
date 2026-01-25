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

## Current State
Read `task.json` to know:
- `current_task`: Which task you're working on
- `tasks[X].phase`: Current phase (analyze/plan/execute/examine)
- `tasks[X].doc_consulted`: Which docs were consulted
- `tasks[X].subject`: Task description

## Workflow (MANDATORY)

### 1. ANALYZE (First)
Before ANY code:
- Read skills: `plugins/[expert]/skills/[skill]/SKILL.md`
- OR use MCP: `mcp__context7__query-docs` / `mcp__exa__web_search_exa`
- Write learnings to: `docs/task-{ID}-research.md`

### 2. PLAN
- Break task into subtasks (<100 lines per file)
- Use TaskCreate for each subtask

### 3. EXECUTE
- Follow SOLID principles
- Files < 100 lines (split at 90)
- Interfaces in `src/interfaces/` or `Contracts/`

### 4. EXAMINE
- Run sniper validation after modifications
- ZERO linter errors required

## Blocking Rules

| Action | Blocked If |
|--------|-----------|
| Write/Edit code | `doc_consulted.[framework] != true` |
| Complete task | No git commit (no changes) |
| shadcn components | Manual write instead of CLI install |

## Auto-Commit (AUTOMATIC - DO NOT COMMIT MANUALLY)
When you call `TaskUpdate(taskId: "X", status: "completed")`:
1. Hook automatically runs `git add -A`
2. Hook automatically creates commit: `feat(task-X): subject`
3. Hook updates task.json with `completed_at`

**IMPORTANT:**
- Do NOT run `git commit` yourself - it's automatic
- If no code changes exist → completion is BLOCKED
- You must write actual code before marking complete

## Files Structure
```
.claude/apex/
├── task.json      # Tracking state (READ THIS FIRST)
├── AGENTS.md      # This file (rules)
└── docs/          # Your research notes
    └── task-{ID}-research.md
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
echo "  2. Consult docs before writing code"
echo "  3. Auto-commit on task completion"
echo "  4. Write research to docs/task-{ID}-research.md"
