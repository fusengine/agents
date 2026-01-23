#!/bin/bash
# init-apex-tracking.sh - Initialize APEX tracking for a project
# Usage: bash init-apex-tracking.sh [task_id]
# Creates .claude/apex/ structure with task.json

set -e

PROJECT_ROOT="${PWD}"
APEX_DIR="$PROJECT_ROOT/.claude/apex"
DOCS_DIR="$APEX_DIR/docs"
TASK_FILE="$APEX_DIR/task.json"

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
      "status": "in_progress",
      "started_at": "$TIMESTAMP",
      "doc_consulted": {}
    }
  }
}
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
echo "  └── docs/ (documentation summaries)"
echo ""
echo "The system will now:"
echo "  1. Track documentation consultations (Context7, Exa, skills)"
echo "  2. Block Write/Edit until doc consulted for framework"
echo "  3. Generate summaries in docs/task-{ID}-{framework}.md"
