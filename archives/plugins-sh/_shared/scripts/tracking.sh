#!/bin/bash
# tracking.sh - Centralized tracking functions for skill/MCP usage
set -euo pipefail

# @description Track skill read
# @param $1 Framework  @param $2 Skill  @param $3 Topic  @param $4 Session ID (optional)
track_skill_read() {
  local framework="${1:?}" skill="${2:?}" topic="${3:?}" session_id="${4:-$$}"
  local timestamp tracking_dir tracking_file
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  tracking_dir="/tmp/claude-skill-tracking"
  mkdir -p "$tracking_dir"
  tracking_file="$tracking_dir/${framework}-${session_id}"
  echo "$timestamp SKILL:$skill $topic" >> "$tracking_file"
  [[ "$framework" != "generic" ]] && echo "$timestamp SKILL:$skill $topic" >> "$tracking_dir/generic-${session_id}"
  return 0
}

# @description Track MCP research call
# @param $1 Source  @param $2 Tool  @param $3 Query  @param $4 Session ID (optional)
track_mcp_research() {
  local source="${1:?}" tool="${2:?}" query="${3:?}" session_id="${4:-$$}"
  local timestamp tracking_dir framework
  query=$(echo "$query" | tr '[:upper:]' '[:lower:]')
  framework="generic"
  [[ "$query" == *react* ]] && framework="react"
  [[ "$query" == *next* ]] && framework="nextjs"
  [[ "$query" == *tailwind* ]] && framework="tailwind"
  [[ "$query" == *laravel* || "$query" == *php* ]] && framework="laravel"
  [[ "$query" == *swift* || "$query" == *swiftui* || "$query" == *ios* ]] && framework="swift"
  [[ "$query" == *design* || "$query" == *shadcn* || "$query" == *" ui"* ]] && framework="design"
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  tracking_dir="/tmp/claude-skill-tracking"
  mkdir -p "$tracking_dir"
  echo "$timestamp $source:$tool $query" >> "$tracking_dir/${framework}-${session_id}"
  [[ "$framework" != "generic" ]] && echo "$timestamp $source:$tool $query" >> "$tracking_dir/generic-${session_id}"
  return 0
}

export -f track_skill_read
export -f track_mcp_research
