#!/bin/bash
# validate-solid-common.sh - Common SOLID validation functions
set -euo pipefail

# @description Count non-empty, non-comment lines
# @param $1 Content  @param $2 Comment pattern (optional, default: //)
count_code_lines() {
  local content="$1" comment="${2:-//}"
  echo "$content" | grep -v '^\s*$' | grep -v "^\s*$comment" | grep -v '^\s*\*' | wc -l | tr -d ' '
}

# @description Block with exit 2 + stderr for SOLID violation
# @param $1 File path  @param $2+ Violations
deny_solid_violation() {
  local file_path="$1"; shift
  local violations=("$@")
  local reason="SOLID VIOLATION in $file_path: "
  for v in "${violations[@]}"; do
    reason+="$v "
  done
  echo "$reason" >&2
  exit 2
}

export -f count_code_lines
export -f deny_solid_violation
