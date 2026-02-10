#!/bin/bash
# lessons-cache-inject.sh - SubagentStart hook: inject cached lessons into ALL agents
# Reads project + global lessons, aggregates, deduplicates, injects known issues.
# SAFE: Never crashes parent hook. All errors → graceful degradation.

INPUT=$(cat)

hash_text() {
  if command -v sha256sum &>/dev/null; then sha256sum | cut -d' ' -f1 | cut -c1-16
  elif command -v shasum &>/dev/null; then shasum -a 256 | cut -d' ' -f1 | cut -c1-16
  else md5 | cut -c1-16; fi
}

detect_stack() {
  local p="${1:-.}"
  if ls "$p"/next.config.* &>/dev/null; then echo "nextjs"
  elif [[ -f "$p/composer.json" ]]; then echo "laravel"
  elif ls "$p"/*.xcodeproj &>/dev/null || [[ -f "$p/Package.swift" ]]; then echo "swift"
  elif ls "$p"/tailwind.config.* &>/dev/null; then echo "tailwindcss"
  else echo "universal"; fi
}

PROJECT_PATH="${CLAUDE_PROJECT_DIR:-${PWD}}"
HASH=$(echo -n "$PROJECT_PATH" | hash_text)
CACHE_DIR="$HOME/.claude/fusengine-cache/lessons/$HASH"
GLOBAL_DIR="$HOME/.claude/fusengine-cache/lessons/_global"
STACK=$(detect_stack "$PROJECT_PATH")
MAX_AGE_DAYS=30
HAS_LOCAL=false HAS_GLOBAL=false

# Aggregate local project lessons
if [[ -d "$CACHE_DIR" ]]; then
  find "$CACHE_DIR" -name "*.json" -mtime +${MAX_AGE_DAYS} -delete 2>/dev/null
  shopt -s nullglob; LOCAL_FILES=("$CACHE_DIR"/*.json); shopt -u nullglob
  if [[ ${#LOCAL_FILES[@]} -gt 0 ]]; then
    LOCAL=$(jq -s '[.[].errors[]?] | group_by(.error_type + ":" + .pattern) |
      map({error_type:.[0].error_type, pattern:.[0].pattern, fix:.[0].fix,
        count:length, files:[.[].files[]?]|unique, code:([.[].code.line[]?]|unique|.[0:5]),
        scope:"local"}) | sort_by(-.count)' "${LOCAL_FILES[@]}" 2>/dev/null)
    [[ -n "$LOCAL" && "$LOCAL" != "[]" && "$LOCAL" != "null" ]] && HAS_LOCAL=true
  fi
fi

# Load global lessons (stack-specific + universal)
GLOBAL='[]'
for gfile in "$GLOBAL_DIR/${STACK}.json" "$GLOBAL_DIR/universal.json"; do
  [[ ! -f "$gfile" ]] && continue
  GDATA=$(jq 'map(. + {scope:"global"})' "$gfile" 2>/dev/null) || continue
  GLOBAL=$(jq -n --argjson a "$GLOBAL" --argjson b "$GDATA" '$a + $b' 2>/dev/null)
  HAS_GLOBAL=true
done

[[ "$HAS_LOCAL" == "false" && "$HAS_GLOBAL" == "false" ]] && exit 0

# Merge local + global, dedup by error_type+pattern, local priority, top 10
$HAS_LOCAL && ALL_SRC="$LOCAL" || ALL_SRC='[]'
AGGREGATED=$(jq -n --argjson local "$ALL_SRC" --argjson global "$GLOBAL" '
  ($local + $global) | group_by(.error_type + ":" + .pattern) |
  map(sort_by(if .scope == "local" then 0 else 1 end) |
    {error_type:.[0].error_type, pattern:.[0].pattern, fix:.[0].fix,
     count:([.[].count]|add), scope:.[0].scope,
     files:[.[].files[]?]|unique, code:.[0].code})
  | sort_by(-.count) | .[0:10]' 2>/dev/null)

[[ -z "$AGGREGATED" || "$AGGREGATED" == "[]" || "$AGGREGATED" == "null" ]] && exit 0
LESSON_COUNT=$(echo "$AGGREGATED" | jq 'length' 2>/dev/null)
[[ "$LESSON_COUNT" -eq 0 ]] && exit 0

# Build readable list with scope tags
LESSON_LIST=$(echo "$AGGREGATED" | jq -r '
  to_entries | .[] |
  "\(.key+1). [\(.value.count)x \(.value.scope)] | \(.value.pattern//"unknown") → \(.value.fix//"see docs")" +
  (if (.value.code|length) > 0 then "\n     Code: "+(.value.code|join(" | ")|.[0:200]) else "" end)
' 2>/dev/null)
[[ -z "$LESSON_LIST" ]] && exit 0

# Analytics
ANALYTICS_DIR="$HOME/.claude/fusengine-cache/analytics"; mkdir -p "$ANALYTICS_DIR"
TS=$(date +%Y-%m-%dT%H:%M:%S)
echo "{\"ts\":\"$TS\",\"type\":\"lessons\",\"action\":\"hit\",\"count\":$LESSON_COUNT,\"stack\":\"$STACK\"}" \
  >> "$ANALYTICS_DIR/sessions.jsonl" 2>/dev/null

CACHE_CTX="## KNOWN PROJECT ISSUES (from previous sniper validations)
These errors have been found and fixed before. AVOID them:
${LESSON_LIST}

INSTRUCTION: Check your code against these known issues BEFORE submitting."

if ! ESCAPED=$(echo "$CACHE_CTX" | jq -Rs '.' 2>/dev/null); then ESCAPED='""'; fi
cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SubagentStart",
    "additionalContext": $ESCAPED
  }
}
EOF
