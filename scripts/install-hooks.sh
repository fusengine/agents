#!/bin/bash
# install-hooks.sh - Installe le loader de hooks dans ~/.claude/settings.json
# IMPORTANT: Ce script FUSIONNE les hooks, il ne les écrase pas
# Usage: ./scripts/install-hooks.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGINS_ROOT="$(dirname "$SCRIPT_DIR")"
SETTINGS_FILE="$HOME/.claude/settings.json"
LOADER_SCRIPT="$SCRIPT_DIR/hooks-loader.sh"

echo "🔍 Détection des hooks dans les plugins..."

# Dossier marketplace fusengine-plugins uniquement
PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"

# Compter les plugins avec hooks
HOOK_COUNT=0
if [[ -d "$PLUGINS_DIR" ]]; then
  for PLUGIN_DIR in "$PLUGINS_DIR"/*/; do
    if [[ -f "$PLUGIN_DIR/hooks/hooks.json" ]]; then
      PLUGIN_NAME=$(basename "$PLUGIN_DIR")
      echo "  ✅ $PLUGIN_NAME"
      ((HOOK_COUNT++))
    fi
  done
else
  echo "⚠️  Marketplace fusengine-plugins non trouvé"
fi

echo ""
echo "📦 $HOOK_COUNT plugins avec hooks détectés"
echo ""

# Créer le dossier ~/.claude si nécessaire
mkdir -p "$HOME/.claude"

# Fonction pour vérifier si un hook loader existe déjà
has_loader_hook() {
  local hook_type="$1"
  local json="$2"
  echo "$json" | jq -e ".hooks.${hook_type}[]?.hooks[]?.command | select(contains(\"hooks-loader.sh\"))" > /dev/null 2>&1
}

# Créer ou mettre à jour settings.json
if [[ -f "$SETTINGS_FILE" ]]; then
  echo "📝 Fusion avec $SETTINGS_FILE existant..."
  echo "   (vos hooks personnalisés seront préservés)"
  echo ""

  # Backup
  cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup.$(date +%Y%m%d_%H%M%S)"

  # Lire le fichier actuel
  CURRENT_JSON=$(cat "$SETTINGS_FILE")

  # Vérifier si les hooks loader sont déjà présents
  LOADER_ALREADY_INSTALLED=false
  if has_loader_hook "UserPromptSubmit" "$CURRENT_JSON" && \
     has_loader_hook "PreToolUse" "$CURRENT_JSON" && \
     has_loader_hook "PostToolUse" "$CURRENT_JSON" && \
     has_loader_hook "SubagentStart" "$CURRENT_JSON"; then
    LOADER_ALREADY_INSTALLED=true
  fi

  if [[ "$LOADER_ALREADY_INSTALLED" == "true" ]]; then
    echo "ℹ️  Le loader est déjà installé. Aucune modification nécessaire."
    exit 0
  fi

  # Fusionner les hooks sans écraser les existants
  # On ajoute le loader UNIQUEMENT s'il n'existe pas déjà pour ce type
  UPDATED_JSON=$(echo "$CURRENT_JSON" | jq --arg loader "$LOADER_SCRIPT" '
    # Fonction pour ajouter un hook loader à un type existant
    def add_loader_if_missing($hook_type; $matcher; $loader_cmd):
      if .hooks[$hook_type] then
        # Vérifier si le loader est déjà présent
        if (.hooks[$hook_type] | any(.hooks[]?.command | contains("hooks-loader.sh"))) then
          .
        else
          # Ajouter le loader aux hooks existants
          .hooks[$hook_type] += [{
            "matcher": $matcher,
            "hooks": [{
              "type": "command",
              "command": $loader_cmd
            }]
          }]
        end
      else
        # Créer la section si elle n existe pas
        .hooks[$hook_type] = [{
          "matcher": $matcher,
          "hooks": [{
            "type": "command",
            "command": $loader_cmd
          }]
        }]
      end;

    # Assurer que .hooks existe
    .hooks //= {} |

    # Ajouter les loaders pour chaque type
    add_loader_if_missing("UserPromptSubmit"; ""; "bash " + $loader + " UserPromptSubmit") |
    add_loader_if_missing("PreToolUse"; "Write|Edit"; "bash " + $loader + " PreToolUse") |
    add_loader_if_missing("PostToolUse"; "Write|Edit"; "bash " + $loader + " PostToolUse") |
    add_loader_if_missing("PostToolUse"; "TaskCreate|TaskUpdate"; "bash " + $loader + " PostToolUse") |
    add_loader_if_missing("SubagentStart"; ""; "bash " + $loader + " SubagentStart")
  ')

  # Écrire le résultat
  echo "$UPDATED_JSON" > "$SETTINGS_FILE"

else
  echo "📝 Création de $SETTINGS_FILE..."

  cat > "$SETTINGS_FILE" << EOF
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash $LOADER_SCRIPT UserPromptSubmit"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash $LOADER_SCRIPT PreToolUse"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash $LOADER_SCRIPT PostToolUse"
          }
        ]
      },
      {
        "matcher": "TaskCreate|TaskUpdate",
        "hooks": [
          {
            "type": "command",
            "command": "bash $LOADER_SCRIPT PostToolUse"
          }
        ]
      }
    ],
    "SubagentStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash $LOADER_SCRIPT SubagentStart"
          }
        ]
      }
    ]
  }
}
EOF
fi

echo ""
echo "✅ Installation terminée!"
echo ""
echo "Hooks loader added (your existing hooks are preserved):"
echo "  - UserPromptSubmit → Detect project + inject APEX"
echo "  - PreToolUse → Block if skill not consulted"
echo "  - PostToolUse (Write|Edit) → Validate SOLID after modification"
echo "  - PostToolUse (TaskCreate|TaskUpdate) → Sync tasks to task.json"
echo "  - SubagentStart → Inject APEX context into sub-agents"
echo ""
echo "📁 Backup créé: $SETTINGS_FILE.backup.*"
echo ""
echo "Redémarrez Claude Code pour appliquer les changements."
