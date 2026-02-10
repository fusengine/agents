#!/bin/bash
# promote-global-lessons.sh - Promote high-frequency errors to global lessons
# Called by cache-sniper-lessons.sh after saving per-project lessons
# Errors with count >= 3 in project get promoted to global stack-specific file

CACHE_DIR="$1"
STACK="$2"
PROJECT_HASH="$3"

[[ -z "$CACHE_DIR" || -z "$STACK" || -z "$PROJECT_HASH" ]] && exit 0

GLOBAL_DIR="$HOME/.claude/fusengine-cache/lessons/_global"
mkdir -p "$GLOBAL_DIR"
GLOBAL_FILE="$GLOBAL_DIR/${STACK}.json"

shopt -s nullglob
FILES=("$CACHE_DIR"/*.json)
shopt -u nullglob
[[ ${#FILES[@]} -eq 0 ]] && exit 0

# Aggregate project errors with count >= 3
CANDIDATES=$(jq -s '[.[].errors[]?] | group_by(.error_type + ":" + .pattern) |
  map({
    error_type: .[0].error_type,
    pattern: .[0].pattern,
    fix: .[0].fix,
    count: length,
    files: [.[].files[]?] | unique,
    code: {line: ([.[].code.line[]?] | unique | .[0:5])}
  }) | map(select(.count >= 3))' "${FILES[@]}" 2>/dev/null)

[[ -z "$CANDIDATES" || "$CANDIDATES" == "[]" || "$CANDIDATES" == "null" ]] && exit 0

# Merge with existing global file
if [[ -f "$GLOBAL_FILE" ]]; then
  EXISTING=$(jq '.' "$GLOBAL_FILE" 2>/dev/null || echo '[]')
else
  EXISTING='[]'
fi

# Merge: dedup by error_type+pattern, add source_projects, cap at 25
MERGED=$(jq -n --argjson candidates "$CANDIDATES" \
  --argjson existing "$EXISTING" --arg phash "$PROJECT_HASH" '
  ($existing + ($candidates | map(. + {source_projects: [$phash]}))) |
  group_by(.error_type + ":" + .pattern) |
  map({
    error_type: .[0].error_type,
    pattern: .[0].pattern,
    fix: .[0].fix,
    count: ([.[].count] | add),
    files: [.[].files[]?] | unique,
    code: {line: ([.[].code.line[]?] | unique | .[0:5])},
    source_projects: ([.[].source_projects[]?] | unique)
  }) | sort_by(-.count) | .[0:25]
' 2>/dev/null)

[[ -z "$MERGED" || "$MERGED" == "null" ]] && exit 0

echo "$MERGED" > "$GLOBAL_FILE" 2>/dev/null
PROMOTED=$(echo "$MERGED" | jq 'length' 2>/dev/null || echo 0)

# Analytics
ANALYTICS_DIR="$HOME/.claude/fusengine-cache/analytics"
mkdir -p "$ANALYTICS_DIR"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)
echo "{\"ts\":\"$TIMESTAMP\",\"type\":\"lessons\",\"action\":\"promoted\",\"count\":$PROMOTED,\"stack\":\"$STACK\"}" \
  >> "$ANALYTICS_DIR/sessions.jsonl" 2>/dev/null

exit 0
