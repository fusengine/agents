#!/bin/bash
# install-hooks.sh - Install hooks loader into ~/.claude/settings.json
# hooks-loader.sh handles ALL hook logic dynamically from plugins
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SETTINGS_FILE="$HOME/.claude/settings.json"
MARKETPLACE_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins"
PLUGINS_DIR="$MARKETPLACE_DIR/plugins"
LOADER_SCRIPT="$MARKETPLACE_DIR/scripts/hooks-loader.sh"

# Copy hooks-loader.sh to marketplace if not already there
mkdir -p "$MARKETPLACE_DIR/scripts"
cp "$SCRIPT_DIR/hooks-loader.sh" "$LOADER_SCRIPT"

echo "🔍 Detecting hooks in plugins..."

# Count plugins with hooks
HOOK_COUNT=0
if [[ -d "$PLUGINS_DIR" ]]; then
  for PLUGIN_DIR in "$PLUGINS_DIR"/*/; do
    if [[ -f "$PLUGIN_DIR/hooks/hooks.json" ]]; then
      PLUGIN_NAME=$(basename "$PLUGIN_DIR")
      echo "  ✅ $PLUGIN_NAME"
      ((HOOK_COUNT++))
    fi
  done
fi

echo ""
echo "📦 $HOOK_COUNT plugins with hooks detected"
echo ""

mkdir -p "$HOME/.claude"

# Backup existing
if [[ -f "$SETTINGS_FILE" ]]; then
  cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Read existing settings or create empty
if [[ -f "$SETTINGS_FILE" ]]; then
  CURRENT_JSON=$(cat "$SETTINGS_FILE")
else
  CURRENT_JSON='{}'
fi

echo "📝 Configuring hooks loader..."

# Update settings with loader-only hooks
UPDATED_JSON=$(echo "$CURRENT_JSON" | jq --arg loader "$LOADER_SCRIPT" '
  # Define all hook types that should use the loader
  .hooks = {
    "UserPromptSubmit": [{"matcher": "", "hooks": [{"type": "command", "command": "bash \($loader) UserPromptSubmit"}]}],
    "PreToolUse": [{"matcher": "", "hooks": [{"type": "command", "command": "bash \($loader) PreToolUse"}]}],
    "PostToolUse": [{"matcher": "", "hooks": [{"type": "command", "command": "bash \($loader) PostToolUse"}]}],
    "PermissionRequest": [{"matcher": "", "hooks": [{"type": "command", "command": "bash \($loader) PermissionRequest"}]}],
    "SubagentStart": [{"matcher": "", "hooks": [{"type": "command", "command": "bash \($loader) SubagentStart"}]}],
    "SubagentStop": [{"matcher": "", "hooks": [{"type": "command", "command": "bash \($loader) SubagentStop"}]}],
    "SessionStart": [{"matcher": "", "hooks": [{"type": "command", "command": "bash \($loader) SessionStart"}]}],
    "Stop": [{"matcher": "", "hooks": [{"type": "command", "command": "bash \($loader) Stop"}]}],
    "Notification": [{"matcher": "", "hooks": [{"type": "command", "command": "bash \($loader) Notification"}]}]
  }
')

echo "$UPDATED_JSON" > "$SETTINGS_FILE"

# ============================================
# STATUSLINE INSTALLATION
# ============================================

STATUSLINE_DIR="$PLUGINS_DIR/core-guards/statusline"

if [[ -d "$STATUSLINE_DIR" ]]; then
  echo "🖥️  Installing statusline..."

  if command -v bun &> /dev/null; then
    cd "$STATUSLINE_DIR"
    bun install --silent 2>/dev/null || true
    cd - > /dev/null

    STATUSLINE_CMD="bun $STATUSLINE_DIR/src/index.ts"

    # Check if statusLine already exists (redirect jq output to avoid capturing "false")
    if ! jq -e '.statusLine | type == "object"' "$SETTINGS_FILE" >/dev/null 2>&1; then
      UPDATED_JSON=$(cat "$SETTINGS_FILE" | jq --arg cmd "$STATUSLINE_CMD" '.statusLine = {
        "type": "command",
        "command": $cmd,
        "padding": 0
      }')
      echo "$UPDATED_JSON" > "$SETTINGS_FILE"
      echo "  ✅ Statusline configured"
    else
      echo "  ℹ️  Statusline already configured"
    fi
  else
    echo "  ⚠️  bun not found - statusline not installed"
  fi
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "All hooks loaded dynamically by hooks-loader.sh:"
echo "  - UserPromptSubmit, PreToolUse, PostToolUse"
echo "  - SubagentStart, SubagentStop, SessionStart"
echo "  - Stop, Notification (sounds)"
echo ""
echo "📁 Backup: $SETTINGS_FILE.backup.*"
echo ""
echo "Restart Claude Code to apply changes."
