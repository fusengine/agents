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
- **PRD coordination** — asks `Enable PRD multi-agent coordination (FUSE_PRD=1)? [y/N]` (default **No**). `y` writes `FUSE_PRD=1` to `~/.claude/.env`: the harness then enforces one writer per file across sub-agents and cross-checks task PRDs on Stop (`harness prd status|validate|compact`). Inert until the project has an `apex/prd.json` router. Re-running setup never turns an existing `FUSE_PRD=1` off.
- **Sub-agent default model** — asks `Default model for sub-agents without an explicit model (CLAUDE_CODE_SUBAGENT_MODEL)?` with `opus` (recommended, same model as the plugin agents), `sonnet`, `haiku` or `unset`. The choice is written to `~/.claude/settings.json` → `env`, which Claude Code reads for its own process. It only applies to agents that declare no `model:` in their frontmatter (e.g. `general-purpose`); an agent's own `model:` always wins, and the built-in Explore/Plan agents keep inheriting the session model. An existing value is shown with a keep/replace prompt; `unset` removes the key.
- **MCP servers** (interactive selection of 23 servers)

## 4. MCP Server Selection

During setup, you'll see an interactive MCP server selector:

```
◆  Install MCP servers to global scope?
│  ● Yes / ○ No

◆  Select MCP servers to install globally:
│  ◻ sequential-thinking  Dynamic problem-solving with step-by-step reasoning
│  ◻ memory               Knowledge graph-based persistent memory system
│  ◻ filesystem           Secure local file operations with configurable access
│  ◻ context7 [✓]         Up-to-date documentation for any library
│  ◻ exa [⚠ key missing]  Advanced AI-powered web search and research
```

- `[✓]` = API key configured
- `[⚠ key missing]` = requires API key (will still work, just configure key later)

Use arrow keys to navigate, space to select, enter to confirm.

See [MCP Servers Reference](../reference/mcp-servers.md) for full list of 23 available servers.

## 5. Restart Claude Code

```bash
exit
claude
```

## 6. Verify Installation

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
