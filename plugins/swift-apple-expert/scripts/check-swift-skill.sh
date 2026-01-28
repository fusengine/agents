#!/bin/bash
# check-swift-skill.sh - PreToolUse hook for swift-apple-expert
set -euo pipefail

SHARED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../_shared/scripts" && pwd)"
source "$SHARED_DIR/check-skill-common.sh"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only Write/Edit on .swift files
[[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]] && exit 0
[[ ! "$FILE_PATH" =~ \.swift$ ]] && exit 0
[[ "$FILE_PATH" =~ /(\.build|DerivedData|Pods)/ ]] && exit 0

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
[[ -z "$SESSION_ID" ]] && SESSION_ID="fallback-$(date +%s)-$$"
PROJECT_ROOT=$(find_project_root "$(dirname "$FILE_PATH")" "Package.swift" "*.xcodeproj" ".git")

skill_was_consulted "swift" "$SESSION_ID" "$PROJECT_ROOT" && exit 0

PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
MSG="BLOCKED: Swift skill not consulted. READ ONE: "
MSG+="1) $PLUGINS_DIR/swift-apple-expert/skills/solid-swift/SKILL.md | "
MSG+="2) $PLUGINS_DIR/swift-apple-expert/skills/swiftui-components/SKILL.md | "
MSG+="3) Use mcp__context7__query-docs (topic: swiftui). After reading, retry."
deny_block "$MSG"
