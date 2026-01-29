#!/bin/bash
# Track agent executions in Memory MCP + trigger sniper after code modifications

INPUT=$(cat)
LOG_DIR="$HOME/.claude/logs"
STATE_DIR="/tmp/claude-code-sessions"
mkdir -p "$LOG_DIR" "$STATE_DIR"
LOG_FILE="$LOG_DIR/hooks.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SubagentStop/track-agent-memory] $1" >> "$LOG_FILE"
}

command -v jq &>/dev/null || { echo '{"memoryEnabled": false}'; exit 0; }

# Extract agent info
AGENT_ID=$(echo "$INPUT" | jq -r '.agent_id // "unknown"')
AGENT_TYPE=$(echo "$INPUT" | jq -r '.subagent_type // .agent_id // "unknown"')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
AGENT_TRANSCRIPT=$(echo "$INPUT" | jq -r '.agent_transcript_path // ""')

log "Agent completed: $AGENT_TYPE (session: $SESSION_ID)"

# ============================================
# PART 1: Memory MCP storage (original)
# ============================================
MEMORY_DIR="$HOME/.claude/memory/agents"
mkdir -p "$MEMORY_DIR"

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
MEMORY_FILE="$MEMORY_DIR/agent-history.jsonl"

# Append agent execution record (JSONL = compact, one line per record)
jq -c -n \
  --arg agentId "$AGENT_ID" \
  --arg agentType "$AGENT_TYPE" \
  --arg sessionId "$SESSION_ID" \
  --arg timestamp "$TIMESTAMP" \
  --arg transcript "$AGENT_TRANSCRIPT" \
  '{entityType:"agent_execution",agentId:$agentId,agentType:$agentType,sessionId:$sessionId,completedAt:$timestamp,transcriptPath:$transcript}' >> "$MEMORY_FILE"

log "Agent execution recorded in memory"

# Check recent agent history (last 5 agents) - each line is valid JSON
RECENT_AGENTS=$(tail -n 5 "$MEMORY_FILE" 2>/dev/null | jq -r '.agentType // .agentId' 2>/dev/null | tr '\n' ',' | sed 's/,$//')
log "Recent agents: $RECENT_AGENTS"

# ============================================
# PART 2: Sniper trigger after code mods
# ============================================
SKIP_AGENTS="sniper|sniper-faster|explore-codebase|research-expert|claude-code-guide|Explore|Plan"
if [[ "$AGENT_TYPE" =~ ($SKIP_AGENTS) ]]; then
  log "Skip sniper trigger for: $AGENT_TYPE"
  # Output memory info only
  jq -n \
    --arg agentId "$AGENT_ID" \
    --arg recentAgents "$RECENT_AGENTS" \
    --arg timestamp "$TIMESTAMP" \
    '{
      currentAgent: $agentId,
      recentAgents: ($recentAgents | split(",")),
      trackedAt: $timestamp,
      memoryEnabled: true
    }'
  exit 0
fi

# Check session state for modified files
STATE_FILE="$STATE_DIR/session-${SESSION_ID}-changes.json"
if [[ -f "$STATE_FILE" ]]; then
  MODIFIED_COUNT=$(jq -r '.cumulativeCodeFiles // 0' "$STATE_FILE" 2>/dev/null)
  MODIFIED_FILES=$(jq -r '.modifiedFiles | join(", ")' "$STATE_FILE" 2>/dev/null)

  if (( MODIFIED_COUNT > 0 )); then
    log "Code files modified: $MODIFIED_COUNT - Triggering sniper"

    # Reset counter after triggering sniper
    jq '.cumulativeCodeFiles = 0 | .sniperTriggered = true' "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

    # Return instruction to run sniper + memory info
    jq -n \
      --arg agentId "$AGENT_ID" \
      --arg agentType "$AGENT_TYPE" \
      --arg recentAgents "$RECENT_AGENTS" \
      --arg timestamp "$TIMESTAMP" \
      --arg modCount "$MODIFIED_COUNT" \
      --arg modFiles "$MODIFIED_FILES" \
      '{
        currentAgent: $agentId,
        recentAgents: ($recentAgents | split(",")),
        trackedAt: $timestamp,
        memoryEnabled: true,
        additionalContext: ("SNIPER VALIDATION REQUIRED: Agent \u0027" + $agentType + "\u0027 completed and modified " + $modCount + " code file(s). You MUST now run the sniper agent (Task tool with subagent_type=\u0027fuse-ai-pilot:sniper\u0027) to validate these modifications before continuing. Files: " + $modFiles)
      }'
    exit 0
  fi
fi

log "No code modifications detected"
# Output memory info only
jq -n \
  --arg agentId "$AGENT_ID" \
  --arg recentAgents "$RECENT_AGENTS" \
  --arg timestamp "$TIMESTAMP" \
  '{
    currentAgent: $agentId,
    recentAgents: ($recentAgents | split(",")),
    trackedAt: $timestamp,
    memoryEnabled: true
  }'
exit 0
