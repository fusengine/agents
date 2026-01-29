#!/bin/bash
# Agent coherence validation script
# Usage: bash scripts/validate-agents.sh

set -euo pipefail

PLUGINS_DIR="plugins"
ISSUES_FOUND=0

echo "============================================="
echo "  Agent Coherence Validation"
echo "============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_error() {
  echo -e "${RED}❌ ERROR${NC}: $1"
  ((ISSUES_FOUND++))
}

log_warning() {
  echo -e "${YELLOW}⚠️  WARNING${NC}: $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

# 1. Check YAML frontmatter structure
echo "1. Checking YAML frontmatter structure..."
for agent_file in ${PLUGINS_DIR}/*/agents/*.md; do
  if [ -f "$agent_file" ]; then
    # Check frontmatter presence
    if ! grep -q "^---$" "$agent_file" | head -1; then
      log_error "$agent_file: Missing YAML frontmatter"
      continue
    fi

    # Check required fields
    for field in "name:" "description:" "model:" "color:" "tools:"; do
      if ! grep -q "^$field" "$agent_file"; then
        log_error "$agent_file: Missing '$field' field in frontmatter"
      fi
    done
  fi
done
log_success "Frontmatter structure verified"
echo ""

# 2. Check 'Forbidden' section presence
echo "2. Checking 'Forbidden' section..."
for agent_file in ${PLUGINS_DIR}/*/agents/*.md; do
  if [ -f "$agent_file" ]; then
    if ! grep -qi "^## Forbidden" "$agent_file" && ! grep -qi "^## Forbidden Behaviors" "$agent_file"; then
      log_warning "$agent_file: Missing 'Forbidden' section"
    fi
  fi
done
log_success "'Forbidden' sections verified"
echo ""

# 3. Detect duplicate hook scripts
echo "3. Detecting duplicate hook scripts..."
DUPLICATE_SCRIPTS=0
for script_name in "track-skill-read.sh" "track-mcp-research.sh" "check-shadcn-install.sh" "validate-solid.sh"; do
  script_count=$(find ${PLUGINS_DIR} -name "$script_name" 2>/dev/null | wc -l)
  if [ "$script_count" -gt 1 ]; then
    log_error "Script '$script_name' duplicated in $script_count plugins"
    ((DUPLICATE_SCRIPTS++))
  fi
done
if [ "$DUPLICATE_SCRIPTS" -eq 0 ]; then
  log_success "No duplicate hook scripts"
else
  log_error "$DUPLICATE_SCRIPTS duplicate script types detected"
fi
echo ""

# 4. Check Edit/Write tools coherence
echo "4. Checking Edit/Write tools coherence..."
for agent_file in ${PLUGINS_DIR}/*/agents/*.md; do
  if [ -f "$agent_file" ]; then
    has_edit=$(grep "^tools:" "$agent_file" | grep -c "Edit" || true)
    has_write=$(grep "^tools:" "$agent_file" | grep -c "Write" || true)

    if [ "$has_edit" -gt 0 ] && [ "$has_write" -eq 0 ]; then
      log_warning "$agent_file: Has 'Edit' but not 'Write' (inconsistent)"
    fi
  fi
done
log_success "Edit/Write coherence verified"
echo ""

# 5. Check valid model presence
echo "5. Checking valid models..."
VALID_MODELS="sonnet|haiku|opus"
for agent_file in ${PLUGINS_DIR}/*/agents/*.md; do
  if [ -f "$agent_file" ]; then
    model=$(grep "^model:" "$agent_file" | sed 's/model: //' || true)
    if [ -n "$model" ] && ! echo "$model" | grep -qE "^($VALID_MODELS)$"; then
      log_error "$agent_file: Invalid model '$model' (expected: sonnet, haiku, opus)"
    fi
  fi
done
log_success "Valid models verified"
echo ""

# 6. Detect agents without workflow
echo "6. Detecting agents without structured workflow..."
for agent_file in ${PLUGINS_DIR}/*/agents/*.md; do
  if [ -f "$agent_file" ]; then
    if ! grep -qi "workflow" "$agent_file" && ! grep -qi "protocol" "$agent_file" && ! grep -qi "process" "$agent_file"; then
      log_warning "$agent_file: No workflow/protocol/process detected"
    fi
  fi
done
log_success "Workflows verified"
echo ""

# Summary
echo "============================================="
echo "  Summary"
echo "============================================="
if [ "$ISSUES_FOUND" -eq 0 ]; then
  log_success "No critical errors detected"
  exit 0
else
  log_error "$ISSUES_FOUND critical errors detected"
  exit 1
fi
