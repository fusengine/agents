#!/bin/bash
# Git Guard - Block destructive git commands without permission
# Refactored for SOLID compliance (<90 lines)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/git-guard-patterns.sh"

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
[[ -z "$COMMAND" ]] && exit 0

# Ralph mode detection
is_ralph_mode() {
    [[ "$RALPH_MODE" == "1" ]] && return 0
    [[ -f ".claude/ralph/prd.json" ]] && return 0
    local branch=$(git branch --show-current 2>/dev/null)
    [[ "$branch" == feature/* ]] && return 0
    return 1
}

# Block with hookSpecificOutput format (deny)
output_block() {
    local reason="$1"
    cat <<EOF
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"GIT GUARD: $reason"}}
EOF
    exit 0
}

# Ask with hookSpecificOutput format (Claude Code standard)
output_ask() {
    local reason="$1"
    cat <<EOF
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"GIT GUARD: $reason"}}
EOF
    exit 0
}

# Ralph mode: auto-approve safe commands
if is_ralph_mode; then
    for safe_cmd in "${RALPH_SAFE_COMMANDS[@]}"; do
        [[ "$COMMAND" =~ ^$safe_cmd ]] && exit 0
    done
fi

# Check BLOCKED patterns
for pattern in "${BLOCKED_GIT_PATTERNS[@]}"; do
    [[ "$COMMAND" =~ $pattern ]] && output_block "Destructive command '$pattern' BLOCKED"
done

# Check ASK patterns
for pattern in "${ASK_GIT_PATTERNS[@]}"; do
    [[ "$COMMAND" =~ $pattern ]] && output_ask "'$pattern' detected. Authorize?"
done

exit 0
