#!/bin/bash
# check-skill-common.sh - Common skill check functions
set -euo pipefail

# @description Find project root by markers
# @param $1 Start directory  @param $2+ Marker files/dirs
find_project_root() {
  local dir="$1"; shift
  local markers=("$@")
  while [[ "$dir" != "/" ]]; do
    for marker in "${markers[@]}"; do
      [[ -e "$dir/$marker" ]] && { echo "$dir"; return; }
    done
    dir=$(dirname "$dir")
  done
  echo "${PWD}"
}

# @description Check if skill was consulted (session or APEX)
# @param $1 Framework  @param $2 Session ID  @param $3 Project root
skill_was_consulted() {
  local framework="$1" session_id="$2" project_root="$3"
  local tracking_file="/tmp/claude-skill-tracking/${framework}-${session_id}"
  [[ -f "$tracking_file" ]] && return 0
  local task_file="$project_root/.claude/apex/task.json"
  if [[ -f "$task_file" ]]; then
    local task doc
    task=$(jq -r '.current_task // "1"' "$task_file")
    doc=$(jq -r --arg t "$task" --arg f "$framework" '.tasks[$t].doc_consulted[$f].consulted // false' "$task_file")
    [[ "$doc" == "true" ]] && return 0
  fi
  return 1
}

# @description Block with hookSpecificOutput format (for PreToolUse)
# @param $1 Reason message
deny_block() {
  local reason="$1"
  cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "$reason"
  }
}
EOF
  exit 0
}

export -f find_project_root
export -f skill_was_consulted
export -f deny_block
