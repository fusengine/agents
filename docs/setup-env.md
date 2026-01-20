# MCP API Keys Configuration

Plugins use MCP servers that require API keys.
Keys are stored in `~/.claude/.env` and loaded automatically.

## Required Keys

| Variable | Service | Get it |
|----------|---------|--------|
| `CONTEXT7_API_KEY` | Documentation lookup | https://context7.com |
| `EXA_API_KEY` | Web search | https://exa.ai |
| `MAGIC_API_KEY` | UI components | https://21st.dev |

## Shell Configuration

Shell scripts are in `scripts/env-shell/`.

### Zsh (macOS default)

```bash
echo 'source /path/to/scripts/env-shell/claude-env.zsh' >> ~/.zshrc
source ~/.zshrc
```

### Bash

```bash
echo 'source /path/to/scripts/env-shell/claude-env.bash' >> ~/.bashrc
source ~/.bashrc
```

### Fish

```fish
cp scripts/env-shell/claude-env.fish ~/.config/fish/conf.d/
```

### PowerShell

```powershell
# Add to $PROFILE
. C:\path\to\scripts\env-shell\claude-env.ps1
```

## Edit Keys

```bash
nano ~/.claude/.env
```

## Verify

```bash
echo $CONTEXT7_API_KEY
echo $EXA_API_KEY
echo $MAGIC_API_KEY
```

## ~/.claude/.env Structure

```bash
# Claude Code - Global API Keys
export CONTEXT7_API_KEY="ctx7sk-xxx"
export EXA_API_KEY="xxx"
export MAGIC_API_KEY="xxx"
```
