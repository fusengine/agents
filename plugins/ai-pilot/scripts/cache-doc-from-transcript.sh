#!/bin/bash
# cache-doc-from-transcript.sh - SubagentStop hook for research-expert
# Extracts Context7/Exa results from transcript and caches them.
# Uses jq-first approach (no grep-based line matching).

INPUT=$(cat)
AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // empty' 2>/dev/null)
[[ "$AGENT_TYPE" != *"research-expert"* ]] && exit 0

TRANSCRIPT=$(echo "$INPUT" | jq -r '.agent_transcript_path // empty' 2>/dev/null)
[[ -z "$TRANSCRIPT" || ! -f "$TRANSCRIPT" ]] && exit 0

hash_text() {
  if command -v sha256sum &>/dev/null; then
    sha256sum | cut -d' ' -f1 | cut -c1-16
  elif command -v shasum &>/dev/null; then
    shasum -a 256 | cut -d' ' -f1 | cut -c1-16
  else
    md5 | cut -c1-16
  fi
}

PROJECT_PATH=$(echo "$INPUT" | jq -r '.cwd // empty' 2>/dev/null)
[[ -z "$PROJECT_PATH" ]] && PROJECT_PATH="${CLAUDE_PROJECT_DIR:-${PWD}}"
PROJECT_HASH=$(echo -n "$PROJECT_PATH" | hash_text)

CACHE_DIR="$HOME/.claude/fusengine-cache/doc/$PROJECT_HASH"
DOCS_DIR="$CACHE_DIR/docs"
INDEX_FILE="$CACHE_DIR/index.json"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)

# Extract tool_use calls (id, name, library, topic) → temp file
CALLS_FILE=$(mktemp)
jq -c '.message.content[]? | select(.type=="tool_use" and (.name | test("context7__query-docs|exa__get_code_context|exa__web_search"))) | {id: .id, lib: (.input.libraryId // .input.query // ""), topic: (.input.topic // .input.query // "")}' "$TRANSCRIPT" 2>/dev/null > "$CALLS_FILE"

CALL_COUNT=$(wc -l < "$CALLS_FILE" 2>/dev/null | tr -d ' ')
[[ "$CALL_COUNT" == "0" || -z "$CALL_COUNT" ]] && { rm -f "$CALLS_FILE"; exit 0; }

# Extract tool_result entries (tool_use_id, text) → temp file
RESULTS_FILE=$(mktemp)
jq -c '.message.content[]? | select(.type=="tool_result") | {tid: .tool_use_id, text: (if (.content | type) == "array" then [.content[].text? // empty] | join("\n") elif (.content | type) == "string" then .content else "" end)}' "$TRANSCRIPT" 2>/dev/null > "$RESULTS_FILE"

mkdir -p "$DOCS_DIR"
if [[ -f "$INDEX_FILE" ]] && jq -e . "$INDEX_FILE" >/dev/null 2>&1; then
  INDEX=$(cat "$INDEX_FILE")
else
  INDEX=$(jq -n --arg p "$PROJECT_PATH" '{"project":$p,"docs":[]}')
fi

SAVED=0
while IFS= read -r call; do
  TOOL_ID=$(echo "$call" | jq -r '.id // empty' 2>/dev/null)
  LIBRARY=$(echo "$call" | jq -r '.lib // empty' 2>/dev/null)
  TOPIC=$(echo "$call" | jq -r '.topic // empty' 2>/dev/null)
  [[ -z "$TOOL_ID" || -z "$LIBRARY" ]] && continue

  # Match result by tool_use_id → write directly to file (no variable capture)
  DOC_HASH=$(echo -n "${LIBRARY}:${TOPIC}" | hash_text)
  DOC_FILE="$DOCS_DIR/${DOC_HASH}.md"
  grep "$TOOL_ID" "$RESULTS_FILE" 2>/dev/null | head -1 | jq -r '.text // empty' 2>/dev/null | head -c 20480 > "$DOC_FILE"
  SIZE_BYTES=$(wc -c < "$DOC_FILE" 2>/dev/null | tr -d ' ')
  [[ "$SIZE_BYTES" -lt 50 ]] 2>/dev/null && { rm -f "$DOC_FILE"; continue; }
  SIZE_KB=$(( SIZE_BYTES / 1024 ))

  INDEX=$(echo "$INDEX" | jq \
    --arg h "$DOC_HASH" --arg lib "$LIBRARY" \
    --arg top "$TOPIC" --arg ts "$TIMESTAMP" --argjson sz "$SIZE_KB" \
    '(.docs |= map(select(.hash != $h))) |
     .docs += [{"hash":$h,"library":$lib,"topic":$top,"timestamp":$ts,"size_kb":$sz}]')
  SAVED=$((SAVED + 1))
  [[ $SAVED -ge 15 ]] && break
done < "$CALLS_FILE"

rm -f "$CALLS_FILE" "$RESULTS_FILE"
[[ $SAVED -eq 0 ]] && exit 0
echo "$INDEX" | jq '.' > "$INDEX_FILE"
exit 0
