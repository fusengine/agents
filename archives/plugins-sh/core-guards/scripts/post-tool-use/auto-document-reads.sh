#!/bin/bash
# auto-document-reads.sh - PostToolUse hook (v1.0)
# WRITES: {project}/.claude/apex/docs/task-{n}-{stack}.md
# Auto-appends key info when agents read important files

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')

[[ "$TOOL_NAME" != "Read" ]] && exit 0
[[ -z "$FILE_PATH" ]] && exit 0

# Skip non-documentation files
is_doc_file() {
  local f="$1"
  [[ "$f" =~ (SKILL\.md|README\.md|CLAUDE\.md)$ ]] && return 0
  [[ "$f" =~ /docs/.*\.md$ ]] && return 0
  [[ "$f" =~ /references/.*\.md$ ]] && return 0
  [[ "$f" =~ skills/[^/]+/SKILL\.md$ ]] && return 0
  return 1
}

is_doc_file "$FILE_PATH" || exit 0

# Find project root from file path
find_project_root() {
  local dir="$1"
  while [[ "$dir" != "/" ]]; do
    [[ -f "$dir/package.json" || -f "$dir/composer.json" || -d "$dir/.git" ]] && { echo "$dir"; return; }
    dir=$(dirname "$dir")
  done
  echo ""
}

PROJECT_ROOT=$(find_project_root "$(dirname "$FILE_PATH")")
[[ -z "$PROJECT_ROOT" ]] && exit 0

# Detect framework
detect_framework() {
  local root="$1"
  [[ -f "$root/next.config.js" || -f "$root/next.config.ts" ]] && { echo "nextjs"; return; }
  [[ -f "$root/package.json" ]] && grep -q "react" "$root/package.json" 2>/dev/null && { echo "react"; return; }
  [[ -f "$root/composer.json" && -f "$root/artisan" ]] && { echo "laravel"; return; }
  # Swift: check for Package.swift or any .xcodeproj directory
  [[ -f "$root/Package.swift" ]] && { echo "swift"; return; }
  compgen -G "$root/*.xcodeproj" >/dev/null 2>&1 && { echo "swift"; return; }
  echo "generic"
}

FRAMEWORK=$(detect_framework "$PROJECT_ROOT")

# Get current task number
TASK_FILE="$PROJECT_ROOT/.claude/apex/task.json"
CURRENT_TASK="1"
[[ -f "$TASK_FILE" ]] && CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE" 2>/dev/null)

# Target doc file
DOC_DIR="$PROJECT_ROOT/.claude/apex/docs"
DOC_FILE="$DOC_DIR/task-${CURRENT_TASK}-${FRAMEWORK}.md"

mkdir -p "$DOC_DIR"

# Extract doc type for labeling
get_doc_type() {
  local f="$1"
  [[ "$f" =~ SKILL\.md$ ]] && { echo "Skill"; return; }
  [[ "$f" =~ README\.md$ ]] && { echo "README"; return; }
  [[ "$f" =~ CLAUDE\.md$ ]] && { echo "Rules"; return; }
  [[ "$f" =~ /references/ ]] && { echo "Reference"; return; }
  [[ "$f" =~ /docs/ ]] && { echo "Doc"; return; }
  echo "File"
}

DOC_TYPE=$(get_doc_type "$FILE_PATH")
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%SZ)
FILENAME=$(basename "$FILE_PATH")

# Visual feedback for skill reads
if [[ "$DOC_TYPE" == "Skill" ]]; then
  SKILL_NAME=$(basename "$(dirname "$FILE_PATH")")
  echo "skill loaded: $SKILL_NAME" >&2
fi

# Lock for concurrent writes
LOCK_DIR="$DOC_DIR/.doc.lock"
acquire_lock() {
  local max_wait=3 waited=0
  while ! mkdir "$LOCK_DIR" 2>/dev/null; do
    sleep 0.1
    waited=$((waited + 1))
    [[ $waited -gt $((max_wait * 10)) ]] && return 1
  done
  trap 'rmdir "$LOCK_DIR" 2>/dev/null' EXIT
  return 0
}

acquire_lock || exit 0

# Create file if not exists
if [[ ! -f "$DOC_FILE" ]]; then
  # ${FRAMEWORK^} n'est pas supporté en bash 3 (macOS) - utiliser awk
  FRAMEWORK_CAP=$(echo "$FRAMEWORK" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')
  cat > "$DOC_FILE" << EOF
# Task ${CURRENT_TASK} - ${FRAMEWORK_CAP} Documentation
## Consulted: ${TIMESTAMP} | Source: skill:Read
## Key Info

EOF
fi

# Check if already documented (avoid duplicates)
# Use basename with backticks for exact match (file is written as `filename`)
if grep -qF "\`${FILENAME}\`" "$DOC_FILE" 2>/dev/null; then
  exit 0
fi

# Append entry (escape special chars in filename)
FILENAME_SAFE=$(printf '%s' "$FILENAME" | sed 's/`/\\`/g')
echo "- **[${DOC_TYPE}]** \`${FILENAME_SAFE}\` - ${TIMESTAMP}" >> "$DOC_FILE"

exit 0
