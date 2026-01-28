# MCP API Keys Configuration

Plugins use MCP servers that require API keys.
Keys are stored in `~/.claude/.env` and loaded via your shell.

## Required Keys

| Variable | Service | Get it |
|----------|---------|--------|
| `CONTEXT7_API_KEY` | Documentation lookup | https://context7.com |
| `EXA_API_KEY` | Web search | https://exa.ai |
| `MAGIC_API_KEY` | UI components | https://21st.dev |

## Setup

### Step 1: Create ~/.claude/.env

```bash
mkdir -p ~/.claude
cat > ~/.claude/.env << 'EOF'
export CONTEXT7_API_KEY="ctx7sk-xxx"
export EXA_API_KEY="xxx"
export MAGIC_API_KEY="xxx"
EOF
```

Replace `xxx` with your actual API keys.

### Step 2: Configure your shell

Run the install script (detects bash/zsh/fish automatically):

```bash
~/.claude/plugins/marketplaces/fusengine-plugins/scripts/env-shell/install-env.sh
```

Or configure manually:

#### Fish

```fish
cp ~/.claude/plugins/marketplaces/fusengine-plugins/scripts/env-shell/claude-env.fish ~/.config/fish/conf.d/
```

#### Zsh

```bash
echo 'if [[ -f ~/.claude/.env ]]; then source ~/.claude/.env; fi' >> ~/.zshrc
```

#### Bash

```bash
echo 'if [[ -f ~/.claude/.env ]]; then source ~/.claude/.env; fi' >> ~/.bashrc
```

#### PowerShell

```powershell
~/.claude/plugins/marketplaces/fusengine-plugins/scripts/env-shell/install-env.ps1
```

### Step 3: Restart terminal & Claude Code

**Important:** You must restart your terminal completely (not just Claude Code) for the variables to be loaded.

```bash
# Open a NEW terminal, then:
claude
```

## Verify

```bash
# In your shell, before launching Claude Code:
env | grep -E "(CONTEXT7|EXA|MAGIC)"
```

All 3 keys should be displayed.

## Troubleshooting

### MCP servers fail with 401/Invalid API key

1. Check variables are in your environment: `env | grep EXA`
2. If not, restart your **terminal** (not just Claude Code)
3. Verify `~/.claude/.env` has correct keys

### Variables show in shell but not in Claude Code

Make sure you opened a **new terminal** after configuring your shell.
Claude Code inherits environment variables from the terminal that launched it.
