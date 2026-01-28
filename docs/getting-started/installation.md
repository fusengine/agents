# Installation

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

## 3. Configure Environment

Set up API keys for MCP servers (Context7, Exa, Magic):

```bash
bash ~/.claude/plugins/marketplaces/fusengine-plugins/scripts/env-shell/install-env.sh
```

This will:
- Create `~/.claude/.env` from template
- Configure your shell (fish/bash/zsh) to load env vars

**Edit `~/.claude/.env` with your keys:**
```bash
export CONTEXT7_API_KEY="ctx7sk-xxx"
export EXA_API_KEY="xxx"
export MAGIC_API_KEY="xxx"
```

## 4. Install Hooks + CLAUDE.md

```bash
bash ~/.claude/plugins/marketplaces/fusengine-plugins/scripts/install-hooks.sh
```

This installs:
- All hooks (UserPromptSubmit, PreToolUse, PostToolUse, etc.)
- `~/.claude/CLAUDE.md` (global rules)
- `language: "french"` setting
- Statusline

## 5. Restart Claude Code

```bash
# Exit and restart
exit
claude
```

## Verify Installation

```bash
/plugin list  # Shows installed plugins
```
