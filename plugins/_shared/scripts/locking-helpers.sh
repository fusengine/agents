#!/bin/bash
# locking-helpers.sh - Helper locking functions
set -euo pipefail

LOCKS_DIR="${LOCKS_DIR:-/tmp/claude-locks}"

# @description Check if lock is held
# @param $1 Lock name
# @returns 0 locked, 1 free
is_locked() {
  local lock_name="${1:?Lock name required}"
  [[ -d "$LOCKS_DIR/${lock_name}.lockdir" ]]
}

# @description Wait for lock to be released
# @param $1 Lock name
# @param $2 Max wait seconds (default: 300)
# @returns 0 released, 1 timeout
wait_for_lock() {
  local lock_name="${1:?Lock name required}"
  local max_wait="${2:-300}"
  local elapsed=0

  while is_locked "$lock_name" && [[ $elapsed -lt $max_wait ]]; do
    sleep 1
    elapsed=$((elapsed + 1))
  done

  [[ $elapsed -ge $max_wait ]] && return 1
  return 0
}

# @description Execute command with lock
# @param $1 Lock name
# @param $2+ Command
# @returns Command exit code
with_lock() {
  local lock_name="${1:?Lock name required}"
  shift

  source "$(dirname "${BASH_SOURCE[0]}")/locking-core.sh"

  acquire_lock "$lock_name" || { echo "ERROR: Cannot acquire lock '$lock_name'" >&2; return 1; }

  local exit_code=0
  "$@" || exit_code=$?

  release_lock "$lock_name"
  return $exit_code
}

export -f is_locked
export -f wait_for_lock
export -f with_lock
