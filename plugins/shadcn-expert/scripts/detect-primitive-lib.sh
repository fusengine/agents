#!/bin/bash
# detect-primitive-lib.sh - Detect Radix UI vs Base UI in project
set -euo pipefail

PROJECT_ROOT="${1:-$(pwd)}"
RADIX_SCORE=0
BASEUI_SCORE=0
SIGNALS=()

# Step 1: Check package.json (weight: 40)
if [[ -f "$PROJECT_ROOT/package.json" ]]; then
  if grep -q '"@radix-ui/react-' "$PROJECT_ROOT/package.json" 2>/dev/null; then
    RADIX_SCORE=$((RADIX_SCORE + 40))
    SIGNALS+=("pkg:radix-ui")
  fi
  if grep -q '"@base-ui/react' "$PROJECT_ROOT/package.json" 2>/dev/null; then
    BASEUI_SCORE=$((BASEUI_SCORE + 40))
    SIGNALS+=("pkg:base-ui")
  fi
fi

# Step 2: Check components.json style (weight: 20)
if [[ -f "$PROJECT_ROOT/components.json" ]]; then
  STYLE=$(jq -r '.style // empty' "$PROJECT_ROOT/components.json" 2>/dev/null)
  if [[ "$STYLE" == "new-york" || "$STYLE" == "default" ]]; then
    RADIX_SCORE=$((RADIX_SCORE + 20))
    SIGNALS+=("style:$STYLE")
  elif [[ "$STYLE" == "base-vega" ]]; then
    BASEUI_SCORE=$((BASEUI_SCORE + 20))
    SIGNALS+=("style:base-vega")
  fi
fi

# Step 3: Scan imports (weight: 25)
SCAN_DIRS=("$PROJECT_ROOT/src" "$PROJECT_ROOT/components" "$PROJECT_ROOT/app")
for dir in "${SCAN_DIRS[@]}"; do
  [[ -d "$dir" ]] || continue
  if grep -rq '@radix-ui/react-' "$dir" 2>/dev/null; then
    RADIX_SCORE=$((RADIX_SCORE + 25))
    SIGNALS+=("import:radix")
    break
  fi
done
for dir in "${SCAN_DIRS[@]}"; do
  [[ -d "$dir" ]] || continue
  if grep -rq '@base-ui/react' "$dir" 2>/dev/null; then
    BASEUI_SCORE=$((BASEUI_SCORE + 25))
    SIGNALS+=("import:base-ui")
    break
  fi
done

# Step 4: Check data attributes (weight: 15)
for dir in "${SCAN_DIRS[@]}"; do
  [[ -d "$dir" ]] || continue
  if grep -rq 'data-state=' "$dir" 2>/dev/null; then
    RADIX_SCORE=$((RADIX_SCORE + 15))
    SIGNALS+=("attr:data-state")
    break
  fi
done
for dir in "${SCAN_DIRS[@]}"; do
  [[ -d "$dir" ]] || continue
  if grep -rq 'data-\[open\]' "$dir" 2>/dev/null; then
    BASEUI_SCORE=$((BASEUI_SCORE + 15))
    SIGNALS+=("attr:data-[open]")
    break
  fi
done

# Step 5: Detect package manager (lockfile priority)
PM="npm"
RUNNER="npx"
if [[ -f "$PROJECT_ROOT/bun.lockb" || -f "$PROJECT_ROOT/bun.lock" ]]; then
  PM="bun"; RUNNER="bunx"
elif [[ -f "$PROJECT_ROOT/pnpm-lock.yaml" ]]; then
  PM="pnpm"; RUNNER="pnpm dlx"
elif [[ -f "$PROJECT_ROOT/yarn.lock" ]]; then
  PM="yarn"; RUNNER="yarn dlx"
fi
SIGNALS+=("pm:$PM")

# Determine result
if [[ $RADIX_SCORE -gt 0 && $BASEUI_SCORE -gt 0 ]]; then
  PRIMITIVE="mixed"
  CONFIDENCE=$(( (RADIX_SCORE + BASEUI_SCORE) / 2 ))
elif [[ $RADIX_SCORE -gt $BASEUI_SCORE ]]; then
  PRIMITIVE="radix"
  CONFIDENCE=$RADIX_SCORE
elif [[ $BASEUI_SCORE -gt $RADIX_SCORE ]]; then
  PRIMITIVE="base-ui"
  CONFIDENCE=$BASEUI_SCORE
else
  PRIMITIVE="none"
  CONFIDENCE=0
fi

SIGNALS_JSON=$(printf '"%s",' "${SIGNALS[@]}" | sed 's/,$//')
echo "{\"primitive\":\"$PRIMITIVE\",\"confidence\":$CONFIDENCE,\"pm\":\"$PM\",\"runner\":\"$RUNNER\",\"signals\":[$SIGNALS_JSON]}"
