# Installation

## Prerequisites

- **Bun** - Install from [bun.sh](https://bun.sh)
- **Claude Code** - Anthropic CLI

## 1. Add Marketplace

```bash
/plugin marketplace add fusengine/agents
```

## 2. Install Plugins

**All plugins:**
```bash
/plugin install fuse-ai-pilot fuse-commit-pro fuse-laravel fuse-nextjs fuse-react fuse-swift-apple-expert fuse-solid fuse-tailwindcss fuse-design fuse-prompt-engineer
```

**Or select specific:**
```bash
/plugin install fuse-ai-pilot fuse-nextjs  # Just AI pilot + Next.js
```

## 3. Run Setup

### macOS / Linux

```bash
~/.claude/plugins/marketplaces/fusengine-plugins/setup.sh
```

### Windows (PowerShell)

```powershell
~\.claude\plugins\marketplaces\fusengine-plugins\setup.ps1
```

This installs:
- **Hooks** (PreToolUse, PostToolUse, etc.) via Bun
- **CLAUDE.md** (global rules)
- **API keys** (interactive prompts if missing)
- **Shell config** (bash/zsh/fish/PowerShell)
- **Statusline**

## 4. Restart Claude Code

```bash
exit
claude
```

## Verify Installation

```bash
/plugin list  # Shows installed plugins
```

## Manual API Keys Configuration

If you skipped API keys during setup, edit `~/.claude/.env`:

```bash
export CONTEXT7_API_KEY="ctx7sk-xxx"
export EXA_API_KEY="xxx"
export MAGIC_API_KEY="xxx"
export GEMINI_DESIGN_API_KEY="xxx"
```

Then re-run setup or restart your terminal.

## Troubleshooting

### Bun not found
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

### Hooks not working
```bash
# Re-run setup
~/.claude/plugins/marketplaces/fusengine-plugins/setup.sh  # or setup.ps1 on Windows
```

### Check settings.json
```bash
cat ~/.claude/settings.json | grep hooks-loader
```
