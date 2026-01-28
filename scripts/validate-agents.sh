#!/bin/bash
# Script de validation de la cohérence des agents
# Usage: bash scripts/validate-agents.sh

set -euo pipefail

PLUGINS_DIR="plugins"
ISSUES_FOUND=0

echo "============================================="
echo "  Validation de la cohérence des agents"
echo "============================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de logging
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

# 1. Vérifier structure frontmatter YAML
echo "1. Vérification structure frontmatter YAML..."
for agent_file in ${PLUGINS_DIR}/*/agents/*.md; do
  if [ -f "$agent_file" ]; then
    # Vérifier présence frontmatter
    if ! grep -q "^---$" "$agent_file" | head -1; then
      log_error "$agent_file: Frontmatter YAML manquant"
      continue
    fi
    
    # Vérifier champs obligatoires
    for field in "name:" "description:" "model:" "color:" "tools:"; do
      if ! grep -q "^$field" "$agent_file"; then
        log_error "$agent_file: Champ '$field' manquant dans frontmatter"
      fi
    done
  fi
done
log_success "Structure frontmatter vérifiée"
echo ""

# 2. Vérifier présence section "Forbidden"
echo "2. Vérification section 'Forbidden'..."
for agent_file in ${PLUGINS_DIR}/*/agents/*.md; do
  if [ -f "$agent_file" ]; then
    if ! grep -qi "^## Forbidden" "$agent_file" && ! grep -qi "^## Forbidden Behaviors" "$agent_file"; then
      log_warning "$agent_file: Section 'Forbidden' manquante"
    fi
  fi
done
log_success "Sections 'Forbidden' vérifiées"
echo ""

# 3. Détecter scripts hooks dupliqués
echo "3. Détection scripts hooks dupliqués..."
DUPLICATE_SCRIPTS=0
for script_name in "track-skill-read.sh" "track-mcp-research.sh" "check-shadcn-install.sh" "validate-solid.sh"; do
  script_count=$(find ${PLUGINS_DIR} -name "$script_name" 2>/dev/null | wc -l)
  if [ "$script_count" -gt 1 ]; then
    log_error "Script '$script_name' dupliqué dans $script_count plugins"
    ((DUPLICATE_SCRIPTS++))
  fi
done
if [ "$DUPLICATE_SCRIPTS" -eq 0 ]; then
  log_success "Aucun script hook dupliqué"
else
  log_error "$DUPLICATE_SCRIPTS types de scripts dupliqués détectés"
fi
echo ""

# 4. Vérifier cohérence outils Edit/Write
echo "4. Vérification cohérence outils Edit/Write..."
for agent_file in ${PLUGINS_DIR}/*/agents/*.md; do
  if [ -f "$agent_file" ]; then
    has_edit=$(grep "^tools:" "$agent_file" | grep -c "Edit" || true)
    has_write=$(grep "^tools:" "$agent_file" | grep -c "Write" || true)
    
    if [ "$has_edit" -gt 0 ] && [ "$has_write" -eq 0 ]; then
      log_warning "$agent_file: A 'Edit' mais pas 'Write' (incohérent)"
    fi
  fi
done
log_success "Cohérence Edit/Write vérifiée"
echo ""

# 5. Vérifier présence modèle valide
echo "5. Vérification modèles valides..."
VALID_MODELS="sonnet|haiku|opus"
for agent_file in ${PLUGINS_DIR}/*/agents/*.md; do
  if [ -f "$agent_file" ]; then
    model=$(grep "^model:" "$agent_file" | sed 's/model: //' || true)
    if [ -n "$model" ] && ! echo "$model" | grep -qE "^($VALID_MODELS)$"; then
      log_error "$agent_file: Modèle '$model' invalide (attendu: sonnet, haiku, opus)"
    fi
  fi
done
log_success "Modèles valides vérifiés"
echo ""

# 6. Détecter agents sans workflow
echo "6. Détection agents sans workflow structuré..."
for agent_file in ${PLUGINS_DIR}/*/agents/*.md; do
  if [ -f "$agent_file" ]; then
    if ! grep -qi "workflow" "$agent_file" && ! grep -qi "protocol" "$agent_file" && ! grep -qi "process" "$agent_file"; then
      log_warning "$agent_file: Pas de workflow/protocol/process détecté"
    fi
  fi
done
log_success "Workflows vérifiés"
echo ""

# Résumé
echo "============================================="
echo "  Résumé"
echo "============================================="
if [ "$ISSUES_FOUND" -eq 0 ]; then
  log_success "Aucune erreur critique détectée"
  exit 0
else
  log_error "$ISSUES_FOUND erreurs critiques détectées"
  exit 1
fi
