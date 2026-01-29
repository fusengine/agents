#!/bin/bash
# Track agent executions and trigger sniper after code modifications

INPUT=$(cat)
STATE_DIR="/tmp/claude-code-sessions"
MEMORY_DIR="$HOME/.claude/memory/agents"
mkdir -p "$STATE_DIR" "$MEMORY_DIR"

command -v jq &>/dev/null || { echo '{"message": "jq not found"}'; exit 0; }

# Extract agent info
AGENT_ID=$(echo "$INPUT" | jq -r '.agent_id // "unknown"')
AGENT_TYPE=$(echo "$INPUT" | jq -r '.subagent_type // .agent_id // "unknown"')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Record agent execution
MEMORY_FILE="$MEMORY_DIR/agent-history.jsonl"
jq -c -n \
  --arg type "$AGENT_TYPE" \
  --arg ts "$TIMESTAMP" \
  '{agentType:$type,completedAt:$ts}' >> "$MEMORY_FILE"

# Skip sniper for non-coding agents
SKIP_AGENTS="sniper|sniper-faster|explore-codebase|research-expert|claude-code-guide|Explore|Plan"
if [[ "$AGENT_TYPE" =~ ($SKIP_AGENTS) ]]; then
  echo "{\"message\": \"Agent $AGENT_TYPE completed\"}"
  exit 0
fi

# Check for code modifications
STATE_FILE="$STATE_DIR/session-${SESSION_ID}-changes.json"
if [[ -f "$STATE_FILE" ]]; then
  MODIFIED_COUNT=$(jq -r '.cumulativeCodeFiles // 0' "$STATE_FILE" 2>/dev/null)

  if (( MODIFIED_COUNT > 0 )); then
    MODIFIED_FILES=$(jq -r '.modifiedFiles | join(", ")' "$STATE_FILE" 2>/dev/null)

    # Reset counter
    jq '.cumulativeCodeFiles = 0' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

    cat << EOF
{
  "message": "Agent $AGENT_TYPE: $MODIFIED_COUNT files modified - SNIPER REQUIRED",
  "additionalContext": "SNIPER VALIDATION REQUIRED: Agent '$AGENT_TYPE' modified $MODIFIED_COUNT code file(s): $MODIFIED_FILES. Run sniper agent now."
}
EOF
    exit 0
  fi
fi

echo "{\"message\": \"Agent $AGENT_TYPE completed (no code changes)\"}"
exit 0
