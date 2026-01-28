# MCP API Keys Configuration

Plugins use MCP servers that require API keys.

## Quick Setup (Recommended)

**After installing plugins, run:**

```bash
# Inject your API keys into plugin configurations
~/.claude/plugins/marketplaces/fusengine-plugins/scripts/env-shell/inject-keys.sh

# Restart Claude Code
```

This script reads keys from `~/.claude/.env` and injects them into all plugin `.mcp.json` files.

## Required Keys

| Variable | Service | Get it |
|----------|---------|--------|
| `CONTEXT7_API_KEY` | Documentation lookup | https://context7.com |
| `EXA_API_KEY` | Web search | https://exa.ai |
| `MAGIC_API_KEY` | UI components | https://21st.dev |

## Step 1: Create ~/.claude/.env

```bash
mkdir -p ~/.claude
cat > ~/.claude/.env << 'EOF'
# Claude Code - Global API Keys
export CONTEXT7_API_KEY="ctx7sk-xxx"
export EXA_API_KEY="xxx"
export MAGIC_API_KEY="xxx"
EOF
```

Replace `xxx` with your actual API keys.

## Step 2: Inject Keys

```bash
# Run after plugin installation or key updates
~/.claude/plugins/marketplaces/fusengine-plugins/scripts/env-shell/inject-keys.sh
```

**Important:** Run this script every time you:
- Install or update plugins
- Change your API keys

## Step 3: Restart Claude Code

```bash
# Exit current session and restart
claude
```

## Available Scripts

| Script | Purpose |
|--------|---------|
| `inject-keys.sh` | **Main script** - Injects keys into plugin configs |
| `install-env.sh` | Auto-install shell config (bash/zsh/fish) |
| `install-env.ps1` | Auto-install for PowerShell (Windows) |

## Manual Shell Configuration (Optional)

If you prefer environment variables in your shell:

### Auto-Install (All Shells)

```bash
# Detects your shell and installs automatically
./scripts/env-shell/install-env.sh
```

### Zsh

```bash
echo 'if [[ -f ~/.claude/.env ]]; then source ~/.claude/.env; fi' >> ~/.zshrc
```

### Bash

```bash
echo 'if [[ -f ~/.claude/.env ]]; then source ~/.claude/.env; fi' >> ~/.bashrc
```

### Fish

```fish
cp scripts/env-shell/claude-env.fish ~/.config/fish/conf.d/
```

### PowerShell

```powershell
.\scripts\env-shell\install-env.ps1
```

## Verify Keys

```bash
# Check .env file
cat ~/.claude/.env | grep -E "^export"

# After inject-keys.sh, check a plugin config
cat ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/ai-pilot/.mcp.json | grep -o "exaApiKey=[^&]*" | head -1
```

## Troubleshooting

### MCP servers fail with 401/Invalid API key

1. Verify your keys are in `~/.claude/.env`
2. Run `inject-keys.sh` again
3. Restart Claude Code

### Keys not working after plugin update

Run `inject-keys.sh` again - plugin updates overwrite the configs.

### Environment variables not inherited

Claude Code may not inherit shell variables. Use `inject-keys.sh` instead.
