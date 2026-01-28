#!/bin/bash
# Claude Code - Auto-detect shell and install environment loader
# Supports: macOS, Linux, Windows (WSL/Git Bash)
# For native Windows PowerShell, run: install-env.ps1

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$HOME/.claude/.env"
ENV_EXAMPLE="$PROJECT_ROOT/.env.example"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Claude Code - Environment Installer${NC}"
echo "────────────────────────────────────"

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Darwin*) echo "macos" ;;
        Linux*)
            if grep -qi microsoft /proc/version 2>/dev/null; then
                echo "wsl"
            else
                echo "linux"
            fi
            ;;
        MINGW*|MSYS*|CYGWIN*) echo "windows-bash" ;;
        *) echo "unknown" ;;
    esac
}

# Detect user's default shell
detect_user_shell() {
    local os="$1"

    case "$os" in
        macos)
            dscl . -read "/Users/$USER" UserShell 2>/dev/null | awk '{print $2}' | xargs basename
            ;;
        linux|wsl)
            getent passwd "$USER" 2>/dev/null | cut -d: -f7 | xargs basename || echo "bash"
            ;;
        windows-bash)
            echo "bash"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# Install for zsh/bash
install_posix_shell() {
    local shell="$1"
    local rc_file="$2"
    local source_line="# Claude Code - Load API keys
if [[ -f ~/.claude/.env ]]; then
    source ~/.claude/.env
fi"

    # Create file if not exists
    touch "$rc_file" 2>/dev/null || true

    if grep -q "claude/.env" "$rc_file" 2>/dev/null; then
        echo -e "  ${YELLOW}$shell: Already installed${NC}"
        return 0
    fi

    echo "" >> "$rc_file"
    echo "$source_line" >> "$rc_file"
    echo -e "  ${GREEN}$shell: Installed ($rc_file)${NC}"
}

# Install for fish
install_fish() {
    local conf_dir="$HOME/.config/fish/conf.d"
    local conf_file="$conf_dir/claude-env.fish"

    mkdir -p "$conf_dir"

    if [[ -f "$conf_file" ]]; then
        echo -e "  ${YELLOW}fish: Already installed${NC}"
        return 0
    fi

    cp "$SCRIPT_DIR/claude-env.fish" "$conf_file"
    echo -e "  ${GREEN}fish: Installed ($conf_file)${NC}"
}

# Install for PowerShell (Windows/cross-platform)
install_powershell() {
    local profile_dir=""
    local profile_file=""

    # Detect PowerShell profile location
    if [[ -n "$USERPROFILE" ]]; then
        # Windows
        profile_dir="$USERPROFILE/Documents/PowerShell"
        profile_file="$profile_dir/Microsoft.PowerShell_profile.ps1"
    else
        # macOS/Linux PowerShell Core
        profile_dir="$HOME/.config/powershell"
        profile_file="$profile_dir/Microsoft.PowerShell_profile.ps1"
    fi

    mkdir -p "$profile_dir" 2>/dev/null || true

    if [[ -f "$profile_file" ]] && grep -q "claude" "$profile_file" 2>/dev/null; then
        echo -e "  ${YELLOW}powershell: Already installed${NC}"
        return 0
    fi

    # Append PowerShell loader
    cat >> "$profile_file" << 'PWSH'

# Claude Code - Load API keys
$envFile = "$HOME/.claude/.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^export\s+(\w+)=["\x27]?([^"\x27]*)["\x27]?$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}
PWSH
    echo -e "  ${GREEN}powershell: Installed ($profile_file)${NC}"
}

# Main
echo ""
OS=$(detect_os)
USER_SHELL=$(detect_user_shell "$OS")

echo -e "OS detected:          ${BLUE}$OS${NC}"
echo -e "User's default shell: ${BLUE}$USER_SHELL${NC}"
echo ""

# Create .env from .env.example if not exists
if [[ ! -f "$ENV_FILE" ]]; then
    echo -e "${YELLOW}$ENV_FILE does not exist${NC}"

    if [[ -f "$ENV_EXAMPLE" ]]; then
        mkdir -p "$(dirname "$ENV_FILE")"
        # Copy and convert VAR=value to export VAR=value
        sed 's/^[[:space:]]*\([A-Z_][A-Z0-9_]*\)=/export \1=/g' "$ENV_EXAMPLE" > "$ENV_FILE"
        echo -e "${GREEN}Created $ENV_FILE from .env.example${NC}"
        echo -e "${YELLOW}Edit it with your API keys!${NC}"
    else
        echo -e "${RED}.env.example not found at $ENV_EXAMPLE${NC}"
        echo ""
        echo "Create manually:"
        echo "  mkdir -p ~/.claude"
        echo "  cat > ~/.claude/.env << 'EOF'"
        echo "  export CONTEXT7_API_KEY=\"ctx7sk-xxx\""
        echo "  export EXA_API_KEY=\"xxx\""
        echo "  export MAGIC_API_KEY=\"xxx\""
        echo "  EOF"
    fi
    echo ""
else
    echo -e "${GREEN}$ENV_FILE exists${NC}"
    echo ""
fi

# Install ONLY for user's default shell
echo "Installing for default shell ($USER_SHELL)..."
case "$USER_SHELL" in
    bash)
        install_posix_shell "bash" "$HOME/.bashrc"
        ;;
    zsh)
        install_posix_shell "zsh" "$HOME/.zshrc"
        ;;
    fish)
        install_fish
        ;;
    pwsh|powershell)
        install_powershell
        ;;
    *)
        echo -e "  ${RED}Unknown shell: $USER_SHELL${NC}"
        echo -e "  ${YELLOW}Falling back to bash${NC}"
        install_posix_shell "bash" "$HOME/.bashrc"
        ;;
esac


echo ""
echo -e "${GREEN}Done!${NC}"
echo ""
echo "Shell configured:"
case "$USER_SHELL" in
    bash) echo "  - bash (~/.bashrc)" ;;
    zsh) echo "  - zsh (~/.zshrc)" ;;
    fish) echo "  - fish (~/.config/fish/conf.d/claude-env.fish)" ;;
    pwsh|powershell) echo "  - powershell" ;;
esac
echo ""
echo "Next steps:"
echo "  1. Ensure ~/.claude/.env exists with your API keys"
echo "  2. Restart your terminal or Claude Code"
