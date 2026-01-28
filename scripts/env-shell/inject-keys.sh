#!/bin/bash
# Inject API keys from ~/.claude/.env into plugin .mcp.json files
# Run this after installing plugins or updating keys

set -e

ENV_FILE="$HOME/.claude/.env"
PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Claude Code - API Key Injector"
echo "───────────────────────────────"

# Check if .env exists
if [[ ! -f "$ENV_FILE" ]]; then
    echo -e "${RED}Error: $ENV_FILE not found${NC}"
    exit 1
fi

# Load keys from .env
eval "$(grep '^export' "$ENV_FILE")"

echo "Keys loaded from $ENV_FILE"
echo ""

# Check if keys are set
[[ -z "$CONTEXT7_API_KEY" ]] && echo -e "${YELLOW}Warning: CONTEXT7_API_KEY not set${NC}"
[[ -z "$EXA_API_KEY" ]] && echo -e "${YELLOW}Warning: EXA_API_KEY not set${NC}"
[[ -z "$MAGIC_API_KEY" ]] && echo -e "${YELLOW}Warning: MAGIC_API_KEY not set${NC}"

# Find all .mcp.json files
if [[ ! -d "$PLUGINS_DIR" ]]; then
    echo -e "${YELLOW}Plugins not installed yet at $PLUGINS_DIR${NC}"
    echo "Using local dev directory..."
    PLUGINS_DIR="$(dirname "$0")/../../plugins"
fi

echo "Scanning: $PLUGINS_DIR"
echo ""

# Process each .mcp.json file
for mcp_file in "$PLUGINS_DIR"/*/.mcp.json; do
    [[ -f "$mcp_file" ]] || continue

    plugin_name=$(basename "$(dirname "$mcp_file")")
    echo -n "  $plugin_name: "

    # Replace ${VAR} with actual values using sed
    sed -i.bak \
        -e "s|\\\${CONTEXT7_API_KEY}|$CONTEXT7_API_KEY|g" \
        -e "s|\\\${EXA_API_KEY}|$EXA_API_KEY|g" \
        -e "s|\\\${MAGIC_API_KEY}|$MAGIC_API_KEY|g" \
        "$mcp_file"

    # Remove backup file
    rm -f "${mcp_file}.bak"

    echo -e "${GREEN}done${NC}"
done

echo ""
echo -e "${GREEN}Keys injected successfully!${NC}"
echo ""
echo "Restart Claude Code to apply changes."
