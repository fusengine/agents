#!/bin/bash
# framework-detection.sh - Common framework detection functions
set -euo pipefail

# @description Detect framework from query/path string
# @param $1 Query or path to analyze
# @returns Framework name via stdout
detect_framework_from_string() {
  local input="${1:-}"
  input=$(echo "$input" | tr '[:upper:]' '[:lower:]')

  if [[ "$input" == *react* && "$input" != *next* ]]; then echo "react"
  elif [[ "$input" == *next* ]]; then echo "nextjs"
  elif [[ "$input" == *tailwind* ]]; then echo "tailwind"
  elif [[ "$input" == *laravel* || "$input" == *php* ]]; then echo "laravel"
  elif [[ "$input" == *swift* || "$input" == *swiftui* || "$input" == *ios* ]]; then echo "swift"
  elif [[ "$input" == *design* || "$input" == *shadcn* || "$input" == *" ui"* ]]; then echo "design"
  else echo "generic"
  fi
}

# @description Detect project type from directory
# @param $1 Directory to check
# @returns Project type via stdout
detect_project_type() {
  local dir="${1:-.}"

  [[ -f "$dir/next.config.js" || -f "$dir/next.config.ts" || -f "$dir/next.config.mjs" ]] && { echo "nextjs"; return; }
  [[ -f "$dir/composer.json" && -f "$dir/artisan" ]] && { echo "laravel"; return; }
  [[ -f "$dir/Package.swift" ]] && { echo "swift"; return; }
  [[ -f "$dir/Cargo.toml" ]] && { echo "rust"; return; }
  [[ -f "$dir/go.mod" ]] && { echo "go"; return; }
  [[ -f "$dir/tailwind.config.js" || -f "$dir/tailwind.config.ts" ]] && { echo "tailwind"; return; }
  [[ -f "$dir/vite.config.ts" || -f "$dir/vite.config.js" ]] && { echo "react"; return; }
  echo "generic"
}

export -f detect_framework_from_string
export -f detect_project_type
