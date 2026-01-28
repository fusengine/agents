#!/bin/bash
# Track agent executions in Memory MCP for intelligent workflow orchestration

INPUT=$(cat)
LOG_DIR="$HOME/.claude/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/hooks.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SubagentStop/track-agent-memory] $1" >> "$LOG_FILE"
}

# Extract agent info
if command -v jq &> /dev/null; then
  AGENT_ID=$(echo "$INPUT" | jq -r '.agent_id // "unknown"')
  SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
  AGENT_TRANSCRIPT=$(echo "$INPUT" | jq -r '.agent_transcript_path // ""')

  log "Agent completed: $AGENT_ID (session: $SESSION_ID)"

  # Prepare Memory MCP storage (simplified - actual MCP integration would use mcp__memory__ tools)
  MEMORY_DIR="$HOME/.claude/memory/agents"
  mkdir -p "$MEMORY_DIR"

  TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  MEMORY_FILE="$MEMORY_DIR/agent-history.jsonl"

  # Append agent execution record (JSONL format)
  jq -n \
    --arg agentId "$AGENT_ID" \
    --arg sessionId "$SESSION_ID" \
    --arg timestamp "$TIMESTAMP" \
    --arg transcript "$AGENT_TRANSCRIPT" \
    '{
      entityType: "agent_execution",
      agentId: $agentId,
      sessionId: $sessionId,
      completedAt: $timestamp,
      transcriptPath: $transcript
    }' >> "$MEMORY_FILE"

  log "Agent execution recorded in memory"

  # Check recent agent history (last 5 agents)
  RECENT_AGENTS=$(tail -n 5 "$MEMORY_FILE" | jq -r '.agentId' | tr '\n' ',' | sed 's/,$//')

  log "Recent agents: $RECENT_AGENTS"

  # Output for potential workflow orchestration
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
else
  log "jq not available, memory tracking skipped"
  echo '{"memoryEnabled": false}'
fi

exit 0
