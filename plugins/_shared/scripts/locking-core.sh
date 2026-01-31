#!/bin/bash
# locking-core.sh - Core locking functions (acquire/release)
set -euo pipefail

LOCKS_DIR="${LOCKS_DIR:-/tmp/claude-locks}"

# @description Acquire exclusive lock with timeout
# @param $1 Lock name
# @param $2 Timeout seconds (default: 30)
# @returns 0 success, 1 timeout
acquire_lock() {
  local lock_name="${1:?Lock name required}"
  local timeout="${2:-30}"
  local lock_dir="$LOCKS_DIR/${lock_name}.lockdir"
  local lock_file="$LOCKS_DIR/$lock_name.lock"
  local elapsed=0

  mkdir -p "$LOCKS_DIR"

  while [[ $elapsed -lt $timeout ]]; do
    if mkdir "$lock_dir" 2>/dev/null; then
      echo "$$" > "$lock_file"
      return 0
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done
  return 1
}

# @description Release a lock
# @param $1 Lock name
# @returns 0 success, 1 not owner
release_lock() {
  local lock_name="${1:?Lock name required}"
  local lock_file="$LOCKS_DIR/$lock_name.lock"
  local lock_dir="$LOCKS_DIR/${lock_name}.lockdir"

  if [[ -f "$lock_file" ]]; then
    local lock_pid
    lock_pid=$(cat "$lock_file" 2>/dev/null || echo "")
    [[ "$lock_pid" != "$$" ]] && return 1
  fi

  rm -f "$lock_file"
  rmdir "$lock_dir" 2>/dev/null || true
  return 0
}

export -f acquire_lock
export -f release_lock
