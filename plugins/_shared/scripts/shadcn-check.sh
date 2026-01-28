#!/bin/bash
# shadcn-check.sh - Centralized shadcn/ui verification
set -euo pipefail

# @description Check if shadcn/ui is installed
# @param $1 Project root (optional, default: .)
# @returns 0 if installed, 1 if not
check_shadcn_installed() {
  local project_root="${1:-.}"
  [[ -f "$project_root/components.json" ]] && return 0
  if [[ -d "$project_root/src/components/ui" ]] && \
     [[ -f "$project_root/package.json" ]] && \
     grep -q '"shadcn-ui"' "$project_root/package.json" 2>/dev/null; then
    return 0
  fi
  return 1
}

# @description Validate specific shadcn component exists
# @param $1 Component name (button, dialog, etc.)
# @param $2 Project root (optional)
# @returns 0 if available, 1 if not
validate_shadcn_component() {
  local component="${1:?Component required}" project_root="${2:-.}"
  check_shadcn_installed "$project_root" || return 1
  [[ -f "$project_root/src/components/ui/${component}.tsx" ]] && return 0
  [[ -f "$project_root/src/components/ui/${component}.jsx" ]] && return 0
  [[ -f "$project_root/components/ui/${component}.tsx" ]] && return 0
  [[ -f "$project_root/components/ui/${component}.jsx" ]] && return 0
  return 1
}

# @description List all installed shadcn components
# @param $1 Project root (optional)
# @returns 0 success, 1 no components
get_shadcn_components_list() {
  local project_root="${1:-.}" components_dir=""
  [[ -d "$project_root/src/components/ui" ]] && components_dir="$project_root/src/components/ui"
  [[ -d "$project_root/components/ui" ]] && components_dir="$project_root/components/ui"
  [[ -z "$components_dir" ]] && return 1
  find "$components_dir" -maxdepth 1 \( -name "*.tsx" -o -name "*.jsx" \) | sed 's|.*/||; s/\.[tj]sx$//' | sort
}

export -f check_shadcn_installed
export -f validate_shadcn_component
export -f get_shadcn_components_list
