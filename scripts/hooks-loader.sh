#!/bin/bash
# hooks-loader.sh - Détecteur et chargeur de hooks pour tous les plugins
# Ce script est appelé par ~/.claude/settings.json et charge dynamiquement
# tous les hooks des plugins installés

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
HOOK_TYPE="${1:-PreToolUse}"  # PreToolUse, PostToolUse, UserPromptSubmit, SubagentStart

# Dossier marketplace fusengine-plugins uniquement
PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"

# Lire l'input une seule fois
INPUT=$(cat)

# Scanner le marketplace
[[ ! -d "$PLUGINS_DIR" ]] && exit 0

for PLUGIN_DIR in "$PLUGINS_DIR"/*/; do
  PLUGIN_NAME=$(basename "$PLUGIN_DIR")
  HOOKS_FILE="$PLUGIN_DIR/hooks/hooks.json"

  if [[ -f "$HOOKS_FILE" ]]; then
    # Extraire les hooks du type demandé
    HOOKS=$(jq -r ".hooks.${HOOK_TYPE}[]? // empty" "$HOOKS_FILE" 2>/dev/null)

    if [[ -n "$HOOKS" ]]; then
      # Pour chaque hook de ce type
      echo "$HOOKS" | jq -c '.' 2>/dev/null | while read -r HOOK; do
        MATCHER=$(echo "$HOOK" | jq -r '.matcher // ""')
        COMMAND=$(echo "$HOOK" | jq -r '.hooks[0].command // empty')

        # Remplacer ${CLAUDE_PLUGIN_ROOT} par le chemin du plugin
        COMMAND="${COMMAND//\$\{CLAUDE_PLUGIN_ROOT\}/$PLUGIN_DIR}"

        # Vérifier le matcher si présent
        if [[ -n "$MATCHER" ]]; then
          # Pour Notification: matcher sur type, pour autres: matcher sur tool_name
          if [[ "$HOOK_TYPE" == "Notification" ]]; then
            NOTIF_TYPE=$(echo "$INPUT" | jq -r '.type // .notification_type // empty')
            if [[ ! "$NOTIF_TYPE" =~ $MATCHER ]]; then
              continue
            fi
          else
            TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
            if [[ ! "$TOOL_NAME" =~ $MATCHER ]]; then
              continue
            fi
          fi
        fi

        # Exécuter le hook
        if [[ -n "$COMMAND" ]]; then
          # Pour Stop/Notification avec afplay: pas besoin de stdin
          if [[ "$COMMAND" =~ ^afplay ]]; then
            bash -c "$COMMAND" 2>&1 &
          else
            echo "$INPUT" | bash -c "$COMMAND" 2>&1
          fi
        fi
      done
    fi
  fi
done

exit 0
