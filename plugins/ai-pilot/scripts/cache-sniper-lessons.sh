#!/bin/bash
# cache-sniper-lessons.sh - SubagentStop hook
# Captures error patterns + corrected code from sniper as {timestamp}.json
# Primary source: Edit tool_use entries (structured, reliable)
# Secondary source: text report (error descriptions)

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

detect_stack() {
  local p="${1:-.}"
  if ls "$p"/next.config.* &>/dev/null; then echo "nextjs"
  elif [[ -f "$p/composer.json" ]]; then echo "laravel"
  elif ls "$p"/*.xcodeproj &>/dev/null || [[ -f "$p/Package.swift" ]]; then echo "swift"
  elif ls "$p"/tailwind.config.* &>/dev/null; then echo "tailwindcss"
  else echo "universal"; fi
}

PROJECT_PATH="${CLAUDE_PROJECT_DIR:-${PWD}}"
PROJECT_HASH=$(echo -n "$PROJECT_PATH" | hash_text)
CACHE_DIR="$HOME/.claude/fusengine-cache/lessons/$PROJECT_HASH"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)
TS_SAFE=$(echo "$TIMESTAMP" | tr ':' '-')
mkdir -p "$CACHE_DIR"

# Extract Edit tool_use entries → temp file (bash $() fails on large jq output)
EDITS_FILE=$(mktemp)
jq -c '.message.content[]? | select(.type=="tool_use" and .name=="Edit")
  | {file: .input.file_path, old: .input.old_string, new: .input.new_string}' \
  "$TRANSCRIPT" 2>/dev/null \
  | jq -s 'map(select(.file != null)) | group_by(.file | split("/") | last)
    | map(last)' > "$EDITS_FILE" 2>/dev/null

EDIT_COUNT=$(jq 'length' "$EDITS_FILE" 2>/dev/null)
[[ -z "$EDIT_COUNT" || "$EDIT_COUNT" == "0" ]] && { rm -f "$EDITS_FILE"; exit 0; }

# Extract text report for context (error descriptions)
REPORT=$(awk '/"role":"assistant"/' "$TRANSCRIPT" | tail -1 \
  | jq -r '.message.content[]? | select(.type=="text") | .text // empty' 2>/dev/null \
  | head -500)

# Build lessons: one per edited file, with code + matched description
jq -n --arg p "$PROJECT_PATH" --arg ts "$TIMESTAMP" \
  --slurpfile edits "$EDITS_FILE" --arg report "$REPORT" '
{
  project: $p,
  timestamp: $ts,
  errors: ($edits[0] | map(
    (.file | split("/") | last) as $basename |
    # Try to find matching description in report
    ($report | split("\n") | map(select(test($basename; "i"))) | first // null) as $desc |
    # Categorize by code diff
    (if (.old | test("any"; "i")) then "type_any"
     elif (.new | test("use client"; "i")) then "missing_directive"
     elif (.new | test("displayName")) then "missing_display_name"
     elif (.new | test("onKeyDown|tabIndex|role="; "i")) then "missing_a11y"
     elif (.new | test("try|catch"; "i")) then "missing_error_handling"
     elif (.new | test("if.*null|\\?\\?")) then "null_safety"
     else "code_fix" end) as $etype |
    {
      error_type: $etype,
      pattern: ($desc // ("Code correction in " + $basename)),
      fix: ("Fix " + $etype + " in " + $basename),
      count: 1,
      last_seen: $ts,
      files: [.file],
      code: {
        line: (.new | split("\n") | map(select(. != "")) | .[0:10])
      }
    }
  ))
}' | jq -r '
  "{\"project\":" + (.project|@json) + ",\"timestamp\":" + (.timestamp|@json) + ",\"errors\":[\n" +
  ([.errors[] | @json] | join(",\n")) +
  "\n]}"
' > "$CACHE_DIR/${TS_SAFE}.json" 2>/dev/null

rm -f "$EDITS_FILE"

# Promote high-frequency errors to global lessons
STACK=$(detect_stack "$PROJECT_PATH")
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
bash "$SCRIPT_DIR/promote-global-lessons.sh" "$CACHE_DIR" "$STACK" "$PROJECT_HASH" 2>/dev/null &

# Analytics logging
ANALYTICS_DIR="$HOME/.claude/fusengine-cache/analytics"
mkdir -p "$ANALYTICS_DIR"
echo "{\"ts\":\"$TIMESTAMP\",\"type\":\"lessons\",\"action\":\"hit\",\"count\":$EDIT_COUNT}" \
  >> "$ANALYTICS_DIR/sessions.jsonl" 2>/dev/null

exit 0
