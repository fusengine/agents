#!/bin/bash
# cache-analytics-save.sh - SessionEnd hook for cache analytics aggregation
# Aggregates hits/misses from sessions.jsonl, estimates tokens saved, updates summary.json
# SAFE: Never crashes. All errors suppressed.

ANALYTICS_DIR="$HOME/.claude/fusengine-cache/analytics"
SF="$ANALYTICS_DIR/sessions.jsonl"
SUMMARY_FILE="$ANALYTICS_DIR/summary.json"

[[ ! -f "$SF" || ! -s "$SF" ]] && exit 0
mkdir -p "$ANALYTICS_DIR" 2>/dev/null || exit 0

count_by() { grep -c "\"type\":\"$1\".*\"action\":\"$2\"" "$SF" 2>/dev/null || echo 0; }

EXPLORE_HITS=$(count_by "explore" "hit")
EXPLORE_MISSES=$(count_by "explore" "miss")
DOC_HITS=$(count_by "doc" "hit")
DOC_MISSES=$(count_by "doc" "miss")
DOC_BLOCKED=$(count_by "doc" "blocked")
LESSONS_HITS=$(count_by "lessons" "hit")
LESSONS_MISSES=$(count_by "lessons" "miss")
TESTS_HITS=$(count_by "tests" "hit")
TESTS_MISSES=$(count_by "tests" "miss")

DOC_TOTAL_HITS=$((DOC_HITS + DOC_BLOCKED))
TOKENS_SAVED=$(( EXPLORE_HITS * 15000 + DOC_BLOCKED * 10000 + LESSONS_HITS * 3000 + TESTS_HITS * 5000 ))
SESSION_COUNT=$(jq -r '.session' "$SF" 2>/dev/null | sort -u | wc -l | tr -d ' ')

old_val() { [[ -f "$SUMMARY_FILE" ]] && jq -r "$1 // 0" "$SUMMARY_FILE" 2>/dev/null || echo 0; }
OLD_SESSIONS=$(old_val '.total_sessions') OLD_TOKENS=$(old_val '.estimated_tokens_saved')
OLD_EH=$(old_val '.cache_hits.explore') OLD_DH=$(old_val '.cache_hits.doc')
OLD_LH=$(old_val '.cache_hits.lessons') OLD_TH=$(old_val '.cache_hits.tests')
OLD_EM=$(old_val '.cache_misses.explore') OLD_DM=$(old_val '.cache_misses.doc')
OLD_LM=$(old_val '.cache_misses.lessons') OLD_TM=$(old_val '.cache_misses.tests')

T_EH=$((OLD_EH + EXPLORE_HITS)) T_DH=$((OLD_DH + DOC_TOTAL_HITS))
T_LH=$((OLD_LH + LESSONS_HITS)) T_TH=$((OLD_TH + TESTS_HITS))
T_EM=$((OLD_EM + EXPLORE_MISSES)) T_DM=$((OLD_DM + DOC_MISSES))
T_LM=$((OLD_LM + LESSONS_MISSES)) T_TM=$((OLD_TM + TESTS_MISSES))
T_SESSIONS=$((OLD_SESSIONS + SESSION_COUNT)) T_TOKENS=$((OLD_TOKENS + TOKENS_SAVED))
calc_rate() { [[ $(($1+$2)) -eq 0 ]] && echo "0%" || echo "$(($1*100/($1+$2)))%"; }
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null)
jq -nc \
  --arg updated "$TIMESTAMP" \
  --argjson ts "$T_SESSIONS" --argjson tokens "$T_TOKENS" \
  --argjson eh "$T_EH" --argjson dh "$T_DH" --argjson lh "$T_LH" --argjson th "$T_TH" \
  --argjson em "$T_EM" --argjson dm "$T_DM" --argjson lm "$T_LM" --argjson tm "$T_TM" \
  --arg re "$(calc_rate $T_EH $T_EM)" --arg rd "$(calc_rate $T_DH $T_DM)" \
  --arg rl "$(calc_rate $T_LH $T_LM)" --arg rt "$(calc_rate $T_TH $T_TM)" \
  '{updated:$updated,total_sessions:$ts,
    cache_hits:{explore:$eh,doc:$dh,lessons:$lh,tests:$th},
    cache_misses:{explore:$em,doc:$dm,lessons:$lm,tests:$tm},
    hit_rates:{explore:$re,doc:$rd,lessons:$rl,tests:$rt},
    estimated_tokens_saved:$tokens}' \
  > "$SUMMARY_FILE" 2>/dev/null

# Cleanup entries older than 30 days
if [[ "$(uname)" == "Darwin" ]]; then
  CUTOFF=$(date -u -v-30d +%Y-%m-%dT%H:%M:%SZ 2>/dev/null)
else
  CUTOFF=$(date -u -d "30 days ago" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null)
fi
[[ -n "$CUTOFF" ]] && jq -c "select(.ts >= \"$CUTOFF\")" "$SF" > "${SF}.tmp" 2>/dev/null \
  && mv "${SF}.tmp" "$SF" 2>/dev/null
exit 0
