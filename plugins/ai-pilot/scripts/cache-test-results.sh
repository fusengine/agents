#!/bin/bash
# cache-test-results.sh - SubagentStop hook for sniper
# Extracts linter results from transcript and caches per-file checksums.
# SAFE: Never crashes parent hook. All errors → graceful degradation.

INPUT=$(cat)
AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // empty' 2>/dev/null)
[[ -z "$AGENT_TYPE" || "$AGENT_TYPE" != *"sniper"* ]] && exit 0
TRANSCRIPT=$(echo "$INPUT" | jq -r '.agent_transcript_path // empty' 2>/dev/null)
[[ -z "$TRANSCRIPT" || ! -f "$TRANSCRIPT" ]] && exit 0

hash_text() {
  if command -v sha256sum &>/dev/null; then sha256sum | cut -d' ' -f1 | cut -c1-16
  elif command -v shasum &>/dev/null; then shasum -a 256 | cut -d' ' -f1 | cut -c1-16
  else md5 | cut -c1-16; fi
}

PROJECT_PATH="${CLAUDE_PROJECT_DIR:-${PWD}}"
PROJECT_HASH=$(echo -n "$PROJECT_PATH" | hash_text)
CACHE_DIR="$HOME/.claude/fusengine-cache/tests/$PROJECT_HASH"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)
mkdir -p "$CACHE_DIR"
RESULTS="$CACHE_DIR/results.json"
TTL_HOURS=48

# Extract Bash tool_use entries containing linter commands
LINTER_CMDS=$(jq -c '.message.content[]? | select(.type=="tool_use" and .name=="Bash")
  | select(.input.command | test("eslint|tsc|biome|npx.*lint"; "i"))
  | .input.command' "$TRANSCRIPT" 2>/dev/null | sort -u)

[[ -z "$LINTER_CMDS" ]] && exit 0

# Extract tool_result entries for Bash linter calls (output text)
LINTER_OUTPUT=$(jq -r '
  select(.message.role == "tool") |
  .message.content[]? | select(.type == "tool_result" or .type == "text") |
  .text // .content // empty
' "$TRANSCRIPT" 2>/dev/null)

# Collect all source files in project (max 200)
SRC_FILES=$(find "$PROJECT_PATH/src" \
  -maxdepth 6 -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  2>/dev/null | head -200)
[[ -z "$SRC_FILES" ]] && exit 0

# Load existing cache if present
if [[ -f "$RESULTS" ]]; then
  EXISTING=$(cat "$RESULTS" 2>/dev/null)
else
  EXISTING='{"timestamp":"","files":{}}'
fi

# Build new file entries with checksums
TEMP_FILE=$(mktemp)
echo '{}' > "$TEMP_FILE"

while IFS= read -r filepath; do
  [[ ! -f "$filepath" ]] && continue
  REL_PATH="${filepath#"$PROJECT_PATH"/}"
  CHECKSUM=$(shasum -a 256 "$filepath" 2>/dev/null | cut -d' ' -f1 | cut -c1-16)
  [[ -z "$CHECKSUM" ]] && continue

  # Check if file had errors in linter output
  BASENAME=$(basename "$filepath")
  ESLINT_STATUS="pass"
  TSC_STATUS="pass"
  echo "$LINTER_OUTPUT" | grep -q "$BASENAME.*error\|error.*$BASENAME" 2>/dev/null && ESLINT_STATUS="fail"
  echo "$LINTER_OUTPUT" | grep -q "$REL_PATH.*error\|error.*$REL_PATH" 2>/dev/null && ESLINT_STATUS="fail"

  jq --arg f "$REL_PATH" --arg c "$CHECKSUM" --arg e "$ESLINT_STATUS" \
     --arg t "$TSC_STATUS" --arg ts "$TIMESTAMP" \
    '.[$f] = {checksum: $c, eslint: $e, tsc: $t, last_tested: $ts}' \
    "$TEMP_FILE" > "${TEMP_FILE}.tmp" 2>/dev/null && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
done <<< "$SRC_FILES"

# Merge with existing cache (new entries override old)
MERGED_FILES=$(jq -s '.[0].files // {} | . * .[1]' \
  <(echo "$EXISTING") "$TEMP_FILE" 2>/dev/null)

# Remove entries older than 48h
CUTOFF=$(( $(date +%s) - TTL_HOURS * 3600 ))
if [[ "$(uname)" == "Darwin" ]]; then
  CLEAN_FILES=$(echo "$MERGED_FILES" | jq --arg cutoff "$CUTOFF" '
    to_entries | map(select(
      (.value.last_tested // "" | if . != "" then
        (split("T") | .[0] + "T" + .[1]) as $ts | now - 172800 < now
      else false end) // true
    )) | from_entries' 2>/dev/null || echo "$MERGED_FILES")
else
  CLEAN_FILES="$MERGED_FILES"
fi

# Write final results
jq -n --arg ts "$TIMESTAMP" --argjson files "${MERGED_FILES:-{}}" \
  '{timestamp: $ts, files: $files}' > "$RESULTS" 2>/dev/null

rm -f "$TEMP_FILE" "${TEMP_FILE}.tmp"
exit 0
