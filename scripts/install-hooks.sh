#!/bin/bash
# install-hooks.sh - Installe le loader de hooks dans ~/.claude/settings.json
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

# Créer ou mettre à jour settings.json
if [[ -f "$SETTINGS_FILE" ]]; then
  echo "📝 Mise à jour de $SETTINGS_FILE..."

  # Backup
  cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup"

  # Ajouter les hooks si pas déjà présents
  EXISTING=$(jq '.hooks // {}' "$SETTINGS_FILE")

  # Créer la nouvelle config avec le loader
  jq --arg loader "$LOADER_SCRIPT" '.hooks = {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": ("bash " + $loader + " UserPromptSubmit")
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
            "command": ("bash " + $loader + " PreToolUse")
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
            "command": ("bash " + $loader + " PostToolUse")
          }
        ]
      }
    ]
  }' "$SETTINGS_FILE" > "$SETTINGS_FILE.tmp" && mv "$SETTINGS_FILE.tmp" "$SETTINGS_FILE"

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
      }
    ]
  }
}
EOF
fi

echo ""
echo "✅ Installation terminée!"
echo ""
echo "Les hooks suivants sont maintenant actifs:"
echo "  - UserPromptSubmit → Détecte projet + injecte APEX"
echo "  - PreToolUse → Bloque si skill non consulté"
echo "  - PostToolUse → Valide SOLID après modification"
echo ""
echo "Redémarrez Claude Code pour appliquer les changements."
