#!/bin/bash
# Install Guard - ALWAYS ask before installing
# Refactored for SOLID compliance (<90 lines)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/install-patterns.sh"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

[[ "$TOOL_NAME" != "Bash" || -z "$COMMAND" ]] && exit 0

# Ralph mode detection
is_ralph_mode() {
    [[ "$RALPH_MODE" == "1" ]] && return 0
    [[ -f ".claude/ralph/prd.json" ]] && return 0
    local branch=$(git branch --show-current 2>/dev/null)
    [[ "$branch" == feature/* ]] && return 0
    return 1
}

# Output ask decision JSON
output_ask() {
    local reason="$1"
    echo "{\"decision\": \"ask\", \"reason\": \"$reason\"}"
    exit 0
}

# System installs: ALWAYS ask
for pattern in "${SYSTEM_INSTALL_PATTERNS[@]}"; do
    [[ "$COMMAND" =~ $pattern ]] && output_ask "SYSTEM INSTALL: '$pattern' requires confirmation"
done

# Project installs: auto-approve in Ralph mode, ask otherwise
for pattern in "${PROJECT_INSTALL_PATTERNS[@]}"; do
    if [[ "$COMMAND" =~ $pattern ]]; then
        is_ralph_mode && exit 0  # Auto-approve in Ralph mode
        output_ask "INSTALL GUARD: '$pattern' detected. Authorize?"
    fi
done

exit 0
