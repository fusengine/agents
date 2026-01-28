#!/bin/bash
# install-hooks.sh - Install hooks loader into ~/.claude/settings.json
# IMPORTANT: This script MERGES hooks, it does not overwrite them
# Usage: ./scripts/install-hooks.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGINS_ROOT="$(dirname "$SCRIPT_DIR")"
SETTINGS_FILE="$HOME/.claude/settings.json"
LOADER_SCRIPT="$SCRIPT_DIR/hooks-loader.sh"

echo "🔍 Detecting hooks in plugins..."

# Marketplace fusengine-plugins directory only
PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"

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
else
  echo "⚠️  Marketplace fusengine-plugins not found"
fi

echo ""
echo "📦 $HOOK_COUNT plugins with hooks detected"
echo ""

# Create ~/.claude directory if needed
mkdir -p "$HOME/.claude"

# Function to check if a hook already exists (by searching for a pattern in command)
has_hook() {
  local hook_type="$1"
  local pattern="$2"
  local json="$3"
  echo "$json" | jq -e ".hooks.${hook_type}[]?.hooks[]?.command | select(contains(\"${pattern}\"))" > /dev/null 2>&1
}

# Create or update settings.json
if [[ -f "$SETTINGS_FILE" ]]; then
  echo "📝 Merging with existing $SETTINGS_FILE..."
  echo "   (your custom hooks will be preserved)"
  echo ""

  # Backup
  cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup.$(date +%Y%m%d_%H%M%S)"

  # Read current file
  CURRENT_JSON=$(cat "$SETTINGS_FILE")

  # Check if ALL hooks are already present (loaders + sounds)
  ALL_INSTALLED=false
  if has_hook "UserPromptSubmit" "hooks-loader.sh" "$CURRENT_JSON" && \
     has_hook "PreToolUse" "hooks-loader.sh" "$CURRENT_JSON" && \
     has_hook "PostToolUse" "hooks-loader.sh" "$CURRENT_JSON" && \
     has_hook "SubagentStart" "hooks-loader.sh" "$CURRENT_JSON" && \
     has_hook "Stop" "finish.mp3" "$CURRENT_JSON" && \
     has_hook "Notification" "permission-need.mp3" "$CURRENT_JSON" && \
     has_hook "Notification" "need-human.mp3" "$CURRENT_JSON"; then
    ALL_INSTALLED=true
  fi

  if [[ "$ALL_INSTALLED" == "true" ]]; then
    echo "ℹ️  All hooks already installed. No changes needed."
  else
    # Merge hooks without overwriting existing ones
    # Add loader ONLY if it doesn't exist for this type
    UPDATED_JSON=$(echo "$CURRENT_JSON" | jq --arg loader "$LOADER_SCRIPT" --arg plugins_dir "$PLUGINS_DIR" '
      # Function to add a hook if not already present (checks for pattern in command)
      def add_hook_if_missing($hook_type; $matcher; $cmd; $check_pattern):
        if .hooks[$hook_type] then
          # Check if this specific hook is already present
          if (.hooks[$hook_type] | any(.hooks[]?.command | contains($check_pattern))) then
            .
          else
            # Add hook to existing hooks
            .hooks[$hook_type] += [{
              "matcher": $matcher,
              "hooks": [{
                "type": "command",
                "command": $cmd
              }]
            }]
          end
        else
          # Create section if it does not exist
          .hooks[$hook_type] = [{
            "matcher": $matcher,
            "hooks": [{
              "type": "command",
              "command": $cmd
            }]
          }]
        end;

      # Ensure .hooks exists
      .hooks //= {} |

      # Add loaders for each type (check for hooks-loader.sh)
      add_hook_if_missing("UserPromptSubmit"; ""; "bash " + $loader + " UserPromptSubmit"; "hooks-loader.sh") |
      add_hook_if_missing("PreToolUse"; "Write|Edit"; "bash " + $loader + " PreToolUse"; "hooks-loader.sh") |
      add_hook_if_missing("PostToolUse"; "Write|Edit"; "bash " + $loader + " PostToolUse"; "hooks-loader.sh") |
      add_hook_if_missing("PostToolUse"; "TaskCreate|TaskUpdate"; "bash " + $loader + " PostToolUse"; "hooks-loader.sh") |
      add_hook_if_missing("SubagentStart"; ""; "bash " + $loader + " SubagentStart"; "hooks-loader.sh") |
      # Add sound hooks (check for afplay)
      add_hook_if_missing("Stop"; ""; "afplay " + $plugins_dir + "/core-guards/song/finish.mp3"; "finish.mp3") |
      add_hook_if_missing("Notification"; "permission"; "afplay " + $plugins_dir + "/core-guards/song/permission-need.mp3"; "permission-need.mp3") |
      add_hook_if_missing("Notification"; ""; "afplay " + $plugins_dir + "/core-guards/song/need-human.mp3"; "need-human.mp3")
    ')

    # Write result
    echo "$UPDATED_JSON" > "$SETTINGS_FILE"
  fi

else
  echo "📝 Creating $SETTINGS_FILE..."

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
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "afplay $PLUGINS_DIR/core-guards/song/finish.mp3"
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "permission",
        "hooks": [
          {
            "type": "command",
            "command": "afplay $PLUGINS_DIR/core-guards/song/permission-need.mp3"
          }
        ]
      },
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "afplay $PLUGINS_DIR/core-guards/song/need-human.mp3"
          }
        ]
      }
    ]
  }
}
EOF
fi

# ============================================
# STATUSLINE INSTALLATION
# ============================================

STATUSLINE_DIR="$PLUGINS_DIR/core-guards/statusline"

if [[ -d "$STATUSLINE_DIR" ]]; then
  echo "🖥️  Installing statusline..."

  # Install bun dependencies
  if command -v bun &> /dev/null; then
    cd "$STATUSLINE_DIR"
    bun install --silent 2>/dev/null || true
    cd - > /dev/null

    # Add statusLine to settings.json
    STATUSLINE_CMD="bun $STATUSLINE_DIR/src/index.ts"

    # Check if statusLine already configured
    HAS_STATUSLINE=$(jq -e '.statusLine' "$SETTINGS_FILE" 2>/dev/null && echo "yes" || echo "no")

    if [[ "$HAS_STATUSLINE" == "no" ]]; then
      # Add statusLine configuration
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
    echo "     Install with: curl -fsSL https://bun.sh/install | bash"
  fi
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Hooks loader added (your existing hooks are preserved):"
echo "  - UserPromptSubmit → Detect project + inject APEX"
echo "  - PreToolUse → Block if skill not consulted"
echo "  - PostToolUse (Write|Edit) → Validate SOLID after modification"
echo "  - PostToolUse (TaskCreate|TaskUpdate) → Sync tasks to task.json"
echo "  - SubagentStart → Inject APEX context into sub-agents"
echo ""
if [[ -d "$STATUSLINE_DIR" ]]; then
  echo "Statusline:"
  echo "  - Modular SOLID statusline with segments"
  echo "  - Config: $STATUSLINE_DIR/config.json"
  echo ""
fi
echo "📁 Backup created: $SETTINGS_FILE.backup.*"
echo ""
echo "Restart Claude Code to apply changes."
